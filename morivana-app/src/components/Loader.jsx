import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { animate, createTimeline, stagger } from 'animejs'
import { useAssetPreloader } from '../hooks/useAssetPreloader'

const PALETTE = {
  base: '#1C3A1C',
  leafMid: '#2E5A1E',
  cream: '#F5EDD6',
  accent: '#C8D96A',
}

// Abstract moringa-leaf sprig built from SVG paths. Each instance is
// scaled/tinted/positioned independently by the layer that renders it,
// so we get parametric variety without bitmap assets.
function LeafSprig({ tint, opacity = 1 }) {
  return (
    <svg viewBox="0 0 120 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <g fill={tint} opacity={opacity}>
        {/* central stem */}
        <path d="M60 10 C 60 60, 60 120, 60 195" stroke={tint} strokeWidth="1.2" fill="none" />
        {/* leaflets, alternating */}
        {[
          [30, 175, 14, 9, -22],
          [90, 162, 14, 9, 22],
          [26, 142, 16, 10, -18],
          [94, 128, 16, 10, 18],
          [22, 108, 17, 11, -14],
          [98, 92, 17, 11, 14],
          [28, 72, 15, 9, -12],
          [92, 56, 15, 9, 12],
          [36, 38, 12, 8, -8],
          [84, 24, 12, 8, 8],
          [60, 6, 10, 7, 0],
        ].map(([cx, cy, rx, ry, rot], i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            transform={`rotate(${rot} ${cx} ${cy})`}
          />
        ))}
      </g>
    </svg>
  )
}

// Field layer of slowly rising leaves. Each leaf has its own column,
// duration, delay and scale so the motion never reads as a loop.
function LeafField() {
  // 18 leaves, parameters generated once at module load for stable randomness.
  const leaves = useRef(
    Array.from({ length: 18 }, (_, i) => {
      const seed = i * 2654435761
      const r = (n) => {
        const x = Math.sin(seed * (n + 1)) * 10000
        return x - Math.floor(x)
      }
      return {
        left: r(1) * 100,
        scale: 0.35 + r(2) * 0.95,
        duration: 22 + r(3) * 28, // 22–50s
        delay: -r(4) * 40,
        drift: (r(5) - 0.5) * 18, // -9vw to +9vw lateral drift
        tilt: (r(6) - 0.5) * 50, // rotation range
        opacity: 0.06 + r(7) * 0.18,
        depth: r(8), // 0 = far/blurred, 1 = near
      }
    })
  ).current

  return (
    <div className="loader-leaf-field" aria-hidden="true">
      {leaves.map((l, i) => (
        <div
          key={i}
          className="loader-leaf"
          style={{
            left: `${l.left}%`,
            width: `${60 + l.scale * 90}px`,
            height: `${100 + l.scale * 150}px`,
            opacity: l.opacity,
            filter: `blur(${(1 - l.depth) * 2.2}px)`,
            animation: `loaderLeafRise ${l.duration}s linear ${l.delay}s infinite`,
            '--drift': `${l.drift}vw`,
            '--tilt': `${l.tilt}deg`,
          }}
        >
          <LeafSprig tint={PALETTE.leafMid} opacity={1} />
        </div>
      ))}
    </div>
  )
}

