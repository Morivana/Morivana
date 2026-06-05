import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import FloatingLeaves from '../components/FloatingLeaves'

/**
 * OrdersPage — Protected order history page.
 * Light-surface variant matching the AccountPage / Hero / Benefits sections.
 */
export default function OrdersPage() {
  // Dynamic client-side noindex to ensure search engines do not index the orders page
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    const originalVal = meta.getAttribute('content') || 'index, follow'
    meta.setAttribute('content', 'noindex, nofollow')
    return () => {
      meta.setAttribute('content', originalVal)
    }
  }, [])
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-base)',
        backgroundImage:
          'radial-gradient(ellipse at 90% 10%, rgba(205,216,131,0.22) 0%, transparent 50%), radial-gradient(ellipse at 5% 85%, rgba(233,254,220,0.50) 0%, transparent 55%)',
        paddingTop: '80px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingLeaves variant="light" density="sparse" />

      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 40px)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Breadcrumb */}
        <Link
          to="/account"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '40px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--surface-deep)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-soft)')}
        >
          ← My Account
        </Link>

        {/* Kicker + Headline */}
        <div className="kicker" style={{ marginBottom: '10px' }}>
          Order history
        </div>
        <h1
          className="section-headline"
          style={{
            fontSize: 'clamp(32px, 7vw, 64px)',
            marginBottom: '40px',
            lineHeight: 0.92,
          }}
        >
          Your Orders
        </h1>

        <hr className="dotted-line" style={{ marginBottom: '40px' }} />

        {/* Empty state */}
        <div
          style={{
            background: 'var(--surface-base)',
            borderRadius: '20px',
            border: '1px solid var(--line-soft)',
            boxShadow: '0 8px 40px rgba(25, 65, 2, 0.06)',
            padding: 'clamp(48px, 8vw, 80px) clamp(24px, 4vw, 40px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle bg tint */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 100%, rgba(233,254,220,0.60) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
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
                background: 'var(--surface-soft)',
                border: '1px solid var(--line-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                color: 'var(--surface-deep)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10H3M16 2l5 5-5 5M8 22l-5-5 5-5" />
                <rect x="1" y="3" width="22" height="18" rx="2" />
              </svg>
            </div>

            {/* Kicker */}
            <div className="kicker" style={{ marginBottom: '12px' }}>
              Nothing here yet
            </div>

            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: 'clamp(20px, 4vw, 28px)',
                color: 'var(--surface-deep)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: '12px',
              }}
            >
              No orders placed yet
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                color: 'var(--ink-mute)',
                maxWidth: '380px',
                margin: '0 auto 32px',
                lineHeight: 1.65,
              }}
            >
              Once your first order ships, you'll find it here with full tracking and details.
            </p>

            <Link to="/" className="cta-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Shop Morivaná Daily
            </Link>

            {/* Specs strip */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--line-soft)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              {['Ships India & Canada', '50g · 10 Servings', 'Secure checkout'].map(spec => (
                <span
                  key={spec}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    color: 'var(--ink-mute)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ color: 'var(--surface-deep)' }}>·</span>
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
