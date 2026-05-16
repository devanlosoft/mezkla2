"use client";

import { useState, type FormEvent } from "react";

export function NewsletterBox() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name") || undefined,
        email: formData.get("email"),
        consent: formData.get("consent") === "on",
      }),
    });
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    setIsSubmitting(false);
    setMessage(data?.message ?? "No se pudo registrar la suscripcion.");

    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <section className="rounded bg-zinc-950 px-5 py-6 text-white">
      <h2 className="text-2xl font-black">Recibe el resumen editorial</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">
        Una seleccion diaria de noticias, analisis y servicio publico.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
        <label className="sr-only" htmlFor="newsletter-name">
          Nombre
        </label>
        <input
          id="newsletter-name"
          name="name"
          placeholder="Nombre"
          className="min-h-11 rounded border border-zinc-700 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-red-500"
        />
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="newsletter-email">
            Correo electronico
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            className="min-h-11 rounded border border-zinc-700 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 rounded bg-red-700 px-4 text-sm font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-600"
          >
            {isSubmitting ? "Enviando..." : "Suscribirme"}
          </button>
        </div>
        <label className="flex gap-2 text-xs leading-5 text-zinc-300">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-4 accent-red-700"
          />
          Acepto recibir comunicaciones editoriales de Mezkla2.
        </label>
      </form>
      {message ? (
        <p className="mt-3 text-xs font-semibold text-zinc-200">{message}</p>
      ) : null}
    </section>
  );
}
