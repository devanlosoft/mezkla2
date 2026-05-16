import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("normalizes accents, spaces, and punctuation", () => {
    expect(slugify("Política y Medio ambiente!")).toBe(
      "politica-y-medio-ambiente",
    );
  });
});
