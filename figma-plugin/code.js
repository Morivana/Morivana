// ─────────────────────────────────────────────────────────
//  MORIVANA — Figma Design Generator Plugin
//  Generates the complete "Launching Soon" website design
//  Desktop (1440px) + Mobile (390px) pages
// ─────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 280, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'generate') return;

  try {
    status('Loading fonts…');
    await loadFonts();

    status('Building Desktop page…');
    await buildDesktopPage();

    status('Building Mobile page…');
    await buildMobilePage();

    status('Building Design Tokens page…');
    await buildTokensPage();

    figma.ui.postMessage({ text: '✅ All done!', done: true });
    figma.notify('✅ Morivana design generated — 3 pages created!', { timeout: 4000 });
  } catch (err) {
    figma.ui.postMessage({ text: `❌ Error: ${err.message}`, done: true });
    figma.notify(`Error: ${err.message}`, { error: true });
  }
};

// ─── DESIGN TOKENS ───────────────────────────────────────

const C = {
  greenDark:   hex('#1a3a1a'),
  greenMid:    hex('#2d6b2d'),
  greenBright: hex('#4caf50'),
  greenLight:  hex('#8bc34a'),
  citrus:      hex('#c8e630'),
  citrusDim:   hex('#a8c020'),
  cream:       hex('#f5f0dc'),
  warmWhite:   hex('#faf8f0'),
  dark:        hex('#0d1f0d'),
  darkBg:      hex('#0a1a0a'),
  orange:      hex('#e87c20'),
};

function hex(h) {
  const r = parseInt(h.slice(1,3),16)/255;
  const g = parseInt(h.slice(3,5),16)/255;
  const b = parseInt(h.slice(5,7),16)/255;
  return {r,g,b};
}

const F_DISPLAY   = { family: 'Bebas Neue',       style: 'Regular' };
const F_CONDENSED = { family: 'Barlow Condensed',  style: 'Bold'    };
const F_COND_REG  = { family: 'Barlow Condensed',  style: 'Regular' };
const F_BODY      = { family: 'Barlow',             style: 'Regular' };
const F_BODY_MED  = { family: 'Barlow',             style: 'Medium'  };

// ─── FONT LOADER ─────────────────────────────────────────

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync(F_DISPLAY),
    figma.loadFontAsync(F_CONDENSED),
    figma.loadFontAsync(F_COND_REG),
    figma.loadFontAsync(F_BODY),
    figma.loadFontAsync(F_BODY_MED),
  ]);
}

// ─── HELPERS ─────────────────────────────────────────────

function status(t) { figma.ui.postMessage({ text: t }); }

function solidFill(color, opacity = 1) {
  return [{ type: 'SOLID', color, opacity }];
}

function solidStroke(color, opacity = 1) {
  return [{ type: 'SOLID', color, opacity }];
}

function frame(name, w, h, x = 0, y = 0, bg = null) {
  const f = figma.createFrame();
  f.name = name; f.resize(w, h); f.x = x; f.y = y;
  f.fills = bg ? solidFill(bg) : [];
  f.clipsContent = false;
  return f;
}

function rect(w, h, x, y, color, opacity = 1, radius = 0) {
  const r = figma.createRectangle();
  r.resize(w, h); r.x = x; r.y = y;
  r.fills = solidFill(color, opacity);
  if (radius) r.cornerRadius = radius;
  return r;
}

function ellipse(w, h, x, y, color, opacity = 1) {
  const e = figma.createEllipse();
  e.resize(w, h); e.x = x; e.y = y;
  e.fills = solidFill(color, opacity);
  return e;
}

function line(x, y, len, color, weight = 2, opacity = 1, dashed = false) {
  const l = figma.createLine();
  l.x = x; l.y = y; l.resize(len, 0);
  l.strokes = solidStroke(color, opacity);
  l.strokeWeight = weight;
  if (dashed) l.dashPattern = [6, 6];
  return l;
}

async function txt(content, {
  font = F_BODY, size = 16, color = C.cream, opacity = 1,
  align = 'LEFT', lineH = null, letterSp = null,
  w = null, autoResize = 'WIDTH_AND_HEIGHT'
} = {}) {
  const t = figma.createText();
  t.fontName = font;
  t.characters = content;
  t.fontSize = size;
  t.fills = solidFill(color, opacity);
  t.textAlignHorizontal = align;
  if (lineH) t.lineHeight = { value: lineH, unit: 'PIXELS' };
  if (letterSp !== null) t.letterSpacing = { value: letterSp, unit: 'PERCENT' };
  if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); }
  else { t.textAutoResize = autoResize; }
  return t;
}

function place(node, x, y, parent) {
  node.x = x; node.y = y;
  if (parent) parent.appendChild(node);
  return node;
}

// Center a node horizontally within a container width
function centerX(node, containerW) {
  node.x = Math.round((containerW - node.width) / 2);
  return node;
}

// ─── NAV PILL ────────────────────────────────────────────

