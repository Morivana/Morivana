import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import { INGREDIENTS } from '../data/ingredients'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Sustainability', href: null },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Where Every Ingredient Comes From | Morivaná Sourcing Transparency',
    description: 'Complete sourcing transparency for all 8 Morivaná ingredients — origin farms, harvest methods, cold-drying process, and sustainability commitments.',
    author: { '@type': 'Organization', name: 'Morivaná' },
  },
  buildBreadcrumbSchema(breadcrumbs),
]

// Color-coded region groups
const regionGroups = [
  {
    region: 'Tamil Nadu, India',
    coords: 'South India',
    color: '#2d6a4f',
    ingredients: ['moringa'],
    detail: 'Hot, semi-arid climate ideal for moringa leaf development. We partner with farms in the Tirunelveli district where moringa is harvested at 6–8 weeks of growth — the peak nutrient window — and shade-dried to prevent chlorophyll degradation.',
  },
  {
    region: 'Uttarakhand, India',
    coords: 'Northern India (Himalayan foothills)',
    color: '#52b788',
    ingredients: ['amla'],
    detail: 'Sub-Himalayan altitude (600–1,200m) produces amla with higher vitamin C concentration due to the cool growing season. Fruit is hand-picked at peak ripeness in November–December and cold-dried within 24 hours of harvest.',
  },
  {
    region: 'Kerala, India',
    coords: 'Southwest India',
    color: '#40916c',
    ingredients: ['ginger'],
    detail: 'Kerala\'s monsoon climate and volcanic soil create ginger with notably higher gingerol content than ginger grown in drier climates. Rhizomes are harvested after 8–9 months of growth — optimal for therapeutic gingerol concentration.',
  },
  {
    region: 'Guangxi, China',
    coords: 'Southern China',
    color: '#95d5b2',
    ingredients: ['monk-fruit'],
    detail: 'The only region in the world where Siraitia grosvenorii grows at commercial scale, due to specific soil composition, humidity, and altitude requirements. We source from controlled cultivation operations with standardized Mogroside V extraction.',
  },
  {
    region: 'Controlled Aquaculture',
    coords: 'Global',
    color: '#74c69d',
    ingredients: ['spirulina'],
    detail: 'Spirulina requires specific temperature, pH, and light conditions that vary significantly by geography. We use closed-pond systems with continuous water quality monitoring for heavy metals, cyanotoxins, and microbial contamination — tested to European food safety standards.',
  },
  {
    region: 'Mediterranean & Europe',
    coords: 'Various',
    color: '#b7e4c7',
    ingredients: ['lemon', 'orange-peel', 'inulin'],
    detail: 'Lemon zest and orange peel are cold-dried from conventional Mediterranean cultivation. Inulin is extracted from chicory root grown in Belgium and France, standardized to ≥90% purity with defined chain length (DP 10–60) for optimal prebiotic activity.',
  },
]

