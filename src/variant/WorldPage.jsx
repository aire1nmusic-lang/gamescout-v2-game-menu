import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { inWorld, facetsOf, byOnline, upcoming, recentlyOpened, newest, byName, search, worldOnline, daysSince } from '../data/catalog.js'
import { Hero, FacetPicker, NowPlaying, FreshStarts, ServerList, VoteInvite, Footnote, goTo } from './parts.jsx'
import DetailSheet from './DetailSheet.jsx'
import './arena.css'
import './skin-l2.css'
import './skin-mc.css'
import './skin-gta.css'

const dateKey = s => Date.parse(s.launchAt || s.openedAt || s.addedAt) || 0
const SORTS = {
  online: list => { const live = byOnline(list); const rest = byName(list.filter(s => !live.includes(s))); return [...live, ...rest] },
  new: list => [...list].sort((a, b) => dateKey(b) - dateKey(a)),
  name: byName,
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true } catch {
    try {
      const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'
      document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); t.remove(); return ok
    } catch { return false }
  }
}

export default function WorldPage({ world }) {
  const [facet, setFacet] = useState(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('online')
  const [showAll, setShowAll] = useState(false)
  const [openId, setOpenId] = useState(null)
  const [copied, setCopied] = useState(null)
  const [announce, setAnnounce] = useState('')
  const copyTimer = useRef(0)

  const all = useMemo(() => inWorld(world), [world])
  const facets = useMemo(() => facetsOf(world).map(f => ({ ...f, count: inWorld(world, f.id).length })).filter(f => f.count > 0), [world])
  const filtered = useMemo(() => search(inWorld(world, facet), q), [world, facet, q])
  const live = useMemo(() => byOnline(filtered), [filtered])
  const fresh = useMemo(() => ({
    soon: upcoming(filtered),
    opened: recentlyOpened(filtered),
    added: newest(filtered).filter(s => daysSince(s.addedAt) <= 14),
  }), [filtered])
  const sorted = useMemo(() => SORTS[sort](filtered), [filtered, sort])
  const stats = useMemo(() => ({
    servers: all.length,
    online: worldOnline(world),
    liveCount: byOnline(all).length,
    soon: upcoming(all).length,
    opened: recentlyOpened(all).length,
    added: all.filter(s => daysSince(s.addedAt) <= 14).length,
  }), [all, world])

  useEffect(() => { setShowAll(false) }, [facet, q, sort])

  const copy = useCallback(async s => {
    const ok = await copyText(s.address)
    clearTimeout(copyTimer.current)
    setCopied(ok ? s.id : `fail:${s.id}`)
    setAnnounce(ok ? `IP ${s.address} скопирован` : 'Не получилось скопировать — выдели адрес вручную')
    copyTimer.current = setTimeout(() => setCopied(null), 2200)
  }, [])
  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const open = useCallback(s => setOpenId(s.id), [])
  const reset = () => { setQ(''); setFacet(null) }
  const showNewest = () => { setSort('new'); requestAnimationFrame(() => goTo('gm-all')) }
  const current = openId ? all.find(s => s.id === openId) : null
  const ctx = { world, open, copy, copied, facetSel: facets.find(f => f.id === facet) }
  const freshCount = fresh.soon.length + (fresh.opened.length || fresh.added.length)

  return <main className={`gm skin-${world}`} data-world={world}>
    <Hero world={world} stats={stats} q={q} setQ={setQ} found={filtered.length} menu={{ live: live.length, fresh: freshCount, all: filtered.length }} />
    <FacetPicker world={world} facets={facets} total={all.length} facet={facet} setFacet={setFacet} />
    <NowPlaying {...ctx} live={live} q={q} />
    <FreshStarts {...ctx} fresh={fresh} onAll={showNewest} />
    <ServerList {...ctx} list={sorted} q={q} setQ={setQ} sort={sort} setSort={setSort} showAll={showAll} setShowAll={setShowAll} reset={reset} clearFacet={() => setFacet(null)} />
    <VoteInvite world={world} />
    <Footnote liveCount={stats.liveCount} />
    <p className="gm-sr" aria-live="polite">{announce}</p>
    {current && <DetailSheet {...ctx} s={current} onClose={() => setOpenId(null)} />}
  </main>
}
