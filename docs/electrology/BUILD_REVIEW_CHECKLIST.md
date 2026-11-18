# Review checklist for future electrology builds

Prepared 2026-11-17. These are engineering and content acceptance criteria to apply to the relevant change; they are not additional statutory requirements or authorization to implement anything now.

## Before changing the product

- [ ] Read the project memory, handbook, corrections register, and relevant specialist reports.
- [ ] Identify the current user-authorized scope and preserve unrelated work.
- [ ] Identify which facts are user decisions, verified evidence, historical proposals, or still unknown.
- [ ] Refresh sources whose changes could alter the implementation; preserve effective dates and authority level.

## Public site and consultation requests

- [ ] Use client and licensed-electrologist terminology without implying physician licensure or diagnosis.
- [ ] Use American Canyon as the actual location; describe travel/service geography truthfully.
- [ ] Verify credentials and actual premises before representing them as current facts.
- [ ] Preserve current user-approved prices and policies; historical research prices are not new approval.
- [ ] Avoid guaranteed outcomes, universal treatment-duration promises, risk-free/painless claims, or an unsupported claim that the FDA approves the studio or procedure.
- [ ] Keep the public inquiry limited to what is needed for contact; route detailed health history to the private intake process.
- [ ] Test submission, acknowledgment, receipt, reply, and recovery on the real configured delivery path using fictitious data.

## Private intake and consent

- [ ] The practitioner has supplied or approved the health questions, consent wording, and review protocol.
- [ ] Clients can complete the form on a phone and with a keyboard/screen reader; provide an alternative to a drawn signature.
- [ ] Invitations do not expose names or health details in URLs; tokens are unguessable, scoped, expire appropriately, and cannot access another client.
- [ ] Staff-only views and exports require authenticated, authorized access; test direct API/file access, not just hidden UI controls.
- [ ] Question answers flag practitioner review without automatically diagnosing, clearing treatment, or rejecting broad categories of people.
- [ ] Distinguish form completion, signature completion, practitioner review, and the treatment decision.
- [ ] Save the exact consent text/version, answers, identity/intent evidence appropriate to the approved process, and reliable completion timestamp.
- [ ] Preserve signed originals; corrections and later health updates create dated records with an attributable history.
- [ ] The downloadable/printable copy matches the stored signed snapshot and is available through the approved delivery method.
- [ ] Failure messages preserve appropriate progress without leaking data or pretending a submission succeeded; test duplicate and interrupted submissions.

## Data lifecycle and operations

- [ ] Document what data each vendor, log, notification, backup, and export receives, including metadata.
- [ ] Establish actual privacy-law applicability and provider terms before sending real client information to production services.
- [ ] Keep client information out of Git, public assets, analytics/session replay, unrelated AI services, and unrestricted application logs.
- [ ] Use minimal notifications; do not casually embed health answers in email/SMS subjects or bodies.
- [ ] Test record export and backup restoration with fictitious data, and document who can perform them.
- [ ] Apply an approved retention/disposal policy and preserve records subject to a valid hold; do not invent a universal retention period.
- [ ] Preserve confidentiality during account recovery, staff departure, device loss, or a vendor outage.
- [ ] Separate client health/consent records from payment-card data; use the payment provider's appropriate interface.
- [ ] Verify unattended notifications and scheduled actions on their actual execution path, including failure handling, before calling them repaired or launch-ready.

## Completion report

Report what changed, relevant research applied, what was actually tested, and any material unresolved dependency. Do not claim an account, legal approval, production test, or client consent exists merely because code or documentation was prepared.
