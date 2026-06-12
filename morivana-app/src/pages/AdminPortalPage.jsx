import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import FloatingLeaves from '../components/FloatingLeaves'

export default function AdminPortalPage() {
  const navigate = useNavigate()
  const [passcode, setPasscode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirect immediately if already authorized via bypass token
  useEffect(() => {
    const existing = localStorage.getItem('admin_bypass_token')
    if (existing) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!passcode) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      const apiBase = isLocal ? '' : (import.meta.env.VITE_API_URL || '')
      const res = await fetch(`${apiBase}/api/admin/bypass-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passcode })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate.')
      }

      setSuccess(true)
      localStorage.setItem('admin_bypass_token', data.token)
      
      // Short delay for the success transition feel
      setTimeout(() => {
        navigate('/admin')
      }, 800)
    } catch (err) {
      setError(err.message || 'Incorrect passcode.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)'
      }}
    >
      <FloatingLeaves variant="dark" density="sparse" />

      {/* Radial ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(10, 10, 10, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.55)',
          textAlign: 'center'
        }}
      >
        {/* Editorial Wordmark */}
        <div style={{ marginBottom: '32px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '2.4rem',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1
            }}
          >
            Morivaná
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#737373',
              display: 'block',
              marginTop: '4px'
            }}
          >
            Owner Secret Entry
          </span>
        </div>

        <p
          style={{
            fontSize: '0.88rem',
            color: '#A3A3A3',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}
        >
          Enter your website owner passcode to access the SaaS admin dashboard panel directly.
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#fca5a5',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 500,
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            ✕ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#4ade80',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 500,
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            ✓ Access granted! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#737373',
                marginBottom: '8px'
              }}
            >
              Secret Passcode
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              disabled={loading || success}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '14px 16px',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'monospace',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#FFFFFF'
                e.target.style.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.08)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success || !passcode}
            style={{
              background: '#FFFFFF',
              color: '#000000',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: (loading || success || !passcode) ? 'not-allowed' : 'pointer',
              opacity: (loading || success || !passcode) ? 0.7 : 1,
              transition: 'transform 0.15s, opacity 0.2s',
              boxShadow: '0 8px 24px rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={e => { if (!loading && !success && passcode) e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          >
            {loading ? 'Verifying...' : 'Unlock Console →'}
          </button>
        </form>

        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.74rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#737373',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#737373')}
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
