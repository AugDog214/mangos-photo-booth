/* ============================================================
   build-pages.js  —  Static page generator for Mango's Photo Booth
   Generates the service + location pages (hub stays in index.html).
   No build step at runtime: this just writes plain .html files.
   Run:  node build-pages.js
   ============================================================ */
const fs = require("fs");
const path = require("path");

const SITE = "https://mangosphotobooth.com";
const PHONE = "+12398887688";
const PHONE_DISP = "239&middot;888&middot;7688";
const EMAIL = "info@mangosphotobooth.com";
const OG_IMG = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&h=630&q=80";

// Business node reused as schema "provider"
const BUSINESS = {
  "@type": "ProfessionalService",
  "@id": SITE + "/#business",
  "name": "Mango's Photo Booth Company",
  "telephone": PHONE,
  "url": SITE + "/"
};

const SERVICE_PAGES = ["weddings","corporate","birthdays","quinceaneras","holiday-parties"];
const LOCATION_PAGES = ["photo-booth-fort-myers","photo-booth-cape-coral","photo-booth-naples","photo-booth-marco-island"];

const LABELS = {
  "weddings": "Weddings",
  "corporate": "Corporate & Brands",
  "birthdays": "Birthdays",
  "quinceaneras": "Quinceañeras",
  "holiday-parties": "Holiday Parties",
  "photo-booth-fort-myers": "Fort Myers",
  "photo-booth-cape-coral": "Cape Coral",
  "photo-booth-naples": "Naples",
  "photo-booth-marco-island": "Marco Island"
};

