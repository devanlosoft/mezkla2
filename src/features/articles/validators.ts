import { z } from "zod";

export const articleCreateSchema = z.object({
  title: z.string().trim().min(8).max(180),
  subtitle: z.string().trim().max(260).optional(),
  slug: z.string().trim().max(220).optional(),
  summary: z.string().trim().max(500).optional(),
  contentHtml: z.string().trim().min(40),
  categoryId: z.string().trim().min(1),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(260).optional(),
  keywords: z.string().trim().max(300).optional(),
});

export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;

export const articleUpdateSchema = articleCreateSchema.extend({
  id: z.string().trim().min(1),
});

export const articleStatusSchema = z.object({
  id: z.string().trim().min(1),
  scheduledAt: z.string().trim().optional(),
});
