# Mango's Photo Booth Website — How to Edit

A plain-English guide for updating your site. **You don't need to know how to code** — almost everything is "find the text and change it." Always make a copy of a file before editing if you're nervous.

---

## 1. The files (what's what)

| File / folder | What it holds |
|---|---|
| `index.html` | All the words, photos, and page sections. **This is the file you'll edit most.** |
| `css/styles.css` | The look — colors, fonts, spacing. Only touch if you want design changes. |
| `js/main.js` | The motion — menu, reveal effects, and floating booking button. Rarely needs editing. |
| `build-pages.js` | The source for all thirteen service and location pages. Edit this file, then run `node build-pages.js`. |
| `assets/` | Your logo and website photos. |
| `AGENTS.md` | Rules every coding model must follow. |
| `PROJECT_STATUS.md` | The latest handoff: what changed, what was tested, and what comes next. |
| `HOW-TO-EDIT.md` | This guide. |

**To preview the site:** double-click `index.html` — it opens in your web browser. Edit a file, save it, then refresh the browser (F5) to see changes.

> Tip: open `index.html` in a free editor like **VS Code** or even Notepad. VS Code makes finding things easy with `Ctrl+F`.

---

## 2. Change words or prices

1. Open `index.html`.
2. Press `Ctrl+F` and type a few words of the text you want to change (e.g. `Starting at` or `Mango's Luxury Experience`).
3. Type your new text **between** the `>` and `<` symbols. Example:
   - Before: `<span class="pkg2-amt">550</span>`
   - After (new price $575): `<span class="pkg2-amt">575</span>`
4. Save (`Ctrl+S`) and refresh your browser.

**If you change a package price, also update these spots** so Google and every inner page show the right number:
- The structured-data block near the top of `index.html` (search for `"makesOffer"`) — update the matching `"price": "550"`.
- `build-pages.js` — update the package prose and any matching structured-data values, then run `node build-pages.js`.
- `llms.txt` — keep the plain-language package summary consistent.

---

## 3. Swap in your real photos

The site uses a mix of Mango's project photos and stock photography. Here's how to add more:

1. Put your photos in the `assets/` folder. Make a subfolder like `assets/photos/` to stay organized.
   - Use **JPG** for photos, keep them under ~500 KB each (resize big phone photos first).
2. In `index.html`, search (`Ctrl+F`) for `images.unsplash.com`. Each remaining result is a stock photo.
3. Replace the long web address with the path to your file. Example:
   - Before: `src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&h=1200&q=80"`
   - After: `src="assets/photos/wedding-booth.jpg"`
4. Update the `alt="..."` text to describe the photo (good for Google + accessibility).

**Where the photos live on the page:**
- **Hero cover**: search `hero-cover-updated.jpg`.
- **Event photos** (5): search `ev-img`.
- **The scrolling wall** (event photos and short videos): search `brick-img`. Each card uses a portrait crop; keep new media inside that frame instead of stretching it.
- **How It Works** (1 photo): search `how-img`.
- **Memory Station feature**: search `memory-station-keychains-showcase.png`.

---

## Gallery and event media

- `gallery/index.html` is the public Gallery page.
- Supplied event photos use the `assets/event-party-friends-*.webp` naming pattern. The latest Memory Wall additions are `assets/memory-wall-pop-stroke-cropped.jpg` and the three `assets/memory-wall-*.mp4` clips with matching `-poster.jpg` fallback images.
- The birthday feature uses `assets/event-birthday-friends.webp`.
- The homepage hero and Memory Wall video use `assets/event-party-hero.mp4` with `assets/event-party-hero-poster.jpg` as the fallback image. The public Gallery itself is photo-only.
- Keep uploaded guest media optimized for the web before adding it to either the Gallery or the homepage Memory Wall.
- Guest-upload QR and manual file submission must point to an approved private upload destination. Do not publish a file picker that has no working storage endpoint.

### Secure guest-upload system

