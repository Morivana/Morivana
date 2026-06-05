# MORIVANA — STACK UPGRADE PROMPT
### Stability · Performance · Security · Production Ready
---

## ROLE

You are a senior full-stack engineer performing a **safe, zero-downtime dependency upgrade**
on the Morivana project — a React + Vite + Three.js + Express e-commerce site.
Your job is to upgrade every package to its latest stable version, fix all breaking changes,
and add missing security middleware. The site must work identically after the upgrade.
Do NOT change any UI, content, routing logic, or business logic. Only upgrade the stack.

---

## GROUND RULES

```
✅ Upgrade packages exactly as specified — no newer alphas or betas
✅ Fix every breaking change that results from the upgrade
✅ Add the 4 new security packages listed below
✅ Run the build and confirm zero errors before declaring done
✅ Test every route still renders after routing/React upgrade
❌ Do NOT touch src/pages/, src/components/, or any content files
❌ Do NOT change pricing, SEO metadata, or schema markup
❌ Do NOT upgrade to a version not listed in this prompt
❌ Do NOT skip a breaking change and leave a console error
```

---

## STEP 1 — UNINSTALL DEPRECATED PACKAGES

Run these first. These packages have been renamed or replaced.

```bash
npm uninstall @studio-freight/lenis
npm uninstall @studio-freight/react-lenis
```

**Why:** `@studio-freight/lenis` was deprecated when Studio Freight became
Darkroom Engineering. The replacement is the `lenis` package (new name, same API).
All imports using `@studio-freight/lenis` or `@studio-freight/react-lenis` must be
updated to `lenis` and `lenis/react`.

---

## STEP 2 — INSTALL ALL UPGRADES

Run this single command:

```bash
npm install \
  react@19 \
  react-dom@19 \
  three@latest \
  @react-three/fiber@9 \
  @react-three/drei@latest \
  gsap@latest \
  lenis@latest \
  @clerk/react@latest \
  tailwindcss@4 \
  @tailwindcss/vite@latest \
  react-hook-form@latest \
  axios@latest \
  vite@latest \
  eslint@9 \
  eslint-plugin-react@latest \
  eslint-plugin-react-hooks@latest \
  react-router-dom@latest
```

Then install the 4 new security packages:

```bash
npm install helmet express-rate-limit express-mongo-sanitize zod
```

---

## STEP 3 — FIX BREAKING CHANGES (do in exact order)

---

### 3A — LENIS: Fix package rename + import paths

**Old import (delete everywhere it appears):**
```js
import Lenis from '@studio-freight/lenis'
import { ReactLenis } from '@studio-freight/react-lenis'
```

**New import (replace with):**
```js
import Lenis from 'lenis'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
```

**Fix Lenis config** — remove deprecated `smoothTouch` option, add new options:

```js
// OLD — breaks on lenis 1.3.x
const lenis = new Lenis({
  duration: 1.2,
  smoothTouch: true,   // ← REMOVE, deprecated
  smooth: true,        // ← REMOVE, deprecated
})

// NEW — correct for lenis 1.3.x
const lenis = new Lenis({
  duration: 1.2,
  autoRaf: false,         // false because GSAP ticker drives it
  anchors: true,          // native anchor scroll support
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
})
```

**GSAP + Lenis integration** — update ticker setup:

```js
// Correct GSAP + Lenis sync for lenis 1.3.x + GSAP 3.15
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
```

**React component** — update ReactLenis wrapper:

```jsx
// NEW correct usage
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

export default function SmoothScrollProvider({ children }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        anchors: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

---

### 3B — REACT 19: Fix breaking API changes

**1. Remove deprecated string refs (if any exist):**
```jsx
// OLD — removed in React 19
<input ref="myInput" />

// NEW
const inputRef = useRef(null)
<input ref={inputRef} />
```

**2. Replace ReactDOM.render with createRoot (if not already done):**
```jsx
// OLD — removed in React 19
import ReactDOM from 'react-dom'
ReactDOM.render(<App />, document.getElementById('root'))

// NEW — already correct in Vite scaffold, verify it looks like this:
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**3. Update `forwardRef` usage (React 19 change):**
```jsx
// OLD
const MyInput = forwardRef((props, ref) => <input {...props} ref={ref} />)

// NEW — ref is now a regular prop in React 19
function MyInput({ ref, ...props }) {
  return <input {...props} ref={ref} />
}
```

