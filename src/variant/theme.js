// World-specific words for the "game menu" skin. Visual language lives in the CSS (skin-l2 / skin-mc / skin-gta).
const B = import.meta.env.BASE_URL

export const THEME = {
  l2: {
    kicker: 'Мир, в который хочется вернуться',
    title: 'Lineage II',
    promise: 'От первых шагов в Глудио до осады Адена — найди сервер, который станет твоим миром.',
    searchPh: 'Название или рейты',
    allArt: `${B}media/worlds/lineage-2/chronicle-all-approved-v1-800.webp`,
    allNote: 'Все хроники сразу',
    menuTitle: 'Главное меню',
    nowSub: 'Самые населённые миры по свежему онлайну',
    rowRank: n => String(n).padStart(2, '0'),
    joinSteps: s => [
      'Открой сайт проекта и создай игровой аккаунт.',
      `Скачай клиент${s.version ? ` ${s.version}` : ''} и патч — ссылки на сайте проекта.`,
      'Запусти игру, войди и выбери сервер в списке.',
    ],
  },
  mc: {
    kicker: 'Строй, сражайся, исследуй!',
    title: 'Minecraft',
    promise: 'Выживание, анархия, мини-игры — выбери режим и заходи по IP за минуту.',
    searchPh: 'Название, версия, IP',
    allArt: `${B}media/worlds/minecraft/master-800.webp`,
    allNote: 'Все режимы',
    menuTitle: 'Меню',
    nowSub: 'Где больше всего игроков прямо сейчас',
    rowRank: n => String(n),
    joinSteps: s => [
      `Запусти Minecraft${s.version ? ` (${s.version})` : ''} и нажми «Сетевая игра».`,
      'Нажми «Добавить сервер» и вставь скопированный IP.',
      'Нажми «Готово», выбери сервер и «Подключиться».',
    ],
  },
  gta: {
    kicker: 'Лос-Сантос ждёт',
    title: 'GTA RP',
    sign: 'Лос-Сантос',
    promise: 'Своя роль в Лос-Сантосе: работа, бизнес, банды или полиция. Выбери платформу и проект.',
    searchPh: 'Название проекта',
    allArt: `${B}media/worlds/gta-rp/master-800.webp`,
    allNote: 'Все платформы',
    menuTitle: 'Телефон',
    nowSub: 'Где сейчас больше всего игроков',
    rowRank: n => String(n),
    joinSteps: s => {
      const client = { ragemp: 'RAGE:MP', fivem: 'FiveM', altv: 'alt:V' }[s.chronicle] || s.version || 'клиент мультиплеера'
      return [
        'Нужна лицензионная GTA V на ПК.',
        `Установи ${client} с официального сайта платформы.`,
        'Открой сайт проекта: там адрес сервера и правила для новичков.',
      ]
    },
  },
}

// Art pool per facet so neighbouring cards don't repeat one picture. Choice is stable per server (hash of slug).
const wv = (path, size) => path.startsWith('R:') ? `${B}media/ranks/${path.slice(2)}` : `${B}media/worlds/${path}-${size}.webp`
const POOL = {
  l2: {
    interlude: ['lineage-2/chronicle-interlude-approved-v1', 'lineage-2/interlude', 'lineage-2/server-castle-v1'],
    'high-five': ['lineage-2/chronicle-high-five-approved-v1', 'lineage-2/high-five', 'lineage-2/server-castle-summer-v2'],
    essence: ['lineage-2/chronicle-essence-approved-v1', 'lineage-2/essence'],
    classic: ['lineage-2/chronicle-classic-dwarf-v2', 'lineage-2/classic'],
    gracia: ['lineage-2/chronicle-gracia-approved-v1'],
    other: ['lineage-2/chronicle-gracia-approved-v1', 'lineage-2/chronicle-all-approved-v1', 'lineage-2/master-v9'],
  },
  mc: {
    survival: ['minecraft/mode-survival-owner-v1', 'minecraft/master'],
    anarchy: ['minecraft/mode-anarchy-owner-v1', 'minecraft/anarchy'],
    bedwars: ['minecraft/mode-bedwars-owner-v1', 'minecraft/minigames'],
    skyblock: ['minecraft/mode-skyblock-owner-v1', 'minecraft/skyblock'],
    prison: ['minecraft/mode-prison-owner-v1'],
    modded: ['minecraft/mode-modded-owner-v1'],
    other: ['minecraft/master', 'minecraft/minigames', 'minecraft/skyblock', 'minecraft/anarchy', 'minecraft/mode-survival-owner-v1'],
  },
  gta: {
    ragemp: ['gta-rp/mode-ragemp-owner-v1', 'gta-rp/master', 'R:gtarp-people-2-v3.webp', 'R:gtarp-support-3-v3.webp', 'R:gtarp-people-3-v3.webp'],
    fivem: ['gta-rp/mode-fivem-owner-v1', 'gta-rp/master', 'R:gtarp-support-2-v3.webp'],
    altv: ['gta-rp/mode-altv-owner-v1', 'gta-rp/master'],
    other: ['gta-rp/master'],
  },
}
const hash = str => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
export function serverArt(s, size = 800) {
  const pool = POOL[s.world][s.chronicle] || POOL[s.world].other
  return wv(pool[hash(s.slug) % pool.length], size)
}
