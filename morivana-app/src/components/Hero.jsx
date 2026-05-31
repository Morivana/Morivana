import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CountdownTimer from './ui/CountdownTimer'
import FloatingLeaves from './FloatingLeaves'

export default function Hero({ revealKey = 0, bigEntrance = false }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Two entrance modes:
    //   default — cold-load, snappy.
    //   bigEntrance — post-loader, slower, more cinematic. Carries the cream/
    //   deep-green memory of the loader via a scrim that lifts as type rises.
    // In bigEntrance the parent column does the rising, so per-child y is 0
    // (otherwise they compound and the headline overshoots past readable).
    const s = bigEntrance
      ? { mul: 1.15, lead: 0.0,  headlineY: 0,  kickerY: 0,  ctaScale: 0.9 }
      : { mul: 1.0,  lead: 0.20, headlineY: 60, kickerY: 30, ctaScale: 0.9 }

    const ctx = gsap.context(() => {
      if (bigEntrance) {
        // Bridge scrim slides UP in lockstep with the loader's exit so the
        // two motions read as a single curtain lifting.
        gsap.fromTo('.hero-bridge-scrim',
          { y: 0, opacity: 1 },
          { y: '-100%', opacity: 0, duration: 1.1, ease: 'inOutQuart' }
        )
        // Hero column rises a modest 56px from below into place. Kept small
        // so the headline is always within the viewport during the lift —
        // never clipped behind the navbar on short screens.
        gsap.fromTo('.hero-text-col',
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', delay: 0.05 }
        )
        // 3D pouch fades in alongside the headline. No translateY — the
        // pouch position is scroll-controlled elsewhere; translating here
        // fights that and causes a snap when the entrance ends.
        gsap.fromTo('.global-canvas-layer',
          { opacity: 0 },
          { opacity: 1, duration: 1.4, ease: 'power2.out', delay: 0.2 }
        )
      }

      gsap.from('.hero-kicker', {
        opacity: 0, y: s.kickerY,
        duration: 0.7 * s.mul, ease: 'power3.out',
        delay: s.lead,
      })
      gsap.from('.hero-word', {
        y: 60, opacity: 0,
        duration: 1.4 * s.mul, ease: 'power3.out',
        stagger: 0.14,
        delay: 0.35 * s.mul,
      })
      gsap.from('.hero-divider', {
        scaleX: 0, transformOrigin: 'left',
        duration: 0.6 * s.mul, ease: 'power2.out',
        delay: 0.8 * s.mul,
      })
      gsap.from('.hero-sublabel', {
        opacity: 0, y: 20,
        duration: 0.6 * s.mul, ease: 'power2.out',
        delay: 0.9 * s.mul,
      })
      gsap.from('.hero-body', {
        opacity: 0, y: 20,
        duration: 0.6 * s.mul, ease: 'power2.out',
        delay: 1.0 * s.mul,
      })
      gsap.from('.hero-cta', {
        opacity: 0, scale: s.ctaScale,
        duration: 0.5 * s.mul, ease: 'back.out(1.4)',
        delay: 1.2 * s.mul,
      })
      gsap.from('.hero-countdown', {
        opacity: 0, y: 10,
        duration: 0.5 * s.mul, ease: 'power2.out',
        delay: 1.4 * s.mul,
      })
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

      {/* Text content - anchored to top half so 3D pouch can sit below */}
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
            maxWidth: '740px',
            width: '100%',
            padding: '72px 32px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Kicker */}
          <div className="kicker hero-kicker" style={{ marginBottom: '20px' }}>
            CLEAN SUPER GREENS POWDER
          </div>

          {/* Headline — split PURE / GREENS for maximum impact at large sizes */}
          <div className="hero-headline" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
            <div style={{ overflow: 'hidden' }}>
              <span className="hero-word hero-word-display" style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(52px, 9vw, 128px)',
                lineHeight: 0.92,
                color: 'var(--surface-deep)',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
              }}>PURE</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="hero-word hero-word-display" style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(52px, 9vw, 128px)',
                lineHeight: 0.92,
                color: 'var(--surface-deep)',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
              }}>GREENS</span>
            </div>
          </div>

          {/* Italic sub-headline */}
          <div style={{ overflow: 'hidden', marginBottom: '22px' }}>
            <span className="hero-word hero-word-italic" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(18px, 2.6vw, 30px)',
              lineHeight: 1.2,
              color: 'var(--ink-soft)',
              letterSpacing: '-0.005em',
            }}>Quietly powerful</span>
          </div>

          {/* Dotted divider */}
          <hr className="dotted-line hero-divider" style={{ width: '44%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '22px' }} />

          {/* Body paragraph */}
          <p
            className="hero-body"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--ink-soft)',
              maxWidth: '420px',
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            Bold nutrition from the power of moringa.<br />
            Crafted for those who crave better health.
          </p>

          {/* CTA */}
          <div className="hero-cta" style={{ marginBottom: '16px' }}>
            <button
              className="cta-btn"
              onClick={scrollToWaitlist}
            >
              Join the waitlist · Get 15% off
            </button>
          </div>

          {/* Sub-trust */}
          <div
            className="hero-sublabel"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.72rem',
              color: 'var(--ink-mute)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            50g · 10 Servings · Ships India &amp; Canada
          </div>

          {/* Countdown */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: '10px',
              }}
            >
              Launching in
            </div>
            <CountdownTimer />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: 0.5,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.62rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
        }}>
          Scroll
        </div>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, var(--ink-mute), transparent)',
          animation: 'scrollPulse 1.8s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.7); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @media (max-width: 768px) {
          .hero-text-col {
            padding: 36px 24px 0 !important;
          }
          .hero-word-display {
            font-size: clamp(44px, 13vw, 76px) !important;
          }
          .hero-word-italic {
            font-size: clamp(17px, 4.5vw, 26px) !important;
          }
          .hero-body {
            font-size: 0.92rem !important;
            margin-bottom: 22px !important;
          }
          .hero-sublabel {
            font-size: 0.68rem !important;
            letter-spacing: 0.2em !important;
            margin-bottom: 20px !important;
          }
          .hero-kicker {
            font-size: 0.62rem !important;
            margin-bottom: 16px !important;
          }
          .hero-headline {
            margin-bottom: 4px !important;
          }
          .hero-divider {
            margin-bottom: 18px !important;
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
            font-size: clamp(15px, 4vw, 22px) !important;
          }
          .hero-body {
            font-size: 0.88rem !important;
            margin-bottom: 20px !important;
          }
          .hero-cta .cta-btn {
            font-size: 0.74rem !important;
            padding: 13px 24px !important;
          }
          .hero-kicker {
            font-size: 0.6rem !important;
            margin-bottom: 14px !important;
          }
        }
      `}</style>
    </section>
  )
}
