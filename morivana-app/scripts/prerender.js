import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIST_PATH = path.resolve(__dirname, '../dist')
const INDEX_HTML_PATH = path.join(DIST_PATH, 'index.html')

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Build output index.html not found! Run npm run build first.')
  process.exit(1)
}

const originalHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8')

// Data sources hardcoded for independence in postbuild step
const staticRoutes = [
  {
    path: 'about',
    title: 'About Morivaná Daily | Pure Moringa Super Greens Sourcing & Mission',
    description: 'Learn why we built Morivaná Daily — a clean super greens powder from 8 sourced plants. Our story, philosophy, and sourcing transparency for India & Canada.',
    h1: 'About Morivaná Daily | Pure Moringa Super Greens Sourcing & Mission',
    content: `
      <section>
        <h2>Our Story: Why We Built Morivaná Daily</h2>
        <p>We started Morivaná Daily because we were frustrated — not with wellness, but with the wellness industry. Too many products, too many promises, too little transparency. Most greens powders on the market today are packed with proprietary blends, synthetic vitamins, artificial sweeteners, and fillers that do little to support your body. We wanted a daily supplement that was pure, honest, and effective. Something made from real food that we would feel good about taking every single day. That is how Morivaná Daily was born. A clean super greens powder made from exactly 8 whole plants, cold-dried and ground to preserve their nutritional integrity.</p>
        <p>Our journey began with a simple question: why should nutrition be complicated? We believed that nature already had the perfect blueprint for health. Instead of isolating vitamins in a lab, we turned to the most nutrient-dense plants on earth. Moringa oleifera, the "miracle tree," and spirulina, an ancient blue-green algae, became the anchors of our daily greens blend. By combining these superfoods with amla, ginger, lemon, orange peel, inulin, and monk fruit, we created a delicious, citrusy daily greens powder that dissolves in 30 seconds and provides clean energy for your morning.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Our Sourcing Philosophy & Transparency</h2>
        <p>Transparency is not a marketing buzzword for us; it is our foundational principle. We believe you have the right to know exactly where every ingredient in your daily greens powder comes from and how it is processed. That is why we disclose every single amount on our label. Our premium Moringa oleifera is ethically sourced from organic partner farms in Tamil Nadu, India. Our Vitamin C-rich Amla (Indian gooseberry) is harvested in the clean soils of Uttarakhand. Our digestive-soothing Ginger comes from small farms in Kerala. We build direct relationships with our farmers to ensure fair wages and sustainable agricultural practices.</p>
        <p>Unlike conventional supplements that use high-heat spray drying — which degrades up to 60% of water-soluble vitamins — we use low-temperature cold-drying. This gentle process locks in chlorophyll, active enzymes, and heat-sensitive antioxidants. The result is a vibrant green powder that is close to the living plant as possible. We test every batch for purity, heavy metals, and pesticide residues so you can trust what goes into your body.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Honest Plant-Based Nutrition Without Fillers</h2>
        <p>Morivaná Daily is formulated to be a pure daily companion. It contains no artificial sweeteners like sucralose or aspartame, which have been linked to gut microbiome disruption. Instead, we sweeten our greens powder naturally with a standardized extract of monk fruit from Guangxi, China, providing a clean, calorie-free sweetness without blood sugar spikes. We also exclude common fillers like soy, gluten, dairy, and proprietary extracts. Everything you see on our label is exactly what you get: 8 whole plants working together to support your daily wellness, digestion, and natural metabolic energy.</p>
        <p>By focusing on whole food inputs, Morivaná Daily provides bioavailable nutrients that your body recognizes and absorbs efficiently. The iron and calcium from moringa, the complete proteins from spirulina, and the prebiotic fibers from chicory inulin work in harmony to optimize your morning routine. Whether you are in India or Canada, Morivaná Daily is designed to fit seamlessly into your active lifestyle, helping you start each day calm, clear, and quietly fueled.</p>
      </section>
    `
  },
  {
    path: 'benefits',
    title: 'Moringa & Spirulina Health Benefits | Morivaná Daily Greens',
    description: 'A day-by-day look at what Morivaná Daily super greens does — energy, digestion, immunity, skin clarity, and mental focus. Backed by ingredient research.',
    h1: 'Moringa & Spirulina Health Benefits | Morivaná Daily Greens',
    content: `
      <section>
        <h2>Daily Wellness Benefits Timeline</h2>
        <p>Taking a daily scoop of Morivaná Daily Super Greens Powder initiates a steady cascade of positive changes in your body. In the first few days, many users report a noticeable shift in their morning energy levels. Unlike caffeine-based drinks that spike your heart rate and lead to a mid-afternoon crash, the energy from moringa and spirulina is clean, steady, and sustained. It supports your body's natural metabolic pathways, giving you 6+ hours of calm focus to power through your day.</p>
        <p>By the end of the first week, the prebiotic inulin fiber and organic ginger root begin to settle and soothe your digestion. You will notice less bloating after meals and improved gut comfort as healthy bacteria in your microbiome are nourished. By week two, the dense network of antioxidants — including 46 antioxidants from premium moringa leaves — helps clear free radicals, leading to visible improvements in skin clarity and overall vitality.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Clean Sustained Energy Without the Crash</h2>
        <p>The core of Morivaná Daily's energizing benefits lies in its twin powerhouses: Moringa oleifera and spirulina. Moringa is rich in B-complex vitamins, iron, and magnesium, which are essential cofactors in cellular energy production (ATP synthesis). When your cells are nourished at a mitochondrial level, you experience natural energy rather than artificial stimulation. Spirulina adds to this by providing a highly digestible, complete plant protein along with phycocyanin, a unique pigment that supports mitochondrial health and exercise recovery.</p>
        <p>This synergistic combination helps fight daily fatigue, improves mental clarity, and supports physical stamina. Whether you are preparing for a workout, a busy day at the office, or running errands, Morivaná Daily provides the foundational nutrients your body needs to perform at its best, without the jitters, sleep disruption, or crash associated with caffeine and energy drinks.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Gut Support & Prebiotic Inulin</h2>
        <p>Gut health is the foundation of overall wellness. Morivaná Daily supports your digestive system with a combination of soluble prebiotic inulin fiber from chicory root and anti-inflammatory ginger. Inulin acts as a fertilizer for your gut microbiome, feeding beneficial bacteria like Bifidobacteria. A healthy microbiome is crucial for nutrient absorption, immune defense, and even neurotransmitter production (the gut-brain axis). Ginger root adds to these benefits by promoting gastric emptying and soothing the stomach lining, preventing bloating and gas.</p>
        <p>Additionally, organic Amla (Indian gooseberry) provides over 600% of your daily value of natural Vitamin C per serving. Vitamin C is a powerful antioxidant that protects the gut lining from oxidative stress and enhances the absorption of non-heme iron from moringa and spirulina. Together, these 8 whole plants create an optimal environment for digestion, allowing you to absorb more nutrients from your diet and feel lighter and more comfortable throughout the day.</p>
      </section>
    `
  },
  {
    path: 'compare',
    title: 'Morivaná Daily vs AG1 vs Setu vs Oziva | Honest Comparison India',
    description: 'Honest comparison of the best greens powders in India. Morivaná Daily vs AG1, Setu, and Oziva — compared on price, ingredients, sourcing, and transparency.',
    h1: 'Morivaná Daily vs AG1 vs Setu vs Oziva',
    h2s: [
      'Side-by-Side Super Greens Comparison',
      'Morivaná Daily vs AG1 (Athletic Greens)',
      'Morivaná Daily vs Setu vs Oziva'
    ],
    content: `
      <section>
        <h2>Side-by-Side Super Greens Comparison</h2>
        <p>The daily greens supplement market has grown rapidly, offering consumers a wide variety of choices. However, finding a clean, transparent, and affordable option can be challenging. Many popular brands hide their ingredient amounts behind "proprietary blends," making it impossible to know how much of each superfood you are actually consuming. We believe that consumers deserve better. When comparing greens powders, you should evaluate four key criteria: ingredient transparency, processing method, sweetener type, and price per serving.</p>
        <p>Morivaná Daily stands out by offering complete transparency. Our label lists the exact gram and milligram amounts of all 8 whole-plant ingredients. We use low-temperature cold-drying to preserve delicate nutrients, sweeten our blend naturally with monk fruit, and price our 30-day supply at an affordable rate (₹1,299 in India, CA$19.99 in Canada). Here is how we compare to the top options available on the market today.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Morivaná Daily vs AG1 (Athletic Greens)</h2>
        <p>Athletic Greens AG1 is the global benchmark for greens powders, featuring 75 ingredients including vitamins, minerals, adaptogens, and probiotics. However, AG1 presents significant hurdles for consumers in India and Canada. First, it does not officially ship to India, forcing buyers to use grey-market importers with high shipping fees and customs risks. Second, the price is exceptionally high: AG1 costs approximately $99 USD per month — roughly ₹8,500–9,000 before duties. This makes it unsustainable for many people as a daily habit.</p>
        <p>In contrast, Morivaná Daily is designed locally and ships directly. Rather than using 75 trace ingredients (many of which are underdosed to fit in a single scoop), we focus on 8 highly concentrated, transparent whole plants. By sourcing our moringa, amla, and ginger directly from clean farms in India, we keep quality high and costs low, offering a practical, clean, and locally-sourced alternative at a fraction of the cost.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Morivaná Daily vs Setu vs Oziva</h2>
        <p>Within the local Indian market, Setu Superfood Greens and Oziva Plant-Based Daily Greens are popular choices. Setu contains 39 ingredients but relies heavily on proprietary blends, meaning the individual amounts of key superfoods are undisclosed. It is sweetened with stevia, which some users find has a bitter aftertaste. Oziva is another affordable brand, but their formulas often include proprietary herbal extracts and synthesized vitamin packets rather than relying purely on whole plants.</p>
        <p>Morivaná Daily offers a cleaner, simpler alternative. By including exactly 8 whole plants and no proprietary blends, we ensure you know exactly what you are consuming. We avoid synthetic vitamins entirely, relying on organic Amla for Vitamin C and Moringa for iron and calcium. Sweetened with premium monk fruit, Morivaná Daily provides a smoother, cleaner taste profile without any artificial aftertaste, making it the perfect daily greens companion for vegetarian and vegan diets.</p>
      </section>
    `
  },
  {
    path: 'how-to-use',
    title: 'How to Use Morivaná Daily | Your 30-Second Morning Ritual',
    description: 'Mix one scoop of Morivaná Daily in 300ml water, shake, and drink. Three steps, 30 seconds. Plus mixing recipes and everything you need to know about timing.',
    h1: 'Your 30-Second Morning Ritual',
    content: `
      <section>
        <h2>Three Steps in 30 Seconds</h2>
        <p>Building a new wellness habit only works if it is simple and fits easily into your daily routine. That is why we designed Morivaná Daily to be the easiest part of your morning. You do not need a blender, a complex recipe, or clean-up time. The entire process takes just 30 seconds. First, add one scoop (5 grams) of our green powder into your shaker bottle or glass. Second, pour in 200–300ml of cool or room-temperature water. Third, shake or stir vigorously for 15–30 seconds until the powder is fully dissolved, and drink immediately.</p>
        <p>Because Morivaná Daily is made from cold-dried, finely ground plants, some natural settling is normal if the glass sits. We recommend drinking it right after mixing to enjoy the fresh, citrusy flavor at its best. If you find the natural green taste strong at first, you can easily start with half a scoop in a larger volume of water and work your way up to a full scoop over a week.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Optimal Timing for Maximum Absorption</h2>
        <p>When you consume your daily greens matters just as much as how you mix them. For best results, we recommend making Morivaná Daily your first morning ritual on an empty stomach, about 15–30 minutes before your coffee, tea, or breakfast. Taking it fasted allows your digestive tract to absorb the vitamins, minerals, and antioxidants efficiently without competing with other foods.</p>
        <p>The natural B vitamins and iron from moringa and spirulina support your body's waking energy cycles, helping you feel alert and clear-headed as you start your day. The ginger root works early to settle your stomach, preparing your gut for optimal digestion throughout the afternoon. If you miss your morning dose, you can still take Morivaná Daily later in the day, but we recommend avoiding late-evening use as the natural energy-boosting nutrients might interfere with your sleep cycle.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Creative Mixing Ideas Beyond Plain Water</h2>
        <p>While plain water is the fastest way to take Morivaná Daily, our citrusy lemon-and-orange-peel flavor profile makes it highly versatile. For an extra refreshing boost, try mixing one scoop with cold coconut water — the natural potassium and electrolytes create a delicious morning hydration drink. You can also stack your antioxidants by shaking it with iced green tea or fresh orange juice. The Vitamin C in orange juice further enhances the absorption of plant-based iron from our moringa and spirulina.</p>
        <p>If you enjoy a morning smoothie, simply toss a scoop of Morivaná Daily in with your favorite fruits, greens, and plant-based milk. If you prefer a warm drink in the winter, you can mix it with warm oat or almond milk. However, make sure to keep the liquid below 50°C (warm to the touch, not boiling), as excessive heat can degrade the heat-sensitive Vitamin C from amla and active digestive enzymes from orange peel.</p>
      </section>
    `
  },
  {
    path: 'ingredients',
    title: 'All 8 Ingredients | What\'s Inside Morivaná Daily Super Greens',
    description: 'Explore all 8 whole-plant ingredients in Morivaná Daily — moringa, spirulina, amla, ginger, lemon zest, inulin, orange peel & monk fruit. Every amount disclosed.',
    h1: 'Eight Plants. Nothing Else.',
    content: `
      <section>
        <h2>Eight Whole Plants, No Synthetics</h2>
        <p>We believe that a daily greens supplement should be made from real, whole foods that your body can easily recognize and utilize. Many commercial greens powders rely on synthetic vitamin fortifications and chemical extracts. Morivaná Daily is different. Our formula consists of exactly 8 whole plants, cold-dried and weighed. We disclose every single amount on our label so you know exactly what is going into your body. No proprietary blends, no hidden fillers, and no synthetic additives. Just pure, clean plant nutrition.</p>
        <p>By keeping our ingredient list focused and transparent, we ensure that every serving delivers functional doses of nature's most powerful superfoods. Our anchor ingredients are organic Moringa oleifera and pond-grown spirulina, which are complemented by amla, ginger, lemon, orange peel, chicory inulin, and monk fruit. Together, they create a balanced nutritional synergy that supports daily metabolic energy, immune defense, and gut health.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Premium Indian Moringa & Amla Sourcing</h2>
        <p>We source our primary superfoods locally from clean, sustainable farms in India. Moringa (Moringa oleifera) is often called the "miracle tree" because it is the most nutrient-dense leaf on earth, carrying 92 antioxidants, iron, calcium, and essential amino acids. Our premium moringa is sourced from Tamil Nadu, where the leaves are shade-dried at low temperatures to lock in chlorophyll and active enzymes. Amla (Indian gooseberry) is another Indian superfood, harvested in the clean hills of Uttarakhand. Amla is one of the most concentrated natural sources of Vitamin C on earth, providing powerful immune support and enhancing iron absorption.</p>
        <p>We also source our anti-inflammatory Ginger from small farms in Kerala. Ginger is widely recognized for its ability to calm digestion, stimulate gastric motility, and soothe the stomach lining. By sourcing locally, we support small farming communities, reduce our carbon footprint, and guarantee full traceability from seed to scoop.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Prebiotics, Digestion & Flavor Profiles</h2>
        <p>A healthy gut is the foundation of overall wellness. To support your digestive health, we include soluble prebiotic inulin fiber extracted from chicory root grown in Belgium and France. Inulin acts as a natural prebiotic, feeding the friendly bacteria in your gut microbiome to promote comfortable digestion and regular bowel movements. To make our blend taste refreshing and clean, we include cold-dried lemon zest and orange peel from the Mediterranean, which provide natural citrus enzymes and an alkalizing lift.</p>
        <p>Finally, we sweeten our daily greens naturally with monk fruit extract sourced from small family farms in Guangxi, China. Monk fruit contains natural compounds called mogrosides, which deliver a clean, calorie-free sweetness without causing blood sugar spikes or disrupting the gut microbiome. The result is a delicious, mildly sweet citrus green drink that you will actually look forward to taking every single morning.</p>
      </section>
    `
  },
  {
    path: 'learn',
    title: 'Learn Hub | Moringa Super Greens & Plant Nutrition Guides',
    description: 'Evidence-based guides on super greens, moringa, spirulina, amla, and more. Written by the Morivaná Daily team. No ads, no affiliate links — just the research.',
    h1: 'Evidence-Based Wellness Guides',
    content: `
      <section>
        <h2>Evidence-Based Wellness Guides</h2>
        <p>Welcome to the Morivaná Daily Learn Hub, your trusted resource for evidence-based information on plant nutrition, super greens, and daily wellness habits. In a world full of wellness trends and conflicting advice, we wanted to create a clean, honest space focused entirely on the science. We publish detailed, research-backed guides written by our team of nutritionists and researchers. You will find no display ads, no sponsored reviews, and no affiliate links here — just peer-reviewed clinical studies translated into practical advice for your daily routine.</p>
        <p>Our articles explore a wide range of topics, from the biochemical benefits of Moringa oleifera and blue-green spirulina algae to practical tips on how to build a morning habit that sticks. We believe that education is the first step toward optimization. By understanding how different plant compounds interact with your cells, you can make informed choices about your nutrition and take control of your long-term health.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Comparisons & Honest Product Reviews</h2>
        <p>Choosing the right daily supplement can be confusing. To help you cut through the noise, we write honest, objective comparisons of the top greens powders available in India and Canada. We analyze products like Athletic Greens AG1, Setu Superfood Greens, and Oziva on critical metrics: ingredient transparency, processing quality, sourcing origins, sweetener profiles, and price-per-serving. Our goal is to give you the data you need to make the best choice for your budget and body.</p>
        <p>We advocate for complete label transparency, urging consumers to avoid products that hide their ingredient amounts behind proprietary blends. We also explain the difference between low-temperature cold-drying — which preserves vitamins and enzymes — and conventional high-heat spray drying, helping you identify high-quality products that deliver real nutritional value.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Science Behind Moringa & Spirulina</h2>
        <p>At the core of our educational guides is the clinical science behind our star ingredients: Moringa oleifera and spirulina. These two superfoods have been studied extensively for their unique nutritional density and anti-inflammatory properties. Our articles break down the research, explaining how moringa's quercetin and spirulina's phycocyanin work at a cellular level to combat oxidative stress, support immune function, regulate blood sugar, and improve metabolic energy.</p>
        <p>We link directly to peer-reviewed studies on PubMed, allowing you to read the original clinical trials yourself. Whether you want to know about the bioavailability of plant-based iron, the prebiotic benefits of chicory inulin, or how Amla's natural Vitamin C compares to synthetic ascorbic acid, our Learn Hub is designed to satisfy your curiosity and keep you informed.</p>
      </section>
    `
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | Morivaná Daily Super Greens Powder',
    description: 'Read the Privacy Policy for Morivaná Daily. Learn how we handle your waitlist and contact data for our daily super greens powder in India and Canada.',
    h1: 'Privacy Policy',
    content: `
      <section>
        <h2>Information We Collect</h2>
        <p>At Morivaná Daily, we take your privacy seriously. This Privacy Policy describes how we collect, use, store, and share your personal information when you visit our website, join our waitlist, or pre-order our products. By using our website, you agree to the collection and use of information in accordance with this policy. The primary personal data we collect is your name and email address when you voluntarily submit them to join our pre-launch waitlist or contact customer support. We also collect basic technical data like your IP address, browser type, and page load statistics to optimize our website's performance and loading times.</p>
        <p>We do not collect sensitive personal data such as financial information or physical addresses during the waitlist phase. Any transaction details for pre-orders are processed securely through certified third-party payment gateways, and we do not store your credit card or billing details on our servers. We use industry-standard encryption protocols to protect your personal information during transmission and storage.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>How We Use Your Data</h2>
        <p>We use your personal data solely for communication purposes related to the launch of Morivaná Daily Super Greens. This includes sending you early access invitations, launch notifications, product updates, and special discounts. We do not sell, rent, lease, or share your personal information with third-party marketing agencies. Your email address is stored securely in encrypted databases and is accessed only by authorized team members to manage waitlist communication.</p>
        <p>If you wish to unsubscribe from our updates, you can do so at any time by clicking the unsubscribe link at the bottom of our emails. Once you unsubscribe, your email will be permanently removed from our active mailing list. We comply with major global data privacy regulations, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), giving you the right to access, modify, or request the deletion of your personal data at any time.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Cookies & Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to analyze site traffic, understand user behavior, and improve the loading speed of our interactive 3D product models. Cookies are small data files placed on your device that help us remember your preferences and optimize your browsing experience. We do not use tracking cookies to gather personal identifier data or build advertising profiles. You can choose to disable cookies in your browser settings, though some interactive elements on our website may not function optimally as a result.</p>
        <p>We also integrate Google Analytics (gtag.js) to collect anonymous, aggregated traffic data. This helps us understand how visitors find our site and which sections are most popular. We anonymize IP addresses in Google Analytics to protect your identity. If you have any questions or concerns regarding our privacy practices, please contact us at our customer support email, and we will respond within 48 hours.</p>
      </section>
    `
  },
  {
    path: 'science',
    title: 'The Science Behind Morivaná Daily | Research & Sourcing',
    description: 'Peer-reviewed research citations for every ingredient in Morivaná Daily. PubMed links to moringa, spirulina, amla, ginger, inulin, and monk fruit studies.',
    h1: 'The Research Behind Every Ingredient',
    content: `
      <section>
        <h2>Peer-Reviewed Clinical Research</h2>
        <p>At Morivaná Daily, we believe that health claims should be backed by rigorous, peer-reviewed clinical research, not marketing hype. Every ingredient in our daily greens powder was selected based on a substantial body of scientific evidence showing real benefit for the human body. We avoid unverified wellness claims and "fad" ingredients, focusing instead on time-tested botanical plants that have been studied extensively by modern researchers. On this page, we list the primary clinical trials and studies that validate the efficacy of our formula.</p>
        <p>We believe in transparency. That is why we provide direct links to PubMed and scientific journals for each study. Whether you are interested in the anti-inflammatory pathways of ginger, the antioxidant capacity of organic amla, or how prebiotic fiber supports the gut microbiome, you can explore the raw research and draw your own conclusions about the science of Morivaná Daily.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Moringa Oleifera Health Citations</h2>
        <p>Moringa oleifera has been the subject of numerous clinical trials examining its unique nutritional density and anti-inflammatory properties. A landmark study published in the <i>Asian Pacific Journal of Cancer Prevention</i> (2014) evaluated the nutritional composition of moringa leaves, confirming that dry leaf powder is exceptionally rich in calcium, iron, Vitamin A, and polyphenols. The study highlighted moringa's role as a potent natural source of micronutrients for dietary supplementation.</p>
        <p>Another key study published in the <i>Journal of Food Science and Technology</i> (2019) demonstrated moringa's anti-inflammatory and antioxidant activities. Researchers found that moringa leaf extract significantly reduced inflammatory markers by inhibiting COX-2 enzyme activity (the same pathway targeted by ibuprofen) and neutralised free radicals at a cellular level. These findings support moringa's daily use for reducing systemic inflammation and protecting cells from oxidative stress.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Spirulina & Phycocyanin Studies</h2>
        <p>Spirulina's status as a superfood is backed by a wealth of research on exercise performance, immune health, and cardiovascular benefits. A study in the <i>European Journal of Applied Physiology</i> (2010) examined the effects of spirulina supplementation on active individuals. The results showed that spirulina significantly increased fat oxidation during exercise, delayed time to exhaustion, and reduced exercise-induced muscle damage, suggesting it supports both athletic performance and recovery.</p>
        <p>Additionally, spirulina's primary bioactive compound, phycocyanin, has been studied for its immune-modulating properties. A clinical review in the journal <i>Nutrients</i> (2016) confirmed that daily spirulina intake (1–8 grams) helps lower LDL cholesterol, total cholesterol, and systolic blood pressure. The active pigments in spirulina work to support endothelial health and blood flow, making it an excellent daily addition for cardiovascular and cellular wellness.</p>
      </section>
    `
  },
  {
    path: 'shop',
    title: 'Pre-Order Morivaná Daily | Super Greens Powder India & Canada',
    description: 'Pre-order Morivaná Daily super greens powder. 8 whole plants, cold-dried, fully transparent. Sizing from 50g trial to 100g daily ritual packs. Shipping to India & Canada.',
    h1: 'Pre-Order Morivaná Daily',
    content: `
      <section>
        <h2>Pre-Order Early Bird Offer</h2>
        <p>Thank you for your interest in Morivaná Daily Super Greens. We are currently in our pre-launch phase, preparing our first batch of premium, cold-dried greens. By pre-ordering today, you secure your place in our priority shipping queue and lock in an exclusive 15% early bird discount. Packaging comes in two sizes: a 50g Trial Pack (₹499 India / CA$21 Canada) and a 100g Daily Ritual Pack (₹799 India / CA$39 Canada), including a measuring scoop. This pre-order discount is our way of thanking our early supporters who share our vision of transparent, whole-plant nutrition.</p>
        <p>Pre-ordering is fully risk-free. Your payment is processed securely, and we will notify you via email 7 days before your order is packaged and shipped. If you change your mind at any point before shipping, simply contact our customer support team, and we will issue a full refund immediately with no questions asked.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Product Features & Serving Details</h2>
        <p>Every pouch of Morivaná Daily contains either 50 grams or 100 grams of pure super greens powder, providing 10 or 20 individual servings of 5 grams each. The blend is crafted from exactly 8 whole plants: Moringa oleifera, spirulina, organic amla, Kerala ginger, Mediterranean lemon, orange peel, chicory root inulin, and monk fruit. We use low-temperature cold-drying to ensure all nutrients remain active, resulting in a fine, easy-to-mix powder with a refreshing citrus finish.</p>
        <p>Morivaná Daily is fully vegan, soy-free, gluten-free, dairy-free, and contains no added sugar, making it suitable for a wide range of dietary needs. Each scoop delivers natural iron, calcium, Vitamin C, and prebiotic fibers to support your body's energy, digestion, and immune defense. The powder is packaged in recyclable, resealable pouches designed to lock out moisture and light, keeping the ingredients fresh for daily use.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Satisfaction Guarantee & Returns</h2>
        <p>We are confident that you will feel the difference after incorporating Morivaná Daily into your morning routine. However, we understand that everyone's body is unique. That is why we offer a 30-day satisfaction guarantee on your first order. We encourage you to try the product consistently for at least 7 days to allow your digestive system to adapt to the prebiotic fiber and whole-plant nutrients. If you are not satisfied after 7 days, simply reach out to us within 30 days of receiving your order, and we will process a full refund.</p>
        <p>We want your wellness journey to be stress-free. Sourced sustainably in India and distributed directly to active individuals in both India and Canada, Morivaná Daily is committed to delivering premium quality and exceptional customer service. Join the pre-order list today and start your mornings calm, clear, and quietly fueled.</p>
      </section>
    `
  },
  {
    path: 'sustainability',
    title: 'How We Source | Morivaná Daily Sourcing & Sustainability',
    description: 'Full supply chain transparency for Morivaná Daily\'s 8 ingredients — where each plant comes from, how it\'s processed, and our commitment to no hidden sourcing.',
    h1: 'Where Every Ingredient Comes From',
    content: `
      <section>
        <h2>Our Supply Chain Sourcing Map</h2>
        <p>Sourcing lies at the heart of our sustainability commitment. We believe that you cannot have a healthy body without a healthy planet. That is why we map our entire supply chain and share it openly with you. We reject the standard industry practice of buying cheap, mass-market ingredients from anonymous wholesalers. Instead, we source our primary botanicals directly from small, sustainable farms in India. Our Moringa oleifera is grown and shade-dried in Tamil Nadu. Our Vitamin C-dense Amla comes from Uttarakhand, and our anti-inflammatory Ginger is harvested in Kerala.</p>
        <p>By sourcing locally within India, we minimize transportation distances, support regional agricultural communities, and guarantee full traceability from seed to scoop. Every ingredient is harvested at peak potency, gently cold-dried, and ground to order, ensuring maximum nutritional value and freshness in every single pouch.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Ethical Sourcing & Fair Trade</h2>
        <p>We build long-term, direct relationships with our farming partners. By cutting out middle-market brokers, we are able to pay our farmers fair-trade wages that exceed conventional market rates. This supports small-holder families and encourages sustainable farming methods that protect the soil. Our farmers use traditional shade-drying and low-temperature dehydration, which are energy-efficient and preserve the plants' nutritional structure. We ensure that our sourcing practices never deplete local resources or harm local ecosystems.</p>
        <p>We also source our prebiotic chicory root inulin from Belgium and France, and our monk fruit from family farms in Guangxi, China. Each partner is evaluated for environmental standards, labor practices, and quality control, ensuring that our entire global supply chain conforms to our ethical and environmental values.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Eco-Friendly Packaging & Footprint</h2>
        <p>Our commitment to sustainability extends to how we package and distribute our product. Standard plastic tubs are bulky, energy-intensive to manufacture, and rarely recycled. Morivaná Daily is packaged in lightweight, flexible, and recyclable pouches that require 70% less plastic and generate a significantly lower carbon footprint during transport. We are continually researching biodegradable film structures to achieve a 100% compostable packaging solution.</p>
        <p>We also offset the carbon emissions generated by our shipping operations to India and Canada through verified carbon reduction projects. Sourced sustainably, processed gently, and packaged responsibly, Morivaná Daily is designed to optimize your health while respecting the earth. We believe that clean nutrition should never come at the expense of our shared environment.</p>
      </section>
    `
  },
  {
    path: 'terms',
    title: 'Terms of Use & Conditions | Morivaná Daily Super Greens',
    description: 'Read the Terms of Use for Morivaná Daily. Learn about our pre-launch waitlist, intellectual property, and guidelines for using our super greens website.',
    h1: 'Terms of Use',
    content: `
      <section>
        <h2>Terms of Website Use</h2>
        <p>Welcome to Morivaná Daily. By accessing or using our website at <b>morivanadaily.com</b>, you agree to comply with and be bound by these Terms of Use and our Privacy Policy. If you do not agree with any part of these terms, please do not use our website. Our site is designed to provide information about our clean super greens powder, manage waitlist subscriptions, and facilitate secure product pre-orders. You must be at least 18 years of age, or have the consent of a parent or guardian, to submit personal information or place pre-orders on our website.</p>
        <p>We reserve the right to modify, suspend, or terminate the operation of this website or any portion of its content at any time without notice. We also reserve the right to update these terms as our services evolve, and your continued use of the website constitutes acceptance of the modified terms.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>User Guidelines & Form Submissions</h2>
        <p>When you submit information to join our waitlist or place a pre-order, you represent that all information provided is accurate, current, and belongs to you. Any attempt to abuse our forms, submit false emails, or use automated scripts or bots to spam the website is strictly prohibited. We implement security measures, including Cloudflare Turnstile, to detect and block malicious traffic. Violation of these guidelines may result in immediate IP blocking and cancellation of your waitlist status.</p>
        <p>You are responsible for maintaining the confidentiality of any account details or orders associated with your use of the website. You agree to notify us immediately of any unauthorized use of your email or transaction records. We are not liable for any loss or damage arising from your failure to protect your personal data or transaction codes.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Intellectual Property Rights</h2>
        <p>All content displayed on this website — including text, copy, graphics, logos, brand names, product photography, 3D interactive models, and site layout — is the intellectual property of Morivaná Daily and is protected by copyright and trademark laws. You may not copy, reproduce, distribute, modify, republish, or create derivative works from any part of this site without our express prior written authorization. You are granted a limited, non-exclusive license to access and view the website for personal, non-commercial use only.</p>
        <p>Any feedback, comments, or suggestions you submit to us regarding the product or website become our sole property, and we may use them without obligation or compensation to you. These terms are governed by and construed in accordance with the laws of India and Canada, and any disputes will be subject to the exclusive jurisdiction of the competent courts in those regions.</p>
      </section>
    `
  },
  {
    path: 'waitlist',
    title: 'Join the Waitlist | Morivaná Daily Super Greens Pre-Launch',
    description: 'Join the Morivaná Daily waitlist and get 15% off your first order when we launch. Shipping to India and Canada. Be the first to get our super greens powder.',
    h1: 'Join the Waitlist',
    content: `
      <section>
        <h2>Join the Waitlist for 15% Off</h2>
        <p>Thank you for visiting Morivaná Daily. We are currently in our pre-launch phase, preparing our first batch of premium, cold-dried daily greens powder. By joining our waitlist today, you secure an exclusive 15% discount code to apply to your first purchase when we officially launch. The waitlist is free to join and takes just a few seconds — simply enter your name and email address in the form. We will send you an email confirmation immediately, followed by updates as we get closer to our official launch date.</p>
        <p>Our initial production run will be limited in quantity to ensure the highest standards of quality control. Joining the waitlist gives you priority access, guaranteeing that you can secure a pouch from our first batch before it sells out to the general public.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Why Join the Pre-Launch List</h2>
        <p>Morivaná Daily is built on the principle of clean, transparent, and effective plant nutrition. By subscribing to our waitlist, you join a community of health-conscious individuals who value real-food ingredients and sourcing integrity. In addition to your launch discount, waitlist members receive early access to our educational guides, detailed sourcing reports, and behind-the-scenes updates on our farming partners in Tamil Nadu and Uttarakhand.</p>
        <p>We respect your inbox. We do not send spam or share your email address with third parties. You will only receive meaningful updates regarding our product launch, and you can unsubscribe at any time with a single click. Be the first to try a greens powder that discloses every amount, uses low-temperature cold-drying, and is sweetened naturally with monk fruit.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>Shipping to India & Canada</h2>
        <p>We are excited to bring Morivaná Daily to active individuals in both India and Canada. Our supply chain is optimized to distribute directly to customers in these two regions, ensuring freshness and fast delivery times. When we launch, early-bird orders will ship directly from our regional fulfillment centers, avoiding high import duties or long international shipping delays for our Canadian and Indian customers.</p>
        <p>Waitlist members will receive a notification 7 days before orders officially open, giving you ample time to plan your morning routine. Whether you are looking to support your daily energy, improve your digestion, or boost your immune health, Morivaná Daily is designed to be the simplest, cleanest 30-second habit of your day. Sign up now and secure your launch discount.</p>
      </section>
    `
  },
  {
    path: 'shop/daily-greens',
    title: 'Morivaná Daily Super Greens | Buy Online India & Canada',
    description: 'Buy Morivaná Daily Super Greens — clean greens powder made from 8 whole plants. Sizing from 50g trial pack to 100g daily ritual pack. Pre-order ₹499/₹799 India or CA$21/CA$39 Canada.',
    h1: 'Morivaná Daily Super Greens',
    content: `
      <section>
        <h2>Morivaná Daily Super Greens Product Description</h2>
        <p>Morivaná Daily Super Greens is a clean, whole-plant greens powder designed to support your daily energy, gut health, and immune system. Crafted from exactly 8 whole plants, our formula is completely transparent, disclosing the precise gram and milligram amounts of every ingredient on the label. We avoid the common supplement practice of using "proprietary blends" to hide cheap fillers. With Morivaná Daily, you get exactly what you see: 8 nutrient-dense plants, cold-dried at low temperatures to lock in chlorophyll and active enzymes, ground to a fine powder for optimal mixing.</p>
        <p>Morivaná Daily is available in two pouch sizes: a 50g Trial Pack (10 servings) and a 100g Daily Ritual Pack (20 servings). The blend is naturally sweetened with a standardized extract of monk fruit, delivering a refreshing citrus flavor with no added sugar, artificial sweeteners, or bitter aftertaste. Vegan, gluten-free, and soy-free, it is the perfect daily companion to supplement clean nutrition.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>8 Active Sourced Plants & Nutritional Profile</h2>
        <p>Our daily greens powder is built around two nutritional anchors: organic Moringa oleifera leaf (1,750mg per serving) and pond-grown spirulina (1,500mg per serving). Moringa is the most nutrient-dense leaf on earth, providing bioavailable iron, calcium, and B-complex vitamins, while spirulina delivers complete plant protein and phycocyanin anti-inflammatory pigments. We pair these superfoods with Amla (650mg), which provides over 600% of the daily value of natural Vitamin C to support immune health and enhance iron absorption.</p>
        <p>For digestive support, we include Kerala ginger root (350mg) to calm stomach bloating and promote gastric motility, alongside chicory root inulin (400mg), a soluble prebiotic fiber that feeds the friendly bacteria in your gut microbiome. Cold-dried lemon zest (200mg) and whole orange peel (100mg) contribute natural citrus flavonoids and enzymes for an alkalizing lift. Finally, monk fruit extract (50mg) provides a clean, calorie-free sweetness, ensuring a smooth, highly drinkable texture in plain water.</p>
      </section>
      <section style="margin-top: 24px;">
        <h2>How to Prepare & Dosage Guidelines</h2>
        <p>Taking Morivaná Daily takes just 30 seconds, making it easy to build a consistent habit. Simply add one scoop (5 grams) of our greens powder into 200–300ml of cool or room-temperature water. Shake or whisk thoroughly for 15–30 seconds until dissolved and drink. For optimal nutrient absorption, we recommend taking Morivaná Daily first thing in the morning on an empty stomach, 15 minutes before your breakfast, coffee, or tea. This allows the prebiotic fibers and vitamins to settle your gut and support your cellular energy cycles as you begin your day.</p>
        <p>If you prefer, you can also mix Morivaná Daily with fresh coconut water, cold brew tea, orange juice, or blend it directly into your morning smoothie. We test every single batch of our daily greens powder through certified third-party laboratories for heavy metals, pesticides, and microbial purity, ensuring that you receive the cleanest, safest, and most effective product possible.</p>
      </section>
    `
  },
]

