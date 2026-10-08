// Shell: pick a room from ?room=NN-name (default 01-control) and mount it.
// No top-level await: older headset browsers cannot parse it and fail silently.
const DEFAULT_ROOM = '01-control';
const requested = new URLSearchParams(location.search).get('room');
const id = /^[\w-]+$/.test(requested || '') ? requested : DEFAULT_ROOM;

// A dark screen with no explanation is the worst failure, so show the error.
function showError(e) {
  console.error(e);
  const hint = document.getElementById('hint');
  hint.textContent = 'Error: ' + ((e && e.message) || e);
  hint.classList.add('show');
}

// Every text is drawn on a canvas in the game's own face (css/fonts.css), and a canvas drawn in a
// stand-in face is never redrawn: the room starts once the face, latin and cyrillic, is here, or
// after FONT_WAIT_MS with whatever arrived (a stand-in face beats a dark screen). The sample text
// holds a latin and a cyrillic letter, so both files load.
const FACES = ['400 16px Inter', '500 16px Inter', '600 16px Inter', '700 16px Inter'];
const FONT_WAIT_MS = 6000;
const SAMPLE = 'Aa ' + String.fromCodePoint(0x42f, 0x44f);
const fonts = Promise.all(FACES.map((f) => document.fonts.load(f, SAMPLE))).catch(() => {});
Promise.race([fonts, new Promise((r) => setTimeout(r, FONT_WAIT_MS))])
  .then(() => import(`./rooms/${id}/room.js`))
  .then((room) => room.mount())
  .catch(showError);
