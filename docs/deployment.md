# Deployment

The deployment target is Vercel with PostgreSQL hosted externally or through a managed provider.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run prod:check
npm run typecheck
npm run lint
npm run test
npm run build
```

## Database

```bash
npm run prisma:validate
npm run prisma:generate
npm run deploy:migrate
npm run prisma:seed
```

Run `npm run deploy:migrate` against the production `DATABASE_URL` before or during the first deployment. Run `npm run prisma:seed` only when you intentionally want to create/update baseline roles, categories, featured sections, site settings, and the optional seed administrator.

## Vercel

```bash
npm install -g vercel
vercel link
vercel env pull .env.local
npm run prod:check
npm run deploy:migrate
npm run build
vercel deploy --prod
```

- Add all required environment variables.
- Configure PostgreSQL connection string.
- Run Prisma migrations from a trusted machine or CI before production traffic uses a new schema.
- Confirm `NEXTAUTH_URL` matches the production domain.
- Generate `NEXTAUTH_SECRET` with a strong random value, for example `openssl rand -base64 32`.
- Confirm image remote patterns for the selected media provider.
- Run a production build before deploying.
