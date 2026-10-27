/* ==========================================================================
   story-art.js - paints the story backdrops out of texture-pack blocks.
   Every scene is a small "block diorama" drawn on a canvas (20 x 12 blocks).
   ========================================================================== */
(function () {
  'use strict';
  const TP = 'assets/tp/';
  const N = 48, COLS = 20, ROWS = 12;          // block size in px, grid
  const IM = {};                                // path -> Image
  const TC = {};                                // tinted tile cache

  function img(path) {
    if (IM[path]) return IM[path];
    const i = new Image(); i.src = path; IM[path] = i;
    i.p = new Promise(r => { i.onload = () => r(i); i.onerror = () => r(null); });
    return i;
  }
  const blockP = n => TP + 'block/' + n + '.png';
  const itemP = n => TP + 'item/' + n + '.png';
  const TINTS = {
    grass_block_top: [145, 189, 89], oak_leaves: [119, 171, 47], birch_leaves: [128, 167, 85], spruce_leaves: [97, 153, 97],
    dark_oak_leaves: [96, 150, 40], water_still: [63, 118, 228], grass_block_side_overlay: [145, 189, 89]
  };

  // a 16x16 (or animated strip -> first frame) tile as canvas with optional tint / darkening
  function tile(name, tint, dark) {
    const key = name + '|' + (tint || '') + '|' + (dark || 0);
    if (TC[key]) return TC[key];
    const im = img(blockP(name)); if (!im.complete || !im.naturalWidth) return null;
    const c = document.createElement('canvas'); c.width = 16; c.height = 16;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    if (/leaves/.test(name)) { const tt = tint || TINTS[name] || [90, 150, 60]; x.fillStyle = `rgb(${tt[0] * .38 | 0},${tt[1] * .38 | 0},${tt[2] * .38 | 0})`; x.fillRect(0, 0, 16, 16); }
    x.drawImage(im, 0, 0, 16, 16, 0, 0, 16, 16);
    const t = tint || TINTS[name];
    if (t) { x.globalCompositeOperation = 'multiply'; x.fillStyle = `rgb(${t[0]},${t[1]},${t[2]})`; x.fillRect(0, 0, 16, 16); x.globalCompositeOperation = 'source-over'; }
    if (dark) { x.fillStyle = `rgba(0,0,0,${dark})`; x.globalCompositeOperation = 'source-atop'; x.fillRect(0, 0, 16, 16); x.globalCompositeOperation = 'source-over'; }
    return TC[key] = c;
  }
  // grass side needs its overlay tinted on top
  function grassSide() {
    if (TC.__gs) return TC.__gs;
    const base = tile('grass_block_side'), ov = tile('grass_block_side_overlay'); if (!base || !ov) return base;
    const c = document.createElement('canvas'); c.width = 16; c.height = 16; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.drawImage(base, 0, 0); x.drawImage(ov, 0, 0); return TC.__gs = c;
  }

  function makePainter() {
    const cv = document.createElement('canvas'); cv.width = COLS * N; cv.height = ROWS * N;
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    let seedv = 1; const rnd = () => (seedv = (seedv * 16807) % 2147483647) / 2147483647;
    const P = {
      cv, x, N, COLS, ROWS, rnd, seed(s) { seedv = (s * 9301 + 49297) % 2147483647 || 1; },
      tile(name, c, r, o) {
        o = o || {}; const t = name === 'grass_block_side' ? grassSide() : tile(name, o.tint, o.dark);
        if (!t) return; const w = (o.w || 1) * N, h = (o.h || 1) * N;
        if (o.alpha != null) x.globalAlpha = o.alpha;
        x.drawImage(t, 0, 0, 16, 16, Math.round(c * N), Math.round(r * N), w, h);
        if (o.alpha != null) x.globalAlpha = 1;
      },
      fill(name, c, r, w, h, o) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) P.tile(name, c + i, r + j, o); },
      item(name, c, r, s, o) {
        const im = img(itemP(name)); if (!im.complete || !im.naturalWidth) return; s = s || 1;
        o = o || {};
        if (o.alpha != null) x.globalAlpha = o.alpha;
        x.drawImage(im, 0, 0, im.naturalWidth, im.naturalWidth, Math.round(c * N), Math.round(r * N), s * N, s * N);
        x.globalAlpha = 1;
      },
      sky(c0, c1) { const g = x.createLinearGradient(0, 0, 0, cv.height); g.addColorStop(0, c0); g.addColorStop(1, c1); x.fillStyle = g; x.fillRect(0, 0, cv.width, cv.height); },
      stars(n, a) { for (let i = 0; i < n; i++) { x.fillStyle = `rgba(255,255,255,${(a || 0.9) * (0.4 + rnd() * 0.6)})`; const s = rnd() < 0.15 ? 4 : 3; x.fillRect(Math.floor(rnd() * cv.width / 3) * 3, Math.floor(rnd() * cv.height * 0.7 / 3) * 3, s, s); } },
      sun(c, r, col, big) { x.fillStyle = col || '#fff6a8'; const s = (big || 1.4) * N; x.fillRect(c * N, r * N, s, s); x.fillStyle = (col || '#fff6a8') + '55'; x.fillRect(c * N - 8, r * N - 8, s + 16, s + 16); },
      clouds(n, col) {
        for (let i = 0; i < n; i++) {
          const c = Math.floor(rnd() * COLS) , r = 0.4 + Math.floor(rnd() * 2.5) , w = 2 + Math.floor(rnd() * 3);
          x.fillStyle = col || 'rgba(255,255,255,.88)'; x.fillRect(c * N, r * N, w * N, N * .7); x.fillRect((c + 1) * N, r * N - N * .35, (w - 2) * N, N * .5);
        }
      },
      hills(tex, base, amp, o) {
        o = o || {}; let h = base; const hs = [];
        for (let c = 0; c < COLS; c++) { h += Math.round((rnd() - .5) * 2.2); h = Math.max(base - amp, Math.min(base + amp, h)); hs.push(h); }
        for (let c = 0; c < COLS; c++) for (let r = hs[c]; r < ROWS; r++) P.tile(tex, c, r, { tint: o.tint, dark: o.dark != null ? o.dark : .35 });
        if (o.fog) { x.fillStyle = o.fog; x.fillRect(0, (base - amp) * N, cv.width, cv.height); }
        return hs;
      },
      ground(row, top, mid, deep, o) {
        o = o || {};
        for (let c = 0; c < COLS; c++) {
          for (let r = row; r < ROWS; r++) {
            const nm = r === row ? top : (r - row) < (o.midDepth || 2) ? mid : deep;
            if (r === row && (top === 'grass_block_top')) { P.tile('grass_block_side', c, r, { dark: o.dark }); P.tile('grass_block_top', c, r, { h: .34, dark: o.dark }); }
            else P.tile(nm, c, r, { dark: o.dark });
          }
        }
        // a sprinkling of ore/gravel
        if (o.decor) for (let i = 0; i < o.decor.n; i++) P.tile(o.decor.tex, Math.floor(rnd() * COLS), row + 1 + Math.floor(rnd() * (ROWS - row - 1)));
      },
      floorTop(row, tex, o) { for (let c = 0; c < COLS; c++) { P.tile(tex, c, row, o); } },
      tree(c, row, o) {
        o = o || {}; const h = o.h || 4, log = o.log || 'oak_log', leaf = o.leaf || 'oak_leaves', dk = o.dark || 0;
        for (let i = 1; i <= h - 1; i++) P.tile(log, c, row - i, { dark: dk });
        const top = row - h;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) { if (Math.abs(dx) === 2 && Math.abs(dy) === 1 && rnd() < .5) continue; P.tile(leaf, c + dx, top + dy, { dark: dk }); }
        for (let dx = -1; dx <= 1; dx++) P.tile(leaf, c + dx, top - 2, { dark: dk });
        P.tile(leaf, c, top - 1 + 0, { dark: dk });
      },
      spruce(c, row, o) {
        o = o || {}; const h = o.h || 6, dk = o.dark || 0;
        for (let i = 1; i <= 2; i++) P.tile('spruce_log', c, row - i, { dark: dk });
        for (let k = 0; k < h - 2; k++) { const w = Math.max(0, Math.min(2, Math.floor((h - 2 - k) / 1.6))); for (let dx = -w; dx <= w; dx++) P.tile('spruce_leaves', c + dx, row - 3 - k, { dark: dk }); }
      },
      house(c, row, w, h, o) {
        o = o || {}; const wall = o.wall || 'oak_planks', roof = o.roof || 'dark_oak_planks', dk = o.dark || 0;
        for (let j = 1; j <= h; j++) for (let i = 0; i < w; i++) P.tile(i === 0 || i === w - 1 ? (o.frame || 'oak_log') : wall, c + i, row - j, { dark: dk });
        for (let i = -1; i <= w; i++) P.tile(roof, c + i, row - h - 1, { dark: dk });
        for (let i = 0; i < w; i++) P.tile(roof, c + i, row - h - 2, { dark: dk }), 0;
        const mid = c + Math.floor(w / 2);
        P.tile('oak_door_bottom', mid, row - 1, { dark: dk }); P.tile('oak_door_top', mid, row - 2, { dark: dk });
        if (w >= 4) { P.tile('glass', c + 1, row - 2, { dark: dk, alpha: .8 }); if (w >= 5) P.tile('glass', c + w - 2, row - 2, { dark: dk, alpha: .8 }); }
      },
      roomWall(wall, floorRow, floor, o) {
        o = o || {};
        for (let r = 0; r < floorRow; r++) for (let c = 0; c < COLS; c++) P.tile(wall, c, r, { dark: o.dark != null ? o.dark : .12 });
        for (let r = floorRow; r < ROWS; r++) for (let c = 0; c < COLS; c++) P.tile(floor, c, r, { dark: r === floorRow ? 0 : .18 });
        x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, (floorRow - 0.15) * N, cv.width, N * .15);
        if (o.beams) for (let c = 0; c < COLS; c += 5) for (let r = 0; r < floorRow; r++) P.tile(o.beams, c, r, { dark: .1 });
      },
      window(c, r, w, h, o) {
        o = o || {};
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { x.fillStyle = o.sky || '#8fd0ff'; x.fillRect((c + i) * N, (r + j) * N, N, N); P.tile('glass', c + i, r + j, { alpha: .55 }); }
        x.strokeStyle = '#3a2410'; x.lineWidth = 5; x.strokeRect(c * N, r * N, w * N, h * N);
      },
      torch(c, r, o) { o = o || {}; P.tile('torch', c, r, {}); P.glow((c + .5) * N, (r + .3) * N, o.r || 130, o.col || 'rgba(255,200,90,.35)'); },
      lantern(c, r) { P.tile('lantern', c, r); P.glow((c + .5) * N, (r + .6) * N, 150, 'rgba(255,210,120,.3)'); },
      glow(px, py, rad, col) { const g = x.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px - rad, py - rad, rad * 2, rad * 2); },
      overlay(col) { x.fillStyle = col; x.fillRect(0, 0, cv.width, cv.height); },
      vignette(a) { const g = x.createRadialGradient(cv.width / 2, cv.height * .55, cv.height * .35, cv.width / 2, cv.height * .55, cv.height * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a || .45})`); x.fillStyle = g; x.fillRect(0, 0, cv.width, cv.height); },
      fence(c, row, n, tex) { for (let i = 0; i < n; i++) { P.tile(tex || 'oak_planks', c + i, row - 1, { h: .5, dark: .1 }); } },
      banner(c, r, col) { x.fillStyle = col; x.fillRect(c * N, r * N, N, N * 1.8); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(c * N, r * N, N, 5); x.fillRect(c * N + N * .45, r * N, 4, N * 1.8); },
      pillar(c, row, h, tex, cap) { for (let j = 1; j <= h; j++) P.tile(tex, c, row - j, {}); if (cap) P.tile(cap, c, row - h - 1, {}); },
      wall(c, row, w, h, tex, o) { for (let j = 1; j <= h; j++) for (let i = 0; i < w; i++) P.tile(tex, c + i, row - j, o); },
      rect(col, c, r, w, h) { x.fillStyle = col; x.fillRect(c * N, r * N, w * N, h * N); },
      pagoda(c, row, floors, o) {
        o = o || {}; const wall = o.wall || 'dark_oak_planks', roof = o.roof || 'spruce_planks', dk = o.dark || 0;
        for (let f = 0; f < floors; f++) {
          const w = 5 - f; const x0 = c + f * 0.5 | 0;
          for (let j = 0; j < 2; j++) for (let i = 0; i < w; i++) P.tile(i === 0 || i === w - 1 ? 'dark_oak_log' : (j === 1 && i % 2 ? 'glass' : wall), c + f + i, row - 1 - f * 3 - j, { dark: dk });
          for (let i = -1; i <= w; i++) P.tile(roof, c + f + i, row - 3 - f * 3, { dark: dk });
        }
      },
      tower(c, row, h, o) {
        o = o || {}; const wall = o.wall || 'terracotta', roof = o.roof || 'deepslate_tiles', dk = o.dark || 0;
        for (let j = 1; j <= h; j++) for (let i = 0; i < 3; i++) P.tile(j % 3 === 0 && i === 1 ? 'iron_bars' : wall, c + i, row - j, { dark: dk });
        P.tile(roof, c - .5 + .5, row - h - 1, { w: 4, dark: dk }); P.tile(roof, c + .5, row - h - 2, { w: 2, dark: dk }); P.tile(roof, c + 1, row - h - 3, { dark: dk });
      },
      path(c, row, w, tex) { for (let i = 0; i < w; i++) P.tile(tex || 'dirt_path_top', c + i, row, {}); }
    };
    return P;
  }

  /* ---- scene definitions -------------------------------------------------
     each draws into painter P and returns { ground: row-of-feet } (unused) */
  const S = {};
  S.room = P => {   // cosy starter bedroom
    P.seed(2);
    P.roomWall('oak_planks', 8, 'spruce_planks', { beams: 'oak_log', dark: .08 });
    for (let c = 0; c < COLS; c++) { P.tile('spruce_planks', c, 7, { dark: .12 }); P.tile('oak_log', c, 0, { dark: .2 }); }
    P.window(2, 2, 3, 3); P.window(15, 2, 3, 3);
    P.rect('rgba(255,236,170,.10)', 2, 2, 3, 6); P.rect('rgba(255,236,170,.10)', 15, 2, 3, 6);
    P.rect('#a3221c', 1.6, 2, .5, 3.2); P.rect('#a3221c', 5, 2, .5, 3.2); P.rect('#a3221c', 14.6, 2, .5, 3.2); P.rect('#a3221c', 18, 2, .5, 3.2);
    // bed (left)
    P.tile('oak_planks', 1, 7.4, { h: .6, w: 1 }); P.tile('oak_planks', 5, 7.4, { h: .6, w: 1 });
    P.tile('red_wool', 2, 6.7, { w: 3, h: .75 }); P.tile('white_wool', 1, 6.7, { w: 1, h: .75 }); P.tile('oak_planks', 5, 6.3, { h: 1.1 });
    // shelf + table + crafting corner
    P.tile('bookshelf', 7, 5); P.tile('bookshelf', 8, 5); P.tile('bookshelf', 7, 6); P.tile('bookshelf', 8, 6);
    P.item('filled_map', 10.2, 4.3, 1); P.item('painting', 11.6, 4.1, 1);
    P.tile('crafting_table_front', 10, 7); P.tile('furnace_front', 11, 7); P.tile('barrel_side', 12, 7);
    P.item('flower_pot', 12.1, 6.2, .8); P.item('compass', 10.2, 6.2, .7);
    P.torch(6.2, 4.6); P.torch(13.6, 4.6); P.lantern(9.2, 1);
    // door
    P.tile('oak_door_top', 18, 5); P.tile('oak_door_bottom', 18, 6); P.tile('oak_planks', 17, 8.1, { w: 3, h: .4, dark: .05 });
    P.glow(9.5 * 48, 3 * 48, 330, 'rgba(255,190,90,.28)');
    P.rect('rgba(255,170,60,.07)', 0, 0, COLS, ROWS); P.vignette(.35);
  };
  S.town = P => {   // hometown: sunny hills, trees, houses and a dirt path leading away
    P.seed(3); P.sky('#6fb0ff', '#d9ecff'); P.clouds(4);
    P.hills('grass_block_top', 4, 1, { dark: .22, fog: 'rgba(200,225,255,.18)' });
    for (const c of [0, 3, 6, 13, 17, 19]) P.tree(c, 7, { h: 5, dark: .3 });
    P.house(1, 7, 4, 3, { wall: 'oak_planks', roof: 'spruce_planks', dark: .15 }); P.house(14, 7, 4, 3, { wall: 'birch_planks', roof: 'spruce_planks', dark: .15 });
    for (let c = 0; c < COLS; c++) P.tile('grass_block_top', c, 7, { dark: .12 });
    // far path winds between the houses, widening towards the viewer
    P.tile('dirt_path_top', 9, 7, { dark: .1 }); P.tile('dirt_path_top', 10, 7, { dark: .1 });
    for (let c = 0; c < COLS; c++) P.tile('grass_block_top', c, 8, {});
    for (let c = 6; c <= 13; c++) P.tile('dirt_path_top', c, 8, {});
    for (let r = 9; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const half = 4 + (r - 8) * 1.8; const d = Math.abs(c + .5 - 10);
      P.tile(d <= half ? 'dirt_path_top' : 'grass_block_top', c, r, { dark: r > 9 ? .04 : 0 });
    }
    for (const c of [3, 8, 11, 16]) P.tile('gravel', c, 10, { w: .6, h: .3, dark: .1 });
    P.fence(1, 8, 4, 'oak_planks'); P.fence(14, 8, 4, 'oak_planks');
    P.torch(5.2, 6.6); P.torch(13.5, 6.6);
    P.vignette(.15);
  };
  S.forest = P => {
    P.seed(7); P.sky('#7fc7f0', '#d4f0ff'); P.clouds(3);
    P.hills('grass_block_top', 5, 1, { dark: .55, fog: 'rgba(160,210,230,.4)' });
    for (const c of [1, 4, 8, 11, 15, 18]) P.tree(c, 7, { h: 5, dark: .35 });
    P.ground(8, 'grass_block_top', 'dirt', 'stone', {});
    P.path(0, 8, COLS, 'dirt_path_top');
    for (const c of [2, 6, 13, 17]) P.tree(c, 8, { h: 5 });
    P.vignette(.3);
  };
  S.cliff = P => {
    P.seed(11); P.sky('#2a2f5e', '#c97e5a'); P.stars(25, .5); P.sun(3, 4, '#ffd9a0', 1.6);
    P.hills('stone', 3, 1, { dark: .55, fog: 'rgba(80,60,90,.5)' });
    for (let c = 11; c < 17; c++) for (let r = 2; r < 8; r++) P.tile(c === 12 || c === 11 ? 'stone' : 'andesite', c, r, { dark: .5 });
    P.ground(8, 'grass_block_top', 'dirt', 'stone', { dark: .15 }); P.path(0, 8, COLS, 'dirt_path_top');
    for (const c of [2, 5, 9, 18]) P.tree(c, 8, { h: 5, dark: .2 });
    P.overlay('rgba(40,20,70,.28)'); P.vignette(.5);
  };
  S.gate = P => {  // Leaf Village gate: big clay wall ring, grey mountain, forest, green banners
    P.seed(5); P.sky('#6aa5ff', '#cfe4ff'); P.clouds(3);
    for (let c = 0; c < COLS; c++) { const h = 2 + Math.round(3 * Math.exp(-Math.pow((c - 9) / 4.5, 2))); for (let r = 4 - h; r < 5; r++) P.tile('stone', c, r + 1, { dark: .25 + (c % 3) * .03 }); }
    P.hills('grass_block_top', 5, 1, { dark: .5, tint: [70, 130, 50], fog: 'rgba(190,225,255,.3)' });
    for (let c = 0; c < COLS; c++) for (let r = 6; r < 8; r++) P.tile(r === 6 ? 'sandstone' : 'terracotta', c, r, { dark: .1 });
    for (const c of [0, 2, 5, 13, 16, 18]) P.tree(c, 8, { h: 5, leaf: 'dark_oak_leaves', dark: .15 });
    for (let c = 6; c <= 13; c++) { P.tile('stone_bricks', c, 3); P.tile('stone', c, 2, { dark: .1 }); }
    P.wall(6, 8, 1, 5, 'stone_bricks'); P.wall(13, 8, 1, 5, 'stone_bricks');
    for (let c = 7; c < 13; c++) for (let r = 4; r < 8; r++) P.tile('sand', c, r, { dark: .3 });
    P.banner(3, 3, '#2f7a2a'); P.banner(16, 3, '#2f7a2a'); P.rect('#b8231a', 3.35, 3.55, .3, .6); P.rect('#b8231a', 16.35, 3.55, .3, .6);
    P.ground(8, 'grass_block_top', 'dirt', 'stone', {}); P.path(6, 8, 8, 'sandstone');
    P.vignette(.2);
  };
  S.street = P => {  // inside Leaf Village: forest, wooden houses, clay wall, mountain
    P.seed(9); P.sky('#6aa5ff', '#cfe4ff'); P.clouds(3);
    for (let c = 0; c < COLS; c++) { const h = 1 + Math.round(2 * Math.exp(-Math.pow((c - 13) / 5, 2))); for (let r = 4 - h; r < 5; r++) P.tile('stone', c, r + 1, { dark: .3 }); }
    for (let c = 0; c < COLS; c++) { P.tile('sandstone', c, 5, { dark: .05 }); P.tile('terracotta', c, 6, { dark: .1 }); }
    for (const c of [1, 4, 7, 10, 13, 16, 19]) P.tree(c, 7, { h: 5, leaf: 'dark_oak_leaves', dark: .3 });
    for (let c = 0; c < COLS; c++) for (let r = 5; r < 8; r++) P.tile('terracotta', c, r, { dark: .12 });
    P.house(0, 8, 5, 3, { wall: 'spruce_planks', roof: 'dark_oak_planks', dark: .15 }); P.house(8, 8, 4, 3, { wall: 'oak_planks', roof: 'stone_bricks', dark: .15 }); P.house(15, 8, 5, 4, { wall: 'dark_oak_planks', roof: 'red_terracotta', dark: .12 });
    P.banner(6, 5, '#2f7a2a'); P.banner(13, 5, '#2f7a2a');
    P.ground(8, 'grass_block_top', 'dirt', 'stone', {}); P.path(0, 8, COLS, 'dirt_path_top'); P.tree(13, 8, { h: 4, leaf: 'dark_oak_leaves' });
    P.vignette(.2);
  };
  S.office = P => {
    P.roomWall('dark_oak_planks', 8, 'spruce_planks', { beams: 'spruce_log' });
    P.window(7, 2, 6, 3, { sky: '#9ad7ff' });
    P.banner(3, 1, '#3a8a2a'); P.banner(16, 1, '#3a8a2a');
    for (let c = 1; c <= 3; c++) { P.tile('bookshelf', c, 6); P.tile('bookshelf', c, 5); } for (let c = 16; c <= 18; c++) { P.tile('bookshelf', c, 6); P.tile('bookshelf', c, 5); P.tile('bookshelf', c, 7); }
    for (let c = 7; c <= 12; c++) P.tile('oak_planks', c, 7, { h: 1, dark: .1 }); P.tile('dark_oak_planks', 7, 7); P.tile('dark_oak_planks', 12, 7);
    P.item('paper', 8, 6.3, .9); P.item('writable_book', 10, 6.3, .9); P.lantern(6, 3); P.lantern(13, 3);
    P.rect('rgba(255,170,60,.10)', 0, 0, COLS, ROWS); P.vignette(.4);
  };
  S.dojo = P => {   // indoor training hall
    P.roomWall('spruce_planks', 8, 'dark_oak_planks', { beams: 'dark_oak_log' });
    for (let c = 2; c < 18; c += 5) { P.tile('hay_block_side', c, 7); P.tile('hay_block_side', c, 6); }
    P.banner(2, 1, '#3a8a2a'); P.banner(9, 1, '#3a8a2a'); P.banner(17, 1, '#3a8a2a');
    P.torch(5, 4); P.torch(14, 4);
    P.rect('rgba(255,170,60,.1)', 0, 0, COLS, ROWS); P.vignette(.35);
  };
  S.checkpoint = P => {
    P.seed(13); P.sky('#7aa8c8', '#b9d6e6'); P.clouds(3, 'rgba(255,255,255,.6)');
    P.hills('grass_block_top', 5, 1, { dark: .6, fog: 'rgba(150,180,200,.45)' });
    for (const c of [1, 3, 7, 10, 14, 17, 19]) P.tree(c, 7, { h: 5, dark: .45 });
    P.ground(8, 'grass_block_top', 'dirt', 'stone', { dark: .12 });
    P.wall(7, 8, 2, 2, 'mossy_stone_bricks', { dark: .1 }); P.wall(7, 8, 1, 3, 'cracked_stone_bricks');
    P.tile('barrel_side', 12, 7); P.tile('barrel_side', 13, 7, { dark: .1 }); P.tile('oak_planks', 12.5, 6, { h: .5 });
    P.overlay('rgba(30,50,70,.18)'); P.vignette(.4);
  };
  S.rock = P => {  // Rock Village: grey cliff terraces, brown pagodas, cherry blossom, water
    P.seed(17); P.sky('#7aa8ff', '#d6e6ff'); P.clouds(3);
    for (let c = 0; c < COLS; c++) { const h = 3 + Math.round(2 * Math.exp(-Math.pow((c - 10) / 5, 2))); for (let r = 6 - h; r < 8; r++) P.tile(r < 3 ? 'calcite' : 'andesite', c, r, { dark: .15 }); }
    for (let c = 0; c < COLS; c++) for (let r = 5; r < 8; r++) P.tile('stone', c, r, { dark: .2 });
    P.pagoda(3, 5, 3, { dark: .1 }); P.pagoda(13, 5, 2, { dark: .1 });
    for (const c of [6, 9, 18]) { P.tile('cherry_leaves', c, 4, { dark: .0 }); P.tile('cherry_leaves', c + 1, 4); P.tile('cherry_leaves', c, 3); P.tile('cherry_log', c, 5); }
    P.ground(8, 'stone', 'andesite', 'stone', { midDepth: 2 }); P.tile('water_still', 0, 8, { w: 3 }); P.tile('water_still', 17, 8, { w: 3 });
    for (let c = 3; c < 17; c++) P.tile('oak_planks', c, 8, { h: .4, dark: .1 });
    P.pagoda(7, 8, 1, { dark: .05 }); P.torch(5, 7); P.torch(15, 7); P.vignette(.2);
  };
  S.rockhq = P => {
    P.roomWall('stone_bricks', 8, 'polished_andesite', { beams: 'stone' });
    P.window(8, 2, 4, 3, { sky: '#b5c9d6' }); P.banner(3, 1, '#6a6a6a'); P.banner(16, 1, '#6a6a6a');
    P.tile('anvil', 15, 7); P.tile('furnace_front', 17, 7); P.tile('crafting_table_front', 2, 7); P.torch(6, 4); P.torch(13, 4);
    for (let c = 7; c <= 12; c++) P.tile('stone', c, 7, { dark: .1 }); P.item('filled_map', 9, 6.2, 1); P.item('iron_axe', 11, 6.1, .9);
    P.rect('rgba(255,170,60,.08)', 0, 0, COLS, ROWS); P.vignette(.4);
  };
  S.cave = P => {
    P.seed(19); P.sky('#0a0a14', '#14121c');
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) P.tile(r < 2 || r > 7 ? 'deepslate' : ((c + r) % 7 === 0 ? 'cobbled_deepslate' : 'deepslate_bricks'), c, r, { dark: .55 });
    for (let c = 0; c < COLS; c++) { P.tile('deepslate', c, 8, { dark: .1 }); for (let r = 9; r < ROWS; r++) P.tile('deepslate_tiles', c, r, { dark: .25 }); }
    P.torch(3, 5); P.torch(9, 4); P.torch(16, 5);
    P.tile('barrel_side', 12, 7); P.tile('barrel_side', 13, 7); P.tile('barrel_side', 12, 6, { dark: .1 });
    P.glow(3 * N, 5 * N, 220, 'rgba(255,170,60,.25)'); P.glow(16 * N, 5 * N, 220, 'rgba(255,170,60,.25)'); P.vignette(.7);
  };
  S.cloud = P => {  // Cloud Village: red mesa pillars with striped layers and conical-roofed towers
    P.seed(23); P.sky('#6fb1ff', '#cfe6ff'); P.clouds(4);
    const L = ['orange_terracotta', 'terracotta', 'yellow_terracotta', 'red_terracotta', 'white_terracotta', 'brown_terracotta'];
    for (let c = 0; c < COLS; c++) { const h = 2 + Math.round(2 * Math.abs(Math.sin(c * .7))); for (let r = 7 - h; r < 8; r++) P.tile(L[(r + c % 2) % L.length], c, r, { dark: .25 }); }
    P.tower(1, 8, 4, { wall: 'terracotta', roof: 'deepslate_tiles', dark: .05 }); P.tower(6, 8, 6, { wall: 'orange_terracotta', roof: 'cobblestone' }); P.tower(11, 8, 5, { wall: 'terracotta', roof: 'purpur_block' }); P.tower(16, 8, 4, { wall: 'orange_terracotta', roof: 'deepslate_tiles' });
    for (let c = 0; c < COLS; c++) { P.tile('red_terracotta', c, 8, {}); for (let r = 9; r < ROWS; r++) P.tile(L[(r + c) % L.length], c, r, { dark: .1 }); }
    P.overlay('rgba(120,20,10,.08)'); P.vignette(.3);
  };
  S.cloudhq = P => {
    P.roomWall('white_wool', 8, 'light_gray_wool', { beams: 'oak_log', dark: .02 });
    P.window(2, 2, 4, 4, { sky: '#a8d4ff' }); P.window(14, 2, 4, 4, { sky: '#a8d4ff' });
    P.banner(9, 1, '#9fd0ff'); P.banner(10, 1, '#9fd0ff'); for (let c = 7; c <= 12; c++) P.tile('oak_planks', c, 7, { dark: .08 }); P.item('filled_map', 8, 6.2, 1); P.item('ender_eye', 11, 6.2, .9);
    P.lantern(6, 3); P.lantern(13, 3); P.rect('rgba(255,255,255,.05)', 0, 0, COLS, ROWS); P.vignette(.3);
  };
  S.bridge = P => {
    P.seed(29); P.sky('#7fb6ff', '#d8ebff'); P.clouds(8);
    P.hills('stone', 5, 2, { dark: .5, fog: 'rgba(210,225,245,.55)' });
    for (let c = 0; c < COLS; c++) { P.tile('oak_planks', c, 8, {}); if (c % 3 === 0) { P.tile('oak_log', c, 7, {}); P.tile('oak_log', c, 6, {}); } else P.tile('oak_planks', c, 7, { h: .5, dark: .1 }); }
    for (let c = 7; c < 10; c++) P.tile('air', c, 8);
    P.rect('#7fb6ff', 7.6, 8, 1.2, 1); for (let c = 0; c < COLS; c++) for (let r = 9; r < ROWS; r++) P.tile('white_wool', c, r, { alpha: .6 });
    P.vignette(.2);
  };
  S.tower = P => {
    P.seed(31); P.sky('#5a6f8a', '#98a9bb'); P.clouds(4, 'rgba(210,215,225,.8)');
    P.hills('stone', 5, 1, { dark: .6, fog: 'rgba(120,135,155,.5)' });
    P.wall(7, 8, 6, 8, 'mossy_stone_bricks', { dark: .08 }); for (let c = 7; c < 13; c += 2) P.tile('mossy_stone_bricks', c, 0 + 0, {}); P.wall(9, 8, 2, 3, 'cracked_stone_bricks');
    P.window(9, 2, 2, 2, { sky: '#222' }); P.tile('oak_door_top', 9.5, 6); P.tile('oak_door_bottom', 9.5, 7);
    P.ground(8, 'grass_block_top', 'dirt', 'stone', { dark: .15 }); P.tree(3, 8, { h: 4, dark: .1 }); P.tree(16, 8, { h: 4, dark: .1 });
    P.overlay('rgba(40,55,80,.2)'); P.vignette(.4);
  };
  S.chamber = P => {
    P.seed(37); P.sky('#0d0b14', '#16121f');
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) P.tile(r < 8 ? ((c * 3 + r) % 5 === 0 ? 'cracked_stone_bricks' : 'mossy_stone_bricks') : 'polished_deepslate', c, r, { dark: r < 8 ? .45 : .3 });
    P.tile('enchanting_table_top', 9, 7.3); P.item('book', 9.1, 6.2, .8); P.item('enchanted_book', 11, 7, .8); P.tile('bookshelf', 3, 6, { dark: .3 }); P.tile('bookshelf', 3, 5, { dark: .3 }); P.tile('bookshelf', 16, 6, { dark: .3 }); P.tile('bookshelf', 16, 5, { dark: .3 });
    P.torch(6, 4, { col: 'rgba(120,170,255,.3)' }); P.torch(13, 4, { col: 'rgba(120,170,255,.3)' }); P.glow(9.5 * N, 7 * N, 200, 'rgba(160,110,255,.35)'); P.vignette(.7);
  };
  S.war = P => {
    P.seed(41); P.sky('#3a2a3a', '#d87a4a'); P.stars(10, .3); P.sun(15, 3, '#ffb06a', 1.8);
    P.hills('stone', 4, 1, { dark: .65, fog: 'rgba(80,40,50,.5)' });
    P.wall(0, 8, 5, 4, 'stone_bricks', { dark: .2 }); P.wall(15, 8, 5, 4, 'stone_bricks', { dark: .2 });
    P.ground(8, 'dirt', 'dirt', 'stone', { dark: .15, midDepth: 2 }); P.path(0, 8, COLS, 'dirt_path_top');
    P.torch(5, 7, { r: 200, col: 'rgba(255,140,40,.4)' }); P.torch(14, 7, { r: 200, col: 'rgba(255,140,40,.4)' });
    for (const c of [3, 9, 12, 17]) { P.tile('campfire_log_lit', c, 7); P.glow((c + .5) * N, 7 * N, 160, 'rgba(255,120,30,.4)'); }
    P.overlay('rgba(90,20,10,.2)'); P.vignette(.55);
  };
  S.projection = P => {
    P.seed(43); P.sky('#070510', '#1b0f33'); P.stars(60, .8);
    for (let c = 0; c < COLS; c++) { P.tile('obsidian', c, 8, {}); for (let r = 9; r < ROWS; r++) P.tile('crying_obsidian', c, r, { dark: .35 }); }
    for (let r = 1; r < 8; r++) { P.tile('obsidian', 7, r, { dark: .15 }); P.tile('obsidian', 12, r, { dark: .15 }); }
    for (let c = 8; c < 12; c++) { P.tile('obsidian', c, 1, {}); }
    P.fill('crying_obsidian', 8, 2, 4, 6, { alpha: .35 }); P.glow(10 * N, 5 * N, 260, 'rgba(160,80,255,.5)'); P.vignette(.6);
  };
  S.road = P => {
    P.seed(47); P.sky('#10101c', '#2b2a3a'); P.stars(40, .5);
    P.hills('stone', 4, 1, { dark: .7, fog: 'rgba(20,20,40,.5)' });
    for (const c of [1, 4, 9, 13, 16, 19]) P.spruce(c, 7, { h: 7, dark: .5 });
    P.ground(8, 'coarse' in {} ? 'dirt' : 'podzol' in {} ? 'dirt' : 'dirt', 'dirt', 'stone', { dark: .25 }); P.path(0, 8, COLS, 'gravel');
    P.house(10, 8, 4, 3, { wall: 'cobblestone', roof: 'dark_oak_planks', dark: .5 }); P.tile('cobweb', 11, 6, { alpha: .8 });
    P.overlay('rgba(10,10,40,.3)'); P.vignette(.6);
  };
  S.ruins = P => {
    P.seed(53); P.sky('#0a0a12', '#171520');
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) P.tile(r < 8 ? ((c + r) % 4 === 0 ? 'cracked_stone_bricks' : 'mossy_stone_bricks') : 'mossy_cobblestone', c, r, { dark: .5 });
    for (let c = 0; c < COLS; c++) P.tile('stone_bricks', c, 8, { dark: .15 });
    for (const c of [3, 8, 15]) { P.pillar(c, 8, 5, 'chiseled_stone_bricks'); P.tile('chiseled_stone_bricks', c, 2); }
    P.tile('cobweb', 5, 3, { alpha: .8 }); P.tile('cobweb', 13, 4, { alpha: .8 });
    P.torch(6, 5, { col: 'rgba(110,200,255,.3)' }); P.torch(12, 5, { col: 'rgba(110,200,255,.3)' }); P.vignette(.7);
  };
  S.fortress = P => {
    P.seed(59); P.sky('#0e0a10', '#201018');
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) P.tile(r < 8 ? ((c * 2 + r) % 6 === 0 ? 'cracked_nether_bricks' : 'nether_bricks') : 'polished_blackstone_bricks', c, r, { dark: .5 });
    for (let c = 0; c < COLS; c++) P.tile('blackstone', c, 8, { dark: .15 });
    P.item('soul_lantern' in {} ? 'lantern' : 'lantern', 4, 3, 1); P.glow(4.5 * N, 3.5 * N, 200, 'rgba(120,200,255,.25)'); P.glow(15.5 * N, 3.5 * N, 200, 'rgba(120,200,255,.25)'); P.item('lantern', 15, 3, 1);
    P.tile('enchanting_table_top', 9, 7.3); P.item('map', 9.2, 5.5, .8, {}); P.glow(10 * N, 7 * N, 180, 'rgba(255,90,60,.25)'); P.vignette(.7);
  };
  S.end = P => {
    P.seed(61); P.sky('#09050f', '#1d0f2e'); P.stars(90, .9);
    // floating islands
    for (const [c, r, w] of [[2, 4, 4], [13, 3, 5], [7, 6, 3]]) { for (let i = 0; i < w; i++) { P.tile('end_stone', c + i, r, { dark: .1 }); if (i > 0 && i < w - 1) P.tile('end_stone', c + i, r + 1, { dark: .35 }); } }
    for (const c of [5, 15]) { P.pillar(c, 4, 4, 'obsidian'); P.tile('lantern', c, -1 + 0, {}); }
    for (let c = 0; c < COLS; c++) { P.tile('end_stone', c, 8, {}); for (let r = 9; r < ROWS; r++) P.tile('end_stone_bricks', c, r, { dark: .25 }); }
    P.pillar(2, 8, 6, 'obsidian'); P.pillar(17, 8, 7, 'obsidian'); P.glow(2.5 * N, 2.3 * N, 90, 'rgba(255,60,200,.45)'); P.glow(17.5 * N, 1.3 * N, 90, 'rgba(255,60,200,.45)');
    P.overlay('rgba(70,20,110,.18)'); P.vignette(.55);
  };
  S.hall = P => {
    P.roomWall('purpur_block', 8, 'end_stone_bricks', { beams: 'purpur_pillar', dark: .25 });
    for (const c of [3, 8, 11, 16]) { P.pillar(c, 8, 7, 'purpur_pillar'); }
    P.window(5, 2, 2, 3, { sky: '#1a0833' }); P.window(13, 2, 2, 3, { sky: '#1a0833' });
    P.glow(9.5 * N, 4 * N, 300, 'rgba(190,110,255,.25)'); P.item('totem_of_undying', 9, 3, 1.1); P.vignette(.55);
  };
  S.endbridge = P => {
    P.seed(67); P.sky('#060309', '#190a2a'); P.stars(110, .9);
    for (let c = 0; c < COLS; c++) { P.tile('obsidian', c, 8); P.tile('obsidian', c, 9, { dark: .3 }); if (c % 4 === 0) { P.tile('obsidian', c, 7); P.tile('lantern', c, 6); } }
    for (let c = 13; c < COLS; c++) for (let r = 1; r < 8; r++) P.tile((c + r) % 5 === 0 ? 'cracked_nether_bricks' : 'nether_bricks', c, r, { dark: .5 });
    P.window(15, 3, 2, 3, { sky: '#2a0a3a' }); P.glow(16 * N, 4 * N, 200, 'rgba(255,60,120,.35)'); P.overlay('rgba(60,10,90,.2)'); P.vignette(.6);
  };
  S.voidroom = P => {
    P.roomWall('blackstone', 8, 'polished_blackstone_bricks', { beams: 'obsidian', dark: .35 });
    for (let c = 0; c < COLS; c += 3) { P.tile('crying_obsidian', c, 3, { alpha: .6 }); }
    P.pillar(2, 8, 6, 'obsidian'); P.pillar(17, 8, 6, 'obsidian'); P.tile('lantern', 2, 1); P.tile('lantern', 17, 1);
    P.glow(10 * N, 6 * N, 380, 'rgba(150,60,255,.45)'); P.overlay('rgba(50,0,70,.25)'); P.vignette(.7);
  };
  S.fest = P => {
    P.seed(71); P.sky('#6aa5ff', '#ffe9c4'); P.sun(15, 1, '#fff6a8', 1.3); P.clouds(3);
    for (let c = 0; c < COLS; c++) { P.tile('sandstone', c, 5); P.tile('terracotta', c, 6); }
    for (const c of [1, 5, 9, 14, 18]) P.tree(c, 7, { h: 5, leaf: 'dark_oak_leaves', dark: .25 });
    P.house(0, 8, 5, 4, { wall: 'spruce_planks', roof: 'dark_oak_planks', dark: .12 }); P.house(15, 8, 5, 4, { wall: 'oak_planks', roof: 'red_terracotta', dark: .12 });
    const cols = ['#e33', '#fc3', '#2f7a2a', '#39f', '#e3e']; for (let i = 0; i < 8; i++) P.banner(5.5 + i * 1.1, 3.3, cols[i % cols.length]);
    P.ground(8, 'grass_block_top', 'dirt', 'stone', {}); P.path(0, 8, COLS, 'dirt_path_top'); P.vignette(.15);
  };
  S.night = P => {
    P.seed(73); P.sky('#0b1030', '#2a3260'); P.stars(60, .85); P.sun(4, 1.5, '#e8f0ff', 1.1);
    P.hills('grass_block_top', 6, 1, { dark: .7, fog: 'rgba(20,30,70,.5)' });
    P.house(1, 8, 5, 4, { wall: 'oak_planks', roof: 'dark_oak_planks', dark: .55 }); P.house(13, 8, 5, 4, { wall: 'spruce_planks', roof: 'dark_oak_planks', dark: .55 });
    P.ground(8, 'grass_block_top', 'dirt', 'stone', { dark: .45 }); P.path(0, 8, COLS, 'dirt_path_top');
    P.lantern(8, 6); P.lantern(11, 6); P.overlay('rgba(10,20,80,.25)'); P.vignette(.5);
  };

  const CACHE = {};
  function needs() {
    const L = [];
    ['grass_block_top', 'grass_block_side', 'grass_block_side_overlay', 'dirt', 'dirt_path_top', 'stone', 'cobblestone', 'mossy_cobblestone', 'stone_bricks', 'mossy_stone_bricks', 'cracked_stone_bricks', 'oak_planks', 'spruce_planks', 'birch_planks', 'dark_oak_planks', 'oak_log', 'spruce_log', 'dark_oak_log', 'bookshelf', 'crafting_table_front', 'furnace_front', 'barrel_side', 'anvil', 'sand', 'gravel', 'deepslate', 'deepslate_bricks', 'deepslate_tiles', 'cobbled_deepslate', 'polished_deepslate', 'end_stone', 'end_stone_bricks', 'obsidian', 'crying_obsidian', 'purpur_block', 'purpur_pillar', 'blackstone', 'polished_blackstone_bricks', 'andesite', 'polished_andesite', 'nether_bricks', 'cracked_nether_bricks', 'torch', 'lantern', 'white_wool', 'light_gray_wool', 'packed_ice', 'oak_leaves', 'spruce_leaves', 'birch_leaves', 'dark_oak_leaves', 'water_still', 'hay_block_side', 'glass', 'oak_door_bottom', 'oak_door_top', 'cobweb', 'campfire_log_lit', 'enchanting_table_top', 'chiseled_stone_bricks', 'iron_bars', 'red_wool', 'blue_wool', 'yellow_wool', 'terracotta', 'red_terracotta', 'orange_terracotta', 'yellow_terracotta', 'white_terracotta', 'brown_terracotta', 'cherry_leaves', 'cherry_log', 'calcite', 'sandstone', 'sand', 'oak_trapdoor'].forEach(n => L.push(img(blockP(n)).p));
    ['map', 'paper', 'writable_book', 'filled_map', 'iron_axe', 'ender_eye', 'book', 'enchanted_book', 'totem_of_undying', 'lantern'].forEach(n => L.push(img(itemP(n)).p));
    return Promise.all(L);
  }
  let ready = null;
  function load() { return ready || (ready = needs()); }
  // paint (once) and return a canvas
  function scene(id) {
    if (CACHE[id]) return CACHE[id];
    const fn = S[id] || S.town; const P = makePainter();
    try { fn(P); } catch (e) { console.error('scene', id, e); }
    return CACHE[id] = P.cv;
  }
  window.StoryArt = { load, scene, ids: () => Object.keys(S), N, COLS, ROWS, img, itemP, blockP };
})();
