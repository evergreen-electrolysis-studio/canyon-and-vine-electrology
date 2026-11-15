import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const controller = await readFile(new URL("../public/consultation-form.js", import.meta.url), "utf8");

function eventTarget() {
  return {
    listeners: {}, handlers: new Map(),
    addEventListener(event, fn) {
      this.listeners[event] = fn;
      if (!this.handlers.has(event)) this.handlers.set(event, new Set());
      this.handlers.get(event).add(fn);
    },
    removeEventListener(event, fn) {
      this.handlers.get(event)?.delete(fn);
      if (this.listeners[event] === fn) delete this.listeners[event];
    },
    dispatch(event, details = {}) {
      return Promise.all([...this.handlers.get(event) ?? []].map(fn => fn(details)));
    },
  };
}

function pageFixture({ configured = true, modalSupported = true, theme } = {}) {
  const initial = { firstName: " Alex ", lastName: " Example ", phone: "(707) 555-0123", email: "", website: "", contactPreference: "", notes: "", permissionVersion: "2026-11-15" };
  const fields = Object.fromEntries(Object.entries(initial).map(([key, value]) => [key, {
    ...eventTarget(), value, customValidity: "",
    get validity() { return { valid: !this.customValidity && (key !== "email" || !this.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) }; },
    setCustomValidity(message) { this.customValidity = message; },
  }]));
  const checkbox = (value) => ({ ...eventTarget(), value, checked: false });
  const choices = { treatmentAreas: ["Chin & jawline", "Underarms", "Not sure yet"].map(checkbox), previousMethods: ["Tweezing", "Laser or IPL", "None"].map(checkbox) };
  const button = { disabled: true, textContent: "Request a consultation" };
  const emailOption = { disabled: true };
  const status = { textContent: "", focused: false, focus() { this.focused = true; } };
  const node = () => ({ ...eventTarget(), textContent: "", focused: false, focus() { this.focused = true; } });
  const dialogNodes = Object.fromEntries(["close", "home", "name", "title"].map((key) => [key, node()]));
  const dialog = { ...eventTarget(), open: false, querySelector: (selector) => dialogNodes[selector.match(/data-success-(\w+)/)[1]], close() { this.open = false; this.dispatch("close"); } };
  if (modalSupported) dialog.showModal = () => { dialog.open = true; };
  const top = { focused: false, scrolled: false, setAttribute() {}, focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; } };
  const widgetContainer = {};
  const form = {
    ...eventTarget(), isConnected: false,
    dataset: configured ? { endpoint: "https://requests.example.test/request", siteKey: "public-test-key", theme } : {},
    fields, choices,
    parentElement: { querySelector: () => dialog },
    elements: { namedItem: (name) => fields[name] },
    querySelector: (selector) => selector.includes("button") ? button : selector.includes("status") ? status : selector.includes("email-preference") ? emailOption : widgetContainer,
    querySelectorAll: (selector) => choices[selector.match(/name="([^\"]+)"/)[1]] ?? [],
    reportValidity: () => Boolean(fields.firstName.value && fields.lastName.value && fields.phone.validity.valid && fields.email.validity.valid),
    reset: () => { Object.entries(fields).forEach(([key, field]) => { field.value = key === "permissionVersion" ? initial.permissionVersion : ""; }); Object.values(choices).flat().forEach((choice) => { choice.checked = false; }); },
  };
  return { form, fields, choices, button, emailOption, status, dialog, dialogNodes, top, get widgetOptions() { return widgetContainer.options; }, submit: () => form.dispatch("submit", { preventDefault() {} }) };
}

