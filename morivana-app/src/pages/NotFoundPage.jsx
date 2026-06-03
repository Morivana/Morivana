import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import SEOHead from '../components/SEOHead'
import FloatingLeaves from '../components/FloatingLeaves'

export default function NotFoundPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-base, #FFFFFF)',
        color: 'var(--ink, #0E2701)',
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body, "DM Sans", system-ui, sans-serif)',
      }}
    >
      <SEOHead
        title="Page Not Found | Morivaná"
        description="The page you are looking for does not exist. Explore our daily super greens, check out our 8 organic ingredients, or view health benefits."
        canonical="/404"
        noindex={true}
      />

      <FloatingLeaves variant="light" density="sparse" />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1.5px solid var(--line-soft, rgba(14, 39, 1, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 48px)',
          boxShadow: '0 20px 50px rgba(25, 65, 2, 0.04)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Large 404 indicator */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(3rem, 10vw, 5.5rem)',
            fontWeight: 800,
            color: 'var(--surface-deep)',
            lineHeight: 1,
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          404
        </div>

        {/* Brand wordmark */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '20px',
              color: 'var(--surface-deep)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              display: 'inline-block',
            }}
          >
            Morivaná
          </Link>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(22px, 4vw, 30px)',
            color: 'var(--surface-deep)',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}
        >
          Lost in the Forest?
        </h1>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--ink-soft, #3F5C32)',
            marginBottom: '32px',
          }}
        >
          The page you are looking for has either been moved, renamed, or doesn't exist in our ecosystem. Let's get you back on track.
        </p>

        {/* Helpful navigation routes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '36px',
          }}
        >
          <Link
            to="/"
            className="cta-btn"
            style={{
              width: '100%',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Back to Homepage
          </Link>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <Link
              to="/ingredients"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--surface-deep)',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-soft)'
                e.currentTarget.style.borderColor = 'var(--surface-deep)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'var(--line-soft)'
              }}
            >
              Ingredients
            </Link>

            <Link
              to="/benefits"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--surface-deep)',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-soft)'
                e.currentTarget.style.borderColor = 'var(--surface-deep)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'var(--line-soft)'
              }}
            >
              Benefits
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <Link
              to="/science"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--surface-deep)',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-soft)'
                e.currentTarget.style.borderColor = 'var(--surface-deep)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'var(--line-soft)'
              }}
            >
              Science
            </Link>

            <Link
              to="/shop"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--surface-deep)',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                padding: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-soft)'
                e.currentTarget.style.borderColor = 'var(--surface-deep)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'var(--line-soft)'
              }}
            >
              Pre-Order
            </Link>
          </div>
        </div>

        {/* Divider */}
        <hr
          className="dotted-line"
          style={{
            margin: '24px 0 24px',
            borderTopColor: 'rgba(14, 39, 1, 0.12)',
            width: '100%',
          }}
        />

        {/* Support mail */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--ink-mute, #7A8A6E)',
            lineHeight: 1.5,
          }}
        >
          Need assistance? Reach out at{' '}
          <a
            href="mailto:Morivana.daily@gmail.com"
            style={{
              color: 'var(--surface-deep)',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            Morivana.daily@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
