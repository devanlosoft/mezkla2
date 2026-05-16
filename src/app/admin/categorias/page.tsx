import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { toggleCategoryStatus } from "@/features/categories/actions";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gestionar categorias",
};

async function getCategories() {
  const prisma = getPrismaClient();

  return prisma.category.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });
}

export default async function AdminCategoriesPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "category:manage")) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Categorias
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Gestionar categorias
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Administra secciones editoriales, slugs, estado publico y metadata
            SEO.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Nueva categoria</h2>
            <div className="mt-5">
              <CategoryForm />
            </div>
          </div>

          <div className="overflow-hidden rounded border border-zinc-200 bg-white">
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] border-collapse text-left text-sm">
                  <thead className="bg-zinc-100 text-xs font-black uppercase text-zinc-600">
                    <tr>
                      <th className="px-4 py-3">Categoria</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Noticias</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Accion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="align-top">
                        <td className="px-4 py-4">
                          <p className="font-black text-zinc-950">
                            {category.name}
                          </p>
                          {category.description ? (
                            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                              {category.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 text-zinc-600">
                          /categoria/{category.slug}
                        </td>
                        <td className="px-4 py-4">
                          {category._count.articles}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-700">
                            {category.isActive ? "Activa" : "Oculta"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <form action={toggleCategoryStatus}>
                            <input type="hidden" name="id" value={category.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={category.isActive ? "false" : "true"}
                            />
                            <button className="text-sm font-black text-red-700 hover:text-red-800">
                              {category.isActive ? "Ocultar" : "Activar"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid min-h-64 place-items-center p-8 text-center">
                <div>
                  <h2 className="text-xl font-black">Sin categorias</h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Crea la primera seccion editorial.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
