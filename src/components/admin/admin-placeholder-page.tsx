import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentSession } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";

type AdminPlaceholderPageProps = {
  title: string;
  eyebrow: string;
  description: string;
};

export async function AdminPlaceholderPage({
  title,
  eyebrow,
  description,
}: AdminPlaceholderPageProps) {
  const session = await getCurrentSession();
  const user = session?.user;

  if (!user || !canAccessAdmin(user.role)) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={user}>
      <section className="rounded border border-zinc-200 bg-white p-6">
        <p className="text-xs font-black uppercase tracking-wide text-red-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          {description}
        </p>
      </section>
    </AdminShell>
  );
}
