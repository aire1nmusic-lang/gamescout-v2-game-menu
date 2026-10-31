import { WORLD, SNAPSHOT_AT, counted, facetOf, isLive, fmt, compact, fmtDate, daysUntil, plural, ratesLabel } from '../data/catalog.js'
import { ART } from '../data/art.js'
import { THEME, serverArt } from './theme.js'
import { IcSearch, IcClose, IcCopy, IcCheck, IcExt, IcDown, IcArrow, IcUsers, IcFlame, IcCalendar, IcList, IcCrown, IcClock, Bars, Corners, Flourish } from './icons.jsx'

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const goTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }) }

export const nServers = n => `${fmt(n)} ${plural(n, ['сервер', 'сервера', 'серверов'])}`
// calendar days in Moscow time, so «вчера» means the previous date, not «less than 24 h»
const mskDay = iso => Math.floor((Date.parse(iso) + 3 * 3600e3) / 864e5)
export const daysAgo = iso => mskDay(SNAPSHOT_AT) - mskDay(iso)
export const timeMsk = iso => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' })
export const ago = iso => { const d = daysAgo(iso); return d <= 0 ? 'сегодня' : d === 1 ? 'вчера' : `${d} ${plural(d, ['день', 'дня', 'дней'])} назад` }
export const inDays = iso => { const d = daysUntil(iso); return d <= 0 ? 'сегодня' : d === 1 ? 'завтра' : `через ${d} ${plural(d, ['день', 'дня', 'дней'])}` }

/** "Interlude · x30", "Выживание · 1.8–1.21", "FiveM · English" */
export function metaLine(s) {
  const f = facetOf(s)?.label
  const parts = s.world === 'l2' ? [f || s.version, ratesLabel(s)] : s.world === 'mc' ? [f, s.version] : [f || s.version, s.languages?.[0]]
  return [...new Set(parts.filter(Boolean))].join(' · ')
}
export const facetArt = (s, size = 800) => serverArt(s, size)

export const Hit = ({ s, open }) => <button type="button" className="gm-hit" onClick={() => open(s)} aria-haspopup="dialog"><span className="gm-sr">Открыть карточку сервера {s.name}</span></button>

export function CopyBtn({ s, copy, copied, big, row }) {
  const ok = copied === s.id, fail = copied === `fail:${s.id}`
  return <button type="button" className={`gm-copy ${big ? 'gm-copy--big' : ''} ${ok ? 'is-ok' : ''}`} onClick={e => { e.stopPropagation(); copy(s) }}
    aria-label={ok ? 'IP скопирован' : `Скопировать IP ${s.address}`}>
    {ok ? <IcCheck /> : <IcCopy />}
    {big && <span className="gm-copy__ip">{s.address}</span>}
    <span className="gm-copy__txt">{ok ? 'Скопировано' : fail ? 'Выдели вручную' : big ? 'Скопировать' : <><span className={row ? 'gm-cq-wide' : 'gm-wide-only'}>Скопировать </span>IP</>}</span>
  </button>
}

function Online({ s, world }) {
  if (isLive(s)) return <div className="gm-on">
    <span className="gm-on__num">{world === 'mc' && <Bars live />}<b>{fmt(s.online.current)}</b><span> онлайн</span></span>
    <small className="gm-on__src">{counted(s)}</small>
  </div>
  if (s.online.status === 'OFFLINE') return <div className="gm-on is-muted">{world === 'mc' && <Bars />}<span className="gm-on__none">не отвечает</span></div>
  return <div className="gm-on is-muted"><span className="gm-on__none">нет данных</span></div>
}

function Badge({ s }) {
  if (s.launchAt && daysUntil(s.launchAt) > 0) return <span className="gm-badge gm-badge--soon">Старт {fmtDate(s.launchAt, { day: 'numeric', month: 'short' })}</span>
  if (s.openedAt && daysAgo(s.openedAt) >= 0 && daysAgo(s.openedAt) <= 30) return <span className="gm-badge">Открылся {fmtDate(s.openedAt, { day: 'numeric', month: 'short' })}</span>
  return null
}