**4. Remove `defaultProps` from function components (React 19 removes support):**
```jsx
// OLD — throws warning in React 19
function Button({ label }) { return <button>{label}</button> }
Button.defaultProps = { label: 'Click me' }

// NEW — use default parameters
function Button({ label = 'Click me' }) {
  return <button>{label}</button>
}
```

**5. React 19 Compiler — add to vite.config.js:**
```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'], // enables auto-memoization
      },
    }),
  ],
})
```

Install the compiler plugin:
```bash
npm install -D babel-plugin-react-compiler
```

---

### 3C — R3F v9: Fix React Three Fiber breaking changes

**R3F v9 requires React 19 and Three.js r170+. If both are installed, most things
work but check these specific breaking changes:**

**1. `extend` is no longer needed for built-in Three.js objects:**
```jsx
// OLD — R3F v8 required extend for some objects
import { extend } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

// NEW — R3F v9: use Drei's OrbitControls directly
import { OrbitControls } from '@react-three/drei'
```

**2. `useFrame` cleanup — R3F v9 strict about deps:**
```jsx
// Verify all useFrame callbacks are correctly structured
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta * 0.5
})
// No changes needed here — same API, just ensure meshRef.current exists
```

**3. Canvas props update:**
```jsx
// OLD R3F v8
<Canvas frameloop="demand" dpr={[1, 2]} />

// NEW R3F v9 — same props, add performance hint for mobile
<Canvas
  frameloop="demand"
  dpr={[1, 2]}
  performance={{ min: 0.5 }}   // auto-lower DPR on low-fps devices
  gl={{ antialias: false }}     // disable on mobile for perf
/>
```

**4. GLB/GLTF loading with Draco (updated path in Drei v9.116+):**
```jsx
// OLD
useGLTF.preload('/model.glb')

// NEW — add Draco decoder for smaller GLB files (major perf win)
import { useGLTF } from '@react-three/drei'
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
useGLTF.preload('/model.glb')
```

---

### 3D — GSAP 3.15: Fix deprecated APIs

**1. Replace `yoyoEase` with new `easeReverse`:**
```js
// OLD — yoyoEase deprecated in 3.15
gsap.to('.element', {
  yPercent: -100,
  yoyoEase: 'power2.in'  // ← deprecated
})

// NEW
gsap.to('.element', {
  yPercent: -100,
  easeReverse: 'power2.in'  // ← new in 3.15
})
```

**2. GSAP is now on public npm — remove private registry config:**

Delete or update `.npmrc` if it has the old GreenSock private registry:
```
# DELETE these lines from .npmrc if present:
@gsap:registry=https://npm.greensock.com
//npm.greensock.com/:_authToken=...
```

GSAP 3.13+ installs directly from public npm. No token needed.

**3. Update SplitText usage (rewritten in 3.13 — now free):**
```js
// NEW SplitText — remove position:"absolute" (removed)
const split = new SplitText('.heading', {
  type: 'chars,words',
  // position: 'absolute'  ← REMOVE, deprecated and removed
})
```

---

### 3E — TAILWIND v4: Full migration

**This is the largest breaking change. Run the official codemod first:**

```bash
npx @tailwindcss/upgrade
```

This auto-handles 90% of the migration. Then manually fix the rest:

**1. Delete `tailwind.config.js` — replace with CSS config:**

```css
/* src/index.css — NEW Tailwind v4 entry point */
@import "tailwindcss";

@theme {
  /* Brand tokens — replaces theme.extend in config */
  --color-brand-green: #194102;
  --color-brand-cream: #F5F0E8;
  --color-brand-gold: #C9A84C;

  --font-family-sans: 'Inter', sans-serif;

  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

**2. Update `vite.config.js` — replace PostCSS plugin with Vite plugin:**

```js
// vite.config.js — NEW for Tailwind v4
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← NEW, replaces postcss

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),  // ← replaces postcss({ plugins: [tailwindcss()] })
  ],
})
```

**3. Delete `postcss.config.js`** — no longer needed when using @tailwindcss/vite.

**4. Fix dark mode** — v4 defaults to `@media (prefers-color-scheme: dark)`:

```css
/* If your site uses class-based dark mode (dark: prefix), add to index.css: */
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

