# Job Time Tracker

A time tracker for contractor businesses. It manages clients, jobs and rates, records time, and calculates billable amounts (excl. and incl. GST).

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (planned) · Cloudflare Workers via OpenNext (planned)

See [docs/architecture.md](docs/architecture.md) for the design decisions and the stage plan.

## Getting started

Requires Node.js 22 or later.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command              | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start the dev server with hot reload           |
| `npm run build`      | Production build                               |
| `npm run typecheck`  | Check TypeScript types without building        |
| `npm run lint`       | Find likely bugs and bad patterns (ESLint)     |
| `npm run test`       | Run unit tests once (Vitest)                   |
| `npm run test:watch` | Re-run tests as files change                   |
| `npm run format`     | Auto-format all files (Prettier)               |
| `npm run check`      | Typecheck + lint + test + format check, in one |
