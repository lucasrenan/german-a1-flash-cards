#!/usr/bin/env bash
# Vendor the upstream Anki deck (wordlist + TTS audio) into public/deck/.
# Upstream: https://codeberg.org/patrizia/anki_german_a1_vocab (CC BY-SA 4.0)
# Re-run to pull in upstream corrections, then commit the diff.
set -euo pipefail

REPO_URL='https://codeberg.org/patrizia/anki_german_a1_vocab.git'
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/deck"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --quiet "$REPO_URL" "$TMP/upstream"

rm -rf "$DEST"
mkdir -p "$DEST/audio"
cp "$TMP/upstream/Goethe Institute A1 Wordlist.txt" "$DEST/wordlist.tsv"
cp "$TMP/upstream/LICENCE.md" "$DEST/LICENCE.md"
cp "$TMP/upstream"/audio/tts-*.mp3 "$DEST/audio/"

COMMIT="$(git -C "$TMP/upstream" rev-parse HEAD)"
cat > "$DEST/SOURCE.md" <<MD
Vocabulary and audio copied from <https://codeberg.org/patrizia/anki_german_a1_vocab>
at commit \`$COMMIT\` by \`scripts/sync-deck.sh\`.

Licensed under CC BY-SA 4.0 (see LICENCE.md). Audio generated with Thorsten-Voice TTS.
MD

echo "Synced $(wc -l < "$DEST/wordlist.tsv" | tr -d ' ') rows and $(ls "$DEST/audio" | wc -l | tr -d ' ') audio files from $COMMIT"
