import { useEffect } from 'react'
import gsap from 'gsap'
import { DoubleCone3D, Helix3D, Cone3D, Sphere3D, Cylinder3D } from './ui/ThreeDIcons'
import FloatingLeaves from './FloatingLeaves'

const benefits = [
  { icon: <DoubleCone3D size={28} light={true} />, title: 'ALL-DAY ENERGY',     desc: 'No caffeine crash. Moringa + spirulina fuel you naturally.', tag: 'Energy' },
  { icon: <Helix3D size={28} light={true} />,      title: 'BETTER DIGESTION',   desc: 'Ginger + inulin = smoother gut, every morning.',            tag: 'Gut' },
  { icon: <Cone3D size={28} light={true} />,       title: 'STRONGER IMMUNITY',  desc: 'Amla + lemon = daily vitamin C hit.',                       tag: 'Immunity' },
  { icon: <Sphere3D size={28} light={true} />,     title: 'CLEARER SKIN',       desc: 'Antioxidant load from moringa fights free radicals.',       tag: 'Skin' },
  { icon: <Cylinder3D size={28} light={true} />,   title: '30-SECOND HABIT',    desc: 'One scoop. No blending. No prep. Just results.',            tag: 'Ritual' },
]

export default function Benefits() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word headline reveal
      gsap.from('.benefits-word', {
        y: 60, opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: '#benefits', start: 'top 70%', toggleActions: 'play none none none' },
      })

      gsap.utils.toArray('.benefits-reveal').forEach((el) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })

      gsap.utils.toArray('.benefit-card').forEach((card, i) => {
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
      id="benefits"
      style={{ background: 'var(--surface-base)', position: 'relative', padding: '88px 0' }}
    >
      <FloatingLeaves variant="light" density="sparse" />

      <div className="section-content">
      {/* Section header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px', padding: '0 32px' }}>
        <div className="kicker benefits-reveal" style={{ marginBottom: '14px', justifyContent: 'center', display: 'flex' }}>
          WHY MORIVANA WORKS
        </div>
        <h2 style={{
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <div style={{ overflow: 'hidden' }}>
            <span className="benefits-word" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(22px, 2.6vw, 34px)',
              lineHeight: 1.1,
              color: 'var(--ink)',
              letterSpacing: '-0.005em',
            }}>
              Feel the difference
            </span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="benefits-word" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(34px, 5vw, 64px)',
              lineHeight: 0.95,
              color: 'var(--surface-deep)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}>
              FROM DAY ONE
            </span>
          </div>
        </h2>
        <p className="benefits-reveal" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--ink-soft)',
          marginTop: '18px',
          lineHeight: 1.65,
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Five outcomes, one daily scoop. Engineered from whole-food superfoods. No shortcuts.
        </p>
      </div>

      {/* Zigzag column - pouch sits centered behind via global 3D layer */}
      <div className="benefits-zigzag" style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}>
        {benefits.map((b, i) => {
          const isRight = i % 2 === 1
          return (
            <div
              key={i}
              className="benefit-card"
              style={{
                width: '38%',
                marginLeft: isRight ? 'auto' : 0,
                marginRight: isRight ? 0 : 'auto',
                padding: '18px 20px',
                background: '#EDF2D9',
                border: '1px solid rgba(25,65,2,0.12)',
                borderRadius: '14px',
                boxShadow: '0 4px 16px rgba(25,65,2,0.04)',
                transition: 'transform 0.3s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s, border-color 0.3s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = `translateY(-2px) ${isRight ? 'translateX(-4px)' : 'translateX(4px)'}`
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(25,65,2,0.10)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) translateX(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,65,2,0.04)'
                e.currentTarget.style.borderColor = 'rgba(25,65,2,0.12)'
              }}
            >
              {/* Subtle accent wedge */}
              <div style={{
                position: 'absolute',
                top: 0,
                [isRight ? 'left' : 'right']: 0,
                width: '70px',
                height: '70px',
                background: 'radial-gradient(circle at top, rgba(205,216,131,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#F8FBE6',
                  border: '1px solid rgba(25,65,2,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {b.icon}
                </div>
                <div className="benefit-title" style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.95rem, 3vw, 1.18rem)',
                  letterSpacing: '0.04em',
                  color: 'var(--surface-deep)',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                }}>
                  {b.title}
                </div>
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.86rem',
                color: '#2C4A1E',
                lineHeight: 1.55,
                marginTop: '4px',
              }}>
                {b.desc}
              </p>
            </div>
          )
        })}
      </div>
      </div>

      {/* Mobile: full-width cards */}
      <style>{`
        @media (max-width: 992px) {
          .benefits-zigzag .benefit-card {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
        @media (max-width: 480px) {
          .benefits-zigzag .benefit-card {
            padding: 14px 14px !important;
          }
          .benefits-zigzag .benefit-card .benefit-title {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </section>
  )
}
