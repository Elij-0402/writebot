# Contributing

## Development Standards

- Keep the product workflow-first and author-control-first.
- Do not introduce chat-first primary flows.
- Do not let unapproved output update durable canon.

## Before Opening a PR

Run the full local verification set:

```bash
pnpm vitest
pnpm playwright test
pnpm build
pnpm prisma validate
```

## Provider And Self-Host Notes

- Keep provider integration behind the product-owned abstraction.
- Document any new env variables in `.env.example`.
- Preserve self-host-first support when changing runtime behavior.
