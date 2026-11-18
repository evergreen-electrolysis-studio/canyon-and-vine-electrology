/* The static Pages export and Sites use the same small form controller. */
(() => {
  // Sites can replace the page without reloading this script. Keep one observer
  // and one set of listeners per mounted form across those route transitions.
  if (window.evergreenConsultationController) {
    window.evergreenConsultationController.refresh();
    return;
  }
  const forms = new Map();
  const waitingWidgets = new Map();
  let loadingTurnstile = false;
  let turnstileFailed = false;

  function loadWidget(render, fail) {
    if (window.turnstile) { render(); return; }
    if (turnstileFailed) { fail(); return; }
    waitingWidgets.set(render, fail);
    if (loadingTurnstile) return;
    loadingTurnstile = true;
    window.evergreenTurnstileReady = () => {
      for (const ready of waitingWidgets.keys()) ready();
      waitingWidgets.clear();
    };
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=evergreenTurnstileReady&render=explicit";
    script.async = true;
    script.onerror = () => {
      turnstileFailed = true;
      for (const failed of waitingWidgets.values()) failed();
      waitingWidgets.clear();
    };
    document.head.append(script);
  }

  function initialize(form) {
    form.dataset.initialized = "true";
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector("[data-form-status]");
    const securityStatus = form.querySelector("[data-security-status]");
    const phoneError = form.querySelector("[data-phone-error]");
    const phone = form.elements.namedItem("phone");
    const email = form.elements.namedItem("email");
    const contactPreference = form.elements.namedItem("contactPreference");
    const emailPreference = form.querySelector("[data-email-preference]");
    const dialog = form.parentElement.querySelector("[data-success-dialog]");
    const endpoint = form.dataset.endpoint;
    const siteKey = form.dataset.siteKey;
    const interest = form.dataset.requestType === "interest";
    const actionLabel = form.dataset.submitLabel || (interest ? "Join interest list" : "Request a consultation");
    let token = "";
    let widget;
    let pending = false;
    let sent = false;
    let returningHome = false;
    let active = true;
    let deliveryAttempt = null;
    const listeners = [];
    const listen = (element, event, handler, options) => {
      element.addEventListener(event, handler, options);
      listeners.push(() => element.removeEventListener(event, handler, options));
    };
    const message = (text) => { status.textContent = text; };
    const securityMessage = (text) => { (securityStatus || status).textContent = text; };
    const validationMessage = () => message("Please check the highlighted fields. Your details have not been sent.");
    const controls = [...form.querySelectorAll("input, select, textarea")];
    const disabledBefore = new Map(controls.map(control => [control, control.disabled]));
    function lockFields(locked) {
      for (const control of controls) control.disabled = locked || disabledBefore.get(control);
    }
    if (endpoint && siteKey) message("");
    for (const control of controls) listen(control, "input", () => control.removeAttribute("aria-invalid"));
    listen(form, "invalid", (event) => {
      event.target.setAttribute("aria-invalid", "true");
      if (event.target === phone) setPhoneError(phoneInputError || phoneValidationError());
      validationMessage();
    }, true);
    function updateEmailPreference() {
      if (!contactPreference || !emailPreference) return;
      emailPreference.disabled = !email.value.trim() || !email.validity.valid;
      if (emailPreference.disabled && contactPreference.value === "Email") contactPreference.value = "";
    }
    listen(email, "input", () => { email.setCustomValidity(""); updateEmailPreference(); });
    updateEmailPreference();
    for (const [name, exclusive] of [["treatmentAreas", "Not sure yet"], ["previousMethods", "None"]]) {
      const options = [...form.querySelectorAll(`input[name="${name}"]`)];
      for (const option of options) listen(option, "change", () => {
        if (option.checked) for (const other of options) {
          if (other !== option && (option.value === exclusive || other.value === exclusive)) other.checked = false;
        }
      });
    }
    if (dialog) {
      listen(dialog.querySelector("[data-success-close]"), "click", () => dialog.close());
      listen(dialog, "close", () => { if (!returningHome) status.focus(); });
      listen(dialog.querySelector("[data-success-home]"), "click", (event) => {
        const top = document.getElementById("top");
        if (!top) return;
        event.preventDefault();
        returningHome = true;
        dialog.close();
        top.setAttribute("tabindex", "-1");
        top.focus({ preventScroll: true });
        top.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      });
    }
    function showConfirmation(firstName) {
      if (dialog && typeof dialog.showModal === "function") {
        dialog.querySelector("[data-success-name]").textContent = firstName;
        try {
          dialog.showModal();
          dialog.querySelector("[data-success-title]").focus();
          return;
        } catch { /* Keep the visible inline confirmation if a dialog is unavailable. */ }
      }
      status.focus();
    }
    function normalizedPhone() {
      const raw = phone.value.trim();
      if (!/^\+?[()\d .-]+$/.test(raw)) return null;
      let digits = raw.replace(/\D/g, "");
      if (raw.startsWith("+") && (digits.length !== 11 || !digits.startsWith("1"))) return null;
      if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
      return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? `+1${digits}` : null;
    }
    let phoneInputError = "";
    let acceptedPhone = phone.value;
    let phoneSelection = [phone.selectionStart, phone.selectionEnd];
    function setPhoneError(text) {
      phone.setCustomValidity(text);
      if (text) phone.setAttribute("aria-invalid", "true");
      else phone.removeAttribute("aria-invalid");
      if (phoneError) { phoneError.textContent = text; phoneError.hidden = !text; }
      else if (text) message(text);
    }
    function phoneValidationError() {
      if (normalizedPhone()) return "";
      const digits = phone.value.replace(/\D/g, "");
      return digits.length < 10
        ? "Enter all 10 digits of your US phone number, including the area code."
        : "Enter a valid US phone number. Check the area code and the next three digits.";
    }
    function insertionError(raw) {
      raw = raw.trim();
      if (raw && !/^\+?[()\d .-]+$/.test(raw)) return "Use digits only, with an optional +1 country code. Extensions were not added; edit the number to continue.";
      let digits = raw.replace(/\D/g, "");
      if (raw.startsWith("+") && (!digits.startsWith("1") || digits.length !== 11)) return "Use a 10-digit US phone number, with an optional +1 country code. The pasted number was not added.";
      if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
      return digits.length > 10 ? "Use 10 digits. Extra digits were not added; check and edit the number to continue." : "";
    }
    function rejectPhone(text) {
      phoneInputError = text;
      setPhoneError(text);
    }
    function formatPhone(event = {}) {
      if (event.isComposing) return;
      const raw = phone.value;
      const error = insertionError(raw);
      // Reject the entire insertion, including autofill/paste without beforeinput.
      // Never trim a longer number into a different, apparently valid contact.
      if (error) {
        phone.value = acceptedPhone;
        phone.setSelectionRange?.(...phoneSelection);
        rejectPhone(error);
        return;
      }
      phoneInputError = "";
      setPhoneError("");
      let digits = raw.replace(/\D/g, "");
      let before = raw.slice(0, phone.selectionStart ?? raw.length).replace(/\D/g, "").length;
      if (digits.length === 11 && digits.startsWith("1")) { digits = digits.slice(1); before = Math.max(0, before - 1); }
      const formatted = !digits ? "" : digits.length <= 3 ? `(${digits}` : digits.length <= 6
        ? `(${digits.slice(0, 3)}) ${digits.slice(3)}`
        : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      phone.value = formatted;
      let cursor = 0, seen = 0;
      while (cursor < formatted.length && seen < before) {
        if (/\d/.test(formatted[cursor])) seen++;
        cursor++;
      }
      phone.setSelectionRange?.(cursor, cursor);
      acceptedPhone = formatted;
      phoneSelection = [cursor, cursor];
    }
    listen(phone, "input", formatPhone);
    listen(phone, "compositionend", formatPhone);
    function checkInsertion(event, text) {
      if (text == null || event.isComposing) return;
      const start = phone.selectionStart ?? phone.value.length, end = phone.selectionEnd ?? start;
      const error = insertionError(phone.value.slice(0, start) + text + phone.value.slice(end));
      if (error) { event.preventDefault(); rejectPhone(error); }
    }
    listen(phone, "paste", event => checkInsertion(event, event.clipboardData?.getData("text")));
    // Backspace/delete beside an inserted separator should remove the adjacent
    // digit, rather than repeatedly restoring the same punctuation.
    listen(phone, "beforeinput", (event) => {
      const start = phone.selectionStart, end = phone.selectionEnd;
      phoneSelection = [start, end];
      if (event.inputType?.startsWith("insert")) { checkInsertion(event, event.data); return; }
      if (start == null || start !== end || event.isComposing) return;
      const backward = event.inputType === "deleteContentBackward";
      const forward = event.inputType === "deleteContentForward";
      if (!backward && !forward) return;
      let index = backward ? start - 1 : start;
      if (index < 0 || index >= phone.value.length || /\d/.test(phone.value[index])) return;
      while (index >= 0 && index < phone.value.length && !/\d/.test(phone.value[index])) index += backward ? -1 : 1;
      if (index < 0 || index >= phone.value.length) return;
      event.preventDefault();
      const from = backward ? index : start;
      const to = backward ? start : index + 1;
      phone.value = phone.value.slice(0, from) + phone.value.slice(to);
      phone.setSelectionRange?.(from, from);
      formatPhone();
    });
    listen(phone, "blur", () => {
      if (phone.value || phoneInputError) setPhoneError(phoneInputError || phoneValidationError());
    });
    listen(form, "submit", async (event) => {
      event.preventDefault();
      if (!active || pending || sent) return;
      const normalized = normalizedPhone();
      setPhoneError(phoneInputError || phoneValidationError());
      for (const name of ["firstName", "lastName"]) {
        const field = form.elements.namedItem(name);
        field.value = field.value.trim();
      }
      email.setCustomValidity(contactPreference?.value === "Email" && !email.value.trim() ? "Enter an email address or choose another contact preference." : "");
      if (!form.reportValidity()) { validationMessage(); return; }
      if (!endpoint || !siteKey || !token) { message("Please complete the security check before sending."); return; }
      // Disabled controls are excluded from FormData, so capture before locking.
      const data = new FormData(form);
      const payload = {
        firstName: data.get("firstName"), lastName: data.get("lastName"), phone: normalized,
        email: String(data.get("email") || "").trim(), website: data.get("website"),
        treatmentAreas: data.getAll("treatmentAreas"), previousMethods: data.getAll("previousMethods"),
        contactPreference: data.get("contactPreference") || "", notes: String(data.get("notes") || "").trim(),
        permissionVersion: data.get("permissionVersion"), ...(interest ? { requestType: "interest" } : {}),
      };
      const fingerprint = JSON.stringify(payload);
      if (!deliveryAttempt || deliveryAttempt.fingerprint !== fingerprint) deliveryAttempt = { fingerprint, submissionId: crypto.randomUUID(), startedAt: Date.now() };
      pending = true; button.disabled = true; button.textContent = interest ? "Joining…" : "Sending request…";
      lockFields(true);
      form.setAttribute("aria-busy", "true");
      message("");
      try {
        const response = await fetch(endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, turnstileToken: token, submissionId: deliveryAttempt.submissionId, startedAt: deliveryAttempt.startedAt }),
          signal: AbortSignal.timeout(20000),
        });
        const result = await response.json();
        if (!active) return;
        if (result.code === "retry_expired" || result.code === "payload_changed") {
          message("We couldn’t confirm this request. Please email nav@evergreenelectrolysisstudio.com so Nav can check before you submit again.");
          button.textContent = actionLabel;
          status.focus();
          return;
        }
        if (!response.ok || result.ok !== true) throw new Error("Delivery not confirmed");
        sent = true; button.textContent = interest ? "You’re on the list" : "Request sent";
        if (securityStatus) securityMessage("Security check complete.");
        message(interest ? "Thank you. You’re on the interest list. We’ll share studio opening updates and consultation availability." : "Thank you. Your consultation request has been sent. We’ll contact you to discuss the next step.");
        showConfirmation(String(data.get("firstName")));
      } catch {
        if (!active) return;
        message("We couldn’t confirm delivery. Your details are still here. Please complete the security check again and retry.");
        button.textContent = actionLabel;
        status.focus();
      } finally {
        pending = false; token = "";
        form.setAttribute("aria-busy", "false");
        if (!sent) lockFields(false);
        if (active && window.turnstile && widget !== undefined && !sent) window.turnstile.reset(widget);
      }
    });
    const fail = () => {
      if (active) securityMessage("The security check could not load. Refresh the page to try again.");
    };
    const render = () => {
      if (!active || widget !== undefined) return;
      widget = window.turnstile.render(form.querySelector("[data-turnstile-container]"), {
        sitekey: siteKey, action: interest ? "interest_list" : "consultation", size: "flexible", theme: form.dataset.theme === "light" ? "light" : "dark",
        callback: (value) => { if (!active) return; token = value; button.disabled = pending || sent; if (!pending && !sent && securityStatus) securityMessage(`Security check complete. Choose “${actionLabel}” to send your details.`); },
        "expired-callback": () => { if (!active || sent) return; token = ""; button.disabled = true; securityMessage("The security check expired. Please complete it again."); },
        "error-callback": () => { if (!active || sent) return; token = ""; button.disabled = true; fail(); },
      });
    };
    if (endpoint && siteKey) loadWidget(render, fail);
    return () => {
      active = false;
      token = "";
      button.disabled = true;
      waitingWidgets.delete(render);
      for (const remove of listeners) remove();
      if (dialog?.open) dialog.close();
      if (widget !== undefined && window.turnstile) window.turnstile.remove(widget);
      delete form.dataset.initialized;
    };
  }
  function refresh() {
    for (const [form, dispose] of forms) {
      if (!form.isConnected) { dispose(); forms.delete(form); }
    }
    for (const form of document.querySelectorAll("[data-consultation-form]")) {
      if (!forms.has(form)) forms.set(form, initialize(form));
    }
  }
  window.evergreenConsultationController = { refresh };
  function start() {
    new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
    refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
