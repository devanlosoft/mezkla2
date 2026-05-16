import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdCreateForm } from "@/components/admin/ad-create-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { toggleAdvertisementStatus } from "@/features/ads/actions";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gestionar publicidad",
};

async function getAdvertisements() {
  const prisma = getPrismaClient();

  return prisma.advertisement.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function AdminAdsPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "ad:manage")) {
    redirect("/admin/login");
  }

  const ads = await getAdvertisements();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Publicidad
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Gestionar publicidad
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Configura banners, espacios patrocinados, vigencia y activacion de
            anuncios.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Nuevo anuncio</h2>
            <div className="mt-5">
              <AdCreateForm />
            </div>
          </div>

          <div className="overflow-hidden rounded border border-zinc-200 bg-white">
            {ads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                  <thead className="bg-zinc-100 text-xs font-black uppercase text-zinc-600">
                    <tr>
                      <th className="px-4 py-3">Anuncio</th>
                      <th className="px-4 py-3">Ubicacion</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Metricas</th>
                      <th className="px-4 py-3">Accion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="align-top">
                        <td className="px-4 py-4">
                          <p className="font-black text-zinc-950">{ad.name}</p>
                          {ad.sponsorName ? (
                            <p className="mt-1 text-xs text-zinc-500">
                              {ad.sponsorName}
                            </p>
                          ) : null}
                          {ad.targetUrl ? (
                            <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                              {ad.targetUrl}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">{ad.placement}</td>
                        <td className="px-4 py-4">
                          <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-700">
                            {ad.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-zinc-600">
                          {ad.impressions} impresiones · {ad.clicks} clics
                        </td>
                        <td className="px-4 py-4">
                          <form action={toggleAdvertisementStatus}>
                            <input type="hidden" name="id" value={ad.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={ad.isActive ? "false" : "true"}
                            />
                            <button className="text-sm font-black text-red-700 hover:text-red-800">
                              {ad.isActive ? "Desactivar" : "Activar"}
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
                  <h2 className="text-xl font-black">Sin anuncios</h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Crea el primer espacio publicitario.
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
