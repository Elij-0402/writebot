# Operator Runbook

## Startup

1. Copy `.env.example` to `.env`.
2. Confirm `DATABASE_URL`, `REDIS_URL`, and `AUTH_SECRET` are set.
3. Run `pnpm selfhost:check`.
4. Start the web process with `pnpm selfhost:start`.
5. Start the worker process with `pnpm selfhost:worker`.

## Backup And Restore

- Back up PostgreSQL before upgrades.
- Keep a tested restore path for schema and data.

## Upgrade Flow

1. Pull the new release.
2. Back up PostgreSQL.
3. Run `pnpm prisma validate` and any migrations.
4. Restart the app.
5. Verify provider settings, project overview, and chapter flow.
