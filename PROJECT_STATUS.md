# Project Status

Last updated: 2026-07-09

## Current task

Status: Live

The July 9 visual/content update is implemented locally:

- warm cream site theme with navy/charcoal text and no gold-colored text;
- Sora headings and Inter body typography;
- realistic custom hero image;
- centered mobile layout and floating bottom-right Book Now button;
- supplied wedding and flower-wall photography;
- corrected Party Glam and Big Kahuna CheckCherry links;
- animated GIF feature for Party Glam and Big Kahuna;
- Mango's Memory Station add-on feature with a generated keychain photo;
- real backdrop gallery grouped as Standard, Deluxe, and Premium;
- responsive QA, commit, push to `main`, and production verification.

## Deployment

- Feature commit: `40ef2e1` (`feat: refresh Mango's site design and booking experience`)
- Branch: `main`
- Pushed: 2026-07-09
- Production URL: https://mangosphotobooth.com/
- Result: live and verified

## Completed on 2026-07-09

- Added `AGENTS.md` so future coding models must read and update this handoff.
- Rebuilt the site on warm cream surfaces with navy/charcoal text. Gold is limited to button fills and decorative accents, not text.
- Replaced Cormorant Garamond/Jost with Sora headings and Inter body copy.
- Created and optimized `assets/hero-cover-realistic.jpg` from the supplied cover image, then made it the static homepage hero.
- Added `assets/wedding-floral-portrait.jpg` to the Weddings category and `assets/wedding-couple.jpg` to the Memory Wall.
- Created `assets/memory-station-keychains.jpg` and added a single Mango's Memory Station upsell before the package cards.
- Removed duplicate keepsake upsell copy from individual package cards.
- Swapped the incorrect CheckCherry destinations: Party Glam now uses event ID `182524`; Big Kahuna now uses `182523`.
- Added “Animated GIF creation” to Party Glam and Big Kahuna in visible package details, structured data, generated-page copy, and `llms.txt`.
- Replaced the placeholder backdrop grid with 16 real options grouped as Standard, Deluxe, and Premium.
- Added `assets/backdrop-5d-white-flowers.jpg`; the watermarked downloaded Marble Swirl preview was intentionally excluded.
- Replaced the full-width mobile booking bar with a rounded floating bottom-right “Book Now!” button.
- Centered mobile page content, cards, package features, event sections, generated pages, and footer content.
- Regenerated all nine service/location pages with `node build-pages.js`.
- Updated `HOW-TO-EDIT.md` to match the current architecture and booking links.

## Verification

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: generated all nine pages successfully.
- Local browser QA at 375×812, 768×1024, and 1280×720: passed.
- Homepage plus all nine generated routes returned HTTP 200 locally.
- Browser console after clean reload: no errors.
- Verified five event Book Now buttons, 16 backdrop images, two visible GIF features, and corrected Party Glam/Big Kahuna event IDs.
- `git diff --check`: passed; line-ending notices only.
- Independent Codex CLI review was attempted, but its repository inspection tool failed in read-only mode. Manual diff review found no blocking issue.
- Production responsive screenshots at 375×812, 768×1024, and 1280×720: passed.
- Production Party Glam link resolves to CheckCherry event ID `182524`; Big Kahuna resolves to `182523`.
- Production browser console after deployment: no errors.

## Current production baseline

- Live URL: https://mangosphotobooth.com/
- Repository: https://github.com/AugDog214/mangos-photo-booth
- Hosting: GitHub Pages from `main`
- Stack: static HTML, CSS, and JavaScript
- Generated pages: five service pages and four location pages from `build-pages.js`
- Booking: CheckCherry direct links

## Important decisions

- Prices remain Classic $550, Party Glam $650, and Big Kahuna $1,300.
- Do not use the downloaded `luxury_marble_swirl_2k_high_res.png`; it contains a visible vendor watermark. Use the unwatermarked SmugMug source instead.
- Keep category photography. Use `assets/wedding-floral-portrait.jpg` for Weddings and `assets/wedding-couple.jpg` in the Memory Wall.
- Keep all user-supplied originals untouched. Project copies are optimized JPEG derivatives.

## Next action

Next recommended work:

1. Replace the three remaining package “Photo Coming Soon” tiles with real booth/package photography.
2. Replace more remaining Unsplash images with real Mango's event photos.
3. Add the GA4 Measurement ID and verify booking/call/email conversion events.
4. Add real Facebook and TikTok profile URLs when available.
5. Set up Google Business Profile and Google Search Console.
