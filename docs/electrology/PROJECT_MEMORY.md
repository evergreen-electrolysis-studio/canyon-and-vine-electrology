# Evergreen project memory

Last reconciled: **2026-11-17**. This file records user preferences and project facts separately from legal or clinical conclusions.

## Confirmed by the user in the November 2026 discussion

- The user purchased **evergreenelectrolysisstudio.com** through **Cloudflare**.
- The intended studio is in **American Canyon, California**, welcoming clients from **Napa, Solano, and Marin counties**.
- The launch target is **summer 2027**, not an immediate launch. In the subsequent SEO/Google discussion, the user confirmed that the **studio address and opening month are still being decided**.
- The user intends to **apply for the LLC on January 1, 2027**. This is a future plan, not a completed filing, formed entity, or licensing approval.
- The business has **no clients yet** and expects a slow start; volume is unknown. Do not turn a hypothetical client count into a forecast.
- Avoid accumulating paid subscriptions before demand exists. Paid form/practice-management systems were researched, not selected or purchased.
- Use **client** terminology in product copy and workflows. The chosen direction is a **client health questionnaire and electrolysis consent**.
- The questionnaire will include contact information and practitioner-approved questions about health history, implants/dental work, braces, allergies, medications, and other treatment-relevant factors. These are review topics, not a preapproved clinical exclusion list.
- The user selected **option 3: a custom online questionnaire/consent workflow**. A client receives a link, completes the form, and submits it for practitioner review. Paper/PDF can remain a fallback but is not the selected primary build direction.
- Before implementation, the user explicitly requested **five-agent deep research**, parent analysis, and persistent documentation that must be reviewed for future electrology builds.

## Tools and setup status

| Component | Current direction | Do not infer |
|---|---|---|
| Source ownership | Repository transferred to **`evergreen-electrolysis-studio/canyon-and-vine-electrology`**, with **`sscheema24` admin access verified**, history preserved, and migration PR #1 merged | GitHub ownership proves LLC formation; see migration status for temporary-access cleanup |
| Organization name | User selected **Evergreen Electrolysis Studio LLC**; spelling and saved display name verified | GitHub display naming creates or proves a legal entity |
| Public website hosting | Cloudflare Worker **`evergreen-website`** serves the apex; GitHub Actions main-push deployment, HTTPS/canonical redirects and old URL fallback are verified; project Pages is unpublished | Zoho migration, private intake or operating readiness is complete |
| Email | **Zoho Mail Lite paid**, compatible with Apple Mail | An account, domain authentication, or mailbox has been configured |
| Scheduling | **Square Free**, with manual scheduling after speaking with the client | Paid calendar synchronization, custom intake features, or a live integration is available |
| Payments | Cash or similar considered; optional card acceptance remains a business decision | Cards are prohibited, a merchant account/bank is ready, or processing is fee-free |
| Inquiry handling | Prelaunch interest-list form delivers to **sukhpalc@gmail.com**; a real fictional browser submission was confirmed in Inbox | Zoho is configured or a separate CRM/consultation dashboard was selected |
| Private intake | Custom application with a small staff review interface | The public contact form is suitable for medical-history collection |

Do not conflate the simple consultation-request workflow with the private questionnaire/consent system. The latter needs protected retrieval and dated records even if it has only one staff user.

## Website and SEO direction

- Make **American Canyon** the primary location in titles, main headings, directions, and business identity.
- Naturally describe welcoming clients from Napa, Solano, and Marin counties; this does not mean the studio has premises in each county.
- Start with useful core pages and one strong location/directions page. Additional regional pages need distinct useful content.
- Public contact details, practitioner license status/number, premises, prices, and hours must reflect verified or user-approved facts.
- Use truthful, respectful, inclusive client language. Avoid guaranteed session counts, painless/no-risk claims, or implying diagnosis or medical licensure.
- The [SEO and discovery review](SEO_AND_DISCOVERY_REVIEW.md) records the sharing-preview diagnosis, technical baseline, implementation verification status, and sourced Google setup guidance. Search Console groundwork can proceed independently of LLC formation. Finalize a future-opening Business Profile when the real premises and opening month are reliable; do not invent an address or treat client-origin counties as separate service locations.

