import { APP_T } from './texts.ru.js';

// The consent every room starts with (ethics: informed consent, 18+, quit any time,
// recording only when chosen), on the clipboard sheet, one page after another: a page
// crowded with text leaves no room for its buttons. Pages: what this is, how to leave and
// who may take part; the room's own notes (extra, one page each); what recording means,
// with the two choices. Resolves with true when the player chose to start with recording,
// false for "start without recording". sheet: an engine/ui/sheet instance.
export async function askConsent(sheet, { kicker, extra = [] }) {
  const [first, ...rest] = APP_T.consent.pages;
  const pages = [first, ...extra.map((t) => [t]), ...rest];
  const page = (lines) => [{ t: kicker, role: 'kicker' }, ...lines.map((t, i) => ({ t, role: 'body', gap: i ? 0.012 : 0.025 }))];
  for (const lines of pages.slice(0, -1)) await sheet.choose(page(lines), [APP_T.next]);
  const picked = await sheet.choose(page(pages.at(-1)), [APP_T.consent.withRecording, APP_T.consent.withoutRecording]);
  return picked === 0;
}
