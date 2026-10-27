/* ==========================================================================
   skin3d.js  -  Minecraft character renderer for Story Mode
   - Takes a 64x64 (or legacy 64x32) player skin, the texture pack's armour
     layers and a held tool icon, and ray-casts them into a small pixel-art
     image (no WebGL, no libraries).
   - Everything visual comes from the texture pack in assets/tp/.
   ========================================================================== */
(function () {
  'use strict';
  const TP = 'assets/tp/';
  const TEX = {};          // url -> {w,h,d}  (decoded pixels)
  const PEND = {};         // url -> Promise

  /* ---------- texture loading ---------- */
  function decode(img) {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const x = cv.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    return { w, h, d: x.getImageData(0, 0, w, h).data };   // throws if canvas is tainted
  }
  function loadImg(src, cors) {
    return new Promise((res, rej) => {
      const i = new Image();
      if (cors) i.crossOrigin = 'anonymous';
      i.onload = () => res(i);
      i.onerror = () => rej(new Error('load failed: ' + src));
      i.src = src;
    });
  }
  function need(url) {
    if (TEX[url]) return Promise.resolve(TEX[url]);
    if (PEND[url]) return PEND[url];
    return PEND[url] = loadImg(url).then(decode).then(t => TEX[url] = t).catch(e => { delete PEND[url]; throw e; });
  }
  const needAll = urls => Promise.all(urls.map(u => need(u).catch(() => null)));

  /* ---------- tiny 3x3 matrix helpers ---------- */
  const RX = a => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; };
  const RY = a => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
  const RZ = a => { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, s, c, 0, 0, 0, 1]; };
  const ID = () => [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const mm = (A, B) => { const R = new Array(9); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]; return R; };
  const mv = (A, v) => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
  const tr = A => [A[0], A[3], A[6], A[1], A[4], A[7], A[2], A[5], A[8]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

  /* ---------- model definition ---------- */
  // UV layout of a box: origin (u,v) in the texture, size w (x), h (y), d (z)
  // Hit-point -> texel, following the vanilla player-skin cube net.
  // Poses (angles in radians; negative rx swings an arm / leg forward)
  const POSES = {
    idle:   { ra: [0.05, 0.06], la: [0.05, -0.06], rl: 0, ll: 0, head: [0, 0] },
    hold:   { ra: [-0.75, 0.1], la: [0.08, -0.06], rl: 0.05, ll: -0.05, head: [0, 0] },
    ready:  { ra: [-1.1, 0.15], la: [-0.5, -0.3], rl: 0.35, ll: -0.3, head: [0, 0.05] },
    attack: { ra: [-1.5, 0.1], la: [0.2, -0.1], rl: -0.4, ll: 0.4, head: [0, 0] },
    cheer:  { ra: [-2.9, 0.25], la: [-2.9, -0.25], rl: 0.05, ll: -0.05, head: [0, -0.1] },
    walk:   { ra: [0.5, 0.05], la: [-0.5, -0.05], rl: -0.45, ll: 0.45, head: [0, 0] },
    talk:   { ra: [-0.35, 0.15], la: [0.05, -0.05], rl: 0, ll: 0, head: [0, 0] },
    down:   { ra: [0.1, 0.3], la: [0.1, -0.3], rl: 0, ll: 0, head: [0, 0.35] }
  };

  const MATS = ['leather', 'chainmail', 'iron', 'copper', 'gold', 'diamond', 'netherite'];
  const LEATHER_DEFAULT = [160, 101, 64];
  const hexRGB = h => { h = String(h || '').replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); const n = parseInt(h, 16); return isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

  // which textures a spec needs (so callers can preload them)
  function textureList(spec) {
    const L = [];
    const a = spec.armor || {};
    ['h', 'c', 'l', 'b'].forEach(k => {
      const m = a[k]; if (!m) return;
      L.push(TP + 'equip/humanoid/' + m + '.png');
      L.push(TP + 'equip/humanoid_leggings/' + m + '.png');
      if (m === 'leather') { L.push(TP + 'equip/humanoid/leather_overlay.png'); L.push(TP + 'equip/humanoid_leggings/leather_overlay.png'); }
    });
    const tr = spec.trims || {};
    Object.keys(tr).forEach(k => { const t = tr[k]; if (!t) return; L.push(TP + 'trims/humanoid/' + t[0] + '.png', TP + 'trims/humanoid_leggings/' + t[0] + '.png', ...(t[1].split('+').map(m => TP + 'trims/palettes/' + m + '.png'))); if (['iron', 'gold', 'diamond', 'netherite', 'copper'].includes(t[1])) L.push(TP + 'trims/palettes/' + t[1] + '_darker.png'); });
    if (L.length) L.push(TP + 'trims/palettes/trim_palette.png');
    if (spec.item) L.push(TP + 'item/' + spec.item + '.png');
    if (spec.item2) L.push(TP + 'item/' + spec.item2 + '.png');
    return L;
  }

  // grey trim pattern + 8-colour material palette -> coloured texture (cached)
  const TRIMC = {};
  function trimTex(layer, pattern, material, baseMat) {
    const dark = ['iron', 'gold', 'diamond', 'netherite', 'copper'].includes(material) && material === baseMat ? '_darker' : '';
    const key = layer + pattern + material + dark;
    if (TRIMC[key]) return TRIMC[key];
    const pt = TEX[TP + 'trims/humanoid' + (layer === 2 ? '_leggings' : '') + '/' + pattern + '.png'];
    let pal = TEX[TP + 'trims/palettes/' + material + dark + '.png'];
    if (!pal && material.indexOf('+') > 0) {
      const [m1, m2] = material.split('+'), p1 = TEX[TP + 'trims/palettes/' + m1 + '.png'], p2 = TEX[TP + 'trims/palettes/' + m2 + '.png'];
      if (p1 && p2) { const d = new Uint8ClampedArray(32); for (let k = 0; k < 8; k++) { const src = k % 2 ? p2 : p1; for (let c = 0; c < 4; c++) d[k * 4 + c] = src.d[k * 4 + c]; } pal = { w: 8, h: 1, d }; }
    }
    if (!pt || !pal) return null;
    const out = new Uint8ClampedArray(pt.d.length);
    for (let i = 0; i < pt.d.length; i += 4) {
      if (pt.d[i + 3] < 128) continue;
      let k = Math.round((255 - pt.d[i]) / 32); k = Math.max(0, Math.min(7, k));   // 224->0 ... 0->7
      k = Math.max(0, Math.min(7, Math.round((224 - pt.d[i]) / 32)));
      out[i] = pal.d[k * 4]; out[i + 1] = pal.d[k * 4 + 1]; out[i + 2] = pal.d[k * 4 + 2]; out[i + 3] = 255;
    }
    return TRIMC[key] = { w: pt.w, h: pt.h, d: out };
  }

  /* Build the list of boxes for a spec.  Each box carries a rigid transform
     (Rb, tb): p_model = Rb * p_local + tb. */
  function buildBoxes(spec) {
    const sk = spec.skin;                     // {tex, slim, legacy}
    const slim = !!sk.slim, legacy = sk.tex.h < 64;
    const pose = Object.assign({}, POSES.idle, typeof spec.pose === 'string' ? POSES[spec.pose] : spec.pose || {});
    const boxes = [];
    const aw = slim ? 3 : 4;                  // skin arm width

    // part transforms ----------------------------------------------------
    const headR = mm(RY(pose.head[0]), RX(pose.head[1]));
    const P = {
      head: { R: headR, t: [0, 24, 0] },
      body: { R: ID(), t: [0, 24, 0] },
      ra: { R: mm(RX(pose.ra[0]), RZ(pose.ra[1])), t: [-5, 22, 0] },
      la: { R: mm(RX(pose.la[0]), RZ(pose.la[1])), t: [5, 22, 0] },
      rl: { R: RX(pose.rl), t: [-2, 12, 0] },
      ll: { R: RX(pose.ll), t: [2, 12, 0] }
    };

    function push(part, min, max, uvTex, U, V, w, h, d, o) {
      o = o || {};
      boxes.push({ part, R: P[part].R, t: P[part].t, min, max, tex: uvTex, U, V, w, h, d, mirror: !!o.mirror, tint: o.tint || null, solid: o.solid || null, item: false, glint: !!o.glint });
    }
    const inf = (b, e) => [[b[0][0] - e, b[0][1] - e, b[0][2] - e], [b[1][0] + e, b[1][1] + e, b[1][2] + e]];

    // base boxes in part-local coordinates (pivot = part origin)
    const B = {
      head: [[-4, 0, -4], [4, 8, 4]],
      body: [[-4, -12, -2], [4, 0, 2]],
      raS: slim ? [[-2, -10, -2], [1, 2, 2]] : [[-3, -10, -2], [1, 2, 2]],
      laS: slim ? [[-1, -10, -2], [2, 2, 2]] : [[-1, -10, -2], [3, 2, 2]],
      raA: [[-3, -10, -2], [1, 2, 2]],     // armour arms are always 4 wide
      laA: [[-1, -10, -2], [3, 2, 2]],
      rl: [[-2, -12, -2], [2, 0, 2]],
      ll: [[-2, -12, -2], [2, 0, 2]]
    };

    // ---- skin ----
    const T = sk.tex;
    let e;
    e = inf(B.head, 0); push('head', e[0], e[1], T, 0, 0, 8, 8, 8);
    e = inf(B.body, 0); push('body', e[0], e[1], T, 16, 16, 8, 12, 4);
    e = inf(B.raS, 0); push('ra', e[0], e[1], T, 40, 16, aw, 12, 4);
    e = inf(B.rl, 0); push('rl', e[0], e[1], T, 0, 16, 4, 12, 4);
    if (legacy) {
      e = inf(B.laS, 0); push('la', e[0], e[1], T, 40, 16, aw, 12, 4, { mirror: true });
      e = inf(B.ll, 0); push('ll', e[0], e[1], T, 0, 16, 4, 12, 4, { mirror: true });
    } else {
      e = inf(B.laS, 0); push('la', e[0], e[1], T, 32, 48, aw, 12, 4);
      e = inf(B.ll, 0); push('ll', e[0], e[1], T, 16, 48, 4, 12, 4);
    }
    // skin overlay layer (hat, jacket, sleeves, pants)
    e = inf(B.head, 0.5); push('head', e[0], e[1], T, 32, 0, 8, 8, 8);
    if (!legacy) {
      e = inf(B.body, 0.25); push('body', e[0], e[1], T, 16, 32, 8, 12, 4);
      e = inf(B.raS, 0.25); push('ra', e[0], e[1], T, 40, 32, aw, 12, 4);
      e = inf(B.laS, 0.25); push('la', e[0], e[1], T, 48, 48, aw, 12, 4);
      e = inf(B.rl, 0.25); push('rl', e[0], e[1], T, 0, 32, 4, 12, 4);
      e = inf(B.ll, 0.25); push('ll', e[0], e[1], T, 0, 48, 4, 12, 4);
    }

    // ---- armour from the texture pack ----
    const A = spec.armor || {};
    const dye = hexRGB(spec.dye) || LEATHER_DEFAULT;
    function armorSet(mat, layer, parts, infl, slot) {
      const url = TP + (layer === 1 ? 'equip/humanoid/' : 'equip/humanoid_leggings/') + mat + '.png';
      const tx = TEX[url]; if (!tx) return;
      const tint = mat === 'leather' ? dye : null;
      parts.forEach(p => {
        const f = p === 'head' ? [B.head, 0, 0, 8, 8, 8, 0]
          : p === 'body' ? [B.body, 16, 16, 8, 12, 4, 0]
          : p === 'ra' ? [B.raA, 40, 16, 4, 12, 4, 0]
          : p === 'la' ? [B.laA, 40, 16, 4, 12, 4, 1]
          : p === 'rl' ? [B.rl, 0, 16, 4, 12, 4, 0]
          : [B.ll, 0, 16, 4, 12, 4, 1];
        const bb = inf(f[0], infl);
        push(p, bb[0], bb[1], tx, f[1], f[2], f[3], f[4], f[5], { mirror: !!f[6], tint, glint: !!spec.enchant });
        const tp = (spec.trims || {})[slot];
        if (tp) {
          const tt = trimTex(layer, tp[0], tp[1], mat);
          if (tt) { const b3 = inf(f[0], infl + 0.03); push(p, b3[0], b3[1], tt, f[1], f[2], f[3], f[4], f[5], { mirror: !!f[6] }); }
        }
        if (mat === 'leather') {
          const ou = TP + (layer === 1 ? 'equip/humanoid/' : 'equip/humanoid_leggings/') + 'leather_overlay.png';
          if (TEX[ou]) { const b2 = inf(f[0], infl + 0.02); push(p, b2[0], b2[1], TEX[ou], f[1], f[2], f[3], f[4], f[5], { mirror: !!f[6] }); }
        }
      });
    }
    if (A.h) armorSet(A.h, 1, ['head'], 1.0, 'h');
    if (A.c) armorSet(A.c, 1, ['body', 'ra', 'la'], 1.0, 'c');
    if (A.l) armorSet(A.l, 2, ['body', 'rl', 'll'], 0.5, 'l');
    if (A.b) armorSet(A.b, 1, ['rl', 'll'], 1.0, 'b');

    // ---- cloth headband (Leaf Village etc.) ----
    if (spec.band) {
      const c = hexRGB(spec.band) || [60, 110, 220]; const bR = A.h ? 5.2 : 4.75, bF = bR - 0.05;
      boxes.push({ part: 'head', R: P.head.R, t: P.head.t, min: [-bR, 5.0, -bR], max: [bR, 6.7, bR], solid: c, item: false, tex: null });
      boxes.push({ part: 'head', R: P.head.R, t: P.head.t, min: [-2.2, 4.8, bF], max: [2.2, 6.9, bF + 0.4], solid: [196, 200, 210], item: false, tex: null });
      boxes.push({ part: 'head', R: P.head.R, t: P.head.t, min: [-1.3, 5.2, bF + 0.35], max: [1.3, 6.5, bF + 0.55], solid: c.map(x => Math.round(x * 0.7)), item: false, tex: null });
    }
    // ---- mask for masked fighters ----
    if (spec.mask) {
      const c = hexRGB(spec.mask) || [20, 20, 26];
      boxes.push({ part: 'head', R: P.head.R, t: P.head.t, min: [-4.6, 0.2, -4.6], max: [4.6, 4.2, 4.6], solid: c, item: false, tex: null });
    }

    // ---- held tool(s) ----
    const itemBox = (name, part) => {
      const url = TP + 'item/' + name + '.png'; const tx = TEX[url]; if (!tx) return;
      const S = spec.itemSize || 15;
      // sprite frame: x = thickness, y = up, z = forward. The handle pixel (2,14) is placed in the hand.
      const hz = (2.2 / 16 - 0.5) * S, hy = (0.5 - 14.2 / 16) * S;
      const armX = part === 'ra' ? (slim ? -0.5 : -1) : (slim ? 0.5 : 1);
      const handPos = [armX, -9.3, 0.8];
      // blade should point up/forward in the world no matter how the arm is swung
      const thetaW = spec.itemAngle != null ? spec.itemAngle : 0.95;
      const beta = thetaW - pose.ra[0] - Math.PI / 4;
      const Rl = RX(beta);
      const off = mv(Rl, [0, hy, hz]);
      const t = sub(handPos, off);
      const Rtot = mm(P[part].R, Rl);
      const tTot = add(mv(P[part].R, t), P[part].t);
      boxes.push({ part, R: Rtot, t: tTot, min: [-0.5, -S / 2, -S / 2], max: [0.5, S / 2, S / 2], tex: tx, item: true, S, mirror: false, glint: !!spec.enchant });
    };
    if (spec.item) itemBox(spec.item, 'ra');
    return { boxes, pose };
  }

  /* ---------- ray-caster ---------- */
  function render(spec) {
    const W = spec.w || 240, H = spec.h || 330, sc = spec.scale || 8;
    const yaw = spec.yaw != null ? spec.yaw : 0.45, pitch = spec.pitch != null ? spec.pitch : 0.12;
    const { boxes } = buildBoxes(spec);
    const Rc = mm(RX(pitch), RY(yaw)), RcT = tr(Rc);
    const center = [0, spec.cy != null ? spec.cy : 17, 0];
    const yoff = spec.yoff || 0;
    const rgba = new Uint8ClampedArray(W * H * 4);
    const zb = new Float32Array(W * H).fill(1e9);
    const L = [0.38, 0.72, 0.58]; const Ln = Math.hypot(L[0], L[1], L[2]); L[0] /= Ln; L[1] /= Ln; L[2] /= Ln;

    const dirModel = mv(RcT, [0, 0, -1]);
    const baseModel = add(mv(RcT, [0, 0, 400]), center);
    const exM = mv(RcT, [1, 0, 0]), eyM = mv(RcT, [0, 1, 0]);

    for (const b of boxes) {
      // box -> model transform
      const Rb = b.R, tb = b.t, RbT = tr(Rb);
      // local ray constants: o(cx,cy) = oL0 + cx*exL + cy*eyL ; d = dL
      const oL0 = mv(RbT, sub(baseModel, tb));
      const exL = mv(RbT, exM), eyL = mv(RbT, eyM), dL = mv(RbT, dirModel);
      // screen bbox from the 8 corners
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (let i = 0; i < 8; i++) {
        const pl = [i & 1 ? b.max[0] : b.min[0], i & 2 ? b.max[1] : b.min[1], i & 4 ? b.max[2] : b.min[2]];
        const pm = add(mv(Rb, pl), tb); const pc = mv(Rc, sub(pm, center));
        const sx = pc[0] * sc + W / 2, sy = H / 2 + yoff - pc[1] * sc;
        if (sx < x0) x0 = sx; if (sx > x1) x1 = sx; if (sy < y0) y0 = sy; if (sy > y1) y1 = sy;
      }
      x0 = Math.max(0, Math.floor(x0) - 1); x1 = Math.min(W - 1, Math.ceil(x1) + 1);
      y0 = Math.max(0, Math.floor(y0) - 1); y1 = Math.min(H - 1, Math.ceil(y1) + 1);
      const mn = b.min, mx = b.max, sx_ = mx[0] - mn[0], sy_ = mx[1] - mn[1], sz_ = mx[2] - mn[2];
      const tx = b.tex, td = tx && tx.d, tw = tx && tx.w, th = tx && tx.h;
      // face normals in camera space for shading (per local axis, +/-)
      const nCam = [0, 1, 2].map(ax => { const nl = [0, 0, 0]; nl[ax] = 1; const nm = mv(Rb, nl); const nc = mv(Rc, nm); return nc; });
      const shadeOf = (ax, sign) => { const n = nCam[ax]; const dot = (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) * sign; return 0.58 + 0.5 * Math.max(0, dot) - 0.12 * Math.max(0, -dot); };

      for (let py = y0; py <= y1; py++) {
        const cy = (H / 2 + yoff - (py + 0.5)) / sc;
        for (let px = x0; px <= x1; px++) {
          const cx = (px + 0.5 - W / 2) / sc;
          const ox = oL0[0] + cx * exL[0] + cy * eyL[0], oy = oL0[1] + cx * exL[1] + cy * eyL[1], oz = oL0[2] + cx * exL[2] + cy * eyL[2];
          // slab test
          let tmin = -1e9, tmax = 1e9, ax = -1, sg = 0;
          // x
          if (Math.abs(dL[0]) < 1e-9) { if (ox < mn[0] || ox > mx[0]) continue; }
          else { let t1 = (mn[0] - ox) / dL[0], t2 = (mx[0] - ox) / dL[0]; let s = dL[0] > 0 ? -1 : 1; if (t1 > t2) { const q = t1; t1 = t2; t2 = q; } if (t1 > tmin) { tmin = t1; ax = 0; sg = s; } if (t2 < tmax) tmax = t2; }
          if (Math.abs(dL[1]) < 1e-9) { if (oy < mn[1] || oy > mx[1]) continue; }
          else { let t1 = (mn[1] - oy) / dL[1], t2 = (mx[1] - oy) / dL[1]; let s = dL[1] > 0 ? -1 : 1; if (t1 > t2) { const q = t1; t1 = t2; t2 = q; } if (t1 > tmin) { tmin = t1; ax = 1; sg = s; } if (t2 < tmax) tmax = t2; }
          if (Math.abs(dL[2]) < 1e-9) { if (oz < mn[2] || oz > mx[2]) continue; }
          else { let t1 = (mn[2] - oz) / dL[2], t2 = (mx[2] - oz) / dL[2]; let s = dL[2] > 0 ? -1 : 1; if (t1 > t2) { const q = t1; t1 = t2; t2 = q; } if (t1 > tmin) { tmin = t1; ax = 2; sg = s; } if (t2 < tmax) tmax = t2; }
          if (tmin > tmax || tmax < 0 || ax < 0) continue;
          const idx = py * W + px;
          if (tmin >= zb[idx]) continue;
          // hit point in local coords
          const hx = ox + dL[0] * tmin, hy = oy + dL[1] * tmin, hz = oz + dL[2] * tmin;
          let r, g, bl, a = 255;
          if (b.solid) { r = b.solid[0]; g = b.solid[1]; bl = b.solid[2]; }
          else if (b.item) {
            // sprite plane: u along +z (forward), v along -y
            const fu = Math.min(0.999, Math.max(0, (hz - mn[2]) / sz_)), fv = Math.min(0.999, Math.max(0, 1 - (hy - mn[1]) / sy_));
            const ix = Math.floor(fu * tw), iy = Math.floor(fv * th), o4 = (iy * tw + ix) * 4;
            a = td[o4 + 3]; if (a < 128) continue;
            r = td[o4]; g = td[o4 + 1]; bl = td[o4 + 2];
          } else {
            // face + uv (vanilla cube net); mirrored boxes reflect x
            let fx = (hx - mn[0]) / sx_, fy = (hy - mn[1]) / sy_, fz = (hz - mn[2]) / sz_;
            let face = ax === 0 ? (sg < 0 ? 'nx' : 'px') : ax === 1 ? (sg < 0 ? 'ny' : 'py') : (sg < 0 ? 'nz' : 'pz');
            if (b.mirror) { fx = 1 - fx; if (face === 'nx') face = 'px'; else if (face === 'px') face = 'nx'; }
            let u, v; const U = b.U, V = b.V, w = b.w, h = b.h, d = b.d;
            let ux0, vy0, uw;
            switch (face) {
              case 'nx': ux0 = U; vy0 = V + d; uw = d; u = ux0 + fz * d; v = vy0 + (1 - fy) * h; break;
              case 'pz': ux0 = U + d; vy0 = V + d; uw = w; u = ux0 + fx * w; v = vy0 + (1 - fy) * h; break;
              case 'px': ux0 = U + d + w; vy0 = V + d; uw = d; u = ux0 + (1 - fz) * d; v = vy0 + (1 - fy) * h; break;
              case 'nz': ux0 = U + d + w + d; vy0 = V + d; uw = w; u = ux0 + (1 - fx) * w; v = vy0 + (1 - fy) * h; break;
              case 'py': ux0 = U + d; vy0 = V; uw = w; u = ux0 + fx * w; v = vy0 + fz * d; break;
              default: ux0 = U + d + w; vy0 = V; uw = w; u = ux0 + fx * w; v = vy0 + (1 - fz) * d; break;
            }
            const vh = (face === 'py' || face === 'ny') ? d : h;
            let ix = Math.floor(u), iy = Math.floor(v);
            if (ix < ux0) ix = ux0; else if (ix > ux0 + uw - 1) ix = ux0 + uw - 1;
            if (iy < vy0) iy = vy0; else if (iy > vy0 + vh - 1) iy = vy0 + vh - 1;
            if (ix >= tw) ix = tw - 1; if (iy >= th) iy = th - 1;
            const o4 = (iy * tw + ix) * 4;
            a = td[o4 + 3]; if (a < 128) continue;
            r = td[o4]; g = td[o4 + 1]; bl = td[o4 + 2];
            if (b.tint) { r = r * b.tint[0] / 255; g = g * b.tint[1] / 255; bl = bl * b.tint[2] / 255; }
          }
          if (b.glint) { // enchantment glint: purple diagonal shimmer over armour and the held item
            const gk = (((Math.floor(hx * 2.2) + Math.floor(hy * 2.2) + Math.floor(hz * 2.2)) % 5) + 5) % 5, gm = gk < 2 ? 0.36 : 0.14;
            r = r * (1 - gm) + 165 * gm; g = g * (1 - gm) + 95 * gm; bl = bl * (1 - gm) + 255 * gm;
          }
          const sh = shadeOf(ax, sg);
          const q = idx * 4;
          rgba[q] = Math.min(255, r * sh); rgba[q + 1] = Math.min(255, g * sh); rgba[q + 2] = Math.min(255, bl * sh); rgba[q + 3] = 255;
          zb[idx] = tmin;
        }
      }
    }
    // optional 1px dark outline so figures read on busy backgrounds
    if (spec.outline !== false) {
      const out = new Uint8ClampedArray(rgba);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4; if (rgba[i + 3]) continue;
        let n = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          if (!dx && !dy) continue; if (dx * dx + dy * dy > 5) continue;
          const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
          if (rgba[(yy * W + xx) * 4 + 3]) { n = 1; break; }
        }
        if (n) { out[i] = 10; out[i + 1] = 8; out[i + 2] = 16; out[i + 3] = 200; }
      }
      rgba.set(out);
    }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    cv.getContext('2d').putImageData(new ImageData(rgba, W, H), 0, 0);
    return cv;
  }

  /* ---------- skins ---------- */
  const DEFAULTS = ['steve', 'alex', 'ari', 'efe', 'kai', 'makena', 'noor', 'sunny', 'zuri'];
  function defaultSkin(name) {
    name = DEFAULTS.includes(name) ? name : 'steve';
    const url = TP + 'skins/wide/' + name + '.png';
    return need(url).then(t => ({ tex: t, slim: false, src: 'default:' + name }));
  }
  function detectSlim(t) {
    if (t.h < 64) return false;
    for (let y = 20; y <= 31; y++) for (let x = 54; x <= 55; x++) if (t.d[(y * t.w + x) * 4 + 3] !== 0) return false;
    return true;
  }
  function fromImage(img) { const t = decode(img); return { tex: t, slim: detectSlim(t), src: 'image' }; }

  const SKIN_SOURCES = [
    u => 'https://mc-heads.net/skin/' + encodeURIComponent(u),
    u => 'https://minotar.net/skin/' + encodeURIComponent(u),
    u => 'https://crafatar.com/skins/' + encodeURIComponent(u) + '?overlay'
  ];
  // extra source: Mojang profile lookup (returns the skin as base64, so it works even when the image sites are blocked)
  const ASHCON = async u => {
    const r = await fetch('https://api.ashcon.app/mojang/v2/user/' + encodeURIComponent(u)); if (!r.ok) throw new Error('no profile');
    const j = await r.json(); const d = j && j.textures && j.textures.skin && j.textures.skin.data; if (!d) throw new Error('no skin');
    return 'data:image/png;base64,' + d;
  };
  const SKCACHE = {};
  const lsKey = n => 'bpb_skin_v1_' + n.toLowerCase();
  function withTimeout(p, ms) { return new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); }); }); }

  /* Fetch a Minecraft skin by username.  Resolves to {tex,slim,src} or null. */
  function fetchSkin(username, opts) {
    opts = opts || {};
    username = String(username || '').trim();
    if (!/^[A-Za-z0-9_]{1,16}$/.test(username)) return Promise.resolve(null);
    const key = username.toLowerCase();
    if (SKCACHE[key] && !opts.fresh) return SKCACHE[key];
    const job = (async () => {
      // 1) saved copy from an earlier visit
      if (!opts.fresh) {
        try {
          const s = localStorage.getItem(lsKey(key));
          if (s) { const o = JSON.parse(s); const img = await loadImg(o.d); const r = fromImage(img); r.slim = !!o.s; r.src = 'saved'; return r; }
        } catch (e) { }
      }
      // 2) skin websites (need CORS so the pixels can be read) - all tried at once, first good one wins
      const tryOne = async mk => {
        const url = await withTimeout(Promise.resolve(mk(username)), opts.timeout || 7000);
        const img = await withTimeout(loadImg(url, url.indexOf('data:') !== 0), opts.timeout || 7000);
        if (img.naturalWidth < 64) throw new Error('too small');
        const r = fromImage(img); r.src = url.indexOf('data:') === 0 ? 'ashcon' : url; return r;
      };
      const srcs = SKIN_SOURCES.concat([ASHCON]);
      const r = await new Promise(res => { let left = srcs.length; srcs.forEach(mk => tryOne(mk).then(res, () => { if (--left === 0) res(null); })); });
      if (r) setTimeout(() => {
        try {
          const cv = document.createElement('canvas'); cv.width = r.tex.w; cv.height = r.tex.h;
          cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(r.tex.d), r.tex.w, r.tex.h), 0, 0);
          localStorage.setItem(lsKey(key), JSON.stringify({ d: cv.toDataURL('image/png'), s: r.slim ? 1 : 0 }));
        } catch (e) { }
      }, 0);
      if (r) return r;
      return null;
    })();
    SKCACHE[key] = job;
    job.then(r => { if (!r) delete SKCACHE[key]; });
    return job;
  }
  function skinFromFile(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => loadImg(fr.result).then(img => { if (img.naturalWidth !== 64) throw new Error('Skin must be 64 pixels wide'); const r = fromImage(img); r.src = 'upload'; r.dataURL = fr.result; res(r); }).catch(rej);
      fr.onerror = () => rej(new Error('Could not read file'));
      fr.readAsDataURL(file);
    });
  }
  function skinFromDataURL(url, slim) { return loadImg(url).then(img => { const r = fromImage(img); if (slim != null) r.slim = !!slim; r.src = 'saved'; return r; }); }

  /* ---------- public: render to image URL with caching ---------- */
  const URLC = {};
  function toURL(spec, cacheKey) {
    if (cacheKey && URLC[cacheKey]) return URLC[cacheKey];
    const cv = render(spec);
    const u = cv.toDataURL('image/png');
    if (cacheKey) URLC[cacheKey] = u;
    return u;
  }
  function clearCache(prefix) { Object.keys(URLC).forEach(k => { if (!prefix || k.indexOf(prefix) === 0) delete URLC[k]; }); }

  window.Skin3D = { TP, need, needAll, textureList, render, toURL, clearCache, fetchSkin, skinFromFile, skinFromDataURL, defaultSkin, DEFAULTS, MATS, POSES, hexRGB, TEX };
})();
