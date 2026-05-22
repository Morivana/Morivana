# MORIVANA — Complete Development Prompt
### React + Three.js + GSAP ScrollTrigger · Launching Soon Website

---

## OVERVIEW

Build the **Morivana "Launching Soon" website** — a scroll-driven, story-telling single-page React application with a live 3D product model, GSAP-powered animations, and a waitlist email capture. This is a **pre-launch marketing site**, not an e-commerce store. The goal is to build hype, tell the brand story, and collect emails before the product goes live.

---

## EXACT TECH STACK (use these exact versions — no substitutions)

```
React                  18.2.0
Vite                   5.2.0          (build tool)
Three.js               0.163.0
@react-three/fiber     8.16.8
@react-three/drei      9.105.6
gsap                   3.12.5         (includes ScrollTrigger plugin)
@studio-freight/lenis  1.1.13         (smooth scroll)
tailwindcss            3.4.3
@tailwindcss/forms     0.5.7
react-hook-form        7.51.3         (email form)
axios                  1.6.8          (form submission)
```

**Font loading:** Google Fonts via `<link>` in `index.html`
- `Bebas Neue` — display/headlines
- `Barlow Condensed` — subheadings, labels, nav, buttons
- `Barlow` — body copy

---

## PROJECT STRUCTURE

```
morivana/
├── public/
│   └── models/
│       └── highres.glb          ← the 3D product model (user provides)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductScene.jsx      ← Three.js canvas wrapper
│   │   ├── WhatIsMorivana.jsx
│   │   ├── Ingredients.jsx
│   │   ├── Benefits.jsx
│   │   ├── HowToUse.jsx
│   │   ├── WaitlistCTA.jsx
│   │   ├── Footer.jsx
│   │   └── ui/
│   │       ├── CountdownTimer.jsx
│   │       └── FloatingParticles.jsx
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   └── useLenis.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## DESIGN SYSTEM

Carry over the exact design language from the existing `morivana-landing.html`:

```css
--green-dark:   #1a3a1a    /* primary background */
--green-mid:    #2d6b2d
--green-bright: #4caf50
--green-light:  #8bc34a
--citrus:       #c8e630    /* primary accent — headlines, CTAs */
--citrus-dim:   #a8c020    /* borders, secondary accents */
--cream:        #f5f0dc    /* body text */
--warm-white:   #faf8f0
--orange:       #e87c20
--yellow:       #f5c842
--pink-accent:  #e8507a
--dark:         #0d1f0d    /* darkest bg sections */
```

**Typography rules (exact from existing design):**
- All section headlines: `Bebas Neue`, large, `line-height: 0.85–0.9`, citrus color
- Labels/kickers: `Barlow Condensed`, 700 weight, `letter-spacing: 0.3em`, uppercase
- Nav pills: `Barlow Condensed`, 700 weight, uppercase
- Body copy: `Barlow`, 400–500 weight, cream color

---

## SCROLL + ANIMATION SYSTEM

### Lenis Setup (smooth scroll)
```js
// src/hooks/useLenis.js
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      gsap.ticker.remove()
    }
  }, [])
}
```

### GSAP initialization in App.jsx
```js
import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

---

## SECTION-BY-SECTION BUILD INSTRUCTIONS

---

### SECTION 1 — NAVBAR (`Navbar.jsx`)

**Layout:** Fixed top, full width, flex row with three zones: left pills | center logo | right pills + CTA

**Exact content:**
- Left pills: `Ingredients` · `Benefits` · `How To Use`
- Center logo: `MORIVANA` in Bebas Neue 26px, citrus color. Sub-label: `CLEAN SUPER GREENS` in Barlow Condensed 11px, green-light
- Right: `About` pill + `Notify Me 🌿` CTA button (citrus background, dark text)

**Styling:**
- Background: `rgba(26, 58, 26, 0.92)` with `backdrop-filter: blur(8px)`
- Bottom border: `2px dotted var(--citrus-dim)`
- Nav pills: transparent bg, `2px solid citrus-dim` border, citrus text, border-radius 999px
- On scroll down past 50px: add class `scrolled` — increase blur to 16px, add subtle box-shadow

**Animation:**
- GSAP: fade in nav from `y: -20, opacity: 0` to `y: 0, opacity: 1` on mount, duration 0.6s, ease `power2.out`, delay 0.3s

---

### SECTION 2 — HERO (`Hero.jsx`)

**Layout:** Full-viewport height (`100vh`). Split layout:
- Left side (45%): text content stacked vertically
- Right side (55%): 3D product model canvas (see `ProductScene.jsx` below)
- Background: `var(--green-dark)` with radial gradient overlay: `radial-gradient(ellipse at 20% 50%, rgba(44,107,44,0.3) 0%, transparent 60%)`

