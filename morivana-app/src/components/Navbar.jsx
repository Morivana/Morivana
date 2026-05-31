import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const leftLinks  = ['Ingredients', 'Benefits', 'How To Use']
const rightLinks = ['About']

export default function Navbar() {
  const navRef        = useRef()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  // Scroll to section helper
  const scrollTo = (id) => {
    let targetId = id.toLowerCase().replace(/\s+/g, '-')
    if (targetId === 'about') targetId = 'what-section'
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [])

  // Scrolled state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        right:          0,
        zIndex:         100,
        background:     scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
        backdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'blur(10px) saturate(140%)',
        borderBottom:   scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
        boxShadow:      scrolled ? '0 6px 24px rgba(25,65,2,0.06)' : 'none',
        transition:     'backdrop-filter 0.3s, box-shadow 0.3s',
        padding:        '0 32px',
        height:         '64px',
        display:        'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems:     'center',
      }}
    >
      {/* Left pills */}
      <div className="nav-pills-left" style={{ display: 'flex', gap: 10, justifySelf: 'start' }}>
        {leftLinks.map(link => (
          <button key={link} className="nav-pill" onClick={() => scrollTo(link)}>
            {link}
          </button>
        ))}
      </div>

      {/* Center logo — always visible, always truly centered */}
      <button
        type="button"
        className="nav-center-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Morivana, back to top"
        style={{
          textAlign: 'center',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          lineHeight: 1,
          justifySelf: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: '24px',
          color: 'var(--surface-deep)',
          lineHeight: 1,
          letterSpacing: '-0.005em',
        }}>
          Morivaná
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '10px',
          color: 'var(--ink-mute)',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          marginTop: '4px',
        }}>
          Clean Super Greens
        </div>
      </button>

      {/* Right: About pill + CTA */}
      <div className="nav-pills-right" style={{ display: 'flex', gap: 10, alignItems: 'center', justifySelf: 'end' }}>
        {rightLinks.map(link => (
          <button key={link} className="nav-pill" onClick={() => scrollTo(link)}>
            {link}
          </button>
        ))}
        <button
          className="cta-btn"
          onClick={() => scrollTo('waitlist-cta')}
          style={{ padding: '9px 22px', fontSize: '0.74rem', letterSpacing: '0.18em' }}
        >
          Notify Me
        </button>
      </div>

      {/* Mobile hamburger — sits in left column on mobile */}
      <button
        className="nav-mobile-hamburger"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--surface-deep)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          justifySelf: 'start',
        }}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{
          position:   'absolute',
          top:        '64px',
          left:       0,
          right:      0,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px) saturate(160%)',
          borderBottom: '1px solid var(--line-soft)',
          padding:    '20px 24px',
          display:    'flex',
          flexDirection: 'column',
          gap:        12,
        }}>
          {[...leftLinks, ...rightLinks].map(link => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize:   '0.95rem',
                color:      'var(--surface-deep)',
                background: 'none',
                border:     'none',
                textAlign:  'left',
                cursor:     'pointer',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '10px 0',
                borderBottom: '1px solid var(--line-soft)',
              }}
            >
              {link}
            </button>
          ))}
          <button
            className="cta-btn"
            onClick={() => scrollTo('waitlist-cta')}
            style={{ marginTop: 8 }}
          >
            Notify Me
          </button>
        </div>
      )}
    </nav>
  )
}
