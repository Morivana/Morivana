import { useParams, Navigate, Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import { getBlogPostBySlug, getRelatedPosts } from '../data/blogPosts'
import FAQAccordion from '../components/FAQAccordion'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getBlogPostBySlug(slug)

  if (!post) return <Navigate to="/learn" replace />

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Learn', href: '/learn' },
    { label: post.title, href: null },
  ]

  const relatedPosts = getRelatedPosts(slug).map(p => ({
    title: p.title,
    description: p.excerpt,
    href: `/learn/${p.slug}`,
    tag: p.category,
  }))

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.publishDate,
      author: { '@type': 'Organization', name: 'Morivaná Daily' },
      publisher: { '@type': 'Organization', name: 'Morivaná Daily', logo: { '@type': 'ImageObject', url: 'https://morivana.pages.dev/packaging_highres.webp' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://morivana.pages.dev/learn/${post.slug}` },
      keywords: post.targetKeyword,
      articleSection: post.category,
    },
    ...(post.faqs ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    }] : []),
    buildBreadcrumbSchema(breadcrumbs),
  ]

  // Format date
  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <SEOHead
        title={`${post.title} | Morivaná Daily`}
        description={post.description}
        canonical={`/learn/${post.slug}`}
        ogType="article"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          {/* Article header */}
          <header style={{ marginTop: '40px', marginBottom: '40px', maxWidth: '720px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-on)',
                background: 'var(--accent)',
                borderRadius: '999px',
                padding: '3px 12px',
              }}>
                {post.category}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)' }}>
                {post.readingTime} read · {formattedDate}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(22px, 4vw, 46px)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '16px',
            }}>
              {post.title}
            </h1>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--ink-soft)',
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '20px',
            }}>
              {post.excerpt}
            </p>
          </header>

          {/* Article body */}
          <article style={{ maxWidth: '720px' }}>
            {post.sections.map((section, i) => {
              // Parse simple markdown-ish bold text
              const formatContent = (content) => {
                const parts = content.split(/(\*\*[^*]+\*\*|\n\n)/)
                return parts.map((part, j) => {
                  if (part === '\n\n') return null
                  if (/^\*\*.*\*\*$/.test(part)) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>
                  }
                  return <span key={j}>{part}</span>
                }).filter(Boolean)
              }

              // Split by double newline to make paragraphs
              const paragraphs = section.content.split('\n\n').filter(p => p.trim())

              return (
                <section key={i} style={{ marginBottom: '40px', borderTop: i === 0 ? '2px solid var(--surface-deep)' : '1px solid var(--line-soft)', paddingTop: '32px' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(16px, 2.5vw, 24px)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    color: 'var(--surface-deep)',
                    marginBottom: '16px',
                  }}>
                    {section.heading}
                  </h2>
                  {paragraphs.map((para, j) => {
                    // Detect table (row starting with |)
                    if (para.includes('|---|')) {
                      const rows = para.split('\n').filter(r => r.trim() && !r.includes('|---|'))
                      const headers = rows[0].split('|').filter(c => c.trim())
                      const dataRows = rows.slice(1)
                      return (
                        <div key={j} style={{ overflowX: 'auto', marginBottom: '16px' }}>
                          <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid var(--line-soft)', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead>
                              <tr style={{ background: 'var(--surface-deep)' }}>
                                {headers.map((h, hi) => (
                                  <th key={hi} style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {h.trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dataRows.map((row, ri) => {
                                const cells = row.split('|').filter(c => c !== undefined).slice(1, -1)
                                return (
                                  <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-soft)' }}>
                                    {cells.map((cell, ci) => (
                                      <td key={ci} style={{ padding: '9px 14px', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink)', borderBottom: '1px solid var(--line-soft)' }}>
                                        {cell.trim()}
                                      </td>
                                    ))}
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )
                    }

                    return (
                      <p key={j} style={{ color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '14px', fontSize: '0.96rem' }}>
                        {formatContent(para)}
                      </p>
                    )
                  })}
                </section>
              )
            })}

            {/* FAQs */}
            {post.faqs && post.faqs.length > 0 && (
              <section style={{ marginTop: '48px', borderTop: '1px solid var(--line-soft)', paddingTop: '32px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(16px, 2.5vw, 22px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: 'var(--surface-deep)',
                  marginBottom: '20px',
                }}>
                  Frequently Asked Questions
                </h2>
                <FAQAccordion items={post.faqs} />
              </section>
            )}

            {/* Article CTA */}
            <div style={{
              marginTop: '56px',
              background: 'var(--surface-deep)',
              borderRadius: '16px',
              padding: 'clamp(24px, 4vw, 40px)',
            }}>
              <div className="kicker" style={{ color: 'var(--accent)', marginBottom: '10px' }}>Try Morivaná Daily</div>
              <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.65, marginBottom: '20px', fontSize: '0.92rem', maxWidth: '480px' }}>
                All 8 ingredients. Full transparency. Pre-order now and get 15% off at launch.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/shop" className="cta-btn">
                  Pre-Order →
                </Link>
                <Link to="/ingredients" style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-on-dark)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '14px 0',
                  border: 'none',
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                  minHeight: 0,
                  minWidth: 0,
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                >
                  Meet the ingredients →
                </Link>
              </div>
            </div>
          </article>
        </div>
      </PageLayout>

      {relatedPosts.length > 0 && (
        <RelatedPages items={relatedPosts} heading="Related Articles" />
      )}
    </>
  )
}
