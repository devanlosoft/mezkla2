const required = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];

const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(
    `Missing required production environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

try {
  new URL(process.env.DATABASE_URL);
  new URL(process.env.NEXTAUTH_URL);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

if (process.env.NEXTAUTH_SECRET.length < 32) {
  console.error("NEXTAUTH_SECRET must be at least 32 characters.");
  process.exit(1);
}

const seedPassword = process.env.SEED_ADMIN_PASSWORD;

if (seedPassword && seedPassword.length < 12) {
  console.error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

console.log("Production environment variables look valid.");
