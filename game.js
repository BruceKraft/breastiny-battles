(function(){const u=['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];let i=0;(function n(){if(window.Peer||i>=u.length)return;const e=document.createElement('script');e.async=true;e.src=u[i++];e.onerror=n;document.head.appendChild(e)})()})();



const MONS=[
{id:'mikeanike',name:'Mikeanike132',col:['#8a4fd0','#ff2d95'],glow:'#b57bff',hp:100,moves:[
 {n:'Vedo',guard:'block',d:"Blocks the foe's next move, healing or attack."},
 {n:'Decibels',dmg:25,k:'{v} was deafened by {k}',d:'Deals 25 damage.'},
 {n:'Trains',dmg:10,k:"{v} was ran over by Mike's Train",d:'A train hits the foe for 10 damage.'},
 {n:'Headlights',blind:true,d:"Blinds the foe for 1 turn. They can't see health, abilities or what is happening and can only pick something random."}]},
{id:'sora',name:'SoraIO_',col:['#ff8a1e','#d62828'],glow:'#ff9a2e',hp:110,moves:[
 {n:'Bridge',dmg:15,k:'{v} was hit by a bridge',d:'Hits the foe with a world-sized bridge for 15 damage.'},
 {n:'Crashout',burn:true,d:"Burns one of the foe's abilities for 2 rounds so they can't use it."},
 {n:'Dome',guard:'reflect',d:"Creates a dome around Sora that reflects the next attack back at the foe."},
 {n:'Gate of Babalon',dmg:25,k:'{v} was eradicated by the Gate of Babalon',d:'25 damage to the foe.'}]},
{id:'nukoz',name:'Nukoz',col:['#ffd800','#ffffff'],glow:'#ffe62e',hp:110,moves:[
 {n:'Tempest',dmg:25,k:'{v} was smashed by {k} using Tempest',d:'Hits the foe with a custom mace for 25 damage.'},
 {n:'Master Duper Double Mace',dmg:7.5,hits:2,k:'{v} was smashed by {k} using the Master Duper Double Mace',d:'Hits the foe with 2 maces for 7.5 damage each, 15 damage total.'},
 {n:'Catboy',dmg:5,distract:true,k:'{v} was smashed by {k} using Catboy',d:'Slashes the foe for 5 damage and distracts them for 1 turn.'},
 {n:'HiamChud',heal:20,d:'Summons a Chase and heals 20 HP.'}]},
{id:'bruce',name:'BruceKr4ft',col:['#8b5a2b','#ff2d95'],glow:'#c28a4a',hp:100,moves:[
 {n:'Ban Hammer',dmg:25,k:'{v} was banned by {k} using the ban hammer',d:'Hits the foe with a hammer, damaging them for 25 HP.'},
 {n:'9 Lifes',heal:15,d:'Heals 15 HP.'},
 {n:'Hacker',scramble:true,d:"Scrambles the foe's abilities next turn so they don't know what they are using."},
 {n:'Scratch',dmg:15,k:'{v} was scratched to death by {k}',d:'Deals 15 damage.'}]},
{id:'kneervous',name:'kneervous',col:['#ff9ecb','#ffd800'],glow:'#ff9ecb',hp:110,moves:[
 {n:'Quite Literally Known',hideHp:true,d:'Hides the health bars from the foe for 3 rounds.'},
 {n:'Angel',distract:true,d:'The foe skips their next turn.'},
 {n:'Mace',dmg:15,k:'{v} was smashed by {k}',d:'Deals 15 damage.'},
 {n:'Elytra Mace',dmg:20,k:'{v} was smashed by {k}',d:'Deals 20 damage.'}]},
{id:'chase',name:'HiamChase',col:['#151515','#8b5a2b'],glow:'#9a6bff',hp:99,moves:[
 {n:'OHHH NUKOZZZZ!!!',dmg:25,k:'{v} was smashed by Nukoz',d:'Summons Nukoz who maces the foe for 25 damage.'},
 {n:'I Am A Chud',guard:'run',d:"HiamChase runs and takes 70% less damage from the next attack."},
 {n:'Prison',heal:15,d:'Stuck in prison, heals 15 HP.'},
 {n:'Helppp!!',special:'helppp',noCopy:true,d:"Switches to any other member (even a dead one, who is revived at half health). A living member gets 1.25x health. You can cancel before choosing. Chase can't come back."}]},
{id:'etrosion',name:'etrosion',col:['#2f7bf0','#8a4fd0'],glow:'#4aa3ff',hp:115,moves:[
 {n:'Trident',dmg:20,special:'trident',k:'{v} was impaled by {k}',d:'20 damage, 50% chance of 5 more on the way back.'},
 {n:'It was kinda like destiny',guard:'blockatk',d:"Blocks the next attack."},
 {n:'Subscribe',dmg:20,k:'{v} was forced to subscribe to {k}',d:'Forces the foe to subscribe to etrosion, dealing 20 damage.'},
 {n:'Honor',heal:20,d:'etrosion heals 20 HP.'}]},
{id:'burg',name:'ItsBurg',col:['#86e46f','#6a6a6a'],glow:'#86e46f',hp:110,moves:[
 {n:'Burger',rdmg:[.25,30,10],k:'{v} was poisoned by {k}',d:'Feeds the foe a poisoned burger: 25% chance of 30 damage, 75% chance of 10.'},
 {n:'Lock In',guard:'dodge',d:"Dodges the incoming attack."},
 {n:'Execute',dmg:25,self:10,k:'{v} was executed by {k}',d:'25 damage to the foe, ItsBurg takes 10.'},
 {n:'Eating',heal:50,skipSelf:true,d:'Gains 50 HP but skips the next turn.'}]},
{id:'voidrisez',name:'Voidrisez',col:['#151515','#c4c6cc'],glow:'#9a6bff',hp:110,moves:[
 {n:'Crashout',dmg:30,self:15,k:'{k} crashed out on {v}',d:'30 damage to the foe, Voidrisez takes 15.'},
 {n:'Nilli',guard:'dodge',d:"Scripted: dodges the attack."},
 {n:'Ragebait',dmg:20,k:'{v} was ragebaited by {k}',d:'Ragebaits the foe for 20 damage.'},
 {n:'Leave',heal:15,d:'Heals 15 HP.'}]},
{id:'mlvlnt',name:'M7VN',col:['#ffd800','#d62828'],glow:'#ffe62e',hp:110,moves:[
 {n:'Aura',heal:15,d:'Heals 15 HP.'},
 {n:'Mysterious',special:'mysterious',d:'Uses a random move from another member.'},
 {n:'PvP',dmg:15,k:'{v} was slain by {k}',d:'Deals 15 damage.'},
 {n:'Chestplate',dmg:25,k:'{v} was smashed by {k} using chestplate',d:'Flies up and smashes into the ground for 25 damage.'}]}
];
const byId=id=>MONS.find(m=>m.id===id);
const WR={mikeanike:{w:['nukoz'],r:['sora']},sora:{w:['voidrisez'],r:['bruce']},nukoz:{w:['mlvlnt'],r:['chase']},bruce:{w:['sora'],r:['chase']},kneervous:{w:['burg'],r:['voidrisez']},chase:{w:['chase'],r:['etrosion']},etrosion:{w:['chase'],r:['burg']},burg:{w:['etrosion'],r:['kneervous']},voidrisez:{w:['kneervous'],r:['sora']},mlvlnt:{w:['mikeanike'],r:['nukoz']}};

const matchup=(att,def)=>{const r=WR[def]||{w:[],r:[]};return r.w.includes(att)?1.5:r.r.includes(att)?.7:1};
const GUARD_MULT={block:0,dodge:0,blockatk:0,reflect:0,tank:.25,run:.3,dumb:.5};
function power(m){return m.dmg||(m.heal?m.heal*.8:0)||(m.guard?15:m.special==='mysterious'?18:12)}
const strongest=m=>m.moves.reduce((a,b)=>(b.dmg||0)>(a.dmg||0)?b:a);
const CD_TURNS=1; // turns a member's highest-damage move(s) can't be used after using one
const effDmg=m=>m.rdmg?Math.max(m.rdmg[1],m.rdmg[2]):(m.dmg||0)*(m.hits||1);
const topMoves=mon=>{const mx=Math.max(...mon.moves.map(effDmg));return mx>0?mon.moves.filter(x=>effDmg(x)===mx):[]};
const CD_STUN=2,CDX={'mlvlnt:Chestplate':1};
const cdFor=(mon,mv)=>{if(mv.cd!=null)return mv.cd;const k=mon.id+':'+mv.n;if(CDX[k]!=null)return CDX[k];if(mv.distract)return CD_STUN;return topMoves(mon).includes(mv)?CD_TURNS:0};
const cdTurns=(f,mv)=>cdFor(f.m,mv);
const onCd=(f,m)=>(f.cds.get(m)||0)>0;

function endTurn(f,mv,skipped){
  for(const [k,v] of f.cds)if(v>0){f.cds.set(k,v-1);if(v-1<=0)f.burned.delete(k)}
  if(!skipped&&mv){const c=cdTurns(f,mv);if(c)f.cds.set(mv,c)}
  if(f.m.moves.every(x=>onCd(f,x))){const w=weakest(f.m.moves);f.cds.delete(w);f.burned.delete(w)} // everything on cooldown -> the weakest comes off cooldown
  if(typeof B!=='undefined'&&B&&B.pt&&B.pt.includes(f))B.rounds=(B.rounds||0)+1;
  f.rand=null;if(f.hideHp>0)f.hideHp--;if(f.pois>0){f.pois--;if(typeof B!=='undefined'&&B&&B.p&&B.e)updBox(B.p===f?'p':'e')}
  if(typeof B!=='undefined'&&B&&B.p===f)applyView();
}
function applyView(){const sc=$('#screen-battle');if(!B||!B.p||!sc||B.spec)return;const p=B.p;sc.classList.toggle('blind',p.rand==='blind');sc.classList.toggle('nohp',p.hideHp>0||p.rand==='blind')}
function resolveIdx(P,pi){if(!P.rand)return pi;const all=P.m.moves.map((m,i)=>i),av=all.filter(i=>!onCd(P,P.m.moves[i]));const a=av.length?av:all;return a[Math.floor(Math.random()*a.length)]}
function weakest(moves){return moves.reduce((a,b)=>power(b)<power(a)?b:a)}

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let FAST=false,EP=0,ACT=Date.now();
const sleep=ms=>{if(FAST)return Promise.resolve();const e=EP;return new Promise(r=>setTimeout(()=>{if(e===EP)r()},ms))};
const live=(p,cap)=>{const e=EP;return new Promise(r=>{const g=()=>{if(e===EP)r(0)};p.then(g,g);if(cap)setTimeout(g,cap)})};
const pick=a=>a[Math.floor(Math.random()*a.length)];
let rnd=Math.random;const pickR=a=>a[Math.floor(rnd()*a.length)];
const mul=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const badges=m=>'';
function show(id){$('#bg').classList.toggle('menubg',id!=='battle');if(id!=='battle'){leaveSpec();stopAllSounds()}$$('.screen').forEach(s=>s.classList.remove('active'));$('#screen-'+id).classList.add('active');window.scrollTo(0,0);if(window.StoryUI){StoryUI.onShow(id);if(id==='story')StoryUI.enter()}
  if(id==='menu')renderMenu();if(id==='dex')renderDex();if(id==='board')renderBoard();if(id==='select')renderSelect();if(id==='profile')renderProfile();if(id==='settings')renderSettings();if(id==='friends')renderFriends();if(id==='admin')renderAdmin();if(id==='menu'){startPresence();if(D&&!D.live){const o=D;D=null;try{o.c.send({t:'lv'})}catch(e){}try{o.c.close()}catch(e){}}}}
const FLOAT_IMG='assets/destiny.png';
const px=(g,p)=>{let r='';g.forEach((row,y)=>[...row].forEach((c,x)=>{if(p[c])r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${p[c]}"/>`}));return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges">${r}</svg>`)};
const PAL={k:'#222',c:'#4ee',w:'#dff',b:'#8b5a2b',r:'#d22',g:'#3a3'};
const ITEMS={sword:'assets/diamond_sword.png',diamond:'assets/diamond.png',apple:'assets/golden_apple.png'};
for(let i=0;i<14;i++){const b=document.createElement('img');b.className='ball';b.src=FLOAT_IMG;const z=26+Math.random()*34;b.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${14+Math.random()*18}s;animation-delay:${-Math.random()*20}s`;$('#bg').appendChild(b)}

let S={vol:.8,sfx:1,voice:1,click:.55,type:1,speed:1,shake:1,fx:1,float:1};try{Object.assign(S,JSON.parse(localStorage.getItem('bpb_set')||'{}'))}catch(e){}
let muted=false,AC=null,MG=null,MV=null;try{muted=localStorage.getItem('bpb_mute')==='1'}catch(e){}
function ctx(){if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createDynamicsCompressor();MV=AC.createGain();MV.gain.value=S.vol;MG.connect(MV);MV.connect(AC.destination)}if(AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type='square',v=.05,to,delay=0){if(muted||FAST)return;try{const a=ctx(),o=a.createOscillator(),g=a.createGain(),t=a.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.02)}catch(e){}}
function noise(d,v=.08,fq=2500,delay=0){if(muted||FAST)return;try{const a=ctx(),n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<n;i++)c[i]=Math.random()*2-1;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+delay;s.buffer=b;f.type='lowpass';f.frequency.setValueAtTime(fq,t);f.frequency.exponentialRampToValueAtTime(200,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(MG);s.start(t)}catch(e){}}
const arp=(fs,d,type,v)=>fs.forEach((f,i)=>tone(f,d,type,v,0,i*d*.7));
const FS={};[['click','guiclick'],['hurt','damage'],['death','lightning']].forEach(([n,f])=>{const a=new Audio('assets/sounds/'+f+'.mp3');a.preload='auto';a.addEventListener('canplaythrough',()=>FS[n]=a)});
function fsx(n){if(!FS[n])return false;if(!muted&&!FAST){const a=FS[n].cloneNode();a.volume=Math.min(1,S.vol*(n==='click'?S.click:S.sfx));a.play().catch(()=>{})}return true}
let lc=0;
const sfx={type:()=>tone(480+Math.random()*120,.035,'square',.018),click:()=>{const t=performance.now();if(t-lc<80)return;lc=t;fsx('click')||(noise(.025,.22,4000),tone(1100,.03,'triangle',.07,500))},whoosh:()=>noise(.25,.07,1200),hit:()=>{fsx('hurt')||(noise(.14,.08,1800),tone(330,.28,'sawtooth',.08,110),tone(250,.3,'square',.04,90,.02))},heal:()=>arp([523,659,784,1047],.16,'triangle',.06),guard:()=>{tone(300,.22,'triangle',.06,700);noise(.12,.04,6000)},faint:()=>fsx('death')||tone(400,.9,'sawtooth',.05,40),win:()=>arp([523,659,784,1047,1319],.2,'square',.04),lose:()=>arp([400,350,300,200],.28,'sawtooth',.04)};
document.addEventListener('click',e=>{if(e.target.closest('.btn,.tile'))sfx.click();if(e.target.closest('#result .btn'))stopAllSounds()});
function setMute(m){muted=m;try{localStorage.setItem('bpb_mute',m?'1':'0')}catch(e){}$('#muteBtn').classList.toggle('off',m)}
$('#muteBtn').onclick=()=>setMute(!muted);setMute(muted);

const USE_IMAGES=false;
let gid=0;
function svgSprite(m,back){
  const id='g'+(gid++),i=MONS.indexOf(m),c1=m.col[0],c2=m.col[1],S='stroke="#222" stroke-width="3"';
  let ears;
  if(i%3===0)ears=`<polygon points="22,42 16,6 44,28" fill="${c2}" ${S}/><polygon points="78,42 84,6 56,28" fill="${c2}" ${S}/>`;
  else if(i%3===1)ears=`<circle cx="24" cy="28" r="12" fill="${c2}" ${S}/><circle cx="76" cy="28" r="12" fill="${c2}" ${S}/>`;
  else ears=`<line x1="36" y1="32" x2="26" y2="9" ${S}/><circle cx="26" cy="9" r="6" fill="${c2}" ${S}/><line x1="64" y1="32" x2="74" y2="9" ${S}/><circle cx="74" cy="9" r="6" fill="${c2}" ${S}/>`;
  const tail=i%2?`<path d="M80 76 Q104 64 94 38" fill="none" stroke="#222" stroke-width="13" stroke-linecap="round"/><path d="M80 76 Q104 64 94 38" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>`:`<circle cx="88" cy="74" r="10" fill="${c2}" ${S}/>`;
  const face=back?`<path d="M36 46 Q50 40 64 46" fill="none" stroke="#0004" stroke-width="3"/>`:`<circle cx="39" cy="52" r="7" fill="#fff" ${S}/><circle cx="61" cy="52" r="7" fill="#fff" ${S}/><circle cx="41" cy="53" r="3.2" fill="#222"/><circle cx="59" cy="53" r="3.2" fill="#222"/><path d="M42 66 Q50 73 58 66" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>${i%2?'<polygon points="44,68 47,74 50,68" fill="#fff"/>':''}`;
  const belly=back?'':`<ellipse cx="50" cy="76" rx="17" ry="11" fill="#fff" opacity=".35"/>`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="${id}" cx="38%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="${c1}"/><stop offset="1" stop-color="${c1}"/></radialGradient></defs>
  <ellipse cx="50" cy="94" rx="30" ry="5" fill="#0003"/>${tail}${ears}
  <ellipse cx="32" cy="90" rx="10" ry="6" fill="${c2}" ${S}/><ellipse cx="68" cy="90" rx="10" ry="6" fill="${c2}" ${S}/>
  <ellipse cx="50" cy="60" rx="34" ry="30" fill="url(#${id})" ${S}/>${belly}
  <circle cx="30" cy="68" r="5" fill="${c2}" opacity=".6"/><circle cx="70" cy="70" r="4" fill="${c2}" opacity=".6"/>${face}</svg>`;
}
function sprite(m,back){if(window.StoryUI&&B&&B.story){const h=StoryUI.spriteFor(m,back);if(h)return h}return `<div class="sp"><img src="assets/sprites/${m.id}.png" alt="${m.name}" data-id="${m.id}" data-b="${back?1:0}" onerror="spFall(this)"></div>`}
function spFall(img){const d=document.createElement('div');d.innerHTML=svgSprite(byId(img.dataset.id),img.dataset.b==='1');img.replaceWith(d.firstChild)}

const DB='bpb_users_v1',SES='bpb_session_v1';
let me=null;
const getUsers=()=>{try{return JSON.parse(localStorage.getItem(DB))||{}}catch(e){return{}}};
const putUsers=u=>{try{localStorage.setItem(DB,JSON.stringify(u))}catch(e){}cloudSched(u)};
const FB_CONFIG={apiKey:"AIzaSyCUmZsBuMl3vt9Vw5IMSC9XmMHPu4iM1EE",authDomain:"breastinybattles.firebaseapp.com",projectId:"breastinybattles",storageBucket:"breastinybattles.firebasestorage.app",messagingSenderId:"21164155069",appId:"1:21164155069:web:daae60aab4288e5dadd7d4"};
const CLOUD=!!FB_CONFIG.apiKey&&typeof firebase!=='undefined';
let fauth=null,fdb=null,cT=0;
if(CLOUD){try{firebase.initializeApp(FB_CONFIG);fauth=firebase.auth();fdb=firebase.firestore()}catch(e){console.error(e)}}
const cloudOn=()=>CLOUD&&fauth&&fdb;
const cId=k=>[...new TextEncoder().encode(k)].map(b=>b.toString(16).padStart(2,'0')).join('');
const cMail=k=>cId(k)+'@breastiny.game';
const cDoc=k=>fdb.collection('users').doc(cId(k));
const cClean=d=>{const o=JSON.parse(JSON.stringify(d));delete o.salt;delete o.hash;return o};
function cloudSched(u){if(!cloudOn()||!me||me.guest||!fauth.currentUser||!u||!u[me.key])return;clearTimeout(cT);const k=me.key;cT=setTimeout(()=>cloudPush(k),700)}
async function cloudPush(k){try{const d=getUsers()[k];if(d&&fauth.currentUser&&fauth.currentUser.email===cMail(k))await cDoc(k).set(cClean(d))}catch(e){console.error(e)}}
async function cloudPull(k){const s=await cDoc(k).get();if(!s.exists)return null;const u=getUsers(),old=u[k]||{};u[k]=Object.assign({},old,s.data());try{localStorage.setItem(DB,JSON.stringify(u))}catch(e){}return u[k]}
async function cloudBoard(){const q=await fdb.collection('users').orderBy('wins','desc').limit(100).get();q.forEach(x=>{const d=x.data();if(d&&d.name)addK({key:d.key,name:d.name,bio:d.bio,pfp:d.pfp,wins:d.wins,losses:d.losses,best:d.best})})}
window.addEventListener('pagehide',()=>{if(cloudOn()&&me&&!me.guest)cloudPush(me.key)});
async function hashPw(pw,salt){
  const data=new TextEncoder().encode(salt+':'+pw);
  if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  let h=5381;for(const b of data)h=((h<<5)+h+b)>>>0;return 'x'+h.toString(16);
}
async function signup(name,pw){
  if(!/^[A-Za-z0-9_ ]{3,16}$/.test(name))throw new Error('Name: 3-16 letters/numbers.');
  if(pw.length<(cloudOn()?6:4))throw new Error('Password needs '+(cloudOn()?6:4)+'+ characters.');
  const users=getUsers(),key=name.toLowerCase();
  if(cloudOn()){
    try{await fauth.createUserWithEmailAndPassword(cMail(key),pw)}catch(e){throw new Error(e.code==='auth/email-already-in-use'?'That name is taken.':e.code==='auth/network-request-failed'?'No connection. Try again.':'Could not create account ('+(e.code||e.message)+').')}
    const old=users[key]||{};
    users[key]={name,wins:old.wins||0,losses:old.losses||0,streak:0,best:old.best||0,picks:old.picks||{},created:Date.now()};
    try{localStorage.setItem(DB,JSON.stringify(users))}catch(e){}
    me={key,name};try{localStorage.setItem(SES,key)}catch(e){}
    await cDoc(key).set(cClean(users[key])).catch(e=>console.error(e));
    return;
  }
  if(users[key])throw new Error('That name is taken.');
  const salt=Math.random().toString(36).slice(2);
  users[key]={name,salt,hash:await hashPw(pw,salt),wins:0,losses:0,streak:0,best:0,picks:{},created:Date.now()};
  putUsers(users);me={key,name};try{localStorage.setItem(SES,key)}catch(e){}
}
async function login(name,pw){
  const key=name.toLowerCase();
  if(cloudOn()){
    try{await fauth.signInWithEmailAndPassword(cMail(key),pw)}catch(e){throw new Error(e.code==='auth/network-request-failed'?'No connection. Try again.':e.code==='auth/too-many-requests'?'Too many tries. Wait a bit.':'Wrong name or password.')}
    let d=null;try{d=await cloudPull(key)}catch(e){console.error(e)}
    const users=getUsers();
    if(!d){users[key]=users[key]||{name:name,wins:0,losses:0,streak:0,best:0,picks:{},created:Date.now()};try{localStorage.setItem(DB,JSON.stringify(users))}catch(e){}await cDoc(key).set(cClean(users[key])).catch(e=>console.error(e))}
    me={key,name:getUsers()[key].name};try{localStorage.setItem(SES,key)}catch(e){}
    return;
  }
  const users=getUsers(),u=users[key];
  if(!u||u.hash!==await hashPw(pw,u.salt))throw new Error('Wrong name or password.');
  me={key,name:u.name};try{localStorage.setItem(SES,key)}catch(e){}
}
function logout(){if(cloudOn()){cloudPush(me.key);fauth.signOut().catch(()=>{})}try{pp&&pp.destroy()}catch(e){}pp=null;me=null;try{localStorage.removeItem(SES)}catch(e){}show('login')}
const myData=()=>me&&!me.guest?getUsers()[me.key]:null;

let mode='login';
function setTab(m){mode=m;$('#tab-login').classList.toggle('on',m==='login');$('#tab-signup').classList.toggle('on',m==='signup');$('#authGo').textContent=m==='login'?'Log in':'Create account';$('#authErr').textContent=''}
$('#tab-login').onclick=()=>setTab('login');$('#tab-signup').onclick=()=>setTab('signup');
$('#authForm').onsubmit=async e=>{e.preventDefault();const u=$('#authUser').value.trim(),p=$('#authPass').value;
  try{mode==='signup'?await signup(u,p):await login(u,p);$('#authPass').value='';sfx.click();show('menu')}catch(err){$('#authErr').textContent=err.message}};
$('#logoutBtn').onclick=logout;
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{sfx.click();show(b.dataset.go)}));

function renderMenu(){
  const d=myData();badge();{const a=$('#adminBtn');if(a)a.style.display=isAdmin()?'':'none'}
  $('#welcome').innerHTML=`<img class="pfp" style="width:40px;height:40px;vertical-align:middle" src="${pfpOf(d)}"> Welcome, ${esc(me.name)}!`;
  if(d){const fav=Object.entries(d.picks||{}).sort((a,b)=>b[1]-a[1])[0];
    $('#myStats').innerHTML=`<span>Wins <b>${d.wins}</b></span><span>Losses <b>${d.losses}</b></span><span>Streak <b>${d.streak}</b></span><span>Best <b>${d.best}</b></span>`}
  else $('#myStats').innerHTML='<span class="muted">Guest mode — your record is not saved. Sign up to keep stats!</span>';
}

function statRows(m){
  const rows=[['HP',m.hp,'#e53935']];
  return rows.map(([l,v,c])=>`<div class="stat"><span>${l}</span><b style="width:26px">${v}</b><div class="bar"><i style="width:100%;background:${c}"></i></div></div>`).join('');
}
function weakRes(m){
  const nm=ids=>ids.map(id=>`<span class="tb" style="background:#555">${esc(byId(id).name)}</span>`).join(' ')||'-';
  const x=WR[m.id];return {w:nm(x.w),r:nm(x.r)};
}
function movesList(m){return m.moves.map(x=>{const c=cdFor(m,x);return `<div class="mv"><b>${esc(x.n)}</b><br>${esc(x.d)}${c?` <i>(${c} turn cooldown)</i>`:''}</div>`}).join('')}
function renderDex(){
  $('#dexCards').innerHTML=MONS.map((m,i)=>{const wr=weakRes(m);return `<div class="panel card" data-id="${m.id}" style="cursor:pointer"><div class="dtop"><div class="dinfo"><div class="dnum">#${String(i+1).padStart(2,'0')}</div><h3>${esc(m.name)}</h3><div>${badges(m)}</div></div>${sprite(m)}</div><div class="dhp">${statRows(m)}</div>${movesList(m)}<div class="wr"><b>Weak to:</b><br>${wr.w}<br><b>Resists:</b><br>${wr.r}</div></div>`}).join('');
  $$('#dexCards .card').forEach(c=>c.onclick=()=>{const ks=Object.keys(VL).filter(k=>k.startsWith(c.dataset.id+':'));if(!ks.length)return;stopAllSounds();voice(ks[Math.floor(Math.random()*ks.length)])});
}
let team=[],pickN=3;
function renderSelect(){
  team=[];$('#readyNote').textContent=vsMode==='duel'&&D?(D.kind==='comp'?'Competitive':'Friendly')+(D.size===1?' 1v1':' 3v3')+' duel vs '+D.opp+(D.oppReady?' - they are READY!':''):'';$('#startBtn').disabled=true;$('#startBtn').textContent=`PICK ${pickN} (0/${pickN})`;$('#pickTitle').textContent=pickN===1?'CHOOSE 1 MEMBER':'CHOOSE '+pickN+' MEMBERS';
  $('#pickGrid').innerHTML=MONS.map(m=>`<div class="tile" data-id="${m.id}">${sprite(m)}<div class="nm">${esc(m.name)}</div>${badges(m)}</div>`).join('');
  $$('#pickGrid .tile').forEach(t=>t.onclick=()=>{if(vsMode==='duel'&&D&&D.my)return;sfx.click();const m=byId(t.dataset.id),i=team.indexOf(m);
    if(i>=0)team.splice(i,1);else if(pickN===1)team=[m];else if(team.length<pickN)team.push(m);else return;
    $$('#pickGrid .tile').forEach(x=>x.classList.toggle('sel',team.includes(byId(x.dataset.id))));
    $('#startBtn').disabled=team.length<pickN;$('#startBtn').textContent=team.length<pickN?`PICK ${pickN} (${team.length}/${pickN})`:lbl();
    showDetail(m)});
  $$('#pickGrid .tile').forEach(t=>{t.onmouseenter=()=>{clearTimeout(hoverT);showDetail(byId(t.dataset.id))};t.onmouseleave=()=>{clearTimeout(hoverT);hoverT=setTimeout(()=>{if(team.length)showDetail(team[team.length-1])},220)}});
  let hoverT=0,shownId=null;
  function showDetail(m){if(shownId===m.id)return;shownId=m.id;const d=$('#pickDetail');d.classList.remove('swap');void d.offsetWidth;d.classList.add('swap');d.innerHTML=`<div><h3>${esc(m.name)}</h3><div style="margin:6px 0">${badges(m)}</div>${statRows(m)}</div><div>${movesList(m)}<div class="wr"><b>Weak to:</b> ${weakRes(m).w}<br><b>Resists:</b> ${weakRes(m).r}</div></div>`}
}
$('#startBtn').onclick=()=>{if(team.length===pickN){vsMode==='duel'?dReady(team.slice()):vsMode==='online'?joinQueue(team.slice()):startBattle(team.slice())}};
let vsMode='bot';$('#modeBot').onclick=()=>{sfx.click();vsMode='bot';show('size')};$('#modePlayer').onclick=()=>{sfx.click();vsMode='online';show('size')};
$('#sizeQuick').onclick=()=>{sfx.click();pickN=1;show('select')};$('#sizeFull').onclick=()=>{sfx.click();pickN=3;show('select')};

const TXT=[{n:'Slow',c:38,h:1.7},{n:'Normal',c:26,h:1.2},{n:'Fast',c:14,h:.7}];let ti=S.speed;
let B=null,skipText=false;
const fighter=m=>({m,hp:m.hp,max:m.hp,skip:null,restricted:false,guard:null,cds:new Map(),burned:new Set(),rand:null,hideHp:0,extra:false,gone:false});
const sideOf=f=>f===B.p?'p':'e';
$('#msg').onclick=()=>{skipText=true};
async function say(text,hold=750,cls=''){
  ACT=Date.now();
  if(typeof B!=='undefined'&&B&&B.p&&!B.over&&!B.spec&&B.p.rand==='blind')text='. . .';
  const el=$('#msg');el.className=cls;el.textContent='';if(FAST){el.textContent=text;return}
  for(let i=0;i<text.length;i++){if(skipText){el.textContent=text;break}el.textContent+=text[i];if(S.type&&i%2===0)sfx.type();await sleep(TXT[ti].c)}
  for(let t=0;t<hold*TXT[ti].h&&!skipText;t+=50)await sleep(50);
  skipText=false;
}
function setMsg(t){$('#msg').className='';$('#msg').textContent=t}
function anim(el,cls,ms){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);return sleep(ms).then(()=>el.classList.remove(cls))}
function floatText(side,text,color){if(FAST)return;
  const f=$('#'+side+'F'),a=$('#arena'),r=f.getBoundingClientRect(),ar=a.getBoundingClientRect();
  const d=document.createElement('div');d.className='float';d.textContent=text;d.style.color=color;
  d.style.left=(r.left-ar.left+r.width/2-20)+'px';d.style.top=(r.top-ar.top+10)+'px';a.appendChild(d);setTimeout(()=>d.remove(),1000);
}
function burst(side,key,n=6){if(!S.fx||FAST)return;const f=$('#'+side+'F'),a=$('#arena'),r=f.getBoundingClientRect(),ar=a.getBoundingClientRect();for(let i=0;i<n;i++){const e=document.createElement('img');e.src=ITEMS[key]||'assets/mc/'+key+'.png';e.className='fx';e.style.left=(r.left-ar.left+r.width/2-12)+'px';e.style.top=(r.top-ar.top+r.height/2-12)+'px';e.style.setProperty('--dx',(Math.random()*160-80)+'px');e.style.setProperty('--dy',(Math.random()*-120-10)+'px');e.style.setProperty('--r',(Math.random()*540-270)+'deg');a.appendChild(e);setTimeout(()=>e.remove(),900)}}
const shake=()=>S.shake?anim($('#arena'),'shake',350):0;
function updBox(side){
  const f=B[side],pct=Math.max(0,f.hp/f.max*100),cls=pct<=25?'low':pct<=50?'mid':'';
  $('#'+side+'Box').innerHTML=`<div class="nm"><span>${esc(f.m.name)}</span><span>${B.spec?esc(side==='p'?B.watching:B.opp.name):side==='p'?'YOU':'FOE'}</span></div><div style="margin-top:4px">${badges(f.m)}</div><div class="hpline"><img src="assets/mc/${f.pois>0?'poisoned_full':'full'}.png" style="width:18px;height:18px;image-rendering:pixelated"><div class="hpbar"><div class="hpfill ${cls}" style="width:${Math.min(100,pct)}%"></div></div></div><div class="hpnum">${Math.max(0,f.hp)}/${f.max}</div><div class="pips">${(()=>{const t=side==='p'?B.pt:B.et,n=t.filter(x=>x!==f&&x.hp>0&&!x.gone).length;return '<i></i>'.repeat(n)})()}</div>`;
}
const SW_WAIT=3;
function swInfo(){if(!B)return'';if(B.swUsed)return'You already used your one switch this match.';const n=SW_WAIT-(B.rounds||0);return n>0?`Switching unlocks after round ${SW_WAIT}. ${n} more round${n>1?'s':''} to go.`:'Swap in another member. You can only switch once per match. It uses your turn, so the foe moves first.'}
function swUpd(){const bt=$('#swBtn');if(!bt)return;const ok=!!(B&&!B.spec&&!B.over&&B.pt&&B.pt.length>1);bt.style.display=ok?'':'none';if(!ok)return;
  const n=SW_WAIT-(B.rounds||0),locked=!!B.swUsed||n>0;
  bt.disabled=locked||!!B.busy||!!B.choosing||!B.pt.some(x=>x!==B.p&&!x.gone&&x.hp>0)||(B.online&&!B.pick);
  bt.title=swInfo()}
async function swapIn(f,idx){
  const s=sideOf(f),team=f===B.p?B.pt:B.et,tgt=team[idx];if(!tgt||tgt===f||tgt.gone||tgt.hp<=0)return;
  f.guard=null;f.rand=null;
  await say(`${f.m.name} is switched out!`,400);await fxS(s,'chase:Helppp!!');
  tgt.skip=null;tgt.guard=null;tgt.rand=null;B[s]=tgt;if(s==='p'&&!B.spec)renderMoves();
  const el=$('#'+s+'F');el.getAnimations().forEach(a=>a.cancel());el.className='fighter '+(s==='p'?'slideinP':'slidein');el.innerHTML=sprite(tgt.m,s==='p');updBox(s);applyView();sfx.heal();
  await say(`${tgt.m.name} takes over!`,600);
}
async function doSwitch(){
  if(!B||B.busy||B.over||B.spec)return;
  if(B.swUsed||(B.rounds||0)<SW_WAIT)return;
  if(B.online&&!B.pick)return;
  const cands=B.pt.filter(x=>x!==B.p&&!x.gone&&x.hp>0);if(!cands.length)return;
  const b=B,ep=EP;B.busy=true;renderMoves();
  const tgt=await chooseNext(cands,false,true);
  if(b!==B||ep!==EP||B.over)return;
  if(!tgt){B.busy=false;B.choosing=false;idle();return}
  const idx=B.pt.indexOf(tgt);B.swUsed=true;tgt.rand=null;renderMoves(tgt);$('#info').textContent='';
  if(B.online){const r=B.pick;B.pick=null;B.swSel=idx;B.busy=true;renderMoves(tgt);r(-1);return}
  try{
    const seed=Math.floor(Math.random()*4294967296);rnd=mul(seed);
    if(B.log)logM({t:'mv',i:-1,seed,sw:idx});
    await swapIn(B.p,idx);B.e.guard=null;
    await afterPlayer();
  }catch(err){console.error(err);if(b===B&&ep===EP&&!B.over)await unstick()}
}
$('#swBtn').onclick=()=>{sfx.click();doSwitch()};
$('#swBtn').onmouseenter=()=>{$('#info').textContent=swInfo()};
function renderMoves(P0){
  swUpd();
  if(B.choosing)return;
  const P=P0||B.p,none=P.m.moves.every(m=>onCd(P,m)),hide=P.rand==='blind'||P.rand==='scramble'||P.rand==='confuse';
  if(B.story&&!hide){$('#moves').innerHTML=P.m.moves.map((m,i)=>{const cd=onCd(P,m),dis=B.busy||B.over||(!none&&cd);return `<button class="btn mvs" data-i="${i}" ${dis?'disabled':''}>${m.ic?`<img src="${m.ic}" alt="">`:''}<span><b>${i+1}. ${esc(m.n)}</b>${cd?` <i>(${P.burned.has(m)?'burned ':'cooldown '}${P.cds.get(m)})</i>`:''}<small>${esc(m.d||'')}</small></span></button>`}).join('');$$('#moves .btn').forEach(b=>{b.onclick=()=>playRound(+b.dataset.i)});return}
  $('#moves').innerHTML=P.m.moves.map((m,i)=>`<button class="btn" data-i="${i}" ${B.busy||B.over||(!hide&&!none&&onCd(P,m))?'disabled':''}>${i+1}. ${hide?'???':esc(m.n)}${(!hide&&onCd(P,m))?(P.burned.has(m)?' (burned '+P.cds.get(m)+')':' (cooldown '+P.cds.get(m)+')'):''}</button>`).join('');
  $$('#moves .btn').forEach(b=>{const m=P.m.moves[b.dataset.i];b.onclick=()=>playRound(+b.dataset.i);b.onmouseenter=b.onfocus=()=>{$('#info').textContent=hide?'???':P.rand==='confuse'?'You are confused: a random move will be used.':m.d}});
}
function startBattle(team,opt){opt=opt||{};EP++;$('#screen-battle').classList.remove('blind','nohp');
  const pm=team[0],pool=MONS.filter(m=>!team.includes(m)),et=[];while(et.length<team.length)et.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  if(opt.foe){et.length=0;opt.foe.forEach(f=>et.push(f))}
  const om=et[0];rnd=Math.random;
  B={team,pt:team.map(fighter),et:et.map(fighter),rounds:0,swUsed:false,busy:true,over:false,kind:'bot',log:[],specs:[],opp:{name:'Bot'},specInfo:{host:false,me:{ids:team.map(m=>m.id),u:pubSafe()},opp:{ids:et.map(m=>m.id),u:{name:'Bot',bio:'',pfp:''}}}};B.p=B.pt[0];B.e=B.et[0];if(opt.foe)B.story=opt;gl(' Give up');applyView();
  const d=opt.foe?null:myData();if(d){d.picks=d.picks||{};team.forEach(t=>d.picks[t.id]=(d.picks[t.id]||0)+1);const u=getUsers();u[me.key]=d;putUsers(u)}
  show('battle');$('#result').classList.remove('on');
  $('#pF').innerHTML=sprite(pm,true)+(opt.partner?sprite(opt.partner,true).replace('class="sp"','class="sp ally" style="position:absolute;left:62%;bottom:0;width:100%;height:100%"'):'');$('#eF').innerHTML=sprite(om);
  $('#pF').className='fighter slideinP';$('#eF').className='fighter slidein';
  updBox('p');updBox('e');$('#info').textContent=matchMedia('(pointer:coarse)').matches?'Tap a move to attack. Tap the text box to speed it up.':'Tip: press 1-4 to pick a move. Click the text box to speed it up.';renderMoves();
  (async()=>{const b=B,ep=EP;try{if(opt.foe){await say(opt.intro||`${esc(om.name)} blocks your path!`);await say(`Go, ${pm.name}!`,400);if(opt.partner)await say(`${opt.partner.name} stands beside you and fights at your side!`,400)}else{await say(`${esc(me.name)} challenges you! ${om.name} leads the foe's team!`);await say(`Go, ${pm.name}!`,400)}if(!(await foeTurn())){B.busy=false;idle()}}catch(err){console.error(err);if(b===B&&ep===EP&&!B.over)await unstick()}})();
}
function idle(){
  const p=B.p;applyView();
  setMsg(p.rand==='blind'?`${p.m.name} can't see anything! Only something random can be picked.`:p.rand==='scramble'?`${p.m.name}'s abilities are scrambled! Pick blindly.`:p.rand==='confuse'?`${p.m.name} is confused! A random move will be used.`:`What will ${p.m.name} do?`);renderMoves();
}
document.addEventListener('keydown',e=>{if(!$('#screen-battle').classList.contains('active')||!B||B.busy||B.over)return;if(e.key==='s'||e.key==='S'||e.key==='5'){const w=$('#swBtn');if(w&&w.style.display!=='none'&&!w.disabled)w.click();return}const i=+e.key-1;if(i>=0&&i<4){const b=$$('#moves .btn')[i];if(b&&!b.disabled)b.click()}});
function cpuChoose(){
  const E=B.e;let mv=E.m.moves.filter(m=>!onCd(E,m));if(!mv.length)mv=E.m.moves.slice();
  if(E.rand)return mv[Math.floor(Math.random()*mv.length)];
  const low=E.hp<E.max*.4,hasHelp=(B.et).some(x=>x!==E&&!x.gone),w=mv.map(m=>{let x=1;if(m.dmg)x+=m.dmg*(m.hits||1)/12;if(m.rdmg)x+=1.3;if(m.heal&&!m.dmg)x+=low?2.5:(E.hp>E.max*.8?-.8:.3);if(m.guard)x=.9+(m.heal&&low?1.2:0);if(m.skipSelf)x*=.5;if(m.distract)x+=.3;if(m.blind||m.scramble||m.confuse||m.burn||m.hideHp)x+=.6;if(m.special==='mission')x=1.2;if(m.special==='helppp')x=hasHelp&&E.hp<E.max*.35?2:.1;return Math.max(.1,x)});
  let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<mv.length;i++){r-=w[i];if(r<=0)return mv[i]}return mv[0];
}
const DODGE=.05;
const GUARD_MSG={reflect:n=>`${n} creates a dome around themselves!`,block:n=>`${n} braces to block the next move!`,blockatk:n=>`${n} gets ready to block the next attack!`,dodge:n=>`${n} gets ready to dodge!`,tank:n=>`${n} prepares to tank the hit!`,run:n=>`${n} starts running away!`,dumb:n=>`${n} acts dumb... incoming attacks will be weaker!`};
async function botAct(f,o,mv,idx){
  const seed=Math.floor(Math.random()*4294967296);rnd=mul(seed);
  const i=idx!=null?idx:f.m.moves.indexOf(mv),ent={t:'mv',i,seed};
  if(B.log){if(!f.skip&&mv.special==='helppp')B.pendLog=ent;else logM(ent)}
  await act({f,o,mv});
  if(B.pendLog){const e=B.pendLog;B.pendLog=null;logM(e)}
}
async function foeTurn(){
  let again;
  do{
    const E=B.e,P=B.p,em=cpuChoose();
    const sk=!!E.skip;await botAct(E,P,em);P.guard=null;again=!!E.extra;E.extra=false;endTurn(E,em,sk);
    if(B.p.hp<=0||B.e.hp<=0)return await faintFlow();
  }while(again);
  return false;
}
async function playRound(pi){const b=B,ep=EP;try{await playRound0(pi)}catch(err){console.error(err);if(b===B&&ep===EP&&!B.over&&!B.online)await unstick()}}
async function unstick(){try{if(B.p.hp<=0||B.e.hp<=0){if(await faintFlow())return}}catch(e){console.error(e)}if(!B.over){B.busy=false;B.choosing=false;idle()}}
async function playRound0(pi){
  if(B.online){if(B.pick&&!B.busy){const r=B.pick;B.pick=null;B.busy=true;renderMoves();r(pi)}return}
  if(B.busy||B.over)return;B.busy=true;renderMoves();
  const P=B.p,E=B.e,idx=resolveIdx(P,pi),pm=P.m.moves[idx];
  if(pm.special==='helppp'){const c=B.pt.filter(x=>x!==P&&!x.gone);if(c.length){const t=await chooseNext(c,true,true);B.choosing=false;if(!t){B.busy=false;idle();return}B.helpPre=t}}
  const pt=B.story&&B.story.partner;if(pt)partnerLunge();
  await botAct(P,E,pm,idx);E.guard=null;const ex=P.extra;P.extra=false;endTurn(P,pm,false);
  if(pt&&E.hp>0&&P.hp>0)await partnerStrike(pt,E);
  if(B.p.hp<=0||B.e.hp<=0){if(await faintFlow())return}
  if(ex){B.busy=false;idle();return}
  await afterPlayer();
}
function partnerLunge(){const a=document.querySelector('#pF .sp.ally');if(a)a.animate([{transform:'none'},{transform:'translateX(70px) rotate(6deg)',offset:.4},{transform:'none'}],{duration:650})}
async function partnerStrike(pt,E){
  const mvs=pt.moves.filter(m=>m.dmg),mv=mvs.length?mvs[Math.floor(Math.random()*mvs.length)]:null;if(!mv)return;
  const guarded=E.guard==='dodge'||E.guard==='blockatk'||E.guard==='block'||E.guard==='reflect';
  if(guarded){await say(`${pt.name} strikes at the same time, but the foe guarded!`,500);return}
  const d=Math.max(1,Math.round(mv.dmg*(mv.hits||1)*.6));sfx.hit();E.hp=Math.max(0,E.hp-d);if(E.m.flee&&E.hp<=E.max*.28){E.hp=0;E.fled=true}updBox('e');floatText('e','-'+d,'#ff5050');await anim($('#eF'),'hit',450);
  E.killer=pt.name;E.deathMsg=`{v} was cut down by ${pt.name}`;await say(`${pt.name} strikes at the same time for ${d} damage!`,500)}
async function afterPlayer(){
  if(await foeTurn())return;
  while(B.p.skip){
    const P2=B.p,E2=B.e;await botAct(P2,E2,P2.m.moves[0],0);E2.guard=null;endTurn(P2,null,true);
    if(B.p.hp<=0||B.e.hp<=0){if(await faintFlow())return}
    if(await foeTurn())return;
  }
  B.busy=false;idle();
}
async function act({f,o,mv}){
  if(f.skip){const why=f.skip;f.skip=null;await say(why==='distracted'?`${f.m.name} is distracted and can't move!`:`${f.m.name} has to skip this turn!`);return}
  await say(`${f.m.name} used ${mv.n}!`,350);
  await exec(f,o,mv);
}
async function helppp(f,o){
  const fs=sideOf(f),fn=f.m.name,team=f===B.p?B.pt:B.et,cands=team.filter(x=>x!==f&&!x.gone);
  await say(`${fn} calls out: Helppp!!`,500);
  if(!cands.length){await say('But nobody is left to help!');return}
  let tgt;
  if(B.online)tgt=team[B.helpSel];else if(B.helpPre){tgt=B.helpPre;B.helpPre=null}else if(f===B.p)tgt=await chooseNext(cands,true);else tgt=pickR(cands);
  if(!tgt||tgt===f||tgt.gone)tgt=cands[0];
  if(B.pendLog){B.pendLog.sw=team.indexOf(tgt);const e=B.pendLog;B.pendLog=null;logM(e)}
  let msg;
  if(tgt.hp<=0){tgt.hp=Math.ceil(tgt.max/2);msg=`${tgt.m.name} was brought back to life with half health!`}
  else{tgt.hp=Math.round(tgt.hp*1.25);tgt.max=Math.max(tgt.max,tgt.hp);msg=`${tgt.m.name} arrives with 1.25x health!`}
  tgt.skip=null;tgt.guard=null;tgt.rand=null;
  f.gone=true;f.hp=0;
  B[fs]=tgt;if(fs==='p'&&!B.spec)renderMoves();const el=$('#'+fs+'F');el.getAnimations().forEach(a=>a.cancel());el.className='fighter '+(fs==='p'?'slideinP':'slidein');el.innerHTML=sprite(tgt.m,fs==='p');updBox(fs);applyView();
  sfx.heal();burst(fs,'apple',6);
  await say(`${fn} left the battle and ${tgt.m.name} takes over!`,600);
  await say(msg,600);
  f.extra=true;
}
async function healSelf(f,fs,fe,fn,K,amt){await fxS(fs,K);f.hp+=amt;if(f.hp>f.max)f.max=f.hp;updBox(fs);sfx.heal();burst(fs,'apple',3);burst(fs,'heart',7);floatText(fs,'+'+amt,'#6f6');await anim(fe,'glow',700);await say(`${fn} restored ${amt} HP!`,500)}


/* ===== MOVE SOUNDS =====
 MSFX['characterId:Move Name'] = [['soundFile', delayMs], ...]  (files in assets/sounds/, no .mp3). They play when the move starts and do NOT block the turn.
 Add a line here to give any move a sound. Moves with no entry use the category fallback (guards -> shield, heals -> xp orb). */
const MSFX={
'nukoz:Tempest':[['mace_slam',0]],'nukoz:Master Duper Double Mace':[['mace_hit',0],['mace_hit',0]],'nukoz:Catboy':[['sword_swing',0]],
'mlvlnt:Chestplate':[['mace_slam',0]],'mlvlnt:PvP':[['sword_swing',0]],
'kneervous:Mace':[['mace_hit',0]],'kneervous:Elytra Mace':[['mace_hit',0]],
'chase:OHHH NUKOZZZZ!!!':[['mace_hit',0]],'chase:I Am A Chud':[],'chase:Helppp!!':[['ender_pearl',0]],
'burg:Burger':[['splash',0]],'burg:Execute':[['sword_swing',0]],
'bruce:Ban Hammer':[['anvil',0]],'bruce:Scratch':[['sword_swing',0]],'bruce:Hacker':[['splash',0]],
'sora:Bridge':[['anvil',0]],'sora:Crashout':[['fire_charge',0]],'sora:Gate of Babalon':[['bow',0]],
'voidrisez:Crashout':[['fire_charge',0]],'voidrisez:Ragebait':[['splash',0]],
'etrosion:Trident':[['trident_throw',0],['trident_stab',0]],
'mikeanike:Trains':[['minecart',0]]};
const MSFX_GUARD=[['shield_block',0]],MSFX_HEAL=[['xp_orb',0]];
let LONGA=null,VEP=0;const SND=new Set();
function stopLong(){if(LONGA){try{LONGA.pause()}catch(e){}LONGA=null}}
function stopAllSounds(){VEP++;SND.forEach(f=>{try{f()}catch(e){}});SND.clear();stopLong()}
function playSnd(n,long){if(muted||FAST)return;try{const a=new Audio('assets/sounds/'+n+'.mp3');a.volume=Math.min(1,S.vol*S.sfx);if(long){stopLong();LONGA=a}const _f=()=>a.pause();SND.add(_f);a.addEventListener('ended',()=>SND.delete(_f));a.play().catch(()=>{})}catch(e){}}
const LAUNCH=['trident_throw'];
function hitSfx(K,mv,h){if(muted||FAST)return;const l=(MSFX[K]||[]).filter(x=>!LAUNCH.includes(x[0]));if(l.length)playSnd(l[h%l.length][0])}
function moveSfx(K,mv){if(muted||FAST)return;let l=MSFX[K]||(mv.guard?MSFX_GUARD:mv.heal?MSFX_HEAL:null);if(!l)return;if(mv.dmg||mv.rdmg)l=l.filter(x=>LAUNCH.includes(x[0]));l.forEach(([n,d])=>{const v=VEP;d?setTimeout(()=>{if(v===VEP)playSnd(n)},d):playSnd(n)})}
/* ===== VOICELINES =====
 Folder per character: VOICE_DIR[characterId] -> assets/voicelines/<folder>/
 VL['characterId:Move Name'] = ['file','fileAfter']  (file names without .mp3)
 The 1st file plays, then the 2nd plays VL_GAP ms after the 1st ends. The move waits for all of them.
 To add more later: drop the mp3 in the character's folder and add one line to VL (new characters: add VOICE_DIR too). */
const VL_GAP=500; // pause between a line and its 'after' line
const VOICE_DIR={bruce:'Brucel',voidrisez:'Voidl',burg:'burgl',chase:'chase',etrosion:'etrosionl',mlvlnt:'m7l',sora:'soral'};
const VL={
'bruce:9 Lifes':['9lifes'],'bruce:Ban Hammer':['banhammer'],'bruce:Hacker':['hacker'],'bruce:Scratch':['scratch'],
'voidrisez:Crashout':['crashout'],'voidrisez:Leave':['leave'],'voidrisez:Nilli':['nilli'],'voidrisez:Ragebait':['ragebait'],
'burg:Burger':['Burger'],'burg:Execute':['Execute'],'burg:Lock In':['Lock in'],'burg:Eating':['eating'],
'chase:I Am A Chud':['ima chud'],
'etrosion:It was kinda like destiny':['destiny'],'etrosion:Honor':['honor'],'etrosion:Subscribe':['subscribe'],'etrosion:Trident':['trident'],
'mlvlnt:Aura':['aura'],'mlvlnt:Chestplate':['Chestplate'],'mlvlnt:PvP':['Pvp'],'mlvlnt:Mysterious':['mysterious'],
'sora:Bridge':['Bridge'],'sora:Crashout':['Crashout'],'sora:Dome':['dome'],'sora:Gate of Babalon':['gate of babalon']};
/* Voice playback: lines are preloaded + decoded once (WebAudio) so they start instantly and can't be dropped by autoplay/network hiccups.
   If WebAudio/fetch isn't available it falls back to a normal <audio> element (with one retry). */
const VBUF={},VPEND={};
function vlLoad(url){if(VBUF[url])return Promise.resolve(VBUF[url]);if(VPEND[url])return VPEND[url];
  return VPEND[url]=fetch(url).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(ab=>new Promise((ok,no)=>{const p=ctx().decodeAudioData(ab,ok,no);if(p&&p.catch)p.catch(no)})).then(b=>VBUF[url]=b).catch(()=>{delete VPEND[url];return null})}
function vlPreload(){for(const k in VL){const d=VOICE_DIR[k.split(':')[0]];if(d)VL[k].forEach(f=>vlLoad(vlUrl(d,f)))}}
const vlUrl=(d,f)=>encodeURI('assets/voicelines/'+d+'/'+f+'.mp3');
(()=>{const go=()=>{document.removeEventListener('pointerdown',go,true);document.removeEventListener('keydown',go,true);try{ctx();vlPreload()}catch(e){}};document.addEventListener('pointerdown',go,true);document.addEventListener('keydown',go,true)})();
async function playBuf(buf,ep){
  let c;try{c=ctx();if(c.state!=='running')await Promise.race([c.resume(),new Promise(r=>setTimeout(r,400))]);if(c.state!=='running')return false}catch(e){return false}
  return new Promise(res=>{try{const s=c.createBufferSource(),g=c.createGain();s.buffer=buf;g.gain.value=Math.min(1,S.vol*S.voice);s.connect(g);g.connect(c.destination);
    let done=false,iv,to;const end=()=>{if(done)return;done=true;SND.delete(end);clearInterval(iv);clearTimeout(to);try{s.stop()}catch(e){}try{s.disconnect();g.disconnect()}catch(e){}res(true)};
    SND.add(end);s.onended=end;iv=setInterval(()=>{if(ep!==EP||FAST)end()},100);to=setTimeout(end,buf.duration*1000+2000);s.start()}catch(e){res(false)}})}
function playEl(url,retry=1){return new Promise(res=>{const ep=EP;let done=false,iv,to;const a=new Audio(url);a.preload='auto';a.volume=Math.min(1,S.vol*S.voice);
  const end=()=>{if(done)return;SND.delete(end);done=true;clearInterval(iv);clearTimeout(to);try{a.pause()}catch(e){}res()};
  SND.add(end);a.addEventListener('ended',end);a.addEventListener('error',end);
  iv=setInterval(()=>{if(ep!==EP||FAST)end()},100);to=setTimeout(end,15000);
  a.play().catch(()=>{if(retry>0&&!done&&ep===EP){setTimeout(()=>{if(done)return;a.play().catch(end)},250);retry--}else end()})})}
async function playVL(url){const ep=EP,vp=VEP;
  const buf=await Promise.race([vlLoad(url),new Promise(r=>setTimeout(()=>r(null),5000))]);
  if(ep!==EP||vp!==VEP||FAST||muted)return;
  if(buf&&await playBuf(buf,ep))return;
  if(ep!==EP||vp!==VEP||FAST||muted)return;
  await playEl(url)}
async function voice(K){if(FAST||muted||!(S.voice>0))return;const l=VL[K],d=VOICE_DIR[K.split(':')[0]];if(!l||!d)return;const ep=EP,vp=VEP;
  for(let i=0;i<l.length;i++){if(i)await new Promise(r=>setTimeout(r,VL_GAP));if(ep!==EP||vp!==VEP||FAST)return;await playVL(vlUrl(d,l[i]))}}
async function exec(f,o,mv){
  const fs=sideOf(f),os=sideOf(o),fn=f.m.name,on=o.m.name,fe=$('#'+fs+'F'),oe=$('#'+os+'F'),K=(mv._from||f.m).id+':'+mv.n;
  await voice(K);moveSfx(K,mv);
  if(mv.special==='mysterious'){await fxS(fs,'mlvlnt:Aura');
    const other=pickR(MONS.filter(x=>x!==f.m)),m2=pickR(other.moves.filter(x=>x.special!=='mysterious'&&!x.noCopy));
    await say(`It's a mystery... ${fn} copied ${other.name}'s ${m2.n}!`,500);
    return exec(f,o,{...m2,_from:other,_myst:true});
  }
  if(mv.guard){f.guard=mv.guard;sfx.guard();fxG(fs,K);anim(fe,'shield',700);await say(K==='voidrisez:Nilli'?`${fn} scripted a dodge!`:GUARD_MSG[mv.guard](fn));if(mv.heal)await healSelf(f,fs,fe,fn,K,mv.heal);return}
  if(mv.special==='helppp'){await fxS(fs,K);await helppp(f,o);return}
  if(mv.special==='mission'){
    await fxS(fs,K);f.cds.clear();f.burned.clear();f.extra=true;sfx.heal();burst(fs,'diamond',8);await anim(fe,'glow',700);
    await say(`${fn} sends ${on} on a mission! All cooldowns are off and ${fn} gets another turn!`,700);return;
  }
  let dmg=mv.dmg||0,bonusMsg=null;
  if(mv.rdmg){dmg=rnd()<mv.rdmg[0]?mv.rdmg[1]:mv.rdmg[2];if(dmg===mv.rdmg[1])bonusMsg='The burger was extra poisonous!'}
  if(mv.special==='trident'&&rnd()<.5){dmg+=5;bonusMsg='The trident came back around for 5 more!'}
  const hitsN=mv.hits||1;
  const targeted=dmg>0||!!(mv.distract||mv.blind||mv.scramble||mv.confuse||mv.burn||mv.hideHp);
  const refl=o.guard==='reflect'&&targeted;
  const negated=o.guard==='block'||refl||(targeted&&(o.guard==='dodge'||o.guard==='blockatk'));
    const dodged=!negated&&dmg>0&&rnd()<DODGE;
  if(targeted){sfx.whoosh();if(!(await fxA(fs,os,K,o)))await anim(fe,'lunge'+fs.toUpperCase(),400)}
  if(refl){
    sfx.guard();anim(oe,'shield',600);domeFx(os,900);
    if(dmg>0){
      const rd=Math.max(1,Math.round(dmg*hitsN*matchup((mv._from||f.m).id,o.m.id)));
      await say(`${on}'s dome reflected the attack!`,500);
      sfx.hit();burst(fs,'diamond',6);shake();f.hp=Math.max(0,f.hp-rd);f.killer=on;f.deathMsg=`{v} was killed by ${on}'s reflected attack`;updBox(fs);floatText(fs,'-'+rd,'#ff5050');await anim(fe,'hit',450);
      await say(`${fn} took ${rd} damage from its own attack!`,600);
    }else await say(`${on}'s dome blocked the attack!`);
  }else if(negated||dodged){
    sfx.guard();anim(oe,'shield',600);if(o.guard==='dodge')fxD(os);else if(dodged)fxD(os,true);
    await say(o.guard==='dodge'||dodged?`${on} dodged the attack!`:(targeted?`${on} blocked the attack!`:`${on} blocked the move!`));
  }else{
    for(let h=0;h<hitsN&&dmg>0&&o.hp>0;h++){
      const m=matchup((mv._from||f.m).id,o.m.id);let d=dmg*m;
      let crit=rnd()<1/16;if(crit)d*=1.5;
      if(o.guard)d*=(GUARD_MULT[o.guard]??1);
      d=Math.max(1,hitsN>1?(h===0?Math.ceil(d):Math.floor(d)):Math.round(d));
      const sp=FXS[K],it=sp&&sp.i&&sp.i!=='pot'?sp.i:FXM[mv.n]||'diamond_sword';if(!sp)await proj(fs,os,it);hitSfx(K,mv,h);sfx.hit();burst(os,crit?'diamond':it,crit?10:6);shake();o.hp=Math.max(0,o.hp-d);o.killer=fn;o.deathMsg=(mv._myst?'{v} was mysteriously killed by {k}':(mv.k||'{v} was slain by {k}')).replace('{k}',fn);if(o.m.pop)o.deathMsg='{v} was popped by '+fn;if(o.m.flee&&o.hp<=o.max*.28){o.hp=0;o.fled=true;o.deathMsg='{v} escapes in a burst of smoke!'}updBox(os);floatText(os,'-'+d,'#ff5050');await anim(oe,'hit',450);
      if(h===0&&bonusMsg)await say(bonusMsg,600);
      if(o.guard==='tank')await say(`${on} tanked the hit!`,500);
      else if(o.guard==='run')await say(`${on} ran and took much less damage!`,500);
      else if(o.guard==='dumb')await say(`The attack was dumbed down!`,500);
      if(crit)await say('A critical hit!',500);
      if(h===0){if(m>1)await say("It's super effective!",500);else if(m<1)await say("It's not very effective...",500)}
    }
    if(o.hp>0){
      if(mv.n==='Burger'){o.pois=3;updBox(os)}if(mv.distract){o.skip='distracted';await say(`${on} is distracted and will lose their turn!`,500)}
      if(mv.blind){sfx.hit();await anim(oe,'hit',450);await say(`${on} was blinded! They can't see health, abilities or what is happening next turn!`,700);o.rand='blind';applyView()}
      if(mv.scramble){sfx.hit();await anim(oe,'hit',450);await say(`${on}'s abilities were scrambled! They won't know what they are using next turn!`,700);o.rand='scramble'}
      if(mv.confuse){await proj(fs,os,'ender_pearl');sfx.hit();await anim(oe,'hit',450);await say(`${on} is confused and will use a random move next turn!`,700);o.rand='confuse'}
      if(mv.hideHp){o.hideHp=3;applyView();await say(`${on} can't see the health bars for 3 rounds!`,700)}
      if(mv.burn){
        const av=o.m.moves.filter(x=>!onCd(o,x));
        if(av.length>1){const b=pickR(av);o.cds.set(b,2);o.burned.add(b);if(o.m.moves.every(x=>onCd(o,x))){const w=weakest(o.m.moves);o.cds.delete(w);o.burned.delete(w)}sfx.hit();await anim(oe,'hit',450);await say(`${on}'s ${b.n} was burned and can't be used for 2 rounds!`,700)}
        else await say('But it had nothing left to burn!',500);
      }
    }
    if(mv.poison)0;if(mv.heal)await healSelf(f,fs,fe,fn,K,mv.heal);
  }
  if(mv.self&&o.hp>0&&f.hp>0){f.hp=Math.max(1,f.hp-mv.self);updBox(fs);floatText(fs,'-'+mv.self,'#ff9050');await anim(fe,'hit',450);await say(`${fn} hurt itself for ${mv.self}!`,500)}
  if(mv.skipSelf){f.skip='recharge';await say(`${fn} will skip its next turn!`,500)}
}
function puff(side){if(FAST)return;const f=$('#'+side+'F'),a=$('#arena'),r=f.getBoundingClientRect(),ar=a.getBoundingClientRect();for(let i=0;i<18;i++){const e=document.createElement('div');e.className='puff';const z=8+Math.random()*12;e.style.cssText=`width:${z}px;height:${z}px;left:${r.left-ar.left+Math.random()*r.width}px;top:${r.top-ar.top+r.height*(.3+Math.random()*.6)}px;animation-delay:${Math.random()*.7}s`;a.appendChild(e);setTimeout(()=>e.remove(),1900)}}
function chooseNext(left,help,cancel){return new Promise(res=>{B.choosing=true;setMsg(help?'Who should take over for Chase? (a KO member is revived at half health)':cancel?'Who do you want to switch in? It uses your turn!':'Choose your next member!');$('#moves').innerHTML=left.map((f,i)=>`<button class="btn" data-i="${i}" style="text-align:center">${sprite(f.m,false).replace('class="sp"','class="sp" style="width:72px;height:72px;margin:0 auto 4px"')}${esc(f.m.name)}<br><span class="muted">${f.hp<=0?'KO: revives':'HP '+f.hp+'/'+f.max}</span></button>`).join('');$('#info').textContent='';$$('#moves .btn').forEach(b=>b.onclick=()=>{sfx.click();B.choosing=false;res(left[b.dataset.i])});if(cancel){const x=document.createElement('button');x.className='btn grey';x.style.textAlign='center';x.textContent='Cancel';x.onclick=()=>{sfx.click();B.choosing=false;res(null)};$('#moves').appendChild(x)}})}
function zap(side){if(FAST)return;const a=$('#arena'),f=$('#'+side+'F'),r=f.getBoundingClientRect(),ar=a.getBoundingClientRect();
  const fl=document.createElement('div');fl.style.cssText='position:absolute;inset:0;background:#fff;opacity:.85;pointer-events:none;z-index:50;transition:opacity .35s ease-out';a.appendChild(fl);requestAnimationFrame(()=>requestAnimationFrame(()=>fl.style.opacity='0'));setTimeout(()=>fl.remove(),500);
  const x=r.left-ar.left+r.width/2,b=document.createElementNS('http://www.w3.org/2000/svg','svg');b.setAttribute('viewBox','0 0 40 100');b.style.cssText=`position:absolute;left:${x-30}px;top:0;width:60px;height:${r.top-ar.top+r.height*.6}px;z-index:51;pointer-events:none;filter:drop-shadow(0 0 6px #9cf);transition:opacity .3s .1s`;b.setAttribute('preserveAspectRatio','none');b.innerHTML='<polyline points="22,0 12,30 24,34 8,62 20,66 14,100" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="miter"/>';a.appendChild(b);requestAnimationFrame(()=>requestAnimationFrame(()=>b.style.opacity='0'));setTimeout(()=>b.remove(),500);if(typeof shake==='function')shake()}
async function faintFlow(){
  const lost=B.p.hp<=0?'p':'e',fl=B[lost],tm=lost==='p'?B.pt:B.et;
  sfx.faint();await sleep(120);if(fl.m.pop){try{burst(lost,'totem',14)}catch(e){}}else if(!fl.fled)zap(lost);$('#'+lost+'F').classList.add('faint');puff(lost);updBox(lost);await sleep(250);{const el=$('#msg'),n=esc(fl.m.name);el.className='mc';el.innerHTML=`${esc((fl.deathMsg||'{v} was slain by the void').replace('{v}',fl.m.name))}<br><span style="color:#ff5">${fl.fled?n+' ran away!':fl.m.pop?n+' popped!':n+' left the game'}</span>`;for(let t=0;t<2200&&!skipText;t+=50)await sleep(50);skipText=false}
  const left=tm.filter(x=>x.hp>0);
  if(!left.length){await finish(lost==='e');return true}
  let nx;if(B.online){if(lost==='p'&&!B.spec){nx=left.length===1?left[0]:await chooseNext(left);conn.send({t:'sw',i:B.pt.indexOf(nx)})}else nx=(lost==='p'?B.pt:B.et)[(await recv('sw')).i]}else nx=lost==='e'?(B.story?left[0]:pick(left)):left.length===1?left[0]:await chooseNext(left);
  if(!B.online&&B.log)logM({t:'sw',i:(lost==='p'?B.pt:B.et).indexOf(nx)});
  B[lost]=nx;B[lost].guard=null;if(lost==='p'&&!B.spec)renderMoves();const el=$('#'+lost+'F');el.className='fighter '+(lost==='p'?'slideinP':'slidein');el.innerHTML=sprite(nx.m,lost==='p');updBox(lost);
  await say(lost==='p'?`Go, ${nx.m.name}!`:`The foe sends out ${nx.m.name}!`,500);return false;
}
async function finish(won){
  if(B.story&&window.StoryUI){B.over=true;$('#screen-battle').classList.remove('blind','nohp');won?sfx.win():sfx.lose();return StoryUI.battleEnd(won)}
  B.over=true;$('#screen-battle').classList.remove('blind','nohp');if(B.spec)return specEnd(won?B.watching:B.opp.name);if(D&&B.online&&B.kind!=='queue')D.live=0;$('#rmNote').textContent=D&&D.oppReady?D.opp+' is ready for a rematch!':'';B.specs&&B.specs.forEach(s=>s.send({t:'end',w:won?me.name:B.opp.name}));$('#rematchBtn').style.display='';rec(won);
  const d=myData();
  won?sfx.win():sfx.lose();playSnd(won?'challenge_complete':'wither_death',1);if(won)burst('p','diamond',16);
  $('#resTitle').innerHTML=won?'<img src="assets/gold_block.png" alt="" style="width:36px;height:36px;image-rendering:pixelated;vertical-align:middle"> YOU WIN!':'<img src="assets/skull.png" alt="" style="width:36px;height:36px;image-rendering:pixelated;vertical-align:middle"> YOU LOST';
  $('#changeBtn').style.display=won?'none':'';$('#resTitle').style.color=won?'#2e9d3a':'#c0152a';
  $('#resText').innerHTML=`${esc(won?me.name:(B.online?B.opp.name:'Bot'))} won!`+(won&&d&&ranked()?`<br><br>Win streak: ${d.streak}`:'');
  if(B.online)$('#resText').innerHTML+='<hr>'+card(B.opp);if(B.online&&B.oppLeft){$('#rmNote').textContent=B.opp.name+' left the match';$('#rmNote').style.color='#c0152a';$('#rematchBtn').style.display='none'}else $('#rmNote').style.color='#2e9d3a';$('#result').classList.add('on');renderMoves();
}
$('#rematchBtn').onclick=()=>{if(B.online&&B.kind!=='queue'){if(D&&D.c&&D.c.open&&!D.live){const t=B.team.slice();$('#result').classList.remove('on');vsMode='duel';pickN=D.size===1?1:t.length>1?3:1;show('select');team=t.slice();$$('#pickGrid .tile').forEach(x=>x.classList.toggle('sel',team.includes(byId(x.dataset.id))));dReady(t)}else{const n=B.opp.name.toLowerCase(),k=B.kind;duelSize=B.team.length===1?1:3;closeNet();$('#result').classList.remove('on');duel(n,k)}}else if(B.online){const t=B.team;closeNet();$('#result').classList.remove('on');joinQueue(t)}else startBattle(B.team)};
$('#changeBtn').onclick=()=>{$('#result').classList.remove('on');if(B&&B.online&&B.kind!=='queue'){if(!D||!D.c.open){alert((D?D.opp:'Your friend')+' left the match.');show('menu');return}vsMode='duel'}else if(B&&B.online)vsMode='online';show('select')};
$('#menuBtn').onclick=()=>{leaveSpec();EP++;try{B&&B.spec&&B.c&&B.c.close()}catch(e){}closeNet();$('#result').classList.remove('on');show('menu')};
$('#runBtn').onclick=()=>{if(B&&B.story&&!B.over){if(confirm('Give up this fight?')){EP++;B.over=true;B.busy=true;StoryUI.giveUp()}return}EP++;stopAllSounds();if(B&&B.spec){B.over=true;FAST=false;try{B.c.close()}catch(e){}$('#result').classList.remove('on');show('board');return}if(B&&!B.over&&confirm('Give up? This counts as a loss.')){B.over=true;rec(false);if(!B.online&&B.specs)B.specs.forEach(x=>{try{x.send({t:'end',w:'Bot'})}catch(e){}});if(B.online){B.specs&&B.specs.forEach(s=>s.send({t:'end',w:B.opp.name}));try{conn.send({t:'gu'})}catch(e){}closeNet()}B.over=true;B.busy=true;show('menu')}else if(B&&B.over){closeNet();show('menu')}};

const pfpOf=u=>(u&&u.pfp)||'assets/destiny.png';
function card(u){return `<img class="pfp" src="${pfpOf(u)}" alt=""><h2 style="margin:10px 0">${esc(u.name)}</h2><p>${esc(u.bio||'No bio yet.')}</p>${u.wins!=null?`<div class="statline" style="justify-content:center"><span>Wins <b>${u.wins}</b></span><span>Losses <b>${u.losses}</b></span><span>Best <b>${u.best}</b></span></div>`:''}`}
function viewUser(u){if(!u)return;const k=u.key||u.name.toLowerCase(),d=myData();$('#viewBody').innerHTML=card(u)+(k!==me.key&&d&&!(d.friends||{})[k]?'<p><button class="btn small blue" id="vfAdd">Add friend</button> <span class="err" id="vfMsg"></span></p>':'');show('view');const b=$('#vfAdd');if(b)b.onclick=()=>{upd(x=>{x.reqOut=x.reqOut||{};x.reqOut[k]=u.name});sendReq(k);$('#vfMsg').style.color='#2e9d3a';$('#vfMsg').textContent='Request sent (delivered when they are online)'}}
let newPfp=null;
function renderProfile(){const d=myData();newPfp=null;$('#pfPic').src=pfpOf(d);$('#pfName').value=d.name;$('#pfName').readOnly=cloudOn();$('#pfPass').value='';$('#pfBio').value=d.bio||'';$('#pfErr').textContent=''}
$('#pfFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d'),z=Math.min(im.width,im.height);x.drawImage(im,(im.width-z)/2,(im.height-z)/2,z,z,0,0,96,96);newPfp=c.toDataURL('image/png');$('#pfPic').src=newPfp};im.src=URL.createObjectURL(f)};
$('#pfSave').onclick=async()=>{const er=$('#pfErr');try{const users=getUsers(),d=users[me.key],nm=$('#pfName').value.trim();
  if(!/^[A-Za-z0-9_ ]{3,16}$/.test(nm))throw new Error('Name: 3-16 letters/numbers.');
  const nk=cloudOn()?me.key:nm.toLowerCase();if(cloudOn()&&nm!==d.name)throw new Error('Names cannot be changed on cloud accounts.');if(nk!==me.key&&users[nk])throw new Error('That name is taken.');
  const pw=$('#pfPass').value;if(pw){if(cloudOn()){if(pw.length<6)throw new Error('Password needs 6+ characters.');try{await fauth.currentUser.updatePassword(pw)}catch(e){throw new Error(e.code==='auth/requires-recent-login'?'Log out and back in, then change your password.':'Could not change password.')}}else{if(pw.length<4)throw new Error('Password needs 4+ characters.');d.salt=Math.random().toString(36).slice(2);d.hash=await hashPw(pw,d.salt)}}
  d.name=nm;d.bio=$('#pfBio').value.slice(0,120);if(newPfp)d.pfp=newPfp;
  delete users[me.key];users[nk]=d;putUsers(users);me={key:nk,name:nm};try{localStorage.setItem(SES,nk)}catch(e){}
  er.style.color='#2e9d3a';er.textContent='Saved!'}catch(e){er.style.color='#c0152a';er.textContent=e.message}};


const ADMH='23f317553e2b46aefb1bea9eda975fbef3f3cd0e36c625ad0b53896867ff0daf';
const isAdmin=()=>{try{return !!me&&localStorage.getItem('bpb_admin_'+me.key)==='1'}catch(e){return false}};
async function shaHex(t){if(!(window.crypto&&crypto.subtle))return '';const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function tryUnlock(code){
  if(!me||await shaHex(String(code).trim().toLowerCase())!==ADMH)return false;
  try{localStorage.setItem('bpb_admin_'+me.key,'1')}catch(e){}
  if($('#screen-menu').classList.contains('active'))renderMenu();
  alert('Admin unlocked. Open ADMIN on the main menu.');return true}
let ADMBUF='';
document.addEventListener('keydown',e=>{if(!me||e.key.length!==1)return;const t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;ADMBUF=(ADMBUF+e.key.toLowerCase()).slice(-16);if(ADMBUF.length===16)tryUnlock(ADMBUF)});
{let n=0,tm=0,busy=false;document.addEventListener('click',e=>{const lg=e.target.closest('.screen.active .dlogo');if(!lg||busy)return;n++;clearTimeout(tm);tm=setTimeout(()=>n=0,2500);if(n>=7){n=0;busy=true;
  const r=lg.getBoundingClientRect(),W=innerWidth,H=innerHeight,pt=()=>({x:Math.random()*(W-r.width)-r.left,y:Math.random()*(H-r.height)-r.top});
  const kf=[{transform:'none',offset:0}];for(let k=1;k<=9;k++){const q=pt();kf.push({transform:`translate(${q.x}px,${q.y}px) rotate(${k*200*(k%2?1:-1)}deg) scale(${.7+Math.random()*.9})`,offset:k/10})}kf.push({transform:'none',offset:1});
  const st=lg.style.zIndex,sp=lg.style.position;lg.style.position='relative';lg.style.zIndex=50;
  const a=lg.animate(kf,{duration:4200,easing:'ease-in-out'});a.onfinish=a.oncancel=()=>{lg.style.zIndex=st;lg.style.position=sp;busy=false}}})}
let admQ='';
async function renderAdmin(){
  if(!isAdmin()){show('menu');return}
  const box=$('#admBody');
  const uid=cloudOn()&&fauth.currentUser?fauth.currentUser.uid:'';
  box.innerHTML=`<div class="row" style="margin-bottom:10px"><input id="admFind" maxlength="16" placeholder="Find a player by exact name" style="flex:1;margin:0" value="${esc(admQ)}"><button class="btn small blue" id="admGo">Find</button></div><div class="err" id="admErr"></div><div id="admList" class="muted">Loading...</div>`+(uid?`<p class="muted" style="margin-top:14px;line-height:1.8">Your admin ID: <b>${esc(uid)}</b><br>Edits are checked by the server. If you get "permission denied", add a Firestore doc <b>admins/${esc(uid)}</b> and allow it in the rules.</p>`:'');
  const draw=()=>{
    const U=Object.assign({},getK(),getUsers()),q=admQ.toLowerCase();
    const rows=Object.entries(U).filter(([k,u])=>u&&u.name&&(!q||u.name.toLowerCase().includes(q))).sort((a,b)=>a[1].name.localeCompare(b[1].name));
    $('#admList').innerHTML=rows.length?rows.map(([k,u])=>{const key=u.key||u.name.toLowerCase();return `<div class="row" style="margin:8px 0;align-items:flex-start"><span style="flex:1"><b>${esc(u.name)}</b><br><span class="muted">${esc(u.bio||'(no bio)')}</span></span><button class="btn small" data-ed="${esc(key)}">Edit</button></div><div id="ed-${hex(key)}"></div>`}).join(''):'No players found. Search by exact name.';
    $$('#admList [data-ed]').forEach(b=>b.onclick=()=>openEd(b.dataset.ed))};
  const openEd=key=>{
    const U=Object.assign({},getK(),getUsers()),u=U[key]||Object.values(U).find(x=>(x.key||x.name.toLowerCase())===key);if(!u)return;
    const e=$('#ed-'+hex(key));
    e.innerHTML=`<div class="panel" style="padding:10px;margin-bottom:10px"><label>Name</label><input id="edN" maxlength="16" value="${esc(u.name)}"><label>Bio</label><textarea id="edB" maxlength="120" style="width:100%;min-height:60px">${esc(u.bio||'')}</textarea><label><input type="checkbox" id="edP" style="width:auto;margin:0 8px 0 0">Remove profile picture</label><div class="err" id="edE"></div><div class="row"><button class="btn small red" id="edS">Save</button><button class="btn small grey" id="edC">Cancel</button></div><hr><div class="row"><button class="btn small blue" id="edR">Restart story</button><button class="btn small" id="edD" style="background:#a01818;color:#fff">Delete account</button></div></div>`;
    $('#edC').onclick=()=>{e.innerHTML=''};
    const cerr=x=>x.code==='permission-denied'?'Permission denied. Server setup needed (see the admin ID below).':'Failed: '+(x.code||x.message);
    $('#edR').onclick=async()=>{const er=$('#edE');er.textContent='';if(!confirm('Restart '+u.name+"'s story? Their story progress will be erased."))return;try{
      if(cloudOn()){try{await cDoc(key).update({storyReset:Date.now()})}catch(x){throw new Error(cerr(x))}}
      try{localStorage.removeItem('bpb_story_v1_'+key)}catch(x){}
      er.style.color='#2e9d3a';er.textContent='Story restart sent. Their story is erased the next time they open Story Mode.'}catch(x){er.style.color='';er.textContent=x.message}};
    $('#edD').onclick=async()=>{const er=$('#edE');er.textContent='';if(!confirm('DELETE the account '+u.name+'? This cannot be undone.'))return;try{
      if(cloudOn()){try{await cDoc(key).delete()}catch(x){throw new Error(cerr(x))}}
      const us=getUsers();delete us[key];putUsers(us);const K=getK();delete K[key];try{localStorage.setItem('bpb_known',JSON.stringify(K))}catch(x){}
      try{localStorage.removeItem('bpb_story_v1_'+key)}catch(x){}
      draw()}catch(x){er.textContent=x.message}};
    $('#edS').onclick=async()=>{const er=$('#edE');try{
      const nm=$('#edN').value.trim(),bio=$('#edB').value.slice(0,120);
      if(!/^[A-Za-z0-9_ ]{3,16}$/.test(nm))throw new Error('Name: 3-16 letters/numbers.');
      const taken=Object.entries(Object.assign({},getK(),getUsers())).some(([k,x])=>x&&x.name&&x.name.toLowerCase()===nm.toLowerCase()&&(x.key||x.name.toLowerCase())!==key);
      if(taken)throw new Error('That name is taken.');
      const patch={name:nm,bio,key};if($('#edP').checked)patch.pfp='';
      if(cloudOn()){try{await cDoc(key).update(patch)}catch(x){throw new Error(x.code==='permission-denied'?'Permission denied. Server setup needed (see the admin ID below).':x.code==='not-found'?'No such account.':'Could not save: '+(x.code||x.message))}}
      else{const us=getUsers();if(!us[key])throw new Error('That account is not on this browser.');Object.assign(us[key],patch);putUsers(us)}
      const K=getK();K[key]=Object.assign({},K[key]||{},patch);try{localStorage.setItem('bpb_known',JSON.stringify(K))}catch(x){}
      draw()}catch(x){er.textContent=x.message}}};
  const find=async()=>{admQ=$('#admFind').value.trim();const er=$('#admErr');er.textContent='';
    if(admQ&&cloudOn()&&/^[A-Za-z0-9_ ]{3,16}$/.test(admQ)){try{const x=await cDoc(admQ.toLowerCase()).get();if(x.exists){const d=x.data();addK({key:d.key||admQ.toLowerCase(),name:d.name,bio:d.bio,pfp:d.pfp,wins:d.wins,losses:d.losses,best:d.best})}else er.textContent='No player with that name.'}catch(x){er.textContent='No connection.'}}
    draw()};
  $('#admGo').onclick=find;$('#admFind').onkeydown=ev=>{if(ev.key==='Enter')find()};
  if(cloudOn()){try{await cloudBoard()}catch(e){}}
  draw()}

const qErr=e=>{if(qOn)$('#qText').textContent='Connection problem ('+e.type+'). Check your internet and try again.'};
let conn=null,peer=null,mq=[],wake=null,qOn=false;
function closeNet(){try{D&&D.c&&D.c.open&&D.c.send({t:'lv'})}catch(e){}try{conn&&conn.open&&conn.send({t:'lv'})}catch(e){}D=null;qOn=false;try{conn&&conn.close()}catch(e){}try{peer&&peer.destroy()}catch(e){}conn=peer=null;$('#queueBox').classList.remove('on')}
$('#qCancel').onclick=closeNet;
function joinQueue(tm){
  const QP=tm.length===6?'bbq6-':tm.length===1?'bbq1q-':'bbq1-';
  if(typeof Peer==='undefined'){alert('Online play needs internet (PeerJS did not load).');return}
  closeNet();KIND='queue';$('#qCancel').onclick=closeNet;qOn=true;$('#qText').textContent='Looking for another player...';$('#queueBox').classList.add('on');
  const hostSlot=i=>{
    if(!qOn)return;if(i>9){$('#qText').textContent='Queue is full, try again soon.';return}
    const p=new Peer(QP+i);let matched=false;
    p.on('open',()=>{if(!qOn){p.destroy();return}peer=p;$('#qText').textContent='In queue, waiting for an opponent...';if(i>0){const arm=()=>{p._rs=setTimeout(()=>{if(!qOn||peer!==p)return;if(matched){arm();return}p.destroy();peer=null;hostSlot(0)},5000+Math.random()*4000)};arm()}});
    p.on('connection',c=>{if(matched||!qOn){c.on('open',()=>{c.send({t:'busy'});setTimeout(()=>c.close(),300)});return}matched=true;let op=0;const wt=setTimeout(()=>{if(!op)matched=false},15000);c.on('open',()=>{op=1;clearTimeout(wt);found(c,tm,true)});c.on('close',()=>{if(!op)matched=false})});
    p.on('error',e=>{if(e.type==='unavailable-id'){p.destroy();joinSlot(i)}else qErr(e)})};
  const joinSlot=i=>{
    if(!qOn)return;const p=new Peer();
    p.on('open',()=>{const c=p.connect(QP+i,{reliable:true});let done=false;const next=()=>{if(done)return;done=true;clearTimeout(t);p.destroy();hostSlot(i+1)};const t=setTimeout(next,12000);p._nx=next;
      c.on('data',m=>{if(done)return;if(m.t==='busy')next();else if(m.t==='hello'){done=true;clearTimeout(t);peer=p;found(c,tm,false)}})});
    p.on('error',e=>{if(e.type==='peer-unavailable'){if(p._nx)p._nx()}else qErr(e)})};
  hostSlot(0)}
function found(c,tm,host,keep){
  LAST=Date.now();conn=c;if(!keep)mq=[];KIND=keep?D.kind:'queue';qOn=false;$('#queueBox').classList.remove('on');
  if(c._pres)c._h=bh;else c.on('data',bh);if(!c._lg){c._lg=1;const os=c.send.bind(c);c.send=(x,ch)=>{os(x,ch);if(x&&(x.t==='mv'||x.t==='sw')&&B&&B.log&&B.online&&!B.spec)logM(x)}}
  if(!c._cl){c._cl=1;c.on('close',()=>{if(conn!==c||!B||!B.online||B.spec)return;if(!B.over){B.oppLeft=1;B.over=true;finish(true)}else if(B.opp){B.oppLeft=1;$('#rmNote').textContent=B.opp.name+' left the match';$('#rmNote').style.color='#c0152a';$('#rematchBtn').style.display='none'}})}
  if(host&&!keep)c.send({t:'hello'});
  const d=myData();c.send({t:'team',ids:tm.map(m=>m.id),u:pub()});
  startOnline(tm,host)}

async function recv(t){const b=B,ep=EP;for(;;){if(b!==B||ep!==EP||B.over)throw 0;const k=mq.findIndex(m=>m.t===t);if(k>=0){if(B.spec)B.backlog--;return mq.splice(k,1)[0]}if(B.spec&&B.endMsg){specEnd(B.endMsg.w);throw 0}await new Promise(r=>{wake=r;setTimeout(r,1000)})}}
async function doMove(f,o,i,seed){
  rnd=mul(seed);
  if(i<0){await swapIn(f,B.helpSel);o.guard=null;return false}
  const mv=f.m.moves[i];
  const sk=!!f.skip;await act({f,o,mv});o.guard=null;endTurn(f,mv,sk);
  if(B.p.hp<=0||B.e.hp<=0)return await faintFlow();return false}
async function startOnline(tm,host){EP++;$('#screen-battle').classList.remove('blind','nohp');
  show('battle');$('#result').classList.remove('on');B={team:tm,pt:tm.map(fighter),rounds:0,swUsed:false,online:true,host,busy:true,over:false,kind:KIND,log:[],specs:[]};gl(' Give up');
  $('#pF').innerHTML='';$('#eF').innerHTML='';$('#pBox').innerHTML='';$('#eBox').innerHTML='';setMsg('Connecting...');
  try{
    const m=await recv('team');if(m.ids.length!==tm.length){B.over=true;closeNet();alert('Team sizes did not match ('+tm.length+' vs '+m.ids.length+'), so the match was cancelled. Try again.');show('menu');return}B.opp=m.u;B.specInfo={host,me:{ids:tm.map(x=>x.id),u:pub()},opp:{ids:m.ids,u:m.u}};addK(m.u);B.et=m.ids.map(id=>fighter(byId(id)));B.p=B.pt[0];B.e=B.et[0];
    $('#pF').innerHTML=sprite(B.p.m,true);$('#eF').innerHTML=sprite(B.e.m);$('#pF').className='fighter slideinP';$('#eF').className='fighter slidein';
    updBox('p');updBox('e');renderMoves();
    await say(`${m.u.name} wants to battle!`);await say(`${B.e.m.name} vs ${B.p.m.name}!`,400);
    let mine=host;
    while(!B.over){
      const actor=mine?B.p:B.e;
      if(mine){let i=0,sw=null;if(B.p.skip){B.busy=true;setMsg(`${B.p.m.name} has to skip this turn...`)}else{B.busy=false;idle();i=await new Promise(r=>{B.pick=r;swUpd()});
          if(i===-1)sw=B.swSel;else{i=resolveIdx(B.p,i);
          if(B.p.m.moves[i].special==='helppp'){const c=B.pt.filter(x=>x!==B.p&&!x.gone);if(c.length)sw=B.pt.indexOf(await chooseNext(c,true))}}}
        B.helpSel=sw;const seed=Math.floor(Math.random()*4294967296);conn.send({t:'mv',i,seed,sw});if(await doMove(B.p,B.e,i,seed))break}
      else{B.busy=true;setMsg(`Waiting for ${m.u.name}...`);const o=await recv('mv');B.helpSel=o.sw;if(await doMove(B.e,B.p,o.i,o.seed))break}
      const again=actor.extra;actor.extra=false;if(!again)mine=!mine}
  }catch(e){}}

function applyS(){ti=S.speed;if(MV)MV.gain.value=S.vol;$('#bg').classList.toggle('nofloat',!S.float)}
function saveS(){try{localStorage.setItem('bpb_set',JSON.stringify(S))}catch(e){}applyS()}
function renderSettings(){
  const sl=(k,l)=>`<label>${l}</label><input type="range" min="0" max="100" value="${Math.round(S[k]*100)}" data-s="${k}">`;
  const ck=(k,l)=>`<label><input type="checkbox" ${S[k]?'checked':''} data-s="${k}" style="width:auto;margin:0 8px 14px 0">${l}</label><br>`;
  $('#setBody').innerHTML=sl('vol','Master volume')+sl('sfx','Sound effects volume')+sl('voice','Voice line volume')+sl('click','Menu click volume')+ck('type','Typing sound')+ck('shake','Screen shake')+ck('fx','Particle effects')+ck('float','Floating background icons')+`<label>Text speed</label><div class="row" style="margin-top:8px">${TXT.map((t,i)=>`<button class="btn small ${S.speed===i?'red':'grey'}" data-sp="${i}">${t.n}</button>`).join('')}</div>`;
  $$('#setBody [data-s]').forEach(e=>e.oninput=e.onchange=()=>{S[e.dataset.s]=e.type==='range'?e.value/100:e.checked?1:0;saveS()});
  $$('#setBody [data-sp]').forEach(b=>b.onclick=()=>{S.speed=+b.dataset.sp;saveS();renderSettings()});
}
applyS();

const MI=n=>'assets/mc/'+n+'.png';Object.assign(ITEMS,{heart:MI('heart'),totem:MI('totem_of_undying')});
const FXM={'Tempest':'mace','Master Duper Double Mace':'mace','Mace':'mace','Elytra Mace':'mace','OHHH NUKOZZZZ!!!':'mace','Chestplate':'mace','Trident':'trident','Trains':'minecart','Bridge':'tnt_side','Gate of Babalon':'ender_eye','Ban Hammer':'anvil','Decibels':'wind_charge','Burger':'golden_apple','Crashout':'fire_charge','Ragebait':'fire_charge','Catboy':'netherite_sword','Scratch':'netherite_sword','Execute':'netherite_sword','PvP':'diamond_sword'};
function proj(s,t,item){ITEMS[item]=MI(item);return new Promise(r0=>{const ep=EP,r=()=>{if(ep===EP)r0()};if(!S.fx||FAST){r();return}const a=$('#arena'),ar=a.getBoundingClientRect(),c=x=>{const q=$('#'+x+'F').getBoundingClientRect();return[q.left-ar.left+q.width/2,q.top-ar.top+q.height/2]},[x0,y0]=c(s),[x1,y1]=c(t),e=document.createElement('img'),drop=['anvil','minecart','tnt_side'].includes(item),z=a.clientWidth>700?80:48;e.src=MI(item);e.className='fx';e.style.cssText=`width:${z}px;height:${z}px;left:${(drop?x1:x0)-z/2}px;top:${(drop?-z:y0)-z/2}px;animation:none;opacity:1`;a.appendChild(e);trail(e,drop?380:460);const dx=drop?0:x1-x0,dy=drop?y1+z/2:y1-y0;e.animate([{transform:'translate(0,0) rotate(0)'},{transform:`translate(${dx/2}px,${dy/2-(drop?0:70)}px) rotate(${drop?20:360}deg) scale(1.5)`},{transform:`translate(${dx}px,${dy}px) rotate(${drop?0:720}deg) scale(1.1)`}],{duration:drop?380:460,easing:'ease-in'}).onfinish=()=>{e.remove();r()};setTimeout(()=>{e.remove();r()},2500)})}
function ovl(img){if(FAST)return;const d=document.createElement('div');d.style.cssText=`position:absolute;inset:0;z-index:40;pointer-events:none;background:url(${MI(img)}) center/cover;image-rendering:pixelated;opacity:.9;transition:opacity .8s`;$('#arena').appendChild(d);setTimeout(()=>d.style.opacity=0,300);setTimeout(()=>d.remove(),1200)}
$('#pfPic').onclick=()=>$('#pfFile').click();
const hex=s=>[...new TextEncoder().encode(s)].map(b=>b.toString(16).padStart(2,'0')).join(''),pidOf=k=>'bbu1-'+hex(k);
let pp=null,D=null,KIND='queue';
const getK=()=>{try{return JSON.parse(localStorage.getItem('bpb_known')||'{}')}catch(e){return{}}};
const addK=u=>{if(!u||!u.name)return;const k=getK();k[u.key||u.name.toLowerCase()]={key:u.key||'',name:u.name,bio:u.bio||'',pfp:u.pfp||'',wins:u.wins||0,losses:u.losses||0,best:u.best||0};try{localStorage.setItem('bpb_known',JSON.stringify(k))}catch(e){}};
const pubSafe=()=>{const d=myData();return d?pub():{name:me?me.name:'Player',bio:'',pfp:''}};
const pub=()=>{const d=myData();return{name:d.name,bio:d.bio||'',pfp:d.pfp||'',wins:d.wins,losses:d.losses,best:d.best}};
const upd=fn=>{const u=getUsers();if(u[me.key]){fn(u[me.key]);putUsers(u)}};
const gl=t=>{$('#runBtn').lastChild.nodeValue=t;bar()};
function bar(){$('#watchBar').textContent=B&&B.spec?`Watching ${B.watching}'s match`:B&&B.specs&&B.specs.length?'Watching you: '+B.specs.map(x=>x._n).join(', '):''}
const ranked=()=>!B.online||B.kind==='queue'
function rec(won){const d=myData();if(!d)return;if(ranked()){won?(d.wins++,d.streak++,d.best=Math.max(d.best,d.streak)):(d.losses++,d.streak=0);const u=getUsers();u[me.key]=d;putUsers(u)}else if(B.kind==='comp')upd(x=>{x.h2h=x.h2h||{};const a=x.h2h[B.opp.name.toLowerCase()]=x.h2h[B.opp.name.toLowerCase()]||[0,0];a[won?0:1]++})}
const myStatus=()=>B&&!B.over?(B.spec?{s:'watching',w:B.watching}:{s:'battle',o:B.opp&&B.opp.name,n:B.specs?B.specs.length:0,can:!!B.specInfo}):qOn?{s:'queue'}:{s:'online'};
const bh=m=>{LAST=Date.now();if(m.t==='hb')return;if(m.t==='lv'){peerLost();return}if(m.t==='rdy'){if(D&&!D.live){D.oppReady=1;$('#readyNote').textContent=D.opp+' is READY!';if($('#result').classList.contains('on'))$('#rmNote').textContent=D.opp+' is ready for a rematch!';chkReady()}return}if(m.t==='team'&&D&&D.my&&!D.live){mq.push(m);D.oppReady=1;chkReady();return}if(m.t==='gu'&&B&&B.online&&!B.over){B.oppLeft=1;B.over=true;finish(true)}else{if(B&&B.log&&B.online&&!B.over&&(m.t==='mv'||m.t==='sw'))logM(m);mq.push(m);wake&&wake()}};
function logM(m){const e=Object.assign({},m,{_n:B.log.length});B.log.push(e);B.specs.forEach(s=>{try{s.send({t:'m',m:e})}catch(x){}})}
const rf=()=>{badge();if($('#screen-friends').classList.contains('active'))renderFriends()};
const lbl=()=>vsMode==='duel'?'READY':'START BATTLE!';
function badge(){const d=myData(),n=d?Object.keys(d.reqIn||{}).length:0,b=$('#frBadge');if(b){b.textContent=n>9?'9+':n;b.style.display=n?'block':'none'}}
function dReady(t){if(!D||!D.c.open)return alert((D?D.opp:'Your friend')+' left the match.');D.my=t;$('#startBtn').disabled=true;$('#startBtn').textContent='WAITING FOR '+D.opp.toUpperCase()+'...';const d0=D;clearInterval(d0.rt);d0.c.send({t:'rdy'});d0.rt=setInterval(()=>{if(D!==d0||d0.live||!d0.my||!d0.c.open){clearInterval(d0.rt);return}try{d0.c.send({t:'rdy'})}catch(e){}chkReady()},1200);chkReady()}
function chkReady(){if(D&&D.my&&D.oppReady&&!D.live){clearInterval(D.rt);const t=D.my;D.my=null;D.oppReady=0;D.live=1;D.round=(D.round||0)+1;$('#readyNote').textContent='';$('#rmNote').textContent='';try{found(D.c,t,D.host,1)}catch(e){D.live=0;D.my=t;alert('Could not start the duel: '+e.message)}}}
let LAST=Date.now();
function peerLost(){
  if(B&&B.online&&!B.spec&&!B.over){B.oppLeft=1;B.over=true;finish(true);return}
  if(B&&B.online&&!B.spec&&B.over&&B.opp){B.oppLeft=1;$('#rmNote').textContent=B.opp.name+' left the match';$('#rmNote').style.color='#c0152a';$('#rematchBtn').style.display='none'}
  if(D&&!D.live){const on=D.opp,c=D.c;D=null;try{c.close()}catch(e){}$('#invBox').classList.remove('on');$('#queueBox').classList.remove('on');if($('#screen-select').classList.contains('active')&&vsMode==='duel'){alert(on+' left the match.');show('menu')}}
}
setInterval(()=>{const c=D&&D.c&&D.c.open?D.c:(B&&B.online&&!B.spec&&conn&&conn.open?conn:null);if(!c)return;try{c.send({t:'hb'})}catch(e){}if(Date.now()-LAST>20000){LAST=Date.now();peerLost()}},2000);
setInterval(()=>{if(vsMode==='duel'&&D&&!D.live&&$('#screen-select').classList.contains('active'))$('#readyNote').textContent=(D.kind==='comp'?'Competitive':'Friendly')+(D.size===1?' 1v1':' 3v3')+' duel vs '+D.opp+' - '+(D.c.open?'connected':'NOT CONNECTED')+(D.oppReady?' - they are READY!':' - not ready yet')},500);
window.addEventListener('pagehide',()=>{try{D&&D.c&&D.c.open&&D.c.send({t:'lv'})}catch(e){}try{conn&&conn.open&&conn.send({t:'lv'})}catch(e){}});
const gone=c=>c.on('close',()=>{if(D&&D.c===c){const live=D.live,on=D.opp;D=null;$('#invBox').classList.remove('on');if(!live&&$('#screen-select').classList.contains('active')&&vsMode==='duel'){alert(on+' left the match.');show('menu')}}});
const PRES={s:'connecting',err:''};
function presUI(){
  const d=$('#presDot');if(!d)return;
  if(!me){d.style.display='none';return}
  const ps=typeof Peer==='undefined'?'blocked':PRES.s,why={'unavailable-id':'this account is online in another tab/device','blocked':'PeerJS did not load (network blocks it?)'}[ps==='blocked'?'blocked':PRES.err]||PRES.err;
  d.style.display='block';
  d.innerHTML=ps==='online'?'<span style="color:#6f6">&#9679;</span> You are online':ps==='connecting'?'<span style="color:#fd4">&#9679;</span> Connecting...':'<span style="color:#f66">&#9679;</span> Offline'+(why?': '+esc(why):'');
  const e=$('#bs-'+hex(me.key));if(e)e.textContent=ps==='online'?'You (online)':ps==='connecting'?'You (connecting...)':'You (offline)'
}
function startPresence(){
  if(!me)return;
  if(typeof Peer==='undefined'){presUI();return}
  if(pp&&pp._k===me.key&&!pp.destroyed){if(pp.disconnected&&pp.open===false&&!pp._rc){pp._rc=1;const q=pp;setTimeout(()=>{q._rc=0;if(pp===q&&!q.destroyed&&q.disconnected){try{q.reconnect()}catch(e){}}},1000)}return}
  try{pp&&pp.destroy()}catch(e){}
  const p=pp=new Peer(pidOf(me.key));p._k=me.key;PRES.s='connecting';presUI();
  p.on('connection',c=>{c._pres=1;c.on('data',m=>c._h?c._h(m):inMsg(c,m))});
  p.on('open',()=>{if(pp!==p)return;PRES.s='online';PRES.err='';presUI();const d=myData();d&&Object.keys(d.reqOut||{}).forEach(sendReq)});
  p.on('disconnected',()=>{if(pp!==p)return;PRES.s='connecting';presUI();setTimeout(()=>{if(pp===p&&!p.destroyed&&p.disconnected){try{p.reconnect()}catch(e){}}},1500)});
  p.on('close',()=>{if(pp===p){pp=null;PRES.s='connecting';presUI()}});
  p.on('error',e=>{
    if(e.type==='peer-unavailable')return;
    if(pp!==p)return;
    PRES.err=e.type;PRES.s='error';presUI();
    if(e.type==='unavailable-id'||e.type==='network'||e.type==='server-error'||e.type==='socket-error'||e.type==='socket-closed'){try{p.destroy()}catch(x){}if(pp===p)pp=null;setTimeout(()=>startPresence(),e.type==='unavailable-id'?6000:4000)}})}
setInterval(()=>{if(me)startPresence();presUI()},4000);
function inMsg(c,m){const d=myData();if(!d)return;const fr=d.friends||{};
  if(m.t==='who'){c.send({t:'me',u:pub(),st:myStatus()});setTimeout(()=>c.close(),1500)}
  else if(m.t==='freq'){const k=m.u.name.toLowerCase();addK(m.u);upd(x=>{x.friends=x.friends||{};if(x.reqOut&&x.reqOut[k]){delete x.reqOut[k];x.friends[k]=m.u.name}else if(!x.friends[k]){x.reqIn=x.reqIn||{};x.reqIn[k]=m.u.name}});c.send({t:'ok',u:pub(),acc:(myData().friends||{})[k]?1:0});rf()}
  else if(m.t==='facc'){addK(m.u);upd(x=>{x.friends=x.friends||{};x.friends[m.u.name.toLowerCase()]=m.u.name;delete (x.reqOut||{})[m.u.name.toLowerCase()]});rf()}
  else if(m.t==='frm'){upd(x=>{delete (x.friends||{})[m.k]});rf()}
  else if(m.t==='spec'){const b=B;if(b&&b.specInfo&&!b.over&&!b.spec){c._n=m.n;b.specs.push(c);c.on('close',()=>{b.specs=b.specs.filter(x=>x!==c);bar()});c.send({t:'init',i:b.specInfo,log:b.log,by:me.name});bar()}else c.send({t:'no'})}
  else if(m.t==='duel'){if(D&&!D.live&&(!D.c.open||D.opp.toLowerCase()===m.u.name.toLowerCase())){const o=D;D=null;try{o.c.close()}catch(e){}}if(!fr[m.u.name.toLowerCase()]||(B&&!B.over)||D||qOn){c.send({t:'dno',why:!fr[m.u.name.toLowerCase()]?'nf':'busy'});return}D={c,host:false,kind:m.kind,size:m.size===1?1:3,opp:m.u.name};c._h=bh;gone(c);$('#invText').textContent=`${m.u.name} invites you to a ${m.kind==='comp'?'competitive':'friendly'} ${m.size===1?'1v1':'3v3'} duel!`;$('#invBox').classList.add('on')}}
$('#invYes').onclick=()=>{pickN=D&&D.size===1?1:3;LAST=Date.now();$('#invBox').classList.remove('on');D.c.send({t:'dok'});vsMode='duel';show('select')};
$('#invNo').onclick=()=>{$('#invBox').classList.remove('on');try{D.c.send({t:'dno'});D.c.close()}catch(e){}D=null};
const PQ=[];let PA=0;
function ping(k,cb){PQ.push([k,cb]);pumpPing()}
function pumpPing(){while(PA<6&&PQ.length){const[k,cb]=PQ.shift();PA++;ping0(k,(r,nc)=>{PA--;try{cb(r,nc)}catch(e){console.error(e)}pumpPing()})}}
function ping0(k,cb,tries=0){
  if(!pp||!pp.open){startPresence();return cb(null,1)}
  const pid=pidOf(k),P=pp;let done=0;const c=P.connect(pid,{reliable:true});
  const eh=e=>{if(e&&e.type==='peer-unavailable'&&String(e.message||'').indexOf(pid)>=0)fin(null)};P.on('error',eh);
  const fin=r=>{if(done)return;done=1;clearTimeout(t);try{P.off('error',eh)}catch(e){}try{c.close()}catch(e){}cb(r||null)},
  t=setTimeout(()=>{if(done)return;done=1;try{P.off('error',eh)}catch(e){}try{c.close()}catch(e){}if(tries<1)ping0(k,cb,tries+1);else cb(null)},8000);
  c.on('open',()=>c.send({t:'who'}));c.on('data',m=>{if(m.t==='me'){addK(m.u);fin(m)}})}
function tell(k,msg){if(!pp||!pp.open)return;const c=pp.connect(pidOf(k),{reliable:true});c.on('open',()=>{c.send(msg);setTimeout(()=>c.close(),1500)});setTimeout(()=>{try{c.close()}catch(e){}},6000)}
function sendReq(k){if(!pp||!pp.open)return;const c=pp.connect(pidOf(k),{reliable:true}),t=setTimeout(()=>{try{c.close()}catch(e){}},6000);c.on('open',()=>c.send({t:'freq',u:pub()}));c.on('data',m=>{if(m.t==='ok'){clearTimeout(t);addK(m.u);if(m.acc)upd(x=>{x.friends=x.friends||{};x.friends[k]=m.u.name;delete (x.reqOut||{})[k]});c.close();rf()}})}
const stHtml=(st,k)=>!st?'<span class="muted">Offline</span>':st.s==='battle'?`In match${st.o?' vs '+esc(st.o):''}${st.n?` (${st.n} watching)`:''} ${st.can?`<button class="btn small blue" data-w="${esc(k)}">Watch</button>`:''}`:st.s==='watching'?'Watching '+esc(st.w||''):st.s==='queue'?'In queue':'Online';
const ST={};
function setSt(e,st,k){ST[k]=st;e.innerHTML=stHtml(st,k);e.querySelectorAll('[data-w]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();watch(b.dataset.w)});if(e.id&&e.id.startsWith('bs-'))boardSort()}
function boardSort(){const t=document.querySelector('#boardBody table');if(!t||!me)return;const rows=[...t.querySelectorAll('tr[data-k]')];
  rows.forEach((r,i)=>{if(r._i==null)r._i=i;const k=r.dataset.k,on=k===me.key||!!ST[k];r._g=on?0:1;r.style.fontWeight=on?'bold':'';r.querySelectorAll('td').forEach(td=>{td.style.color=on?'#2e9d3a':'#8a8a8a'});const im=r.querySelector('img');if(im)im.style.opacity=on?1:.5});
  rows.sort((a,b)=>a._g-b._g||((b.dataset.k===me.key)-(a.dataset.k===me.key))||a._i-b._i).forEach(r=>t.appendChild(r))}
let bT=0;
function renderBoard(){let U=getUsers();const K=getK();if(cloudOn()){const m=me&&U[me.key];U={};if(m)U[me.key]=m}Object.keys(K).forEach(k=>{if(!U[k])U[k]=K[k]});const rows=Object.values(U).sort((a,b)=>b.wins-a.wins||a.losses-b.losses);
  $('#boardBody').innerHTML=`<div class="row" style="margin-bottom:12px"><input id="bdFind" maxlength="16" placeholder="Find a player by name to see if they are in a match" style="flex:1;margin:0"><button class="btn small blue" id="bdAdd">Find</button></div><div class="err" id="bdErr"></div>`+(rows.length?`<table><tr><th>#</th><th>Name</th><th>Wins</th><th>Loses</th><th>Highest Streak</th><th>Status</th></tr>${rows.map((u,i)=>{const k=u.key||u.name.toLowerCase();return `<tr data-k="${esc(k)}" style="cursor:pointer"><td>${i+1}</td><td><img src="${pfpOf(u)}" style="width:20px;height:20px;vertical-align:middle;image-rendering:pixelated"> ${esc(u.name)}</td><td>${u.wins}</td><td>${u.losses}</td><td>${u.best}</td><td id="bs-${hex(k)}" class="muted">${k===me.key?'You':'...'}</td></tr>`}).join('')}</table>`:'No players yet. Be the first!');
  const addP=()=>{const n=$('#bdFind').value.trim(),e=$('#bdErr');if(!/^[A-Za-z0-9_ ]{3,16}$/.test(n)){e.textContent='Enter a valid name (3-16 letters/numbers).';return}if(cloudOn()){cDoc(n.toLowerCase()).get().then(x=>{if(!x.exists){e.textContent='No player with that name.';return}const d=x.data();addK({name:d.name,bio:d.bio,pfp:d.pfp,wins:d.wins,losses:d.losses,best:d.best});renderBoard()}).catch(()=>{e.textContent='No connection.'});return}if(!getK()[n.toLowerCase()]&&!getUsers()[n.toLowerCase()])addK({name:n});renderBoard()};
  $('#bdAdd').onclick=addP;$('#bdFind').onkeydown=ev=>{if(ev.key==='Enter')addP()};
  $$('#boardBody tr[data-k]').forEach(r=>r.onclick=()=>{const k=r.dataset.k,go=st=>{if(st&&st.s==='battle'&&st.can)watch(k);else viewUser(U[k])};if(k===me.key)return viewUser(U[k]);if(k in ST)go(ST[k]);else ping(k,(x,nc)=>{if(nc)return alert('Still connecting, try again in a moment.');go(x&&x.st)})});
  const ks=rows.map(u=>u.key||u.name.toLowerCase()).filter(k=>k!==me.key).slice(0,40),go=()=>{startPresence();ks.forEach(k=>ping(k,(r,nc)=>{if(nc)return;const e=$('#bs-'+hex(k));if(e)setSt(e,r&&r.st,k)}))};ks.forEach(k=>{const e=$('#bs-'+hex(k));if(e&&ST[k]!==undefined)e.innerHTML=stHtml(ST[k],k)});$$('#boardBody [data-w]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();watch(b.dataset.w)});boardSort();go();clearInterval(bT);bT=setInterval(()=>$('#screen-board').classList.contains('active')?go():clearInterval(bT),10000)}
function renderFriends(){badge();const d=myData(),f=d.friends||{},ri=d.reqIn||{},ro=d.reqOut||{};
  $('#frBody').innerHTML=`<div class="frAddBar"><input id="frName" maxlength="16" placeholder="Add a friend by name" style="flex:1;margin:0"><button class="btn red small" id="frAdd">+ Add</button></div><div class="err" id="frErr"></div><p class="muted" style="margin:6px 0 0">Friend requests, duels and status need both of you online.</p>`+(Object.keys(ri).length?`<h3 class="frH">Requests (${Object.keys(ri).length})</h3>`+Object.entries(ri).map(([k,n])=>`<div class="frCard req"><img class="frPfp" src="${pfpOf(getUsers()[k]||getK()[k])}" alt=""><div class="frInfo"><b>${esc(n)}</b><span class="muted">wants to be friends</span></div><button class="btn small blue" data-ac="${esc(k)}">Accept</button><button class="btn small grey" data-dc="${esc(k)}">Decline</button></div>`).join(''):'')+`<h3 class="frH">Friends (${Object.keys(f).length})</h3>`+(Object.keys(f).length?Object.entries(f).map(([k,n])=>{const h=(d.h2h||{})[k]||[0,0];return `<div class="frCard"><img class="frPfp" src="${pfpOf(getUsers()[k]||getK()[k])}" alt=""><div class="frInfo"><b data-v="${esc(k)}" style="cursor:pointer">${esc(n)}</b><span class="muted" id="fs-${hex(k)}">...</span><span class="frRec">Duels ${h[0]} - ${h[1]}</span></div><button class="btn small red" data-du="${esc(k)}">Duel</button><button class="btn small grey" data-rm="${esc(k)}" title="Remove friend">X</button></div>`}).join(''):'<div class="frEmpty">No friends yet. Add one above!</div>')+(Object.keys(ro).length?`<p class="muted" style="margin-top:10px">Pending: ${Object.values(ro).map(esc).join(', ')}</p>`:'');
  $('#frAdd').onclick=()=>{const n=$('#frName').value.trim(),k=n.toLowerCase(),e=$('#frErr');if(!/^[A-Za-z0-9_ ]{3,16}$/.test(n)){e.textContent='Enter a valid name.';return}if(k===me.key){e.textContent="That's you!";return}upd(x=>{x.reqOut=x.reqOut||{};x.reqOut[k]=n});sendReq(k);renderFriends()};
  $$('#frBody [data-ac]').forEach(b=>b.onclick=()=>{const k=b.dataset.ac;upd(x=>{x.friends=x.friends||{};x.friends[k]=x.reqIn[k];delete x.reqIn[k]});tell(k,{t:'facc',u:pub()});renderFriends()});
  $$('#frBody [data-dc]').forEach(b=>b.onclick=()=>{upd(x=>{delete x.reqIn[b.dataset.dc]});renderFriends()});
  $$('#frBody [data-rm]').forEach(b=>b.onclick=()=>{const k=b.dataset.rm;upd(x=>{delete x.friends[k]});tell(k,{t:'frm',k:me.key});renderFriends()});
  $$('#frBody [data-du]').forEach(b=>b.onclick=()=>{pickDuel(b.dataset.du)});
  $$('#frBody [data-v]').forEach(b=>b.onclick=()=>viewUser(getUsers()[b.dataset.v]||getK()[b.dataset.v]));
  startPresence();Object.keys(f).forEach(k=>ping(k,(r,nc)=>{if(nc)return;const e=$('#fs-'+hex(k));if(e)setSt(e,r&&r.st,k)}));Object.keys(ro).forEach(sendReq)}
let duelSize=3;
function pickDuel(k){let kind='friendly',sz=3;const nm=(myData().friends||{})[k]||k;const o=document.createElement('div');o.className='overlay on';
  o.innerHTML=`<div class="panel"><h2>DUEL ${esc(nm).toUpperCase()}</h2><p class="muted" style="margin:0 0 6px">Match type</p><div class="row dpRow" data-g="kind"><button class="btn small red on" data-v="friendly">Friendly</button><button class="btn small" data-v="comp">Competitive</button></div><p class="muted" style="margin:12px 0 6px">Duel size</p><div class="row dpRow" data-g="size"><button class="btn small" data-v="1">1 v 1</button><button class="btn small red on" data-v="3">3 v 3</button></div><div class="row" style="justify-content:center;margin-top:16px"><button class="btn blue" id="dpGo">Send Duel</button><button class="btn grey" id="dpNo">Cancel</button></div></div>`;
  document.body.appendChild(o);
  o.querySelectorAll('.dpRow').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{g.querySelectorAll('button').forEach(x=>{x.classList.remove('on','red');});b.classList.add('on','red');if(g.dataset.g==='kind')kind=b.dataset.v;else sz=+b.dataset.v}));
  o.querySelector('#dpNo').onclick=()=>o.remove();
  o.querySelector('#dpGo').onclick=()=>{o.remove();duelSize=sz;duel(k,kind)}}
function duel(k,kind){LAST=Date.now();if(!pp||!pp.open||(B&&!B.over))return alert('Not connected yet, try again in a moment.');if(qOn)closeNet();const c=pp.connect(pidOf(k),{reliable:true});const sz=duelSize===1?1:3;D={c,host:true,kind,size:sz,opp:(myData().friends||{})[k]||k};c._pres=1;c._h=m=>{LAST=Date.now();if(m.t==='lv'){peerLost();return}if(m.t==='dok'){pickN=sz;$('#queueBox').classList.remove('on');c._h=bh;vsMode='duel';show('select')}else if(m.t==='dno'){$('#queueBox').classList.remove('on');alert(m.why==='nf'?'They have not accepted your friend request yet.':m.why==='busy'?'They are busy right now.':'Duel declined.');D=null}};gone(c);c.on('data',m=>c._h(m));c.on('open',()=>c.send({t:'duel',u:pub(),kind,size:sz}));$('#qText').textContent='Waiting for your friend to accept...';$('#queueBox').classList.add('on');$('#qCancel').onclick=()=>{try{c.close()}catch(e){}D=null;$('#queueBox').classList.remove('on')};setTimeout(()=>{if(D&&D.c===c&&$('#queueBox').classList.contains('on')){$('#queueBox').classList.remove('on');try{c.close()}catch(e){}D=null;alert('No answer. Is your friend online?')}},15000)}
let WTRY=0;
function specFlush(c){if(c._nx==null||!B||!B.spec||B.c!==c)return;const q=c._pend||{};while(q[c._nx]){mq.push(q[c._nx]);delete q[c._nx];c._nx++}wake&&wake()}
function specData(c,m){
  if(m.t==='init'){
    if(B&&!B.over&&!(B.spec&&B.c!==c)){if(!(B.spec&&B.c===c))try{c.close()}catch(e){}return}
    c._nx=(m.log||[]).length;spectate(c,m);specFlush(c)}
  else if(m.t==='no'){if(!c._no){c._no=1;alert('That match is not available to watch.')}}
  else if(m.t==='m'){if(m.m._n==null){if(B&&B.spec&&B.c===c){mq.push(m.m);wake&&wake()}return}(c._pend=c._pend||{})[m.m._n]=m.m;specFlush(c)}
  else if(m.t==='end'&&B&&B.spec&&B.c===c)B.endMsg=m}
function leaveSpec(){if(B&&B.spec&&!B.over){EP++;B.over=true;FAST=false;try{B.c.close()}catch(e){}$('#result').classList.remove('on')}}
function watch(k){if(!pp||!pp.open)return alert('Not connected yet, try again in a moment.');if(B&&!B.over&&!B.spec)return alert('Finish your own match first.');leaveSpec();if(Date.now()-WTRY<9000)return;WTRY=Date.now();const c=pp.connect(pidOf(k),{reliable:true});let got=0;setTimeout(()=>{if(!got){WTRY=0;try{c.close()}catch(e){}alert('Could not reach that match. They may have just finished.')}},9000);c.on('open',()=>c.send({t:'spec',n:me.name}));c.on('data',m=>{got=1;WTRY=0;specData(c,m)})}
function specEnd(name){B.over=true;FAST=false;$('#resTitle').textContent=name+' won!';$('#resTitle').style.color='#2e9d3a';$('#resText').textContent='';$('#rematchBtn').style.display=$('#changeBtn').style.display='none';$('#result').classList.add('on')}
async function spectate(c,m){EP++;$('#screen-battle').classList.remove('blind','nohp');const i=m.i;mq=m.log.slice();show('battle');$('#result').classList.remove('on');
  B={spec:1,online:true,c,host:i.host,watching:m.by,opp:i.opp.u,kind:'watch',busy:true,over:false,backlog:m.log.length,pt:i.me.ids.map(id=>fighter(byId(id))),et:i.opp.ids.map(id=>fighter(byId(id)))};B.p=B.pt[0];B.e=B.et[0];
  FAST=m.log.length>0;gl(' Leave');$('#moves').innerHTML='';$('#info').textContent='';
  $('#pF').innerHTML=sprite(B.p.m,true);$('#eF').innerHTML=sprite(B.e.m);$('#pF').className='fighter slideinP';$('#eF').className='fighter slidein';updBox('p');updBox('e');
  c.on('close',()=>{if(B&&B.spec&&!B.over)B.endMsg=B.endMsg||{w:B.watching}});
  try{let mine=i.host;while(!B.over){const a=mine?B.p:B.e,o=mine?B.e:B.p,x=await recv('mv');B.helpSel=x.sw;if(await doMove(a,o,x.i,x.seed))break;const again=a.extra;a.extra=false;if(!again)mine=!mine;if(B.backlog<=0)FAST=false}}catch(e){}
  FAST=false}

const FXS={'nukoz:Tempest':{a:'slam',i:'mace',l:1,wd:1},'nukoz:Master Duper Double Mace':{a:'dbl'},'nukoz:Catboy':{a:'claw'},'etrosion:It was kinda like destiny':{a:'swirl'},'mlvlnt:Chestplate':{a:'slam',l:1},'mlvlnt:PvP':{a:'melee',i:'diamond_sword'},'etrosion:Trident':{a:'throw',i:'trident'},'etrosion:Subscribe':{a:'throw',i:'heart'},
'chase:OHHH NUKOZZZZ!!!':{a:'fly',i:'mace'},'burg:Burger':{a:'throw',i:'cooked_beef',po:1},'burg:Execute':{a:'melee',i:'diamond_sword'},
'bruce:Ban Hammer':{a:'melee',i:'mace'},'bruce:Scratch':{a:'melee',i:'diamond_sword'},'bruce:Hacker':{a:'throw',i:'pot',c:'#3fd13f'},
'kneervous:Elytra Mace':{a:'slam',i:'mace',w:1},'kneervous:Mace':{a:'melee',i:'mace'},'kneervous:Angel':{a:'wings'},'kneervous:Quite Literally Known':{a:'throw',i:'pot',c:'#9aa3b5'},
'mikeanike:Decibels':{a:'shriek'},'mikeanike:Trains':{a:'train'},'mikeanike:Headlights':{a:'light'},
'sora:Bridge':{a:'throw',i:'iron_block'},'sora:Crashout':{a:'throw',i:'fire_charge',fl:1},'sora:Gate of Babalon':{a:'arrows'},
'voidrisez:Crashout':{a:'flames'},'voidrisez:Ragebait':{a:'throw',i:'pot',c:'#e49b20',fl:1}};
const SELF={'mlvlnt:Aura':'glow','etrosion:Honor':'honor','nukoz:HiamChud':'summon','bruce:9 Lifes':'lives','chase:Prison':'prison','chase:Helppp!!':'sky','burg:Eating':'eat','voidrisez:Leave':'door'};
const ctr=s=>{const q=$('#'+s+'F').getBoundingClientRect(),a=$('#arena').getBoundingClientRect();return[q.left-a.left+q.width/2,q.top-a.top+q.height/2,q.width]},Z=()=>$('#arena').clientWidth>700?84:48,dirOf=s=>s==='p'?1:-1;
function mk(src,x,y,z,css=''){const e=document.createElement('img');e.src=src;e.style.cssText=`position:absolute;left:${x-z/2}px;top:${y-z/2}px;width:${z}px;height:${z}px;image-rendering:pixelated;z-index:7;pointer-events:none;${css}`;$('#arena').appendChild(e);return e}
const wa=(e,k,d,o={})=>live(e.animate(k,{duration:d,fill:'forwards',easing:'ease-in-out',...o}).finished,(o.delay||0)+d+1500);
const PC={};function potSrc(c){return new Promise(r=>{if(PC[c])return r(PC[c]);const a=new Image(),b=new Image();let n=0;const P=MI('splash_potion'),to=setTimeout(()=>r(P),1200),go=()=>{if(++n<2)return;try{const cv=document.createElement('canvas');cv.width=cv.height=16;const x=cv.getContext('2d');x.drawImage(b,0,0,16,16);x.globalCompositeOperation='source-in';x.fillStyle=c;x.fillRect(0,0,16,16);x.globalCompositeOperation='source-over';x.drawImage(a,0,0,16,16);clearTimeout(to);r(PC[c]=cv.toDataURL())}catch(e){clearTimeout(to);r(P)}};a.onerror=b.onerror=()=>r(P);a.onload=b.onload=go;a.src=MI('splash_potion');b.src=MI('potion_overlay')})}
async function thr(s,t,src,d=480,z=Z()){const[x0,y0]=ctr(s),[x1,y1]=ctr(t),e=mk(src,x0,y0,z),dx=x1-x0,dy=y1-y0;trail(e,d);await wa(e,[{transform:'none'},{transform:`translate(${dx/2}px,${dy/2-60}px) rotate(360deg) scale(1.4)`},{transform:`translate(${dx}px,${dy}px) rotate(720deg)`}],d,{easing:'ease-in'});e.remove()}
const rm=(e,ms)=>setTimeout(()=>e.remove(),ms);
function ring(x,y,src,n,r,ms,sz,spin=360){const c=document.createElement('div');c.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:0;height:0;z-index:8;pointer-events:none`;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,e=document.createElement('img');e.src=src;e.style.cssText=`position:absolute;left:${Math.cos(a)*r-sz/2}px;top:${Math.sin(a)*r-sz/2}px;width:${sz}px;height:${sz}px;image-rendering:pixelated`;c.appendChild(e)}$('#arena').appendChild(c);c.animate([{transform:'rotate(0) scale(.3)',opacity:0},{transform:`rotate(${spin/3}deg) scale(1)`,opacity:1,offset:.25},{transform:`rotate(${spin*.8}deg) scale(1)`,opacity:1,offset:.8},{transform:`rotate(${spin}deg) scale(.3)`,opacity:0}],{duration:ms,easing:'ease-in-out'});rm(c,ms+50);return c}
function rise(x,y,src,n,sz,ms,spread){for(let i=0;i<n;i++)setTimeout(()=>{const e=mk(src,x+(Math.random()-.5)*spread,y+Math.random()*spread*.4,sz);e.style.zIndex=9;wa(e,[{transform:'translateY(0) scale(.5)',opacity:0},{transform:'translateY(-30px) scale(1)',opacity:1,offset:.3},{transform:'translateY(-110px) scale(.8)',opacity:0}],ms);rm(e,ms+50)},i*(ms/n/2))}
const safe=p=>{const e=EP;return new Promise(r=>{Promise.race([p.catch(()=>false),new Promise(x=>setTimeout(()=>x(false),3000))]).then(v=>{if(e===EP)r(v)})})};
const fxA=(...a)=>safe(fxA0(...a)),fxS=(...a)=>safe(fxS0(...a));
async function fxA0(s,t,K,o){const sp=FXS[K];if(!sp||FAST||!S.fx)return !!sp&&FAST;const f=$('#'+s+'F'),oe=$('#'+t+'F'),[x0,y0,w]=ctr(s),[x1,y1]=ctr(t),z=Z(),sg=x1>x0?1:-1,a=sp.a;
  if(a==='melee'){f.animate([{transform:'none'},{transform:`translate(${(x1-x0)*.78}px,${(y1-y0)*.4}px)`,offset:.45},{transform:`translate(${(x1-x0)*.78}px,${(y1-y0)*.4}px)`,offset:.6},{transform:'none'}],{duration:760,easing:'ease-in-out'});await sleep(330);const e=mk(MI(sp.i),x0+(x1-x0)*.78+sg*w*.3,y0+(y1-y0)*.4-10,z*1.2);await wa(e,sp.th?[{transform:`translateX(${-sg*25}px)`},{transform:`translateX(${sg*60}px)`}]:[{transform:`rotate(${-70*sg}deg)`},{transform:`rotate(${70*sg}deg)`}],220);e.remove()}
  else if(a==='slam'){let wg=[];if(sp.w)for(const r of[-1,1]){const g=document.createElement('img');g.src=MI('elytra');g.style.cssText=`position:absolute;top:5%;${r<0?'left':'right'}:-15%;width:60%;image-rendering:pixelated;z-index:-1;transform:scaleX(${-r})`;f.appendChild(g);g.animate([{rotate:'0deg'},{rotate:`${r*25}deg`},{rotate:'0deg'}],{duration:350,iterations:3});wg.push(g)}
    f.animate([{transform:'none'},{transform:'translateY(-230px)',offset:.35},{transform:'translateY(-230px)',offset:.5},{transform:`translate(${x1-x0}px,${y1-y0-30}px) scale(1.15)`,offset:.7},{transform:'none'}],{duration:1000,easing:'ease-in'});await sleep(700);wg.forEach(g=>g.remove());if(sp.l)zap(t);if(sp.wd)ring(x1,y1,MI('wind_charge'),8,w*.6,800,z*.8,720);if(sp.i){const e=mk(MI(sp.i),x1-sg*w*.3,y1-60,z*1.2);await wa(e,[{transform:'rotate(-60deg)'},{transform:'rotate(60deg)'}],180);e.remove()}}
  else if(a==='throw'){const src=sp.i==='pot'?await potSrc(sp.c):MI(sp.i);await thr(s,t,src);if(sp.fl)for(let i=0;i<8;i++){const e=mk(MI('flame'),x1+(Math.random()-.5)*w*.6,y1+(Math.random()-.2)*w*.3,z*.6);wa(e,[{transform:'none',opacity:1},{transform:'translateY(-70px) scale(.4)',opacity:0}],700+Math.random()*300);rm(e,1100)}
    if(sp.po)oe.animate([{filter:'none'},{filter:'hue-rotate(90deg) saturate(2.5)'},{filter:'none'}],{duration:1600})}
  else if(a==='fly'){const[,,]=[0];const e=mk('assets/sprites/nukoz.png',x1+sg*-1*w*.2,-z,w*.9);await wa(e,[{transform:'none'},{transform:`translate(${-sg*30}px,${y1+z-w*.5}px)`}],420,{easing:'ease-in'});const m=mk(MI('mace'),x1,y1-w*.35,z*1.3);await wa(m,[{transform:'rotate(-70deg)'},{transform:'rotate(40deg) translateY(30px)'}],200);m.remove();wa(e,[{transform:`translate(${-sg*30}px,${y1+z-w*.5}px)`,opacity:1},{transform:`translate(${-sg*30}px,${-z*3}px)`,opacity:0}],450);rm(e,600)}
  else if(a==='wings'){for(const r of[-1,1]){const g=document.createElement('img');g.src=MI('elytra');g.style.cssText=`position:absolute;top:0;${r<0?'left':'right'}:-25%;width:65%;image-rendering:pixelated;z-index:-1;transform:scaleX(${-r})`;f.appendChild(g);g.animate([{rotate:'0deg'},{rotate:`${r*30}deg`},{rotate:'0deg'}],{duration:300,iterations:4});rm(g,1250)}await sleep(1200)}
  else if(a==='shriek'){const e=mk(MI('sculk_shrieker_top'),x0,y0-w*.5,z*1.3);e.animate([{transform:'scale(1)'},{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:300,iterations:3});for(let i=0;i<4;i++){const r=document.createElement('div');r.style.cssText=`position:absolute;left:${x0-20}px;top:${y0-20}px;width:40px;height:40px;border:5px solid #38d9c4;border-radius:50%;z-index:7;pointer-events:none`;$('#arena').appendChild(r);r.animate([{transform:'none',opacity:1},{transform:`translate(${x1-x0}px,${y1-y0}px) scale(4)`,opacity:0}],{duration:650,delay:i*180,fill:'both'});rm(r,1500)}await sleep(1000);e.remove()}
  else if(a==='train'){const L=[];for(let i=0;i<4;i++){const e=mk(MI('red_wool'),x0-sg*i*z*1.05,y1+w*.1,z*1.1);L.push(e);wa(e,[{transform:'none'},{transform:`translateX(${x1-x0+sg*z*2}px)`}],550,{easing:'ease-in'})}await sleep(520);L.forEach(e=>rm(e,50))}
  else if(a==='light'){const e=mk(MI('light'),x0+sg*w*.4,y0,z*3,'filter:drop-shadow(0 0 30px #fff)');await wa(e,[{transform:'scale(.3)',opacity:0},{transform:'scale(1)',opacity:1}],350);const fl=document.createElement('div');fl.style.cssText='position:absolute;inset:0;background:#fff;z-index:40;pointer-events:none';$('#arena').appendChild(fl);wa(fl,[{opacity:.95},{opacity:0}],900);rm(fl,1000);e.remove()}
  else if(a==='arrows'){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,ang=Math.atan2(dy,dx)*180/Math.PI+45; // arrow art points up-right, so +45deg aims it along the flight line
    for(let i=0;i<8;i++){const off=(i-3.5)*w*.09;setTimeout(()=>{if(FAST)return;const e=mk(MI('arrow'),x0+nx*off,y0+ny*off,z);wa(e,[{transform:`translate(0px,0px) rotate(${ang}deg)`},{transform:`translate(${dx}px,${dy}px) rotate(${ang}deg)`}],320,{easing:'linear'});rm(e,340)},i*90)}await sleep(8*90+300)}
  else if(a==='flames'){for(let i=0;i<16;i++)setTimeout(()=>{const e=mk(MI('flame'),x1+(Math.random()-.5)*w*.8,y1+w*.2+Math.random()*w*.2,z*.8);wa(e,[{transform:'none',opacity:1},{transform:'translateY(-110px) scale(.3)',opacity:0}],800);rm(e,900)},i*40);await sleep(700)}
  else if(a==='dbl'){f.animate([{transform:'none'},{transform:`translate(${(x1-x0)*.78}px,${(y1-y0)*.4}px)`,offset:.3},{transform:`translate(${(x1-x0)*.78}px,${(y1-y0)*.4}px)`,offset:.8},{transform:'none'}],{duration:1000,easing:'ease-in-out'});await sleep(300);for(let i=0;i<2;i++){const e=mk(MI('mace'),x0+(x1-x0)*.78+sg*w*.3,y0+(y1-y0)*.4-10,z*1.2);oe.animate([{transform:'none'},{transform:`translateX(${sg*16}px)`},{transform:'none'}],{duration:200,delay:120});await wa(e,[{transform:`rotate(${-70*sg}deg)`},{transform:`rotate(${70*sg}deg)`}],220);e.remove();await sleep(60)}}
  else if(a==='claw'){f.animate([{transform:'none'},{transform:`translate(${(x1-x0)*.7}px,${(y1-y0)*.35}px)`,offset:.4},{transform:`translate(${(x1-x0)*.7}px,${(y1-y0)*.35}px)`,offset:.6},{transform:'none'}],{duration:760,easing:'ease-in-out'});await sleep(330);for(let i=0;i<3;i++){const e=document.createElement('div');e.style.cssText=`position:absolute;left:${x1-w*.25+i*w*.22}px;top:${y1-w*.45}px;width:7px;height:${w*.9}px;background:linear-gradient(#fff,#ff3b3b 60%,transparent);border-radius:4px;transform-origin:top;transform:rotate(-28deg);z-index:9;pointer-events:none;box-shadow:0 0 10px #f33`;$('#arena').appendChild(e);wa(e,[{transform:'rotate(-28deg) scaleY(0)',opacity:1},{transform:'rotate(-28deg) scaleY(1)',opacity:1,offset:.4},{transform:'rotate(-28deg) scaleY(1)',opacity:0}],380,{delay:i*70});rm(e,700)}await sleep(480)}
  else if(a==='swirl'){ring(x1,y1,MI('ender_eye'),6,w*.55,1100,z*.7,540);oe.animate([{filter:'none',transform:'none'},{filter:'hue-rotate(180deg) saturate(2)',transform:'rotate(8deg)',offset:.5},{filter:'none',transform:'none'}],{duration:1100});await sleep(1000)}
  return true}
async function fxS0(s,K){const k=SELF[K];if(!k||FAST||!S.fx)return;const f=$('#'+s+'F'),[x0,y0,w]=ctr(s),z=Z(),d=dirOf(s);
  if(k==='glow'){f.animate([{filter:'none'},{filter:'brightness(2) drop-shadow(0 0 26px #ffe45c)'},{filter:'none'}],{duration:1100});await sleep(1000)}
  else if(k==='map'){const e=mk(MI('filled_map'),$('#arena').clientWidth/2,y0-w*.4,z*3);await wa(e,[{transform:'scale(.2) rotate(-30deg)',opacity:0},{transform:'scale(1) rotate(0)',opacity:1}],450);await sleep(500);e.remove()}
  else if(k==='prison'){const b=document.createElement('div');b.style.cssText=`position:absolute;left:${x0-w*.55}px;top:${y0-w*.55}px;width:${w*1.1}px;height:${w*1.1}px;background:url(${MI('iron_bars')}) 0 0/${z*.6}px;image-rendering:pixelated;border:4px solid #777;z-index:7;pointer-events:none`;$('#arena').appendChild(b);await wa(b,[{transform:'scaleY(0)',transformOrigin:'top'},{transform:'scaleY(1)',transformOrigin:'top'}],350);await sleep(800);b.remove()}
  else if(k==='sky'){await wa(f,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-320px)'}],900)}
  else if(k==='eat'){const e=mk(MI('cooked_beef'),x0,y0-w*.35,z*1.4);for(let i=0;i<4;i++){sfx.click();await wa(e,[{transform:`scale(${1-i*.25}) rotate(-12deg)`},{transform:`scale(${.85-i*.25}) rotate(12deg)`}],220)}e.remove()}
  else if(k==='summon'){const e=mk('assets/sprites/chase.png',x0-d*w*.6,y0+w*.05,w*.8);e.style.zIndex=8;await wa(e,[{transform:`translateX(${-d*50}px)`,opacity:0},{transform:'none',opacity:1}],380);f.animate([{filter:'none'},{filter:'brightness(1.8) drop-shadow(0 0 22px #6f6)'},{filter:'none'}],{duration:800});rise(x0,y0,MI('heart'),6,z*.5,900,w*.6);await sleep(800);await wa(e,[{opacity:1},{opacity:0,transform:`translateX(${-d*40}px)`}],300);e.remove()}
  else if(k==='lives'){const t=mk(MI('totem_of_undying'),x0,y0-w*.2,z*1.8);t.style.zIndex=9;wa(t,[{transform:'scale(.3) rotate(-20deg)',opacity:0},{transform:'scale(1.15)',opacity:1,offset:.4},{transform:'scale(1.5)',opacity:0}],1200);rm(t,1250);ring(x0,y0,MI('heart'),9,w*.5,1200,z*.45,360);burst(s,'totem',6);await sleep(1100)}
  else if(k==='honor'){f.animate([{filter:'none'},{filter:'brightness(1.7) drop-shadow(0 0 24px #ffd84a)'},{filter:'none'}],{duration:1100});rise(x0,y0-w*.1,MI('heart'),8,z*.5,1000,w*.7);const e=mk(MI('golden_apple'),x0,y0-w*.5,z*1.3);e.style.zIndex=9;wa(e,[{transform:'scale(.3)',opacity:0},{transform:'scale(1.1)',opacity:1,offset:.4},{transform:'translateY(-20px) scale(1)',opacity:0}],1000);rm(e,1050);await sleep(1000)}
  else if(k==='door'){const dh=Math.min(w*1.35,y0+w*.46-6),dw=dh/2,dx=x0,dy=y0+w*.46-dh,zi=f.style.zIndex;f.style.zIndex=3;
    const wrap=document.createElement('div');wrap.style.cssText=`position:absolute;left:${dx-dw/2}px;top:${dy}px;width:${dw}px;height:${dh}px;z-index:2;pointer-events:none;perspective:${dw*3}px`;
    const hole=document.createElement('div');hole.style.cssText='position:absolute;inset:6% 6% 0 6%;background:radial-gradient(#1a0733,#02000a 75%);box-shadow:inset 0 0 18px #000';
    const leaf=document.createElement('div');leaf.style.cssText=`position:absolute;inset:0;background:url(assets/mc/oak_door_full.png) 0 0/100% 100%;image-rendering:pixelated;transform-origin:0 50%;filter:drop-shadow(0 0 6px #0008)`;
    wrap.append(hole,leaf);$('#arena').appendChild(wrap);
    wrap.animate([{opacity:0,transform:'scale(.7)'},{opacity:1,transform:'none'}],{duration:260,fill:'forwards'});await sleep(260);
    leaf.animate([{transform:'rotateY(0)'},{transform:'rotateY(-105deg)'}],{duration:320,fill:'forwards',easing:'ease-out'});await sleep(340);
    const g=f.animate([{transform:'none',opacity:1,filter:'none'},{transform:'translateY(-6%) scale(.55)',opacity:0,filter:'brightness(.2)'}],{duration:480,fill:'forwards',easing:'ease-in'});await live(g.finished,1500);
    await sleep(380);
    leaf.animate([{transform:'rotateY(-105deg)'},{transform:'rotateY(0)'}],{duration:300,fill:'forwards',easing:'ease-in'});await sleep(330);
    wrap.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'});
    f.animate([{transform:'translateY(-6%) scale(.55)',opacity:0},{transform:'none',opacity:1}],{duration:260,easing:'ease-out'});g.cancel();await sleep(270);wrap.remove();f.style.zIndex=zi}}
const shieldEl=(x,y,h)=>{const e=mk(MI('shield'),x,y,h,'');e.style.width=h*14/24+'px';e.style.left=x-h*14/48+'px';e.style.zIndex=9;return e};
function fxD(s,nat){if(FAST||!S.fx)return;const f=$('#'+s+'F'),[x0,y0,w]=ctr(s),d=dirOf(s);
  if(!nat){const sh=shieldEl(x0+d*w*.42,y0,w*.8);wa(sh,[{transform:'scale(.6)',opacity:0},{transform:'scale(1.25) rotate(8deg)',opacity:1,offset:.3},{transform:'scale(1)',opacity:1,offset:.7},{transform:'scale(1)',opacity:0}],650);rm(sh,700)}
  f.animate([{transform:'none'},{transform:`translateX(${-d*w*.35}px)`,opacity:.55,offset:.35},{transform:`translateX(${-d*w*.35}px)`,opacity:.55,offset:.65},{transform:'none'}],{duration:650,easing:'ease-in-out'})}
function domeFx(s,ms=1100){if(FAST||!S.fx)return;const[x0,y0,w]=ctr(s),r=w*.95,e=document.createElement('div');
  e.style.cssText=`position:absolute;left:${x0-r/2}px;top:${y0-r/2-w*.05}px;width:${r}px;height:${r}px;border-radius:50%;border:4px solid #9eeaff;background:radial-gradient(circle at 35% 30%,#ffffff88,#7fe3ff33 45%,#4aa3ff66);box-shadow:0 0 22px #7fe3ff,inset 0 0 22px #bff4ff;z-index:9;pointer-events:none`;
  $('#arena').appendChild(e);e.animate([{transform:'scale(.2)',opacity:0},{transform:'scale(1.12)',opacity:1,offset:.3},{transform:'scale(1)',opacity:1,offset:.8},{transform:'scale(1.05)',opacity:0}],{duration:ms,easing:'ease-out'});rm(e,ms+50)}
function fxG(s,K){if(FAST||!S.fx)return;const f=$('#'+s+'F'),[x0,y0,w]=ctr(s),z=Z(),d=dirOf(s);
  if(K==='voidrisez:Nilli'||K==='etrosion:It was kinda like destiny'){
    const bk=mk(MI('writable_book'),x0,y0-w*.62,z*2);bk.style.zIndex=9;wa(bk,[{transform:'scale(.2) rotate(-25deg)',opacity:0},{transform:'scale(1) rotate(0)',opacity:1,offset:.25},{transform:'translateY(-8px)',opacity:1,offset:.8},{transform:'translateY(-14px)',opacity:0}],1250);rm(bk,1300);
    setTimeout(()=>{const sh=shieldEl(x0+d*w*.42,y0,w*.8);wa(sh,[{transform:'scale(.2)',opacity:0},{transform:'scale(1.15)',opacity:1,offset:.3},{transform:'scale(1)',opacity:1,offset:.85},{transform:'scale(1)',opacity:0}],900);rm(sh,950)},500)}
  else if(K==='sora:Dome'){domeFx(s,1300);burst(s,'diamond',4)}
  else if(K==='burg:Lock In'){const b=mk(MI('barrier'),x0+d*w*.45,y0-w*.05,z*1.8);b.style.zIndex=9;wa(b,[{transform:'scale(.2)',opacity:0},{transform:'scale(1.3)',opacity:1,offset:.25},{transform:'translateX(-5px)',offset:.4},{transform:'translateX(5px)',offset:.55},{transform:'translateX(0)',opacity:1,offset:.8},{transform:'scale(1)',opacity:0}],1100);rm(b,1150);f.animate([{filter:'none'},{filter:'brightness(1.5) drop-shadow(0 0 16px #f33)'},{filter:'none'}],{duration:900})}
  else if(K==='mikeanike:Vedo'){const e=mk(MI('totem_of_undying'),$('#arena').clientWidth/2,y0-w*.2,z*2.4);wa(e,[{transform:'scale(.3) rotate(-20deg)',opacity:0},{transform:'scale(1.2) rotate(0)',opacity:1,offset:.5},{transform:'scale(1.6)',opacity:0}],1200);rm(e,1300);burst(s,'totem',8)}
  else if(K==='chase:I Am A Chud')f.animate([{transform:'none',opacity:1},{transform:`translateX(${-d*w*1.1}px)`,opacity:.2,offset:.5},{transform:'none',opacity:1}],{duration:1300});
  else{const e=document.createElement('div'),cp='polygon(0 0,100% 0,100% 55%,50% 100%,0 55%)',sz=w*.5;e.style.cssText=`position:absolute;left:${x0+d*w*.45-sz/2}px;top:${y0-sz*.6}px;width:${sz}px;height:${sz*1.15}px;clip-path:${cp};background:url(${MI('iron_block')}) 0 0/${z*.6}px;image-rendering:pixelated;z-index:7;pointer-events:none`;e.innerHTML=`<div style="position:absolute;inset:12%;clip-path:${cp};background:url(${MI('oak_planks')}) 0 0/${z*.6}px;image-rendering:pixelated"></div>`;$('#arena').appendChild(e);wa(e,[{transform:'scale(.2)',opacity:0},{transform:'scale(1)',opacity:1,offset:.25},{transform:'scale(1)',opacity:1,offset:.8},{transform:'scale(1)',opacity:0}],1200);rm(e,1300)}}

function trail(e,ms){if(!S.fx||FAST)return;const a=$('#arena'),ar=a.getBoundingClientRect(),t0=performance.now(),iv=setInterval(()=>{if(performance.now()-t0>ms+80||!e.isConnected){clearInterval(iv);return}const r=e.getBoundingClientRect(),g=e.cloneNode();g.style.cssText=e.style.cssText+`;animation:none;transition:none;left:${r.left-ar.left+r.width/2-parseFloat(e.style.width)/2}px;top:${r.top-ar.top+r.height/2-parseFloat(e.style.height)/2}px;opacity:.45;transform:scale(.85);filter:blur(1px) brightness(1.5);z-index:6;`;a.appendChild(g);g.animate([{opacity:.45,transform:'scale(.85)'},{opacity:0,transform:'scale(.3)'}],{duration:320,fill:'forwards'});setTimeout(()=>g.remove(),340)},35)}
function ringFx(x,y,col,size,ms=520,wd=5){const e=document.createElement('div');e.style.cssText=`position:absolute;left:${x-size/2}px;top:${y-size/2}px;width:${size}px;height:${size}px;border:${wd}px solid ${col};border-radius:50%;z-index:30;pointer-events:none;box-shadow:0 0 14px ${col},inset 0 0 10px ${col}`;$('#arena').appendChild(e);e.animate([{transform:'scale(.1)',opacity:1},{transform:'scale(1)',opacity:0}],{duration:ms,easing:'ease-out',fill:'forwards'});setTimeout(()=>e.remove(),ms+30)}
function sparks(x,y,col,n,len){for(let i=0;i<n;i++){const a=Math.PI*2*i/n+Math.random()*.4,e=document.createElement('div'),d=len*(.7+Math.random()*.6);e.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${3+Math.random()*3}px;height:${12+Math.random()*10}px;background:linear-gradient(#fff,${col});border-radius:3px;z-index:31;pointer-events:none;transform-origin:50% 0;box-shadow:0 0 8px ${col}`;$('#arena').appendChild(e);const r=a*180/Math.PI-90;e.animate([{transform:`rotate(${r}deg) translateY(0) scaleY(.4)`,opacity:1},{transform:`rotate(${r}deg) translateY(${d}px) scaleY(1)`,opacity:1,offset:.4},{transform:`rotate(${r}deg) translateY(${d*1.5}px) scaleY(.2)`,opacity:0}],{duration:520,easing:'ease-out',fill:'forwards'});setTimeout(()=>e.remove(),560)}}
function impactFx(side,n){if(!S.fx||FAST)return;const[x,y,w]=ctr(side),a=$('#arena'),big=n>=25,col=n>=25?'#ffd84a':n>=15?'#ffffff':'#ffb0b0';
  if(big){ringFx(x,y,col,w*1.5,480);ringFx(x,y,'#ff5a3c',w*2,650,3)}sparks(x,y,col,big?16:9,w*(big?.8:.55));
  const sl=document.createElement('div');sl.style.cssText=`position:absolute;left:${x-w*.5}px;top:${y-3}px;width:${w}px;height:6px;background:linear-gradient(90deg,transparent,#fff,transparent);z-index:32;pointer-events:none;box-shadow:0 0 12px #fff`;a.appendChild(sl);sl.animate([{transform:'rotate(-35deg) scaleX(0)',opacity:1},{transform:'rotate(-35deg) scaleX(1.2)',opacity:1,offset:.4},{transform:'rotate(-35deg) scaleX(1.2)',opacity:0}],{duration:300,fill:'forwards'});setTimeout(()=>sl.remove(),320);
  if(big){const fl=document.createElement('div');fl.style.cssText='position:absolute;inset:0;background:radial-gradient(circle at '+x+'px '+y+'px,#fff,#ffd84a66 40%,transparent 70%);z-index:29;pointer-events:none';a.appendChild(fl);fl.animate([{opacity:.9},{opacity:0}],{duration:420,fill:'forwards'});setTimeout(()=>fl.remove(),440)}
  $('#'+side+'F').animate([{scale:'1'},{scale:big?'1.12':'1.06'},{scale:'1'}],{duration:240})}
function healFx(side){if(!S.fx||FAST)return;const[x,y,w]=ctr(side);ringFx(x,y+w*.3,'#5dff7a',w*1.1,700,4);
  for(let i=0;i<9;i++)setTimeout(()=>{const e=document.createElement('div');e.textContent='+';e.style.cssText=`position:absolute;left:${x+(Math.random()-.5)*w*.8}px;top:${y+w*.25+Math.random()*w*.2}px;color:#7dff8f;font:bold ${14+Math.random()*12}px monospace;text-shadow:0 0 8px #2e9d3a;z-index:31;pointer-events:none`;$('#arena').appendChild(e);e.animate([{transform:'translateY(0)',opacity:0},{opacity:1,offset:.2},{transform:`translateY(${-w*.7}px)`,opacity:0}],{duration:900,fill:'forwards'});setTimeout(()=>e.remove(),950)},i*70)}
function guardRing(side){}
{const _ft=floatText;floatText=function(side,text,color){_ft(side,text,color);const n=parseInt(String(text).replace(/[^\d]/g,''))||0;if(String(text)[0]==='-')impactFx(side,n);else if(String(text)[0]==='+')healFx(side)}}
{const _fxG=fxG;fxG=function(s,K){_fxG(s,K);guardRing(s)}}
{const _ex=exec;exec=async function(f,o,mv){if(S.fx&&!FAST&&B&&!B.over){const fs=sideOf(f),k=mv.guard?'guard':(mv.heal&&!mv.dmg&&!mv.rdmg)?'heal':(mv.dmg||mv.rdmg)?'atk':'stat',col=f.m.glow,nm=(B.p&&!B.spec&&B.p.rand==='blind'&&fs==='e')?'. . .':f.rand==='scramble'?'???':mv.n;
    $('#'+fs+'F').animate([{filter:'none'},{filter:`drop-shadow(0 0 22px ${col}) brightness(1.3)`,offset:.4},{filter:'none'}],{duration:700});await sleep(380)}
    return _ex(f,o,mv)}}

(function(){
  if(cloudOn()){
    fauth.onAuthStateChanged(async fu=>{
      if(me||!fu)return;
      try{const k=localStorage.getItem(SES);if(!k||fu.email!==cMail(k))return;try{await cloudPull(k)}catch(e){}const u=getUsers()[k];if(!u||me)return;me={key:k,name:u.name};show('menu')}catch(e){}
    });
    return;
  }
  try{const k=localStorage.getItem(SES),u=getUsers()[k];if(k&&u){me={key:k,name:u.name};show('menu')}}catch(e){}
})();
{const _rb=renderBoard;renderBoard=function(){_rb();if(cloudOn())cloudBoard().then(()=>{if($('#screen-board').classList.contains('active'))_rb()}).catch(()=>{})}}
