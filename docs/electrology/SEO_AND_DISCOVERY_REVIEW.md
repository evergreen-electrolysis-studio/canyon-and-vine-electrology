# SEO, sharing previews, and Google discovery review

Review date: **November 17, 2026 (America/Los_Angeles)**; official sources checked during this review, including November 18 UTC. Site: **https://evergreenelectrolysisstudio.com/**. This record synthesizes the parent audit and separate social-preview, technical-SEO, and Google Business Profile research assignments.

**Implemented, deployed, and verified.** The automatic main-push deployment passed. Fresh public responses match the exact CI artifact, and Apple LinkPresentation now returns the monochrome image from the same root URL that previously returned the green image. The user also confirmed that a fresh iPhone iMessage preview is now black and white; existing message-card caches are not controlled by this change.

## User decisions and limits

- The target remains **summer 2027**. The user confirmed that the **studio address and opening month are still being decided**.
- The user intends to apply for the LLC on **January 1, 2027**. This is a plan, not evidence of filing, formation, licenses, or an open business.
- Preserve the approved monochrome production design, frozen concept archives, owner-approved prices, and the existing prelaunch inquiry workflow.
- This review does not establish practitioner or premises licensing, treatment readiness, a completed private questionnaire/consent system, valid signed client records, or permission to collect health histories through the public form. Consult the [project memory](PROJECT_MEMORY.md) and [corrections register](CORRECTIONS_AND_OPEN_QUESTIONS.md) before related work.

## Confirmed baseline findings

These findings were reported from the parent review's actual source and public-endpoint checks, rather than inferred from a successful browser page alone.

| Check | Baseline result | What it establishes |
|---|---|---|
| HTTPS homepage | HTTP 200, valid TLS | Public access works |
| Canonical URL | Correct HTTPS apex canonical | The preferred URL is declared |
| Indexing directives | `index, follow` | The page does not instruct search engines to exclude it |
| Discovery files | `robots.txt` and `sitemap.xml` return 200 | Discovery files are available |
| Unknown path | Real HTTP 404 | Missing pages are not all disguised as successful homepage responses |
| Host/protocol variants | HTTP apex and HTTP/HTTPS `www` return 301 to HTTPS apex, preserving path and query | Canonical redirects work |
| Main content | Accessible in raw HTML | Crawlers can read the content without relying on client-side rendering |
| Sharing image | Open Graph and Twitter metadata point to `quiet-practice-hero.jpg?v=d04-20261111`, a green 1586 × 992 image | The shared preview receives the original color image |
| Site appearance | The browser applies grayscale CSS to the image | The website's monochrome appearance does not change the bytes fetched for a sharing preview |
| Favicon | Missing | A recognizable site icon should be supplied |

The reported iMessage mismatch has a concrete source: sharing metadata references the original green image while the production page renders that image in grayscale. The `d04` query value is historical; it does not by itself prove the live page uses Design 04. Changing page CSS alone cannot repair the image fetched independently by a sharing client.

These checks support a sound technical starting point. They do **not** confirm actual Google indexing, rankings, selected snippets or pictures, Search Console ownership, or real-user Core Web Vitals. Those outcomes were unverified in the baseline; the later Search Console setup below establishes the current Google discovery and live-fetch status.

## Deployed correction

The correction reuses the approved photographs and rendered monochrome treatment. Original images and frozen concepts remain unchanged.

| Asset/change | Role |
|---|---|
| `evergreen-hero-monochrome-v1.webp`, 1586 × 992, 84,656 bytes | Monochrome homepage hero and Open Graph/Twitter sharing image |
| `evergreen-portrait-monochrome-v1.webp`, 1122 × 1402, 126,428 bytes | Monochrome production portrait |
| Native “E” SVG favicon, 192 px PNG icon, 180 px Apple touch PNG | Consistent site identity in supported browser/search/saved-link surfaces |
| Short `og:title`, `og:site_name` and minimal `WebSite` JSON-LD | State the actual website name and canonical URL |
| `max-image-preview:large` | Permit larger search image previews; this does not require Google to display one |

