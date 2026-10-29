# Klyraen — Multi-tenancy & Schema Design

**Status:** Phase 2 design artifact. The schema changes described here are
**not** implemented yet. Implementation is Phase 5's first PR
(`feat(db): implement tenancy and schema hardening`), gated on this document
being merged. The audit findings below are the spec for that PR.

## 1. Decision: shared database, shared schema, `tenant_id` on every tenant-scoped table

Klyraen is SaaS, multi-tenant from day one (see PRD §4). Three models were
considered:

| Model | Pros | Cons |
|---|---|---|
| **Shared schema + `tenant_id` column** (chosen) | Cheapest, one migration path, easiest ops, lowest connection-pool pressure | Every query must include `tenant_id` — one miss = data leak; needs rigorous enforcement |
| Schema-per-tenant | Stronger isolation, per-tenant backup/restore | Migration fan-out per tenant; connection-pool pressure at thousands of tenants; complex CI |
| Database-per-tenant | Strongest isolation; supports per-tenant pricing tiers | Very high ops cost; cross-tenant analytics near-impossible; overkill for MVP |

**Rationale:** Klyraen plans to reach thousands of tenants, not millions; the
expected scale (thousands of workspaces, tens of thousands of songs) is
comfortably within a single Postgres instance's capability for at least the
first 18–24 months. The isolation risk of shared-schema is mitigated by three
enforcement layers (§4). Migrating *from* shared-schema *to* a stronger model
later is possible; migrating *from* per-tenant databases *back* to shared is
painful. Starting at the lighter end is the standard SaaS trajectory.

## 2. Current-state audit (commit `b5f0cf4`)

The existing `prisma/schema.prisma` was written before the ERD and before the
PRD was signed off. It supports the current 3-user closed beta but cannot pass
the Phase 5 gate. Findings, by severity:

### 2.1 Tenancy

| # | Finding | Severity |
|---|---|---|
| A1 | No `Tenant` model — tenancy has no home | Critical |
| A2 | No `Membership` model — no user↔tenant join | Critical |
| A3 | No `tenantId` column on any table — every query is effectively global | Critical |
| A4 | `User.credits` is per-user; in a multi-tenant product credits belong per-tenant (or accrued in `UsageRecord`) | High |

### 2.2 Missing MVP models

| # | Finding | Backlog | Severity |
|---|---|---|---|
| B1 | No `Song` model — M4 (library + playback) has nowhere to store song metadata | M4 | Critical |
| B2 | No `Asset` model — audio is a single string on `Generation`; no support for stems, variants, or retention | M5 | Critical |
| B3 | No `Subscription` model — M6 (billing) has nowhere to store Stripe customer/subscription IDs | M6 | Critical |
| B4 | No `UsageRecord` model — M7 (per-plan limits) cannot meter usage over time | M7 | Critical |

### 2.3 Indexes and constraints

| # | Finding | Severity |
|---|---|---|
| C1 | `Generation.status` not indexed — the worker's "find next queued job" poll is a full-table scan | Medium |
| C2 | `Generation` indexed only by `userId` — "my generations, newest first" filesorts | Low |
| C3 | `ProductEvent` indexed only by `userId`; per-generation analytics scans | Low |
| C4 | `BetaFeedback` has no indexes — every filter/sort is a full scan | Low |
| C5 | `BetaFeedback` has no `createdAt` — cannot sort by recency; likely a bug already | Medium |

### 2.4 Data integrity

| # | Finding | Severity |
|---|---|---|
| D1 | `Generation.status` is `String`; should be a Prisma `enum` — typos silently become bad data | Medium |
| D2 | `Generation.provider` is required; insertion fails if the provider field is not set at creation time. Should be `String?` or `@default("mock")` | Medium |
| D3 | `ProductEvent.generation` and `BetaFeedback.generation` relations have no explicit `onDelete` behavior | Low |

## 3. Target schema

See `docs/schema/erd.mmd` for the full diagram. High-level shape:

- **`Tenant`** — every row in every other table belongs to a tenant.
- **`User`** — global identity, tied to Clerk via `clerkId`. A user can be a member of multiple tenants.
- **`Membership`** — user↔tenant join, with a `role` field (`owner`, `admin`, `member`). Enforces the master-prompt rule that every query for tenant data checks membership.
- **`Generation`** — one row per generation *request*; carries `tenantId` and `userId`. Status is an enum.
- **`Song`** — one row per completed song; 1-to-1 with `Generation` via `generationId @unique`. Splitting `Song` from `Generation` lets a user regenerate a section (Could-Have C2) without losing the original generation record.
- **`Asset`** — audio files (master now; stems later via `kind`); carries `tenantId` directly so asset queries don't need a join.
- **`Subscription`** — one per tenant, stores Stripe IDs and current plan.
- **`UsageRecord`** — append-only metering (generations, storage bytes, API calls) per tenant.
- **`ProductEvent`** — existing analytics table; gains `tenantId`.
- **`BetaFeedback`** — existing feedback table; gains `tenantId` and `createdAt`.

## 4. Enforcement rules (Phase 5 acceptance criteria)

The schema alone does not enforce tenancy. Three layers must hold:

1. **Schema layer.** Every tenant-scoped model has `tenantId String @db.Uuid` and at minimum `@@index([tenantId, createdAt])`.
2. **Query layer.** Every Prisma query in `app/api/**` must go through `requireTenantId()` (see `lib/db/tenant.ts` — to be written in Phase 5). Code review rule: a route handler may only call `prisma.<model>.*` after obtaining a `tenantId` from `requireTenantId()`; grep for `prisma\.` and confirm the `where:` clause includes `tenantId`.
3. **Database layer (defense in depth).** Postgres Row-Level Security enabled on all tenant tables; app-role's `current_setting('app.tenant_id')` set per transaction. If an app-layer bug omits the filter, RLS still blocks cross-tenant reads. RLS setup is a Phase 5 addendum — not in this Phase 2 PR, but documented here so the Phase 5 PR has the full spec.

## 5. Migration plan (Phase 5, one PR)

The Phase 5 PR titled `feat(db): implement tenancy and schema hardening` does:

1. Rewrite `prisma/schema.prisma` to match `erd.mmd`. All audit findings A1–D3 addressed.
2. Generate migration `0003_tenancy_and_hardening` via `npx prisma migrate dev --name tenancy_and_hardening`.
3. Backfill script (only if the 3 beta users have generations worth keeping):
   - Create one `Tenant` per existing `User` (personal workspace).
   - Create a `Membership` row per (user, their new tenant).
   - Set `tenantId` on every existing `Generation`, `ProductEvent`, `BetaFeedback`.
   - Backfill `BetaFeedback.createdAt` from the nearest event timestamp, or `now()` if unknown.
4. Run the migration on a local Postgres + on the staging review app before merging.
5. Add `lib/db/tenant.ts` (`requireTenantId` helper) in the same PR — no merged schema change ships without its enforcement layer.
6. Add grep-based CI check (or PR review checklist item) that no route handler calls `prisma.<model>.<op>` without `tenantId` in the `where`.

## 6. What this Phase 2 PR does *not* do

- It does not modify `prisma/schema.prisma`.
- It does not create any migrations.
- It does not modify any application code.
- It does not touch production or staging databases.

This is **design-only**. Implementation is deferred to Phase 5 for reviewability
and to keep the schema-migration risk isolated in its own PR.