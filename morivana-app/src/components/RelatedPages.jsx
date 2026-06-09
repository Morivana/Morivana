import { Link } from 'react-router-dom'

/**
 * RelatedPages "You might also like" section at the bottom of each page.
 *
 * @param {Array}   items       - [{title, description, href, tag}]
 * @param {string}  [heading]   - Section heading (default: "You Might Also Like")
 */
export default function RelatedPages({ items = [], heading = 'You Might Also Like' }) {
  if (!items || items.length === 0) return null

  return (
    <section
      aria-label="Related pages"
      style={{
        borderTop: '1px solid var(--line-soft)',
        marginTop: '64px',
        paddingTop: '48px',
        paddingBottom: '64px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: '24px',
          }}
        >
          {heading}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {items.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: '16px',
                  padding: '24px',
                  height: '100%',
                  transition: 'border-color 0.22s, transform 0.22s, box-shadow 0.22s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--surface-deep)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(25,65,2,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--line-soft)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {item.tag && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '0.58rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-mute)',
                      background: 'var(--surface-base)',
                      border: '1px solid var(--line-soft)',
                      borderRadius: '999px',
                      padding: '3px 10px',
                      display: 'inline-block',
                      marginBottom: '12px',
                    }}
                  >
                    {item.tag}
                  </span>
                )}
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    lineHeight: 1.2,
                    color: 'var(--surface-deep)',
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </div>
                {item.description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      color: 'var(--ink-mute)',
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                )}
                <div
                  style={{
                    marginTop: '16px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                  }}
                >
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
