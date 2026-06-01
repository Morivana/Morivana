import { useEffect } from 'react'
import gsap from 'gsap'
import FloatingLeaves from './FloatingLeaves'

const ingredients = [
  {
    name: 'Moringa',
    latin: 'Moringa oleifera',
    compound: 'Quercetin',
    origin: 'Tamil Nadu, IN',
    benefit: 'The most nutrient-dense leaf on earth — iron, calcium, and 92 antioxidants in a single scoop.',
    potency: 92,
  },
  {
    name: 'Spirulina',
    latin: 'Arthrospira platensis',
    compound: 'Phycocyanin',
    origin: 'Pond-grown',
    benefit: 'Blue-green algae packed with complete protein and natural energy.',
    potency: 88,
  },
  {
    name: 'Amla',
    latin: 'Phyllanthus emblica',
    compound: 'Vitamin C',
    origin: 'Uttarakhand, IN',
    benefit: 'The Indian gooseberry. One of the richest natural sources of vitamin C on the planet.',
    potency: 96,
  },
  {
    name: 'Ginger',
    latin: 'Zingiber officinale',
    compound: 'Gingerol',
    origin: 'Kerala, IN',
    benefit: 'Calms digestion, eases inflammation, and adds a quiet warmth to every sip.',
    potency: 82,
  },
  {
    name: 'Lemon',
    latin: 'Citrus limon',
    compound: 'Citric acid',
    origin: 'Sun-dried zest',
    benefit: 'Cold-dried lemon for an alkalizing, brightening lift — without the acidity of juice.',
    potency: 78,
  },
  {
    name: 'Inulin',
    latin: 'Cichorium intybus',
    compound: 'Prebiotic fiber',
    origin: 'Chicory root',
    benefit: 'Soluble fiber that feeds the good bacteria in your gut. Quiet, daily repair.',
    potency: 84,
  },
  {
    name: 'Orange Peel',
    latin: 'Citrus sinensis',
    compound: 'Hesperidin',
    origin: 'Whole-fruit dried',
    benefit: 'Flavonoids and digestive enzymes from the part of the orange most never use.',
    potency: 74,
  },
  {
    name: 'Monk Fruit',
    latin: 'Siraitia grosvenorii',
    compound: 'Mogroside V',
    origin: 'Guangxi, CN',
    benefit: 'A natural sweetness with zero sugar, zero calories, and no aftertaste.',
    potency: 90,
  },
]

