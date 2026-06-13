// Register a default Trusted Types policy to prevent DOM-based XSS violations from third-party scripts.
if (typeof window !== 'undefined' && window.trustedTypes && window.trustedTypes.createPolicy) {
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: (string) => string,
      createScript: (string) => string,
      createScriptURL: (string) => string,
    })
  } catch (e) {
    console.warn('[TrustedTypes] default policy creation failed:', e)
  }
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import App from './App.jsx'
import './styles/globals.css'
import './index.css'
import { validateEnv } from './utils/env'
import { initWebVitals } from './utils/vitals'

// Validate environment variables
validateEnv()

// Initialize Core Web Vitals observer
initWebVitals()

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch((err) => console.error('ServiceWorker registration failed:', err))
  })
}

// Register GSAP plugins ONCE globally - never in individual components
gsap.registerPlugin(ScrollTrigger)

import { CountryProvider } from './context/CountryContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CountryProvider>
          <App />
        </CountryProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)

