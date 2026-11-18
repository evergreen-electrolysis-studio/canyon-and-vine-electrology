# Operations, client experience, and common failure modes

Research date: **2026-11-17** (America/Los_Angeles). Scope: an intended solo electrolysis studio in American Canyon, California, opening in summer 2027. Research informs future decisions; it does not establish that premises, licenses, insurance, software, or policies are ready.

## Findings and evidence limits

The practical priority is a reliable sequence from inquiry to review, treatment, documentation, and follow-up. A small client count makes a modest manual workflow plausible, but it does not remove confidentiality, accessibility, infection-prevention, or consumer-protection obligations. The custom intake direction can support this sequence without building a large practice-management system.

The operational recommendations below are our design judgments unless identified as law, regulator guidance, platform policy, or professional standards. No representative California electrology dataset establishing rates of no-shows, injuries, dissatisfaction, or treatment abandonment was identified in this review. Consequently, the problem table identifies credible failure modes to anticipate, **not ranked prevalence or measured incidence**. Online anecdotes are not used as outcome statistics.

The AEA's current professional standards call for continuing health-history updates, attention to client preferences and concerns, explanation of office policies, assessment of responses across visits, and session documentation. They also address informed consent, confidentiality, and separate image permissions. These are professional expectations; they are not all independently enacted California statutes. [AEA Standards of Practice, including 2026 privacy update](https://professionals.electrology.com/be-an-electrologist/standards-of-practice.html).

Read the companion reports for [practice and evidence](01-practice-and-evidence.md), [safety/intake/consent](02-safety-intake-consent.md), [California/local law](03-california-local-law.md), and [privacy/digital records](04-privacy-digital-records.md). This report does not prescribe equipment settings or replace practitioner judgment.

## Client expectations and continuity

