import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const controller = await readFile(new URL("../public/consultation-form.js", import.meta.url), "utf8");

function fixture({ configured = true, response = { ok: true, json: async () => ({ ok: true }) } } = {}) {
  const fields = Object.fromEntries(Object.entries({ firstName: " Alex ", lastName: " Example ", phone: "(707) 555-0123", email: "", website: "" }).map(([key, value]) => [key, {
    value, validity: "", listeners: {},
    addEventListener(event, fn) { this.listeners[event] = fn; },
    setCustomValidity(message) { this.validity = message; },
  }]));
  const button = { disabled: true, textContent: "Request a consultation" };
  const status = { textContent: "", focused: false, focus() { this.focused = true; } };
  const calls = [];
  let submit;
  let widgetOptions;
  let resetCount = 0;
  const form = {
    dataset: configured ? { endpoint: "https://requests.example.test/request", siteKey: "public-test-key" } : {},
    elements: { namedItem: (name) => fields[name] },
    querySelector: (selector) => selector.includes("button") ? button : selector.includes("status") ? status : {},
    addEventListener: (event, fn) => { if (event === "submit") submit = fn; },
    reportValidity: () => Boolean(fields.firstName.value && fields.lastName.value && !fields.phone.validity),
    reset: () => Object.values(fields).forEach((field) => { field.value = ""; }),
  };
  const window = { turnstile: {
    render: (_, options) => { widgetOptions = options; return "widget"; },
    reset: () => { resetCount++; },
  } };
  vm.runInNewContext(controller, {
    window, document: { readyState: "complete", querySelector: () => form },
    FormData: class { get(name) { return fields[name].value; } },
    AbortSignal, fetch: async (url, options) => { calls.push({ url, ...options }); if (response instanceof Error) throw response; return response; },
  });
  return { fields, button, status, calls, get widgetOptions() { return widgetOptions; }, get resetCount() { return resetCount; }, submit: () => submit({ preventDefault() {} }) };
}

test("exported form requires names and phone, leaves email optional, and loads its controller", async () => {
  const html = await readFile(new URL("../github-pages/index.html", import.meta.url), "utf8");
  for (const name of ["firstName", "lastName", "phone"]) {
    const input = html.match(new RegExp(`<input[^>]*name="${name}"[^>]*>`))[0];
    assert.match(input, /\brequired(?:=|\s|\/?>)/);
  }
  const email = html.match(/<input[^>]*name="email"[^>]*>/)[0];
  assert.match(email, /type="email"/);
  assert.doesNotMatch(email, /required/);
  assert.match(html, /US \+1/);
  assert.match(html, /autoComplete="tel-national"/i);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.doesNotMatch(html, /mailto:hello@example.com/);
  assert.equal(await readFile(new URL("../github-pages/consultation-form.js", import.meta.url), "utf8"), controller);
});

test("sends normalized full US phone and optional empty email after the security check", async () => {
  const f = fixture();
  assert.equal(f.button.disabled, true);
  f.widgetOptions.callback("valid-token");
  assert.equal(f.button.disabled, false);
  await f.submit();
  assert.equal(f.calls.length, 1);
  assert.deepEqual(JSON.parse(f.calls[0].body), { firstName: "Alex", lastName: "Example", phone: "+17075550123", email: "", website: "", turnstileToken: "valid-token" });
  assert.match(f.status.textContent, /request has been sent/);
  assert.equal(f.fields.phone.value, "");
  assert.equal(f.status.focused, true);
  f.widgetOptions["expired-callback"]();
  assert.match(f.status.textContent, /request has been sent/);
  await f.submit();
  assert.equal(f.calls.length, 1, "a successful form cannot submit twice");
});

test("blocks missing names, incomplete phones, and absent security tokens", async () => {
  for (const [name, value] of [["firstName", "  "], ["lastName", ""], ["phone", "555-0123"], ["phone", "+44 7700 900123"]]) {
    const f = fixture(); f.widgetOptions.callback("valid-token"); f.fields[name].value = value;
    await f.submit(); assert.equal(f.calls.length, 0, name);
  }
  const f = fixture(); await f.submit(); assert.equal(f.calls.length, 0);
  assert.match(f.status.textContent, /security check/);
});

test("retains details and requires a fresh security check after network or delivery errors", async () => {
  for (const response of [new Error("offline"), { ok: false, json: async () => ({ ok: false }) }, { ok: true, json: async () => ({ ok: false }) }]) {
    const f = fixture({ response }); f.widgetOptions.callback("valid-token");
    await f.submit();
    assert.match(f.status.textContent, /couldn’t confirm delivery/);
    assert.equal(f.fields.phone.value, "(707) 555-0123");
    assert.equal(f.resetCount, 1);
    assert.equal(f.button.disabled, true);
    await f.submit(); assert.equal(f.calls.length, 1);
  }
});

test("unconfigured form stays disabled without loading a security widget", () => {
  const f = fixture({ configured: false });
  assert.equal(f.button.disabled, true);
  assert.equal(f.widgetOptions, undefined);
});
