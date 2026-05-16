import { NextResponse } from "next/server";

import { newsletterSubscribeSchema } from "@/features/newsletter/validators";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        message: "La base de datos no esta configurada.",
      },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = newsletterSubscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Datos invalidos o consentimiento faltante.",
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const prisma = getPrismaClient();

  await prisma.newsletterSubscriber.upsert({
    where: { email: input.email.toLowerCase() },
    update: {
      name: input.name,
      consent: input.consent,
      isActive: true,
      source: "web",
    },
    create: {
      name: input.name,
      email: input.email.toLowerCase(),
      consent: input.consent,
      source: "web",
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Suscripcion registrada.",
  });
}
