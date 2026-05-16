import Link from "next/link";
import type { Metadata } from "next";

import { getSampleCategories } from "@/features/articles/public-service";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Todas las secciones editoriales de Mezkla2.",
};

export default function CategoriesPage() {
  const categories = getSampleCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-black uppercase tracking-wide text-red-700">
          Secciones
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
          Categorias
        </h1>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="rounded border border-zinc-200 bg-white p-5 transition hover:border-red-700"
          >
            <h2 className="text-xl font-black text-zinc-950">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Ver noticias, analisis y contenidos recientes.
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
