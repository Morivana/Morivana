import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import FloatingLeaves from './FloatingLeaves'

const steps = [
  { num: '01', title: 'ADD',   body: '1 scoop · 5 grams of cool-dried daily greens.',                  image: '/add.png', alt: 'Step 1: Add 1 scoop of Morivaná Super Greens Powder' },
  { num: '02', title: 'MIX',   body: 'With 200ml water, milk, or your morning smoothie.', highlighted: true, image: '/mix.png', alt: 'Step 2: Mix Morivaná Greens with water or smoothie' },
  { num: '03', title: 'DRINK', body: 'Start your day calm, clear, and quietly fueled.',                image: '/drink.png', alt: 'Step 3: Drink Morivaná and start your day energized' },
]

const mixOptions = [
  { id: 'Water',           label: 'WATER',            mixBody: 'With 200ml ice-cold water. Clean, crisp, refreshing.' },
  { id: 'Coconut Water',   label: 'COCONUT WATER',    mixBody: 'With 200ml chilled coconut water. Electrolyte-rich, naturally sweet.' },
  { id: 'Warm Milk',       label: 'WARM MILK',        mixBody: 'Stirred into 200ml warm oat or almond milk. Golden-hour cozy.' },
  { id: 'Morning Smoothie',label: 'MORNING SMOOTHIE', mixBody: 'Blended with banana, oats & 200ml plant milk. Breakfast in a glass.' },
]

// - Animated arrow (SVG path draw on scroll) -
function StepArrow({ delay = 0 }) {
  const pathRef = useRef()
  useEffect(() => {
    if (!pathRef.current) return
    const length = pathRef.current.getTotalLength?.() || 80
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.1,
      delay,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#how-to-use', start: 'top 55%' },
    })
  }, [delay])
  return (
    <svg className="rt-arrow" width="84" height="28" viewBox="0 0 84 28" aria-hidden="true">
      <path
        ref={pathRef}
        d="M2 14 H64 M54 6 L72 14 L54 22"
        stroke="var(--rt-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  )
}