// ---------- shared markup ----------
function head(p) {
  const url = SITE + "/" + p.slug + "/";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>${p.title}</title>
<meta name="description" content="${p.description}" />
${p.keywords ? `<meta name="keywords" content="${p.keywords}" />\n` : ""}<meta name="author" content="Mango's Photo Booth Company" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#080A0D" />
<link rel="canonical" href="${url}" />

<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="../assets/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="../assets/apple-touch-icon.png" />
<link rel="manifest" href="../site.webmanifest" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Mango's Photo Booth Company" />
<meta property="og:title" content="${p.ogTitle || p.title}" />
<meta property="og:description" content="${p.description}" />
<meta property="og:locale" content="en_US" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${OG_IMG}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Mango's Photo Booth Company — luxury photo booth rental in Southwest Florida" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${p.ogTitle || p.title}" />
<meta name="twitter:description" content="${p.description}" />
<meta name="twitter:image" content="${OG_IMG}" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" />

<link rel="stylesheet" href="../css/styles.css" />

<!-- Google Analytics 4 — not active yet. To turn on, uncomment and replace BOTH
     G-XXXXXXXXXX with your Measurement ID from analytics.google.com. Events
     (book_click / call_click / email_click) are wired in js/main.js. -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>
-->

<noscript><style>
  .sec-head, .foot-cta { opacity: 1 !important; transform: none !important; }
</style></noscript>

<style>
  .skip { position: absolute; left: -999px; top: 0; z-index: 200; background: var(--gold); color: #1a130a;
    padding: 0.7em 1.2em; font-family: var(--sans); font-weight: 500; letter-spacing: 0.05em; border-radius: var(--radius); }
  .skip:focus { left: 12px; top: 12px; }
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>`;
}

function header() {
  return `
<header class="hdr" id="site-header">
  <a class="hdr-brand" href="../index.html" aria-label="Mango's Photo Booth Company — home">
    <img src="../assets/mango-logo.png" alt="Mango's Photo Booth Company logo" width="208" height="208" />
  </a>

  <nav class="hdr-nav" aria-label="Primary">
    <a href="../index.html#events" class="hdr-link">Events</a>
    <a href="../index.html#how" class="hdr-link">How It Works</a>
    <a href="../index.html#packages" class="hdr-link">Packages</a>
    <a href="../index.html#backdrops" class="hdr-link">Backdrops</a>
    <a href="../index.html#faq" class="hdr-link">FAQ</a>
  </nav>

  <div class="hdr-right">
    <a class="hdr-tel" href="tel:${PHONE}">${PHONE_DISP}</a>
    <a class="hdr-cta" href="https://mangos-photo-booth-and-entertainment.checkcherry.com/reservation" target="_blank" rel="noopener noreferrer" data-loc="header">Book Now</a>
    <button class="hdr-burger" id="hdr-burger" aria-label="Open menu" aria-controls="hdr-mobile" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>

  <div class="hdr-mobile" id="hdr-mobile">
    <a href="../index.html#events">Events</a>
    <a href="../index.html#how">How It Works</a>
    <a href="../index.html#packages">Packages</a>
    <a href="../index.html#backdrops">Backdrops</a>
    <a href="../index.html#faq">FAQ</a>
    <a class="hdr-mobile-cta" href="https://mangos-photo-booth-and-entertainment.checkcherry.com/reservation" target="_blank" rel="noopener noreferrer" data-loc="mobile-menu">Book Now</a>
  </div>
</header>

<!-- Sticky mobile booking bar (phones only; slides up after the hero) -->
<div class="bookbar" id="bookbar" aria-label="Quick booking">
  <a class="btn btn-ghost bookbar-call" href="tel:${PHONE}" aria-label="Call or text Mango's Photo Booth">Call</a>
  <a class="btn btn-gold" href="https://mangos-photo-booth-and-entertainment.checkcherry.com/reservation" target="_blank" rel="noopener noreferrer" data-loc="bookbar">Book Now</a>
</div>`;
}

function footer(prefix) {
  const svc = SERVICE_PAGES.map(s => `      <a href="${prefix}${s}/index.html">${LABELS[s]}</a>`).join("\n");
  const loc = LOCATION_PAGES.map(s => `      <a href="${prefix}${s}/index.html">${LABELS[s]}</a>`).join("\n");
  return `
<footer class="footer" id="contact">
  <div class="foot-cta">
    <p class="t-eyebrow">Reserve Your Date</p>
    <h2 class="foot-cta-title">Let&rsquo;s make it<br /><span class="t-italic text-gradient-gold">unforgettable.</span></h2>
    <p class="foot-cta-sub">Tell us about your celebration and we&rsquo;ll craft the perfect experience.</p>
    <div class="foot-cta-actions">
      <a class="btn btn-gold" href="tel:${PHONE}">Give Us a Call</a>
      <a class="btn btn-ghost" href="mailto:${EMAIL}">Send an Email</a>
    </div>
  </div>

  <div class="foot-grid">
    <div class="foot-brand">
      <img src="${prefix}assets/mango-logo.png" alt="Mango's Photo Booth Company logo" class="foot-logo" width="256" height="256" />
      <p class="foot-tagline">Luxury photo booth &amp; keepsake experiences for the moments worth remembering.</p>
    </div>
    <nav class="foot-col" aria-label="Services">
      <h3 class="foot-h">Services</h3>
${svc}
    </nav>
    <nav class="foot-col" aria-label="Service areas">
      <h3 class="foot-h">Service Areas</h3>
${loc}
    </nav>
    <div class="foot-col">
      <h3 class="foot-h">Contact</h3>
      <a href="tel:${PHONE}">239 &middot; 888 &middot; 7688</a>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      <span class="foot-muted">Mon&ndash;Sun &middot; 9am&ndash;9pm</span>
    </div>
  </div>

  <div class="foot-base">
    <span>&copy; 2026 Mango&rsquo;s Photo Booth Company. All rights reserved.</span>
    <div class="foot-social">
      <a href="https://www.instagram.com/mangosphotobooth/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">TikTok</a>
      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
    </div>
  </div>
</footer>

<script src="../js/main.js" defer></script>
</body>
</html>`;
}

function faqHtml(faqs) {
  return faqs.map(f => `    <details class="faq-item">
      <summary class="faq-q">${f.q}</summary>
      <div class="faq-a"><p>${f.a}</p></div>
    </details>`).join("\n");
}

function relatedHtml(slug, prefix) {
  const others = [...SERVICE_PAGES, ...LOCATION_PAGES].filter(s => s !== slug);
  const links = others.map(s => `    <a href="${prefix}${s}/index.html">${LABELS[s]}</a>`).join("\n");
  return `<section class="section">
  <div class="related">
    <p class="related-h">Explore more</p>
    <div class="related-links">
${links}
    </div>
  </div>
</section>`;
}

function buildSchema(p) {
  const url = SITE + "/" + p.slug + "/";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/" },
      { "@type": "ListItem", "position": 2, "name": p.crumb, "item": url }
    ]
  };
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": p.serviceName,
    "serviceType": "Photo booth rental",
    "provider": BUSINESS,
    "areaServed": p.areaServed.map(n => ({ "@type": "City", "name": n })),
    "url": url,
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "550",
      "highPrice": "1300",
      "priceCurrency": "USD",
      "offerCount": "3"
    }
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": p.faqs.map(f => ({
      "@type": "Question",
      "name": f.qPlain,
      "acceptedAnswer": { "@type": "Answer", "text": f.aPlain }
    }))
  };
  return [breadcrumb, service, faqPage]
    .map(o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`)
    .join("\n");
}