export function Row({ s, world, open, copy, copied, rank }) {
  return <li className="gm-row"><div className="gm-row__in">
    {rank != null && <span className="gm-row__rank" aria-label={`${rank} место`}>{THEME[world].rowRank(rank)}</span>}
    <img className="gm-row__ava" src={ART[world].avatar} alt="" loading="lazy" width="44" height="44" />
    <div className="gm-row__main">
      <p className="gm-row__name">{s.name}</p>
      <p className="gm-row__meta"><span>{metaLine(s) || 'Без хроники'}</span><Badge s={s} /></p>
    </div>
    <Online s={s} world={world} />
    <Hit s={s} open={open} />
    {world === 'mc' && s.address && <CopyBtn s={s} copy={copy} copied={copied} row />}
  </div></li>
}

function SecHead({ id, icon, title, sub, chip, kicker }) {
  return <div className="gm-head">
    <span className="gm-head__icon" aria-hidden="true">{icon}</span>
    <div className="gm-head__txt">
      {kicker && <p className="gm-head__kicker">{kicker}</p>}
      <h2 id={id}>{title}{chip && <span className="gm-chip">{chip}</span>}</h2>
      {sub && <p className="gm-head__sub">{sub}</p>}
    </div>
    <Flourish />
  </div>
}

/* ───────────────────────── Hero / title screen ───────────────────────── */
export function Hero({ world, stats, q, setQ, found, menu }) {
  const t = THEME[world], hero = ART[world].hero, W = WORLD[world]
  const third = stats.soon ? [stats.soon, plural(stats.soon, ['скоро откроется', 'скоро откроются', 'скоро откроются'])]
    : stats.opened ? [stats.opened, plural(stats.opened, ['открылся за 2 месяца', 'открылись за 2 месяца', 'открылись за 2 месяца'])]
    : stats.added ? [stats.added, plural(stats.added, ['новый за 2 недели', 'новых за 2 недели', 'новых за 2 недели'])] : null
  const items = [
    { id: 'gm-now', label: 'Сейчас играют', count: menu.live, Icon: IcFlame },
    menu.fresh ? { id: 'gm-fresh', label: 'Новые старты', count: menu.fresh, Icon: IcCalendar } : null,
    { id: 'gm-all', label: 'Все серверы', count: menu.all, Icon: IcList },
    { id: 'gm-vote', label: 'Голосование', Icon: IcCrown },
  ].filter(Boolean)
  return <header className="gm-hero">
    <div className="gm-hero__art" aria-hidden="true">
      <picture>
        <source media="(min-width: 768px)" srcSet={`${hero.mid} 1600w, ${hero.d} 2560w`} sizes="100vw" />
        <img src={hero.m} alt="" fetchpriority="high" />
      </picture>
    </div>
    <div className="gm-hero__veil" aria-hidden="true" />
    <div className="gm-wrap gm-hero__inner">
      <div className="gm-hero__main">
        <p className="gm-brand"><span className="gm-brand__logo">GameScout</span><span className="gm-brand__sep" aria-hidden="true" /><span>серверы {W.name}</span></p>
        <p className="gm-kicker">{t.kicker}</p>
        <h1 className="gm-title"><span className="gm-title__text" data-text={t.title}>{t.title}</span>{t.sign && <span className="gm-sign" aria-hidden="true">{t.sign}</span>}</h1>
        <Flourish />
        <p className="gm-promise">{t.promise}</p>
        <ul className="gm-stats">
          <li><b>{fmt(stats.servers)}</b><span>{plural(stats.servers, ['сервер', 'сервера', 'серверов'])} в каталоге</span></li>
          {stats.online > 0 && <li><b>{compact(stats.online)}</b><span>онлайн*<i className="gm-sr"> — сумма свежих замеров, пояснение внизу страницы</i></span></li>}
          {third && <li><b>{third[0]}</b><span>{third[1]}</span></li>}
        </ul>
        <form className="gm-search" role="search" onSubmit={e => { e.preventDefault(); goTo('gm-all') }}>
          <label htmlFor="gm-q" className="gm-sr">Поиск серверов {W.name}</label>
          <IcSearch className="gm-search__ic" />
          <input id="gm-q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t.searchPh} autoComplete="off" enterKeyHint="search" />
          {q && <button type="button" className="gm-search__clear" onClick={() => setQ('')} aria-label="Очистить поиск"><IcClose size={18} /></button>}
          <button type="submit" className="gm-btn gm-btn--primary gm-search__go">Найти</button>
        </form>
        {q && <p className="gm-found" aria-live="polite">{found
          ? <>Найдено {nServers(found)} <button type="button" className="gm-link" onClick={() => goTo('gm-all')}>Смотреть <IcDown size={16} /></button></>
          : <>Ничего не нашлось. <button type="button" className="gm-link" onClick={() => setQ('')}>Сбросить поиск</button></>}</p>}
      </div>
      <nav className="gm-menu" aria-label="Разделы страницы">
        <Corners />
        <p className="gm-menu__title"><span>{t.menuTitle}</span>{world === 'gta' && <span className="gm-menu__time">{timeMsk(SNAPSHOT_AT)}</span>}</p>
        <ul>
          {items.map(({ id, label, count, Icon }) => <li key={id}>
            <button type="button" className="gm-menu__btn" onClick={() => goTo(id)}>
              <span className="gm-menu__ic"><Icon /></span>
              <span className="gm-menu__label">{label}</span>
              {count != null && <span className="gm-menu__count">{count}</span>}
            </button>
          </li>)}
        </ul>
      </nav>
    </div>
  </header>
}

