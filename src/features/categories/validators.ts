import { z } from "zod";

export const categorySaveSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().min(3).max(80),
  slug: z.string().trim().max(100).optional(),
  description: z.string().trim().max(500).optional(),
  color: z.string().trim().max(32).optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(260).optional(),
  isActive: z.boolean(),
});