**5. Class renames in v4 — global find & replace:**

| v3 class | v4 class |
|----------|----------|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `ring-offset-*` | `ring-offset-* (unchanged)` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-clone` | `box-decoration-clone` |
| `bg-opacity-*` | `bg-black/50` (use slash syntax) |
| `text-opacity-*` | `text-black/70` (use slash syntax) |

---

### 3F — VITE 8: Fix config breaking changes

**1. Update vite.config.js for Vite 8:**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
  ],
  build: {
    target: 'es2022',           // Vite 8 default — modern browsers
    sourcemap: false,           // disable in production for security
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'gsap-vendor': ['gsap'],
          'clerk-vendor': ['@clerk/react'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
})
```

**2. Update `@vitejs/plugin-react`:**

```bash
npm install -D @vitejs/plugin-react@latest
```

---

### 3G — CLERK v6: Fix auth integration

**Update Clerk provider and middleware:**

```jsx
// main.jsx — ClerkProvider unchanged API in v6
import { ClerkProvider } from '@clerk/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
)
```

**Enable Clerk security features in dashboard (manual steps):**
```
☐ Enable Bot Protection in Clerk Dashboard → Security
☐ Enable Rate Limiting on sign-in endpoint
☐ Enable Brute Force Protection
☐ Set session token expiry to 24h max
☐ Enable MFA for admin accounts
```

---

### 3H — ESLint 9: Fix flat config

**Delete `.eslintrc.cjs` or `.eslintrc.js` and replace with:**

```js
// eslint.config.js — NEW flat config format for ESLint 9
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',  // not needed in React 17+
      'react/prop-types': 'off',           // using TypeScript or not enforced
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]
```

Install flat config deps:
```bash
npm install -D @eslint/js globals eslint-plugin-react@latest eslint-plugin-react-hooks@latest
```

---

## STEP 4 — ADD SECURITY MIDDLEWARE TO EXPRESS SERVER

Open `server/index.js` (or wherever your Express app is initialized).
Add all 4 security packages in the exact order shown:

```js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { z } from 'zod'

dotenv.config()
const app = express()

// ─── 1. HELMET — HTTP Security Headers ─────────────────────────────────────
// Must be first middleware. Sets: CSP, HSTS, X-Frame-Options, XSS-Protection,
// X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com', 'https://checkout.razorpay.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://api.razorpay.com'],
      imgSrc: ["'self'", 'data:', 'https://www.morivana.com'],
      connectSrc: ["'self'", 'https://api.clerk.com', 'https://ipapi.co'],
    },
  },
  hsts: {
    maxAge: 31536000,        // 1 year
    includeSubDomains: true,
    preload: true,
  },
}))

// ─── 2. RATE LIMITING ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 req per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 5 attempts per window (auth routes)
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
})

const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                    // 10 checkout attempts per hour per IP
  message: { error: 'Too many checkout attempts. Please try again later.' },
})

app.use('/api/', globalLimiter)
app.use('/api/auth/', authLimiter)
app.use('/api/checkout/', checkoutLimiter)

// ─── 3. BODY PARSING ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))   // reject oversized payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ─── 4. MONGO SANITIZE — NoSQL Injection Protection ────────────────────────
// Must come AFTER body parsing. Strips $ and . from req.body/query/params.
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitizeError: (req, res) => {
    res.status(400).json({ error: 'Invalid characters in request.' })
  },
}))

// ─── 5. CORS ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://www.morivana.com', 'https://morivana.com']
    : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST'],           // only allow what you use
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── 6. ZOD VALIDATION — Validate all request bodies ───────────────────────
// Waitlist endpoint schema
const waitlistSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  email: z.string().email().max(100).toLowerCase(),
  country: z.enum(['India', 'Canada']),
  referral: z.enum(['Instagram', 'Friend', 'Google', 'Other']).optional(),
})

// Checkout endpoint schema
const checkoutSchema = z.object({
  sku: z.enum(['trial', 'full']),
  currency: z.enum(['INR', 'CAD']),
  quantity: z.number().int().min(1).max(10),
})

// Validate middleware factory
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      })
    }
    req.body = result.data  // use sanitized + parsed data
    next()
  }
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────
app.post('/api/waitlist', validate(waitlistSchema), async (req, res) => {
  // req.body is now validated and sanitized
  // Add your DB insert logic here
})

app.post('/api/checkout', validate(checkoutSchema), async (req, res) => {
  // req.body is now validated and sanitized
  // Add Razorpay/Stripe order creation here
})

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

---

## STEP 5 — UPDATE ENVIRONMENT VARIABLES

Ensure `.env` has these variables. Add any missing ones:

```env
# Vite frontend (.env in project root)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_RAZORPAY_KEY_ID=rzp_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_API_URL=https://api.morivana.com

