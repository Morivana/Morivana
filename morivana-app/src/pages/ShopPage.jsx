import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { useUserRegion } from '../context/RegionContext'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'
import FAQAccordion from '../components/FAQAccordion'
import ProductImageSlider from '../components/ProductImageSlider'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Pre-Order', href: null },
]

const faqs = [
  { q: 'When will Morivaná Daily ship?', a: 'We are currently in pre-launch. Early bird customers will receive priority shipping when we launch. We will notify all waitlist members 7 days before orders ship.' },
  { q: 'What packaging sizes are available?', a: 'Morivaná Daily is available in two sizes: a 50g Trial Pack (10 servings) and a 100g Daily Ritual Pack (20 servings). Each order includes a measuring scoop.' },
  { q: 'What are the return terms?', a: 'We offer a 30-day satisfaction guarantee. If you\'re not satisfied after trying the product consistently for at least 7 days, contact us and we\'ll process a full refund.' },
  { q: 'What does it taste like?', a: 'Grassy and light with a natural citrus finish and clean sweetness from monk fruit. Most people find it mild enough to drink in plain water without additional sweetener.' },
  { q: 'Is it available for subscription?', a: 'Subscription options will be available at launch. Early bird customers will have access to discounted subscription pricing.' },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Morivaná Daily Super Greens Powder',
    description: '8-plant clean super greens powder moringa, spirulina, amla, ginger, lemon, inulin, orange peel & monk fruit. Cold-dried, no proprietary blends.',
    image: 'https://morivanadaily.com/packaging_highres.webp',
    brand: { '@type': 'Brand', name: 'Morivaná Daily' },
    offers: [
      {
        '@type': 'Offer',
        name: '50g Trial Pack - India',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'INR',
        price: '499',
        priceValidUntil: '2027-12-31',
        url: 'https://morivanadaily.com/shop',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'INR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 5,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
      {
        '@type': 'Offer',
        name: '100g Daily Ritual Pack - India',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'INR',
        price: '799',
        priceValidUntil: '2027-12-31',
        url: 'https://morivanadaily.com/shop',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'INR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 5,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
      {
        '@type': 'Offer',
        name: '50g Trial Pack - Canada',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'CAD',
        price: '21',
        priceValidUntil: '2027-12-31',
        url: 'https://morivanadaily.com/shop',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'CAD',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'CA',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 3,
              maxValue: 7,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'CA',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
      {
        '@type': 'Offer',
        name: '100g Daily Ritual Pack - Canada',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'CAD',
        price: '39',
        priceValidUntil: '2027-12-31',
        url: 'https://morivanadaily.com/shop',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'CAD',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'CA',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 3,
              maxValue: 7,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'CA',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  },
  buildBreadcrumbSchema(breadcrumbs),
]

export default function ShopPage() {
  const { region, setRegion } = useUserRegion()
  const [selectedPack, setSelectedPack] = useState('100g')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || ''
    fetch(`${apiBase}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load products:', err)
        setLoading(false)
      })
  }, [])

  // Find matching product variant
  const skuCode = selectedPack === '50g' ? 'MD-50G' : 'MD-100G'
  const activeProduct = products.find(p => p.sku === skuCode)

  return (
    <>
      <SEOHead
        title="Pre-Order Morivaná Daily | Super Greens Powder India & Canada"
        description="Pre-order Morivaná Daily super greens powder. 8 whole plants, cold-dried, fully transparent. Sizing from 50g trial to 100g daily packs. Shipping to India & Canada."
        canonical="/shop"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div className="page-hero-header" style={{ marginTop: '40px', marginBottom: '56px', margin: '40px auto 56px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Early Bird</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 5vw, 54px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              Pre-Order Morivaná Daily<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, textTransform: 'none', fontSize: '0.55em', color: 'var(--ink-soft)' }}>
                15% Early Bird Discount
              </span>
            </h1>
          </div>

          {/* Product Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '64px',
            alignItems: 'start',
          }}>
            {/* Product image slider */}
            <ProductImageSlider />

            {/* Product info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: 'var(--surface-deep)',
                  marginBottom: '4px',
                }}>
                  Morivaná Daily Super Greens
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-mute)', fontSize: '0.88rem' }}>
                  {selectedPack === '50g' ? '50g · 10 Servings · Trial Pouch' : '100g · 20 Servings · Daily Ritual Pouch'}
                </div>
              </div>

              {/* Pack Size Selector */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: '8px' }}>
                  Select Size
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: '50g', label: '50g Trial Pack', servings: '10 servings' },
                    { id: '100g', label: '100g Daily Ritual', servings: '20 servings' },
                  ].map(pack => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack.id)}
                      style={{
                        flex: 1,
                        background: selectedPack === pack.id ? 'var(--surface-deep)' : 'var(--surface-soft)',
                        color: selectedPack === pack.id ? 'var(--ink-on-dark)' : 'var(--surface-deep)',
                        border: selectedPack === pack.id ? '1px solid var(--surface-deep)' : '1px solid var(--line-soft)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        minHeight: 0,
                        minWidth: 0,
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>{pack.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', opacity: 0.8 }}>{pack.servings}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div style={{
                background: 'var(--surface-soft)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--line-soft)',
              }}>
                <div>
                  {region === 'CA' ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--surface-deep)', lineHeight: 1 }}>
                          {activeProduct ? `CA$${activeProduct.priceUSD || Math.round(activeProduct.price / 24)}` : (selectedPack === '50g' ? 'CA$21' : 'CA$39')}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                          {selectedPack === '50g' ? 'CA$25' : 'CA$47'}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)', marginTop: '4px' }}>
                        {selectedPack === '50g' ? 'CA$2.10/day' : 'CA$1.95/day'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--surface-deep)', lineHeight: 1 }}>
                          {activeProduct ? `₹${activeProduct.price}` : (selectedPack === '50g' ? '₹499' : '₹799')}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                          {selectedPack === '50g' ? '₹599' : '₹999'}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)', marginTop: '4px' }}>
                        {selectedPack === '50g' ? '₹50/day' : '₹40/day'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status Indicator */}
              {activeProduct && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: activeProduct.stock > 20
                    ? '#2C6B1A'
                    : activeProduct.stock > 0
                    ? 'var(--color-brand-orange)'
                    : '#ef4444',
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  alignSelf: 'flex-start'
                }}>
                  <span style={{
                    height: '8px',
                    width: '8px',
                    borderRadius: '50%',
                    background: activeProduct.stock > 20
                      ? '#4F8A35'
                      : activeProduct.stock > 0
                      ? '#e87c20'
                      : '#ef4444',
                    display: 'inline-block'
                  }} />
                  {activeProduct.stock > 20 ? (
                    <span>In Stock — Priority Shipping</span>
                  ) : activeProduct.stock > 0 ? (
                    <span>Low Stock — Only {activeProduct.stock} pouches left!</span>
                  ) : (
                    <span>Sold Out — Join waitlist for restocking notifications</span>
                  )}
                </div>
              )}

              {/* Ingredients badge list */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: '10px' }}>
                  What&apos;s Inside
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    { name: 'Moringa' },
                    { name: 'Spirulina' },
                    { name: 'Amla' },
                    { name: 'Ginger' },
                    { name: 'Lemon Zest' },
                    { name: 'Inulin' },
                    { name: 'Orange Peel' },
                    { name: 'Monk Fruit' },
                  ].map(ing => (
                    <Link
                      key={ing.name}
                      to={`/ingredients/${ing.name.toLowerCase().replace(' ', '-').replace(' ', '-')}`}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        letterSpacing: '0.06em',
                        color: 'var(--surface-deep)',
                        background: 'var(--surface-soft)',
                        border: '1px solid var(--line-soft)',
                        borderRadius: '999px',
                        padding: '5px 12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, background 0.2s',
                        minHeight: 0,
                        minWidth: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--surface-deep)'; e.currentTarget.style.background = 'var(--surface-base)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-soft)'; e.currentTarget.style.background = 'var(--surface-soft)' }}
                    >
                      {ing.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Vegan', 'Soy-Free', 'No Added Sugar', 'Cold-Dried', 'No Proprietary Blends'].map(cert => (
                  <span key={cert} style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.62rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-on)',
                    background: 'var(--accent)',
                    borderRadius: '999px',
                    padding: '4px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    ✓ {cert}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeProduct && activeProduct.stock === 0 ? (
                  <Link to="/waitlist" className="cta-btn" style={{ textAlign: 'center', background: '#7A8A6E', borderColor: '#7A8A6E', pointerEvents: 'auto' }}>
                    Sold Out — Join Waitlist →
                  </Link>
                ) : (
                  <Link to="/waitlist" className="cta-btn" style={{ textAlign: 'center' }}>
                    Join Waitlist Get 15% Off →
                  </Link>
                )}
                <Link to="/shop/daily-greens" style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block',
                  padding: '10px 0',
                }}>
                  Full Product Details →
                </Link>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '64px',
          }}>
            {[
                    { title: '30-Day Guarantee', body: 'Not satisfied? Full refund, no questions.' },
                    { title: 'India & Canada', body: 'Shipping to both markets at launch.' },
                    { title: 'Transparent Sourcing', body: 'Full supply chain disclosed.' },
                    { title: 'Priority Access', body: 'Waitlist members ship first.' },
            ].map(t => (
              <div key={t.title} style={{
                background: 'var(--surface-soft)',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid var(--line-soft)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--surface-deep)', marginBottom: '4px' }}>{t.title}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', lineHeight: 1.5, margin: 0 }}>{t.body}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '48px' }}>
            <FAQAccordion items={faqs} title="Product FAQ" />
          </section>

          {/* Why Morivaná Daily callout */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ color: 'var(--ink-mute)', fontSize: '0.88rem', margin: 0 }}>
              How does Morivaná Daily compare?
            </p>
            <Link to="/compare" style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--surface-deep)',
              paddingBottom: '2px',
              display: 'inline',
            }}>
              See how we compare to AG1, Setu, Oziva →
            </Link>
          </div>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'Full Product Details', description: 'Complete ingredient info, nutritional panel, and certifications.', href: '/shop/daily-greens', tag: 'Product' },
        { title: 'Compare to Competitors', description: 'Honest comparison vs AG1, Setu, and Oziva.', href: '/compare', tag: 'Compare' },
        { title: 'How to Use', description: 'Three steps, 30 seconds. Your morning ritual.', href: '/how-to-use', tag: 'Guide' },
      ]} />
    </>
  )
}
