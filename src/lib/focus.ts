/**
 * Clicking a button with the mouse leaves it focused, so the next Space/Enter
 * goes to that button instead of the session's keyboard shortcuts — press the
 * speaker, then Space replays the audio rather than flipping the card. Drop the
 * focus after a pointer click only: a keyboard activation reports `detail === 0`
 * and must keep its focus ring where the user put it.
 */
export function blurAfterPointerClick(e: { detail: number; currentTarget: EventTarget | null }) {
  if (e.detail === 0) return
  const el = e.currentTarget
  if (el instanceof HTMLElement) el.blur()
}
