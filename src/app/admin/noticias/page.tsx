import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { articleStatusLabels } from "@/features/articles/status-labels";
import { getCurrentSession } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gestionar noticias",
};

async function getArticles() {
  try {
    const prisma = getPrismaClient();

    return await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        author: true,
        category: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminArticlesPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !canAccessAdmin(user.role)) {
    redirect("/admin/login");
  }

  const articles = await getArticles();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4 rounded border border-zinc-200 bg-white p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-red-700">
              Noticias
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
              Gestionar noticias
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Listado editorial inicial conectado a Prisma.
            </p>
          </div>
          <Link
            href="/admin/noticias/nueva"
            className="rounded bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
          >
            Nueva noticia
          </Link>
        </header>

        <section className="overflow-hidden rounded border border-zinc-200 bg-white">
          {articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-zinc-100 text-xs font-black uppercase text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Titulo</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Autor</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Creada</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-4 py-4">
                        <p className="font-black text-zinc-950">
                          {article.title}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          /noticia/{article.slug}
                        </p>
                      </td>
                      <td className="px-4 py-4">{article.category.name}</td>
                      <td className="px-4 py-4">{article.author.name}</td>
                      <td className="px-4 py-4">
                        <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-700">
                          {articleStatusLabels[article.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-zinc-600">
                        {article.createdAt.toLocaleDateString("es-CO")}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/noticias/${article.id}/editar`}
                          className="text-sm font-black text-red-700 hover:text-red-800"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center p-8 text-center">
              <div>
                <h2 className="text-xl font-black">Sin noticias todavia</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Crea el primer borrador editorial para iniciar el flujo.
                </p>
                <Link
                  href="/admin/noticias/nueva"
                  className="mt-5 inline-flex rounded bg-red-700 px-4 py-3 text-sm font-black text-white"
                >
                  Crear noticia
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