AEA client education describes individual variation in treatment course and discomfort and identifies factors such as hair-growth cycles, hair characteristics, prior removal methods, hormones, and medications. Its generalized timeline is educational material, not a studio-specific guarantee or a validated prediction for an individual. Evergreen should discuss likely commitments after assessment and avoid converting that public FAQ into a countdown in booking software. [AEA: How electrolysis works](https://electrology.com/faqs-about-permanent-hair-removal/what-is-the-electrolysis-process.html).

Recommended consultation structure:

1. Ask what area and change the client wants, and what matters most to them: comfort, time, budget, privacy, or a particular event. Avoid implying that unwanted hair requires correction or that every person seeks complete clearance.
2. Explain what the first appointment includes and distinguish a consultation from a treatment booking. A reservation or signed packet does not establish suitability.
3. Discuss a provisional plan, what remains uncertain, how progress will be assessed, and when the plan will be reviewed. Record the client's own goal instead of deriving it from a diagnosis, gender, or body area.
4. Explain approved preparation and aftercare instructions, how to raise a concern, and how to pause treatment. Supply the same current instructions in a readable take-home format.
5. Explain prices, the unit being purchased, cancellation terms, and scheduling expectations before a commitment.

A client asking about discomfort should receive a candid conversation, not dismissal or an absolute promise that treatment is painless. Do not publish improvised numbing recipes or treat a product being sold online as evidence it is safe. FDA has warned about serious injury from certain topical pain products used for cosmetic procedures, especially problematic concentrations and use that increases absorption. The operational implication is a practitioner-approved process for discussing products already used and routing medication questions appropriately. This is not an instruction to prescribe or dose a drug. [FDA warning, March 26, 2024](https://www.fda.gov/news-events/press-announcements/fda-warns-consumers-avoid-certain-topical-pain-relief-products-due-potential-dangerous-health).

## Problems to design around

These are proposed controls, not claims that these problems have occurred at Evergreen.

| Failure mode | Practical response | Implication for the future build |
|---|---|---|
| Client assumes one visit or a fixed package guarantees completion | Explain uncertainty and revisit goals during the course | Do not generate a guaranteed session count, completion date, or progress percentage |
| Price or duration means different things to client and practitioner | Define whether advertised minutes are treatment time or the entire visit; explain how lateness and early stopping are handled | Display the approved duration definition alongside prices; do not infer it from existing price labels |
| Inquiry email is overlooked | One owner checks a designated inbox; use a few statuses and a stated response window | Test actual delivery and replies; a successful form animation is insufficient |
| Signed intake is mistaken for practitioner approval | Maintain distinct submission, signature, review, and decision steps | A completion badge must never say medically cleared |
| Returning client's history has changed | Provide a brief update opportunity before each visit and preserve substantive changes | Make dated updates easy; do not overwrite the original signed packet |
| Appointment overruns consume sanitation or documentation time | Reserve explicit non-treatment time and observe actual needs | Separate visit duration and calendar occupancy; avoid assuming back-to-back slots are usable capacity |
| Cancellation rule discourages a client from reporting a safety concern | Explain how to contact the studio and how exceptional situations are reviewed | Avoid automatic penalties based on a health answer; preserve a human decision path |
| Reminder goes to a shared or outdated phone | Confirm contact details and communication preferences | Use discreet content; distinguish appointment reminders from marketing messages |
| Expected skin response and a concerning event are confused | Use practitioner-approved aftercare and escalation instructions | Offer a clear contact route, state monitoring hours, and avoid diagnostic chatbot responses |
| A public complaint exposes private history | Move individual details into an appropriate private channel | Never build an automatic review response that inserts treatment notes |
| Consent, photos, or updates cannot be retrieved | Rehearse retrieval and export before opening | Signed snapshots, attachments, and dates must survive a restore test |
| Practitioner illness, equipment failure, or internet outage interrupts appointments | Define a pause, rescheduling, and secure fallback procedure | Keep necessary contact/recovery information available through an authorized method |
| Many paid tools accumulate before demand is known | Add a tool only for an observed need and ownership plan | Do not add billing, CRM, chat, or marketing automation merely because an integration exists |

## Scheduling and modest operating infrastructure

The intended starting model remains manual scheduling in Square Free after a conversation. This report does not verify the future plan's features or authorize activation. Recheck plan terms before integration. The custom intake application should initially need only a clear handoff to the practitioner; a full calendar synchronization project is not a prerequisite.

A recommended operational sequence is: inquiry received → contacted → consultation arranged → private packet invited → packet received → practitioner review recorded → appointment decision communicated → visit documented → any follow-up assigned. These are work states, not a mandatory clinical protocol. A separate reason for a pause can remain in the private record rather than the public calendar. Staff should be able to see what needs action without opening every health history.

Calendar capacity must include preparation, client discussion, documentation, room reset, reprocessing tasks, breaks, and unexpected delay. No universal buffer length was established. Measure the actual workflow with a rehearsal before setting bookable capacity. Likewise, do not forecast a full book or prescribe an aggressive cancellation fee when there are no clients and no measured problem.

Write a short, understandable cancellation and payment policy covering notice method, late arrival, rescheduling, studio cancellations, deposits if later adopted, and how disputes are considered. A proposed fee is neither automatically enforceable nor automatically wise because scheduling software permits it. Obtain advice on the actual terms if they become consequential. Do not store payment-card numbers in the intake application; a payment processor's interface should handle any card transaction.

Track only a few operational signals at first: unanswered inquiries, outstanding reviews before booked visits, appointments kept/cancelled, actual treatment versus total occupied time, and unresolved client concerns. These are recommended management counts, not benchmarks. Use aggregate reporting wherever possible and avoid creating a second sensitive client database in a spreadsheet. New-client volume remains unknown.

## Price transparency and advertising

California's SB 478 has required most consumer goods/services to be advertised with mandatory charges included since July 1, 2024, subject to specified exceptions. The Attorney General distinguishes contingent fees and optional services from mandatory charges. Its FAQ says a card-processing fee can be avoidable where another payment method is available, but mandatory if cards are the only way to pay. That discussion is **not blanket approval of a surcharge** under every other law, network rule, or provider contract. Do not add a hidden mandatory sanitation, booking, supply, or service fee to Evergreen's displayed price. [California Attorney General: Hidden Fees](https://oag.ca.gov/hiddenfees).

Preserve the owner-confirmed November 15, 2026 prices recorded in the repository. This research supplies no authorization to change them and no independent finding that they are profitable. Before launch, confirm what those prices include and ensure the public site, booking communication, and receipt agree.

FTC guidance requires a reasonable basis for objective advertising claims before publication; satisfied customers and money-back promises do not substitute for support. Review explicit wording and what images imply. [FTC advertising guidance for small businesses](https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business). The FTC's health-products guidance also emphasizes the overall impression, including implied scientific or safety claims. Apply that principle when evaluating laboratory imagery, clinical terminology, or before/after presentations; the guidance is not evidence that this studio is a medical practice. [FTC Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance).

Recommended content controls: accurately describe the licensed service and verified qualifications; distinguish a private credential from state licensure; avoid FDA-approved-studio claims; avoid guaranteed completion, risk-free, or painless language; do not invent client testimonials or label stock/AI images as actual results. Keep an internal source and review date for material outcome claims.

## Reviews, complaints, and fair treatment

The FTC's reviews rule, effective October 21, 2024, addresses fake/false reviews and testimonials, incentives conditioned on review sentiment, and specified forms of suppression. A testimonial republished on the business's own site is advertising, not merely neutral hosting. [FTC reviews-rule questions and answers](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers). Google is stricter on its platform: it prohibits review incentives and selective solicitation of positive reviews. An honest-review invitation must not turn into a satisfaction screen that sends only happy clients to Google. [Google Maps content policy](https://support.google.com/contributionpolicy/answer/7400114).

The Consumer Review Fairness Act generally prohibits standardized contract clauses that restrict honest reviews, penalize them, or demand their intellectual-property rights. Do not insert a non-disparagement clause into consent, booking terms, or a refund template. [FTC CRFA guidance](https://www.ftc.gov/business-guidance/resources/consumer-review-fairness-act-what-businesses-need-know).

A proposed complaint process should name the person responsible, acknowledge receipt, document the account without alteration, assess whether immediate safety escalation is needed, and record the response and unresolved follow-up. Do not promise a resolution deadline the solo practitioner cannot meet. Refund handling and safety investigation are separate decisions; compensation should not depend on deleting a truthful review.

The California Board accepts complaints concerning gross negligence/incompetence, sanitation, unlicensed practice, and misrepresentation/false advertising. Its guidance emphasizes useful evidence such as service details, receipts, photographs, and relevant records. This supports preserving reliable records and giving accurate information about external complaint routes; it does not establish that the Board adjudicates every ordinary price or satisfaction dispute. [Board consumer complaint process](https://www.barbercosmo.ca.gov/enforcement/complaint.shtml).

California's Unruh Act protects full and equal access to business services across protected characteristics, including disability, sex/gender identity, sexual orientation, and medical condition. The CRD describes inferior service or higher prices based on a protected characteristic as discriminatory. [California Civil Rights Department: business establishments](https://calcivilrights.ca.gov/unruh/). Recommended application: use the name the client wants used, make pronouns optional, explain why sensitive information is relevant, and base service discussions on the requested work and individualized professional assessment. Do not infer treatment needs from gender or build blanket condition-based rejection. Explain positioning, exposure, privacy, boundaries, and stopping arrangements respectfully before treatment of a sensitive area.

## Accessibility is part of the workflow

DOJ says Title III businesses open to the public must provide equal access and effective communication, including services offered through websites. Its web guidance identifies inaccessible forms and keyboard barriers. Do not apply the separate state/local-government Title II web-rule deadlines as Evergreen's private-business deadline or exemption. DOJ's Title III guidance does not itself establish a universal detailed WCAG regulation for private businesses. [DOJ web-accessibility guidance](https://www.ada.gov/resources/web-guidance/).

Use **WCAG 2.2 AA as the project's recommended technical target**, not a declaration of legal certification. WCAG provides testable criteria spanning keyboard use, contrast, focus, reflow, errors, authentication, and complete processes. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/). In practice, test the whole invitation-to-submission-to-copy flow on a phone, with keyboard-only navigation and a screen reader. Support an appropriate alternative to drawing a signature, preserve answers when correcting validation errors, explain expired links clearly, and avoid time pressure that loses a long questionnaire. An accessible assisted/paper route can supplement the online route; do not present it as an automatic cure for a broken website.

Premises also need an actual access review: arrival directions, entrance, route to treatment, communication, and any needed accommodation. Obtain appropriate advice for the chosen premises rather than claiming a building is accessible from a photograph. No studio location or accommodation capability is verified here.

## Ergonomics, supplies, and continuity

OSHA's nail-salon ergonomics guidance identifies sustained awkward posture, repetition, and contact stress; it recommends adjustable seating, useful lighting, supported positioning, pacing, and breaks. This is adjacent-work guidance, **not electrology-specific injury-rate research or a California electrology regulation**. The reasonable inference is to test the electrologist's chair, bed, magnification, lighting, reach, and posture together before committing to a room layout. [OSHA: awkward positions and repetitive motions](https://www.osha.gov/nail-salons/positions-motions).

Recommended practical controls are a simple reorder list, expiry/lot information where relevant, backup of essential consumables, manufacturer-directed maintenance records, and clear handling of equipment failures. No algorithm should encourage squeezing another appointment into time needed for infection prevention. Follow the detailed safety report for actual requirements; preserve the distinction between California sterilizer checks, AEA professional biological monitoring, and CDC healthcare guidance.

Prepare for a solo operator being unavailable. Document who may access business administration, how credentials and recovery information are protected, how clients receive legitimate cancellation notices, and how records remain available through an authorized process if the studio closes. This need not mean another employee or subscription. Rehearse an outage and a record export with fictional data; identify who actually owns domain, email, code, calendar, storage, and backups.

## Local discovery and honest geography

Google requires accurate real-world business identity and location. A rented mailing address or keyword-stuffed name does not become a legitimate studio listing. [Google business representation guidelines](https://support.google.com/business/answer/3038177). More specifically, Google's **service-area business** concept concerns traveling or delivering to customers. Welcoming clients who travel from Napa, Solano, and Marin counties does not by itself make a fixed American Canyon studio a service-area business. [Google service-area guidance](https://support.google.com/business/answer/9157481).

Use the actual location, practitioner information, approved prices, useful preparation/expectation information, and accurate directions. Google's local guidance identifies relevance, distance, and prominence/popularity; nobody can buy a guaranteed better organic local ranking. [Google local-ranking guidance](https://support.google.com/business/answer/7091). County references can explain realistic travel and client origin without inventing county offices.

Google identifies doorway abuse and scaled low-value content as spam. Do not generate near-identical Napa/Solano/Marin city pages solely to funnel everyone to the same destination. A regional page needs its own useful reason to exist. [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies). Initial recommendation: a strong actual-location page, useful service explanations, practitioner page, FAQ, and clear consultation route. No production SEO changes are authorized by this report.

## Priority and verification before summer 2027

**Before accepting clients:** resolve premises/licensing/insurance facts; approve service boundaries and clinical materials; define prices and policies; verify the actual inquiry and scheduling handoff; test private intake, review, signed-record retrieval, and secure fallback; rehearse room turnover and incident communication; test accessibility; and refresh applicable law/platform terms. These are launch dependencies, not a claim that research has met them.

**After real operations provide evidence:** adjust appointment buffers, response windows, reminder preferences, and policies based on observed problems. Add integrations or paid tools only when their benefit exceeds their costs and maintenance burden. Periodically review complaints, privacy/access incidents, and unfinished follow-up without turning a tiny sample into an efficacy claim.

**Open facts:** actual service/appointment duration definition; cancellation/deposit policy; minors policy; communication preferences; available accommodations; routine response hours; practitioner-approved preparation/aftercare; treatment-record fields; approved photo uses; data owner/recovery arrangements; and premises details. The owner and practitioner supply these decisions; developers must not silently invent them.

## Source ledger

All sources accessed **2026-11-17**. URLs above are direct sources. Undated live guidance can change; recheck before launch or an affected build.

| Source | Authority and use | Timing/limit |
|---|---|---|
| AEA Standards of Practice | Professional standard; client experience, updates, consent and privacy | Includes 2026 update; not all provisions are California statutes |
| AEA How electrolysis works | Professional consumer education; variable course and discomfort | Generalized expectations, not individual prediction |
| FDA topical pain-product warning | Federal regulator safety communication | March 26, 2024; not individualized prescribing guidance |
| California AG Hidden Fees FAQ | Regulator explanation of Civil Code §1770(a)(29) | SB478 effective July 1, 2024; specific exceptions and other rules remain relevant |
| FTC Advertising FAQ | Federal regulator guidance on advertising substantiation | Current live page; scope depends on actual claim |
| FTC Health Products Compliance Guidance | Federal regulator guidance on express/implied health claims | December 2022 guidance; no determination of medical licensure |
| FTC reviews-rule Q&A | Staff interpretation of 16 CFR Part465 | Rule effective October 21, 2024; guidance is not a safe harbor |
| Google Maps content policy | Platform terms for reviews | Live policy; can exceed statutory minimum |
| FTC CRFA guidance | Regulator explanation of federal review-rights law | Applies to specified form-contract provisions, with exceptions |
| California Board complaint process | State regulator's enforcement guidance | Confirms categories investigated, not all civil remedies |
| California CRD Unruh guidance | State regulator civil-rights guidance | Actual law and case-specific application control |
| DOJ web guidance | Federal ADA interpretation for public accommodations | March18,2022 page notes separate 2024 government rule |
| W3C WCAG2.2 | Technical standard; proposed engineering target | December12,2024 Recommendation; not universal legal certification |
| OSHA nail-salon ergonomics | Adjacent occupational guidance | Applied by reasoned analogy, not electrology incidence evidence |
| Google business representation guidelines | Platform eligibility/location policy | Actual premises and business model must be verified |
| Google service-area guidance | Platform definition and usage policy | Traveling/delivering differs from clients' geographic origins |
| Google local-ranking guidance | Platform explanation | No ranking guarantee |
| Google Search spam policies | Search platform policy | Doorway/scaled-content restrictions; refresh when planning content |

No client data was collected and no external communication, account setup, publication, or application change was performed for this report.
