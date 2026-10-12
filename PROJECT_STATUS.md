# Project Status

## Memory Wall ordering refreshed locally, 2026-10-12

Model/tool: OpenAI Codex.

Status: Local only. Change is uncommitted, not pushed, and not live.

Changed:

- Interspersed the Networking Beast photos and video moments throughout Mango's Memory Wall rather than grouping them at the end.
- Kept all fifteen existing wall cards and the seamless marquee behavior intact.

Files touched:

- `index.html`
- `PROJECT_STATUS.md`

Verification:

- Confirmed the wall contains 15 unique cards: 11 photos and 4 video moments.
- `git diff --check`: passed (line-ending notices only).

Unfinished:

- Visual desktop and mobile QA remains pending before publication.

Next recommended task:

1. Review the revised wall sequence and publish only after user approval.

---

## Older hero photo removed locally, 2026-10-11

Model/tool: OpenAI Codex.

Status: Local only. Change is uncommitted, not pushed, and not live.

Changed:

- Removed the older hero slideshow photo featuring the group against the leafy backdrop, along with its matching slide selector.
- Replaced it with a supplied PopStroke gold-backdrop celebration photo, taken from `20260813_182542904.mp4` at the 2-second mark.
- Renumbered the remaining selectors so the five active hero moments stay in sync.

Files touched:

- `index.html`
- `assets/hero-popstroke-mic.jpg`
- `PROJECT_STATUS.md`

Verification:

- Confirmed the hero slideshow contains five slides and five matching controls.
- `git diff --check`: passed (line-ending notices only).

Unfinished:

- Desktop and mobile visual QA remains pending before publication.

Next recommended task:

1. Review the revised hero rotation, then publish only after user approval.

---

## Networking Beast hero refresh prepared locally, 2026-10-11

Model/tool: OpenAI Codex with FFmpeg.

Status: Committed and pushed to `main` on 2026-10-11. GitHub Pages deployment has been triggered; final live-route verification remains pending.

Changed:

- Replaced the opening homepage hero image with a new Networking Beast team moment from `IMG_0197.MOV`.
- Replaced the prior hero video with a web-optimized, muted Networking Beast video from `IMG_0200.MOV`, trimmed precisely to its first 4 seconds and paired with a still poster.
- Added the supplied `IMG_0204.HEIC` Networking Beast booth moment to both the Memory Wall and the hero slideshow, using an optimized JPEG asset and tailored crop positions.
- Recolored the desktop-header `Book Now` control to a solid green `#22A778`, with a darker-green hover state and white text for contrast. Versioned the stylesheet reference so the updated control bypasses a browser's prior CSS cache.
- Updated the editing guide to identify the current hero media assets.

Files touched:

- `index.html`
- `css/styles.css`
- `HOW-TO-EDIT.md`
- `assets/hero-networking-beast-team.jpg`
- `assets/hero-networking-beast-moments.mp4`
- `assets/hero-networking-beast-moments-poster.jpg`
- `assets/networking-beast-booth-moment.jpg`
- `PROJECT_STATUS.md`

Verification:

- `node --check js/main.js`: passed.
- `git diff --check`: passed (line-ending notices only).
- Confirmed the generated hero still is a 1080px-wide portrait image and visually inspected its crop.
- Confirmed `hero-networking-beast-moments.mp4` is H.264, 1080×1920, and exactly 4.000 seconds long.
- Confirmed the Networking Beast booth image was converted from HEIC to an optimized 1,800px-wide JPEG for browser compatibility.
- Attempted local gstack `/browse` QA, but its browser service did not start within its 15-second timeout.

Unfinished:

- Fresh desktop and mobile browser QA remains required before publishing; the local gstack browser service is currently unavailable.

Next recommended task:

1. Preview the homepage at desktop and 375px mobile widths, verify the new hero crops, video playback, green Book Now control, and browser console, then publish when approved.

---

## Memory Wall event-media update prepared locally, 2026-10-11

Model/tool: OpenAI Codex with FFmpeg and gstack `/browse` (local browser-service startup attempted).

