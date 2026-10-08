// A lit surface whose brightness follows a list of levels over time, e.g. a sign whose
// tube starts up. Tick-driven, so it plays in a headset (CSS and requestAnimationFrame
// do not run there). The entity's own mesh colour is scaled (an unlit canvas panel turns
// dark or bright) and an optional light follows. Keep every pattern under the flash rule
// (WCAG 2.3.1: tests/glow.test.mjs).
// <a-entity panel="..." glow="light: #signLight; lightMax: 1.2"></a-entity>
// el.components.glow.run([[0, 0], [0.2, 1]]) → Promise once the last level is reached;
// emits 'glow-rise' each time the level goes up (for a click sound).
AFRAME.registerComponent('glow', {
  schema: {
    light: { type: 'selector' },
    lightMax: { default: 1 },
    level: { default: 0 }   // level before run()
  },

  init() {
    this.keys = null;
    this.level = -1;
    this.el.addEventListener('object3dset', () => this.apply(this.data.level));
    if (this.el.getObject3D('mesh')) this.apply(this.data.level); // the panel may have made it already
  },

  apply(level) {
    if (level === this.level) return;
    if (level > this.level && this.level >= 0) this.el.emit('glow-rise', { level }, false);
    this.level = level;
    const mesh = this.el.getObject3D('mesh');
    if (mesh && mesh.material && mesh.material.color) mesh.material.color.setScalar(level);
    if (this.data.light) this.data.light.setAttribute('light', 'intensity', this.data.lightMax * level);
  },

  // not play(): A-Frame calls play() and pause() itself when an entity starts and stops
  run(keys) {
    this.keys = keys;
    this.started = null;
    return new Promise((resolve) => { this.done = resolve; });
  },

  tick(t) {
    if (!this.keys) return;
    if (this.started === null) this.started = t;
    const s = (t - this.started) / 1000;
    let level = this.keys[0][1];
    for (const [at, l] of this.keys) if (s >= at) level = l;
    this.apply(level);
    if (s >= this.keys[this.keys.length - 1][0]) { this.keys = null; this.done(); }
  }
});
