# Migration execution status

Started after the user authorized proceeding and selected the GitHub account associated with **sukhpalc@gmail.com**. Follow [the migration plan](WEBSITE_MIGRATION_PLAN.md). This file distinguishes verified preparation from completed external changes.

## Current state

- Organization **created and verified** at https://github.com/evergreen-electrolysis-studio. The user selected business ownership and entered **Evergreen Electrolysis Studio LLC**, then instructed the agent to check spelling and continue in response to the prepared ownership/Terms handoff. The spelling was correct; setup completed and the same organization display name was saved and verified. This is not evidence of legal entity formation. Billing shows **GitHub Free, $0.00 per month**. A separate Cloudflare preview has now been deployed (below); no repository transfer, production DNS change, deletion or email migration has occurred.
- The GitHub connector profile identifies `thetinycart` with profile email `kidsmealplanner@gmail.com`; the installed CLI also authenticates as `thetinycart`. The CLI cannot read associated email addresses with its current scopes. No broader scope was requested.
- The user signed in to Safari. Account settings verified **`sscheema24`** and **`sukhpalc@gmail.com` as Primary / Verified**. This is the requested main account. The new organization's People page verifies **`sscheema24` as its sole owner**. The personal email is the private billing contact; the public email field remains empty. A subsequently approved temporary invitation for `thetinycart` is recorded below.
- The task-created GitHub tab was closed after organization and security verification. The pre-existing Zoho pricing tab remains untouched.
- **Two-factor authentication verified enabled** after the user completed setup: the `sscheema24` security page shows the authenticator app configured and selected as the preferred 2FA method, and recovery codes viewed. No recovery codes or authenticator secrets were captured or stored. Recovery-code safekeeping remains with the user.
- Email settings listed one verified email and showed “Keep my email addresses private” off. This is an optional privacy/recovery improvement to discuss, not evidence of compromise. Do not change it without authorization.
- The GitHub connector does not expose organization creation. Use the GitHub website for this action; the user may need to handle sign-in, verification challenges or final account terms where required by the browser interaction policy.
- Cloudflare CLI authentication verified as **sukhpalc@gmail.com**, account **`4fe85a31fa782a90b1758694d2314e0a`**, matching the consultation Worker. Installed Wrangler is **4.92.0**. Existing OAuth scopes include Worker-script writes but omit zone/route permissions; static deployment is now verified, and no broader CLI login was requested. The shell needs the existing bundled Node directory on PATH: `/Users/tyche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.

## Verified baseline

- Local branch: `main`.
- Commit: `074c9b277ca1f8441e8a55414f6c2aece1aaec15` — “Update Site source,” November 17, 2026 at 19:16:55 PST.
- Local `origin/main` matches that commit. No fresh fetch was performed in the baseline audit.
- Remote: `https://github.com/thetinycart/canyon-and-vine-electrology.git`.
- All **79** frozen-file hashes in `scripts/export-manifest.json` match, including Design 09 and previous concepts.
- At the starting audit, the only tracked modification was the root README's eight-line research-library entry. Migration preparation subsequently adds the changes recorded below.
- Root `AGENTS.md` and the research/migration documentation under `docs/electrology/` remain untracked. Review and preserve them explicitly; repository transfer alone does not include local files.
- Historical planning documents, caches and temporary files are separate pre-existing untracked work. Do not use a blanket add, cleanup or overwrite operation.
- A local rollback snapshot is verified under `.git/migration-backups/evergreen-start-074c9b2/`: `repository.bundle` passes `git bundle verify` and contains complete history; `research-and-instructions.tar.gz` is readable with 16 files. The archive captures the documents as they stood before organization creation; later status changes are not in that original snapshot.

## Next authorized actions

1. Organization creation and personal-account 2FA verification are complete. The organization exists on the Free plan with `sscheema24` as sole owner. Do not substitute `thetinycart` without a new user instruction.
2. Temporary transfer access is verified: `thetinycart` is an active regular member of the new organization, with public/private repository creation permitted. The existing connector/CLI remains that identity. `sscheema24` remains the sole owner. Remove temporary membership and any retained explicit repository access after migration and main-account access are verified.
3. Migration source preparation is on **`codex/evergreen-cloudflare-migration`**. The old `.github/workflows/pages.yml` publishes pushes to `main`, so preliminary work must not be pushed there.
4. Preserve the current baseline and authorized local research files. Prepare Design 09 as a domain-root preview with correct prelaunch metadata and paths; preserve prices, imagery and interest-list permission semantics.
5. Verify the preview, old-URL redirect mechanism and rollback artifact before coordinating the repository/hosting cutover. Consultation origins, Turnstile, inbox delivery and later Zoho changes remain separate verification steps.

The existing Sites publication shares the consultation endpoint and is another dependency to inventory. Do not remove its origin or the Tyche sender while those services remain in use. No live form submission was performed in this stage.

## Local migration preview — prepared and checked

