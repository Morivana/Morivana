import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import FAQAccordion from '../components/FAQAccordion'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Benefits', href: null },
]

const timeline = [
  { phase: 'Day 1', icon: '⚡', title: 'Sustained Energy', body: 'Natural energy from moringa\'s B vitamins and spirulina\'s phycocyanin kicks in without a caffeine spike or crash. Most people notice focus and calm alertness by mid-morning.' },
  { phase: 'Day 3', icon: '🌿', title: 'Digestive Ease', body: 'Ginger begins modulating gastric motility. Morning bloating reduces. The inulin prebiotic starts feeding your Bifidobacterium population quiet gut repair begins.' },
  { phase: 'Week 1', icon: '🛡️', title: 'Immune Support', body: 'Amla\'s natural vitamin C (300–400mg per serving, 400% DV) begins supporting immune cell production. Spirulina\'s phycocyanin activates natural killer cells.' },
  { phase: 'Week 2', icon: '✨', title: 'Skin Clarity', body: 'Consistent antioxidant delivery (90+ in moringa alone) reduces oxidative stress visible in skin texture. Vitamin A and C support collagen synthesis.' },
  { phase: 'Ongoing', icon: '🧠', title: 'Mental Clarity', body: 'Long-term microbiome improvement from inulin improves the gut-brain axis. Regular users report sustained mental clarity and mood stability.' },
]

const deepDives = [
  {
    icon: '⚡',
    title: 'Energy',
    detail: `Morivaná Daily's energy is different from caffeine. Moringa provides iron (critical for oxygen transport) and B vitamins (B1, B2, B6) that support mitochondrial energy production at a cellular level. Spirulina adds complete protein for sustained fuel. The result is energy that doesn't spike and crash it sustains.

The mechanism: iron deficiency is the most common nutritional deficiency globally, and even mild deficiency causes persistent fatigue. Moringa delivers highly bioavailable non-heme iron, amplified by amla's vitamin C which increases non-heme iron absorption by up to 300%.`,
  },
  {
    icon: '🌿',
    title: 'Digestion',
    detail: `Two mechanisms, working at different speeds. Ginger works immediately it's a prokinetic, meaning it accelerates gastric emptying and reduces nausea. This is why many people feel better within the first few days. Inulin works over weeks it selectively feeds Bifidobacterium and Lactobacillus, rebalancing the gut microbiome composition. The short-chain fatty acids produced by this fermentation (butyrate, propionate) fuel colonocytes and reduce intestinal permeability.`,
  },
  {
    icon: '🛡️',
    title: 'Immunity',
    detail: `Amla's vitamin C isn't just a number it's 300–400mg of natural vitamin C per serving, bound to tannins that make it significantly more bioavailable than synthetic ascorbic acid. Natural vitamin C supports neutrophil function, enhances T-cell proliferation, and is an essential cofactor for collagen synthesis. Spirulina's phycocyanin has documented effects on natural killer cell activation and macrophage function. Together, they provide multi-layered immune support.`,
  },
  {
    icon: '✨',
    title: 'Skin',
    detail: `Skin health is downstream of oxidative stress, inflammation, and collagen production all three are addressed by Morivaná Daily's formulation. Moringa's 90+ antioxidants neutralize free radicals that accelerate skin aging. Amla's vitamin C is the rate-limiting cofactor for collagen synthesis without adequate vitamin C, collagen production stalls regardless of other factors. Lemon zest and orange peel add hesperidin, which supports capillary integrity (reducing redness and fragile vessels).`,
  },
  {
    icon: '🧠',
    title: 'Mental Clarity',
    detail: `The gut-brain axis is increasingly understood as a primary driver of cognitive function and mood. Inulin's prebiotic effect on the microbiome produces GABA precursors and serotonin precursors (90% of serotonin is produced in the gut, not the brain). Moringa's magnesium supports NMDA receptor function. Spirulina's phycocyanin crosses the blood-brain barrier and has demonstrated neuroprotective effects in preliminary research. These are long-term effects but they're measurable.`,
  },
]

