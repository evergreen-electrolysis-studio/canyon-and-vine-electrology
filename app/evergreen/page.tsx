
// Production authoring route: the Evergreen exporter publishes this page at /.
// Historical designs, styles, and shared form behavior remain unchanged.
import type { Metadata } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/newsreader/wght.css";
import ConsultationForm from "../components/ConsultationForm";
import TreatmentRates from "../components/TreatmentRates";
import styles from "../concepts/design-09/design09.module.css";
import additions from "./evergreen.module.css";

const url = "https://evergreenelectrolysisstudio.com/";
const image = "https://evergreenelectrolysisstudio.com/evergreen-hero-monochrome-v1.webp";
const imageAlt = "Black-and-white portrait of a woman against a dark background";
const description = "Feel at home in your skin. Thoughtful electrolysis care in American Canyon, California. Evergreen Electrolysis Studio is coming summer 2027; join the interest list.";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  keywords: ["electrolysis American Canyon", "Evergreen Electrolysis Studio"],
  title: "Electrolysis in American Canyon | Evergreen Electrolysis Studio",
  description,
  alternates: { canonical: url },
  robots: { index: false, follow: true },
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Electrolysis in American Canyon", description, url, type: "website",
    siteName: "Evergreen Electrolysis Studio",
    images: [{ url: image, width: 1586, height: 992, alt: imageAlt }],
  },
  twitter: { card: "summary_large_image", title: "Electrolysis in American Canyon | Evergreen Electrolysis Studio", description, images: [{ url: image, alt: imageAlt }] },
};

const areas = [
  { number: "01", title: "Face & neck", text: "Upper lip, chin, jawline, cheeks, sideburns, brows and between brows, hairline, temples, ears and nose exterior, neck and nape." },
  { number: "02", title: "Selected body areas", text: "Underarms, arms and hands, legs and feet, chest and abdomen, shoulders and back. Choose the area that matters to you." },
  { number: "03", title: "The finishing details", text: "Isolated persistent hairs, careful shaping, and hairs remaining after other removal methods. Small areas deserve a considered plan, too." },
];

const steps = [
  { title: "A conversation first.", text: "Talk with Nav by phone about your goals, previous hair removal, how electrolysis works, session length, costs, and any questions." },
  { title: "Your forms, in private.", text: "When you’re ready, Nav sends a private link to your questionnaire and treatment consent. She reviews your answers and follows up on anything that needs discussion before your appointment." },
  { title: "Your first visit.", text: "Confirm your appointment with Nav. At the visit, review your skin, treatment area, and any changes together. A small test treatment may be offered if appropriate, with preparation and aftercare explained." },
];

const questions = [
  { title: "How does electrolysis remove hair?", text: "A fine probe follows the natural opening of an individual hair follicle. A small electrical current treats the hair-growth cells. Galvanic uses a chemical reaction, thermolysis uses heat, and blend combines the two. The method and settings are selected for the hair, skin, and area." },
  { title: "Does my hair color or skin tone matter?", text: "Electrolysis does not depend on hair pigment. It can treat every natural hair color, including blonde, red, gray, and white, across skin tones. Your consultation is the place to discuss your skin, hair, and individual suitability." },
  { title: "Why is more than one visit needed?", text: "Hair grows in cycles, and not every hair is ready to treat at the same time. The amount and structure of hair, previous removal methods, hormones, and appointment consistency affect the course of treatment. Your schedule is reviewed as you go; there is no single timeline for everyone." },
  { title: "What does a treatment feel like?", text: "You may feel brief heat, a pinch, or a sting. Sensitivity varies with the person and the area. Discuss comfort with Nav; a small test treatment, when appropriate, can help you understand the sensation before a longer session." },
  { title: "What should I know before and after a visit?", text: "Leave enough visible hair for treatment and discuss skin products, medicines, and recent procedures with Nav. Our preparation and aftercare guide covers the basics; Nav will tailor instructions to your skin and treatment area.", guide: true },
  { title: "Can we discuss hair associated with hormonal changes?", text: "Yes. Visible hair associated with hormonal changes, including PCOS or menopause, can be part of your treatment discussion. Electrolysis removes hair; it does not diagnose or treat the underlying condition. Medical concerns belong with your healthcare professional." },
];

