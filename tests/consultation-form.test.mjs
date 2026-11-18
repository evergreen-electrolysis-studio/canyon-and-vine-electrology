import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const controller = await readFile(new URL("../public/consultation-form.js", import.meta.url), "utf8");

function eventTarget() {
  return {
    listeners: {}, handlers: new Map(),
    attributes: {}, disabled: false,
    setAttribute(name, value) { this.attributes[name] = String(value); },
    removeAttribute(name) { delete this.attributes[name]; },
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

function pageFixture({ configured = true, modalSupported = true, theme, requestType, submitLabel } = {}) {
  const initial = { firstName: " Alex ", lastName: " Example ", phone: "(707) 555-0123", email: "", website: "", contactPreference: "", notes: "", permissionVersion: "2026-11-15" };
  const fields = Object.fromEntries(Object.entries(initial).map(([key, value]) => [key, {
    ...eventTarget(), value, customValidity: "", selectionStart: value.length, selectionEnd: value.length,
    setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; },
    get validity() { return { valid: !this.customValidity && (key !== "email" || !this.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) }; },
    setCustomValidity(message) { this.customValidity = message; },
  }]));
  const checkbox = (value) => ({ ...eventTarget(), value, checked: false });
  const choices = { treatmentAreas: ["Chin & jawline", "Underarms", "Not sure yet"].map(checkbox), previousMethods: ["Tweezing", "Laser or IPL", "None"].map(checkbox) };
  const button = { disabled: true, textContent: "Request a consultation" };
  const emailOption = { disabled: true };
  const status = { textContent: "", focused: false, focus() { this.focused = true; } };
  const phoneError = { textContent: "", hidden: true };
  const securityStatus = { textContent: "" };
  const node = () => ({ ...eventTarget(), textContent: "", focused: false, focus() { this.focused = true; } });
  const dialogNodes = Object.fromEntries(["close", "home", "name", "title"].map((key) => [key, node()]));
  const dialog = { ...eventTarget(), open: false, querySelector: (selector) => dialogNodes[selector.match(/data-success-(\w+)/)[1]], close() { this.open = false; this.dispatch("close"); } };
  if (modalSupported) dialog.showModal = () => { dialog.open = true; };
  const top = { focused: false, scrolled: false, setAttribute() {}, focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; } };
  const widgetContainer = {};
  const form = {
    ...eventTarget(), isConnected: false,
    dataset: configured ? { endpoint: "https://requests.example.test/request", siteKey: "public-test-key", theme, requestType, submitLabel } : {},
    fields, choices,
    parentElement: { querySelector: () => dialog },
    elements: { namedItem: (name) => fields[name] },
    querySelector: (selector) => selector.includes("button") ? button : selector.includes("phone-error") ? phoneError : selector.includes("security-status") ? securityStatus : selector.includes("status") ? status : selector.includes("email-preference") ? emailOption : widgetContainer,
    querySelectorAll: (selector) => selector === "input, select, textarea" ? [...Object.values(fields), ...Object.values(choices).flat()] : choices[selector.match(/name="([^\"]+)"/)[1]] ?? [],
    reportValidity: () => Boolean(fields.firstName.value && fields.lastName.value && fields.phone.validity.valid && fields.email.validity.valid),
    reset: () => { Object.entries(fields).forEach(([key, field]) => { field.value = key === "permissionVersion" ? initial.permissionVersion : ""; }); Object.values(choices).flat().forEach((choice) => { choice.checked = false; }); },
  };
  return { form, fields, choices, button, emailOption, status, phoneError, securityStatus, dialog, dialogNodes, top, get widgetOptions() { return widgetContainer.options; }, submit: () => form.dispatch("submit", { preventDefault() {} }) };
}

function fixture({ configured = true, modalSupported = true, theme, requestType, submitLabel, initiallyMounted = true, apiReady = true, response = { ok: true, json: async () => ({ ok: true }) } } = {}) {
  const page = pageFixture({ configured, modalSupported, theme, requestType, submitLabel });
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
      constructor(form) { this.values = Object.fromEntries(Object.entries(form.fields).filter(([, field]) => !field.disabled).map(([key, field]) => [key, field.value])); this.multiple = Object.fromEntries(Object.entries(form.choices).map(([key, options]) => [key, options.filter((option) => option.checked && !option.disabled).map((option) => option.value)])); }
      get(name) { return this.values[name]; }
      getAll(name) { return this.multiple[name] ?? []; }
    },
    crypto, AbortSignal, fetch: async (url, options) => { calls.push({ url, ...options }); if (response instanceof Error) throw response; return response; },
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
  const { submissionId, startedAt, ...payload } = JSON.parse(f.calls[0].body);
  assert.match(submissionId, /^[0-9a-f-]{36}$/);
  assert(Number.isSafeInteger(startedAt));
  assert.deepEqual(payload, { firstName: "Alex", lastName: "Example", phone: "+17075550123", email: "", website: "", turnstileToken: "valid-token", treatmentAreas: [], previousMethods: [], contactPreference: "", notes: "", permissionVersion: "2026-11-15" });
  assert.match(f.status.textContent, /request has been sent/);
  assert.equal(f.fields.phone.value, "(707) 555-0123");
  assert.equal(f.fields.phone.disabled, true);
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

