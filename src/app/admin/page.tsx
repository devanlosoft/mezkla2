import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentSession } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Dashboard admin",
};

const stats = [
  { label: "Noticias publicadas", value: "0" },
  { label: "Borradores", value: "0" },
  { label: "En revision", value: "0" },
  { label: "Suscriptores", value: "0" },
];

const workflows = [
  "Crear y editar noticias",
  "Enviar borradores a revision",
  "Aprobar y programar publicaciones",
  "Organizar portada y secciones destacadas",
];

export default async function AdminDashboardPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !canAccessAdmin(user.role)) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Sala de redaccion
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Base administrativa protegida por sesion y permisos. Las metricas se
            conectaran a Prisma cuando existan migraciones y datos reales.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded border border-zinc-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-zinc-500">{stat.label}</p>
              <p className="mt-3 text-4xl font-black text-zinc-950">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Flujo editorial</h2>
            <ul className="mt-4 grid gap-3 text-sm text-zinc-700">
              {workflows.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-red-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Proxima fase</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-700">
              El siguiente incremento conectara el CRUD de noticias con Prisma:
              listado, creacion de borradores, validacion Zod y permisos por rol
              en acciones de servidor.
            </p>
          </article>
        </section>
      </div>
    </AdminShell>
  );
}
