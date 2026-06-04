import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FAQAccordion from './FAQAccordion'

const FAQ_ITEMS = [
  {
    question: 'What makes Morivaná different from other daily greens powders?',
    answer: 'Unlike other greens powders that use proprietary blends and synthetic vitamin packs, Morivaná is made from exactly 8 whole plants. We rely on organic, nutrient-dense whole foods like Moringa oleifera, spirulina, and amla to deliver natural iron, calcium, and vitamin C. There are no synthetic fillers, no artificial sweeteners, and no hidden ingredients. What you see on our label is exactly what goes into your morning scoop.'
  },
  {
    question: 'How do Moringa and Spirulina work together in your greens blend?',
    answer: 'Moringa (Moringa oleifera) and Spirulina are the twin powerhouses of our daily formula. Moringa is often called the "miracle tree" because it is the most nutrient-dense leaf on earth, carrying 92 antioxidants, iron, and calcium. Spirulina is a blue-green algae packed with complete proteins and natural energy-boosting phycocyanin. Together, they form a balanced super greens synergy that supports natural metabolic energy, immune defense, and daily cellular health without a caffeine crash.'
  },
  {
    question: 'Where are the ingredients for Morivaná sourced and processed?',
    answer: 'We believe in full transparency. Our premium Moringa is sourced from clean, organic farms in Tamil Nadu, India. Our high-potency Amla (Indian Gooseberry) comes from the clean soils of Uttarakhand, and our anti-inflammatory Ginger is harvested in Kerala. Each plant is carefully cold-dried to lock in cellular nutrition, then ground and weighed. Our monk fruit is ethically sourced from small farms in Guangxi, China, to providemogroside V sweetness without blood sugar spikes.'
  },
  {
    question: 'Is Morivaná suitable for daily long-term use in India and Canada?',
    answer: 'Yes, Morivaná is specifically formulated and certified for daily use by active individuals in both India and Canada. Our plant-based formula contains no synthetic vitamins or concentrated extracts that can tax the liver over time. It is vegan, soy-free, gluten-free, and contains no added sugar, making it the perfect daily greens companion to supplement clean nutrition.'
  },
  {
    question: 'How should I include Morivaná in my morning ritual?',
    answer: 'Taking Morivaná takes just 30 seconds. Simply add one scoop (5 grams) of our green powder to 200ml of cool water, coconut water, or your favorite morning smoothie. Shake or whisk thoroughly until dissolved and drink. For best results, we recommend making it a daily habit first thing in the morning on an empty stomach to optimize nutrient absorption and kickstart digestion.'
  }
]

export default function HomepageFAQ() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Kicker reveal
      gsap.from('.faq-kicker', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#homepage-faq',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // Heading word reveal
      gsap.from('.faq-heading', {
        y: 50,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#homepage-faq',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      // FAQ items stagger reveal
      gsap.utils.toArray('.faq-accordion-wrapper > div > div').forEach((el, i) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="homepage-faq"
      ref={sectionRef}
      style={{
        background: 'var(--surface-soft, #F4FBEC)',
        color: 'var(--ink, #0E2701)',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 32px)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="kicker faq-kicker" style={{ marginBottom: '16px', textAlign: 'center' }}>
          Questions & Answers
        </div>
        <h2
          className="faq-heading"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 48px)',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: 'var(--surface-deep)',
            marginBottom: '48px',
          }}
        >
          Frequently Asked Questions
        </h2>

        <div className="faq-accordion-wrapper">
          <FAQAccordion items={FAQ_ITEMS} maxWidth="800px" />
        </div>
      </div>
    </section>
  )
}
