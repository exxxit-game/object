// How many draw calls one view of a place costs, at its worst. Quest 2, the weakest headset whose
// budget the game keeps (docs/owner-decisions.md), wants fewer than 100 a frame (Meta, device
// optimization comparison: docs/research/vr/01-meta.md), and in VR each eye draws its own view (no
// multiview in A-Frame 1.7.1: src/rooms/01-control/scene.js), so a view must stay under 50.
// The corridor is under it since parts that differ only in colour are merged (merge-static.js).
// Room 01 is not yet: about half of its worst view is the corridor behind its shut door, drawn
// although the walls hide it (docs/board.md). VIEW_BUDGET holds each place near its measure so it
// cannot grow unseen while that work goes on; each comes down with it.
// A budget kept only in memory grew unseen, so the smoke test measures it on every push.
// Runs in the page (the smoke test passes it to page.evaluate): self-contained, it uses only the
// page's THREE and document. eyes: boxes [[x0, y0, z0], [x1, y1, z1]] where an eye can be; the
// views stand at their middle and at the middle of each half along the longer side, at standing
// eye height (1.6 m, or the box's top), looking every 45 degrees round, level. The worst view's
// calls are counted by the nearest entity with an id that holds each drawn mesh (by): where the
// next cut is (Meta's order: measure first, then merge: docs/research/revision-4-graphics.md).
export const QUEST2_VIEW = 50;
export const VIEW_BUDGET = { corridor: QUEST2_VIEW, room: 65 };
export function drawCalls({ eyes: boxes } = {}) {
  if (!boxes || !boxes.length) throw new Error('drawCalls: where an eye can be is not given');
  const sceneEl = document.querySelector('a-scene'), renderer = sceneEl.renderer, own = sceneEl.camera;
  const cam = new THREE.PerspectiveCamera(own.fov, own.aspect, own.near, own.far);
  const look = (at, deg) => {
    cam.position.set(...at);
    cam.rotation.set(0, (deg * Math.PI) / 180, 0);
    cam.updateMatrixWorld(true);
    renderer.render(sceneEl.object3D, cam);
    return renderer.info.render.calls;
  };
  let worst = { calls: 0 }, from = null;
  for (const [[x0, y0, z0], [x1, y1, z1]] of boxes) {
    const y = Math.min(1.6, y1), along = x1 - x0 >= z1 - z0;
    const spots = [0.25, 0.5, 0.75].map((k) => (along ? [x0 + k * (x1 - x0), y, (z0 + z1) / 2] : [(x0 + x1) / 2, y, z0 + k * (z1 - z0)]));
    for (const at of spots) {
      for (let deg = 0; deg < 360; deg += 45) {
        const calls = look(at, deg);
        if (calls > worst.calls) { worst = { calls, at: at.map((v) => +v.toFixed(2)), deg }; from = at; }
      }
    }
  }
  if (!from) return worst;
  const by = {}, draw = renderer.renderBufferDirect;
  renderer.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    let p = object;
    while (p && !(p.el && p.el.id)) p = p.parent;
    const key = p ? p.el.id : 'scene';
    by[key] = (by[key] || 0) + 1;
    return draw.call(this, camera, scene, geometry, material, object, group);
  };
  try { look(from, worst.deg); } finally { renderer.renderBufferDirect = draw; }
  return { ...worst, by };
}
