import data from './catalog.json'
import { FACETS } from './art.js'

// A read-only snapshot of the public gamescout.online catalog. Nothing here is invented.
export const SNAPSHOT_AT = data.snapshotAt
export const SERVERS = data.servers
export const WORLD_IDS = ['l2', 'mc', 'gta']
export const WORLD = {
  l2: { id: 'l2', name: 'Lineage 2', short: 'L2', facetKind: 'Хроника', facetPrompt: 'Выбери хронику', liveSite: 'https://gamescout.online/lineage-2' },
  mc: { id: 'mc', name: 'Minecraft', short: 'MC', facetKind: 'Режим', facetPrompt: 'Выбери режим', liveSite: 'https://gamescout.online/minecraft' },
  gta: { id: 'gta', name: 'GTA RP', short: 'GTA', facetKind: 'Платформа', facetPrompt: 'Выбери платформу', liveSite: 'https://gamescout.online/gta-rp' },
}

const now = () => Date.parse(SNAPSHOT_AT)
export const isLive = s => s.online.known && s.online.freshness === 'fresh' && !['UNKNOWN', 'PENDING', 'ANOMALY', 'OFFLINE'].includes(s.online.status)

/** Who counted the online number, in words a player understands. */
export function counted(s) {
  const { status, source, tier } = s.online
  if (status === 'EXTERNAL') return source || 'внешний мониторинг'
  if (status === 'OWNER_REPORTED') return tier === 'OFFICIAL' ? 'сайт проекта' : 'данные проекта'
  if (status === 'VERIFIED') return 'GameScout'
  if (status === 'LIVE') return 'ответ сервера'
  return source || ''
}

export const facetsOf = world => FACETS[world]
export const facetOf = s => FACETS[s.world].find(f => f.id === s.chronicle) ?? null
export const inWorld = (world, facet) => SERVERS.filter(s => s.world === world && (!facet || s.chronicle === facet))
export const facetCount = (world, facet) => inWorld(world, facet).length

export const byOnline = list => [...list].filter(isLive).sort((a, b) => b.online.current - a.online.current)
export const worldOnline = world => byOnline(inWorld(world)).reduce((sum, s) => sum + s.online.current, 0)
export const upcoming = list => list.filter(s => s.launchAt && Date.parse(s.launchAt) > now()).sort((a, b) => Date.parse(a.launchAt) - Date.parse(b.launchAt))
export const recentlyOpened = (list, days = 60) => list.filter(s => s.openedAt && now() - Date.parse(s.openedAt) >= 0 && now() - Date.parse(s.openedAt) < days * 864e5).sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt))
export const newest = list => [...list].sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
export const byName = list => [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
export const totalVotes = list => list.reduce((n, s) => n + (s.votes || 0), 0)
export const search = (list, q) => { const t = q.trim().toLocaleLowerCase('ru'); return t ? list.filter(s => `${s.name} ${s.version ?? ''} ${s.rates ?? ''} ${s.address ?? ''}`.toLocaleLowerCase('ru').includes(t)) : list }

export const fmt = n => new Intl.NumberFormat('ru-RU').format(n)
export const compact = n => n >= 1000 ? `${(n / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} тыс.` : fmt(n)
export const fmtDate = (iso, opts = { day: 'numeric', month: 'long' }) => new Date(iso).toLocaleDateString('ru-RU', { ...opts, timeZone: 'Europe/Moscow' })
export const daysUntil = iso => Math.ceil((Date.parse(iso) - now()) / 864e5)
export const daysSince = iso => Math.floor((now() - Date.parse(iso)) / 864e5)
export const plural = (n, [one, few, many]) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many }
/** "x30" style rates label, or null. */
export const ratesLabel = s => s.rates ? (/^x/i.test(s.rates) ? s.rates : `x${s.rates}`) : null
export const serverUrl = s => `https://gamescout.online/server/${s.slug}`
