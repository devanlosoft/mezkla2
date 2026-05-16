"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { RoleName } from "@/generated/prisma/client";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { categorySaveSchema } from "@/features/categories/validators";

type CategoryActionState = {
  ok: boolean;
  message: string;
};

function requireCategoryPermission(role: RoleName | undefined) {
  return hasPermission(role, "category:manage");
}

export async function saveCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await getCurrentSession();

  if (!requireCategoryPermission(session?.user?.role)) {
    return {
      ok: false,
      message: "No tienes permisos para gestionar categorias.",
    };
  }

  const parsed = categorySaveSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa nombre, slug y campos SEO.",
    };
  }

  const input = parsed.data;
  const prisma = getPrismaClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);

  try {
    if (input.id) {
      await prisma.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug,
          description: input.description,
          color: input.color,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
          isActive: input.isActive,
        },
      });
    } else {
      await prisma.category.create({
        data: {
          name: input.name,
          slug,
          description: input.description,
          color: input.color,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
          isActive: input.isActive,
        },
      });
    }
  } catch {
    return {
      ok: false,
      message: "No se pudo guardar. Verifica que el slug no este duplicado.",
    };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");

  return {
    ok: true,
    message: input.id ? "Categoria actualizada." : "Categoria creada.",
  };
}

export async function toggleCategoryStatus(formData: FormData) {
  const session = await getCurrentSession();

  if (!requireCategoryPermission(session?.user?.role)) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";

  if (!id) {
    redirect("/admin/categorias");
  }

  const prisma = getPrismaClient();
  await prisma.category.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  redirect("/admin/categorias");
}
