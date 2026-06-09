import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { animate, utils } from 'animejs'
import LeafSprig from './ui/LeafSprig'

// Per-section floating-leaves layer.
//
// Why per-section (instead of one root-level fixed layer)?
//   Once a section establishes its own stacking context (which dark panels
//   like HowToUse, WaitlistCTA, Footer do, via z-index or `isolation`), its
//   descendants can never visually rise above a page-fixed sibling layer.
//   That trapped any single global leaves layer either ABOVE section content
//   (covering text) or BEHIND the entire panel (invisible).
//
//   Embedding the leaves INSIDE each section sidesteps the problem entirely:
//   within the section's own context the stack is bg < leaves < content,
//   regardless of what page-level z-index the section sits at.
//
// API:
//   <FloatingLeaves
//     variant="light" | "dark"     // colour palette tuned to bg
//     density="sparse" | "normal" | "dense"
//     count={number}               // override density entirely
//   />

const PRESETS = {
  sparse: [
    { top: '8%',  left: '4%',  size: 100, rotate: -22, opacity: 0.08 },
    { top: '72%', right: '6%', size: 85,  rotate: 18,  opacity: 0.07 },
    { top: '40%', left: '88%', size: 65,  rotate: -10, opacity: 0.06 },
  ],
  normal: [
    { top: '6%',  left: '3%',  size: 110, rotate: -22, opacity: 0.09 },
    { top: '14%', right: '5%', size: 80,  rotate: 28,  opacity: 0.08 },
    { top: '38%', left: '6%',  size: 70,  rotate: 15,  opacity: 0.07 },
    { top: '52%', right: '8%', size: 60,  rotate: -30, opacity: 0.06 },
    { top: '74%', left: '10%', size: 95,  rotate: -10, opacity: 0.08 },
    { top: '82%', right: '4%', size: 120, rotate: 18,  opacity: 0.09 },
  ],
  dense: [
    { top: '5%',  left: '3%',  size: 120, rotate: -22, opacity: 0.10 },
    { top: '12%', right: '4%', size: 90,  rotate: 28,  opacity: 0.08 },
    { top: '28%', left: '7%',  size: 75,  rotate: 15,  opacity: 0.07 },
    { top: '34%', right: '10%',size: 65,  rotate: -30, opacity: 0.06 },
    { top: '50%', left: '12%', size: 55,  rotate: 40,  opacity: 0.06 },
    { top: '58%', right: '14%',size: 75,  rotate: 8,   opacity: 0.07 },
    { top: '74%', left: '5%',  size: 100, rotate: -10, opacity: 0.08 },
    { top: '82%', right: '3%', size: 130, rotate: 18,  opacity: 0.10 },
  ],
}

const PALETTES = {
  light: { leafFill: 'var(--surface-mint)', stroke: 'var(--surface-deep)' },
  dark:  { leafFill: 'rgba(205,216,131,0.85)', stroke: '#0E2701' },
}

function getTier() {
  if (typeof window === 'undefined') return { isMobile: false, isHighPerf: true }
  const w = window.innerWidth
  return { isMobile: w < 992, isHighPerf: w >= 1280 }
}

