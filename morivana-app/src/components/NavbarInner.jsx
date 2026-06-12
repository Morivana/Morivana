import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useClerk, useUser } from '@clerk/react'
import gsap from 'gsap'

// Pages that use anchor-based scroll (only homepage)
const HOME_SCROLL_LINKS = [
  { label: 'Ingredients', id: 'ingredients' },
  { label: 'Benefits', id: 'benefits' },
  { label: 'How To Use', id: 'how-to-use' },
  { label: 'About', id: 'what-section' },
]

// Full site nav links map to real routes
const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Ingredients', href: '/ingredients' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'How To Use', href: '/how-to-use' },
  { label: 'Learn', href: '/learn' },
  { label: 'Science', href: '/science' },
]

export default function NavbarInner() {
  const navRef = useRef()
  const dropdownRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()
  const { user } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  // Smooth-scroll to section anchor (homepage only)
  const scrollToSection = (id) => {
    if (!isHome) {
      navigate(`/#${id}`)
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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  const gender = user?.unsafeMetadata?.gender
  const avatarSrc = gender === 'male' ? 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-male.png' : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-female.png'

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
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          min-height: 0;
          min-width: 0;
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
        .nav-link-item:hover,
        .nav-link-item.active {
          color: var(--surface-deep);
        }
        .nav-link-item.active::after,
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
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          min-height: 0;
          min-width: 0;
        }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(25,65,2,0.22);
          background: var(--ink);
          color: var(--accent);
        }
        .nav-cta:active { transform: translateY(0); }

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
          min-height: 0;
          min-width: 0;
          padding: 0;
          display: inline;
        }
        .nav-login-link:hover { color: var(--surface-deep); }

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
          min-height: 0;
          min-width: 0;
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
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .nav-links-group {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .nav-right-group {
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: flex-end;
        }

        /* Mobile drawer */
        .nav-mobile-drawer {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px) saturate(160%);
          border-bottom: 1px solid var(--line-soft);
          padding: 20px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 0;
          animation: drawerSlideIn 0.22s ease;
          z-index: 99;
        }
        @keyframes drawerSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile-link {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.88rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--surface-deep);
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 14px 0;
          border-bottom: 1px solid var(--line-soft);
          transition: opacity 0.15s ease;
          text-decoration: none;
          display: block;
          min-height: 0;
          min-width: 0;
        }
        .nav-mobile-link:hover { opacity: 0.6; }
        .nav-mobile-link:last-of-type { border-bottom: none; }
        .nav-mobile-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          align-items: center;
        }

        @media (max-width: 900px) {
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
        {/* Logo left */}
        <Link
          to="/"
          aria-label="Morivaná Daily, back to homepage"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            lineHeight: 1,
            flexShrink: 0,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(18px, 4.5vw, 22px)',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
          }}>
            Morivaná Daily
          </span>
        </Link>

        {/* Center nav links desktop only */}
        <div className="nav-links-group">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => `nav-link-item${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right CTA + auth desktop only */}
        <div className="nav-right-group">
          {isSignedIn ? (
            <>
              <Link to="/shop" className="nav-cta">
                Pre-Order
              </Link>
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
                    minHeight: 0,
                    minWidth: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
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
                        minHeight: 0,
                        minWidth: 0,
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
                        minHeight: 0,
                        minWidth: 0,
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
              <Link to="/shop" className="nav-cta">
                Pre-Order
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="nav-mobile-drawer" role="dialog" aria-label="Site navigation">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className="nav-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="nav-mobile-actions">
              {isSignedIn ? (
                <>
                  <Link
                    to="/shop"
                    className="nav-cta"
                    style={{ flex: 1, textAlign: 'center' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Pre-Order
                  </Link>
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
                      minHeight: 0,
                      minWidth: 0,
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
                    style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid var(--line-soft)', borderRadius: '100px', display: 'block', minHeight: 0 }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/shop"
                    className="nav-cta"
                    onClick={() => setMenuOpen(false)}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Pre-Order
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
