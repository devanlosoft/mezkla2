"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";
import { siteSettingsSchema } from "@/features/settings/validators";

type SettingsActionState = {
  ok: boolean;
  message: string;
};

export async function saveSiteSettings(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await getCurrentSession();

  if (!hasPermission(session?.user?.role, "settings:manage")) {
    return {
      ok: false,
      message: "No tienes permisos para editar configuracion.",
    };
  }

  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    siteUrl: formData.get("siteUrl") || undefined,
    description: formData.get("description") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    defaultOgImage: formData.get("defaultOgImage") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    facebookUrl: formData.get("facebookUrl") || undefined,
    xUrl: formData.get("xUrl") || undefined,
    instagramUrl: formData.get("instagramUrl") || undefined,
    youtubeUrl: formData.get("youtubeUrl") || undefined,
    adsEnabled: formData.get("adsEnabled") === "on",
    commentsEnabled: formData.get("commentsEnabled") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa URLs, correo y campos obligatorios.",
    };
  }

  const prisma = getPrismaClient();
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: {
      id: "default",
      ...parsed.data,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/configuracion");

  return {
    ok: true,
    message: "Configuracion actualizada.",
  };
}
