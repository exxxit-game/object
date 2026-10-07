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

import(`./rooms/${id}/room.js`)
  .then((room) => room.mount())
  .catch(showError);
