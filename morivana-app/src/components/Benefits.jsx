import { useEffect } from 'react'
import gsap from 'gsap'
import FloatingLeaves from './FloatingLeaves'

const benefits = [
  {
    phase: 'DAY 01',
    when: 'You feel it the first morning.',
    title: 'All-day energy',
    desc: 'Moringa and spirulina fuel a steady, level kind of energy. No caffeine, no crash, no jittery 11am.',
    tag: 'Energy',
    metric: '+6 hrs',
    metricLabel: 'Sustained focus',
  },
  {
    phase: 'DAY 03',
    when: 'Your morning starts smoother.',
    title: 'Better digestion',
    desc: 'Ginger calms. Inulin feeds the good bacteria. Within three days, the gut starts running quieter.',
    tag: 'Gut',
    metric: '8g',
    metricLabel: 'Daily fiber',
  },
  {
    phase: 'WEEK 01',
    when: 'Your defenses get sharper.',
    title: 'Stronger immunity',
    desc: 'Amla delivers more vitamin C than an orange. Lemon stacks the citrus load. A daily shield.',
    tag: 'Immunity',
    metric: '600%',
    metricLabel: 'Daily vitamin C',
  },
  {
    phase: 'WEEK 02',
    when: 'You see it in the mirror.',
    title: 'Clearer skin',
    desc: 'Moringa carries 46 antioxidants that quietly mop up the free radicals dulling your skin.',
    tag: 'Skin',
    metric: '46',
    metricLabel: 'Antioxidants',
  },
  {
    phase: 'EVERY DAY',
    when: 'It takes thirty seconds.',
    title: 'A ritual you keep',
    desc: 'One scoop, one glass. No blender, no measuring, no Sunday-prep. The habit sticks because the friction is gone.',
    tag: 'Ritual',
    metric: '30s',
    metricLabel: 'A day',
  },
]