async function navPill(label, x, y, parent) {
  const f = frame(`Pill — ${label}`, 100, 34);
  f.fills = [];
  f.strokes = solidStroke(C.citrusDim);
  f.strokeWeight = 2;
  f.cornerRadius = 999;

  const t = await txt(label.toUpperCase(), { font: F_CONDENSED, size: 12, color: C.citrus, letterSp: 8 });
  t.x = 16; t.y = Math.round((34 - t.height) / 2);
  f.resize(t.width + 32, 34);
  f.appendChild(t);
  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─── CTA BUTTON ──────────────────────────────────────────

async function ctaButton(label, x, y, w, h, parent, bgColor = C.citrus, textColor = C.dark) {
  const f = frame(`CTA — ${label}`, w, h);
  f.fills = solidFill(bgColor);
  f.cornerRadius = 999;

  const t = await txt(label.toUpperCase(), { font: F_CONDENSED, size: 14, color: textColor, letterSp: 12 });
  t.textAlignHorizontal = 'CENTER';
  t.x = Math.round((w - t.width) / 2);
  t.y = Math.round((h - t.height) / 2);
  f.appendChild(t);
  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─── SECTION KICKER ──────────────────────────────────────

async function kicker(content, x, y, parent, color = C.greenLight, centerIn = null) {
  const t = await txt(content, { font: F_CONDENSED, size: 12, color, letterSp: 30 });
  if (centerIn) centerX(t, centerIn);
  else t.x = x;
  t.y = y;
  if (parent) parent.appendChild(t);
  return t;
}

// ─── INGREDIENT ROW ──────────────────────────────────────

async function ingredientRow(icon, name, benefit, x, y, parent, W = 580) {
  const f = frame(`Ingredient — ${name}`, W, 60);
  f.fills = solidFill(C.citrus, 0.04);
  f.cornerRadius = 10;
  f.strokes = solidStroke(C.citrusDim, 0.15);
  f.strokeWeight = 1;

  const circle = ellipse(44, 44, 8, 8, C.citrus, 0.08);
  circle.strokes = solidStroke(C.citrusDim);
  circle.strokeWeight = 2;
  f.appendChild(circle);

  const iconT = await txt(icon, { font: F_BODY, size: 20, color: C.cream });
  iconT.x = 16; iconT.y = 18;
  f.appendChild(iconT);

  const nameT = await txt(name, { font: F_CONDENSED, size: 13, color: C.citrus, letterSp: 20 });
  nameT.x = 64; nameT.y = 8;
  f.appendChild(nameT);

  const descT = await txt(benefit, { font: F_BODY, size: 11, color: C.cream, opacity: 0.75, w: W - 72 });
  descT.x = 64; descT.y = 30;
  f.appendChild(descT);

  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─── BENEFIT CARD ────────────────────────────────────────

async function benefitCard(icon, title, desc, x, y, parent, W = 560) {
  const f = frame(`Benefit — ${title}`, W, 92);
  f.fills = solidFill(C.dark);
  f.cornerRadius = 12;

  const accent = rect(W, 3, 0, 0, C.citrus);
  f.appendChild(accent);

  const iconT = await txt(icon, { font: F_BODY, size: 22, color: C.cream });
  iconT.x = 20; iconT.y = 28;
  f.appendChild(iconT);

  const titleT = await txt(title, { font: F_CONDENSED, size: 13, color: C.citrus, letterSp: 20 });
  titleT.x = 60; titleT.y = 18;
  f.appendChild(titleT);

  const descT = await txt(desc, { font: F_BODY, size: 13, color: C.cream, opacity: 0.85, w: W - 72 });
  descT.x = 60; descT.y = 42;
  f.appendChild(descT);

  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─── STEP CARD ───────────────────────────────────────────

async function stepCard(num, title, body, x, y, parent) {
  const W = 280, H = 200;
  const f = frame(`Step ${num} — ${title}`, W, H);
  f.fills = solidFill(C.citrus, 0.06);
  f.cornerRadius = 16;
  f.strokes = solidStroke(C.citrusDim);
  f.strokeWeight = 2;

  const numT = await txt(`STEP ${num}`, { font: F_CONDENSED, size: 11, color: C.greenLight, letterSp: 30, align: 'CENTER', w: W });
  numT.x = 0; numT.y = 24;
  f.appendChild(numT);

  const titleT = await txt(title, { font: F_DISPLAY, size: 64, color: C.citrus, align: 'CENTER', w: W });
  titleT.x = 0; titleT.y = 50;
  f.appendChild(titleT);

  const bodyT = await txt(body, { font: F_BODY, size: 14, color: C.cream, align: 'CENTER', lineH: 22, w: W - 40 });
  bodyT.x = 20; bodyT.y = 132;
  f.appendChild(bodyT);

  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─── FORM FIELD ──────────────────────────────────────────

async function formField(placeholder, x, y, w, parent) {
  const f = frame(`Field — ${placeholder}`, w, 52);
  f.fills = solidFill(C.citrus, 0.08);
  f.cornerRadius = 999;
  f.strokes = solidStroke(C.citrusDim);
  f.strokeWeight = 2;

  const ph = await txt(placeholder, { font: F_COND_REG, size: 16, color: C.citrusDim, opacity: 0.5 });
  ph.x = 24; ph.y = Math.round((52 - ph.height) / 2);
  f.appendChild(ph);
  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─── 3D CANVAS PLACEHOLDER ───────────────────────────────

async function canvasPlaceholder(note, x, y, w, h, parent, bg = C.greenDark) {
  const f = frame('3D Canvas (WebGL)', w, h);
  f.fills = solidFill(bg, 0.4);
  f.cornerRadius = 12;
  f.strokes = solidStroke(C.citrusDim, 0.3);
  f.strokeWeight = 1;
  f.dashPattern = [8, 8];

  const t = await txt(note, { font: F_CONDENSED, size: 15, color: C.citrusDim, align: 'CENTER', lineH: 24, w: w - 40 });
  t.x = 20; t.y = Math.round((h - t.height) / 2);
  f.appendChild(t);
  f.x = x; f.y = y;
  if (parent) parent.appendChild(f);
  return f;
}

// ─────────────────────────────────────────────────────────
//  DESKTOP PAGE SECTIONS  (1440px wide)
// ─────────────────────────────────────────────────────────

async function buildDesktopPage() {
  // Rename current page
  const page = figma.currentPage;
  page.name = '🖥 Desktop — 1440px';

  const PAGE_W = 1440;
  const PADDING = 64;
  let Y = 0;

  // ── NAVBAR ──────────────────────────────────────────────
  status('Section 1/8 — Navbar');
  const nav = frame('Navbar', PAGE_W, 64, 0, Y, C.greenDark);
  nav.fills = solidFill(C.greenDark, 0.92);

  // Bottom border
  nav.appendChild(line(0, 63, PAGE_W, C.citrusDim, 2, 0.7, true));

  // Left pills
  const leftPillLabels = ['Ingredients', 'Benefits', 'How To Use'];
  let lx = PADDING;
  for (const lbl of leftPillLabels) {
    const p = await navPill(lbl, lx, 15, nav);
    lx += p.width + 10;
  }

  // Center logo
  const logoName = await txt('MORIVANA', { font: F_DISPLAY, size: 26, color: C.citrus });
  centerX(logoName, PAGE_W); logoName.y = 8; nav.appendChild(logoName);
  const logoSub = await txt('CLEAN SUPER GREENS', { font: F_CONDENSED, size: 11, color: C.greenLight, letterSp: 25 });
  centerX(logoSub, PAGE_W); logoSub.y = 38; nav.appendChild(logoSub);

  // Right pills + CTA
  const notifyBtn = await ctaButton('Notify Me 🌿', 0, 10, 148, 44, nav);
  notifyBtn.x = PAGE_W - PADDING - notifyBtn.width;
  const aboutPill = await navPill('About', 0, 15, nav);
  aboutPill.x = notifyBtn.x - aboutPill.width - 10;

  page.appendChild(nav);
  Y += 64;

  // ── HERO ────────────────────────────────────────────────
  status('Section 2/8 — Hero');
  const hero = frame('Hero', PAGE_W, 900, 0, Y, C.greenDark);
  // Radial glow overlay
  const glow = rect(PAGE_W, 900, 0, 0, C.greenMid, 0.15);
  hero.appendChild(glow);

  // Left column text
  await kicker('CLEAN SUPER GREENS POWDER', PADDING, 144, hero);

  const heroHL = await txt('PURE\nGREENS', { font: F_DISPLAY, size: 160, color: C.citrus, lineH: 140, w: 560 });
  place(heroHL, PADDING, 172, hero);

  hero.appendChild(line(PADDING, 508, 400, C.citrusDim, 3, 1, true));

  const heroSub = await txt('MORINGA BLEND', { font: F_CONDENSED, size: 14, color: C.greenLight, letterSp: 25 });
  place(heroSub, PADDING, 524, hero);

  const heroBody = await txt(
    'Bold nutrition from the power of moringa.\nCrafted for those who crave better health.',
    { font: F_BODY, size: 17, color: C.cream, lineH: 28, w: 380 }
  );
  place(heroBody, PADDING, 555, hero);

  await ctaButton('JOIN THE WAITLIST — GET 15% OFF', PADDING, 628, 400, 52, hero);

  const trust = await txt('50g · 10 Servings · Ships India & Canada', { font: F_COND_REG, size: 12, color: C.greenLight, letterSp: 15 });
  place(trust, PADDING, 698, hero);

  // Countdown
  const ctLabel = await txt('LAUNCHING IN', { font: F_CONDENSED, size: 10, color: C.greenLight, letterSp: 25 });
  place(ctLabel, PADDING, 726, hero);

  const cdUnits = [
    { val: '44', unit: 'DAYS',    x: PADDING },
    { val: '23', unit: 'HOURS',   x: PADDING + 86 },
    { val: '59', unit: 'MINUTES', x: PADDING + 186 },
    { val: '00', unit: 'SECONDS', x: PADDING + 300 },
  ];
  for (const u of cdUnits) {
    const num = await txt(u.val, { font: F_DISPLAY, size: 44, color: C.citrus });
    place(num, u.x, 742, hero);
    const lbl = await txt(u.unit, { font: F_CONDENSED, size: 10, color: C.greenLight, letterSp: 20 });
    place(lbl, u.x, 794, hero);
    if (u.unit !== 'SECONDS') {
      const sep = await txt(':', { font: F_DISPLAY, size: 40, color: C.citrusDim, opacity: 0.6 });
      place(sep, u.x + 50, 742, hero);
    }
  }

  // Scroll indicator
  const scrollLbl = await txt('SCROLL', { font: F_CONDENSED, size: 10, color: C.citrusDim, letterSp: 30, opacity: 0.5 });
  centerX(scrollLbl, PAGE_W); scrollLbl.y = 850; hero.appendChild(scrollLbl);
  const scrollLine = rect(1, 36, 0, 868, C.citrusDim, 0.4);
  scrollLine.x = Math.round(PAGE_W / 2); hero.appendChild(scrollLine);

  // Right — 3D canvas area
  await canvasPlaceholder(
    '3D Product Model\n(highres.glb)\n\nIdle float + slow Y rotation\nScroll → full 360° rotation\n+ scale to 1.15x',
    648, 120, 720, 660, hero
  );

  page.appendChild(hero);
  Y += 900;

  // ── WHAT IS MORIVANA ────────────────────────────────────
  status('Section 3/8 — What Is Morivana');
  const what = frame('What Is Morivana', PAGE_W, 900, 0, Y, C.dark);

  await kicker('NOT JUST A GREENS POWDER', PADDING, 120, what);
  const whatHL = await txt('A MORNING\nRITUAL', { font: F_DISPLAY, size: 100, color: C.citrus, lineH: 88, w: 560 });
  place(whatHL, PADDING, 148, what);

  const whatBody1 = await txt(
    "Morivana Daily Super Greens blends 8 of nature's most powerful superfoods — moringa, spirulina, amla, ginger, lemon, inulin, orange peel, and monk fruit — into one easy daily scoop.",
    { font: F_BODY, size: 16, color: C.cream, lineH: 27, w: 420 }
  );
  place(whatBody1, PADDING, 368, what);

  const whatBody2 = await txt(
    "Made for busy people who don't always get enough nutrients from food. One scoop in water. 30 seconds. Done.",
    { font: F_BODY, size: 16, color: C.cream, lineH: 27, w: 420 }
  );
  place(whatBody2, PADDING, 472, what);

  // 3 highlight blocks
  const highlights = [
    { icon: '🌿', label: 'ENERGIZE', desc: 'Natural energy from moringa & spirulina' },
    { icon: '💧', label: 'REFRESH',  desc: 'Citrus cleanse from lemon & orange peel' },
    { icon: '🌱', label: 'NOURISH',  desc: 'Gut support from inulin prebiotic fiber' },
  ];
  let hy = 570;
  for (const h of highlights) {
    const circle = ellipse(52, 52, PADDING, hy, C.citrus, 0.08);
    circle.strokes = solidStroke(C.citrusDim);
    circle.strokeWeight = 2;
    what.appendChild(circle);

    const iconT = await txt(h.icon, { font: F_BODY, size: 22, color: C.cream });
    place(iconT, PADDING + 14, hy + 14, what);

    const lbl = await txt(h.label, { font: F_CONDENSED, size: 13, color: C.citrus, letterSp: 25 });
    place(lbl, PADDING + 68, hy + 4, what);

    const desc = await txt(h.desc, { font: F_BODY, size: 13, color: C.cream, opacity: 0.8 });
    place(desc, PADDING + 68, hy + 24, what);

    hy += 68;
  }

  // Right — sticky canvas note
  await canvasPlaceholder(
    '3D Model (Sticky)\n\nBehavior: tilts 15° on X axis\n+ slight zoom in\nas user scrolls through section',
    720, 100, 660, 700, what
  );

  page.appendChild(what);
  Y += 900;

  // ── INGREDIENTS ─────────────────────────────────────────
  status('Section 4/8 — Ingredients');
  const ing = frame('Ingredients', PAGE_W, 900, 0, Y, C.darkBg);

  await kicker('CLEAN LABEL', PADDING, 80, ing);
  const ingHL = await txt("WHAT'S INSIDE\nEVERY SCOOP", { font: F_DISPLAY, size: 72, color: C.citrus, lineH: 64, w: 560 });
  place(ingHL, PADDING, 104, ing);

  const ingredients = [
    ['🌿', 'MORINGA POWDER',  'The most nutrient-dense plant on earth. Iron, calcium & antioxidants.'],
    ['🔵', 'SPIRULINA',        'Blue-green algae powerhouse for protein and energy.'],
    ['🍊', 'AMLA',             'Vitamin C from the Indian gooseberry. Immunity & skin.'],
    ['🫚', 'GINGER POWDER',    'Soothes digestion. Reduces inflammation naturally.'],
    ['🍋', 'LEMON POWDER',     'Natural detox. Alkalizing effect on your body.'],
    ['🌾', 'INULIN',           'Prebiotic fiber that feeds your gut microbiome.'],
    ['🍊', 'ORANGE PEEL',      'Flavonoids and digestive enzymes from whole citrus.'],
    ['🍈', 'MONK FRUIT',       'Zero-calorie natural sweetener. No sugar spike.'],
  ];

  let iy = 254;
  for (const [icon, name, benefit] of ingredients) {
    await ingredientRow(icon, name, benefit, PADDING, iy, ing);
    iy += 70;
  }

  // Cert badges
  const certs = ['Vegan', 'Soy-Free', 'No Added Sugar', 'No Artificial Sweeteners'];
  let cx = PADDING;
  for (const c of certs) {
    const badge = frame(`Badge — ${c}`, 140, 28);
    badge.fills = solidFill(C.citrus);
    badge.cornerRadius = 999;
    const bt = await txt(c, { font: F_CONDENSED, size: 11, color: C.dark, letterSp: 12 });
    bt.x = Math.round((badge.width - bt.width) / 2);
    bt.y = Math.round((28 - bt.height) / 2);
    badge.appendChild(bt);
    badge.resize(bt.width + 24, 28);
    badge.x = cx; badge.y = 830;
    ing.appendChild(badge);
    cx += badge.width + 10;
  }

  await canvasPlaceholder(
    '3D Model (Sticky)\n\nBehavior: rotates 180° on Y\nto show back label\nwhen 50% scrolled through section',
    720, 100, 660, 700, ing
  );

  page.appendChild(ing);
  Y += 900;

  // ── BENEFITS ────────────────────────────────────────────
  status('Section 5/8 — Benefits');
  const ben = frame('Benefits', PAGE_W, 900, 0, Y, C.citrus);

  const benKicker = await txt('WHY MORIVANA WORKS', { font: F_CONDENSED, size: 12, color: C.dark, opacity: 0.6, letterSp: 30 });
  place(benKicker, PADDING, 80, ben);
  const benHL = await txt('FEEL THE DIFFERENCE\nFROM DAY ONE', { font: F_DISPLAY, size: 72, color: C.dark, lineH: 64, w: 560 });
  place(benHL, PADDING, 108, ben);

  const benefits = [
    ['⚡', 'ALL-DAY ENERGY',     'No caffeine crash. Moringa + spirulina fuel you naturally.'],
    ['🌿', 'BETTER DIGESTION',   'Ginger + inulin = smoother gut, every morning.'],
    ['🛡️','STRONGER IMMUNITY',  'Amla + lemon = daily vitamin C hit.'],
    ['✨', 'CLEARER SKIN',        'Antioxidant load from moringa fights free radicals.'],
    ['⏱️','30-SECOND HABIT',    'One scoop. No blending. No prep. Just results.'],
  ];
  let by = 264;
  for (const [icon, title, desc] of benefits) {
    await benefitCard(icon, title, desc, PADDING, by, ben);
    by += 106;
  }

  await canvasPlaceholder(
    '3D Model (Sticky)\n\nBehavior: returns to front view,\ngreen emissive glow on materials\n(emissiveIntensity 0→0.4)',
    720, 60, 660, 780, ben, C.greenDark
  );

  page.appendChild(ben);
  Y += 900;

  // ── HOW TO USE ──────────────────────────────────────────
  status('Section 6/8 — How To Use');
  const how = frame('How To Use', PAGE_W, 700, 0, Y, C.greenDark);

  await kicker('SIMPLE AS 1-2-3', 0, 60, how, C.greenLight, PAGE_W);
  const howHL = await txt('YOUR 30-SECOND\nMORNING RITUAL', { font: F_DISPLAY, size: 72, color: C.citrus, align: 'CENTER', lineH: 64, w: PAGE_W });
  place(howHL, 0, 92, how);

  const steps = [
    ['01', 'ADD',   '1 scoop\n(5g)'],
    ['02', 'MIX',   'With 200ml water,\nmilk, or smoothie'],
    ['03', 'DRINK', 'Start your day\nfeeling good'],
  ];
  const totalStepsW = 280 * 3 + 80 * 2;
  let sx = Math.round((PAGE_W - totalStepsW) / 2);
  for (let i = 0; i < steps.length; i++) {
    await stepCard(...steps[i], sx, 258, how);
    if (i < 2) {
      // Arrow
      const arrowLine = line(sx + 280 + 10, 258 + 100, 52, C.citrusDim, 2.5);
      how.appendChild(arrowLine);
      const arrowHead = await txt('▶', { font: F_BODY, size: 12, color: C.citrusDim });
      place(arrowHead, sx + 280 + 52, 258 + 94, how);
    }
    sx += 280 + 80;
  }

  // Mix chips
  const mixLabel = await txt('TRY IT WITH:', { font: F_CONDENSED, size: 11, color: C.greenLight, letterSp: 30 });
  centerX(mixLabel, PAGE_W); mixLabel.y = 498; how.appendChild(mixLabel);

  const mixOpts = ['Water', 'Coconut Water', 'Warm Milk', 'Morning Smoothie'];
  // Lay them out left-to-right centered
  const tempChips = [];
  let totalChipW = 0;
  for (const opt of mixOpts) {
    const t = await txt(opt.toUpperCase(), { font: F_CONDENSED, size: 12, color: C.citrus, letterSp: 8 });
    const chipW = t.width + 32;
    totalChipW += chipW + 12;
    tempChips.push({ label: opt, w: chipW });
    t.characters = ''; // cleanup
  }
  let chipX = Math.round((PAGE_W - (totalChipW - 12)) / 2);
  for (const ch of tempChips) {
    await navPill(ch.label, chipX, 526, how);
    chipX += ch.w + 12;
  }

  // Pro tip
  const tipBox = frame('Pro Tip Box', 560, 72, Math.round((PAGE_W - 560) / 2), 598);
  tipBox.fills = solidFill(C.citrus, 0.07);
  tipBox.cornerRadius = 12;
  tipBox.strokes = solidStroke(C.citrusDim);
  tipBox.strokeWeight = 2;
  const tipT = await txt(
    '💡  PRO TIP: Best taken in the morning on an empty stomach for maximum nutrient absorption.',
    { font: F_BODY, size: 14, color: C.cream, lineH: 22, w: 520 }
  );
  tipT.x = 20; tipT.y = 12; tipBox.appendChild(tipT);
  how.appendChild(tipBox);

  page.appendChild(how);
  Y += 700;

  // ── WAITLIST CTA ────────────────────────────────────────
  status('Section 7/8 — Waitlist CTA');
  const cta = frame('Waitlist CTA', PAGE_W, 800, 0, Y, C.greenDark);

  // Radial glow
  const ctaGlow = ellipse(1000, 700, 220, 100, C.citrus, 0.08);
  cta.appendChild(ctaGlow);

  await kicker('LIMITED FIRST BATCH · INDIA & CANADA', 0, 100, cta, C.greenLight, PAGE_W);

  const ctaHL = await txt('BE THE FIRST\nTO TRY MORIVANA', { font: F_DISPLAY, size: 100, color: C.citrus, align: 'CENTER', lineH: 88, w: PAGE_W });
  place(ctaHL, 0, 132, cta);

  const ctaSub = await txt(
    'Sign up for early access and get an exclusive launch discount.\nLimited first batch available.',
    { font: F_BODY, size: 16, color: C.cream, opacity: 0.85, align: 'CENTER', lineH: 26, w: 600 }
  );
  ctaSub.x = Math.round((PAGE_W - 600) / 2); ctaSub.y = 348; cta.appendChild(ctaSub);

  const formX = Math.round((PAGE_W - 480) / 2);
  await formField('Your first name',    formX, 424, 480, cta);
  await formField('Your email address', formX, 488, 480, cta);
  await ctaButton('NOTIFY ME →',        formX, 552, 480, 52, cta);

  const trustLine = await txt('🔒 No spam. Unsubscribe anytime.', { font: F_BODY, size: 13, color: C.greenLight, align: 'CENTER', w: PAGE_W, opacity: 0.7 });
  place(trustLine, 0, 622, cta);

  // Social proof avatars
  const avatarColors = [C.greenBright, C.greenLight, C.citrus, C.citrusDim, C.greenMid];
  const avatarStartX = Math.round(PAGE_W / 2) - 72;
  for (let i = 0; i < 5; i++) {
    const av = ellipse(28, 28, avatarStartX + i * 20, 700, avatarColors[i]);
    av.strokes = solidStroke(C.dark);
    av.strokeWeight = 2;
    cta.appendChild(av);
  }
  const spText = await txt('500+ people already on the waitlist', { font: F_CONDENSED, size: 15, color: C.cream, letterSp: 5 });
  spText.x = avatarStartX + 5 * 20 + 12; spText.y = 706; cta.appendChild(spText);

  page.appendChild(cta);
  Y += 800;

  // ── FOOTER ──────────────────────────────────────────────
  status('Section 8/8 — Footer');
  const footer = frame('Footer', PAGE_W, 220, 0, Y, C.dark);
  footer.appendChild(line(0, 0, PAGE_W, C.citrusDim, 3, 0.7, true));

  // Col 1
  const ftBrand = await txt('MORIVANA', { font: F_DISPLAY, size: 48, color: C.citrus });
  place(ftBrand, PADDING, 48, footer);
  const ftTag = await txt('Clean Super Greens', { font: F_CONDENSED, size: 14, color: C.greenLight, letterSp: 20 });
  place(ftTag, PADDING, 108, footer);
  const ftEst = await txt('Est. 2024', { font: F_COND_REG, size: 12, color: C.citrusDim });
  place(ftEst, PADDING, 130, footer);

  // Col 2 links
  const ftLinks = ['Instagram', 'Recipes', 'About', 'Contact', 'Privacy Policy'];
  let flx = 500;
  for (const link of ftLinks) {
    const t = await txt(link.toUpperCase(), { font: F_CONDENSED, size: 13, color: C.citrusDim, letterSp: 15 });
    place(t, flx, 88, footer);
    flx += t.width + 24;
  }

  // Col 3 legal
  const legal = await txt('© 2024 Morivana. All rights reserved.\nShipping to India & Canada.', { font: F_BODY, size: 13, color: C.cream, opacity: 0.5, lineH: 21 });
  place(legal, 1100, 80, footer);

  // Bottom cert bar
  footer.appendChild(line(PADDING, 168, PAGE_W - PADDING * 2, C.citrusDim, 1, 0.2));
  const certLabels = ['✓  Vegan', '✓  Soy-Free', '✓  No Added Sugar', '✓  No Artificial Sweeteners'];
  let certX = PADDING;
  for (const c of certLabels) {
    const t = await txt(c, { font: F_CONDENSED, size: 11, color: C.citrusDim, letterSp: 15 });
    place(t, certX, 180, footer);
    certX += t.width + 48;
  }

  page.appendChild(footer);

  // Frame everything into one master frame
  figma.viewport.scrollAndZoomIntoView(page.children);
}

// ─────────────────────────────────────────────────────────
//  MOBILE PAGE  (390px wide)
// ─────────────────────────────────────────────────────────

async function buildMobilePage() {
  const mobilePage = figma.createPage();
  mobilePage.name = '📱 Mobile — 390px';
  figma.currentPage = mobilePage;

  const W = 390;
  const PAD = 24;
  let Y = 0;

  // Mobile Navbar
  const nav = frame('Navbar (Mobile)', W, 56, 0, Y, C.greenDark);
  nav.appendChild(line(0, 55, W, C.citrusDim, 2, 0.6, true));
  const mLogo = await txt('MORIVANA', { font: F_DISPLAY, size: 22, color: C.citrus });
  mLogo.x = Math.round((W - mLogo.width) / 2); mLogo.y = 10;
  nav.appendChild(mLogo);
  const hamburger = await txt('☰', { font: F_BODY, size: 20, color: C.citrus });
  place(hamburger, W - PAD - hamburger.width, 14, nav);
  mobilePage.appendChild(nav);
  Y += 56;

  // Mobile Hero
  const mHero = frame('Hero (Mobile)', W, 680, 0, Y, C.greenDark);

  await kicker('CLEAN SUPER GREENS POWDER', PAD, 36, mHero);
  const mHL = await txt('PURE\nGREENS', { font: F_DISPLAY, size: 90, color: C.citrus, lineH: 80, w: W - PAD * 2 });
  place(mHL, PAD, 64, mHero);

  mHero.appendChild(line(PAD, 268, 240, C.citrusDim, 2, 1, true));

  const mSub = await txt('MORINGA BLEND', { font: F_CONDENSED, size: 13, color: C.greenLight, letterSp: 25 });
  place(mSub, PAD, 284, mHero);

  // Mobile product image placeholder
  await canvasPlaceholder('Product Image\n(packaging_highres.png)', PAD, 316, W - PAD * 2, 200, mHero);

  const mBody = await txt('Bold nutrition from the power of moringa.\nCrafted for those who crave better health.', { font: F_BODY, size: 15, color: C.cream, lineH: 24, w: W - PAD * 2 });
  place(mBody, PAD, 530, mHero);

  await ctaButton('JOIN THE WAITLIST', PAD, 594, W - PAD * 2, 48, mHero);
  mobilePage.appendChild(mHero);
  Y += 680;

  // Mobile Ingredients (stacked)
  const mIng = frame('Ingredients (Mobile)', W, 740, 0, Y, C.darkBg);
  await kicker('CLEAN LABEL', PAD, 40, mIng);
  const mIngHL = await txt("WHAT'S INSIDE", { font: F_DISPLAY, size: 56, color: C.citrus, w: W - PAD * 2 });
  place(mIngHL, PAD, 64, mIng);

  const mIngredients = [
    ['🌿', 'MORINGA POWDER',  'Iron, calcium & antioxidants.'],
    ['🔵', 'SPIRULINA',        'Protein and energy powerhouse.'],
    ['🍊', 'AMLA',             'Vitamin C & immunity boost.'],
    ['🫚', 'GINGER POWDER',    'Soothes digestion.'],
    ['🍋', 'LEMON POWDER',     'Natural detox.'],
    ['🌾', 'INULIN',           'Prebiotic gut fiber.'],
    ['🍊', 'ORANGE PEEL',      'Digestive enzymes.'],
    ['🍈', 'MONK FRUIT',       'Zero-calorie sweetener.'],
  ];
  let miy = 150;
  for (const [icon, name, benefit] of mIngredients) {
    await ingredientRow(icon, name, benefit, PAD, miy, mIng, W - PAD * 2);
    miy += 68;
  }
  mobilePage.appendChild(mIng);
  Y += 740;

  // Mobile Benefits (stacked cards)
  const mBen = frame('Benefits (Mobile)', W, 640, 0, Y, C.citrus);
  const mBenHL = await txt('FEEL THE\nDIFFERENCE', { font: F_DISPLAY, size: 60, color: C.dark, lineH: 56, w: W - PAD * 2 });
  place(mBenHL, PAD, 40, mBen);
  const mBenefits = [
    ['⚡', 'ALL-DAY ENERGY',   'No caffeine crash.'],
    ['🌿', 'BETTER DIGESTION', 'Smoother gut every morning.'],
    ['🛡️','STRONGER IMMUNITY','Daily vitamin C hit.'],
    ['✨', 'CLEARER SKIN',      'Antioxidants fight free radicals.'],
    ['⏱️','30-SECOND HABIT',  'One scoop. Just results.'],
  ];
  let mby = 160;
  for (const [icon, title, desc] of mBenefits) {
    await benefitCard(icon, title, desc, PAD, mby, mBen, W - PAD * 2);
    mby += 90;
  }
  mobilePage.appendChild(mBen);
  Y += 640;

  // Mobile Waitlist
  const mCta = frame('Waitlist CTA (Mobile)', W, 560, 0, Y, C.greenDark);
  await kicker('EARLY ACCESS', 0, 40, mCta, C.greenLight, W);
  const mCtaHL = await txt('BE THE\nFIRST', { font: F_DISPLAY, size: 80, color: C.citrus, align: 'CENTER', lineH: 72, w: W });
  place(mCtaHL, 0, 80, mCta);
  await formField('Your first name',    PAD, 240, W - PAD * 2, mCta);
  await formField('Your email address', PAD, 304, W - PAD * 2, mCta);
  await ctaButton('NOTIFY ME →',        PAD, 368, W - PAD * 2, 48, mCta);
  const mTrust = await txt('🔒 No spam. Unsubscribe anytime.', { font: F_BODY, size: 12, color: C.greenLight, align: 'CENTER', w: W, opacity: 0.7 });
  place(mTrust, 0, 432, mCta);
  mobilePage.appendChild(mCta);
  Y += 560;

  // Mobile Footer
  const mFoot = frame('Footer (Mobile)', W, 180, 0, Y, C.dark);
  mFoot.appendChild(line(0, 0, W, C.citrusDim, 2, 0.6, true));
  const mFtBrand = await txt('MORIVANA', { font: F_DISPLAY, size: 40, color: C.citrus });
  place(mFtBrand, Math.round((W - mFtBrand.width) / 2), 24, mFoot);
  const mFtTag = await txt('Clean Super Greens', { font: F_CONDENSED, size: 13, color: C.greenLight, letterSp: 15, align: 'CENTER', w: W });
  place(mFtTag, 0, 72, mFoot);
  const mFtLinks = await txt('Instagram  ·  About  ·  Contact  ·  Privacy', { font: F_CONDENSED, size: 12, color: C.citrusDim, letterSp: 8, align: 'CENTER', w: W });
  place(mFtLinks, 0, 100, mFoot);
  const mFtLegal = await txt('© 2024 Morivana · India & Canada', { font: F_BODY, size: 11, color: C.cream, opacity: 0.4, align: 'CENTER', w: W });
  place(mFtLegal, 0, 148, mFoot);
  mobilePage.appendChild(mFoot);

  figma.viewport.scrollAndZoomIntoView(mobilePage.children);
}

// ─────────────────────────────────────────────────────────
//  DESIGN TOKENS PAGE
// ─────────────────────────────────────────────────────────

async function buildTokensPage() {
  const tokensPage = figma.createPage();
  tokensPage.name = '🎨 Design Tokens';
  figma.currentPage = tokensPage;

  const bg = frame('Background', 1200, 1100, 0, 0, C.dark);

  // Title
  const title = await txt('MORIVANA — DESIGN TOKENS', { font: F_DISPLAY, size: 52, color: C.citrus });
  place(title, 60, 60, bg);
  const subtitle = await txt('Color palette · Typography · Spacing · Component specs', { font: F_COND_REG, size: 16, color: C.greenLight, letterSp: 15, opacity: 0.8 });
  place(subtitle, 60, 120, bg);
  bg.appendChild(line(60, 150, 1080, C.citrusDim, 1, 0.3));

  // ── COLOR PALETTE ──
  const colorsTitle = await txt('COLOR PALETTE', { font: F_CONDENSED, size: 14, color: C.greenLight, letterSp: 30 });
  place(colorsTitle, 60, 172, bg);

  const palette = [
    { name: 'Green Dark',   hex: '#1a3a1a', color: C.greenDark,   text: C.citrus  },
    { name: 'Green Mid',    hex: '#2d6b2d', color: C.greenMid,    text: C.citrus  },
    { name: 'Green Bright', hex: '#4caf50', color: C.greenBright, text: C.dark    },
    { name: 'Green Light',  hex: '#8bc34a', color: C.greenLight,  text: C.dark    },
    { name: 'Citrus',       hex: '#c8e630', color: C.citrus,      text: C.dark    },
    { name: 'Citrus Dim',   hex: '#a8c020', color: C.citrusDim,   text: C.dark    },
    { name: 'Cream',        hex: '#f5f0dc', color: C.cream,       text: C.dark    },
    { name: 'Dark',         hex: '#0d1f0d', color: C.dark,        text: C.citrus  },
    { name: 'Orange',       hex: '#e87c20', color: C.orange,      text: C.dark    },
  ];

  let px = 60;
  for (const swatch of palette) {
    const swFrame = frame(swatch.name, 100, 120, px, 200);
    swFrame.fills = solidFill(swatch.color);
    swFrame.cornerRadius = 10;
    if (swatch.name === 'Dark') {
      swFrame.strokes = solidStroke(C.citrusDim, 0.4);
      swFrame.strokeWeight = 1;
    }

    const swName = await txt(swatch.name, { font: F_CONDENSED, size: 11, color: swatch.text, letterSp: 5, w: 88 });
    swName.x = 6; swName.y = 72;
    swFrame.appendChild(swName);

    const swHex = await txt(swatch.hex, { font: F_COND_REG, size: 10, color: swatch.text, opacity: 0.7, w: 88 });
    swHex.x = 6; swHex.y = 92;
    swFrame.appendChild(swHex);

    bg.appendChild(swFrame);
    px += 112;
  }

  // ── TYPOGRAPHY ──
  bg.appendChild(line(60, 355, 1080, C.citrusDim, 1, 0.3));
  const typoTitle = await txt('TYPOGRAPHY', { font: F_CONDENSED, size: 14, color: C.greenLight, letterSp: 30 });
  place(typoTitle, 60, 372, bg);

  const typeSpecs = [
    { sample: 'Bebas Neue',        desc: 'Headlines · Section titles · Logo · Countdown', font: F_DISPLAY,   size: 36 },
    { sample: 'Barlow Condensed',  desc: 'Kickers · Labels · Nav pills · Buttons · Caps', font: F_CONDENSED, size: 24 },
    { sample: 'Barlow Regular',    desc: 'Body copy · Descriptions · Paragraphs',          font: F_BODY,      size: 18 },
  ];
  let ty = 404;
  for (const spec of typeSpecs) {
    const sampleT = await txt(spec.sample, { font: spec.font, size: spec.size, color: C.citrus });
    place(sampleT, 60, ty, bg);
    const descT = await txt(spec.desc, { font: F_BODY, size: 13, color: C.cream, opacity: 0.6 });
    place(descT, 60, ty + spec.size + 4, bg);
    ty += spec.size + 44;
  }

  // ── SPACING ──
  bg.appendChild(line(60, 598, 1080, C.citrusDim, 1, 0.3));
  const spacingTitle = await txt('SPACING & LAYOUT', { font: F_CONDENSED, size: 14, color: C.greenLight, letterSp: 30 });
  place(spacingTitle, 60, 616, bg);

  const spacings = [
    'Page width: 1440px (Desktop) · 390px (Mobile)',
    'Section padding: 64px horizontal (Desktop) · 24px (Mobile)',
    'Hero split: 45% text / 55% 3D canvas',
    'Story sections: 50% text / 50% sticky 3D canvas',
    'Navbar height: 64px · Border: 2px dotted var(--citrus-dim)',
    'Border radius — Pills: 999px · Cards: 12px · Steps: 16px',
    'Section heights: Hero 900px · Story 900px · HowTo 700px · CTA 800px · Footer 220px',
  ];
  let sy = 648;
  for (const s of spacings) {
    const t = await txt(`—  ${s}`, { font: F_BODY, size: 14, color: C.cream, opacity: 0.75, w: 1000 });
    place(t, 60, sy, bg);
    sy += 28;
  }

  // ── COMPONENT SPECS ──
  bg.appendChild(line(60, 860, 1080, C.citrusDim, 1, 0.3));
  const compTitle = await txt('KEY COMPONENT SPECS', { font: F_CONDENSED, size: 14, color: C.greenLight, letterSp: 30 });
  place(compTitle, 60, 878, bg);

  const comps = [
    'CTA Button: Barlow Condensed 800 · bg #c8e630 · color #0d1f0d · radius 999px · padding 14-32px',
    'Nav Pill: Barlow Condensed 700 · border 2px solid #a8c020 · citrus text · radius 999px',
    'Ingredient icon circle: 52×52 · border 2px #a8c020 · fill rgba(200,230,48,0.08)',
    'Benefit card: bg #0d1f0d · border-top 3px #c8e630 · radius 12px · padding 28px',
    'Form input: bg rgba(200,230,48,0.08) · border 2px #a8c020 · radius 999px · focus glow 3px',
  ];
  let csy = 906;
  for (const c of comps) {
    const t = await txt(`—  ${c}`, { font: F_BODY, size: 13, color: C.cream, opacity: 0.7, w: 1060 });
    place(t, 60, csy, bg);
    csy += 26;
  }

  tokensPage.appendChild(bg);
  figma.viewport.scrollAndZoomIntoView(tokensPage.children);

  // Switch back to desktop page for final view
  figma.currentPage = figma.root.children[0];
}