export default function FloatingLeaves({
  variant = 'light',
  density = 'normal',
  count,
}) {
  const rootRef = useRef()
  const [tier, setTier] = useState(getTier)
  const { isMobile, isHighPerf } = tier

  useEffect(() => {
    let raf = 0
    const handleResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setTier(getTier()))
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Cap counts aggressively below desktop. Each leaf is its own animated
  // layer + (on desktop) two anime.js loops; running too many simultaneously
  // is what was driving the mid-range / iPad jank.
  const maxLeaves = isMobile ? 2 : isHighPerf ? Infinity : 4
  const baseLeaves = count
    ? PRESETS.dense.slice(0, count)
    : PRESETS[density] || PRESETS.normal
  const leaves = baseLeaves.slice(0, maxLeaves)

  const palette = PALETTES[variant] || PALETTES.light

  // GSAP scroll-driven drift (cheap transforms tied to the parent section's
  // visibility) + Anime.js continuous idle motion. The Anime.js loops are
  // paused whenever the leaves container is offscreen via IntersectionObserver
  // without that, 5+ instances of this component kept dozens of loops
  // running every frame across the whole page.
  useEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.fl-leaf', rootRef.current)

      // Fade-in on mount
      gsap.from(items, {
        opacity: 0,
        scale: 0.7,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.08,
      })

      // Scroll-driven drift each leaf travels a unique distance as its
      // parent section scrolls across the viewport. Trigger is the leaves'
      // direct parent, so the drift only runs while the section is visible.
      items.forEach((el, i) => {
        const travelY = 60 + (i * 23) % 180
        const travelX = (i % 2 === 0 ? 1 : -1) * (20 + (i * 13) % 60)
        gsap.fromTo(el,
          { y: 0, x: 0 },
          {
            y: travelY,
            x: travelX,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end:   'bottom top',
              scrub: 1.4,
            },
          }
        )
      })
    }, rootRef)

    // Anime.js idle life animations. Each leaf gets its own loop with a
    // unique period so they never fall into a robotic sync.
    // High-perf only gets the extra scale + opacity loops. Phone & tablet
    // get rotation only.
    const animations = []
    const inners = rootRef.current.querySelectorAll('.fl-inner')
    inners.forEach((el, i) => {
      animations.push(animate(el, {
        rotate: [
          { to: `${(i % 2 === 0 ? -1 : 1) * (4 + (i % 3) * 1.5)}deg` },
          { to: `${(i % 2 === 0 ? 1 : -1) * (4 + (i % 3) * 1.5)}deg` },
        ],
        duration: 5000 + (i * 730) % 4000,
        ease: 'inOutSine',
        loop: true,
        alternate: true,
        delay: i * 180,
      }))

      if (isHighPerf) {
        animations.push(animate(el, {
          scale: [{ to: 1.06 }, { to: 0.96 }],
          duration: 4200 + (i * 510) % 3500,
          ease: 'inOutQuad',
          loop: true,
          alternate: true,
          delay: 200 + i * 140,
        }))

        animations.push(animate(el, {
          opacity: [{ to: 1 }, { to: 0.55 }],
          duration: 6000 + (i * 410) % 3000,
          ease: 'inOutSine',
          loop: true,
          alternate: true,
          delay: 400 + i * 220,
        }))
      }
    })

    // IntersectionObserver pauses every anime.js loop the moment the
    // container scrolls out of view, and resumes when it comes back. With
    // 5+ instances of this component across the page, this prevents the
    // off-screen sections from holding ~30+ loops on the main thread at
    // once the biggest single source of pre-fix lag on iPad-class GPUs.
    let isVisible = true
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const nowVisible = e.isIntersecting
          if (nowVisible === isVisible) continue
          isVisible = nowVisible
          animations.forEach(a => {
            if (nowVisible) a.play?.()
            else a.pause?.()
          })
        }
      },
      { rootMargin: '120px' }
    )
    io.observe(rootRef.current)

    return () => {
      io.disconnect()
      ctx.revert()
      animations.forEach(a => a.pause())
      inners.forEach(el => utils.set(el, { rotate: 0, scale: 1, opacity: 1 }))
    }
  }, [variant, density, count, isMobile, isHighPerf])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="floating-leaves"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // Lowest stacking level inside the section. Real foreground content
        // sits at z-index 1+ via the .section-content helper class (see
        // globals.css). Per-component decoration like the WaitlistCTA collage
        // also lives at z-index 0 leaves and the collage are peers in the
        // background plane and paint in DOM order, with the collage rendered
        // first so leaves drift above it.
        zIndex: 0,
      }}
    >
      {leaves.map((l, i) => (
        <div
          key={i}
          className="fl-leaf"
          style={{
            position: 'absolute',
            top: l.top,
            left: l.left,
            right: l.right,
            // will-change only on high-perf promoting every leaf to its
            // own GPU layer was costing iPad more than it saved.
            willChange: isHighPerf ? 'transform' : 'auto',
          }}
        >
          <div
            className="fl-inner"
            style={{
              transform: `rotate(${l.rotate}deg)`,
              willChange: isHighPerf ? 'transform, opacity' : 'auto',
            }}
          >
            <LeafSprig
              size={l.size}
              leafFill={palette.leafFill}
              stroke={palette.stroke}
              strokeWidth={10}
              opacity={l.opacity}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