Status: Committed and pushed to `main` on 2026-10-11. GitHub Pages deployment succeeded for commit `325432b`; live-route browser verification remains pending.

Changed:

- Added the supplied night-lights, PopStroke team, and gold-glam event clips to the homepage Memory Wall as muted, looping portrait cards. The existing visible-media playback behavior continues to prevent off-screen clips from playing.
- Created individual poster images for each new clip so the wall has a polished still before playback begins.
- Cropped the supplied tall PopStroke photo collage into a focused portrait of the group at the gold backdrop, removing the surrounding collage layout before publishing it in the wall.
- Documented the new Memory Wall asset pattern and portrait-crop requirement in `HOW-TO-EDIT.md`.

Files touched:

- `index.html`
- `HOW-TO-EDIT.md`
- `assets/memory-wall-pop-stroke-cropped.jpg`
- `assets/memory-wall-night-lights.mp4` and `assets/memory-wall-night-lights-poster.jpg`
- `assets/memory-wall-pop-stroke-team.mp4` and `assets/memory-wall-pop-stroke-team-poster.jpg`
- `assets/memory-wall-gold-glam.mp4` and `assets/memory-wall-gold-glam-poster.jpg`

Verification:

- `node --check js/main.js`: passed.
- `git diff --check`: passed (line-ending notices only).
- Confirmed all seven new Memory Wall assets exist. Each video is a 4-second H.264 MP4; each has a dedicated JPEG poster.
- Visually inspected the generated photo crop: it is a 780×960 portrait focused on the group, without the original stacked-photo collage presentation.
- Attempted local gstack `/browse` QA twice, but its browser service did not start within its 15-second timeout. Desktop/mobile browser rendering and console checks remain pending.

Unfinished:

- Fresh desktop and mobile browser QA, plus live-route verification after GitHub Pages finishes deploying, remain pending because the local gstack browser service is unavailable.

Next recommended task:

1. Verify the live homepage at desktop and 375px mobile widths, confirming the complete Memory Wall has no horizontal overflow and no console errors.

---

## First-gig Gallery published without upload integration, 2026-08-12

Model/tool: OpenAI Codex with gstack `/land-and-deploy` and `/browse`.

Status: Public Gallery release contains event photos only. The QR code, event-code form, file picker, upload JavaScript, Turnstile/API configuration, and Gallery video card were removed before deployment. The private upload backend remains local and undeployed.

Changed:

- Reframed the Gallery copy around Mango's first photo booth gig.
- Kept the supplied event-photo grid and public Gallery navigation.
- Removed `gallery/upload-qr.svg` and `gallery/upload.js`.
- Removed all guest-upload HTML, upload configuration metadata, and related Gallery CSS.
- Removed the Gallery video card so the page showcases photos only; homepage media remains unchanged.

Verification:

- Confirmed the Gallery contains nine photo cards and zero video, QR, upload, event-code, file-picker, Turnstile, or upload-API references.
- Confirmed all remaining local Gallery assets exist.
- Desktop and mobile browser QA passed before deployment with no console errors or horizontal overflow.

## Secure QR and manual guest uploader release, 2026-08-12

Model/tool: OpenAI Codex with coordinated frontend, backend, and independent security-review agents; gstack `/cso`, gstack `/browse`, and UI/UX Pro Max guidance.

Status: Approved for a static production release with the Gallery uploader visibly disabled. The reviewed upload backend remains local and is excluded from this public GitHub Pages repository; it is not deployed. Production upload activation remains blocked until the account-bound infrastructure and the separate scanning/moderation pipeline exist.

Changed:

