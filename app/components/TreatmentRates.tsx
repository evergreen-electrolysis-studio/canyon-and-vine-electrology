import pricing from "../../config/treatment-pricing.json";
import styles from "./treatment-rates.module.css";

export const treatmentRateSummary = pricing.sessions
  .map(({ minutes, price }) => `${minutes} minutes: $${price}`)
  .join("; ");

export default function TreatmentRates({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.pricing} ${className}`} data-treatment-pricing>
      <p className={styles.currency}>Session prices · {pricing.currency}</p>
      <dl className={styles.rates}>
        {pricing.sessions.map(({ minutes, price }) => (
          <div key={minutes} data-minutes={minutes}>
            <dt>{minutes} minutes</dt>
            <dd>${price}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
