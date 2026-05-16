"use client";

import { useActionState } from "react";

import { createAdvertisement } from "@/features/ads/actions";

const placements = [
  "HOME_TOP",
  "HOME_SIDEBAR",
  "ARTICLE_INLINE",
  "ARTICLE_SIDEBAR",
  "CATEGORY_TOP",
  "SPONSORED_BLOCK",
];

const initialState = {
  ok: false,
  message: "",
};

export function AdCreateForm() {
  const [state, formAction, isPending] = useActionState(
    createAdvertisement,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-black">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={120}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Ubicacion
          <select
            name="placement"
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          >
            {placements.map((placement) => (
              <option key={placement} value={placement}>
                {placement}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black">
          Patrocinador
          <input
            name="sponsorName"
            maxLength={120}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black">
        Imagen
        <input
          name="imageUrl"
          type="url"
          placeholder="https://..."
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
        />
      </label>

      <label className="grid gap-2 text-sm font-black">
        URL destino
        <input
          name="targetUrl"
          type="url"
          placeholder="https://..."
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
        />
      </label>

      <label className="grid gap-2 text-sm font-black">
        HTML opcional
        <textarea
          name="html"
          rows={4}
          maxLength={2000}
          className="rounded border border-zinc-300 px-3 py-2 font-mono text-sm font-normal outline-none focus:border-red-700"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Inicio
          <input
            name="startsAt"
            type="datetime-local"
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Fin
          <input
            name="endsAt"
            type="datetime-local"
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
      </div>

      <label className="flex gap-2 text-sm font-semibold text-zinc-700">
        <input name="isActive" type="checkbox" className="size-4 accent-red-700" />
        Activar anuncio
      </label>

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
          {isPending ? "Guardando..." : "Crear anuncio"}
        </button>
      </div>
    </form>
  );
}
