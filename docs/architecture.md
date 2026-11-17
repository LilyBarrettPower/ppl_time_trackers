# Architecture

This is the record of the agreed design and the reasons behind it. Update it when a decision changes.

## Hosting constraints (Cloudflare)

- The app runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`).
- Workers are short-lived isolates, so **nothing in memory survives between requests**. All persistent data goes in Supabase. The in-memory sample store is for local development only.
- Use web-standard APIs and avoid Node-only features such as reading files from disk at runtime.

## Domain model

```
Organisation ──< Member
     │
     └──< Client ──< Job ──< TimeEntry >── Member
```

| Entity       | Key fields                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Organisation | name, currency (NZD), gstRegistered, gstRateBps (1500), hoursPerDay (8), defaultHourlyRate, defaultDayRate      |
| Member       | name, email, role (`owner` / `admin` / `member`), active                                                        |
| Client       | name, contact details, currency, gstApplies, defaultHourlyRate, defaultDayRate, archived                        |
| Job          | client, name, status, **billingType** (`hourly` / `day` / `fixed`), hourlyRate?, dayRate?, fixedPrice?, budget? |
| TimeEntry    | job, member, date, start/end or durationMinutes, description, billable, **snapshot of billingType + rate**      |

## Business rules

- **Money** is stored as integer cents (`8500` = $85.00). This avoids floating-point errors.
- **Durations** are stored as integer minutes.
- **All prices are entered excl. GST.**
- **GST** is calculated once, on the subtotal (not per line), at `gstRateBps` (1500 = 15%). It applies only when the organisation is GST registered **and** the client has `gstApplies`. Overseas clients can be zero-rated.
- Totals display as **Subtotal (excl. GST) · GST · Total (incl. GST)**.
- **Billing types:**
  - Hourly: hours × hourly rate
  - Day rate: (hours ÷ hoursPerDay) × day rate. Time is always logged in hours, and days are the exact fraction.
  - Fixed: the fixed price. Time is still tracked, which gives an _effective hourly rate_.
- **Rate fallback:** time entry override → job rate → client default → organisation default.
- **Rate snapshot:** each time entry stores the rate and billing type in effect when it was saved, so later rate changes never alter past amounts.
- **Permissions:** every member sees all of the organisation's data, including amounts. Owners and admins can also manage members and settings.

## Code organisation

```
src/
├── app/            Routes only (thin pages). (app)/ = pages with the app shell
├── components/
│   ├── ui/         Generic building blocks (Button, Input, Card…)
│   ├── layout/     Sidebar, mobile nav, page header
│   └── <feature>/  clients/, jobs/, time/
├── lib/
│   ├── domain/     Pure business logic + tests. No React, no database imports.
│   ├── data/       Repository interfaces + implementations (sample now, Supabase later)
│   └── validation/ Zod schemas
└── types/          Shared TypeScript types
```

**Repository pattern:** pages and Server Actions call repository interfaces (e.g. `clientRepo.list()`), never the data source directly. Moving from sample data to Supabase means adding a new implementation and changing one line in `lib/data/index.ts`.

**Data flow:** Server Components read data, Server Actions (validated with Zod) change it, and Client Components are used only for interactivity (such as the timer).

**Next.js 16 note:** `cacheComponents` is enabled. Pages are pre-rendered where possible, and per-request data must sit inside `<Suspense>` or be cached with `"use cache"`. The docs are in `node_modules/next/dist/docs/`.

## Stages

1. ✅ Project setup
2. Types, Zod schemas, sample data, billing + GST functions with tests
3. App shell, UI components, "Viewing as" member switcher
4. Clients
5. Jobs (billing types, rates)
6. Time tracking (manual entry + timer)
7. Dashboard & reports
8. Team & settings
9. Supabase (schema, auth, row-level security, swap repository)
10. Deploy to Cloudflare
