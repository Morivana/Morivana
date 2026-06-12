import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { animate, createTimeline, utils } from 'animejs'

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
useGLTF.preload('/models/morivana_pouch_fixed_draco.glb', '/draco/')

function PouchModel({ isMobile, isHighPerf }) {
  const { scene } = useGLTF('/models/morivana_pouch_fixed_draco.glb', '/draco/')
  const outerRef = useRef()   // position + scale (set by master scroll timeline)
  const innerRef = useRef()   // rotation (idle spin + scroll-driven rotation)
  const lifeRef  = useRef()   // empty group between inner + mesh - drives "alive" micro-motion
  const matRefs  = useRef([]) // emissive materials, captured for shimmer pulse

  // Anime.js drives these proxy values continuously; useFrame reads them every
  // tick and ADDS them on top of GSAP's scroll-driven rotation/scale. Keeping the
  // two systems on separate accumulators means neither overwrites the other.
  const life = useRef({
    bobY:   0,    // vertical breathing translate (m)
    swayX:  0,    // gentle horizontal sway (m)
    tiltX:  0,    // pitch wobble (rad)
    tiltZ:  0,    // roll wobble (rad)
    yawDrift: 0,  // slow heading drift (rad), independent of scroll spin
    breathe: 1,   // breathing scale multiplier
    sheen:  0,    // 0..1, modulates emissive intensity for a "living surface"
  }).current

  // Per-frame application of the Anime-driven proxy.
  useFrame(() => {
    if (!innerRef.current || !lifeRef.current || !outerRef.current) return

    // Bob + sway sit on the LIFE group so they layer cleanly above the scroll
    // timeline's outer position. (Outer = scroll-controlled, Life = idle.)
    lifeRef.current.position.y = life.bobY
    lifeRef.current.position.x = life.swayX
    lifeRef.current.rotation.x = life.tiltX
    lifeRef.current.rotation.z = life.tiltZ
    lifeRef.current.rotation.y = life.yawDrift
    lifeRef.current.scale.setScalar(life.breathe)

    // Sheen pulse on every captured emissive material.
    for (let i = 0; i < matRefs.current.length; i++) {
      const m = matRefs.current[i]
      if (m && m.emissive) {
        // Combine with whatever the scroll trigger already set, capped soft.
        const base = m.userData.__baseEmissive ?? 0
        m.emissiveIntensity = Math.min(0.85, base + life.sheen * 0.18)
      }
    }
  })

  // Anime.js - idle life animations. Independent loops with different periods
  // and easings so the motion never syncs into a robotic cycle.
  // On mobile, we run fewer loops to save CPU/battery.
  useEffect(() => {
    // Wait one tick so refs are populated.
    if (!lifeRef.current) return

    // Capture emissive materials once.
    matRefs.current = []
    scene.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.userData.__baseEmissive = child.material.emissiveIntensity || 0
        matRefs.current.push(child.material)
      }
    })

    const animations = []

    // 1) Vertical "breathing" bob - like a slow inhale/exhale.
    animations.push(animate(life, {
      bobY:   [{ to: 0.06 }, { to: -0.04 }],
      duration: 3800,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    }))

    // Idle yaw drift removed pouch only rotates on scroll, not on its own.

    // 3) Breathing scale
    animations.push(animate(life, {
      breathe: [{ to: 1.015 }, { to: 0.992 }],
      duration: 4700,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    }))

    // High-perf only (desktop ≥1280px): extra micro-detail animations
    // (sway, tilts, sheen). Skipped on phone AND tablet to avoid 60fps
    // anime.js loops that were saturating mid-range hardware.
    if (isHighPerf) {
      animations.push(animate(life, {
        swayX: [{ to: 0.018 }, { to: -0.018 }],
        duration: 5200,
        ease: 'inOutQuad',
        loop: true,
        alternate: true,
        delay: 600,
      }))

      animations.push(animate(life, {
        tiltX: [{ to: 0.022 }, { to: -0.018 }],
        duration: 4400,
        ease: 'inOutSine',
        loop: true,
        alternate: true,
        delay: 200,
      }))

      animations.push(animate(life, {
        tiltZ: [{ to: -0.020 }, { to: 0.020 }],
        duration: 6100,
        ease: 'inOutQuad',
        loop: true,
        alternate: true,
        delay: 900,
      }))

      // Sheen pulse - slow shimmer
      animations.push(createTimeline({ loop: true })
        .add(life, { sheen: 1.0, duration: 1200, ease: 'outQuad' })
        .add(life, { sheen: 0.0, duration: 2600, ease: 'inOutSine' })
        .add(life, { sheen: 0.0, duration: 3400 }))
    }

    return () => {
      animations.forEach(a => a.pause())
      // Reset proxies so re-mounts start clean.
      utils.set(life, { bobY: 0, swayX: 0, tiltX: 0, tiltZ: 0, yawDrift: 0, breathe: 1, sheen: 0 })
    }
  }, [scene, life, isMobile, isHighPerf])

  // Master scroll timeline: hero -> story handoff
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!outerRef.current || !innerRef.current) return

    // Hero state: centered, below text, big
    // Mobile: 10% smaller and positioned higher (closer to countdown)
    const heroPos = isMobile ? [0, -1.05, 0] : [0, -1.6, 0]
    const heroScale = isMobile ? 0.68 : 0.95

    // Story state: right side, smaller
    const storyPosX = isMobile ? 0 : 1.6
    const storyPosY = isMobile ? 0.52 : 0.0
    const storyScale = isMobile ? 0.30 : 0.68

    outerRef.current.position.set(heroPos[0], heroPos[1], heroPos[2])
    outerRef.current.scale.setScalar(heroScale)
    innerRef.current.rotation.set(0, 0, 0)

    const triggers = []

    // Hand-off: as user scrolls past hero, spin & travel to bottom-right of viewport.
    // Direct value writes - `scrub: 1.2` already smooths progress, so layering
    // additional gsap.to() catch-up tweens both fights the scrub AND leaves the
    // pouch stuck at the initial pose on a mid-page refresh (the tweens only ran
    // when scroll moved). Direct writes evaluate immediately during refresh().
    triggers.push(ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress
        outerRef.current.position.x = heroPos[0] + (storyPosX - heroPos[0]) * p
        outerRef.current.position.y = heroPos[1] + (storyPosY - heroPos[1]) * p
        const s = heroScale + (storyScale - heroScale) * p
        outerRef.current.scale.setScalar(s)
        innerRef.current.rotation.y = p * Math.PI * 2
      },
    }))

    // WhatIsMorivana - gentle tilt
    triggers.push(ScrollTrigger.create({
      trigger: '#what-section',
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1.5,
      onUpdate: (self) => {
        if (!self.isActive) return
        innerRef.current.rotation.x = self.progress * 0.26
      },
    }))

    // Pouch X-position handoff: storyPosX -> 0 on enter, hold center across
    // Ingredients + Benefits.
    //
    // Why direct onUpdate instead of a gsap.timeline().fromTo() like before:
    // a scrubbed fromTo writes its `from` value (storyPosX) whenever the
    // playhead is at time=0, which happens on every ScrollTrigger.refresh()
    // including on initial load at scrollY=0. Even with `immediateRender:
    // false` that suppresses the write at *creation*, the first refresh tick
    // still clamps progress to 0 and renders the from-state so the pouch
    // flashed to the right (storyPosX) on initial reveal before the hero
    // trigger could overwrite it. Direct writes gated by `self.isActive`
    // never run at scroll=0, so the initial hero-state pose is preserved.
    triggers.push(ScrollTrigger.create({
      trigger: '#ingredients',
      endTrigger: '#benefits',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1.2,
      onUpdate: (self) => {
        // Outside the active range, the previous-section trigger (hero/whatis)
        // or the next-section state owns position.x. Don't overwrite it.
        if (!self.isActive) return
        const p = self.progress
        // Lerp storyPosX -> 0 in the first 15% of the span, then hold at 0.
        const enterEnd = 0.15
        if (p < enterEnd) {
          const t = p / enterEnd
          const eased = t * t * (3 - 2 * t) // smoothstep
          outerRef.current.position.x = storyPosX + (0 - storyPosX) * eased
        } else {
          outerRef.current.position.x = 0
        }
      },
    }))

    // Ingredients - rotation only (Y axis spin + small X tilt). Same
    // isActive guard as above: at scroll=0, these onUpdates would otherwise
    // fire with progress clamped to 0 and write a 2π Y-rotation + 0.26 X-tilt
    // over the hero pose, contributing to the initial glitch.
    triggers.push(ScrollTrigger.create({
      trigger: '#ingredients',
      start: 'top 70%',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        if (!self.isActive) return
        innerRef.current.rotation.y = Math.PI * 2 + self.progress * Math.PI
        innerRef.current.rotation.x = 0.26 * (1 - self.progress)
      },
    }))

    // Benefits - rotation + subtle emissive glow
    triggers.push(ScrollTrigger.create({
      trigger: '#benefits',
      start: 'top 70%',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        if (!self.isActive) return
        innerRef.current.rotation.y = Math.PI * 3 + self.progress * Math.PI
        scene.traverse((child) => {
          if (child.isMesh && child.material && child.material.emissive) {
            // Park the scroll-driven value in userData so the Anime.js sheen
            // loop can layer on top instead of overwriting it.
            child.userData.__baseEmissive = self.progress * 0.4
            child.material.emissive.setHex(0x4caf50)
            child.material.needsUpdate = true
          }
        })
      },
    }))

    // WhatIsMorivana tilt trigger above also benefits from the guard so it
    // doesn't write rotation.x=0 over the hero's initial pose at scrollY=0
    // (currently harmless because hero also has rotation.x=0, but keeps the
    // pattern consistent if hero's initial pose ever changes).

    // Helper: ramp every mesh material's opacity. The pouch model is GLTF, so
    // materials need `transparent: true` before they honor opacity. We capture
    // each material once on first call so the toggle stays cheap.
    const captured = new Set()
    const setPouchOpacity = (alpha) => {
      const a = Math.max(0, Math.min(1, alpha))
      scene.traverse((child) => {
        if (!child.isMesh || !child.material) return
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        for (const m of mats) {
          if (!captured.has(m)) {
            m.userData.__origOpacity = m.opacity ?? 1
            m.transparent = true
            captured.add(m)
          }
          m.opacity = (m.userData.__origOpacity ?? 1) * a
          // depthWrite false at full transparency so the mesh stops contributing
          // to the depth buffer (no contact shadow under an "invisible" pouch).
          m.depthWrite = a > 0.01
        }
        // Skip rendering entirely once fully invisible saves draw calls and
        // ensures ContactShadows below doesn't pick up a phantom outline.
        child.visible = a > 0.001
      })
    }

    // HowToUse (Morning Ritual): pouch remains fully opaque as it gets covered by the section.
    // Once the section's top is past the pouch (e.g. top of section is at 15% of viewport),
    // we set opacity to 0 to save GPU rendering resources.
    triggers.push(ScrollTrigger.create({
      trigger: '#how-to-use',
      start: 'top 15%',      // when the top of #how-to-use reaches 15% of viewport from top
      endTrigger: 'footer',
      end: 'bottom bottom',
      onToggle: (self) => {
        setPouchOpacity(self.isActive ? 0 : 1)
      },
    }))

    // Force ScrollTrigger to measure the current scroll position and fire each
    // trigger's onUpdate against it, so the pouch lands in the right place on a
    // mid-page refresh instead of staying frozen at heroPos until the user
    // touches the wheel. Wait for fonts (which can reflow page height) before
    // refreshing - otherwise the measurements would be wrong on slow loads.
    const initialSync = () => {
      ScrollTrigger.refresh()
      // Refresh schedules an update at the next tick; the scrub-smoothed values
      // will catch up over the next ~1.2s. That's fine - it looks like the
      // pouch is "settling into place" rather than teleporting.
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initialSync)
    } else {
      initialSync()
    }

    return () => triggers.forEach(t => t.kill())
  }, [scene, isMobile])

  return (
    <group ref={outerRef}>
      <group ref={innerRef}>
        <group ref={lifeRef}>
          <primitive object={scene} rotation={[0, Math.PI, 0]} />
        </group>
      </group>
    </group>
  )
}

