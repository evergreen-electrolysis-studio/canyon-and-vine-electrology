import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const controller = await readFile(new URL("../public/consultation-form.js", import.meta.url), "utf8");

function fixture({ configured = true, modalSupported = true, response = { ok: true, json: async () => ({ ok: true }) } } = {}) {
  const initial = { firstName: " Alex ", lastName: " Example ", phone: "(707) 555-0123", email: "", website: "", contactPreference: "", notes: "", permissionVersion: "2026-11-15" };
  const fields = Object.fromEntries(Object.entries(initial).map(([key, value]) => [key, {
    value, customValidity: "", listeners: {},
    get validity() { return { valid: !this.customValidity && (key !== "email" || !this.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) }; },
    addEventListener(event, fn) { this.listeners[event] = fn; },
    setCustomValidity(message) { this.customValidity = message; },
  }]));
  const checkbox = (value) => ({ value, checked: false, listeners: {}, addEventListener(event, fn) { this.listeners[event] = fn; } });
  const choices = { treatmentAreas: ["Chin & jawline", "Underarms", "Not sure yet"].map(checkbox), previousMethods: ["Tweezing", "Laser or IPL", "None"].map(checkbox) };
  const button = { disabled: true, textContent: "Request a consultation" };
  const emailOption = { disabled: true };
  const status = { textContent: "", focused: false, focus() { this.focused = true; } };
  const node = () => ({ textContent: "", focused: false, listeners: {}, focus() { this.focused = true; }, addEventListener(event, fn) { this.listeners[event] = fn; } });
  const dialogNodes = Object.fromEntries(["close", "home", "name", "title"].map((key) => [key, node()]));
  const dialog = { open: false, listeners: {}, querySelector: (selector) => dialogNodes[selector.match(/data-success-(\w+)/)[1]], addEventListener(event, fn) { this.listeners[event] = fn; }, close() { this.open = false; this.listeners.close?.(); } };
  if (modalSupported) dialog.showModal = () => { dialog.open = true; };
  const top = { focused: false, scrolled: false, setAttribute() {}, focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; } };
  const calls = [];
  let submit;
  let widgetOptions;
  let resetCount = 0;
  const form = {
    dataset: configured ? { endpoint: "https://requests.example.test/request", siteKey: "public-test-key" } : {},
    elements: { namedItem: (name) => fields[name] },
    querySelector: (selector) => selector.includes("button") ? button : selector.includes("status") ? status : selector.includes("email-preference") ? emailOption : {},
    querySelectorAll: (selector) => choices[selector.match(/name="([^"]+)"/)[1]] ?? [],
    addEventListener: (event, fn) => { if (event === "submit") submit = fn; },
    reportValidity: () => Boolean(fields.firstName.value && fields.lastName.value && fields.phone.validity.valid && fields.email.validity.valid),
    reset: () => { Object.entries(fields).forEach(([key, field]) => { field.value = key === "permissionVersion" ? initial.permissionVersion : ""; }); Object.values(choices).flat().forEach((choice) => { choice.checked = false; }); },
  };
  const window = { matchMedia: () => ({ matches: false }), turnstile: {
    render: (_, options) => { widgetOptions = options; return "widget"; },
    reset: () => { resetCount++; },
  } };
  vm.runInNewContext(controller, {
    window, document: { readyState: "complete", getElementById: () => top, querySelector: (selector) => selector.includes("success-dialog") ? dialog : form },
    FormData: class {
      constructor() { this.values = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value])); this.multiple = Object.fromEntries(Object.entries(choices).map(([key, options]) => [key, options.filter((option) => option.checked).map((option) => option.value)])); }
      get(name) { return this.values[name]; }
      getAll(name) { return this.multiple[name] ?? []; }
    },
    AbortSignal, fetch: async (url, options) => { calls.push({ url, ...options }); if (response instanceof Error) throw response; return response; },
  });
  return { fields, choices, button, emailOption, status, dialog, dialogNodes, top, calls, get widgetOptions() { return widgetOptions; }, get resetCount() { return resetCount; }, submit: () => submit({ preventDefault() {} }) };
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
  for (const name of ["treatmentAreas", "previousMethods", "contactPreference", "notes"]) {
    const inputs = [...html.matchAll(new RegExp(`<(?:input|select|textarea)[^>]*name="${name}"[^>]*>`, "g"))];
    assert.ok(inputs.length > 0, `${name} is rendered`);
    for (const [input] of inputs) assert.doesNotMatch(input, /\brequired(?:=|\s|\/?>)/);
  }
  assert.match(html, /<textarea[^>]*maxLength="500"/i);
  assert.match(html, /<dialog[^>]*aria-labelledby="consultation-success-title"[^>]*aria-describedby="consultation-success-body"/);
  assert.match(html, /aria-label="Close confirmation"/);
  assert.match(html, /By submitting, you agree that Evergreen Electrolysis may contact you/);
  assert.match(html, /How we use your information/);
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
  assert.deepEqual(JSON.parse(f.calls[0].body), { firstName: "Alex", lastName: "Example", phone: "+17075550123", email: "", website: "", turnstileToken: "valid-token", treatmentAreas: [], previousMethods: [], contactPreference: "", notes: "", permissionVersion: "2026-11-15" });
  assert.match(f.status.textContent, /request has been sent/);
  assert.equal(f.fields.phone.value, "");
  assert.equal(f.dialog.open, true);
  assert.equal(f.dialogNodes.name.textContent, "Alex");
  assert.equal(f.dialogNodes.title.focused, true);
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
    assert.equal(f.dialog.open, false);
    assert.equal(f.status.focused, true);
    assert.equal(f.button.disabled, true);
    await f.submit(); assert.equal(f.calls.length, 1);
  }
});

