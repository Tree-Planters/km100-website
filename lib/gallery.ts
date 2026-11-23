/**
 * Gallery content.
 *
 * Everything on /gallery is driven by this file: the tab bar reads
 * `galleryCategories`, and the grid reads `galleryPhotos`.
 *
 * To add a real photo:
 *   1. Drop the file into public/images/gallery/
 *   2. Copy an entry in `galleryPhotos` and change `src`, `alt`, `caption`,
 *      `category` and `date`
 *
 * `category` must match a `slug` from `galleryCategories`. Delete a photo by
 * deleting its entry; the page count and pagination update themselves.
 *
 * NOTE: some of the images below are mock photographs for layout review. Swap
 * them for real campus photos before publishing. The October 2026 launching
 * photographs live in /public/gallery and are named after what they show.
 */

export type GalleryCategory = {
  /** Used by photos and by the tab bar; keep it lowercase and short. */
  slug: string;
  /** Tab label. */
  label: string;
};

export const galleryCategories = [
  { slug: "campus", label: "Campus & facilities" },
  { slug: "classrooms", label: "Classrooms & laboratories" },
  { slug: "training", label: "Practical training" },
  { slug: "activities", label: "Student activities" },
  { slug: "events", label: "Events & celebrations" },
  { slug: "community", label: "School community" },
] as const satisfies readonly GalleryCategory[];

export type GalleryCategorySlug = (typeof galleryCategories)[number]["slug"];

