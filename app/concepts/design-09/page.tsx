import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/newsreader/wght.css";
import ConsultationForm from "../../components/ConsultationForm";
import TreatmentRates from "../../components/TreatmentRates";
import styles from "./design09.module.css";

const url = "https://tycheventuresllc.com/canyon-and-vine-electrology/concepts/design-09/";
const image = "https://tycheventuresllc.com/canyon-and-vine-electrology/quiet-practice-hero.jpg?v=d04-20261111";
const description = "Feel at home in your skin. Thoughtful electrolysis care in American Canyon, California. Evergreen Electrolysis Studio is coming summer 2027; join the interest list.";

export const metadata: Metadata = {
  title: "At Home in Your Skin | Evergreen Electrolysis Studio",
  description,
  alternates: { canonical: url },
  robots: { index: false, follow: true },
  openGraph: {
    title: "At Home in Your Skin | Evergreen Electrolysis Studio", description, url, type: "website",
    images: [{ url: image, width: 1586, height: 992, alt: "Portrait of a woman against a dark background" }],
  },
  twitter: { card: "summary_large_image", title: "At Home in Your Skin | Evergreen Electrolysis Studio", description, images: [image] },
};

const areas = [
  { number: "01", title: "Face & neck", text: "Upper lip, chin, jawline, cheeks, sideburns, brows and between brows, hairline, temples, ears and nose exterior, neck and nape." },
  { number: "02", title: "Selected body areas", text: "Underarms, arms and hands, legs and feet, chest and abdomen, shoulders and back. Choose the area that matters to you." },
  { number: "03", title: "The finishing details", text: "Isolated persistent hairs, careful shaping, and hairs remaining after other removal methods. Small areas deserve a considered plan, too." },
];

const steps = [
  { title: "A conversation first.", text: "Bring your goals and questions. Talk with Nav about the area, your previous hair removal, and what you hope to change." },
  { title: "Get to know the process.", text: "Review your hair and skin, discuss suitability, and try a small test treatment if appropriate. There is room to ask questions." },
  { title: "A next step that makes sense.", text: "Discuss session length, appointment spacing, preparation, aftercare, and costs before deciding how to move forward." },
];

const questions = [
  { title: "How does electrolysis remove hair?", text: "A fine probe follows the natural opening of an individual hair follicle. A small electrical current treats the hair-growth cells. Galvanic uses a chemical reaction, thermolysis uses heat, and blend combines the two. The method and settings are selected for the hair, skin, and area." },
  { title: "Does my hair color or skin tone matter?", text: "Electrolysis does not depend on hair pigment. It can treat every natural hair color, including blonde, red, gray, and white, across skin tones. Your consultation is the place to discuss your skin, hair, and individual suitability." },
  { title: "Why is more than one visit needed?", text: "Hair grows in cycles, and not every hair is ready to treat at the same time. The amount and structure of hair, previous removal methods, hormones, and appointment consistency affect the course of treatment. Your schedule is reviewed as you go; there is no single timeline for everyone." },
  { title: "What does a treatment feel like?", text: "You may feel brief heat, a pinch, or a sting. Sensitivity varies with the person and the area. Discuss comfort with Nav; a small test treatment, when appropriate, can help you understand the sensation before a longer session." },
  { title: "What should I know before and after a visit?", text: "Ask Nav how much visible growth to leave, pause tweezing, waxing, and threading, and arrive with clean skin. Discuss medications and recent skin treatments at your consultation. Temporary redness or tenderness can follow treatment. Follow your individual aftercare guidance and seek medical advice for severe or unexpected symptoms." },
  { title: "Can we discuss hair associated with hormonal changes?", text: "Yes. Visible hair associated with hormonal changes, including PCOS or menopause, can be part of your treatment discussion. Electrolysis removes hair; it does not diagnose or treat the underlying condition. Medical concerns belong with your healthcare professional." },
];

export default function AtHomeInYourSkin() {
  return (
    <div className={styles.page} id="top">
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.archiveBar}>
        <Link href="/concepts/">← All designs</Link>
        <span>09 / At Home in Your Skin</span>
      </div>
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
            <img src="/quiet-practice-hero.jpg?v=d04-20261111" alt="Portrait of a woman against a dark background" width="1586" height="992" loading="eager" fetchPriority="high" />
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
              <img src="/editorial-portrait-v2.jpg?v=d04-20261111" alt="Portrait showing natural skin texture" width="1122" height="1402" loading="lazy" />
            </figure>
          </div>
          <div className={styles.areaList}>
            {areas.map(area => <article key={area.number}><span className={styles.areaNumber}>{area.number}</span><div><h3>{area.title}</h3><p>{area.text}</p></div></article>)}
            <a className={styles.lightLink} href="#contact">Join the interest list</a>
          </div>
        </section>

        <section className={styles.visit} id="first-visit" aria-labelledby="visit-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>02 / The first visit</p><h2 id="visit-title">Less wondering.<br /><em>More understanding.</em></h2><p>You don’t need to know which treatment or session length to choose before getting in touch.</p></div>
          <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
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
            <p>Sessions are priced by time. Nav will help you choose a length that suits your treatment area and goals.</p>
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
          <div className={styles.answers}>{questions.map(question => <details key={question.title}><summary>{question.title}<span className={styles.plus} aria-hidden="true">+</span></summary><p>{question.text}</p></details>)}</div>
        </section>

        <section className={styles.contact} id="contact" aria-labelledby="contact-title">
          <div className={styles.contactIntro}><div className={styles.contactCopy}><p className={styles.eyebrow}>06 / Coming summer 2027</p><h2 id="contact-title">Join the<br /><em>interest list.</em></h2><p>Be part of what’s next for Evergreen Electrolysis Studio. Leave your details for opening updates and first news of consultation availability.</p></div><div className={styles.location}><h3>Evergreen Electrolysis Studio</h3><p>American Canyon, California<br />Serving nearby Napa–Solano communities.</p><dl><div><dt>Address</dt><dd>American Canyon, CA</dd></div><div><dt>Phone</dt><dd></dd></div><div><dt>Hours</dt><dd>Monday–Friday · 8am–4pm</dd></div></dl></div></div>
          <div className={styles.formWrap}><ConsultationForm tone="light" intent="interest" submitLabel="Join the interest list" heading="Your contact details" /></div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}><a href="#top">Evergreen<span>Electrolysis Studio</span></a><p>Personal care.<br />American Canyon, California.</p></div>
        <p className={styles.disclaimer}>Results and treatment timelines vary by individual. Suitability is assessed during consultation. Information on this site is educational and is not medical advice; consult a qualified healthcare professional about medical concerns.</p>
        <div className={styles.footerBottom}><span>Design 09 · At Home in Your Skin</span><Link href="/concepts/">Compare all designs</Link><Link href="/">Current homepage</Link><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
