import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth, useClerk, useUser } from '@clerk/react'
import gsap from 'gsap'

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
    if (dropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const gender = user?.unsafeMetadata?.gender
  const avatarSrc = gender === 'male'
    ? 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-male.png'
    : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-female.png'

  return (
    <>
      <style>{`
        /* ── Desktop nav links ── */
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
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 1.5px;
          background: var(--surface-deep);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          border-radius: 2px;
        }
        .nav-link-item:hover,
        .nav-link-item.active { color: var(--surface-deep); }
        .nav-link-item.active::after,
        .nav-link-item:hover::after { transform: scaleX(1); }

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
        }
        .nav-login-link:hover { color: var(--surface-deep); }

        .nav-divider {
          width: 1px;
          height: 16px;
          background: var(--line-soft);
          flex-shrink: 0;
        }

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

        /* ── Hamburger ── */
        .nav-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-direction: column;
          gap: 5px;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .nav-hamburger:active { background: rgba(14,39,1,0.06); }
        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--surface-deep);
          border-radius: 2px;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease, width 0.2s ease;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Full-screen mobile overlay ── */
        .nav-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(248, 246, 238, 0.98);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          z-index: 98;
          display: flex;
          flex-direction: column;
          padding: 80px 32px 40px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          animation: mobileOverlayIn 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes mobileOverlayIn {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nav-mobile-user-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 0 20px;
          border-bottom: 1px solid rgba(14,39,1,0.08);
          margin-bottom: 4px;
        }
        .nav-mobile-user-card img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(14,39,1,0.12);
          flex-shrink: 0;
        }
        .nav-mobile-user-name {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--surface-deep);
        }
        .nav-mobile-user-email {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: var(--ink-mute);
          word-break: break-all;
          margin-top: 2px;
        }

        .nav-mobile-links {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-top: 8px;
        }
        .nav-mobile-link {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: clamp(26px, 7vw, 34px);
          letter-spacing: -0.02em;
          color: var(--surface-deep);
          text-decoration: none;
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid rgba(14,39,1,0.07);
          border-left: none;
          border-right: none;
          border-top: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: color 0.18s ease, opacity 0.18s ease;
          -webkit-tap-highlight-color: transparent;
          min-height: 60px;
        }
        .nav-mobile-link:last-child { border-bottom: none; }
        .nav-mobile-link:active { opacity: 0.5; }
        .nav-mobile-link.active { color: var(--color-green-mid, #2d6b2d); }
        .nav-mobile-link-arrow {
          margin-left: auto;
          opacity: 0.25;
          font-size: 1.2em;
          transition: transform 0.18s, opacity 0.18s;
        }
        .nav-mobile-link:active .nav-mobile-link-arrow {
          transform: translateX(4px);
          opacity: 0.6;
        }

        .nav-mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(14,39,1,0.08);
        }
        .nav-mobile-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          background: var(--surface-deep);
          color: var(--ink-on-dark, #f5f0dc);
          border: none;
          border-radius: 100px;
          padding: 15px 24px;
          cursor: pointer;
          transition: background 0.18s, transform 0.18s;
          min-height: 52px;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-mobile-cta:active { transform: scale(0.98); }
        .nav-mobile-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--surface-deep);
          border: 1.5px solid rgba(14,39,1,0.18);
          border-radius: 100px;
          padding: 14px 24px;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          min-height: 52px;
          -webkit-tap-highlight-color: transparent;
          background: none;
          width: 100%;
        }
        .nav-mobile-secondary:active { background: rgba(14,39,1,0.04); }
        .nav-mobile-signout {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-mute);
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          -webkit-tap-highlight-color: transparent;
          transition: color 0.18s;
        }
        .nav-mobile-signout:active { color: var(--surface-deep); }

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
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(169, 166, 166, 0.22)' : 'rgba(185, 183, 183, 0.5)',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'blur(8px) saturate(130%)',
          borderBottom: scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(25,65,2,0.05)' : 'none',
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          padding: '0 clamp(16px, 5vw, 40px)',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="Morivaná Daily, back to homepage"
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', lineHeight: 1, flexShrink: 0,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(17px, 4.5vw, 22px)',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
          }}>
            Morivaná Daily
          </span>
        </Link>

        {/* Center nav links — desktop only */}
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

        {/* Right side — desktop only */}
        <div className="nav-right-group">
          {isSignedIn ? (
            <>
              <Link to="/shop" className="nav-cta">Pre-Order</Link>
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                  style={{
                    background: 'none', padding: 0, cursor: 'pointer',
                    width: '38px', height: '38px', borderRadius: '50%',
                    overflow: 'hidden', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(25, 65, 2, 0.15)',
                    border: '1.5px solid var(--surface-deep)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <img src={avatarSrc} alt={user?.fullName || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: '48px', right: 0,
                    width: '240px', background: '#FFFFFF',
                    borderRadius: '16px', border: '1px solid rgba(14, 39, 1, 0.09)',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
                    padding: '16px', display: 'flex',
                    flexDirection: 'column', gap: '12px', zIndex: 200,
                  }}>
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
                        fontFamily: 'var(--font-body)', fontWeight: 600,
                        fontSize: '0.8rem', letterSpacing: '0.08em',
                        textTransform: 'uppercase', textDecoration: 'none',
                        color: 'var(--surface-deep)', padding: '8px 4px',
                        display: 'block', transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
                      onMouseLeave={e => e.currentTarget.style.opacity = 1}
                    >
                      Manage Account
                    </Link>
                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ redirectUrl: '/' }) }}
                      style={{
                        fontFamily: 'var(--font-body)', fontWeight: 700,
                        fontSize: '0.75rem', letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        background: 'var(--surface-deep)', color: 'var(--accent)',
                        border: 'none', borderRadius: '999px',
                        padding: '10px 16px', cursor: 'pointer', width: '100%',
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
              <Link to="/sign-in" className="nav-login-link">Log in</Link>
              <div className="nav-divider" />
              <Link to="/shop" className="nav-cta">Pre-Order</Link>
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
          <span /><span /><span />
        </button>
      </nav>

      {/* Full-screen mobile overlay */}
      {menuOpen && (
        <div className="nav-mobile-overlay" role="dialog" aria-modal="true" aria-label="Site navigation">
          {/* User card (signed-in only) */}
          {isSignedIn && (
            <div className="nav-mobile-user-card">
              <img src={avatarSrc} alt={user?.fullName || 'Profile'} />
              <div>
                <div className="nav-mobile-user-name">{user?.fullName || user?.firstName || 'Your Profile'}</div>
                <div className="nav-mobile-user-email">{user?.primaryEmailAddress?.emailAddress}</div>
              </div>
            </div>
          )}

          <div className="nav-mobile-links">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `nav-mobile-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <span className="nav-mobile-link-arrow">→</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-mobile-actions">
            <Link to="/shop" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>
              Pre-Order Now
            </Link>
            {isSignedIn ? (
              <>
                <Link to="/account" className="nav-mobile-secondary" onClick={() => setMenuOpen(false)}>
                  My Account
                </Link>
                <button
                  className="nav-mobile-signout"
                  onClick={() => { setMenuOpen(false); signOut({ redirectUrl: '/' }) }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/sign-in" className="nav-mobile-secondary" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
