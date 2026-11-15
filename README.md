# Evergreen Electrolysis

A responsive site for a private electrology practice in American Canyon,
California. The site uses launch-ready business copy while the phone, email,
suite address, business hours, and license number remain clearly marked
placeholders for final replacement.

Public site: https://tycheventuresllc.com/canyon-and-vine-electrology/

Design archive: https://tycheventuresllc.com/canyon-and-vine-electrology/concepts/

## What the mockup includes

- launch-ready positioning and consultation calls to action
- face, selected body, hormonal-hair, personalized planning, grooming, precision,
  and extended-session service concepts
- common treatment areas and the three electrology modalities
- consultation and treatment-plan journey
- a design archive that preserves each visual direction, with owner-approved shared pricing and consultation updates
- a concise results, suitability, and medical-information disclaimer
- owner-confirmed treatment pricing: 15 minutes $65, 30 minutes $95, 45 minutes $135,
  60 minutes $175, 90 minutes $265, and 120 minutes $350 (USD; supplied November 15, 2026)
- a consultation request form and accessible submission confirmation on the homepage and every concept
- Nav’s education, completed professional training, licensed-practitioner
  positioning, FAQ, and placeholder contact sections
- responsive layouts, keyboard focus states, reduced-motion support, and
  search-friendly metadata

## Content conventions

Published concepts remain frozen by the export manifest. On November 15, 2026,
the owner authorized updating the homepage and all existing concepts with the
prices above and the live consultation form. Their updated source and static
snapshots are re-frozen after validation. This exception does not authorize
redesigning earlier concepts during future automated runs.

Use naturally descriptive alt text for images. Do not add visible image
provenance disclaimers, stock/editorial labels, representative-image notices,
"not a client/result" caveats, or photo-placeholder commentary. This does not
replace the separate results, suitability, and medical-information disclaimer.

## Local development

Requires Node.js `>=22.13.0`.

```bash
corepack enable
pnpm install
pnpm run dev
```

Visit `http://localhost:3000`.

## Validation

```bash
pnpm test
pnpm run lint
```

`npm run export:github-pages` creates the static `github-pages/` artifact used
by the GitHub Pages deployment workflow.

## Before using the site with customers

Replace every bracketed or example contact detail, add the real California
license number, confirm appointment policies, business hours,
and the final service menu, and verify that both the individual electrologist
and establishment licenses are active.
