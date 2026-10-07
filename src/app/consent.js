import { APP_T } from './texts.ru.js';

// The consent screen every room starts with (ethics: informed consent, 18+,
// quit any time, recording only when chosen). Resolves with true when the player
// chose to start with recording, false for "start without recording".
// screen: a panel component; choice: an engine/ui/choice instance; screenTop:
// world height of the screen's top edge, so the buttons start under the text.
export function askConsent(screen, choice, { kicker, title, screenTop }) {
  const bottom = screen.write([
    { t: kicker, size: 34, color: '#9a968d', weight: 700, spacing: 8 },
    { t: title, size: 90, weight: 700, gap: 14 },
    ...APP_T.consent.lines.map((t, i) => ({ t, size: 36, color: '#c4c0b7', weight: 500, gap: i ? 10 : 22 }))
  ], { top: true });
  screen.el.dataset.textBottom = (screenTop - bottom).toFixed(3);
  return new Promise((resolve) => {
    choice.show([APP_T.consent.withRecording, APP_T.consent.withoutRecording], (i) => resolve(i === 0), screenTop - bottom - 0.05);
  });
}
