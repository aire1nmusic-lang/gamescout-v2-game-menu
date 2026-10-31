// Real GameScout art (copied from the site's public/media). Paths are relative to the page.
const B = import.meta.env.BASE_URL
const w = (path, size) => `${B}media/worlds/${path}-${size}.webp`
export const rank = file => `${B}media/ranks/${file}`
export const ui = file => `${B}media/ui/${file}`
export const before = (world, device) => `${B}before/${world}-${device}.webp`

export const ART = {
  l2: {
    hero: { d: w('lineage-2/master', 2560), m: w('lineage-2/master-v9-mobile', 720), mid: w('lineage-2/master', 1600) },
    tower: { d: w('lineage-2/tower-v1', 2000), m: w('lineage-2/tower-v1-mobile', 1080) },
    avatar: ui('lineage2-default-avatar.webp'),
    medal: n => rank(`medal-${n}-glass-192.webp`),
    support: [
      { bg: rank('l2-top1-bg-1600.webp'), hero: rank('l2-top3-hero-600.webp') },
      { bg: rank('l2-top2-1600.webp') },
      { bg: rank('l2-top3-1600.webp') },
    ],
    people: [
      { bg: rank('l2-people1-1600.webp'), hero: rank('l2-people1-hero-600.webp') },
      { bg: rank('l2-people2-1600.webp') },
      { bg: rank('l2-people3-1600.webp') },
    ],
  },
  mc: {
    hero: { d: w('minecraft/master', 2560), m: w('minecraft/master', 800), mid: w('minecraft/master', 1600) },
    avatar: ui('minecraft-default-avatar-approved-v2.webp'),
    medal: n => rank(`minecraft-rank-${n}-approved-v1.webp`),
    support: [
      { bg: rank('minecraft-support-1-bg-v3.webp'), hero: rank('minecraft-support-1-hero-v3.webp'), character: 'Steve' },
      { bg: rank('minecraft-top-2-character-v1-800.webp') },
      { bg: rank('minecraft-top-3-character-v1-800.webp') },
    ],
    people: [
      { bg: rank('minecraft-people-1-bg-v3.webp'), hero: rank('minecraft-people-1-hero-v3.webp'), character: 'Alex' },
      { bg: rank('minecraft-people-2-character-v2-800.webp') },
      { bg: rank('minecraft-people-3-character-v2-800.webp') },
    ],
  },
  gta: {
    hero: { d: w('gta-rp/master', 2560), m: w('gta-rp/master', 800), mid: w('gta-rp/master', 1600) },
    avatar: ui('gtarp-default-avatar-approved-v2.webp'),
    medal: n => rank(`gtarp-rank-${n}-approved-v1.webp`),
    support: [
      { bg: rank('gtarp-support-1-bg-v3.webp'), hero: rank('gtarp-support-1-hero-v3.webp'), character: 'Michael' },
      { bg: rank('gtarp-support-2-v3.webp'), character: 'Franklin' },
      { bg: rank('gtarp-support-3-v3.webp'), character: 'Trevor' },
    ],
    people: [
      { bg: rank('gtarp-people-1-bg-v3.webp'), hero: rank('gtarp-people-1-hero-v3.webp'), character: 'CJ' },
      { bg: rank('gtarp-people-2-v3.webp'), character: 'Tommy' },
      { bg: rank('gtarp-people-3-v3.webp'), character: 'Niko' },
    ],
  },
}

// Chronicles / modes / platforms with their own art (800 for tiles, 1600 for big use).
export const FACETS = {
  l2: [
    { id: 'interlude', label: 'Interlude', note: 'Классика частных серверов', art: s => w('lineage-2/chronicle-interlude-approved-v1', s) },
    { id: 'high-five', label: 'High Five', note: 'Больше локаций и инстансов', art: s => w('lineage-2/chronicle-high-five-approved-v1', s) },
    { id: 'essence', label: 'Essence', note: 'Быстрый старт, автоохота', art: s => w('lineage-2/chronicle-essence-approved-v1', s) },
    { id: 'classic', label: 'Classic', note: 'Баланс ранних хроник', art: s => w('lineage-2/chronicle-classic-dwarf-v2', s) },
    { id: 'gracia', label: 'Gracia', note: 'Эпоха Грации', art: s => w('lineage-2/chronicle-gracia-approved-v1', s) },
  ],
  mc: [
    { id: 'survival', label: 'Выживание', note: 'Строй и выживай', art: s => w('minecraft/mode-survival-owner-v1', s) },
    { id: 'anarchy', label: 'Анархия', note: 'Без правил и приватов', art: s => w('minecraft/mode-anarchy-owner-v1', s) },
    { id: 'bedwars', label: 'BedWars', note: 'Защити кровать', art: s => w('minecraft/mode-bedwars-owner-v1', s) },
    { id: 'skyblock', label: 'SkyBlock', note: 'Остров в небе', art: s => w('minecraft/mode-skyblock-owner-v1', s) },
    { id: 'prison', label: 'Prison', note: 'Путь из шахты', art: s => w('minecraft/mode-prison-owner-v1', s) },
    { id: 'modded', label: 'С модами', note: 'Новые блоки и механики', art: s => w('minecraft/mode-modded-owner-v1', s) },
  ],
  gta: [
    { id: 'ragemp', label: 'RAGE:MP', note: 'Большинство русских проектов', art: s => w('gta-rp/mode-ragemp-owner-v1', s) },
    { id: 'fivem', label: 'FiveM', note: 'Лаунчер Cfx.re', art: s => w('gta-rp/mode-fivem-owner-v1', s) },
    { id: 'altv', label: 'alt:V', note: 'Свой клиент alt:V', art: s => w('gta-rp/mode-altv-owner-v1', s) },
  ],
}
