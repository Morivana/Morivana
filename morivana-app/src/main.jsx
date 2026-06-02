import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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
      .then((reg) => console.log('ServiceWorker registered:', reg.scope))
      .catch((err) => console.error('ServiceWorker registration failed:', err))
  })
}

// Register GSAP plugins ONCE globally - never in individual components
gsap.registerPlugin(ScrollTrigger)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

