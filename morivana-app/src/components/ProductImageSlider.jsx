import { useState, useEffect, useRef, useCallback } from 'react'

// Dev: Vite serves public/ at root. Prod: jsDelivr global CDN.
const CDN = import.meta.env.DEV
  ? ''
  : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public'

const SLIDES = [
  {
    src: `${CDN}/bg-removed-front.png`,
    label: 'Front View',
    bg: 'linear-gradient(135deg, #EEF7E4 0%, #F4FBEC 100%)',
    bgRaw: '#EEF7E4',
  },
  {
    src: `${CDN}/bgremoved-back.png`,
    label: 'Back View',
    bg: 'linear-gradient(135deg, #E9F5E1 0%, #F0F9E8 100%)',
    bgRaw: '#E9F5E1',
  },
  {
    src: `${CDN}/flat-front.png`,
    label: 'Flat Lay — Front',
    bg: 'linear-gradient(135deg, #F5F0E8 0%, #FAF7F0 100%)',
    bgRaw: '#F5F0E8',
  },
  {
    src: `${CDN}/flat-back.png`,
    label: 'Flat Lay — Back',
    bg: 'linear-gradient(135deg, #EEF0F5 0%, #F4F5FA 100%)',
    bgRaw: '#EEF0F5',
  },
]

const AUTO_PLAY_MS = 3500
// Easing shared by every animated property
const EASE = 'cubic-bezier(0.45, 0, 0.15, 1)'
const DUR  = '0.65s'

