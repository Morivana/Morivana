import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { useUserRegion } from '../context/RegionContext'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Compare', href: null },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Morivaná Daily vs AG1 vs Setu vs Oziva An Honest Comparison',
    description: 'Side-by-side comparison of the best greens powders available in India: Morivaná Daily, AG1, Setu, and Oziva.',
    author: { '@type': 'Organization', name: 'Morivaná Daily' },
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function ComparePage() {
  const { region } = useUserRegion()

  const columns = [
    { key: 'price', label: 'Price' },
    { key: 'pricePerDay', label: 'Per Day' },
    { key: 'ingredients', label: '# Ingredients' },
    { key: 'proprietary', label: 'Proprietary Blend?' },
    { key: 'sourcing', label: 'Sourcing Transparency' },
    { key: 'avail', label: 'Availability' },
    { key: 'vegan', label: 'Vegan' },
    { key: 'sweetener', label: 'Sweetener' },
  ]

  const comparisonData = [
    {
      brand: 'Morivaná Daily',
      price: region === 'CA' ? 'CA$39 / 20 servings' : '₹799 / 20 servings',
      pricePerDay: region === 'CA' ? 'CA$1.95/day' : '₹40/day',
      ingredients: '8',
      proprietary: 'No all amounts disclosed',
      sourcing: '✓ Full transparency',
      avail: region === 'CA' ? '✓ Ships to Canada' : '✓ India-made',
      vegan: '✓ Yes',
      sweetener: 'Monk fruit (natural)',
      highlight: true,
    },
    {
      brand: 'AG1 (Athletic Greens)',
      price: region === 'CA' ? 'CA$140 / 30 servings' : '~₹7,500–9,000 (imported)',
      pricePerDay: region === 'CA' ? 'CA$4.66/day' : '~₹250–300/day',
      ingredients: '75',
      proprietary: 'Partial some undisclosed',
      sourcing: '✓ Third-party tested',
      avail: region === 'CA' ? '✓ Available online' : '✗ Not officially',
      vegan: '✓ Yes',
      sweetener: 'Stevia, pineapple powder',
      highlight: false,
    },
    {
      brand: 'Setu Superfood Greens',
      price: region === 'CA' ? '~CA$20 / 30 servings' : '~₹1,199 / 30 servings',
      pricePerDay: region === 'CA' ? '~CA$0.66/day' : '~₹40/day',
      ingredients: '39',
      proprietary: 'Partial blend',
      sourcing: '~ Limited info',
      avail: region === 'CA' ? '✗ Not officially' : '✓ Widely available',
      vegan: '✓ Yes',
      sweetener: 'Stevia',
      highlight: false,
    },
    {
      brand: 'Oziva Daily Greens',
      price: region === 'CA' ? '~CA$16–21 / 30 servings' : '~₹999–1,299 / 30 servings',
      pricePerDay: region === 'CA' ? '~CA$0.55–0.70/day' : '~₹33–43/day',
      ingredients: '30+',
      proprietary: 'Partial blend',
      sourcing: '~ Limited info',
      avail: region === 'CA' ? '✗ Not officially' : '✓ Widely available',
      vegan: '~ Some variants have whey',
      sweetener: 'Stevia / sucralose',
      highlight: false,
    },
  ]
  return (
    <>
      <SEOHead
        title="Morivaná Daily vs AG1 vs Setu vs Oziva | Honest Comparison India"
        description="Honest comparison of the best greens powders in India. Morivaná Daily vs AG1, Setu, and Oziva compared on price, ingredients, sourcing, and transparency."
        canonical="/compare"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div className="page-hero-header" style={{ marginTop: '40px', marginBottom: '56px', maxWidth: '680px', margin: '40px auto 56px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Honest Comparison</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(22px, 4vw, 48px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              Morivaná Daily vs AG1 vs Setu vs Oziva
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              We built Morivaná Daily for ourselves first which means we had to be clear-eyed about what else was on the market. Here's our honest comparison of the{' '}
              <Link to="/learn/best-greens-powder-india" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>
                best greens powders available in India
              </Link>.
            </p>
          </div>

          {/* Comparison Table */}
          <section style={{ marginBottom: '64px' }}>
            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--line-soft)', marginBottom: '16px' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-deep)' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', left: 0, background: 'var(--surface-deep)' }}>
                      Brand
                    </th>
                    {columns.map(col => (
                      <th key={col.key} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr
                      key={row.brand}
                      style={{ background: row.highlight ? 'rgba(205,216,131,0.08)' : (i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-soft)') }}
                    >
                      <td style={{
                        padding: '14px 20px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: row.highlight ? 800 : 600,
                        fontSize: '0.9rem',
                        color: row.highlight ? 'var(--surface-deep)' : 'var(--ink)',
                        borderBottom: '1px solid var(--line-soft)',
                        position: 'sticky',
                        left: 0,
                        background: row.highlight ? 'rgba(205,216,131,0.08)' : (i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-soft)'),
                        whiteSpace: 'nowrap',
                      }}>
                        {row.highlight && <span style={{ color: 'var(--accent-strong)', marginRight: '6px' }}>★</span>}
                        {row.brand}
                      </td>
                      {columns.map(col => (
                        <td key={col.key} style={{
                          padding: '14px 16px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.82rem',
                          color: row.highlight ? 'var(--surface-deep)' : 'var(--ink-soft)',
                          fontWeight: row.highlight ? 600 : 400,
                          borderBottom: '1px solid var(--line-soft)',
                        }}>
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)' }}>
              ★ We're biased about Morivaná Daily obviously. We've tried to be accurate about competitors based on publicly available information. Prices may vary.
            </p>
          </section>

          {/* Why we built this */}
          <section style={{ marginBottom: '64px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Context</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              Why We Built Morivaná Daily
            </h2>
            <div style={{ maxWidth: '640px' }}>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                {region === 'CA' ? (
                  "We use AG1 ourselves. It's excellent. But at CA$140/month, it's not a realistic daily staple for most people. We built Morivaná Daily around a different question: what's the minimum number of carefully chosen, precisely dosed, fully transparent whole plants that deliver real nutritional impact? Our answer is 8."
                ) : (
                  "We use AG1 ourselves. It's excellent. But at ₹7,500–9,000/month (when you factor in importing), it's not a realistic daily staple for most Indians. Setu and Oziva are more accessible but use proprietary blends you can't verify if the 39th ingredient is present at a meaningful dose or just enough to make the label look comprehensive."
                )}
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                We built Morivaná Daily around a different question: what's the minimum number of carefully chosen, precisely dosed, fully transparent whole plants that deliver real nutritional impact? Our answer is 8. Your answer might be different and that's fine. But you should know what you're taking and why.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                Explore our{' '}
                <Link to="/ingredients" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>full ingredient list</Link>{' '}
                and{' '}
                <Link to="/science" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>the research behind it</Link>{' '}
                and make your own call.
              </p>
            </div>
          </section>

          {/* AG1 callout */}
          <section style={{ marginBottom: '56px', background: 'var(--surface-soft)', borderRadius: '20px', padding: 'clamp(24px, 4vw, 40px)', border: '1px solid var(--line-soft)' }}>
            <div className="kicker" style={{ color: 'var(--ink-mute)', marginBottom: '12px' }}>{region === 'CA' ? 'For Premium Wellness Shoppers' : 'For International Customers'}</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(16px, 2vw, 24px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '12px',
            }}>
              Switching from AG1?
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '580px', fontSize: '0.9rem', marginBottom: '12px' }}>
              {region === 'CA' ? (
                "If you've been ordering AG1 and the cost is becoming unsustainable, Morivaná Daily offers a transparent, premium alternative. We don't match AG1's 75-ingredient scope we're 8 carefully chosen plants. Different philosophy, different price point, same commitment to ingredient honesty."
              ) : (
                "If you've been ordering AG1 internationally and the cost or shipping complexity is becoming unsustainable, Morivaná Daily offers a transparent, India-sourced alternative. We don't match AG1's 75-ingredient scope we're 8 carefully chosen plants. Different philosophy, different price point, same commitment to ingredient honesty."
              )}
            </p>
            <Link
              to={region === 'CA' ? '/learn/ag1-alternative-india' : '/learn/ag1-alternative-india'}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--surface-deep)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--surface-deep)',
                paddingBottom: '2px',
                display: 'inline',
              }}
            >
              {region === 'CA' ? 'Read: Best AG1 Alternatives →' : 'Read: Best AG1 Alternatives in India →'}
            </Link>
          </section>

          {/* CTA */}
          <Link to="/shop" className="cta-btn">Try Morivaná Daily →</Link>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'All 8 Ingredients', description: 'Full ingredient profiles with amounts and citations.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'The Science', description: 'The research behind Morivaná Daily\'s formulation.', href: '/science', tag: 'Research' },
        { title: 'Best Greens Powder India', description: 'Our full guide to greens powders available in India.', href: '/learn/best-greens-powder-india', tag: 'Learn' },
      ]} />
    </>
  )
}
