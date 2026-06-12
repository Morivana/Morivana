import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'About', href: null },
]

const sourcingData = [
  { ingredient: 'Moringa', region: 'Tamil Nadu', country: 'India', method: 'Shade-dried leaf', icon: '🌿' },
  { ingredient: 'Amla', region: 'Uttarakhand', country: 'India', method: 'Cold-dried whole fruit', icon: '🟢' },
  { ingredient: 'Ginger', region: 'Kerala', country: 'India', method: 'Cold-dried sliced root', icon: '🫚' },
  { ingredient: 'Spirulina', region: 'Controlled Ponds', country: 'Global', method: 'Closed-system pond cultivation', icon: '💧' },
  { ingredient: 'Lemon Zest', region: 'Mediterranean', country: 'Various', method: 'Cold-dried peel only', icon: '🍋' },
  { ingredient: 'Inulin', region: 'Belgium / France', country: 'Europe', method: 'Hot-water chicory extraction', icon: '🌾' },
  { ingredient: 'Orange Peel', region: 'Mediterranean', country: 'Various', method: 'Whole-peel cold-dried', icon: '🍊' },
  { ingredient: 'Monk Fruit', region: 'Guangxi', country: 'China', method: 'Standardized extract (25% Mogroside V)', icon: '🫐' },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Story Behind Morivaná Daily',
    description: 'The founding story, philosophy, and sourcing transparency of Morivaná Daily a clean super greens powder from India.',
    author: { '@type': 'Organization', name: 'Morivaná Daily' },
    publisher: { '@type': 'Organization', name: 'Morivaná Daily' },
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Morivaná Daily | Pure Moringa Super Greens Sourcing & Mission"
        description="Learn why we built Morivaná Daily a clean super greens powder from 8 sourced plants. Our story, philosophy, and sourcing transparency for India & Canada."
        canonical="/about"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)" centered>
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          {/* Hero */}
          <div className="page-hero-header" style={{ marginTop: '40px', marginBottom: '64px', maxWidth: '680px', margin: '40px auto 64px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Our Story</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 60px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '24px',
            }}>
              The Story Behind<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, textTransform: 'none', fontSize: '0.7em' }}>
                Morivaná Daily
              </span>
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '560px' }}>
              We started Morivaná Daily because we were frustrated not with wellness, but with the wellness industry. Too many products, too many promises, too little transparency.
            </p>
          </div>

          {/* Hero image */}
          <div style={{ marginBottom: '64px', borderRadius: '20px', overflow: 'hidden', height: 'clamp(200px, 40vw, 360px)' }}>
            <img
              src="/morivana-jar.jpeg"
              alt="Morivaná Daily super greens powder jar with fresh moringa leaves"
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Section 1 Why we started */}
          <section style={{ marginBottom: '72px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Why We Started</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(22px, 3vw, 32px)',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              The Problem With Existing Greens Powders
            </h2>
            <div style={{ maxWidth: '640px' }}>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                We looked at what was available and found the same pattern everywhere: 40+ ingredient "proprietary blends" where individual amounts are hidden, artificial sweeteners dressed up as clean labels, and prices that make daily use unsustainable for most people.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                The Indian market had its own problem: greens powders designed for Western markets and Western bodies, priced in dollars, with supply chains that have nothing to do with the extraordinary plants growing here moringa in Tamil Nadu, amla in Uttarakhand, ginger in Kerala.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                So we built what we wanted to use: a greens powder that starts with the sourcing, not the marketing. Eight plants, nothing else. Every amount disclosed. Cold-dried to preserve what the plants actually contain. Priced for daily use.
              </p>
            </div>
            <div style={{ marginTop: '28px', borderRadius: '12px', overflow: 'hidden', height: 'clamp(160px, 30vw, 240px)' }}>
              <img
                src="/Moringa Leaves Overhead.webp"
                alt="Fresh green moringa leaves overhead view"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </section>

          {/* Section 2 Philosophy */}
          <section style={{ marginBottom: '72px', background: 'var(--surface-deep)', borderRadius: '24px', padding: 'clamp(32px, 5vw, 56px)' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--accent)' }}>Our Philosophy</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 42px)',
              color: 'var(--ink-on-dark)',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              Eight Plants. Nothing Else.
            </h2>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '600px', marginBottom: '24px' }}>
              Every decision we've made comes back to this constraint. We asked: if you could put only 8 plants in a daily greens powder plants that had to earn their place based purely on nutritional evidence what would they be? Moringa, spirulina, amla, ginger, lemon, inulin, orange peel, and monk fruit. No filler. No pad. No 40th ingredient that appears at 0.5mg just so the brand can put it on the label.
            </p>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '600px' }}>
              We didn't add probiotics because we already have inulin a prebiotic that grows the probiotics already in your gut rather than adding transient external ones. We didn't add vitamin C because we have amla the most bioavailable natural source on earth. Every ingredient does a job that can't be done better by another.
            </p>

            {/* Processing image */}
            <div style={{ marginTop: '28px', borderRadius: '12px', overflow: 'hidden', height: 'clamp(160px, 30vw, 240px)' }}>
              <img
                src="/about-processing.png"
                alt="Cold-drying process used for Morivaná Daily ingredients"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.9 }}
              />
            </div>
          </section>

          {/* Section 3 Sourcing */}
          <section style={{ marginBottom: '72px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Where We Source</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(22px, 3vw, 32px)',
              color: 'var(--surface-deep)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              Complete Sourcing Transparency
            </h2>
            <p style={{ color: 'var(--ink-mute)', marginBottom: '32px', fontSize: '0.92rem' }}>
              Every ingredient's origin, processing method, and why we chose that source.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1px',
              background: 'var(--line-soft)',
              border: '1px solid var(--line-soft)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {sourcingData.map((item) => (
                <div
                  key={item.ingredient}
                  style={{
                    background: 'var(--surface-base)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--surface-deep)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}>
                    {item.ingredient}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
                    {item.region} · {item.country}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    {item.method}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link to="/sustainability" style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--surface-deep)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--surface-deep)',
                paddingBottom: '2px',
                display: 'inline',
              }}>
                Read our full sourcing story →
              </Link>
            </div>
          </section>

          {/* Section 4 Our Promise */}
          <section style={{ marginBottom: '72px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Our Promise</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(22px, 3vw, 32px)',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              No Fillers. No Proprietary Blends. Ever.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '880px' }}>
              {[
                { title: 'Full Transparency', body: 'Every ingredient amount is disclosed. No proprietary blends that hide under-dosing.' },
                { title: 'Cold-Dried Process', body: 'Low-temperature drying preserves water-soluble vitamins and heat-sensitive compounds that high-heat processing destroys.' },
                { title: 'India-First Sourcing', body: 'Moringa, amla, and ginger sourced directly from Indian farms not imported and re-badged.' },
                { title: 'No Synthetic Additives', body: 'No artificial colors, flavors, preservatives, or sweeteners. Monk fruit for natural sweetness only.' },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: 'var(--surface-soft)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid var(--line-soft)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--surface-deep)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {item.title}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
            <Link to="/ingredients" className="cta-btn">
              Meet All 8 Ingredients →
            </Link>
            <Link to="/science" style={{
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
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-deep)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--surface-deep)' }}
            >
              See the Research →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'All 8 Ingredients', description: 'Explore every plant in the Morivaná Daily blend with full nutritional profiles.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'Sourcing & Sustainability', description: 'Complete supply chain transparency where every ingredient comes from.', href: '/sustainability', tag: 'Brand' },
        { title: 'The Science', description: 'Research citations behind every health claim we make.', href: '/science', tag: 'Research' },
      ]} />

    </>
  )
}
