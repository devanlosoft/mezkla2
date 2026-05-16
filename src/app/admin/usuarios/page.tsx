import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { UserCreateForm } from "@/components/admin/user-create-form";
import { UserPasswordForm } from "@/components/admin/user-password-form";
import { RoleName, UserStatus } from "@/generated/prisma/client";
import { updateUser } from "@/features/users/actions";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gestionar usuarios",
};

async function getUsers() {
  try {
    const prisma = getPrismaClient();

    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
        authorProfile: true,
        _count: {
          select: { articles: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !hasPermission(user.role, "user:manage")) {
    redirect("/admin/login");
  }

  const users = await getUsers();

  return (
    <AdminShell user={user}>
      <div className="grid gap-6">
        <header className="rounded border border-zinc-200 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-red-700">
            Usuarios
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
            Gestionar usuarios
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Administra roles, estados, perfiles de autor y acceso editorial.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-black">Nuevo usuario</h2>
            <div className="mt-5">
              <UserCreateForm />
            </div>
          </div>

          <div className="grid gap-4">
            {users.map((managedUser) => (
              <article
                key={managedUser.id}
                className="rounded border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-zinc-950">
                      {managedUser.name}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      {managedUser.email}
                    </p>
                    <p className="mt-2 text-xs font-black uppercase text-zinc-500">
                      {managedUser.role.name} · {managedUser.status} ·{" "}
                      {managedUser._count.articles} noticias
                    </p>
                  </div>
                  <UserPasswordForm userId={managedUser.id} />
                </div>

                <form
                  action={updateUser}
                  className="mt-5 grid gap-3 border-t border-zinc-200 pt-4 lg:grid-cols-[1fr_160px_160px_auto]"
                >
                  <input type="hidden" name="id" value={managedUser.id} />
                  <label className="grid gap-1 text-xs font-black uppercase text-zinc-500">
                    Nombre
                    <input
                      name="name"
                      defaultValue={managedUser.name}
                      className="min-h-10 rounded border border-zinc-300 px-2 text-sm font-normal normal-case text-zinc-950 outline-none focus:border-red-700"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase text-zinc-500">
                    Rol
                    <select
                      name="roleName"
                      defaultValue={managedUser.role.name}
                      className="min-h-10 rounded border border-zinc-300 px-2 text-sm font-normal text-zinc-950 outline-none focus:border-red-700"
                    >
                      {Object.values(RoleName).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase text-zinc-500">
                    Estado
                    <select
                      name="status"
                      defaultValue={managedUser.status}
                      className="min-h-10 rounded border border-zinc-300 px-2 text-sm font-normal text-zinc-950 outline-none focus:border-red-700"
                    >
                      {Object.values(UserStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="self-end rounded bg-zinc-950 px-3 py-2 text-sm font-black text-white transition hover:bg-red-700">
                    Guardar
                  </button>
                  <label className="grid gap-1 text-xs font-black uppercase text-zinc-500 lg:col-span-2">
                    Titulo de autor
                    <input
                      name="authorTitle"
                      defaultValue={managedUser.authorProfile?.title ?? ""}
                      className="min-h-10 rounded border border-zinc-300 px-2 text-sm font-normal normal-case text-zinc-950 outline-none focus:border-red-700"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase text-zinc-500 lg:col-span-2">
                    Bio
                    <input
                      name="bio"
                      defaultValue={managedUser.authorProfile?.bio ?? ""}
                      className="min-h-10 rounded border border-zinc-300 px-2 text-sm font-normal normal-case text-zinc-950 outline-none focus:border-red-700"
                    />
                  </label>
                </form>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
