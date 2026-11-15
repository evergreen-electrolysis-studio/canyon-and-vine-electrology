import config from "../../config/consultation.json";
import fields from "../../config/consultation-fields.json";
import styles from "./consultation-form.module.css";

export default function ConsultationForm() {
  return (
    <div className={styles.panel}>
      <h3>Request a consultation</h3>
      <p>Tell us how to reach you. First name, last name, and phone number are required.</p>
      <form className={styles.form} data-consultation-form data-endpoint={config.endpoint} data-site-key={config.turnstileSiteKey} method="post" action={config.endpoint || "#contact"}>
        <div className={styles.names}>
          <label htmlFor="consultation-first-name">First name <span>(required)</span><input id="consultation-first-name" name="firstName" autoComplete="given-name" required maxLength={80} /></label>
          <label htmlFor="consultation-last-name">Last name <span>(required)</span><input id="consultation-last-name" name="lastName" autoComplete="family-name" required maxLength={80} /></label>
        </div>
        <label htmlFor="consultation-phone">Phone number <span>(required)</span></label>
        <div className={styles.phone}><span aria-hidden="true">US +1</span><input id="consultation-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(707) 555-0123" aria-describedby="consultation-phone-hint" required minLength={10} maxLength={24} /></div>
        <p id="consultation-phone-hint" className={styles.hint}>United States (+1). Include all 10 digits, starting with the area code.</p>
        <label htmlFor="consultation-email">Email address <span>(optional)</span><input id="consultation-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} /></label>
        <label htmlFor="consultation-contact-preference">Preferred way to reach you <span>(optional)</span>
          <select id="consultation-contact-preference" name="contactPreference" defaultValue="" aria-describedby="consultation-contact-hint">
            <option value="">No preference</option>
            {fields.contactPreferences.map((preference) => <option key={preference} value={preference} disabled={preference === "Email"} data-email-preference={preference === "Email" ? "" : undefined}>{preference}</option>)}
          </select>
        </label>
        <p id="consultation-contact-hint" className={styles.hint}>Add an email address above if you prefer an email response.</p>
        <details className={styles.optionalDetails}>
          <summary>Tell us a little more — optional</summary>
          <div className={styles.optionalContent}>
            <fieldset className={styles.choices}>
              <legend>Areas you’re interested in treating</legend>
              <p className={styles.hint}>Choose any that apply, or leave this for your consultation.</p>
              <div className={styles.choiceGrid}>{fields.treatmentAreas.map((area) => <label key={area} className={styles.choice}><input type="checkbox" name="treatmentAreas" value={area} /><span>{area}</span></label>)}</div>
            </fieldset>
            <fieldset className={styles.choices}>
              <legend>Hair removal you’ve tried before</legend>
              <p className={styles.hint}>Choose any that apply.</p>
              <div className={styles.choiceGrid}>{fields.previousMethods.map((method) => <label key={method} className={styles.choice}><input type="checkbox" name="previousMethods" value={method} /><span>{method}</span></label>)}</div>
            </fieldset>
            <label htmlFor="consultation-notes">Anything you’d like us to know? <span>(optional)</span><textarea id="consultation-notes" name="notes" rows={4} maxLength={500} aria-describedby="consultation-notes-hint" placeholder="Share your goals or a question for Nav." /></label>
            <p id="consultation-notes-hint" className={styles.hint}>Up to 500 characters. Please leave medical history, medications, and photos for your consultation.</p>
          </div>
        </details>
        <div className={styles.honeypot} aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <input type="hidden" name="permissionVersion" value={fields.permissionVersion} />
        <div data-turnstile-container />
        <p className={styles.note}>{fields.permissionText}</p>
        <details className={styles.privacy}>
          <summary>How we use your information</summary>
          <p>Evergreen Electrolysis uses your contact details and any optional answers to respond to your request and arrange next steps. Your submission is sent through Cloudflare to the practice’s email inbox and retained there for follow-up.</p>
          <p>Cloudflare Turnstile processes technical information, such as your IP address and browser information, to help prevent spam. Read <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare’s privacy policy<span className={styles.srOnly}> (opens in a new tab)</span></a>.</p>
          <p>This form does not subscribe you to marketing. You can ask Nav about the information you submitted when she contacts you.</p>
        </details>
        <button type="submit" disabled>Request a consultation <span aria-hidden="true">↗</span></button>
        <p data-form-status role="status" aria-live="polite" tabIndex={-1} className={styles.status}>{config.endpoint && config.turnstileSiteKey ? "Loading the request form…" : "Preview only: request delivery is not connected yet."}</p>
        <noscript>Please enable JavaScript to send your consultation request.</noscript>
      </form>
      <dialog className={styles.dialog} data-success-dialog aria-labelledby="consultation-success-title" aria-describedby="consultation-success-body">
        <button className={styles.closeDialog} type="button" data-success-close aria-label="Close confirmation"><span aria-hidden="true">×</span></button>
        <span className={styles.successMark} aria-hidden="true">✓</span>
        <p className={styles.successEyebrow}>Evergreen Electrolysis</p>
        <h2 id="consultation-success-title" tabIndex={-1} data-success-title>Your request has been sent</h2>
        <div id="consultation-success-body" className={styles.successBody}>
          <p>Thank you, <span data-success-name />. Nav will contact you to discuss your consultation and next steps.</p>
          <p className={styles.appointmentNote}>Your appointment is not confirmed yet.</p>
        </div>
        {/* The static form controller closes the dialog and returns to the page top. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className={styles.homeButton} href="/" data-success-home>Back to home <span aria-hidden="true">↗</span></a>
      </dialog>
      <script src="/consultation-form.js" defer />
    </div>
  );
}
