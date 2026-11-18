# Privacy, electronic consent, and private client records

Research date: **November 17, 2026** (America/Los_Angeles). Planned launch: summer 2027. Scope: Evergreen Electrolysis Studio, American Canyon, California. This is specialist research for project decisions, not an opinion that a particular production system or consent is legally sufficient.

## Findings that control the design

Evergreen can develop its own private questionnaire and signature workflow without buying a form subscription now. The appropriate next deliverable is a prototype using fictitious records. Collecting health history does not by itself establish HIPAA coverage; calling people clients does not remove privacy obligations. The actual business activities, app purpose, contracts, information sources, and vendors must determine the legal classification.

The system needs a protected record lifecycle, not merely a form that sends answers to an inbox: invitation, submission, exact consent version, signature evidence, practitioner review, controlled retrieval, printable copy, amendments, backup, and eventual disposal. These are design recommendations unless a specific legal basis is identified below. Questionnaire answers must support the licensed electrologist's review; software must not diagnose, declare treatment safe, or automatically reject broad categories such as implants or medications.

The current project facts support a small application with one staff role, ordinary notifications, and manual scheduling. They do **not** establish insurance billing, HIPAA-covered activities, a minors policy, an approved retention period, or production vendor suitability. No account, subscription, deployment, real-client collection, or legal filing was performed for this research.

## Authority and claim matrix

| Claim | Authority/status | Consequence for Evergreen |
|---|---|---|
| HIPAA provider coverage depends on covered electronic transactions, including transactions conducted through another party. | Federal regulation explained by HHS; current guidance [P01]. | Investigate actual billing and relationships; neither health questions nor ordinary email settles coverage. |
| Client-to-provider card payments are not adopted HIPAA transactions. | CMS regulator guidance [P02]. | Square card acceptance alone does not establish HIPAA coverage. |
| CMIA has both conventional provider definitions and separate provisions for qualifying information businesses/software. | California Civil Code §§ 56.05–56.06; agency-published statutory compilation [P04]. | Analyze the studio and proposed app separately; applicability remains unresolved. |
| California reasonable-security and computerized-breach duties are separate from CCPA business thresholds. | Civil Code §§1798.81.5, 1798.82; law and official legislative/enforcement material [P05–P07]. | A small practice cannot use low revenue as a general privacy exemption. |
| An electronic signature can have legal effect; authenticity, intent, applicable exceptions, and reproducible records still matter. | California UETA and federal E-SIGN [P11–P14]. | Preserve evidence and the signed content; a signature image alone does not prove the full process. |
| Cloudflare offers BAAs only to Enterprise customers. | Vendor statement, volatile [P18]. | Free hosting is not a HIPAA BAA solution if a BAA is required. |
| MFA, scoped invitations, minimal notifications, separate records, recovery tests, and immutable signed snapshots are proposed controls. | Engineering judgment informed by OWASP [P21–P23]. | Implement and verify them; do not describe this table as a compliance certification. |

## 1. Determine privacy-law applicability from facts

### HIPAA: a business classification, not a vocabulary choice

HHS describes covered entities as health plans, clearinghouses, and health care providers transmitting health information electronically in connection with adopted standard transactions. Examples include claims, eligibility inquiries, and referral authorization. Use of a billing intermediary can count. Merely using email does not. “Health care provider” is a federal definition; a California licensing label alone is insufficient to decide it. Business-associate obligations can arise when serving a covered entity. [HHS summary][P01]

Before production, record whether Evergreen submits claims or eligibility inquiries, uses a clearinghouse or billing service, performs activities for a covered organization, or will add those activities later. Self-pay is relevant evidence, not a universal exemption. A client's personal debit/credit-card payment is not itself a standard HIPAA transaction. [CMS FAQ][P02]

