/* ==========================================================================
   story-data.js - characters, outfits, tools, foes and lore for Story Mode.
   Edit usernames here if a skin is wrong (user = Minecraft username).
   ========================================================================== */
(function () {
  'use strict';
  const all = m => ({ h: m, c: m, l: m, b: m });

  /* ---- village armour rules (every village: Rank 1 + 2 = netherite, Rank 3 = diamond) ----
     LEAF  : WARD trim on the chestplate only  (tier1 diamond, tier2 lapis, tier3 emerald)
     CLOUD : SILENCE trim on the chestplate only (tier1 iron, tier2 quartz, tier3 quartz+amethyst)
     ROCK  : TIDE trim on every piece - netherite trim on the chestplate, redstone trim on helmet/leggings/boots
     VOID  : Void Risez and his men wear SILENCE trim with amethyst (purple) on every piece        */
  const OUT = {
    leaf1: { armor: all('netherite'), trims: { c: ['ward', 'diamond'] } },
    leaf2: { armor: all('netherite'), trims: { c: ['ward', 'lapis'] } },
    leaf3: { armor: all('diamond'), trims: { c: ['ward', 'emerald'] } },
    cloud1: { armor: all('netherite'), trims: { c: ['silence', 'iron'] } },
    cloud2: { armor: all('netherite'), trims: { c: ['silence', 'quartz'] } },
    cloud3: { armor: all('diamond'), trims: { c: ['silence', 'quartz+amethyst'] } },
    cloudsoldier: { armor: all('netherite'), trims: { c: ['silence', 'quartz+amethyst'] } },
    m7vn: { armor: all('netherite'), trims: { c: ['silence', 'gold'] } },
    voidm2: { armor: all('netherite'), trims: { c: ['silence', 'amethyst'], h: ['silence', 'amethyst'], l: ['silence', 'amethyst'], b: ['silence', 'amethyst'] } },
    voidm3: { armor: all('diamond'), trims: { c: ['silence', 'amethyst'], h: ['silence', 'amethyst'], l: ['silence', 'amethyst'], b: ['silence', 'amethyst'] } },
    duperlord: { ench: true, armor: all('netherite'), trims: { c: ['silence', 'amethyst'], h: ['silence', 'amethyst'], l: ['silence', 'amethyst'], b: ['silence', 'amethyst'] } },
    voidlord: { armor: all('netherite'), trims: { c: ['silence', 'amethyst'], h: ['silence', 'amethyst'], l: ['silence', 'amethyst'], b: ['silence', 'amethyst'] } },
    rock1: { armor: all('netherite'), trims: { c: ['tide', 'netherite'], h: ['tide', 'redstone'], l: ['tide', 'redstone'], b: ['tide', 'redstone'] } },
    rock2: { armor: all('netherite'), trims: { c: ['tide', 'netherite'], h: ['tide', 'redstone'], l: ['tide', 'redstone'], b: ['tide', 'redstone'] } },
    rock3: { armor: all('diamond'), trims: { c: ['tide', 'netherite'], h: ['tide', 'redstone'], l: ['tide', 'redstone'], b: ['tide', 'redstone'] } },
    iron: { armor: all('iron') }, copper: { armor: all('copper') }, gold: { armor: all('gold') }, chain: { armor: all('chainmail') },
    netherite: { armor: all('netherite') }, diamond: { armor: all('diamond') }, leather: { armor: all('leather') },
    villager: { armor: { h: 'leather', c: 'chainmail', l: 'leather', b: 'iron' } }
  };

  /* ---- characters ---- */
  const CH = {
    mike:      { name: 'Mike', user: 'mikeanike132', skin: 'kai', out: 'iron', item: 'iron_sword', color: '#c79bff' },
    sora:      { name: 'Sora', user: 'soraio_', skin: 'ari', out: 'copper', item: 'copper_sword', color: '#ff9a3c' },
    erosion:   { name: 'Etrosion', user: '', skinFile: 'assets/skins/etrosion.png', skin: 'efe', out: 'leaf1', item: 'trident', color: '#6bb8ff', tag: 'Leaf Village Leader' },
    burg:      { name: 'Burg', user: 'itsburg', skin: 'makena', out: 'rock1', item: 'iron_axe', color: '#9be37f', tag: 'Rock Village Leader' },
    m7vn:      { name: 'M7vn', user: 'm7vn', skin: 'noor', out: 'm7vn', item: 'diamond_sword', color: '#ff7a5a', tag: 'Cloud Village Leader' },
    kneervous: { name: 'Kneervous', user: 'kneervous', skin: 'sunny', out: 'leaf1', item: 'mace', color: '#ff9ecb', tag: 'Rank 1 Master' },
    nukoz:     { name: 'Nukoz', user: 'nukoz', skin: 'zuri', out: 'leaf1', item: 'mace', color: '#ffe62e', tag: 'Rank 1 Master' },
    chase:     { name: 'Chase', user: 'hiamchase', skin: 'steve', out: 'leaf2', item: 'iron_sword', color: '#b08cff', tag: 'Rank 2 Elite' },
    bruce:     { name: 'Brucekraft', user: 'brucekr4ft', skin: 'alex', slim: true, out: 'leaf2', item: 'mace', color: '#d9a066', tag: 'Rank 2 Elite' },
    void:      { name: 'Void Risez', user: 'voidrisez', skin: 'noor', out: 'duperlord', item: 'mace', color: '#b48cff', tag: 'Master Duper' },
    // Master Duper: Void Risez's skin, enchanted netherite armour, wielding a mace
    duper:     { name: 'Master Duper', user: 'voidrisez', skin: 'noor', out: 'duperlord', item: 'mace', color: '#b48cff', tag: 'Guardian of The End' },
    // josh3773 is the Guardian of The End in Chapter 10
    josh:      { name: 'josh3773', user: 'josh3773', skin: 'kai', out: 'gold', item: 'golden_axe', color: '#ffd24a', tag: 'Guardian of The End' },
    bguard:    { rand: true, name: 'Bridge Guardian', user: '', skin: 'kai', out: 'gold', item: 'golden_axe', color: '#ffd24a', tag: 'Bridge Guardian' },
    leafguard: { rand: true, name: 'Leaf Guard', user: '', skin: 'steve', out: 'leaf3', band: '#2f7a2a', item: 'iron_spear', color: '#8fd68a' },
    rockguard: { rand: true, name: 'Rock Guard', user: '', skin: 'alex', out: 'rock3', item: 'iron_spear', color: '#c9c9c9' },
    guide:     { rand: true, name: 'Village Guide', user: '', skin: 'sunny', out: 'leaf3', band: '#2f7a2a', item: 'iron_sword', color: '#8fd68a' },
    messenger: { rand: true, name: 'Rock Messenger', user: '', skin: 'zuri', out: 'rock3', item: null, color: '#c9c9c9', pose: 'walk' },
    lmessenger:{ rand: true, name: 'Leaf Messenger', user: '', skin: 'zuri', out: 'leaf3', band: '#2f7a2a', item: null, color: '#8fd68a', pose: 'walk' },
    masked:    { rand: true, name: 'Masked Fighter', user: '', skin: 'efe', out: 'voidm2', mask: '#15151a', item: 'iron_sword', color: '#ff8a8a' },
    masked2:   { rand: true, name: 'Masked Fighter', user: '', skin: 'makena', out: 'voidm2', mask: '#15151a', item: 'iron_axe', color: '#ff8a8a' },
    maskedboss:{ rand: true, name: 'Masked Leader', user: '', skin: 'ari', out: 'voidm2', mask: '#15151a', item: 'netherite_sword', color: '#ff8a8a' },
    cmdr:      { rand: true, name: 'Cloud Tier 2', user: '', skin: 'kai', out: 'voidm2', mask: '#15151a', item: 'netherite_axe', color: '#ff8a8a' },
    cloudguard:{ rand: true, name: 'Cloud Tier 3', user: '', skin: 'noor', out: 'cloudsoldier', item: 'iron_spear', color: '#ffb08a' },
    cloudcap:  { rand: true, name: 'Cloud Tier 2', user: '', skin: 'steve', out: 'cloud2', item: 'diamond_sword', color: '#ffb08a' },
    scout:     { rand: true, name: 'Scout', user: '', skin: 'sunny', out: 'leaf3', band: '#2f7a2a', item: 'bow', color: '#8fd68a' },
    cand:      { rand: true, name: 'Candidate', user: '', skin: 'efe', out: 'leaf3', band: '#2f7a2a', item: 'iron_sword', color: '#8fd68a' },
    dummy:     { name: 'Training Dummy', user: '', skin: 'steve', out: 'iron', item: null, color: '#cccccc' },
    rockninja: { rand: true, name: 'Rock Ninja', user: '', skin: 'zuri', out: 'rock2', item: 'iron_axe', color: '#c9c9c9' },
    villager:  { rand: true, name: 'Villager', user: '', skin: 'steve', out: 'villager', item: null, color: '#ddd' },
    chud:      { name: 'Chud', user: 'hiamchase', skin: 'steve', out: 'leaf3', band: '#2f7a2a', item: null, color: '#b08cff' }
  };
  // mob skins (from the texture pack) that generic NPCs can randomly wear instead of a player skin
  const ENTS = ['zombie', 'husk', 'drowned', 'zombified_piglin', 'vindicator', 'pillager', 'evoker'];
  // which engine mon belongs to which character
  const MONMAP = { mikeanike: 'mike', sora: 'sora', nukoz: 'nukoz', bruce: 'bruce', kneervous: 'kneervous', chase: 'chase', etrosion: 'erosion', burg: 'burg', voidrisez: 'void', mlvlnt: 'm7vn' };

  /* ---- hero tools (everything uses icons from the texture pack) ---- */
  const T = (n, icon, m, fx, snd, o) => Object.assign({ n, icon, m, fx, snd }, o || {});
  const TOOLS = {
    iron_sword:   T('Iron Sword', 'iron_sword', { dmg: 13, k: '{v} was slashed by {k}', d: 'A quick slash. 13 damage.' }, { a: 'melee', i: 'iron_sword' }, 'sword_swing'),
    shield:       T('Shield Block', 'shield', { guard: 'blockatk', d: 'Raise your shield and block the next attack.' }, null, null, { img: 'assets/mc/shield_block.png' }),
    pearl:        T('Ender Pearl Step', 'ender_pearl', { guard: 'dodge', d: 'Blink away and dodge the next attack.' }, null, 'ender_pearl'),
    apple:        T('Golden Apple', 'golden_apple', { heal: 20, d: 'Eat a golden apple and restore 20 HP.' }, null, null),
    bow:          T('Bow Shot', 'bow', { dmg: 11, k: '{v} was shot by {k}', d: 'Shoots an arrow for 11 damage.' }, { a: 'throw', i: 'arrow' }, 'bow'),
    fire:         T('Fire Charge', 'fire_charge', { dmg: 6, burn: true, k: '{v} was burned by {k}', d: '6 damage and burns one of the foe\'s moves for 2 rounds.' }, { a: 'throw', i: 'fire_charge', fl: 1 }, 'fire_charge'),
    iron_axe:     T('Iron Axe', 'iron_axe', { dmg: 16, k: '{v} was chopped by {k}', d: 'A heavy chop for 16 damage.' }, { a: 'melee', i: 'iron_axe' }, 'sword_swing'),
    iron_pickaxe: T('Pickaxe Break', 'iron_pickaxe', { dmg: 12, distract: true, k: '{v} was mined by {k}', d: '12 damage and distracts the foe for a turn.' }, { a: 'melee', i: 'iron_pickaxe' }, 'anvil'),
    iron_spear:   T('Spear Thrust', 'iron_spear', { dmg: 15, k: '{v} was skewered by {k}', d: 'A long thrust for 15 damage.' }, { a: 'melee', i: 'iron_spear', th: 1 }, 'sword_swing'),
    rod:          T('Fishing Rod Yank', 'fishing_rod', { dmg: 5, distract: true, k: '{v} was reeled in by {k}', d: '5 damage and the foe loses their turn.' }, { a: 'throw', i: 'fishing_rod' }, 'sword_swing'),
    diamond_sword:T('Diamond Sword', 'diamond_sword', { dmg: 18, k: '{v} was cut down by {k}', d: 'A diamond slash for 18 damage.' }, { a: 'melee', i: 'diamond_sword' }, 'sword_swing'),
    diamond_axe:  T('Diamond Axe', 'diamond_axe', { dmg: 22, k: '{v} was cleaved by {k}', d: 'A diamond cleave for 22 damage.' }, { a: 'melee', i: 'diamond_axe' }, 'sword_swing'),
    trident:      T('Trident Throw', 'trident', { dmg: 20, special: 'trident', k: '{v} was impaled by {k}', d: '20 damage, 50% chance of 5 more on the way back.' }, { a: 'throw', i: 'trident' }, 'trident_stab'),
    mace:         T('Mace Smash', 'mace', { dmg: 25, k: '{v} was smashed by {k}', d: 'Leap up and smash down for 25 damage.' }, { a: 'slam', i: 'mace', l: 0 }, 'mace_slam'),
    eye:          T('Eye of Ender', 'ender_eye', { confuse: true, d: 'The foe is confused and uses a random move.' }, { a: 'throw', i: 'ender_eye' }, 'ender_pearl'),
    netherite_sword: T('Netherite Sword', 'netherite_sword', { dmg: 22, k: '{v} was executed by {k}', d: 'The strongest blade: 22 damage.' }, { a: 'melee', i: 'netherite_sword' }, 'sword_swing'),
    netherite_axe: T('Netherite Axe', 'netherite_axe', { dmg: 26, k: '{v} was obliterated by {k}', d: 'A netherite axe for 26 damage.' }, { a: 'melee', i: 'netherite_axe' }, 'anvil'),
    totem:        T('Totem of Undying', 'totem_of_undying', { heal: 30, d: 'Pop a totem and restore 30 HP.' }, null, 'xp_orb')
  };
  const START_TOOLS = ['iron_sword', 'shield', 'pearl', 'apple'];

  /* ---- foes: story-only fighters (each move names the pack icon used for its effect) ---- */
  const MV = (n, dmg, a, icon, snd, extra) => Object.assign({ n, dmg, k: '{v} was slain by {k}', d: n, _fx: { a, i: icon }, _snd: snd }, extra || {});
  const GD = (n, guard, d) => ({ n, guard, d: d || n });
  const FOES = {
    dummy:   { skinKey: 'dummy', name: 'Training Dummy', hp: 45, moves: [MV('Wobble', 3, 'melee', 'stick', 'sword_swing', { k: '{v} was bonked by {k}' }), MV('Spin', 4, 'melee', 'stick', 'sword_swing')] },
    sora_s:  { base: 'sora', skinKey: 'sora', name: 'Sora', hp: 80 },
    masked:  { skinKey: 'masked', name: 'Masked Fighter', hp: 30, moves: [MV('Slash', 7, 'melee', 'iron_sword', 'sword_swing'), MV('Kunai', 5, 'throw', 'arrow', 'bow'), GD('Smoke Step', 'dodge', 'Dodges the next attack.')] },
    masked2: { skinKey: 'masked2', name: 'Masked Fighter', hp: 30, moves: [MV('Axe Swing', 8, 'melee', 'iron_axe', 'sword_swing'), MV('Throwing Axe', 5, 'throw', 'iron_axe', 'sword_swing'), GD('Guard Up', 'blockatk')] },
    maskedboss: { skinKey: 'maskedboss', name: 'Masked Leader', hp: 55, moves: [MV('Dark Slash', 11, 'melee', 'netherite_sword', 'sword_swing'), MV('Shadow Kunai', 8, 'throw', 'arrow', 'bow'), GD('Vanish', 'dodge'), MV('Ender Eye', 14, 'throw', 'fire_charge', 'fire_charge', { fl: 1 })] },
    cand1:   { skinKey: 'cand', pop: true, name: 'Candidate Ren', hp: 35, moves: [MV('Slash', 8, 'melee', 'iron_sword', 'sword_swing'), GD('Guard', 'blockatk'), MV('Kick', 5, 'melee', 'iron_sword', 'sword_swing')] },
    cand2:   { skinKey: 'cand', pop: true, name: 'Candidate Aya', hp: 40, moves: [MV('Arrow Rain', 9, 'throw', 'arrow', 'bow'), MV('Slash', 8, 'melee', 'iron_sword', 'sword_swing'), GD('Sidestep', 'dodge')] },
    cand3:   { skinKey: 'cand', pop: true, name: 'Candidate Taro', hp: 45, moves: [MV('Axe Chop', 11, 'melee', 'iron_axe', 'sword_swing'), MV('Spear Jab', 8, 'melee', 'iron_spear', 'sword_swing', { th: 1 }), GD('Brace', 'blockatk')] },
    candfin: { skinKey: 'cand', pop: true, name: 'Final Candidate', hp: 70, moves: [MV('Diamond Strike', 13, 'melee', 'diamond_sword', 'sword_swing'), MV('Axe Chop', 12, 'melee', 'iron_axe', 'sword_swing'), GD('Brace', 'blockatk'), { n: 'Apple Break', heal: 8, d: 'heal' }] },
    cmdr:    { skinKey: 'cmdr', name: 'Cloud Tier 2', hp: 100, moves: [MV('Cloud Axe', 15, 'melee', 'netherite_axe', 'anvil'), MV('Silence Strike', 10, 'throw', 'ender_pearl', 'ender_pearl'), GD('Iron Guard', 'tank'), { n: 'Smoke Bomb', blind: true, d: 'blinds you', _fx: { a: 'throw', i: 'splash_potion' } }] },
    raider:  { skinKey: 'masked', name: 'Cloud Tier 3', hp: 32, moves: [MV('Slash', 8, 'melee', 'iron_sword', 'sword_swing'), MV('Kunai', 6, 'throw', 'arrow', 'bow')] },
    raider2: { skinKey: 'masked2', name: 'Cloud Tier 3', hp: 36, moves: [MV('Axe Swing', 9, 'melee', 'iron_axe', 'sword_swing'), GD('Guard Up', 'blockatk')] },
    ambush:  { skinKey: 'cloudcap', name: 'Cloud Tier 2', hp: 70, moves: [MV('Diamond Slash', 12, 'melee', 'diamond_sword', 'sword_swing'), MV('Wind Burst', 9, 'throw', 'wind_charge', 'sword_swing'), GD('Cloud Step', 'dodge'), { n: 'Mist', hideHp: true, d: 'hides HP' }] },
    m7_s:    { base: 'mlvlnt', skinKey: 'm7vn', name: 'M7vn', hp: 85, flee: true },
    warm:    { skinKey: 'masked', name: 'Cloud Tier 3', hp: 34, moves: [MV('Slash', 9, 'melee', 'iron_sword', 'sword_swing'), MV('Kunai', 7, 'throw', 'arrow', 'bow'), GD('Smoke Step', 'dodge')] },
    warm2:   { skinKey: 'masked2', name: 'Cloud Tier 3', hp: 36, moves: [MV('Axe Swing', 10, 'melee', 'iron_axe', 'sword_swing'), GD('Guard Up', 'blockatk')] },
    warcmdr: { skinKey: 'cmdr', name: 'Cloud Tier 1', hp: 120, moves: [MV('Warlord Axe', 17, 'melee', 'netherite_axe', 'anvil'), MV('Silence Wave', 11, 'throw', 'wind_charge', 'sword_swing'), GD('Iron Guard', 'tank'), { n: 'Smoke Bomb', blind: true, d: 'blinds you', _fx: { a: 'throw', i: 'splash_potion' } }] },
    guardian:{ skinKey: 'bguard', name: 'Bridge Guardian', hp: 110, moves: [MV('Stone Fist', 16, 'melee', 'iron_axe', 'anvil'), MV('Rubble Throw', 11, 'throw', 'cobweb', 'anvil'), GD('Stone Skin', 'tank')] },
    duper1:  { skinKey: 'josh', name: 'josh3773', hp: 120, moves: [MV('Guardian Slash', 14, 'melee', 'golden_axe', 'sword_swing'), MV('Golden Throw', 10, 'throw', 'golden_apple', 'sword_swing'), GD('Guardian Guard', 'blockatk'), { n: 'Duplicate', heal: 8, d: 'heal' }] },
    duper2:  { skinKey: 'josh', name: 'josh3773', hp: 130, moves: [MV('Double Mace', 12, 'melee', 'mace', 'mace_hit', { hits: 2, k: '{v} was smashed by {k}' }), MV('Mirror Strike', 18, 'melee', 'golden_axe', 'anvil'), GD('Echo Step', 'dodge'), { n: 'Hide Bars', hideHp: true, d: 'hides HP' }] },
    void1:   { skinKey: 'void', name: 'Void Risez', hp: 100, moves: [MV('Void Dart', 12, 'throw', 'arrow', 'bow'), MV('Dark Blade', 16, 'melee', 'netherite_sword', 'sword_swing'), GD('Void Step', 'dodge')], vl: 'voidrisez' },
    void2:   { skinKey: 'void', name: 'Void Risez', hp: 105, moves: [MV('Crashout', 20, 'throw', 'fire_charge', 'fire_charge', { self: 8, fl: 1 }), MV('Ragebait', 15, 'throw', 'splash_potion', 'splash'), GD('Nilli', 'dodge'), { n: 'Void Mist', blind: true, d: 'blind', _fx: { a: 'throw', i: 'splash_potion' } }], vl: 'voidrisez' },
    void3:   { skinKey: 'void', name: 'Void Risez', hp: 90, moves: [MV('Last Stand', 22, 'melee', 'netherite_sword', 'anvil'), MV('Void Storm', 18, 'throw', 'ender_eye', 'ender_pearl'), GD('Nilli', 'dodge'), { n: 'Leave', heal: 15, d: 'heal' }], vl: 'voidrisez' },
    // post-game
    sora_r:  { base: 'sora', skinKey: 'sora', name: 'Sora', hp: 150 },
    kneervous_r: { base: 'kneervous', skinKey: 'kneervous', name: 'Kneervous', hp: 150 },
    nukoz_r: { base: 'nukoz', skinKey: 'nukoz', name: 'Nukoz', hp: 150 },
    chase_r: { base: 'chase', skinKey: 'chase', name: 'Chase', hp: 150 },
    bruce_r: { base: 'bruce', skinKey: 'bruce', name: 'Brucekraft', hp: 150 },
    erosion_r: { base: 'etrosion', skinKey: 'erosion', name: 'Etrosion', hp: 150 },
    burg_r:  { base: 'burg', skinKey: 'burg', name: 'Burg', hp: 150 },
    m7_r:    { base: 'mlvlnt', skinKey: 'm7vn', name: 'M7vn', hp: 150 },
    mike_r:  { base: 'mikeanike', skinKey: 'mike', name: 'Mike', hp: 120 },
    duper_r: { skinKey: 'duper', name: 'Master Duper', hp: 190, moves: [MV('Double Mace', 14, 'melee', 'mace', 'mace_hit', { hits: 2, k: '{v} was smashed by {k}' }), MV('Mirror Strike', 22, 'melee', 'golden_axe', 'anvil'), GD('Echo Step', 'dodge'), { n: 'Duplicate', heal: 20, d: 'heal' }] },
    void_r:  { base: 'voidrisez', skinKey: 'void', name: 'Void Risez', hp: 210 },
    ghost1:  { skinKey: 'cloudguard', name: 'Ruin Guardian', hp: 90, moves: [MV('Stone Smash', 15, 'melee', 'iron_axe', 'anvil'), GD('Stone Skin', 'tank'), MV('Rubble', 10, 'throw', 'cobweb', 'anvil')] }
  };

  /* ---- lore pages unlocked in the post-game ---- */
  const LORE = [
    { id: 'l1', t: 'The First Warrior', x: 'Long before the three villages, a warrior named Rizan trained until no one in the world could stand against them. Strength alone was never enough for Rizan, so the warrior walked to The End to look for more.' },
    { id: 'l2', t: 'The Gateway', x: 'The gateway to The End opens only when the villages fight each other. Every conflict feeds it a little. That is why the attacks were never random: someone needed the villages divided.' },
    { id: 'l3', t: 'The Eye Mark', x: 'The Eye of Ender is the mark of Void Risez. Cloud scouts carved it into trees, wagons and walls. Many of them never knew whose mark they were carving. His men wear silence trims dyed amethyst purple.' },
    { id: 'l4', t: 'josh3773', x: 'josh3773 was the last guardian chosen to protect The End. He did not guard it to keep people out, he guarded it to find out who was worth letting in.' },
    { id: 'l5', t: 'Cloud Village', x: 'Cloud Village was promised the rule of the three villages if the gateway opened. Its people were told that Leaf and Rock were plotting against them. Not every Cloud ninja believed it.' },
    { id: 'l6', t: 'The Power Beyond', x: 'The power of The End answers to whoever believes they can never be defeated. That belief is the real weakness. It is the reason Void Risez fell.' },
    { id: 'l7', t: 'A Ninja\'s Choice', x: 'The oldest Leaf scroll says: a ninja is not measured by the powers they hold, but by what they choose to do with them.' }
  ];

  window.StoryData = { OUT, CH, MONMAP, TOOLS, START_TOOLS, FOES, LORE, ENTS, all };
})();
