import { useEffect, useState } from 'react'

const CRITICAL_IMAGES = [
  '/morivana-sip.jpeg',
  '/Moringa%20Leaves%20Overhead.png',
  '/morivana-scoop.png',
  '/morivana-jar.jpeg',
  '/Morning%20Light%20.png',
  '/morivana-ingredients.png',
  '/morivana-powder.jpeg',
  '/packaging_highres.png',
]

const CRITICAL_MODELS = ['/models/highres.glb']

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

function preloadModel(src) {
  return fetch(src, { cache: 'force-cache' })
    .then((r) => r.blob())
    .catch(() => null)
}

export function useAssetPreloader() {
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    const tasks = [
      ...CRITICAL_IMAGES.map(preloadImage),
      ...CRITICAL_MODELS.map(preloadModel),
      document.fonts?.ready ?? Promise.resolve(),
    ]
    const total = tasks.length
    let done = 0

    tasks.forEach((p) => {
      p.then(() => {
        if (cancelled) return
        done += 1
        setProgress(Math.round((done / total) * 100))
        if (done === total) setReady(true)
      })
    })

    const fallback = setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 6000)

    return () => {
      cancelled = true
      clearTimeout(fallback)
    }
  }, [])

  return { ready, progress }
}
