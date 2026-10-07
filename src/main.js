// Shell: pick a room from ?room=NN-name (default 01-ono) and mount it.
const DEFAULT_ROOM = '01-ono';
const requested = new URLSearchParams(location.search).get('room');
const id = /^[\w-]+$/.test(requested || '') ? requested : DEFAULT_ROOM;

const room = await import(`./rooms/${id}/room.js`);
room.mount();
