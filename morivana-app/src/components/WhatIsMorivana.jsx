import { useEffect } from 'react'
import gsap from 'gsap'
import FloatingLeaves from './FloatingLeaves'

const highlights = [
  { num: '01', label: 'ENERGIZE', desc: 'Natural energy from moringa & spirulina' },
  { num: '02', label: 'REFRESH', desc: 'Citrus cleanse from lemon & orange peel' },
  { num: '03', label: 'NOURISH', desc: 'Gut support from inulin prebiotic fiber' },
]

export default function WhatIsMorivana() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word headline reveal
      gsap.from('.what-word', {
        y: 60, opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: '#what-section', start: 'top 70%', toggleActions: 'play none none none' },
      })
      // Other content blocks
      gsap.utils.toArray('.what-text-block').forEach((block) => {
        if (block.querySelector('.what-word')) return
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
            <h2 style={{
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ overflow: 'hidden' }}>
                <span className="what-word what-display-heading" style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(20px, 7.5vw, 80px)',
                  lineHeight: 0.9,
                  color: 'var(--surface-deep)',
                  letterSpacing: '0.01em',
                  textTransform: 'uppercase',
                }}>A MORNING RITUAL</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span className="what-word" style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(18px, 2.4vw, 32px)',
                  lineHeight: 1.15,
                  color: 'var(--ink-soft)',
                  letterSpacing: '0.005em',
                  fontOpticalSizing: 'auto',
                }}>Not just a powder</span>
              </div>
            </h2>
          </div>

          {/* Mobile product image (hidden on desktop, visible on mobile) */}
          <div className="mobile-product-img" style={{ display: 'none' }}>
            <img
              src="/packaging_highres.png"
              alt="Morivaná Daily Super Greens Powder Premium Packaging"
              loading="eager"
              fetchpriority="high"
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

          {/* Numbered highlights — typographic, no icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {highlights.map(h => (
              <div
                key={h.label}
                className="what-text-block"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '18px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(25,65,2,0.10)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '0.18em',
                  color: 'var(--ink-mute)',
                  minWidth: '28px',
                }}>
                  {h.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--surface-deep)',
                    marginBottom: '4px',
                  }}>
                    {h.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--ink-soft)',
                    opacity: 0.9,
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
