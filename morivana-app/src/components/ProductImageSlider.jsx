import { useState, useEffect, useRef, useCallback } from 'react'

// In dev: files in public/ are served at / by Vite — no CDN needed.
// In prod: serve from jsDelivr for global CDN performance.
const CDN = import.meta.env.DEV
  ? ''
  : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public'

const SLIDES = [
  {
    src: `${CDN}/bg-removed-front.png`,
    label: 'Front View',
    bg: 'linear-gradient(135deg, #EEF7E4 0%, #F4FBEC 100%)',
  },
  {
    src: `${CDN}/bgremoved-back.png`,
    label: 'Back View',
    bg: 'linear-gradient(135deg, #E9F5E1 0%, #F0F9E8 100%)',
  },
  {
    src: `${CDN}/flat-front.png`,
    label: 'Flat Lay — Front',
    bg: 'linear-gradient(135deg, #F5F0E8 0%, #FAF7F0 100%)',
  },
  {
    src: `${CDN}/flat-back.png`,
    label: 'Flat Lay — Back',
    bg: 'linear-gradient(135deg, #EEF0F5 0%, #F4F5FA 100%)',
  },
]

const AUTO_PLAY_MS = 4000

export default function ProductImageSlider() {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef(null)
  const touchStartX = useRef(null)

  const goTo = useCallback((idx) => {
    if (idx === active || transitioning) return
    setPrev(active)
    setTransitioning(true)
    setActive(idx)
    setTimeout(() => {
      setPrev(null)
      setTransitioning(false)
    }, 420)
  }, [active, transitioning])

  const next = useCallback(() => goTo((active + 1) % SLIDES.length), [active, goTo])
  const prev_ = useCallback(() => goTo((active - 1 + SLIDES.length) % SLIDES.length), [active, goTo])

  // Auto-play (pause on hover)
  useEffect(() => {
    if (hovered) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(next, AUTO_PLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [hovered, next])

  // Touch swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev_()
    touchStartX.current = null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', userSelect: 'none' }}>
      {/* ── Main card ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          aspectRatio: '1 / 1',
          background: SLIDES[active].bg,
          cursor: 'zoom-in',
          boxShadow: '0 8px 40px rgba(25,65,2,0.10)',
          transition: 'box-shadow 0.3s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={next}
      >
        {/* Background of outgoing image */}
        {prev !== null && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: SLIDES[prev].bg,
              zIndex: 0,
            }}
          />
        )}

        {/* Outgoing image */}
        {prev !== null && (
          <img
            src={SLIDES[prev].src}
            alt={SLIDES[prev].label}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '24px',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              zIndex: 1,
            }}
          />
        )}

        {/* Active image */}
        <img
          key={active}
          src={SLIDES[active].src}
          alt={SLIDES[active].label}
          loading={active === 0 ? 'eager' : 'lazy'}
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '24px',
            opacity: transitioning ? 0 : 1,
            transform: hovered ? 'scale(1.035)' : 'scale(1)',
            transition: transitioning
              ? 'opacity 0.4s ease, transform 0.4s ease'
              : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {/* Label badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '0.58rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--surface-deep)',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '999px',
            padding: '5px 12px',
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          {SLIDES[active].label}
        </div>

        {/* Slide counter */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '0.58rem',
            letterSpacing: '0.12em',
            color: 'var(--ink-mute)',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '999px',
            padding: '5px 10px',
          }}
        >
          {active + 1} / {SLIDES.length}
        </div>

        {/* Left / Right arrows */}
        {[
          { dir: 'left', action: (e) => { e.stopPropagation(); prev_() } },
          { dir: 'right', action: (e) => { e.stopPropagation(); next() } },
        ].map(({ dir, action }) => (
          <button
            key={dir}
            onClick={action}
            aria-label={`${dir === 'left' ? 'Previous' : 'Next'} image`}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [dir]: '12px',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: 'var(--surface-deep)',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.25s ease, transform 0.2s ease, background 0.2s',
              boxShadow: '0 2px 12px rgba(25,65,2,0.14)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,1)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.88)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
          >
            {dir === 'left' ? '←' : '→'}
          </button>
        ))}

        {/* Auto-play progress bar */}
        {!hovered && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              background: 'var(--surface-deep)',
              opacity: 0.18,
              zIndex: 10,
              animation: `slider-progress ${AUTO_PLAY_MS}ms linear infinite`,
            }}
          />
        )}
      </div>

      {/* ── Thumbnail row ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {SLIDES.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`View ${slide.label}`}
            style={{
              position: 'relative',
              border: idx === active
                ? '2px solid var(--surface-deep)'
                : '2px solid transparent',
              borderRadius: '14px',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              background: slide.bg,
              cursor: 'pointer',
              padding: 0,
              transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: idx === active
                ? '0 4px 16px rgba(25,65,2,0.18)'
                : '0 1px 4px rgba(25,65,2,0.06)',
              transform: idx === active ? 'scale(1.04)' : 'scale(1)',
            }}
            onMouseEnter={e => {
              if (idx !== active) {
                e.currentTarget.style.borderColor = 'var(--accent-strong)'
                e.currentTarget.style.transform = 'scale(1.04)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,65,2,0.12)'
              }
            }}
            onMouseLeave={e => {
              if (idx !== active) {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(25,65,2,0.06)'
              }
            }}
          >
            <img
              src={slide.src}
              alt={slide.label}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '8px',
                opacity: idx === active ? 1 : 0.65,
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                transform: idx === active ? 'scale(1.06)' : 'scale(1)',
              }}
            />
            {/* Active dot indicator */}
            {idx === active && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--surface-deep)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === active ? '20px' : '6px',
              height: '6px',
              borderRadius: '999px',
              border: 'none',
              background: idx === active ? 'var(--surface-deep)' : 'var(--line-soft)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Progress bar keyframe (injected once) */}
      <style>{`
        @keyframes slider-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}
