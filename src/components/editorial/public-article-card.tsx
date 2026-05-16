import Image from "next/image";
import Link from "next/link";

import type { PublicArticle } from "@/features/articles/public-service";

type PublicArticleCardProps = {
  article: PublicArticle;
};

export function PublicArticleCard({ article }: PublicArticleCardProps) {
  return (
    <article className="group grid gap-3">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative aspect-[16/10] overflow-hidden rounded bg-zinc-200"
      >
        <Image
          src={article.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-red-700">
          {article.category.name}
        </p>
        <h2 className="mt-1 text-xl font-black leading-tight text-zinc-950">
          <Link href={`/noticia/${article.slug}`} className="hover:text-red-700">
            {article.title}
          </Link>
        </h2>
        {article.subtitle ? (
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {article.subtitle}
          </p>
        ) : null}
        <p className="mt-3 text-xs font-medium text-zinc-500">
          {article.author.name} · {article.readingMinutes} min
        </p>
      </div>
    </article>
  );
}
