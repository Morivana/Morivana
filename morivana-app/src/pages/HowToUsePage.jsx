import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import FAQAccordion from '../components/FAQAccordion'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'How To Use', href: null },
]

const steps = [
  {
    id: 'add',
    label: 'ADD',
    num: '01',
    title: 'Add One Scoop',
    body: 'Add 1 level scoop (5g) of Morivaná Daily to your glass or shaker bottle. The scoop is included in every pouch.',
    image: '/add.webp',
    alt: 'Step 1: Add one scoop of Morivaná Daily super greens powder to your glass',
  },
  {
    id: 'mix',
    label: 'MIX',
    num: '02',
    title: 'Mix Thoroughly',
    body: 'Add 250–350ml of water (room temperature or cool). Shake in a shaker bottle for 10–15 seconds, or stir briskly for 30 seconds in a glass.',
    image: '/mix.webp',
    alt: 'Step 2: Mix Morivaná Daily greens with water or your preferred liquid',
  },
  {
    id: 'drink',
    label: 'DRINK',
    num: '03',
    title: 'Drink Immediately',
    body: 'Drink right after mixing. Chlorophyll and phycocyanin degrade with prolonged exposure to light and air fresh is best.',
    image: '/drink.webp',
    alt: 'Step 3: Drink Morivaná Daily and start your day energized and clear',
  },
]

const recipes = [
  { name: 'Classic Water', desc: '300ml room-temperature water. Clean. Fast. Preferred for maximum nutrient absorption.', emoji: '💧' },
  { name: 'Coconut Water', desc: '250ml coconut water. Adds electrolytes and natural sweetness ideal post-workout.', emoji: '🥥' },
  { name: 'Green Smoothie', desc: 'Add one scoop to your morning fruit smoothie. The moringa color will be vivid and bright.', emoji: '🥤' },
  { name: 'Warm Oat Milk', desc: 'Warm (not boiling) oat milk for a winter option. Keep below 50°C to preserve nutrients.', emoji: '🌿' },
  { name: 'Orange Juice', desc: 'The vitamin C in OJ amplifies iron absorption from moringa and spirulina. A functional pairing.', emoji: '🍊' },
]

