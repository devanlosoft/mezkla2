import { describe, expect, it } from "vitest";

import { canAccessAdmin, hasPermission } from "@/lib/permissions";

describe("permissions", () => {
  it("allows admins to manage users", () => {
    expect(hasPermission("ADMIN", "user:manage")).toBe(true);
  });

  it("keeps readers out of admin", () => {
    expect(canAccessAdmin("READER")).toBe(false);
  });

  it("allows journalists to edit own articles but not all articles", () => {
    expect(hasPermission("JOURNALIST", "article:update:own")).toBe(true);
    expect(hasPermission("JOURNALIST", "article:update:any")).toBe(false);
  });
});
