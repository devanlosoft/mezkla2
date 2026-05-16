import type { Metadata } from "next";

import { PublicArticleCard } from "@/components/editorial/public-article-card";
import { searchPublicArticles } from "@/features/articles/public-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Buscador de noticias de Mezkla2.",
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const articles = await searchPublicArticles(q);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-black uppercase tracking-wide text-red-700">
          Busqueda
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
          Buscar noticias
        </h1>
      </header>

      <form className="mt-8 flex flex-col gap-3 rounded border border-zinc-200 bg-zinc-50 p-4 sm:flex-row">
        <label className="sr-only" htmlFor="q">
          Palabra clave
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Buscar por palabra clave"
          className="min-h-12 flex-1 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
        <button className="min-h-12 rounded bg-zinc-950 px-5 text-sm font-black text-white transition hover:bg-red-700">
          Buscar
        </button>
      </form>

      <section className="mt-10">
        {q ? (
          <p className="mb-5 text-sm font-semibold text-zinc-600">
            {articles.length} resultado(s) para “{q}”
          </p>
        ) : (
          <p className="mb-5 text-sm font-semibold text-zinc-600">
            Ingresa una palabra clave para iniciar la busqueda.
          </p>
        )}

        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <PublicArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