const faqs = [
  { q: 'Can I take it with coffee?', a: 'Yes, but separately. Coffee can inhibit iron absorption (from moringa and spirulina) if consumed simultaneously. Take Morivaná Daily first, then wait 30 minutes before coffee for optimal iron uptake.' },
  { q: 'Can I double scoop?', a: 'One scoop (5g) is the intended serving and is where the research-backed doses are calibrated. You can safely take 2 scoops, but it\'s not necessary for most people. More is not always better with whole-plant nutrition.' },
  { q: 'Is it safe during pregnancy?', a: 'Consult your OB/GYN before use during pregnancy or breastfeeding. While the individual ingredients are generally considered food-safe, high doses of ginger and spirulina during pregnancy have not been extensively studied.' },
  { q: 'Can children take Morivaná Daily?', a: 'Not recommended for children under 12 without medical guidance. Spirulina and moringa at these doses are designed for adult nutritional needs.' },
  { q: 'What if I miss a day?', a: 'No issue. The benefits of Morivaná Daily are cumulative one missed day won\'t reset your progress. Just resume the next morning.' },
]

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Use Morivaná Daily Super Greens Your 30-Second Morning Ritual',
  description: 'How to prepare and drink Morivaná Daily super greens powder in under 30 seconds.',
  step: steps.map(s => ({
    '@type': 'HowToStep',
    name: s.title,
    text: s.body,
    image: `https://morivanadaily.com${s.image}`,
  })),
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function HowToUsePage() {

  const schemas = [howToSchema, faqSchema, buildBreadcrumbSchema(breadcrumbs)]

  return (
    <>
      <SEOHead
        title="How to Use Morivaná Daily | Your 30-Second Morning Ritual"
        description="Mix one scoop of Morivaná Daily in 300ml water, shake, and drink. Three steps, 30 seconds. Plus mixing recipes and everything you need to know about timing."
        canonical="/how-to-use"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)" centered>
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', marginBottom: '56px', maxWidth: '640px', margin: '40px auto 56px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>The Ritual</div>
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
              Your 30-Second Morning Ritual
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              We designed Morivaná Daily to be the simplest part of your morning. Three steps. No blender required.
              What you're mixing:{' '}
              <Link to="/ingredients" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>
                8 whole plants, nothing else
              </Link>.
            </p>
          </div>

          {/* Steps */}
          <section style={{ marginBottom: '72px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {steps.map((step) => (
                <div
                  key={step.id}
                  style={{
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--line-soft)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', paddingTop: '60%', background: '#e8f0dc', overflow: 'hidden' }}>
                    <img
                      src={step.image}
                      alt={step.alt}
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      background: 'var(--surface-deep)',
                      color: 'var(--accent)',
                      borderRadius: '999px',
                      padding: '4px 12px',
                    }}>
                      {step.num} {step.label}
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: 'var(--surface-deep)',
                      marginBottom: '10px',
                    }}>
                      {step.title}
                    </h2>
                    <p style={{ color: 'var(--ink-soft)', lineHeight: 1.65, fontSize: '0.9rem', margin: 0 }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mixing ideas */}
          <section style={{ marginBottom: '72px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <div className="kicker" style={{ marginBottom: '20px', color: 'var(--ink-mute)' }}>Mixing Ideas</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 3vw, 32px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '28px',
            }}>
              5 Ways to Take Morivaná Daily
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {recipes.map((r) => (
                <div key={r.name} style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: '14px',
                  padding: '20px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                    marginBottom: '6px',
                  }}>
                    {r.name}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--ink-mute)', margin: 0 }}>
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Timing */}
          <section style={{ marginBottom: '72px', background: 'var(--surface-deep)', borderRadius: '20px', padding: 'clamp(28px, 4vw, 48px)' }}>
            <div className="kicker" style={{ color: 'var(--accent)', marginBottom: '12px' }}>Timing</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--ink-on-dark)',
              marginBottom: '20px',
            }}>
              When to Take It
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Morning (Recommended)', body: 'B vitamins and iron are most useful when your body is active. Taking Morivaná Daily fasted or alongside a light breakfast gives nutrients a clear metabolic pathway.', best: true },
                { title: 'Pre-Workout', body: 'Spirulina has demonstrated benefits for exercise performance and reduced oxidative stress after training. 30 minutes before exercise is effective.', best: false },
                { title: 'Evening (Possible)', body: 'You can take it in the evening, but you\'ll lose the circadian benefit of B vitamins in the morning. The energizing compounds may also affect sensitive sleepers.', best: false },
              ].map(t => (
                <div key={t.title} style={{
                  background: t.best ? 'rgba(205,216,131,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${t.best ? 'var(--accent)' : 'var(--line-on-dark)'}`,
                  borderRadius: '14px',
                  padding: '20px',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', color: t.best ? 'var(--accent)' : 'var(--ink-on-dark)', marginBottom: '8px' }}>
                    {t.title}
                    {t.best && <span style={{ marginLeft: '8px', fontSize: '0.65rem', letterSpacing: '0.18em', verticalAlign: 'middle', opacity: 0.7 }}>★</span>}
                  </div>
                  <p style={{ color: 'var(--ink-on-dark-mute)', lineHeight: 1.6, fontSize: '0.82rem', margin: 0 }}>{t.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What to expect */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '12px',
            }}>
              What to Expect in Your First 30 Days
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '560px', marginBottom: '16px' }}>
              See the full{' '}
              <Link to="/benefits" style={{ color: 'var(--surface-deep)', fontWeight: 600 }}>
                day-by-day benefits timeline →
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <FAQAccordion items={faqs} title="FAQ" />
          </section>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/shop" className="cta-btn">
              Ready to Start? Pre-Order Now →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'Health Benefits', description: 'What to expect in the first 30 days of daily use.', href: '/benefits', tag: 'Benefits' },
        { title: 'All Ingredients', description: 'What you\'re actually mixing each morning.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'Wellness Guides', description: 'Recipes, routines, and nutritional deep-dives.', href: '/learn', tag: 'Learn' },
      ]} />
    </>
  )
}
