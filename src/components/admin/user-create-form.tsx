"use client";

import { createUser } from "@/features/users/actions";
import { useActionState } from "react";

const roles = ["ADMIN", "EDITOR", "JOURNALIST", "CONTRIBUTOR", "READER"];
const statuses = ["ACTIVE", "INVITED", "SUSPENDED"];

const initialState = {
  ok: false,
  message: "",
};

export function UserCreateForm() {
  const [state, formAction, isPending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={100}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={160}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="roleName">
            Rol
          </label>
          <select
            id="roleName"
            name="roleName"
            defaultValue="JOURNALIST"
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="status">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue="ACTIVE"
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="password">
          Contrasena inicial
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={128}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="authorTitle">
          Titulo de autor
        </label>
        <input
          id="authorTitle"
          name="authorTitle"
          maxLength={100}
          placeholder="Editor, periodista, columnista"
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={800}
          className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </div>

      {state.message ? (
        <p
          className={`rounded border px-3 py-2 text-sm font-semibold ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          disabled={isPending}
          className="min-h-11 rounded bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isPending ? "Creando..." : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
