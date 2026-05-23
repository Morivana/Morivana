import { useEffect } from 'react'
import gsap from 'gsap'
import FloatingLeaves from './FloatingLeaves'
import {
  Pyramid3D,
  Helix3D,
  Sphere3D,
  Cube3D,
  Cone3D,
  Cylinder3D,
  Torus3D,
  DoubleCone3D
} from './ui/ThreeDIcons'

const ingredients = [
  { icon: <Pyramid3D size={28} light={true} />,    name: 'MORINGA POWDER', benefit: 'The most nutrient-dense plant on earth. Iron, calcium & antioxidants.' },
  { icon: <Helix3D size={28} light={true} />,      name: 'SPIRULINA',      benefit: 'Blue-green algae powerhouse for protein and energy.' },
  { icon: <Sphere3D size={28} light={true} />,     name: 'AMLA',           benefit: 'Vitamin C from the Indian gooseberry. Immunity & skin.' },
  { icon: <Cube3D size={28} light={true} />,       name: 'GINGER POWDER',  benefit: 'Soothes digestion. Reduces inflammation naturally.' },
  { icon: <Cone3D size={28} light={true} />,       name: 'LEMON POWDER',   benefit: 'Natural detox. Alkalizing effect on your body.' },
  { icon: <Cylinder3D size={28} light={true} />,   name: 'INULIN',         benefit: 'Prebiotic fiber that feeds your gut microbiome.' },
  { icon: <Torus3D size={28} light={true} />,      name: 'ORANGE PEEL',    benefit: 'Flavonoids and digestive enzymes from whole citrus.' },
  { icon: <DoubleCone3D size={28} light={true} />, name: 'MONK FRUIT',     benefit: 'Zero-calorie natural sweetener. No sugar spike.' },
]

export default function Ingredients() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word headline reveal
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

      gsap.utils.toArray('.ingredient-card').forEach((card, i) => {
        const fromLeft = i % 2 === 0
        gsap.from(card, {
          x: fromLeft ? -60 : 60,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ingredients"
      style={{ background: 'var(--surface-soft)', position: 'relative', padding: '88px 0' }}
    >
      <FloatingLeaves variant="light" density="sparse" />

      <div className="section-content">
      {/* Section header - centered above the zigzag column */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px', padding: '0 32px' }}>
        <div className="kicker ing-reveal" style={{ marginBottom: '14px', justifyContent: 'center', display: 'flex' }}>
          CLEAN LABEL
        </div>
        <h2 style={{
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <div style={{ overflow: 'hidden' }}>
            <span className="ing-word" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(22px, 2.6vw, 34px)',
              lineHeight: 1.1,
              color: 'var(--ink)',
              letterSpacing: '-0.005em',
            }}>
              What's inside
            </span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="ing-word" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(34px, 5vw, 64px)',
              lineHeight: 0.95,
              color: 'var(--surface-deep)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}>
              EVERY SCOOP
            </span>
          </div>
        </h2>
        <p className="ing-reveal" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--ink-soft)',
          marginTop: '18px',
          lineHeight: 1.65,
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Eight whole-food superfoods. No fillers, no synthetic additives, no compromise.
        </p>
      </div>

      {/* Hero ingredient still-life - visually anchors the section with the
          real ingredients laid out around the pouch. */}
      <div className="ing-reveal ing-hero-image" style={{
        maxWidth: '420px',
        margin: '0 auto 56px',
        padding: '0 32px',
        position: 'relative',
      }}>
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(25,65,2,0.18), 0 4px 16px rgba(25,65,2,0.08)',
          border: '1px solid rgba(25,65,2,0.10)',
        }}>
          <img
            src="/morivana-ingredients.png"
            alt="Morivana pouch surrounded by raw moringa, ginger, citrus and herbs"
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--surface-deep)',
          color: 'var(--accent)',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '0.66rem',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          padding: '7px 18px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
        }}>
          Whole-Food Sourced
        </div>
      </div>

      {/* Zigzag column - pouch sits centered behind via the global 3D layer.
          Even cards (0,2,4,6) align left; odd cards (1,3,5,7) align right. */}
      <div className="ingredients-zigzag" style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {ingredients.map((ing, i) => {
          const isRight = i % 2 === 1
          return (
            <div
              key={i}
              className="ingredient-card"
              style={{
                width: '38%',
                marginLeft: isRight ? 'auto' : 0,
                marginRight: isRight ? 0 : 'auto',
                display: 'flex',
                gap: '14px',
                padding: '16px 18px',
                background: '#EDF2D9',
                border: '1px solid rgba(25,65,2,0.12)',
                borderRadius: '14px',
                boxShadow: '0 4px 16px rgba(25,65,2,0.04)',
                transition: 'transform 0.3s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s, border-color 0.3s',
                cursor: 'default',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = `translateY(-2px) ${isRight ? 'translateX(-4px)' : 'translateX(4px)'}`
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(25,65,2,0.10)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) translateX(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,65,2,0.04)'
                e.currentTarget.style.borderColor = 'rgba(25,65,2,0.12)'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#F8FBE6',
                border: '1px solid rgba(25,65,2,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {ing.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--surface-deep)',
                  marginBottom: '4px',
                }}>
                  {ing.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: '#2C4A1E',
                  lineHeight: 1.55,
                }}>
                  {ing.benefit}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Certifications */}
      <div className="ing-reveal" style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginTop: '44px',
        justifyContent: 'center',
        padding: '0 32px',
      }}>
        {['Vegan', 'Soy-Free', 'No Added Sugar', 'No Artificial Sweeteners'].map(cert => (
          <span key={cert} style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.66rem',
            letterSpacing: '0.22em',
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
      </div>

      {/* Mobile: stack cards full-width */}
      <style>{`
        @media (max-width: 992px) {
          .ingredients-zigzag .ingredient-card {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
        @media (max-width: 480px) {
          .ing-hero-image {
            max-width: 280px !important;
            margin-bottom: 36px !important;
          }
          .ingredients-zigzag .ingredient-card {
            padding: 12px 14px !important;
            gap: 10px !important;
          }
          .ingredients-zigzag .ingredient-card div:first-of-type {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </section>
  )
}