test("unconfigured form stays disabled without loading a security widget", () => {
  const f = fixture({ configured: false });
  assert.equal(f.button.disabled, true);
  assert.equal(f.widgetOptions, undefined);
});


test("includes optional context and the contact-notice version in the actual request", async () => {
  const f = fixture();
  f.fields.email.value = "client@example.com";
  f.fields.email.listeners.input();
  assert.equal(f.emailOption.disabled, false);
  f.fields.contactPreference.value = "Email";
  f.fields.notes.value = "  I have a question about the first visit.  ";
  f.choices.treatmentAreas[0].checked = true;
  f.choices.treatmentAreas[1].checked = true;
  f.choices.previousMethods[0].checked = true;
  f.widgetOptions.callback("token"); await f.submit();
  const payload = JSON.parse(f.calls[0].body);
  assert.deepEqual(payload.treatmentAreas, ["Chin & jawline", "Underarms"]);
  assert.deepEqual(payload.previousMethods, ["Tweezing"]);
  assert.equal(payload.contactPreference, "Email");
  assert.equal(payload.notes, "I have a question about the first visit.");
  assert.equal(payload.permissionVersion, "2026-11-15");
});

test("keeps email optional while preventing an email-only preference without an address", async () => {
  const f = fixture();
  assert.equal(f.emailOption.disabled, true);
  f.fields.email.value = "client@example.com"; f.fields.email.listeners.input();
  f.fields.contactPreference.value = "Email";
  f.fields.email.value = ""; f.fields.email.listeners.input();
  assert.equal(f.emailOption.disabled, true);
  assert.equal(f.fields.contactPreference.value, "");
  f.fields.contactPreference.value = "Email";
  f.widgetOptions.callback("token"); await f.submit();
  assert.equal(f.calls.length, 0);
  assert.match(f.fields.email.customValidity, /email address/);
});

test("none and unsure choices cannot coexist with specific selections", () => {
  const f = fixture();
  for (const options of Object.values(f.choices)) {
    options[0].checked = true;
    options[2].checked = true; options[2].listeners.change();
    assert.equal(options[0].checked, false);
    options[1].checked = true; options[1].listeners.change();
    assert.equal(options[2].checked, false);
  }
});

test("success can be dismissed or returned home without another submission", async () => {
  const f = fixture(); f.widgetOptions.callback("token"); await f.submit();
  f.dialogNodes.close.listeners.click();
  assert.equal(f.dialog.open, false); assert.equal(f.status.focused, true);
  f.dialog.open = true;
  let prevented = false;
  f.dialogNodes.home.listeners.click({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(f.dialog.open, false);
  assert.equal(f.top.focused, true); assert.equal(f.top.scrolled, true);
  assert.equal(f.calls.length, 1);
});

test("a browser without modal support retains a visible success confirmation", async () => {
  const f = fixture({ modalSupported: false }); f.widgetOptions.callback("token"); await f.submit();
  assert.match(f.status.textContent, /request has been sent/);
  assert.equal(f.status.focused, true);
  assert.equal(f.dialog.open, false);
});
