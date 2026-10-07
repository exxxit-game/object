// Text panel drawn on a canvas. Canvas text renders Cyrillic everywhere,
// including inside a headset, where DOM and font loading are unavailable.
export const FONT = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

AFRAME.registerComponent('panel', {
  schema: { w: { default: 1 }, h: { default: 0.5 }, px: { default: 1024 }, bg: { default: 'rgba(0,0,0,0)' } },

  init() {
    const d = this.data;
    this.c = document.createElement('canvas');
    this.c.width = d.px;
    this.c.height = Math.round(d.px * d.h / d.w);
    this.ctx = this.c.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 8;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(d.w, d.h),
      new THREE.MeshBasicMaterial({ map: this.tex, transparent: true })
    );
    this.el.setObject3D('mesh', mesh);
    this.write([]);
  },

  // blocks: [{ t, size, color, weight, gap }]
  write(blocks, opt = {}) {
    const { ctx, c } = this;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = opt.bg || this.data.bg;
    ctx.fillRect(0, 0, W, H);
    const pad = opt.pad ?? W * 0.06;
    const maxW = W - pad * 2;

    const laid = [];
    for (const b of blocks) {
      const size = b.size || 40;
      ctx.font = `${b.weight || 400} ${size}px ${FONT}`;
      const lines = [];
      for (const para of String(b.t).split('\n')) {
        let line = '';
        for (const word of para.split(' ')) {
          const test = line ? line + ' ' + word : word;
          if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
        }
        lines.push(line);
      }
      laid.push({ b, size, lines });
    }

    let total = 0;
    laid.forEach((l, i) => { total += l.lines.length * l.size * 1.3 + (i ? (l.b.gap ?? l.size * 0.6) : 0); });
    let y = opt.top ? pad : Math.max(pad, (H - total) / 2);
    ctx.textBaseline = 'top';
    const align = opt.align || 'center';
    ctx.textAlign = align;
    const x = align === 'center' ? W / 2 : pad;
    laid.forEach((l, i) => {
      if (i) y += l.b.gap ?? l.size * 0.6;
      ctx.font = `${l.b.weight || 400} ${l.size}px ${FONT}`;
      ctx.fillStyle = l.b.color || '#e8e6e1';
      for (const ln of l.lines) { ctx.fillText(ln, x, y); y += l.size * 1.3; }
    });
    this.tex.needsUpdate = true;
  }
});
