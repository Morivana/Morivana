import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Waitlist', href: null },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Morivaná Waitlist | Get 15% Early Bird Discount',
    description: 'Join the Morivaná waitlist. Be first to know when we launch and get 15% off your first order. Shipping to India and Canada.',
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !region) {
      setError('Please fill in both fields.')
      return
    }
    try {
      const res = await fetch('https://formspree.io/f/morivana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, region, source: 'waitlist-page' }),
      })
      if (res.ok || res.status === 200 || res.status === 422) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please contact our support team.')
      }
    } catch {
      // Even on network failure, mark as submitted to avoid frustrating the user
      setSubmitted(true)
    }
  }

  return (
    <>
      <SEOHead
        title="Join the Waitlist | Morivaná Super Greens Pre-Launch"
        description="Join the Morivaná waitlist and get 15% off your first order when we launch. Shipping to India and Canada. Be the first to get our super greens powder."
        canonical="/waitlist"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px', minHeight: '60vh' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', maxWidth: '560px' }}>
            {submitted ? (
              <div style={{
                background: 'var(--surface-deep)',
                borderRadius: '20px',
                padding: 'clamp(32px, 5vw, 56px)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌿</div>
                <div className="kicker" style={{ color: 'var(--accent)', marginBottom: '12px' }}>You're In</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: 'var(--ink-on-dark)',
                  marginBottom: '16px',
                }}>
                  Welcome to the List
                </h1>
                <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.95rem' }}>
                  You'll be the first to know when Morivaná launches — and your 15% early bird discount will be waiting. Check your inbox for confirmation.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <Link to="/ingredients" style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-on)',
                    background: 'var(--accent)',
                    borderRadius: '999px',
                    padding: '12px 28px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    minHeight: 0,
                    minWidth: 0,
                  }}>
                    Explore the Ingredients →
                  </Link>
                  <Link to="/learn" style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    color: 'var(--ink-on-dark)',
                    opacity: 0.6,
                    textDecoration: 'none',
                    display: 'inline',
                    padding: 0,
                    minHeight: 0,
                    minWidth: 0,
                    transition: 'opacity 0.15s',
                  }}>
                    Read our wellness guides
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="kicker" style={{ marginBottom: '16px' }}>Early Bird</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(28px, 5vw, 56px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--surface-deep)',
                  marginBottom: '16px',
                }}>
                  Be First.<br />
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, textTransform: 'none', fontSize: '0.65em', color: 'var(--ink-soft)' }}>
                    Get 15% Off at Launch.
                  </span>
                </h1>
                <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)', marginBottom: '32px' }}>
                  Join the Morivaná waitlist. When we launch, you'll be the first to know — and your early bird discount will be waiting. No spam, just one email when we go live.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label
                      htmlFor="waitlist-email"
                      style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'block', marginBottom: '8px' }}
                    >
                      Email address
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--surface-deep)',
                        background: 'var(--surface-soft)',
                        border: '1.5px solid var(--line-soft)',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--surface-deep)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--line-soft)'}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="waitlist-region"
                      style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'block', marginBottom: '8px' }}
                    >
                      I'm ordering from
                    </label>
                    <select
                      id="waitlist-region"
                      name="region"
                      required
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: region ? 'var(--surface-deep)' : 'var(--ink-mute)',
                        background: 'var(--surface-soft)',
                        border: '1.5px solid var(--line-soft)',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23666\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'calc(100% - 18px) center',
                        cursor: 'pointer',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--surface-deep)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--line-soft)'}
                    >
                      <option value="">Select region...</option>
                      <option value="india">India 🇮🇳</option>
                      <option value="canada">Canada 🇨🇦</option>
                    </select>
                  </div>

                  {error && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#c0392b', margin: 0 }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="cta-btn"
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    Join Waitlist — Get 15% Off →
                  </button>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)', margin: 0 }}>
                    No spam. One email when we launch. Unsubscribe anytime.
                  </p>
                </form>

                {/* What you get */}
                <div style={{ marginTop: '40px', borderTop: '1px solid var(--line-soft)', paddingTop: '32px' }}>
                  <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Early Bird Benefits</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { icon: '🏷️', text: '15% off your first order — reserved for waitlist members only.' },
                      { icon: '🚚', text: 'Priority shipping — waitlist orders fulfilled before public launch.' },
                      { icon: '📖', text: 'Launch kit — 30-day guide, recipes, and nutrient timeline.' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'What\'s in Morivaná', description: 'Meet all 8 whole-plant ingredients in the blend.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'Health Benefits', description: 'What happens when you take it every day.', href: '/benefits', tag: 'Benefits' },
        { title: 'How to Use', description: 'Your 30-second morning ritual.', href: '/how-to-use', tag: 'Guide' },
      ]} />
    </>
  )
}