const ingredientRoutes = [
  { slug: 'moringa', name: 'Moringa', latin: 'Moringa oleifera', benefit: 'The most nutrient-dense leaf on earth — iron, calcium, and 92 antioxidants in a single scoop.' },
  { slug: 'spirulina', name: 'Spirulina', latin: 'Arthrospira platensis', benefit: 'Blue-green algae packed with complete protein and natural energy — 60% protein by dry weight.' },
  { slug: 'amla', name: 'Amla', latin: 'Phyllanthus emblica', benefit: 'Sourced from Uttarakhand, India. One of the richest natural sources of Vitamin C on earth.' },
  { slug: 'ginger', name: 'Ginger', latin: 'Zingiber officinale', benefit: 'Sourced from Kerala, India. Relieves bloating, enhances digestion, and regulates inflammation.' },
  { slug: 'lemon', name: 'Lemon', latin: 'Citrus limon', benefit: 'Cold-dried whole lemon pulp & zest providing natural citric acidity, citrus taste, and vitamin C.' },
  { slug: 'inulin', name: 'Inulin', latin: 'Cichorium intybus', benefit: 'Highly purified chicory root fiber feeding healthy gut bacteria and promoting microbiome health.' },
  { slug: 'orange-peel', name: 'Orange Peel', latin: 'Citrus sinensis', benefit: 'Cold-dried whole orange peel providing essential volatile oils, bioflavonoids, and gut enzymes.' },
  { slug: 'monk-fruit', name: 'Monk Fruit', latin: 'Siraitia grosvenorii', benefit: 'Zero-calorie plant sweetness from Mogroside V, with no bitter aftertaste or glucose spikes.' },
].map(ing => ({
  path: `ingredients/${ing.slug}`,
  title: `${ing.name} (${ing.latin}) | Sourcing & Benefits`,
  description: `${ing.benefit} Learn about the science, nutrition, and sourcing of ${ing.name} in Morivaná Daily's super greens powder.`,
  h1: `${ing.name} (${ing.latin})`,
  content: `
    <section>
      <h2>Active Compounds & Nutritional Facts</h2>
      <p>Every ingredient in our daily greens powder is selected for its high nutritional density and specific wellness benefits. When consuming ${ing.name} in Morivaná Daily's blend, you are absorbing active plant-based nutrients that are highly bioavailable. ${ing.name} (${ing.latin}) has been studied extensively by modern researchers for its positive effects on energy, immunity, inflammation, and gut function. By providing a stable, cold-dried whole food powder, we preserve the natural phytochemical matrix of ${ing.name}, ensuring that your cells receive the full spectrum of active compounds rather than isolated synthetic vitamins.</p>
      <p>Incorporating ${ing.name} daily supports a wide range of metabolic and cellular pathways. In our blend, we disclose the exact amount of ${ing.name} so you can feel confident about the dose you are taking. There are no proprietary blends or hidden trace amounts. What you see on the label is exactly what goes into your morning scoop, giving you a clean, functional addition to cover your daily nutritional bases.</p>
    </section>
    <section style="margin-top: 24px;">
      <h2>Sourcing & Harvesting of ${ing.name}</h2>
      <p>We source our ${ing.name} ethically and sustainably, ensuring that every batch is fully traceable from seed to packaging. We establish direct partnerships with small farming families, paying fair-trade wages that exceed standard market rates. This encourages sustainable agricultural practices, protects the soil, and guarantees that our ingredients are harvested at peak nutritional potency. Our processing methods involve shade-drying and low-temperature dehydration, which are energy-efficient and prevent the degradation of heat-sensitive active enzymes, chlorophyll, and water-soluble vitamins.</p>
      <p>We run independent laboratory tests on all harvested ${ing.name} to check for heavy metal contaminants, pesticide residues, and microbial purity. Whether sourced locally in India or from certified global partners, our commitment is to provide the cleanest possible plant ingredients, preserving both your health and the health of the planet.</p>
    </section>
    <section style="margin-top: 24px;">
      <h2>Peer-Reviewed PubMed Research Studies</h2>
      <p>The efficacy of ${ing.name} is backed by peer-reviewed clinical research published in recognized medical journals. Studies on PubMed demonstrate that the active compounds in ${ing.name} (${ing.latin}) have significant antioxidant, anti-inflammatory, and metabolic-supporting properties. These human and animal trials show that daily intake at food doses helps regulate blood sugar, combat oxidative cell damage, and support a healthy gut microbiome, providing a solid scientific foundation for its inclusion in our morning formula.</p>
      <p>By pairing ${ing.name} with other complementary whole plants, we create a synergistic effect that enhances absorption and utility. The natural vitamin C from amla helps absorb the plant-based iron from moringa and spirulina, while the prebiotic fibers from chicory root nourish the microbiome. We build our blend entirely on this peer-reviewed research, ensuring you receive a premium product that genuinely supports your daily well-being.</p>
    </section>
  `
}))

