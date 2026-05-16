import type { ArticleStatus } from "@/generated/prisma/client";

export const articleStatusLabels: Record<ArticleStatus, string> = {
  DRAFT: "Borrador",
  REVIEW: "En revision",
  PUBLISHED: "Publicada",
  SCHEDULED: "Programada",
  ARCHIVED: "Archivada",
};
