import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { after, before, test } from "node:test";

const run = promisify(execFile);
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const canonical = "https://evergreenelectrolysisstudio.com/";
const exporter = path.join(projectRoot, "scripts/export-evergreen.mjs");
const consultation = JSON.parse(await readFile(new URL("../config/consultation.json", import.meta.url), "utf8"));
const permission = JSON.parse(await readFile(new URL("../config/interest-list.json", import.meta.url), "utf8"));
let temporaryDirectory;
let previewDirectory;
let productionDirectory;
let preview;
let production;

before(async () => {
  await mkdir(path.join(projectRoot, "out"), { recursive: true });
  temporaryDirectory = await mkdtemp(path.join(projectRoot, "out/evergreen-export-test-"));
  previewDirectory = path.join(temporaryDirectory, "preview");
  productionDirectory = path.join(temporaryDirectory, "production");
  // Both runs use the real built source and exporter, never an HTML fixture.
  await run(process.execPath, [exporter, `--output=${previewDirectory}`], { cwd: projectRoot });
  await run(process.execPath, [exporter, "--production", `--output=${productionDirectory}`], { cwd: projectRoot });
  preview = await readFile(path.join(previewDirectory, "index.html"), "utf8");
  production = await readFile(path.join(productionDirectory, "index.html"), "utf8");
});

after(async () => {
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
});

test("preview cannot submit to the live form, and publication requires an explicit production mode", async () => {
  assert.match(preview, /data-endpoint="\/__preview__\/request"/);
  assert.match(preview, /action="\/__preview__\/request"/);
  assert.match(preview, /data-site-key="1x00000000000000000000AA"/);
  assert(!preview.includes(consultation.endpoint));
  assert(!preview.includes(consultation.turnstileSiteKey));
  assert.match(preview, /name="robots" content="noindex, follow"/);
  const previewHeaders = await readFile(path.join(previewDirectory, "_headers"), "utf8");
  assert.match(previewHeaders.split(/\n\n/)[0], /X-Robots-Tag: noindex/);
  assert(!previewHeaders.includes(new URL(consultation.endpoint).origin), "Preview policy must not allow live delivery");

  assert(production.includes(`data-endpoint="${consultation.endpoint}"`));
  assert(production.includes(`action="${consultation.endpoint}"`));
  assert(production.includes(`data-site-key="${consultation.turnstileSiteKey}"`));
  assert.doesNotMatch(production, /__preview__|1x00000000000000000000AA/);
  assert.match(production, /name="robots" content="index, follow, max-image-preview:large"/);
  const productionHeaders = await readFile(path.join(productionDirectory, "_headers"), "utf8");
  assert.doesNotMatch(productionHeaders.split(/\n\n/)[0], /X-Robots-Tag/);
  assert.match(productionHeaders, /workers\.dev\/\*\n  X-Robots-Tag: noindex/);
});

test("new homepage preserves the approved prelaunch service, rates and interest permission", () => {
  for (const html of [preview, production]) {
    assert.match(html, /Coming summer 2027/);
    assert.match(html, /Feel at home/);
    assert.match(html, /Napa, Solano, and Marin counties/);
    assert.match(html, /data-request-type="interest"/);
    assert.match(html, /Joining the interest list does not book an appointment/);
    assert(html.includes(`name="permissionVersion" value="${permission.permissionVersion}"`));
    assert(html.includes(permission.permissionText));
    assert.match(html, /Intimate-area services are not offered/);
    assert.match(html, /Please leave medical history, medications, and photos for your consultation/);
    assert.doesNotMatch(html, /All designs|Compare all designs|Current homepage|Design 09|Now welcoming clients/);
    const rates = [...html.matchAll(/<div\b[^>]*data-minutes="(\d+)"[^>]*>([\s\S]*?)<\/div>/g)].map(([, minutes, row]) => {
      const amount = row.match(/<dd\b[^>]*>([\s\S]*?)<\/dd>/)?.[1].replace(/<[^>]*>/g, "").trim();
      assert.match(amount ?? "", /^\$\d+$/);
      return [Number(minutes), Number(amount.slice(1))];
    });
    assert.deepEqual(rates, [[15, 65], [30, 95], [45, 135], [60, 175], [90, 265], [120, 350]]);
    assert.equal((html.match(/<form\b/g) ?? []).length, 1);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
    assert.equal(new Set(ids).size, ids.length, "Page IDs must be unique");
    for (const [, target] of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(target), `Missing anchor: ${target}`);
    for (const [, targets] of html.matchAll(/\b(?:for|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
      for (const target of targets.split(/\s+/)) assert(ids.includes(target), `Missing accessible reference: ${target}`);
    }
  }
});

test("production indexing names only the new canonical homepage and previews remain excluded", async () => {
  for (const html of [preview, production]) {
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
    assert(html.includes(`rel="canonical" href="${canonical}"`));
    assert(html.includes(`property="og:url" content="${canonical}"`));
    assert.match(html, /<title>Electrolysis in American Canyon \| Evergreen Electrolysis Studio<\/title>/);
    assert.doesNotMatch(html, /tycheventuresllc\.com|canyon-and-vine-electrology|chatgpt\.site|href="\/concepts\//);
  }
  const sitemap = await readFile(path.join(productionDirectory, "sitemap.xml"), "utf8");
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url), [canonical]);
  assert.equal(await readFile(path.join(productionDirectory, "robots.txt"), "utf8"), `User-agent: *\nAllow: /\nSitemap: ${canonical}sitemap.xml\n`);
  assert.doesNotMatch(await readFile(path.join(previewDirectory, "sitemap.xml"), "utf8"), /<loc>/);
  assert.doesNotMatch(await readFile(path.join(previewDirectory, "robots.txt"), "utf8"), /Disallow: \/|Sitemap:/);
  const notFound = await readFile(path.join(productionDirectory, "404.html"), "utf8");
  assert.match(notFound, /<h1>Page not found<\/h1>/);
  assert.match(notFound, /name="robots" content="noindex, follow"/);
  assert.doesNotMatch(notFound, /data-consultation-form|rel="canonical"/);
});

test("search and share metadata use the final brand and monochrome image without inventing business details", () => {
  for (const html of [preview, production]) {
    const meta = new Map([...html.matchAll(/<meta\b[^>]*(?:name|property)="([^"]+)"[^>]*content="([^"]*)"[^>]*>/g)].map(([, key, value]) => [key, value]));
    const image = `${canonical}evergreen-hero-monochrome-v1.webp`;
    assert.equal(meta.get("og:title"), "Electrolysis in American Canyon");
    assert.equal(meta.get("og:site_name"), "Evergreen Electrolysis Studio");
    assert.equal(meta.get("og:image"), image);
    assert.equal(meta.get("twitter:image"), image);
    assert.equal(meta.get("og:image:width"), "1586");
    assert.equal(meta.get("og:image:height"), "992");
    assert.equal(meta.get("og:image:alt"), "Black-and-white portrait of a woman against a dark background");
    assert.equal(meta.get("twitter:image:alt"), meta.get("og:image:alt"));
    assert.match(meta.get("description"), /coming summer 2027/);
    assert.match(html, /<img\b[^>]*src="\/evergreen-hero-monochrome-v1\.webp"/);
    assert.match(html, /<img\b[^>]*src="\/evergreen-portrait-monochrome-v1\.webp"/);
    assert.doesNotMatch(html, /quiet-practice-hero\.jpg|editorial-portrait-v2\.jpg/);
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => new Map([...tag.matchAll(/\b([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])));
    for (const [relation, file] of [["icon", "favicon.svg"], ["icon", "icon-192.png"], ["apple-touch-icon", "apple-touch-icon.png"]]) {
      assert(links.some((link) => link.get("rel") === relation && new URL(link.get("href"), canonical).href === `${canonical}${file}`), `Missing ${file} icon link`);
    }
    const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, body]) => JSON.parse(body));
    assert.deepEqual(data, [{ "@context": "https://schema.org", "@type": "WebSite", name: "Evergreen Electrolysis Studio", url: canonical }]);
  }
});

