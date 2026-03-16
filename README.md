# Writebot

Next.js app baseline for the Writebot novel agent console.

## Local Development

Install dependencies:

```bash
pnpm install
```

Create local env files:

```powershell
Copy-Item .env.example .env
```

Run the app:

```bash
pnpm dev
```

Run lint:

```bash
pnpm lint
```

Run the E2E test:

```bash
pnpm test:e2e
```

## Current Scope

Task 1 sets the app baseline and verifies that the home page redirects to `/projects`.