export default function ProductImageSlider() {
  const [active, setActive]   = useState(0)
  const [hovered, setHovered] = useState(false)
  const [arrowDir, setArrowDir] = useState(null) // 'left' | 'right' | null for directional hint
  const timerRef     = useRef(null)
  const touchStartX  = useRef(null)
  const isLocked     = useRef(false)             // throttle rapid clicks

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = useCallback((idx) => {
    if (isLocked.current || idx === active) return
    isLocked.current = true
    setActive(idx)
    // Release lock after transition completes
    setTimeout(() => { isLocked.current = false }, 680)
  }, [active])

  const goNext = useCallback(() => {
    setArrowDir('right')
    goTo((active + 1) % SLIDES.length)
  }, [active, goTo])

  const goPrev = useCallback(() => {
    setArrowDir('left')
    goTo((active - 1 + SLIDES.length) % SLIDES.length)
  }, [active, goTo])

  // ── Auto-play (paused while hovered) ───────────────────────────────────────
  useEffect(() => {
    if (hovered) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(goNext, AUTO_PLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [hovered, goNext])

  // ── Touch swipe ─────────────────────────────────────────────────────────────
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev()
    touchStartX.current = null
  }

  // ── Computed styles ─────────────────────────────────────────────────────────
  const imgStyle = (idx) => ({
    position:   'absolute',
    inset:      0,
    width:      '100%',
    height:     '100%',
    objectFit:  'contain',
    padding:    '28px',
    // KEY: all images always mounted; CSS handles cross-fade (no remount flash)
    opacity:   idx === active ? 1 : 0,
    transform: idx === active ? 'scale(1)' : 'scale(0.94)',
    transition: `opacity ${DUR} ${EASE}, transform ${DUR} ${EASE}`,
    willChange: 'opacity, transform',
    pointerEvents: 'none',
    zIndex: idx === active ? 2 : 1,
  })

  const bgStyle = (idx) => ({
    position:   'absolute',
    inset:      0,
    background: SLIDES[idx].bg,
    opacity:    idx === active ? 1 : 0,
    transition: `opacity ${DUR} ${EASE}`,
    willChange: 'opacity',
    zIndex:     0,
  })

  return (
    <>
      {/* ── Keyframes & utility CSS ── */}
      <style>{`
        @keyframes slider-progress-bar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .pis-thumb { transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease; }
        .pis-thumb:hover:not(.pis-thumb--active) {
          border-color: var(--accent-strong) !important;
          transform: scale(1.06) !important;
          box-shadow: 0 4px 18px rgba(25,65,2,0.14) !important;
        }
        .pis-thumb--active {
          border-color: var(--surface-deep) !important;
          transform: scale(1.05) !important;
          box-shadow: 0 4px 18px rgba(25,65,2,0.20) !important;
        }
        .pis-arrow {
          transition: opacity 0.3s ease, transform 0.25s ease, background 0.2s ease;
        }
        .pis-arrow:hover {
          background: rgba(255,255,255,1) !important;
          transform: translateY(-50%) scale(1.12) !important;
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', userSelect: 'none' }}>

        {/* ── Main card ─────────────────────────────────────────────────────── */}
        <div
          role="region"
          aria-label="Product image gallery"
          style={{
            position:     'relative',
            borderRadius: '24px',
            overflow:     'hidden',
            aspectRatio:  '1 / 1',
            cursor:       'pointer',
            boxShadow:    hovered
              ? '0 16px 56px rgba(25,65,2,0.16)'
              : '0 6px 32px rgba(25,65,2,0.09)',
            transition:   `box-shadow 0.5s ${EASE}`,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={goNext}
        >
          {/* Gradient backgrounds — all mounted, fade between them */}
          {SLIDES.map((_, idx) => (
            <div key={`bg-${idx}`} style={bgStyle(idx)} />
          ))}

          {/* All images — all mounted, opacity/scale cross-fades */}
          {SLIDES.map((slide, idx) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.label}
              loading={idx === 0 ? 'eager' : 'lazy'}
              draggable={false}
              style={imgStyle(idx)}
            />
          ))}

          {/* Hover zoom overlay on active image */}
          <div
            style={{
              position:   'absolute',
              inset:      0,
              zIndex:     3,
              transition: `transform ${DUR} ${EASE}`,
              transform:  hovered ? 'scale(1.04)' : 'scale(1)',
              pointerEvents: 'none',
            }}
          />

          {/* Label badge */}
          <div
            style={{
              position:        'absolute',
              bottom:          '14px',
              left:            '14px',
              zIndex:          10,
              fontFamily:      'var(--font-mono)',
              fontWeight:      600,
              fontSize:        '0.58rem',
              letterSpacing:   '0.18em',
              textTransform:   'uppercase',
              color:           'var(--surface-deep)',
              background:      'rgba(255,255,255,0.82)',
              backdropFilter:  'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius:    '999px',
              padding:         '5px 12px',
              transition:      `opacity 0.4s ${EASE}`,
              opacity:         1,
            }}
          >
            {SLIDES[active].label}
          </div>

          {/* Counter */}
          <div
            style={{
              position:        'absolute',
              bottom:          '14px',
              right:           '14px',
              zIndex:          10,
              fontFamily:      'var(--font-mono)',
              fontWeight:      600,
              fontSize:        '0.58rem',
              letterSpacing:   '0.1em',
              color:           'rgba(25,50,10,0.55)',
              background:      'rgba(255,255,255,0.70)',
              backdropFilter:  'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              borderRadius:    '999px',
              padding:         '5px 10px',
            }}
          >
            {active + 1} / {SLIDES.length}
          </div>

          {/* Arrows */}
          {[
            { dir: 'left',  action: (e) => { e.stopPropagation(); goPrev() } },
            { dir: 'right', action: (e) => { e.stopPropagation(); goNext() } },
          ].map(({ dir, action }) => (
            <button
              key={dir}
              className="pis-arrow"
              onClick={action}
              aria-label={dir === 'left' ? 'Previous image' : 'Next image'}
              style={{
                position:        'absolute',
                top:             '50%',
                transform:       'translateY(-50%)',
                [dir]:           '12px',
                zIndex:          10,
                width:           '38px',
                height:          '38px',
                borderRadius:    '50%',
                border:          'none',
                background:      'rgba(255,255,255,0.86)',
                backdropFilter:  'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color:           'var(--surface-deep)',
                fontSize:        '1rem',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                opacity:         hovered ? 1 : 0,
                boxShadow:       '0 2px 14px rgba(25,65,2,0.15)',
              }}
            >
              {dir === 'left' ? '←' : '→'}
            </button>
          ))}

          {/* Auto-play progress bar — scaleX animation restarts on slide change */}
          {!hovered && (
            <div
              key={`bar-${active}`}                 // restart animation each slide
              style={{
                position:       'absolute',
                bottom:         0,
                left:           0,
                width:          '100%',
                height:         '2.5px',
                background:     'var(--surface-deep)',
                opacity:        0.20,
                zIndex:         10,
                transformOrigin:'left center',
                animation:      `slider-progress-bar ${AUTO_PLAY_MS}ms linear forwards`,
              }}
            />
          )}
        </div>

        {/* ── Thumbnail row ─────────────────────────────────────────────────── */}
        <div
          style={{
            display:               'grid',
            gridTemplateColumns:   'repeat(4, 1fr)',
            gap:                   '8px',
          }}
        >
          {SLIDES.map((slide, idx) => (
            <button
              key={idx}
              className={`pis-thumb${idx === active ? ' pis-thumb--active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`View ${slide.label}`}
              aria-pressed={idx === active}
              style={{
                position:     'relative',
                border:       '2px solid transparent',
                borderRadius: '14px',
                overflow:     'hidden',
                aspectRatio:  '1 / 1',
                background:   slide.bg,
                cursor:       'pointer',
                padding:      0,
                boxShadow:    '0 1px 4px rgba(25,65,2,0.06)',
              }}
            >
              <img
                src={slide.src}
                alt={slide.label}
                loading="lazy"
                draggable={false}
                style={{
                  width:      '100%',
                  height:     '100%',
                  objectFit:  'contain',
                  padding:    '8px',
                  opacity:    idx === active ? 1 : 0.6,
                  transform:  idx === active ? 'scale(1.08)' : 'scale(1)',
                  transition: `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`,
                  willChange: 'opacity, transform',
                  display:    'block',
                }}
              />
              {/* Active underline indicator */}
              <span
                style={{
                  position:   'absolute',
                  bottom:     '4px',
                  left:       '50%',
                  transform:  'translateX(-50%)',
                  width:      idx === active ? '18px' : '0px',
                  height:     '3px',
                  borderRadius: '999px',
                  background: 'var(--surface-deep)',
                  transition: `width 0.4s ${EASE}`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