function fixture({ configured = true, modalSupported = true, theme, initiallyMounted = true, apiReady = true, response = { ok: true, json: async () => ({ ok: true }) } } = {}) {
  const page = pageFixture({ configured, modalSupported, theme });
  let current = initiallyMounted ? page : null;
  page.form.isConnected = initiallyMounted;
  const calls = [], observers = [], scripts = [], removedWidgets = [];
  let resetCount = 0, renderCount = 0;
  const turnstile = {
    render: (container, options) => { container.options = options; return `widget-${++renderCount}`; },
    reset: () => { resetCount++; },
    remove: (widget) => { removedWidgets.push(widget); },
  };
  const window = { matchMedia: () => ({ matches: false }), ...(apiReady ? { turnstile } : {}) };
  const context = vm.createContext({
    window,
    document: {
      readyState: "complete", body: {}, getElementById: () => current?.top,
      querySelectorAll: () => current ? [current.form] : [],
      createElement: () => ({}), head: { append: (script) => scripts.push(script) },
    },
    MutationObserver: class { constructor(callback) { observers.push(callback); } observe() {} },
    FormData: class {
      constructor(form) { this.values = Object.fromEntries(Object.entries(form.fields).map(([key, field]) => [key, field.value])); this.multiple = Object.fromEntries(Object.entries(form.choices).map(([key, options]) => [key, options.filter((option) => option.checked).map((option) => option.value)])); }
      get(name) { return this.values[name]; }
      getAll(name) { return this.multiple[name] ?? []; }
    },
    AbortSignal, fetch: async (url, options) => { calls.push({ url, ...options }); if (response instanceof Error) throw response; return response; },
  });
  const runController = () => vm.runInContext(controller, context);
  const mutate = () => observers.forEach(callback => callback());
  const navigate = (next = pageFixture({ configured, modalSupported })) => {
    if (current) current.form.isConnected = false;
    current = next;
    if (current) current.form.isConnected = true;
    mutate();
    return next;
  };
  runController();
  return { ...page, get widgetOptions() { return page.widgetOptions; }, calls, scripts, removedWidgets, runController, mutate, navigate,
    get observerCount() { return observers.length; }, get renderCount() { return renderCount; }, get resetCount() { return resetCount; },
    finishLoadingApi() { window.turnstile = turnstile; window.evergreenTurnstileReady(); },
  };
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

test("the security widget follows the form theme and safely defaults to dark", () => {
  for (const theme of [undefined, "dark", "light", "invalid"]) {
    const f = fixture({ theme });
    assert.equal(f.widgetOptions.theme, theme === "light" ? "light" : "dark");
  }
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

test("initializes a form inserted after the gallery and follows subsequent route changes", async () => {
  const f = fixture({ initiallyMounted: false });
  assert.equal(f.renderCount, 0);
  const first = f.navigate();
  assert.equal(f.renderCount, 1);
  first.widgetOptions.callback("first-token");
  await first.submit();
  assert.equal(first.dialog.open, true);
  const second = f.navigate();
  assert.equal(first.dialog.open, false);
  assert.equal(first.form.handlers.get("submit").size, 0);
  assert.deepEqual(f.removedWidgets, ["widget-1"]);
  assert.equal(f.renderCount, 2);
  second.fields.firstName.value = "Second";
  second.widgetOptions.callback("second-token");
  await second.submit();
  assert.equal(f.calls.length, 2);
  assert.equal(second.dialog.open, true);
  assert.equal(second.dialogNodes.name.textContent, "Second");
  assert.equal(first.dialogNodes.name.textContent, "Alex");
  assert.equal(JSON.parse(f.calls[1].body).turnstileToken, "second-token");
});

test("repeated script execution and DOM changes do not duplicate widgets or listeners", async () => {
  const f = fixture();
  f.runController(); f.mutate(); f.mutate();
  assert.equal(f.observerCount, 1);
  assert.equal(f.renderCount, 1);
  assert.equal(f.form.handlers.get("submit").size, 1);
  assert.equal(f.dialogNodes.close.handlers.get("click").size, 1);
  f.widgetOptions.callback("token");
  await f.submit();
  assert.equal(f.calls.length, 1);
});

test("navigation while Turnstile loads renders only the current form and loads its API once", async () => {
  const f = fixture({ apiReady: false });
  const second = f.navigate();
  f.runController();
  assert.equal(f.scripts.length, 1);
  f.finishLoadingApi();
  assert.equal(f.renderCount, 1);
  assert.equal(f.widgetOptions, undefined);
  second.widgetOptions.callback("current-token");
  await second.submit();
  assert.equal(f.calls.length, 1);
  assert.equal(second.dialog.open, true);
  assert.equal(f.dialog.open, false);
});

test("a response from a removed form cannot open its modal or reset the new widget", async () => {
  let resolveResponse;
  const f = fixture({ response: new Promise(resolve => { resolveResponse = resolve; }) });
  f.widgetOptions.callback("token");
  const pending = f.submit();
  const second = f.navigate();
  resolveResponse({ ok: true, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(f.dialog.open, false);
  assert.equal(second.dialog.open, false);
  assert.equal(second.status.focused, false);
  assert.equal(f.resetCount, 0);
  assert.equal(f.calls.length, 1);
});
