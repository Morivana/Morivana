import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'
import gsap from 'gsap'

const navLinks = [
  { label: 'Ingredients', id: 'ingredients' },
  { label: 'Benefits', id: 'benefits' },
  { label: 'How To Use', id: 'how-to-use' },
  { label: 'About', id: 'what-section' },
]

export default function Navbar() {
  const navRef = useRef()
  const dropdownRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()
  const { user } = useUser()

  const scrollTo = (id) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -20, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [dropdownOpen])

  const gender = user?.unsafeMetadata?.gender
  const avatarSrc = gender === 'male' ? '/avatar-male.png' : '/avatar-female.png'

  return (
    <>
      <style>{`
        .nav-link-item {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.78rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--ink-mute);
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 2px;
          position: relative;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          right: 0;
          height: 1.5px;
          background: var(--surface-deep);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          border-radius: 2px;
        }
        .nav-link-item:hover {
          color: var(--surface-deep);
        }
        .nav-link-item:hover::after {
          transform: scaleX(1);
        }

        .nav-cta {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.73rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: var(--surface-deep);
          color: var(--ink-on-dark);
          border: none;
          border-radius: 100px;
          padding: 10px 22px;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          white-space: nowrap;
        }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(25,65,2,0.22);
        }
        .nav-cta:active {
          transform: translateY(0);
        }

        .nav-login-link {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-mute);
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-login-link:hover {
          color: var(--surface-deep);
        }

        .nav-divider {
          width: 1px;
          height: 16px;
          background: var(--line-soft);
          flex-shrink: 0;
        }

        /* Mobile hamburger */
        .nav-hamburger {
          display: none;
          background: none;
          border: none;
          color: var(--surface-deep);
          cursor: pointer;
          padding: 4px;
          flex-direction: column;
          gap: 5px;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: var(--surface-deep);
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .nav-hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .nav-hamburger.open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Desktop nav links group */
        .nav-links-group {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        /* Desktop right group */
        .nav-right-group {
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: flex-end;
        }

        /* Mobile drawer */
        .nav-mobile-drawer {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px) saturate(160%);
          border-bottom: 1px solid var(--line-soft);
          padding: 24px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: drawerSlideIn 0.22s ease;
        }
        @keyframes drawerSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile-link {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--surface-deep);
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 13px 0;
          border-bottom: 1px solid var(--line-soft);
          transition: opacity 0.15s ease;
        }
        .nav-mobile-link:hover { opacity: 0.6; }
        .nav-mobile-link:last-of-type { border-bottom: none; }
        .nav-mobile-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .nav-links-group { display: none !important; }
          .nav-right-group { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav
        ref={navRef}
        className="main-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(169, 166, 166, 0.22)' : 'rgba(185, 183, 183, 0.5)',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'blur(8px) saturate(130%)',
          borderBottom: scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(25,65,2,0.05)' : 'none',
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          padding: '0 40px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Logo — left */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Morivana, back to top"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '22px',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
          }}>
            Morivaná
          </span>
        </button>

        {/* Center nav links — desktop only */}
        <div className="nav-links-group">
          {navLinks.map(link => (
            <button
              key={link.id}
              className="nav-link-item"
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right — CTA + auth — desktop only */}
        <div className="nav-right-group">
          {isSignedIn ? (
            <>
              <button
                className="nav-cta"
                onClick={() => scrollTo('waitlist-cta')}
              >
                Notify Me
              </button>
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                  style={{
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(25, 65, 2, 0.15)',
                    border: '1.5px solid var(--surface-deep)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <img
                    src={avatarSrc}
                    alt={user?.fullName || 'Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '48px',
                      right: 0,
                      width: '240px',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid rgba(14, 39, 1, 0.09)',
                      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '8px', borderBottom: '1px solid rgba(14, 39, 1, 0.09)' }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--surface-deep)' }}>
                        {user?.fullName || 'Your Profile'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', wordBreak: 'break-all' }}>
                        {user?.primaryEmailAddress?.emailAddress}
                      </div>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        color: 'var(--surface-deep)',
                        padding: '8px 4px',
                        display: 'block',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
                      onMouseLeave={e => e.currentTarget.style.opacity = 1}
                    >
                      Manage Account
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        signOut({ redirectUrl: '/' })
                      }}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        background: 'var(--surface-deep)',
                        color: 'var(--accent)',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--ink)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-deep)'}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="nav-login-link">
                Log in
              </Link>
              <div className="nav-divider" />
              <button
                className="nav-cta"
                onClick={() => scrollTo('waitlist-cta')}
              >
                Join Waitlist
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="nav-mobile-drawer">
            {navLinks.map(link => (
              <button
                key={link.id}
                className="nav-mobile-link"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
            <div className="nav-mobile-actions">
              {isSignedIn ? (
                <>
                  <button
                    className="nav-cta"
                    style={{ flex: 1 }}
                    onClick={() => { scrollTo('waitlist-cta'); setMenuOpen(false) }}
                  >
                    Notify Me
                  </button>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      padding: '6px 12px',
                      border: '1.5px solid var(--surface-deep)',
                      borderRadius: '100px',
                      background: '#fff',
                    }}
                  >
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--surface-deep)' }}>
                      Account
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="nav-login-link"
                    onClick={() => setMenuOpen(false)}
                    style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid var(--line-soft)', borderRadius: '100px' }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="nav-cta"
                    onClick={() => setMenuOpen(false)}
                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'block' }}
                  >
                    Join Waitlist
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
