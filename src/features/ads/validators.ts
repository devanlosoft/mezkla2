import { AdvertisementPlacement } from "@/generated/prisma/client";
import { z } from "zod";

export const advertisementSaveSchema = z.object({
  name: z.string().trim().min(3).max(120),
  placement: z.enum(AdvertisementPlacement),
  imageUrl: z.string().trim().url().max(500).optional(),
  targetUrl: z.string().trim().url().max(500).optional(),
  html: z.string().trim().max(2000).optional(),
  sponsorName: z.string().trim().max(120).optional(),
  isActive: z.boolean(),
  startsAt: z.string().trim().optional(),
  endsAt: z.string().trim().optional(),
});
