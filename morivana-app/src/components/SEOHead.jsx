import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://morivanadaily.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/packaging_highres.webp`

/**
 * SEOHead inject per-route <title>, meta tags, canonical, OG, and JSON-LD schemas.
 *
 * @param {string}  title        - Page title (50–60 chars)
 * @param {string}  description  - Meta description (130–155 chars)
 * @param {string}  canonical    - Canonical path e.g. "/about" (no trailing slash)
 * @param {string}  [ogImage]    - Absolute URL to OG image
 * @param {string}  [ogType]     - "website" | "article" | "product" (default: "website")
 * @param {Array}   [schemas]    - Array of JSON-LD objects to inject as <script> tags
 */
export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schemas = [],
  noindex = false,
}) {
  const canonicalUrl = `${BASE_URL}${canonical}`

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Morivaná Daily" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD schemas */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