## Existing repository facts that must not be silently replaced

- The repository already contains website code, static snapshots, a consultation implementation, and historical business/technical documents. This is not an empty project.
- The root README records owner-confirmed prices supplied **November 15, 2026**: 15 minutes **$65**, 30 **$95**, 45 **$135**, 60 **$175**, 90 **$265**, 120 **$350**. Preserve these unless the user changes them; July research prices are historical, not current instructions. This is repository-documented owner approval, not an independent market or economic validation.
- Existing frozen design/concept rules and approved exceptions remain applicable to implementation; this research does not authorize redesigning or publishing those concepts.
- Historic material contains different brand names, launch dates, entity assumptions, and tool proposals. Read the dates and corrections register.

## Facts still unknown

- Exact legal entity and formation status; GitHub organization name is not evidence.
- Practitioner license verification, establishment license, final premises, zoning clearance, insurance, opening date, and public contact details.
- The exact approved clinical questionnaire, consent wording, device/model instructions, treatment modalities, and referral protocol.
- Whether the business will conduct covered electronic insurance transactions or act for a covered entity; HIPAA applicability is not established.
- Applicable California privacy/records obligations for the final app and business workflow, and the approved retention schedule.
- Whether clients under 18 will be served; do not invent a minors policy.
- Production storage vendor, staff authentication, record backup/export plan, and real client data permissions.

## Build behavior to preserve

Research and prototype with fictional information. Keep eligibility/treatment decisions with the licensed practitioner. Avoid automatically rejecting a client solely because a questionnaire answer mentions braces, dental implants, medications, pregnancy, or another broad category.

Do not treat privacy as solved by calling people clients; do not assume HIPAA applies merely because a form contains health questions. Resolve applicability from actual activities and data use. Separate a legally sufficient informed-consent process from the mechanics of collecting a signature.

This file is meant to travel with the project and be updated after explicit user decisions. Never represent a proposal, recommendation, account plan, or research result as a completed action.

## Subsequent website migration discussion — November 17, 2026

The user proposed creating a separate GitHub organization, moving the newest design, verifying the new domain/consultation workflow, creating Zoho afterward, and then building private intake/consent. The user wants research and verified best practices to reduce rework. The [migration plan](WEBSITE_MIGRATION_PLAN.md) records the reviewed recommendation; the user has not yet approved every recommended hosting/visibility choice.

The user subsequently authorized starting the work and explicitly selected the main GitHub account associated with **sukhpalc@gmail.com**. Verify the username and account association before creating the organization or changing ownership. This is the requested owner identity, not proof that a particular authenticated session is that account. Do not substitute the already connected `thetinycart` account merely because it can administer the existing repository.

During setup, signed-in GitHub settings verified the main account as **`sscheema24`**, with **sukhpalc@gmail.com Primary / Verified**. The organization was created at https://github.com/evergreen-electrolysis-studio with that account as sole owner, display name **Evergreen Electrolysis Studio LLC**, and **GitHub Free ($0/month)** verified. The user completed two-factor setup; GitHub verifies the authenticator app configured and preferred. Recovery secrets were not captured. The user subsequently approved **temporary regular-member access for their older login `thetinycart`** to permit the repository transfer. That authorization included removal of temporary membership and any retained explicit repository access after verification. See [migration status](MIGRATION_STATUS.md) for final cleanup state and the corrected GitHub personal-repository permission limitation. The user reiterated a holistic review of the two accounts and possible consolidation/old-file cleanup **after this project**; that broader cleanup remains deferred.