**Exact text content:**
```
Kicker (top):      CLEAN SUPER GREENS POWDER
Headline line 1:   PURE
Headline line 2:   GREENS
Divider:           3px dotted citrus-dim line
Sub-label:         MORINGA BLEND
Body paragraph:    Bold nutrition from the power of moringa.
                   Crafted for those who crave better health.
CTA button:        JOIN THE WAITLIST — GET 15% OFF
Sub-trust:         50g · 10 Servings · Ships India & Canada
Countdown:         [CountdownTimer component — see below]
```

**Headline style:** `Bebas Neue`, `clamp(80px, 14vw, 200px)`, `line-height: 0.88`, citrus color

**GSAP animations (run on mount, NOT scroll):**
```js
// Staggered entrance — all elements start hidden (opacity:0, y:40)
gsap.from('.hero-kicker',    { opacity:0, y:30, duration:0.7, ease:'power3.out', delay:0.2 })
gsap.from('.hero-headline',  { opacity:0, y:60, duration:0.9, ease:'power3.out', delay:0.4 })
gsap.from('.hero-divider',   { scaleX:0, transformOrigin:'left', duration:0.6, ease:'power2.out', delay:0.8 })
gsap.from('.hero-sublabel',  { opacity:0, y:20, duration:0.6, ease:'power2.out', delay:0.9 })
gsap.from('.hero-body',      { opacity:0, y:20, duration:0.6, ease:'power2.out', delay:1.0 })
gsap.from('.hero-cta',       { opacity:0, scale:0.9, duration:0.5, ease:'back.out(1.4)', delay:1.2 })
gsap.from('.hero-countdown', { opacity:0, y:10, duration:0.5, ease:'power2.out', delay:1.4 })
```

---

### 3D PRODUCT SCENE (`ProductScene.jsx`)

This is the centerpiece of the site. The 3D model is the actual product pouch (`highres.glb`).

**Setup:**
```jsx
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

function PouchModel({ scrollProgress }) {
  const { scene } = useGLTF('/models/highres.glb')
  const groupRef = useRef()

  // Idle float animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.04
    groupRef.current.rotation.y += 0.003  // slow continuous spin
  })

  // Scroll-driven rotation and scale
  useEffect(() => {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.to(groupRef.current.rotation, {
          y: self.progress * Math.PI * 2,  // full 360 rotation on scroll through hero
          duration: 0.3,
          overwrite: true
        })
        gsap.to(groupRef.current.scale, {
          x: 1 + self.progress * 0.15,
          y: 1 + self.progress * 0.15,
          z: 1 + self.progress * 0.15,
          duration: 0.3,
          overwrite: true
        })
      }
    })
  }, [])

  return (
    <group ref={groupRef} scale={1.8} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  )
}

export default function ProductScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#c8e630" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#8bc34a" />
      <Environment preset="forest" />
      <PouchModel />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={4}
        blur={2.5}
        far={4}
      />
    </Canvas>
  )
}

useGLTF.preload('/models/highres.glb')
```

**IMPORTANT:**
- Canvas must have `alpha: true` and transparent background so it blends into the hero section
- The model should appear to float slightly using `useFrame` sin wave
- On mobile (viewport < 768px): hide the 3D canvas, replace with the packaging PNG image (`packaging_highres.png`) — never crash mobile with heavy WebGL
- Add a loading fallback: while GLB loads, show a simple CSS spinner with citrus color

---

### SCROLL STORYTELLING — 3D MODEL JOURNEY

After the hero section, as the user scrolls through the page, the 3D model should travel with the story. Implement a **sticky 3D panel** that persists across Sections 2–4 (What is Morivana → Ingredients → Benefits) while text panels scroll alongside it.

**Implementation:**
```jsx
// Sticky canvas wrapper
<div style={{ position: 'sticky', top: '10vh', height: '80vh', width: '50%', float: 'right' }}>
  <ProductScene />
</div>

// Text panels scroll past on the left side
<div style={{ width: '50%' }}>
  <WhatIsMorivanaText />
  <IngredientsText />
  <BenefitsText />
</div>
```

**Scroll-driven model transformations (ScrollTrigger scrub):**

| Scroll Position | Model Behavior |
|---|---|
| Hero section | Slow continuous Y rotation + float |
| Into "What is Morivana" | Model tilts 15° on X axis, slight zoom in |
| Into "Ingredients" | Model rotates to show back label (180° Y), particles emit |
| Into "Benefits" | Model returns to front, glows green (emissive boost via material update) |
| Past benefits | Model fades out smoothly as it's no longer needed |

