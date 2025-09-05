Readme Generator is a full‑stack Next.js app that scores, improves, and manages README files with AI assistance.

Live: https://readme-seo.vercel.app/

## What This Project Delivers

- ETL: Extracts README/context from GitHub, transforms with AI, loads into the editor/DB.
- Full‑stack: Next.js App Router UI + API routes + Supabase Postgres.
- Deployed: Production at https://readme-seo.vercel.app/ (Vercel).
- Database: Supabase with RLS, tables for `readmes`.
- Secure: Auth via Supabase, RLS‑protected tables, protected routes, server‑side env usage, minimal analytics PII.
- ICP Fit (Sita): Helps devs and teams quickly produce clear docs that reduce “where is this?” questions and speed onboarding, which helps search engines fine the right codebase and code sections faster.
- Design: Clean, responsive UI using Tailwind, dark mode, consistent components.
- Analytics: PostHog event tracking for usage, success, and UX flows.

## Architecture

- UI: Next.js 15 App Router (pages in `src/app/`), Tailwind components in `src/components/`.
- API: Route handlers under `src/app/api/*`:
  - `POST /api/score` — scores a README via Claude.
  - `POST /api/optimize` — improves README; can pull repo context via GitHub API.
  - `GET/POST /api/readmes` — CRUD for saved READMEs (auth required).
- Data: Supabase Postgres (`readmes`, `templates`, `analytics`) with Row‑Level Security.
- Auth: Supabase SSR/Browser clients; middleware gatekeeps protected pages.
- Analytics: PostHog initialized in a provider; auth identification without PII content.

## ETL Flow (concise)

- Extract: Optionally fetches repository files and current README via GitHub API in `api/optimize`.
- Transform: Uses Anthropic Claude to score/improve markdown (`api/score`, `api/optimize`).
- Load: Saves edits/optimized output to Supabase (`src/lib/database/readmes.ts`) and the in‑app editor.

## Security Posture

- Auth required for user data APIs (`requireApiAuth`), protected routes via `middleware.ts`.
- Supabase RLS policies restrict rows to the owner only (see `supabase/schema.sql`).
- Secrets stay server‑side: `CLAUDE_KEY`, `GITHUB_TOKEN`; client reads only `NEXT_PUBLIC_*`.
- Analytics is metadata‑only; no README content sent to PostHog.

## ICP Fit (Sita)

- Target users: developers in large or confusing codebases, new hires, scaling teams.
- Pain solved: faster onboarding, fewer “where is this?” pings, less time spelunking.
- Why this app: generates clear, current READMEs that make codebases navigable.

## Design Notes

- Tailwind for speed and consistency; responsive layouts and dark mode.
- Reusable UI components; focused editor and review flows.
- Friendly defaults; avoids visual clutter to highlight content quality.

## Analytics (PostHog)

- Provider: initializes PostHog and captures `$pageview`/`$pageleave`.
- Auth identify/reset: domain‑only props; ties events to sessions without PII.
- Key events: `score_*`, `optimize_*`, `readme_saved`, `optimized_applied_to_editor`.
- Purpose: understand usage funnels, success/latency, and feature adoption.

## Tools & Rationale

- Next.js (App Router): modern full‑stack framework with file‑based routes and edge‑ready APIs.
- TypeScript: safer refactors and API contracts.
- Supabase (Postgres + Auth): fast hosted DB with RLS; simple SSR/Client SDKs.
- Anthropic Claude: strong instruction‑following for structured README outputs.
- GitHub API: ground responses in real repo context when available.
- PostHog: product analytics without vendor lock‑in; web‑first SDK.
- Tailwind CSS: rapid, consistent UI without bespoke design system overhead.
- Vercel: zero‑config deploys, preview environments, and caching.

## Build Process (summary)

- Define schema and RLS (Supabase) and auth gating.
- Implement editor, scoring, and optimization flows end‑to‑end.
- Add PostHog analytics and event taxonomy.
- Polish UI with Tailwind components and dark mode.
- Deploy to Vercel; wire environment variables per environment.

