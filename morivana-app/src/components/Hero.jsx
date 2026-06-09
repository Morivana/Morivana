import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FloatingLeaves from './FloatingLeaves'

export default function Hero({ revealKey = 0, bigEntrance = false }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Two entrance modes:
    //   default cold-load, snappy.
    //   bigEntrance post-loader, slower, more cinematic. Carries the cream/
    //   deep-green memory of the loader via a scrim that lifts as type rises.
    // In bigEntrance the parent column does the rising, so per-child y is 0
    // (otherwise they compound and the headline overshoots past readable).
    const s = prefersReducedMotion
      ? { mul: 0, lead: 0, headlineY: 0, kickerY: 0, ctaScale: 1 }
      : bigEntrance
        ? { mul: 1.15, lead: 0.0, headlineY: 0, kickerY: 0, ctaScale: 0.9 }
        : { mul: 1.0, lead: 0.20, headlineY: 60, kickerY: 30, ctaScale: 0.9 }

    const ctx = gsap.context(() => {
      if (bigEntrance) {
        // Bridge scrim slides UP in lockstep with the loader's exit so the
        // two motions read as a single curtain lifting.
        gsap.fromTo('.hero-bridge-scrim',
          { y: 0, opacity: 1 },
          { y: '-100%', opacity: 0, duration: prefersReducedMotion ? 0 : 1.1, ease: 'inOutQuart' }
        )
        // Hero column rises a modest 56px from below into place. Kept small
        // so the headline is always within the viewport during the lift —
        // never clipped behind the navbar on short screens.
        gsap.fromTo('.hero-text-col',
          { y: prefersReducedMotion ? 0 : 56, opacity: 0 },
          { y: 0, opacity: 1, duration: prefersReducedMotion ? 0 : 1.05, ease: 'power3.out', delay: prefersReducedMotion ? 0 : 0.05 }
        )
        // 3D pouch fades in alongside the headline. No translateY the
        // pouch position is scroll-controlled elsewhere; translating here
        // fights that and causes a snap when the entrance ends.
        gsap.fromTo('.global-canvas-layer',
          { opacity: 0 },
          { opacity: 1, duration: prefersReducedMotion ? 0 : 1.4, ease: 'power2.out', delay: prefersReducedMotion ? 0 : 0.2 }
        )
      }

      gsap.fromTo('.hero-kicker',
        { opacity: 0, y: prefersReducedMotion ? 0 : s.kickerY },
        { opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : 0.7 * s.mul, ease: 'power3.out', delay: prefersReducedMotion ? 0 : s.lead }
      )
      gsap.fromTo('.hero-word',
        { y: prefersReducedMotion ? 0 : 60, opacity: 0 },
        { y: 0, opacity: 1, duration: prefersReducedMotion ? 0 : 1.4 * s.mul, ease: 'power3.out', stagger: prefersReducedMotion ? 0 : 0.14, delay: prefersReducedMotion ? 0 : 0.35 * s.mul }
      )
      gsap.fromTo('.hero-divider',
        { scaleX: prefersReducedMotion ? 1 : 0 },
        { scaleX: 1, transformOrigin: 'left', duration: prefersReducedMotion ? 0 : 0.6 * s.mul, ease: 'power2.out', delay: prefersReducedMotion ? 0 : 0.8 * s.mul }
      )
      gsap.fromTo('.hero-sublabel',
        { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        { opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : 0.6 * s.mul, ease: 'power2.out', delay: prefersReducedMotion ? 0 : 0.9 * s.mul }
      )
      gsap.fromTo('.hero-body',
        { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        { opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : 0.6 * s.mul, ease: 'power2.out', delay: prefersReducedMotion ? 0 : 1.0 * s.mul }
      )
      gsap.fromTo('.hero-cta',
        { opacity: 0, scale: prefersReducedMotion ? 1 : s.ctaScale },
        { opacity: 1, scale: 1, duration: prefersReducedMotion ? 0 : 0.5 * s.mul, ease: 'back.out(1.4)', delay: prefersReducedMotion ? 0 : 1.2 * s.mul }
      )
      if (sectionRef.current.querySelector('.hero-countdown')) {
        gsap.fromTo('.hero-countdown',
          { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
          { opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : 0.5 * s.mul, ease: 'power2.out', delay: prefersReducedMotion ? 0 : 1.4 * s.mul }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [revealKey, bigEntrance])

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist-cta')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        paddingTop: '64px',
        background: 'var(--surface-base)',
        backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(205,216,131,0.35) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(233,254,220,0.6) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <FloatingLeaves variant="light" density="sparse" />

      {bigEntrance && (
        <div
          className="hero-bridge-scrim"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: '#1C3A1C',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* Text content editorial newspaper layout */}
      <div
        className="hero-layout"
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          className="hero-text-col"
          style={{
            maxWidth: '900px',
            width: '100%',
            padding: '72px 40px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            textAlign: 'left',
          }}
        >
          <div style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            border: '0',
          }}>
            Clean Daily Super Greens Powder 8 Whole Plants, Nothing Else
          </div>
          {/* ── BIG HEADLINE ── */}
          <h1 className="hero-headline" style={{ marginBottom: '12px' }}>
            <span className="hero-word hero-word-display" style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(48px, 8.5vw, 120px)',
              lineHeight: 0.9,
              color: 'var(--surface-deep)',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>PURE GREENS</span>
          </h1>

          {/* ── TWO-COLUMN META ROW ── */}
          <div className="hero-meta-row" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'flex-end',
            marginBottom: '18px',
            gap: '0 40px',
          }}>
            {/* Left: italic tagline + kicker */}
            <div>
              <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
                <span className="hero-word hero-word-italic" style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 500,
                  fontSize: 'clamp(15px, 1.8vw, 22px)',
                  lineHeight: 1.3,
                  color: 'var(--ink-soft)',
                }}>Quietly powerful</span>
              </div>
              <div className="kicker hero-kicker" style={{ margin: 0, textAlign: 'left' }}>
                CLEAN SUPER GREENS POWDER
              </div>
            </div>

            {/* Right: body copy */}
            <p
              className="hero-body"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 'clamp(0.82rem, 1.1vw, 0.95rem)',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
                margin: 0,
                textAlign: 'right',
              }}
            >
              Bold nutrition from the power of moringa.<br />
              Crafted for those who crave better health.
            </p>
          </div>

          {/* ── FULL-WIDTH DIVIDER ── */}
          <hr className="dotted-line hero-divider" style={{ width: '100%', marginBottom: '36px' }} />

          {/* ── LAUNCHING SOON label ── */}
          <div
            className="hero-sublabel"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--surface-deep)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            Launching Soon
          </div>

          {/* ── CTA ── */}
          <div className="hero-cta" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              className="cta-btn"
              onClick={scrollToWaitlist}
            >
              Join the Waitlist and Get 15% Off
            </button>
          </div>



          {/* ── Bottom product specs ── */}
          <div
            style={{
              paddingTop: '18px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--ink-mute)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              50g · 10 Servings · Ships India &amp; Canada
            </span>
          </div>
        </div>
      </div>



      <style>{`
        @media (max-width: 768px) {
          .hero-text-col {
            padding: 36px 24px 0 !important;
          }
          .hero-word-display {
            font-size: clamp(44px, 13vw, 76px) !important;
          }
          .hero-word-italic {
            font-size: clamp(15px, 4vw, 20px) !important;
          }
          .hero-meta-row {
            grid-template-columns: 1fr !important;
            gap: 12px 0 !important;
          }
          .hero-meta-row .hero-body {
            text-align: left !important;
          }
          .hero-body {
            font-size: 0.9rem !important;
          }
          .hero-sublabel {
            font-size: 0.68rem !important;
            letter-spacing: 0.2em !important;
            margin-bottom: 16px !important;
          }
          .hero-kicker {
            font-size: 0.62rem !important;
          }
          .hero-headline {
            margin-bottom: 8px !important;
          }
          .hero-divider {
            margin-bottom: 24px !important;
          }
        }
        @media (max-width: 480px) {
          .hero-text-col {
            padding: 28px 20px 0 !important;
          }
          .hero-word-display {
            font-size: clamp(40px, 12vw, 60px) !important;
          }
          .hero-word-italic {
            font-size: clamp(14px, 4vw, 18px) !important;
          }
          .hero-body {
            font-size: 0.86rem !important;
          }
          .hero-cta .cta-btn {
            font-size: 0.74rem !important;
            padding: 13px 24px !important;
          }
          .hero-kicker {
            font-size: 0.6rem !important;
          }
        }
      `}</style>
    </section>
  )
}
