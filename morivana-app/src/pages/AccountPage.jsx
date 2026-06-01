import { useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'personal',  label: 'Personal Information', icon: '/icon-bag.png' },
  { id: 'orders',    label: 'Order History',         icon: '/icon-bag.png',  href: '/orders' },
  { id: 'addresses', label: 'My Addresses',           icon: '/icon-pin.png' },
  { id: 'settings',  label: 'Account Settings',       icon: '/icon-gear.png' },
]

// ─── Info card component ──────────────────────────────────────────────────────
function InfoCard({ label, value, icon }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(14,39,1,0.09)',
        padding: '22px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(25,65,2,0.08)'
        e.currentTarget.style.borderColor = 'rgba(14,39,1,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(14,39,1,0.09)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'var(--surface-deep)',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </span>
        {icon && (
          <img src={icon} alt="" aria-hidden="true" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: 0.55, flexShrink: 0 }} />
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          color: 'var(--ink-mute)',
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

// ─── Section renderers ────────────────────────────────────────────────────────
function PersonalSection({ user }) {
  const email = user?.primaryEmailAddress?.emailAddress
  const phone = user?.primaryPhoneNumber?.phoneNumber

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
            lineHeight: 1.1,
          }}
        >
          Personal Information
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: 'var(--ink-mute)',
            lineHeight: 1.6,
            maxWidth: '480px',
          }}
        >
          Manage your personal information, including phone numbers and email
          address where you can be contacted.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <InfoCard label="Name"       value={user?.fullName}    icon="/icon-bag.png" />
        <InfoCard label="Email"      value={email}              icon="/icon-gear.png" />
        <InfoCard label="Phone"      value={phone || 'Not set'} icon="/icon-pin.png" />
        <InfoCard label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'} icon="/icon-gear.png" />
      </div>
    </>
  )
}

function OrdersSection() {
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
            lineHeight: 1.1,
          }}
        >
          Order History
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink-mute)', lineHeight: 1.6, maxWidth: '480px' }}>
          View and track your past orders. Details and status updates will appear here once you place your first order.
        </p>
      </div>

      {/* Empty state */}
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(14,39,1,0.09)',
          padding: '56px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
        }}
      >
        <img src="/icon-bag.png" alt="" aria-hidden="true" style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '20px', opacity: 0.5 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', color: 'var(--surface-deep)', marginBottom: '8px' }}>
          No orders yet
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--ink-mute)', maxWidth: '300px', lineHeight: 1.6, marginBottom: '24px' }}>
          Once your first order ships, you'll find it here with full tracking.
        </p>
        <Link to="/" className="cta-btn" style={{ textDecoration: 'none' }}>Shop Morivaná</Link>
      </div>
    </>
  )
}

function AddressesSection() {
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
            lineHeight: 1.1,
          }}
        >
          My Addresses
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink-mute)', lineHeight: 1.6, maxWidth: '480px' }}>
          Save delivery addresses to speed up your checkout.
        </p>
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(14,39,1,0.09)',
          padding: '56px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/icon-pin.png" alt="" aria-hidden="true" style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '20px', opacity: 0.5 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', color: 'var(--surface-deep)', marginBottom: '8px' }}>
          No addresses saved
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--ink-mute)', maxWidth: '300px', lineHeight: 1.6 }}>
          Add a delivery address and it will appear here for quick checkout.
        </p>
      </div>
    </>
  )
}

function SettingsSection({ user }) {
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            color: 'var(--surface-deep)',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
            lineHeight: 1.1,
          }}
        >
          Account Settings
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink-mute)', lineHeight: 1.6, maxWidth: '480px' }}>
          Manage your profile, password, and connected accounts.
        </p>
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(14,39,1,0.09)',
          padding: '56px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/icon-gear.png" alt="" aria-hidden="true" style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '20px', opacity: 0.5 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', color: 'var(--surface-deep)', marginBottom: '8px' }}>
          Profile settings
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--ink-mute)', maxWidth: '300px', lineHeight: 1.6, marginBottom: '24px' }}>
          Update your name, profile photo, password, and connected accounts.
        </p>
        {/* Clerk's built-in profile management is triggered via UserButton in the sidebar */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
          Use the avatar menu in the sidebar to manage your profile
        </div>
      </div>
    </>
  )
}

// ─── Main AccountPage ─────────────────────────────────────────────────────────
export default function AccountPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('personal')

  const handleSignOut = () => signOut(() => navigate('/'))

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':   return <PersonalSection user={user} />
      case 'orders':     return <OrdersSection />
      case 'addresses':  return <AddressesSection />
      case 'settings':   return <SettingsSection user={user} />
      default:           return <PersonalSection user={user} />
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6F6F4',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top header bar ── */}
      <header
        style={{
          height: '60px',
          background: '#fff',
          borderBottom: '1px solid rgba(14,39,1,0.09)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 40px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '17px',
            color: 'var(--surface-deep)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Morivaná Account
        </Link>

        <button
          onClick={handleSignOut}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            background: 'var(--surface-deep)',
            color: 'var(--accent)',
            border: 'none',
            borderRadius: '999px',
            padding: '9px 20px',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-deep)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Sign out
        </button>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)',
          gap: 'clamp(24px, 4vw, 48px)',
          alignItems: 'flex-start',
        }}
      >
        {/* ── Left sidebar ── */}
        <aside
          style={{
            width: '220px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {/* Avatar + identity */}
          <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0' }}>
            {/* Avatar */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--surface-soft)',
                border: '2px solid var(--line-soft)',
                marginBottom: '14px',
                flexShrink: 0,
              }}
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'Profile'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface-soft)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-mute)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.98rem',
                color: 'var(--surface-deep)',
                letterSpacing: '0.01em',
                marginBottom: '2px',
                wordBreak: 'break-word',
              }}
            >
              {user?.fullName || user?.firstName || 'Your Profile'}
            </div>

            {/* Email */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--ink-mute)',
                wordBreak: 'break-all',
                lineHeight: 1.4,
              }}
            >
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(25,65,2,0.07)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.18s',
                    width: '100%',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(25,65,2,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* 3D icon */}
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: '22px',
                      height: '22px',
                      objectFit: 'contain',
                      flexShrink: 0,
                      opacity: isActive ? 1 : 0.45,
                      transition: 'opacity 0.18s',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.88rem',
                      color: isActive ? 'var(--surface-deep)' : 'var(--ink-mute)',
                      letterSpacing: '0.01em',
                      transition: 'color 0.18s, font-weight 0.18s',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ── Right content panel ── */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            background: '#F6F6F4',
          }}
        >
          {renderSection()}
        </main>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 680px) {
          /* Stack sidebar above content on mobile */
          div[style*="flex"][style*="maxWidth: '1100px'"] {
            flex-direction: column !important;
          }
          aside {
            width: 100% !important;
          }
          nav {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          nav button {
            flex: 1 1 auto !important;
            min-width: 130px !important;
          }
        }
      `}</style>
    </div>
  )
}
