"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ArticleStatus, type RoleName } from "@/generated/prisma/client";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import { slugify } from "@/lib/slugify";
import {
  articleCreateSchema,
  articleStatusSchema,
  articleUpdateSchema,
} from "@/features/articles/validators";

type ArticleActionState = {
  ok: boolean;
  message: string;
};

function estimateReadingMinutes(content: string) {
  const wordCount = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;

  return Math.max(1, Math.ceil(wordCount / 220));
}

async function getEditableArticle(
  articleId: string,
  userId: string,
  role: RoleName,
) {
  const prisma = getPrismaClient();
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      authorId: true,
      status: true,
    },
  });

  if (!article) {
    return null;
  }

  const canUpdateAny = hasPermission(role, "article:update:any");
  const canUpdateOwn =
    hasPermission(role, "article:update:own") && article.authorId === userId;

  if (!canUpdateAny && !canUpdateOwn) {
    return null;
  }

  return article;
}

export async function createArticle(
  _previousState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const session = await getCurrentSession();

  if (!session?.user || !hasPermission(session.user.role, "article:create")) {
    return {
      ok: false,
      message: "No tienes permisos para crear noticias.",
    };
  }

  const parsed = articleCreateSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || undefined,
    contentHtml: formData.get("contentHtml"),
    categoryId: formData.get("categoryId"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    keywords: formData.get("keywords") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos obligatorios y la longitud del contenido.",
    };
  }

  const input = parsed.data;
  const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const contentHtml = sanitizeArticleHtml(input.contentHtml);
  const prisma = getPrismaClient();

  await prisma.article.create({
    data: {
      title: input.title,
      subtitle: input.subtitle,
      slug,
      summary: input.summary,
      contentHtml,
      status: ArticleStatus.DRAFT,
      readingMinutes: estimateReadingMinutes(contentHtml),
      authorId: session.user.id,
      categoryId: input.categoryId,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      keywords: input.keywords
        ? input.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [],
    },
  });

  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function updateArticle(
  _previousState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  const session = await getCurrentSession();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debes iniciar sesion.",
    };
  }

  const parsed = articleUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || undefined,
    contentHtml: formData.get("contentHtml"),
    categoryId: formData.get("categoryId"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    keywords: formData.get("keywords") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos obligatorios y la longitud del contenido.",
    };
  }

  const input = parsed.data;
  const article = await getEditableArticle(
    input.id,
    session.user.id,
    session.user.role,
  );

  if (!article || article.status === ArticleStatus.ARCHIVED) {
    return {
      ok: false,
      message: "No tienes permisos para editar esta noticia.",
    };
  }

  const prisma = getPrismaClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const contentHtml = sanitizeArticleHtml(input.contentHtml);

  await prisma.article.update({
    where: { id: input.id },
    data: {
      title: input.title,
      subtitle: input.subtitle,
      slug,
      summary: input.summary,
      contentHtml,
      readingMinutes: estimateReadingMinutes(contentHtml),
      categoryId: input.categoryId,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      keywords: input.keywords
        ? input.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [],
    },
  });

  revalidatePath("/admin/noticias");
  revalidatePath(`/admin/noticias/${input.id}/editar`);

  return {
    ok: true,
    message: "Noticia actualizada.",
  };
}

export async function submitArticleForReview(formData: FormData) {
  const session = await getCurrentSession();
  const parsed = articleStatusSchema.safeParse({ id: formData.get("id") });

  if (!session?.user || !parsed.success) {
    redirect("/admin/login");
  }

  const article = await getEditableArticle(
    parsed.data.id,
    session.user.id,
    session.user.role,
  );

  if (!article || !hasPermission(session.user.role, "article:submit-review")) {
    redirect("/admin/noticias");
  }

  const prisma = getPrismaClient();
  await prisma.article.update({
    where: { id: parsed.data.id },
    data: { status: ArticleStatus.REVIEW },
  });

  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function publishArticle(formData: FormData) {
  const session = await getCurrentSession();
  const parsed = articleStatusSchema.safeParse({ id: formData.get("id") });

  if (!session?.user || !parsed.success) {
    redirect("/admin/login");
  }

  if (!hasPermission(session.user.role, "article:publish")) {
    redirect("/admin/noticias");
  }

  const prisma = getPrismaClient();
  await prisma.article.update({
    where: { id: parsed.data.id },
    data: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
      scheduledAt: null,
      archivedAt: null,
    },
  });

  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function scheduleArticle(formData: FormData) {
  const session = await getCurrentSession();
  const parsed = articleStatusSchema.safeParse({
    id: formData.get("id"),
    scheduledAt: formData.get("scheduledAt") || undefined,
  });

  if (!session?.user || !parsed.success) {
    redirect("/admin/login");
  }

  if (!hasPermission(session.user.role, "article:schedule")) {
    redirect("/admin/noticias");
  }

  const scheduledAt = parsed.data.scheduledAt
    ? new Date(parsed.data.scheduledAt)
    : null;

  if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) {
    redirect(`/admin/noticias/${parsed.data.id}/editar`);
  }

  const prisma = getPrismaClient();
  await prisma.article.update({
    where: { id: parsed.data.id },
    data: {
      status: ArticleStatus.SCHEDULED,
      scheduledAt,
      publishedAt: null,
      archivedAt: null,
    },
  });

  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function archiveArticle(formData: FormData) {
  const session = await getCurrentSession();
  const parsed = articleStatusSchema.safeParse({ id: formData.get("id") });

  if (!session?.user || !parsed.success) {
    redirect("/admin/login");
  }

  const article = await getEditableArticle(
    parsed.data.id,
    session.user.id,
    session.user.role,
  );

  if (!article || !hasPermission(session.user.role, "article:archive")) {
    redirect("/admin/noticias");
  }

  const prisma = getPrismaClient();
  await prisma.article.update({
    where: { id: parsed.data.id },
    data: {
      status: ArticleStatus.ARCHIVED,
      archivedAt: new Date(),
    },
  });

  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}
