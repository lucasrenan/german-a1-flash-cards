# German A1 Flash Cards

A simple web app for studying German A1 vocabulary using spaced repetition.

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
- **Progress persists** in your browser's localStorage — no backend, no account
- **Mobile-friendly** responsive UI

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — dev server and bundler
- [Tailwind CSS](https://tailwindcss.com/) — styling
- Card data and audio are streamed from [jsDelivr CDN](https://www.jsdelivr.com/) (Anki deck repo on GitHub)

No backend. No tracking. Everything runs in the browser.

## Getting Started

### Prerequisites

- Node.js 20+ (tested with Node 22)
- npm

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

## How It Works

- **First load**: the app fetches the tab-separated wordlist from [jsDelivr](https://cdn.jsdelivr.net/) (mirroring the Anki deck repo) and caches it in localStorage. Audio files are streamed on demand from the same CDN.
- **SM-2 algorithm** in [`src/lib/sm2.ts`](src/lib/sm2.ts) updates each card's ease factor, interval, and due date after every rating.
- **Session queue** in [`src/lib/session.ts`](src/lib/session.ts) prioritises due reviews and interleaves new cards (every ~5 reviews).
- **Card states and settings** are persisted in localStorage under the `a1fc_*` keys.

To reset all progress, clear your browser's localStorage for the site.

## Credits

- **Vocabulary list**: [Anki German A1 Vocab](https://github.com/patsytau/anki_german_a1_vocab) by **patsytau** — based on the Goethe-Institut A1 wordlist (GOETHE-ZERTIFIKAT A1 - START DEUTSCH 1 - WORTLISTE).
- **Audio**: machine-generated using [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) by **Thorsten Müller** — a high-quality, free, offline German TTS voice.

Huge thanks to both authors for making these resources freely available.

## License

No license file is included yet — feel free to fork for personal use. If you'd like to use the source code in your own project, open an issue and I'll add a permissive license.

Note that the vocabulary data is **not** bundled in this repo — it's fetched from the upstream Anki deck repository at runtime, and remains under its original CC BY-SA 4.0 license.
