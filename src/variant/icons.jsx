// Small inline icon set (no emoji, no icon fonts).
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const I = ({ children, size = 20, ...rest }) => <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>{children}</svg>

export const IcSearch = p => <I {...p}><circle cx="11" cy="11" r="7" {...P} /><path d="m20 20-3.6-3.6" {...P} /></I>
export const IcClose = p => <I {...p}><path d="M6 6l12 12M18 6 6 18" {...P} /></I>
export const IcCopy = p => <I {...p}><rect x="9" y="9" width="11" height="11" rx="2" {...P} /><path d="M5 15V6a2 2 0 0 1 2-2h8" {...P} /></I>
export const IcCheck = p => <I {...p}><path d="m5 12.5 4.5 4.5L19 7.5" {...P} strokeWidth="2.6" /></I>
export const IcExt = p => <I {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" {...P} /></I>
export const IcDown = p => <I {...p}><path d="M12 5v14M6 13l6 6 6-6" {...P} /></I>
export const IcArrow = p => <I {...p}><path d="M5 12h14M13 6l6 6-6 6" {...P} /></I>
export const IcUsers = p => <I {...p}><circle cx="9" cy="8" r="3.5" {...P} /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14a6.5 6.5 0 0 1 3 6" {...P} /></I>
export const IcFlame = p => <I {...p}><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.4 1.2-3.9 2.5-5 .3 1.6 1 2.6 2 3 0-3 .2-5.7.5-8Z" {...P} /></I>
export const IcCalendar = p => <I {...p}><rect x="3.5" y="5" width="17" height="15" rx="2" {...P} /><path d="M3.5 10h17M8 3v4M16 3v4" {...P} /></I>
export const IcList = p => <I {...p}><path d="M9 6h11M9 12h11M9 18h11" {...P} /><circle cx="4.5" cy="6" r="1.2" fill="currentColor" /><circle cx="4.5" cy="12" r="1.2" fill="currentColor" /><circle cx="4.5" cy="18" r="1.2" fill="currentColor" /></I>
export const IcCrown = p => <I {...p}><path d="M3.5 8 7 11l5-6 5 6 3.5-3-2 10.5h-13Z" {...P} /></I>
export const IcGlobe = p => <I {...p}><circle cx="12" cy="12" r="8.5" {...P} /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5S9.5 6.1 12 3.5Z" {...P} /></I>
export const IcClock = p => <I {...p}><circle cx="12" cy="12" r="8.5" {...P} /><path d="M12 7.5V12l3 2" {...P} /></I>
export const IcPlay = p => <I {...p}><path d="M8 5.5v13l10-6.5Z" fill="currentColor" /></I>

/** Minecraft-style connection bars: 5 green bars when the server answered, grey when not. */
export function Bars({ live }) {
  return <svg className={`gm-bars ${live ? 'is-live' : ''}`} width="22" height="16" viewBox="0 0 11 8" shape-rendering="crispEdges" aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={i * 2} y={6 - i * 1.5} width="1.4" height={2 + i * 1.5} />)}
  </svg>
}

/** L2 filigree: frame corners and heading divider (only drawn in the L2 skin). */
export function Corners() {
  const c = <svg viewBox="0 0 44 44" aria-hidden="true"><path d="M2 42V14C2 7 7 2 14 2h28" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M7.5 42V17c0-5.3 4.2-9.5 9.5-9.5h25" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".55" /><path d="M2 2h7.5L2 9.5Z" fill="currentColor" /><circle cx="14" cy="14" r="2.4" fill="currentColor" /><path d="M14 20c0 6 2.5 10 7 12M20 14c6 0 10 2.5 12 7" fill="none" stroke="currentColor" strokeWidth=".9" opacity=".7" /></svg>
  return <span className="gm-corners" aria-hidden="true"><i>{c}</i><i>{c}</i><i>{c}</i><i>{c}</i></span>
}
export function Flourish() {
  return <svg className="gm-flourish" viewBox="0 0 260 18" aria-hidden="true">
    <path d="M0 9h96M164 9h96" stroke="currentColor" strokeWidth="1" />
    <path d="M100 9c6-7 12-7 16 0-4 7-10 7-16 0ZM160 9c-6-7-12-7-16 0 4 7 10 7 16 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M130 1.5 137.5 9 130 16.5 122.5 9Z" fill="currentColor" />
    <circle cx="90" cy="9" r="1.8" fill="currentColor" /><circle cx="170" cy="9" r="1.8" fill="currentColor" />
  </svg>
}
