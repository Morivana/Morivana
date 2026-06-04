import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ObfuscatedEmail from './ObfuscatedEmail'

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Pre-Order Now', href: '/shop' },
      { label: 'Daily Greens (30-Day)', href: '/shop/daily-greens' },
      { label: 'Join Waitlist', href: '/waitlist' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Learn Hub', href: '/learn' },
      { label: 'Health Benefits', href: '/benefits' },
      { label: 'The Science', href: '/science' },
      { label: 'Comparisons', href: '/compare' },
    ],
  },
  {
    heading: 'Brand',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'How To Use', href: '/how-to-use' },
      { label: 'All Ingredients', href: '/ingredients' },
    ],
  },
  {
    heading: 'Info',
    links: [
      { label: 'Contact', href: 'mailto:Morivana.daily@gmail.com', external: true },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Instagram', href: 'https://www.instagram.com/morivana.daily/', external: true },
    ],
  },
]


export default function Footer() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-col-item', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%',
        }
      })
    })
    return () => ctx.revert()
  }, [])

  const renderLink = (link) => {
    const style = {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '0.78rem',
      color: 'var(--ink-on-dark)',
      opacity: 0.75,
      textDecoration: 'none',
      display: 'inline',
      padding: 0,
      minHeight: 0,
      minWidth: 0,
      transition: 'color 0.2s, opacity 0.2s',
      lineHeight: 1.5,
    }

    if (link.external) {
      if (link.href && link.href.startsWith('mailto:')) {
        return (
          <ObfuscatedEmail
            key={link.label}
            style={style}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-on-dark)'; e.currentTarget.style.opacity = '0.75' }}
          >
            {link.label}
          </ObfuscatedEmail>
        )
      }
      return (
        <a
          key={link.label}
          href={link.href}
          style={style}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.opacity = '1' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-on-dark)'; e.currentTarget.style.opacity = '0.75' }}
        >
          {link.label}
        </a>
      )
    }

    return (
      <Link
        key={link.label}
        to={link.href}
        style={style}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-on-dark)'; e.currentTarget.style.opacity = '0.75' }}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <footer className="surface-deep" style={{
      borderTop: '1px solid var(--line-on-dark)',
      padding: 'clamp(24px, 4vw, 40px) clamp(16px, 5vw, 64px)',
    }}>
      {/* Top section: brand + nav columns */}
      <div
        className="footer-cols"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '40px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {/* Column 1 — Brand */}
        <div className="footer-col-item" style={{ flex: '1 1 200px', minWidth: '180px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(20px, 3.5vw, 25px)',
            color: 'var(--accent)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
          }}>
            Morivaná
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--ink-on-dark)',
            opacity: 0.8,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: '4px',
          }}>
            Clean Super Greens
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '10px',
            color: 'var(--accent-strong)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Est. 2026 · India & Canada
          </div>
          <ObfuscatedEmail
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '10px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '12px',
              color: 'var(--ink-on-dark)',
              opacity: 0.75,
              textDecoration: 'none',
              padding: 0,
              minHeight: 0,
              minWidth: 0,
              transition: 'color 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-on-dark)'; e.currentTarget.style.opacity = '0.75' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </ObfuscatedEmail>
        </div>

        {/* Navigation columns */}
        {FOOTER_COLUMNS.map((col) => (
          <div
            key={col.heading}
            className="footer-col-item"
            style={{ flex: '1 1 120px', minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}
          >
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              opacity: 0.9,
              marginBottom: '2px',
            }}>
              {col.heading}
            </div>
            {col.links.map(link => (
              <div key={link.label}>
                {renderLink(link)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(168,192,32,0.12)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px 24px',
        }}
      >
        <p className="footer-legal-text" style={{ margin: 0, color: 'var(--ink-on-dark)', opacity: 0.5 }}>
          © 2026 Morivaná. All rights reserved. Shipping to India & Canada.
        </p>
      </div>
    </footer>
  )
}
