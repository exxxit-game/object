import { APP_T } from './texts.ru.js';

// The consent every room starts with (ethics: informed consent, 18+, quit any time,
// recording only when chosen), one screen after another: a screen crowded with text
// leaves no room for its buttons, and squeezed buttons get unreadable letters.
// Screens: what this is and how to leave; the room's own notes (extra, one screen
// each); what recording means, with the two choices. Only the small kicker heads
// them: the big title was on the welcome and would take a quarter of the board.
// Resolves with true when the player chose to start with recording, false for
// "start without recording". screen: a panel component; choice: an engine/ui/choice
// instance; screenTop: world height of the screen's top edge, so the buttons start
// under the text.
export async function askConsent(screen, choice, { kicker, screenTop, extra = [] }) {
  const [first, ...rest] = APP_T.consent.pages;
  const pages = [first, ...extra.map((t) => [t]), ...rest];
  const ask = (lines, labels) => {
    const bottom = screen.write([
      { t: kicker, size: 34, color: '#9a968d', weight: 700, spacing: 8 },
      ...lines.map((t, i) => ({ t, size: 36, color: '#c4c0b7', weight: 500, gap: i ? 10 : 22 }))
    ], { top: true });
    screen.el.dataset.textBottom = (screenTop - bottom).toFixed(3);
    return new Promise((resolve) => choice.show(labels, resolve, screenTop - bottom - 0.05));
  };
  for (const lines of pages.slice(0, -1)) await ask(lines, [APP_T.next]);
  const picked = await ask(pages.at(-1), [APP_T.consent.withRecording, APP_T.consent.withoutRecording]);
  return picked === 0;
}
