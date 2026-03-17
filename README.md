# Writebot

Writebot is a Web-first, open-source author desk for Chinese web novel workflow creation. It is built around project/chapter workflow, provider-backed drafting, approval-gated canon updates, and self-host-first operation.

## Chinese Web Novel Workflow

The core path is `项目概览 → 章节工作区 → 历史记录/批准 → approved canon`. The golden fixture project is `龙渊纪事`, and the active chapter fixture is `第12章：夜渡寒江`.

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file:

```powershell
Copy-Item .env.example .env
```

3. Generate Prisma client:

```bash
pnpm prisma generate
```

4. Validate Prisma schema:

```bash
pnpm prisma validate
```

5. Run the app:

```bash
pnpm dev
```

6. Run unit and integration tests:

```bash
pnpm vitest
```

7. Run E2E tests:

```bash
pnpm playwright test
```

8. Run lint:

```bash
pnpm lint
```

## Provider Setup

1. Copy `.env.example` to `.env`.
2. Set `DEFAULT_PROVIDER`, `OPENAI_BASE_URL`, and any needed API keys.
3. Open `设置/模型接入` and save a provider profile such as `openai-compatible-local`.
4. Use protocol `chat`, `completions`, or `responses` according to the target endpoint.

## Self-Hosting

- Minimum baseline: web app + worker + PostgreSQL + Redis.
- Validate required runtime variables with `pnpm selfhost:check`.
- Start the app in validated self-host mode with `pnpm selfhost:start`.
- Start the worker in validated self-host mode with `pnpm selfhost:worker`.
- Docker assets live in `Dockerfile` and `docker-compose.yml`.
- Operational baseline is documented in `docs/ops/self-host-baseline.md`.

## Contributing

Contributor guidance lives in `CONTRIBUTING.md`. Please run `pnpm vitest`, `pnpm playwright test`, `pnpm build`, and `pnpm prisma validate` before opening a pull request.
