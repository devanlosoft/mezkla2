"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded border border-zinc-300 px-3 py-2 text-sm font-black text-zinc-800 transition hover:border-red-700 hover:text-red-700"
    >
      Salir
    </button>
  );
}
