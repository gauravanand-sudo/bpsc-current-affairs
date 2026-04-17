# BPSC Pulse

A current-affairs web app concept for BPSC aspirants with:

- a card-first daily current-affairs feed
- category-wise and date-wise browsing
- daily quiz blocks
- an official-source crawler path for PIB, PMO, and President Secretariat content

## Product direction

The UI is intentionally designed to feel streak-based and habit-forming:

- `20 cards per day` style revision flow
- bold, mobile-friendly card stacks
- quick recall quiz rail
- exam-angle summaries instead of raw article dumps

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Crawl official sources

```bash
npm run crawl:official
```

Crawler output is written to:

```txt
data/official-updates.json
```

The app also exposes a simple endpoint:

```txt
/api/official-feed
```

If the crawler output does not exist yet, that endpoint falls back to preview content.

## Important note on official sites

During the first live integration pass:

- `presidentofindia.nic.in` responded to browser-like requests
- `pib.gov.in` returned `401/403` to straightforward server fetches
- one guessed `pmo.gov.in` listing URL was stale and needs refinement

That means the next crawler-hardening step is:

1. switch PIB fetching to stronger browser-like request handling
2. finalize a stable PMO listing endpoint
3. optionally use Playwright for sources that block normal HTTP clients

## Main files

- `src/app/page.tsx`
  The main hooked homepage/dashboard UI
- `src/lib/content.ts`
  Mock current-affairs cards and quiz data
- `src/lib/official-sources.ts`
  Source registry for official endpoints
- `scripts/fetch-official-updates.mjs`
  First-pass crawler script
- `src/app/api/official-feed/route.ts`
  JSON route for crawler output

## Current working name

`BPSC Pulse`

Backup name ideas:

- `CurrentEdge BPSC`
- `BPSC Daily Stack`
- `AffairsSprint`