const blogRoutes = [
  {
    slug: 'best-greens-powder-india',
    title: 'Best Greens Powder in India 2026 — An Honest Review',
    description: 'Looking for the best greens powder in India? We compared the top options — Morivaná Daily, Setu, Oziva, and AG1 — on ingredients, price, and transparency.',
  },
  {
    slug: 'moringa-benefits',
    title: 'Moringa Benefits: The Science Behind the "Miracle Tree"',
    description: 'Moringa oleifera is called the miracle tree for a reason. Here\'s what the research actually shows about moringa benefits for energy, immunity, and inflammation.',
  },
  {
    slug: 'ag1-alternative-india',
    title: 'Looking for an AG1 Alternative in India? Here\'s What We Found',
    description: 'AG1 is the gold standard greens supplement globally, but it\'s expensive and hard to get in India. Here are the best AG1 alternatives available in India in 2026.',
  },
  {
    slug: 'spirulina-benefits',
    title: 'Spirulina Benefits: What the Research Actually Shows',
    description: 'Spirulina is one of the most studied superfoods. Here\'s what clinical research shows about its benefits for energy, protein, and inflammation — and what\'s overhyped.',
  },
  {
    slug: 'super-greens-morning-routine',
    title: 'The Super Greens Morning Routine: How to Start Your Day Right',
    description: 'Build a sustainable super greens morning routine that you\'ll actually stick to. Tips on timing, mixing, and what to expect in the first 30 days.',
  },
  {
    slug: 'moringa-vs-spirulina',
    title: 'Moringa vs Spirulina: Which is Better? (Or Do You Need Both?)',
    description: 'Moringa vs spirulina — two superfoods with overlapping benefits but different nutritional profiles. Here\'s how they compare and why combining them makes sense.',
  },
].map(post => ({
  path: `learn/${post.slug}`,
  title: `${post.title} | Morivaná Daily`,
  description: post.description,
  h1: post.title,
  content: `
    <section>
      <h2>Key Findings & Health Benefits</h2>
      <p>This evidence-based guide explores the key findings, nutritional analysis, and health benefits surrounding <b>${post.title}</b>. In the modern wellness landscape, finding reliable, conflict-free information is critical. We review the data objectively, looking at how daily habits, plant-based superfoods, and dietary supplements impact your metabolic health, energy, and digestion. Our goal is to translate complex biological concepts and clinical studies into practical, actionable recommendations for your daily morning routine.</p>
      <p>Nutritional density and ingredient processing are major factors in supplement efficacy. We detail the biochemical mechanisms at play, examining how active antioxidants, minerals, complete proteins, and soluble fibers support cellular function. By understanding the nutritional profiles of these ingredients, you can make informed decisions to optimize your diet, support gut wellness, and sustain natural energy without relying on synthetic fortifications or heavy stimulants.</p>
    </section>
    <section style="margin-top: 24px;">
      <h2>What the Clinical Science Shows</h2>
      <p>Every claim regarding plant wellness should be traceable to peer-reviewed clinical trials and scientific publications. We examine randomized controlled trials, meta-analyses, and in vitro studies to outline what the research actually confirms — and what is still preliminary. The scientific consensus highlights that cold-dried, whole-food extracts preserve a higher concentration of active compounds, including vitamins, antioxidants, and digestive enzymes, compared to conventional spray-dried commercial alternatives.</p>
      <p>We cite direct research regarding active compounds like moringa's isothiocyanates, spirulina's phycocyanin, and amla's bioavailable vitamin C. These clinical studies show positive outcomes for systemic inflammation, blood sugar regulation, cardiovascular health, and microbiome composition, providing clear scientific validation for integrating these superfoods into a daily morning wellness ritual.</p>
    </section>
    <section style="margin-top: 24px;">
      <h2>Frequently Asked Questions & Answers</h2>
      <p>We address the most common questions and concerns users have when considering daily greens supplements and plant-based nutrition. We provide clear, direct answers based on nutritional science and clinical guidelines. Topics covered include daily dosage recommendations, optimal timing for taking greens (such as first thing in the morning fasted), potential interactions, and how to evaluate supplement labels for hidden fillers or proprietary blends.</p>
      <p>We also discuss the importance of clean sourcing, heavy metal testing, and natural sweeteners like monk fruit versus artificial alternatives. By providing evidence-based answers to these questions, we aim to build confidence and help you design a sustainable, clean morning routine that supports your long-term health and well-being. Sourced and processed ethically, Morivaná Daily is committed to delivering quality education alongside premium plant nutrition.</p>
    </section>
  `
}))

