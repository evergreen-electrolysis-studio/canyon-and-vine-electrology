import { validateSubmission, validInquiryAttempt } from "./inquiry.mjs";

const MAX_BODY_BYTES = 8 * 1024;
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const UNAVAILABLE = "Consultation requests are temporarily unavailable. Please try again later.";
const VERIFICATION_FAILED = "Please complete the security check and try again.";

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

// Dependencies make the complete request path testable without sending real email.
export function createHandler({ fetch: fetcher = globalThis.fetch, verificationTimeoutMs = 5000 } = {}) {
  return async function handleRequest(request, env = {}) {
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
    if (typeof env.TURNSTILE_SECRET_KEY !== "string" || !env.TURNSTILE_SECRET_KEY.trim() ||
        typeof env.INQUIRY_MAIL?.fetch !== "function") {
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

    // Legacy callers without an attempt ID still work. The current controller
    // retains the same UUID and original payload across uncertain retries.
    const submissionId = body.submissionId ?? crypto.randomUUID();
    const startedAt = body.startedAt ?? Date.now();
    if (!validInquiryAttempt(submissionId, startedAt)) {
      return response(400, { ok: false, code: "retry_expired", error: "This request can no longer be retried safely. Please contact nav@evergreenelectrolysisstudio.com." }, origin);
    }
    delete submission.turnstileToken;
    submission.permissionVersion ??= null;
    try {
      const delivered = await env.INQUIRY_MAIL.fetch(new Request("https://delivery.internal/inquiry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, startedAt, origin, submission }),
      }));
      const result = await delivered.json();
      if (!delivered.ok || result.outcome !== "accepted") {
        return response(503, { ok: false, code: result.code === "payload_changed" ? "payload_changed" : "delivery_unconfirmed", error: "Delivery is not confirmed. Your details are still here. Please wait a moment and retry the same request." }, origin);
      }
    } catch {
      return failure(503, "Delivery is not confirmed. Your details are still here. Please wait a moment and retry the same request.", origin);
    }
    return response(200, { ok: true }, origin);
  };
}

const worker = { fetch: createHandler() };
export default worker;
