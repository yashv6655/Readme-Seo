This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Analytics (PostHog)

Environment:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
# Optional: NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

Instrumentation summary:

- AnalyticsProvider: Initializes PostHog and sends page_view on route changes. Reason: measure navigation and drop‑offs between pages.
- Auth identify/reset: Identifies users on sign‑in, resets on sign‑out, using only email_domain and is_authenticated. Reason: tie events to users/orgs without storing PII.
- score_requested/succeeded/failed: In `src/app/readme-review/PageClient.tsx` around `/api/score`. Reason: measure usage, success rate, latency, and score outcome.
- optimize_requested/succeeded/failed: In `src/app/readme-review/PageClient.tsx` around `/api/optimize`. Reason: measure optimization usage, latency, and output size (transform step).
- optimized_applied_to_editor: In `src/app/readme-review/PageClient.tsx` when applying AI output. Reason: adoption of AI suggestions.
- readme_saved (+ autosave flag, delta_bytes): In `src/hooks/use-readme-persistence.ts`. Reason: persistence behavior, edit magnitude (load/store step).
- page_view super props: Sets environment for basic segmentation. Reason: split dev/preview/prod traffic.

Privacy: No README text is sent; only metadata like lengths, durations, status codes, and score values.
