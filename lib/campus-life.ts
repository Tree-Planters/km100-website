/**
 * Campus Life page content.
 *
 * Every story below is built on a real photograph from the 28 October 2026
 * launching, held in /public/gallery. Swap `image`, `imageAlt` and `caption`
 * together with the copy when new campus photographs arrive.
 */

export type CampusLifeSection = {
  slug: string;
  index: string;
  label: string;
  title: string;
  paragraphs: [string, string];
  facts: { label: string; value: string }[];
  image: string;
  imageAlt: string;
  caption: string;
};

export const campusLifeFacts = [
  { value: 28, label: "October 2026 launch day" },
  { value: 11, label: "NC II graduates" },
  { value: 4, label: "partner sectors on the pledge" },
  { value: 3, label: "flags at the campus flagpole" },
];

export const campusLifeSections: CampusLifeSection[] = [
  {
    slug: "campus-opening",
    index: "01",
    label: "The opening",
    title: "The campus opened on 28 October",
    paragraphs: [
      "Guests from the Bogo City local government, TESDA Region VII and DOLE joined the KM100 management, the Board of Directors, the academe and industry partners under the school banner for the official launching of the PQF Level 5 Diploma Programs.",
      "The morning began with a flag raising and the national anthem, a blessing of the building, and messages from the guests of honour. The ribbon went up between two balloon towers at the entrance, where the programme photographs were taken.",
    ],
    facts: [
      { label: "Date", value: "28 October 2026" },
      { label: "Opening", value: "Flag raising, 8:00 AM" },
      { label: "Ribbon", value: "Cut at the main entrance" },
      { label: "Guests", value: "Bogo City LGU, TESDA, DOLE" },
    ],
    image: "/gallery/ceremony-ribbon-cutting-02.jpg",
    imageAlt:
      "Four guests cutting the red ribbon between two balloon towers in front of the KM100 building, with the school banner overhead",
    caption: "The ribbon cutting at the campus entrance, 28 October 2026.",
  },
  {
    slug: "laboratories",
    index: "02",
    label: "The laboratories",
    title: "Two laboratory doors opened the same morning",
    paragraphs: [
      "The Computer Systems Servicing NC II and Bread & Pastry Production NC II laboratories sit on the ground floor of the main building. Each one was blessed and opened with its own ribbon, cut by the guests of honour while the rest of the party looked on.",
      "These are the rooms the diploma programs train in: the benches, the ovens and the service areas students will use from their first week. Tours ran through the building after the programme so guests could see the training areas set up.",
    ],
    facts: [
      { label: "Laboratory A", value: "Computer Systems Servicing NC II" },
      { label: "Laboratory B", value: "Bread & Pastry Production NC II" },
      { label: "Location", value: "Ground floor, main building" },
      { label: "Ribbon", value: "Cut by four guests" },
    ],
    image: "/gallery/ceremony-ribbon-cutting-01.jpg",
    imageAlt:
      "Four guests holding a red ribbon with a large bow in front of the Bread & Pastry Production NC II laboratory doorway",
    caption: "The Bread & Pastry Production NC II laboratory doorway.",
  },
  {
    slug: "first-graduates",
    index: "03",
    label: "The graduates",
    title: "Eleven graduates collected the first NC II certificates",
    paragraphs: [
      "Before the diploma programs opened, the school's Sugbo Kahanas trainees finished their National Certificate II in Computer Systems Servicing. Eleven of them posed with their certificates in front of the launching backdrop, and the awards were made through the office of PB Celestino Martinez III.",
      "The same afternoon, DOLE turned over its Job Placement Office to the school, so graduates can be matched with partner employers from inside the building.",
    ],
    facts: [
      { label: "Award", value: "National Certificate II" },
      { label: "Qualification", value: "Computer Systems Servicing NC II" },
      { label: "Graduates", value: "Eleven at the launch" },
      { label: "Awarded through", value: "Office of PB Celestino Martinez III" },
    ],
    image: "/gallery/ceremony-nc2-graduates-03.jpg",
    imageAlt:
      "Eleven graduates holding their National Certificate II certificates in front of the PQF Level 5 Diploma Programs launching backdrop",
    caption: "The first NC II graduates at the launching backdrop.",
  },
  {
    slug: "partners",
    index: "04",
    label: "The partners",
    title: "Industry, academe and community partners signed the pledge",
    paragraphs: [
      "The Pledge of Commitment and Support board stood beside the launching backdrop all morning. Representatives from industry, the academe, private sponsors and community partners added their names to it, alongside the school's own commitment to technical-vocational education and the diploma programs.",
      "The signatures are the part of the launch that carries past the ceremony: they are the partners the school will place students with for immersion, and the offices that will take its graduates on.",
    ],
    facts: [
      { label: "Document", value: "Pledge of Commitment and Support" },
      { label: "Sectors", value: "Industry, academe, sponsors, community" },
      { label: "Also turned over", value: "DOLE Job Placement Office" },
      { label: "Signed at", value: "The launching, 28 October 2026" },
    ],
    image: "/gallery/ceremony-pledge-signing-08.jpg",
    imageAlt:
      "A partner signing the Pledge of Commitment and Support board in front of the PQF Level 5 launching backdrop",
    caption: "Adding a signature to the Pledge of Commitment and Support.",
  },
];
