# Consultation and interest-list delivery

The homepage form replaces the mail-app link. It requires first name, last name,
and a full US phone number; email is optional unless an email reply is selected.
A standalone Cloudflare Worker lets the public Evergreen site and preserved
design previews use the same endpoint.
Designs 01–06 remain archived; the original homepage is copied to `/concepts/design-01/`.

## Service configuration — November 18, 2026

The email handler is deployed at:

`https://evergreen-consultation.sukhpalc.workers.dev/request`

- Configured sender: `nav@evergreenelectrolysisstudio.com`, through existing Zoho CPaaS.
- Fixed destination: `nav@evergreenelectrolysisstudio.com`.
- Production origins: `https://evergreenelectrolysisstudio.com`,
  `https://tycheventuresllc.com` and
  `https://canyon-and-vine-electrology.sukhpalc.chatgpt.site`.
- The endpoint and public Turnstile site key are in `config/consultation.json`.
- `TURNSTILE_SECRET_KEY` is stored as a Worker secret, not in source.

**Sender cutover is prepared, not yet verified live.** The existing private mail
Worker has a separate fixed-recipient inquiry route. Deploy that service and its
metadata-only Durable Object first, then the consultation Worker, then publish
the updated website controller through the existing GitHub Actions workflow.
Verify actual public-form delivery and received From/Reply-To headers afterward.
Mocked tests do not establish hosted inbox delivery. No new keys, subscription,
mailbox, DNS record or Cloudflare plan is needed for this cutover.

The last verified live version, `a3bbf2ae-70b3-455d-a7a0-fc0d1b59e349`, uses
`consultation@tycheventuresllc.com`. Cloudflare destination verification completed
via the new Zoho mailbox. A fictional
`Zoho / Delivery Test` submitted through the live Evergreen interest-list form
showed success and arrived in Nav's Zoho Inbox with the expected note, contact
notice and recipient. A phone-only follow-up also showed success and arrived;
its body contains the correct fictional name/phone and `Email: Not provided`. The recipient-change regression suite
passed 96/96 tests and scoped ESLint passed.
That older path uses Cloudflare Email Service. Although its published pricing
says verified-destination sends are free, the actual dashboard requires Workers
Paid to onboard a new Email Sending domain. No upgrade was purchased. The
selected replacement reuses the already configured CPaaS sender and credits.
**Do not enable Email Routing on Evergreen's root domain** or replace Zoho's
working inbound MX records. The temporary localhost QA origin must remain absent
from the deployed production allowlist.

## Fixed-recipient sender and safe retries

The public handler checks exact origin, bounded contact fields and Turnstile,
then calls the `INQUIRY_MAIL` private service binding. Its exact
`https://delivery.internal/inquiry` route accepts only those validated fields,
the approved source origin and a random attempt ID. It renders the email itself:
From and To are fixed to Nav, optional Reply-To is the visitor's validated email,
and neither callers nor form fields can choose a recipient or arbitrary template.
The mail Worker has no public route, workers.dev address, preview URL or CORS.
Its invitation/health-record adapter retains separate staging restrictions.

For each attempt, a small private Durable Object stores only a payload digest,
random ID, times and provider receipt/status. Contact information, questions and
email text are not stored there. Metadata expires after seven days. The current
browser controller keeps a stable ID/time when retrying unchanged details;
changed details deliberately create a new attempt. Retries are bounded to 23
hours, below Zoho's provider deduplication window. Legacy forms without an ID
remain compatible, but do not gain cross-request deduplication until refreshed.

The object serializes attempts, records ambiguity before sending, and persists
provider acceptance. A lost acknowledgment is reconciled through Zoho's exact
agent/reference logs; a known provider request ID prevents another POST. An
uncertain result never reports success or falsely says nothing was sent. Retry
the unchanged form after a fresh security check; an expired attempt directs the
visitor to Nav. This is receipt recovery, not a background inquiry queue: only
metadata persists, so Nav's inbox remains the contact list of record. Provider
acceptance is sufficient for inquiry success; no private-link activation or
30-day expiry is involved in this public form.

