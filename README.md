# Evergreen Electrolysis

## Research to review before project work

Read the [electrology research and project memory](docs/electrology/README.md)
before electrology builds, public claims, or intake/consent changes. It contains
five specialist research reports, a reviewed synthesis, current user decisions,
and corrections to older planning assumptions. The repository's
[AGENTS.md](AGENTS.md) makes this review part of future project work.

A responsive prelaunch website for Evergreen Electrolysis Studio in American
Canyon, California, planned for summer 2027. The live site uses the approved
Design 09 and welcomes clients from Napa, Solano, and Marin counties.

Public site: https://evergreenelectrolysisstudio.com/

Source: https://github.com/evergreen-electrolysis-studio/canyon-and-vine-electrology

## Hosting and ownership

The website repository belongs to
[Evergreen Electrolysis Studio LLC](https://github.com/evergreen-electrolysis-studio),
with `sscheema24` as sole organization owner. The migration, old-URL redirects,
real form-to-inbox delivery, automatic deployment and temporary-access cleanup
are complete; see [execution status](docs/electrology/MIGRATION_STATUS.md).

Cloudflare hosts the production static site. GitHub Actions tests changes and
publishes successful `main` builds using a credential limited to the existing
`evergreen-website` Worker. The production environment permits only `main`.
Native Cloudflare Builds and GitHub Pages publishing are not used.

The summer 2027 homepage source is `app/evergreen/page.tsx`. Run
`pnpm run build:evergreen` and `pnpm run preview:evergreen` for the isolated,
noindex preview; it cannot send inquiries to the real inbox. See the
[website build and hosting instructions](cloudflare/website/README.md) for the
production export, deployment, verification and rollback process.

The former Tyche website paths now redirect to the new public site. Earlier
homepages and concepts remain preserved in source and frozen snapshots. The
existing Sites concept archive is private to its owner. Current interest-list
inquiries go to the owner's Gmail; the planned Zoho transition is separate work.

## Preserved website and design work

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

Use the tested Node.js version in `.node-version` (24.22.1) and the pinned
`packageManager` version in `package.json` (pnpm 11.9.0).

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

Visit `http://localhost:3000`.

## Validation

```bash
pnpm test
pnpm run lint
```

`pnpm run export:github-pages` preserves the historical static export and its
regression checks. It is not the production deployment artifact. The production
static export is `out/evergreen-production/`; only that directory is deployed.

## Before using the site with customers

Replace every bracketed or example contact detail, add the real California
license number, confirm appointment policies, business hours,
and the final service menu, and verify that both the individual electrologist
and establishment licenses are active.
