import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().max(160),
  consent: z.literal(true),
});
