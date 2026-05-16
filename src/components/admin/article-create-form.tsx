"use client";

import { useActionState } from "react";

import { createArticle, updateArticle } from "@/features/articles/actions";

type ArticleCreateFormProps = {
  categories: Array<{
    id: string;
    name: string;
  }>;
  article?: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    summary: string | null;
    contentHtml: string;
    categoryId: string;
    seoTitle: string | null;
    seoDescription: string | null;
    keywords: string[];
  };
};

const initialState = {
  ok: false,
  message: "",
};

export function ArticleCreateForm({ categories, article }: ArticleCreateFormProps) {
  const action = article ? updateArticle : createArticle;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-6">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="title">
          Titulo
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={8}
          maxLength={180}
          defaultValue={article?.title}
          className="min-h-12 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="subtitle">
          Subtitulo
        </label>
        <textarea
          id="subtitle"
          name="subtitle"
          rows={2}
          maxLength={260}
          defaultValue={article?.subtitle ?? ""}
          className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="categoryId">
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={article?.categoryId ?? ""}
            className="min-h-12 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          >
            <option value="">Seleccionar categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="slug">
            Slug opcional
          </label>
          <input
            id="slug"
            name="slug"
            maxLength={220}
            defaultValue={article?.slug}
            className="min-h-12 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="summary">
          Resumen
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          maxLength={500}
          defaultValue={article?.summary ?? ""}
          className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black" htmlFor="contentHtml">
          Contenido
        </label>
        <textarea
          id="contentHtml"
          name="contentHtml"
          required
          minLength={40}
          rows={12}
          defaultValue={article?.contentHtml}
          className="rounded border border-zinc-300 px-3 py-2 font-mono text-sm leading-6 outline-none focus:border-red-700"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="seoTitle">
            SEO title
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            maxLength={180}
            defaultValue={article?.seoTitle ?? ""}
            className="min-h-12 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-black" htmlFor="keywords">
            Palabras clave
          </label>
          <input
            id="keywords"
            name="keywords"
            maxLength={300}
            placeholder="politica, comunidad, economia"
            defaultValue={article?.keywords.join(", ") ?? ""}
            className="min-h-12 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-700"
          />
        </div>
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
          defaultValue={article?.seoDescription ?? ""}
          className="rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </div>

      {state.message ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || categories.length === 0}
          className="min-h-12 rounded bg-zinc-950 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isPending
            ? "Guardando..."
            : article
              ? "Guardar cambios"
              : "Guardar borrador"}
        </button>
      </div>
    </form>
  );
}
