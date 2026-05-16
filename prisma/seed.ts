import {
  PrismaClient,
  RoleName,
  FeaturedSectionType,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const roles: Array<{ name: RoleName; description: string }> = [
  { name: "ADMIN", description: "Acceso total al sistema." },
  { name: "EDITOR", description: "Aprueba, publica y organiza contenidos." },
  { name: "JOURNALIST", description: "Crea y edita sus propias noticias." },
  { name: "CONTRIBUTOR", description: "Crea borradores para revision." },
  { name: "READER", description: "Acceso publico de lectura." },
];

const categories = [
  "Actualidad",
  "Politica",
  "Comunidad",
  "Cultura",
  "Deportes",
  "Educacion",
  "Salud",
  "Economia",
  "Turismo",
  "Opinion",
  "Judicial",
  "Tecnologia",
  "Medio ambiente",
];

const featuredSections: Array<{
  name: string;
  slug: string;
  type: FeaturedSectionType;
  sortOrder: number;
}> = [
  { name: "Principal", slug: "principal", type: "HERO", sortOrder: 1 },
  { name: "Secundarias", slug: "secundarias", type: "SECONDARY", sortOrder: 2 },
  { name: "Opinion", slug: "opinion", type: "OPINION", sortOrder: 3 },
  { name: "Tendencias", slug: "tendencias", type: "TRENDING", sortOrder: 4 },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(category) },
      update: { name: category, isActive: true },
      create: {
        name: category,
        slug: slugify(category),
        description: `Noticias de ${category.toLowerCase()} en Mezkla2.`,
        isActive: true,
      },
    });
  }

  for (const section of featuredSections) {
    await prisma.featuredSection.upsert({
      where: { slug: section.slug },
      update: {
        name: section.name,
        type: section.type,
        sortOrder: section.sortOrder,
        isActive: true,
      },
      create: {
        name: section.name,
        slug: section.slug,
        type: section.type,
        sortOrder: section.sortOrder,
        isActive: true,
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      siteName: "Mezkla2",
      description:
        "Periodico digital moderno para actualidad, opinion, multimedia y comunidad.",
    },
    create: {
      id: "default",
      siteName: "Mezkla2",
      description:
        "Periodico digital moderno para actualidad, opinion, multimedia y comunidad.",
      commentsEnabled: false,
      adsEnabled: true,
    },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME?.trim() || "Administrador";

  if (adminEmail && adminPassword) {
    if (adminPassword.length < 12) {
      throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
    }

    const adminRole = await prisma.role.findUniqueOrThrow({
      where: { name: "ADMIN" },
    });
    const passwordHash = await hash(adminPassword, 12);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: adminName,
        passwordHash,
        status: "ACTIVE",
        roleId: adminRole.id,
      },
      create: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        status: "ACTIVE",
        roleId: adminRole.id,
      },
    });

    await prisma.authorProfile.upsert({
      where: { userId: admin.id },
      update: {
        slug: slugify(adminName),
        title: "Administrador",
      },
      create: {
        userId: admin.id,
        slug: slugify(adminName),
        title: "Administrador",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
