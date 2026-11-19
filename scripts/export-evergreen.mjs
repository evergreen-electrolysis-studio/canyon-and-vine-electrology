import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const clientDirectory = path.join(projectRoot, "dist/client");
const canonicalUrl = "https://evergreenelectrolysisstudio.com/";
const siteName = "Evergreen Electrolysis Studio";
const authoringRoute = "/evergreen";
const previewEndpoint = "/__preview__/request";
// Cloudflare's documented public, always-pass test key; never a production key.
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const previewSiteKey = "1x00000000000000000000AA";
const args = process.argv.slice(2);
assert(args.every((arg) => arg === "--production" || arg.startsWith("--output=")), "Unknown export argument");
assert(args.filter((arg) => arg === "--production").length <= 1, "Repeated --production argument");
const outputArgs = args.filter((arg) => arg.startsWith("--output="));
assert(outputArgs.length <= 1, "Repeated --output argument");
const production = args.includes("--production");
const outputRoot = path.join(projectRoot, "out");
const outputDirectory = path.resolve(projectRoot, outputArgs[0]?.slice("--output=".length) || (production ? "out/evergreen-production" : "out/evergreen"));
const relativeOutput = path.relative(outputRoot, outputDirectory);
// Only dedicated generated directories below out/ may be replaced.
assert(relativeOutput && !relativeOutput.startsWith("..") && !path.isAbsolute(relativeOutput), "Export output must be a subdirectory of out/");
await mkdir(outputRoot, { recursive: true });
assert.equal(await realpath(outputRoot), outputRoot, "out/ must not be a symlink");
await mkdir(path.dirname(outputDirectory), { recursive: true });
assert.equal(await realpath(path.dirname(outputDirectory)), path.dirname(outputDirectory), "Export parent must not contain symlinks");

const { preservedFiles } = JSON.parse(await readFile(new URL("./export-manifest.json", import.meta.url), "utf8"));
for (const [file, expected] of Object.entries(preservedFiles)) {
  const actual = createHash("sha256").update(await readFile(path.join(projectRoot, file))).digest("hex");
  assert.equal(actual, expected, `Published baseline changed: ${file}`);
}
// The monochrome production copies must not replace the historical originals.
for (const image of ["quiet-practice-hero.jpg", "editorial-portrait-v2.jpg"]) {
  const actual = createHash("sha256").update(await readFile(path.join(projectRoot, "public", image))).digest("hex");
  assert.equal(actual, preservedFiles[`github-pages/${image}`], `Historical image changed: public/${image}`);
}
const consultation = JSON.parse(await readFile(new URL("../config/consultation.json", import.meta.url), "utf8"));
const interest = JSON.parse(await readFile(new URL("../config/interest-list.json", import.meta.url), "utf8"));
assert.equal(new URL(consultation.endpoint).protocol, "https:");

const workerUrl = pathToFileURL(path.join(projectRoot, "dist/server/index.js"));
workerUrl.searchParams.set("evergreen-export", String(Date.now()));
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(new Request(new URL(authoringRoute, canonicalUrl), { headers: { accept: "text/html" } }), {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
}, { waitUntil() {}, passThroughOnException() {} });
assert.equal(response.status, 200, "Evergreen source route must render successfully");
assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/);
let html = await response.text();

function replaceOnce(pattern, replacement, label) {
  const matcher = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
  assert.equal([...html.matchAll(matcher)].length, 1, `Expected exactly one ${label}`);
  html = html.replace(pattern, replacement);
}

// Rendered React payloads are unnecessary for this static page. Its only
// executable script is the reviewed controller; structured data is added below.
assert((html.match(/<script\b/gi) ?? []).length > 0, "Expected server-rendered React scripts");
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*\/?\s*>/gi, "");
assert.doesNotMatch(html, /<script\b|modulepreload/i);
replaceOnce(/(<meta name="robots" content=")noindex, follow("\s*\/?>)/, `$1${production ? "index, follow, max-image-preview:large" : "noindex, follow"}$2`, "robots directive");

// Keep only the verified site identity. Address, opening date and business
// licensing details are deliberately absent until those facts are confirmed.
const website = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: canonicalUrl };
assert(html.includes(`property="og:site_name" content="${website.name}"`), "Structured site name must agree with page metadata");
assert(html.includes(`rel="canonical" href="${website.url}"`), "Structured site URL must agree with canonical metadata");
const structuredData = JSON.stringify(website).replaceAll("<", "\\u003c");
assert.deepEqual(JSON.parse(structuredData), website);
replaceOnce(/<\/head>/, `<script type="application/ld+json">${structuredData}</script></head>`, "head closing tag");

