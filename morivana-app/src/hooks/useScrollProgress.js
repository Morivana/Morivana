import { useState, useEffect } from 'react'

/**
 * Returns a 0–1 scroll progress value for a given element ref.
 * Uses IntersectionObserver + scroll events for performance.
 */
export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const handleScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const winH = window.innerHeight
      const total = rect.height + winH
      const traveled = winH - rect.top
      setProgress(Math.min(1, Math.max(0, traveled / total)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref])

  return progress
}
