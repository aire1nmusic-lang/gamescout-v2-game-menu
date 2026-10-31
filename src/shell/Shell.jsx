import { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { WORLD, WORLD_IDS, SNAPSHOT_AT, fmtDate } from '../data/catalog.js'
import { before } from '../data/art.js'
import { VARIANT } from '../variant/meta.js'
import WorldPage from '../variant/WorldPage.jsx'
import './shell.css'

const useNarrow = () => {
  const q = '(max-width: 767px)'
  const [narrow, setNarrow] = useState(() => matchMedia(q).matches)
  useEffect(() => { const m = matchMedia(q); const on = () => setNarrow(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on) }, [])
  return narrow
}

/** Review frame: the same world page "как сейчас" (screenshot of the live site) and in this variant. */
export default function Shell() {
  const { world } = useParams()
  const [params, setParams] = useSearchParams()
  const mode = params.get('v') === 'now' ? 'now' : 'new'
  const narrow = useNarrow()
  const [open, setOpen] = useState(true)
  useEffect(() => { window.scrollTo(0, 0) }, [world, mode])
  if (!WORLD[world]) return <Navigate to="/w/l2" replace />
  const setMode = m => { const next = new URLSearchParams(params); m === 'now' ? next.set('v', 'now') : next.delete('v'); setParams(next, { replace: true }) }
  const snapshot = fmtDate(SNAPSHOT_AT, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
  return <>
    {mode === 'now'
      ? <div className="rv-before"><img src={before(world, narrow ? 'm' : 'd')} alt={`${WORLD[world].name} на gamescout.online сейчас`} /></div>
      : <WorldPage key={world} world={world} />}
    <div className={`rv-bar ${open ? '' : 'is-min'}`} role="region" aria-label="Сравнение вариантов">
      {open ? <>
        <div className="rv-head"><b>{VARIANT.title}</b><span>Снимок gamescout.online от {snapshot} · вход, голоса и Coins — на основном сайте</span></div>
        <div className="rv-row">
          <div className="rv-seg" role="group" aria-label="Что показать">
            <button type="button" aria-pressed={mode === 'now'} onClick={() => setMode('now')}>Сейчас</button>
            <button type="button" aria-pressed={mode === 'new'} onClick={() => setMode('new')}>Новый</button>
          </div>
          <div className="rv-worlds" role="group" aria-label="Мир">
            {WORLD_IDS.map(id => <Link key={id} to={`/w/${id}${mode === 'now' ? '?v=now' : ''}`} aria-current={id === world ? 'page' : undefined} aria-label={WORLD[id].name}>{narrow ? WORLD[id].short : WORLD[id].name}</Link>)}
          </div>
          <button type="button" className="rv-hide" onClick={() => setOpen(false)} aria-label="Свернуть панель">–</button>
        </div>
      </> : <button type="button" className="rv-open" onClick={() => setOpen(true)} aria-label="Открыть панель сравнения">{mode === 'now' ? 'Сейчас' : 'Новый'} · {WORLD[world].short} ⇄</button>}
    </div>
  </>
}
