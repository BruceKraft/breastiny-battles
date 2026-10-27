/* ==========================================================================
   story.js - Story Mode engine (stage, dialogue, saves, battle bridge)
   Depends on: game.js globals, Skin3D, StoryArt, StoryData
   ========================================================================== */
(function () {
  'use strict';
  const D = window.StoryData, SK3 = window.Skin3D, ART = window.StoryArt;
  const { CH, OUT, TOOLS, FOES, MONMAP, START_TOOLS } = D;
  const ABORT = { abort: true };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const TPI = n => (String(n).indexOf('/') >= 0 ? n : 'assets/tp/item/' + n + '.png');
  const sleepR = ms => new Promise(r => setTimeout(r, ms));

  /* ------------------------------------------------------------------ state */
  let G = null;               // the save
  let running = false, tok = 0, inHub = false;
  const wakers = new Set();
  const SKIN = {};            // character id -> skin object (real or default)
  const REAL = {};            // character id -> true when a username skin loaded
  const DEF = {};             // default skin cache
  const SKVER = {};
  const logArr = [];
  const UI = {};
  let boxBusy = false;

  const saveKey = () => 'bpb_story_v1_' + ((typeof me !== 'undefined' && me && me.key) || 'guest');
  function loadSave() { try { const s = localStorage.getItem(saveKey()); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function writeSave() { if (!G) return; try { localStorage.setItem(saveKey(), JSON.stringify(G)); } catch (e) { } }
  function hashStr(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

  function newState(cfg) {
    return {
      v: 1, hero: { name: cfg.name, user: cfg.user || '', slim: !!cfg.slim, skinData: cfg.skinData || null, dye: cfg.dye || '#a06540', band: '#2f7a2a' },
      diff: cfg.diff || 'normal', rank: 4, outfit: 'leather', bandOn: false, dress: {}, custom: null,
      tools: START_TOOLS.slice(), load: START_TOOLS.slice(), items: [], flags: {}, ck: 'start', chapter: 0, ctitle: '', done: false,
      fails: {}, lore: [], hub: {}, town: pickTown(), skinSeed: Math.floor(Math.random() * 1e9)
    };
  }
  const pickTown = () => 'Hometown';

  /* ----------------------------------------------------------- characters */
  function heroCh() {
    const o = G.custom || OUT[G.outfit] || OUT.leather;
    const wp = heroWeaponIcon();
    return { name: G.hero.name, user: G.hero.user, skin: 'steve', armor: o.armor, trims: o.trims, band: G.bandOn ? G.hero.band : null, dye: G.hero.dye, item: wp, color: '#ffe066', pose: 'hold' };
  }
  function heroWeaponIcon() {
    for (const id of (G.load || [])) { const t = TOOLS[id]; if (t && t.m.dmg) return t.icon; }
    return 'iron_sword';
  }
  // generic NPCs (guards, masked fighters, villagers...) get a random skin per save: a player skin, or a mob from the texture pack
  function randLook(id) {
    if (!G) return null; if (G.skinSeed == null) G.skinSeed = Math.floor(Math.random() * 1e9);
    const h = hashStr(id + '|' + G.skinSeed), ents = D.ENTS || [], defs = SK3.DEFAULTS;
    if (ents.length && h % 100 < 35) return { skinFile: 'assets/skins/ent/' + ents[(h >>> 8) % ents.length] + '.png', slim: false };
    return { skin: defs[(h >>> 8) % defs.length], skinFile: '', slim: false };
  }
  function chOf(id) { if (id === 'you') return heroCh(); let c = CH[id]; if (!c) return null; if (c.rand) c = Object.assign({}, c, randLook(id)); const o = OUT[(G && G.dress && G.dress[id]) || c.out] || OUT.iron; return Object.assign({}, c, { armor: o.armor, trims: o.trims, ench: !!o.ench }); }

  async function defSkin(name, slim) {
    const k = name;
    if (!DEF[k]) DEF[k] = SK3.defaultSkin(name).catch(() => SK3.defaultSkin('steve'));
    const s = await DEF[k]; return Object.assign({}, s, { slim: !!slim });
  }
  function ready(id) { return !!SKIN[id]; }
  const fetching = {};
  // make sure a character can be drawn now; real skins load in the background and swap in when ready
  async function ensure(ids, waitMs) {
    ids = [...new Set(ids)].filter(Boolean);
    await Promise.all(ids.map(async id => {
      const c = chOf(id); if (!c) return;
      if (!SKIN[id]) {
        if (id === 'you') {
          let s = null;
          try {
            if (G.hero.skinData) s = await SK3.skinFromDataURL(G.hero.skinData, G.hero.slim);
            else if (G.hero.user) s = await SK3.fetchSkin(G.hero.user, { timeout: 5000 });
          } catch (e) { s = null; }
          if (s) { REAL.you = true; s.slim = G.hero.skinData ? G.hero.slim : s.slim; SKIN.you = s; }
          else SKIN.you = await defSkin(DEF_FOR(G.hero.name), G.hero.slim);
        } else if (c.skinFile) {
          try { const s = await SK3.skinFromDataURL(c.skinFile, c.slim); s.src = 'local'; SKIN[id] = s; REAL[id] = true; SKVER[id] = (SKVER[id] || 0) + 1; }
          catch (e) { console.warn('local skin failed', id, e); SKIN[id] = await defSkin(c.skin, c.slim); }
        } else {
          SKIN[id] = await defSkin(c.skin, c.slim);
          if (c.user && !fetching[id]) {
            fetching[id] = SK3.fetchSkin(c.user, { timeout: 4500 }).then(s => { if (s && validSkin(s, id)) { SKIN[id] = s; REAL[id] = true; SKVER[id] = (SKVER[id] || 0) + 1; refreshChars(); } else if (s) console.warn('skin rejected for', id); return s; }).catch(() => null);
          }
        }
      }
      try { await Promise.race([SK3.needAll(SK3.textureList(specFor(id))), sleepR(8000)]); } catch (err) { console.error('textures', id, err); }
    }));
    if (waitMs) await Promise.race([Promise.all(ids.map(id => fetching[id]).filter(Boolean)), sleepR(waitMs)]);
  }
  // warm everything up in the background so skins are already there when a scene needs them
  let warmed = false;
  function prefetchSkins() {
    if (warmed) return; warmed = true;
    const ids = Object.keys(CH).filter(id => CH[id] && (CH[id].user || CH[id].skinFile));
    ids.forEach((id, i) => setTimeout(() => { ensure([id]).catch(() => { }); }, i * 40));
    SK3.DEFAULTS.forEach(n => SK3.defaultSkin(n).catch(() => { }));
  }
  function validSkin(s, id) {
    try { const t = s.tex; let n = 0; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) if (t.d[((8 + j) * t.w + 8 + i) * 4 + 3] > 200) n++; if (n < 24) return false; const sp = Object.assign(specFor(id), { skin: s }); SK3.render(sp); return true; } catch (e) { return false; }
  }
  const DEF_FOR = n => SK3.DEFAULTS[hashStr(n) % SK3.DEFAULTS.length];

  const YAW = { r: 0.55, l: -0.55, f: 0.12, fr: 0.3, fl: -0.3, b: 3.0 };
  function specFor(id, o) {
    o = o || {}; const c = chOf(id);
    const item = o.item !== undefined ? o.item : (id === 'you' ? c.item : c.item);
    return { skin: SKIN[id], armor: c.armor, trims: c.trims, enchant: !!c.ench, dye: c.dye, band: c.band, mask: c.mask, item: item, pose: o.pose || c.pose || 'idle', yaw: YAW[o.face || 'f'], w: 240, h: 330, scale: 8.1 };
  }
  function sigOf(id, o) {
    const c = chOf(id); o = o || {};
    return [id, SKVER[id] || 0, REAL[id] ? 1 : 0, JSON.stringify(c.armor), JSON.stringify(c.trims || ''), c.ench ? 'E' : '', c.band || '', c.mask || '', c.dye || '', o.item !== undefined ? o.item : c.item, o.pose || c.pose || 'idle', o.face || 'f'].join('|');
  }
  function imgURL(id, o) {
    if (!SKIN[id]) return null;
    try { return SK3.toURL(specFor(id, o), sigOf(id, o)); } catch (e) { console.error('render', id, e); return null; }
  }

  /* --------------------------------------------------------- battle sprites */
  function spriteFor(m, back) {
    if (typeof B === 'undefined' || !B || !B.story) return null;
    const key = m.skinKey || MONMAP[m.id] || m.id;
    if (!SKIN[key] && !(key === 'you' && SKIN.you)) return null;
    const url = imgURL(key, { face: back ? 'r' : 'l', pose: 'hold' });
    if (!url) return null;
    return `<div class="sp"><img src="${url}" alt="${m.name.replace(/"/g, '')}"></div>`;
  }

  /* ----------------------------------------------------------------- DOM */
  function buildDom() {
    if (UI.root) return;
    const root = $('#screen-story'); UI.root = root;
    root.innerHTML = `
    <div class="st-wrap">
      <div class="st-top"><button class="stbtn sm" id="stBack">&larr; Menu</button><div class="ttl" id="stTtl">STORY MODE</div><div class="rk" id="stRk" style="display:none"></div></div>
      <div id="stEntry"></div>
      <div id="stPlay" style="display:none">
        <div class="st-stage" id="stStage">
          <canvas class="sc" id="stCv" width="960" height="576"></canvas>
          <div class="st-chars" id="stChars"></div>
          <div class="st-fx" id="stFx"></div>
          <div class="st-flash" id="stFlash"></div><div class="st-fade" id="stFade"></div>
          <div class="st-card" id="stCard"><div class="c1"></div><div class="c2"></div></div>
          <div class="st-toast" id="stToast"></div>
          <div class="st-modal" id="stModal"><div class="st-pan" id="stPan"></div></div>
        </div>
        <div class="st-box" id="stBox"><div class="who" id="stWho"></div><div class="txt" id="stTxt"></div><div class="nx" id="stNx" style="display:none">&#9660;</div></div>
        <div class="st-bar">
          <div class="st-hud"><div class="row2" id="stArmor"></div><div class="st-xp" id="stXp"><i></i><span></span></div><div class="st-hot" id="stHot"><b></b></div></div>
          <div class="st-btns"><button class="stbtn sm" id="stLog">Log</button><button class="stbtn sm" id="stInv">Tools</button><button class="stbtn sm" id="stPause">Menu</button></div>
        </div>
      </div>
    </div>`;
    UI.stage = $('#stStage'); UI.cv = $('#stCv'); UI.chars = $('#stChars'); UI.fx = $('#stFx'); UI.flash = $('#stFlash'); UI.fade = $('#stFade');
    UI.card = $('#stCard'); UI.toast = $('#stToast'); UI.modal = $('#stModal'); UI.pan = $('#stPan'); UI.box = $('#stBox'); UI.who = $('#stWho'); UI.txt = $('#stTxt'); UI.nx = $('#stNx');
    UI.entry = $('#stEntry'); UI.play = $('#stPlay'); UI.ttl = $('#stTtl'); UI.rk = $('#stRk');
    $('#stBack').onclick = () => { leave(); show('menu'); };
    UI.box.onclick = () => advance();
    UI.stage.addEventListener('click', () => { if (UI.modal.classList.contains('on')) return; advance(); });
    $('#stLog').onclick = () => openLog();
    $('#stInv').onclick = () => E.openLoadout();
    $('#stPause').onclick = () => { E.save(); leave(); show('menu'); };
    document.addEventListener('keydown', e => {
      if (!UI.root || !UI.root.classList.contains('active') || UI.modal.classList.contains('on')) return;
      if (UI.play.style.display === 'none') return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
    });
    window.addEventListener('resize', layout);
    new ResizeObserver(layout).observe(UI.stage);
  }
  function layout() {
    if (!UI.stage) return; const w = UI.stage.clientWidth, h = UI.stage.clientHeight; if (!w) return;
    const k = Math.max(w / 960, h / 576);
    UI.stage.style.setProperty('--feet', Math.round(1.55 * 48 * k) + 'px');
    UI.stage.style.setProperty('--chH', Math.round(Math.min(h * 0.74, w * 0.62)) + 'px');
  }

  /* ---------------------------------------------------------- scene / chars */
  let curScene = null; const onStage = {};
  const AT = { fl: 11, l: 26, ml: 38, c: 50, mr: 62, r: 74, fr: 89 };
  async function setScene(id, o) {
    o = o || {}; await ART.load();
    let cv = null; try { cv = ART.scene(id); } catch (err) { console.error('scene failed', id, err); } curScene = id;
    const x = UI.cv.getContext('2d'); x.imageSmoothingEnabled = false;
    if (o.fade !== false) { UI.fade.classList.add('on'); await aw(sleepR(250)); }
    x.clearRect(0, 0, UI.cv.width, UI.cv.height); if (cv) x.drawImage(cv, 0, 0); else { x.fillStyle = '#223'; x.fillRect(0, 0, UI.cv.width, UI.cv.height); }
    if (o.dim != null) UI.stage.classList.toggle('dim', !!o.dim);
    if (o.fade !== false) { await aw(sleepR(80)); UI.fade.classList.remove('on'); await aw(sleepR(250)); }
    layout();
  }
  function faceFor(at) { const p = AT[at] != null ? AT[at] : +at; return p < 40 ? 'r' : p > 60 ? 'l' : 'f'; }
  async function enter(id, at, o) {
    o = o || {}; await ensure([id]);
    exitChar(id, true);
    const c = chOf(id); const d = el('div', 'st-char' + (o.small ? ' small' : '') + (o.sil ? ' sil' : '')); d.dataset.id = id;
    d.style.left = (AT[at] != null ? AT[at] : (+at || 50)) + '%';
    const im = el('img'); d.appendChild(im);
    const nt = el('div', 'nt', (id === 'you' ? esc(G.hero.name) : esc(o.name || c.name)) + (o.tag || c.tag ? `<small>${esc(o.tag || c.tag)}</small>` : ''));
    if (!o.sil && !o.notag) d.appendChild(nt);
    const st = { id, at, face: o.face || faceFor(at), pose: o.pose || c.pose || 'idle', el: d, im, item: o.item };
    onStage[id] = st; applyImg(st); UI.chars.appendChild(d);
    await aw(sleepR(o.quick ? 60 : 280));
  }
  // put a character on the first free spot (the hero on the left side, everyone else on the right)
  async function autoEnter(id) {
    const slots = id === 'you' ? ['l', 'ml', 'fl', 'c'] : ['r', 'mr', 'fr', 'ml', 'c', 'fl'];
    const used = Object.values(onStage).map(s => s.at);
    const at = slots.find(a => !used.includes(a)) || slots[0];
    await enter(id, at, { quick: true });
  }
  function applyImg(st) { const u = imgURL(st.id, { face: st.face, pose: st.pose, item: st.item }); if (u) st.im.src = u; }
  function refreshChars() { Object.values(onStage).forEach(applyImg); }
  function exitChar(id, instant) { const st = onStage[id]; if (!st) return; delete onStage[id]; if (instant) st.el.remove(); else { st.el.classList.add('out'); setTimeout(() => st.el.remove(), 380); } }
  async function exitAll() { Object.keys(onStage).forEach(i => exitChar(i)); await aw(sleepR(300)); }
  function look(id, o) { const st = onStage[id]; if (!st) return; if (o.face) st.face = o.face; if (o.pose) st.pose = o.pose; if (o.at) { st.at = o.at; st.el.style.left = (AT[o.at] != null ? AT[o.at] : +o.at) + '%'; } if (o.item !== undefined) st.item = o.item; applyImg(st); }
  function spotlight(id) { Object.values(onStage).forEach(s => { s.el.classList.toggle('talk', s.id === id); s.el.classList.toggle('dim', !!id && s.id !== id); }); }

  /* ----------------------------------------------------------------- waits */
  function aw(p) { const t = tok; return new Promise((res, rej) => { const w = () => rej(ABORT); wakers.add(w); Promise.resolve(p).then(v => { wakers.delete(w); t !== tok ? rej(ABORT) : res(v); }, e => { wakers.delete(w); rej(e); }); }); }
  function abortAll() { tok++; const w = [...wakers]; wakers.clear(); w.forEach(f => f()); }
  let advRes = null, typing = false, skipType = false;
  function advance() { if (typing) { skipType = true; return; } if (advRes) { const r = advRes; advRes = null; r(); } }
  const sub = t => String(t).replace(/\{me\}/g, G ? G.hero.name : 'you').replace(/\{town\}/g, G ? G.town : 'town').replace(/\{rank\}/g, G ? ({ 4: 'Unranked', 3: 'Rank 3 Rookie Ninja', 2: 'Rank 2 Elite Ninja', 1: 'Rank 1 Master Ninja' })[G.rank] : '');

  async function sayLine(who, text, o) {
    o = o || {}; text = sub(text);
    const nar = !who; const c = who ? chOf(who) : null;
    UI.box.classList.toggle('nar', nar);
    UI.who.style.display = nar ? 'none' : ''; if (!nar) { UI.who.textContent = who === 'you' ? G.hero.name : (o.as || c.name); UI.who.style.setProperty('--wc', c.color || '#ffff55'); }
    UI.nx.style.display = 'none'; UI.txt.textContent = '';
    if (who && !onStage[who] && !o.as && !o.offstage && chOf(who)) await autoEnter(who);   // whoever speaks is standing on stage
    spotlight(who && onStage[who] ? who : null);
    logArr.push({ who: nar ? '' : UI.who.textContent, text });
    typing = true; skipType = false;
    const spd = (typeof TXT !== 'undefined' && TXT[S.speed]) ? TXT[S.speed].c : 26;
    for (let i = 0; i < text.length; i++) {
      if (skipType) { UI.txt.textContent = text; break; }
      UI.txt.textContent += text[i];
      if (S.type && i % 2 === 0 && text[i] !== ' ') sfx.type();
      await aw(sleepR(spd));
    }
    typing = false; UI.nx.style.display = '';
    await aw(new Promise(r => { advRes = r; }));
    advRes = null; UI.nx.style.display = 'none';
  }

  /* ---------------------------------------------------------------- modals */
  function modal(html, o) {
    o = o || {};
    UI.pan.className = 'st-pan' + (o.dark ? ' dark' : ''); UI.pan.style.maxWidth = o.wide ? 'min(900px,100%)' : '';
    UI.pan.innerHTML = html || ''; UI.modal.classList.add('on'); UI.modal.style.background = o.bare ? '#000a' : '';
    if (o.bare) { UI.pan.style.cssText = 'background:none;border:0;box-shadow:none;padding:0;max-width:min(680px,100%);width:100%'; }
    return { pan: UI.pan, close() { UI.modal.classList.remove('on'); UI.pan.style.cssText = ''; UI.pan.innerHTML = ''; } };
  }
  function closeModal() { UI.modal.classList.remove('on'); UI.pan.style.cssText = ''; UI.pan.innerHTML = ''; }
  function toast(icon, text) {
    const d = el('div', '', `<img src="${icon}" alt="">${esc(text)}`); UI.toast.appendChild(d); setTimeout(() => d.remove(), 3500);
  }
  function openLog() {
    const m = modal(`<h3>Story Log</h3><div class="st-log">${logArr.slice(-60).map(l => `<p>${l.who ? `<b>${esc(l.who)}:</b> ` : ''}${esc(l.text)}</p>`).join('') || '<p>Nothing yet.</p>'}</div><div class="mg-row"><button class="stbtn" id="lgX">Close</button></div>`, { dark: true });
    $('#lgX').onclick = () => m.close(); const lg = $('.st-log'); lg.scrollTop = lg.scrollHeight;
  }
  async function ask(q, opts) {
    return aw(new Promise(res => {
      UI.modal.classList.add('on'); UI.pan.className = ''; UI.pan.style.cssText = 'background:none;border:0;box-shadow:none;padding:0;max-width:min(680px,100%);width:100%';
      UI.pan.innerHTML = `<div class="st-choices">${q ? `<div class="st-q">${esc(sub(q))}</div>` : ''}${opts.map((o, i) => `<button class="stbtn big" data-i="${i}">${esc(sub(o.t))}</button>`).join('')}</div>`;
      $$('#stPan .stbtn').forEach(b => b.onclick = () => { closeModal(); res(+b.dataset.i); });
    }));
  }

  /* --------------------------------------------------------------- HUD bits */
  function updHud() {
    if (!G) return;
    const rk = $('#stRk'); const rname = { 4: 'Villager', 3: 'Rank 3 Rookie', 2: 'Rank 2 Elite', 1: 'Rank 1 Master' }[G.rank];
    const mat = (G.custom || OUT[G.outfit] || OUT.leather).armor.c || 'leather'; const ic = { leather: 'leather_chestplate', chainmail: 'chainmail_chestplate', iron: 'iron_chestplate', gold: 'golden_chestplate', copper: 'copper_chestplate', diamond: 'diamond_chestplate', netherite: 'netherite_chestplate' }[mat];
    rk.style.display = 'none';
    const pts = { leather: 7, chainmail: 12, iron: 15, gold: 11, copper: 13, diamond: 20, netherite: 20 }[mat] || 0, n = Math.round(pts / 2);
    const hp = heroHP(), hn = 10, ex = Math.max(0, Math.ceil((hp - 100) / 10));
    $('#stArmor').innerHTML = '<div>' + Array.from({ length: 10 }, (_, i) => `<img src="assets/tp/hud/armor_${i < n ? 'full' : 'empty'}.png" alt="">`).join('') + '</div><div>' + Array.from({ length: 10 }, (_, i) => `<img src="assets/tp/hud/heart/${i < hn ? 'full' : 'container'}.png" alt="">`).join('') + Array.from({ length: ex }, () => '<img src="assets/tp/hud/heart/absorbing_full.png" alt="">').join('') + '</div>';
    $('#stXp i').style.width = Math.min(100, (G.chapter / 12) * 100) + '%'; $('#stXp span').textContent = G.chapter || '';
    const hot = $('#stHot'); hot.querySelectorAll('i,em').forEach(n => n.remove());
    const slots = G.load.map(id => ({ icon: TOOLS[id].img || TPI(TOOLS[id].icon), t: id })).concat(G.items.slice(-5).map(i => ({ icon: TPI(i.icon), t: i.name })));
    slots.slice(0, 9).forEach((s, i) => { const d = el('i'); d.style.left = (3 + i * 60.4) / 546 * 100 + '%'; d.style.backgroundImage = `url(${s.icon})`; d.title = s.t; hot.appendChild(d); });
    hot.querySelector('b').style.display = 'none';
  }
  function setTitle(t) { UI.ttl.textContent = t; }

  /* --------------------------------------------------------- tools / hero */
  function heroHP() { const base = { 4: 100, 3: 100, 2: 120, 1: 140 }[G.rank] || 100; const m = { easy: 1.25, normal: 1, hard: .95 }[G.diff] || 1; return Math.round(base * m + (G.done ? 20 : 0)); }
  const DIFFM = () => ({ easy: .72, normal: 1, hard: 1.3 }[G.diff] || 1);
  function regFx(id, moves) {
    moves.forEach(mv => {
      const fx = mv._fx || mv.fx; if (fx) { const f = Object.assign({}, fx); if (mv.fl) f.fl = 1; if (mv.th) f.th = 1; FXS[id + ':' + mv.n] = f; }
      if (mv._snd || mv.snd) MSFX[id + ':' + mv.n] = [[mv._snd || mv.snd, 0]];
    });
  }
  function toolMove(tid) {
    const t = TOOLS[tid]; const mv = Object.assign({ n: t.n }, t.m); mv._fx = t.fx; mv._snd = t.snd; mv.ic = t.img || TPI(t.icon); return mv;
  }
  function heroMon() {
    const moves = G.load.map(toolMove); regFx('hero', moves);
    return { id: 'hero', name: G.hero.name, hp: heroHP(), moves, col: ['#3b4cca', '#ffd800'], glow: '#ffd24a', story: true, skinKey: 'you' };
  }
  function aliasFx(base, id) {
    [FXS, MSFX, VL, SELF].forEach(T => { Object.keys(T).forEach(k => { if (k.indexOf(base + ':') === 0) T[id + k.slice(base.length)] = T[k]; }); });
    if (VOICE_DIR[base]) VOICE_DIR[id] = VOICE_DIR[base];
  }
  function mkFoe(fid, hpMul) {
    const d = FOES[fid]; let m;
    if (d.base) { const b = byId(d.base); m = Object.assign({}, b, { moves: b.moves.map(x => Object.assign({}, x)), id: fid, name: d.name || b.name, hp: d.hp || b.hp }); aliasFx(d.base, fid); }
    else { m = { id: fid, name: d.name, hp: d.hp, col: ['#444', '#aaa'], glow: '#ccc', moves: d.moves.map(x => Object.assign({}, x)) }; regFx(fid, m.moves); if (d.vl) aliasFx(d.vl, fid); }
    m.skinKey = d.skinKey; m.story = true; if (d.pop) m.pop = true; if (d.flee) m.flee = true; m.hp = Math.max(8, Math.round(m.hp * DIFFM() * (hpMul || 1)));
    return m;
  }
  function mkAlly(aid) { const d = FOES[aid]; const b = byId(d.base); aliasFx(d.base, aid); return Object.assign({}, b, { moves: b.moves.map(x => Object.assign({}, x)), id: aid, name: d.name || b.name, hp: Math.round((d.hp || b.hp) * (G.diff === 'easy' ? 1.2 : 1)), story: true, skinKey: d.skinKey }); }

  /* -------------------------------------------------------------- battles */
  let pendingFight = null;
  function ensureFight(def) { return ensure(['you', ...def.foe.map(f => FOES[f].skinKey), ...(def.ally || []).map(a => FOES[a].skinKey), ...(def.partner || []).map(a => FOES[a].skinKey)], 5000); }
  async function fight(def) {
    await ensureFight(def);
    for (; ;) {
      const foes = def.foe.map(f => mkFoe(f, def.hpMul)); const team = [heroMon(), ...(def.ally || []).map(mkAlly)];
      stopAllSounds();
      const r = await aw(new Promise(res => { pendingFight = res; startBattle(team, { foe: foes, story: true, intro: def.intro, partner: def.partner ? mkAlly(def.partner[0]) : null }); }));
      if (r.won) { leaveBattle(); return true; }
      G.fails[def.id || 'x'] = (G.fails[def.id || 'x'] || 0) + 1;
      if (r.action === 'skip') { leaveBattle(); return true; }
      if (r.action === 'tools') { leaveBattle(); E.openLoadout(); await aw(new Promise(res => { const t = setInterval(() => { if (!UI.modal.classList.contains('on')) { clearInterval(t); res(); } }, 150); })); continue; }
      if (r.action === 'retry') continue;
      leaveBattle(); return false;
    }
  }
  function leaveBattle() { $('#stEnd').classList.remove('on'); show('story'); }
  // called from game.js finish()
  function battleEnd(won, forced) {
    const ov = $('#stEnd'); const def = pendingFight; if (!def) return;
    const fails = G ? (G.fails[(window.__stFightId) || 'x'] || 0) : 0;
    ov.querySelector('h2').textContent = won ? 'VICTORY!' : 'DEFEATED';
    ov.querySelector('h2').style.color = won ? '#2e9d3a' : '#c0152a';
    ov.querySelector('p').textContent = won ? 'The fight is won. Onward!' : 'You can try again. Switch tools in the Tools menu if a fight is too tough.';
    const b = ov.querySelector('.row'); b.innerHTML = '';
    const mk = (t, cls, fn) => { const x = el('button', 'btn ' + cls, t); x.onclick = () => { sfx.click(); fn(); }; b.appendChild(x); };
    const done = a => { ov.classList.remove('on'); const f = pendingFight; pendingFight = null; f({ won: a === 'win', action: a }); };
    if (won) mk('Continue', 'red', () => done('win'));
    else {
      mk('Try again', 'red', () => done('retry'));
      mk('Change tools', 'blue', () => { ov.classList.remove('on'); const f = pendingFight; pendingFight = null; f({ won: false, action: 'tools' }); });
      
    }
    ov.classList.add('on');
  }
  function giveUp() { if (!pendingFight) return; battleEnd(false, true); }

  /* ----------------------------------------------------------- state ops */
  function giveTool(id, silent) {
    if (!TOOLS[id] || G.tools.includes(id)) return; G.tools.push(id);
    if (G.load.length < 4) G.load.push(id);
    else if (TOOLS[id].m.dmg) {
      const atk = G.load.filter(x => TOOLS[x].m.dmg); let rep = null;
      if (atk.length < 2) rep = G.load.find(x => !TOOLS[x].m.dmg && TOOLS[x].m.guard === 'dodge') || G.load.find(x => !TOOLS[x].m.dmg && !TOOLS[x].m.heal);
      else { const w = atk.reduce((a, c) => TOOLS[c].m.dmg < TOOLS[a].m.dmg ? c : a); if (TOOLS[id].m.dmg > TOOLS[w].m.dmg) rep = w; }
      if (rep) G.load[G.load.indexOf(rep)] = id;
    }
    if (!silent) { toast(TOOLS[id].img || TPI(TOOLS[id].icon), 'New tool: ' + TOOLS[id].n + (G.load.includes(id) ? '' : ' (equip it in Tools)')); playSnd('xp_orb'); }
    updHud();
  }
  function giveItem(icon, name) {
    if (G.items.some(i => i.name === name)) return; G.items.push({ icon, name }); toast(TPI(icon), 'Got: ' + name); playSnd('xp_orb'); updHud();
  }
  // quest items you no longer need leave your inventory
  function dropItem(...names) {
    let n = 0; names.forEach(nm => { const i = G.items.findIndex(x => x.name === nm); if (i >= 0) { const it = G.items.splice(i, 1)[0]; n++; toast(TPI(it.icon), 'Used: ' + nm); } });
    if (n) updHud();
  }
  function setOutfit(key, o) {
    o = o || {}; G.outfit = key; G.custom = null; if (o.rank) G.rank = o.rank; if (o.band != null) G.bandOn = !!o.band;
    SK3.clearCache('you|'); updHud();
  }

  /* ---------------------------------------------------------- script runner */
  const E = { // shared with story-games.js
    get G() { return G; }, UI, el, modal, closeModal, toast, aw, sleepR, ask, ensure, fight, heroHP, giveTool, giveItem, setOutfit, dropItem, imgURL, chOf, sub, say: sayLine, TPI,
    skinOf: id => SKIN[id], refreshHero() { SK3.clearCache('you|'); delete SKIN.you; REAL.you = false; return ensure(['you']); },
    updHud, save: () => writeSave(), setScene, enter, exitAll, exitChar, look, spotlight, onStage, layout, abortAll, toolMove, DIFFM, FOES, startFightLog: id => { window.__stFightId = id; },
    games: {}, openLoadout() { }, openPause() { }
  };
  window.StoryEngine = E;

  const LBL = new WeakMap();
  function labelsOf(arr) { let m = LBL.get(arr); if (!m) { m = {}; arr.forEach((s, i) => { if (s.op === 'label') m[s.id] = i; }); LBL.set(arr, m); } return m; }
  const DONE = { done: true };

  async function runScript(arr, from) {
    const L = labelsOf(arr); let pc = from != null ? (L[from] != null ? L[from] : 0) : 0;
    while (pc < arr.length) {
      const s = arr[pc++];
      let r; try { r = await step(s, arr); } catch (err) { if (err === ABORT) throw err; console.error('story step failed', s.op, err); r = null; }
      if (r === DONE) return DONE;
      if (r && r.go) { if (L[r.go] == null) { console.warn('missing label', r.go); continue; } pc = L[r.go]; }
    }
    return null;
  }

  async function step(s, arr) {
    switch (s.op) {
      case 'label': return;
      case 'scene': $$('.st-char.crowd').forEach(n => n.remove()); await exitAll(); await setScene(s.id, s); break;
      case 'bg': await setScene(s.id, s); break;
      case 'enter': await enter(s.id, s.at, s); break;
      case 'exit': for (const i of s.ids) exitChar(i); await aw(sleepR(350)); break;
      case 'clear': await exitAll(); break;
      case 'look': look(s.id, s); break;
      case 'say': await sayLine(s.who, s.text, s); break;
      case 'nar': await sayLine(null, s.text, s); break;
      case 'title': await chapterCard(s); break;
      case 'card': await bigCard(s.c1, s.c2, s.ms); break;
      case 'ask': { const i = await ask(s.q, s.opts); const o = s.opts[i]; if (o.set) Object.assign(G.flags, o.set); if (o.say) { for (const l of o.say) await sayLine(l[0], l[1]); } if (o.go) return { go: o.go }; break; }
      case 'fight': { window.__stSkippable = (G.fails[s.id || 'x'] || 0) >= 1 || s.skippable; window.__stFightId = s.id; const won = await fight(s); G.flags['won_' + (s.id || '')] = won; if (!won && s.lose) return { go: s.lose }; if (won && s.win) return { go: s.win }; break; }
      case 'game': { const ok = await runGame(s); if (s.set) G.flags[s.set] = ok; break; }
      case 'ck': G.ck = s.id; writeSave(); break;
      case 'go': return { go: s.to };
      case 'jf': if (G.flags[s.f]) return { go: s.to }; break;
      case 'jn': if (!G.flags[s.f]) return { go: s.to }; break;
      case 'set': G.flags[s.k] = s.v; break;
      case 'rank': G.rank = s.n; updHud(); break;
      case 'outfit': setOutfit(s.key, s); if (s.say !== false) { playSnd('anvil'); flash(); toast(TPI('iron_chestplate'), s.msg || 'New armour equipped!'); } await aw(sleepR(500)); refreshChars(); break;
      case 'dress': G.dress[s.id] = s.key; if (onStage[s.id]) applyImg(onStage[s.id]); break;
      case 'tool': if (s.from) { if (!onStage[s.from]) await autoEnter(s.from); if (s.text) await sayLine(null, s.text); } giveTool(s.id); break;
      case 'item': giveItem(s.icon, s.name); break;
      case 'drop': dropItem(...(s.names || [s.name])); break;
      case 'charge': await charge(s); break;
      case 'dim': UI.stage.classList.toggle('dim', !!s.on); break;
      case 'wait': await aw(sleepR(s.ms)); break;
      case 'fx': await doFx(s); break;
      case 'sfx': playSnd(s.n); break;
      case 'chapter': G.chapter = s.n; updHud(); break;
      case 'crowd': await crowd(s); break;
      case 'uncrowd': $$('.st-char.crowd').forEach(n => n.remove()); break;
      case 'show': await showObj(s); break;
      case 'lore': unlockLore(s.id); break;
      case 'end': return DONE;
      case 'hub': return await E.hub();
      case 'run': await runScript(s.steps); break;
      case 'fn': await s.fn(G, E); break;
      default: console.warn('unknown op', s.op);
    }
  }

  function flash() { UI.flash.style.transition = 'none'; UI.flash.style.opacity = .9; requestAnimationFrame(() => { UI.flash.style.transition = 'opacity .7s'; UI.flash.style.opacity = 0; }); }
  async function bigCard(c1, c2, ms) { UI.card.querySelector('.c1').textContent = c1 || ''; UI.card.querySelector('.c2').textContent = sub(c2 || ''); UI.card.classList.add('on'); await aw(sleepR(ms || 2600)); UI.card.classList.remove('on'); await aw(sleepR(300)); }
  async function chapterCard(s) { G.chapter = s.n != null ? s.n : G.chapter; G.ctitle = s.c2; setTitle(s.c1 + ': ' + s.c2); updHud(); playSnd('challenge_complete'); await bigCard(s.c1, s.c2, 2800); }
  async function showObj(s) {
    // big pickup/clue panel (symbol, journal, etc.)
    const m = modal(`<h3>${esc(s.title)}</h3><div style="text-align:center">${s.html || ''}</div><p style="text-align:center">${esc(sub(s.text || ''))}</p><div class="mg-row"><button class="stbtn" id="shX">OK</button></div>`, { dark: true });
    await aw(new Promise(r => { $('#shX').onclick = () => { m.close(); r(); }; }));
  }
  async function crowd(s) {
    $$('.st-char.crowd').forEach(n => n.remove());
    const mats = s.mats || ['villager', 'iron', 'chain', 'leaf3']; const n = s.n || 4; const defs = SK3.DEFAULTS;
    const ids = [];
    const chudAt = new Set(s.chuds || []);
    for (let i = 0; i < n; i++) { const id = 'crowd' + i; CH[id] = { rand: true, name: s.name || 'Villager', user: '', skin: defs[(i * 3 + (s.seed || 0)) % defs.length], out: mats[i % mats.length], item: null, color: '#ddd' }; SKIN[id] = null; ids.push(id); }
    await ensure(ids);
    if (chudAt.size) { // chuds: Chase look-alikes standing around, no dialogue
      await ensure(['chud'], 2500);
      chudAt.forEach(i => { const id = 'crowd' + i; if (!SKIN.chud) return; CH[id] = Object.assign({}, CH.chud, { name: 'Chud', user: '', skinFile: '' }); SKIN[id] = SKIN.chud; if (REAL.chud) REAL[id] = true; });
    }
    ids.forEach((id, i) => { const d = el('div', 'st-char small crowd'); d.style.left = (s.x0 != null ? s.x0 : 8) + i * (s.dx || (84 / n)) + '%'; d.style.bottom = 'calc(var(--feet) + ' + (s.up != null ? s.up : 18) + 'px)'; d.style.zIndex = 0; d.style.opacity = .92; const im = el('img'); const u = imgURL(id, { face: i % 2 ? 'l' : 'r', pose: i % 3 ? 'idle' : 'walk' }); if (u) im.src = u; im.style.animationDelay = (i * .4) + 's'; d.appendChild(im); UI.chars.appendChild(d); });
  }
  async function charge(s) {
    const ids = s.ids || [s.id]; const ats = s.to || ['r', 'mr', 'fr']; const fromL = s.from === 'l';
    await ensure(ids);
    const els = ids.map((id, i) => {
      exitChar(id, true); const c = chOf(id);
      const d = el('div', 'st-char'); d.dataset.id = id; d.style.left = (fromL ? -14 - i * 9 : 114 + i * 9) + '%'; d.style.transition = 'left ' + ((s.ms || 1400) / 1000) + 's cubic-bezier(.3,.1,.6,1)';
      const im = el('img'); d.appendChild(im);
      d.appendChild(el('div', 'nt', esc(s.name || c.name) + (c.tag ? `<small>${esc(c.tag)}</small>` : '')));
      const at = ats[i % ats.length]; const st = { id, at, face: fromL ? 'r' : 'l', pose: 'walk', el: d, im, item: undefined };
      onStage[id] = st; applyImg(st); UI.chars.appendChild(d); return { st, at };
    });
    await aw(sleepR(60));
    els.forEach(({ st, at }, i) => { setTimeout(() => { st.el.style.left = (AT[at] != null ? AT[at] : +at) + '%'; }, i * 220); });
    playSnd('sword_swing');
    await aw(sleepR((s.ms || 1400) + els.length * 220 + 120));
    els.forEach(({ st }) => { st.pose = 'hold'; st.el.style.transition = ''; applyImg(st); });
    UI.stage.animate([{ transform: 'translate(0)' }, { transform: 'translate(-6px,3px)' }, { transform: 'translate(6px,-3px)' }, { transform: 'none' }], { duration: 320 });
    await aw(sleepR(380));
  }
  async function doFx(s) {
    switch (s.type) {
      case 'shake': UI.stage.animate([{ transform: 'translate(0)' }, { transform: 'translate(-8px,4px)' }, { transform: 'translate(8px,-4px)' }, { transform: 'translate(-4px,2px)' }, { transform: 'none' }], { duration: s.ms || 500 }); playSnd('anvil'); await aw(sleepR(s.ms || 500)); break;
      case 'flash': flash(); await aw(sleepR(500)); break;
      case 'fade': UI.fade.classList.toggle('on', s.on !== false); await aw(sleepR(700)); break;
      case 'figure': { // a dark figure watching from the distance
        const d = el('div', 'st-char sil small'); d.style.left = (s.x || 80) + '%'; d.style.bottom = 'calc(var(--feet) + ' + (s.up != null ? s.up : 120) + 'px)'; d.style.opacity = 0; await ensure(['void']);
        const im = el('img'); im.src = imgURL('void', { face: 'l', pose: 'idle', item: null }) || ''; d.appendChild(im); UI.chars.appendChild(d);
        d.animate([{ opacity: 0 }, { opacity: .95 }], { duration: 900, fill: 'forwards' }); await aw(sleepR(2200));
        d.animate([{ opacity: .95 }, { opacity: 0 }], { duration: 700, fill: 'forwards' }); await aw(sleepR(750)); d.remove(); break; }
      case 'rain': break;
    }
  }
  function unlockLore(id) { if (!G.lore.includes(id)) { G.lore.push(id); const l = D.LORE.find(x => x.id === id); toast(TPI('enchanted_book'), 'Secret record found: ' + (l ? l.t : '')); playSnd('xp_orb'); } }

  async function runGame(s) {
    const g = E.games[s.type]; if (!g) { console.warn('no game', s.type); return true; }
    for (let tries = 0; ; tries++) {
      const r = await aw(g(s, tries));
      if (r === true) return true; if (r === 'skip') return true; if (r === false && s.optional) return false;
    }
  }

  /* ------------------------------------------------------------- lifecycle */
  async function playFrom(label) {
    running = true; const my = ++tok; showPlay();
    try { await runScript(window.StoryScript.main, label); if (my === tok) { /* finished */ } }
    catch (e) { if (e !== ABORT) console.error(e); }
  }
  function leave() { running = false; abortAll(); pendingFight = null; closeModal && UI.modal && closeModal(); }
  function showPlay() { buildDom(); UI.entry.style.display = 'none'; UI.play.style.display = ''; layout(); updHud(); }
  async function checkReset() {
    try {
      if (typeof cloudOn !== 'function' || !cloudOn() || typeof me === 'undefined' || !me) return;
      const d = await cDoc(me.key).get(); if (!d.exists) return; const ts = d.data().storyReset || 0; if (!ts) return;
      const k = 'bpb_story_rs_' + me.key; const seen = +(localStorage.getItem(k) || 0);
      if (ts > seen) { localStorage.setItem(k, String(ts)); localStorage.removeItem(saveKey()); G = null; if (UI.entry && UI.entry.style.display !== 'none') E.renderEntry && E.renderEntry(); }
    } catch (e) { }
  }
  function showEntry() { checkReset(); buildDom(); UI.play.style.display = 'none'; UI.entry.style.display = ''; UI.rk.style.display = 'none'; setTitle('STORY MODE'); E.renderEntry && E.renderEntry(); }

  async function startNew(cfg) { G = newState(cfg); logArr.length = 0; Object.keys(SKIN).forEach(k => delete SKIN[k]); Object.keys(fetching).forEach(k => delete fetching[k]); if (cfg.skinObj) { SKIN.you = cfg.skinObj; REAL.you = true; } await ensure(['you']); writeSave(); playFrom('start'); }
  async function continueGame() {
    const sv = loadSave(); if (!sv) return; G = sv; logArr.length = 0; Object.keys(SKIN).forEach(k => delete SKIN[k]); Object.keys(fetching).forEach(k => delete fetching[k]); SK3.clearCache();
    showPlay(); UI.who.style.display = 'none'; UI.txt.textContent = 'Loading your save…'; await ensure(['you']);
    if (G.done && G.ck === 'hub') { running = true; ++tok; try { await E.hub(); } catch (e) { if (e !== ABORT) console.error(e); } } else playFrom(G.ck);
  }

  setTimeout(prefetchSkins, 1200);
  window.StoryUI = {
    get active() { return running; },
    enter() { buildDom(); if (running && G) showPlay(); else showEntry(); },
    onShow(id) { if (id !== 'story' && id !== 'battle' && running) { leave(); } },
    spriteFor, battleEnd, giveUp, prefetchSkins,
    hasSave: () => !!loadSave()
  };
  Object.assign(E, { newState, loadSave, startNew, continueGame, showEntry, showPlay, playFrom, runScript, writeSave, pickTown, DEF_FOR, ensureFight, mkFoe, mkAlly, heroMon, step, setTitle, leave, sayLine, flash, giveUp,
    setG(g) { G = g; }, setSkin(id, sk) { if (sk) { SKIN[id] = sk; REAL[id] = !!sk.src && sk.src.indexOf('default') !== 0; } else { delete SKIN[id]; REAL[id] = false; } SKVER[id] = (SKVER[id] || 0) + 1; }, logArr, regFx, hashStr, loadSkinFor: ensure, bigCard });
})();
