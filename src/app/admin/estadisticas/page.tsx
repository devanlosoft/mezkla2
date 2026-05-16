import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Estadisticas",
};

async function getStats() {
  try {
    const prisma = getPrismaClient();
    const [
      publishedCount,
      draftCount,
      reviewCount,
      scheduledCount,
      subscriberCount,
      mostViewed,
      categoryCounts,
      activeAuthors,
    ] = await Promise.all([
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.article.count({ where: { status: "REVIEW" } }),
      prisma.article.count({ where: { status: "SCHEDULED" } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.article.findMany({
        orderBy: { viewsCount: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          viewsCount: true,
          status: true,
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          _count: {
            select: { articles: true },
          },
        },
      }),
      prisma.user.findMany({
        where: {
          articles: {
            some: {},
          },
        },
        orderBy: { name: "asc" },
        take: 8,
        select: {
          id: true,
          name: true,
          _count: {
            select: { articles: true },
          },
        },
      }),
    ]);

    return {
      publishedCount,
      draftCount,
      reviewCount,
      scheduledCount,
      subscriberCount,
      mostViewed,
      categoryCounts,
      activeAuthors,
    };
  } catch {
    return {
      publishedCount: 0,
      draftCount: 0,
      reviewCount: 0,
      scheduledCount: 0,
      subscriberCount: 0,
      mostViewed: [],
      categoryCounts: [],
      activeAuthors: [],
    };
  }
}

export default async function AdminStatsPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "stats:view")) {
    redirect("/admin/login");
  }

  const stats = await getStats();
  const summary = [
    { label: "Publicadas", value: stats.publishedCount },
    { label: "Borradores", value: stats.draftCount },
    { label: "En revision", value: stats.reviewCount },
    { label: "Programadas", value: stats.scheduledCount },
    { label: "Suscriptores", value: stats.subscriberCount },
  ];

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Estadisticas
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Estadisticas editoriales
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Indicadores basicos de produccion, vistas, categorias y autores.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summary.map((item) => (
            <article
              key={item.label}
              className="rounded border border-zinc-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-zinc-500">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-black text-zinc-950">
                {item.value}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Mas vistas</h2>
            <div className="mt-4 grid gap-3">
              {stats.mostViewed.length > 0 ? (
                stats.mostViewed.map((article) => (
                  <div
                    key={article.id}
                    className="border-b border-zinc-100 pb-3 last:border-0"
                  >
                    <p className="font-black leading-snug">{article.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {article.viewsCount} vistas · {article.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">Sin vistas registradas.</p>
              )}
            </div>
          </article>

          <article className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Categorias</h2>
            <div className="mt-4 grid gap-2">
              {stats.categoryCounts.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="font-semibold text-zinc-700">
                    {category.name}
                  </span>
                  <span className="font-black text-zinc-950">
                    {category._count.articles}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Autores activos</h2>
            <div className="mt-4 grid gap-2">
              {stats.activeAuthors.length > 0 ? (
                stats.activeAuthors.map((author) => (
                  <div
                    key={author.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="font-semibold text-zinc-700">
                      {author.name}
                    </span>
                    <span className="font-black text-zinc-950">
                      {author._count.articles}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">Sin autores activos.</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </AdminShell>
  );
}
