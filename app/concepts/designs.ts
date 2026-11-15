export type WebsiteConcept = {
  id: string;
  title: string;
  direction: string;
  description: string;
  href: string;
  released: string;
  status: "Current homepage" | "Alternate concept" | "Archived concept";
};

export const websiteConcepts: WebsiteConcept[] = [
  {
    id: "01",
    title: "Classic Monochrome",
    direction: "Editorial · precise · established",
    description:
      "The original launch-ready homepage with a high-contrast black-and-white treatment, comprehensive services, and detailed education.",
    href: "/concepts/design-01/",
    released: "July 2026",
    status: "Archived concept",
  },
  {
    id: "02",
    title: "Wine Country Journal",
    direction: "Warm editorial · local · personal",
    description:
      "A quieter magazine-inspired concept with an easier first-visit path, practical preparation and aftercare, and a warmer Napa–Solano sense of place.",
    href: "/concepts/design-02/",
    released: "November 2026",
    status: "Alternate concept",
  },
  {
    id: "03",
    title: "Portrait of Precision",
    direction: "Human · science-led · conversion-first",
    description:
      "A visually confident flagship concept with larger type, a persistent consultation path, clear treatment education, and Nav’s scientific background at the center.",
    href: "/concepts/design-03/",
    released: "November 2026",
    status: "Alternate concept",
  },
  {
    id: "04",
    title: "The Quiet Practice",
    direction: "Photograph-led · restrained · specific",
    description:
      "A premium editorial direction with a disciplined evergreen palette, practical treatment guidance, and a direct consultation request path.",
    href: "/concepts/design-04/",
    released: "November 2026",
    status: "Alternate concept",
  },
  {
    id: "05",
    title: "The Everyday Edit",
    direction: "Warm modern · personal · clear",
    description:
      "An apricot-and-burgundy direction with expressive type, a sunlit portrait, clear treatment choices, and a reassuring first-visit guide.",
    href: "/concepts/design-05/",
    released: "November 12, 2026",
    status: "Alternate concept",
  },
  {
    id: "06",
    title: "The Clear Path",
    direction: "Cool modern · considered · reassuring",
    description:
      "A mist-blue and deep-ink direction with sculptural botanical imagery, a clear consultation roadmap, and an emphasis on informed, individual care.",
    href: "/concepts/design-06/",
    released: "November 14, 2026",
    status: "Alternate concept",
  },
];
