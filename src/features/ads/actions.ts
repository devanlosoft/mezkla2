"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import { advertisementSaveSchema } from "@/features/ads/validators";

type AdActionState = {
  ok: boolean;
  message: string;
};

function parseDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createAdvertisement(
  _previousState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const session = await getCurrentSession();

  if (!hasPermission(session?.user?.role, "ad:manage")) {
    return {
      ok: false,
      message: "No tienes permisos para gestionar publicidad.",
    };
  }

  const parsed = advertisementSaveSchema.safeParse({
    name: formData.get("name"),
    placement: formData.get("placement"),
    imageUrl: formData.get("imageUrl") || undefined,
    targetUrl: formData.get("targetUrl") || undefined,
    html: formData.get("html") || undefined,
    sponsorName: formData.get("sponsorName") || undefined,
    isActive: formData.get("isActive") === "on",
    startsAt: formData.get("startsAt") || undefined,
    endsAt: formData.get("endsAt") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa nombre, ubicacion, URLs y fechas.",
    };
  }

  const input = parsed.data;
  const prisma = getPrismaClient();

  await prisma.advertisement.create({
    data: {
      name: input.name,
      placement: input.placement,
      imageUrl: input.imageUrl,
      targetUrl: input.targetUrl,
      html: input.html ? sanitizeArticleHtml(input.html) : undefined,
      sponsorName: input.sponsorName,
      isActive: input.isActive,
      startsAt: parseDate(input.startsAt),
      endsAt: parseDate(input.endsAt),
    },
  });

  revalidatePath("/admin/publicidad");
  revalidatePath("/");

  return {
    ok: true,
    message: "Anuncio creado.",
  };
}

export async function toggleAdvertisementStatus(formData: FormData) {
  const session = await getCurrentSession();

  if (!hasPermission(session?.user?.role, "ad:manage")) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";

  if (!id) {
    redirect("/admin/publicidad");
  }

  const prisma = getPrismaClient();
  await prisma.advertisement.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/publicidad");
  revalidatePath("/");
  redirect("/admin/publicidad");
}
