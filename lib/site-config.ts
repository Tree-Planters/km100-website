/**
 * Site-wide editable content.
 *
 * Update `announcement.message` whenever the notice needs to change — the top
 * bar reads it directly, so no component edits are required.
 */
export const siteConfig = {
  name: "KM100 Skills and Training Center, Inc.",
  shortName: "KM100",

  announcement: {
    visible: true,
    message:
      "Now accepting pre-registrations for our 3-year PQF Level 5 Diploma Programs!",
    ctaLabel: "Pre-register",
    ctaHref: "/pre-registration",
  },

  contact: {
    phone: "0967 093 5811",
    phoneHref: "tel:+639670935811",
    email: "km100skillsandtrainingcenter@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=100090317439588",
    address:
      "KM Building, Jamoral Ville, Purok 13, Barangay Cogon, Bogo City, Cebu 6010",
    hours: [
      { days: "Monday – Friday", time: "8:00 AM – 5:00 PM" },
      { days: "Saturday", time: "8:00 AM – 12:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
  },
};
