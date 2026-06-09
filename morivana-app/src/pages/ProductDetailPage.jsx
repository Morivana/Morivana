import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { useUserRegion } from '../context/RegionContext'
import Breadcrumb, { buildBreadcrumbSchema } from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'
import PageLayout from '../components/PageLayout'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Daily Greens', href: null },
]

const getNutritionFacts = (pack) => [
  { item: 'Serving Size', value: '5g (1 scoop)', bold: true },
  { item: 'Servings Per Container', value: pack === '50g' ? '10' : '20', bold: false },
  { item: 'Calories', value: '18 kcal', bold: true },
  { item: 'Total Fat', value: '0.2g', bold: false },
  { item: 'Total Carbohydrate', value: '2.8g', bold: false },
  { item: '  Dietary Fiber', value: '1.5g (5% DV)', bold: false },
  { item: '  Sugars', value: '0g', bold: false },
  { item: 'Protein', value: '1.8g', bold: false },
  { item: 'Vitamin A (as β-carotene)', value: '370μg (41% DV)', bold: false },
  { item: 'Vitamin C (natural)', value: '~370mg (411% DV)', bold: false },
  { item: 'Iron', value: '3.0mg (17% DV)', bold: false },
  { item: 'Calcium', value: '105mg (8% DV)', bold: false },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Morivaná Daily Super Greens Powder',
    description: 'Morivaná Daily clean super greens powder. 8 whole plants, cold-dried, all amounts disclosed. No proprietary blends.',
    image: 'https://morivandaily.com/packaging_highres.webp',
    brand: { '@type': 'Brand', name: 'Morivaná Daily' },
    offers: [
      {
        '@type': 'Offer',
        name: '50g Trial Pack - India',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'INR',
        price: '499',
        priceValidUntil: '2027-12-31',
        url: 'https://morivandaily.com/shop/daily-greens',
        eligibleRegion: { '@type': 'Country', name: 'India' },
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
        url: 'https://morivandaily.com/shop/daily-greens',
        eligibleRegion: { '@type': 'Country', name: 'India' },
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
        url: 'https://morivandaily.com/shop/daily-greens',
        eligibleRegion: { '@type': 'Country', name: 'Canada' },
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
        url: 'https://morivandaily.com/shop/daily-greens',
        eligibleRegion: { '@type': 'Country', name: 'Canada' },
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
  buildBreadcrumbSchema(breadcrumbs),
]

export default function ProductDetailPage() {
  const { region, setRegion } = useUserRegion()
  const [selectedPack, setSelectedPack] = useState('100g')
  const nutritionFacts = getNutritionFacts(selectedPack)

  return (
    <>
      <SEOHead
        title="Morivaná Daily Super Greens | Buy Online India & Canada"
        description="Buy Morivaná Daily Super Greens clean greens powder made from 8 whole plants. Sizing from 50g trial pack to 100g daily ritual pack. Pre-order ₹499/₹799 India or CA$21/CA$39 Canada."
        canonical="/shop/daily-greens"
        ogType="product"
        schemas={schemas}
      />

      <PageLayout background="var(--surface-base)">
        <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
          <Breadcrumb items={breadcrumbs} />

          <div style={{ marginTop: '40px', marginBottom: '56px' }}>
            <div className="kicker" style={{ marginBottom: '16px' }}>Product Details</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 48px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              marginBottom: '20px',
            }}>
              Morivaná Daily Super Greens<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, textTransform: 'none', fontSize: '0.6em', color: 'var(--ink-soft)' }}>
                {selectedPack === '50g' ? 'Trial Pack · 50g (10 Servings)' : 'Daily Ritual Pack · 100g (20 Servings)'}
              </span>
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', marginBottom: '64px' }}>
            {/* Product image */}
            <div>
              <div style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'var(--surface-soft)',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <img
                  src="/packaging_highres.webp"
                  alt="Morivaná Daily Super Greens pouch front"
                  style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  loading="eager"
                  width="664"
                  height="1000"
                />
              </div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--surface-soft)',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="/packaging_highres_back.webp"
                  alt="Morivaná Daily Super Greens pouch back with ingredient label"
                  style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  loading="lazy"
                  width="665"
                  height="1000"
                />
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Nutrition facts panel */}
              <div style={{
                border: '2px solid var(--surface-deep)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <div style={{
                  background: 'var(--surface-deep)',
                  padding: '14px 16px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.02em',
                  color: 'var(--ink-on-dark)',
                  textTransform: 'uppercase',
                }}>
                  Nutrition Facts
                </div>
                <div style={{ padding: '0' }}>
                  {nutritionFacts.map((row, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 16px',
                      borderBottom: i < nutritionFacts.length - 1 ? '1px solid var(--line-soft)' : 'none',
                      background: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-soft)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: row.bold ? 700 : 400,
                        fontSize: '0.82rem',
                        color: 'var(--ink)',
                      }}>
                        {row.item}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        color: 'var(--surface-deep)',
                      }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  {region === 'CA' ? (
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: '4px' }}>Canada</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--surface-deep)', lineHeight: 1 }}>
                          {selectedPack === '50g' ? 'CA$21' : 'CA$39'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                          {selectedPack === '50g' ? 'CA$25' : 'CA$47'}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)' }}>
                        {selectedPack === '50g' ? 'CA$2.10/day' : 'CA$1.95/day'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: '4px' }}>India</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--surface-deep)', lineHeight: 1 }}>
                          {selectedPack === '50g' ? '₹499' : '₹799'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                          {selectedPack === '50g' ? '₹599' : '₹999'}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)' }}>
                        {selectedPack === '50g' ? '₹50/day' : '₹40/day'}
                      </div>
                    </div>
                  )}

                  {/* Region Switcher */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Shipping To</span>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.03)', padding: '2px', borderRadius: '24px', border: '1px solid var(--line-soft)' }}>
                      <button
                        onClick={() => setRegion('IN')}
                        style={{
                          background: region === 'IN' ? 'var(--surface-deep)' : 'none',
                          color: region === 'IN' ? 'var(--ink-on-dark)' : 'var(--ink-soft)',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                          minHeight: 0,
                          minWidth: 0,
                        }}
                      >
                        IN
                      </button>
                      <button
                        onClick={() => setRegion('CA')}
                        style={{
                          background: region === 'CA' ? 'var(--surface-deep)' : 'none',
                          color: region === 'CA' ? 'var(--ink-on-dark)' : 'var(--ink-soft)',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                          minHeight: 0,
                          minWidth: 0,
                        }}
                      >
                        CA
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link to="/waitlist" className="cta-btn" style={{ textAlign: 'center' }}>
                Join Waitlist Be First →
              </Link>

              {/* Certifications */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Vegan', 'Soy-Free', 'Gluten-Free', 'No Added Sugar', 'Cold-Dried', 'No Artificial Sweeteners', 'No Proprietary Blends'].map(cert => (
                  <span key={cert} style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.6rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-on)',
                    background: 'var(--accent)',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    ✓ {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Full ingredient list */}
          <section style={{ marginBottom: '56px', borderTop: '1px solid var(--line-soft)', paddingTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--surface-deep)',
              marginBottom: '8px',
            }}>
              Full Ingredient List
            </h2>
            <p style={{ color: 'var(--ink-mute)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Moringa leaf powder, Spirulina powder, Amla (Indian gooseberry) powder, Ginger root powder, Lemon zest powder, Inulin (chicory root), Orange peel powder, Monk fruit extract (25% Mogroside V).
            </p>
            <p style={{ color: 'var(--ink-mute)', fontSize: '0.82rem', marginBottom: '20px' }}>
              <strong>Contains no:</strong> gluten, soy, dairy, artificial colors, artificial flavors, artificial sweeteners, preservatives, or fillers.
            </p>
            <Link to="/ingredients" style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--surface-deep)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--surface-deep)',
              paddingBottom: '2px',
              display: 'inline',
            }}>
              Explore each ingredient in detail →
            </Link>
          </section>
        </div>
      </PageLayout>

      <RelatedPages items={[
        { title: 'All Ingredients', description: 'Full profiles for all 8 plants with nutrition data and citations.', href: '/ingredients', tag: 'Ingredients' },
        { title: 'The Science', description: 'Research citations behind every ingredient.', href: '/science', tag: 'Research' },
        { title: 'Compare to Competitors', description: 'Morivaná Daily vs AG1, Setu, Oziva.', href: '/compare', tag: 'Compare' },
      ]} />
    </>
  )
}
