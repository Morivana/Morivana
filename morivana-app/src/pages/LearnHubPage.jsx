import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import { BLOG_POSTS } from '../data/blogPosts'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Learn', href: null },
]

const categoryColors = {
  Comparisons: '#a8c020',
  Ingredients: '#4a9a5c',
  'Morning Routines': '#2d6a4f',
}

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Morivaná Daily Learn Hub | Super Greens & Plant Nutrition',
    description: 'Evidence-based guides on super greens, moringa, spirulina, amla, and plant-based wellness from the Morivaná Daily team.',
    hasPart: BLOG_POSTS.map(p => ({
      '@type': 'Article',
      headline: p.title,
      description: p.description,
      url: `https://morivandaily.com/learn/${p.slug}`,
    })),
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function LearnHubPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <>
      <SEOHead
        title="Learn Hub | Moringa Super Greens & Plant Nutrition Guides"
        description="Evidence-based guides on super greens, moringa, spirulina, amla, and more. Written by the Morivaná Daily team. No ads, no affiliate links just the research."
        canonical="/learn"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-soft)" centered>
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', marginBottom: '48px', maxWidth: '640px', margin: '40px auto 48px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Knowledge Hub</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 5vw, 56px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              Evidence-Based Wellness Guides
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              No ads. No affiliate links. Just what the research actually shows about plant nutrition, super greens, and daily wellness.
            </p>
          </div>

          {/* Featured post */}
          <section style={{ marginBottom: '48px' }}>
            <Link to={`/learn/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <article
                style={{
                  background: 'var(--surface-deep)',
                  borderRadius: '20px',
                  padding: 'clamp(28px, 4vw, 48px)',
                  transition: 'transform 0.22s, box-shadow 0.22s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(25,65,2,0.20)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-on)',
                    background: 'var(--accent)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                  }}>
                    Featured
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    color: 'var(--ink-on-dark-mute)',
                  }}>
                    {featured.readingTime} read · {featured.category}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(20px, 3vw, 34px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: 'var(--ink-on-dark)',
                  marginBottom: '16px',
                  lineHeight: 1.0,
                }}>
                  {featured.title}
                </h2>
                <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.7, maxWidth: '560px', marginBottom: '20px', fontSize: '0.92rem' }}>
                  {featured.excerpt}
                </p>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}>
                  Read Article →
                </div>
              </article>
            </Link>
          </section>

          {/* All other posts */}
          <section style={{ marginBottom: '48px' }}>
            <div className="kicker" style={{ marginBottom: '24px', color: 'var(--ink-mute)' }}>All Articles</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {rest.map((post) => {
                const catColor = categoryColors[post.category] || 'var(--ink-mute)'
                return (
                  <Link key={post.slug} to={`/learn/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <article
                      style={{
                        background: 'var(--surface-base)',
                        border: '1px solid var(--line-soft)',
                        borderRadius: '16px',
                        padding: '24px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border-color 0.22s, transform 0.22s, box-shadow 0.22s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--surface-deep)'
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(25,65,2,0.10)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--line-soft)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.58rem',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: '#fff',
                          background: catColor,
                          borderRadius: '999px',
                          padding: '3px 10px',
                        }}>
                          {post.category}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--ink-mute)' }}>
                          {post.readingTime}
                        </span>
                      </div>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        lineHeight: 1.15,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        color: 'var(--surface-deep)',
                        marginBottom: '10px',
                        flex: 1,
                      }}>
                        {post.title}
                      </h2>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        lineHeight: 1.55,
                        color: 'var(--ink-mute)',
                        margin: '0 0 16px',
                      }}>
                        {post.excerpt}
                      </p>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--surface-deep)',
                        marginTop: 'auto',
                      }}>
                        Read →
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Internal links to ingredient & benefits pages */}
          <div style={{ background: 'var(--surface-soft)', borderRadius: '16px', padding: '24px', border: '1px solid var(--line-soft)' }}>
            <div className="kicker" style={{ marginBottom: '12px', color: 'var(--ink-mute)' }}>Also Worth Reading</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'All 8 Ingredients', href: '/ingredients' },
                { label: 'Health Benefits', href: '/benefits' },
                { label: 'The Science', href: '/science' },
                { label: 'Compare to AG1', href: '/compare' },
                { label: 'How To Use', href: '/how-to-use' },
              ].map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                    textDecoration: 'none',
                    border: '1.5px solid var(--surface-deep)',
                    borderRadius: '999px',
                    padding: '8px 18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'background 0.2s, color 0.2s',
                    minHeight: 0,
                    minWidth: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-deep)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--surface-deep)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'Health Benefits', description: 'What Morivaná Daily does for your body timeline and science.', href: '/benefits', tag: 'Benefits' },
        { title: 'All Ingredients', description: 'Full profiles for all 8 plants in the blend.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'Pre-Order', description: 'Early bird pricing 15% off at launch.', href: '/shop', tag: 'Shop' },
      ]} />
    </>
  )
}
