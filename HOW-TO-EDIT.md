# Mango's Photo Booth Website — How to Edit

A plain-English guide for updating your site. **You don't need to know how to code** — almost everything is "find the text and change it." Always make a copy of a file before editing if you're nervous.

---

## 1. The files (what's what)

| File / folder | What it holds |
|---|---|
| `index.html` | All the words, photos, and page sections. **This is the file you'll edit most.** |
| `css/styles.css` | The look — colors, fonts, spacing. Only touch if you want design changes. |
| `js/main.js` | The motion — slideshow, menu, animations. Rarely needs editing. |
| `assets/` | Your logo and (later) your photos. |
| `HOW-TO-EDIT.md` | This guide. |

**To preview the site:** double-click `index.html` — it opens in your web browser. Edit a file, save it, then refresh the browser (F5) to see changes.

> Tip: open `index.html` in a free editor like **VS Code** or even Notepad. VS Code makes finding things easy with `Ctrl+F`.

---

## 2. Change words or prices

1. Open `index.html`.
2. Press `Ctrl+F` and type a few words of the text you want to change (e.g. `Starting at` or `Classic Booth`).
3. Type your new text **between** the `>` and `<` symbols. Example:
   - Before: `<span class="pkg-price-val"><span class="pkg-cur">$</span>550</span>`
   - After (new price $575): `<span class="pkg-price-val"><span class="pkg-cur">$</span>575</span>`
4. Save (`Ctrl+S`) and refresh your browser.

**If you change a package price, also update it in two more spots** so Google shows the right number:
- The structured-data block near the top of `index.html` (search for `"makesOffer"`) — update the matching `"price": "550"`.

---

## 3. Swap in your real photos

Right now the site uses tasteful **stock photos** (loaded from the internet) as placeholders. Here's how to use your own:

1. Put your photos in the `assets/` folder. Make a subfolder like `assets/photos/` to stay organized.
   - Use **JPG** for photos, keep them under ~500 KB each (resize big phone photos first).
2. In `index.html`, search (`Ctrl+F`) for `images.unsplash.com`. Each one is a placeholder photo.
3. Replace the long web address with the path to your file. Example:
   - Before: `src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&h=1200&q=80"`
   - After: `src="assets/photos/wedding-booth.jpg"`
4. Update the `alt="..."` text to describe the photo (good for Google + accessibility).

**Where the photos live on the page:**
- **Hero slideshow** (top, 5 photos): search `hero-slide` — replace the 5 `url('...')` web addresses.
- **Event photos** (5): search `ev-img`.
- **The scrolling wall** (12 photos): search `brick-img`.
- **How It Works** (1 photo): search `how-img`.
- **Package visuals** (the print strip, framed photo, keychains, magnets): search `strip-cell`, `gframe-img`, `keytag-img`, `magnet-img`.

---

## 4. Add your real backdrop photos

The 8 backdrop tiles are currently colored **placeholder swatches**. To use real backdrop photos:

1. Search `index.html` for `bd-ph` (e.g. the Champagne Glitter tile looks like:
   `<div class="bd-ph" style="background:...">`).
2. Replace that whole `<div class="bd-ph" ...></div>` line with a photo, like this:
   ```html
   <div class="simg bd-ph"><div class="simg-fallback"></div>
     <img class="simg-img" src="assets/photos/champagne-glitter.jpg" alt="Champagne glitter backdrop" loading="lazy"></div>
   ```
3. Repeat for each of the 8 tiles. Keep the `<span class="bd-name">…</span>` line as-is (that's the label).

---

## 5. Turn on CheckCherry booking

The "Check Availability" buttons scroll to a **Reserve your date** section that's ready for your CheckCherry widget.

1. In CheckCherry, go to **Settings → Online Booking / Lead Forms → Embed** and copy the embed code (it looks like `<iframe ...></iframe>`).
2. Open `index.html` and search for **`CHECKCHERRY BOOKING WIDGET`**.
3. Delete the placeholder block that starts with `<div class="book-placeholder">` and ends with its closing `</div>`, and **paste your CheckCherry embed code in its place** (keep it inside the `<div class="book-embed">`).
4. Save and refresh. Your live availability checker now shows right on the page.

Until you do this, the section shows a friendly "Call to Check Your Date" button that dials your phone — so it still works.

---

## 6. Add your social media links

1. Search `index.html` for `foot-social`.
2. Replace each `href="#"` with your real profile link. Example:
   - Before: `<a href="#" aria-label="Instagram">Instagram</a>`
   - After: `<a href="https://instagram.com/yourhandle" aria-label="Instagram">Instagram</a>`

---

## 7. Phone, email, hours, service area

- **Phone:** search `2398887688` (appears in the buttons) — it's written as `tel:+12398887688`. Update both the link and the visible `239·888·7688` text.
- **Email:** search `info@mangosphotobooth.com`.
- **Hours:** search `9am` (currently "Mon–Sun · 9am–9pm").
- **Cities served:** search `Serving` in the footer.

---

## 8. SEO notes (already set up for you)

The site is pre-wired for **mangosphotobooth.com** with page title, description, social-share tags, and Google "local business" structured data (your packages, phone, hours, and the Fort Myers / Naples / Cape Coral service area).

Two things to upgrade when you can:
- **Share image:** search `og:image`. It currently points to a stock photo so links look good when shared on Facebook/iMessage. Replace it with a branded 1200×630 image hosted on your site (e.g. `https://mangosphotobooth.com/assets/share-card.jpg`).
- After the site is live, add it to **Google Business Profile** and submit it in **Google Search Console** — that's where most local bookings come from.

---

## 9. Going live (when you're ready)

This is a plain static website, so it can be hosted anywhere — the same way your other site is on GitHub Pages, or on Netlify, etc. When you're ready to publish, just say so and I'll walk you through it (and double-check the domain + booking are wired correctly first).

---

*Questions? Just ask Claude to make the change for you — describe what you want in plain words.*
