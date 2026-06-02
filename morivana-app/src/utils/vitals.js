/**
 * Core Web Vitals Reporter
 * Observes Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP),
 * and reports them to the backend server.
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return

  const logVital = (name, value) => {
    const apiBase = import.meta.env.VITE_API_URL ?? ''
    const payload = JSON.stringify({
      name,
      value: Math.round(value * 100) / 100, // round to 2 decimals
      path: window.location.pathname,
    })

    // Debug log
    console.log(`[Web Vitals] ${name}:`, value)

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${apiBase}/api/vitals`, new Blob([payload], { type: 'application/json' }))
    } else {
      fetch(`${apiBase}/api/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }

  try {
    // 1. Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          logVital('CLS', clsValue)
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // 2. Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      logVital('LCP', lastEntry.startTime)
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // 3. Interaction to Next Paint (INP) / First Input Delay (FID)
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        logVital('INP', entry.duration)
      }
    })
    inpObserver.observe({ type: 'first-input', buffered: true })
    inpObserver.observe({ type: 'event', buffered: true })
  } catch (e) {
    console.warn('[Web Vitals] observer initialization failed:', e)
  }
}