assert.equal((html.match(/\bdata-consultation-form(?:=|\s|>)/g) ?? []).length, 1, "Expected exactly one interest-list form");
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const endpointPattern = new RegExp(`data-endpoint="${escapeRegex(consultation.endpoint)}"`);
const actionPattern = new RegExp(`action="${escapeRegex(consultation.endpoint)}"`);
const siteKeyPattern = new RegExp(`data-site-key="${escapeRegex(consultation.turnstileSiteKey)}"`);
// Replace both JS configuration and native action. A preview cannot fall back
// to sending contact data to the live service when JavaScript is unavailable.
replaceOnce(endpointPattern, `data-endpoint="${production ? consultation.endpoint : previewEndpoint}"`, "form endpoint");
replaceOnce(actionPattern, `action="${production ? consultation.endpoint : previewEndpoint}"`, "form action");
replaceOnce(siteKeyPattern, `data-site-key="${production ? consultation.turnstileSiteKey : previewSiteKey}"`, "Turnstile site key");
replaceOnce(/<\/body>/, '<script src="/consultation-form.js?v=20261119-phone-fix" defer></script></body>', "body closing tag");
assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
assert(html.includes(`rel="canonical" href="${canonicalUrl}"`));
assert(html.includes('data-request-type="interest"'));
assert(html.includes(`name="permissionVersion" value="${interest.permissionVersion}"`));
assert.doesNotMatch(html, /tycheventuresllc\.com|canyon-and-vine-electrology|href="\/concepts\/|All designs|Compare all designs|Current homepage|Now welcoming clients/);
assert.doesNotMatch(html, /\bsrcset=/i, "Add explicit srcset asset traversal before using responsive sources");
if (!production) assert(!html.includes(consultation.endpoint), "Preview must not contain the live form endpoint");

// Follow only page and stylesheet dependencies. Never publish server bundles,
// source maps, design archives, business documents, or unrelated public files.
const assets = new Set();
const allowedExtensions = new Set([".css", ".woff", ".woff2", ".jpg", ".jpeg", ".png", ".svg", ".webp", ".ico"]);
async function collectAsset(reference, relativeTo = canonicalUrl) {
  if (reference.startsWith("data:") || reference.startsWith("#")) return;
  const url = new URL(reference.replaceAll("&amp;", "&"), relativeTo);
  if (url.origin !== new URL(canonicalUrl).origin) return;
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") return;
  assert(!pathname.includes("\\") && !pathname.includes("\0"), "Invalid asset path");
  assert(allowedExtensions.has(path.extname(pathname)) || pathname === "/consultation-form.js", `Unexpected local dependency: ${pathname}`);
  if (assets.has(pathname)) return;
  assets.add(pathname);
  const source = path.join(clientDirectory, pathname.slice(1));
  const resolvedSource = await realpath(source);
  assert(resolvedSource.startsWith(`${await realpath(clientDirectory)}${path.sep}`), "Asset escapes client output");
  if (pathname.endsWith(".css")) {
    const css = await readFile(source, "utf8");
    assert.doesNotMatch(css, /@import\b/i, "CSS imports must be bundled before export");
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
      await collectAsset(match[1], new URL(pathname, canonicalUrl));
    }
  }
}
for (const [, reference] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) await collectAsset(reference);
for (const [, reference] of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g)) await collectAsset(reference);
assert(assets.has("/consultation-form.js"));
for (const asset of ["/evergreen-hero-monochrome-v1.webp", "/evergreen-portrait-monochrome-v1.webp", "/favicon.svg", "/icon-192.png", "/apple-touch-icon.png"]) {
  assert(assets.has(asset), `Missing production image or icon: ${asset}`);
}
assert(!assets.has("/quiet-practice-hero.jpg") && !assets.has("/editorial-portrait-v2.jpg"), "Production must use the monochrome copies");
assert([...assets].some((asset) => asset.endsWith(".css")));
assert([...assets].some((asset) => asset.endsWith(".woff2")));
assert.deepEqual(await readFile(path.join(clientDirectory, "consultation-form.js")), await readFile(path.join(projectRoot, "public/consultation-form.js")), "Exported controller must match its reviewed source");

// Validate first, then replace only this generated artifact directory.
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
for (const asset of [...assets].sort()) {
  const destination = path.join(outputDirectory, asset.slice(1));
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(clientDirectory, asset.slice(1)), destination);
}
await writeFile(path.join(outputDirectory, "index.html"), html);
await writeFile(path.join(outputDirectory, "404.html"), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><title>Page not found | Evergreen Electrolysis Studio</title></head><body><main><h1>Page not found</h1><p>This page may have moved, or the address may be incorrect.</p><a href="/">Return to Evergreen Electrolysis Studio</a></main></body></html>\n');
await writeFile(path.join(outputDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production ? `<url><loc>${canonicalUrl}</loc></url>` : ""}</urlset>\n`);
// Crawling remains allowed so crawlers can observe preview noindex directives.
await writeFile(path.join(outputDirectory, "robots.txt"), `User-agent: *\nAllow: /\n${production ? `Sitemap: ${canonicalUrl}sitemap.xml\n` : ""}`);
const endpointOrigin = new URL(consultation.endpoint).origin;
const policy = `default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com${production ? ` ${endpointOrigin}` : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'${production ? ` ${endpointOrigin}` : ""}; frame-ancestors 'none'`;
await writeFile(path.join(outputDirectory, "_headers"), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Content-Security-Policy: ${policy}\n${production ? "" : "  X-Robots-Tag: noindex, nofollow\n"}\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/404.html\n  X-Robots-Tag: noindex\n\nhttps://:worker.:account.workers.dev/*\n  X-Robots-Tag: noindex\n`);
console.log(`Evergreen ${production ? "production" : "preview"} export: ${path.relative(projectRoot, outputDirectory)} (${assets.size} referenced assets; ${Object.keys(preservedFiles).length} historical hashes verified).`);
