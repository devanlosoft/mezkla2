# Mezkla2

Mezkla2 is a modern digital newspaper and newsroom platform built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and role-based administration.

## Current Phase

Phase 1 is focused on project foundation:

- Next.js application scaffold.
- TypeScript strict mode.
- Tailwind CSS.
- Architecture documentation.
- Planned folder structure.
- Verification scripts.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Database

Prisma 7 uses `prisma.config.ts` for datasource configuration. Set a real PostgreSQL `DATABASE_URL` in `.env` before running migrations or seed commands.
To create the first administrator during seed, define `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, and optionally `SEED_ADMIN_NAME`.

```bash
npm run prisma:validate
npm run prisma:generate
npx prisma migrate dev
npm run prisma:seed
```

## Documentation

- [Architecture](docs/architecture.md)
- [Environment](docs/env.md)
- [Deployment](docs/deployment.md)

## Planned Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- NextAuth.js
- Zod
- TipTap
- Vitest
- Playwright
- Vercel
