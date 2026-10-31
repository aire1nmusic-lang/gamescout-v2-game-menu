// Builds src/data/catalog.json from a snapshot of the public GameScout catalog (data-raw/*.json).
// Only the three live worlds are kept. Nothing is invented: absent fields stay absent.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'

const raw = name => JSON.parse(readFileSync(new URL(`../data-raw/${name}`, import.meta.url), 'utf8'))
const snapshotAt = statSync(new URL('../data-raw/servers-0.json', import.meta.url)).mtime
const WORLD = { lineage2: 'l2', minecraft: 'mc', gtarp: 'gta' }

const items = [...raw('servers-0.json').items, ...raw('servers-100.json').items].filter(s => WORLD[s.gameId] && !s.demo)
const games = raw('games.json').filter(g => WORLD[g.id])
const people = new Map(raw('people.json').map(r => [r.server_id, Number(r.votes) || 0]))

const at = ago => (Number.isFinite(ago) ? new Date(snapshotAt.getTime() - ago * 1000).toISOString() : null)
const ratesNumber = text => { const m = /x\s?(\d+)/i.exec(text ?? ''); return m ? Number(m[1]) : null }

const servers = items.map(s => {
  const o = s.online ?? {}
  return {
    id: s.id, slug: s.slug, name: s.name, world: WORLD[s.gameId],
    chronicle: s.chronicleId ?? null,
    version: s.version || null, modes: s.modes ?? [], rates: s.rates || null, ratesX: ratesNumber(s.rates),
    summary: s.descriptionRestricted ? '' : s.summary || '',
    region: s.region || null, country: s.country || null, languages: s.languages ?? [],
    address: s.address || null,
    links: { site: s.links?.site || null, discord: s.links?.discord || null, telegram: s.links?.telegram || null },
    openedAt: s.openedAt || null, addedAt: s.addedAt || null, launchAt: s.launch?.at || null,
    online: {
      status: o.status ?? 'UNKNOWN', known: !!o.playersKnown, current: o.playersKnown ? o.current : null,
      max: o.maxKnown ? o.max : null, source: o.source || null, sourceUrl: o.sourceUrl || null,
      tier: o.sourceTier || null, checkedAt: at(o.checkedAgoSec), freshness: o.freshness || null,
      peak24h: o.playersKnown ? o.peak24h || null : null, avg7d: o.playersKnown ? o.avg7d || null : null,
      peak30d: o.playersKnown ? o.peak30d || null : null, change24h: o.playersKnown ? o.change24h ?? null : null,
    },
    votes: people.get(s.id) ?? 0,
    refs: (s.provenance?.refs ?? []).slice(0, 4).map(r => ({ name: r.name, url: r.url })),
  }
})

const worlds = Object.fromEntries(games.map(g => [WORLD[g.id], {
  servers: servers.filter(s => s.world === WORLD[g.id]).length,
  chronicles: (g.chronicles ?? []).map(c => ({ id: c.id, label: c.label, servers: c.serversCount })),
}]))

mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true })
writeFileSync(new URL('../src/data/catalog.json', import.meta.url), JSON.stringify({ snapshotAt: snapshotAt.toISOString(), source: 'https://gamescout.online/api/v1', worlds, servers }))
console.log(`catalog.json: ${servers.length} servers, snapshot ${snapshotAt.toISOString()}`)
