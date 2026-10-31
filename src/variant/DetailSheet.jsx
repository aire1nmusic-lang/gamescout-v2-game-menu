import { useEffect, useRef } from 'react'
import { WORLD, counted, facetOf, isLive, fmt, fmtDate, ratesLabel, serverUrl, daysUntil } from '../data/catalog.js'
import { ART } from '../data/art.js'
import { THEME } from './theme.js'
import { IcClose, IcExt, IcClock } from './icons.jsx'
import { CopyBtn, facetArt, ago, inDays } from './parts.jsx'

const FOCUSABLE = 'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])'

/** Server card: bottom sheet on phones, side panel from 900px. Esc / close button / backdrop close it; focus is trapped and returned. */
export default function DetailSheet({ s, world, onClose, copy, copied }) {
  const box = useRef(null), closeBtn = useRef(null)
  useEffect(() => {
    const back = document.activeElement
    const root = document.documentElement, prev = root.style.overflow
    root.style.overflow = 'hidden'
    closeBtn.current?.focus({ preventScroll: true })
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if (e.key === 'Tab' && box.current) {
        const f = [...box.current.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null)
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); root.style.overflow = prev; if (back && back.focus) back.focus({ preventScroll: true }) }
  }, [onClose])

  const t = THEME[world], f = facetOf(s), live = isLive(s), o = s.online
  const facts = [
    [WORLD[world].facetKind, f?.label],
    ['Версия', s.version && s.version !== f?.label ? s.version : null],
    ['Рейты', ratesLabel(s)],
    ['Режимы', s.modes?.length ? s.modes.join(', ') : null],
    ['Языки', s.languages?.length ? s.languages.join(', ') : null],
    ['Старт', s.launchAt && daysUntil(s.launchAt) > 0 ? `${fmtDate(s.launchAt)} · ${inDays(s.launchAt)}` : null],
    ['Открылся', s.openedAt && !(s.launchAt && daysUntil(s.launchAt) > 0) ? `${fmtDate(s.openedAt, { day: 'numeric', month: 'long', year: 'numeric' })} · ${ago(s.openedAt)}` : null],
    ['В каталоге с', fmtDate(s.addedAt, { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Голоса', s.votes > 0 ? fmt(s.votes) : null],
  ].filter(([, v]) => v)

  return <div className="gm-sheet-wrap" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className={`gm-sheet skin-${world}`} role="dialog" aria-modal="true" aria-labelledby="gm-sheet-h" ref={box}>
      <div className="gm-sheet__grip" aria-hidden="true" />
      <div className="gm-sheet__head">
        <img className="gm-sheet__art" src={facetArt(s, 800)} alt="" aria-hidden="true" />
        <span className="gm-sheet__veil" aria-hidden="true" />
        <button type="button" className="gm-sheet__close" onClick={onClose} ref={closeBtn} aria-label="Закрыть карточку сервера"><IcClose /></button>
        <div className="gm-sheet__id">
          <img src={ART[world].avatar} alt="" width="60" height="60" />
          <div>
            <p className="gm-sheet__kind">{[f?.label || s.version, ratesLabel(s)].filter(Boolean).join(' · ')}</p>
            <h2 id="gm-sheet-h">{s.name}</h2>
          </div>
        </div>
      </div>
      <div className="gm-sheet__body">
        <div className={`gm-sheet__online ${live ? '' : 'is-muted'}`}>
          {live ? <>
            <p className="gm-sheet__num"><span className="gm-dot" aria-hidden="true" /><b>{fmt(o.current)}</b> онлайн{o.max ? <span className="gm-sheet__max"> из {fmt(o.max)} мест</span> : null}</p>
            <p className="gm-sheet__src">Посчитал: <b>{counted(s)}</b> · <IcClock size={14} /> проверено {fmtDate(o.checkedAt, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
            {(o.peak24h || o.avg7d) ? <ul className="gm-sheet__trend">
              {o.peak24h ? <li><b>{fmt(o.peak24h)}</b><span>пик за сутки</span></li> : null}
              {o.avg7d ? <li><b>{fmt(o.avg7d)}</b><span>в среднем за неделю</span></li> : null}
              {o.peak30d ? <li><b>{fmt(o.peak30d)}</b><span>пик за месяц</span></li> : null}
            </ul> : null}
          </> : <p className="gm-sheet__num is-none">{o.status === 'OFFLINE' ? 'Сервер не ответил при последней проверке' : 'Свежих данных об онлайне пока нет'}</p>}
        </div>

        <h3 className="gm-sheet__h">Как зайти</h3>
        {world === 'mc' && s.address && <CopyBtn s={s} copy={copy} copied={copied} big />}
        <ol className="gm-steps">{t.joinSteps(s).map((step, i) => <li key={i}><span aria-hidden="true">{i + 1}</span>{step}</li>)}</ol>

        <h3 className="gm-sheet__h">О сервере</h3>
        <dl className="gm-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>

        <div className="gm-sheet__cta">
          <a className="gm-btn gm-btn--primary" href={serverUrl(s)} target="_blank" rel="noopener noreferrer">Открыть на GameScout <IcExt size={18} /></a>
          {s.links?.site && <a className="gm-btn" href={s.links.site} target="_blank" rel="noopener noreferrer">Сайт проекта <IcExt size={18} /></a>}
          {s.links?.discord && <a className="gm-btn" href={s.links.discord} target="_blank" rel="noopener noreferrer">Discord <IcExt size={18} /></a>}
          {s.links?.telegram && <a className="gm-btn" href={s.links.telegram} target="_blank" rel="noopener noreferrer">Telegram <IcExt size={18} /></a>}
        </div>
        <p className="gm-sheet__note">Голосование, отзывы и вход — на gamescout.online.</p>
      </div>
    </div>
  </div>
}