The dedicated source repository is now **https://github.com/evergreen-electrolysis-studio/canyon-and-vine-electrology**, retaining repository ID **1304255808**, public visibility, `main` and history. API verification confirms **`sscheema24` admin access**; at transfer, `thetinycart` retained push access rather than admin. Final temporary-access cleanup is recorded in [migration status](MIGRATION_STATUS.md). The approved Design 09 remains frozen as an archive. A separate source-backed production copy serves **https://evergreenelectrolysisstudio.com/** through Cloudflare Worker **`evergreen-website`**, preserving the summer 2027 interest-list intent, prices, images and shared form behavior.

The old dedicated GitHub Pages site was unpublished only after deployment/settings backups. The root Tyche repository now serves redirects for its 11 old electrology paths; **66/66 real URL checks** before and after transfer and browser navigation from the old root/Design 09 succeeded, while the unrelated Tyche homepage hash stayed unchanged. These legacy redirects use **permanent zero-second meta refresh, not HTTP 301**. The new domain's canonical redirects are HTTP 301. Do not recreate the old repository address or republish the retired project Pages site; preserve history and rollback backups under `.git/migration-backups/pre-cutover/`.

Cloudflare dashboard and CLI identity are verified as the main **sukhpalc@gmail.com** account. The Evergreen zone is Active on Free; it started with zero DNS records before the apex attachment and proxied `www` record were configured. HTTPS apex returns 200 with valid TLS. The enabled **Canonical HTTPS apex** zone rule sends HTTP apex and HTTP/HTTPS `www` to HTTPS apex with 301, preserving path/query. The custom-domain binding is managed in the dashboard; intentionally omit `route`/`routes` from production Wrangler configuration and keep `workers_dev: false` / `preview_urls: false` to preserve it during asset deployments.

Turnstile and the consultation origin allowlist include the Evergreen apex plus both existing Tyche/Sites hosts. The sender remains **consultation@tycheventuresllc.com** and recipient remains **sukhpalc@gmail.com**; secrets and mailbox settings are unchanged. One fictional **Website Migration Test** completed the real production browser flow, showed success, and was explicitly confirmed by the user in **Inbox, not Spam**. This establishes fresh browser-to-inbox delivery. Zoho setup and any later recipient/sender transition still require their own verification.

Authoritative Sites inspection verifies the existing project as a **private owner-only concept archive**, version 30, with no additional users, groups or editors. Preserve it; it is not a public duplicate requiring deletion. Its existing consultation origin remains a dependency. Public legacy retirement concerns GitHub Pages only.

Migration PR #1 is merged into `main` at **`62706386a2e0fe2660f4fc87fc83b27546896ece`**. The original baseline and migration preparation remain in history. The old Pages workflow is replaced by GitHub Actions checks plus a separate production job restricted to main pushes or manual main runs, with tested Node **24.22.1**. The user created a Cloudflare account-owned token limited to the existing `evergreen-website` Worker through its external-CI setup and entered it directly as the GitHub `production` environment secret **`CLOUDFLARE_API_TOKEN`**. The environment permits only `main`, with no tags.

Automatic main-push [Actions run **44249578917**](https://github.com/evergreen-electrolysis-studio/canyon-and-vine-electrology/actions/runs/44249578917) succeeded through checks and deployment, producing Worker version **`e873f02d-9864-438a-aae1-be96168e7011`**. All **15** checked public files—homepage, 12 assets, robots and sitemap—match that exact run's downloaded artifact byte for byte. Compare future deployments against their own CI artifact; a separate macOS build can have different CSS hashes from Linux. HTTPS root, missing-path 404 and canonical redirects remain verified. Delivery behavior did not change, so the earlier user-confirmed real Inbox test remains the delivery evidence.

Native Cloudflare Builds is not connected, and no broad automatic build token was created. [Migration status](MIGRATION_STATUS.md) owns the final record of unused GitHub App and temporary old-account access cleanup, deployed versions, rollback evidence and remaining actions. Zoho and private questionnaire/consent remain later work.
