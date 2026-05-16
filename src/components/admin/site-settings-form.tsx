"use client";

import { useActionState } from "react";

import { saveSiteSettings } from "@/features/settings/actions";

type SiteSettingsFormProps = {
  settings: {
    siteName: string;
    siteUrl: string | null;
    description: string | null;
    logoUrl: string | null;
    defaultOgImage: string | null;
    contactEmail: string | null;
    facebookUrl: string | null;
    xUrl: string | null;
    instagramUrl: string | null;
    youtubeUrl: string | null;
    adsEnabled: boolean;
    commentsEnabled: boolean;
  };
};

const initialState = {
  ok: false,
  message: "",
};

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveSiteSettings,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Nombre del sitio
          <input
            name="siteName"
            required
            defaultValue={settings.siteName}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
        <label className="grid gap-2 text-sm font-black">
          URL del sitio
          <input
            name="siteUrl"
            type="url"
            defaultValue={settings.siteUrl ?? ""}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black">
        Descripcion
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={settings.description ?? ""}
          className="rounded border border-zinc-300 px-3 py-2 text-sm font-normal outline-none focus:border-red-700"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Logo URL
          <input
            name="logoUrl"
            type="url"
            defaultValue={settings.logoUrl ?? ""}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Imagen OG por defecto
          <input
            name="defaultOgImage"
            type="url"
            defaultValue={settings.defaultOgImage ?? ""}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black">
        Correo de contacto
        <input
          name="contactEmail"
          type="email"
          defaultValue={settings.contactEmail ?? ""}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm font-normal outline-none focus:border-red-700"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="facebookUrl" type="url" defaultValue={settings.facebookUrl ?? ""} placeholder="Facebook URL" className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700" />
        <input name="xUrl" type="url" defaultValue={settings.xUrl ?? ""} placeholder="X URL" className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700" />
        <input name="instagramUrl" type="url" defaultValue={settings.instagramUrl ?? ""} placeholder="Instagram URL" className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700" />
        <input name="youtubeUrl" type="url" defaultValue={settings.youtubeUrl ?? ""} placeholder="YouTube URL" className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700" />
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            name="adsEnabled"
            type="checkbox"
            defaultChecked={settings.adsEnabled}
            className="size-4 accent-red-700"
          />
          Publicidad activa
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            name="commentsEnabled"
            type="checkbox"
            defaultChecked={settings.commentsEnabled}
            className="size-4 accent-red-700"
          />
          Comentarios activos
        </label>
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
          {isPending ? "Guardando..." : "Guardar configuracion"}
        </button>
      </div>
    </form>
  );
}
