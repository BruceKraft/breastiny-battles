/* story-games.js - mini-games used by the story (timing, reflex, memory, search, maze, order) */
(function () {
  'use strict';
  const E = window.StoryEngine, ART = window.StoryArt;
  const { el, modal, closeModal, TPI } = E;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const heart = (n, max) => Array.from({ length: max }, (_, i) => `<img src="assets/tp/hud/heart/${i < n ? 'full' : 'container'}.png" alt="" onerror="this.src='assets/tp/hud/heart/full.png'">`).join('');
  const D_TOOLS = () => window.StoryData.TOOLS;
  const hurtS = () => { try { sfx.hit(); } catch (e) { } };

  // shared shell: returns {pan, body, done(result), lose(), hearts}
  function shell(s, tries, extra) {
    return new Promise(resolve => {
      const m = modal(`<div class="mg-title">${esc(s.title || 'Challenge')}</div><div class="mg-sub">${esc(E.sub(s.sub || ''))}</div><div class="mg-hearts" id="mgH"></div><div id="mgB"></div><div class="mg-row" id="mgR"></div>`, { dark: true, wide: true });
      const ctx = { lives: s.lives || 3, max: s.lives || 3, alive: true, raf: 0, timers: [], keyh: null };
      const body = $('#mgB'), row = $('#mgR');
      const hp = () => { $('#mgH').innerHTML = heart(ctx.lives, ctx.max); };
      hp();
      const done = r => { if (!ctx.alive) return; ctx.alive = false; cancelAnimationFrame(ctx.raf); ctx.timers.forEach(clearTimeout); if (ctx.keyh) document.removeEventListener('keydown', ctx.keyh); m.close(); resolve(r); };
      const hurt = () => { ctx.lives--; hurtS(); hp(); if (ctx.lives <= 0) { ctx.alive = false; cancelAnimationFrame(ctx.raf); body.innerHTML = '<div class="mg-msg">Out of tries!</div>'; row.innerHTML = ''; const b = el('button', 'stbtn', 'Try again'); b.onclick = () => { ctx.alive = true; done(false); }; row.appendChild(b); } };
      Object.assign(ctx, { body, row, done, hurt, hp, later: (f, ms) => { const t = setTimeout(f, ms); ctx.timers.push(t); return t; } });
      extra(ctx);
    });
  }

  /* timing bar: stop the cursor in the green zone */
  E.games.timing = (s, tries) => shell(s, tries, c => {
    const need = s.n || 3; let got = 0, pos = 0, dir = 1, last = 0, busy = false, finished = false;
    const base = (s.speed || .9) * (E.G.diff === 'easy' ? .75 : E.G.diff === 'hard' ? 1.25 : 1);
    const zw = Math.max(.14, (s.zone || .22) * (E.G.diff === 'easy' ? 1.3 : E.G.diff === 'hard' ? .85 : 1)); let zx = .4;
    c.body.innerHTML = `<div class="mg-bar"><div class="zone" id="mgZ"></div><div class="cur" id="mgC"></div></div><div class="mg-score" id="mgS"></div><div class="mg-row"><button class="stbtn big" id="mgGo" tabindex="-1">${esc(s.btn || 'STRIKE!')}</button></div><div class="mg-msg" id="mgM">Press the button or Space when the white line is inside the green zone.</div>`;
    const Z = $('#mgZ'), C = $('#mgC'), S = $('#mgS'), M = $('#mgM');
    const setZ = () => { zx = .08 + Math.random() * (.84 - zw); Z.style.left = zx * 100 + '%'; Z.style.width = zw * 100 + '%'; };
    setZ(); S.textContent = `0 / ${need}`;
    const tick = t => { if (!c.alive) return; if (!last) last = t; const dt = Math.min(.05, (t - last) / 1000); last = t; pos += dir * base * Math.pow(1.1, got) * dt; if (pos >= 1) { pos = 1; dir = -1; } if (pos <= 0) { pos = 0; dir = 1; } C.style.left = pos * 100 + '%'; c.raf = requestAnimationFrame(tick); };
    c.raf = requestAnimationFrame(tick);
    const hit = () => {
      if (!c.alive || busy || finished) return; busy = true; setTimeout(() => busy = false, 180);
      if (pos >= zx && pos <= zx + zw) { got++; playSnd('xp_orb'); S.textContent = `${got} / ${need}`; M.textContent = 'Nice hit!'; if (got >= need) { finished = true; cancelAnimationFrame(c.raf); c.later(() => c.done(true), 400); } else setZ(); }
      else { M.textContent = 'Missed! Wait for the line to be inside the green zone.'; c.hurt(); }
    };
    const go = $('#mgGo'); go.addEventListener('pointerdown', e => { e.preventDefault(); hit(); }); go.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }); go.addEventListener('keydown', e => e.preventDefault()); go.addEventListener('keyup', e => e.preventDefault());
    c.keyh = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); hit(); } }; document.addEventListener('keydown', c.keyh);
  });

  /* tutorial: you must actually use each tool once */
  E.games.tutorial = (s, tries) => shell(Object.assign({ lives: 99 }, s), tries, c => {
    $('#mgH').style.display = 'none';
    const ids = E.G.load.slice(); const T = D_TOOLS(); const used = new Set();
    const tip = { guard: 'Blocks or dodges the next attack.', heal: 'Restores health.', dmg: 'Hurts the foe.' };
    c.body.innerHTML = `<div class="mg-msg" id="mgM">Try each tool once. Tap them one by one!</div><div class="st-grid" id="tuG">${ids.map((id, i) => { const t = T[id]; return `<div class="st-tool" data-t="${id}"><img src="${t.img || TPI(t.icon)}" alt=""><b>${i + 1}. ${esc(t.n)}</b><small>${esc(t.m.d)}</small></div>`; }).join('')}</div><div class="mg-score" id="mgS">0 / ${ids.length}</div>`;
    $$('#tuG .st-tool').forEach(b => b.onclick = () => {
      if (!c.alive || used.has(b.dataset.t)) return; const t = T[b.dataset.t]; used.add(b.dataset.t); b.classList.add('on'); playSnd(t.snd || 'xp_orb');
      $('#mgM').textContent = t.m.dmg ? `${t.n}: you strike for ${t.m.dmg} damage!` : t.m.heal ? `${t.n}: you restore ${t.m.heal} HP!` : t.m.guard ? `${t.n}: ready! It protects you from the next attack.` : `${t.n}: used!`;
      $('#mgS').textContent = `${used.size} / ${ids.length}`; if (used.size >= ids.length) { $('#mgM').textContent += ' All tools tried! Remember: your biggest attack needs a turn to recharge.'; c.later(() => c.done(true), 1600); }
    });
  });

  /* reflex: a threat shows up, pick the right tool in time */
  E.games.reflex = (s, tries) => shell(s, tries, c => {
    const R = s.rounds || 5, pool = s.pool || [
      { t: 'An arrow is flying at you!', a: 'shield' }, { t: 'A sneaky strike from behind!', a: 'pearl' }, { t: 'You are wounded!', a: 'apple' }, { t: 'Throw something at the target!', a: 'bow' }, { t: 'Break through the wall!', a: 'iron_pickaxe' }];
    const T = E.G.diff === 'easy' ? 4200 : E.G.diff === 'hard' ? 2200 : 3200; let n = 0;
    const opts = s.opts || ['shield', 'pearl', 'apple', 'bow', 'iron_pickaxe'];
    const ICON = { shield: 'assets/mc/shield_block.png', pearl: TPI('ender_pearl'), apple: TPI('golden_apple'), bow: TPI('bow'), iron_pickaxe: TPI('iron_pickaxe'), iron_sword: TPI('iron_sword'), rod: TPI('fishing_rod') };
    const next = () => {
      if (!c.alive) return; if (n >= R) { c.done(true); return; }
      const q = pool[Math.floor(Math.random() * pool.length)]; n++;
      c.body.innerHTML = `<div class="mg-ev">${esc(q.t)}</div><div class="mg-timer"><i id="mgT"></i></div><div class="mg-seq">${opts.map(o => `<button class="mg-slot" data-o="${o}"><img src="${ICON[o]}" alt="${o}"></button>`).join('')}</div><div class="mg-score">${n} / ${R}</div>`;
      const bar = $('#mgT'); const t0 = performance.now(); let over = false;
      const tk = t => { if (!c.alive || over) return; const f = 1 - (t - t0) / T; bar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) { over = true; c.hurt(); if (c.alive && c.lives > 0) c.later(next, 350); return; } c.raf = requestAnimationFrame(tk); };
      c.raf = requestAnimationFrame(tk);
      $$('#mgB .mg-slot').forEach(b => b.onclick = () => { if (over || !c.alive) return; over = true; cancelAnimationFrame(c.raf); if (b.dataset.o === q.a) { b.classList.add('lit'); playSnd('xp_orb'); c.later(next, 380); } else { b.classList.add('bad'); c.hurt(); if (c.alive && c.lives > 0) c.later(next, 400); } });
    };
    next();
  });

  /* memory: repeat the pattern of tools */
  E.games.memory = (s, tries) => shell(s, tries, c => {
    const ic = s.icons || ['iron_sword', 'bow', 'golden_apple', 'ender_pearl'], R = s.rounds || 4; let seq = [], round = 0;
    const show = async () => {
      round++; seq.push(Math.floor(Math.random() * ic.length)); if (s.len && seq.length < s.len) while (seq.length < s.len) seq.push(Math.floor(Math.random() * ic.length));
      c.body.innerHTML = `<div class="mg-msg">Watch carefully…</div><div class="mg-seq">${ic.map((i, k) => `<button class="mg-slot" data-k="${k}"><img src="${TPI(i)}" alt=""></button>`).join('')}</div><div class="mg-score">Round ${round} / ${R}</div>`;
      const sl = $$('#mgB .mg-slot'); sl.forEach(b => b.style.pointerEvents = 'none'); await sleep(600);
      for (const k of seq) { if (!c.alive) return; sl[k].classList.add('lit'); try { sfx.click(); } catch (e) { } await sleep(520); sl[k].classList.remove('lit'); await sleep(220); }
      if (!c.alive) return; $('#mgB .mg-msg').textContent = 'Now repeat it!'; sl.forEach(b => b.style.pointerEvents = ''); let at = 0;
      sl.forEach(b => b.onclick = () => { if (!c.alive) return; const k = +b.dataset.k; if (k === seq[at]) { b.classList.add('lit'); setTimeout(() => b.classList.remove('lit'), 200); at++; if (at >= seq.length) { if (round >= R) c.later(() => c.done(true), 400); else c.later(show, 600); } } else { b.classList.add('bad'); c.hurt(); if (c.alive && c.lives > 0) { at = 0; c.later(() => { sl.forEach(x => x.classList.remove('bad')); show_again(); }, 600); } } });
    };
    const show_again = () => { round--; seq.pop(); show(); };
    show();
  });


  /* run: Chase's lesson - alternate your feet, build speed, don't stumble */
  E.games.run = (s, tries) => shell(s, tries, c => {
    const dm = E.G.diff === 'easy' ? 1.3 : E.G.diff === 'hard' ? .85 : 1; const limit = (s.time || 12) * dm * 1000;
    let pos = 0, lastFoot = null, streak = 0, t0 = performance.now(), fin = false;
    const face = faceURL();
    c.body.innerHTML = `<div class="mg-run"><div class="mg-track"><div class="mg-runner" id="mgRn">${face ? `<img src="${face}" alt="">` : ''}</div><div class="mg-finish">FINISH</div></div><div class="mg-timer"><i id="mgT"></i></div><div class="mg-row"><button class="stbtn big" id="mgL" tabindex="-1">&#9664; LEFT FOOT (A)</button><button class="stbtn big" id="mgRr" tabindex="-1">RIGHT FOOT (D) &#9654;</button></div><div class="mg-msg" id="mgM">Alternate left, right, left, right! Using the same foot twice makes you stumble. Keep your rhythm to build speed.</div><div class="mg-score" id="mgS">Speed x1.0</div></div>`;
    const Rn = $('#mgRn'), M = $('#mgM'), S = $('#mgS'), Tm = $('#mgT');
    const draw = () => { Rn.style.left = 'calc(' + Math.min(100, pos) + '% - ' + (Math.min(100, pos) * .36) + 'px)'; S.textContent = 'Speed x' + (1 + Math.min(streak, 10) * .08).toFixed(1); };
    const step = foot => {
      if (!c.alive || fin) return;
      if (foot === lastFoot) { M.textContent = 'Stumble! Use the OTHER foot.'; streak = 0; pos = Math.max(0, pos - 3); c.hurt(); draw(); return; }
      lastFoot = foot; streak++; pos += (s.step || 4.6) * (1 + Math.min(streak, 10) * .08); try { sfx.click(); } catch (e) { } M.textContent = streak > 5 ? 'Great rhythm!' : 'Keep going!'; draw();
      if (pos >= 100) { fin = true; pos = 100; draw(); playSnd('xp_orb'); M.textContent = 'You crossed the finish line!'; cancelAnimationFrame(c.raf); c.later(() => c.done(true), 700); }
    };
    $('#mgL').addEventListener('pointerdown', e => { e.preventDefault(); step('l'); }); $('#mgRr').addEventListener('pointerdown', e => { e.preventDefault(); step('r'); });
    $('#mgL').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }); $('#mgRr').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
    c.keyh = e => { if (e.repeat) return; const k = e.key.toLowerCase(); if (k === 'a' || k === 'arrowleft') { e.preventDefault(); step('l'); } else if (k === 'd' || k === 'arrowright') { e.preventDefault(); step('r'); } }; document.addEventListener('keydown', c.keyh);
    const tick = t => { if (!c.alive || fin) return; const f = 1 - (t - t0) / limit; Tm.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) { M.textContent = 'Too slow! Start again.'; pos = 0; streak = 0; lastFoot = null; t0 = performance.now(); draw(); c.hurt(); } if (c.alive && !fin) c.raf = requestAnimationFrame(tick); };
    draw(); c.raf = requestAnimationFrame(tick);
  });

  /* combo: Bruce's lesson - chain attacks in order before the window closes */
  E.games.combo = (s, tries) => shell(s, tries, c => {
    const ic = s.icons || ['iron_sword', 'iron_axe', 'mace', 'bow']; const names = s.names || ['Slash', 'Chop', 'Smash', 'Shot'];
    const lens = s.lens || [3, 4, 5]; const dm = E.G.diff === 'easy' ? 1.3 : E.G.diff === 'hard' ? .8 : 1; const win = (s.window || 1.7) * dm * 1000;
    let round = 0, seq = [], at = 0, t0 = 0, live = false, tm = null;
    const mk = () => { seq = Array.from({ length: lens[round] }, () => Math.floor(Math.random() * ic.length)); at = 0; paint('Chain the attacks in order. Each hit must land before the bar runs out!'); arm(); };
    const paint = msg => {
      c.body.innerHTML = `<div class="mg-seq" id="cbS">${seq.map((k, i) => `<span class="mg-slot cb ${i < at ? 'lit' : ''} ${i === at ? 'now' : ''}"><img src="${TPI(ic[k])}" alt=""><b>${names[k]}</b></span>`).join('')}</div><div class="mg-timer"><i id="mgT"></i></div><div class="mg-seq" id="cbB">${ic.map((i, k) => `<button class="mg-slot" data-k="${k}"><img src="${TPI(i)}" alt=""><b>${k + 1}</b></button>`).join('')}</div><div class="mg-msg" id="mgM">Combo ${round + 1} / ${lens.length} (${seq.length} hits): ${esc(msg)}</div>`;
      $$('#cbB .mg-slot').forEach(b => b.onclick = () => hit(+b.dataset.k));
    };
    const arm = () => { live = true; t0 = performance.now(); cancelAnimationFrame(c.raf); const tk = t => { if (!c.alive || !live) return; const f = 1 - (t - t0) / win; const bar = $('#mgT'); if (bar) bar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) { live = false; c.hurt(); if (c.alive && c.lives > 0) { at = 0; paint('Too slow! The combo dropped. Start again.'); arm(); } return; } c.raf = requestAnimationFrame(tk); }; c.raf = requestAnimationFrame(tk); };
    const hit = k => {
      if (!c.alive || !live) return;
      if (k === seq[at]) { at++; playSnd(['sword_swing', 'sword_swing', 'mace_hit', 'bow'][k] || 'sword_swing'); if (at >= seq.length) { live = false; cancelAnimationFrame(c.raf); playSnd('xp_orb'); round++; paint(seq.length + ' hit combo!'); if (round >= lens.length) { c.later(() => c.done(true), 800); } else c.later(mk, 900); } else { paint('Hit ' + at + '! Keep the chain going!'); t0 = performance.now(); } }
      else { live = false; c.hurt(); if (c.alive && c.lives > 0) { at = 0; paint('Wrong move! Follow the order.'); arm(); } }
    };
    c.keyh = e => { const k = +e.key - 1; if (k >= 0 && k < ic.length) { e.preventDefault(); hit(k); } }; document.addEventListener('keydown', c.keyh);
    mk();
  });

  /* search: click the hotspots on a scene to find clues */
  E.games.search = (s, tries) => shell(Object.assign({ lives: 99 }, s), tries, async c => {
    await ART.load(); const cv = ART.scene(s.scene); const need = s.need || s.spots.filter(x => x.key).length; let got = 0;
    c.body.innerHTML = `<div class="mg-field" id="mgF"></div><div class="mg-msg" id="mgM">${esc(s.hint || 'Click around the scene to look for clues.')}</div><div class="mg-score" id="mgS">Clues: 0 / ${need}</div>`;
    $('#mgH').style.display = 'none';
    const f = $('#mgF'); const cc = document.createElement('canvas'); cc.width = cv.width; cc.height = cv.height; cc.getContext('2d').drawImage(cv, 0, 0); f.appendChild(cc);
    const msg = $('#mgM');
    (s.spots).forEach(sp => {
      const b = el('button', 'mg-hot'); b.style.cssText = `left:${sp.x}%;top:${sp.y}%;width:${sp.w || 10}%;height:${(sp.w || 10) * 1.4}%`; if (sp.icon) b.innerHTML = `<img src="${TPI(sp.icon)}" alt="" onerror="this.onerror=null;this.src='assets/tp/block/${sp.icon}.png'" style="opacity:${sp.hidden ? .0 : 1}">`;
      b.onclick = () => { if (!c.alive) return; b.classList.add('done'); if (sp.key) { got++; playSnd('xp_orb'); if (sp.give) E.giveItem(sp.give[0], sp.give[1]); } msg.textContent = sp.say || '…nothing here.'; $('#mgS').textContent = `Clues: ${got} / ${need}`; if (got >= need) { c.later(() => c.done(true), 900); } };
      f.appendChild(b);
    });
  });

  /* maze: guide your face-head through the corridor, collect keys, reach the exit */
  function seeded(n) { let a = n >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function faceURL() {
    const sk = E.skinOf('you'); if (!sk) return null; const t = sk.tex; const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d');
    const img = x.createImageData(8, 8); for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const o = ((8 + j) * t.w + 8 + i) * 4, k = (j * 8 + i) * 4; for (let q = 0; q < 4; q++) img.data[k + q] = t.d[o + q]; }
    x.putImageData(img, 0, 0); if (t.h >= 64) { const ov = x.createImageData(8, 8); const o2 = c.cloneNode(); for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const o = ((8 + j) * t.w + 40 + i) * 4, k = (j * 8 + i) * 4; for (let q = 0; q < 4; q++) ov.data[k + q] = t.d[o + q]; } const tmp = document.createElement('canvas'); tmp.width = tmp.height = 8; tmp.getContext('2d').putImageData(ov, 0, 0); x.drawImage(tmp, 0, 0); }
    return c.toDataURL();
  }
  E.games.maze = (s, tries) => shell(Object.assign({ lives: 99 }, s), tries, c => {
    $('#mgH').style.display = 'none';
    const W = s.size || 9, H = s.h || W, rnd = seeded(s.seed || 7);
    const g = Array.from({ length: H }, () => Array(W).fill(1));
    const st = [[1, 1]]; g[1][1] = 0;
    while (st.length) { const [x, y] = st[st.length - 1]; const d = [[2, 0], [-2, 0], [0, 2], [0, -2]].filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx > 0 && ny > 0 && nx < W - 1 && ny < H - 1 && g[ny][nx]; }); if (!d.length) { st.pop(); continue; } const [dx, dy] = d[Math.floor(rnd() * d.length)]; g[y + dy / 2][x + dx / 2] = 0; g[y + dy][x + dx] = 0; st.push([x + dx, y + dy]); }
    const open = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (!g[y][x] && (x > 1 || y > 1) && !(x === W - 2 && y === H - 2)) open.push([x, y]);
    const need = s.keys || 3, keys = []; for (let i = 0; i < need && open.length; i++) { const k = open.splice(Math.floor(rnd() * open.length), 1)[0]; keys.push(k); }
    const loot = s.loot ? open.splice(Math.floor(rnd() * open.length), 1)[0] : null;
    let px = 1, py = 1, got = 0; const face = faceURL();
    c.body.innerHTML = `<div class="mg-maze" id="mgMz" style="grid-template-columns:repeat(${W},var(--mc))"></div><div class="mg-score" id="mgS">${esc(s.what || 'Keys')}: 0 / ${need}</div><div class="mg-dpad"><span></span><button class="stbtn" data-d="u">&#9650;</button><span></span><button class="stbtn" data-d="l">&#9664;</button><button class="stbtn" data-d="d">&#9660;</button><button class="stbtn" data-d="r">&#9654;</button></div>`;
    const mz = $('#mgMz'); mz.style.setProperty('--mc', Math.min(32, Math.floor((Math.min(innerWidth - 80, 560)) / W)) + 'px');
    const bg = s.floor || 'stone_bricks', wall = s.wall || 'deepslate_bricks';
    const draw = () => {
      mz.innerHTML = ''; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const d = document.createElement('div'); d.style.backgroundImage = `url(assets/tp/block/${g[y][x] ? wall : bg}.png)`;
        let ic = null; if (x === px && y === py) ic = face || TPI('paper') || ''; else if (x === W - 2 && y === H - 2) ic = TPI(got >= need ? 'iron_door' : 'barrier'); else if (keys.some(k => k[0] === x && k[1] === y)) ic = TPI(s.icon || 'iron_nugget'); else if (loot && loot[0] === x && loot[1] === y) ic = TPI('diamond');
        if (ic) { const i = new Image(); i.src = ic; d.appendChild(i); } mz.appendChild(d);
      }
      $('#mgS').textContent = `${s.what || 'Keys'}: ${got} / ${need}`;
    };
    const mv = dir => {
      if (!c.alive) return; const [dx, dy] = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }[dir]; const nx = px + dx, ny = py + dy; if (g[ny] === undefined || g[ny][nx] !== 0) return; px = nx; py = ny;
      const ki = keys.findIndex(k => k[0] === px && k[1] === py); if (ki >= 0) { keys.splice(ki, 1); got++; playSnd('xp_orb'); }
      if (loot && loot[0] === px && loot[1] === py) { s.loot && E.giveItem(s.loot[0], s.loot[1]); keys.length; loot[0] = -1; }
      draw(); if (px === W - 2 && py === H - 2 && got >= need) c.later(() => c.done(true), 300);
    };
    draw(); $$('.mg-dpad .stbtn').forEach(b => b.onclick = () => mv(b.dataset.d));
    c.keyh = e => { const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r' }[e.key]; if (m) { e.preventDefault(); mv(m); } }; document.addEventListener('keydown', c.keyh);
  });

  /* order: put the symbols in the order the clues describe */
  E.games.order = (s, tries) => shell(s, tries, c => {
    const items = s.items, want = s.answer; let at = 0;
    c.body.innerHTML = `<div class="mg-ev" style="height:auto;padding:10px;line-height:1.9">${s.clues.map(x => esc(x)).join('<br>')}</div><div class="mg-seq">${items.map((it, i) => `<button class="mg-slot" data-i="${i}" title="${esc(it.n)}"><img src="${TPI(it.icon)}" alt="${esc(it.n)}"></button>`).join('')}</div><div class="mg-score" id="mgS">Step 1 / ${want.length}</div>`;
    $$('#mgB .mg-slot').forEach(b => b.onclick = () => { if (!c.alive) return; const i = +b.dataset.i; if (i === want[at]) { b.classList.add('lit'); b.style.pointerEvents = 'none'; playSnd('xp_orb'); at++; $('#mgS').textContent = `Step ${Math.min(at + 1, want.length)} / ${want.length}`; if (at >= want.length) c.later(() => c.done(true), 500); } else { c.hurt(); if (c.alive && c.lives > 0) { $$('#mgB .mg-slot').forEach(x => { x.classList.remove('lit'); x.style.pointerEvents = ''; }); at = 0; $('#mgS').textContent = `Step 1 / ${want.length}`; } } });
  });
})();
