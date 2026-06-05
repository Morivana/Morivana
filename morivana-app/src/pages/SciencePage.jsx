import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import { INGREDIENTS } from '../data/ingredients'
import FAQAccordion from '../components/FAQAccordion'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Science', href: null },
]

const faqs = [
  { q: 'Is Morivaná Daily FDA approved?', a: 'Morivaná Daily is a dietary supplement, not a drug. Dietary supplements in India fall under FSSAI regulation, not FDA (US) approval. All ingredients are GRAS (Generally Recognized as Safe) in the US and are approved food ingredients in India and Canada. We are not claiming to diagnose, treat, cure, or prevent any disease.' },
  { q: 'Are there clinical trials on Morivaná Daily?', a: 'There are no clinical trials on Morivaná Daily as a proprietary blend — we are a pre-launch brand. All health claims are based on published clinical research on the individual ingredients at equivalent doses. We\'ve linked to each study on this page.' },
  { q: 'What does "cold-dried" mean exactly?', a: 'Cold-drying refers to low-temperature drying (typically ≤40–50°C) as opposed to spray-drying or oven-drying (≥120°C). At high temperatures, water-soluble vitamins (especially vitamin C and B vitamins) degrade significantly. Cold-drying preserves 80–95% of heat-sensitive nutrients, depending on the specific compound and processing time.' },
]

const studiesTable = INGREDIENTS.map(ing => ({
  ingredient: ing.name,
  slug: ing.slug,
  studies: ing.studies,
}))

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Research Behind Every Ingredient in Morivaná Daily',
    description: 'Peer-reviewed scientific citations for every health claim Morivaná Daily makes about its 8 ingredients. Links to PubMed studies included.',
    author: { '@type': 'Organization', name: 'Morivaná Daily' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function SciencePage() {
  return (
    <>
      <SEOHead
        title="The Science Behind Morivaná Daily | Research & Sourcing"
        description="Peer-reviewed research citations for every ingredient in Morivaná Daily. PubMed links to moringa, spirulina, amla, ginger, inulin, and monk fruit studies."
        canonical="/science"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', marginBottom: '56px', maxWidth: '640px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Evidence-Based</div>
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
              The Research Behind Every Ingredient
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              Every health claim we make about Morivaná Daily is traceable to peer-reviewed research. We've listed the primary studies for each{' '}
              <Link to="/ingredients" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>ingredient</Link>{' '}
              with direct links to PubMed so you can read them yourself.
            </p>
          </div>

          {/* Formulation philosophy */}
          <section style={{ marginBottom: '64px', background: 'var(--surface-deep)', borderRadius: '20px', padding: 'clamp(28px, 4vw, 48px)' }}>
            <div className="kicker" style={{ color: 'var(--accent)', marginBottom: '12px' }}>Philosophy</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 3vw, 30px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--ink-on-dark)',
              marginBottom: '16px',
            }}>
              Our Formulation Philosophy
            </h2>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '16px', fontSize: '0.92rem' }}>
              We started with the research, not the marketing. Each of the 8 ingredients was chosen based on three criteria: (1) the evidence base for the specific health benefits we claim, (2) synergistic interactions with other ingredients in the blend, and (3) bioavailability in a cold-dried powder matrix. No ingredient was added to make the label look impressive.
            </p>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '580px', fontSize: '0.92rem' }}>
              Example: We use amla (not synthetic vitamin C) specifically because the tannin matrix in amla makes vitamin C more stable and bioavailable than isolated ascorbic acid. We use inulin (not probiotics) because prebiotic fiber selectively grows your existing beneficial bacteria rather than adding transient external strains that may not survive your stomach acid.
            </p>
          </section>

          {/* Studies table */}
          <section style={{ marginBottom: '64px' }}>
            <div className="kicker" style={{ marginBottom: '20px', color: 'var(--ink-mute)' }}>Research Citations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {studiesTable.map(({ ingredient, slug, studies }) => (
                <div key={slug}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                    borderBottom: '1px solid var(--line-soft)',
                    paddingBottom: '12px',
                  }}>
                    <Link
                      to={`/ingredients/${slug}`}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        color: 'var(--surface-deep)',
                        textDecoration: 'none',
                        borderBottom: '2px solid var(--accent)',
                        paddingBottom: '1px',
                        display: 'inline',
                      }}
                    >
                      {ingredient}
                    </Link>
                    <span style={{ color: 'var(--ink-mute)', fontSize: '0.72rem', fontFamily: 'var(--font-body)' }}>
                      {studies.length} {studies.length === 1 ? 'study' : 'studies'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {studies.map((study, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'flex-start',
                        background: 'var(--surface-soft)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.86rem', color: 'var(--ink)', marginBottom: '3px', lineHeight: 1.4 }}>
                            {study.title}
                          </div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--ink-mute)' }}>
                            {study.journal}
                          </div>
                        </div>
                        <a
                          href={study.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flexShrink: 0,
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            fontSize: '0.6rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--surface-deep)',
                            background: 'var(--accent)',
                            borderRadius: '999px',
                            padding: '4px 10px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            minHeight: 0,
                            minWidth: 0,
                          }}
                        >
                          PubMed →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cold-drying explainer */}
          <section style={{ marginBottom: '64px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '16px', color: 'var(--ink-mute)' }}>Process</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              What "Cold-Dried" Means — and Why It Matters
            </h2>
            <div style={{ maxWidth: '640px' }}>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                Conventional spray-drying — the industry standard for creating powdered supplements — operates at 120–200°C. At these temperatures, water-soluble vitamins (particularly vitamin C and B vitamins) degrade by 30–80% depending on processing time. Heat also destroys heat-labile enzymes and alters the polyphenol structure of plant antioxidants.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
                Cold-drying (low-temperature drying at ≤40–50°C, or freeze-drying for more delicate ingredients) preserves 80–95% of these heat-sensitive compounds. The trade-off is cost and processing time — cold-drying is significantly more expensive than spray-drying — but we consider it non-negotiable for a product whose value proposition is whole-plant nutrition.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                For amla specifically — our primary vitamin C source — the cold-drying method is critical. Amla's vitamin C is partially bound to tannins which protect it from oxidation, but high heat still accelerates degradation. Our cold-dried amla retains 85%+ of its natural vitamin C compared to &lt;40% in conventionally spray-dried amla powder.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <FAQAccordion items={faqs} title="Common Questions" />
          </section>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="cta-btn">Pre-Order Morivaná Daily →</Link>
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
              About Our Team →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'All 8 Ingredients', description: 'Individual ingredient pages with full nutritional profiles.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'Our Story', description: 'Why we built Morivaná Daily and our sourcing philosophy.', href: '/about', tag: 'Brand' },
        { title: 'Health Benefits', description: 'What the research means for your daily wellness.', href: '/benefits', tag: 'Benefits' },
      ]} />
    </>
  )
}