# Express backend (.env in server/)
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ORIGIN=https://www.morivana.com
```

**Security rules for .env:**
```
☐ .env is in .gitignore — verify before every push
☐ Never log process.env in production
☐ Use different keys for dev and production
☐ Rotate all keys after any accidental git commit
```

---

## STEP 6 — VERIFY BUILD IS CLEAN

Run these commands in order. Fix any error before moving to next:

```bash
# 1. Lint — must be zero errors
npx eslint src/ --ext .js,.jsx

# 2. Build — must complete with no errors or warnings
npm run build

# 3. Preview build locally
npm run preview

# 4. Check bundle size — three-vendor should be largest chunk
# All other chunks should be under 500kb

# 5. Audit for remaining vulnerabilities
npm audit --audit-level=high
# If any high/critical: npm audit fix

# 6. Check outdated packages
npm outdated
```

---

## STEP 7 — POST-UPGRADE CHECKLIST

Verify every item before deploying to Cloudflare Pages:

```
☐ npm run build completes with zero errors
☐ All routes render correctly (/, /shop, /about, /waitlist, /compare, /ingredients/*)
☐ Lenis smooth scroll works on homepage hero
☐ Three.js 3D product model renders correctly
☐ GSAP scroll animations fire correctly
☐ Waitlist form submits and shows success state
☐ No console errors in browser dev tools
☐ Tailwind styles render correctly (run visual check on all pages)
☐ Dark mode works if implemented
☐ Mobile viewport correct (test at 375px, 390px, 430px widths)
☐ Lighthouse Performance ≥ 90
☐ Lighthouse Security ≥ 90
☐ npm audit shows 0 high or critical vulnerabilities
☐ Helmet headers visible in Network tab (X-Frame-Options, etc.)
☐ Rate limiting active on /api/waitlist (test with 6 rapid requests)
☐ .env is NOT committed to git
☐ Node.js version is 22.x on deployment environment
```

---

## QUICK REFERENCE — VERSION LOCK TABLE

| Package | Old | New | Type |
|---------|-----|-----|------|
| `react` + `react-dom` | 18.2.0 | 19.2.x | Major |
| `three` | 0.163.0 | 0.184.0 | Major |
| `@react-three/fiber` | 8.16.8 | 9.6.1 | Major |
| `@react-three/drei` | 9.105.6 | 9.122.x | Minor |
| `gsap` | 3.12.5 | 3.15.0 | Minor |
| `lenis` (renamed) | @studio-freight 1.0.42 | 1.3.23 | Rename + Minor |
| `tailwindcss` | 3.4.3 | 4.2.x | Major |
| `vite` | 5.1.0 | 8.0.14 | Major |
| `@clerk/react` | 5.61.8 | 6.x | Major |
| `react-router-dom` | 7.16.0 | 7.x latest | Patch |
| `react-hook-form` | 7.51.3 | 7.54.x | Patch |
| `axios` | 1.6.8 | 1.9.x | Patch (security) |
| `eslint` | 8.56.0 | 9.x | Major |
| `Node.js` (runtime) | — | 22.x LTS | Critical |
| `helmet` | — | 8.x (new) | New |
| `express-rate-limit` | — | 7.x (new) | New |
| `express-mongo-sanitize` | — | 2.x (new) | New |
| `zod` | — | 3.x (new) | New |

---

*Prompt version: 1.0 · Project: Morivana · Date: June 2026*
*Do not upgrade beyond the versions listed — test in dev before pushing to Cloudflare Pages.*
