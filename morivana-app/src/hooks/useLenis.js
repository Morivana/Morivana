import Lenis from '@studio-freight/lenis'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
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
