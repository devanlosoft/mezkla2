# Mezkla2 Architecture

Mezkla2 is a digital newspaper and newsroom platform built as a modular Next.js application. The first production target is a functional editorial MVP with public news pages, category navigation, search, authentication, an admin panel, role-based access, SEO metadata, newsletter capture, advertising slots, and basic article analytics.

## Product Scope

The platform serves five user groups:

- Readers: consume articles, browse categories, search, share, and view multimedia content.
- Contributors: create draft articles.
- Journalists: create and edit their own articles.
- Editors: review, approve, publish, schedule, and feature articles.
- Administrators: manage users, roles, categories, tags, ads, settings, and statistics.

## Technical Stack

- Framework: Next.js App Router
- Language: TypeScript in strict mode
- Styling: Tailwind CSS
- UI system: shadcn/ui planned for reusable admin and form primitives
- Backend: Server Actions and Route Handlers where appropriate
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js planned for credentials and provider extensibility
- Validation: Zod
- Rich text editor: TipTap planned
- Media storage: configurable provider, initially Cloudinary or Supabase Storage
- Testing: Vitest for units and Playwright for end-to-end flows
- Deploy target: Vercel

## Application Layers

```txt
src/app
  Route tree, layouts, metadata, public pages, admin pages, route handlers.

src/components
  Shared UI components, layout elements, editorial blocks, admin widgets,
  forms, and SEO helpers.

src/features
  Domain modules for articles, categories, tags, users, media, newsletter,
  ads, and analytics.

src/lib
  Cross-cutting infrastructure: auth, permissions, Prisma client, validation,
  sanitization, SEO helpers, environment parsing, and rate limiting.

prisma
  Database schema, migrations, and seed data.

tests
  Unit and browser tests.
```

## Public Routing

- `/`: editorial homepage with featured story, latest articles, category sections, opinion, multimedia, trends, ads, and newsletter.
- `/noticia/[slug]`: article detail with NewsArticle schema, related stories, tags, sharing, ads, and most-read block.
- `/categoria/[slug]`: paginated category page with sorting and filters.
- `/categorias`: category directory.
- `/buscar`: advanced public search.
- `/autores` and `/autor/[slug]`: author directory and author profile.
- `/opinion`, `/multimedia`, `/mas-leidas`: editorial landing pages.
- `/contacto`, `/acerca`, `/privacidad`: institutional pages.

## Admin Routing

All admin routes live under `/admin` and must be protected by authentication middleware plus server-side permission checks.

- `/admin`: dashboard.
- `/admin/noticias`: article management.
- `/admin/noticias/nueva`: create article.
- `/admin/noticias/[id]/editar`: edit article.
- `/admin/categorias`: category management.
- `/admin/etiquetas`: tag management.
- `/admin/usuarios`: user and role management.
- `/admin/publicidad`: advertisement slots and campaigns.
- `/admin/estadisticas`: article and newsroom metrics.
- `/admin/configuracion`: site settings.

## Domain Model

Planned Prisma models:

- `User`
- `Role`
- `AuthorProfile`
- `Article`
- `Category`
- `Tag`
- `MediaAsset`
- `Advertisement`
- `NewsletterSubscriber`
- `Comment`
- `ArticleView`
- `SiteSettings`
- `FeaturedSection`

Core article states:

- `DRAFT`
- `REVIEW`
- `PUBLISHED`
- `SCHEDULED`
- `ARCHIVED`

Primary indexes should cover slugs, publication status, publication date, category, author, article views, and searchable fields.

## Permissions

Permissions are enforced in server code, not only by hiding UI controls.

- `ADMIN`: full access.
- `EDITOR`: publish, approve, schedule, feature, and organize content.
- `JOURNALIST`: create and edit owned articles.
- `CONTRIBUTOR`: create drafts only.
- `READER`: public read-only access.

## Security Baseline

- Validate environment variables before app startup paths rely on them.
- Validate all write inputs with Zod.
- Sanitize rich article HTML before persistence or rendering.
- Protect `/admin` with auth middleware.
- Check permissions inside mutations and route handlers.
- Use Prisma parameterization for database access.
- Rate limit login, newsletter, search, and view-tracking endpoints.
- Restrict upload MIME types and file sizes.
- Never expose secrets in client bundles.
- Return generic error messages to users and log actionable details server-side.

## SEO Baseline

- Dynamic metadata for articles, categories, authors, and search pages.
- Friendly unique slugs.
- Canonical URLs.
- Open Graph and Twitter Cards.
- Schema.org `NewsArticle` for article pages.
- `sitemap.ts` and `robots.ts`.
- Optimized images through `next/image`.
- Semantic HTML structure.

## Performance Baseline

- Mobile-first layout.
- Server-render public pages where possible.
- Paginate lists.
- Lazy-load non-critical media.
- Optimize and size images.
- Cache stable public reads where safe.
- Keep admin components separate from public bundles where possible.

## Implementation Phases

1. Project foundation, documentation, scripts, and structure.
2. Public layout, homepage shell, navbar, footer, and editorial components.
3. Prisma schema and PostgreSQL setup.
4. Authentication and role-based authorization.
5. Article CRUD and editorial workflow.
6. Rich text editor and media uploads.
7. Dynamic public pages for home, articles, categories, search, and authors.
8. Full admin panel.
9. Advanced SEO.
10. Advertising, newsletter, and statistics.
11. Unit and browser tests.
12. Performance hardening and Vercel deployment preparation.

