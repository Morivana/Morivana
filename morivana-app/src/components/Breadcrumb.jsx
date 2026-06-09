import { Link } from 'react-router-dom'

/**
 * Breadcrumb semantic breadcrumb nav with JSON-LD injected via SEOHead externally.
 *
 * @param {Array} items - [{label: string, href: string|null}]
 *                        Last item should have href: null (current page)
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '8px' }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {!isLast ? (
                <>
                  <Link
                    to={item.href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-mute)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--surface-deep)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-mute)'}
                  >
                    {item.label}
                  </Link>
                  <span
                    aria-hidden="true"
                    style={{
                      color: 'var(--ink-mute)',
                      fontSize: '0.65rem',
                      lineHeight: 1,
                    }}
                  >
                    /
                  </span>
                </>
              ) : (
                <span
                  aria-current="page"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                  }}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Build BreadcrumbList JSON-LD schema from items array.
 * Usage: pass result into SEOHead schemas prop.
 */
export function buildBreadcrumbSchema(items, baseUrl = 'https://morivanadaily.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  }
}