export default function EvergreenHomepage() {
  return (
    <div className={styles.page} id="top">
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="Evergreen Electrolysis Studio home"><span>Evergreen</span><small>Electrolysis Studio</small></a>
        <nav className={styles.navigation} aria-label="Primary navigation">
          <a href="#care">Treatment</a><a href="#nav">Meet Nav</a><a href="#rates">Rates</a><a href="#questions">Questions</a>
        </nav>
        <a className={styles.headerCta} href="#contact">Join interest list</a>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroHeading}>
            <p className={styles.eyebrow}>American Canyon, California · Coming summer 2027</p>
            <h1 id="hero-title">Feel at home<br /><em>in your skin.</em></h1>
          </div>
          <div className={styles.heroPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/evergreen-hero-monochrome-v1.webp" alt={imageAlt} width="1586" height="992" loading="eager" fetchPriority="high" />
          </div>
          <div className={styles.heroIntroduction}>
            <p>Thoughtful, one-follicle-at-a-time care for every skin tone and hair color, with a treatment plan tailored to your goals.</p>
            <a className={styles.button} href="#contact">Join interest list</a>
            <a className={styles.textLink} href="#first-visit">A look at your first visit <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className={styles.care} id="care" aria-labelledby="care-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>01 / Your treatment</p>
            <h2 id="care-title">Start with what<br /><em>matters to you.</em></h2>
            <p>A few persistent hairs or a larger area. A familiar routine you’re ready to change. We begin with your priorities.</p>
            <p className={styles.scope}>Electrolysis for every natural hair color, across skin tones. Intimate-area services are not offered.</p>
            <figure className={styles.treatmentPortrait}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/evergreen-portrait-monochrome-v1.webp" alt="Black-and-white portrait showing natural skin texture" width="1122" height="1402" loading="lazy" />
            </figure>
          </div>
          <div className={styles.areaList}>
            {areas.map(area => <article key={area.number}><span className={styles.areaNumber}>{area.number}</span><div><h3>{area.title}</h3><p>{area.text}</p></div></article>)}
            <a className={styles.lightLink} href="#contact">Join the interest list</a>
          </div>
        </section>

        <section className={styles.visit} id="first-visit" aria-labelledby="visit-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>02 / The first visit</p><h2 id="visit-title">Less wondering.<br /><em>More understanding.</em></h2><p>You don’t need to choose a treatment or session length before getting in touch. Here’s how we’ll get started when consultations open.</p></div>
          <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
          <div className={additions.visitNote}><p>Joining the interest list or completing forms does not book an appointment.</p><a className={styles.textLink} href="#preparation-aftercare">Preparation &amp; aftercare guide</a></div>
        </section>


        <section className={styles.practitioner} id="nav" aria-labelledby="nav-title">
          <div className={styles.practitionerIntro}><p className={styles.eyebrow}>03 / Your electrologist</p><h2 id="nav-title">Meet Nav.</h2><p className={styles.largeCopy}>A scientific foundation.<br />A personal approach.</p><p>Nav is a California-licensed electrologist with a degree in Microbiology from UC Davis. She completed her professional electrology training at California Electrology Academy in Corona.</p><p>Your consultation brings that background to your individual questions, treatment options, and next steps.</p></div>
          <dl className={styles.credentials}>
            <div><dt>Education</dt><dd>UC Davis<span>Microbiology</span></dd></div>
            <div><dt>Professional training</dt><dd>California Electrology Academy<span>Corona, California</span></dd></div>
            <div><dt>California licensure</dt><dd>Licensed electrologist</dd></div>
          </dl>
        </section>

        <section className={styles.ratesSection} id="rates" aria-labelledby="rates-title">
          <div className={styles.ratesIntro}>
            <p className={styles.eyebrow}>04 / Planning your visits</p>
            <h2 id="rates-title">Treatment rates</h2>
            <p>Together, we’ll choose a session length that fits your treatment area, goals, and comfort.</p>
          </div>
          <details className={styles.rateDisclosure}>
            <summary><span>View treatment rates</span><span className={styles.rateToggle} aria-hidden="true">+</span></summary>
            <div className={styles.rateSheet}>
              <TreatmentRates />
              <p>These are treatment rates. Consultation availability will be shared as opening approaches.</p>
            </div>
          </details>
        </section>

        <section className={styles.questions} id="questions" aria-labelledby="questions-title">
          <div><p className={styles.eyebrow}>05 / A little clarity</p><h2 id="questions-title">Good questions.<br /><em>Thoughtful answers.</em></h2><p>Understanding the process is part of feeling ready.</p></div>
          <div className={styles.answers}>{questions.map(question => <details key={question.title}><summary>{question.title}<span className={styles.plus} aria-hidden="true">+</span></summary><p>{question.text}{question.guide && <><br /><a className={additions.inlineLink} href="#preparation-aftercare">Read the preparation &amp; aftercare guide</a></>}</p></details>)}</div>
        </section>

        <section className={additions.guide} id="preparation-aftercare" aria-labelledby="guide-title">
          <div className={additions.guideHeader}>
            <p className={styles.eyebrow}>Your visit guide</p>
            <h2 id="guide-title">Preparation &amp; <em>aftercare.</em></h2>
            <p>A little preparation helps us plan your visit and care for your skin. This general guide supports the individual instructions Nav will provide for your treatment area, skin response, and products used.</p>
          </div>
          <div className={additions.guideColumns}>
            <div>
              <h3>Before your appointment</h3>
              <ul>
                <li>Complete your private questionnaire and consent. Tell Nav about changes in medicines, skin products, health, implants, or recent procedures before each visit.</li>
                <li>Leave enough visible hair for treatment. Avoid tweezing, waxing, or threading the area; ask Nav when to pause shaving or trimming.</li>
                <li>Arrive with gently cleansed skin, without makeup on the treatment area. Let Nav know about irritation, sunburn, broken skin, a rash, or illness before coming in.</li>
                <li>Discuss exfoliants, retinoids, and numbing products beforehand. Do not change prescribed medicine without your prescriber’s advice. Follow product directions; never cover an over-the-counter numbing product with plastic wrap.</li>
                <li>Bring your questions and tell Nav about comfort, positioning, or communication needs.</li>
              </ul>
            </div>
            <div>
              <h3>After treatment</h3>
              <p>Some temporary redness or tenderness can occur. The response varies by person and treatment area.</p>
              <ul>
                <li>Keep the area clean and handle it gently. Wash your hands before necessary contact; avoid rubbing, scratching, picking, or squeezing.</li>
                <li>For the first day, avoid makeup on the treated area, excessive sweating, tanning, and prolonged sun exposure. Continue avoiding activities or products that irritate the area, and follow the instructions provided for your visit.</li>
                <li>Use shade or protective clothing outdoors. Ask Nav about suitable skincare and when to resume exfoliation, active products, and your usual routine.</li>
                <li>Tell Nav about your skin’s response before the next appointment so she can review the treatment plan.</li>
              </ul>
            </div>
          </div>
          <div className={additions.guideHelp}>
            <h3>When to get help</h3>
            <p>Contact Nav about an unexpected reaction or symptoms that are not settling. Increasing redness, warmth, swelling or pain, pus, fever, blistering, or persistent bleeding need prompt medical advice; do not wait for a studio email reply. For breathing difficulty, collapse, or another emergency, call 911.</p>
            <p>For routine questions, <a href="mailto:nav@evergreenelectrolysisstudio.com">email Nav</a>. Keep detailed health information and photographs in the private process agreed with Nav.</p>
          </div>
          <details className={additions.sources}>
            <summary>Further reading</summary>
            <ul>
              <li><a href="https://electrology.com/faqs-about-permanent-hair-removal/what-is-the-electrolysis-process.php" target="_blank" rel="noopener noreferrer">American Electrology Association: treatment and aftercare</a></li>
              <li><a href="https://www.fda.gov/news-events/press-announcements/fda-warns-consumers-avoid-certain-topical-pain-relief-products-due-potential-dangerous-health" target="_blank" rel="noopener noreferrer">FDA: topical pain-relief product precautions</a></li>
              <li><a href="https://medlineplus.gov/ency/patientinstructions/000741.htm" target="_blank" rel="noopener noreferrer">MedlinePlus: skin healing and warning signs</a></li>
            </ul>
          </details>
        </section>

        <section className={styles.contact} id="contact" aria-labelledby="contact-title">
          <div className={styles.contactIntro}><div className={styles.contactCopy}><p className={styles.eyebrow}>06 / Coming summer 2027</p><h2 id="contact-title">Join the<br /><em>interest list.</em></h2><p>Be part of what’s next for Evergreen Electrolysis Studio. Leave your details for opening updates and first news of consultation availability.</p></div><div className={styles.location}><h3>Evergreen Electrolysis Studio</h3><p>American Canyon, California<br />Welcoming clients from Napa, Solano, and Marin counties.</p><dl><div><dt>Address</dt><dd>American Canyon, CA</dd></div><div><dt>Email Nav</dt><dd><a className={additions.email} href="mailto:nav@evergreenelectrolysisstudio.com">nav@evergreenelectrolysisstudio.com</a></dd></div><div><dt>Hours</dt><dd>Monday–Friday · 8am–4pm</dd></div></dl><p className={additions.contactNote}>Use email for general questions and appointment messages. Ask Nav how to share health information or photos privately.</p></div></div>
          <div className={styles.formWrap}><ConsultationForm tone="light" intent="interest" submitLabel="Join the interest list" heading="Your contact details" /></div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}><a href="#top">Evergreen<span>Electrolysis Studio</span></a><p>Personal care.<br />American Canyon, California.</p></div>
        <p className={styles.disclaimer}>Results and treatment timelines vary by individual. Suitability is assessed during consultation. Information on this site is educational and is not medical advice; consult a qualified healthcare professional about medical concerns.</p>
        <div className={styles.footerBottom}><span>Evergreen Electrolysis Studio</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