export default function Benefits() {
  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.utils.toArray('.timeline-row').forEach((row, i) => {
        gsap.from(row, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.05,
          scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none none' },
        })
      })

      gsap.from('.timeline-spine-fill', {
        scaleY: 0,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrap',
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="benefits"
      style={{ background: 'var(--surface-base)', position: 'relative', padding: '88px 0', overflow: 'hidden' }}
    >
      <FloatingLeaves variant="light" density="sparse" />

      <div className="section-content">
        <div className="ben-header">
          <div className="kicker benefits-reveal" style={{ marginBottom: '14px' }}>
            THE OUTCOMES
          </div>
          <h2 style={{ margin: '0 0 16px' }}>
            <div style={{ overflow: 'hidden' }}>
              <span className="benefits-word ben-head-display">A timeline</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="benefits-word ben-head-serif">Your body keeps.</span>
            </div>
          </h2>
          <div className="benefits-reveal ben-header-note">
            <p>
              The same scoop, every morning. Here’s what shows up and when if you stay with it.
            </p>
          </div>
        </div>

        <div className="timeline-wrap">
          <div className="timeline-spine">
            <div className="timeline-spine-fill" />
          </div>

          {benefits.map((b, i) => (
            <div key={i} className="timeline-row">
              <div className="tr-phase">
                <div className="tr-phase-tag">{b.phase}</div>
                <div className="tr-phase-when">{b.when}</div>
              </div>

              <div className="tr-node">
                <div className="tr-dot">
                  <div className="tr-dot-inner" />
                </div>
              </div>

              <div className="tr-content">
                <div className="tr-title-row">
                  <h3 className="tr-title">{b.title}</h3>
                  <span className="tr-tag">{b.tag}</span>
                </div>
                <p className="tr-desc">{b.desc}</p>
              </div>

              <div className="tr-metric">
                <div className="tr-metric-num">{b.metric}</div>
                <div className="tr-metric-label">{b.metricLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ben-header {
          max-width: 1100px;
          margin: 0 auto 64px;
          padding: 0 clamp(20px, 4vw, 32px);
        }
        .ben-head-display {
          display: inline-block;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(36px, 6vw, 84px);
          line-height: 0.92;
          color: var(--surface-deep);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }
        .ben-head-serif {
          display: inline-block;
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 500;
          font-size: clamp(14px, 4vw, 32px);
          line-height: 1.2;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .ben-header-note p {
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: var(--ink-soft);
          line-height: 1.6;
          margin: 0;
          max-width: 560px;
        }

        .timeline-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 32px);
          position: relative;
        }
        .timeline-spine {
          position: absolute;
          left: calc(clamp(20px, 4vw, 32px) + 110px);
          top: 28px;
          bottom: 28px;
          width: 2px;
          background: rgba(25,65,2,0.10);
          pointer-events: none;
        }
        .timeline-spine-fill {
          position: absolute;
          inset: 0;
          background: var(--surface-deep);
          transform-origin: top;
        }
        .timeline-row {
          display: grid;
          grid-template-columns: 110px 24px 1fr 200px;
          gap: 18px;
          align-items: start;
          padding: 28px 0;
          border-bottom: 1px dashed rgba(25,65,2,0.16);
        }
        .timeline-row:last-child { border-bottom: none; }

        .tr-phase { padding-top: 6px; }
        .tr-phase-tag {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          color: var(--surface-deep);
          font-weight: 700;
          margin-bottom: 6px;
        }
        .tr-phase-when {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.82rem;
          color: var(--ink-soft);
          line-height: 1.35;
        }

        .tr-node {
          display: flex;
          justify-content: center;
          padding-top: 10px;
        }
        .tr-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--surface-base);
          border: 2px solid var(--surface-deep);
          position: relative;
          z-index: 1;
        }
        .tr-dot-inner {
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: var(--accent);
        }

        .tr-content { padding-right: 12px; }
        .tr-title-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .tr-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.4rem, 3vw, 2.0rem);
          letter-spacing: -0.01em;
          color: var(--surface-deep);
          margin: 0;
          line-height: 1.0;
          text-transform: uppercase;
        }
        .tr-tag {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          background: var(--surface-deep);
          color: var(--accent);
        }
        .tr-desc {
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--ink-soft);
          margin: 0;
          max-width: 480px;
        }

        .tr-metric {
          background: #F4FBEC;
          border: 1px solid rgba(25,65,2,0.12);
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          align-self: center;
        }
        .tr-metric-num {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.0;
          color: var(--surface-deep);
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .tr-metric-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }

        /* Tablet landscape tighten metric column */
        @media (max-width: 1080px) {
          .timeline-row {
            grid-template-columns: 100px 24px 1fr 170px;
            gap: 14px;
          }
          .timeline-spine { left: calc(clamp(20px, 4vw, 32px) + 100px); }
          .tr-metric { padding: 14px 16px; }
          .tr-metric-num { font-size: 1.7rem; }
        }

        /* iPad portrait drop the metric to bottom */
        @media (max-width: 900px) {
          #benefits { padding: 56px 0 !important; }
          .ben-header { margin-bottom: 32px; gap: 16px; }
          .ben-header-note { max-width: 100%; }
          .ben-head-display { font-size: clamp(24px, 6vw, 44px) !important; }
          .ben-head-serif { font-size: clamp(12px, 3vw, 22px) !important; }
          .ben-header-note p { font-size: 0.82rem !important; }
          .timeline-row {
            grid-template-columns: 100px 24px 1fr;
            gap: 14px;
            padding: 22px 0;
          }
          .timeline-spine { left: calc(clamp(20px, 4vw, 32px) + 100px); }
          .tr-metric {
            grid-column: 1 / -1;
            margin-left: 140px;
            margin-top: 8px;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            align-self: stretch;
            padding: 10px 14px;
          }
          .tr-metric-num { font-size: 1.4rem; margin-bottom: 0; }
          .tr-metric-label { font-size: 0.56rem; }
        }

        /* Large phone collapse to compact card-style */
        @media (max-width: 640px) {
          #benefits { padding: 40px 0 !important; }
          .ben-header { margin-bottom: 24px; padding: 0 16px; }
          .ben-head-display { font-size: clamp(20px, 6vw, 36px) !important; }
          .ben-head-serif { font-size: clamp(11px, 2.8vw, 18px) !important; }
          .ben-header-note p { font-size: 0.78rem !important; }
          .timeline-wrap {
            padding-left: 16px;
            padding-right: 16px;
            max-width: 380px;
            margin: 0 auto;
          }
          .timeline-spine { left: 22px; top: 28px; bottom: 28px; }
          .timeline-row {
            grid-template-columns: 14px 1fr;
            gap: 12px;
            padding: 18px 0;
          }
          .tr-phase {
            grid-column: 2 / -1;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 8px;
            padding-top: 0;
            margin-bottom: 4px;
          }
          .tr-phase-tag {
            margin-bottom: 0;
            font-size: 0.62rem !important;
            letter-spacing: 0.14em;
          }
          .tr-phase-when {
            font-size: 0.7rem !important;
          }
          .tr-node {
            justify-content: flex-start;
            padding-top: 4px;
          }
          .tr-dot {
            width: 10px;
            height: 10px;
          }
          .tr-dot-inner {
            inset: 2px;
          }
          .tr-content {
            grid-column: 2 / -1;
            padding-right: 0;
          }
          .tr-title-row {
            gap: 8px;
            margin-bottom: 6px;
          }
          .tr-title {
            font-size: clamp(0.9rem, 3.5vw, 1.15rem) !important;
          }
          .tr-tag {
            font-size: 0.52rem;
            padding: 2px 6px;
          }
          .tr-desc {
            font-size: 0.76rem !important;
            line-height: 1.5;
          }
          .tr-metric {
            grid-column: 2 / -1;
            margin-left: 0;
            margin-top: 6px;
            padding: 8px 12px;
            border-radius: 8px;
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }
          .tr-metric-num {
            font-size: 1.1rem;
            margin-bottom: 0;
          }
          .tr-metric-label {
            font-size: 0.52rem;
          }
        }

        /* Small phone */
        @media (max-width: 380px) {
          #benefits { padding: 32px 0 !important; }
          .ben-header { padding: 0 14px; }
          .timeline-wrap {
            max-width: 320px;
            padding-left: 14px;
            padding-right: 14px;
          }
          .timeline-spine { left: 20px; }
          .timeline-row { padding: 14px 0; }
          .tr-title { font-size: 0.85rem !important; }
          .tr-desc { font-size: 0.72rem !important; }
          .tr-metric { padding: 6px 10px; }
          .tr-metric-num { font-size: 1rem; }
          .tr-metric-label { font-size: 0.48rem; }
        }
      `}</style>
    </section>
  )
}
