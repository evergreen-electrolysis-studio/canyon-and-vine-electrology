# Evergreen project memory

Last reconciled: **2026-11-17**. This file records user preferences and project facts separately from legal or clinical conclusions.

## Confirmed by the user in the November 2026 discussion

- The user purchased **evergreenelectrolysisstudio.com** through **Cloudflare**.
- The intended studio is in **American Canyon, California**, welcoming clients from **Napa, Solano, and Marin counties**.
- The launch target is **summer 2027**, not an immediate launch. The exact opening date remains unknown.
- The business has **no clients yet** and expects a slow start; volume is unknown. Do not turn a hypothetical client count into a forecast.
- Avoid accumulating paid subscriptions before demand exists. Paid form/practice-management systems were researched, not selected or purchased.
- Use **client** terminology in product copy and workflows. The chosen direction is a **client health questionnaire and electrolysis consent**.
- The questionnaire will include contact information and practitioner-approved questions about health history, implants/dental work, braces, allergies, medications, and other treatment-relevant factors. These are review topics, not a preapproved clinical exclusion list.
- The user selected **option 3: a custom online questionnaire/consent workflow**. A client receives a link, completes the form, and submits it for practitioner review. Paper/PDF can remain a fallback but is not the selected primary build direction.
- Before implementation, the user explicitly requested **five-agent deep research**, parent analysis, and persistent documentation that must be reviewed for future electrology builds.

## Intended tools; these are decisions, not completed setup

| Component | Current direction | Do not infer |
|---|---|---|
| Source ownership | Organization **`evergreen-electrolysis-studio` created**, with **`sscheema24` as sole owner** on GitHub Free; website repository migration is pending | Repository transfer, hosting cutover, or LLC formation has occurred |
| Organization name | User selected **Evergreen Electrolysis Studio LLC**; spelling and saved display name verified | GitHub display naming creates or proves a legal entity |
| Email | **Zoho Mail Lite paid**, compatible with Apple Mail | An account, domain authentication, or mailbox has been configured |
| Scheduling | **Square Free**, with manual scheduling after speaking with the client | Paid calendar synchronization, custom intake features, or a live integration is available |
| Payments | Cash or similar considered; optional card acceptance remains a business decision | Cards are prohibited, a merchant account/bank is ready, or processing is fee-free |
| Inquiry handling | Simple contact request delivered to email; inbox labels may suffice initially | A separate CRM or consultation dashboard was selected |
| Private intake | Custom application with a small staff review interface | The public contact form is suitable for medical-history collection |

Do not conflate the simple consultation-request workflow with the private questionnaire/consent system. The latter needs protected retrieval and dated records even if it has only one staff user.

## Website and SEO direction

- Make **American Canyon** the primary location in titles, main headings, directions, and business identity.
- Naturally describe welcoming clients from Napa, Solano, and Marin counties; this does not mean the studio has premises in each county.
- Start with useful core pages and one strong location/directions page. Additional regional pages need distinct useful content.
- Public contact details, practitioner license status/number, premises, prices, and hours must reflect verified or user-approved facts.
- Use truthful, respectful, inclusive client language. Avoid guaranteed session counts, painless/no-risk claims, or implying diagnosis or medical licensure.

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

During setup, signed-in GitHub settings verified the main account as **`sscheema24`**, with **sukhpalc@gmail.com Primary / Verified**. The organization was created at https://github.com/evergreen-electrolysis-studio with that account as sole owner, display name **Evergreen Electrolysis Studio LLC**, and **GitHub Free ($0/month)** verified. The user completed two-factor setup; GitHub verifies the authenticator app configured and preferred. Recovery secrets were not captured. The user subsequently approved **temporary regular-member access for their older login `thetinycart`** to permit the repository transfer; that membership is active. Remove this temporary membership and any retained explicit repository access after migration/main-account access verification. See [migration status](MIGRATION_STATUS.md) for the current state and corrected GitHub personal-repository permission limitation. The user reiterated a holistic review of the two accounts and possible consolidation/old-file cleanup **after this project**; that broader cleanup remains deferred.

Read-only inspection confirmed the current dedicated public repository belongs to `thetinycart`, while its published hostname is `tycheventuresllc.com`. Design 09 is the latest reviewed candidate and currently remains a `noindex` alternate with prelaunch interest-list intent. Existing consultation configuration uses a Tyche-domain sender and the owner's Gmail destination; this has not been freshly delivery-tested. Future retirement must account for these dependencies and preserve the research files currently present only in the local working tree.
