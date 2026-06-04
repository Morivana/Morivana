import { useEffect, useState, lazy, Suspense } from 'react'
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
import HomepageFAQ from './components/HomepageFAQ'

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import CanvasErrorBoundary from './components/CanvasErrorBoundary'
import SEOHead from './components/SEOHead'

const ProductScene = lazy(() => import('./components/ProductScene'))

const SignInPage = lazy(() => import('./pages/SignInPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

// New multi-page routes
const AboutPage = lazy(() => import('./pages/AboutPage'))
const IngredientsHubPage = lazy(() => import('./pages/IngredientsHubPage'))
const IngredientDetailPage = lazy(() => import('./pages/IngredientDetailPage'))
const BenefitsPage = lazy(() => import('./pages/BenefitsPage'))
const HowToUsePage = lazy(() => import('./pages/HowToUsePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const SciencePage = lazy(() => import('./pages/SciencePage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const SustainabilityPage = lazy(() => import('./pages/SustainabilityPage'))
const LearnHubPage = lazy(() => import('./pages/LearnHubPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))



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
          <Suspense fallback={null}>
            {(loaderRevealing || loaderDone) && (
              <ProductScene heroMode={false} style={{ height: '100%', pointerEvents: 'none' }} />
            )}
          </Suspense>
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
          <Suspense fallback={null}>
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
          </Suspense>
        </ErrorBoundary>
      </RegionProvider>
    </ClerkProvider>
  )
}

export default App