test("uncertain delivery retries the same attempt and changed details get a new attempt", async () => {
  const f = fixture({ response: new Error("Connection closed after acceptance") });
  f.widgetOptions.callback("first-token");
  await f.submit();
  const first = JSON.parse(f.calls[0].body);
  f.widgetOptions.callback("fresh-token");
  await f.submit();
  const retry = JSON.parse(f.calls[1].body);
  assert.equal(retry.submissionId, first.submissionId);
  assert.equal(retry.startedAt, first.startedAt);
  assert.notEqual(retry.turnstileToken, first.turnstileToken);
  assert.match(f.status.textContent, /couldn’t confirm delivery/);
  f.fields.notes.value = "Please call after 3 pm.";
  f.widgetOptions.callback("third-token");
  await f.submit();
  assert.notEqual(JSON.parse(f.calls[2].body).submissionId, first.submissionId);
});

test("formats phone digits during typing, before blur", async () => {
  const f = fixture();
  f.fields.phone.value = "";
  for (const digit of "7075550123") {
    f.fields.phone.value += digit;
    f.fields.phone.selectionStart = f.fields.phone.value.length;
    await f.fields.phone.dispatch("input", { inputType: "insertText" });
  }
  assert.equal(f.fields.phone.value, "(707) 555-0123");
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


test("phone formatting handles country-code paste, middle edits, separators, and full deletion", async () => {
  const f = fixture(), phone = f.fields.phone;
  phone.value = "+1 707 555 0123"; phone.selectionStart = phone.value.length;
  await phone.dispatch("input", { inputType: "insertFromPaste" });
  assert.equal(phone.value, "(707) 555-0123");
  assert.equal(phone.selectionStart, 14);
  phone.value = "(707) 655-0123"; phone.selectionStart = 7;
  await phone.dispatch("input", { inputType: "insertText" });
  assert.equal(phone.value, "(707) 655-0123");
  assert.equal(phone.selectionStart, 7, "middle edits do not jump to the end");
  phone.setSelectionRange(6, 6);
  let prevented = false;
  await phone.dispatch("beforeinput", { inputType: "deleteContentBackward", preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(phone.value, "(706) 550-123");
  assert.equal(phone.selectionStart, 3);
  phone.value = ""; phone.selectionStart = 0;
  await phone.dispatch("input", { inputType: "deleteContentBackward" });
  assert.equal(phone.value, "");
  for (const invalid of ["70755501234", "+44 7700 900123", "7075550123 ext 2"]) {
    phone.value = invalid; phone.selectionStart = invalid.length;
    await phone.dispatch("input", { inputType: "insertFromPaste" });
    assert.equal(phone.value, "", "reject the whole paste without silently trimming it into a different number");
    assert.equal(f.phoneError.hidden, false);
    f.widgetOptions.callback("token"); await f.submit();
    assert.equal(f.calls.length, 0);
  }
});

test("rejects extra digits at the end or middle and keeps validation through security success", async () => {
  for (const cursor of [14, 7]) {
    const f = fixture(), phone = f.fields.phone;
    phone.setSelectionRange(cursor, cursor);
    let prevented = false;
    await phone.dispatch("beforeinput", { inputType: "insertText", data: "4", preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(phone.value, "(707) 555-0123");
    assert.equal(phone.selectionStart, cursor);
    assert.equal(phone.attributes["aria-invalid"], "true");
    assert.match(f.phoneError.textContent, /10|extra/i);
    f.widgetOptions.callback("token");
    await f.submit();
    const validation = f.status.textContent;
    assert.match(validation, /not been sent/);
    f.widgetOptions.callback("new-token");
    assert.equal(f.status.textContent, validation);
    assert.equal(f.calls.length, 0);
    assert.equal(f.dialog.open, false);
    phone.value = "7075550123"; phone.selectionStart = 10;
    await phone.dispatch("input", { inputType: "insertReplacementText" });
    assert.equal(f.phoneError.hidden, true);
    assert.equal(phone.attributes["aria-invalid"], undefined);
    await f.submit();
    assert.equal(f.calls.length, 1, "a deliberate valid edit allows submission");
  }
});

test("replacement and +1 paste are accepted, but excess paste never submits the previous number", async () => {
  const f = fixture(), phone = f.fields.phone;
  phone.setSelectionRange(6, 7);
  let prevented = false;
  await phone.dispatch("beforeinput", { inputType: "insertText", data: "6", preventDefault() { prevented = true; } });
  assert.equal(prevented, false);
  phone.value = "(707) 655-0123"; phone.selectionStart = 7;
  await phone.dispatch("input");
  phone.setSelectionRange(0, phone.value.length);
  await phone.dispatch("paste", { clipboardData: { getData: () => "+1 (707) 555-0123" }, preventDefault() { prevented = true; } });
  assert.equal(prevented, false);
  phone.value = "+1 (707) 555-0123"; phone.selectionStart = phone.value.length;
  await phone.dispatch("input", { inputType: "insertFromPaste" });
  assert.equal(phone.value, "(707) 555-0123");
  for (const copied of [" +1 (707) 555-0123 ", "7075550123\n"]) {
    phone.setSelectionRange(0, phone.value.length); prevented = false;
    await phone.dispatch("paste", { clipboardData: { getData: () => copied }, preventDefault() { prevented = true; } });
    assert.equal(prevented, false, "outer clipboard whitespace should not reject a valid number");
    phone.value = copied; phone.selectionStart = copied.length;
    await phone.dispatch("input", { inputType: "insertFromPaste" });
    assert.equal(phone.value, "(707) 555-0123");
  }
  for (const invalid of ["70755501234567890123456789", "+44 7700 900123", "7075550123 ext 2"]) {
    phone.setSelectionRange(0, phone.value.length); prevented = false;
    await phone.dispatch("paste", { clipboardData: { getData: () => invalid }, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(phone.value, "(707) 555-0123");
    f.widgetOptions.callback("token"); await f.submit();
    assert.equal(f.calls.length, 0);
    assert.equal(f.dialog.open, false);
  }
});

test("native validation has persistent feedback and incorrect ten-digit numbers get a useful error", async () => {
  const f = fixture();
  f.fields.firstName.value = "";
  await f.form.dispatch("invalid", { target: f.fields.firstName });
  assert.equal(f.fields.firstName.attributes["aria-invalid"], "true");
  assert.match(f.status.textContent, /not been sent/);
  f.widgetOptions.callback("token");
  assert.match(f.status.textContent, /not been sent/);
  f.fields.firstName.value = "Alex";
  await f.fields.firstName.dispatch("input");
  assert.equal(f.fields.firstName.attributes["aria-invalid"], undefined);
  f.fields.phone.value = "(707) 055-0123";
  await f.submit();
  assert.match(f.phoneError.textContent, /valid US phone number/);
  assert.equal(f.calls.length, 0);
});

test("locks fields while sending, retains the original payload, and restores editing only on failure", async () => {
  for (const ok of [true, false]) {
    let resolveResponse;
    const f = fixture({ response: new Promise(resolve => { resolveResponse = resolve; }) });
    f.widgetOptions.callback("token");
    const pending = f.submit();
    assert.equal(f.fields.phone.disabled, true);
    assert.equal(f.fields.firstName.disabled, true);
    assert.equal(f.choices.treatmentAreas[0].disabled, true);
    assert.equal(f.form.attributes["aria-busy"], "true");
    await f.submit();
    assert.equal(f.calls.length, 1);
    assert.equal(JSON.parse(f.calls[0].body).phone, "+17075550123");
    resolveResponse({ ok, json: async () => ({ ok }) }); await pending;
    assert.equal(f.fields.phone.disabled, ok);
    assert.equal(f.fields.phone.value, "(707) 555-0123");
    assert.equal(f.form.attributes["aria-busy"], "false");
    assert.equal(f.dialog.open, ok);
  }
});

test("interest-list submission sends its explicit intent and shows the matching success", async () => {
  const f = fixture({ requestType: "interest" });
  f.fields.permissionVersion.value = "interest-2026-11-17";
  assert.equal(f.widgetOptions.action, "interest_list");
  f.widgetOptions.callback("token"); await f.submit();
  const payload = JSON.parse(f.calls[0].body);
  assert.equal(payload.requestType, "interest");
  assert.equal(payload.permissionVersion, "interest-2026-11-17");
  assert.match(f.status.textContent, /on the interest list/);
  assert.doesNotMatch(f.status.textContent, /consultation request/);
  assert.equal(f.button.textContent, "You’re on the list");
  assert.equal(f.dialog.open, true);
});

test("failed interest-list delivery retains details and restores the correct action", async () => {
  const f = fixture({ requestType: "interest", response: new Error("offline") });
  f.widgetOptions.callback("token"); await f.submit();
  assert.equal(f.button.textContent, "Join interest list");
  assert.equal(f.fields.phone.value, "(707) 555-0123");
  assert.equal(f.dialog.open, false);
});


test("custom submit wording stays consistent through verification and retry", async () => {
  const label = "Join the interest list";
  const f = fixture({ requestType: "interest", submitLabel: label, response: new Error("offline") });
  f.widgetOptions.callback("token");
  assert.ok(f.securityStatus.textContent.includes(label));
  await f.submit();
  assert.equal(f.button.textContent, label);
  assert.equal(f.fields.phone.disabled, false);
  assert.equal(f.dialog.open, false);
  f.widgetOptions.callback("retry-token");
  assert.ok(f.securityStatus.textContent.includes(label));
});