If HIPAA applies, map every service creating, receiving, maintaining, or transmitting ePHI and determine required BAAs and safeguards. HHS states that a cloud service storing encrypted ePHI can still be a business associate even without the decryption key. Therefore application encryption does not automatically eliminate the hosting contract issue. If HIPAA does not apply, continue the California and FTC analyses rather than calling the records unregulated. [HHS cloud guidance][P03]

### CMIA: distinguish the practitioner from the software

Civil Code § 56.05(p)'s conventional provider definition includes specified licenses under Business and Professions Code Division 2 and other listed categories; electrology's Division 3 license does not itself establish that route. Section 56.05(j)'s definition of medical information also matters. Separately, § 56.06(a) addresses specified medical-information businesses, and § 56.06(b) addresses qualifying consumer software/hardware for maintaining and making medical information available for stated purposes. [Agency reproduction of §§ 56.05–56.06][P04]

**Unresolved:** whether Evergreen's first-party intake/record application, as finally offered and operated, meets § 56.06. A generic health-history question is not enough to assert automatic coverage; neither is “we are a salon” enough to establish exemption. Obtain a focused California privacy-law assessment using the actual purpose, consumer features, data origins, and contracts. Other § 56.06 categories should be revisited if the app expands. This uncertainty is distinct from conventional practitioner licensing and from HIPAA.

### California duties that do not depend on CCPA scale

Civil Code §1798.81.5 requires reasonable security appropriate to qualifying personal information and includes contractual requirements for certain nonaffiliated recipients. Named medical-history information is particularly relevant. Specific exclusions and overlapping regimes must be checked; this is not a claim that all statutes impose cumulative identical duties. The Attorney General's Blackbaud complaint explains the security provision and medical-information category; its allegations are not a judgment about Evergreen. [Statute and enforcement source][P05]

Civil Code §1798.82 governs specified breaches of computerized personal information. **SB 446, Chapter 319, Statutes of 2025, effective January 1, 2026**, changed notice timing: subsection (a)(2)(A) generally requires consumer disclosure within **30 calendar days** of discovery or notification; (a)(2)(B) and (c) permit specified investigation/restoration and law-enforcement delays. Subsection (f) requires the AG sample notice within **15 calendar days after notifying affected consumers** when notification is required to more than 500 California residents. The latter threshold is not an exemption from individual notices below 501. Subsection (b) separately addresses immediate notice by a data maintainer to the owner/licensee. [Official Assembly summary][P06]; [chaptered text and access caveat][P07]

CalOPPA generally requires a conspicuous privacy policy for a commercial site/service collecting personally identifiable information from California consumers. It is separate from the CCPA. Policy content must match real collection, sharing, policy-change, and other applicable disclosure practices. [California AG guidance][P08]

CCPA ordinarily covers qualifying for-profit California businesses meeting one of several thresholds: revenue above the inflation-adjusted amount, buying/selling/sharing information of 100,000 consumers or households annually, or deriving at least half of annual revenue from selling/sharing personal information. Current 2025–2026 revenue threshold: **$26,625,000**. Affiliated-business provisions and exemptions require separate review. These facts do not presently establish Evergreen's coverage; recheck the **2027 adjustment** before launch. Do not add unnecessary consent banners or promise statutory rights that have not been assessed. [CPPA statute][P09]; [threshold notice][P10]

FTC rules are another conditional branch. A business offering a qualifying personal health record, including the capacity to draw information from multiple sources, may fall under the Health Breach Notification Rule even outside HIPAA. A simple first-party questionnaire is not automatically such a product. Reassess before adding record aggregation, wearable integrations, or a broader consumer health portal. [FTC compliance guidance][P17]

## 2. A signature is evidence within a consent process

California UETA §1633.5 addresses agreement to transact electronically; §1633.7 prevents denial of effect solely because a record/signature is electronic; §1633.9 addresses attribution. These provisions do not guarantee enforceability of every form. California's Judicial Council discusses authentication under §§ 1633.7 and 1633.9; the Secretary of State distinguishes UETA electronic signatures from its separate public-entity digital-signature regulations. [California authorities][P11][P12]

