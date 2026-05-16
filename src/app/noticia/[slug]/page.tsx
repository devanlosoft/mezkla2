import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/editorial/ad-slot";
import {
  getPublicArticleBySlug,
  getPublicArticlesByCategory,
} from "@/features/articles/public-service";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return {
      title: "Noticia no encontrada",
    };
  }

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.summary ?? article.subtitle,
    alternates: {
      canonical: `/noticia/${article.slug}`,
    },
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.summary ?? undefined,
      type: "article",
      images: [article.ogImage ?? article.imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.summary ?? undefined,
      images: [article.ogImage ?? article.imageUrl],
    },
    keywords: article.keywords,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = (
    await getPublicArticlesByCategory(article.category.slug)
  ).filter((item) => item.slug !== article.slug);

  const publishedDate = article.publishedAt
    ? article.publishedAt.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Sin fecha";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary ?? article.subtitle,
    image: [article.ogImage ?? article.imageUrl],
    datePublished: article.publishedAt?.toISOString(),
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: "Mezkla2",
    },
  };
  const safeContentHtml = sanitizeArticleHtml(article.contentHtml);

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/categoria/${article.category.slug}`}
          className="text-sm font-black uppercase tracking-wide text-red-700"
        >
          {article.category.name}
        </Link>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
          {article.title}
        </h1>
        {article.subtitle ? (
          <p className="mt-5 text-xl leading-8 text-zinc-700">
            {article.subtitle}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-zinc-600">
          <span>Por {article.author.name}</span>
          <span>·</span>
          <time>{publishedDate}</time>
          <span>·</span>
          <span>{article.readingMinutes} min de lectura</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded bg-zinc-200">
          <Image
            src={article.imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
        <div>
          <div
            className="prose prose-zinc max-w-none text-lg leading-8"
            dangerouslySetInnerHTML={{ __html: safeContentHtml }}
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded bg-zinc-100 px-3 py-1 text-xs font-black uppercase text-zinc-600"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <AdSlot label="Noticia lateral" />
          {related.length > 0 ? (
            <section>
              <h2 className="border-b-2 border-zinc-950 pb-2 text-lg font-black">
                Relacionadas
              </h2>
              <div className="mt-4 grid gap-4">
                {related.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/noticia/${item.slug}`}
                    className="font-black leading-snug text-zinc-950 hover:text-red-700"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
