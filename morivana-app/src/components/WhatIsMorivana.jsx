import { useEffect } from 'react'
import gsap from 'gsap'
import { DoubleCone3D, Torus3D, Sphere3D } from './ui/ThreeDIcons'
import FloatingLeaves from './FloatingLeaves'

const highlights = [
  { icon: <DoubleCone3D size={42} light={true} />, label: 'ENERGIZE', desc: 'Natural energy from moringa & spirulina' },
  { icon: <Torus3D size={42} light={true} />, label: 'REFRESH', desc: 'Citrus cleanse from lemon & orange peel' },
  { icon: <Sphere3D size={42} light={true} />, label: 'NOURISH', desc: 'Gut support from inulin prebiotic fiber' },
]

export default function WhatIsMorivana() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.what-text-block').forEach((block) => {
        gsap.from(block, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="what-section"
      style={{
        background: '#FFFCF2',
        position: 'relative',
      }}
    >
      <FloatingLeaves variant="light" density="normal" />

      <div className="section-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
        {/* Text content - left side, leaves right open for 3D overlay */}
        <div className="story-text-col">
          <div className="what-text-block">
            <div className="kicker">NOT JUST A GREENS POWDER</div>
          </div>

          <div className="what-text-block">
            <h2 style={{
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(24px, 3.2vw, 44px)',
                lineHeight: 1.05,
                color: 'var(--ink)',
                letterSpacing: '-0.005em',
              }}>
                Not a powder.
              </span>
              <span className="what-display-heading" style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(32px, 7.5vw, 112px)',
                lineHeight: 0.9,
                color: 'var(--surface-deep)',
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
              }}>
                A MORNING RITUAL
              </span>
            </h2>
          </div>

          {/* Mobile product image (hidden on desktop, visible on mobile) */}
          <div className="mobile-product-img" style={{ display: 'none' }}>
            <img
              src="/packaging_highres.png"
              alt="Morivana Daily Super Greens"
              style={{
                width: '100%',
                maxHeight: '350px',
                objectFit: 'contain',
                margin: '20px 0',
              }}
            />
          </div>

          <div className="what-text-block">
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.02rem',
              lineHeight: 1.7,
              color: 'var(--ink-soft)',
              maxWidth: '460px',
            }}>
              Morivana Daily Super Greens blends 8 of nature's most powerful superfoods:
              moringa, spirulina, amla, ginger, lemon, inulin, orange peel and monk fruit,
              into one easy daily scoop.
            </p>
          </div>

          <div className="what-text-block">
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.02rem',
              lineHeight: 1.7,
              color: 'var(--ink-soft)',
              maxWidth: '460px',
            }}>
              Made for busy people who don't always get enough nutrients from food.
              One scoop in water. 30 seconds. Done.
            </p>
          </div>

          {/* 3-icon highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {highlights.map(h => (
              <div
                key={h.label}
                className="what-text-block"
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div className="ingredient-icon" style={{ fontSize: '1.6rem' }}>{h.icon}</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                  }}>
                    {h.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--ink-soft)',
                    opacity: 0.85,
                    marginTop: '4px',
                  }}>
                    {h.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