The public `gallery/` route is a photo-only showcase and contains no QR code, event-code field, file picker, upload JavaScript, or upload-service configuration. The reviewed local `upload-api/` foundation is not part of the public website.

Uploads must remain disabled until every account-bound control is configured. Never place the Turnstile secret, Cloudflare API token, event tokens, or admin credentials in HTML or committed files. Production activation requires:

1. A Cloudflare account and the `uploads.mangosphotobooth.com` Worker custom domain. DNS is currently managed at GoDaddy, so follow the zone-migration checklist in `upload-api/README.md` and preserve every GitHub Pages and mail record.
2. A Worker deployment with the private R2 and D1 bindings described in `upload-api/README.md`.
3. Turnstile configured for `mangosphotobooth.com` and `www.mangosphotobooth.com`.
4. Worker secrets and production IDs configured outside Git.
5. A real event record created in D1 with a high-entropy event code and expiration time; store only its peppered hash.
6. Negative-path and real-file upload tests before changing the Gallery configuration from disabled to enabled.

Guest files go into quarantine. They must never be served publicly from that bucket. A separate, access-controlled moderation/scanning process must approve, re-encode, and promote media before it appears in a public gallery.

## 4. Edit the backdrop gallery

The gallery contains 15 real backdrop images grouped as Standard, Deluxe, and Premium.

1. Search `index.html` for the backdrop name.
2. Update the `src="..."` address inside the matching `<img class="bd-photo">`.
3. Update the `alt="..."` description if the image changes.
4. Never publish a preview image containing a vendor watermark. Use the licensed direct image or an optimized project copy.

---

## 5. CheckCherry booking

CheckCherry blocks ordinary iframe embedding, so the site uses direct booking links.

- General booking URL: `https://mangos-photo-booth-and-entertainment.checkcherry.com/reservation`
- Classic event ID: `182525`
- Party Glam event ID: `182524`
- Big Kahuna event ID: `182523`

If CheckCherry package IDs change, update the three package buttons in `index.html`. General Book Now buttons should continue pointing to the reservation URL.

---

## 6. Add your social media links

1. Search `index.html` for `foot-social`.
2. Update the three profile URLs in the homepage and `gallery/index.html` together. Generated service pages inherit their social URLs from `build-pages.js` (`INSTAGRAM_URL`, `FACEBOOK_URL`, and `TIKTOK_URL`).

---

## 7. Phone, email, hours, service area

- **Phone:** search `2398887688` (appears in the buttons) — it's written as `tel:+12398887688`. Update both the link and the visible `239·888·7688` text.
- **Email:** search `info@mangosphotobooth.com`.
- **Hours:** search `9am` (currently "Mon–Sun · 9am–9pm").
- **Cities served:** search `Service Areas` in the footer and keep the JSON-LD, sitemap, `llms.txt`, and local landing pages consistent.

---

## 8. SEO notes (already set up for you)

The site is pre-wired for **mangosphotobooth.com** with page title, description, social-share tags, and Google/AI-readable entity structured data (your packages, phone, hours, and the Fort Myers / Cape Coral / Naples / Marco Island / Estero / Bonita Springs service areas).

Two things to upgrade when you can:
- Create a dedicated branded 1200×630 social share card. Until then, `og:image` uses the current hero photograph.
- Add the site to **Google Business Profile** and submit it in **Google Search Console**.

---

## 9. Going live (when you're ready)

The site is hosted on GitHub Pages from the repository's `main` branch. A push to `main` deploys the live website. Always run local responsive checks and update `PROJECT_STATUS.md` before pushing.

Because GitHub Pages publishes the repository root, the protected upload backend is intentionally excluded from the website repository's published files. Keep the reviewed `upload-api/` source in a separate private deployment repository before production activation. Do not copy `_headers` into Cloudflare as-is: GitHub Pages ignores that file, and a production Content Security Policy must be rebuilt and browser-tested for the live GA4, CheckCherry, font, image, Turnstile, and upload API origins before adding it as a Cloudflare Response Header Rule.

---

*Questions? Just ask Claude to make the change for you — describe what you want in plain words.*
