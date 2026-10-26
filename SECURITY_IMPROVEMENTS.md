# Mango's Photo Booth — security improvements

Date: 2026-10-26. Branch: `security/2026-10-26-audit-hardening`.
Baseline: `cb922bec82a11ce7a8ba4840631d5388a44c350d`.
**Mango's Photo Booth only.** This document records the local audit snapshot. The owner authorized publication on 2026-10-26; subsequent CI and live verification are recorded in `PROJECT_STATUS.md`.

## What changed

| Files | Change and purpose | Verification/status |
|---|---|---|
| `index.html`, `gallery/index.html` | Added early CSP: `base-uri 'self'; object-src 'none'; form-action 'self' https://checkcherry.com https://*.checkcherry.com`; added explicit `strict-origin-when-cross-origin` referrer meta | VERIFIED locally: synthetic forbidden base/object/form operations blocked; normal pages/integration render. Pending deployment verification |
| `build-pages.js` and its 13 generated `*/index.html` files | Same metadata is generated consistently, preserving the existing source-of-truth workflow | VERIFIED: generator runs, output is byte-idempotent; original HTML is unchanged after removing the two added tags |
| `.gitignore` | Added `*.pem`, `*.key`, `*.p12`, `*.pfx` to reduce accidental key/signing-file publication | VERIFIED: `git check-ignore` recognizes the four extensions and existing environment/upload exclusions. This does not remove already tracked files or replace scanning |
| `_headers` | Removed an unvalidated, inactive subdomain-wide HSTS draft; changed the unused payment permission draft to `payment=()` | VERIFIED file change only. GitHub Pages ignores this file; no live security header changed |
| `scripts/security-check.mjs` | Added dependency-free checks of CSP/referrer tags, HTTPS reservation links, safe new-tab links, disabled uploads, valid JSON-LD and dangerous first-party JS patterns | VERIFIED: passes across 15 pages / 67 booking links. This is a narrow regression check, not a full SAST/secret scanner |
| `.github/workflows/security.yml` | Proposed one PR/manual/weekly workflow for generator consistency, static checks and CodeQL JavaScript scanning; bounded runtime, SHA-pinned actions, no deploy permissions/app secrets, no persisted checkout credentials | IMPLEMENTED BUT UNVERIFIED on GitHub. Script portions passed locally; CodeQL/action execution and complete workflow validation remain pending |
| `.github/dependabot.yml` | Proposed weekly action-update PRs; no new runtime dependency ecosystem introduced | IMPLEMENTED BUT UNVERIFIED: activates only after approved default-branch publication. Repository alert/security-update switches remain unchanged |
| `SECURITY_AUDIT.md`, `SECURITY_IMPROVEMENTS.md`, `SECURITY_MAINTENANCE.md`, `PROJECT_STATUS.md` | Recorded evidence, limitations, remaining owner decisions and handoff | Local documentation; contains no customer submissions, credential values or cookie values |

The metadata makes specific browser decisions safer. The explicit referrer policy matches the default in many current browsers and mainly makes the intent durable. The conservative CSP does **not** restrict script execution, prevent all XSS or provide clickjacking protection. [MDN explains CSP delivery and limitations](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

The action commits were resolved read-only against official repositories on the audit date:

| Action | Tag resolved | Commit |
|---|---|---|
| `actions/checkout` | v4 | `11d5960a326750d5838078e36cf38b85af677262` |
| `actions/setup-node` | v4 | `49933ea5288caeca8642d1e84afbd3f7d6820020` |
| `github/codeql-action` | v4 annotated tag | `9b3254085494b55a0f7c4c2b3d2d52cc712ce370` |

Only CodeQL's job requests `security-events: write`; the other check job has `contents: read`. No `pages: write`, `id-token: write`, PR approval permission or live provider credential is granted. SHA pinning follows [GitHub's Actions hardening guidance](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions); this is not a complete transitive-action audit. No existing deploy workflow was replaced, and existing GitHub secret scanning remains the secret-monitoring service.

## Verification performed

- **VERIFIED:** `node build-pages.js`; 13 generated pages. Running it again produced identical output.
- **VERIFIED:** `node scripts/security-check.mjs`; 15 public pages, 67 HTTPS booking links and security invariants pass.
- **VERIFIED:** independent local checks resolved 710 internal links/resources and 222 anchors with zero missing targets.
- **VERIFIED:** all original HTML, titles, metadata, JSON-LD, content, prices and links are preserved except the two intentional added tags. CSS, runtime JS, robots, sitemap, CNAME, `llms.txt` and manifest are unchanged.
- **VERIFIED:** gstack `/browse` opened all 15 routes; local route console checks found no unexpected errors. Loopback-only CSP tests blocked `base-uri`, `object-src` and `form-action` cases.
- **VERIFIED:** viewport checks at 375, 768 and 1280 pixels; mobile menu open/Escape, package scrolling, five hero slides and 15 Memory Wall cards duplicated to 30 remain functional. Homepage/corporate/gallery screenshots are retained locally.
- **VERIFIED:** CheckCherry widget renders under the new policy; reservation destinations load. No contact form, booking, payment or customer message was submitted.
- **VERIFIED within coverage:** tracked/history secret-pattern review and post-change high-confidence pattern review found no confirmed privileged credential exposure. Full secret-scanner executables were unavailable.
- **VERIFIED:** native npm audit identified nine affected package nodes in the ignored, inactive upload foundation. That result is unchanged; no Mango packages were upgraded or installed.
- **VERIFIED:** `git diff --check` passed. Workflow content, trigger scope, action provenance and permissions were reviewed locally. No actionlint/YAML validation tool was installed; remote CI/CodeQL execution is unverified.

## Differential review and residual risk

The baseline was inspected with `git show`, history and explicit diffs. Thirteen generated pages share the generator's two-line change; the homepage and gallery each add the same two metadata tags. Security code was not removed from deployed runtime logic. The inactive HSTS draft was removed because its required domain/HTTPS evidence was unavailable, not to weaken a live header.

The main behavioral risk is a future CheckCherry change that submits a native form outside its current domain family; the new `form-action` policy would block it. Recheck new widget features before publication. Script loading, AJAX and existing navigation remain allowed. The scan workflow is a new CI surface but has no production secret or deployment capability; GitHub execution still needs review after approval.

Recommendation: **conditional approval for a reviewed publication**, followed by deployed-page and CI checks. Header/CDN changes, branch rules and provider account work require separate decisions. The inactive upload service remains blocked from activation pending a dedicated dependency/security review.

## What approval is still needed

1. **AUTHORIZED on 2026-10-26:** the owner requested "push live," authorizing publication of this security work. CI and live verification are tracked in `PROJECT_STATUS.md`.
2. Approval to enable repository alerts/security updates, restrict Actions if desired, and protect `main` with the new passing checks.
3. Approval for any Cloudflare/CDN/DNS plan needed for real response headers. No migration is required merely to use these local fixes.
4. Owner review of CheckCherry spam controls, lead access, retention and a controlled delivery test. No settings or customer records were accessed/changed.

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for findings and [SECURITY_MAINTENANCE.md](SECURITY_MAINTENANCE.md) for exact follow-up steps.
