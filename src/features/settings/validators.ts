import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2).max(80),
  siteUrl: z.string().trim().url().max(300).optional(),
  description: z.string().trim().max(500).optional(),
  logoUrl: z.string().trim().url().max(500).optional(),
  defaultOgImage: z.string().trim().url().max(500).optional(),
  contactEmail: z.string().trim().email().max(160).optional(),
  facebookUrl: z.string().trim().url().max(300).optional(),
  xUrl: z.string().trim().url().max(300).optional(),
  instagramUrl: z.string().trim().url().max(300).optional(),
  youtubeUrl: z.string().trim().url().max(300).optional(),
  adsEnabled: z.boolean(),
  commentsEnabled: z.boolean(),
});
