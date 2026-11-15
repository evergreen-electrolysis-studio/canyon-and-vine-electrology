import ConsultationForm from "../../components/ConsultationForm";
import TreatmentRates, { treatmentRateSummary } from "../../components/TreatmentRates";
import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/manrope/wght.css";
import styles from "./design06.module.css";

const url = "https://tycheventuresllc.com/canyon-and-vine-electrology/concepts/design-06/";
const image = "https://tycheventuresllc.com/canyon-and-vine-electrology/clear-path-botanical.jpg";
const description = "Permanent hair removal in American Canyon with Nav, a California-licensed electrologist. Clear answers, individual treatment planning, and a thoughtful first visit.";

export const metadata: Metadata = {
  title: "The Clear Path | Evergreen Electrolysis",
  description,
  alternates: { canonical: url },
  robots: { index: false, follow: true },
  openGraph: {
    title: "The Clear Path | Evergreen Electrolysis", description, url, type: "website",
    images: [{ url: image, width: 1122, height: 1402, alt: "Ginkgo leaves in a blue glass vase, casting soft shadows" }],
  },
  twitter: { card: "summary_large_image", title: "The Clear Path | Evergreen Electrolysis", description, images: [image] },
};

const areas = [
  { number: "01", name: "Face & neck", intro: "From a few persistent hairs to a broader area.", detail: "Upper lip, chin, jawline, cheeks, sideburns, brows, hairline, and neck. Discuss the area that matters to you and the shape or coverage you have in mind." },
  { number: "02", name: "Selected body areas", intro: "An individual plan for the area you choose.", detail: "Underarms, shoulders, chest, back, abdomen, arms, hands, legs, feet, and toes. Treatment time and spacing depend on the area, hair density, and your response." },
  { number: "03", name: "Precision & finishing", intro: "Focused attention on the smaller details.", detail: "Isolated hairs, grooming, and careful shaping. A consultation helps identify a practical starting point and whether a short or extended session fits your goals." },
];
const questions = [
  { question: "Can light or gray hair be treated?", answer: "Yes. Electrolysis does not depend on pigment, so it can treat blonde, red, gray, and white hairs as well as dark hair. It is used across skin tones; your individual suitability is assessed at consultation." },
  { question: "How many appointments will I need?", answer: "Expect a series, with a schedule tailored to you. Hair grows in cycles, so the hair visible today is only part of the picture. The area, hair density, previous removal methods, and hormonal influences all affect the course of treatment. A fixed completion date cannot be promised." },
  { question: "What does a treatment feel like?", answer: "You may feel brief warmth, stinging, or a pinch. Sensitivity varies by person and treatment area. A small test treatment, when appropriate, can help you understand the sensation and discuss comfort before planning longer appointments." },
  { question: "What if my hair growth is hormonal?", answer: "Electrolysis can treat existing unwanted hair, including hair associated with PCOS or menopause. It does not diagnose or treat hormonal conditions, and hormonal changes can influence new growth. Bring medical questions to a qualified healthcare professional." },
  { question: "How are appointments priced?", answer: `${treatmentRateSummary}. All prices are in USD. Session length and your course of treatment determine the overall cost. Discuss recommended appointment lengths and scheduling at your consultation before committing to a plan.` },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function ClearPath() {
  return (
    <div className={styles.page} id="top">
      <a className={styles.skip} href="#main-content">Skip to content</a>
      <div className={styles.archiveBar}><Link href="/concepts/">← Compare all designs</Link><span>06 / The Clear Path</span></div>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="Evergreen Electrolysis, top of page">evergreen<span>ELECTROLYSIS</span></a>
        <nav className={styles.navigation} aria-label="Primary navigation"><a href="#treatment">Treatment</a><a href="#meet-nav">Meet Nav</a><a href="#your-path">Your first visit</a><a href="#questions">Questions</a></nav>
        <a className={styles.headerCta} href="#begin">Let’s begin <Arrow /></a>
      </header>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Permanent hair removal / American Canyon, CA</p>
            <h1 id="hero-title">A clear way<br /><span>forward.</span></h1>
            <p className={styles.heroIntro}>Less uncertainty. More understanding.<br />Electrolysis with a personal plan, guided by Nav.</p>
            <a className={styles.button} href="#begin">Start with a consultation <Arrow /></a>
            <a className={styles.heroLink} href="#treatment">Get to know electrolysis <span aria-hidden="true">↓</span></a>
            <div className={styles.heroFoot}><span>Individual care.</span><span>One follicle at a time.</span></div>
          </div>
          <div className={styles.heroImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/clear-path-botanical.jpg" alt="Ginkgo leaves in a blue glass vase, casting soft shadows" width="1122" height="1402" loading="eager" fetchPriority="high" />
          </div>
        </section>

        <div className={styles.orientation} aria-label="Explore the practice"><p>A thoughtful place<br /> to start.</p><a href="#treatment"><span>01</span> Understand your options <Arrow /></a><a href="#meet-nav"><span>02</span> Know your practitioner <Arrow /></a><a href="#your-path"><span>03</span> See what comes next <Arrow /></a></div>

        <section className={styles.treatment} id="treatment" aria-labelledby="treatment-title">
          <div className={styles.sectionIntro}><p className={styles.eyebrow}>01 / The treatment</p><h2 id="treatment-title">Small areas.<br />Personal priorities.</h2><p>Electrolysis treats individual hair follicles using a fine probe and a controlled electrical current. Your plan begins with the hair you want to address.</p><a className={styles.textLink} href="#how-it-works">How it works <span aria-hidden="true">↓</span></a></div>
          <div className={styles.areas}>{areas.map(area => <details key={area.number}><summary><span className={styles.number}>{area.number}</span><span><strong>{area.name}</strong><small>{area.intro}</small></span><span className={styles.plus} aria-hidden="true">+</span></summary><div className={styles.areaContent}><p>{area.detail}</p><a className={styles.textLink} href="#begin">Discuss this at your consultation <Arrow /></a></div></details>)}<p className={styles.scope}>Intimate-area services are not offered. All treatment areas are subject to consultation and individual suitability.</p></div>
        </section>

        <section className={styles.method} id="how-it-works" aria-labelledby="method-title">
          <div><p className={styles.eyebrow}>The science, simply</p><h2 id="method-title">At the follicle.<br />Beyond the surface.</h2></div>
          <div className={styles.methodCopy}><p>A fine probe follows the follicle’s natural opening. A small electrical current treats the cells responsible for hair growth, and the treated hair is removed.</p><p>Because treatment does not rely on hair pigment, electrolysis can address light and dark hair across skin tones. A series of visits makes room for hair growth cycles.</p><details><summary>Three methods. One individual plan.<span className={styles.plus} aria-hidden="true">+</span></summary><dl><div><dt>Galvanic</dt><dd>Uses a chemical reaction in the follicle.</dd></div><div><dt>Thermolysis</dt><dd>Uses heat to treat the follicle.</dd></div><div><dt>Blend</dt><dd>Combines galvanic current and thermolysis.</dd></div></dl><p>Nav will discuss the approach and settings appropriate to your treatment.</p></details><a className={styles.textLink} href="https://www.barbercosmo.ca.gov/forms_pubs/publications/electrology.pdf">California’s guide to electrology <span className={styles.pdf}>(PDF)</span> <Arrow /></a></div>
        </section>

        <section className={styles.practitioner} id="meet-nav" aria-labelledby="nav-title">
          <div className={styles.navHeading}><p className={styles.eyebrow}>02 / Meet your electrologist</p><h2 id="nav-title">Careful by nature.<br />Informed by science.</h2><p>Meet Nav.<br />California-licensed electrologist.</p></div>
          <div className={styles.navBody}><p className={styles.navLead}>A scientific foundation.<br />A personal conversation.</p><p>Nav earned her bachelor’s degree in Microbiology from UC Davis and completed professional electrology training at California Electrology Academy in Corona. She brings that foundation to a practice centered on careful observation and individual treatment planning.</p><p>Your questions, treatment history, and priorities belong in the conversation from the beginning.</p><dl className={styles.credentials}><div><dt>Education</dt><dd>B.S. Microbiology<br />UC Davis</dd></div><div><dt>Professional training</dt><dd>California Electrology Academy<br />Corona, California</dd></div><div><dt>California licensure</dt><dd>License number: [ADD NUMBER]</dd></div></dl></div>
        </section>

        <section className={styles.journey} id="your-path" aria-labelledby="journey-title">
          <div className={styles.journeyHeading}><div><p className={styles.eyebrow}>03 / Your first visit</p><h2 id="journey-title">A next step you<br />can understand.</h2></div><p>You don’t need to arrive with a treatment plan.<br />That is what the conversation is for.</p></div>
          <ol className={styles.steps}><li><span>01</span><h3>Talk it through.</h3><p>Share your goals, previous hair-removal methods, skin concerns, and relevant health information. Ask the questions on your mind.</p></li><li><span>02</span><h3>Get a feel for it.</h3><p>When appropriate, a small test treatment introduces the sensation and helps inform a suitable approach.</p></li><li><span>03</span><h3>Make a plan.</h3><p>Discuss session length, spacing, fees, preparation, and aftercare. Leave with a clearer understanding of what comes next.</p></li></ol>
          <div className={styles.care}><div><span className={styles.eyebrow}>Before your appointment</span><h3>A little preparation.</h3><p>Ask how much visible hair to leave. Pause tweezing, waxing, and threading in the area, and discuss medications or recent skin treatments with Nav.</p></div><div><span className={styles.eyebrow}>After your appointment</span><h3>Give your skin some care.</h3><p>Temporary redness or irritation can occur. Follow your individual aftercare instructions. Contact a healthcare professional promptly for severe or unexpected symptoms.</p></div></div>
        </section>

        <section className={styles.pricingSection} id="pricing" aria-labelledby="pricing-title">
          <div className={styles.pricingIntro}><p className={styles.eyebrow}>Treatment pricing</p><h2 id="pricing-title">Clear prices.<br />A personal plan.</h2><p>Appointments are priced by time. Nav will help you choose a session length based on your treatment area and plan. Total cost depends on the course of treatment.</p></div>
          <TreatmentRates />
        </section>

        <section className={styles.faq} id="questions" aria-labelledby="faq-title"><div><p className={styles.eyebrow}>Before you decide</p><h2 id="faq-title">Good questions.<br />Clear answers.</h2><p>A little understanding can make the first step feel more familiar.</p></div><div>{questions.map(item => <details key={item.question}><summary>{item.question}<span className={styles.plus} aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>

        <section className={styles.begin} id="begin" aria-labelledby="begin-title">
          <div className={styles.beginHeading}>
            <p className={styles.eyebrow}>Your next step / American Canyon</p><h2 id="begin-title">Let’s start<br />with you.</h2><p>A consultation is a place to talk about your goals, understand the treatment, and consider a plan. Send your request using the form, and we’ll contact you.</p>
            <div className={styles.practical}><h3>Plan your visit</h3><dl><div><dt>Location</dt><dd>American Canyon, California<br />Address: [ADD STUDIO ADDRESS]</dd></div><div><dt>Phone</dt><dd>[ADD PHONE NUMBER]</dd></div><div><dt>Hours</dt><dd>[ADD BUSINESS HOURS]</dd></div></dl><details><summary>Your consultation checklist<span className={styles.plus} aria-hidden="true">+</span></summary><ul><li>The area you would like to treat</li><li>Your recent hair-removal routine</li><li>Relevant medications and skin treatments</li><li>Questions about comfort, time, and cost</li></ul></details></div>
          </div>
          <ConsultationForm tone="light" />
        </section>
      </main>
      <footer className={styles.footer}><div className={styles.footerTop}><a className={styles.wordmark} href="#top">evergreen<span>ELECTROLYSIS</span></a><p>American Canyon, California<br />Serving the Napa–Solano community.</p><Link className={styles.textLink} href="/concepts/">Compare all designs <Arrow /></Link></div><p className={styles.disclaimer}>Results and treatment timelines vary by individual and cannot be guaranteed. This website provides general information only and is not medical advice. Services are subject to consultation and individual suitability; consult a qualified healthcare professional about medical conditions or medications.</p><div className={styles.footerEnd}><span>© 2026 Evergreen Electrolysis</span><span>Design 06 · The Clear Path</span><a href="#top">Back to top ↑</a></div></footer>
    </div>
  );
}
