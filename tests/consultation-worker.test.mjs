import assert from "node:assert/strict";
import test from "node:test";
import worker, { createHandler } from "../cloudflare/consultation/worker.mjs";
import fields from "../config/consultation-fields.json" with { type: "json" };

const ORIGIN = "https://tycheventuresllc.com";
const validSubmission = {
  firstName: "Jane",
  lastName: "Smith",
  phone: "(707) 555-0123",
  email: "jane@example.com",
  website: "",
  turnstileToken: "valid-test-token",
};

function request(body = validSubmission, options = {}) {
  return new Request("https://consultation.example.workers.dev/request", {
    method: "POST",
    headers: { Origin: ORIGIN, "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" },
    body: JSON.stringify(body),
    ...options,
  });
}

function harness({ verify, send, env: overrides, timeout = 5000 } = {}) {
  const sent = [];
  const verified = [];
  const handler = createHandler({
    verificationTimeoutMs: timeout,
    fetch: async (...args) => {
      verified.push(args);
      if (verify) return verify(...args);
      return Response.json({ success: true, hostname: new URL(ORIGIN).hostname, action: "consultation" });
    },
  });
  const env = {
    ALLOWED_ORIGINS: ORIGIN,
    TURNSTILE_SECRET_KEY: "test-secret",
    SENDER_EMAIL: "consultations@example.com",
    RECIPIENT_EMAIL: "sukhpalc@gmail.com",
    CONSULTATION_EMAIL: {
      async send(message) {
        sent.push(message);
        return send ? send(message) : { messageId: "test-id" };
      },
    },
    ...overrides,
  };
  return { handler, env, sent, verified };
}

test("sends a validated consultation to the fixed owner and normalizes the US phone", async () => {
  const { handler, env, sent, verified } = harness();
  const result = await handler(request({ ...validSubmission, firstName: " Jane ", phone: "+1 (707) 555-0123", to: "attacker@example.com" }), env);
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.equal(result.headers.get("Cache-Control"), "no-store");
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "sukhpalc@gmail.com");
  assert.equal(sent[0].from, "consultations@example.com");
  assert.equal(sent[0].replyTo, "jane@example.com");
  assert.match(sent[0].text, /First name: Jane\n/);
  assert.match(sent[0].text, /Phone: \+17075550123/);
  assert.equal(verified.length, 1);
  assert.equal(verified[0][0], "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(verified[0][1].body.get("secret"), "test-secret");
  assert.equal(verified[0][1].body.get("response"), "valid-test-token");
  assert.equal(verified[0][1].body.get("remoteip"), "192.0.2.1");
  assert.ok(verified[0][1].signal instanceof AbortSignal);
});

for (const email of [undefined, "", "   "]) {
  test(`optional email can be ${JSON.stringify(email)}`, async () => {
    const { handler, env, sent } = harness({ env: { RECIPIENT_EMAIL: undefined } });
    const result = await handler(request({ ...validSubmission, email }), env);
    assert.equal(result.status, 200);
    assert.equal(sent[0].to, "sukhpalc@gmail.com");
    assert.equal(Object.hasOwn(sent[0], "replyTo"), false);
    assert.match(sent[0].text, /Email: Not provided/);
  });
}

test("accepts names with Unicode and punctuation", async () => {
  const { handler, env, sent } = harness();
  assert.equal((await handler(request({ ...validSubmission, firstName: "María-José", lastName: "O’Neill" }), env)).status, 200);
  assert.match(sent[0].text, /María-José/);
});