function buildPage(p) {
  const prefix = "../";
  return `${head(p)}
${header()}

<main id="main">

<section class="page-hero">
  <div class="page-hero-inner">
    <p class="crumb"><a href="../index.html">Home</a> &nbsp;/&nbsp; <span>${p.crumb}</span></p>
    <h1 class="page-h1">${p.h1}</h1>
    <p class="page-lead">${p.lead}</p>
    <div class="page-actions">
      <a class="btn btn-gold btn-packages" href="https://mangos-photo-booth-and-entertainment.checkcherry.com/reservation" target="_blank" rel="noopener noreferrer" data-loc="page-hero">Book Now</a>
      <a class="btn btn-ghost" href="../index.html#packages">View Packages</a>
    </div>
  </div>

  <div class="answer-card">
    <h2>${p.answerH2}</h2>
${p.answerParas.map(t => `    <p>${t}</p>`).join("\n")}
  </div>
</section>

<section class="section">
  <div class="prose">
${p.prose}
  </div>
</section>

<section class="section faq">
  <div class="sec-head sec-head-center">
    <p class="t-eyebrow">Good to Know</p>
    <h2 class="sec-title">${p.faqTitle}</h2>
  </div>
  <div class="faq-list">
${faqHtml(p.faqs)}
  </div>
</section>

${relatedHtml(p.slug, prefix)}

${buildSchema(p)}
</main>
${footer(prefix)}
`;
}

// ---------- reusable content ----------
const PACKAGES_PROSE = `    <h2>Our packages</h2>
    <ul>
      <li><strong>Classic Booth — $550.</strong> Three hours of open-air booth service, unlimited on-site prints, your choice of 2x6 or 4x6 print size, a custom template, themed props, a standard backdrop, an on-site attendant, a private online gallery, and free travel across Southwest Florida.</li>
      <li><strong>Party Glam Booth — $650 (most popular).</strong> Everything in Classic, elevated with a skin-perfecting beauty filter, an upgraded deluxe backdrop, both print sizes, and a second custom template design.</li>
      <li><strong>The Big Kahuna — $1,300.</strong> Our premier all-inclusive experience: the full Glam Booth plus a VIP red-carpet entrance, a premium custom backdrop, your choice of a Live Keychain or Magnet Memory Station, and a custom decor enhancement.</li>
    </ul>
    <p>Want take-home favors on the Classic or Glam booth? Add a <strong>Live Keychain or Magnet Memory Station</strong> to any package. See full details on the <a href="../index.html#packages">packages page</a>, or <a href="../index.html#book">check your date</a> to lock in your booking.</p>`;

// ---------- page data ----------
const PAGES = [];

