import type { MetadataRoute } from "next";

import {
  allSampleArticles,
  categories,
} from "@/features/articles/sample-data";
import { getPrismaClient } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "",
    "/categorias",
    "/buscar",
    "/opinion",
    "/multimedia",
    "/mas-leidas",
    "/autores",
    "/contacto",
    "/acerca",
    "/privacidad",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  if (!process.env.DATABASE_URL) {
    return [
      ...staticRoutes,
      ...categories.map((category) => ({
        url: `${baseUrl}/categoria/${slugify(category)}`,
        lastModified: new Date(),
      })),
      ...allSampleArticles.map((article) => ({
        url: `${baseUrl}/noticia/${article.slug}`,
        lastModified: new Date("2026-05-16T08:00:00.000Z"),
      })),
    ];
  }

  const prisma = getPrismaClient();
  const [dbCategories, dbArticles] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  return [
    ...staticRoutes,
    ...dbCategories.map((category) => ({
      url: `${baseUrl}/categoria/${category.slug}`,
      lastModified: category.updatedAt,
    })),
    ...dbArticles.map((article) => ({
      url: `${baseUrl}/noticia/${article.slug}`,
      lastModified: article.updatedAt,
    })),
  ];
}