## Prelaunch interest list — November 17, 2026

Designs 04, 07, and 08 use `ConsultationForm intent="interest"`. The homepage
and other archived designs retain consultation mode. The owner confirmed the
name Evergreen Electrolysis Studio and the summer 2027 opening message.

Interest submissions include `requestType: "interest"`, the required
`interest-2026-11-17` permission version from `config/interest-list.json`, and a
Turnstile token with action `interest_list`. The handler validates all three,
then sends a clearly labeled interest-list signup to the same fixed owner inbox.
It includes the exact permission to share opening updates and consultation
availability, plus removal on request. The inbox is the list of record; this
change does not add an automatic mailing campaign. Confirmation appears only
after email-provider acceptance and does not claim that an appointment is booked.

The default/legacy consultation request keeps action `consultation` and its own
notice. To switch a selected design to consultation mode at launch, change its
form intent and related CTA/availability copy together after owner authorization.
Phone formatting now happens while typing and preserves normal caret editing.

## Optional answers and contact permission

Visitors may select treatment areas, previous hair-removal methods, and a preferred
contact method, or leave these questions unanswered. They may add a question or
note of up to 500 characters. The form asks visitors to avoid medical or sensitive
personal details; consultation requests are not a medical intake form.

`config/consultation-fields.json` supplies the shared option lists and contact
notice. The Worker accepts only listed options, rejects oversized lists and
contradictory selections (`None` with a previous method, or `Not sure yet` with a
treatment area), and removes duplicate selections. Notes may include line breaks
but cannot include other unsafe control or formatting characters. Choosing Email
requires a valid supplied email address; Call, Text, and no preference do not.

Current forms send the notice version `2026-11-15` with the submission. The owner
email includes all optional answers, a server-generated UTC receipt timestamp,
the originating website, and the exact contact notice and version that were
displayed. The notice permits contact about this consultation request and states
that submission does not book an appointment; it is not a marketing subscription.
During rollout, older forms without the optional fields or notice version remain
valid. Their messages explicitly say the version was not supplied and do not
claim that the new notice was presented. Any other supplied version is rejected.

The website links its consultation privacy notice beside submission. Only after
the Worker accepts the email does the form display its confirmation dialog. The
visitor can return home with the dialog's button; there is no timed redirect.

## Maintenance and provisioning

For redeployment or provisioning another environment in the existing Cloudflare
account:

1. Authenticate Wrangler with `pnpm exec wrangler login`.
2. Keep `INQUIRY_MAIL` bound only to the existing private mail Worker. Sender and
   recipient are fixed constants in the reviewed inquiry module, not form inputs.
3. Preserve Zoho's verified MX, SPF and DKIM. The private mail Worker uses its
   existing CPaaS secrets; do not copy those credentials to the public Worker.
4. Keep the managed Turnstile widget's allowed hostnames aligned with the approved
   production origins. Use exact origins in `ALLOWED_ORIGINS`; remove temporary
   QA origins after testing. The private `INQUIRY_ORIGINS` allowlist in
   `inquiry.mjs` must also match any deliberately approved origin change.
5. Run `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY --config cloudflare/consultation/wrangler.jsonc`
   when setting or rotating the secret, and enter it privately. Never commit it.
6. Deploy with `pnpm exec wrangler deploy --config cloudflare/consultation/wrangler.jsonc`.
7. Update `config/consultation.json` if the HTTPS `/request` endpoint or public
   Turnstile site key changes. The site key is public; the secret remains in Worker secrets.

The handler fails closed if required service configuration is missing. A disabled
form preview is not a substitute for a configured, verified release.

### Cutover order and source synchronization

