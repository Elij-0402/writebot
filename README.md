# Writebot

Next.js app for the Writebot novel agent console V1.

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

## Current Scope

- Repaired approval data model around `ApprovalBatch`
- Added workflow, approve, and projects API routes
- Added project dashboard, chapter workbench, and control pages
- Added unit, integration, and end-to-end coverage for the V1 flow
