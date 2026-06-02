import { useEffect } from 'react'
import gsap from 'gsap'

const footerLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/morivana.daily/' },
  { label: 'Recipes', href: '#' },
  { label: 'About', href: '#what-section' },
  { label: 'Contact', href: 'mailto:Morivana.daily@gmail.com' },
  { label: 'Privacy Policy', href: '#' },
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
      padding: 'clamp(40px, 6vw, 60px) clamp(20px, 5vw, 64px)',
    }}>
      <div
        className="footer-cols"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        {/* Column 1 - Brand */}
        <div className="footer-col-item" style={{ flex: '0 0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(28px, 7vw, 44px)',
            color: 'var(--accent)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
          }}>
            Morivaná
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--ink-on-dark)',
            opacity: 0.85,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginTop: '10px',
          }}>
            Clean Super Greens
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '14px',
            color: 'var(--accent-strong)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginTop: '8px',
          }}>
            Est. 2026
          </div>

          {/* Contact email */}
          <a
            href="mailto:Morivana.daily@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '14px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 'clamp(0.7rem, 2.5vw, 0.82rem)',
              color: 'var(--ink-on-dark)',
              opacity: 0.85,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              wordBreak: 'break-all',
              transition: 'color 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-on-dark)'; e.currentTarget.style.opacity = '0.85' }}
          >
            <svg
              width="14"
              height="14"
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

        {/* Column 2 - Links */}
        <div className="footer-col-item" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {footerLinks.map(link => (
              <a key={link.label} href={link.href} className="footer-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 - Legal */}
        <div className="footer-col-item" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'right' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--cream)',
            opacity: 0.55,
            lineHeight: 1.7,
          }}>
            © 2026 Morivaná. All rights reserved.
            <a href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'underline', marginLeft: '12px' }}>Privacy Policy</a>
            <a href="/terms" style={{ color: 'inherit', textDecoration: 'underline', marginLeft: '12px' }}>Terms of Use</a>
            <br />
            Shipping to India &amp; Canada.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="footer-col-item"
        style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(168,192,32,0.15)',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {['Vegan', 'Soy-Free', 'No Added Sugar', 'No Artificial Sweeteners'].map(cert => (
          <span key={cert} style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.20em',
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
