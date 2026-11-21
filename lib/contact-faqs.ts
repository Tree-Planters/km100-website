/**
 * Contact-page FAQs. Keep answers strictly to what the site already states —
 * anything unconfirmed (fees, exact documentary requirements) points to the
 * office instead of guessing.
 */
export type ContactFaq = {
  question: string;
  answer: string;
};

export const contactFaqs: ContactFaq[] = [
  {
    question: "Do I need to pre-register before enrolling?",
    answer:
      "Pre-registration is a way to signal your interest — it is not official admission or enrollment. Submit the pre-registration form, and the office will contact you about the next steps, documentary requirements and the enrollment schedule.",
  },
  {
    question: "Which programs can I apply for?",
    answer:
      "Five three-year PQF Level 5 Diploma programs: Computer Engineering Technology, Electronics Engineering Technology, Electrical Engineering Technology, Tourism Technology and Hospitality Technology. Each program page lists what the course covers.",
  },
  {
    question: "How long does a program take?",
    answer:
      "The diploma programs run for three years and are pegged at PQF Level 5. Class schedules and the academic calendar for your batch are confirmed by the office at enrollment.",
  },
  {
    question: "Are scholarships available?",
    answer:
      "KM100 works with TESDA scholarship opportunities for technical education and skills training. Slots, eligibility and coverage change per intake, so call the office or send a message to ask about the current round.",
  },
  {
    question: "What are the admission requirements?",
    answer:
      "Requirements depend on the program and on the scholarship, if any, you are applying under. Message us with the program you want and we will send you the exact checklist so you can prepare everything at once.",
  },
  {
    question: "Can I visit the campus before deciding?",
    answer:
      "Yes. Weekday mornings are best — classes and laboratory sessions are running, so you can see the training areas in use. Call ahead at 0967 093 5811 and someone will walk you through the building.",
  },
];