// ===== SERVICE PAGES =====
PAGES.push({
  slug: "weddings", crumb: "Weddings",
  title: "Wedding Photo Booth Rental in Fort Myers & SWFL | Mango's Photo Booth",
  ogTitle: "Wedding Photo Booth Rental — Fort Myers & Southwest Florida",
  description: "Luxury wedding photo booth and live-favor stations for Fort Myers, Cape Coral, Naples & Marco Island. Open-air booth from $550; Party Glam $650; all-inclusive Big Kahuna $1,300 with live keychain & magnet stations. Prints in seconds, gallery in 48 hours.",
  keywords: "wedding photo booth Fort Myers, wedding photo booth rental SWFL, photo booth wedding Naples, keychain favors wedding, magnet station wedding",
  serviceName: "Wedding Photo Booth Rental",
  areaServed: ["Fort Myers","Cape Coral","Naples","Marco Island"],
  h1: "Wedding Photo Booths<br /><span class=\"t-italic\">for Southwest Florida.</span>",
  lead: "Bring your wedding to life with a luxury photo booth experience your guests will talk about long after the last dance — perfectly tailored for any size celebration across Fort Myers, Cape Coral, Naples, and Marco Island.",
  answerH2: "How much is a wedding photo booth?",
  answerParas: [
    "A wedding photo booth rental from Mango's starts at <strong>$550</strong> for a 3-hour open-air Classic Booth, with unlimited prints, instant sharing, and a private online gallery. The Party Glam Booth (our most popular) is $650, and the all-inclusive Big Kahuna — with a VIP red carpet, premium backdrop, and a live keychain or magnet station — is $1,300. Live keychain and magnet favor stations can also be added to any package.",
    "Your final price depends on hours of coverage, backdrop, add-ons, and travel within Southwest Florida. Most couples book 2 to 4 hours. <a href=\"../index.html#book\">Check your date</a> for an exact quote."
  ],
  prose: `    <h2>An elegant booth for every wedding</h2>
    <p>From the first dance to the last sparkler send-off, our attended booth captures every unrepeatable moment in print and pixel. Choose our sleek standalone open-air booth, or upgrade to our interactive <strong>Mango's Memory Stations</strong>, where guests create custom live favors they take home the same night.</p>
    <h3>Mango's Memory Stations</h3>
    <p>From photo keychains and magnets to candle jars with custom photo stickers, we turn joyful moments into personalized keepsakes your guests will cherish forever. It's a wedding favor and a guest-book moment in one.</p>
${PACKAGES_PROSE}`,
  faqTitle: "Wedding photo booth <span class=\"t-italic text-gradient-gold\">questions.</span>",
  faqs: [
    { q: "How much does a wedding photo booth cost?", a: "Wedding packages start at $550 for a 3-hour open-air Classic Booth. The Party Glam Booth (our most popular) is $650, and the all-inclusive Big Kahuna — with a VIP red carpet, premium backdrop, and a live keychain or magnet station — is $1,300. Final pricing depends on hours, backdrop, add-ons, and travel.", qPlain: "How much does a wedding photo booth cost?", aPlain: "Wedding packages start at $550 for a 3-hour open-air Classic Booth. The Party Glam Booth (our most popular) is $650, and the all-inclusive Big Kahuna — with a VIP red carpet, premium backdrop, and a live keychain or magnet station — is $1,300. Final pricing depends on hours, backdrop, add-ons, and travel." },
    { q: "What's included with the booth?", a: "Every booth comes with a professional on-site attendant, unlimited 2x6 or 4x6 prints, a curated prop and backdrop setup, instant photo sharing by text and email, and a private online gallery after your event.", qPlain: "What's included with the booth?", aPlain: "Every booth comes with a professional on-site attendant, unlimited 2x6 or 4x6 prints, a curated prop and backdrop setup, instant photo sharing by text and email, and a private online gallery after your event." },
    { q: "What is a keychain or magnet station?", a: "These are our live-favor stations. Guests watch their photos become custom keychains (50 included) or acrylic magnets (50 included) on the spot, so they leave your wedding with a keepsake the same night.", qPlain: "What is a keychain or magnet station?", aPlain: "These are our live-favor stations. Guests watch their photos become custom keychains (50 included) or acrylic magnets (50 included) on the spot, so they leave your wedding with a keepsake the same night." },
    { q: "Do you travel to our venue?", a: "Yes. We're a service-area business and travel to venues throughout Fort Myers, Cape Coral, Naples, Marco Island, and the rest of Southwest Florida.", qPlain: "Do you travel to our venue?", aPlain: "Yes. We're a service-area business and travel to venues throughout Fort Myers, Cape Coral, Naples, Marco Island, and the rest of Southwest Florida." },
    { q: "How fast do we get our photos?", a: "Every photo is sent instantly by text and email during your wedding, and your full private online gallery is delivered within 48 hours.", qPlain: "How fast do we get our photos?", aPlain: "Every photo is sent instantly by text and email during your wedding, and your full private online gallery is delivered within 48 hours." }
  ]
});