- Replaced the Gallery's earlier upload-access placeholder with a polished QR and manual upload experience: private event-code unlock, Cloudflare Turnstile integration point, drag/drop and file picker, previews, consent and retention disclosure, upload progress, per-file status, retry, and removal.
- Added `gallery/upload-qr.svg`, deep-linked to the Gallery upload section. Guests still need a private event code; no event credential is embedded in the QR code.
- Added `gallery/upload.js` with production configuration held in public meta tags, event/session/upload tokens kept in memory only, exact API-origin/path validation, and a fail-closed unconfigured state.
- Removed Google Tag Manager from the Gallery upload route so third-party analytics cannot read event codes, upload tokens, filenames, or other upload-session data.
- Built `upload-api/` locally as a Cloudflare Worker backend with D1 event/session/upload records, Turnstile hostname/action/replay validation, exact CORS allowlisting, hashed credentials and client fingerprints, database-backed rate limits, one-time upload tokens, strict size/MIME/signature checks, randomized private R2 quarantine keys, no public read endpoint, and scheduled retention cleanup. It is excluded from the public Pages repository and must move to a separate private deployment repository before activation.
- Added fail-closed deployment controls: `workers_dev=false`, no custom route, placeholder D1 ID, blank frontend Turnstile site key, and `SCANNER_READY=false`.
- Documented the full production activation and emergency-shutoff checklist in `upload-api/README.md` and the editing guide.
- Added repository protections for local environment files, Worker state, logs, coverage, and `node_modules`.

Security controls and review:

- Independent CSO and adversarial review fixed exact upload-target pinning, analytics exposure on the uploader route, stable abuse throttling, versioned server-side consent records, event-wide quotas, active-event token checks, file-type contract mismatch, bounded parser work, scanner-heartbeat readiness, failed-attempt quota poisoning, possible orphaned R2 objects, cleanup starvation, and foreign-key/retention cleanup ordering.
- The supplied event media is being published at the business owner's explicit direction in this task. The business remains responsible for retaining the underlying participant and, where applicable, guardian public/marketing releases and honoring any withdrawal request.
- The upload Worker never serves quarantined files, keeps original filenames out of D1/R2 metadata, stores objects as `application/octet-stream`, and rejects malformed or unsupported image/video signatures before quarantine acceptance.
- Public/marketing promotion remains technically out of scope and must stay blocked until a separate authenticated scanner/re-encoder, human moderation workflow, approved-derivative retention/deletion policy, and affirmative media-release workflow are implemented.
- The final static-release review found no remaining blocker in the disabled Gallery state. Dependency audit reports zero vulnerabilities. Active uploads remain blocked pending the account-bound controls and a production-equivalent security review.

Verification:

- `upload-api/npm run verify:fresh`: passed TypeScript and 33/33 automated security tests.
- `npm audit`: zero vulnerabilities.
- Local D1 migration: passed (14 commands; repeat run reported no pending migrations).
- `wrangler deploy --dry-run`: passed; no remote deployment occurred.
- `node --check` passed for `build-pages.js`, `js/main.js`, and `gallery/upload.js`.
- `node build-pages.js`: passed and regenerated the nine service/location pages.
- `sitemap.xml`: parsed successfully.
- Search found zero current old-company-name references and zero `Love Is in the Air` references outside historical status notes.
- Final Gallery browser QA passed at 1280x720 and 375x812: HTTP 200, no console errors, no horizontal overflow, disabled event/unlock controls, zero API requests, zero Turnstile requests, and zero GTM requests while production configuration is absent.
- Mobile touch targets measured 44px for Copy link and 48px for Unlock.
- `git diff --check`: passed; line-ending notices only.

Production activation blockers:

1. Move the reviewed local `upload-api/` foundation into a separate private deployment repository, then configure Cloudflare authentication and zone/DNS setup for `uploads.mangosphotobooth.com`, with existing GitHub Pages and mail DNS records preserved.
2. Production D1, private R2 quarantine, separate private derivative-delivery storage, Worker secrets/peppers, and an allowlisted Turnstile widget.
3. A separately authenticated scanner/decode/re-encode service and human moderation/admin workflow, including deletion and media-release withdrawal handling.
4. WAF/edge rate limits, redacted observability and alerts, R2 lifecycle backup rules, an event seed, and production-equivalent staging abuse tests.
5. Only after all controls pass: set the real frontend Turnstile site key, set `SCANNER_READY=true`, deploy, and repeat signed-out production QA.

Next recommended task:

