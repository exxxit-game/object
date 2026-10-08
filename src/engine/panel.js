// Text panel drawn on a canvas: canvas text shows in a headset, where the page's DOM does not.
// The game's own faces (css/fonts.css, loaded before a room starts: src/main.js): FONT for signs,
// buttons and labels, TYPE for typed papers; the stand-ins after them only if a face failed to load.
export const FONT = 'Inter, "Segoe UI", Roboto, Arial, sans-serif';
export const TYPE = 'Cousine, "Courier New", monospace';

const LINE_HEIGHT = 1.32;

// A plate's body behind its printed face: a box without its front, which would lie on the print
// and flicker with it; one material, so the bodies in a merged part of a scene become one mesh.
function body(w, h, depth) {
  const g = new THREE.BoxGeometry(w, h, depth);
  const front = g.groups[4];   // BoxGeometry's faces: +x, -x, +y, -y, +z, -z
  const index = Array.from(g.index.array);
  index.splice(front.start, front.count);
  g.setIndex(index);
  g.clearGroups();
  return g.translate(0, 0, -depth / 2);
}

AFRAME.registerComponent('panel', {
  schema: {
    w: { default: 1 },
    h: { default: 0.5 },
    px: { default: 1024 },
    // Canvas width the block sizes are designed for. Lets a panel raise its
    // resolution (px) without changing how big the text looks. 0 = same as px.
    ref: { default: 0 },
    bg: { default: 'rgba(0,0,0,0)' },
    // a sign is a plate: its printed face stands this deep (metres) in front of what it is fixed
    // on, on a body of its background colour reaching back to it
    thick: { default: 0 },
    // a print lying on another surface (paper on cork) is drawn over it by a depth offset, as
    // decals are, so it lies on it without the two flickering into each other
    decal: { default: false }
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
    if (d.decal) Object.assign(mesh.material, { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    if (d.thick > 0) mesh.add(new THREE.Mesh(body(d.w, d.h, d.thick), new THREE.MeshStandardMaterial({ color: d.bg, roughness: 0.6 })));
    this.el.setObject3D('mesh', mesh);
    this.write([]);
  },

  // Wraps every block to the panel width at the given scale, in the face font.
  layout(blocks, scale, maxW, font = FONT) {
    const { ctx } = this;
    return blocks.map((b) => {
      const size = (b.size || 40) * scale;
      ctx.font = `${b.weight || 400} ${size}px ${font}`;
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

  // blocks: [{ t, size, color, weight, gap, spacing, align }] (a block's align overrides the panel's)
  // opt: { bg, pad, top, align: 'center' | 'left', fit, font (FONT unless given) }
  // fit (default true) shrinks text that would run off the panel; fit: false keeps the
  // sizes and sets this.overflow instead (a sheet that does not fit is a content error).
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
    const font = opt.font || FONT;
    let laid = this.layout(blocks, scale, maxW, font);
    for (let i = 0; opt.fit !== false && i < 4 && height(laid) > H - pad * 2; i++) {
      scale *= (H - pad * 2) / height(laid) * 0.98;
      laid = this.layout(blocks, scale, maxW, font);
    }
    this.overflow = height(laid) > H - pad * 2;
    // a blank to fill in (a run of underscores) wrapped away from the words it belongs to
    this.orphan = laid.some((l) => l.lines.some((ln) => /^_+[,.:]?$/.test(ln.trim())));

    let y = opt.top ? pad : Math.max(pad, (H - height(laid)) / 2);
    ctx.textBaseline = 'top';
    laid.forEach((l, i) => {
      if (i) y += l.gap;
      const align = l.b.align || opt.align || 'center';
      ctx.textAlign = align;
      const x = align === 'center' ? W / 2 : pad;
      ctx.font = `${l.b.weight || 400} ${l.size}px ${font}`;
      ctx.letterSpacing = `${(l.b.spacing || 0) * scale}px`;
      ctx.fillStyle = l.b.color || '#e8e6e1';
      for (const ln of l.lines) { ctx.fillText(ln, x, y); y += l.size * LINE_HEIGHT; }
    });
    ctx.letterSpacing = '0px';
    this.tex.needsUpdate = true;
    return (y / H) * this.data.h;
  }
});