PAGES.push({
  slug: "corporate", crumb: "Corporate & Brands",
  title: "Corporate & Brand Activation Photo Booth | Fort Myers & SWFL",
  ogTitle: "Corporate & Brand Photo Booth — Fort Myers & Southwest Florida",
  description: "Branded corporate photo booth experiences for Fort Myers, Cape Coral & Naples. Custom templates, branded backdrops, instant social sharing, and lead capture. Packages from $550.",
  keywords: "corporate photo booth Fort Myers, brand activation photo booth, corporate event photo booth SWFL, branded photo booth Naples",
  serviceName: "Corporate & Brand Activation Photo Booth",
  areaServed: ["Fort Myers","Cape Coral","Naples","Marco Island"],
  h1: "Corporate &amp; Brand<br /><span class=\"t-italic\">photo experiences.</span>",
  lead: "Drive results with Mango's corporate branding events — maximize your ROI and build lasting digital imprints at conferences, grand openings, and brand activations across Southwest Florida.",
  answerH2: "How much is a corporate photo booth?",
  answerParas: [
    "A corporate photo booth activation from Mango's starts at <strong>$550</strong> for a 3-hour open-air booth, scaling up with branded templates, custom backdrops, live keychain & magnet stations, and our all-inclusive Big Kahuna package at $1,300. Pricing depends on hours, branding, add-ons, and travel within Southwest Florida.",
    "Want branded keepsakes for attendees? Our Live Keychain and Magnet stations turn every photo into a take-home product carrying your logo."
  ],
  prose: `    <h2>Branding that travels home with your guests</h2>
    <p>Branded templates, custom backdrops, and instant sharing enhance your social media content in real time, turning your activation into a wall of branded content before the event is over. Every print and digital share carries your logo and message.</p>
    <h3>Lead generation &amp; data capture</h3>
    <p>At open events, our booth doubles as a lead-generation tool — guests opt in to receive their photos, giving your team a warm list of engaged attendees. It's brand awareness and pipeline in a single station.</p>
${PACKAGES_PROSE}`,
  faqTitle: "Corporate photo booth <span class=\"t-italic text-gradient-gold\">questions.</span>",
  faqs: [
    { q: "How much does a corporate photo booth cost?", a: "Corporate activations start at $550 for a 3-hour open-air booth, with branded keychain & magnet stations and an all-inclusive Big Kahuna package at $1,300. Final pricing depends on hours, custom branding, add-ons, and travel.", qPlain: "How much does a corporate photo booth cost?", aPlain: "Corporate activations start at $550 for a 3-hour open-air booth, with branded keychain & magnet stations and an all-inclusive Big Kahuna package at $1,300. Final pricing depends on hours, custom branding, add-ons, and travel." },
    { q: "Can you brand the photos and backdrop?", a: "Yes. We provide branded print templates, custom backdrops, and branded digital sharing so every photo carries your logo and campaign message.", qPlain: "Can you brand the photos and backdrop?", aPlain: "Yes. We provide branded print templates, custom backdrops, and branded digital sharing so every photo carries your logo and campaign message." },
    { q: "Can the booth capture leads?", a: "Yes. At open events, guests opt in to receive their photos, which gives your team a list of engaged attendees for follow-up.", qPlain: "Can the booth capture leads?", aPlain: "Yes. At open events, guests opt in to receive their photos, which gives your team a list of engaged attendees for follow-up." },
    { q: "What areas do you serve?", a: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue.", qPlain: "What areas do you serve?", aPlain: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue." }
  ]
});

PAGES.push({
  slug: "birthdays", crumb: "Birthdays",
  title: "Birthday Photo Booth Rental | Fort Myers & Southwest Florida",
  ogTitle: "Birthday Photo Booth Rental — Fort Myers & SWFL",
  description: "Make any birthday unforgettable with a Mango's photo booth in Fort Myers, Cape Coral & Naples. Personalized experiences for any age, packages from $550. Mango the mascot can make an appearance!",
  keywords: "birthday photo booth Fort Myers, birthday party photo booth SWFL, photo booth birthday Naples, kids birthday photo booth",
  serviceName: "Birthday Photo Booth Rental",
  areaServed: ["Fort Myers","Cape Coral","Naples","Marco Island"],
  h1: "Birthday Photo Booths<br /><span class=\"t-italic\">for every milestone.</span>",
  lead: "Celebrate any milestone with Mango's. We make birthdays unforgettable with personalized digital experiences built for any age — across Fort Myers, Cape Coral, Naples, and Marco Island.",
  answerH2: "How much is a birthday photo booth?",
  answerParas: [
    "A birthday photo booth rental from Mango's starts at <strong>$550</strong> for a 3-hour open-air Classic Booth with unlimited prints and instant sharing. The Party Glam Booth is $650, and the all-inclusive Big Kahuna is $1,300. Customize any package to wow your guests.",
    "Final pricing depends on hours, backdrop, add-ons, and travel within Southwest Florida. And don't forget — Mango the mascot is available to make an appearance at your event!"
  ],
  prose: `    <h2>A booth built for the party</h2>
    <p>Milestone or backyard bash, our props, prints, and on-site host keep the line moving and the energy high all night long. Customize the backdrop and print template to match your theme, your colors, or the guest of honor.</p>
    <h3>Make it a Mango moment</h3>
    <p>Want to take it over the top? Mango, our mascot, can make a special appearance to surprise your guests and star in the photos. It's the kind of detail people remember long after the candles are out.</p>
${PACKAGES_PROSE}`,
  faqTitle: "Birthday photo booth <span class=\"t-italic text-gradient-gold\">questions.</span>",
  faqs: [
    { q: "How much does a birthday photo booth cost?", a: "Birthday packages start at $550 for a 3-hour open-air Classic Booth, up to $1,300 for the all-inclusive Big Kahuna, with live keychain and magnet stations available as add-ons. Final pricing depends on hours, backdrop, add-ons, and travel.", qPlain: "How much does a birthday photo booth cost?", aPlain: "Birthday packages start at $550 for a 3-hour open-air Classic Booth, up to $1,300 for the all-inclusive Big Kahuna, with live keychain and magnet stations available as add-ons. Final pricing depends on hours, backdrop, add-ons, and travel." },
    { q: "Is the booth good for all ages?", a: "Yes. Our experiences are built for any age, from kids' parties to milestone birthdays, with props and templates customized to your theme.", qPlain: "Is the booth good for all ages?", aPlain: "Yes. Our experiences are built for any age, from kids' parties to milestone birthdays, with props and templates customized to your theme." },
    { q: "Can Mango the mascot come to the party?", a: "Yes! Mango is available to make a special appearance at your event — just ask when you check your date.", qPlain: "Can Mango the mascot come to the party?", aPlain: "Yes! Mango is available to make a special appearance at your event — just ask when you check your date." },
    { q: "What areas do you serve?", a: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue.", qPlain: "What areas do you serve?", aPlain: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue." }
  ]
});

