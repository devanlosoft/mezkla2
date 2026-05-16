"use client";

import { useActionState } from "react";

import { saveTag } from "@/features/tags/actions";

const initialState = {
  ok: false,
  message: "",
};

export function TagForm() {
  const [state, formAction, isPending] = useActionState(saveTag, initialState);

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
          minLength={2}
          maxLength={60}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          maxLength={80}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="description">
          Descripcion
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={300}
          className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="seoTitle">
          SEO title
        </label>
        <input
          id="seoTitle"
          name="seoTitle"
          maxLength={180}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="seoDescription">
          SEO description
        </label>
        <textarea
          id="seoDescription"
          name="seoDescription"
          rows={2}
          maxLength={260}
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
          {isPending ? "Guardando..." : "Crear etiqueta"}
        </button>
      </div>
    </form>
  );
}
