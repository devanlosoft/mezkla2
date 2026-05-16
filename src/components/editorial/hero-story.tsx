import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@/features/articles/sample-data";

type HeroStoryProps = {
  article: ArticleSummary;
};

export function HeroStory({ article }: HeroStoryProps) {
  return (
    <article className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative aspect-[4/3] overflow-hidden rounded bg-zinc-200 sm:aspect-[16/9] lg:aspect-[5/4]"
      >
        <Image
          src={article.imageUrl}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover transition duration-300 hover:scale-105"
        />
      </Link>
      <div className="border-t-4 border-red-700 pt-4">
        <p className="text-sm font-black uppercase tracking-wide text-red-700">
          {article.category}
        </p>
        <h1 className="mt-3 text-4xl font-black leading-[1.02] text-zinc-950 sm:text-5xl lg:text-6xl">
          <Link href={`/noticia/${article.slug}`} className="hover:text-red-700">
            {article.title}
          </Link>
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-700">{article.subtitle}</p>
        <p className="mt-5 text-sm font-semibold text-zinc-500">
          Por {article.author} · {article.publishedAt} · {article.readTime}
        </p>
      </div>
    </article>
  );
}
