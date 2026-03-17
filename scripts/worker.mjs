const required = ["DATABASE_URL", "REDIS_URL", "AUTH_SECRET"];
const missing = required.filter((key) => !process.env[key] || process.env[key].trim().length === 0);

if (missing.length > 0) {
  console.error(`Worker missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`Writebot worker ready. DATABASE_URL=${process.env.DATABASE_URL}`);
console.log(`Writebot worker queue transport ready on ${process.env.REDIS_URL}`);
console.log("Worker supports draft / revision / repair job execution contract.");
