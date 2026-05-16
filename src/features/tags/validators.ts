import { z } from "zod";

export const tagSaveSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(300).optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(260).optional(),
});
