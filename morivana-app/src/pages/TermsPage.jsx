import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import FloatingLeaves from '../components/FloatingLeaves'
import ObfuscatedEmail from '../components/ObfuscatedEmail'
import SEOHead from '../components/SEOHead'

export default function TermsPage() {
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
        title="Terms of Use & Conditions | Morivaná Daily Super Greens"
        description="Read the Terms of Use for Morivaná Daily. Learn about our pre-launch waitlist, intellectual property, and guidelines for using our super greens website."
        canonical="/terms"
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
          Terms of Use
        </h1>
        
        <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
          Last updated: June 2, 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, fontSize: '0.98rem' }}>
          <p>
            Welcome to Morivaná Daily. By accessing or using our website at <strong>morivana.com</strong>, you agree to comply with and be bound by these Terms of Use.
          </p>
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            Website Use
          </h2>
          <p>
            Our website is currently in its pre-launch/waitlist phase. All content, product descriptions, pricing estimates, and shipping availability displayed on the site are subject to change. Signing up on the waitlist does not constitute a purchase agreement or guarantee product allocation.
          </p>
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            User Content
          </h2>
          <p>
            When submitting information on our waitlist forms, you represent that all information provided is accurate and yours to provide. Any attempt to abuse the waitlist form via bots, script submissions, or automated brute-forcing is strictly prohibited and subject to automated IP blocking.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            Intellectual Property
          </h2>
          <p>
            All material, graphics, layout, photography, copywriting, and 3D models contained on this site are the intellectual property of Morivaná Daily and may not be reproduced, copied, or modified without express written authorization.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '12px', color: 'var(--surface-deep)' }}>
            Contact Us
          </h2>
          <p>
            If you have any questions or feedback regarding these terms, please reach out to us at{' '}
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