PAGES.push({
  slug: "quinceaneras", crumb: "Quinceañeras",
  title: "Quinceañera Photo Booth Rental | Fort Myers & SWFL",
  ogTitle: "Quinceañera Photo Booth Rental — Fort Myers & Southwest Florida",
  description: "A glamour photo booth worthy of the celebration. Quinceañera photo booth and live-favor stations in Fort Myers, Cape Coral & Naples. Packages from $550, keepsakes the whole familia will treasure.",
  keywords: "quinceañera photo booth, quinceanera photo booth Fort Myers, photo booth quince SWFL, glam photo booth Naples",
  serviceName: "Quinceañera Photo Booth Rental",
  areaServed: ["Fort Myers","Cape Coral","Naples","Marco Island"],
  h1: "Quinceañera<br /><span class=\"t-italic\">photo booths.</span>",
  lead: "A glamour booth worthy of the celebration — beauty filters, a couture backdrop, and keepsakes the whole familia will treasure, across Fort Myers, Cape Coral, Naples, and Marco Island.",
  answerH2: "How much is a quinceañera photo booth?",
  answerParas: [
    "A quinceañera photo booth rental from Mango's starts at <strong>$550</strong> for a 3-hour open-air Classic Booth. Most quinces choose the Party Glam Booth ($650) for its beauty filter, or the all-inclusive Big Kahuna ($1,300), which includes a live keychain or magnet station so every guest takes home a custom favor.",
    "Final pricing depends on hours, backdrop, add-ons, and travel within Southwest Florida. <a href=\"../index.html#book\">Check your date</a> to reserve."
  ],
  prose: `    <h2>Glamour for the guest of honor</h2>
    <p>Our Party Glam Booth adds a skin-perfecting beauty filter and an optional glam black &amp; white look, paired with a couture backdrop that matches your colors and theme. It's the photo moment every quinceañera deserves.</p>
    <h3>Favors the whole familia keeps</h3>
    <p>Upgrade to a Live Keychain or Magnet Station and every guest leaves with a custom keepsake from the night — 50 included — turning your celebration into something everyone remembers.</p>
${PACKAGES_PROSE}`,
  faqTitle: "Quinceañera photo booth <span class=\"t-italic text-gradient-gold\">questions.</span>",
  faqs: [
    { q: "How much does a quinceañera photo booth cost?", a: "Quinceañera packages start at $550 for a 3-hour open-air booth, with the Party Glam Booth at $650 and the all-inclusive Big Kahuna at $1,300 (live keychain and magnet stations available as add-ons). Final pricing depends on hours, backdrop, add-ons, and travel.", qPlain: "How much does a quinceanera photo booth cost?", aPlain: "Quinceanera packages start at $550 for a 3-hour open-air booth, with the Party Glam Booth at $650 and the all-inclusive Big Kahuna at $1,300 (live keychain and magnet stations available as add-ons). Final pricing depends on hours, backdrop, add-ons, and travel." },
    { q: "Do you have a beauty filter and custom backdrop?", a: "Yes. Our Party Glam Booth includes a skin-perfecting beauty filter and an optional glam black and white look, with a backdrop matched to your theme and colors.", qPlain: "Do you have a beauty filter and custom backdrop?", aPlain: "Yes. Our Party Glam Booth includes a skin-perfecting beauty filter and an optional glam black and white look, with a backdrop matched to your theme and colors." },
    { q: "Can guests take home a keepsake?", a: "Yes. Our Live Keychain and Magnet stations create custom favors on the spot, with 50 included, so every guest leaves with a memento.", qPlain: "Can guests take home a keepsake?", aPlain: "Yes. Our Live Keychain and Magnet stations create custom favors on the spot, with 50 included, so every guest leaves with a memento." },
    { q: "What areas do you serve?", a: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue.", qPlain: "What areas do you serve?", aPlain: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue." }
  ]
});