test("includes optional answers, the exact versioned notice, and server receipt context in the owner email", async () => {
  const { handler, env, sent } = harness();
  const startedAt = Date.now();
  const result = await handler(request({
    ...validSubmission,
    treatmentAreas: ["Upper lip", "Chin & jawline"],
    previousMethods: ["Shaving", "Laser or IPL"],
    contactPreference: "Email",
    notes: "  I have a scheduling question.\r\nAre afternoons available?  ",
    permissionVersion: fields.permissionVersion,
  }), env);
  assert.equal(result.status, 200);
  const message = sent[0];
  assert.equal(message.to, "sukhpalc@gmail.com");
  assert.equal(message.replyTo, "jane@example.com");
  assert.match(message.text, /Preferred contact method: Email\n/);
  assert.match(message.text, /Treatment areas: Upper lip, Chin & jawline\n/);
  assert.match(message.text, /Previous hair-removal methods: Shaving, Laser or IPL\n/);
  assert.match(message.text, /Questions \/ notes:\n  I have a scheduling question\.\n  Are afternoons available\?\n/);
  assert.ok(message.text.includes(`Contact permission notice version: ${fields.permissionVersion}\n${fields.permissionText}`));
  assert.ok(message.text.includes(`Website: ${ORIGIN}\n`));
  const timestamp = message.text.match(/Received \(UTC\): (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\n/)?.[1];
  assert.ok(timestamp);
  assert.ok(Date.parse(timestamp) >= startedAt && Date.parse(timestamp) <= Date.now());
});

test("legacy submissions remain valid without claiming the new contact notice was supplied", async () => {
  const { handler, env, sent } = harness();
  assert.equal((await handler(request(), env)).status, 200);
  assert.match(sent[0].text, /Preferred contact method: Not specified/);
  assert.match(sent[0].text, /Treatment areas: Not specified/);
  assert.match(sent[0].text, /Previous hair-removal methods: Not specified/);
  assert.match(sent[0].text, /Questions \/ notes:\n  Not provided/);
  assert.match(sent[0].text, /Contact permission notice version: Not supplied \(legacy form\)/);
  assert.equal(sent[0].text.includes(fields.permissionText), false);
});

for (const contactPreference of ["", "Call", "Text"]) {
  test(`accepts blank optional answers without email when contact preference is ${JSON.stringify(contactPreference)}`, async () => {
    const { handler, env, sent } = harness();
    const result = await handler(request({
      ...validSubmission, email: "", treatmentAreas: [], previousMethods: [],
      contactPreference, notes: "  \n ", permissionVersion: fields.permissionVersion,
    }), env);
    assert.equal(result.status, 200);
    assert.equal(Object.hasOwn(sent[0], "replyTo"), false);
    assert.ok(sent[0].text.includes(`Preferred contact method: ${contactPreference || "Not specified"}`));
  });
}

test("deduplicates selections and accepts single exclusive options", async () => {
  const { handler, env, sent } = harness();
  const duplicate = await handler(request({
    ...validSubmission, treatmentAreas: ["Upper lip", "Upper lip"], previousMethods: ["Shaving", "Shaving"],
  }), env);
  assert.equal(duplicate.status, 200);
  assert.match(sent[0].text, /Treatment areas: Upper lip\n/);
  assert.match(sent[0].text, /Previous hair-removal methods: Shaving\n/);
  assert.equal((await handler(request({
    ...validSubmission, treatmentAreas: ["Not sure yet"], previousMethods: ["None"],
  }), env)).status, 200);
});

test("accepts the 500-character note boundary with Unicode and line breaks", async () => {
  const { handler, env, sent } = harness();
  const notes = `Café\n${"a".repeat(495)}`;
  assert.equal(notes.length, 500);
  assert.equal((await handler(request({ ...validSubmission, notes }), env)).status, 200);
  assert.ok(sent[0].text.includes(`  Café\n  ${"a".repeat(495)}`));
});

for (const [label, values] of [
  ["short phone", { phone: "555-0123" }],
  ["international phone", { phone: "+44 20 7946 0958" }],
  ["missing US country code after plus", { phone: "+7075550123" }],
  ["invalid NANP area code", { phone: "1075550123" }],
  ["invalid NANP exchange", { phone: "7071550123" }],
  ["phone extension", { phone: "7075550123 ext 9" }],
  ["blank phone", { phone: " " }],
  ["non-string phone", { phone: 7075550123 }],
  ["blank first name", { firstName: " " }],
  ["missing last name", { lastName: undefined }],
  ["oversized name", { firstName: "a".repeat(81) }],
  ["name newline", { firstName: "Jane\nInjected" }],
  ["invalid optional email", { email: "not-an-email" }],
  ["email header injection", { email: "jane@example.com\r\nBcc:bad@example.com" }],
  ["non-string email", { email: false }],
  ["email contact preference without email", { contactPreference: "Email", email: undefined }],
  ["email contact preference with blank email", { contactPreference: "Email", email: " " }],
  ["unknown contact preference", { contactPreference: "WhatsApp" }],
  ["non-string contact preference", { contactPreference: false }],
  ["null contact preference", { contactPreference: null }],
  ["non-array treatment areas", { treatmentAreas: "Upper lip" }],
  ["null treatment areas", { treatmentAreas: null }],
  ["unknown treatment area", { treatmentAreas: ["Unsupported area"] }],
  ["non-string treatment area", { treatmentAreas: [{}] }],
  ["too many treatment area selections", { treatmentAreas: Array(fields.treatmentAreas.length + 1).fill("Upper lip") }],
  ["uncertain area combined with an area", { treatmentAreas: ["Not sure yet", "Upper lip"] }],
  ["non-array previous methods", { previousMethods: "Shaving" }],
  ["null previous methods", { previousMethods: null }],
  ["unknown previous method", { previousMethods: ["Unsupported method"] }],
  ["non-string previous method", { previousMethods: [false] }],
  ["too many previous methods", { previousMethods: Array(fields.previousMethods.length + 1).fill("Shaving") }],
  ["no previous method combined with a method", { previousMethods: ["None", "Shaving"] }],
  ["non-string notes", { notes: 42 }],
  ["null notes", { notes: null }],
  ["oversized notes", { notes: "a".repeat(501) }],
  ["notes control character", { notes: "Question\u0000hidden" }],
  ["notes direction override", { notes: "Question\u202ehidden" }],
  ["unsupported permission version", { permissionVersion: "2026-11-14" }],
  ["blank permission version", { permissionVersion: "" }],
  ["non-string permission version", { permissionVersion: true }],
  ["null permission version", { permissionVersion: null }],
  ["filled honeypot", { website: "https://spam.example" }],
  ["non-string honeypot", { website: false }],
  ["missing token", { turnstileToken: undefined }],
  ["blank token", { turnstileToken: " " }],
  ["oversized token", { turnstileToken: "x".repeat(2049) }],
]) {
  test(`rejects ${label} without verifying or sending`, async () => {
    const { handler, env, sent, verified } = harness();
    const result = await handler(request({ ...validSubmission, ...values }), env);
    assert.equal(result.status, 400);
    assert.equal((await result.json()).ok, false);
    assert.equal(sent.length, 0);
    assert.equal(verified.length, 0);
  });
}

for (const body of [null, [], "string", 42]) {
  test(`rejects non-object JSON ${JSON.stringify(body)}`, async () => {
    const { handler, env, sent, verified } = harness();
    assert.equal((await handler(request(body), env)).status, 400);
    assert.equal(sent.length, 0);
    assert.equal(verified.length, 0);
  });
}

test("rejects malformed JSON and unsupported content types", async () => {
  const { handler, env, sent, verified } = harness();
  assert.equal((await handler(request(undefined, { body: "{bad JSON" }), env)).status, 400);
  assert.equal((await handler(request(undefined, { headers: { Origin: ORIGIN, "Content-Type": "text/plain" } }), env)).status, 415);
  assert.equal(sent.length, 0);
  assert.equal(verified.length, 0);
});

test("rejects bodies exceeding 8KB even without Content-Length", async () => {
  const { handler, env, sent, verified } = harness();
  let cancelled = false;
  let chunk = 0;
  const body = new ReadableStream({
    pull(controller) {
      chunk += 1;
      controller.enqueue(new Uint8Array(4096).fill(32));
      if (chunk > 5) controller.close();
    },
    cancel() { cancelled = true; },
  });
  const result = await handler(request(undefined, { body, duplex: "half" }), env);
  assert.equal(result.status, 413);
  assert.equal(cancelled, true);
  assert.equal(sent.length, 0);
  assert.equal(verified.length, 0);
});

test("rejects oversized declared lengths before reading or sending", async () => {
  const { handler, env, sent, verified } = harness();
  const result = await handler(request(undefined, { headers: { Origin: ORIGIN, "Content-Type": "application/json", "Content-Length": "8193" } }), env);
  assert.equal(result.status, 413);
  assert.equal(sent.length, 0);
  assert.equal(verified.length, 0);
});

for (const origin of [undefined, "null", "https://attacker.example", `${ORIGIN}.attacker.example`, `${ORIGIN}/path`]) {
  test(`rejects unapproved origin ${origin}`, async () => {
    const { handler, env, sent, verified } = harness();
    const headers = { "Content-Type": "application/json" };
    if (origin !== undefined) headers.Origin = origin;
    const result = await handler(request(undefined, { headers }), env);
    assert.equal(result.status, 403);
    assert.equal(result.headers.has("Access-Control-Allow-Origin"), false);
    assert.equal(sent.length, 0);
    assert.equal(verified.length, 0);
  });
}

for (const overrides of [
  { TURNSTILE_SECRET_KEY: "" },
  { SENDER_EMAIL: "" },
  { SENDER_EMAIL: "invalid" },
  { CONSULTATION_EMAIL: undefined },
  { CONSULTATION_EMAIL: {} },
  { RECIPIENT_EMAIL: "invalid" },
  { ALLOWED_ORIGINS: "" },
  { ALLOWED_ORIGINS: "https://example.com/path" },
]) {
  test(`fails closed for missing or invalid ${Object.keys(overrides)[0]} configuration`, async () => {
    const { handler, env, sent, verified } = harness({ env: overrides });
    const result = await handler(request(), env);
    assert.equal(result.status, 503);
    assert.equal((await result.json()).ok, false);
    assert.equal(sent.length, 0);
    assert.equal(verified.length, 0);
  });
}

test("default Worker export fails closed without configuration", async () => {
  const result = await worker.fetch(request(), {});
  assert.equal(result.status, 503);
  assert.equal((await result.json()).ok, false);
});

for (const verification of [
  { success: false, "error-codes": ["timeout-or-duplicate"] },
  { success: true, hostname: "attacker.example", action: "consultation" },
  { success: true, hostname: new URL(ORIGIN).hostname, action: "another-action" },
  { success: true },
  null,
]) {
  test(`rejects unverified token result ${JSON.stringify(verification)}`, async () => {
    const { handler, env, sent } = harness({ verify: async () => Response.json(verification) });
    const result = await handler(request(), env);
    assert.equal(result.status, 400);
    assert.equal((await result.json()).ok, false);
    assert.equal(sent.length, 0);
  });
}

for (const [label, verify] of [
  ["network failure", async () => { throw new Error("private network details"); }],
  ["HTTP failure", async () => new Response("unavailable", { status: 502 })],
  ["malformed verification response", async () => new Response("not JSON")],
]) {
  test(`does not send on Turnstile ${label}`, async () => {
    const { handler, env, sent } = harness({ verify });
    const result = await handler(request(), env);
    assert.equal(result.status, 503);
    assert.doesNotMatch(await result.text(), /private network details|test-secret|Jane|jane@/);
    assert.equal(sent.length, 0);
  });
}

test("aborts a stalled Turnstile verification and never sends", async () => {
  let aborted = false;
  const { handler, env, sent } = harness({
    timeout: 5,
    verify: async (_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => {
        aborted = true;
        reject(new Error("aborted"));
      }, { once: true });
    }),
  });
  const result = await handler(request(), env);
  assert.equal(result.status, 503);
  assert.equal(aborted, true);
  assert.equal(sent.length, 0);
});