const faqs = [
  { q: 'How quickly will I feel results?', a: 'Energy and digestive improvements often appear within 3–7 days of daily use. Skin changes and immune improvements take 2–4 weeks. Microbiome-level changes from inulin take 4–8 weeks to become measurable.' },
  { q: 'Is Morivaná Daily a replacement for my multivitamin?', a: 'It depends on your multivitamin. Morivaná Daily covers vitamin A, C, iron, calcium, B vitamins, and antioxidants from natural whole-plant sources. If your multivitamin primarily provides these, you may not need both. If you need specific minerals not in plants (zinc, iodine), keep your multivitamin.' },
  { q: 'Will it interact with my medications?', a: 'Consult your doctor, especially if you are on blood thinners (ginger has mild anticoagulant properties at high doses) or immunosuppressants. At one-scoop food doses, interactions are uncommon but individual variation exists.' },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Happens When You Take Morivaná Daily Every Day',
    description: 'A detailed look at the health benefits of Morivaná Daily super greens energy, digestion, immunity, skin, and mental clarity with scientific context.',
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

export default function BenefitsPage() {
  return (
    <>
      <SEOHead
        title="Moringa & Spirulina Health Benefits | Morivaná Daily Greens"
        description="A day-by-day look at what Morivaná Daily super greens does energy, digestion, immunity, skin clarity, and mental focus. Backed by ingredient research."
        canonical="/benefits"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)" centered>
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', marginBottom: '64px', maxWidth: '640px', margin: '40px auto 64px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>What to Expect</div>
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
              What Happens When You Take Morivaná Daily Every Day
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              These benefits are not based on marketing claims. They're based on what the{' '}
              <Link to="/ingredients" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>8 ingredients</Link>{' '}
              do at a biochemical level, confirmed by{' '}
              <Link to="/science" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>clinical research</Link>.
            </p>
          </div>

          {/* Timeline */}
          <section style={{ marginBottom: '72px' }}>
            <div className="kicker" style={{ marginBottom: '24px', color: 'var(--ink-mute)' }}>Your 30-Day Timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: '28px',
                top: '16px',
                bottom: '16px',
                width: '1px',
                background: 'repeating-linear-gradient(to bottom, var(--line-soft) 0 4px, transparent 4px 8px)',
              }} />
              {timeline.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  paddingBottom: '32px',
                  position: 'relative',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                    paddingTop: '8px',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      border: '2px solid var(--surface-deep)',
                    }} />
                  </div>
                  <div style={{ flex: 1, paddingTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-on)',
                        background: 'var(--accent)',
                        borderRadius: '999px',
                        padding: '3px 10px',
                      }}>
                        {item.phase}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--surface-deep)',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                      }}>
                        {item.title}
                      </span>
                    </div>
                    <p style={{ color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0, maxWidth: '560px', fontSize: '0.92rem' }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Deep-dives */}
          <section style={{ marginBottom: '72px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '24px', color: 'var(--ink-mute)' }}>Benefit Deep-Dives</div>
            <div style={{ display: 'grid', gap: '24px' }}>
              {deepDives.map((item, i) => (
                <div key={i} style={{
                  background: 'var(--surface-soft)',
                  borderRadius: '16px',
                  padding: 'clamp(20px, 3vw, 32px)',
                  border: '1px solid var(--line-soft)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(16px, 2vw, 22px)',
                      color: 'var(--surface-deep)',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      margin: 0,
                    }}>
                      {item.title}
                    </h3>
                  </div>
                  <div style={{ maxWidth: '660px' }}>
                    {item.detail.split('\n\n').map((para, j) => (
                      <p key={j} style={{ color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '12px', fontSize: '0.92rem' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research callout */}
          <section style={{ marginBottom: '56px', background: 'var(--surface-deep)', borderRadius: '20px', padding: 'clamp(28px, 4vw, 48px)' }}>
            <div className="kicker" style={{ color: 'var(--accent)', marginBottom: '12px' }}>Transparency</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 3vw, 30px)',
              color: 'var(--ink-on-dark)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: '16px',
            }}>
              How Do We Know This?
            </h2>
            <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '24px', fontSize: '0.92rem' }}>
              We cite the research. Every health claim about Morivaná Daily's ingredients is backed by peer-reviewed studies that you can read yourself not internal testing we never published.
            </p>
            <Link to="/science" style={{
              display: 'inline-flex',
              background: 'var(--accent)',
              color: 'var(--accent-on)',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              borderRadius: '999px',
              padding: '14px 28px',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-strong)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              Read the Full Research →
            </Link>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <FAQAccordion items={faqs} title="Common Questions" />
          </section>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/shop" className="cta-btn">
              Start Your Ritual →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'All 8 Ingredients', description: 'Explore the plants powering these benefits.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'The Science', description: 'Research citations behind every ingredient claim.', href: '/science', tag: 'Research' },
        { title: 'How to Use', description: 'Your 30-second morning ritual.', href: '/how-to-use', tag: 'Guide' },
      ]} />
    </>
  )
}