- New `app/evergreen/page.tsx` copies the approved Design 09 into a separately maintained authoring route; old source/CSS and snapshots remain unchanged. It exports to public `/`, removes archive-only navigation, uses the new canonical domain and American Canyon metadata, and welcomes Napa, Solano and Marin county clients. Prices, images, interest-list permission and form controller remain unchanged.
- `scripts/export-evergreen.mjs` exports only referenced public assets, a genuine 404 page, sitemap, robots rules and response headers. Default `out/evergreen/` is **noindex** and uses a same-origin preview endpoint plus a public Turnstile test key. It cannot send to the real consultation Worker. Explicit production mode writes separately to `out/evergreen-production/`; no production artifact has been deployed.
- `cloudflare/website/wrangler.jsonc` prepares a separate `evergreen-website-preview` static Worker in the verified Cloudflare account. It has no production routes or resource bindings. See its README for commands and remaining production dependencies.
- The build and historical export succeeded. The regression run passed 159 of 160 checks initially; the sole failure was the new price assertion not stripping React HTML comments. After correcting that test parser, all six new export tests passed. No application change was needed for that failure. All **79 historical hashes** still match.
- Local Wrangler at port 8793 verified HTTP 200 for the page and its assets, preview noindex headers, and HTTP 404 for a missing path. Browser QA verified desktop (1440px) and mobile (390px) layouts without horizontal overflow, loaded imagery, all six disclosed rates, keyboard skip-link focus, incomplete-phone feedback, and preserved editable inputs with honest failure feedback after a fictional submission to the isolated local endpoint. Turnstile loaded under the response CSP. No live message or real contact record was sent.
- Desktop/mobile review screenshots are in ignored `outputs/migration-preview/`. Task-created preview tabs were closed and the temporary viewport override reset. The local server is stopped at the end of QA. The historical export's regenerated gallery/CSS were restored/removed after checks; no old public artifact change is intended.
- The full lint command initially scanned an older ignored scratch checkout under `work/` and failed on generated bundles. ESLint now excludes generated/scratch directories consistently with repository intent; the same `pnpm run lint` command passes. No old scratch files were edited or removed.
- GitHub API inspection verifies `thetinycart` remains the **only administrator** of the source repository. A proposal to add `sscheema24` as another source administrator was corrected before mutation: GitHub personal repositories do not support that permission. The user then explicitly approved **temporary regular-member access for `thetinycart` in Evergreen**, with removal after migration verification. The invitation was sent and accepted with the existing `thetinycart` CLI session; API state is **active/member**, and the organization's People page verifies `sscheema24` **Owner** and `thetinycart` **Member**. Member settings permit creation of public and private repositories. No ownership transfer occurred.

This provides the source administration plus destination repository-creation permissions GitHub requires for a direct transfer. It does not consolidate accounts or affect unrelated repositories. Preserve the repository name during the transfer; the member account cannot rename during transfer. GitHub automatically retains the original owner as a repository collaborator, so eventual removal must verify both organization membership and explicit repository access. Complete hosting/redirect preparation before actually transferring the repository. Sources: [transfer prerequisites/effects](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository), [personal repository roles](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository).

## Deployed staging preview

- URL: **https://evergreen-website-preview.sukhpalc.workers.dev/**.
- Worker: `evergreen-website-preview`; version **`b6c19493-f423-44d3-9434-c4d08da176b3`**.
- Wrangler dry-run and real deployment succeeded using existing authorization. The deployed HTML and all 12 referenced asset files return HTTP 200; a missing path returns HTTP 404. Response headers exclude indexing. Browser verification confirms images load, the public Turnstile test widget completes, and the form action remains `/__preview__/request`. No production form delivery or domain cutover was performed.
- The preview browser tab is closed. Screenshots include `outputs/migration-preview/deployed.jpg` and `github-membership.png`; they are ignored local review evidence.
- Domain and Turnstile configuration need the Cloudflare dashboard with the current limited CLI scopes. A task-created Safari tab is at Cloudflare sign-in, offering **Continue as sukhpalc@gmail.com using Google**. Leave it for the user handoff; preserve the pre-existing Start Page. Sign-in presents Cloudflare's agreement before continuing.

## Legacy URL research for cutover

Read-only inspection confirms `thetinycart/thetinycart.github.io` publishes the root `tycheventuresllc.com` site from `main` / via GitHub's legacy Pages build. It currently has no `canyon-and-vine-electrology/` directory. The dedicated project site inherits the root custom domain. Both return HTTP 200 from GitHub; DNS is not proxied through Cloudflare.

A narrow fallback is to add static redirect HTML for the 11 existing electrology routes to the root user-site repository. Google recognizes zero-second meta refresh as permanent, while preferring HTTP 301/308. This would preserve unrelated Tyche traffic without enabling Cloudflare proxying for the whole hostname. However, GitHub's docs do not explicitly guarantee the same-path fallback after disabling/transferring a project site. **Do not treat it as verified.** After the new domain is ready, publish the fallback files, temporarily unpublish the project Pages site with its deploy artifact/settings retained, and test the actual old URLs before transfer; restore the project deployment if fallback fails. Do not recreate the old repository after transfer, which would remove GitHub's repository redirects.

Sources: [GitHub site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [custom-domain inheritance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages), [Google redirect types](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [Cloudflare redirect proxy requirement](https://developers.cloudflare.com/rules/url-forwarding/). No legacy fallback files, unpublishing, or DNS changes have been performed.

## Deferred account review

The user asked to review the two-account arrangement holistically **after this project**, including whether consolidation and old-file cleanup make sense. Do not delete old repositories, merge identities, change their ownership or alter unrelated applications during the Evergreen work. Public/private repository visibility alone does not require two personal accounts; historical reasons for the split remain unknown.
