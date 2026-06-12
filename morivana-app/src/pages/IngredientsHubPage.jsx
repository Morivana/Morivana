import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import { INGREDIENTS } from '../data/ingredients'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Ingredients', href: null },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Eight Plants. Nothing Else. | All Morivaná Daily Ingredients',
    description: 'All 8 whole-plant ingredients in Morivaná Daily super greens powder moringa, spirulina, amla, ginger, lemon, inulin, orange peel, and monk fruit.',
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function IngredientsHubPage() {
  return (
    <>
      <SEOHead
        title="All 8 Ingredients | What's Inside Morivaná Daily Super Greens"
        description="Explore all 8 whole-plant ingredients in Morivaná Daily moringa, spirulina, amla, ginger, lemon zest, inulin, orange peel & monk fruit. Every amount disclosed."
        canonical="/ingredients"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-soft)" centered>
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div className="page-hero-header" style={{ marginTop: '40px', marginBottom: '56px', maxWidth: '640px', margin: '40px auto 56px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>The Formula</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 72px)',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              Eight Plants.<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, textTransform: 'none', letterSpacing: '-0.01em', fontSize: '0.6em' }}>
                Nothing else.
              </span>
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)', maxWidth: '520px' }}>
              Every entry below is a whole plant cold-dried, ground, weighed. Nothing synthesized. Nothing hidden. We chose each one because it does something the others can't, and because the evidence behind it is real. <Link to="/science" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>Backed by research →</Link>
            </p>
          </div>

          {/* Hero Image */}
          <div style={{ marginBottom: '64px', borderRadius: '20px', overflow: 'hidden', height: 'clamp(200px, 40vw, 360px)' }}>
            <img
              src="/Ingredients-eight-plants.png"
              alt="Ingredients of Morivaná Daily including moringa, amla, spirulina, and ginger"
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Ingredient grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {INGREDIENTS.map((ing, i) => {
              const idx = String(i + 1).padStart(2, '0')
              return (
                <Link
                  key={ing.slug}
                  to={`/ingredients/${ing.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article
                    style={{
                      background: 'var(--surface-base)',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        color: 'var(--ink-mute)',
                      }}>
                        {idx}
                      </span>
                    </div>

                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      lineHeight: 1.0,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: 'var(--surface-deep)',
                      marginBottom: '4px',
                    }}>
                      {ing.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '0.82rem',
                      color: 'var(--ink-mute)',
                      marginBottom: '12px',
                    }}>
                      {ing.latin}
                    </div>

                    <div style={{
                      height: '1px',
                      background: 'repeating-linear-gradient(to right, rgba(25,65,2,0.3) 0 3px, transparent 3px 6px)',
                      marginBottom: '12px',
                    }} />

                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-mute)',
                      marginBottom: '8px',
                    }}>
                      {ing.origin}
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      color: 'var(--ink-soft)',
                      margin: '0 0 16px',
                    }}>
                      {ing.benefit}
                    </p>

                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--surface-deep)',
                    }}>
                      Learn more →
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          {/* Before CTA Image */}
          <div style={{ marginBottom: '48px', borderRadius: '16px', overflow: 'hidden', height: 'clamp(180px, 35vw, 280px)', maxWidth: '520px', margin: '0 auto 48px' }}>
            <img
              src="/morivana-ingredients.webp"
              alt="Close-up of Morivaná Daily ingredient blend"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Certifications */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
            {['Vegan', 'Soy-Free', 'No Added Sugar', 'No Artificial Sweeteners', 'Cold-Dried'].map(cert => (
              <span key={cert} style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.66rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-on)',
                background: 'var(--accent)',
                borderRadius: '999px',
                padding: '6px 14px',
              }}>
                {cert}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/shop" className="cta-btn">
              Get All 8 in One Scoop →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'The Science Behind Morivaná Daily', description: 'Research citations for every health claim we make.', href: '/science', tag: 'Research' },
        { title: 'Health Benefits', description: 'What happens when you take Morivaná Daily every day timeline and deep-dives.', href: '/benefits', tag: 'Benefits' },
        { title: 'Pre-Order Now', description: 'Join the early bird list and get 15% off at launch.', href: '/shop', tag: 'Shop' },
      ]} />
    </>
  )
}
