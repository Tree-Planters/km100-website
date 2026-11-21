/**
 * Campus Life page content.
 *
 * Mock/draft copy for layout preview. Confirm the organizations, dates and
 * service figures with KM100 before publishing.
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
  { value: 12, label: "student organizations" },
  { value: 4, label: "training laboratories" },
  { value: 15, label: "school events a year" },
  { value: 1200, label: "service hours logged" },
];

export const campusLifeSections: CampusLifeSection[] = [
  {
    slug: "student-activities",
    index: "01",
    label: "Student activities",
    title: "Twelve organizations, all student-run",
    paragraphs: [
      "Every program has its own organizations, and each one keeps a calendar, a budget and a set of officers. A faculty adviser signs off on plans. Students book the rooms, write the proposals and run the meetings.",
      "Meetings start after the last class block, between four and six, so they don't cut into shop time.",
    ],
    facts: [
      { label: "Student Council", value: "Mondays, 4:30 PM" },
      { label: "Robotics and Automation Club", value: "Tuesdays, Lab 2" },
      { label: "Culinary and Hospitality Society", value: "Thursdays, kitchen" },
      { label: "The Workbench, campus paper", value: "Fridays, Room 204" },
    ],
    image: "/images/campus-life/student-activities.svg",
    imageAlt:
      "Illustration of students at club booths in the KM100 courtyard",
    caption: "Organization fair, main courtyard.",
  },
  {
    slug: "practical-training",
    index: "02",
    label: "Practical training",
    title: "Half of every day is bench time",
    paragraphs: [
      "First and second year students split the day between general education and their trade. The trade half happens at a workstation with a task card, using the same format as industry immersion. Instructors check the work at the bench, not at the end of the term.",
      "In their final year, students spend 480 hours with a partner employer in Bogo City or metro Cebu. The training office arranges the placement and visits the site twice.",
    ],
    facts: [
      { label: "Bench sessions", value: "Daily, 8:00 AM to 12:00 PM" },
      { label: "Industry immersion", value: "480 hours, final year" },
      { label: "Mock assessment", value: "Once per semester" },
      { label: "Open laboratory", value: "Saturdays, 8:00 AM" },
    ],
    image: "/images/campus-life/practical-training.svg",
    imageAlt:
      "Illustration of a student at an electronics workbench with an instructor",
    caption: "Electronics laboratory, second year bench session.",
  },
  {
    slug: "school-events",
    index: "03",
    label: "School events",
    title: "Foundation Day, skills olympics, intramurals",
    paragraphs: [
      "Foundation Day in February fills the grounds with program booths and an evening programme. The skills olympics in October puts students from all five diploma tracks on the same floor for timed trade tests. Intramurals close the first semester in September.",
      "Students do most of the work. The Student Council drafts the programme, hospitality students handle food service, and electronics students run the sound and lights.",
    ],
    facts: [
      { label: "Foundation Day", value: "February 12" },
      { label: "Skills olympics", value: "October" },
      { label: "Intramurals", value: "September" },
      { label: "Recognition rites", value: "April" },
    ],
    image: "/images/campus-life/school-events.svg",
    imageAlt:
      "Illustration of the Foundation Day programme on the KM100 stage",
    caption: "Foundation Day programme, campus stage.",
  },
  {
    slug: "community-involvement",
    index: "04",
    label: "Community involvement",
    title: "Saturdays in Barangay Cogon",
    paragraphs: [
      "The outreach programme began with a request from Barangay Cogon to help rewire its barangay hall. It now runs as a monthly clinic. Students take on repair jobs, computer literacy sessions and food-handling demonstrations in partner barangays around Bogo City.",
      "Service is documented. Each student logs at least 40 hours before graduation, and the training office files the record with their immersion documents.",
    ],
    facts: [
      { label: "Skills clinic", value: "Second Saturday, monthly" },
      { label: "Computer literacy", value: "Saturdays, 9:00 AM" },
      { label: "Coastal cleanup", value: "September and March" },
      { label: "Service requirement", value: "40 hours" },
    ],
    image: "/images/campus-life/community-involvement.svg",
    imageAlt:
      "Illustration of students handing out supplies at a barangay outreach",
    caption: "Monthly skills clinic, Barangay Cogon.",
  },
];