1. Provision the Cloudflare account resources and scanner/moderator environment in a staging zone.
2. Execute the exact activation checklist in `upload-api/README.md` without relaxing the fail-closed defaults.
3. Activate guest submissions only after the staging security gate passes; the public Gallery must remain disabled until then.

## Event gallery, hero media, and content update prepared locally, 2026-08-11

Model/tool: OpenAI Codex with UI/UX Pro Max styling guidance and gstack `/browse` for desktop and mobile QA.

Status: Local only. The completed portion is uncommitted, not pushed, and not live. Guest-upload activation remains paused for the planned security build; two requested Google reviews are not currently published on the verified business profile.

Changed:

- Added a four-slide homepage hero using the existing branded lead image, two selected supplied event photos, and an optimized 9.8-second portrait event video with a still poster. The slideshow pauses hidden videos, plays the active video, and respects reduced-motion settings.
- Replaced the homepage birthday card with the exact supplied `HAPPY BIRTHDAY!.png` image, optimized as `assets/event-birthday-friends.webp`.
- Rebuilt the Memory Wall with the supplied event photos and video instead of stock images. Video playback is limited to media currently visible on screen.
- Added a responsive `Gallery` tab to the shared desktop and mobile navigation, related-page links, and footer links across the homepage and all nine generated pages.
- Created `gallery/index.html` with a dedicated social-preview card, Gallery structured data, a polished ten-item photo/video grid, and a private guest-upload access section.
- Kept the upload section honest for the static GitHub Pages site: it requests an event-specific upload link instead of presenting a nonfunctional file control or QR code.
- Preserved the completed company-name change to `Mango's Photo Booth & Entertainment`, rich text-message/social preview metadata, revised backdrop wording, compact 48-hour badge, removed `Love Is in the Air` backdrop, and keychain motion video.
- Added a source-verified Google review section before the booking CTA using the published 5-star Heidy Olea review. The displayed excerpt is verbatim, links to the live Google listing, and identifies Krisi's 18th birthday as the event.
- Added the Gallery route to `sitemap.xml` and documented the new page and event-media assets in `HOW-TO-EDIT.md` and `llms.txt`.
- Fixed the long guest-upload button at phone widths so the Gallery route has no horizontal overflow.

New assets:

- `assets/event-birthday-friends.webp`
- `assets/event-party-friends-01.webp` through `assets/event-party-friends-08.webp`
- `assets/event-party-hero.mp4`
- `assets/event-party-hero-poster.jpg`

Verification:

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: passed and regenerated all nine service/location pages.
- `sitemap.xml` parsed successfully with 11 URLs.
- All 11 new event assets exist; all nine generated pages contain Gallery navigation links.
- Search confirmed zero old `Mango's Photo Booth Company` references and zero `Love Is in the Air` references outside historical status notes.
- Local homepage, Gallery, and generated birthday routes returned HTTP 200 with no browser-console errors.
- Hero and Gallery videos reached ready state 4 and advanced while visible on desktop and phone viewports.
- Desktop screenshots confirmed the birthday replacement, event-photo hero crops, video hero frame, Memory Wall, Gallery hero/grid, and upload-access panel.
- At 375x812, the homepage, Gallery, and birthday route have zero horizontal overflow; the mobile menu includes Gallery; the four-slide hero and upload-access section render correctly.
- `git diff --check`: passed; line-ending notices only.
- Google Maps searches by the current company name and business phone number resolved to the same profile. That profile showed a 5.0 rating with one published review, from Heidy Olea. No second listing was found.
- The review section passed desktop and 375x812 browser checks with no console errors, no settled horizontal overflow, a 47px rating badge, and a 44px Google-review link touch target.

Unfinished / input needed:

- QR code and direct manual uploads are intentionally paused until the user says `act`; the planned secure upload architecture requires an authenticated API, protected object storage, validation/quarantine, malware scanning, rate limits, moderation, and an access-controlled admin workflow.
- Google currently publishes only the Heidy Olea review on the verified business profile. Reviews from Jailyn and Krisi were not present and were not invented. Gmail search could not be used as a secondary source because the Google Workspace connector requires reauthentication.
- Existing unrelated GTM/UI analytics edits remain local and uncommitted in the same working tree.
- No commit, push, or production deployment was performed.