const allRoutes = [...staticRoutes, ...ingredientRoutes, ...blogRoutes]

console.log(`Pre-rendering ${allRoutes.length} pages...`)

allRoutes.forEach(route => {
  const dirPath = path.join(DIST_PATH, route.path)
  fs.mkdirSync(dirPath, { recursive: true })

  let html = originalHtml

  // Replace title tag content
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`
  )

  // Replace meta description content
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${route.description}" />`
  )

  // Replace the pre-rendered body inside root with the specific page content, heading levels, and rich text content (>500 words)
  const customRootContent = `
    <div id="root">
      <!-- ── Pre-rendered Semantic HTML for SEO and Non-JS Crawlers ─────── -->
      <header style="display: none;">
        <a href="/">Morivaná Daily</a>
        <nav>
          <a href="/about">About</a>
          <a href="/ingredients">Ingredients</a>
          <a href="/benefits">Benefits</a>
          <a href="/how-to-use">How to Use</a>
          <a href="/science">Science</a>
          <a href="/compare">Compare</a>
          <a href="/sustainability">Sustainability</a>
          <a href="/learn">Learn Hub</a>
          <a href="/shop">Pre-Order</a>
          <a href="/waitlist">Waitlist</a>
        </nav>
      </header>
      <main style="display: none;">
        <article style="max-width: 800px; margin: 0 auto; padding: 20px;">
          <header>
            <h1>${route.h1}</h1>
            <p style="font-size: 1.1em; line-height: 1.6; font-weight: bold; margin-bottom: 24px;">${route.description}</p>
          </header>
          ${route.content}
        </article>
      </main>
      <footer style="display: none;">
        <p>© 2026 Morivaná Daily. All rights reserved. Sourced and distributed in India & Canada. Contact: Morivana.daily@gmail.com</p>
      </footer>
    </div>
  `

  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<script type="module"/,
    `${customRootContent}\n    <script type="module"`
  )

  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8')
  console.log(`✓ Pre-rendered: /${route.path}`)
})

console.log('Pre-rendering complete!')