test("every exported page dependency resolves locally and only the reviewed form script executes", async () => {
  const expectedFiles = new Set(["index.html", "404.html", "sitemap.xml", "robots.txt", "_headers"]);
  async function checkDependency(reference, base = canonical) {
    if (reference.startsWith("#") || reference.startsWith("data:")) return;
    const url = new URL(reference.replaceAll("&amp;", "&"), base);
    if (url.origin !== new URL(canonical).origin || url.pathname === "/") return;
    const relative = decodeURIComponent(url.pathname).slice(1);
    await access(path.join(productionDirectory, relative));
    if (expectedFiles.has(relative)) return;
    expectedFiles.add(relative);
    if (relative.endsWith(".css")) {
      const css = await readFile(path.join(productionDirectory, relative), "utf8");
      for (const [, reference] of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) await checkDependency(reference, url);
    }
  }
  for (const [, reference] of production.matchAll(/\b(?:src|href)="([^"]+)"/g)) await checkDependency(reference);
  for (const [, reference] of production.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g)) await checkDependency(reference);
  async function files(directory, prefix = "") {
    const result = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = path.join(prefix, entry.name);
      if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), relative));
      else result.push(relative);
    }
    return result;
  }
  assert.deepEqual((await files(productionDirectory)).sort(), [...expectedFiles].sort(), "No unrelated source, archive or assets may leak into deployment");
  const executableScripts = [...production.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script>/g)].filter(([, attributes]) => !/\btype="application\/ld\+json"/.test(attributes)).map(([tag]) => tag);
  assert.deepEqual(executableScripts, ['<script src="/consultation-form.js?v=20261118-inquiry-mail" defer></script>']);
  assert.doesNotMatch(production, /modulepreload/);
  for (const asset of ["consultation-form.js", "evergreen-hero-monochrome-v1.webp", "evergreen-portrait-monochrome-v1.webp", "favicon.svg", "icon-192.png", "apple-touch-icon.png"]) {
    assert.deepEqual(await readFile(path.join(productionDirectory, asset)), await readFile(path.join(projectRoot, "public", asset)), `${asset} must retain its reviewed bytes`);
  }
});

test("exporting both environments leaves the complete historical baseline untouched", async () => {
  const { preservedFiles } = JSON.parse(await readFile(new URL("../scripts/export-manifest.json", import.meta.url), "utf8"));
  for (const [file, expected] of Object.entries(preservedFiles)) {
    assert.equal(createHash("sha256").update(await readFile(path.join(projectRoot, file))).digest("hex"), expected, file);
  }
  for (const image of ["quiet-practice-hero.jpg", "editorial-portrait-v2.jpg"]) {
    assert.equal(createHash("sha256").update(await readFile(path.join(projectRoot, "public", image))).digest("hex"), preservedFiles[`github-pages/${image}`], image);
  }
});

test("export refuses an output path outside the generated out directory", async () => {
  await assert.rejects(run(process.execPath, [exporter, "--output=public"], { cwd: projectRoot }), /Export output must be a subdirectory of out/);
});
