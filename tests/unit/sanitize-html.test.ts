import { describe, expect, it } from "vitest";

import { sanitizeArticleHtml } from "@/lib/sanitize-html";

describe("sanitizeArticleHtml", () => {
  it("removes scripts and unsafe event handlers", () => {
    const html = sanitizeArticleHtml(
      '<p onclick="alert(1)">Hola</p><script>alert(1)</script>',
    );

    expect(html).toContain("<p>Hola</p>");
    expect(html).not.toContain("script");
    expect(html).not.toContain("onclick");
  });
});