test("provider rejection returns a non-PII failure, never a successful request", async () => {
  const { handler, env, sent } = harness({ send: async () => { throw new Error("jane@example.com: rejected"); } });
  const result = await handler(request(), env);
  assert.equal(result.status, 503);
  assert.equal(sent.length, 1);
  const body = await result.json();
  assert.equal(body.ok, false);
  assert.doesNotMatch(body.error, /jane@|rejected/);
});

test("success waits for the email provider to accept the message", async () => {
  let release;
  let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  const delivery = new Promise((resolve) => { release = resolve; });
  const { handler, env } = harness({ send: async () => { entered(); return delivery; } });
  let completed = false;
  const pending = handler(request(), env).then((result) => { completed = true; return result; });
  await started;
  assert.equal(completed, false);
  release({ messageId: "accepted-id" });
  const result = await pending;
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
});

test("allows exact-origin JSON POST preflight, rejects other methods and headers", async () => {
  const { handler, env, sent, verified } = harness();
  const preflight = (method, headers = "content-type") => request(undefined, {
    method: "OPTIONS",
    body: undefined,
    headers: { Origin: ORIGIN, "Access-Control-Request-Method": method, "Access-Control-Request-Headers": headers },
  });
  const result = await handler(preflight("POST"), env);
  assert.equal(result.status, 204);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.equal(result.headers.get("Access-Control-Allow-Methods"), "POST");
  assert.equal((await handler(preflight("PUT"), env)).status, 403);
  assert.equal((await handler(preflight("POST", "authorization"), env)).status, 403);
  assert.equal(sent.length, 0);
  assert.equal(verified.length, 0);
});

test("rejects unrelated routes and non-POST methods", async () => {
  const { handler, env, sent, verified } = harness();
  assert.equal((await handler(new Request("https://consultation.example.workers.dev/"), env)).status, 404);
  const result = await handler(request(undefined, { method: "GET", body: undefined }), env);
  assert.equal(result.status, 405);
  assert.equal(result.headers.get("Allow"), "POST, OPTIONS");
  assert.equal(sent.length, 0);
  assert.equal(verified.length, 0);
});

test("supports comma-separated origins with a matching Turnstile hostname", async () => {
  const secondOrigin = "https://preview.example.com";
  const { handler, env, sent } = harness({
    env: { ALLOWED_ORIGINS: `${ORIGIN}, ${secondOrigin}` },
    verify: async () => Response.json({ success: true, hostname: "preview.example.com", action: "consultation" }),
  });
  const result = await handler(request(undefined, { headers: { Origin: secondOrigin, "Content-Type": "application/json" } }), env);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), secondOrigin);
  assert.equal(sent.length, 1);
});
