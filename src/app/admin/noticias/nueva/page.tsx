import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleCreateForm } from "@/components/admin/article-create-form";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Crear noticia",
};

async function getCategories() {
  const prisma = getPrismaClient();

  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

export default async function NewArticlePage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "article:create")) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Nueva noticia
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Crear borrador
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Este primer formulario guarda noticias como borrador. El editor
            enriquecido, media picker y programacion entran en el siguiente
            incremento.
          </p>
        </header>

        <section className="rounded border border-zinc-200 bg-white p-6">
          {categories.length > 0 ? (
            <ArticleCreateForm categories={categories} />
          ) : (
            <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              Debes crear categorias activas antes de publicar noticias.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
