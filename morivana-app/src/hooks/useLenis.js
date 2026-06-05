import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      autoRaf: false,         // false because GSAP ticker drives it
      anchors: true,          // native anchor scroll support
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const rafCallback = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCallback)
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