Next recommended task:

1. Wait for the user's explicit `act` instruction before building the secure QR/manual guest-upload system with coordinated agents.
2. Re-check Google after Jailyn and Krisi publish their reviews, then add only their verified wording.
3. Commit or publish only after the user explicitly approves the final completed set.

## Requested website content update prepared locally, 2026-08-10

Model/tool: OpenAI Codex with UI/UX Pro Max styling guidance and gstack `/browse` for responsive browser QA.

Status: Local only. The completed portion is uncommitted, not pushed, and not live. Several requested gallery, event-media, review, and frame-delivery items still need source material or a destination from the user.

Changed:

- Replaced the old `Mango's Photo Booth Company` name with `Mango's Photo Booth & Entertainment` across the homepage, the shared generated-page source, all nine generated pages, structured data, social metadata, the web app manifest, `llms.txt`, footer/header labels, and the main stylesheet label.
- Completed the homepage Open Graph and Twitter Card metadata used for rich link previews in text messages and social apps, including the secure image URL, JPEG type, actual 1536x1024 dimensions, and descriptive image text.
- Replaced the Memory Station keychain still image with an optimized 10-second portrait MP4 made from the supplied finger-touch keychain clip. The video is muted, loops, plays inline, and retains the prior image as a fallback poster.
- Contained the portrait video inside the existing desktop and mobile card so its intrinsic aspect ratio cannot stretch the section.
- Restyled the `48 hrs / Full gallery delivered` callout as a compact pill inside the gallery image.
- Changed the backdrop introduction to `Our most popular backdrops.`, clarified that the listed starting options are included with Mango's Luxury Experience, and replaced the custom-backdrop box copy with `For more backdrop options or a custom backdrop, talk to our designer.`
- Removed the `Love Is in the Air` backdrop, renumbered the remaining Deluxe backdrops, and updated the documented backdrop count from 16 to 15.
- Regenerated all nine service/location pages from `build-pages.js` so their company name and share-preview metadata remain consistent with the source of truth.

Files touched for this update:

- `index.html`
- `css/styles.css`
- `assets/memory-station-keychains-motion.mp4`
- `build-pages.js`
- All nine generated service/location `index.html` files
- `site.webmanifest`
- `llms.txt`
- `js/main.js` (brand wording in an existing comment only; other pending analytics edits predated this update)
- `HOW-TO-EDIT.md`
- `PROJECT_STATUS.md`

Verification:

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: passed and regenerated nine pages.
- `site.webmanifest` parsed successfully as JSON with the new company name.
- Search confirmed zero remaining old-company-name references outside historical status notes and zero `Love Is in the Air` backdrop references.
- The new H.264 MP4 is 720x1280, 10.17 seconds, approximately 1.4 MB, and loaded to ready state 4 in Chromium.
- Browser playback test succeeded and confirmed the video time advances while playing.
- Desktop, tablet, and 375x812 mobile screenshots confirmed the keychain video crop, card copy, compact 48-hour pill, and revised backdrop presentation.
- The keychain card measures 451px tall on desktop after containing the portrait video; the mobile layout has no horizontal overflow after its existing entrance animation settles.
- Homepage Open Graph/Twitter metadata inspection returned the new business name and complete preview image fields.
- Homepage and generated birthday route returned HTTP 200 with no browser-console errors; the birthday route retained four CheckCherry booking links and had no horizontal overflow.
- `git diff --check`: passed; line-ending notices only.

Unfinished / input needed:

- Gallery tab/page, QR upload, and manual upload: GitHub Pages is static and cannot receive files by itself. Provide a Dropbox File Request, CheckCherry gallery/upload, Google Drive request, or another guest-upload destination. A Dropbox File Request is the simplest no-login option.
- Krisi gallery image and the Krisi/Drew Memory Wall media: provide the two event gallery links or original photos, GIFs, and videos, plus the Krisi gallery view to use for the screenshot-style card.
- Birthday image: provide the exact Jailyn-and-friend GIF or confirm whether `Video/IMG_0054.mov` is the intended clip so it can be converted and installed.
- Reviews: provide the exact review text from Hiedy, Jailyn, and Krisi, and confirm whether `Hiedy` is the intended spelling.
- Krisi's frame: clarify whether this is a digital frame design or a physical deliverable, and provide the source photos, size/specification, recipient, and delivery method.
- Existing unrelated GTM/UI analytics changes remain local and uncommitted in the same working tree.

Next recommended task:

1. Collect the upload destination, Krisi/Drew gallery access, Jailyn GIF confirmation, exact review copy, and Krisi frame details.
2. Build the Gallery page and remaining content from those supplied assets, then repeat responsive QA.
3. Commit or publish only after the user explicitly approves the completed set.

## Hero social banner updated locally, 2026-08-04

Model/tool: OpenAI Codex with UI/UX Pro Max guidance; visual tooling intentionally skipped at coordinator request.

Status: Production release authorized. The scoped hero banner is ready to commit and push to `main`; production verification is still pending.

Changed:

- Replaced the homepage hero's right-edge vertical Instagram/Facebook rail with a full-width horizontal banner attached to the hero's bottom edge.
- Ordered the banner content as Instagram icon, exact CTA text “Follow us on”, then Facebook icon.
- Used a translucent, muted-yellow gradient, pale-yellow icon/text treatment, subtle top border, and backdrop blur so the banner stays integrated with the dark hero image.
- Preserved the social destinations, accessible link labels, 44–48px touch targets, visible focus treatment, and external-link protection.
- Raised the desktop scroll cue and desktop/mobile hero dot indicator above the banner to prevent overlap.

Files touched:

- `index.html`
- `css/styles.css`
- `PROJECT_STATUS.md`

Verification:

- Python HTML tag-structure check: passed.
- CSS comment/string/brace-structure check: passed.
- Source-order assertion confirmed Instagram -> “Follow us on” -> Facebook.
- `node --check js/main.js`: passed.
- `git diff --check`: passed; line-ending notices only.
- Local preview returned HTTP 200 with the expected Mango's Photo Booth page title at `http://127.0.0.1:4173/`.
- Fresh browser QA at 1280×720 and 375×812 confirmed a full-width bottom-edge banner, correct Instagram -> “Follow us on” -> Facebook order, 44px mobile link targets, and no horizontal overflow.
- Fresh local browser-console check: no errors after a clean reload.

Unfinished:

- Existing unrelated local analytics/GTM work remains uncommitted and unchanged by this task.
- Production verification will be added after the GitHub Pages deployment completes.

Next recommended task:

1. Commit only the hero banner changes and this handoff entry.
2. Push to `main`, wait for GitHub Pages, and verify the live homepage at desktop and mobile widths.

## UI engagement analytics prepared locally, 2026-08-04

Model/tool: OpenAI Codex with gstack `/browse`.

Status: Local only. Uncommitted, not pushed, and not live.

Changed:

- Added stable analytics section names across the homepage and the shared generated-page template.
- Added `cta_click` tracking for hero actions with `cta_name`, `location`, and `section_name`.
- Enriched `book_click`, `call_click`, and `email_click` with their page section and CTA location.
- Added `section_view` after a section remains meaningfully visible for at least one second.
- Added `section_engagement` with `section_time_seconds`, section position, and exposure count whenever a visitor leaves a section or hides the page.
- Added one-time `scroll_depth` milestones at 25%, 50%, 75%, and 90%.
- Added `faq_open` with the FAQ index and question.
- Regenerated all nine service/location pages from `build-pages.js`.

Files touched:

- `index.html`
- `build-pages.js`
- `js/main.js`
- All nine generated service/location `index.html` files
- `PROJECT_STATUS.md`

