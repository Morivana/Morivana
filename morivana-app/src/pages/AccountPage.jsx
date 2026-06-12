import { useState, useEffect } from 'react'
import { useUser, useClerk, useSession, useSessionList } from '@clerk/react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'personal', label: 'Personal Information', icon: 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-bag.png' },
  { id: 'orders', label: 'Order History', icon: 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-bag-3d.png', href: '/orders' },
  { id: 'addresses', label: 'My Addresses', icon: 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-pin-3d.png' },
  { id: 'settings', label: 'Account Settings', icon: 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-gear-3d.png' },
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
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            style={{
              width: '22px',
              height: '22px',
              objectFit: 'contain',
              opacity: 0.55,
              flexShrink: 0,
              borderRadius: icon.includes('avatar') ? '50%' : '0',
            }}
          />
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
        {value || 'N/A'}
      </span>
    </div>
  )
}

// ─── Section renderers ────────────────────────────────────────────────────────
function PersonalSection({ user }) {
  const email = user?.primaryEmailAddress?.emailAddress
  const phone = user?.unsafeMetadata?.phone || user?.primaryPhoneNumber?.phoneNumber
  const gender = user?.unsafeMetadata?.gender
  const avatarSrc = gender === 'male' ? 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-male.png' : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-female.png'
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phoneInput, setPhoneInput] = useState(phone || '')
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setPhoneInput(user.unsafeMetadata?.phone || user.primaryPhoneNumber?.phoneNumber || '')
    }
  }, [user])

  const handleGenderChange = async (newGender) => {
    setLoading(true)
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          gender: newGender,
        },
      })
    } catch (err) {
      console.error('Failed to update gender', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSaveError('')
    try {
      await user.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone: phoneInput,
        }
      })
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update personal info', err)
      setSaveError(err.message || 'Failed to save changes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
        <div>
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
            Manage your personal information, including phone numbers, email
            address, and profile gender avatar settings.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'transparent',
            color: 'var(--surface-deep)',
            border: '1.5px solid rgba(14, 39, 1, 0.18)',
            borderRadius: '999px',
            padding: '8px 18px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '36px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--surface-deep)'
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.borderColor = 'var(--surface-deep)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--surface-deep)'
            e.currentTarget.style.borderColor = 'rgba(14, 39, 1, 0.18)'
          }}
        >
          Edit Info
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <InfoCard label="Name" value={user?.fullName} icon={avatarSrc} />
        <InfoCard label="Email" value={email} icon="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-mail-3d.png" />
        <InfoCard label="Phone" value={phone || 'Not set'} icon="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-phone-3d.png" />
        <InfoCard label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'} icon="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-shield-3d.png" />

        {/* Interactive Gender & Profile Avatar selector */}
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(14,39,1,0.09)',
            padding: '22px 20px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
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
              Gender Profile
            </span>
            <img
              src={gender === 'male' ? 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-male.png' : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-female.png'}
              alt=""
              aria-hidden="true"
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', opacity: 0.85 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              disabled={loading}
              onClick={() => handleGenderChange('female')}
              style={{
                flex: 1,
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: gender === 'female' ? 'var(--surface-deep)' : 'transparent',
                color: gender === 'female' ? 'var(--accent)' : 'var(--ink-mute)',
                border: gender === 'female' ? '1.5px solid var(--surface-deep)' : '1.5px solid rgba(14, 39, 1, 0.14)',
                borderRadius: '999px',
                padding: '6px 10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Female
            </button>
            <button
              disabled={loading}
              onClick={() => handleGenderChange('male')}
              style={{
                flex: 1,
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: gender === 'male' ? 'var(--surface-deep)' : 'transparent',
                color: gender === 'male' ? 'var(--accent)' : 'var(--ink-mute)',
                border: gender === 'male' ? '1.5px solid var(--surface-deep)' : '1.5px solid rgba(14, 39, 1, 0.14)',
                borderRadius: '999px',
                padding: '6px 10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Male
            </button>
          </div>
        </div>
      </div>

      {/* Edit Information Modal */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 33, 17, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => !loading && setIsEditing(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid rgba(14,39,1,0.09)',
              boxShadow: '0 24px 64px rgba(20, 33, 17, 0.25)',
              width: '100%',
              maxWidth: '440px',
              padding: '32px 28px',
              position: 'relative',
              animation: 'modalFadeIn 0.3s ease-out',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '1.4rem',
                color: 'var(--surface-deep)',
                marginBottom: '6px',
              }}
            >
              Edit Information
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                color: 'var(--ink-mute)',
                marginBottom: '20px',
              }}
            >
              Update your name and phone number.
            </p>

            {saveError && (
              <div
                style={{
                  background: 'rgba(179, 74, 74, 0.1)',
                  border: '1px solid rgba(179, 74, 74, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#b34a4a',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '16px',
                }}
              >
                {saveError}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      color: 'var(--ink-soft)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    style={{
                      border: '1.5px solid rgba(14, 39, 1, 0.14)',
                      borderRadius: '12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      padding: '10px 14px',
                      outline: 'none',
                      color: 'var(--ink)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      color: 'var(--ink-soft)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    style={{
                      border: '1.5px solid rgba(14, 39, 1, 0.14)',
                      borderRadius: '12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      padding: '10px 14px',
                      outline: 'none',
                      color: 'var(--ink)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    color: 'var(--ink-soft)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 99999 99999"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  style={{
                    border: '1.5px solid rgba(14, 39, 1, 0.14)',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    padding: '10px 14px',
                    outline: 'none',
                    color: 'var(--ink)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'transparent',
                    color: 'var(--ink-mute)',
                    border: '1.5px solid rgba(14, 39, 1, 0.14)',
                    borderRadius: '999px',
                    padding: '10px 20px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    minHeight: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'var(--surface-deep)',
                    color: 'var(--accent)',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 20px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    minHeight: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
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
        <img src="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-bag.png" alt="" aria-hidden="true" style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '20px', opacity: 0.5 }} />
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', color: 'var(--surface-deep)', marginBottom: '8px' }}>
          No orders yet
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--ink-mute)', maxWidth: '300px', lineHeight: 1.6, marginBottom: '24px' }}>
          Once your first order ships, you'll find it here with full tracking.
        </p>
        <Link to="/" className="cta-btn" style={{ textDecoration: 'none' }}>Shop Morivaná Daily</Link>
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
        <img src="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-pin-3d.png" alt="" aria-hidden="true" style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '20px', opacity: 0.5 }} />
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
  const { session: currentSession } = useSession()
  const { sessions, isLoaded: sessionsLoaded } = useSessionList()
  const [newsletter, setNewsletter] = useState(user?.unsafeMetadata?.newsletter ?? false)
  const [loading, setLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleNewsletterToggle = async () => {
    setLoading(true)
    const nextVal = !newsletter
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          newsletter: nextVal,
        },
      })
      setNewsletter(nextVal)
    } catch (err) {
      console.error('Failed to update email preferences', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPasswordError('')
    setPasswordSuccess('')
    try {
      await user.update({
        password: newPassword,
        currentPassword: currentPassword,
      })
      setPasswordSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => {
        setIsChangingPassword(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (err) {
      console.error('Failed to update password', err)
      setPasswordError(err.message || 'Failed to update password. Verify your current password.')
    } finally {
      setLoading(false)
    }
  }

  const isGoogleUser = user?.externalAccounts?.length > 0 && !user?.passwordEnabled

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
          Manage your password, email preferences, and view active sessions.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Security & Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email Preferences & Newsletter Toggle */}
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              border: '1px solid rgba(14,39,1,0.09)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-mail-3d.png" alt="" aria-hidden="true" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--surface-deep)', margin: 0 }}>
                Email Preferences
              </h3>
            </div>
            
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-mute)', lineHeight: 1.5, margin: 0 }}>
              Receive news, recipes, product releases, and exclusive community updates.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                Newsletter subscription
              </span>
              <button
                disabled={loading}
                onClick={handleNewsletterToggle}
                style={{
                  background: newsletter ? 'var(--surface-deep)' : 'rgba(14, 39, 1, 0.10)',
                  border: 'none',
                  borderRadius: '999px',
                  width: '50px',
                  height: '26px',
                  position: 'relative',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.25s ease',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '50px',
                  minHeight: '26px',
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    left: newsletter ? '26px' : '4px',
                    transition: 'left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Password Settings */}
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              border: '1px solid rgba(14,39,1,0.09)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-gear-3d.png" alt="" aria-hidden="true" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--surface-deep)', margin: 0 }}>
                Security Settings
              </h3>
            </div>

            {isGoogleUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-mute)', lineHeight: 1.5, margin: 0 }}>
                  You are signed in via Google. Password updates and security are managed by your Google account.
                </p>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                    textDecoration: 'underline',
                    marginTop: '4px',
                    display: 'inline-block',
                    minWidth: '0',
                    minHeight: '0',
                    padding: '0',
                  }}
                >
                  Manage Google Account
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-mute)', lineHeight: 1.5, margin: 0 }}>
                  Ensure your account remains secure by using a strong, unique password.
                </p>
                
                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      color: 'var(--surface-deep)',
                      border: '1.5px solid rgba(14, 39, 1, 0.18)',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: 'fit-content',
                      minHeight: '36px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--surface-deep)'
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--surface-deep)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--surface-deep)'
                      e.currentTarget.style.borderColor = 'rgba(14, 39, 1, 0.18)'
                    }}
                  >
                    Reset Password
                  </button>
                ) : (
                  <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    {passwordError && (
                      <div style={{ color: '#b34a4a', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div style={{ color: 'var(--surface-deep)', fontSize: '0.78rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                        {passwordSuccess}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        style={{
                          border: '1.5px solid rgba(14, 39, 1, 0.14)',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          padding: '8px 12px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={{
                          border: '1.5px solid rgba(14, 39, 1, 0.14)',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          padding: '8px 12px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        style={{
                          flex: 1,
                          fontFamily: 'var(--font-body)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          background: 'transparent',
                          color: 'var(--ink-mute)',
                          border: '1.5px solid rgba(14, 39, 1, 0.14)',
                          borderRadius: '999px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          minHeight: '32px',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          flex: 1,
                          fontFamily: 'var(--font-body)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          background: 'var(--surface-deep)',
                          color: 'var(--accent)',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          minHeight: '32px',
                        }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Sessions */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid rgba(14,39,1,0.09)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/icon-shield-3d.png" alt="" aria-hidden="true" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--surface-deep)', margin: 0 }}>
              Active Sessions
            </h3>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-mute)', lineHeight: 1.5, margin: 0 }}>
            Devices currently logged into your account.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
            {!sessionsLoaded ? (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-mute)' }}>Loading sessions...</span>
            ) : (
              sessions?.map(session => {
                const isCurrent = session.id === currentSession?.id
                const browser = session.latestActivity?.browser || 'Browser'
                const os = session.latestActivity?.os || 'OS'
                const ip = session.latestActivity?.ipAddress || 'IP Unknown'

                return (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(14,39,1,0.06)',
                      paddingBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--surface-deep)', textTransform: 'capitalize' }}>
                          {browser} on {os}
                        </span>
                        {isCurrent && (
                          <span
                            style={{
                              background: 'var(--surface-soft)',
                              color: 'var(--surface-deep)',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              borderRadius: '999px',
                              padding: '2px 8px',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              border: '1px solid rgba(25, 65, 2, 0.18)',
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)' }}>
                        IP: {ip} · Last active: {new Date(session.lastActiveAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </>
  )
}

// ─── Main AccountPage ─────────────────────────────────────────────────────────
export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('personal')

  const gender = user?.unsafeMetadata?.gender
  const avatarSrc = gender === 'male' ? 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-male.png' : 'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public/avatar-female.png'

  const handleSignOut = () => signOut({ redirectUrl: '/' })

  // Dynamic client-side noindex to ensure search engines do not index the account page
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    const originalVal = meta.getAttribute('content') || 'index, follow'
    meta.setAttribute('content', 'noindex, nofollow')
    return () => {
      meta.setAttribute('content', originalVal)
    }
  }, [])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!isSignedIn || !user) {
    return null
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'personal': return <PersonalSection user={user} />
      case 'orders': return <OrdersSection />
      case 'addresses': return <AddressesSection />
      case 'settings': return <SettingsSection user={user} />
      default: return <PersonalSection user={user} />
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
          Morivaná Daily Account
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
      <div id="acct-body">
        {/* ── Left sidebar ── */}
        <aside id="acct-sidebar">
          {/* Avatar + identity */}
          <div id="acct-identity">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--surface-soft)',
                border: '2px solid var(--line-soft)',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(25, 65, 2, 0.12)',
              }}
            >
              <img
                src={avatarSrc}
                alt={user.fullName || 'Profile'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div id="acct-identity-text">
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
          </div>

          {/* Nav links */}
          <nav id="acct-nav">
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  className={`acct-nav-btn${isActive ? ' acct-nav-btn--active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <img
                    src={item.id === 'personal' ? avatarSrc : item.icon}
                    alt=""
                    aria-hidden="true"
                    className="acct-nav-icon"
                    style={{ borderRadius: item.id === 'personal' ? '50%' : '0' }}
                  />
                  <span className="acct-nav-label">{item.label}</span>
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
      <style>{`
        /* ── Account page layout ── */
        #acct-body {
          flex: 1;
          display: flex;
          flex-direction: row;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);
          gap: clamp(24px, 4vw, 48px);
          align-items: flex-start;
        }
        #acct-sidebar {
          width: 220px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        #acct-identity {
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        #acct-identity-text { display: flex; flex-direction: column; }
        #acct-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        #acct-main {
          flex: 1;
          min-width: 0;
          background: #F6F6F4;
        }

        /* ── Nav buttons ── */
        .acct-nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s;
          width: 100%;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
        .acct-nav-btn:hover { background: rgba(25,65,2,0.04); }
        .acct-nav-btn--active { background: rgba(25,65,2,0.07) !important; }

        /* Icons — hard size constraints so they never blow up */
        .acct-nav-icon {
          width: 22px;
          height: 22px;
          min-width: 22px;
          min-height: 22px;
          max-width: 22px;
          max-height: 22px;
          object-fit: contain;
          flex-shrink: 0;
          opacity: 0.45;
          transition: opacity 0.18s;
          display: block;
        }
        .acct-nav-btn--active .acct-nav-icon { opacity: 1; }

        .acct-nav-label {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.88rem;
          color: var(--ink-mute);
          letter-spacing: 0.01em;
          transition: color 0.18s, font-weight 0.18s;
        }
        .acct-nav-btn--active .acct-nav-label {
          font-weight: 700;
          color: var(--surface-deep);
        }

        /* ── Mobile layout ── */
        @media (max-width: 680px) {
          #acct-body {
            flex-direction: column;
            padding: 0 0 32px;
            gap: 0;
          }
          #acct-sidebar {
            width: 100%;
            position: sticky;
            top: 60px;
            z-index: 40;
            background: #fff;
            border-bottom: 1px solid rgba(14,39,1,0.09);
            padding: 12px 16px 0;
            box-shadow: 0 2px 8px rgba(14,39,1,0.06);
          }
          #acct-identity {
            flex-direction: row;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }
          #acct-identity > div:first-child {
            width: 40px !important;
            height: 40px !important;
          }
          #acct-nav {
            flex-direction: row;
            gap: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          #acct-nav::-webkit-scrollbar { display: none; }

          /* Tab style on mobile */
          .acct-nav-btn {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 8px 12px 10px;
            border-radius: 0;
            flex: 0 0 auto;
            width: auto;
            min-width: 72px;
            border-bottom: 2px solid transparent;
            background: transparent !important;
            overflow: hidden;
          }
          .acct-nav-btn--active {
            border-bottom-color: var(--surface-deep) !important;
          }

          /* Icons on mobile tabs — strictly 20×20 */
          .acct-nav-icon {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
            max-width: 20px !important;
            max-height: 20px !important;
            opacity: 0.5;
          }
          .acct-nav-btn--active .acct-nav-icon { opacity: 1; }

          .acct-nav-label {
            font-size: 0.68rem;
            letter-spacing: 0.02em;
            white-space: nowrap;
          }
          #acct-main { padding: 20px 16px 0; }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  )
}
