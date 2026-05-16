import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { TagForm } from "@/components/admin/tag-form";
import { deleteTag } from "@/features/tags/actions";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gestionar etiquetas",
};

async function getTags() {
  try {
    const prisma = getPrismaClient();

    return await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminTagsPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "tag:manage")) {
    redirect("/admin/login");
  }

  const tags = await getTags();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Etiquetas
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Gestionar etiquetas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Organiza temas, palabras clave y relaciones editoriales para el
            buscador y SEO.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <div className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Nueva etiqueta</h2>
            <div className="mt-5">
              <TagForm />
            </div>
          </div>

          <div className="overflow-hidden rounded border border-zinc-200 bg-white">
            {tags.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="bg-zinc-100 text-xs font-black uppercase text-zinc-600">
                    <tr>
                      <th className="px-4 py-3">Etiqueta</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Noticias</th>
                      <th className="px-4 py-3">Accion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {tags.map((tag) => (
                      <tr key={tag.id} className="align-top">
                        <td className="px-4 py-4">
                          <p className="font-black text-zinc-950">{tag.name}</p>
                          {tag.description ? (
                            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                              {tag.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 text-zinc-600">{tag.slug}</td>
                        <td className="px-4 py-4">{tag._count.articles}</td>
                        <td className="px-4 py-4">
                          <form action={deleteTag}>
                            <input type="hidden" name="id" value={tag.id} />
                            <button
                              disabled={tag._count.articles > 0}
                              className="text-sm font-black text-red-700 hover:text-red-800 disabled:cursor-not-allowed disabled:text-zinc-400"
                            >
                              Eliminar
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
                  <h2 className="text-xl font-black">Sin etiquetas</h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Crea temas para organizar noticias y busquedas.
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