1. From the private working checkout, deploy the existing mail Worker with
   `wrangler deploy --config intake/cloudflare/wrangler.mail.jsonc`. This adds
   the `InquiryDeliveryState` SQLite migration while retaining all four existing
   Zoho secrets and the invitation routes. Its public/preview addresses stay off.
2. Deploy this consultation Worker with its explicit configuration. Check the
   new private service binding and preserve the existing Turnstile secret.
3. Sync only the reviewed public files to the organization's public repository:
   the consultation Worker/config/README and `inquiry.mjs`, both shared-controller
   copies, the exporter/cache key and single changed manifest hash, and the three
   consultation/form/export test files. Do not push the private intake branch,
   `intake/`, private tests, package changes, records or credentials.
4. Merge that public-only change into `main`. The existing Actions workflow
   tests and exports only `out/evergreen-production/`, then deploys the exact
   checked artifact to `evergreen-website`. Verify the live controller contains
   attempt IDs and its HTML reference uses `20261118-inquiry-mail`, preventing a
   later automatic deployment from restoring the older controller.
5. Submit fictional interest requests through the real public page with and
   without email. Check Nav's Inbox, From and Reply-To, and confirm one provider
   message per submitted request. Preserve the verified prior Worker version
   and checked artifact for rollback if this actual path fails.

## Verification and publication

Run `pnpm test` and `pnpm run lint`. Tests cover exported form semantics, client
validation, optional email and answers, contact preferences, the versioned notice,
failure retention, server validation, exact origins, Turnstile verification and
provider rejection. These use mocks for external
services and do not establish inbox delivery.

On November 15, 2026, two synthetic requests were submitted through the real
browser form with real Turnstile verification and the deployed email handler.
Both showed success, reset the form, and arrived in `sukhpalc@gmail.com` Inbox:

- `Website test / No email Nov15`, phone `+17075550123`, showed `Email: Not provided`.
- `Website test / With email Nov15`, phone `+17075550124`, included
  `sukhpalc@gmail.com` as the optional email and as the message's `Reply-To`.

Gmail showed the intended `To` recipient, `tycheventuresllc.com` as mailed-by and
signed-by domain, and TLS. These receipts were verified in Safari Gmail. The
connected Gmail tool was associated with `paul.che1776` rather than the owner
inbox, so connector search results were not used to establish delivery.

Independent live HTTP checks rejected unapproved origins, malformed JSON,
missing fields, unsupported content types, GET requests, and prohibited preflight
methods. Approved JSON preflight succeeded. Unit tests verify that failed delivery
retains entered details and does not report success.

After changes affecting delivery, repeat real browser submissions with and without
optional email, including optional answers and the preferred contact method.
Check the confirmation dialog, return-home action, and the intended owner's inbox
and headers. The historical receipts above predate the optional-answer and
confirmation-dialog changes. Local email
binding simulation and mocked tests do not establish real delivery.

Deploy the consultation Worker separately from the public website. The public
website's production artifact is `out/evergreen-production/` on Cloudflare;
GitHub Pages publishing has been retired. Preserve the private Sites archive's
audience. Keep credentials and request contents out of source and
logs. Cloudflare accepting an email is not a guarantee of inbox placement.

## Sources

Cloudflare domain configuration, Workers API and verified-destination pricing
were rechecked November 18, 2026. The account's Paid-only Email Sending onboarding
screen determines the actual available plan; the sender instead uses existing
Zoho CPaaS. The other original references below were checked November 15, 2026.

Zoho's [send API](https://www.zoho.com/cpaas/help/api/email-sending.html),
[24-hour idempotency policy](https://www.zoho.com/cpaas/help/idempotency_key.html),
and [specific receipt API](https://www.zoho.com/cpaas/help/api/get-specific-email-log.html)
were rechecked November 18, 2026 for the replacement transport.

- [Email Worker API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Fixed-destination bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/)
- [Sender domains](https://developers.cloudflare.com/email-service/configuration/domains/)
- [Verified destinations](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)
- [Pricing: verified destination delivery is free](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Server-side Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
