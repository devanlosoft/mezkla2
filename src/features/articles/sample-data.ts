export type ArticleSummary = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  slug: string;
  views: number;
};

export const featuredArticle: ArticleSummary = {
  id: "featured-1",
  title: "La agenda ciudadana marca el pulso de una nueva semana decisiva",
  subtitle:
    "Comunidades, autoridades y sectores productivos llegan con propuestas sobre seguridad, movilidad, educación y desarrollo local.",
  category: "Actualidad",
  author: "Redaccion Mezkla2",
  publishedAt: "16 mayo 2026",
  readTime: "5 min",
  imageUrl:
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80",
  slug: "agenda-ciudadana-semana-decisiva",
  views: 2480,
};

export const secondaryArticles: ArticleSummary[] = [
  {
    id: "secondary-1",
    title: "Educacion publica anuncia nuevas rutas de acompanamiento escolar",
    subtitle:
      "El plan prioriza permanencia estudiantil, conectividad y apoyo psicosocial en zonas urbanas y rurales.",
    category: "Educacion",
    author: "Laura Medina",
    publishedAt: "16 mayo 2026",
    readTime: "4 min",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    slug: "educacion-rutas-acompanamiento-escolar",
    views: 1320,
  },
  {
    id: "secondary-2",
    title: "Emprendedores locales convierten la tecnologia en motor de empleo",
    subtitle:
      "Nuevos proyectos digitales buscan abrir oportunidades para jovenes y pequenos negocios.",
    category: "Tecnologia",
    author: "Mateo Rios",
    publishedAt: "15 mayo 2026",
    readTime: "6 min",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    slug: "emprendedores-tecnologia-empleo",
    views: 1110,
  },
];

export const latestArticles: ArticleSummary[] = [
  {
    id: "latest-1",
    title: "Hospitales fortalecen protocolos para atencion prioritaria",
    subtitle: "La red de salud ajusta turnos y canales de orientacion.",
    category: "Salud",
    author: "Diana Perez",
    publishedAt: "16 mayo 2026",
    readTime: "3 min",
    imageUrl:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=80",
    slug: "hospitales-protocolos-atencion-prioritaria",
    views: 890,
  },
  {
    id: "latest-2",
    title: "Sector turismo prepara temporada con agenda cultural ampliada",
    subtitle: "Operadores anuncian recorridos, gastronomia y programacion familiar.",
    category: "Turismo",
    author: "Camila Torres",
    publishedAt: "16 mayo 2026",
    readTime: "4 min",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    slug: "turismo-temporada-agenda-cultural",
    views: 760,
  },
  {
    id: "latest-3",
    title: "Liga local confirma calendario de finales regionales",
    subtitle: "Los encuentros se jugaran con aforo controlado y transmision digital.",
    category: "Deportes",
    author: "Julian Castro",
    publishedAt: "15 mayo 2026",
    readTime: "2 min",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80",
    slug: "liga-local-calendario-finales",
    views: 690,
  },
];

export const opinionArticles: ArticleSummary[] = [
  {
    id: "opinion-1",
    title: "La confianza tambien se construye con informacion verificable",
    subtitle:
      "Una sala de redaccion moderna necesita velocidad, contexto y transparencia.",
    category: "Opinion",
    author: "Ana Beltran",
    publishedAt: "15 mayo 2026",
    readTime: "5 min",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80",
    slug: "confianza-informacion-verificable",
    views: 1020,
  },
];

export const allSampleArticles = [
  featuredArticle,
  ...secondaryArticles,
  ...latestArticles,
  ...opinionArticles,
];

export const categories = [
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
