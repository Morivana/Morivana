import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import gsap from 'gsap'
import FloatingLeaves from './FloatingLeaves'

export default function WaitlistCTA() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const apiBase = import.meta.env.VITE_API_URL ?? ''
      const res = await fetch(`${apiBase}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}))
        setError('root', { message: error || 'Something went wrong. Please try again.' })
        throw new Error(error || 'Request failed')
      }
    } catch (err) {
      console.error('Waitlist submission error:', err)
      throw err
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background glow
      gsap.to('.cta-glow', {
        scale: 1.3,
        scrollTrigger: {
          trigger: '#waitlist-cta',
          scrub: 2,
        },
      })
      // Kicker & sub-copy & social reveal individually
      gsap.utils.toArray('.cta-reveal').forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })
      // Headline reveal - word-by-word rise
      gsap.from('.cta-headline-word', {
        y: 60,
        opacity: 0,
        stagger: 0.14,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#waitlist-cta',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })
      // Form row reveal
      gsap.from('.cta-form-row', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-form-row',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="waitlist-cta"
      className="surface-deep cta-section"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 32px)',
      }}
    >
      <FloatingLeaves variant="dark" density="sparse" />

      {/* Photo collage background - irregular grid of brand lifestyle stills.
          Sits behind the radial glow and an overlay scrim for legibility. */}
      <div className="cta-collage" aria-hidden="true">
        <div className="cta-tile cta-tile--1" style={{ backgroundImage: 'url(/morivana-sip.jpeg)' }} />
        <div className="cta-tile cta-tile--2" style={{ backgroundImage: 'url(/Moringa%20Leaves%20Overhead.png)' }} />
        <div className="cta-tile cta-tile--3" style={{ backgroundImage: 'url(/morivana-scoop.png)' }} />
        <div className="cta-tile cta-tile--4" style={{ backgroundImage: 'url(/morivana-jar.jpeg)' }} />
        <div className="cta-tile cta-tile--5" style={{ backgroundImage: 'url(/Morning%20Light%20.png)' }} />
        <div className="cta-tile cta-tile--6" style={{ backgroundImage: 'url(/morivana-ingredients.png)' }} />
        <div className="cta-tile cta-tile--7" style={{ backgroundImage: 'url(/morivana-powder.jpeg)' }} />
      </div>

      {/* Dark green scrim for legibility */}
      <div className="cta-scrim" aria-hidden="true" />

      {/* Radial glow bg */}
      <div
        className="cta-glow"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200,230,48,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          transformOrigin: 'center',
          zIndex: 0,
        }}
      />

      <style>{`
        .cta-collage {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(8, 1fr);
          gap: 6px;
          padding: 6px;
          pointer-events: none;
          z-index: 0;
          opacity: 0.55;
        }
        .cta-tile {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 14px;
          filter: saturate(0.85) brightness(0.78) contrast(1.05);
          transition: filter 1.2s ease, transform 1.2s ease;
        }
        /* Asymmetric tile placement - covers full viewport without obvious grid */
        .cta-tile--1 { grid-column: 1 / 5;  grid-row: 1 / 5; }
        .cta-tile--2 { grid-column: 5 / 9;  grid-row: 1 / 4; }
        .cta-tile--3 { grid-column: 9 / 13; grid-row: 1 / 7; }
        .cta-tile--4 { grid-column: 5 / 7;  grid-row: 4 / 7; }
        .cta-tile--5 { grid-column: 7 / 9;  grid-row: 4 / 7; }
        .cta-tile--6 { grid-column: 1 / 5;  grid-row: 5 / 9; }
        .cta-tile--7 { grid-column: 5 / 13; grid-row: 7 / 9; }

        /* Gentle ken-burns drift - each tile breathes on its own cycle */
        @keyframes ctaTileDrift {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.10) translate(-1%, -1%); }
        }
        .cta-tile--1 { animation: ctaTileDrift 24s ease-in-out infinite; }
        .cta-tile--2 { animation: ctaTileDrift 28s ease-in-out infinite reverse; }
        .cta-tile--3 { animation: ctaTileDrift 30s ease-in-out infinite; }
        .cta-tile--4 { animation: ctaTileDrift 26s ease-in-out infinite reverse; }
        .cta-tile--5 { animation: ctaTileDrift 32s ease-in-out infinite; }
        .cta-tile--6 { animation: ctaTileDrift 27s ease-in-out infinite reverse; }
        .cta-tile--7 { animation: ctaTileDrift 31s ease-in-out infinite; }

        /* Layered scrim: dark green vignette + center spotlight for headline.
           Keeps the photos as ambient texture, never competing with copy. */
        .cta-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(20,33,17,0.55) 0%, rgba(20,33,17,0.85) 55%, rgba(20,33,17,0.96) 100%),
            linear-gradient(180deg, rgba(20,33,17,0.55) 0%, rgba(20,33,17,0.35) 50%, rgba(20,33,17,0.75) 100%);
        }

        /* TABLET (≤992px) — 6-column / 6-row grid covers the full section
           with 5 tiles. Two least-essential tiles are hidden so each remaining
           image is large enough to read as a photo, not a thumbnail. */
        @media (max-width: 992px) {
          .cta-collage {
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(6, 1fr);
            gap: 5px;
            padding: 5px;
            opacity: 0.48;
          }
          .cta-tile { border-radius: 12px; }
          .cta-tile--1 { grid-column: 1 / 4; grid-row: 1 / 4; }
          .cta-tile--2 { grid-column: 4 / 7; grid-row: 1 / 3; }
          .cta-tile--3 { grid-column: 4 / 7; grid-row: 3 / 5; }
          .cta-tile--6 { grid-column: 1 / 4; grid-row: 4 / 7; }
          .cta-tile--7 { grid-column: 4 / 7; grid-row: 5 / 7; }
          .cta-tile--4, .cta-tile--5 { display: none; }
        }

        /* PHONE (≤640px) — 2 col × 3 row grid. Four tiles, each big enough to
           clearly show the product. Tiles tile the full section height. */
        @media (max-width: 640px) {
          .cta-collage {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 6px;
            padding: 6px;
            opacity: 0.42;
          }
          .cta-tile { border-radius: 12px; }
          .cta-tile--1 { grid-column: 1 / 2; grid-row: 1 / 2; }
          .cta-tile--3 { grid-column: 2 / 3; grid-row: 1 / 2; }
          .cta-tile--6 { grid-column: 1 / 2; grid-row: 2 / 3; }
          .cta-tile--7 { grid-column: 2 / 3; grid-row: 2 / 3; }
          .cta-tile--2 { grid-column: 1 / 3; grid-row: 3 / 4; }
          .cta-tile--4, .cta-tile--5 { display: none; }
        }

        /* SMALL PHONE (≤380px) — Stack to a single column so each photo gets a
           full-width band; tighter ken-burns so motion doesn't look excessive. */
        @media (max-width: 380px) {
          .cta-collage {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 1fr);
            gap: 5px;
            padding: 5px;
            opacity: 0.38;
          }
          .cta-tile { grid-column: 1 / 2 !important; }
          .cta-tile--1 { grid-row: 1 / 2 !important; }
          .cta-tile--3 { grid-row: 2 / 3 !important; }
          .cta-tile--6 { grid-row: 3 / 4 !important; }
          .cta-tile--7 { grid-row: 4 / 5 !important; }
          .cta-tile--2, .cta-tile--4, .cta-tile--5 { display: none; }
        }
        @media (max-width: 480px) {
          .cta-section {
            min-height: auto !important;
            padding: 48px 16px !important;
          }
          .cta-form-row {
            gap: 12px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-tile { animation: none !important; }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        {/* Kicker */}
        <div className="kicker cta-reveal" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          LIMITED FIRST BATCH · INDIA &amp; CANADA
        </div>

        {/* Headline - editorial serif eyebrow + display sans */}
        <h2 style={{ margin: '0 0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div style={{ overflow: 'hidden' }}>
            <span
              className="cta-headline-word"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(36px, 8vw, 120px)',
                lineHeight: 0.9,
                color: 'var(--accent)',
                letterSpacing: '-0.025em',
                textTransform: 'uppercase',
                fontOpticalSizing: 'auto',
              }}
            >MORIVANÁ</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span
              className="cta-headline-word"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(18px, 3.6vw, 48px)',
                lineHeight: 1.05,
                color: 'var(--ink-on-dark)',
                letterSpacing: '-0.005em',
                fontOpticalSizing: 'auto',
              }}
            >Be the first to taste</span>
          </div>
        </h2>

        {/* Sub-copy */}
        <p
          className="cta-reveal"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--cream)',
            opacity: 0.85,
            maxWidth: '500px',
            margin: '0 auto 36px',
          }}
        >
          Sign up for early access and get an exclusive launch discount.
          Limited first batch available.
        </p>

        {/* Form or success state */}
        {isSubmitSuccessful ? (
          <div className="success-state">
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '20px',
            }}>
              ✓ Confirmed
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '2rem',
              color: 'var(--accent)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              You're on the list!
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--cream)',
              opacity: 0.85,
              lineHeight: 1.65,
            }}>
              We'll notify you at launch with your exclusive discount.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div
              className="cta-form-row"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              {/* Name */}
              <div>
                <input
                  className="waitlist-input"
                  type="text"
                  placeholder="Your first name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p style={{ fontFamily: 'var(--font-body)', color: '#ff8aa6', fontSize: '14px', marginTop: '6px', textAlign: 'left', paddingLeft: '18px' }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  className="waitlist-input"
                  type="email"
                  placeholder="Your email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
                {errors.email && (
                  <p style={{ fontFamily: 'var(--font-body)', color: '#ff8aa6', fontSize: '14px', marginTop: '6px', textAlign: 'left', paddingLeft: '18px' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="cta-btn"
                disabled={isSubmitting}
                style={{ padding: '16px 32px', fontSize: '14px', position: 'relative' }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span className="model-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                    Joining…
                  </span>
                ) : (
                  'Notify me  →'
                )}
              </button>

              {errors.root && (
                <p style={{ fontFamily: 'var(--font-body)', color: '#ff8aa6', fontSize: '14px', marginTop: '4px', textAlign: 'center' }}>
                  {errors.root.message}
                </p>
              )}

              {/* Trust line */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--ink-on-dark)',
                opacity: 0.6,
                marginTop: '6px',
                letterSpacing: '0.01em',
              }}>
                We protect your data. No spam. Unsubscribe anytime.
              </p>
            </div>
          </form>
        )}

        {/* Social proof */}
        <div
          className="cta-reveal"
          style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex' }}>
            {['#194102', '#2c6b1a', '#CDD883', '#E9FEDC', '#a8b466'].map((c, i) => (
              <div key={i} style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: c,
                border: '2px solid var(--dark)',
                marginLeft: i > 0 ? '-8px' : 0,
              }} />
            ))}
          </div>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--cream)',
            letterSpacing: '0.06em',
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>500+</span> people already on the waitlist
          </span>
        </div>
      </div>
    </section>
  )
}
