import { AdSlot } from "@/components/editorial/ad-slot";
import { ArticleCard } from "@/components/editorial/article-card";
import { HeroStory } from "@/components/editorial/hero-story";
import { NewsletterBox } from "@/components/editorial/newsletter-box";
import {
  categories,
  featuredArticle,
  latestArticles,
  opinionArticles,
  secondaryArticles,
} from "@/features/articles/sample-data";

export default function Home() {
  const mostRead = [...secondaryArticles, ...latestArticles]
    .sort((left, right) => right.views - left.views)
    .slice(0, 4);

  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600">
            <p className="font-semibold text-zinc-950">
              Sabado, 16 de mayo de 2026
            </p>
            <p>Actualidad, analisis y servicio publico en tiempo real</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="grid gap-8">
          <HeroStory article={featuredArticle} />
          <div className="grid gap-6 md:grid-cols-2">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} priority />
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <AdSlot label="Portada superior" />
          <section>
            <h2 className="border-b-2 border-zinc-950 pb-2 text-lg font-black">
              Mas leidas
            </h2>
            <ol className="mt-4 grid gap-4">
              {mostRead.map((article, index) => (
                <li key={article.id} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="text-2xl font-black text-red-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-500">
                      {article.category}
                    </p>
                    <h3 className="text-base font-black leading-snug">
                      {article.title}
                    </h3>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <NewsletterBox />
        </aside>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Secciones</h2>
            <p className="text-sm text-zinc-600">
              Cobertura organizada para encontrar contexto rapidamente.
            </p>
          </div>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <a
                key={category}
                href={`/categoria/${category.toLowerCase().replaceAll(" ", "-")}`}
                className="shrink-0 rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-black text-zinc-800 transition hover:border-red-700 hover:text-red-700"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-zinc-950 pb-2">
            <h2 className="text-2xl font-black">Ultimas noticias</h2>
            <a href="/buscar" className="text-sm font-black text-red-700">
              Ver busqueda
            </a>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <section className="border-l-4 border-emerald-700 pl-4">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
              Opinion
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight">
              {opinionArticles[0].title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {opinionArticles[0].subtitle}
            </p>
            <p className="mt-3 text-sm font-semibold text-zinc-500">
              {opinionArticles[0].author}
            </p>
          </section>
          <AdSlot label="Lateral portada" />
        </aside>
      </section>
    </div>
  );
}
