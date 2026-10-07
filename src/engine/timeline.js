// Delayed callbacks that can be cancelled all at once (restart, end of session).
export function createTimeline() {
  let ids = [];
  return {
    later(fn, ms) {
      const id = setTimeout(fn, ms);
      ids.push(id);
      return id;
    },
    clearAll() {
      ids.forEach(clearTimeout);
      ids = [];
    }
  };
}
