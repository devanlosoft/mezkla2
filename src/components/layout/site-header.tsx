import Link from "next/link";

import { categories } from "@/features/articles/sample-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Mezkla2">
          <span className="grid size-9 place-items-center rounded bg-red-700 text-lg font-black text-white">
            M2
          </span>
          <span className="text-2xl font-black tracking-tight text-zinc-950">
            Mezkla2
          </span>
        </Link>
        <nav
          aria-label="Navegacion principal"
          className="hidden items-center gap-5 text-sm font-semibold text-zinc-700 lg:flex"
        >
          {categories.slice(0, 7).map((category) => (
            <Link
              key={category}
              href={`/categoria/${category.toLowerCase().replaceAll(" ", "-")}`}
              className="transition hover:text-red-700"
            >
              {category}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/buscar"
            className="rounded border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
          >
            Buscar
          </Link>
          <Link
            href="/admin"
            className="rounded bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-100 lg:hidden">
        <nav
          aria-label="Categorias"
          className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-2 text-sm font-semibold text-zinc-700 sm:px-6"
        >
          {categories.slice(0, 9).map((category) => (
            <Link
              key={category}
              href={`/categoria/${category.toLowerCase().replaceAll(" ", "-")}`}
              className="shrink-0"
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