A new image filename gives sharing crawlers a distinct asset URL. Cached previews may still persist in previously created messages; do not promise an instant refresh of every existing iMessage card. The public form's behavior is unchanged.

## Verification record

- [PR #2](https://github.com/evergreen-electrolysis-studio/canyon-and-vine-electrology/pull/2) merged at **`d3b052c3d40e80f05b0f922bdb429aa667f154ff`** through the main owner account `sscheema24`. All **11** uploaded files matched the reviewed local bytes before merge. No old-account access was restored.
- Automatic main-push [Actions run **44253302200**](https://github.com/evergreen-electrolysis-studio/canyon-and-vine-electrology/actions/runs/44253302200) passed full tests (**162/162**), lint, export and production deployment. The exporter verified **15 referenced assets and 79 historical hashes**. Worker version: **`ea3cd5b3-698b-48fb-84ef-f3b823091f40`**.
- All **18** checked public files (homepage, 15 referenced assets, robots and sitemap) match that exact run's downloaded production artifact byte for byte. HTTPS fetches succeed; the share image returns `image/webp`. Three HTTP/www canonical redirects preserve path/query, and an unknown route returns a genuine 404. A Googlebot-labelled request returns the same current HTML; this is not evidence of an actual Google crawl or index entry.
- Desktop (1280 px) and mobile (390 px) layouts and both raw monochrome portraits were visually checked. The live desktop page renders correctly with no recorded browser console errors. Form source, controller, destination and behavior are unchanged; no new email was sent. The earlier user-confirmed inbox test remains the inquiry-delivery evidence in [migration status](MIGRATION_STATUS.md).
- **Apple-path reproduction and remedy:** before deployment, `LPMetadataProvider` fetched the exact root URL and returned the green 1024×640 portrait with no icon. After deployment, a new fetch of the **same exact root URL, without a cache-busting query**, returned the correct 1024×640 monochrome portrait and an icon. The exported Apple image has equal R/G/B values at every pixel; the original baseline did not. This verifies actual WebP decoding through Apple's metadata framework on this Mac, so a speculative JPEG fallback was unnecessary.
- The user explicitly confirmed **a fresh iPhone iMessage preview is now black and white**. No claim is made that every previously cached message card was refreshed. The later Search Console setup below establishes current discovery and live-fetch status. Selected search-result imagery/snippets and measured Core Web Vitals remain unverified.

Local evidence is retained in ignored `outputs/seo-review/`: `production-verification.json`, the exact `ci-44253302200` artifact, desktop/mobile screenshots, `apple-link-baseline.json/.png`, `apple-link-postdeployment.json/.png`, `apple-preview-color-comparison.json`, and the reusable `apple-link-preview.swift` fetcher. These are verification evidence, not new public website pages.

## What Google can and cannot be instructed to show

Google can use page titles, headings, descriptions, image content, and structured data as signals. Its title links and snippets are generated automatically and may vary by query. `WebSite` data expresses a site-name preference. Open Graph metadata is useful for sharing but does not guarantee the same card or image in Google Search. A favicon is separate from a result thumbnail and from Business Profile photographs. [S1–S6]

Keep useful images in standard HTML image elements, with meaningful text alternatives and relevant surrounding content. The new monochrome files should be the actual production image sources, rather than relying solely on CSS styling. Do not claim an image is the real practitioner, premises, or a client result without verifying that fact. [S3]

Use only facts currently known in structured data. Minimal `WebSite` data is appropriate now. Google-supported `LocalBusiness` rich results require the physical business address; defer a complete local-business implementation until the actual premises and publishable contact facts are confirmed. Do not insert a placeholder address, invented hours, unverified licenses, or fabricated reviews to satisfy a validator. [S7]

## Search Console setup — completed November 17, 2026

The user asked to use their signed-in Safari session and let the assistant finish setup. The main Google account identity was verified in the Google UI. The Domain property **`evergreenelectrolysisstudio.com`** is now verified; it covers protocol and subdomain variants. [S8]

| Item | Verified result |
|---|---|
| Ownership | Google displayed **Ownership verified**, method **Domain name provider** |
| DNS proof | One Google verification TXT record added at the Cloudflare apex, TTL Auto; both authoritative nameservers return it. Existing website records were preserved. No Google-to-Cloudflare account authorization was needed. |
| Sitemap | `https://evergreenelectrolysisstudio.com/sitemap.xml` submitted; Google displayed **Sitemap processed successfully**, last read **11/17/26**, **1 discovered page** |
| Indexed-data report | Homepage **Discovered – currently not indexed**; no prior crawl or Google-selected canonical recorded at setup |
| Live inspection | **URL is available to Google**, **Page can be indexed**; smartphone inspection at **November 17, 2026, 10:56:28 PM America/Los_Angeles** |
| Live crawl details | Crawl allowed **Yes**; page fetch **Successful**; indexing allowed **Yes**; declared canonical matches the HTTPS apex |
| Google-rendered page | Google's smartphone screenshot visibly renders the final layout, prelaunch text and monochrome portrait correctly |
| Indexing request | Google displayed **Indexing requested** and confirmed the homepage was added to a priority crawl queue |

The initial sitemap table briefly showed “Couldn't fetch” immediately after submission; its detail page then showed successful processing with one discovered page. No resubmission or configuration change was required. The final Google result is the evidence, rather than the transient initial label.

Retain the verification TXT record so ownership remains valid. Do not overwrite other verification records if future owners are added. The verification value is intentionally omitted from this public audit. Search Console does not require changing the planned Zoho mailbox arrangement. [S8]

Setup is complete; actual indexing is **not yet confirmed**. Live-test success and an accepted indexing request do not guarantee indexing, rankings, timing, a Google-selected canonical, or chosen search-result images. Do not repeatedly request indexing to try to advance the queue. Revisit the property after Google processes it, then inspect indexing and search impressions. Google says crawling may take days to weeks. No recurring monitoring automation was created. [S9, S19–S20]

Local screenshots are retained under ignored `outputs/search-console/`: `sitemap-success.png`, `google-live-test.png`, and `indexing-requested.png`. The pre-existing user Search Console tab was preserved; the temporary Cloudflare tab was closed.

## Google Business Profile: recommended timing

Google Account, Search Console, and Google Business Profile are separate. An existing Google Account can manage a Business Profile; a new Gmail mailbox or paid Google Workspace plan is not required. Google accepts a Google Account using another email provider. [S10]

Google's published eligibility rules do **not** impose LLC formation as a universal prerequisite. Eligibility concerns a real business with in-person customer contact. A city license, formation document, or other business record may help establish legitimacy, but the available verification method and evidence requirements are chosen by Google. Do not guarantee verification before premises and supporting evidence exist. [S11–S13]

Google allows a future-opening profile with an opening date up to **one year ahead**; **month and year are sufficient**. After the date is entered and the profile verified, it can appear **90 days before opening**. For a July 2027 opening, that means approximately April 2027. This is Google's current policy, not a promise of an exact display date or successful verification. [S14]

**For Evergreen:** Search Console groundwork is complete; monitor its reported indexing status as Google processes the request. Wait to finalize the Business Profile until the real address, customer-facing name, and opening month are reliable and the business can supply the requested verification evidence. The planned January LLC filing may make document consistency easier, but January 1 is not a Google eligibility deadline. Set a truthful future opening date during setup so the business is represented as upcoming.

Apply these platform requirements when setup is authorized:

- Use the actual American Canyon studio location. Do not substitute a mailbox, virtual office, or temporary placeholder home address.
- Use **Evergreen Electrolysis Studio** unless “LLC” is consistently part of the actual customer-facing name and supporting materials. Do not append city/service keywords merely for ranking.
- Clients visiting from Napa, Solano, and Marin do not make the studio a Google service-area business. That category concerns traveling to customers.
- Storefront verification may require permanent matching signage, real location evidence, equipment, and proof of management. Recheck the instructions actually presented by Google.
- Do not invent operating hours. Google's current guidance says businesses operating only by appointment should not provide hours; confirm the actual operating model before setup. [S12–S13, S15]

A Google listing is not legal permission to operate. American Canyon's published requirements call for a valid city business license before conducting business; California practitioner and establishment requirements are separate. Review the actual entity, premises, and operative 2027 requirements through the [California/local report](research/03-california-local-law.md) before launch. This review neither files the LLC nor determines all licensing obligations for an unknown address. [S16–S17]

Apple recommends Open Graph metadata, a separate site name, a short title, a large graphical image, and a square high-resolution icon for Messages. It does not follow client-side meta refresh redirects; share the current canonical domain. [S18]

## Primary-source ledger

All links below were checked during this review. Google sources are current platform guidance, not laws or guarantees. Recheck them at account setup and before opening.

| ID | Source | Use |
|---|---|---|
| S1 | [Google: title links](https://developers.google.com/search/docs/appearance/title-link) | Titles are automated; descriptive page titles provide signals |
| S2 | [Google: snippets](https://developers.google.com/search/docs/appearance/snippet) | Page content and descriptions influence query-specific snippets |
| S3 | [Google: image SEO](https://developers.google.com/search/docs/appearance/google-images) | Crawlable HTML images and relevant context |
| S4 | [Google: site names](https://developers.google.com/search/docs/appearance/site-names) | `WebSite` data and consistent website-name signals |
| S5 | [Google: favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search) | Site icons are separate search presentation assets |
| S6 | [Google: robots meta specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) | `max-image-preview:large` permits larger previews |
| S7 | [Google: LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) | Required physical address and name; use accurate business facts |
| S8 | [Google: Search Console ownership verification](https://support.google.com/webmasters/answer/9008080?hl=en) | Domain ownership and DNS verification |
| S9 | [Google: request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) | URL Inspection, sitemaps, timing and inclusion limits |
| S10 | [Google: get started with Business Profile](https://support.google.com/business/answer/7039811?hl=en) | Free profile management and Google Account options |
| S11 | [Google: eligibility and ownership](https://support.google.com/business/answer/13763036?hl=en) | In-person business eligibility, authorized ownership |
| S12 | [Google: verification methods](https://support.google.com/business/answer/7107242?hl=en) | Google selects methods; more than one may be required |
| S13 | [Google: video verification](https://support.google.com/business/answer/14271705?hl=en) | Real location, signage, equipment and management evidence |
| S14 | [Google: future opening date](https://support.google.com/business/answer/9174409?hl=en) | One-year date window and 90-day preopening visibility |
| S15 | [Google: business representation guidelines](https://support.google.com/business/answer/3038177?hl=en) | Accurate name/address/model/hours; no fictitious locations |
| S16 | [American Canyon: business-license information](https://www.americancanyon.gov/files/assets/city/v/1/documents/business/business-license-info-flyer.pdf) | City requirement before conducting business; official search-indexed PDF text reviewed because the main city licensing page returned 403 |
| S19 | [Google: Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en) | Submission, processing status and discovered pages |
| S20 | [Google: URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en) | Indexed data versus live test, rendering and indexing requests |
| S18 | [Apple: rich previews for Messages](https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages) | Open Graph, titles, icon/image sizing, and redirect behavior |
| S17 | [California Board: FAQs](https://www.barbercosmo.ca.gov/forms_pubs/publications/faqs.shtml) | Individual and establishment licensing; location/ownership specificity |

The implementation and verification entries above are distinct from the platform research conclusions. No ranking, search-picture selection, consent validity, treatment readiness, or business formation is certified by this audit.
