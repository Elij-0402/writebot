const required = ["DATABASE_URL", "REDIS_URL", "AUTH_SECRET"];

const missing = required.filter((key) => !process.env[key] || process.env[key].trim().length === 0);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`Environment validation passed for: ${required.join(", ")}`);
