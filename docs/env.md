# Environment

Create a local `.env` file from `.env.example` when database and auth providers are ready.

Required variables for the planned full stack:

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
UPLOAD_PROVIDER=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RATE_LIMIT_SECRET=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
SEED_ADMIN_NAME=
```

## Notes

- Do not commit real secrets.
- `DATABASE_URL` should point to PostgreSQL.
- `NEXTAUTH_SECRET` must be generated per environment.
- Upload provider credentials are optional until media upload is implemented.
- Production values should be configured in Vercel project settings.
- `SEED_ADMIN_*` values are optional and only used by `npm run prisma:seed`.
- `SEED_ADMIN_PASSWORD` must be at least 12 characters when provided.
