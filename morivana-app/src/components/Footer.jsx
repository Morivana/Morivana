import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

const footerLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/morivana.daily/' },
  { label: 'Recipes', href: '#' },
  { label: 'About', href: '#what-section' },
  { label: 'Contact', href: 'mailto:Morivana.daily@gmail.com' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms' },
]

export default function Footer() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-col-item', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
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

  return (
    <footer className="surface-deep" style={{
      borderTop: '1px solid var(--line-on-dark)',
      padding: 'clamp(24px, 4vw, 36px) clamp(16px, 5vw, 64px)',
    }}>
      <div
        className="footer-cols"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        {/* Column 1 - Brand */}
        <div className="footer-col-item" style={{ flex: '1 1 240px', minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
            marginTop: '8px',
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
            marginTop: '4px',
          }}>
            Est. 2026
          </div>

          {/* Contact email */}
          <a
            href="mailto:Morivana.daily@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
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
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Morivana.daily@gmail.com
          </a>
        </div>

        {/* Column 2 - Explore Links (Distributed in 2 columns, 3 of each) */}
        <div className="footer-col-item" style={{ flex: '1 1 260px', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            opacity: 0.8,
            marginBottom: '4px',
          }}>
            Explore
          </div>
          <div style={{ display: 'flex', gap: '40px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
              {footerLinks.slice(0, 3).map(link => 
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="footer-link"
                    style={{
                      padding: '2px 0 !important',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="footer-link"
                    style={{
                      padding: '2px 0 !important',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
              {footerLinks.slice(3, 6).map(link => 
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="footer-link"
                    style={{
                      padding: '2px 0 !important',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="footer-link"
                    style={{
                      padding: '2px 0 !important',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Column 3 - Info / Legal */}
        <div className="footer-col-item" style={{ flex: '1 1 200px', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            opacity: 0.8,
            marginBottom: '4px',
          }}>
            Info
          </div>
          <p className="footer-legal-text" style={{ margin: 0 }}>
            © 2026 Morivaná. All rights reserved.
          </p>
          <p className="footer-legal-text" style={{ margin: 0 }}>
            Shipping to India &amp; Canada.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(168,192,32,0.12)',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px 24px',
          flexWrap: 'wrap',
        }}
      >
        {['Vegan', 'Soy-Free', 'No Added Sugar', 'No Artificial Sweeteners'].map(cert => (
          <span key={cert} className="footer-cert-text" style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-strong)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span aria-hidden="true" style={{ color: 'var(--accent)' }}>✓</span>
            {cert}
          </span>
        ))}
      </div>
    </footer>
  )
}