export default function SustainabilityPage() {
  return (
    <>
      <SEOHead
        title="How We Source | Morivaná Sourcing & Sustainability"
        description="Full supply chain transparency for Morivaná's 8 ingredients — where each plant comes from, how it's processed, and our commitment to no hidden sourcing."
        canonical="/sustainability"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', marginBottom: '56px', maxWidth: '640px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Sourcing</div>
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
              Where Every Ingredient Comes From
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              We believe you have the right to know the complete supply chain of what you put in your body. No hidden sources, no "proprietary blend" behind the scenes — just plants, origins, and processing.
            </p>
          </div>

          {/* Visual sourcing map (CSS-based) */}
          <section style={{ marginBottom: '64px' }}>
            <div className="kicker" style={{ marginBottom: '20px', color: 'var(--ink-mute)' }}>Origin Map</div>
            <div style={{
              background: 'var(--surface-deep)',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 48px)',
              marginBottom: '24px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}>
                {INGREDIENTS.map(ing => (
                  <div
                    key={ing.slug}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--line-on-dark)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      color: 'var(--ink-on-dark)',
                      marginBottom: '4px',
                    }}>
                      {ing.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: '6px',
                    }}>
                      {ing.origin}
                    </div>
                    <Link
                      to={`/ingredients/${ing.slug}`}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.7rem',
                        color: 'var(--ink-on-dark)',
                        opacity: 0.6,
                        textDecoration: 'none',
                        display: 'inline',
                        padding: 0,
                        minHeight: 0,
                        minWidth: 0,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                    >
                      View profile →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Region deep-dives */}
          <section style={{ marginBottom: '64px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '20px', color: 'var(--ink-mute)' }}>Source Stories</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {regionGroups.map((group) => (
                <div key={group.region} style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line-soft)',
                  borderLeft: `4px solid ${group.color}`,
                  borderRadius: '0 16px 16px 0',
                  padding: 'clamp(20px, 3vw, 32px)',
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        color: 'var(--surface-deep)',
                        marginBottom: '2px',
                      }}>
                        {group.region}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
                        {group.coords}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                      {group.ingredients.map(slug => {
                        const ing = INGREDIENTS.find(i => i.slug === slug)
                        return ing ? (
                          <Link
                            key={slug}
                            to={`/ingredients/${slug}`}
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              letterSpacing: '0.08em',
                              color: 'var(--surface-deep)',
                              background: 'var(--surface-base)',
                              border: '1px solid var(--line-soft)',
                              borderRadius: '999px',
                              padding: '4px 12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              textDecoration: 'none',
                              minHeight: 0,
                              minWidth: 0,
                            }}
                          >
                            {ing.name}
                          </Link>
                        ) : null
                      })}
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                    {group.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cold-drying */}
          <section style={{ marginBottom: '64px', background: 'var(--surface-deep)', borderRadius: '20px', padding: 'clamp(28px, 4vw, 48px)' }}>
            <div className="kicker" style={{ color: 'var(--accent)', marginBottom: '12px' }}>Processing</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--ink-on-dark)',
              marginBottom: '16px',
            }}>
              Cold-Drying: No Heat, No Nutrient Loss
            </h2>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '16px', fontSize: '0.92rem' }}>
              Every ingredient in Morivaná is dried at low temperatures (≤40–50°C) — never spray-dried or oven-dried at the 120–200°C temperatures that degrade water-soluble vitamins by up to 80%.
            </p>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '580px', fontSize: '0.92rem' }}>
              Cold-drying costs more and takes longer than conventional processing. It's a choice we make because the nutritional integrity of the whole plant is the entire point.{' '}
              <Link to="/science" style={{ color: 'var(--accent)', fontWeight: 600, display: 'inline', padding: 0, minHeight: 0, minWidth: 0, textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: '1px' }}>
                Read the nutrient preservation research →
              </Link>
            </p>
          </section>

          {/* Packaging */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Packaging</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '16px',
            }}>
              Packaging & Our Future Commitments
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '16px' }}>
              Our launch packaging uses a foil-lined resealable pouch — the most effective material for preserving moisture-sensitive plant powders. We've prioritized product integrity over packaging optics at launch.
            </p>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '580px' }}>
              Our roadmap includes: (1) a refill pouch program in Phase 2 that reduces packaging per serving by 60%, and (2) a full packaging lifecycle assessment published on this page. We'll update this when we have the data.
            </p>
          </section>

          {/* Promise */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(16px, 2vw, 22px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '16px',
            }}>
              Our Commitment
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px' }}>
              No hidden supply chains. No ingredients we can't explain. No claims we can't back with a citation. If something changes in our sourcing, we'll publish it here.
            </p>
          </section>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/about" style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              textDecoration: 'none',
              border: '1.5px solid var(--surface-deep)',
              borderRadius: '999px',
              padding: '14px 28px',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              Our Founding Story →
            </Link>
            <Link to="/ingredients" className="cta-btn">
              All Ingredient Profiles →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'Our Story', description: 'Why we started Morivaná and our founding philosophy.', href: '/about', tag: 'Brand' },
        { title: 'All Ingredients', description: 'Full nutritional profiles for each of the 8 plants.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'Nutrient Preservation Research', description: 'The science behind cold-drying and nutrient retention.', href: '/science', tag: 'Research' },
      ]} />
    </>
  )
}
