/**
 * PageLayout shared wrapper for all non-homepage pages.
 * Provides consistent top padding (accounts for fixed 60px navbar),
 * min-height, and background.
 *
 * @param {React.ReactNode} children
 * @param {string}  [background]  - CSS background value (default: var(--surface-base))
 * @param {boolean} [fullWidth]   - Skip inner max-width container (default: false)
 * @param {boolean} [centered]    - Center content horizontally with text-align center (default: false)
 */
export default function PageLayout({
  children,
  background = 'var(--surface-base)',
  fullWidth = false,
  centered = false,
}) {
  return (
    <div
      style={{
        background,
        minHeight: '100vh',
        paddingTop: '60px', // fixed navbar height
      }}
    >
      {fullWidth ? (
        children
      ) : (
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 clamp(20px, 4vw, 40px)',
            ...(centered && { textAlign: 'center' }),
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
