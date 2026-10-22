# German A1 Flash Cards

A simple web app for studying German A1 vocabulary using spaced repetition.

**Live app: [german-a1.lucasrenan.com](https://german-a1.lucasrenan.com/)**

## About

This is a **personal project** built for my own German learning. I wanted a lightweight, mobile-friendly flashcard app I could use anywhere — including on my phone while commuting — without depending on Anki or a heavyweight study platform.

It was **vibe-coded with Claude Code**: I described what I wanted, made design decisions along the way, and the code was written purely by Claude. I'm sharing the source publicly in case it's useful to anyone else, but I'm not actively maintaining it as a product.

## Features

- ~812 German A1 vocabulary cards with example sentences and machine-generated audio
- **SM-2 spaced repetition** — same algorithm Anki uses, with Again / Hard / Good / Easy ratings
- **Session-based study** with configurable new-card and review limits
- **Filter by status** — study only new, due, or learning cards
- **Browse all words** — paginated table view showing your progress per card (status + last rating)
- **Audio pronunciation** with adjustable playback speed (0.5×–1.25×)
- **Toggleable example sentences** — show or hide the example by default
- **Randomizable new-card order** — shuffle new cards instead of going in list order
- **Verbs reference page** (`/verbs`) — searchable, collapsible conjugation tables for common A1 verbs
- **Light / dark / system theme**
- **Progress persists** in your browser's localStorage — no backend, no account
- **Mobile-friendly** responsive UI

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — dev server and bundler
- [Tailwind CSS](https://tailwindcss.com/) — styling
- Card data and audio are vendored into [`public/deck/`](public/deck/) from the upstream Anki deck repo on Codeberg

No backend. No tracking. Everything runs in the browser.

## Getting Started

### Prerequisites

- Node.js 20+ (tested with Node 22)
- npm

The repo includes an [`.nvmrc`](./.nvmrc) pinning Node 22. If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use          # picks up the version from .nvmrc
# or, if you don't have it installed yet:
nvm install
```

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

To access from another device on your local network (e.g. your phone):

```bash
npm run dev -- --host
```

Vite will print a `Network:` URL — open that on your phone.

### Build for production

```bash
npm run build
```

The static site is output to `dist/`. You can deploy it to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.) or serve it locally:

```bash
npm run preview
```

### Run the tests

Unit tests cover the SM-2 algorithm, session queue, deck parser, storage, theme handling, and verb data integrity. They run with [Vitest](https://vitest.dev/) in a jsdom environment.

```bash
npm test          # watch mode
npm run test:run  # one-shot (CI)
```

Test files live next to the code they cover, as `*.test.ts`.

### Lint and format

[ESLint](https://eslint.org/) (flat config in [`eslint.config.js`](./eslint.config.js)) checks `src/`, and
[Prettier](https://prettier.io/) owns formatting ([`.prettierrc`](./.prettierrc)).

```bash
npm run lint          # ESLint
npm run format        # Prettier — rewrite files in place
npm run format:check  # Prettier — check only, no writes
```

`npm run lint` and `npm run test:run` both run in CI before the build, so a failure there
blocks the deploy.

## How It Works

- **First load**: the app fetches the tab-separated wordlist from `/deck/wordlist.tsv` (served from this site) and caches it in localStorage. Audio files are loaded on demand from `/deck/audio/`.
- **Updating the deck**: run `./scripts/sync-deck.sh` to re-copy the wordlist and audio from [upstream](https://codeberg.org/patrizia/anki_german_a1_vocab), then commit the diff. The upstream commit is recorded in `public/deck/SOURCE.md`.
- **SM-2 algorithm** in [`src/lib/sm2.ts`](src/lib/sm2.ts) updates each card's ease factor, interval, and due date after every rating.
- **Session queue** in [`src/lib/session.ts`](src/lib/session.ts) prioritises due reviews and interleaves new cards (every ~5 reviews).
- **Card states and settings** are persisted in localStorage under the `a1fc_*` keys.

To reset all progress, clear your browser's localStorage for the site.

## Ideas / Future Improvements

- **Export/import progress** — download `a1fc_card_states` + `a1fc_settings` as JSON, and reimport. Currently progress only lives in localStorage; clearing browser data or switching devices loses everything.
- **Streak / daily goal counter** on the home screen to drive study consistency.
- **Stats/progress view** — cards mastered vs. learning vs. new, review forecast for the next N days (data already tracked per card).
- **Offline support (PWA)** — add a manifest + service worker (`vite-plugin-pwa`) with cache-first strategy for the deck TSV and audio, so the app works with no/patchy connection (e.g. on the commute).
- **Deck cache invalidation** — the cache key is versioned (`a1fc_deck_cache_v2`) but must be bumped by hand when `public/deck/wordlist.tsv` changes. Deriving it from a content hash at build time would make that automatic.
- **"Cram before exam" mode** — study a manually chosen subset or historically-hard cards, bypassing SM-2 scheduling.

## Credits

- **Vocabulary list**: [Anki German A1 Vocab](https://codeberg.org/patrizia/anki_german_a1_vocab) by **patrizia** — based on the Goethe-Institut A1 wordlist (GOETHE-ZERTIFIKAT A1 - START DEUTSCH 1 - WORTLISTE).
- **Audio**: machine-generated using [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) by **Thorsten Müller** — a high-quality, free, offline German TTS voice.

Huge thanks to both authors for making these resources freely available.

## License

No license file is included yet — feel free to fork for personal use. If you'd like to use the source code in your own project, open an issue and I'll add a permissive license.

The vocabulary and audio in [`public/deck/`](public/deck/) are copied from the upstream Anki deck repository and remain under its original [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license (see [`public/deck/LICENCE.md`](public/deck/LICENCE.md)). That license applies to the deck data only, not to the app source.