PAGES.push({
  slug: "holiday-parties", crumb: "Holiday Parties",
  title: "Holiday Party Photo Booth Rental | Fort Myers & SWFL",
  ogTitle: "Holiday Party Photo Booth Rental — Fort Myers & Southwest Florida",
  description: "From office galas to grand openings, Mango's photo booth has your holiday party covered in Fort Myers, Cape Coral & Naples. Packages from $550, prints in seconds, gallery in 48 hours.",
  keywords: "holiday party photo booth Fort Myers, office party photo booth SWFL, Christmas party photo booth Naples, grand opening photo booth",
  serviceName: "Holiday Party Photo Booth Rental",
  areaServed: ["Fort Myers","Cape Coral","Naples","Marco Island"],
  h1: "Holiday Party<br /><span class=\"t-italic\">photo booths.</span>",
  lead: "From office galas to grand openings, any event is the perfect place for your guests to make memories and take home prints — Mango's has you covered across Southwest Florida.",
  answerH2: "How much is a holiday party photo booth?",
  answerParas: [
    "A holiday party photo booth rental from Mango's starts at <strong>$550</strong> for a 3-hour open-air Classic Booth with unlimited prints and instant sharing. The Party Glam Booth is $650, and the all-inclusive Big Kahuna — with a live keychain or magnet station included — is $1,300.",
    "Final pricing depends on hours, backdrop, add-ons, and travel within Southwest Florida. The holidays book up fast — <a href=\"../index.html#book\">check your date</a> early."
  ],
  prose: `    <h2>The sparkle for your season</h2>
    <p>Office galas, seasonal soirées, and grand openings all come alive with a booth. We bring the sparkle, you bring the guests, and everyone leaves with a print in hand. Seasonal backdrops and themed props keep the energy festive all night.</p>
    <h3>Keepsakes for the whole team</h3>
    <p>Add a Live Keychain or Magnet Station and your team and clients take home a custom favor from the party — a small, memorable thank-you that carries the night home with them.</p>
${PACKAGES_PROSE}`,
  faqTitle: "Holiday party photo booth <span class=\"t-italic text-gradient-gold\">questions.</span>",
  faqs: [
    { q: "How much does a holiday party photo booth cost?", a: "Holiday party packages start at $550 for a 3-hour open-air booth, up to $1,300 for the all-inclusive Big Kahuna, with live keychain and magnet stations available as add-ons. Final pricing depends on hours, backdrop, add-ons, and travel.", qPlain: "How much does a holiday party photo booth cost?", aPlain: "Holiday party packages start at $550 for a 3-hour open-air booth, up to $1,300 for the all-inclusive Big Kahuna, with live keychain and magnet stations available as add-ons. Final pricing depends on hours, backdrop, add-ons, and travel." },
    { q: "Do you do office and corporate holiday parties?", a: "Yes. From office galas to client appreciation events and grand openings, we bring seasonal backdrops, props, and instant sharing to make it memorable.", qPlain: "Do you do office and corporate holiday parties?", aPlain: "Yes. From office galas to client appreciation events and grand openings, we bring seasonal backdrops, props, and instant sharing to make it memorable." },
    { q: "How fast do we get our photos?", a: "Every photo is sent instantly by text and email during the party, and your full private online gallery is delivered within 48 hours.", qPlain: "How fast do we get our photos?", aPlain: "Every photo is sent instantly by text and email during the party, and your full private online gallery is delivered within 48 hours." },
    { q: "What areas do you serve?", a: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue.", qPlain: "What areas do you serve?", aPlain: "We serve Fort Myers, Cape Coral, Naples, Marco Island, and the surrounding Southwest Florida region. We travel to your venue." }
  ]
});

// ===== LOCATION PAGES =====
function locationPage(slug, city, blurb, travelNote) {
  return {
    slug, crumb: city,
    title: `Photo Booth Rental ${city}, FL | Mango's Photo Booth`,
    ogTitle: `Photo Booth Rental in ${city}, Florida`,
    description: `Luxury photo booth rental in ${city}, FL. Weddings, corporate events, birthdays & quinceañeras. Open-air booth from $550; Party Glam $650; all-inclusive Big Kahuna $1,300 with live keychain & magnet stations. Prints in seconds, gallery in 48 hours.`,
    keywords: `photo booth rental ${city}, photo booth ${city} FL, wedding photo booth ${city}, ${city} photo booth company`,
    serviceName: `Photo Booth Rental in ${city}`,
    areaServed: [city],
    h1: `Photo Booth Rental<br /><span class=\"t-italic\">in ${city}.</span>`,
    lead: `${blurb} Mango's brings a luxury photo booth and live-favor experience to ${city} and all of Southwest Florida — for weddings, corporate events, birthdays, quinceañeras, and holiday parties.`,
    answerH2: `How much does a photo booth cost in ${city}?`,
    answerParas: [
      `A photo booth rental in ${city} from Mango's starts at <strong>$550</strong> for a 3-hour open-air Classic Booth, including unlimited prints, instant sharing, and a private online gallery. The Party Glam Booth (our most popular) is $650, and the all-inclusive Big Kahuna — with a VIP red carpet, premium backdrop, and a live keychain or magnet station — is $1,300.`,
      `Your final price depends on event size, hours, backdrop, add-ons, and ${travelNote} <a href=\"../index.html#book\">Check your date</a> for an exact quote.`
    ],
    prose: `    <h2>Your ${city} photo booth company</h2>
    <p>We're a service-area business based in Fort Myers, and we travel to venues throughout ${city} — from waterfront resorts and country clubs to backyards and downtown event spaces. Every booking includes a professional on-site attendant who handles setup, keeps the line moving, and makes sure your guests have a blast.</p>
    <h3>Every kind of ${city} celebration</h3>
    <p>Planning a <a href="../weddings/index.html">wedding</a>, a <a href="../corporate/index.html">corporate activation</a>, a <a href="../birthdays/index.html">birthday</a>, a <a href="../quinceaneras/index.html">quinceañera</a>, or a <a href="../holiday-parties/index.html">holiday party</a>? We tailor the booth, backdrop, and keepsakes to your event and your style.</p>
${PACKAGES_PROSE}`,
    faqTitle: `Photo booth in ${city} <span class=\"t-italic text-gradient-gold\">questions.</span>`,
    faqs: [
      { q: `How much does a photo booth cost in ${city}?`, a: `In ${city}, packages start at $550 for a 3-hour open-air Classic Booth, with the Party Glam Booth at $650 and the all-inclusive Big Kahuna at $1,300 (live keychain and magnet stations available as add-ons). Final pricing depends on event size, hours, backdrop, add-ons, and travel.`, qPlain: `How much does a photo booth cost in ${city}?`, aPlain: `In ${city}, packages start at $550 for a 3-hour open-air Classic Booth, with the Party Glam Booth at $650 and the all-inclusive Big Kahuna at $1,300 (live keychain and magnet stations available as add-ons). Final pricing depends on event size, hours, backdrop, add-ons, and travel.` },
      { q: `Do you serve ${city}?`, a: `Yes. We serve ${city} and the surrounding Southwest Florida region, including Fort Myers, Cape Coral, Naples, and Marco Island. We travel to your venue.`, qPlain: `Do you serve ${city}?`, aPlain: `Yes. We serve ${city} and the surrounding Southwest Florida region, including Fort Myers, Cape Coral, Naples, and Marco Island. We travel to your venue.` },
      { q: "What's included with the rental?", a: "Every booth comes with a professional on-site attendant, unlimited 2x6 or 4x6 prints, a curated prop and backdrop setup, instant photo sharing by text and email, and a private online gallery after your event.", qPlain: "What's included with the rental?", aPlain: "Every booth comes with a professional on-site attendant, unlimited 2x6 or 4x6 prints, a curated prop and backdrop setup, instant photo sharing by text and email, and a private online gallery after your event." },
      { q: "How fast do we get our photos?", a: "Every photo is sent instantly by text and email during your event, and your full private online gallery is delivered within 48 hours.", qPlain: "How fast do we get our photos?", aPlain: "Every photo is sent instantly by text and email during your event, and your full private online gallery is delivered within 48 hours." }
    ]
  };
}

PAGES.push(locationPage("photo-booth-fort-myers", "Fort Myers", "Fort Myers is our home turf.", "since Fort Myers is our base, there's no long-distance travel."));
PAGES.push(locationPage("photo-booth-cape-coral", "Cape Coral", "Just across the river from our Fort Myers base, Cape Coral is one of our most-served cities.", "the short trip from Fort Myers."));
PAGES.push(locationPage("photo-booth-naples", "Naples", "We bring the same luxury experience down to Naples.", "travel from Fort Myers to Naples."));
PAGES.push(locationPage("photo-booth-marco-island", "Marco Island", "From beachfront weddings to island celebrations, we love Marco Island events.", "travel from Fort Myers to Marco Island."));

// ---------- write files ----------
let count = 0;
for (const p of PAGES) {
  const dir = path.join(__dirname, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), buildPage(p), "utf8");
  count++;
  console.log("wrote " + p.slug + "/index.html");
}
console.log("Done. " + count + " pages generated.");
