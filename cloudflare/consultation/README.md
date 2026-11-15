# Consultation request delivery

The homepage form replaces the mail-app link. It requires first name, last name,
and a full US phone number; email is optional. A standalone Cloudflare Worker lets
both the GitHub Pages export and existing Sites project use the same endpoint.
Designs 01–06 remain archived; the original homepage is copied to `/concepts/design-01/`.

## Deployment prerequisites

No additional form vendor is required. Use the existing Cloudflare account:

1. Authenticate Wrangler with `pnpm exec wrangler login`.
2. Verify `sukhpalc@gmail.com` as an Email Service destination. If another owner
   inbox is selected, change both `RECIPIENT_EMAIL` and the binding's
   `destination_address` together.
3. Onboard an owned domain for Cloudflare Email Service sending and set
   `SENDER_EMAIL` to an address on that domain. Preserve existing inbound email
   and MX records; sending setup does not require replacing an existing mailbox.
4. Create a managed Turnstile widget allowing `tycheventuresllc.com` and
   `canyon-and-vine-electrology.sukhpalc.chatgpt.site`. Add the latter exact HTTPS
   origin to `ALLOWED_ORIGINS` when enabling delivery from Sites.
5. Run `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY --config cloudflare/consultation/wrangler.jsonc`
   and enter the secret privately. Never commit it.
6. Deploy with `pnpm exec wrangler deploy --config cloudflare/consultation/wrangler.jsonc`.
7. Set `config/consultation.json` with the deployed HTTPS `/request` endpoint and
   public Turnstile site key. The site key is public; the secret remains in Worker secrets.

The empty sender, endpoint, and site key are intentional. Do not publish the form
until these values are configured and delivery has been verified.

## Verification and publication

Run `pnpm test` and `pnpm run lint`. Tests cover exported form semantics, client
validation, optional email, failure retention, server validation, exact origins,
Turnstile verification and provider rejection. These use mocks for external
services and do not establish inbox delivery.

Before release, test the configured form on an allowed staging hostname with a
real Turnstile challenge and verify that a clearly identified test request reaches
the owner inbox. Test once with an email and once without one; verify the phone is
complete and the optional address becomes Reply-To. Also verify a failed request
retains the entered details and never reports success.

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