function ModelLoader() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent',
      animation: 'skeleton-pulse 1.8s ease-in-out infinite',
    }}>
      <img
        src="/packaging_highres.webp"
        alt="Loading pouch..."
        style={{
          maxHeight: '75%',
          maxWidth: '85%',
          objectFit: 'contain',
          opacity: 0.35,
          filter: 'grayscale(1) brightness(0.9)',
        }}
      />
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.98); }
          50% { opacity: 0.65; transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}

// Three viewport tiers:
//   isMobile   width < 992. Layout switch: pouch shifts to top-center.
//   isHighPerf width >= 1280. Unlocks Environment HDRI, extra lights,
//                contact shadows, and idle micro-animations.
//   tablet (992..1279) sits in the middle: desktop layout but lighter
//   rendering (no HDRI, no contact shadows, no idle micro-loops). This is
//   what was driving the iPad lag the old code branched only on isMobile,
//   so iPad got the full desktop rendering load.
function getTier() {
  if (typeof window === 'undefined') return { isMobile: false, isHighPerf: true }
  const w = window.innerWidth
  return { isMobile: w < 992, isHighPerf: w >= 1280 }
}

export default function ProductScene({ style = {} }) {
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

  return (
    <div className="canvas-3d" style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <Suspense fallback={<ModelLoader />}>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 40 }}
          gl={{
            antialias: isHighPerf,
            alpha: true,
            powerPreference: isHighPerf ? 'high-performance' : 'low-power',
          }}
          dpr={isHighPerf ? [1, 2] : [1, 1.5]}
          performance={{ min: 0.5 }}
          style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow={isHighPerf} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#CDD883" />
          {isHighPerf && <pointLight position={[0, 3, 2]} intensity={0.5} color="#E9FEDC" />}
          {isHighPerf && <Environment preset="forest" />}
          <PouchModel isMobile={isMobile} isHighPerf={isHighPerf} />
          {isHighPerf && (
            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={0.4}
              scale={4}
              blur={2.5}
              far={4}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  )
}
