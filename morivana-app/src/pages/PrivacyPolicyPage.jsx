import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import FloatingLeaves from '../components/FloatingLeaves'
import ObfuscatedEmail from '../components/ObfuscatedEmail'
import SEOHead from '../components/SEOHead'

export default function PrivacyPolicyPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-base, #FFFCF2)',
        color: 'var(--surface-deep, #0E2701)',
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body, "DM Sans", system-ui, sans-serif)',
      }}
    >
      <SEOHead
        title="Privacy Policy | Morivaná Daily Super Greens Powder"
        description="Read the Privacy Policy for Morivaná Daily. Learn how we handle your waitlist and contact data for our daily super greens powder in India and Canada."
        canonical="/privacy-policy"
      />
      <FloatingLeaves variant="light" density="sparse" />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '680px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1.5px solid var(--line-soft, rgba(14, 39, 1, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 48px)',
          boxShadow: '0 20px 50px rgba(25, 65, 2, 0.04)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Brand wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '28px',
              color: 'var(--surface-deep)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              display: 'inline-block',
            }}
          >
            Morivaná Daily
          </Link>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(28px, 5vw, 36px)',
            color: 'var(--surface-deep)',
            marginBottom: '8px',
            borderBottom: '1px solid rgba(14, 39, 1, 0.08)',
            paddingBottom: '12px',
          }}
        >
          Privacy Policy
        </h1>
        
        <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
          Last updated: June 2, 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, fontSize: '0.98rem' }}>
          <p>
            Morivaná Daily values your privacy. This privacy policy describes how we collect, use, and share your personal information when you visit and join the waitlist at <strong>morivanadaily.com</strong>.
          </p>
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            Information We Collect
          </h2>
          <p>
            When you join our waitlist, we collect your name and email address. We use this information to send you early access invitations, launch notifications, and updates about our product. You can unsubscribe from these updates at any time by clicking the unsubscribe link in our emails.
          </p>
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            How We Use Your Data
          </h2>
          <p>
            We use your data solely for communications regarding the launch of Morivaná Daily. We do not sell, rent, or share your personal information with third parties. Your data is stored securely using encrypted cloud databases.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            Cookies & Tracking
          </h2>
          <p>
            We may use cookies to understand site performance and page load speeds, and to optimize the loading of 3D models and images. No personal identifier data is captured for these operations.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            Contact Us
          </h2>
          <p>
            If you have any questions or feedback regarding our privacy policy, please contact us at{' '}
            <ObfuscatedEmail style={{ color: 'var(--surface-deep)', fontWeight: 600 }} />.
          </p>
        </div>

        {/* Divider */}
        <hr
          className="dotted-line"
          style={{
            margin: '36px 0 24px',
            borderTopColor: 'rgba(14, 39, 1, 0.12)',
            width: '100%',
          }}
        />

        {/* Back link */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.78rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              opacity: 0.6,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
