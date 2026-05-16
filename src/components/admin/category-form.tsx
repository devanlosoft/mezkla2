"use client";

import { useActionState } from "react";

import { saveCategory } from "@/features/categories/actions";

type CategoryFormProps = {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    isActive: boolean;
  };
};

const initialState = {
  ok: false,
  message: "",
};

export function CategoryForm({ category }: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveCategory,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={80}
          defaultValue={category?.name}
          className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            maxLength={100}
            defaultValue={category?.slug}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="color">
            Color
          </label>
          <input
            id="color"
            name="color"
            placeholder="#b91c1c"
            maxLength={32}
            defaultValue={category?.color ?? ""}
            className="min-h-11 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="description">
          Descripcion
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={category?.description ?? ""}
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
          defaultValue={category?.seoTitle ?? ""}
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
          defaultValue={category?.seoDescription ?? ""}
          className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={category?.isActive ?? true}
          className="size-4 accent-red-700"
        />
        Visible publicamente
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
          {isPending ? "Guardando..." : category ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
