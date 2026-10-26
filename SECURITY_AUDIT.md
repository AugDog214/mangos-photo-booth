# Mango's Photo Booth — SECURITY AUDIT

Date: 2026-10-26. Scope: **Mango's Photo Booth & Entertainment only**, as corrected by the owner during the session. No comparative audit of another business is included.

Baseline commit: `cb922bec82a11ce7a8ba4840631d5388a44c350d`.
Working branch: `security/2026-10-26-audit-hardening`.
Initial audit snapshot: changes were local and uncommitted; no publication or external setting changes had occurred. The owner subsequently authorized publication on 2026-10-26. Release verification is recorded in `PROJECT_STATUS.md`; the findings below retain their original audit-time context. DNS, protected settings, secrets and inquiry submissions remain outside this publication.

## Release verification, 2026-10-26

**VERIFIED LIVE:** owner-authorized [PR #1](https://github.com/AugDog214/mangos-photo-booth/pull/1) merged as `9163b2045e898724473eaa9e33f01e16cd2e3ee4`. The [security workflow](https://github.com/AugDog214/mangos-photo-booth/actions/runs/40381210454) passed its static and CodeQL jobs, with zero open alerts reported for the PR analysis. The [Pages deployment](https://github.com/AugDog214/mangos-photo-booth/actions/runs/40381466395) succeeded. All fifteen live routes returned 200 with the expected meta policies; responsive/navigation and CheckCherry rendering checks passed without a submission. These results supersede the initial local-only/deployment-pending statuses below.

**IMPLEMENTED BUT UNVERIFIED for reliable operation:** weekly Dependabot configuration is published, but its [first managed update run](https://github.com/AugDog214/mangos-photo-booth/actions/runs/40381475608) failed fetching job details with "missing response". GitHub refused a retry. No cause or resolution is claimed. Actual response headers, protected repository settings, provider-side controls and dormant upload findings remain unresolved as stated in the audit. Non-blocking action-runtime/runner migration notices are recorded in `PROJECT_STATUS.md` for maintenance.

## Assessment

**VERIFIED:** No exploitable P0/P1 vulnerability or privileged credential leak was established in the published site within the reviewed scope. This is not a guarantee that none exists. The main gaps concern browser defense in depth, repository controls, provider-managed form security and unused upload-development tooling.

**VERIFIED locally at audit time:** Small CSP and referrer additions work across the 15 pages, retain the existing CheckCherry integration, and leave original content/design HTML intact. CodeQL, static checks and weekly action updates were initially **IMPLEMENTED BUT UNVERIFIED** remotely. Consult the release entry in `PROJECT_STATUS.md` for subsequent CI and deployed verification.

## Status meanings

- **VERIFIED:** directly observed or tested in the stated environment.
- **EXISTING:** protection present before this session; verification scope is stated.
- **IMPLEMENTED BUT UNVERIFIED:** local configuration exists, but its external/deployed effect is untested.
- **NEEDS APPROVAL:** an external setting, publication, account action or service decision remains for the owner.
- **NOT APPLICABLE:** no corresponding runtime component exists.
- **NOT ASSESSED:** evidence/access/testing was insufficient; this is not a passing result.

## 1. Tools discovered on October 25

**VERIFIED:** The installation receipt records 16 admitted instruction/reference skills, one held helper, no new scanner executables, no installed hooks and no automatic updates. All **3,706 installed file copies** were SHA-256 checked against the receipt: zero missing files and zero hash mismatches. This verifies consistency with the reviewed receipt, not intrinsic correctness of the material.

Receipt: `%USERPROFILE%/OneDrive/Documents/ChatGPT/Remotie APP/.gstack/security-reports/2026-10-25/skill-installation-receipt.json`.
Receipt SHA-256: `0d3923a82ed0dc986ca9dcc7e4862cc82259b4de2a97c663e838fb3a879becf7`.
Each installed skill's exact directory is `%USERPROFILE%/.codex/skills/<exact-name-below>/`. The selected skills' `LOCAL-ADMISSION.md` constraints were read; their common constraints have an identical verified hash. Relevant SKILL/reference files were inspected as untrusted guidance. Unsupported Claude orchestration, remote scripts, telemetry prompts and automatic upgrades were not activated.

| Exact skill | Source | Pinned source commit | Operational/use status | Capability |
|---|---|---|---|---|
| `security-best-practices` | [openai/skills](https://github.com/openai/skills) | `49f948faa9258a0c61caceaf225e179651397431` | VERIFIED: used as manual guidance | JavaScript and frontend secure-coding review |
| `security-threat-model` | [openai/skills](https://github.com/openai/skills) | `49f948faa9258a0c61caceaf225e179651397431` | EXISTING: available, inactive for this site | Assets, attacker capabilities and trust boundaries |
| `security-guidance` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | EXISTING: available, inactive for this site | OWASP ASVS control reference |
| `web-security-review` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | VERIFIED: used as manual guidance | OWASP Top 10 source/configuration review |
| `api-security-review` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | EXISTING: available, inactive for this site | OWASP API Top 10; no published first-party API here |
| `mobile-code-review` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | EXISTING: available, inactive for this site | Mobile/OWASP MASVS; not applicable to this site |
| `secrets-scan` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | VERIFIED: used as manual guidance | Manual pattern workflow; external scanners are separate |
| `sca-audit` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | VERIFIED: used as manual guidance | Dependency advisory and reachability triage |
| `agent-security-audit` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | EXISTING: available, inactive for this site | Agent permission/injection review; no agent in site runtime |
| `mcp-server-review` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | EXISTING: available, inactive for this site | MCP source/config review; no MCP in site runtime |
| `prompt-injection-test` | [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | EXISTING: available, inactive for this site | AI application testing; no AI application on this site |
| `differential-review` | [trailofbits/skills](https://github.com/trailofbits/skills) | `196a9073ab10d35bacf111f945e02c00b2c6883a` | VERIFIED: used as manual guidance | Baseline/diff and regression analysis |
| `sharp-edges` | [trailofbits/skills](https://github.com/trailofbits/skills) | `196a9073ab10d35bacf111f945e02c00b2c6883a` | EXISTING: available, inactive for this site | Unsafe API/configuration defaults |
| `variant-analysis` | [trailofbits/skills](https://github.com/trailofbits/skills) | `196a9073ab10d35bacf111f945e02c00b2c6883a` | EXISTING: available, inactive for this site | Search for variants of an established bug |
| `fp-check` | [trailofbits/skills](https://github.com/trailofbits/skills) | `196a9073ab10d35bacf111f945e02c00b2c6883a` | VERIFIED: used as manual guidance | Verify source-to-sink reachability and false positives |
| `property-based-testing` | [trailofbits/skills](https://github.com/trailofbits/skills) | `196a9073ab10d35bacf111f945e02c00b2c6883a` | EXISTING: available, inactive for this site | Generated invariant tests; no PBT dependency installed |

These are operational as **Codex-readable guidance**, not standalone vulnerability scanners. Reading a skill does not mean its suggested scanner ran. API/mobile/AI/MCP skills were inventoried but no full audit or active tests under those categories were performed for the site.

The October 25 research directory contains the following source snapshots. They are **available but inactive**, not installed whole repositories or executable services. `skill-research/` below is relative to the receipt's directory.

| Repository | Reviewed commit | Exact snapshot subdirectory | Actual status |
|---|---|---|---|
| [openai/skills](https://github.com/openai/skills) | `49f948faa9258a0c61caceaf225e179651397431` | `skill-research/openai__skills/` | Review snapshot only; not an operational scanner or full installed plugin |
| [trailofbits/skills](https://github.com/trailofbits/skills) | `196a9073ab10d35bacf111f945e02c00b2c6883a` | `skill-research/trailofbits__skills/` | Review snapshot only; not an operational scanner or full installed plugin |
| [semgrep/skills](https://github.com/semgrep/skills) | `68177b8830f96cd9d10dacbb14dde2566360503d` | `skill-research/semgrep__skills/` | Review snapshot only; not an operational scanner or full installed plugin |
| [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook) | `65d4efd2cd0b081d52101e9708792b944e4ddebb` | `skill-research/OWASP__secure-agent-playbook/` | Review snapshot only; not an operational scanner or full installed plugin |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | `1ce2a78feb497ab276fc4073607996f5b08138cb` | `skill-research/github__awesome-copilot/` | Review snapshot only; not an operational scanner or full installed plugin |
| [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner) | `de5fcf08fe0b32841602513c5b760a11ef4cbc4a` | `skill-research/cisco-ai-defense__skill-scanner/` | Review snapshot only; not an operational scanner or full installed plugin |

**EXISTING, HELD:** `supply-chain-risk-auditor` from the Trail of Bits snapshot was not admitted. Its prior review established Windows executable-resolution and offline-subprocess network defects. It was neither installed nor executed here. Cisco's scanner, Semgrep skills and Awesome Copilot research material were not silently activated.

Other tools inspected:

| Tool | Version/source | Installation location | Actual status/use |
|---|---|---|---|
| Git | 2.52.0.windows.1, Git for Windows | `%ProgramFiles%/Git/cmd/git.exe` | VERIFIED operational: history, baseline, diff, branch checks |
| GitHub CLI | 2.89.0, github/cli | `%ProgramFiles%/GitHub CLI/gh.exe` | VERIFIED operational: read-only Pages, security and Actions APIs; settings unchanged |
| GitHub connector | Managed service; version not exposed | Codex GitHub connection | VERIFIED: public repository identity; used CLI for unavailable security endpoints |
| Node.js | 24.13.0, nodejs/node | `%ProgramFiles%/nodejs/node.exe` | VERIFIED operational: generator and dependency-free checks; proposed CI uses Node 22 |
| npm | 11.6.2, npm/cli | `%ProgramFiles%/nodejs/npm.cmd` | VERIFIED operational: native audit of ignored upload lockfile; public package metadata only |
| Python | 3.12.10, CPython | `%LOCALAPPDATA%/Programs/Python/Python312/python.exe` | VERIFIED operational: local evidence and static/loopback checks |
| ripgrep | 15.2.0, BurntSushi/ripgrep | Codex app `bin/c602dfdab3808440/rg.exe` | VERIFIED operational: local source searches |
| gstack full clone/browser | 1.60.1.0; garrytan/gstack commit `a3259400a366593e0c909dd9ac3e59752efd2488` | `%USERPROFILE%/.agents/skills/gstack/`; `browse/dist/browse.exe` | VERIFIED operational: all browsing and browser QA through `/browse`; no updates/telemetry opt-in |
| Older gstack source clone | 0.13.3.0; garrytan/gstack commit `cd66fc2f890982351e3178925be563681d0ab2c5` | `%USERPROFILE%/gstack/` | EXISTING, inactive; source/version/remotes verified, execution not assessed |
| Claude gstack source clone | 0.15.1.0; garrytan/gstack commit `6169273d16b7ab8690943241fa802e5a1ca85305` | `%USERPROFILE%/.claude/skills/gstack/` | EXISTING, inactive; source/version/remotes verified, execution not assessed |
| Older gstack browser copy | Build marker `cd66fc2f890982351e3178925be563681d0ab2c5` | `%USERPROFILE%/.codex/skills/gstack/browse/dist/browse.exe` | INSTALLED, NOT OPERATIONAL standalone: missing `server.ts`; not used after failed status check |
| Codex CLI / Claude Code CLI | `@openai/codex` 0.146.0 / `@anthropic-ai/claude-code` 2.1.220 | `%APPDATA%/npm/node_modules/` | EXISTING global packages; not invoked as secondary audit/scanning processes |
| CodeQL | Proposed `github/codeql-action` v4 at commit `9b3254085494b55a0f7c4c2b3d2d52cc712ce370` | Local `.github/workflows/security.yml`; no local CLI | IMPLEMENTED BUT UNVERIFIED: configured only, not installed/run locally or on GitHub |
| Dependabot | GitHub managed service | Repository settings; local `.github/dependabot.yml` | EXISTING service; alerts/security updates disabled; weekly action-update config proposed locally |
| GitHub secret scanning / push protection | GitHub managed services | Repository security settings | VERIFIED EXISTING: enabled, zero open secret alerts |
| Semgrep, Gitleaks, TruffleHog, detect-secrets, OSV scanner, Trivy, actionlint, CodeQL CLI | No executable found via command discovery | NOT FOUND in exposed command paths | Not run; no scanner installed |

User Codex configuration structure, skill roots, project metadata, relevant Git history and accessible PowerShell history were inspected without printing credential/configuration values. The accessible PowerShell history had 82 lines and no matching security-install commands; installation provenance comes from the reviewed receipts and snapshots. Auth stores and discovered credentials were not used. Scanner absence is based on targeted tool/path discovery and Python/global npm package inspection, not a forensic search of every drive. gstack also supplies `/cso` and `/review` aliases in the agents/Claude skill roots; these are available guidance rather than independently installed scanners and were not invoked as extra audit pipelines. No full Windows or browser-binary audit is claimed.

## 2. Architecture and data boundaries

| Component | Evidence and status |
|---|---|
| Repository | VERIFIED: public `AugDog214/mangos-photo-booth`; local folder `Mango's Photo Booth Website/`; 77 tracked baseline files |
| Runtime | VERIFIED: static HTML, CSS and vanilla JavaScript; no first-party login, accounts, database or active custom backend |
| Build | VERIFIED: `build-pages.js` generates 13 service/location pages; homepage and gallery are maintained separately; no root package manifest or package installation required |
| Hosting | VERIFIED: GitHub Pages legacy/branch publishing from `main:/`; system `pages-build-deployment` workflow already exists and is preserved |
| Domain | VERIFIED: `CNAME:1` is `mangosphotobooth.com`; apex A records are GitHub Pages addresses; authoritative NS are GoDaddy `ns31/ns32.domaincontrol.com`; no Cloudflare proxy observed |
| HTTPS | VERIFIED: HTTP navigation ends at HTTPS; Pages `https_enforced=true`; approved certificate covers apex/www and expires 2027-01-09. This is a point-in-time observation, not renewal assurance |
| Booking | VERIFIED: four distinct HTTPS CheckCherry reservation URLs, 67 link occurrences. External booking pages handle customer/event details and any payments; no card data is processed by the first-party code |
| Corporate inquiries | VERIFIED: `build-pages.js` and `corporate/index.html` load the CheckCherry widget; provider form rendered locally. Fields include name, company, email/phone, event details, venue/customer addresses, estimated budget/guest count and message. These go to CheckCherry through its JavaScript integration; owner email delivery/retention settings were not accessed |
| Browser data | VERIFIED sample: GA cookies present after analytics loaded; no localStorage keys observed. No first-party customer submissions stored in browser storage by `js/main.js`. Provider cookies/storage beyond the observed pages were not exhaustively assessed |
| Analytics/media | VERIFIED: GA4/tag manager, Google Fonts, external image hosts including Unsplash/SmugMug, and CheckCherry assets. Analytics records page/UI engagement; do not put customer information into URLs or analytics fields |
| Upload foundation | VERIFIED source/config boundary: local `upload-api/` is ignored and absent from Git's published tree; public gallery has no file chooser; dormant config has `SCANNER_READY=false`, `workers_dev=false` and placeholder D1 ID. Cloud account/deployment existence was NOT ASSESSED. It must remain inactive |

Public page delivery, third-party JavaScript, CheckCherry submissions and GitHub publication are distinct trust boundaries. A compromised repository writer or third-party script could still change content or capture entered contact information. No first-party code can establish the vendor's server-side validation, quotas or private-data access policy.

## 3. Existing protection

- **EXISTING / VERIFIED:** HTTPS enforcement, approved custom-domain certificate, `noopener noreferrer` on booking/new-tab links, fixed HTTPS booking destinations and public-only static content.
- **EXISTING / VERIFIED:** GitHub secret scanning and push protection; zero open secret alerts; read-only default Actions token; Actions cannot approve PR reviews.
- **EXISTING / VERIFIED:** `.env`, `.dev.vars`, `.gstack` and the upload service are ignored. Upload source is not in current tracked publication files. No source maps, private environment files or credential artifacts were found among the baseline tracked site files.
- **EXISTING / VERIFIED:** No first-party dynamic HTML injection sink, eval, customer-data storage or user-controlled redirect was found in reviewed `js/main.js`. Generator markup uses maintained constants, not visitor input.
- **EXISTING / VERIFIED:** GitHub's Pages build/deploy pipeline is platform-managed. No duplicate deploy workflow was added.

## 4. Findings and limitations

### M-01 — Browser headers and complete script policy remain absent (P2 / medium defense-in-depth gap)

**VERIFIED baseline:** ordinary same-origin HEAD requests against the HTTPS homepage returned GitHub server/public cache headers but no CSP, report-only CSP, nosniff, explicit Referrer-Policy, Permissions-Policy, frame-ancestors, X-Frame-Options or HSTS. `_headers:1` already says GitHub Pages ignores it. Static public responses allow CORS `*`; this is not a credentialed/private-data CORS vulnerability.

**Local remediation VERIFIED:** `index.html:4`, `gallery/index.html:4`, `build-pages.js:65` and all generated pages now carry an early conservative CSP and explicit referrer meta. Three synthetic loopback tests confirmed off-origin base URLs, object embedding and disallowed form destinations are blocked. CheckCherry scripts and the contact form still render.

**Remaining NEEDS APPROVAL / Pending deployment verification:** real response headers and a complete script/resource allowlist require a controllable hosting/CDN header layer. The current meta CSP intentionally has **no script-src/default-src restriction**, so it does not establish comprehensive XSS prevention or constrain third-party script execution. It also cannot prevent clickjacking; `frame-ancestors` and report-only policy are not supported in meta. No HSTS was activated. See maintenance guidance before selecting an edge service or enforcing a full policy. These delivery constraints are documented in [MDN's CSP guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

### M-02 — Main branch and repository maintenance controls (P2 / medium configuration gap)

**VERIFIED:** `main` has no branch protection, no rulesets and no required PR checks. Dependabot alerts/security updates are disabled. Code scanning reports no analysis; default setup is `not-configured`. All Actions are permitted, and SHA pinning is not required by repository settings. These are control gaps, not evidence of account compromise.

**IMPLEMENTED BUT UNVERIFIED:** a single proposed security workflow provides static checks and CodeQL without deploy privileges, app secrets or `pull_request_target`; action references are pinned to commits resolved through each official source repository. Weekly Dependabot action-update proposals are configured. Existing secret scanning is reused; no duplicate secret-scanner workflow was added.

**NEEDS APPROVAL:** owner must review/publicize the branch, run CI, enable desired repository settings and require the resulting checks. No setting was changed. Default CodeQL setup should remain off if this proposed advanced workflow is adopted, avoiding duplicate scans.

### M-03 — CheckCherry server validation, spam controls and retention (P2 / unresolved)

**VERIFIED:** the corporate form renders, and four reservation destinations are preserved. Native `checkValidity()` alone does not validate the rendered widget's empty form; provider JavaScript manages its UI. This does **not** prove absent server validation. No live submission or spam/rate-limit test was performed.

**NOT ASSESSED:** provider server validation, bot challenges/rate limits, email routing, private lead permissions, deletion/export behavior and retention. First-party HTML validation would not protect the provider endpoint. Do not add a decorative CAPTCHA to the static site or invent a backend. The owner should review this specific contact form and reservation flow in CheckCherry and ask support which server-enforced abuse controls are active. No new form handling was injected into the vendor widget.

### M-04 — Dormant upload development dependencies (P1 before use; not an exposed-site finding)

**VERIFIED:** `npm audit --json --ignore-scripts` against the ignored local upload lockfile reports **9 package nodes: 2 critical, 6 high, 1 moderate**. These are advisory-node counts, not nine independently exploitable website vulnerabilities. No public npm runtime exists in this repository. Dependencies below belong to dormant local tooling; no exploit was run and no whole-library reachability proof is claimed.

| Package | Locked version | Native audit severity | Example primary advisory / explanation |
|---|---|---|---|
| `@vitest/mocker` | `3.2.7` | MODERATE | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9); [GHSA-qxg6-89mg-rqv8](https://github.com/advisories/GHSA-qxg6-89mg-rqv8) |
| `miniflare` | `5.20260804.1-alpha` | HIGH | Inherited from dependencies listed in native audit output |
| `sharp` | `0.35.3` | HIGH | [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c); [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) |
| `source-map-js` | `1.2.1` | HIGH | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |
| `tinypool` | `1.1.1` | CRITICAL | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3); [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) |
| `undici` | `7.29.0` | HIGH | [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v); [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x) |
| `vite` | `7.3.6` | HIGH | [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv); [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) |
| `vitest` | `3.2.7` | CRITICAL | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) |
| `wrangler` | `4.121.0` | HIGH | Inherited from dependencies listed in native audit output |

**NEEDS APPROVAL before any activation:** perform a separate upgrade/retest of the upload foundation in an appropriate private repository. The audit proposes Wrangler 4.153.0 as a same-major fix for some inherited advisories and Vitest 5.0.5 as a major fix for others; these have **not** been installed or verified. Do not run `npm audit fix --force`. Do not re-enable the upload API or execute its vulnerable development servers as part of this website publication. Its existing tests/typecheck were skipped in this scoped session.

### M-05 — Tracking and contact-data lifecycle (P2 owner review)

**VERIFIED:** GA loads without a first-party consent controller in the reviewed code and sets GA cookies. CheckCherry handles contact/event/address information. No first-party private-data repository or customer-submission logs were found.

**NOT ASSESSED:** GA account retention, provider access roles, customer deletion process, applicability of consent/notice requirements, and guest-media publication permissions. No legal-compliance conclusion is made. Confirm that public gallery images have appropriate publication permission; do not infer it from possession of the files. No legal text, tracking removal or account setting was invented.

### M-06 — Unsafe inactive header template (P3 / future-configuration risk)

**VERIFIED:** baseline `_headers:9` included a year-long `includeSubDomains` HSTS directive even though not all subdomains were audited; it also delegated payment permission despite payments opening on another origin.

**VERIFIED local correction:** removed that unvalidated HSTS template and changed the inactive payment permission draft to `payment=()`. This changes no live header because GitHub Pages ignores the file. Browser APIs on the independently opened CheckCherry page are governed by that provider's policy. Header activation remains NEEDS APPROVAL and testing.

### Secret and code-finding verification

**VERIFIED within pattern coverage:** 29 baseline tracked text files and 281 reachable historical text blobs were reviewed for provider-token formats, private keys, embedded-password URLs and credential-assignment candidates. Two current and 14 historical generic matches all trace to the same browser-visible CheckCherry widget identifier in the generator/generated page. That identifier is used as public widget configuration; no privileged credential leak was established. Its value is deliberately omitted. Zero high-confidence secret matches remained. No discovered credential was validated against a privileged provider API.

No SQL/OS/DOM injection, unsafe redirect or private customer-data path was established in first-party runtime code. Lack of a runtime path is not a claim that a vendor library is safe. This manual pattern fallback lacks entropy detection and a full credential-scanner rule corpus; arbitrary binary formats, ignored personal files, GitHub dangling objects, live secrets and full third-party source are outside coverage.

## 5. OWASP Top 10 scope matrix

| Category | Result |
|---|---|
| A01 Access control | NOT APPLICABLE to first-party accounts; provider lead permissions NOT ASSESSED; M-02 repository control gap |
| A02 Cryptographic failures | EXISTING HTTPS VERIFIED; no custom crypto/key handling; HSTS pending justified scope |
| A03 Injection | VERIFIED manual review found no visitor-input path to a first-party executable sink; provider validation NOT ASSESSED |
| A04 Insecure design | EXISTING static/vendor boundary and disabled upload publication are appropriate; provider spam/lifecycle questions remain |
| A05 Misconfiguration | M-01, M-02 and M-06; local fixes or approval gates stated above |
| A06 Vulnerable components | NOT APPLICABLE to root npm runtime; M-04 dormant development advisories remain; vendor library inventory is incomplete |
| A07 Identification/authentication | NOT APPLICABLE to first-party runtime; no login added; repository/provider account policies NOT ASSESSED |
| A08 Integrity | EXISTING platform deployment and push protection; proposed SHA-pinned scanning/update automation; mutable vendor JS remains a trust dependency |
| A09 Logging/monitoring | No first-party submission logging; existing GA is marketing analytics, not a security monitor; provider monitoring NOT ASSESSED |
| A10 SSRF | NOT APPLICABLE: no active first-party server fetch surface |

## 6. Test results and before/after comparison

| Check | Before | After / scope |
|---|---|---|
| Site generator / production static output | VERIFIED: 13 pages generated without content diff | VERIFIED: regeneration is byte-idempotent; 15 total public HTML pages |
| Existing test suite | None for published static site | VERIFIED: new dependency-free security check passes |
| CSP/referrer metadata | Absent | VERIFIED locally on all 15 pages; live effect Pending deployment verification |
| CSP negative tests | No policy | VERIFIED loopback-only: `base-uri`, `object-src`, `form-action` each blocked the synthetic forbidden operation |
| Internal links/resources | Baseline structure retained | VERIFIED: 710 targets, 222 anchors; zero missing targets |
| Booking URLs | Four destinations / 67 link occurrences | VERIFIED unchanged; general booking page and destination checks returned normally; no booking created |
| CheckCherry contact form | Existing integration | VERIFIED render under new policy; server validation, anti-spam and delivery NOT ASSESSED; no inquiry submitted |
| Layout/navigation | Existing images, motion and menus | VERIFIED widths at 375, 768, 1280; mobile open/Escape, package anchor, five hero slides, 15 cards duplicated to 30 for loop; homepage/gallery/corporate screenshots inspected |
| Design/content/SEO | Existing text, pricing, schema, links | VERIFIED all original HTML preserved exactly except two added meta tags per page; CSS, JS, CNAME, robots, sitemap, llms and manifest unchanged |
| Console | Sampled live homepage/corporate: no errors | VERIFIED local route samples: no unexpected console errors; synthetic CSP tests intentionally generate violations; third-party booking page emitted a Quill warning outside first-party code |
| Secrets | No confirmed privileged credential exposure in covered files/history | VERIFIED final source-pattern check remains clean within stated limitations |
| Dependencies | No published root dependencies; dormant tooling 9 advisory nodes | Unchanged; no Mango dependency added/upgraded; dormant findings remain |
| GitHub scanning | Secret scanning active; CodeQL absent | IMPLEMENTED BUT UNVERIFIED: proposed workflow reviewed locally; CodeQL/action execution not run |
| Headers | Sampled production headers absent | No production/header changes; Pending deployment verification and approved edge decision |

Local evidence is retained outside the published repository in the parent folder's `.gstack/security-audit-2026-10-26/`, including tool hashes, baseline/history summaries, sanitized GitHub API evidence, native audit JSON, static/browser checks and screenshots. Reports contain no customer submissions, secret values or cookie values. Full account settings, vendor internals, OS security, TLS cipher suites, external-site navigation beyond sampled integrations and every device/browser were not exhaustively assessed. No disruptive live testing or third-party source-upload scanning occurred.

## 7. Outcome and approval boundaries

At completion of the local audit, live security had **not changed**. The branch adds modest browser guardrails, publication checks and maintenance automation while preserving content and behavior. Subsequent publication evidence is recorded in `PROJECT_STATUS.md`. These changes do not establish full XSS prevention, vendor spam resistance or a WAF. The largest remaining practical risks are uncontrolled publication to `main`, third-party script/form dependence, absent response headers and unsafe reuse of dormant upload tooling.

Publication was subsequently authorized and verified as recorded above. Repository setting changes and any CDN/DNS plan still require separate approval. See [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md) for exact changes and [SECURITY_MAINTENANCE.md](SECURITY_MAINTENANCE.md) for concrete owner actions.
