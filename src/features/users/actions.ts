"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { RoleName } from "@/generated/prisma/client";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import {
  userCreateSchema,
  userPasswordSchema,
  userUpdateSchema,
} from "@/features/users/validators";

type UserActionState = {
  ok: boolean;
  message: string;
};

function needsAuthorProfile(roleName: RoleName) {
  return ["ADMIN", "EDITOR", "JOURNALIST", "CONTRIBUTOR"].includes(roleName);
}

async function ensureUserPermission() {
  const session = await getCurrentSession();

  if (!hasPermission(session?.user?.role, "user:manage")) {
    return null;
  }

  return session;
}

export async function createUser(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await ensureUserPermission();

  if (!session) {
    return {
      ok: false,
      message: "No tienes permisos para gestionar usuarios.",
    };
  }

  const parsed = userCreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    roleName: formData.get("roleName"),
    status: formData.get("status"),
    password: formData.get("password"),
    authorTitle: formData.get("authorTitle") || undefined,
    bio: formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa nombre, correo, rol, estado y contrasena.",
    };
  }

  const input = parsed.data;
  const prisma = getPrismaClient();
  const role = await prisma.role.findUnique({
    where: { name: input.roleName },
  });

  if (!role) {
    return {
      ok: false,
      message: "El rol seleccionado no existe. Ejecuta el seed inicial.",
    };
  }

  const passwordHash = await hash(input.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        roleId: role.id,
        status: input.status,
        passwordHash,
      },
    });

    if (needsAuthorProfile(input.roleName)) {
      await prisma.authorProfile.create({
        data: {
          userId: user.id,
          slug: `${slugify(input.name)}-${user.id.slice(-6)}`,
          title: input.authorTitle,
          bio: input.bio,
        },
      });
    }
  } catch {
    return {
      ok: false,
      message: "No se pudo crear el usuario. Verifica que el correo no exista.",
    };
  }

  revalidatePath("/admin/usuarios");

  return {
    ok: true,
    message: "Usuario creado.",
  };
}

export async function updateUser(formData: FormData) {
  const session = await ensureUserPermission();

  if (!session) {
    redirect("/admin/login");
  }

  const parsed = userUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    roleName: formData.get("roleName"),
    status: formData.get("status"),
    authorTitle: formData.get("authorTitle") || undefined,
    bio: formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    redirect("/admin/usuarios");
  }

  const input = parsed.data;
  const prisma = getPrismaClient();
  const role = await prisma.role.findUnique({
    where: { name: input.roleName },
  });

  if (!role) {
    redirect("/admin/usuarios");
  }

  await prisma.user.update({
    where: { id: input.id },
    data: {
      name: input.name,
      roleId: role.id,
      status: input.status,
    },
  });

  if (needsAuthorProfile(input.roleName)) {
    await prisma.authorProfile.upsert({
      where: { userId: input.id },
      update: {
        title: input.authorTitle,
        bio: input.bio,
      },
      create: {
        userId: input.id,
        slug: `${slugify(input.name)}-${input.id.slice(-6)}`,
        title: input.authorTitle,
        bio: input.bio,
      },
    });
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function resetUserPassword(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await ensureUserPermission();

  if (!session) {
    return {
      ok: false,
      message: "No tienes permisos para gestionar usuarios.",
    };
  }

  const parsed = userPasswordSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "La nueva contrasena debe tener al menos 12 caracteres.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const prisma = getPrismaClient();

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: { passwordHash },
  });

  revalidatePath("/admin/usuarios");

  return {
    ok: true,
    message: "Contrasena actualizada.",
  };
}
