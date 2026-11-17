# Consultation and interest-list delivery

The homepage form replaces the mail-app link. It requires first name, last name,
and a full US phone number; email is optional unless an email reply is selected.
A standalone Cloudflare Worker lets
both the GitHub Pages export and existing Sites project use the same endpoint.
Designs 01–06 remain archived; the original homepage is copied to `/concepts/design-01/`.

## Configured service — November 15, 2026

The email handler is deployed at:

`https://evergreen-consultation.sukhpalc.workers.dev/request`

- Sender: `consultation@tycheventuresllc.com`.
- Fixed destination: `sukhpalc@gmail.com`.
- Production origins: `https://tycheventuresllc.com` and
  `https://canyon-and-vine-electrology.sukhpalc.chatgpt.site`.
- The endpoint and public Turnstile site key are in `config/consultation.json`.
- `TURNSTILE_SECRET_KEY` is stored as a Worker secret, not in source.

The existing domain already had Email Routing enabled and the destination was
already verified. No DNS, MX, or mailbox changes were required. No additional
form or email vendor is used. The temporary localhost origin used for browser QA
must remain absent from the deployed production allowlist.

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
2. Keep `RECIPIENT_EMAIL` and the binding's `destination_address` aligned. A new
   destination must be verified in Email Service before use.
3. Keep `SENDER_EMAIL` on an onboarded Email Service domain. The current
   Routing-enabled domain supports delivery to the verified owner. If moving to
   a different domain, review Email Service onboarding and existing mail records;
   do not replace working inbound MX records merely to enable form delivery.
4. Keep the managed Turnstile widget's allowed hostnames aligned with the two
   production origins. Use exact origins in `ALLOWED_ORIGINS`; remove temporary
   QA origins after testing.
5. Run `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY --config cloudflare/consultation/wrangler.jsonc`
   when setting or rotating the secret, and enter it privately. Never commit it.
6. Deploy with `pnpm exec wrangler deploy --config cloudflare/consultation/wrangler.jsonc`.
7. Update `config/consultation.json` if the HTTPS `/request` endpoint or public
   Turnstile site key changes. The site key is public; the secret remains in Worker secrets.

The handler fails closed if required service configuration is missing. A disabled
form preview is not a substitute for a configured, verified release.

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

Publish the verified website commit to GitHub Pages and the identical clean source
to the existing Sites project, preserving its audience. Verify the live form and
archive links afterward. Keep credentials and request contents out of source and
logs. Cloudflare accepting an email is not a guarantee of inbox placement.

## Sources checked November 15, 2026

- [Email Worker API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Fixed-destination bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/)
- [Sender domains](https://developers.cloudflare.com/email-service/configuration/domains/)
- [Verified destinations](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)
- [Pricing: verified destination delivery is free](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Server-side Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