Use `gsap.to(modelRef.current.rotation, { y: Math.PI, scrub: 1.5 })` pattern with ScrollTrigger.

---

### SECTION 3 — WHAT IS MORIVANA (`WhatIsMorivana.jsx`)

**Layout:** Full-width section, dark background (`var(--dark)`), text on left, 3D model sticky on right

**Exact text content:**
```
Kicker:     NOT JUST A GREENS POWDER
Headline:   A MORNING
            RITUAL
Body:       Morivana Daily Super Greens blends 8 of nature's
            most powerful superfoods — moringa, spirulina, amla,
            ginger, lemon, inulin, orange peel, and monk fruit —
            into one easy daily scoop.
            
            Made for busy people who don't always get enough
            nutrients from food. One scoop in water. 30 seconds.
            Done.

3 icon+text blocks:
  🌿  ENERGIZE    — Natural energy from moringa & spirulina
  💧  REFRESH     — Citrus cleanse from lemon & orange peel  
  🌱  NOURISH     — Gut support from inulin prebiotic fiber
```

**GSAP ScrollTrigger animations:**
```js
// Each text block reveals from bottom
gsap.from('.what-text-block', {
  y: 50, opacity: 0, stagger: 0.2, duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#what-section',
    start: 'top 70%',
  }
})
```

---

### SECTION 4 — INGREDIENTS (`Ingredients.jsx`)

**Layout:** Full-width, background `#0a1a0a`. Left: scrolling text list. Right: sticky 3D model (continues from above).

**Headline:** `WHAT'S INSIDE EVERY SCOOP` in Bebas Neue, citrus

**8 ingredient items — render as animated list rows:**
Each row: `[emoji icon circle] | [INGREDIENT NAME] | [benefit line]`

```
🌿  MORINGA POWDER     The most nutrient-dense plant on earth. Iron, calcium & antioxidants.
🔵  SPIRULINA          Blue-green algae powerhouse for protein and energy.
🍊  AMLA               Vitamin C from the Indian gooseberry. Immunity & skin.
🫚  GINGER POWDER      Soothes digestion. Reduces inflammation naturally.
🍋  LEMON POWDER       Natural detox. Alkalizing effect on your body.
🌾  INULIN             Prebiotic fiber that feeds your gut microbiome.
🍊  ORANGE PEEL        Flavonoids and digestive enzymes from whole citrus.
🍈  MONK FRUIT         Zero-calorie natural sweetener. No sugar spike.
```

**Icon circle style:** 52px, `border: 2px solid var(--citrus-dim)`, `background: rgba(200,230,48,0.08)`, border-radius 50%

**GSAP:** Each ingredient row animates in from `x: -60, opacity: 0` with stagger 0.12s as it enters viewport

**ScrollTrigger — model behavior during this section:**
At 50% scroll through this section, trigger a smooth 180° Y rotation on the model to reveal the back label (nutritional info side)

---

### SECTION 5 — BENEFITS (`Benefits.jsx`)

**Layout:** Full-width, background `var(--citrus)` (bright yellow-green). Dark text. 3D model still sticky on right.

**Headline:** `FEEL THE DIFFERENCE FROM DAY ONE` in Bebas Neue, dark color

**5 benefit blocks — horizontal card row:**
```
⚡  ALL-DAY ENERGY          No caffeine crash. Moringa + spirulina fuel you naturally.
🌿  BETTER DIGESTION        Ginger + inulin = smoother gut, every morning.
🛡️  STRONGER IMMUNITY       Amla + lemon = daily vitamin C hit.
✨  CLEARER SKIN             Antioxidant load from moringa fights free radicals.
⏱️  30-SECOND HABIT         One scoop. No blending. No prep. Just results.
```

**Card style:** Dark background (`var(--dark)`), citrus border-top accent 3px, border-radius 12px, padding 28px

**GSAP:** Cards animate from `y: 80, opacity: 0` with stagger 0.15s on enter. On hover: `scale(1.03)` with citrus glow box-shadow

---

### SECTION 6 — HOW TO USE (`HowToUse.jsx`)

**Layout:** Full-width, dark green background, centered content. 3D model NOT sticky here — fades out.

**Headline:** `YOUR 30-SECOND MORNING RITUAL`

**3-step horizontal flow:**
```
STEP 01     STEP 02                     STEP 03
ADD         MIX                         DRINK
1 scoop     With 200ml water,           Start your day
(5g)        milk, or smoothie           feeling good
```

