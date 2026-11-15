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
    const phone = form.elements.namedItem("phone");
    const email = form.elements.namedItem("email");
    const contactPreference = form.elements.namedItem("contactPreference");
    const emailPreference = form.querySelector("[data-email-preference]");
    const dialog = form.parentElement.querySelector("[data-success-dialog]");
    const endpoint = form.dataset.endpoint;
    const siteKey = form.dataset.siteKey;
    let token = "";
    let widget;
    let pending = false;
    let sent = false;
    let returningHome = false;
    let active = true;
    const listeners = [];
    const listen = (element, event, handler) => {
      element.addEventListener(event, handler);
      listeners.push(() => element.removeEventListener(event, handler));
    };
    const message = (text) => { status.textContent = text; };
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
    listen(phone, "input", () => phone.setCustomValidity(""));
    listen(phone, "blur", () => {
      const normalized = normalizedPhone();
      if (normalized) { const d = normalized.slice(2); phone.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`; }
    });
    listen(form, "submit", async (event) => {
      event.preventDefault();
      if (!active || pending || sent) return;
      const normalized = normalizedPhone();
      phone.setCustomValidity(normalized ? "" : "Enter a complete 10-digit US phone number, including the area code.");
      for (const name of ["firstName", "lastName"]) {
        const field = form.elements.namedItem(name);
        field.value = field.value.trim();
      }
      email.setCustomValidity(contactPreference?.value === "Email" && !email.value.trim() ? "Enter an email address or choose another contact preference." : "");
      if (!form.reportValidity()) return;
      if (!endpoint || !siteKey || !token) { message("Please complete the security check before sending."); return; }
      pending = true; button.disabled = true; button.textContent = "Sending request…";
      message("");
      try {
        const data = new FormData(form);
        const response = await fetch(endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.get("firstName"), lastName: data.get("lastName"), phone: normalized,
            email: String(data.get("email") || "").trim(), website: data.get("website"), turnstileToken: token,
            treatmentAreas: data.getAll("treatmentAreas"), previousMethods: data.getAll("previousMethods"),
            contactPreference: data.get("contactPreference") || "", notes: String(data.get("notes") || "").trim(),
            permissionVersion: data.get("permissionVersion"),
          }),
          signal: AbortSignal.timeout(20000),
        });
        const result = await response.json();
        if (!active) return;
        if (!response.ok || result.ok !== true) throw new Error("Delivery not confirmed");
        sent = true; form.reset(); button.textContent = "Request sent";
        updateEmailPreference();
        message("Thank you. Your consultation request has been sent. We’ll contact you to discuss the next step.");
        showConfirmation(String(data.get("firstName")));
      } catch {
        if (!active) return;
        message("We couldn’t confirm delivery. Your details are still here. Please complete the security check again and retry.");
        button.textContent = "Request a consultation";
        status.focus();
      } finally {
        pending = false; token = "";
        if (active && window.turnstile && widget !== undefined && !sent) window.turnstile.reset(widget);
      }
    });
    const fail = () => {
      if (active) message("The security check could not load. Refresh the page to try again.");
    };
    const render = () => {
      if (!active || widget !== undefined) return;
      widget = window.turnstile.render(form.querySelector("[data-turnstile-container]"), {
        sitekey: siteKey, action: "consultation", size: "flexible", theme: form.dataset.theme === "light" ? "light" : "dark",
        callback: (value) => { if (!active) return; token = value; button.disabled = pending || sent; if (!pending && !sent) message(""); },
        "expired-callback": () => { if (!active || sent) return; token = ""; button.disabled = true; message("The security check expired. Please complete it again."); },
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
