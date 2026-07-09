# Mango's Photo Booth Website

Before changing this project, read `PROJECT_STATUS.md` and `HOW-TO-EDIT.md`.

## Required handoff

After every implementation session, update `PROJECT_STATUS.md` with:

- the date and model/tool used;
- what changed and which files were touched;
- verification performed and its result;
- what remains unfinished;
- the exact next recommended task;
- whether changes are local, committed, pushed, or live.

Keep the newest entry at the top. Do not mark work complete without fresh verification.

## Project rules

- This is a static HTML/CSS/JavaScript site hosted from `main` on GitHub Pages.
- `build-pages.js` is the source of truth for the nine generated service and location pages. Edit the generator, then run `node build-pages.js`; do not hand-edit generated pages.
- Preserve current prices unless the user explicitly changes them.
- Keep CheckCherry package links, visible package copy, structured data, FAQs, `llms.txt`, and generated pages consistent.
- Optimize project images before committing. Do not publish watermarked assets.
- Test desktop and mobile layouts, booking links, generated pages, and browser console output before pushing.