**Arrow connectors between steps:** Simple SVG animated arrow that draws in via GSAP `strokeDashoffset` animation

**Mixing suggestions row below steps:**
`TRY IT WITH: Water · Coconut Water · Warm Milk · Morning Smoothie`

**Bottom callout box:**
```
💡 PRO TIP: Best taken in the morning on an empty stomach
   for maximum nutrient absorption.
```

---

### SECTION 7 — WAITLIST CTA (`WaitlistCTA.jsx`)

This is the most important section. Full-screen, high-impact.

**Layout:** Full viewport height. Background: `var(--green-dark)` with large radial glow. Centered vertically.

**Exact content:**
```
Kicker:       LIMITED FIRST BATCH · INDIA & CANADA
Headline:     BE THE FIRST
              TO TRY MORIVANA
Sub-copy:     Sign up for early access and get an exclusive
              launch discount. Limited first batch available.
Form:         [Name input] [Email input] [NOTIFY ME →] button
Trust line:   🔒 No spam. Unsubscribe anytime.
Social proof: 500+ people already on the waitlist.
```

**Form implementation (react-hook-form):**
```jsx
import { useForm } from 'react-hook-form'

const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm()

const onSubmit = async (data) => {
  // POST to your backend or a service like Brevo / Mailchimp API
  await axios.post('/api/waitlist', data)
}
```

**Input field styles:**
- Background: `rgba(200,230,48,0.08)`
- Border: `2px solid var(--citrus-dim)`
- Border-radius: 999px
- Color: citrus
- Placeholder: `rgba(200,230,48,0.4)`
- On focus: border becomes full citrus, glow shadow `0 0 0 3px rgba(200,230,48,0.15)`

**CTA Button:**
- Background: `var(--citrus)`
- Color: `var(--dark)`
- Font: `Barlow Condensed` 800 weight uppercase
- Hover: `var(--green-light)`, scale 1.02
- Loading state: show spinner, disable button
- Success state: replace form with: `✓ YOU'RE ON THE LIST! We'll notify you at launch.`

**GSAP:**
```js
// Parallax background glow
gsap.to('.cta-glow', {
  scale: 1.3,
  scrollTrigger: { trigger: '#cta-section', scrub: 2 }
})
// Headline split text reveal
gsap.from('.cta-headline span', {
  y: 100, opacity: 0, stagger: 0.1, duration: 0.9,
  ease: 'power4.out',
  scrollTrigger: { trigger: '#cta-section', start: 'top 70%' }
})
```

---

### COUNTDOWN TIMER (`CountdownTimer.jsx`)

Set the launch target date. Example: 30 days from `new Date()` or hardcoded date.

```jsx
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate) - new Date()
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="countdown">
      {['days','hours','minutes','seconds'].map(unit => (
        <div key={unit} className="countdown-block">
          <span className="countdown-num">{String(timeLeft[unit]).padStart(2,'0')}</span>
          <span className="countdown-label">{unit.toUpperCase()}</span>
        </div>
      ))}
    </div>
  )
}
```

**Style:** Citrus numbers in Bebas Neue 48px, small labels in Barlow Condensed, separated by `:` dividers

---

### FLOATING PARTICLES (`FloatingParticles.jsx`)

Ambient particle system in the background — subtle green/citrus floating dots to reinforce the natural/organic feel.

```jsx
// Use @react-three/fiber Points geometry
// ~150 particles
// Slow upward drift with slight horizontal oscillation
// Colors: mix of #4caf50, #8bc34a, #c8e630 at low opacity (0.3–0.6)
// Size: 0.02–0.05 units
// This component renders BEHIND the main scene
```

---

### SECTION 8 — FOOTER (`Footer.jsx`)

**Layout:** 3-column flex. Background: `var(--dark)`. Top border: `3px dotted var(--citrus-dim)`. Padding: `60px`.

**Column 1:**
```
MORIVANA                ← Bebas Neue 48px, citrus
Clean Super Greens      ← Barlow Condensed, green-light
Est. 2024
```

**Column 2 — Links:**
```
Instagram · Recipes · About · Contact · Privacy Policy
```
Style: Barlow Condensed 700, citrus-dim, hover → citrus, `letter-spacing: 0.15em`, uppercase

**Column 3:**
```
© 2024 Morivana. All rights reserved.
Shipping to India & Canada.
```

---

## MOBILE RESPONSIVENESS