/* ───────────────────────── Facet picker (chronicle / mode / platform) ───────────────────────── */
const FACET_SUB = {
  l2: 'Хроника — версия мира. Нажми, и ниже останутся только её серверы.',
  mc: 'Нажми на режим — ниже останутся только такие серверы.',
  gta: 'Через какой клиент заходить. Нажми, чтобы отфильтровать.',
}
export function FacetPicker({ world, facets, total, facet, setFacet }) {
  const t = THEME[world]
  const tiles = [{ id: null, label: 'Все', note: t.allNote, count: total, art: () => t.allArt }, ...facets]
  return <section className="gm-sec gm-facets" aria-labelledby="gm-facets-h">
    <div className="gm-wrap">
      <SecHead id="gm-facets-h" icon={<IcGlobeish />} title={WORLD[world].facetPrompt} sub={FACET_SUB[world]} />
      <div className={`gm-tiles ${tiles.length % 2 ? 'is-odd' : ''}`} role="group" aria-label={WORLD[world].facetPrompt} style={{ '--n': tiles.length }}>
        {tiles.map(f => {
          const on = facet === f.id
          return <button key={f.id ?? 'all'} type="button" className={`gm-tile ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setFacet(f.id)}>
            <span className="gm-tile__art"><img src={f.art(800)} alt="" loading="lazy" /></span>
            <span className="gm-tile__body">
              <span className="gm-tile__label">{f.label}</span>
              <span className="gm-tile__note">{f.note}</span>
            </span>
            <span className="gm-tile__count" aria-label={nServers(f.count)}>{f.count}</span>
            <span className="gm-tile__check" aria-hidden="true"><IcCheck size={16} /><span className="gm-tile__check-t">Выбрано</span></span>
            <Corners />
          </button>
        })}
      </div>
    </div>
  </section>
}
const IcGlobeish = () => <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>

/* ───────────────────────── Now playing: top-3 place scenes + next rows ───────────────────────── */
function Scene({ s, i, world, open, copy, copied }) {
  const sc = ART[world].support[i]
  return <article className={`gm-scene gm-scene--${i + 1}`}>
    <div className="gm-scene__frame" aria-hidden="true">
      <img className="gm-scene__bg" src={sc.bg} alt="" loading={i ? 'lazy' : 'eager'} />
      <span className="gm-scene__veil" />
      <Corners />
    </div>
    {sc.hero && <img className="gm-scene__hero" src={sc.hero} alt="" aria-hidden="true" />}
    <Hit s={s} open={open} />
    <div className="gm-scene__body">
      <img className="gm-scene__medal" src={ART[world].medal(i + 1)} alt={`${i + 1} место`} width="64" height="64" />
      <div className="gm-scene__txt">
        <h3 className="gm-scene__name">{s.name}</h3>
        <p className="gm-scene__meta">{metaLine(s)}</p>
        <p className="gm-scene__online"><span className="gm-dot" aria-hidden="true" /><b>{fmt(s.online.current)}</b> онлайн</p>
        <p className="gm-scene__src">посчитал: {counted(s)}</p>
      </div>
      <div className="gm-scene__act">
        {world === 'mc' && s.address && <CopyBtn s={s} copy={copy} copied={copied} />}
        <span className="gm-scene__more" aria-hidden="true">Подробнее <IcArrow size={16} /></span>
      </div>
    </div>
  </article>
}

export function NowPlaying({ world, live, q, open, copy, copied, facetSel }) {
  if (!live.length && q) return null
  const top = live.slice(0, 3), rest = live.slice(3, 10), more = live.length - 10
  return <section className="gm-sec gm-now" id="gm-now" aria-labelledby="gm-now-h">
    <div className="gm-wrap">
      <SecHead id="gm-now-h" icon={<IcFlame />} title="Сейчас играют" chip={facetSel?.label} sub={THEME[world].nowSub} />
      {!live.length ? <div className="gm-panel gm-note">
        <Corners />
        <p><b>Свежего онлайна{facetSel ? ` для ${facetSel.label}` : ''} пока нет.</b> Серверы с этим фильтром есть в полном списке — у каждого видно, есть ли данные.</p>
        <button type="button" className="gm-btn" onClick={() => goTo('gm-all')}>К списку серверов <IcDown size={18} /></button>
      </div> : <>
        <div className={`gm-scenes is-${top.length}`}>
          {top.map((s, i) => <Scene key={s.id} s={s} i={i} world={world} open={open} copy={copy} copied={copied} />)}
        </div>
        {rest.length > 0 && <div className="gm-panel gm-next">
          <Corners />
          <h3 className="gm-next__h">Тоже в игре</h3>
          <ol className="gm-rows gm-rows--two">{rest.map((s, k) => <Row key={s.id} s={s} world={world} open={open} copy={copy} copied={copied} rank={k + 4} />)}</ol>
          {more > 0 && <button type="button" className="gm-btn gm-btn--ghost" onClick={() => goTo('gm-all')}>Ещё {nServers(more)} с онлайном — в общем списке <IcDown size={18} /></button>}
        </div>}
      </>}
    </div>
  </section>
}

/* ───────────────────────── Fresh starts ───────────────────────── */
function SoonCard({ s, open }) {
  const d = new Date(s.launchAt)
  return <article className="gm-soon">
    <img className="gm-soon__bg" src={facetArt(s, 1600)} alt="" loading="lazy" aria-hidden="true" />
    <span className="gm-soon__veil" aria-hidden="true" />
    <Corners />
    <div className="gm-soon__date" aria-hidden="true"><b>{fmtDate(s.launchAt, { day: 'numeric' })}</b><span>{fmtDate(s.launchAt, { month: 'short' }).replace('.', '')}</span></div>
    <div className="gm-soon__txt">
      <p className="gm-soon__when"><IcClock size={16} /> Откроется {inDays(s.launchAt)} · {fmtDate(s.launchAt, { day: 'numeric', month: 'long' })}{d.getUTCHours() || d.getUTCMinutes() ? `, ${timeMsk(s.launchAt)} МСК` : ''}</p>
      <h4 className="gm-soon__name">{s.name}</h4>
      <p className="gm-soon__meta">{metaLine(s)}</p>
    </div>
    <span className="gm-btn gm-btn--primary gm-soon__go" aria-hidden="true">Подробнее</span>
    <Hit s={s} open={open} />
  </article>
}
function FreshCard({ s, world, open, kind }) {
  return <li className="gm-fresh-card">
    <span className="gm-fresh-card__art" aria-hidden="true"><img src={facetArt(s)} alt="" loading="lazy" /></span>
    <div className="gm-fresh-card__body">
      <p className="gm-fresh-card__when">{kind === 'opened' ? <>Открылся {fmtDate(s.openedAt)} <i>· {ago(s.openedAt)}</i></> : <>Добавлен {fmtDate(s.addedAt)} <i>· {ago(s.addedAt)}</i></>}</p>
      <p className="gm-fresh-card__name">{s.name}</p>
      <p className="gm-fresh-card__meta">{metaLine(s)}</p>
      {isLive(s) && <p className="gm-fresh-card__on"><span className="gm-dot" aria-hidden="true" />{fmt(s.online.current)} онлайн</p>}
    </div>
    <Corners />
    <Hit s={s} open={open} />
  </li>
}
export function FreshStarts({ world, fresh, open, onAll, facetSel }) {
  const { soon, opened, added } = fresh
  const kind = opened.length ? 'opened' : 'added'
  const group = opened.length ? opened : added
  if (!soon.length && !group.length) return null
  const shown = group.slice(0, 8)
  return <section className="gm-sec gm-fresh" id="gm-fresh" aria-labelledby="gm-fresh-h">
    <div className="gm-wrap">
      <SecHead id="gm-fresh-h" icon={<IcCalendar />} title="Новые старты" chip={facetSel?.label}
        sub={soon.length && group.length ? 'Скоро откроются и только что открылись — успей к старту' : soon.length ? 'Скоро откроются — успей к старту' : kind === 'opened' ? 'Только что открылись — все начинают с нуля' : 'Недавно появились в каталоге GameScout'} />
      {soon.length > 0 && <div className="gm-soon-list">
        <h3 className="gm-sub-h"><IcClock size={18} /> Скоро откроются</h3>
        {soon.slice(0, 3).map(s => <SoonCard key={s.id} s={s} open={open} />)}
      </div>}
      {group.length > 0 && <div className="gm-fresh-group">
        <h3 className="gm-sub-h">{kind === 'opened' ? <><IcFlame size={18} /> Только что открылись</> : <><IcUsers size={18} /> Новые в каталоге</>}<span className="gm-sub-h__n">{group.length}</span></h3>
        <ul className="gm-rail" aria-label={kind === 'opened' ? 'Только что открылись' : 'Новые в каталоге'}>
          {shown.map(s => <FreshCard key={s.id} s={s} world={world} open={open} kind={kind} />)}
        </ul>
        {group.length > shown.length && <button type="button" className="gm-btn gm-btn--ghost" onClick={onAll}>Все новые — в общем списке ({group.length}) <IcDown size={18} /></button>}
      </div>}
    </div>
  </section>
}

/* ───────────────────────── Full list ───────────────────────── */
const SORT_LABELS = [['online', 'По онлайну'], ['new', 'Новые'], ['name', 'А–Я']]
export function ServerList({ world, list, q, setQ, sort, setSort, showAll, setShowAll, reset, clearFacet, facetSel, open, copy, copied }) {
  const rows = showAll ? list : list.slice(0, 12)
  return <section className="gm-sec gm-list" id="gm-all" aria-labelledby="gm-all-h">
    <div className="gm-wrap">
      <SecHead id="gm-all-h" icon={<IcList />} title="Все серверы" sub={list.length ? `${nServers(list.length)}${facetSel ? ` · ${facetSel.label}` : ''}. Нажми на сервер — откроется карточка с подробностями.` : 'По этому фильтру серверов нет.'} />
      <div className="gm-panel gm-listbox">
        <Corners />
        <div className="gm-toolbar">
          <div className="gm-search gm-search--small">
            <label htmlFor="gm-q2" className="gm-sr">Поиск в списке</label>
            <IcSearch className="gm-search__ic" />
            <input id="gm-q2" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={THEME[world].searchPh} autoComplete="off" />
            {q && <button type="button" className="gm-search__clear" onClick={() => setQ('')} aria-label="Очистить поиск"><IcClose size={18} /></button>}
          </div>
          <div className="gm-sort" role="group" aria-label="Сортировка">
            <span className="gm-sort__label" aria-hidden="true">Сортировка</span>
            {SORT_LABELS.map(([id, label]) => <button key={id} type="button" aria-pressed={sort === id} onClick={() => setSort(id)}>{label}</button>)}
          </div>
        </div>
        {(q || facetSel) && <div className="gm-active">
          <span>Фильтр:</span>
          {facetSel && <button type="button" className="gm-pill" onClick={clearFacet} aria-label={`Убрать фильтр ${facetSel.label}`}>{facetSel.label} <IcClose size={14} /></button>}
          {q && <button type="button" className="gm-pill" onClick={() => setQ('')} aria-label="Убрать поиск">«{q}» <IcClose size={14} /></button>}
        </div>}
        {list.length ? <ol className="gm-rows">{rows.map(s => <Row key={s.id} s={s} world={world} open={open} copy={copy} copied={copied} />)}</ol>
          : <div className="gm-empty">
            <img src={ART[world].avatar} alt="" width="72" height="72" />
            <h3>Ничего не нашлось</h3>
            <p>{q ? <>По запросу «{q}»</> : 'С этим фильтром'}{facetSel ? ` в разделе ${facetSel.label}` : ''} серверов нет. Проверь написание или сбрось фильтры.</p>
            <button type="button" className="gm-btn gm-btn--primary" onClick={reset}>Сбросить поиск и фильтры</button>
          </div>}
        {!showAll && list.length > 12 && <button type="button" className="gm-btn gm-btn--wide" onClick={() => setShowAll(true)}>Показать все {list.length} <IcDown size={18} /></button>}
      </div>
    </div>
  </section>
}

/* ───────────────────────── Votes: honest invitation, never a podium of zeros ───────────────────────── */
export function VoteInvite({ world }) {
  const p = ART[world].people[0]
  return <section className="gm-sec gm-vote" id="gm-vote" aria-labelledby="gm-vote-h">
    <div className="gm-wrap">
      <div className="gm-vote__card">
        <div className="gm-vote__frame" aria-hidden="true"><img src={p.bg} alt="" loading="lazy" /><span className="gm-vote__veil" /><Corners /></div>
        {p.hero && <img className="gm-vote__hero" src={p.hero} alt="" aria-hidden="true" loading="lazy" />}
        <div className="gm-vote__body">
          <p className="gm-head__kicker">Голос игроков</p>
          <h2 id="gm-vote-h">Топ выбирают игроки</h2>
          <p>Голосование открыто на gamescout.online. Голосов пока мало, поэтому рейтинг здесь не показываем — он появится, когда игроки проголосуют. Поддержи свой сервер.</p>
          <a className="gm-btn gm-btn--primary" href={WORLD[world].liveSite} target="_blank" rel="noopener noreferrer">Голосовать на GameScout <IcExt size={18} /></a>
        </div>
      </div>
    </div>
  </section>
}

export function Footnote({ liveCount }) {
  return <footer className="gm-foot"><div className="gm-wrap">
    <p>* Онлайн — последний свежий замер. У каждого сервера подписано, кто его посчитал: ответ сервера, внешний мониторинг или сайт проекта. Сумма в шапке считается только по серверам со свежими данными (их {liveCount}).</p>
    <p>Данные — снимок gamescout.online от {fmtDate(SNAPSHOT_AT, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} МСК. Здесь только реальные данные каталога — без придуманных рейтингов и отзывов.</p>
  </div></footer>
}
