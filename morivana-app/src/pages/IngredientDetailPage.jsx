import { useParams, Link, Navigate } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import { getIngredientBySlug, getRelatedIngredient } from '../data/ingredients'

export default function IngredientDetailPage() {
  const { slug } = useParams()
  const ing = getIngredientBySlug(slug)

  if (!ing) return <Navigate to="/ingredients" replace />

  const related = getRelatedIngredient(slug)
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Ingredients', href: '/ingredients' },
    { label: ing.name, href: null },
  ]

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${ing.name} — ${ing.tagline}`,
      description: ing.benefit,
      author: { '@type': 'Organization', name: 'Morivaná' },
      publisher: { '@type': 'Organization', name: 'Morivaná' },
      about: {
        '@type': 'Thing',
        name: ing.name,
        alternateName: ing.latin,
      },
    },
    buildBreadcrumbSchema(breadcrumbs),
  ]

  const relatedPages = [
    { title: 'All Ingredients', description: 'Explore all 8 plants in the Morivaná blend.', href: '/ingredients', tag: 'Ingredients' },
    { title: 'Health Benefits', description: 'See how every ingredient contributes to daily wellness.', href: '/benefits', tag: 'Benefits' },
    { title: 'The Science', description: 'Full research citations for every ingredient.', href: '/science', tag: 'Research' },
  ]
  if (related) {
    relatedPages.unshift({
      title: `Also in the Blend: ${related.name}`,
      description: related.benefit,
      href: `/ingredients/${related.slug}`,
      tag: 'Ingredient',
    })
    relatedPages.pop()
  }

  return (
    <>
      <SEOHead
        title={`${ing.name} (${ing.latin}) | Sourcing & Benefits`}
        description={`${ing.benefit} Learn about the science, nutrition, and sourcing of ${ing.name} in Morivaná's super greens powder.`}
        canonical={`/ingredients/${ing.slug}`}
        ogType="article"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          {/* Hero */}
          <div style={{ marginTop: '40px', marginBottom: '56px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div className="kicker" style={{ color: 'var(--ink-mute)' }}>{ing.origin}</div>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 5vw, 58px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '12px',
            }}>
              {ing.name}
            </h1>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'var(--ink-mute)',
              marginBottom: '20px',
            }}>
              {ing.latin}
            </div>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--ink-soft)',
              maxWidth: '580px',
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '20px',
            }}>
              {ing.tagline}
            </p>
          </div>

          {/* Section 1 — What is it */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: 'var(--surface-deep)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: '20px',
            }}>
              What is {ing.name}?
            </h2>
            <div style={{ maxWidth: '680px' }}>
              {ing.description.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Section 2 — Nutrition Table */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: 'var(--surface-deep)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: '20px',
            }}>
              Nutritional Profile (per 5g serving)
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                borderCollapse: 'separate',
                borderSpacing: 0,
                width: '100%',
                maxWidth: '560px',
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <thead>
                  <tr style={{ background: 'var(--surface-deep)' }}>
                    {['Nutrient', 'Per 5g Serving', '% Daily Value'].map(h => (
                      <th key={h} style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ing.nutritionTable.map((row, i) => (
                    <tr
                      key={i}
                      style={{ background: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-soft)' }}
                    >
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink)', borderBottom: '1px solid var(--line-soft)' }}>
                        {row.nutrient}
                      </td>
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--surface-deep)', fontWeight: 600, borderBottom: '1px solid var(--line-soft)' }}>
                        {row.per5g}
                      </td>
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink-mute)', borderBottom: '1px solid var(--line-soft)' }}>
                        {row.dv}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--ink-mute)', fontFamily: 'var(--font-body)' }}>
              * Values are approximate. Based on 5g serving of cold-dried powder.
            </p>
          </section>

          {/* Section 3 — Sourcing */}
          <section style={{ marginBottom: '56px', background: 'var(--surface-soft)', borderRadius: '20px', padding: 'clamp(24px, 4vw, 40px)' }}>
            <div className="kicker" style={{ marginBottom: '12px', color: 'var(--ink-mute)' }}>Why We Source From {ing.origin}</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: 'var(--surface-deep)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: '16px',
            }}>
              Sourcing Story
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '16px' }}>
              {ing.sourcing}
            </p>
            <Link to="/sustainability" style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--surface-deep)',
              paddingBottom: '1px',
              display: 'inline',
            }}>
              Full sustainability story →
            </Link>
          </section>

          {/* Section 4 — How it works in Morivaná */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: 'var(--surface-deep)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: '16px',
            }}>
              How {ing.name} Works in Morivaná
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '20px' }}>
              {ing.howItWorks}
            </p>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '580px' }}>
              See{' '}
              <Link to="/benefits" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>
                all health benefits
              </Link>{' '}
              or explore the{' '}
              <Link to="/science" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>
                full research behind our formulation
              </Link>.
            </p>
          </section>

          {/* Section 5 — Studies */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: 'var(--surface-deep)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: '20px',
            }}>
              Scientific References
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
              {ing.studies.map((study, i) => (
                <div key={i} style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--surface-deep)', marginBottom: '4px' }}>
                    {study.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', marginBottom: '8px' }}>
                    {study.journal}
                  </div>
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--surface-deep)',
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--surface-deep)',
                      paddingBottom: '1px',
                      display: 'inline',
                    }}
                  >
                    View on PubMed →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div style={{
            background: 'var(--surface-deep)',
            borderRadius: '20px',
            padding: 'clamp(28px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '560px',
          }}>
            <div className="kicker" style={{ color: 'var(--accent)' }}>Get the Full Blend</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 3vw, 30px)',
              color: 'var(--ink-on-dark)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: 0,
            }}>
              Get {ing.name} + 7 More Plants in Morivaná
            </h2>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.65, margin: 0, fontSize: '0.92rem' }}>
              One scoop delivers {ing.name} alongside spirulina, amla, ginger, lemon, inulin, orange peel, and monk fruit — all at meaningful doses, all amounts disclosed.
            </p>
            <Link to="/shop" className="cta-btn" style={{ display: 'inline-flex', width: 'fit-content' }}>
              Pre-Order Morivaná →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={relatedPages} />
    </>
  )
}
