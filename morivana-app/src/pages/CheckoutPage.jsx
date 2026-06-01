import { Link } from 'react-router-dom'
import FloatingLeaves from '../components/FloatingLeaves'

/**
 * CheckoutPage — Protected checkout placeholder.
 * Uses the dark surface (surface-deep) to feel transactional and premium,
 * matching the WaitlistCTA section's authority.
 */
export default function CheckoutPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingLeaves variant="dark" density="sparse" />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200,230,48,0.10) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '680px',
          textAlign: 'center',
        }}
      >
        {/* Kicker */}
        <div
          className="kicker"
          style={{ color: 'var(--accent)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}
        >
          Secure checkout
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(40px, 9vw, 100px)',
            lineHeight: 0.9,
            color: 'var(--accent)',
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          Checkout
        </h1>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: 'var(--ink-on-dark)',
            opacity: 0.75,
            marginBottom: '40px',
            letterSpacing: '-0.005em',
          }}
        >
          Almost there
        </div>

        <hr
          className="dotted-line"
          style={{ borderTopColor: 'var(--line-on-dark)', marginBottom: '40px' }}
        />

        {/* Status card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '20px',
            border: '1px solid var(--line-on-dark)',
            padding: 'clamp(40px, 6vw, 64px) clamp(24px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'rgba(205,216,131,0.12)',
              border: '1px solid rgba(205,216,131,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              color: 'var(--accent)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              color: 'var(--accent)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '12px',
            }}
          >
            Payment coming soon
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--ink-on-dark)',
              opacity: 0.75,
              maxWidth: '380px',
              margin: '0 auto 32px',
            }}
          >
            We're finalising our payment integration. Join the waitlist and
            we'll notify you the moment orders open.
          </p>

          {/* Inline CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/#waitlist-cta"
              className="cta-btn"
              style={{ textDecoration: 'none' }}
            >
              Join the Waitlist
            </Link>
            <Link
              to="/"
              className="nav-pill"
              style={{
                textDecoration: 'none',
                color: 'var(--ink-on-dark)',
                borderColor: 'var(--line-on-dark)',
              }}
            >
              Continue browsing
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          {['Vegan', 'Soy-Free', 'No Added Sugar', 'Ships India & Canada'].map(cert => (
            <span
              key={cert}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.66rem',
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: 'var(--accent-strong)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>✓</span>
              {cert}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