E-SIGN, 15 U.S.C. §7001, similarly preserves electronic validity while preserving substantive rights and obligations. When its consumer-disclosure provisions apply to legally required written information, affirmative electronic consent, paper/withdrawal information, scope, contact procedures, and demonstrated access to the electronic format need attention. Do not label every checkbox an E-SIGN-compliant disclosure process. [Federal statute, subsections (a)–(d)][P13]

For this application, adopt the following **recommended evidence design**:

1. Present the full practitioner-approved consent clearly before signing. Offer questions and an accessible paper alternative; separate optional marketing/photo permissions.
2. Record deliberate intent to sign the identified document. A typed-name option can support accessibility; drawing a signature is not a substitute for intent or identity evidence.
3. Tie the submission to the invitation and chosen identity-verification method. A forwarded email link is a possession credential, not conclusive proof of identity. Decide whether additional verification and in-person confirmation are appropriate.
4. Save the exact rendered consent, its version, answers, signer's asserted identity, relevant acknowledgment events, and reliable server timestamp. Minimize IP/device metadata and define its purpose and retention rather than collecting everything.
5. Keep the final signed snapshot immutable to ordinary editing. A cryptographic hash can detect changes but does not by itself prove the signer or valid consent. Corrections, new health information, and new consent versions become dated linked records.
6. Provide a reproducible copy through the approved private delivery channel; demonstrate that exported/printed content matches the signed original.

California § 1633.12 and federal §7001(d) support accurate, accessible electronic retention where a retention requirement exists. They do not supply a universal retention duration. [Secretary of State statutory excerpt][P14]; [E-SIGN][P13]

Electronic transaction agreement, treatment consent, privacy notice, permission to disclose information, and marketing consent are different functions. Combining them into one mandatory checkbox obscures the evidence. Clinical informed consent includes an understandable discussion of treatment, material risks, expectations, alternatives, questions, and voluntary choice; the practitioner must approve that process. A signed form does not provide clinical clearance or excuse negligent practice.

**Minors and retention remain open.** Do not infer guardian authority, capacity, or record-access rights from whoever opens the link. Decide whether minors will be served, then resolve consent/assent, identity, guardian verification, confidentiality, and access rules. No universal California electrology retention period was established in this research. Do not import another state's rule or label “seven years” as California law. HHS explicitly says the Privacy Rule does not set medical-record retention periods; HIPAA documentation-retention provisions are a separate issue. Set an approved schedule considering applicable law, insurer requirements, minors, disputes, and holds. [HHS retention FAQ][P15]

## 3. Small private architecture without premature subscriptions

The proposed architecture is a design recommendation, not a vendor selection or deployment authorization:

**Public website → minimal inquiry → staff invitation → private questionnaire/consent → authenticated staff review → dated client copy and record.** Square can remain the scheduling/payment system; Zoho can carry routine correspondence. Avoid duplicating health answers into either service merely for convenience.

**Square feature boundary.** Square's customer-profile attachment guidance expressly says not to upload sensitive confidential information, including personal health information or payment-card information. Treat the wording as a feature restriction, not merely a conclusion about HIPAA-defined PHI; being outside HIPAA would not establish permission to ignore it. Do not generalize this particular attachment rule to every Square product. Review each proposed feature and contract before integrating records. [Square attachment guidance][P24]

**Separate the surfaces.** Public inquiry should collect only contact details and the request. Explain where to provide sensitive history. Place private intake on a distinct route or subdomain with no advertising pixels, analytics/session replay, social widgets, or unrelated scripts. Keep all real records out of source control, public site assets, test fixtures, AI prompts, and unrestricted logs.

**Keep infrastructure modest.** A server-rendered/private front end, small backend, managed private database, staff identity service, transactional notification channel, and protected export/backup mechanism can suffice. Object storage is optional if immutable documents can be stored safely in the database. Separate development and production; use mature authentication and cryptography rather than inventing them. The application can generate a dated PDF without paying a signature vendor, but still needs the evidence and lifecycle controls above.

