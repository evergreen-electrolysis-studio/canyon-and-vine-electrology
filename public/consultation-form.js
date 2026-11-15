/* The static Pages export and Sites use the same small form controller. */
(() => {
  function initialize() {
    const form = document.querySelector("[data-consultation-form]");
    if (!form || form.dataset.initialized) return;
    form.dataset.initialized = "true";
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector("[data-form-status]");
    const phone = form.elements.namedItem("phone");
    const endpoint = form.dataset.endpoint;
    const siteKey = form.dataset.siteKey;
    let token = "";
    let widget;
    let pending = false;
    let sent = false;
    const message = (text) => { status.textContent = text; };
    function normalizedPhone() {
      const raw = phone.value.trim();
      if (!/^\+?[()\d .-]+$/.test(raw)) return null;
      let digits = raw.replace(/\D/g, "");
      if (raw.startsWith("+") && (digits.length !== 11 || !digits.startsWith("1"))) return null;
      if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
      return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? `+1${digits}` : null;
    }
    phone.addEventListener("input", () => phone.setCustomValidity(""));
    phone.addEventListener("blur", () => {
      const normalized = normalizedPhone();
      if (normalized) { const d = normalized.slice(2); phone.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`; }
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending || sent) return;
      const normalized = normalizedPhone();
      phone.setCustomValidity(normalized ? "" : "Enter a complete 10-digit US phone number, including the area code.");
      for (const name of ["firstName", "lastName"]) {
        const field = form.elements.namedItem(name);
        field.value = field.value.trim();
      }
      if (!form.reportValidity()) return;
      if (!endpoint || !siteKey || !token) { message("Please complete the security check before sending."); return; }
      pending = true; button.disabled = true; button.textContent = "Sending request…";
      message("");
      try {
        const data = new FormData(form);
        const response = await fetch(endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName: data.get("firstName"), lastName: data.get("lastName"), phone: normalized, email: String(data.get("email") || "").trim(), website: data.get("website"), turnstileToken: token }),
          signal: AbortSignal.timeout(20000),
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error("Delivery not confirmed");
        sent = true; form.reset(); button.textContent = "Request sent";
        message("Thank you. Your consultation request has been sent. We’ll contact you to discuss the next step.");
        status.focus();
      } catch {
        message("We couldn’t confirm delivery. Your details are still here. Please complete the security check again and retry.");
        button.textContent = "Request a consultation";
        status.focus();
      } finally {
        pending = false; token = "";
        if (window.turnstile && widget !== undefined && !sent) window.turnstile.reset(widget);
      }
    });
    if (!endpoint || !siteKey) return;
    const render = () => {
      widget = window.turnstile.render(form.querySelector("[data-turnstile-container]"), {
        sitekey: siteKey, action: "consultation", size: "flexible", theme: "dark",
        callback: (value) => { token = value; button.disabled = pending || sent; if (!pending && !sent) message(""); },
        "expired-callback": () => { if (sent) return; token = ""; button.disabled = true; message("The security check expired. Please complete it again."); },
        "error-callback": () => { if (sent) return; token = ""; button.disabled = true; message("The security check could not load. Refresh the page to try again."); },
      });
    };
    if (window.turnstile) render();
    else {
      window.evergreenTurnstileReady = render;
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=evergreenTurnstileReady&render=explicit";
      script.async = true;
      script.onerror = () => message("The security check could not load. Refresh the page to try again.");
      document.head.append(script);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
