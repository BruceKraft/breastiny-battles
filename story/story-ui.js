/* story-ui.js - entry screen, loadout, pause menu, wardrobe, lore book and the post-game hub */
(function () {
  'use strict';
  const E = window.StoryEngine, D = window.StoryData, SK3 = window.Skin3D, ART = window.StoryArt;
  const { el, modal, closeModal, TPI, TOOLS, OUT } = Object.assign({}, E, D);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ------------------------------------------------------------- entry */
  let cfg = { name: '', user: '', slim: false, dye: '#a06540', diff: 'normal', skinData: null, skinObj: null }, face = 'f', pvTok = 0, status = '';
  const DY = ['#a06540', '#b02e26', '#f9801d', '#f9d71c', '#5e7c16', '#3ab3da', '#3c44aa', '#8932b8', '#f38baa', '#1d1d21', '#f9fffe'];

  async function previewRefresh() {
    const my = ++pvTok; const g = E.newState(cfg); E.setG(g);
    if (cfg.skinObj) E.setSkin('you', cfg.skinObj); else E.setSkin('you', null);
    await E.loadSkinFor(['you']); if (my !== pvTok) return;
    const im = $('#stPv'); if (im) { const u = E.imgURL('you', { face, pose: 'hold' }); if (u) im.src = u; }
    
  }

  E.renderEntry = async function () {
    const sv = E.loadSave(); const root = E.UI.entry; await ART.load();
    if (!cfg.name && me && me.name) cfg.name = me.name;
    root.innerHTML = `<div class="st-entry">
      <div class="st-prev"><canvas class="sc" id="stPvC" width="960" height="576"></canvas><img class="pv" id="stPv" alt=""><div class="rot"><button class="stbtn sm" data-f="r">&#9664;</button><button class="stbtn sm" data-f="f">Front</button><button class="stbtn sm" data-f="l">&#9654;</button><button class="stbtn sm" data-f="b">Back</button></div></div>
      <div class="st-form">
        <h2 style="margin:0 0 4px">Destiny Storymode</h2>
        <label>Character name</label><input type="text" id="stName" maxlength="16" placeholder="Enter a name" value="${esc(cfg.name)}">
        <label>Minecraft username (for your skin)</label>
        <div class="r2"><input type="text" id="stUser" maxlength="16" placeholder="e.g. Dream" value="${esc(cfg.user)}"><button class="stbtn" id="stLoad" style="flex:none;width:130px">Load Skin</button></div>
        <div class="h" id="stSt">${esc(status) || 'Leave empty for a default skin. Skins are loaded from the web, so you need to be online.'}</div>
        <div class="r2" style="margin-top:8px"><button class="stbtn sm" id="stUp">Upload skin file (.png)</button><label style="margin:0;display:flex;align-items:center;gap:6px;color:#fff"><input type="checkbox" id="stSlim" ${cfg.slim ? 'checked' : ''}> Slim arms</label></div><input type="file" id="stFile" accept="image/png" style="display:none">
        <label>Difficulty</label><select id="stDiff"><option value="easy">Easy - weaker enemies, more health</option><option value="normal">Normal</option><option value="hard">Hard - tougher enemies</option></select>
        <div class="go"><button class="stbtn big" id="stNew">&#9654; ${sv ? 'New Story' : 'Start Story'}</button>${sv ? `<button class="stbtn big blue" id="stCont">Continue (${esc(sv.hero.name)} - ${sv.done ? 'Post-game' : 'Chapter ' + (sv.chapter || 1)})</button>` : ''}</div>
      </div></div>`;
    const c = $('#stPvC'); c.getContext('2d').drawImage(ART.scene('street'), 0, 0);
    $('#stDiff').value = cfg.diff;
    $('#stName').oninput = e => { cfg.name = e.target.value; previewRefresh(); };
    $('#stUser').oninput = e => { cfg.user = e.target.value.trim(); };
    $('#stSlim').onchange = e => { cfg.slim = e.target.checked; if (cfg.skinObj) cfg.skinObj.slim = cfg.slim; previewRefresh(); };
    $('#stDiff').onchange = e => cfg.diff = e.target.value;
    $$('.st-prev .rot .stbtn').forEach(b => b.onclick = () => { const OP = { f: 'b', b: 'f', r: 'l', l: 'r' }; face = face === b.dataset.f ? OP[face] : b.dataset.f; previewRefresh(); });
    $('#stLoad').onclick = async () => {
      const u = $('#stUser').value.trim(); cfg.user = u; const st = $('#stSt');
      if (!u) { cfg.skinObj = null; cfg.skinData = null; st.textContent = 'Default skin selected.'; status = st.textContent; previewRefresh(); return; }
      if (!/^[A-Za-z0-9_]{1,16}$/.test(u)) { st.textContent = 'Minecraft usernames are 1-16 letters, numbers or underscores.'; return; }
      st.textContent = 'Loading skin for ' + u + '…';
      const s = await SK3.fetchSkin(u, { fresh: true });
      if (s) { cfg.skinObj = s; cfg.skinData = null; cfg.slim = s.slim; $('#stSlim').checked = s.slim; status = 'Skin loaded for ' + u + '!'; }
      else { cfg.skinObj = null; status = 'Could not load that skin (offline or username not found). You can upload a skin file instead.'; }
      st.textContent = status; previewRefresh();
    };
    $('#stUp').onclick = () => $('#stFile').click();
    $('#stFile').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { const s = await SK3.skinFromFile(f); s.slim = $('#stSlim').checked; cfg.skinObj = s; cfg.skinData = s.dataURL; cfg.user = ''; $('#stUser').value = ''; status = 'Skin file loaded!'; }
      catch (err) { status = 'That file did not work: ' + err.message; }
      $('#stSt').textContent = status; previewRefresh();
    };
    $('#stNew').onclick = () => {
      if (sv && !confirm('Start a new story? Your saved progress will be replaced.')) return;
      if (!cfg.name.trim()) { $('#stName').focus(); $('#stName').style.borderColor = '#f44'; return; }
      sfx.click(); E.startNew({ name: cfg.name.trim(), user: cfg.user, slim: cfg.slim, skinData: cfg.skinData, dye: cfg.dye, diff: cfg.diff, skinObj: cfg.skinObj });
    };
    const ct = $('#stCont'); if (ct) ct.onclick = () => { sfx.click(); E.continueGame(); };
    previewRefresh();
  };

  /* ----------------------------------------------------------- loadout */
  E.openLoadout = function () {
    const G = E.G; if (!G) return;
    const draw = () => {
      const m = modal(`<h3>Your Tools</h3><div class="mg-sub">Pick up to 4 tools to bring into battle. Tap a tool to equip or remove it. You need at least one attacking tool.</div>
      <div class="st-slots">${[0, 1, 2, 3].map(i => { const id = G.load[i]; return `<button class="st-slot" data-r="${i}">${id ? `<img src="${TOOLS[id].img || TPI(TOOLS[id].icon)}" alt=""><small>${i + 1}</small>` : `<small>${i + 1}</small>`}</button>`; }).join('')}</div>
      <div class="st-grid">${G.tools.map(id => { const t = TOOLS[id]; return `<div class="st-tool ${G.load.includes(id) ? 'on' : ''}" data-t="${id}"><img src="${t.img || TPI(t.icon)}" alt=""><b>${esc(t.n)}</b><small>${esc(t.m.d)}</small></div>`; }).join('')}</div>
      <div class="mg-row"><button class="stbtn" id="ldX">Done</button></div>`, { dark: false, wide: true });
      $$('.st-tool').forEach(t => t.onclick = () => { const id = t.dataset.t; const i = G.load.indexOf(id); if (i >= 0) { if (G.load.length > 1) G.load.splice(i, 1); } else if (G.load.length < 4) G.load.push(id); else { G.load[3] = id; } if (!G.load.some(x => TOOLS[x].m.dmg)) { G.load.push(G.tools.find(x => TOOLS[x].m.dmg)); G.load = G.load.slice(-4); } draw(); E.updHud(); E.save(); });
      $$('.st-slot').forEach(s => s.onclick = () => { const i = +s.dataset.r; if (G.load[i] && G.load.length > 1) { G.load.splice(i, 1); draw(); E.updHud(); E.save(); } });
      $('#ldX').onclick = () => { closeModal(); E.refreshChars && E.refreshChars(); const st = E.onStage.you; if (st) E.look('you', {}); };
    };
    draw();
  };

  E.openPause = function () {
    const G = E.G; if (!G) return;
    const m = modal(`<h3>Menu</h3><div class="mg-row" style="flex-direction:column;align-items:stretch;gap:10px"><button class="stbtn" id="pzR">Resume</button><button class="stbtn" id="pzT">Tools</button><button class="stbtn" id="pzW">Wardrobe</button><button class="stbtn" id="pzL">Secret Records (${G.lore.length}/${D.LORE.length})</button><label style="font-size:10px;text-align:center">Difficulty: <select id="pzD" style="font:inherit;padding:6px"><option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select></label><button class="stbtn" id="pzQ">Save &amp; quit to menu</button></div>`, { dark: false });
    $('#pzD').value = G.diff; $('#pzD').onchange = e => { G.diff = e.target.value; E.save(); };
    $('#pzR').onclick = () => closeModal(); $('#pzT').onclick = () => E.openLoadout(); $('#pzW').onclick = () => E.openWardrobe(); $('#pzL').onclick = () => E.openLore();
    $('#pzQ').onclick = () => { E.save(); closeModal(); E.leave(); show('menu'); };
  };

  /* ---------------------------------------------------------- wardrobe */
  E.openWardrobe = function () {
    const G = E.G; if (!G) return;
    const names = { leather: 'Leather (your colour)', chain: 'Chainmail', iron: 'Iron', gold: 'Gold', copper: 'Copper', diamond: 'Diamond', netherite: 'Netherite', leaf1: 'Leaf Tier 1', leaf2: 'Leaf Tier 2', leaf3: 'Leaf Tier 3', rock1: 'Rock Tier 1', rock2: 'Rock Tier 2', rock3: 'Rock Tier 3', cloud1: 'Cloud Tier 1', cloud2: 'Cloud Tier 2', cloud3: 'Cloud Tier 3' };
    const ico = { leather: 'leather_chestplate', chain: 'chainmail_chestplate', iron: 'iron_chestplate', gold: 'golden_chestplate', copper: 'copper_chestplate', diamond: 'diamond_chestplate', netherite: 'netherite_chestplate' };
    const avail = Object.keys(names).filter(k => G.done || /^(leather|iron|leaf|chain)/.test(k) && (k === 'leather' || k === G.outfit));
    const draw = async () => {
      await E.loadSkinFor(['you']); const u = E.imgURL('you', { face: 'f', pose: 'hold' });
      modal(`<h3>Wardrobe</h3><div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start"><div style="flex:0 0 150px;text-align:center"><img src="${u}" style="height:260px;image-rendering:auto" alt=""></div><div style="flex:1;min-width:230px"><div class="st-grid">${avail.map(k => `<div class="st-tool ${G.outfit === k ? 'on' : ''}" data-k="${k}"><img src="${TPI(ico[k] || (k.startsWith('rock') ? 'netherite_chestplate' : 'iron_chestplate'))}" alt=""><b>${names[k]}</b></div>`).join('')}</div>
      <label style="font-size:10px">Headband: <input type="checkbox" id="wdB" ${G.bandOn ? 'checked' : ''}></label> <input type="color" id="wdBc" value="${G.hero.band}"><br><label style="font-size:10px">Leather colour: <input type="color" id="wdD" value="${G.hero.dye}"></label></div></div><div class="mg-row"><button class="stbtn" id="wdX">Done</button></div>`, { wide: true });
      $$('.st-tool').forEach(t => t.onclick = () => { G.outfit = t.dataset.k; G.custom = null; SK3.clearCache('you|'); E.updHud(); E.save(); draw(); });
      $('#wdB').onchange = e => { G.bandOn = e.target.checked; draw(); E.save(); }; $('#wdBc').onchange = e => { G.hero.band = e.target.value; draw(); E.save(); }; $('#wdD').onchange = e => { G.hero.dye = e.target.value; draw(); E.save(); };
      $('#wdX').onclick = () => { closeModal(); const st = E.onStage.you; if (st) E.look('you', {}); };
    };
    draw();
  };

  /* -------------------------------------------------------------- lore */
  E.openLore = function () {
    const G = E.G; const pages = D.LORE.filter(l => G.lore.includes(l.id));
    modal(`<h3>Secret Story</h3><div class="st-book">${pages.length ? pages.map(l => `<h4>${esc(l.t)}</h4><p>${esc(l.x)}</p>`).join('') : '<p>No records found yet.</p>'}${pages.length && pages.length < D.LORE.length ? `<p><i>${D.LORE.length - pages.length} record(s) still hidden…</i></p>` : (pages.length ? '<p><b>You found every record.</b></p>' : '')}</div><div class="mg-row"><button class="stbtn" id="lrX">Close</button></div>`, { wide: true });
    $('#lrX').onclick = () => closeModal();
  };

  /* ------------------------------------------------------------ hub */
  const ACT = [
    { id: 'sora', t: "Sora's Rematch", icon: 'diamond_sword', d: 'Fight your first rival again, now at full strength.' },
    { id: 'master', t: 'Master Ninja Challenges', icon: 'mace', d: 'Face the Rank 1 and Rank 2 ninjas one by one.' },
    { id: 'elite', t: 'Elite Ninja Missions', icon: 'netherite_chestplate', d: 'Mixed missions for Elite ninjas.' },
    { id: 'village', t: 'Village Missions', icon: 'emerald', d: 'Help Leaf, Rock and Cloud villages.' },
    { id: 'ruins', t: 'Hidden Ruins', icon: 'chiseled_stone_bricks', d: 'Explore the ruins, find loot and secret records.' },
    { id: 'legend', t: 'Legendary Creatures', icon: 'nether_star', d: 'Hunt the legendary creatures of the world.' },
    { id: 'end', t: 'The End Rematches', icon: 'ender_eye', d: 'Fight Master Duper and Void Risez again.' },
    { id: 'wardrobe', t: 'Character Customization', icon: 'leather_chestplate', d: 'Wear any armour, trim and headband in the game.' },
    { id: 'lore', t: 'Secret Story', icon: 'enchanted_book', d: 'Read the records you uncovered.' }
  ];
  const BLOCKY = { chiseled_stone_bricks: 'assets/tp/block/chiseled_stone_bricks.png' };
  E.hub = async function () {
    const G = E.G; G.done = true; G.ck = 'hub'; E.save(); E.setTitle('POST-GAME'); E.updHud();
    for (; ;) {
      await E.setScene('fest', { fade: false }); await E.exitAll();
      const pick = await E.aw(new Promise(res => {
        UIhub(res);
      }));
      if (pick === 'wardrobe') { await new Promise(r => { E.openWardrobe(); const t = setInterval(() => { if (!E.UI.modal.classList.contains('on')) { clearInterval(t); r(); } }, 200); }); continue; }
      if (pick === 'lore') { await new Promise(r => { E.openLore(); const t = setInterval(() => { if (!E.UI.modal.classList.contains('on')) { clearInterval(t); r(); } }, 200); }); continue; }
      const steps = window.StoryScript.hub[pick]; if (steps) { await E.runScript(steps); G.hub[pick] = (G.hub[pick] || 0) + 1; E.save(); }
    }
  };
  function UIhub(res) {
    const G = E.G;
    E.aw(Promise.resolve());
    E.UI.modal.classList.add('on'); E.UI.pan.className = ''; E.UI.pan.style.cssText = 'background:none;border:0;box-shadow:none;padding:0;max-width:min(900px,100%);width:100%;max-height:100%;overflow:auto';
    E.UI.pan.innerHTML = `<div class="st-q">A NEW BEGINNING - Choose an activity</div><div class="st-hub">${ACT.map(a => `<button class="stbtn" data-a="${a.id}"><img src="${TPI(a.icon)}" alt="" onerror="this.src='assets/tp/item/paper.png'"><span>${esc(a.t)}${G.hub[a.id] ? '<span class="ck">&#10003;</span>' : ''}<small>${esc(a.d)}</small></span></button>`).join('')}</div>`;
    $$('#stPan .stbtn').forEach(b => b.onclick = () => { closeModal(); res(b.dataset.a); });
  }
  // abortable hub: the pending promise is dropped when the player leaves (tok changes), nothing else needed
})();
