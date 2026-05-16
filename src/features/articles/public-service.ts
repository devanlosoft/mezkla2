import { allSampleArticles, categories } from "@/features/articles/sample-data";
import { getPrismaClient } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export type PublicArticle = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  summary: string | null;
  contentHtml: string;
  imageUrl: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
  publishedAt: Date | null;
  readingMinutes: number;
  viewsCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string[];
  ogImage: string | null;
};

function sampleToPublicArticle(article: (typeof allSampleArticles)[number]) {
  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    slug: article.slug,
    summary: article.subtitle,
    contentHtml: `<p>${article.subtitle}</p><p>Esta nota forma parte del contenido editorial inicial de Mezkla2 mientras se conecta la base de datos de produccion.</p>`,
    imageUrl: article.imageUrl,
    category: {
      name: article.category,
      slug: slugify(article.category),
    },
    author: {
      name: article.author,
    },
    publishedAt: new Date("2026-05-16T08:00:00.000Z"),
    readingMinutes: Number.parseInt(article.readTime, 10) || 3,
    viewsCount: article.views,
    seoTitle: article.title,
    seoDescription: article.subtitle,
    keywords: [article.category],
    ogImage: article.imageUrl,
  } satisfies PublicArticle;
}

export async function getPublicArticleBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    const sample = allSampleArticles.find((article) => article.slug === slug);

    return sample ? sampleToPublicArticle(sample) : null;
  }

  const prisma = getPrismaClient();
  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      author: true,
      category: true,
      coverImage: true,
    },
  });

  if (!article) {
    const sample = allSampleArticles.find((item) => item.slug === slug);

    return sample ? sampleToPublicArticle(sample) : null;
  }

  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    slug: article.slug,
    summary: article.summary,
    contentHtml: article.contentHtml,
    imageUrl:
      article.coverImage?.url ??
      article.ogImage ??
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80",
    category: {
      name: article.category.name,
      slug: article.category.slug,
    },
    author: {
      name: article.author.name,
    },
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
    viewsCount: article.viewsCount,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    keywords: article.keywords,
    ogImage: article.ogImage,
  } satisfies PublicArticle;
}

export async function getPublicArticlesByCategory(categorySlug: string) {
  if (!process.env.DATABASE_URL) {
    return allSampleArticles
      .filter((article) => slugify(article.category) === categorySlug)
      .map(sampleToPublicArticle);
  }

  const prisma = getPrismaClient();
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      category: {
        slug: categorySlug,
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 24,
    include: {
      author: true,
      category: true,
      coverImage: true,
    },
  });

  if (articles.length === 0) {
    return allSampleArticles
      .filter((article) => slugify(article.category) === categorySlug)
      .map(sampleToPublicArticle);
  }

  return articles.map(
    (article) =>
      ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        slug: article.slug,
        summary: article.summary,
        contentHtml: article.contentHtml,
        imageUrl:
          article.coverImage?.url ??
          article.ogImage ??
          "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80",
        category: {
          name: article.category.name,
          slug: article.category.slug,
        },
        author: {
          name: article.author.name,
        },
        publishedAt: article.publishedAt,
        readingMinutes: article.readingMinutes,
        viewsCount: article.viewsCount,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        keywords: article.keywords,
        ogImage: article.ogImage,
      }) satisfies PublicArticle,
  );
}

export async function searchPublicArticles(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  if (!process.env.DATABASE_URL) {
    return allSampleArticles
      .filter((article) =>
        [article.title, article.subtitle, article.category, article.author]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .map(sampleToPublicArticle);
  }

  const prisma = getPrismaClient();
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: normalizedQuery, mode: "insensitive" } },
        { subtitle: { contains: normalizedQuery, mode: "insensitive" } },
        { summary: { contains: normalizedQuery, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: {
      author: true,
      category: true,
      coverImage: true,
    },
  });

  if (articles.length === 0) {
    return allSampleArticles
      .filter((article) =>
        [article.title, article.subtitle, article.category, article.author]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .map(sampleToPublicArticle);
  }

  return articles.map(
    (article) =>
      ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        slug: article.slug,
        summary: article.summary,
        contentHtml: article.contentHtml,
        imageUrl:
          article.coverImage?.url ??
          article.ogImage ??
          "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80",
        category: {
          name: article.category.name,
          slug: article.category.slug,
        },
        author: {
          name: article.author.name,
        },
        publishedAt: article.publishedAt,
        readingMinutes: article.readingMinutes,
        viewsCount: article.viewsCount,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        keywords: article.keywords,
        ogImage: article.ogImage,
      }) satisfies PublicArticle,
  );
}

export function getSampleCategories() {
  return categories.map((category) => ({
    name: category,
    slug: slugify(category),
  }));
}
