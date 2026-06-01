import React from 'react'

/**
 * ErrorBoundary — Catches JS errors in children, logs them, and displays
 * a beautiful brand-matched fallback screen with technical details to assist debugging.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: 'var(--surface-deep, #0E2701)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(200,230,48,0.08) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '640px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(205,216,131,0.15)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Wordmark */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: '28px',
                  color: 'var(--accent, #CDD883)',
                  lineHeight: 1,
                }}
              >
                Morivaná
              </div>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontWeight: 700,
                fontSize: 'clamp(20px, 4vw, 26px)',
                color: 'var(--accent, #CDD883)',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              Something went wrong
            </h1>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                marginBottom: '28px',
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred while rendering this page. Please screenshot this error or copy the technical details below to help us fix it.
            </p>

            {/* Error Details */}
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '28px',
                overflowX: 'auto',
              }}
            >
              <div
                style={{
                  color: '#ff8a8a',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  marginBottom: '10px',
                  wordBreak: 'break-all',
                }}
              >
                {this.state.error && this.state.error.toString()}
              </div>
              <pre
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'var(--accent, #CDD883)',
                  color: 'var(--surface-deep, #0E2701)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px 28px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Reload Page
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  borderRadius: '999px',
                  padding: '12px 28px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
