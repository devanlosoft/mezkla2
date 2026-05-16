import { RoleName, UserStatus } from "@/generated/prisma/client";
import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(160),
  roleName: z.enum(RoleName),
  status: z.enum(UserStatus),
  password: z.string().min(12).max(128),
  authorTitle: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(800).optional(),
});

export const userUpdateSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(3).max(100),
  roleName: z.enum(RoleName),
  status: z.enum(UserStatus),
  authorTitle: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(800).optional(),
});

export const userPasswordSchema = z.object({
  id: z.string().trim().min(1),
  password: z.string().min(12).max(128),
});