// - Glass card with mouse-track 3D tilt -
function StepCard({ step, index, mixBody }) {
  const cardRef = useRef()
  const innerRef = useRef()

  const handleMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width   // 0..1
    const py = (e.clientY - r.top)  / r.height  // 0..1
    const rx = (0.5 - py) * 8   // -4..4 deg
    const ry = (px - 0.5) * 8
    gsap.to(innerRef.current, {
      rotateX: rx,
      rotateY: ry,
      duration: 0.35,
      ease: 'power2.out',
    })
  }
  const handleLeave = () => {
    gsap.to(innerRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
  }

  const isMix = step.title === 'MIX'
  const body  = isMix && mixBody ? mixBody : step.body

  return (
    <div
      ref={cardRef}
      className={`rt-card ${step.highlighted ? 'rt-card--active' : ''}`}
      style={{ perspective: '1200px' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div ref={innerRef} className="rt-card-inner">
        {step.image && (
          <div className="rt-step-media">
            <img src={step.image} alt={step.alt} loading="lazy" />
          </div>
        )}
        <div className="rt-step-label">STEP {step.num}</div>
        <div className="rt-step-title">{step.title}</div>
        <p className="rt-step-body">{body}</p>

        {/* Step progress indicator (fills on hover) */}
        <div className="rt-step-progress">
          <span style={{ ['--rt-i']: index }} />
        </div>
      </div>
    </div>
  )
}

export default function HowToUse() {
  const [activeMix, setActiveMix] = useState('Water')
  const activeMixBody = mixOptions.find(o => o.id === activeMix)?.mixBody

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Header: word-by-word reveal
      gsap.from('.rt-word', {
        y: 60, opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: '#how-to-use', start: 'top 70%' },
      })

      // Cards: spring-in from bottom, staggered
      gsap.from('.rt-card', {
        y: 80, opacity: 0,
        duration: 1.5,
        ease: 'back.out(1.2)',
        stagger: 0.25,
        scrollTrigger: { trigger: '.rt-cards', start: 'top 80%' },
      })

      // Pills
      gsap.from('.rt-pill', {
        y: 20, opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.rt-pills', start: 'top 85%' },
      })

      // Pro-tip
      gsap.from('.rt-protip', {
        y: 40, opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.rt-protip', start: 'top 90%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="how-to-use" className="surface-deep rt-section">
      <FloatingLeaves variant="dark" density="normal" />

      {/* Grain + botanical decoration */}
      <svg className="rt-grain" aria-hidden="true">
        <filter id="rtNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.78  0 0 0 0 0.85  0 0 0 0 0.42  0 0 0 0.12 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rtNoise)" />
      </svg>

      {/* Drifting orbs */}
      <div className="rt-orbs" aria-hidden="true">
        {[0,1,2,3,4,5].map(i => <span key={i} className={`rt-orb rt-orb--${i}`} />)}
      </div>

      <div className="rt-container">
        {/* Editorial header */}
        <div className="rt-header">
          <div className="rt-kicker rt-word">SIMPLE AS ONE · TWO · THREE</div>
          <h2 className="rt-headline">
            <span className="rt-word rt-headline-sans">MORNING RITUAL</span>
            <span className="rt-word rt-headline-serif">Your 30-second</span>
          </h2>
          <p className="rt-subhead rt-word">
            A measured pause before the day. Spoon, swirl, sip, then repeat tomorrow.
          </p>
        </div>

        {/* Cards row */}
        <div className="rt-cards">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <StepCard step={step} index={i} mixBody={activeMixBody} />
              {i < steps.length - 1 && <StepArrow delay={0.4 + i * 0.2} />}
            </React.Fragment>
          ))}
        </div>

        {/* Mix pills */}
        <div className="rt-pills-wrap">
          <div className="rt-pills-label rt-word">TRY IT WITH</div>
          <div className="rt-pills">
            {mixOptions.map(opt => (
              <button
                key={opt.id}
                className={`rt-pill ${activeMix === opt.id ? 'rt-pill--active' : ''}`}
                onClick={() => setActiveMix(opt.id)}
                type="button"
              >
                <span className="rt-pill-fill" />
                <span className="rt-pill-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pro tip */}
        <div className="rt-protip">
          <div className="rt-protip-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M12 2 L22 20 H2 Z" fill="var(--rt-gold)" />
            </svg>
          </div>
          <p>
            <strong>Pro tip.</strong> Best taken in the morning on an empty stomach for maximum nutrient absorption.
          </p>
        </div>
      </div>

      {/* Local styles - scoped via .rt- prefix */}
      <style>{`
        :root {
          --rt-bg:          #1c2f1c;
          --rt-bg-deep:     #142111;
          --rt-card-bg:     rgba(255,255,255,0.04);
          --rt-border:      rgba(180,210,100,0.18);
          --rt-border-hi:   rgba(200,225,120,0.55);
          --rt-heading:     #E9FEDC;
          --rt-body:        rgba(233,254,220,0.78);
          --rt-mute:        rgba(233,254,220,0.55);
          --rt-gold:        #CDD883;
          --rt-gold-dim:    rgba(205,216,131,0.45);
          --rt-glow:        rgba(143,188,90,0.30);
          --rt-pill-bg:     #3d5c1e;
        }

        .rt-section {
          padding: 96px 32px 112px;
          background: radial-gradient(ellipse at 20% 0%, #243a23 0%, var(--rt-bg) 45%, var(--rt-bg-deep) 100%);
          overflow: hidden;
          /* position + z-index come from the global .surface-deep rule, which
             lifts dark panels above the page-fixed leaves (z:1) and 3D canvas
             (z:2). isolation isolates the section's internal layers (grain,
             orbs, container) without leaking to page-level z stacking. */
          isolation: isolate;
        }
        .rt-grain {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.5;
          mix-blend-mode: overlay;
          z-index: 0;
        }

        /* Drifting orbs */
        .rt-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .rt-orb {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(205,216,131,0.85) 0%, rgba(205,216,131,0) 70%);
          filter: blur(0.4px);
          animation: rtFloat var(--rt-dur, 18s) ease-in-out infinite;
        }
        .rt-orb--0 { left:  8%; top: 18%; --rt-dur: 17s; }
        .rt-orb--1 { left: 22%; top: 72%; --rt-dur: 22s; width:6px; height:6px; }
        .rt-orb--2 { left: 48%; top: 30%; --rt-dur: 19s; width:10px; height:10px; }
        .rt-orb--3 { left: 65%; top: 80%; --rt-dur: 23s; }
        .rt-orb--4 { left: 80%; top: 22%; --rt-dur: 20s; width:6px; height:6px; }
        .rt-orb--5 { left: 92%; top: 60%; --rt-dur: 25s; width:9px; height:9px; }
        @keyframes rtFloat {
          0%,100% { transform: translate(0,0); opacity: 0.5; }
          50%     { transform: translate(-14px, -28px); opacity: 0.95; }
        }

        .rt-container {
          position: relative;
          z-index: 2;
          max-width: 1040px;
          margin: 0 auto;
        }

        /* Header */
        .rt-header { text-align: center; margin-bottom: 56px; }
        .rt-kicker {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.66rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--rt-gold);
          margin-bottom: 16px;
          display: inline-block;
        }
        .rt-headline {
          margin: 0;
          line-height: 0.95;
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: center;
        }
        .rt-headline-serif {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 500;
          font-size: clamp(26px, 3.4vw, 44px);
          color: var(--rt-heading);
          letter-spacing: -0.005em;
          font-optical-sizing: auto;
        }
        .rt-headline-sans {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(28px, 7vw, 86px);
          color: var(--rt-heading);
          letter-spacing: 0.01em;
          text-transform: uppercase;
          font-optical-sizing: auto;
        }
        .rt-subhead {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: 0.92rem;
          color: var(--rt-body);
          margin: 16px auto 0;
          max-width: 460px;
          line-height: 1.65;
        }

        /* Cards row */
        .rt-cards {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 14px;
          margin: 0 auto 64px;
          flex-wrap: nowrap;
        }
        .rt-card {
          flex: 1 1 0;
          max-width: 240px;
          min-width: 180px;
          cursor: default;
        }
        .rt-card-inner {
          position: relative;
          height: 100%;
          padding: 22px 20px 18px;
          background: var(--rt-card-bg);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border: 1px solid var(--rt-border);
          border-radius: 16px;
          transform-style: preserve-3d;
          transition: border-color 0.4s, box-shadow 0.4s, transform 0.4s;
          box-shadow: 0 6px 22px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .rt-card:hover .rt-card-inner {
          border-color: var(--rt-border-hi);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 0 0 1px var(--rt-border-hi),
            inset 0 0 40px var(--rt-glow);
          transform: scale(1.03);
        }
        .rt-card--active .rt-card-inner {
          border-color: var(--rt-gold);
          animation: rtPulse 2.4s ease-in-out infinite;
        }
        @keyframes rtPulse {
          0%,100% { box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px var(--rt-gold-dim); }
          50%     { box-shadow: 0 14px 56px rgba(0,0,0,0.35), 0 0 0 2px var(--rt-gold), 0 0 36px rgba(205,216,131,0.25); }
        }

        .rt-step-media {
          aspect-ratio: 1 / 1;
          width: calc(100% + 40px);
          margin: -22px -20px 14px;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          display: block;
          transition: transform 0.5s cubic-bezier(.2,.7,.2,1);
        }
        .rt-step-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(.2,.7,.2,1);
        }
        .rt-card:hover .rt-step-media img { transform: scale(1.04); }

        .rt-step-label {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          color: var(--rt-gold);
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .rt-step-title {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: clamp(26px, 2.6vw, 34px);
          color: var(--rt-heading);
          letter-spacing: -0.01em;
          line-height: 1;
          margin-bottom: 10px;
          font-optical-sizing: auto;
        }
        .rt-step-body {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--rt-body);
          line-height: 1.65;
          margin: 0 0 16px;
          min-height: 3.2em;
        }

        .rt-step-progress {
          height: 2px;
          background: rgba(233,254,220,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .rt-step-progress span {
          display: block;
          height: 100%;
          width: calc((var(--rt-i, 0) + 1) * 33.333%);
          background: linear-gradient(90deg, transparent, var(--rt-gold));
          transition: width 0.6s cubic-bezier(.2,.7,.2,1);
        }
        .rt-card:hover .rt-step-progress span { width: 100%; }

        /* Arrow */
        .rt-arrow { align-self: center; flex-shrink: 0; }

        /* Pills */
        .rt-pills-wrap { text-align: center; margin-bottom: 56px; }
        .rt-pills-label {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.64rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--rt-gold-dim);
          margin-bottom: 14px;
          display: inline-block;
        }
        .rt-pills {
          display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;
        }
        .rt-pill {
          position: relative;
          isolation: isolate;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rt-heading);
          background: transparent;
          border: 1.5px solid var(--rt-border);
          border-radius: 999px;
          padding: 7px 16px;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.35s, border-color 0.35s, transform 0.25s;
        }
        .rt-pill-fill {
          position: absolute;
          inset: 0;
          background: var(--rt-pill-bg);
          transform: translateX(-101%);
          transition: transform 0.5s cubic-bezier(.2,.7,.2,1);
          z-index: -1;
        }
        .rt-pill:hover { border-color: var(--rt-border-hi); transform: translateY(-1px); }
        .rt-pill:hover .rt-pill-fill { transform: translateX(0); }
        .rt-pill--active {
          color: var(--rt-bg);
          border-color: var(--rt-gold);
          background: var(--rt-gold);
        }
        .rt-pill--active .rt-pill-fill { transform: translateX(0); background: var(--rt-gold); }

        /* Pro tip */
        .rt-protip {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 520px;
          margin: 0 auto;
          padding: 14px 18px;
          background: var(--rt-card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--rt-border);
          border-radius: 12px;
          text-align: left;
        }
        .rt-protip-icon {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(205,216,131,0.10);
          border: 1px solid var(--rt-border);
          flex-shrink: 0;
          animation: rtHeartbeat 1.8s ease-in-out infinite;
        }
        @keyframes rtHeartbeat {
          0%,100% { transform: scale(1); }
          12%     { transform: scale(1.12); }
          24%     { transform: scale(1); }
          36%     { transform: scale(1.08); }
          48%     { transform: scale(1); }
        }
        .rt-protip p {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--rt-body);
          line-height: 1.6;
          margin: 0;
        }
        .rt-protip strong {
          color: var(--rt-gold);
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin-right: 4px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .rt-cards { gap: 12px; }
          .rt-arrow { display: none; }
        }
        @media (max-width: 768px) {
          .rt-section { padding: 80px 18px 96px; }
          .rt-cards {
            flex-direction: column;
            align-items: stretch;
            gap: 32px;
          }
          .rt-card { max-width: none; min-width: 0; }
          .rt-header { margin-bottom: 40px; }
          .rt-pills-wrap { margin-bottom: 40px; }
          .rt-protip { padding: 12px 14px; gap: 10px; }
          .rt-protip p { font-size: 0.78rem; }
          /* vertical dotted connector between stacked cards */
          .rt-card:not(:last-child) .rt-card-inner::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -28px;
            width: 0;
            height: 24px;
            border-left: 2px dotted var(--rt-gold-dim);
            transform: translateX(-50%);
          }
        }
        @media (max-width: 480px) {
          .rt-section { padding: 60px 14px 80px; }
          .rt-cards { gap: 24px; }
          .rt-card-inner { padding: 18px 16px 14px; }
          .rt-step-media { width: calc(100% + 32px); margin: -18px -16px 12px; }
          .rt-pill { padding: 6px 12px; font-size: 0.62rem; letter-spacing: 0.10em; }
          .rt-pills { gap: 6px; }
        }
        @media (max-width: 360px) {
          .rt-pill { font-size: 0.58rem; padding: 6px 10px; }
        }
        /* old container width tighter on large tablet */
        @media (min-width: 769px) and (max-width: 1024px) {
          .rt-container { max-width: 720px; }
        }
      `}</style>
    </section>
  )
}