Verification:

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: passed and regenerated nine pages.
- `git diff --check`: passed; line-ending notices only.
- Desktop browser test confirmed a one-second `section_view` for the hero, a `cta_click` for the hero's View Packages action, hero and packages `section_engagement` durations, and one-time 25/50/75/90 scroll events.
- Fast smooth-scroll over the Events section did not count it as a meaningful section view.
- Generated wedding page emitted its hero `section_view` on desktop and at 375x812 mobile viewport.
- Homepage and generated-page browser consoles were clean.

Unfinished:

- In GTM, create data-layer variables for `section_name`, `section_position`, `section_time_seconds`, `exposure_index`, `cta_name`, `location`, `faq_index`, `faq_question`, and `scroll_percent`.
- Add one GA4 event tag whose event name is `{{Event}}`, triggered by the custom-event regex `^(cta_click|book_click|call_click|email_click|faq_open|scroll_depth|section_view|section_engagement)$`, and forward the data-layer parameters.
- In GA4, register event-scoped custom dimensions for section/CTA/FAQ/scroll labels and a custom metric for `section_time_seconds`.
- Complete the payment-free CheckCherry `purchase` test and publish the corrected GTM container.
- Commit and push the pending GTM and UI-analytics website changes only after the user explicitly approves deployment.

Next recommended task:

1. Finish the CheckCherry purchase test.
2. Configure and Preview the single website UI-event tag in GTM.
3. Create the GA4 custom definitions and a funnel exploration for `section_view` -> `cta_click`/`book_click` -> `generate_lead` -> `purchase`.
4. Deploy only after the complete preview passes.

## GTM conversion foundation prepared locally, 2026-07-30

Model/tool: OpenAI Codex with gstack `/browse`.

Status: Local only. Uncommitted, not pushed, and not live.

Changed:

- Replaced the direct GA4 loader in `index.html` with Google Tag Manager container `GTM-WN66G9LF` at the top of `<head>`.
- Added the GTM noscript iframe immediately after the opening `<body>` tag.
- Added both snippets to the shared `build-pages.js` template and regenerated all nine service/location pages.
- Updated `js/main.js` so `book_click`, `call_click`, and `email_click` are pushed into `dataLayer` for GTM triggers instead of calling `window.gtag` directly.

Files touched:

- `index.html`
- `build-pages.js`
- `js/main.js`
- All nine generated service/location `index.html` files
- `PROJECT_STATUS.md`

Verification:

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: passed and regenerated nine pages.
- All ten HTML routes contain exactly one GTM loader and one noscript iframe for `GTM-WN66G9LF`, with no direct `gtag.js` loader.
- GTM loader request returned HTTP `200` locally and `gtm.js` initialized in `dataLayer`.
- A simulated CheckCherry header click produced `{ event: "book_click", location: "header" }`.
- Clean local reload completed with no browser-console errors.
- `git diff --check`: passed.

Unfinished:

- In GTM, add the GA4 Google tag for `G-9EWLK0CQBD`.
- Map CheckCherry `check_cherry_new_lead` to GA4 `generate_lead`.
- Map CheckCherry `check_cherry_new_booking` to GA4 `purchase` using `transactionId` and `transactionTotal`; do not send hashed-email fields to GA4.
- Add GTM triggers for the website's `book_click`, `call_click`, and `email_click` events.
- Publish the GTM container, enable it under CheckCherry `Manage > Business Settings > Integrations`, and configure GA4 cross-domain measurement.
- Complete a signed-out test booking and verify the lead and purchase events before pushing the website changes.

Next recommended task:

1. Configure and publish the GA4 tags and CheckCherry event mappings inside `GTM-WN66G9LF`.
2. Enable `GTM-WN66G9LF` in CheckCherry and configure cross-domain measurement.
3. Verify the complete booking flow, then commit and push only when the user explicitly approves going live.

## GA4 tracking enabled, 2026-07-30

Model/tool: OpenAI Codex with gstack `/browse`.

Status: Pushed live to `main`.

Changed:

- Added the Google tag for GA4 measurement ID `G-9EWLK0CQBD` immediately after `<head>` in `index.html`.
- Added the same tag to the shared `build-pages.js` head template and regenerated all nine service/location pages.
- Existing `book_click`, `call_click`, and `email_click` event tracking in `js/main.js` is now active because `window.gtag` is available.
- Implementation commit: `d558dcc` (`Enable GA4 tracking across the site`).

