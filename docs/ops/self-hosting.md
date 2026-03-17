# Self-Hosting

## Minimum Runtime

- Next.js web app
- worker process via `pnpm selfhost:worker`
- PostgreSQL
- Redis
- validated env via `pnpm selfhost:check`

## Startup

```bash
pnpm selfhost:check
pnpm selfhost:start
pnpm selfhost:worker
```

## Container Assets

- `Dockerfile`
- `docker-compose.yml`
- `.github/workflows/ci.yml`
