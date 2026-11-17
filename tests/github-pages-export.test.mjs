import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const expectedUrl =
  "https://tycheventuresllc.com/canyon-and-vine-electrology";
const expectedRates = [[15, 65], [30, 95], [45, 135], [60, 175], [90, 265], [120, 350]];
const controllerTag = '<script src="/canyon-and-vine-electrology/consultation-form.js" defer></script>';

function assertConsultationControllerOnly(html) {
  const expected = html.includes('data-request-type="interest"') ? controllerTag.replace('.js"', '.js?v=20261117-interest"') : controllerTag;
  assert.deepEqual([...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(([script]) => script), [expected]);
  assert.equal((html.match(/<script\b/gi) ?? []).length, 1);
  assert.doesNotMatch(html, /rel="modulepreload"/i);
}

test("keeps the approved published baseline intact after the pricing and consultation update", async () => {
  const manifest = JSON.parse(await readFile(new URL("../scripts/export-manifest.json", import.meta.url), "utf8"));
  for (const [file, expected] of Object.entries(manifest.preservedFiles)) {
    const bytes = await readFile(new URL(`../${file}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected, file);
  }
});

test("exports current prices and a usable consultation form on every public website route", async (t) => {
  const manifest = JSON.parse(await readFile(new URL("../scripts/export-manifest.json", import.meta.url), "utf8"));
  const consultation = JSON.parse(await readFile(new URL("../config/consultation.json", import.meta.url), "utf8"));
  for (const { pathname, output } of manifest.routes.filter(({ pathname }) => pathname !== "/concepts")) {
    await t.test(pathname, async () => {
      const html = await readFile(new URL(`../github-pages/${output}`, import.meta.url), "utf8");
      assert.equal((html.match(/\bdata-treatment-pricing(?:=|\s|>)/g) ?? []).length, 1);
      const rateRows = [...html.matchAll(/<div\b[^>]*data-minutes="(\d+)"[^>]*>([\s\S]*?)<\/div>/g)];
      assert.equal(rateRows.length, expectedRates.length);
      assert.deepEqual(rateRows.map(([, minutes, row]) => {
        const duration = row.match(/<dt\b[^>]*>([\s\S]*?)<\/dt>/)?.[1].replace(/<[^>]*>/g, "").trim();
        const amount = row.match(/<dd\b[^>]*>([\s\S]*?)<\/dd>/)?.[1].replace(/<[^>]*>/g, "").trim();
        assert.equal(duration, `${minutes} minutes`);
        assert.match(amount ?? "", /^\$\d+$/);
        return [Number(minutes), Number(amount.slice(1))];
      }), expectedRates);
      assert.equal((html.match(/<form\b/g) ?? []).length, 1);
      const form = html.match(/<form\b[^>]*>/)?.[0] ?? "";
      assert.match(form, /\bdata-consultation-form(?:=|\s|>)/);
      assert.ok(form.includes(`data-endpoint="${consultation.endpoint}"`));
      assert.ok(form.includes(`data-site-key="${consultation.turnstileSiteKey}"`));
      assertConsultationControllerOnly(html);
      assert.doesNotMatch(html, /ADD VERIFIED PRICES|ADD VERIFIED LINK|hello@example\.com|href="tel:|Booking link added before launch|Online booking is not connected|appointment requests are not sent/i);
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
      assert.equal(new Set(ids).size, ids.length, "Form and page IDs must be unique");
      assert.ok(ids.includes("top"), "Confirmation must be able to return to the page top");
      for (const [, anchor] of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.includes(anchor), `Missing anchor ${anchor}`);
      for (const [, target] of html.matchAll(/\b(?:for|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
        for (const id of target.split(/\s+/)) assert.ok(ids.includes(id), `Missing accessible label or description ${id}`);
      }
      const canonical = `${expectedUrl}${pathname === "/" ? "/" : pathname + "/"}`;
      assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      assert.doesNotMatch(html, /(?:href|src)="\/assets\//);
      for (const [, relative] of html.matchAll(/(?:href|src)="\/canyon-and-vine-electrology\/([^"?#]*)/g)) {
        await access(new URL(`../github-pages/${relative}${relative.endsWith("/") || !relative ? "index.html" : ""}`, import.meta.url));
      }
      for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
        assert.match(img, /alt="[^"]*"/);
        if (img.includes('alt=""')) assert.match(img, /src="\/canyon-and-vine-electrology\/brand-mark\.png\?/);
        assert.match(img, /width="\d+"/);
        assert.match(img, /height="\d+"/);
      }
      for (const [, href] of html.matchAll(/rel="stylesheet" href="([^"]+)"/g)) {
        const cssPath = new URL(`../github-pages/${href.replace("/canyon-and-vine-electrology/", "")}`, import.meta.url);
        const css = await readFile(cssPath, "utf8");
        assert.doesNotMatch(css, /url\(["']?\/assets\//, "Font URLs must resolve beneath the repository path");
        for (const [, font] of css.matchAll(/url\(["']?(\.\/[^)"']+\.woff2)["']?\)/g)) await access(new URL(font, cssPath));
      }
    });
  }
});

test("exports Design 05 with working static navigation and self-contained imagery", async () => {
  const html = await readFile(new URL("../github-pages/concepts/design-05/index.html", import.meta.url), "utf8");
  const gallery = await readFile(new URL("../github-pages/concepts/index.html", import.meta.url), "utf8");
  assert.match(gallery, /The Everyday Edit/);
  assert.match(gallery, /href="\/canyon-and-vine-electrology\/concepts\/design-05\/"/);
  assert.match(html, /rel="canonical" href="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/concepts\/design-05\/"/);
  assert.match(html, /property="og:image" content="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/everyday-edit-portrait.jpg"/);
  assert.match(html, /src="\/canyon-and-vine-electrology\/everyday-edit-portrait.jpg"/);
  assertConsultationControllerOnly(html);
  assert.doesNotMatch(html, /(?:href|src)="\/(?:assets\/|everyday-edit)/i);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing anchor ${match[1]}`);
  for (const match of html.matchAll(/(?:href|src)="\/canyon-and-vine-electrology\/([^"?#]*)/g)) {
    const relative = match[1];
    await access(new URL(`../github-pages/${relative}${relative.endsWith("/") ? "index.html" : ""}`, import.meta.url));
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /alt="[^"]+"/);
    assert.match(match[0], /width="\d+"/);
    assert.match(match[0], /height="\d+"/);
  }
  const original = await readFile(new URL("../public/everyday-edit-portrait.jpg", import.meta.url));
  const exported = await readFile(new URL("../github-pages/everyday-edit-portrait.jpg", import.meta.url));
  assert.deepEqual(original, exported);
  assert.ok(original.length < 500_000, "Hero should stay below 500 KB");
  const stylesheet = html.match(/rel="stylesheet" href="([^"]+)"/)[1];
  const css = await readFile(new URL(`../github-pages/${stylesheet.replace("/canyon-and-vine-electrology/", "")}`, import.meta.url), "utf8");
  assert.doesNotMatch(css, /url\(["']?\/assets\//, "Static font URLs must resolve under the repository path");
  for (const match of css.matchAll(/url\(["']?(\.\/[^)"']+\.woff2)["']?\)/g)) {
    await access(new URL(`../github-pages/assets/${match[1]}`, import.meta.url));
  }
});

test("exports Design 06 with complete archive links, accessible disclosures and resolved assets", async () => {
  const html = await readFile(new URL("../github-pages/concepts/design-06/index.html", import.meta.url), "utf8");
  const gallery = await readFile(new URL("../github-pages/concepts/index.html", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../scripts/export-manifest.json", import.meta.url), "utf8"));
  for (const route of manifest.routes) {
    if (route.pathname === "/concepts") continue;
    const href = `/canyon-and-vine-electrology${route.pathname === "/" ? "/" : route.pathname + "/"}`;
    assert.ok(gallery.includes(`href="${href}"`), `Gallery missing ${href}`);
  }
  assert.match(gallery, /The Clear Path/);
  assert.match(html, /rel="canonical" href="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/concepts\/design-06\/"/);
  assert.match(html, /property="og:image" content="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/clear-path-botanical.jpg"/);
  assertConsultationControllerOnly(html);
  assert.doesNotMatch(html, /(?:href|src)="\/(?:assets\/|clear-path)/i);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing anchor ${match[1]}`);
  const disclosures = [...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)];
  assert.ok(disclosures.length >= 10, "Treatment and consultation guidance must remain available");
  for (const [, disclosure] of disclosures) assert.equal((disclosure.match(/<summary\b/g) ?? []).length, 1);
  for (const match of html.matchAll(/(?:href|src)="\/canyon-and-vine-electrology\/([^"?#]*)/g)) {
    const relative = match[1];
    await access(new URL(`../github-pages/${relative}${relative.endsWith("/") ? "index.html" : ""}`, import.meta.url));
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /alt="[^"]+"/);
    assert.match(match[0], /width="\d+"/);
    assert.match(match[0], /height="\d+"/);
  }
  const original = await readFile(new URL("../public/clear-path-botanical.jpg", import.meta.url));
  assert.deepEqual(original, await readFile(new URL("../github-pages/clear-path-botanical.jpg", import.meta.url)));
  assert.ok(original.length < 500_000);
  const stylesheet = html.match(/rel="stylesheet" href="([^"]+)"/)[1];
  const css = await readFile(new URL(`../github-pages/${stylesheet.replace("/canyon-and-vine-electrology/", "")}`, import.meta.url), "utf8");
  assert.doesNotMatch(css, /url\(["']?\/assets\//);
  for (const match of css.matchAll(/url\(["']?(\.\/[^)"']+\.woff2)["']?\)/g)) await access(new URL(`../github-pages/assets/${match[1]}`, import.meta.url));
});

test("exports a self-contained GitHub Pages site", async () => {
  const html = await readFile(
    new URL("../github-pages/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /Now welcoming clients/);
  assert.match(html, /Evergreen Electrolysis/);
  assert.doesNotMatch(html, /Ever Green/);
  assert.doesNotMatch(html, /Canyon &amp; Vine|Canyon and Vine|>CV</);
  assert.match(
    html,
    /href="\/canyon-and-vine-electrology\/assets\/index-[^"]+\.css"/,
  );
  assert.match(
    html,
    /src="\/canyon-and-vine-electrology\/brand-mark\.png\?v=ee-electrolysis-20261111"/,
  );
  assert.match(
    html,
    /src="\/canyon-and-vine-electrology\/hero-profile\.jpg\?v=ee-electrolysis-20261111"/,
  );
  assert.doesNotMatch(
    html,
    /(?:href|src)="\/(?:brand-mark\.png|hero-profile\.jpg)(?:\?[^\"]*)?"/,
  );
  assert.match(
    html,
    new RegExp(`${expectedUrl}/og\\.png\\?v=ee-electrolysis-20261111`),
  );
  assert.match(html, new RegExp(`rel="canonical" href="${expectedUrl}/"`));
  assert.match(
    html,
    new RegExp(
      `name="twitter:image" content="${expectedUrl}/og\\.png\\?v=ee-electrolysis-20261111"`,
    ),
  );
  assert.match(html, /width="1003" height="1568"/);
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
  assert.equal((html.match(/<script\b/g) ?? []).length, 1);
  assert.match(html, /<script src="\/canyon-and-vine-electrology\/consultation-form.js" defer><\/script>/);
  assert.doesNotMatch(html, /rel="modulepreload"/i);
  assert.doesNotMatch(html, /(?:href|src)="\/assets\//);
  assert.doesNotMatch(html, /name="robots" content="noindex, nofollow"/i);
  assert.doesNotMatch(html, /nofollow/i);
  assert.doesNotMatch(
    html,
    /thetinycart\.github\.io|canyon-and-vine-electrology\.sukhpalc\.chatgpt\.site/i,
  );

  await Promise.all([
    access(new URL("../github-pages/og.png", import.meta.url)),
    access(new URL("../github-pages/brand-mark.png", import.meta.url)),
    access(new URL("../github-pages/hero-profile.jpg", import.meta.url)),
    access(new URL("../github-pages/.nojekyll", import.meta.url)),
  ]);

  const [
    publicMark,
    exportedMark,
    publicHero,
    exportedHero,
    publicOg,
    exportedOg,
  ] = await Promise.all([
    readFile(new URL("../public/brand-mark.png", import.meta.url)),
    readFile(new URL("../github-pages/brand-mark.png", import.meta.url)),
    readFile(new URL("../public/hero-profile.jpg", import.meta.url)),
    readFile(new URL("../github-pages/hero-profile.jpg", import.meta.url)),
    readFile(new URL("../public/og.png", import.meta.url)),
    readFile(new URL("../github-pages/og.png", import.meta.url)),
  ]);
  const hash = (value) => createHash("sha256").update(value).digest("hex");

  assert.equal(hash(exportedMark), hash(publicMark));
  assert.equal(hash(exportedHero), hash(publicHero));
  assert.equal(hash(exportedOg), hash(publicOg));
  assert.equal(publicMark.readUInt32BE(16), 512);
  assert.equal(publicMark.readUInt32BE(20), 512);
  assert.equal(publicOg.readUInt32BE(16), 1731);
  assert.equal(publicOg.readUInt32BE(20), 909);
  assert.deepEqual([...publicHero.subarray(0, 3)], [0xff, 0xd8, 0xff]);
  assert.deepEqual([...publicHero.subarray(-2)], [0xff, 0xd9]);
});

test("exports the concepts index and alternate designs without replacing the homepage", async () => {
  const [home, concepts, alternate, flagship, quiet] = await Promise.all([
    readFile(new URL("../github-pages/index.html", import.meta.url), "utf8"),
    readFile(new URL("../github-pages/concepts/index.html", import.meta.url), "utf8"),
    readFile(
      new URL("../github-pages/concepts/design-02/index.html", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../github-pages/concepts/design-03/index.html", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../github-pages/concepts/design-04/index.html", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(home, /Feel at home/);
  assert.match(concepts, /Classic Monochrome/);
  assert.match(concepts, /Wine Country Journal/);
  assert.match(concepts, /Portrait of Precision/);
  assert.match(concepts, /The Quiet Practice/);
  assert.match(alternate, /A quieter way/);
  assert.match(alternate, /Before your visit/);
  assert.match(flagship, /Precisely/);
  assert.match(flagship, /The Evergreen standard/);
  assert.match(quiet, /Permanent hair removal/);
  assert.match(quiet, /A plan made for you/);
  assert.match(
    concepts,
    /href="\/canyon-and-vine-electrology\/concepts\/design-02\/"/,
  );
  assert.match(
    alternate,
    /rel="canonical" href="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/concepts\/design-02\/"/,
  );
  assert.match(
    concepts,
    /href="\/canyon-and-vine-electrology\/concepts\/design-03\/"/,
  );
  assert.match(
    flagship,
    /rel="canonical" href="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/concepts\/design-03\/"/,
  );
  assert.match(
    concepts,
    /href="\/canyon-and-vine-electrology\/concepts\/design-04\/"/,
  );
  assert.match(
    quiet,
    /rel="canonical" href="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/concepts\/design-04\/"/,
  );
  assert.match(
    quiet,
    /src="\/canyon-and-vine-electrology\/quiet-practice-hero\.jpg\?v=d04-20261111"/,
  );
  assert.match(
    quiet,
    /href="\/canyon-and-vine-electrology\/quiet-practice-hero\.jpg\?v=d04-20261111"/,
  );
  assert.doesNotMatch(
    quiet,
    /(?:href|src)="\/quiet-practice-hero\.jpg\?v=d04-20261111"/,
  );
  assert.match(
    quiet,
    /property="og:url" content="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/concepts\/design-04\/"/,
  );
  assert.match(
    quiet,
    /property="og:image" content="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/quiet-practice-hero\.jpg\?v=d04-20261111"/,
  );
  assert.match(quiet, /name="robots" content="noindex, follow"/i);
  assert.doesNotMatch(quiet, /hello@example\.com|\(707\) 555-0147|href="tel:/i);
  assert.doesNotMatch(
    quiet,
    /editorial image|representative only|not a client result|not an actual treatment|illustrative image|real portrait of Nav/i,
  );

  const assets = await readdir(new URL("../github-pages/assets/", import.meta.url));
  assert.ok(assets.some((asset) => asset.endsWith(".woff2")));
  const exportedCss = (
    await Promise.all(
      assets
        .filter((asset) => asset.endsWith(".css"))
        .map((asset) => readFile(new URL(`../github-pages/assets/${asset}`, import.meta.url), "utf8")),
    )
  ).join("\n");
  assert.match(exportedCss, /Newsreader Variable/);
  assert.match(exportedCss, /Manrope Variable/);

  assert.doesNotMatch(concepts, /<script\b/i);
  for (const html of [alternate, flagship, quiet]) assertConsultationControllerOnly(html);
  for (const html of [concepts, alternate, flagship, quiet]) {
    assert.doesNotMatch(html, /rel="modulepreload"/i);
    assert.doesNotMatch(html, /(?:href|src)="\/assets\//);
  }
});

test("Design 07 publishes its own portrait metadata and preserves the approved homepage", async () => {
  const html = await readFile(new URL("../github-pages/concepts/design-07/index.html", import.meta.url), "utf8");
  const gallery = await readFile(new URL("../github-pages/concepts/index.html", import.meta.url), "utf8");
  assert.match(gallery, /The Personal Edit/);
  assert.match(gallery, /href="\/canyon-and-vine-electrology\/concepts\/design-07\/"/);
  assert.match(html, /property="og:image" content="https:\/\/tycheventuresllc\.com\/canyon-and-vine-electrology\/personal-edit-portrait.jpg"/);
  assert.match(html, /src="\/canyon-and-vine-electrology\/personal-edit-portrait.jpg"/);
  assert.match(html, /California-licensed electrologist/);
  assert.match(html, /Microbiology from UC Davis/);
  assert.match(html, /California Electrology Academy in Corona/);
  assert.match(html, /License # \[ADD NUMBER\]/);
  assert.match(html, /Intimate-area services are not offered/);
  assert.doesNotMatch(html, /stock image|representative image|not a client|FDA.approved|pain.free|guaranteed results|mailto:/i);
  const portrait = await readFile(new URL("../public/personal-edit-portrait.jpg", import.meta.url));
  assert.ok(portrait.length < 500_000);
  assert.deepEqual(portrait, await readFile(new URL("../github-pages/personal-edit-portrait.jpg", import.meta.url)));
  const manifest = JSON.parse(await readFile(new URL("../scripts/export-manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.routes.find(route => route.pathname === "/").preserve, true);
  assert.ok(manifest.preservedFiles["app/page.tsx"]);
  assert.ok(manifest.preservedFiles["github-pages/index.html"]);
});


test("selected prelaunch designs use the approved studio details and summer 2027 interest list", async () => {
  const manifest = JSON.parse(await readFile(new URL("../scripts/export-manifest.json", import.meta.url), "utf8"));
  for (const { pathname, output } of manifest.routes.filter(route => route.pathname !== "/concepts")) {
    const html = await readFile(new URL(`../github-pages/${output}`, import.meta.url), "utf8");
    const updated = ["/concepts/design-04", "/concepts/design-07", "/concepts/design-08", "/concepts/design-09"].includes(pathname);
    if (!updated) { assert.doesNotMatch(html, /data-request-type="interest"/); continue; }
    for (const text of ["Evergreen Electrolysis Studio", "Coming summer 2027", "Join interest list", "American Canyon, CA", "Monday–Friday · 8am–4pm", 'data-request-type="interest"', 'value="interest-2026-11-17"']) assert.ok(html.includes(text), `${pathname}: ${text}`);
    assert.match(html, /<dt>Phone<\/dt><dd><\/dd>/);
    assert.doesNotMatch(html, /ADD STUDIO ADDRESS|ADD PHONE NUMBER|ADD BUSINESS HOURS|Appointment booking destination|TO BE CONFIRMED|Let’s begin|This form does not subscribe you to marketing/);
    assert.match(html, /You’re on the interest list/);
    assert.match(html, /removed at any time/);
  }
  const eight = await readFile(new URL("../github-pages/concepts/design-08/index.html", import.meta.url), "utf8");
  for (const photo of ["quiet-practice-hero.jpg", "editorial-portrait-v2.jpg"]) assert.ok(eight.includes(photo));
  assert.doesNotMatch(eight, /personal-edit-portrait.jpg/);
  const css = await readFile(new URL("../app/concepts/design-08/design08.module.css", import.meta.url), "utf8");
  assert.match(css, /grid-template-areas: "heading photo" "intro photo" "foot foot"/);
  assert.doesNotMatch(css, /border-radius: (?:48|42)%/);
});
