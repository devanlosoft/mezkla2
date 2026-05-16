import type { RoleName } from "@/generated/prisma/client";

export type Permission =
  | "admin:access"
  | "article:create"
  | "article:update:any"
  | "article:update:own"
  | "article:submit-review"
  | "article:approve"
  | "article:publish"
  | "article:schedule"
  | "article:archive"
  | "category:manage"
  | "tag:manage"
  | "user:manage"
  | "ad:manage"
  | "settings:manage"
  | "stats:view";

const rolePermissions: Record<RoleName, Permission[]> = {
  ADMIN: [
    "admin:access",
    "article:create",
    "article:update:any",
    "article:update:own",
    "article:submit-review",
    "article:approve",
    "article:publish",
    "article:schedule",
    "article:archive",
    "category:manage",
    "tag:manage",
    "user:manage",
    "ad:manage",
    "settings:manage",
    "stats:view",
  ],
  EDITOR: [
    "admin:access",
    "article:create",
    "article:update:any",
    "article:update:own",
    "article:submit-review",
    "article:approve",
    "article:publish",
    "article:schedule",
    "article:archive",
    "category:manage",
    "tag:manage",
    "stats:view",
  ],
  JOURNALIST: [
    "admin:access",
    "article:create",
    "article:update:own",
    "article:submit-review",
    "stats:view",
  ],
  CONTRIBUTOR: ["admin:access", "article:create", "article:submit-review"],
  READER: [],
};

export function hasPermission(role: RoleName | undefined, permission: Permission) {
  if (!role) {
    return false;
  }

  return rolePermissions[role].includes(permission);
}

export function canAccessAdmin(role: RoleName | undefined) {
  return hasPermission(role, "admin:access");
}
