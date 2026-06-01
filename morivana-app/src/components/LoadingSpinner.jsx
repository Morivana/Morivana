/**
 * LoadingSpinner — Morivana brand-matched full-page loader.
 * Matches the site's dark forest surface with citrus spinner ring.
 */
export default function LoadingSpinner() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-deep)',
        gap: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient radial glow — mirrors WaitlistCTA */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200,230,48,0.10) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Wordmark */}
      <div style={{ textAlign: 'center', lineHeight: 1, position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '36px',
            color: 'var(--accent)',
            letterSpacing: '-0.01em',
            lineHeight: 0.95,
          }}
        >
          Morivaná
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '10px',
            color: 'var(--ink-on-dark)',
            opacity: 0.65,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginTop: '8px',
          }}
        >
          Clean Super Greens
        </div>
      </div>

      {/* Citrus spinner ring */}
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(205, 216, 131, 0.18)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'morivana-spin 0.85s linear infinite',
          position: 'relative',
          zIndex: 1,
        }}
      />

      <style>{`
        @keyframes morivana-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
