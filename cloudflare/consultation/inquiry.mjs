import fields from "../../config/consultation-fields.json" with { type: "json" };
import interestList from "../../config/interest-list.json" with { type: "json" };

export function isEmail(value) {
  return typeof value === "string" && value.length <= 254 &&
    !/[\p{Cc}\p{Cf}]/u.test(value) && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
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

export function validateSubmission(body, { requireTurnstile = true } = {}) {
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
  if (requireTurnstile && (typeof body.turnstileToken !== "string" || !body.turnstileToken.trim() ||
      body.turnstileToken.length > 2048)) return null;
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

export const INQUIRY_SENDER = 'nav@evergreenelectrolysisstudio.com';
export const INQUIRY_ORIGINS = Object.freeze(['https://evergreenelectrolysisstudio.com', 'https://tycheventuresllc.com', 'https://canyon-and-vine-electrology.sukhpalc.chatgpt.site']);
export const INQUIRY_RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;
export function validInquiryAttempt(id, startedAt, now = Date.now()) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id ?? '')
    && Number.isSafeInteger(startedAt) && startedAt <= now + 60_000 && now - startedAt < INQUIRY_RETRY_WINDOW_MS;
}

// The private mail boundary accepts data, not an arbitrary email template.
export function normalizeInquiry(body, now = Date.now()) {
  if (!body || Object.keys(body).sort().join(',') !== 'origin,startedAt,submission,submissionId'
    || !INQUIRY_ORIGINS.includes(body.origin) || !validInquiryAttempt(body.submissionId, body.startedAt, now)) return null;
  const keys = 'contactPreference,email,firstName,lastName,notes,permissionVersion,phone,previousMethods,requestType,treatmentAreas';
  if (!body.submission || Object.keys(body.submission).sort().join(',') !== keys) return null;
  const raw = { ...body.submission };
  if (raw.permissionVersion === null) delete raw.permissionVersion;
  const submission = validateSubmission(raw, { requireTurnstile: false });
  if (!submission) return null;
  delete submission.turnstileToken;
  // JSON transport omits undefined; preserve a single canonical legacy value.
  submission.permissionVersion ??= null;
  return { submissionId: body.submissionId, startedAt: body.startedAt, origin: body.origin, submission };
}

const receivedTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', month: 'long', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
});

export function inquiryEmail(submission, _origin, receivedAt, { requestId, staffOrigin } = {}) {
  let trackerLink = null;
  if (requestId !== undefined || staffOrigin !== undefined) {
    const origin = new URL(staffOrigin);
    if (origin.protocol !== 'https:' || origin.origin !== staffOrigin || origin.username || origin.password || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId ?? '')) throw new Error('A valid private request destination is required.');
    trackerLink = `${staffOrigin}/?request=${requestId.toLowerCase()}`;
  }
  const interest = submission.requestType === 'interest';
  const phone = submission.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '+1 ($1) $2-$3');
  const contact = [
    `Name: ${submission.firstName} ${submission.lastName}`,
    `Phone: ${phone}`,
    ...(submission.email ? [`Email: ${submission.email}`] : []),
    ...(submission.contactPreference ? [`Preferred contact method: ${submission.contactPreference}`] : []),
  ];
  const details = [
    ...(submission.treatmentAreas.length ? [`Treatment areas: ${submission.treatmentAreas.join(', ')}`] : []),
    ...(submission.previousMethods.length ? [`Previous hair-removal methods: ${submission.previousMethods.join(', ')}`] : []),
  ];
  return {
    to: INQUIRY_SENDER, from: INQUIRY_SENDER,
    subject: interest ? 'New Evergreen Electrolysis Studio interest-list signup' : 'New Evergreen Electrolysis consultation request',
    text: [
      `Received: ${receivedTime.format(new Date(receivedAt))} (Pacific Time)`,
      contact.join('\n'),
      ...(details.length ? [details.join('\n')] : []),
      ...(submission.notes ? [`Questions / notes:\n${submission.notes.split('\n').map(line => `  ${line}`).join('\n')}`] : []),
      ...(trackerLink ? [`Track this request:\n${trackerLink}`] : []),
    ].join('\n\n'),
    ...(submission.email ? { replyTo: submission.email } : {}),
  };
}
