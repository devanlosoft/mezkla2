import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicArticleCard } from "@/components/editorial/public-article-card";
import {
  getPublicArticlesByCategory,
  getSampleCategories,
} from "@/features/articles/public-service";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getSampleCategories().find((item) => item.slug === slug);

  return {
    title: category ? category.name : "Categoria",
    description: category
      ? `Noticias de ${category.name} en Mezkla2.`
      : "Noticias por categoria en Mezkla2.",
    alternates: {
      canonical: `/categoria/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const articles = await getPublicArticlesByCategory(slug);
  const category =
    articles[0]?.category ?? getSampleCategories().find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-white">
      <header className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Categoria
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Noticias destacadas, contexto y actualizaciones recientes de{" "}
            {category.name.toLowerCase()}.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <PublicArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <section className="grid min-h-64 place-items-center rounded border border-zinc-200 bg-zinc-50 p-8 text-center">
            <div>
              <h2 className="text-xl font-black">Sin noticias publicadas</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Esta categoria aun no tiene publicaciones visibles.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
