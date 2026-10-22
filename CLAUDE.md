# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server on :5173 (add -- --host to reach it from a phone)
npm run build            # tsc -b (typecheck) + vite build → dist/
npm run preview          # serve the production build
npm run lint             # eslint (src/ only)
npm run format           # prettier --write .
npm run format:check     # prettier --check . (no writes)
npm test                 # vitest watch mode
npm run test:run         # one-shot run (what CI does)
npm run test:run -- src/lib/sm2.test.ts          # single file
npm run test:run -- -t "interleaves new cards"   # single test by name
```

Node 22 (`.nvmrc`). `npm run build` is the typecheck gate; `npm run lint` and `npm run test:run` are the CI gates.

## Architecture

Single-page React app, no backend, no router library. Everything the user does persists to `localStorage`.

**View state lives in `src/App.tsx`.** A single `view` union (`loading | error | home | session | complete | words | verbs`) drives which screen renders. `App.tsx` also owns `cards`, `cardStates`, `settings`, `queue`, and `stats` — the components under `src/components/` are presentational and receive callbacks.

**Routing is hand-rolled and only `/verbs` has a real URL.** `pathToInitialView` / `viewToPath` / the `popstate` listener in `App.tsx` map between the two. `words`, `session`, and `complete` intentionally share `/`. Adding a URL-addressable view means touching all three of those plus the Vite `rollupOptions.input` map (see below).

**Multi-page build.** `vite.config.ts` declares two HTML inputs: `index.html` and `verbs/index.html`. Both load the same `src/main.tsx` bundle; they exist separately so each route gets its own `<title>` and OG meta tags for link previews. Keep the two files' meta blocks in sync when changing site-level metadata. On GitHub Pages the deploy workflow copies `dist/index.html` → `dist/404.html` as the SPA fallback.

**Deck data is vendored and cached forever.** The wordlist and TTS audio live in `public/deck/` (copied from `codeberg.org/patrizia/anki_german_a1_vocab`, CC BY-SA 4.0 — attribution lives in the README and the served `LICENCE.md` / `SOURCE.md`). Refresh them with `./scripts/sync-deck.sh`; don't hand-edit. `src/lib/deck.ts` fetches `/deck/wordlist.tsv`, parses it by column position, and caches the parsed array under `a1fc_deck_cache_v2`. Audio URLs (`/deck/audio/tts-<id>.mp3`) are re-derived from the id on every load, including from cache. The cache is never invalidated automatically — bump the key suffix when the TSV changes so existing users re-fetch. Card ids are the upstream Anki note ids and key `a1fc_card_states`, so they must stay stable across syncs.

**Scheduling — `src/lib/sm2.ts`.** SM-2 variant over `CardState` (repetitions, easeFactor, interval, dueDate, status, lapses). Pure functions, day-granular: `today()` zeroes the time, `isDue` compares against it. Ease factor is clamped to `[1.3, 3.5]`.

**Session queue — `src/lib/session.ts`.** `buildQueue` partitions cards into new / due-learning / due-review, applies the `FilterMode`, caps by `newCardsPerSession` and `maxReviewsPerSession`, and `interleave`s one new card after every 5 reviews. Note `App.handleRate` mutates the queue afterwards: an `again` rating re-inserts the card ~4 positions later, so the queue shrinks non-monotonically.

**Persistence — `src/lib/storage.ts`.** Keys are `a1fc_card_states`, `a1fc_settings`, `a1fc_deck_cache_v2`. `loadSettings` spreads over `DEFAULT_SETTINGS`, so adding a new setting is backwards-compatible with existing users — add the field to `Settings` in `src/types.ts` _and_ to `DEFAULT_SETTINGS`.

**Theme — `src/lib/theme.ts` + Tailwind `darkMode: 'class'`.** `applyTheme` is called once in `src/main.tsx` _before_ React mounts to avoid a flash of the wrong scheme; `App.tsx` re-applies on change and subscribes to the system media query while the preference is `system`. Every new UI element needs explicit `dark:` variants — there are no semantic color tokens, screens use raw `slate-*` / `indigo-*` classes directly.

**Verbs — `src/data/verbs.ts`.** A hand-maintained array of present-tense conjugations, independent of the fetched deck. `verbs.test.ts` enforces shape invariants (all six pronoun forms present, valid category, unique infinitives, non-empty example), so adding a verb means matching that structure exactly.

## Tests

Vitest + jsdom, `globals: false` — import `describe`/`it`/`expect` from `vitest` explicitly. Tests sit next to their source as `*.test.ts` and cover the `src/lib/` logic plus verb-data integrity; components are untested.

## Lint and formatting

ESLint flat config in `eslint.config.js` (ESM): `js.configs.recommended` + `typescript-eslint`
recommended + react-hooks + react-refresh, with `eslint-config-prettier` **last** so no rule fights
Prettier. Only `src/**/*.{ts,tsx}` is linted — `vite.config.ts` and the `*.config.js` files are not.

`eslint-plugin-react-hooks` v7's recommended set is stricter than the classic
`rules-of-hooks`/`exhaustive-deps` pair: it also errors on render-time ref writes
(`react-hooks/refs`) and `setState` in an effect body (`react-hooks/set-state-in-effect`). Three
pre-existing patterns trip it and are suppressed per line with a `--` reason: the latest-value refs
in `App.tsx`, the session-complete transition effect in `App.tsx`, and the per-card reset effect in
`FlashCard.tsx`. Fixing any of them for real is a behavior refactor, not a lint fix. `FlashCard.tsx`
also carries a live `exhaustive-deps` warning (missing `playAudio`) — deliberately left visible;
warnings don't fail `eslint .`.

Prettier (`.prettierrc`) owns formatting repo-wide: single quotes, no semicolons, trailing commas
`all`, printWidth 100. Two overrides exist to protect hand-maintained layout, so don't drop them:

- `src/data/verbs.ts` → 140, keeping one `conjugation: { ... }` object per line.
- `*.html` → 160, keeping one `<meta>` per line so the two entry points stay easy to diff (see
  Multi-page build above).

## Deploy

Push to `main` → `.github/workflows/deploy.yml` runs `npm run lint` and `npm run test:run`, then builds and publishes to GitHub Pages at german-a1.lucasrenan.com (`public/CNAME`). The `deploy` job `needs: build`, so a lint or test failure blocks `deploy-pages`.
