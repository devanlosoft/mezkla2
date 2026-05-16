import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleCreateForm } from "@/components/admin/article-create-form";
import {
  archiveArticle,
  publishArticle,
  scheduleArticle,
  submitArticleForReview,
} from "@/features/articles/actions";
import { articleStatusLabels } from "@/features/articles/status-labels";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Editar noticia",
};

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getEditData(articleId: string) {
  const prisma = getPrismaClient();
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: true,
        category: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return { article, categories };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user) {
    redirect("/admin/login");
  }

  const { article, categories } = await getEditData(id);

  if (!article) {
    notFound();
  }

  const canEdit =
    hasPermission(user.role, "article:update:any") ||
    (hasPermission(user.role, "article:update:own") &&
      article.authorId === user.id);

  if (!canEdit) {
    redirect("/admin/noticias");
  }

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Editar noticia
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-950">
                {article.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Estado actual:{" "}
                <span className="font-black text-zinc-950">
                  {articleStatusLabels[article.status]}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasPermission(user.role, "article:submit-review") ? (
                <form action={submitArticleForReview}>
                  <input type="hidden" name="id" value={article.id} />
                  <button className="rounded border border-zinc-300 px-3 py-2 text-sm font-black text-zinc-800 transition hover:border-red-700 hover:text-red-700">
                    Enviar a revision
                  </button>
                </form>
              ) : null}
              {hasPermission(user.role, "article:publish") ? (
                <form action={publishArticle}>
                  <input type="hidden" name="id" value={article.id} />
                  <button className="rounded bg-red-700 px-3 py-2 text-sm font-black text-white transition hover:bg-red-800">
                    Publicar
                  </button>
                </form>
              ) : null}
              {hasPermission(user.role, "article:archive") ? (
                <form action={archiveArticle}>
                  <input type="hidden" name="id" value={article.id} />
                  <button className="rounded border border-zinc-300 px-3 py-2 text-sm font-black text-zinc-800 transition hover:border-zinc-950">
                    Archivar
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </header>

        {hasPermission(user.role, "article:schedule") ? (
          <section className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-black">Programar publicacion</h2>
            <form action={scheduleArticle} className="mt-4 flex flex-wrap gap-3">
              <input type="hidden" name="id" value={article.id} />
              <label className="sr-only" htmlFor="scheduledAt">
                Fecha de publicacion
              </label>
              <input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
                className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
              />
              <button className="rounded bg-zinc-950 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700">
                Programar
              </button>
            </form>
          </section>
        ) : null}

        <section className="rounded border border-zinc-200 bg-white p-6">
          <ArticleCreateForm categories={categories} article={article} />
        </section>
      </div>
    </AdminShell>
  );
}
