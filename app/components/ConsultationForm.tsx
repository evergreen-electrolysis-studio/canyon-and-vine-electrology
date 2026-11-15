import config from "../../config/consultation.json";
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
        <div className={styles.honeypot} aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div data-turnstile-container />
        <p className={styles.note}>We’ll use these details to respond to your consultation request. This does not book an appointment.</p>
        <button type="submit" disabled>Request a consultation <span aria-hidden="true">↗</span></button>
        <p data-form-status role="status" aria-live="polite" tabIndex={-1} className={styles.status}>{config.endpoint && config.turnstileSiteKey ? "Loading the request form…" : "Preview only: request delivery is not connected yet."}</p>
        <noscript>Please enable JavaScript to send your consultation request.</noscript>
      </form>
      <script src="/consultation-form.js" defer />
    </div>
  );
}
