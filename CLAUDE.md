# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server on :5173 (add -- --host to reach it from a phone)
npm run build            # tsc -b (typecheck) + vite build → dist/
npm run preview          # serve the production build
npm test                 # vitest watch mode
npm run test:run         # one-shot run (what CI does)
npm run test:run -- src/lib/sm2.test.ts          # single file
npm run test:run -- -t "interleaves new cards"   # single test by name
```

Node 22 (`.nvmrc`). There is no linter — `npm run build` is the typecheck gate.

## Architecture

Single-page React app, no backend, no router library. Everything the user does persists to `localStorage`.

**View state lives in `src/App.tsx`.** A single `view` union (`loading | error | home | session | complete | words | verbs`) drives which screen renders. `App.tsx` also owns `cards`, `cardStates`, `settings`, `queue`, and `stats` — the components under `src/components/` are presentational and receive callbacks.

**Routing is hand-rolled and only `/verbs` has a real URL.** `pathToInitialView` / `viewToPath` / the `popstate` listener in `App.tsx` map between the two. `words`, `session`, and `complete` intentionally share `/`. Adding a URL-addressable view means touching all three of those plus the Vite `rollupOptions.input` map (see below).

**Multi-page build.** `vite.config.ts` declares two HTML inputs: `index.html` and `verbs/index.html`. Both load the same `src/main.tsx` bundle; they exist separately so each route gets its own `<title>` and OG meta tags for link previews. Keep the two files' meta blocks in sync when changing site-level metadata. On GitHub Pages the deploy workflow copies `dist/index.html` → `dist/404.html` as the SPA fallback.

**Deck data is remote and cached forever.** `src/lib/deck.ts` fetches a TSV wordlist from jsDelivr (the upstream `patsytau/anki_german_a1_vocab` repo), parses it by column position, derives each card's audio URL as `audio/tts-<id>.mp3`, and caches the parsed array under `a1fc_deck_cache`. The cache is never invalidated automatically — `clearDeckCache()` exists for that. No vocabulary is bundled in this repo.

**Scheduling — `src/lib/sm2.ts`.** SM-2 variant over `CardState` (repetitions, easeFactor, interval, dueDate, status, lapses). Pure functions, day-granular: `today()` zeroes the time, `isDue` compares against it. Ease factor is clamped to `[1.3, 3.5]`.

**Session queue — `src/lib/session.ts`.** `buildQueue` partitions cards into new / due-learning / due-review, applies the `FilterMode`, caps by `newCardsPerSession` and `maxReviewsPerSession`, and `interleave`s one new card after every 5 reviews. Note `App.handleRate` mutates the queue afterwards: an `again` rating re-inserts the card ~4 positions later, so the queue shrinks non-monotonically.

**Persistence — `src/lib/storage.ts`.** Keys are `a1fc_card_states`, `a1fc_settings`, `a1fc_deck_cache`. `loadSettings` spreads over `DEFAULT_SETTINGS`, so adding a new setting is backwards-compatible with existing users — add the field to `Settings` in `src/types.ts` *and* to `DEFAULT_SETTINGS`.

**Theme — `src/lib/theme.ts` + Tailwind `darkMode: 'class'`.** `applyTheme` is called once in `src/main.tsx` *before* React mounts to avoid a flash of the wrong scheme; `App.tsx` re-applies on change and subscribes to the system media query while the preference is `system`. Every new UI element needs explicit `dark:` variants — there are no semantic color tokens, screens use raw `slate-*` / `indigo-*` classes directly.

**Verbs — `src/data/verbs.ts`.** A hand-maintained array of present-tense conjugations, independent of the fetched deck. `verbs.test.ts` enforces shape invariants (all six pronoun forms present, valid category, unique infinitives, non-empty example), so adding a verb means matching that structure exactly.

## Tests

Vitest + jsdom, `globals: false` — import `describe`/`it`/`expect` from `vitest` explicitly. Tests sit next to their source as `*.test.ts` and cover the `src/lib/` logic plus verb-data integrity; components are untested.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and publishes to GitHub Pages at german-a1.lucasrenan.com (`public/CNAME`).
