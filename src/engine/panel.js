// Text panel drawn on a canvas. Canvas text renders Cyrillic everywhere,
// including inside a headset, where DOM and font loading are unavailable.
export const FONT = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const LINE_HEIGHT = 1.32;

AFRAME.registerComponent('panel', {
  schema: {
    w: { default: 1 },
    h: { default: 0.5 },
    px: { default: 1024 },
    // Canvas width the block sizes are designed for. Lets a panel raise its
    // resolution (px) without changing how big the text looks. 0 = same as px.
    ref: { default: 0 },
    bg: { default: 'rgba(0,0,0,0)' }
  },

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

  // Wraps every block to the panel width at the given scale.
  layout(blocks, scale, maxW) {
    const { ctx } = this;
    return blocks.map((b) => {
      const size = (b.size || 40) * scale;
      ctx.font = `${b.weight || 400} ${size}px ${FONT}`;
      ctx.letterSpacing = `${(b.spacing || 0) * scale}px`;
      const lines = [];
      for (const para of String(b.t).split('\n')) {
        let line = '';
        for (const word of para.split(' ')) {
          const test = line ? line + ' ' + word : word;
          if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
        }
        lines.push(line);
      }
      const gap = (b.gap ?? (b.size || 40) * 0.6) * scale;
      return { b, size, gap, lines };
    });
  },

  // blocks: [{ t, size, color, weight, gap, spacing }]
  // opt: { bg, pad, top, align: 'center' | 'left' }
  // Returns where the text ends, in metres below the panel's top edge.
  write(blocks, opt = {}) {
    const { ctx, c } = this;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = opt.bg || this.data.bg;
    ctx.fillRect(0, 0, W, H);
    const pad = opt.pad ?? W * 0.06;
    const maxW = W - pad * 2;
    const height = (laid) => laid.reduce((sum, l, i) => sum + l.lines.length * l.size * LINE_HEIGHT + (i ? l.gap : 0), 0);

    // Shrink to fit instead of running off the panel (long reports, longer languages).
    let scale = W / (this.data.ref || W);
    let laid = this.layout(blocks, scale, maxW);
    for (let i = 0; i < 4 && height(laid) > H - pad * 2; i++) {
      scale *= (H - pad * 2) / height(laid) * 0.98;
      laid = this.layout(blocks, scale, maxW);
    }

    let y = opt.top ? pad : Math.max(pad, (H - height(laid)) / 2);
    ctx.textBaseline = 'top';
    const align = opt.align || 'center';
    ctx.textAlign = align;
    const x = align === 'center' ? W / 2 : pad;
    laid.forEach((l, i) => {
      if (i) y += l.gap;
      ctx.font = `${l.b.weight || 400} ${l.size}px ${FONT}`;
      ctx.letterSpacing = `${(l.b.spacing || 0) * scale}px`;
      ctx.fillStyle = l.b.color || '#e8e6e1';
      for (const ln of l.lines) { ctx.fillText(ln, x, y); y += l.size * LINE_HEIGHT; }
    });
    ctx.letterSpacing = '0px';
    this.tex.needsUpdate = true;
    return (y / H) * this.data.h;
  }
});
