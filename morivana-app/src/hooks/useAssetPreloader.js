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

const CRITICAL_MODELS = ['/models/morivana_pouch_fixed_draco.glb']

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
    
    const imagePromises = CRITICAL_IMAGES.map((src) => 
      preloadImage(src).then(() => {
        if (!cancelled) updateProgress()
      })
    )

    const modelPromises = CRITICAL_MODELS.map((src) => 
      preloadModel(src).then(() => {
        if (!cancelled) updateProgress()
      })
    )

    const fontPromise = (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) updateProgress()
    })

    const tasks = [...imagePromises, ...modelPromises, fontPromise]
    const total = tasks.length
    let done = 0

    function updateProgress() {
      done += 1
      setProgress(Math.round((done / total) * 100))
    }

    // Parallel preload using Promise.all
    Promise.all(tasks).then(() => {
      if (!cancelled) {
        setProgress(100)
        setReady(true)
      }
    })

    const fallback = setTimeout(() => {
      if (!cancelled) {
        setProgress(100)
        setReady(true)
      }
    }, 6000)

    return () => {
      cancelled = true
      clearTimeout(fallback)
    }
  }, [])

  return { ready, progress }
}

