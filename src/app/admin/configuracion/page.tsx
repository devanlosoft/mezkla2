import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Configuracion del sitio",
};

async function getSettings() {
  const prisma = getPrismaClient();
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    settings ?? {
      siteName: "Mezkla2",
      siteUrl: null,
      description: null,
      logoUrl: null,
      defaultOgImage: null,
      contactEmail: null,
      facebookUrl: null,
      xUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
      adsEnabled: true,
      commentsEnabled: false,
    }
  );
}

export default async function AdminSettingsPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "settings:manage")) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Configuracion
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Configuracion del sitio
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Administra datos institucionales, SEO global, redes sociales,
            comentarios y publicidad.
          </p>
        </header>

        <section className="rounded border border-zinc-200 bg-white p-6">
          <SiteSettingsForm settings={settings} />
        </section>
      </div>
    </AdminShell>
  );
}
