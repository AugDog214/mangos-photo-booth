# Mango's Photo Booth — security maintenance

Date: 2026-10-26. Applies only to this static GitHub Pages website.
The owner authorized this release on 2026-10-26. Release evidence is recorded in `PROJECT_STATUS.md`. Future publications and account changes require appropriate owner authorization; this release does not authorize DNS or protected-setting changes.

Release result: [PR #1](https://github.com/AugDog214/mangos-photo-booth/pull/1) is merged and its security checks, CodeQL and Pages deployment passed. Fifteen live routes and the booking/contact UI were verified. Dependabot's first managed update run failed before dependency processing ("missing response" fetching job details); GitHub refused a retry. Review [the update run](https://github.com/AugDog214/mangos-photo-booth/actions/runs/40381475608) and the repository's dependency-update page before calling weekly updates operational. The remaining account/header/provider decisions below still require separate approval.

## Before future publications

1. Review the branch `security/2026-10-26-audit-hardening` and the three security documents. A push to `main` publishes automatically; use a reviewed PR after explicit approval.
2. Run from this repository:

   ```text
   node build-pages.js
   node scripts/security-check.mjs
   git diff --check
   ```

3. Review homepage, gallery and corporate pages at mobile/tablet/desktop sizes. Confirm all four CheckCherry destinations, package prices, menu, scrolling, images/video, schema and consent/privacy content where applicable.
4. After an approved branch push, run the new Security checks workflow via PR or manual dispatch. Require success before merge. Local review does not prove GitHub workflow execution.
5. After approved publication, verify the meta policies in the live HTML and repeat normal navigation, widget rendering and console checks. Status until then: **Pending deployment verification**.

## Repository settings — NEEDS APPROVAL

Repository: [AugDog214/mangos-photo-booth](https://github.com/AugDog214/mangos-photo-booth).

| Owner action | Baseline and requested outcome |
|---|---|
| Settings → Advanced Security → Dependabot alerts | Currently disabled. Enable alerts; verify dependency graph support. Root site has no npm packages, but Actions maintenance is useful |
| Advanced Security → Dependabot security updates | Currently disabled. Enable if desired; this setting is separate from the local weekly version-update config. Do not auto-merge updates without passing checks |
| Secret scanning and push protection | Already enabled; preserve them. Review new alerts without reproducing or validating a discovered secret |
| Code scanning | Default setup is `not-configured`; no analysis exists. Adopt the proposed advanced workflow after approval, then inspect its first results. Do not also enable duplicate default setup |
| Settings → Rules → Rulesets / Branches | No rule/protection exists. Protect `main`; require reviewed PRs and passing Security checks, block force pushes/deletions, and deliberately choose administrator bypass/reviewer behavior for this owner-operated repository |
| Required checks | After the workflow has run, select the emitted `checks` and `codeql` job/check names exactly as GitHub displays them. Do not invent names before the first run |
| Settings → Actions → General | Default token is already read-only and PR approval is disabled. Preserve both. All actions are allowed today; consider permitting GitHub-owned/approved actions and enforcing full-SHA pinning after reviewing compatibility with the system Pages workflow |
| Account Settings → Pages → domain verification | Pages API confirms a working certificate/domain but does not establish account-level verification. Review whether `mangosphotobooth.com` is verified. Adding a TXT record requires separate DNS approval |

GitHub documents the current [Dependabot settings path](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/configuring-dependabot-alerts), [CodeQL workflow configuration](https://docs.github.com/en/code-security/code-scanning/creating-an-advanced-setup-for-code-scanning/customizing-your-advanced-setup-for-code-scanning), [Actions hardening](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) and [custom-domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages). Account settings, paid entitlements or UI details may change; verify before applying.

## Headers and CDN — NEEDS APPROVAL

GitHub Pages serves the site directly; `_headers` has **no effect there**. Meta CSP/referrer tags are the local fallback. `frame-ancestors`, report-only CSP, HSTS, nosniff and Permissions-Policy require actual HTTP response control. Do not add unsupported meta tags and claim those headers are active. [MDN CSP guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) explains the supported mechanisms.

If the owner wants a header layer, Cloudflare's free proxy is an option worth evaluating because it can keep GitHub Pages as the origin. Transform Rules are available on the Free plan, including response-header modification; Free WAF has a limited managed ruleset. These are potential capabilities, **not active protections on this domain**. They do not secure the separate CheckCherry origin or replace its spam controls. See [Transform Rules availability](https://developers.cloudflare.com/rules/transform/), [response-header modification](https://developers.cloudflare.com/rules/transform/response-header-modification/) and [WAF plan distinctions](https://developers.cloudflare.com/waf/get-started/).

Before any proxy/DNS change, approve a concrete plan that inventories all existing DNS and mail records, preserves Pages/custom-domain routing, validates origin TLS and sets Cloudflare to Full (strict), and provides rollback. Do not use Flexible SSL. Do not migrate this domain or alter GoDaddy records as part of routine code publication.

Candidate response headers to test at an approved edge:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Frame-Options: DENY
Content-Security-Policy: base-uri 'self'; object-src 'none'; form-action 'self' https://checkcherry.com https://*.checkcherry.com; frame-ancestors 'none'
```

These are a **draft**, not a verified live header configuration. Payment takes place on the independently opened CheckCherry origin; re-evaluate any future embedded checkout. Confirm that legitimate previews/embedding are not needed before enforcing `frame-ancestors 'none'`. No sensitive responses exist on the static origin; retain ordinary public caching for public assets and do not proxy/cache private provider submissions.

Start fuller resource/script restrictions with `Content-Security-Policy-Report-Only` at the edge. Inventory the inline GA initializer, tag-manager scripts/analytics requests, CheckCherry widget scripts/CSS/API calls, Google fonts and external images. Use an exact verified inline-script hash or an external same-origin initializer, not `unsafe-inline` for scripts. Observe all routes and interaction paths before enforcement. Do not add a reporting endpoint that sends contact information to an unapproved service. A report-only header cannot be activated through an HTML meta tag.

HSTS is deliberately not supplied as a copy/paste directive. First confirm HTTPS and renewal on each affected hostname, select a small initial max-age, test, then increase if justified. Do not add `includeSubDomains` or preload based only on the apex certificate. HTTPS is already enforced by GitHub Pages.

## CheckCherry and private information — owner review

- Open the existing corporate contact form (ID 19934) and reservation settings in CheckCherry. Confirm the intended inbox/lead recipients and which required-field, length/type, spam/rate-limit and bot controls are actually enforced by the provider. No server-side protection is verified merely from the visible widget.
- If additional bot protection is needed, use a provider-supported option with server-side verification. A Turnstile widget alone does not protect an endpoint; [Cloudflare requires token validation by the receiving server](https://developers.cloudflare.com/turnstile/get-started/). Do not invent a new backend for this site.
- With explicit owner approval, send one clearly labeled synthetic test inquiry using a controlled test address; confirm receipt in the intended account and remove the test record through normal provider controls. No such submission was performed here.
- Restrict lead access to the necessary people; set a realistic retention/deletion process for contact/event/address data. Keep exports and backups private. Review provider access after staff changes.
- Review GA retention/advertising settings and applicable privacy/consent wording with the appropriate owner/adviser. No legal-compliance claim is made. Keep names, email addresses, phone numbers and messages out of URLs, UTM labels and analytics events.
- Confirm public guest photos have appropriate publication permission. The public gallery is distinct from private event delivery; a private gallery/upload does not imply marketing permission.

## Disabled upload project — retain the block

`upload-api/` is local and ignored; it is not the published website. Its dependency audit still has nine flagged nodes, including two critical. Its configuration and gallery exclusion remain unchanged. No upload activation, package upgrade or cloud action is authorized by this report.

Before any future work: use a dedicated private repository, triage all advisories and update/test existing tooling, then verify the documented quarantine, scanning/re-encoding, expiry, quota, permission and moderation requirements. The API, scanner readiness flag, event codes, secrets, R2/D1 resources and `uploads` DNS must stay inactive until that separate work is reviewed and approved. Never use `npm audit fix --force` as a substitute for reviewing a major upgrade.

## Routine schedule

| When | Work |
|---|---|
| Every code change | Regenerate pages; run the dependency-free check and diff review; inspect affected mobile/desktop flows and console; preserve generator ownership |
| Weekly after approved workflow adoption | Review Security checks/CodeQL results, Dependabot action proposals and GitHub secret alerts; resolve findings with evidence; do not suppress them because repository text says to |
| Monthly | Check ordinary HTTP→HTTPS behavior and certificate health; confirm booking/widget operation; review who can publish, receive leads or access exports |
| Quarterly or after integration/hosting changes | Repeat source/config review, third-party resource/CSP inventory, privacy/retention review and normal responsive/navigation tests; recheck primary documentation |
| Before running the dormant service | Review and rescan its lockfile; isolate local development; verify any required major upgrade separately before using its test/development tools |

If a real credential is discovered, stop using it, report its type/location without its value, and have the owner revoke/rotate it. Removing a value from the latest file does not invalidate historical exposure. Never test it against a live provider by default. Preserve reviewed skill/source hashes; do not install new scanners, update skills, enable telemetry or upload private artifacts without the required authorization.
