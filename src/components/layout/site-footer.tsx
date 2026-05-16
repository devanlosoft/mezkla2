import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <section>
          <h2 className="text-2xl font-black">Mezkla2</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
            Periodismo digital con foco en actualidad, comunidad, cultura,
            tecnologia, opinion y servicio publico.
          </p>
        </section>
        <nav aria-label="Institucional" className="grid gap-2 text-sm">
          <Link href="/acerca" className="hover:text-white">
            Acerca del medio
          </Link>
          <Link href="/contacto" className="hover:text-white">
            Contacto
          </Link>
          <Link href="/privacidad" className="hover:text-white">
            Politica de privacidad
          </Link>
        </nav>
        <section className="text-sm text-zinc-300">
          <p className="font-semibold text-white">Redaccion</p>
          <p className="mt-2">editorial@mezkla2.local</p>
          <p className="mt-4">© 2026 Mezkla2. Todos los derechos reservados.</p>
        </section>
      </div>
    </footer>
  );
}
