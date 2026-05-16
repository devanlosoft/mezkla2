import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { canAccessAdmin } from "@/lib/permissions";
import { getCurrentSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login admin",
};

export default async function AdminLoginPage() {
  const session = await getCurrentSession();

  if (canAccessAdmin(session?.user?.role)) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-md content-center px-4 py-12">
      <div className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-red-700">
          Mezkla2 Admin
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
          Ingreso editorial
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Acceso reservado para administradores, editores, periodistas y
          colaboradores activos.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