export default function Ingredients() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ing-word', {
        y: 60, opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: '#ingredients', start: 'top 70%', toggleActions: 'play none none none' },
      })

      gsap.utils.toArray('.ing-reveal').forEach((el) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })

      gsap.utils.toArray('.ingredient-monograph').forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ingredients"
      style={{ background: 'var(--surface-soft)', position: 'relative', padding: '88px 0', overflow: 'hidden' }}
    >
      <FloatingLeaves variant="light" density="sparse" />

      <div className="section-content">
        <div className="ing-header">
          <div className="kicker ing-reveal" style={{ marginBottom: '14px' }}>
            THE FORMULA
          </div>
          <h2 style={{ margin: '0 0 16px' }}>
            <div style={{ overflow: 'hidden' }}>
              <span className="ing-word ing-head-display">Eight plants.</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="ing-word ing-head-serif">Nothing else.</span>
            </div>
          </h2>
          <div className="ing-reveal ing-header-note">
            <p>
              Every entry below is a whole plant — cold-dried, ground, weighed. Nothing synthesized.
            </p>
          </div>
        </div>

        <div className="ingredient-grid">
          {ingredients.map((ing, i) => {
            const idx = String(i + 1).padStart(2, '0')
            return (
              <article key={i} className="ingredient-monograph">
                <div className="im-top">
                  <div className="im-idx">{idx}</div>
                  <div className="im-compound">{ing.compound}</div>
                </div>

                <div className="im-name">{ing.name}</div>
                <div className="im-latin">{ing.latin}</div>

                <div className="im-body">
                  <div className="im-divider" />
                  <div className="im-origin">{ing.origin}</div>
                  <p className="im-benefit">{ing.benefit}</p>
                </div>
              </article>
            )
          })}
        </div>

        <div className="ing-reveal ing-certs">
          {['Vegan', 'Soy-Free', 'No Added Sugar', 'No Artificial Sweeteners'].map(cert => (
            <span key={cert} className="ing-cert">{cert}</span>
          ))}
        </div>
      </div>

      <style>{`
        #ingredients .section-content { width: 100%; }

        .ing-header {
          max-width: 1100px;
          margin: 0 auto 56px;
          padding: 0 clamp(20px, 4vw, 32px);
        }
        .ing-head-display {
          display: inline-block;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(36px, 6vw, 84px);
          line-height: 0.92;
          color: var(--surface-deep);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }
        .ing-head-serif {
          display: inline-block;
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: clamp(14px, 4vw, 32px);
          line-height: 1.2;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .ing-header-note p {
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: var(--ink-soft);
          line-height: 1.6;
          margin: 0;
          max-width: 560px;
        }

        .ingredient-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 32px);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(25,65,2,0.18);
          border: 1px solid rgba(25,65,2,0.18);
          border-radius: 4px;
          overflow: hidden;
        }

        .ingredient-monograph {
          background: #e2e9b986;
          color: var(--surface-deep);
          padding: 22px 20px 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .im-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .im-idx {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--ink-mute);
        }
        .im-compound {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 4px 9px;
          border: 1px solid rgba(25,65,2,0.25);
          border-radius: 999px;
          color: var(--ink-soft);
          white-space: nowrap;
        }

        .im-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.3rem, 2.2vw, 1.55rem);
          line-height: 1.0;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .im-latin {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.88rem;
          color: var(--ink-soft);
          margin-bottom: 14px;
        }

        .im-body { flex: 1; }
        .im-divider {
          height: 1px;
          background: repeating-linear-gradient(to right, rgba(25,65,2,0.4) 0 3px, transparent 3px 6px);
          margin-bottom: 10px;
        }
        .im-origin {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: 8px;
        }
        .im-benefit {
          font-family: var(--font-body);
          font-size: 0.84rem;
          line-height: 1.55;
          color: var(--ink-soft);
          margin: 0;
        }

        .ing-certs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 44px;
          justify-content: center;
          padding: 0 clamp(20px, 4vw, 32px);
        }
        .ing-cert {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent-on);
          background: var(--accent);
          border-radius: 999px;
          padding: 6px 14px;
        }

        /* Tablet landscape (iPad landscape ~1024px) — slightly tighter */
        @media (max-width: 1100px) {
          .ingredient-grid { grid-template-columns: repeat(3, 1fr); }
          .ingredient-monograph { min-height: 230px; }
        }

        /* iPad portrait & small tablets */
        @media (max-width: 880px) {
          #ingredients { padding: 72px 0 !important; }
          .ing-header { margin-bottom: 44px; gap: 24px; }
          .ing-header-note { max-width: 100%; border-left-width: 2px; }
          .ingredient-grid { grid-template-columns: repeat(2, 1fr); }
          .ingredient-monograph { min-height: 220px; padding: 20px 18px 18px; }
        }

        /* Large phone */
        @media (max-width: 560px) {
          .ingredient-grid { grid-template-columns: 1fr; }
          .ingredient-monograph { min-height: auto; padding: 18px 18px 18px; }
          .im-body { min-height: 70px; }
        }

        /* Small phone */
        @media (max-width: 380px) {
          .ing-header { padding: 0 20px; }
          .ingredient-grid { padding: 0 20px; }
          .ingredient-monograph { padding: 16px 16px; }
        }
      `}</style>
    </section>
  )
}