Files touched:

- `index.html`
- `build-pages.js`
- All nine generated service/location `index.html` files
- `PROJECT_STATUS.md`

Verification:

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: passed and regenerated nine pages.
- All ten HTML routes contain exactly one `gtag.js` loader and one `G-9EWLK0CQBD` config call; no `G-XXXXXXXXXX` placeholders remain.
- `git diff --check`: passed.
- Local homepage and generated wedding route initialized `window.gtag` and the correct data-layer config with no console errors.
- Local GA4 collection request returned HTTP `204`.
- Production `https://mangosphotobooth.com/` loaded `gtag.js` with the correct measurement ID and sent a production `page_view` that returned HTTP `204`, with no console errors.

Unfinished:

- Confirm visits appear in GA4 Realtime after Google finishes processing the new stream.
- In GA4 Admin, mark `book_click`, `call_click`, and `email_click` as key events after they first appear.
- Google Analytics MCP authorization is paused until a Desktop OAuth client JSON is created and downloaded.

Next recommended task:

1. Open GA4 Realtime and confirm the live website visit appears.
2. Trigger one booking, phone, and email link test, then mark those three events as key events in GA4.
3. Resume the Google Analytics MCP Desktop OAuth setup when ready.

Last updated: 2026-07-10

## Current local update, 2026-07-10

Status: Pushed live to `main`.

Update on 2026-07-11:

- Replaced the Memory Station/keychain add-on image with `assets/memory-station-keychains-updated.png`.
- Homepage now references the updated image in the Memory Station card.
- Replaced package card placeholders with:
  - `assets/package-mangos-luxury.png` for Mango's Luxury Experience.
  - `assets/package-mangos-platinum.png` for Mango's Platinum Experience.
  - `assets/package-mangos-big-kahuna.png` for Mango's Big Kahuna Experience.
- Renamed visible package titles and matching package copy/structured data/generated pages from Classic/Party Glam/Big Kahuna to the new Mango's experience names while keeping prices and CheckCherry event IDs unchanged.
- Ran `node --check build-pages.js`, `node --check js/main.js`, and `node build-pages.js`; all passed.
- Committed as `18cc57f` (`Update package branding and homepage visuals`) and pushed to `main`.
- Production text check passed after push: live homepage shows Mango's Luxury Experience, Mango's Platinum Experience, Mango's Big Kahuna Experience, updated Memory Station image/copy, and no browser console errors.

Completed in this pass:

- Added `assets/hero-cover-updated.jpg` from the updated supplied hero photo found at `Website/New folder/image (1).jpg`.
- Updated the homepage hero image, preload, Open Graph image, Twitter image, and generated-page social image source to use `hero-cover-updated.jpg`.
- Moved the full Mango's Memory Station add-on card below the three main package cards.
- Simplified the Big Kahuna feature text from the awkward wrapped “Live Memory Station — keychains or magnets” line to “Live keychain or magnet station.”
- Tightened mobile CSS for package feature rows, Memory Station card width, card CTA button widths, and the floating Book Now button so the layout does not overflow or cover as much content.
- Regenerated all nine service/location pages with `node build-pages.js`.

Verification performed:

- `node --check build-pages.js`: passed.
- `node --check js/main.js`: passed.
- `node build-pages.js`: passed, generated all nine pages.
- Text/reference check confirms homepage and generated pages reference `hero-cover-updated.jpg`, package IDs remain Classic `182525`, Glam `182524`, Big Kahuna `182523`, and the Memory Station card is now after the package grid.

Still needs:

- Quick local browser visual QA on mobile before any push/deploy.
- If visual QA passes, commit and push only if the user asks to make it live.

Next recommended task:

1. Open the homepage locally at mobile width and verify the package section plus Memory Station card alignment.
2. If it looks right, commit and push to `main`.

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

- Prices remain Classic $550, Party Glam $650, and Big Kahuna $1,400.
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
