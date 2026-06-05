import { SignIn } from '@clerk/react'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@clerk/react'
import FloatingLeaves from '../components/FloatingLeaves'

/**
 * SignInPage — Clerk sign-in styled to Morivana's editorial luxury aesthetic.
 *
 * Layout mirrors the WaitlistCTA section:
 *   dark forest surface + citrus headline + FloatingLeaves ambient texture
 *   + photo collage background tiles for depth.
 *
 * After sign-in: reads sessionStorage redirect (set by ProtectedRoute) or
 * falls back to /account.
 */
export default function SignInPage() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn) {
      const saved = sessionStorage.getItem('clerk_redirect_url')
      sessionStorage.removeItem('clerk_redirect_url')
      navigate(saved || '/account', { replace: true })
    }
  }, [isSignedIn, navigate])

  // Dynamic client-side noindex to ensure search engines do not index the sign-in page
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
        background: 'var(--surface-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 32px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient floating leaves — same as landing page sections */}
      <FloatingLeaves variant="dark" density="sparse" />

      {/* Photo collage background — same tiles as WaitlistCTA */}
      <div className="auth-collage" aria-hidden="true">
        <div className="auth-tile auth-tile--1" style={{ backgroundImage: 'url(/Moringa%20Leaves%20Overhead.webp)' }} />
        <div className="auth-tile auth-tile--2" style={{ backgroundImage: 'url(/morivana-scoop.webp)' }} />
        <div className="auth-tile auth-tile--3" style={{ backgroundImage: 'url(/morivana-powder.jpeg)' }} />
        <div className="auth-tile auth-tile--4" style={{ backgroundImage: 'url(/morivana-jar.jpeg)' }} />
      </div>
      {/* Dark scrim for legibility */}
      <div className="auth-scrim" aria-hidden="true" />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(200,230,48,0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content column */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
        }}
      >
        {/* Kicker */}
        <div
          className="kicker"
          style={{
            color: 'var(--accent)',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Welcome back
        </div>

        {/* Wordmark */}
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(36px, 8vw, 56px)',
            color: 'var(--accent)',
            letterSpacing: '-0.01em',
            lineHeight: 0.92,
            textDecoration: 'none',
            display: 'block',
            textAlign: 'center',
            marginBottom: '4px',
          }}
        >
          Morivaná
        </Link>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'var(--ink-on-dark)',
            opacity: 0.75,
            textAlign: 'center',
            marginBottom: '20px',
            letterSpacing: '-0.005em',
          }}
        >
          Sign in to your account
        </div>

        {/* Clerk card */}
        <div style={{ width: '100%' }}>
          <SignIn
            routing="path"
            path="/sign-in"
            afterSignInUrl="/account"
            signUpUrl="/sign-up"
            appearance={{
              variables: {
                colorPrimary: '#194102',
                colorBackground: '#FFFFFF',
                colorText: '#0E2701',
                colorTextSecondary: '#7A8A6E',
                colorInputBackground: '#FFFFFF',
                colorInputText: '#0E2701',
                colorDanger: '#b34a4a',
                borderRadius: '12px',
                fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif',
                fontSize: '14px',
                spacing: '0.65rem',
              },
              elements: {
                rootBox: {
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                cardBox: {
                  borderRadius: '16px',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(205,216,131,0.08)',
                  border: 'none',
                  background: '#fff',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                },
                card: {
                  background: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                  padding: '24px 24px 8px',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '100%',
                  boxSizing: 'border-box',
                },
                header: {
                  display: 'none',
                },
                dividerRow: {
                  color: '#7A8A6E',
                },
                socialButtonsBlockButton: {
                  border: '1.5px solid rgba(14, 39, 1, 0.14)',
                  borderRadius: '999px',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  transition: 'background 0.2s, border-color 0.2s',
                  padding: '8px 16px',
                },
                socialButtonsBlockButtonText: {
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontWeight: 600,
                },
                formButtonPrimary: {
                  background: '#194102',
                  color: '#CDD883',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  borderRadius: '999px',
                  padding: '11px 24px',
                  boxShadow: '0 6px 24px rgba(25, 65, 2, 0.22)',
                  transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                  border: 'none',
                },
                formFieldLabel: {
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: '#3F5C32',
                  letterSpacing: '0.04em',
                },
                formFieldInput: {
                  border: '1.5px solid rgba(14, 39, 1, 0.14)',
                  borderRadius: '10px',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: '0.9rem',
                  padding: '10px 14px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  outline: 'none',
                },
                footerActionLink: {
                  color: '#194102',
                  fontWeight: 700,
                  textDecoration: 'none',
                  minHeight: 'unset',
                  minWidth: 'unset',
                  padding: '0',
                  margin: '0',
                },
                footerActionText: {
                  color: '#7A8A6E',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                },
                footerAction: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                },
                footer: {
                  background: 'transparent',
                  marginTop: '0px',
                  borderTop: '1px solid rgba(14, 39, 1, 0.08)',
                  padding: '12px 24px 16px',
                  boxSizing: 'border-box',
                },
                identityPreviewText: {
                  color: '#3F5C32',
                },
                formResendCodeLink: {
                  color: '#194102',
                  fontWeight: 600,
                },
              },
            }}
          />
        </div>

        {/* Divider */}
        <hr
          className="dotted-line"
          style={{
            borderTopColor: 'rgba(205,216,131,0.20)',
            margin: '16px 0 12px',
            width: '100%',
          }}
        />

        {/* Back to site */}
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.78rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-on-dark)',
            opacity: 0.55,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
        >
          ← Back to Morivaná
        </Link>
      </div>

      <style>{`
        .auth-collage {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: 6px;
          padding: 6px;
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }
        .auth-tile {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 12px;
          filter: saturate(0.75) brightness(0.65) contrast(1.05);
        }
        .auth-tile--1 { grid-column: 1 / 3; grid-row: 1 / 3; }
        .auth-tile--2 { grid-column: 5 / 7; grid-row: 1 / 3; }
        .auth-tile--3 { grid-column: 1 / 3; grid-row: 3 / 5; }
        .auth-tile--4 { grid-column: 5 / 7; grid-row: 3 / 5; }
        .auth-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(20,33,17,0.55) 0%, rgba(20,33,17,0.88) 50%, rgba(20,33,17,0.97) 100%),
            linear-gradient(180deg, rgba(20,33,17,0.60) 0%, rgba(20,33,17,0.30) 50%, rgba(20,33,17,0.75) 100%);
        }
        @media (max-width: 640px) {
          .auth-collage { display: none; }
        }
      `}</style>
    </div>
  )
}
