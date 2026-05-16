import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/admin/logout-button";
import type { RoleName } from "@/generated/prisma/client";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/noticias", label: "Noticias" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/etiquetas", label: "Etiquetas" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/publicidad", label: "Publicidad" },
  { href: "/admin/estadisticas", label: "Estadisticas" },
  { href: "/admin/configuracion", label: "Configuracion" },
];

type AdminShellProps = {
  children: ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role: RoleName;
  };
};

export function AdminShell({ children, user }: AdminShellProps) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-zinc-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded border border-zinc-200 bg-white p-4">
          <div className="border-b border-zinc-200 pb-4">
            <p className="text-xs font-black uppercase tracking-wide text-red-700">
              Panel editorial
            </p>
            <p className="mt-2 text-sm font-black text-zinc-950">
              {user.name ?? user.email}
            </p>
            <p className="text-xs font-semibold text-zinc-500">{user.role}</p>
          </div>
          <nav className="mt-4 grid gap-1" aria-label="Administracion">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-red-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5">
            <LogoutButton />
          </div>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