export default function Loader({ onDismiss, onLeaveStart }) {
  const { ready, progress } = useAssetPreloader()
  const [leaving, setLeaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  const wordmarkRef = useRef(null)
  const rootRef = useRef(null)
  // Single-fire latch any dismissal path (submit, skip, scroll, key, touch)
  // can only trigger the exit animation once.
  const dismissedRef = useRef(false)
  // Mount timestamp so we can enforce a grace period before scroll-dismiss
  // becomes active (otherwise a stray wheel tick eats the reveal animation).
  const mountedAtRef = useRef(Date.now())

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  // Load/Render Turnstile dynamically
  useEffect(() => {
    if (!turnstileSiteKey) return

    const scriptId = 'cf-turnstile-script'
    let script = document.getElementById(scriptId)
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallbackLoader'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    window.onloadTurnstileCallbackLoader = () => {
      if (window.turnstile && document.getElementById('turnstile-container-loader')) {
        try {
          window.turnstile.render('#turnstile-container-loader', {
            sitekey: turnstileSiteKey,
            callback: (token) => setTurnstileToken(token),
          })
        } catch (e) {
          // ignore
        }
      }
    }

    if (window.turnstile && document.getElementById('turnstile-container-loader')) {
      try {
        window.turnstile.render('#turnstile-container-loader', {
          sitekey: turnstileSiteKey,
          callback: (token) => setTurnstileToken(token),
        })
      } catch (e) {
        // ignore
      }
    }
  }, [turnstileSiteKey])

  useEffect(() => {
    if (!wordmarkRef.current) return
    const letters = wordmarkRef.current.querySelectorAll('.loader-letter')

    const tl = createTimeline({ defaults: { ease: 'outExpo' } })
    tl.add(letters, {
      opacity: [0, 1],
      translateY: [40, 0],
      filter: ['blur(10px)', 'blur(0px)'],
      duration: 900,
      delay: stagger(55),
    })
    tl.add('.loader-eyebrow', { opacity: [0, 1], translateY: [8, 0], duration: 600 }, 0)
    tl.add('.loader-tagline', { opacity: [0, 1], translateY: [10, 0], duration: 700 }, '-=500')
    tl.add('.loader-rule', { scaleX: [0, 1], duration: 800, ease: 'inOutQuad' }, '-=400')
    tl.add('.loader-form-row', { opacity: [0, 1], translateY: [16, 0], duration: 700 }, '-=350')
    tl.add('.loader-meta', { opacity: [0, 1], duration: 600 }, '-=300')
  }, [])

  const dismiss = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setLeaving(true)
    // Tell App to start revealing the hero NOW, while we're still leaving.
    onLeaveStart?.()
    animate(rootRef.current, {
      translateY: [0, '-100%'],
      opacity: [1, 0.85],
      duration: 1100,
      ease: 'inOutQuart',
      onComplete: () => onDismiss?.(),
    })
  }

  useEffect(() => {
    if (submitted && ready) dismiss()
  }, [submitted, ready])

  // Scroll/swipe/key gesture dismisses the loader. We enforce a 1500ms grace
  // period after mount so the entrance reveal can finish before stray input
  // can dismiss it.
  useEffect(() => {
    if (leaving) return
    const GRACE_MS = 1500
    const WHEEL_THRESHOLD = 10
    const TOUCH_THRESHOLD = 32

    const tooEarly = () => Date.now() - mountedAtRef.current < GRACE_MS

    const onWheel = (e) => {
      if (tooEarly()) return
      if (e.deltaY > WHEEL_THRESHOLD) dismiss()
    }
    let touchStartY = null
    const onTouchStart = (e) => {
      touchStartY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e) => {
      if (touchStartY == null || tooEarly()) return
      const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY)
      if (dy > TOUCH_THRESHOLD) dismiss()
    }
    const onKey = (e) => {
      if (tooEarly()) return
      if (
        e.key === 'ArrowDown' ||
        e.key === 'PageDown' ||
        e.key === ' '
      ) {
        dismiss()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [leaving])

  const onSubmit = async (data) => {
    // Honeypot check: Fail silently
    if (data.confirm_email) {
      setSubmitted(true)
      return
    }

    // Require Turnstile token if site key is configured
    if (turnstileSiteKey && !turnstileToken) {
      setError('root', { message: 'Please complete the CAPTCHA.' })
      return
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL ?? ''
      const res = await fetch(`${apiBase}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          confirm_email: data.confirm_email,
          turnstileToken,
        }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}))
        setError('root', { message: error || 'Something went wrong. Try again.' })
        return
      }
      setSubmitted(true)
    } catch (err) {
      setError('root', { message: 'Network error. Please retry.' })
    }
  }

  return (
    <div
      ref={rootRef}
      className="loader-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: PALETTE.base,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 56px)',
        overflow: 'hidden',
        pointerEvents: leaving ? 'none' : 'auto',
      }}
    >
      <LeafField />

      {/* Grain overlay SVG turbulence, ~5% opacity */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.05,
          mixBlendMode: 'overlay',
          zIndex: 1,
        }}
      >
        <filter id="loader-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#loader-grain)" />
      </svg>

      {/* Vignette to push edges */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 0%, transparent 50%, rgba(0,0,0,0.35) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="loader-stage"
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '22px',
          boxSizing: 'border-box',
        }}
      >
        {/* Coming soon eyebrow */}
        <div
          className="loader-eyebrow"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: PALETTE.cream,
            opacity: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <span
            aria-hidden="true"
            style={{ width: '24px', height: '1px', background: PALETTE.cream, opacity: 0.55 }}
          />
          Coming Soon
          <span
            aria-hidden="true"
            style={{ width: '24px', height: '1px', background: PALETTE.cream, opacity: 0.55 }}
          />
        </div>

        {/* Wordmark */}
        <h2
          ref={wordmarkRef}
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(38px, 12vw, 148px)',
            color: PALETTE.cream,
            letterSpacing: '0.06em',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            display: 'inline-flex',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {Array.from('MORIVANÁ').map((c, i) => (
            <span key={i} className="loader-letter" style={{ display: 'inline-block', opacity: 0 }}>
              {c}
            </span>
          ))}
        </h2>

        {/* Tagline */}
        <div
          className="loader-tagline"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(18px, 2.2vw, 28px)',
            color: PALETTE.cream,
            opacity: 0,
            letterSpacing: '0.005em',
            lineHeight: 1.2,
          }}
        >
          Be the first to taste
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="loader-form-row"
          style={{
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            opacity: 0,
            marginTop: '6px',
            boxSizing: 'border-box',
          }}
        >
          {/* Honeypot field (hidden from users, filled by bots) */}
          <div style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0, height: 0, overflow: 'hidden' }}>
            <input
              type="text"
              tabIndex="-1"
              autoComplete="off"
              placeholder="Do not fill this"
              {...register('confirm_email')}
            />
          </div>
          <div className="loader-field">
            <input
              type="text"
              placeholder="Your First Name"
              disabled={isSubmitting || submitted}
              {...register('name', { required: 'Name is required' })}
            />
          </div>
          {errors.name && <p className="loader-error">{errors.name.message}</p>}

          <div className="loader-field">
            <input
              type="email"
              placeholder="Your Email Address"
              disabled={isSubmitting || submitted}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email',
                },
              })}
            />
          </div>
          {errors.email && <p className="loader-error">{errors.email.message}</p>}

          {turnstileSiteKey && (
            <div
              id="turnstile-container-loader"
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginTop: '4px',
                marginBottom: '4px',
              }}
            />
          )}

          <button
            type="submit"
            className="loader-btn"
            disabled={isSubmitting || submitted}
          >
            <span className="loader-btn-label">
              {submitted
                ? ready
                  ? 'WELCOME →'
                  : 'PREPARING…'
                : isSubmitting
                  ? 'JOINING…'
                  : 'NOTIFY ME  →'}
            </span>
            <span className="loader-btn-shimmer" aria-hidden="true" />
          </button>

          {errors.root && <p className="loader-error" style={{ textAlign: 'center' }}>{errors.root.message}</p>}
        </form>

        {/* Breath rule + ready */}
        <div
          className="loader-meta"
          style={{
            opacity: 0,
            marginTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div className="loader-rule" style={{ transformOrigin: 'center' }} />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: '14px',
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: PALETTE.cream,
              opacity: 0.55,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {ready ? 'Ready' : `Preparing · ${String(progress).padStart(2, '0')}%`}
          </div>
        </div>
      </div>

      <style>{`
        .loader-leaf-field {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .loader-leaf {
          position: absolute;
          bottom: -240px;
          transform-origin: center;
          will-change: transform, opacity;
        }
        @keyframes loaderLeafRise {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          8% { opacity: var(--leaf-opacity, 1); }
          50% {
            transform: translate3d(calc(var(--drift) * 0.5), -55vh, 0) rotate(calc(var(--tilt) * 0.5));
          }
          92% { opacity: var(--leaf-opacity, 1); }
          100% {
            transform: translate3d(var(--drift), -120vh, 0) rotate(var(--tilt));
            opacity: 0;
          }
        }

        .loader-field {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .loader-field input {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(245, 237, 214, 0.45);
          color: ${PALETTE.cream};
          font-family: var(--font-body);
          font-weight: 400;
          font-size: 1rem;
          letter-spacing: 0.02em;
          padding: 12px 2px;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .loader-field input::placeholder {
          color: rgba(245, 237, 214, 0.55);
          font-family: var(--font-body);
          font-weight: 400;
          font-style: normal;
        }
        .loader-field input:focus {
          border-bottom-color: ${PALETTE.cream};
        }
        .loader-field input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .loader-field input:-webkit-autofill {
          -webkit-text-fill-color: ${PALETTE.cream};
          -webkit-box-shadow: 0 0 0px 1000px ${PALETTE.base} inset;
          transition: background-color 9999s ease-out;
        }

        .loader-error {
          font-family: var(--font-body);
          font-size: 14px;
          color: #ff8aa6;
          margin: -16px 0 0;
          text-align: left;
          letter-spacing: 0.02em;
        }

        .loader-btn {
          position: relative;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 18px 28px;
          background: ${PALETTE.base};
          border: 1px solid rgba(245, 237, 214, 0.65);
          color: ${PALETTE.cream};
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.3s ease, color 0.3s ease, box-shadow 0.4s ease;
          margin-top: 4px;
        }
        .loader-btn-label {
          position: relative;
          z-index: 2;
        }
        .loader-btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(200, 217, 106, 0.0) 35%,
            rgba(200, 217, 106, 0.55) 50%,
            rgba(200, 217, 106, 0.0) 65%,
            transparent 100%
          );
          transition: left 0.85s ease;
          z-index: 1;
        }
        .loader-btn:hover:not(:disabled) {
          border-color: ${PALETTE.accent};
          color: ${PALETTE.accent};
          box-shadow: 0 0 24px rgba(200, 217, 106, 0.18);
        }
        .loader-btn:hover:not(:disabled) .loader-btn-shimmer {
          left: 100%;
        }
        .loader-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loader-skip {
          background: transparent;
          border: none;
          color: ${PALETTE.cream};
          opacity: 0.5;
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: 0.92rem;
          letter-spacing: 0.01em;
          cursor: pointer;
          padding: 4px 8px;
          transition: opacity 0.25s ease;
        }
        .loader-skip:hover:not(:disabled) {
          opacity: 0.95;
        }
        .loader-skip:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .loader-rule {
          width: 32px;
          height: 1px;
          background: ${PALETTE.cream};
          opacity: 0.45;
        }

        @media (max-width: 520px) {
          .loader-root {
            padding: 12px 0 !important;
            align-items: center !important;
          }
          .loader-stage {
            width: calc(100vw - 48px) !important;
            max-width: calc(100vw - 48px) !important;
            gap: 14px !important;
            padding: 0 !important;
          }
          .loader-stage h2 {
            letter-spacing: 0.03em !important;
            font-size: clamp(30px, 10vw, 56px) !important;
          }
          .loader-form-row {
            width: 100% !important;
            max-width: 100% !important;
            gap: 14px !important;
            padding: 0 !important;
          }
          .loader-field {
            width: 100% !important;
          }
          .loader-field input {
            font-size: 16px !important;
            padding: 10px 0 !important;
            width: 100% !important;
          }
          .loader-btn {
            padding: 12px 14px !important;
            font-size: 14px !important;
            letter-spacing: 0.18em !important;
            width: 100% !important;
          }
          .loader-skip {
            font-size: 14px !important;
          }
          .loader-eyebrow {
            font-size: 14px !important;
            letter-spacing: 0.28em !important;
            gap: 8px !important;
          }
          .loader-tagline {
            font-size: clamp(14px, 4vw, 20px) !important;
          }
          .loader-meta {
            margin-top: 8px !important;
          }
        }
        @media (max-width: 380px) {
          .loader-stage {
            width: calc(100vw - 32px) !important;
            max-width: calc(100vw - 32px) !important;
            gap: 10px !important;
          }
          .loader-stage h2 {
            font-size: clamp(26px, 9vw, 44px) !important;
            letter-spacing: 0.02em !important;
          }
          .loader-form-row {
            gap: 12px !important;
          }
          .loader-field input {
            font-size: 16px !important;
            padding: 8px 0 !important;
          }
          .loader-btn {
            padding: 10px 10px !important;
            font-size: 14px !important;
            letter-spacing: 0.14em !important;
          }
          .loader-skip {
            font-size: 14px !important;
          }
          .loader-meta {
            margin-top: 4px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-leaf {
            animation-duration: 90s !important;
          }
          .loader-btn-shimmer { display: none; }
        }
      `}</style>
    </div>
  )
}

Loader.SESSION_KEY = 'morivana:loader-dismissed'
