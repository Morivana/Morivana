import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { RegionProvider } from './context/RegionContext'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLenis } from './hooks/useLenis'
import Loader from './components/Loader'

// Register GSAP plugins once at the app root so every component that uses
// ScrollTrigger does not need to repeat the call.
gsap.registerPlugin(ScrollTrigger)
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhatIsMorivana from './components/WhatIsMorivana'
import Ingredients from './components/Ingredients'
import Benefits from './components/Benefits'
import HowToUse from './components/HowToUse'
import WaitlistCTA from './components/WaitlistCTA'
import Footer from './components/Footer'
import ProductScene from './components/ProductScene'
import HomepageFAQ from './components/HomepageFAQ'

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AccountPage from './pages/AccountPage'
import OrdersPage from './pages/OrdersPage'
import CheckoutPage from './pages/CheckoutPage'
import ErrorBoundary from './components/ErrorBoundary'
import CanvasErrorBoundary from './components/CanvasErrorBoundary'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'

// New multi-page routes
import AboutPage from './pages/AboutPage'
import IngredientsHubPage from './pages/IngredientsHubPage'
import IngredientDetailPage from './pages/IngredientDetailPage'
import BenefitsPage from './pages/BenefitsPage'
import HowToUsePage from './pages/HowToUsePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SciencePage from './pages/SciencePage'
import ComparePage from './pages/ComparePage'
import SustainabilityPage from './pages/SustainabilityPage'
import LearnHubPage from './pages/LearnHubPage'
import BlogPostPage from './pages/BlogPostPage'
import WaitlistPage from './pages/WaitlistPage'
import NotFoundPage from './pages/NotFoundPage'
import SEOHead from './components/SEOHead'



// ─── Home page (existing scroll-story landing) ───────────────────────────────
function HomePage() {
  const lenisRef = useLenis()

  // Two-phase loader handoff:
  //   loaderRevealing — user submitted/skipped; hero starts its entrance NOW
  //                     while the loader is still fading out (no dead air).
  //   loaderDone      — loader fade finished, unmount it.
  const [loaderRevealing, setLoaderRevealing] = useState(false)
  const [loaderDone, setLoaderDone] = useState(() => {
    return !!sessionStorage.getItem('morivana_loader_done')
  })

  // Lock both native scroll AND Lenis while the loader is up. Lenis owns the
  // scroll loop, so without explicitly stopping it, wheel events accumulate
  // scroll delta behind the loader and snap the hero out of view on dismiss.
  useEffect(() => {
    if (loaderDone) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const lenis = lenisRef.current
    lenis?.stop?.()
    return () => {
      document.body.style.overflow = prev
    }
  }, [loaderDone, lenisRef])

  // At the moment the loader starts leaving, force scroll back to top so
  // anything that may have leaked through during the loader is reset, then
  // resume Lenis once the loader is fully gone.
  useEffect(() => {
    if (!loaderRevealing) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    lenisRef.current?.scrollTo?.(0, { immediate: true })
  }, [loaderRevealing, lenisRef])

  useEffect(() => {
    if (!loaderDone) return
    lenisRef.current?.start?.()

    // Handle hash scroll after loader is finished
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 350)
    }
  }, [loaderDone, lenisRef])

  useEffect(() => {
    // Refresh ScrollTrigger after fonts load for accurate positions
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="app-root">
      <SEOHead
        title="Morivaná | Daily Moringa Super Greens Powder for Energy"
        description="Daily scoop of Morivaná Super Greens Powder for your morning. Organic moringa, spirulina, vitamin C, lemon & monk fruit. Ships to India & Canada."
        canonical="/"
      />
      {!loaderDone && (
        <Loader
          onLeaveStart={() => setLoaderRevealing(true)}
          onDismiss={() => {
            sessionStorage.setItem('morivana_loader_done', 'true')
            setLoaderDone(true)
          }}
        />
      )}
      {/* Single fixed 3D canvas that lives across hero + story sections.
          The pouch position/scale/rotation inside is scroll-driven.
          Leaves are NOT a root-level layer anymore — each section embeds its
          own <FloatingLeaves /> so they always sit between section bg and
          section content regardless of page-level stacking. */}
      <div
        className="global-canvas-layer"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          // Above leaves (z 1) but below section content (z 3 via globals.css).
          zIndex: 2,
        }}
      >
        <CanvasErrorBoundary>
          <ProductScene heroMode={false} style={{ height: '100%', pointerEvents: 'none' }} />
        </CanvasErrorBoundary>
      </div>

      <main>
        <Hero
          key={loaderRevealing ? 'post-loader' : 'pre-loader'}
          revealKey={loaderRevealing ? 1 : 0}
          bigEntrance={loaderRevealing}
        />
        <div className="scroll-story-wrapper" style={{ position: 'relative' }}>
          <WhatIsMorivana />
          <Ingredients />
          <Benefits />
        </div>
        <HowToUse />
        <HomepageFAQ />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  )
}

// ─── App shell with routing ───────────────────────────────────────────────────
function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthOrAccountPage =
    location.pathname.startsWith('/sign-in') ||
    location.pathname.startsWith('/sign-up') ||
    location.pathname.startsWith('/account')

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env — add it before starting the dev server.')
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      afterSignOutUrl="/"
    >
      <RegionProvider>
        {/* Navbar persists across all routes except auth & account */}
        {!isAuthOrAccountPage && <Navbar />}

        <ErrorBoundary>
          <Routes>
            {/* Landing page — all existing scroll sections */}
            <Route path="/" element={<HomePage />} />

            {/* Auth pages */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* ── New multi-page routes ── */}
            <Route path="/about" element={<><AboutPage /><Footer /></>} />
            <Route path="/ingredients" element={<><IngredientsHubPage /><Footer /></>} />
            <Route path="/ingredients/:slug" element={<><IngredientDetailPage /><Footer /></>} />
            <Route path="/benefits" element={<><BenefitsPage /><Footer /></>} />
            <Route path="/how-to-use" element={<><HowToUsePage /><Footer /></>} />
            <Route path="/shop" element={<><ShopPage /><Footer /></>} />
            <Route path="/shop/daily-greens" element={<><ProductDetailPage /><Footer /></>} />
            <Route path="/science" element={<><SciencePage /><Footer /></>} />
            <Route path="/compare" element={<><ComparePage /><Footer /></>} />
            <Route path="/sustainability" element={<><SustainabilityPage /><Footer /></>} />
            <Route path="/learn" element={<><LearnHubPage /><Footer /></>} />
            <Route path="/learn/:slug" element={<><BlogPostPage /><Footer /></>} />
            <Route path="/waitlist" element={<><WaitlistPage /><Footer /></>} />

            {/* Static informational pages */}
            <Route path="/privacy-policy" element={<><PrivacyPolicyPage /><Footer /></>} />
            <Route path="/terms" element={<><TermsPage /><Footer /></>} />

            {/* Protected pages */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </RegionProvider>
    </ClerkProvider>
  )
}

export default App
