import fields from "../../config/consultation-fields.json" with { type: "json" };

import interestList from "../../config/interest-list.json" with { type: "json" };

const MAX_BODY_BYTES = 8 * 1024;
const DEFAULT_RECIPIENT = "sukhpalc@gmail.com";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const UNAVAILABLE = "Consultation requests are temporarily unavailable. Please try again later.";
const VERIFICATION_FAILED = "Please complete the security check and try again.";

function isEmail(value) {
  return typeof value === "string" && value.length <= 254 &&
    !/[\p{Cc}\p{Cf}]/u.test(value) && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function allowedOrigins(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const origins = value.split(",").map((origin) => origin.trim());
  try {
    if (origins.some((origin) => {
      const url = new URL(origin);
      return url.origin !== origin || !["https:", "http:"].includes(url.protocol);
    })) return null;
  } catch {
    return null;
  }
  return new Set(origins);
}

function response(status, body, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}

function failure(status, error, origin) {
  return response(status, { ok: false, error }, origin);
}

async function readBody(request) {
  const declaredSize = request.headers.get("Content-Length");
  if (declaredSize && (!/^\d+$/.test(declaredSize) || Number(declaredSize) > MAX_BODY_BYTES)) {
    throw new RangeError("Body too large");
  }
  if (!request.body) throw new SyntaxError("Missing body");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new RangeError("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

function validName(value) {
  return typeof value === "string" && value.trim().length > 0 &&
    value.trim().length <= 80 && !/[\p{Cc}\p{Cf}]/u.test(value);
}

function normalizePhone(value) {
  if (typeof value !== "string" || value.length > 40) return null;
  const phone = value.trim();
  if (!/^\+?[\d ().-]+$/.test(phone)) return null;
  let digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+") && (digits.length !== 11 || !digits.startsWith("1"))) return null;
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return null;
  return `+1${digits}`;
}

function selectedOptions(value, options, exclusiveOption) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > options.length ||
      value.some((option) => typeof option !== "string" || !options.includes(option))) return null;
  const selected = [...new Set(value)];
  if (selected.length > 1 && selected.includes(exclusiveOption)) return null;
  return selected;
}

function validateSubmission(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const requestType = body.requestType ?? "consultation";
  if (!["consultation", "interest"].includes(requestType)) return null;
  const notice = requestType === "interest" ? interestList : fields;
  if (requestType === "interest" && body.permissionVersion !== notice.permissionVersion) return null;
  if (!validName(body.firstName) || !validName(body.lastName)) return null;
  const phone = normalizePhone(body.phone);
  if (!phone) return null;
  if (body.email !== undefined && typeof body.email !== "string") return null;
  const email = (body.email ?? "").trim();
  if (email && !isEmail(email)) return null;
  const treatmentAreas = selectedOptions(body.treatmentAreas, fields.treatmentAreas, "Not sure yet");
  const previousMethods = selectedOptions(body.previousMethods, fields.previousMethods, "None");
  if (!treatmentAreas || !previousMethods) return null;
  const contactPreference = body.contactPreference === undefined ? "" : body.contactPreference;
  if (typeof contactPreference !== "string" ||
      (contactPreference !== "" && !fields.contactPreferences.includes(contactPreference)) ||
      (contactPreference === "Email" && !email)) return null;
  if (body.notes !== undefined && (typeof body.notes !== "string" || body.notes.length > 500 ||
      /[\p{Cc}\p{Cf}]/u.test(body.notes.replace(/[\r\n\t]/g, "")))) return null;
  const notes = (body.notes ?? "").replace(/\r\n?/g, "\n").trim();
  if (body.permissionVersion !== undefined && body.permissionVersion !== notice.permissionVersion) return null;
  if (body.website !== undefined && (typeof body.website !== "string" || body.website.trim())) return null;
  if (typeof body.turnstileToken !== "string" || !body.turnstileToken.trim() ||
      body.turnstileToken.length > 2048) return null;
  return {
    requestType,
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    phone,
    email,
    treatmentAreas,
    previousMethods,
    contactPreference,
    notes,
    permissionVersion: body.permissionVersion,
    turnstileToken: body.turnstileToken,
  };
}

// Dependencies make the complete request path testable without sending real email.
export function createHandler({ fetch: fetcher = globalThis.fetch, verificationTimeoutMs = 5000 } = {}) {
  return async function handleRequest(request, env = {}) {
    const receivedAt = new Date().toISOString();
    if (new URL(request.url).pathname !== "/request") return failure(404, "Not found.");
    const origins = allowedOrigins(env.ALLOWED_ORIGINS);
    if (!origins) return failure(503, UNAVAILABLE);
    const origin = request.headers.get("Origin");
    if (!origin || !origins.has(origin)) return failure(403, "This website cannot submit a consultation request.");

    if (request.method === "OPTIONS") {
      const method = request.headers.get("Access-Control-Request-Method");
      const headers = (request.headers.get("Access-Control-Request-Headers") ?? "")
        .split(",").map((header) => header.trim().toLowerCase()).filter(Boolean);
      if (method !== "POST" || headers.some((header) => header !== "content-type")) {
        return failure(403, "This request is not allowed.", origin);
      }
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "600",
          "Cache-Control": "no-store",
          "Vary": "Origin",
        },
      });
    }
    if (request.method !== "POST") {
      const result = failure(405, "Use POST to request a consultation.", origin);
      result.headers.set("Allow", "POST, OPTIONS");
      return result;
    }
    const recipient = env.RECIPIENT_EMAIL ?? DEFAULT_RECIPIENT;
    if (typeof env.TURNSTILE_SECRET_KEY !== "string" || !env.TURNSTILE_SECRET_KEY.trim() ||
        !isEmail(env.SENDER_EMAIL) || !isEmail(recipient) ||
        typeof env.CONSULTATION_EMAIL?.send !== "function") {
      return failure(503, UNAVAILABLE, origin);
    }
    if (request.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
      return failure(415, "Submit the form as JSON.", origin);
    }

    let body;
    try {
      body = await readBody(request);
    } catch (error) {
      return failure(error instanceof RangeError ? 413 : 400,
        error instanceof RangeError ? "The request is too large." : "The form could not be read. Please try again.", origin);
    }
    const submission = validateSubmission(body);
    if (!submission) {
      return failure(400, "Check your contact details and optional answers. Include an email address if you prefer an email reply, and keep questions within 500 characters.", origin);
    }

    const verificationBody = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: submission.turnstileToken,
    });
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) verificationBody.set("remoteip", ip);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), verificationTimeoutMs);
    let verification;
    try {
      const result = await fetcher(TURNSTILE_URL, {
        method: "POST",
        body: verificationBody,
        signal: controller.signal,
      });
      if (!result.ok) return failure(503, VERIFICATION_FAILED, origin);
      verification = await result.json();
    } catch {
      return failure(503, VERIFICATION_FAILED, origin);
    } finally {
      clearTimeout(timer);
    }
    if (verification?.success !== true || verification.hostname !== new URL(origin).hostname ||
        verification.action !== (submission.requestType === "interest" ? "interest_list" : "consultation")) {
      return failure(400, VERIFICATION_FAILED, origin);
    }

    const interest = submission.requestType === "interest";
    const notice = interest ? interestList : fields;
    try {
      await env.CONSULTATION_EMAIL.send({
        to: recipient,
        from: env.SENDER_EMAIL,
        subject: interest ? "New Evergreen Electrolysis Studio interest-list signup" : "New Evergreen Electrolysis consultation request",
        text: [
          interest ? "A visitor joined the Evergreen Electrolysis Studio interest list for the summer 2027 opening. No appointment was requested or booked." : "A visitor requested a consultation with Evergreen Electrolysis.",
          "",
          `First name: ${submission.firstName}`,
          `Last name: ${submission.lastName}`,
          `Phone: ${submission.phone}`,
          `Email: ${submission.email || "Not provided"}`,
          `Preferred contact method: ${submission.contactPreference || "Not specified"}`,
          "",
          interest ? "INTEREST LIST DETAILS (OPTIONAL)" : "CONSULTATION DETAILS (OPTIONAL)",
          `Treatment areas: ${submission.treatmentAreas.join(", ") || "Not specified"}`,
          `Previous hair-removal methods: ${submission.previousMethods.join(", ") || "Not specified"}`,
          "Questions / notes:",
          ...((submission.notes || "Not provided").split("\n").map((line) => `  ${line}`)),
          "",
          `Received (UTC): ${receivedAt}`,
          `Website: ${origin}`,
          ...(submission.permissionVersion ? [
            `Contact permission notice version: ${submission.permissionVersion}`,
            notice.permissionText,
          ] : ["Contact permission notice version: Not supplied (legacy form)."]),
        ].join("\n"),
        ...(submission.email ? { replyTo: submission.email } : {}),
      });
    } catch {
      return failure(503, "Your request could not be sent. Please try again later.", origin);
    }
    return response(200, { ok: true }, origin);
  };
}

const worker = { fetch: createHandler() };
export default worker;