At `max-width: 768px`:
- Navbar: hamburger menu (simple toggle), center logo only visible
- Hero: single column, 3D canvas hidden, show packaging PNG fallback
- Sticky 3D section: disable sticky, show inline product image instead
- Ingredients: single column list
- Benefits: vertical scroll instead of horizontal card row
- Waitlist form: stacked inputs (name above email above button)
- Footer: stacked vertically

---

## PERFORMANCE REQUIREMENTS

- **GLB model**: If the file is over 5MB, use `draco` compression via `@react-three/drei`'s `DRACOLoader`. Add `<DRACOLoader decoderPath="https://www.gstatic.com/draco/versioned/decoders/1.5.6/" />` to `useGLTF` setup.
- **Lazy load** the 3D canvas with React `Suspense` + `lazy()`
- **Intersection Observer** for non-GSAP elements to avoid running animations off-screen
- **ScrollTrigger.refresh()** must be called after fonts load to prevent position miscalculations
- Add `will-change: transform` only on actively animating elements, remove after animation completes

---

## VITE CONFIG

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],   // ← CRITICAL: allows GLB import
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 1600,
  }
})
```

---

## TAILWIND CONFIG

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'green-dark':  '#1a3a1a',
        'green-mid':   '#2d6b2d',
        'green-bright':'#4caf50',
        'green-light': '#8bc34a',
        'citrus':      '#c8e630',
        'citrus-dim':  '#a8c020',
        'cream':       '#f5f0dc',
        'warm-white':  '#faf8f0',
        'brand-dark':  '#0d1f0d',
      },
      fontFamily: {
        display:   ['"Bebas Neue"', 'cursive'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        body:      ['Barlow', 'sans-serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
```

---

## ERROR PREVENTION CHECKLIST

Before writing any code, verify these to avoid the most common errors:

1. **GSAP ScrollTrigger must be registered ONCE** — do it in `main.jsx` or a single `gsap-init.js` file. Never register in multiple components.
2. **Three.js refs must be checked before accessing** — always guard: `if (meshRef.current) { ... }`
3. **useFrame runs every frame** — never put heavy logic inside it. Use refs, not state, for animation values.
4. **GLB path must start with `/`** — use `/models/highres.glb` not `./models/highres.glb` for Vite
5. **Lenis + ScrollTrigger integration** — the `lenis.on('scroll', ScrollTrigger.update)` line is mandatory or scroll triggers will desync
6. **React 18 StrictMode** runs effects twice in dev — GSAP/Lenis cleanup `return () => { ... }` in all `useEffect` hooks is mandatory
7. **Canvas size** — always set explicit `width` and `height` on the Canvas container div, not just the Canvas itself
8. **OrbitControls on mobile** — disable if you don't want the user rotating the model manually. If you keep it, add `enableZoom={false}` to prevent zoom conflicts with page scroll
9. **GLB materials** — if the model appears black, add `<Environment preset="studio" />` or increase `ambientLight` intensity
10. **Tailwind + custom CSS** — keep GSAP target classes as plain CSS classes, not Tailwind utilities, to avoid purge issues

---

## CONTENT REFERENCE — BRAND FACTS

Use these exact values wherever content is needed:

```
Brand name:          Morivana
Tagline:             Clean Super Greens
Sub-tagline:         Daily Super Greens · Moringa Blend
Pack size:           50g
Servings per pack:   10
Serving size:        1 scoop (5g)
Mixing instructions: Add 1 scoop to 200ml water, milk, or smoothie. Mix well.
Storage:             Cool, dry place. Away from direct sunlight.
Markets:             India (INR) · Canada (CAD)
Certifications:      Vegan · Soy-Free · No Added Sugar · No Artificial Sweeteners

Nutrition per 5g serving:
  Energy:        18 kcal
  Protein:       1.2g
  Carbohydrates: 2.5g
  Fiber:         1.8g
  Fat:           0.3g

Ingredients (in order):
  Moringa Powder · Spirulina · Inulin · Lemon Powder ·
  Ginger Powder · Amla Powder · Orange Peel Powder · Monk Fruit

Benefits:
  Energize · Refresh · Nourish
  Energy · Digestion · Immunity · Skin Health · Easy Daily Habit
```

---

## DEPLOYMENT NOTES

- **Frontend hosting:** Vercel (free tier sufficient for launch)
- **Waitlist API:** Build a simple Express endpoint or use Brevo's (formerly Sendinblue) free email API
- **Domain:** `morivana.com` — point to Vercel deployment
- **Environment variables:** Store API keys in `.env` — `VITE_BREVO_API_KEY=xxx`
- **Analytics:** Add `window.gtag` or Plausible.io (privacy-friendly) before launch

---

*End of prompt. Build section by section. Test the 3D model load first before adding scroll animations.*
