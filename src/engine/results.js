// Sends one anonymous result of a finished room to the shared table (Supabase).
// The key below is public by design: it can only call public.submit_run(), which
// accepts a room id, room version, first/repeat flag and a report of numbers,
// and can only insert. No names, accounts or addresses are sent.
// Never blocks or breaks the game: any failure is ignored.
const ENDPOINT = 'https://rkvdwzlymmewsxjysgma.supabase.co/rest/v1/rpc/submit_run';
const PUBLIC_KEY = 'sb_publishable_w6g0x6vgIM-AfAx-XDWyEw_Kqpm3nAN';

export function sendResult(room, version, firstRun, report) {
  return post(ENDPOINT, { p_room: room, p_version: version, p_first: firstRun, p_report: report });
}

// Playtest feedback (answers plus run measures), only in playtest mode.
export function sendPlaytest(room, version, report) {
  return post(ENDPOINT.replace('submit_run', 'submit_playtest'), { p_room: room, p_version: version, p_report: report });
}

function post(url, body) {
  try {
    return fetch(url, {
      method: 'POST',
      headers: { apikey: PUBLIC_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true
    }).then(r => r.ok).catch(() => false);
  } catch (e) {
    return Promise.resolve(false);
  }
}

// Whether this browser has finished this room before (first vs repeat runs must
// never be mixed in the statistics). Storage may be unavailable: then "first".
export function markPlayed(room) {
  const key = `object.played.${room}`;
  let before = false;
  try { before = localStorage.getItem(key) === '1'; localStorage.setItem(key, '1'); } catch (e) { /* private mode */ }
  return !before;
}
