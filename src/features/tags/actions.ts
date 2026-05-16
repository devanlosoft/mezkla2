"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { tagSaveSchema } from "@/features/tags/validators";

type TagActionState = {
  ok: boolean;
  message: string;
};

export async function saveTag(
  _previousState: TagActionState,
  formData: FormData,
): Promise<TagActionState> {
  const session = await getCurrentSession();

  if (!hasPermission(session?.user?.role, "tag:manage")) {
    return {
      ok: false,
      message: "No tienes permisos para gestionar etiquetas.",
    };
  }

  const parsed = tagSaveSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
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
      await prisma.tag.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug,
          description: input.description,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
        },
      });
    } else {
      await prisma.tag.create({
        data: {
          name: input.name,
          slug,
          description: input.description,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
        },
      });
    }
  } catch {
    return {
      ok: false,
      message: "No se pudo guardar. Verifica que el slug no este duplicado.",
    };
  }

  revalidatePath("/admin/etiquetas");

  return {
    ok: true,
    message: input.id ? "Etiqueta actualizada." : "Etiqueta creada.",
  };
}

export async function deleteTag(formData: FormData) {
  const session = await getCurrentSession();

  if (!hasPermission(session?.user?.role, "tag:manage")) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/etiquetas");
  }

  const prisma = getPrismaClient();
  await prisma.tag.delete({
    where: { id },
  });

  revalidatePath("/admin/etiquetas");
  redirect("/admin/etiquetas");
}