**Invitations and retrieval.** Use cryptographically random, scoped, expiring tokens; store token hashes, support revocation, and rate-limit attempts. No name, birth date, answers, or treatment area in URLs. Exchange a valid invitation for a restricted session and remove the token from the visible URL where feasible. Avoid referrer, proxy-log, browser-history, and email-link-tracker leaks. An invitation should not expose historical records; final-copy retrieval needs its own reviewed access flow. OWASP's password-recovery token guidance informs this pattern; it is not an electrology regulation. [OWASP tokens][P21]

**Staff access.** Require individual staff identities and MFA, including a documented recovery route. Authorize every record read, modification, export, and file request on the server. Hiding an admin button is insufficient. Default-deny permissions and test attempts to access another client's record by changing identifiers. Restrict service credentials and separate routine staff work from infrastructure administration. [OWASP authorization][P22]

**Persistence and workflow.** Validate inputs on the server; protect against injection, cross-site scripting, request forgery, and abuse. Commit answers, the exact consent version, and signature evidence as one coherent final submission. Use idempotency to make retries safe. Distinguish draft, submitted, signed, reviewed, and treatment decision; never show success before durable persistence. Display practitioner review flags without a treatment-eligibility algorithm. Avoid sensitive browser local storage; any draft-saving feature needs an explicit expiry/access design.

**Encryption and leakage controls.** Require HTTPS, private encrypted storage/backups, secure session cookies, appropriate cache restrictions, and controlled secrets. Configure monitoring so bodies, authorization headers, tokens, and health answers are redacted. Audit record access/export and changes using minimal identifiers and event metadata; do not create a second health database in the audit log. Protect printouts, downloaded PDFs, staff devices, and account recovery as well as the server. [OWASP logging exclusions][P23]

**Email is nuanced.** “Never legal to email health information” is incorrect: HHS permits covered providers' email communications with reasonable safeguards and discusses unencrypted email and confidential-communication preferences. That guidance is not blanket approval for every mailbox/vendor configuration. For Evergreen, default notifications should say an intake is available and point staff to protected retrieval; avoid answers and sensitive subject lines. Confirm recipient and communication preferences and review provider contracts if HIPAA applies. [HHS email FAQ][P16]

**Recovery and exit.** Encrypt backups under controlled access; define acceptable data loss and restoration time, and actually restore fictitious records. Test export to readable PDF and structured data so changing hosts does not trap the business. Define retention, holds, deletion authorization, backup expiry, and secure disposal. Account for accidental deletion, lost MFA, practitioner absence, vendor outage, and studio closure. A successful database backup job is not proof that signed documents and keys can be recovered together.

### What free hosting does and does not solve

Cloudflare currently publishes a Workers Free allowance of 100,000 requests/day and D1 Free allowances including 5 GB total storage, five million rows read/day, and 100,000 rows written/day. Those are resource quotas, not a promise of end-to-end zero cost, production availability, legal suitability, or adequate support. Recheck pricing, quota failure behavior, authentication, backup limits, and terms before selecting production services. [Workers pricing][P19]; [D1 pricing][P20]

Cloudflare explicitly limits BAAs to Enterprise customers. If Evergreen requires a BAA for the relevant services, do not run that ePHI path on a Free plan assuming encryption fixes the contractual gap. Investigate another suitable contracted stack or a scoped Enterprise agreement, including the exact covered products. The public site can remain separate. If HIPAA does not apply, document the remaining California obligations and vendor security review; there is no demonstrated reason to buy Enterprise merely because the form asks health questions. [Cloudflare privacy FAQ][P18]; [HHS cloud guidance][P03]

## 4. Decisions and verification before real records

Use fictitious data until the business classification, clinical content, consent process, minors policy, retention schedule, and vendor data flows are resolved. This is a production dependency, not a prohibition on prototyping now.

