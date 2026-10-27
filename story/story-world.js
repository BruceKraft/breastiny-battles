/* story-world.js - the post-game overworld.
   After the story ends you walk between places with A / D (or the arrow keys), press E to use things,
   ride the minecart rails that run through every village and place, and visit the Info Centre in Leaf
   Village to see everything you can do and where.  Replaces the old menu-style hub. */
(function () {
  'use strict';
  const E = window.StoryEngine, D = window.StoryData, ART = window.StoryArt;
  if (!E || !D || !ART) return;
  const { el, TPI } = E;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const $ = (s, r) => (r || document).querySelector(s);

  /* ------------------------------------------------------------------ the world map */
  // obj types: info | hub (runs a post-game script, optional label) | wardrobe | lore | cart (minecart station)
  const PLACES = [
    { id: 'leaf', name: 'Leaf Village', scene: 'town', icon: 'assets/tp/block/oak_planks.png', tag: 'Where your journey began',
      objs: [
        { id: 'cart', t: 'cart', x: .07, name: 'Minecart Station', icon: 'minecart', d: 'Ride the rails to any village or place in the world.' },
        { id: 'info', t: 'info', x: .20, name: 'Info Centre', icon: 'map', d: 'See everything you can do, and where to do it.' },
        { id: 'sora', t: 'hub', hub: 'sora', x: .34, name: "Sora's Rematch", icon: 'diamond_sword', d: 'Fight your first rival again, now at full strength.' },
        { id: 'master', t: 'hub', hub: 'master', x: .48, name: 'Master Dojo', icon: 'mace', d: 'Challenge the Rank 1 and Rank 2 ninjas one by one.' },
        { id: 'village_l', t: 'hub', hub: 'village', label: 'l', x: .62, name: 'Mission Board', icon: 'emerald', d: 'Help Leaf Village: clear the masked stragglers near the eastern wall.' },
        { id: 'wardrobe', t: 'wardrobe', x: .76, name: 'Wardrobe', icon: 'leather_chestplate', d: 'Wear any armour, trim and headband in the game.' },
        { id: 'lore', t: 'lore', x: .90, name: 'Library', icon: 'enchanted_book', d: 'Read the secret records you uncovered.' }
      ],
      npcs: ['Training has never been busier since the war ended.', 'The Info Centre by the gate lists everything you can do.', 'Etrosion says the minecart rails now reach every village.', 'I saw someone ride a minecart all the way to The End!'] },
    { id: 'rock', name: 'Rock Village', scene: 'rock', icon: 'assets/tp/block/cobblestone.png', tag: "Burg's mountain home",
      objs: [
        { id: 'cart', t: 'cart', x: .10, name: 'Minecart Station', icon: 'minecart', d: 'Ride the rails to any village or place in the world.' },
        { id: 'village_r', t: 'hub', hub: 'village', label: 'r', x: .38, name: 'Mission Board', icon: 'emerald', d: 'Help Rock Village: clear the old tunnels and recover the supplies.' },
        { id: 'elite', t: 'hub', hub: 'elite', x: .66, name: 'Elite Outpost', icon: 'netherite_chestplate', d: 'Mixed missions with Chase and Brucekraft: scouting and camp clearing.' }
      ],
      npcs: ['The tunnels under the village are still full of lost supplies.', 'Burg never stops working on the walls.', 'Stone does not forget, and neither do we.'] },
    { id: 'cloud', name: 'Cloud Village', scene: 'cloud', icon: 'assets/tp/block/white_wool.png', tag: "M7vn's village in the sky",
      objs: [
        { id: 'cart', t: 'cart', x: .10, name: 'Minecart Station', icon: 'minecart', d: 'Ride the rails to any village or place in the world.' },
        { id: 'village_c', t: 'hub', hub: 'village', label: 'c', x: .45, name: 'Mission Board', icon: 'emerald', d: 'Help Cloud Village: bring home the ninjas who still follow the old orders.' }
      ],
      npcs: ['We are rebuilding, beside Leaf and Rock this time.', 'Some of us still do not know whose mark we carved.', 'The clouds look calmer these days.'] },
    { id: 'ruins', name: 'Hidden Ruins', scene: 'ruins', icon: 'chiseled_stone_bricks', tag: 'Old stone and older secrets',
      objs: [
        { id: 'cart', t: 'cart', x: .10, name: 'Minecart Station', icon: 'minecart', d: 'Ride the rails to any village or place in the world.' },
        { id: 'ruins', t: 'hub', hub: 'ruins', x: .5, name: 'Ruin Entrance', icon: 'amethyst_shard', d: 'Explore the ruins, find loot and a secret record, then beat the Ruin Guardian.' }
      ],
      npcs: ['The walls hum when you get close.', 'Somebody has to guard these records.'] },
    { id: 'peak', name: 'Legend Peak', scene: 'cliff', icon: 'nether_star', tag: 'Where legends sleep',
      objs: [
        { id: 'cart', t: 'cart', x: .10, name: 'Minecart Station', icon: 'minecart', d: 'Ride the rails to any village or place in the world.' },
        { id: 'legend', t: 'hub', hub: 'legend', x: .5, name: 'Legend Altar', icon: 'nether_star', d: 'Hunt the Stone Colossus, the Ender Phantom or the Frost Wraith.' }
      ],
      npcs: ['They say three creatures guard the hidden corners of the world.', 'Do not climb alone.'] },
    { id: 'end', name: 'The End', scene: 'end', icon: 'ender_eye', tag: 'The edge of everything',
      objs: [
        { id: 'cart', t: 'cart', x: .10, name: 'Minecart Station', icon: 'minecart', d: 'Ride the rails to any village or place in the world.' },
        { id: 'end', t: 'hub', hub: 'end', x: .5, name: 'End Gateway', icon: 'ender_eye', d: 'Fight Master Duper and Void Risez again.' }
      ],
      npcs: ['The gateway answers anyone who is brave enough.', 'Quiet here, now.'] }
  ];
  const N = PLACES.length;
  const hubKey = o => o.id.indexOf('village') === 0 ? 'village' : o.hub || o.t;

  /* ------------------------------------------------------------------ state */
  let W = null;            // the running world (null when not in the overworld)
  let railTile = null;

  function railURL() {   // the rail texture turned sideways so it runs left to right
    if (railTile) return Promise.resolve(railTile);
    return new Promise(res => {
      const im = new Image(); im.onload = () => {
        const c = document.createElement('canvas'); c.width = 16; c.height = 16; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
        x.translate(8, 8); x.rotate(Math.PI / 2); x.drawImage(im, 0, 0, 16, 16, -8, -8, 16, 16);
        res(railTile = c.toDataURL());
      }; im.onerror = () => res(''); im.src = 'assets/tp/block/rail.png';
    });
  }

  function sizeWorld() {
    if (!W) return; const st = E.UI.stage, w = st.clientWidth, h = st.clientHeight; if (!w) return;
    W.w = w; W.root.style.setProperty('--chH', Math.round(Math.min(h * 0.74, w * 0.62) * 0.56) + 'px');
  }

  /* ------------------------------------------------------------------ build the DOM */
  async function build(startX) {
    await ART.load();
    const UI = E.UI;
    const root = el('div', 'st-world');
    const track = el('div', 'wl-track'); track.style.width = N * 100 + '%';
    PLACES.forEach((p, i) => {
      const pan = el('div', 'wl-panel'); pan.style.left = (i / N * 100) + '%'; pan.style.width = (100 / N) + '%';
      let url = ''; try { url = ART.scene(p.scene).toDataURL(); } catch (e) { }
      const im = el('img'); im.src = url; im.alt = ''; pan.appendChild(im); track.appendChild(pan);
      const sign = el('div', 'wl-sign', `<img src="${TPI(p.icon)}" alt="" onerror="this.style.display='none'">${esc(p.name)}`); sign.style.left = ((i + .5) / N * 100) + '%'; track.appendChild(sign);
    });
    const rails = el('div', 'wl-rails'); track.appendChild(rails);
    railURL().then(u => { if (u) rails.style.backgroundImage = `url(${u})`; });

    const objs = [];
    PLACES.forEach((p, pi) => p.objs.forEach(o => {
      const d = el('div', 'wl-obj' + (o.t === 'cart' ? ' cart' : '')); const ax = pi + o.x; d.style.left = (ax / N * 100) + '%';
      d.innerHTML = o.t === 'cart'
        ? `<img class="ic" src="assets/mc/minecart.png" alt=""><div class="lb">${esc(o.name)}</div>`
        : `<div class="bd"><img src="${o.id === 'ruins' ? 'assets/tp/block/chiseled_stone_bricks.png' : TPI(o.icon)}" alt="" onerror="this.src='assets/tp/item/paper.png'"></div><div class="lb">${esc(o.name)}</div>`;
      d.onclick = ev => { ev.stopPropagation(); W.target = ax; W.pending = ob; };
      const ob = { o, place: p, pi, x: ax, el: d }; objs.push(ob); track.appendChild(d);
    }));

    // wandering villagers with random skins / mob skins
    const npcs = [];
    PLACES.forEach((p, pi) => {
      const outs = ['villager', 'leaf3', 'rock3', 'iron', 'chain', 'leather'];
      for (let k = 0; k < (p.id === 'leaf' ? 3 : 2); k++) {
        const id = 'wn_' + p.id + '_' + k;
        D.CH[id] = { rand: true, name: p.id === 'ruins' || p.id === 'end' || p.id === 'peak' ? 'Wanderer' : 'Villager', user: '', skin: 'steve', out: outs[(pi + k * 2) % outs.length], item: null, color: '#ddd' };
        const d = el('div', 'st-char wl-npc'); d.dataset.id = id; const im = el('img'); d.appendChild(im); track.appendChild(d);
        npcs.push({ id, place: p, pi, x: pi + .18 + Math.random() * .64, tx: null, wait: Math.random() * 2, face: 'r', pose: 'idle', el: d, im, line: 0 });
      }
    });

    const hero = el('div', 'st-char wl-hero'); const him = el('img'); hero.appendChild(him);
    const cartRide = el('img', 'wl-ride'); cartRide.src = 'assets/mc/minecart.png'; cartRide.alt = ''; cartRide.style.display = 'none';
    track.appendChild(hero); track.appendChild(cartRide);
    root.appendChild(track);

    const hud = el('div', 'wl-hud', `<div class="wl-title"></div><div class="wl-prompt"></div>
      <div class="wl-pad"><button data-k="l">&#9664;</button><button data-k="r">&#9654;</button><button data-k="e" class="act">E</button></div>`);
    root.appendChild(hud);
    UI.stage.appendChild(root);
    W = { root, track, rails, hero, him, cartRide, objs, npcs, hud, title: $('.wl-title', hud), prompt: $('.wl-prompt', hud), x: startX, face: 'r', moving: false, keys: {}, target: null, pending: null, busy: false, t: 0, w: UI.stage.clientWidth, near: null, curPlace: -1, done: null };
    sizeWorld();
    return W;
  }

  /* ------------------------------------------------------------------ frame loop */
  function setImg(node, id, face, pose) {
    const k = face + '|' + pose + '|' + (E.skinOf(id) ? 1 : 0); if (node.__k === k) return;
    const u = E.imgURL(id, { face, pose }); if (u) { node.src = u; node.__k = k; }
  }
  function say(who, text) {
    const UI = E.UI; UI.box.classList.toggle('nar', !who); UI.who.style.display = who ? '' : 'none'; if (who) UI.who.textContent = who; UI.txt.textContent = text; UI.nx.style.display = 'none';
  }
  const HINT = 'Walk with A / D (or the arrow keys). Press E to use things. The Info Centre in Leaf Village shows everything you can do and where.';

  function frame(now) {
    if (!W || W.stop) return;
    const dt = Math.min(0.05, (now - (W.t || now)) / 1000); W.t = now;
    const modalOn = E.UI.modal.classList.contains('on');
    if (!W.busy && !modalOn) {
      let dir = (W.keys.r ? 1 : 0) - (W.keys.l ? 1 : 0);
      if (dir) W.target = null;
      else if (W.target != null) { const df = W.target - W.x; if (Math.abs(df) < 0.012) { W.x = W.target; W.target = null; if (W.pending) { const p = W.pending; W.pending = null; interact(p); } } else dir = df > 0 ? 1 : -1; }
      if (dir) { W.x = Math.max(0.04, Math.min(N - 0.04, W.x + dir * 0.3 * dt)); W.face = dir > 0 ? 'r' : 'l'; }
      W.moving = !!dir;
    } else W.moving = false;

    // camera
    const cam = Math.max(0, Math.min(N - 1, W.x - 0.5));
    W.track.style.transform = `translateX(${(-cam / N * 100).toFixed(4)}%)`;
    // hero
    W.hero.style.left = (W.x / N * 100) + '%';
    const pose = W.moving ? (Math.floor(now / 200) % 2 ? 'walk' : 'idle') : 'idle';
    if (!W.riding) { setImg(W.him, 'you', W.face, pose); W.hero.style.display = ''; } else W.hero.style.display = 'none';
    // villagers
    W.npcs.forEach(n => {
      n.wait -= dt;
      if (n.tx == null && n.wait <= 0) { n.tx = n.pi + .12 + Math.random() * .76; }
      let mv = false;
      if (n.tx != null) { const df = n.tx - n.x; if (Math.abs(df) < .01) { n.tx = null; n.wait = 2 + Math.random() * 4; } else { n.x += Math.sign(df) * 0.07 * dt; n.face = df > 0 ? 'r' : 'l'; mv = true; } }
      n.el.style.left = (n.x / N * 100) + '%'; setImg(n.im, n.id, n.face, mv ? (Math.floor(now / 260) % 2 ? 'walk' : 'idle') : 'idle');
    });
    // current place + nearest object
    const pi = Math.max(0, Math.min(N - 1, Math.floor(W.x))); if (pi !== W.curPlace) { W.curPlace = pi; enterPlace(PLACES[pi]); }
    let best = null, bd = 0.055; W.objs.forEach(ob => { const d = Math.abs(ob.x - W.x); if (d < bd) { bd = d; best = ob; } });
    const npcNear = !best && W.npcs.find(n => Math.abs(n.x - W.x) < 0.045);
    const nearKey = best ? best.o.id + best.pi : npcNear ? npcNear.id : '';
    if (nearKey !== W.nearKey) {
      W.nearKey = nearKey; W.objs.forEach(ob => ob.el.classList.toggle('near', ob === best));
      if (best) { W.prompt.innerHTML = `<b>E</b> ${esc(best.o.name)}`; W.prompt.classList.add('on'); say('', best.o.d); E.UI.box.classList.add('nar'); E.UI.who.style.display = 'none'; }
      else if (npcNear) { W.prompt.innerHTML = '<b>E</b> Talk'; W.prompt.classList.add('on'); }
      else { W.prompt.classList.remove('on'); say('', HINT); }
    }
    W.near = best || null; W.nearNpc = npcNear || null;
    requestAnimationFrame(frame);
  }
  function enterPlace(p) { W.title.innerHTML = `${esc(p.name)}<small>${esc(p.tag)}</small>`; W.title.classList.remove('flash'); void W.title.offsetWidth; W.title.classList.add('flash'); E.setTitle(p.name.toUpperCase()); }

  /* ------------------------------------------------------------------ things you can do */
  function interact(ob) { if (W && !W.busy && W.resolve) { const r = W.resolve; W.resolve = null; r(ob); } }
  function pressE() {
    if (!W || W.busy || E.UI.modal.classList.contains('on')) return;
    if (W.near) return interact(W.near);
    if (W.nearNpc) {
      const n = W.nearNpc, c = E.chOf(n.id), lines = n.place.npcs; const l = lines[(n.line++) % lines.length];
      say(c ? c.name : 'Villager', l);
    }
  }

  function showInfo() {
    return new Promise(res => {
      const G = E.G; const rows = PLACES.map(p => {
        const acts = p.objs.filter(o => o.t !== 'cart');
        return `<div class="wl-ip"><div class="wl-ih"><img src="${TPI(p.icon)}" alt="" onerror="this.style.display='none'"><b>${esc(p.name)}</b><button class="stbtn sm" data-ride="${p.id}">${W.curPlace === PLACES.indexOf(p) ? 'You are here' : 'Ride there'}</button></div>
          ${acts.map(o => `<div class="wl-ia"><img src="${o.id === 'ruins' ? 'assets/tp/block/chiseled_stone_bricks.png' : TPI(o.icon)}" alt="" onerror="this.src='assets/tp/item/paper.png'"><span><b>${esc(o.name)}</b>${G.hub[hubKey(o)] && o.t === 'hub' ? ' <i class="ck">&#10003;</i>' : ''}<small>${esc(o.d)}</small></span></div>`).join('')}</div>`;
      }).join('');
      const m = E.modal(`<h3>Leaf Village Info Centre</h3>
        <p class="wl-ctl"><b>A / D</b> or arrow keys: walk &nbsp; <b>E</b> or Enter: use or talk &nbsp; Click a sign to walk to it.<br>A <b>minecart track</b> runs through every village and place. Use any <b>Minecart Station</b> to ride to another place.</p>
        <div class="wl-info">${rows}</div><div class="mg-row"><button class="stbtn" id="wlX">Close</button></div>`, { dark: true, wide: true });
      const done = v => { m.close(); res(v); };
      $('#wlX').onclick = () => done(null);
      E.UI.pan.querySelectorAll('[data-ride]').forEach(b => b.onclick = () => done(b.dataset.ride));
    });
  }
  function showCartMenu() {
    return new Promise(res => {
      const m = E.modal(`<h3>Minecart Station</h3><p style="text-align:center">Where to?</p><div class="st-hub">${PLACES.map((p, i) => `<button class="stbtn" data-ride="${p.id}" ${i === W.curPlace ? 'disabled' : ''}><img src="${TPI(p.icon)}" alt="" onerror="this.style.display='none'"><span>${esc(p.name)}<small>${esc(p.tag)}</small></span></button>`).join('')}</div><div class="mg-row"><button class="stbtn" id="wlX">Stay here</button></div>`, { dark: true, wide: true });
      const done = v => { m.close(); res(v); };
      $('#wlX').onclick = () => done(null);
      E.UI.pan.querySelectorAll('[data-ride]').forEach(b => b.onclick = () => { if (!b.disabled) done(b.dataset.ride); });
    });
  }
  async function ride(placeId) {
    const idx = PLACES.findIndex(p => p.id === placeId); if (idx < 0) return;
    const cart = PLACES[idx].objs.find(o => o.t === 'cart'); const tx = idx + cart.x + 0.07;
    W.busy = true; W.riding = true; W.target = null; W.keys = {};
    const from = W.x, dist = Math.abs(tx - from), ms = Math.max(1200, Math.min(4200, dist * 650));
    W.cartRide.style.display = ''; W.cartRide.className = 'wl-ride' + (tx < from ? ' flip' : '');
    if (typeof playSnd === 'function') try { playSnd('minecart'); } catch (e) { }
    const t0 = performance.now();
    await E.aw(new Promise(res => {
      const step = now => { if (!W) return res(); const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; W.x = from + (tx - from) * e; W.cartRide.style.left = (W.x / N * 100) + '%'; if (k < 1) requestAnimationFrame(step); else res(); };
      requestAnimationFrame(step);
    }));
    W.cartRide.style.display = 'none'; W.riding = false; W.face = tx < from ? 'l' : 'r'; W.busy = false;
  }

  async function doAction(ob) {
    const o = ob.o, G = E.G;
    if (o.t === 'info') { const r = await showInfo(); if (r) await ride(r); return; }
    if (o.t === 'cart') { const r = await showCartMenu(); if (r) await ride(r); return; }
    // everything else runs like a normal story scene: hide the world, play it, come back
    W.busy = true; W.root.style.display = 'none'; W.keys = {};
    try {
      if (o.t === 'wardrobe') await new Promise(r => { E.openWardrobe(); const t = setInterval(() => { if (!E.UI.modal.classList.contains('on')) { clearInterval(t); r(); } }, 200); });
      else if (o.t === 'lore') await new Promise(r => { E.openLore(); const t = setInterval(() => { if (!E.UI.modal.classList.contains('on')) { clearInterval(t); r(); } }, 200); });
      else if (o.t === 'hub') {
        const steps = window.StoryScript.hub[o.hub];
        if (steps) { await E.runScript(steps, o.label); const k = hubKey(o); G.hub[k] = (G.hub[k] || 0) + 1; E.save(); }
      }
      await E.exitAll();
    } finally { if (W) { W.root.style.display = ''; W.busy = false; W.nearKey = null; E.UI.stage.classList.remove('dim'); E.updHud(); } }
  }

  /* ------------------------------------------------------------------ input */
  const KEYS = { a: 'l', arrowleft: 'l', d: 'r', arrowright: 'r' };
  function onKey(e, down) {
    if (!W || !E.UI.root || !E.UI.root.classList.contains('active')) return;
    const k = (e.key || '').toLowerCase();
    if (KEYS[k]) { if (!E.UI.modal.classList.contains('on')) { W.keys[KEYS[k]] = down; e.preventDefault(); } else W.keys = {}; }
    else if (down && !e.repeat && (k === 'e' || k === 'enter' || k === ' ')) { if (!E.UI.modal.classList.contains('on')) { e.preventDefault(); pressE(); } }
  }
  const kd = e => onKey(e, true), ku = e => onKey(e, false);

  /* ------------------------------------------------------------------ entry point (replaces the old hub menu) */
  E.hub = async function () {
    const G = E.G; G.done = true; G.ck = 'hub'; E.save(); E.setTitle('A NEW BEGINNING'); E.updHud();
    await E.exitAll();
    await E.loadSkinFor(['you']);
    if (W) { W.stop = true; W.root.remove(); W = null; }
    // the villagers need their characters registered before they can be loaded
    await build(0.30);
    sizeWorld(); E.setTitle(PLACES[0].name.toUpperCase());
    E.UI.stage.classList.remove('dim');
    E.loadSkinFor(W.npcs.map(n => n.id)).catch(() => { });
    document.addEventListener('keydown', kd); document.addEventListener('keyup', ku);
    const pad = W.hud.querySelectorAll('.wl-pad button');
    pad.forEach(b => {
      const k = b.dataset.k; const on = v => ev => { ev.preventDefault(); ev.stopPropagation(); if (k === 'e') { if (v) pressE(); } else W.keys[k] = v; };
      b.addEventListener('pointerdown', on(true)); b.addEventListener('pointerup', on(false)); b.addEventListener('pointerleave', on(false)); b.addEventListener('pointercancel', on(false));
    });
    const ro = new ResizeObserver(sizeWorld); ro.observe(E.UI.stage);
    say('', HINT); W.nearKey = '';
    E.toast('assets/mc/minecart.png', 'Walk with A / D. Press E to use things.');
    W.t = performance.now(); requestAnimationFrame(frame);
    try {
      for (; ;) {
        const ob = await E.aw(new Promise(res => { W.resolve = res; }));
        await doAction(ob);
      }
    } finally {
      document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku); ro.disconnect();
      if (W) { W.stop = true; W.root.remove(); W = null; }
    }
  };
})();