export type GalleryPhoto = {
  id: string;
  /** Path under /public. */
  src: string;
  /** Describes the photo for screen readers and broken-image cases. */
  alt: string;
  /** Shown under the photo. */
  caption: string;
  category: GalleryCategorySlug;
  /** Shown on the right of the caption, e.g. "March 2026". */
  date: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "ceremony-flags",
    src: "/gallery/ceremony-flags.jpg",
    alt: "The KM100 flag, the Philippine flag and the TESDA flag against the evening sky",
    caption:
      "The flags over the campus on October 28, 2026, the day we launched our PQF Level 5 Diploma Programs.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-flag-raising",
    src: "/gallery/ceremony-flag-raising.jpg",
    alt: "A staff member raising the Philippine flag at the campus flagpole while guests watch",
    caption: "Flag raising to open the programme.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-flag-raising-crowd",
    src: "/gallery/ceremony-flag-raising-crowd.jpg",
    alt: "Guests and staff standing in the yard in front of the KM100 building for the flag raising",
    caption: "Guests and staff gather for the flag raising.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-national-anthem",
    src: "/gallery/ceremony-national-anthem.jpg",
    alt: "Three guests standing at attention with hands on their chests beside a floral wreath",
    caption: "The national anthem, sung beside the floral offerings.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-blessing",
    src: "/gallery/ceremony-blessing.jpg",
    alt: "A pastor holding a Bible and a microphone beside a floral wreath while leading the blessing",
    caption:
      "The blessing of the school building, officiated by Pastor Rene Ancajas.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-ribbon-cutting-01",
    src: "/gallery/ceremony-ribbon-cutting-01.jpg",
    alt: "Four guests cutting a red ribbon between two balloon towers at the laboratory doorway",
    caption: "Cutting the ribbon at the Bread & Pastry Production NC II laboratory.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-ribbon-cutting-02",
    src: "/gallery/ceremony-ribbon-cutting-02.jpg",
    alt: "The ribbon cutting party in front of the KM100 building with floral wreaths on either side",
    caption: "The ribbon cutting, with the campus banner overhead.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-ribbon-preview",
    src: "/gallery/ceremony-ribbon-preview.jpg",
    alt: "Guests talking beside the ribbon and balloon decorations before the cutting",
    caption: "Checking the ribbon before the ceremony.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-welcome-remarks",
    src: "/gallery/ceremony-welcome-remarks.jpg",
    alt: "A host speaking into a microphone in front of the PQF Level 5 launching backdrop",
    caption: "Welcome remarks to open the programme.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-tesda-message",
    src: "/gallery/ceremony-tesda-message.jpg",
    alt: "A TESDA official in a blue polo shirt speaking to the guests",
    caption:
      "A message from TESDA Region VII, one of the guests of honour from the Bogo City LGU, TESDA and DOLE.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guest-message",
    src: "/gallery/ceremony-guest-message.jpg",
    alt: "A guest speaker in a striped shirt addressing the gathering",
    caption: "A message from one of our guests of honour.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guest-message-portrait",
    src: "/gallery/ceremony-guest-message-portrait.jpg",
    alt: "The guest speaker mid-sentence during his message",
    caption: "The same message, seen from the side.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-speaker-lectern",
    src: "/gallery/ceremony-speaker-lectern.jpg",
    alt: "A guest at the lectern addressing the audience seated at banquet tables",
    caption: "Remarks from the lectern.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-speaker-podium",
    src: "/gallery/ceremony-speaker-podium.jpg",
    alt: "A speaker at the podium beside the KM100 backdrop and indoor plants",
    caption: "A message from the KM100 management.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-outdoor-remarks",
    src: "/gallery/ceremony-outdoor-remarks.jpg",
    alt: "A man speaking into a microphone outside the entrance, with balloons and a wreath behind him",
    caption: "Remarks at the campus entrance.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-audience",
    src: "/gallery/ceremony-audience.jpg",
    alt: "Guests seated at round tables listening to the programme in the function room",
    caption:
      "The academe, business sector, civic organizations, KM100 management and the Board of Directors in attendance.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-01",
    src: "/gallery/ceremony-pledge-signing-01.jpg",
    alt: "A guest writing his name on the Pledge of Commitment and Support board",
    caption: "Signing the Pledge of Commitment and Support.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-02",
    src: "/gallery/ceremony-pledge-signing-02.jpg",
    alt: "Another guest signing the pledge board in front of the launching banner",
    caption: "Partners adding their names to the pledge.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-03",
    src: "/gallery/ceremony-pledge-signing-03.jpg",
    alt: "A guest in a patterned dress signing the pledge board while others watch",
    caption: "Signing the pledge of commitment.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-04",
    src: "/gallery/ceremony-pledge-signing-04.jpg",
    alt: "A guest signing the pledge board, seen close up",
    caption: "Another signature on the pledge board.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-05",
    src: "/gallery/ceremony-pledge-signing-05.jpg",
    alt: "A guest in a grey blouse signing the pledge board",
    caption: "The pledge board fills up.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-06",
    src: "/gallery/ceremony-pledge-signing-06.jpg",
    alt: "A guest in a white shirt signing the pledge board with two guests watching",
    caption: "Academe partners sign the pledge.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-07",
    src: "/gallery/ceremony-pledge-signing-07.jpg",
    alt: "A guest signing the Pledge of Commitment and Support board beside a colleague",
    caption: "Industry partners sign the pledge.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-pledge-signing-08",
    src: "/gallery/ceremony-pledge-signing-08.jpg",
    alt: "A man in a maroon and white jersey signing the pledge board in front of the launching banner",
    caption:
      "Signing the shared commitment to technical-vocational education and our diploma programs.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-nc2-graduates-01",
    src: "/gallery/ceremony-nc2-graduates-01.jpg",
    alt: "Eight graduates holding their National Certificate II in front of the launching backdrop",
    caption:
      "National Certificate II (Computer Systems Servicing) for our Sugbo Kahanas graduates.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-nc2-graduates-02",
    src: "/gallery/ceremony-nc2-graduates-02.jpg",
    alt: "The same group of graduates posing with their certificates",
    caption: "Another frame with the NC II graduates.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-nc2-graduates-03",
    src: "/gallery/ceremony-nc2-graduates-03.jpg",
    alt: "Eleven graduates holding certificates in front of the PQF Level 5 Diploma Programs banner",
    caption:
      "The NC II awards were made through the office of PB Celestino Martinez III.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-certificates-backdrop",
    src: "/gallery/ceremony-certificates-backdrop.jpg",
    alt: "Guests holding certificates in front of the launching backdrop",
    caption: "Certificates presented during the programme.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-toast",
    src: "/gallery/ceremony-toast.jpg",
    alt: "Guests raising wine glasses in a toast, certificates in hand",
    caption: "A toast to the launch.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-toast-certificates",
    src: "/gallery/ceremony-toast-certificates.jpg",
    alt: "Guests toasting with certificates and a DOLE Job Placement sign",
    caption: "Toasting the graduates and the DOLE Job Placement Office.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-toast-nc2",
    src: "/gallery/ceremony-toast-nc2.jpg",
    alt: "Guests raising glasses with their certificates in front of the PQF Level 5 banner",
    caption: "Celebrating the school's first NC II awards.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-job-placement-turnover",
    src: "/gallery/ceremony-job-placement-turnover.jpg",
    alt: "Guests holding a DOLE Job Placement Office placard during the turnover",
    caption: "Turnover of the DOLE Job Placement Office.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-faculty-backdrop",
    src: "/gallery/ceremony-faculty-backdrop.jpg",
    alt: "Seven members of the KM100 community posing in front of the launching backdrop",
    caption: "The KM100 community at the launching backdrop.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-backdrop",
    src: "/gallery/ceremony-guests-backdrop.jpg",
    alt: "Three guests posing in front of the launching backdrop",
    caption: "Guests of honour at the backdrop.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-backdrop-02",
    src: "/gallery/ceremony-guests-backdrop-02.jpg",
    alt: "Four guests posing in front of the PQF Level 5 launching backdrop",
    caption: "More guests at the PQF Level 5 backdrop.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-table-01",
    src: "/gallery/ceremony-guests-table-01.jpg",
    alt: "Guests seated around a banquet table with a floral centrepiece",
    caption: "Guests at the banquet tables.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-table-02",
    src: "/gallery/ceremony-guests-table-02.jpg",
    alt: "Guests at a long table set with wine glasses and flowers",
    caption: "Lunch after the programme.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-table-03",
    src: "/gallery/ceremony-guests-table-03.jpg",
    alt: "Five guests posing at their table in the function room",
    caption: "Guests at their table during the launch lunch.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-table-04",
    src: "/gallery/ceremony-guests-table-04.jpg",
    alt: "A table of guests posing with the launching banner behind them",
    caption: "Guests at the launch lunch.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-table-05",
    src: "/gallery/ceremony-guests-table-05.jpg",
    alt: "Guests at the head table posing for a photograph",
    caption: "The head table.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-guests-table-06",
    src: "/gallery/ceremony-guests-table-06.jpg",
    alt: "A table of guests posing over plated food",
    caption: "The KM100 team at lunch.",
    category: "events",
    date: "October 2026",
  },
  {
    id: "ceremony-staff-lineup",
    src: "/gallery/ceremony-staff-lineup.jpg",
    alt: "KM100 staff in uniform standing in line outside the building",
    caption: "The KM100 staff, ready for the programme.",
    category: "events",
    date: "October 2026",
  },
];