The minimum meaningful verification is an end-to-end client submission and staff review with mobile/keyboard accessibility; expired/revoked/forwarded invitations; unauthorized direct API and document requests; interrupted and duplicate submissions; exact-version retrieval; notification failure after persistence; amendment history; and complete backup restoration/export. Test the actual configured notification and scheduled-job paths. Confirm that logs, browser caches, error reports, and analytics contain no unintended health information.

Assign an operational owner for updates, access review, backups, incident response, and vendor changes. Before summer 2027, refresh law, threshold, and contract sources and have the practitioner/insurer and appropriate California advisers resolve the bounded questions above. Custom development trades a subscription for ongoing engineering responsibility; keep the first version narrow enough that those responsibilities are realistic.

## Source ledger and limitations

All sources below were accessed **2026-11-17**. Primary government/regulator/vendor/standard-author sources were preferred. California Legislative Information returned HTTP 403 during this review; this is disclosed rather than represented as direct inspection. Government compilations and official legislative summaries were used, with a marked statutory-text mirror for SB 446. Refresh the current official text before implementation relying on a precise legal interpretation. No proposal is treated as effective law here.

| ID | Source, locator, authority, and limitation |
|---|---|
| P01 | [HHS, Summary of HIPAA Privacy Rule][P01], “Who is Covered,” especially Health Care Providers and Business Associates. Regulator explanation of federal law; not a classification of Evergreen. |
| P02 | [CMS, Transaction FAQs][P02], first credit/debit-card question and adopted transaction list. Regulator guidance on ordinary consumer payments. |
| P03 | [HHS, HIPAA & Cloud Computing][P03], questions concerning CSPs, encryption/no-view services, and BAAs. Conditional on HIPAA applicability. |
| P04 | [California Board of Pharmacy, July 2026 lawbook][P04], printed pp. 779–783, Civil Code §§ 56.05(j), (p), 56.06(a)–(g). Agency compilation of statute; compilation warns to check official current text. Electrology licensing is addressed in specialist report 03. |
| P05 | [California AG, Blackbaud complaint][P05], discussion of Civil Code §1798.81.5(b), (d). Official enforcement pleading, not a final judicial holding. [Official statute URL](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.81.5.) inaccessible in this session. |
| P06 | [Assembly Privacy and Consumer Protection Committee, 2025 bill summary][P06], pp. 16 and 24, SB 446, Chapter 319. Primary legislative confirmation of enactment and deadlines. |
| P07 | [SB 446 chaptered text mirror][P07], §1 amending Civil Code 1798.82(a)(2), (b), (c), (f). Enacted 2025, operative general effective date January 1, 2026. [Official bill URL](https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260SB446) and [current section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.82.) should be reopened; section fetch was 403. Mirror is secondary hosting of legislative text, corroborated by P06. |
| P08 | [California AG, How to Read a Privacy Policy][P08], CalOPPA/BPC 22575–22579. Regulator summary; exact notice content must follow current statute and real practices. |
| P09 | [CPPA, CCPA statute effective January 1, 2026][P09], Civil Code 1798.140(d). Agency statutory text; includes definitions/affiliates beyond the simplified threshold discussion. |
| P10 | [CPPA, December 17, 2024 threshold announcement][P10], table and January 1, 2025 effective date. Current through 2026; biennial adjustment requires 2027 refresh. |
| P11 | [Judicial Council, 2025 Civil Jury Instructions][P11], CACI 380 electronic signatures and sources/authority. Primary judicial guidance quoting UETA; search-indexed excerpts inspected, full PDF fetch returned 403. Not a treatment-consent template. |
| P12 | [California SOS digital-signature FAQ][P12], distinction between public-entity digital signatures and UETA §§ 1633.1–1633.17. [DGS electronic-signature order](https://www.dgs.ca.gov/-/media/Divisions/AD/E-Signature/Resources/DGS-Administrative-Order-21-01-Electronic-Signatures-for-Business-Operations.pdf), UETA agreement background; DGS internal policy does not bind Evergreen. |
| P13 | [U.S. House Office of Law Revision Counsel, 15 U.S.C. 7001][P13], (a) validity, (b) preserved obligations, (c) consumer disclosures, (d) retention. Text through Public Law 119-124, October 15, 2026. |
| P14 | [California SOS, 2026 Notary Handbook][P14], printed p.50, Civil Code 1633.12. Used only for electronic-retention text; does not mean this consent needs notarization. |
| P15 | [HHS medical-record retention FAQ][P15], answer distinguishing HIPAA privacy from medical-record retention requirements. |
| P16 | [HHS email FAQ][P16], safeguards, unencrypted communication, alternative confidential communications. Conditional regulator guidance. |
| P17 | [FTC, Complying with Health Breach Notification Rule][P17], PHR definition, multiple-source capacity, covered entities. App-specific applicability not established. |
| P18 | [Cloudflare US privacy FAQ][P18], HIPAA/BAA question. Vendor contractual availability, volatile; not a complete service-specific BAA review. |
| P19 | [Cloudflare Workers pricing][P19], Free plan requests. Volatile vendor quota/pricing. |
| P20 | [Cloudflare D1 pricing][P20], billing metrics, Free plan. Page updated October 30, 2026. Volatile; not a suitability endorsement. |
| P21 | [OWASP Forgot Password Cheat Sheet][P21], token requirements/URL tokens. Security guidance adapted to invitations by engineering judgment. |
| P22 | [OWASP Authorization Cheat Sheet][P22], least privilege, deny by default, every-request authorization, resource checks. Professional engineering guidance. |
| P23 | [OWASP Logging Cheat Sheet][P23], “Data to exclude” and verification. Professional guidance, not a retention statute. |
| P24 | [Square customer-profile attachments][P24], “Before you begin.” Vendor feature restriction on sensitive confidential information including personal health information; parent checked during synthesis on 2026-11-17. Not a blanket statement about all Square products. |

[P01]: https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html
[P02]: https://www.cms.gov/priorities/key-initiatives/burden-reduction/administrative-simplification/transactions/faqs
[P03]: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html
[P04]: https://www.pharmacy.ca.gov/laws_regs/lawbook.pdf
[P05]: https://oag.ca.gov/system/files/attachments/press-docs/Complaint%5B2%5D.pdf
[P06]: https://apcp.assembly.ca.gov/system/files/2025-12/2025-legislative-bill-summary.pdf
[P07]: https://legiscan.com/CA/text/SB446/id/3272003
[P08]: https://oag.ca.gov/privacy/facts/online-privacy/privacy-policy
[P09]: https://www.cppa.ca.gov/pdf/20260101_ccpa_statute.pdf
[P10]: https://cppa.ca.gov/announcements/2024/20241217.html
[P11]: https://courts.ca.gov/system/files/file/judicial_council_of_california_civil_jury_instructions_2025.pdf
[P12]: https://www.sos.ca.gov/administration/regulations/current-regulations/technology/digital-signatures/frequently-asked-questions
[P13]: https://uscode.house.gov/us/usc/119-124/t15/s7001/
[P14]: https://notary.cdn.sos.ca.gov/forms/notary-handbook-current.pdf
[P15]: https://www.hhs.gov/hipaa/for-professionals/faq/does-hipaa-require-covered-entities-to-keep-medical-records-for-any-period/index.html
[P16]: https://www.hhs.gov/hipaa/for-professionals/faq/does-hipaa-permit-health-care-providers-to-use-email-to-discuss-health-issues-with-patients/index.html
[P17]: https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0
[P18]: https://www.cloudflare.com/trust-hub/us-privacy-compliance/
[P19]: https://developers.cloudflare.com/workers/platform/pricing/
[P20]: https://developers.cloudflare.com/d1/platform/pricing/
[P21]: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
[P22]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
[P23]: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
[P24]: https://squareup.com/help/us/en/article/8400-add-file-attachments-and-notes-to-customer-profiles
