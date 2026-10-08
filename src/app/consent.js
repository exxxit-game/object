import { APP_T } from './texts.ru.js';

// The consent every room starts with (ethics: informed consent, quit any time, recording only
// when chosen and only from 18), on the clipboard sheet, one page after another: a page
// crowded with text leaves no room for its buttons. Pages: what this is and how to leave; the
// room's own notes (extra, one page each); the age; what recording means, with the two choices.
// The age is asked, not stated: a sentence checks nothing (Steed et al. 2016 asked it; the BPS
// guidance for internet research sends a "no" to a page of its own with no way back): under 18
// the game starts without recording. Resolves with true when the player chose to start with
// recording, false otherwise. sheet: an engine/ui/sheet instance.
export async function askConsent(sheet, { kicker, extra = [] }) {
  const C = APP_T.consent;
  const [first, ...rest] = C.pages;
  const pages = [first, ...extra.map((t) => [t]), ...rest];
  const page = (lines) => [{ t: kicker, role: 'kicker' }, ...lines.map((t, i) => ({ t, role: 'body', gap: i ? 0.012 : 0.025 }))];
  for (const lines of pages.slice(0, -1)) await sheet.choose(page(lines), [APP_T.next]);
  if (await sheet.choose(page([C.age.ask]), [C.age.yes, C.age.no]) === 1) {
    await sheet.choose(page([C.minor]), [C.start]);
    return false;
  }
  const picked = await sheet.choose(page(pages.at(-1)), [C.withRecording, C.withoutRecording]);
  return picked === 0;
}
