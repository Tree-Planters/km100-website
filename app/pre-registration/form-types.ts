// Shared types, option lists and the on-device draft helpers for pre-registration.

export type PsgcItem = {
  code: string;
  name: string;
  district?: string;
  [key: string]: any;
};

export const inputClass =
  "mt-1 w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange focus:ring-1 focus:ring-km-orange";

export const selectClass =
  "mt-1 w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange focus:ring-1 focus:ring-km-orange disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-km-charcoal/40";

export const DRAFT_STORAGE_KEY = "km100:pre-registration-draft:v2";

export type FormState = {
  // §2 Learner / Manpower Profile
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  streetAddress: string;
  region: string;
  regionCode: string;
  province: string;
  provinceCode: string;
  city: string;
  cityCode: string;
  district: string;
  barangay: string;
  barangayCode: string;
  email: string;
  mobile: string;
  nationality: string;
  // §3 Personal Information
  sex: string;
  civilStatus: string;
  employmentStatus: string;
  employmentType: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  birthCity: string;
  birthProvince: string;
  birthRegion: string;
  birthCityCode: string;
  birthProvinceCode: string;
  birthRegionCode: string;
  educationalAttainment: string;
  parentName: string;
  parentAddress: string;
  // §4 Classification
  classification: string[];
  classificationOthers: string;
  // §7 - §9
  program: string;
  scholarshipPackage: string;
  acknowledgement: boolean;
  consent: boolean;
};

export const EMPTY_FORM: FormState = {
  lastName: "",
  firstName: "",
  middleName: "",
  suffix: "",
  streetAddress: "",
  region: "",
  regionCode: "",
  province: "",
  provinceCode: "",
  city: "",
  cityCode: "",
  district: "",
  barangay: "",
  barangayCode: "",
  email: "",
  mobile: "",
  nationality: "Filipino",
  sex: "",
  civilStatus: "",
  employmentStatus: "",
  employmentType: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  birthCity: "",
  birthProvince: "",
  birthRegion: "",
  birthCityCode: "",
  birthProvinceCode: "",
  birthRegionCode: "",
  educationalAttainment: "",
  parentName: "",
  parentAddress: "",
  classification: [],
  classificationOthers: "",
  program: "",
  scholarshipPackage: "",
  acknowledgement: false,
  consent: false,
};

export const STEPS = [
  { title: "Name & Address", caption: "MIS 03-01 §1 – §2" },
  { title: "Personal Information", caption: "§3.1 – §3.5" },
  { title: "Education & Guardian", caption: "§3.6 – §3.7" },
  { title: "Classification", caption: "§4" },
  { title: "Course & Privacy", caption: "§7 – §9" },
  { title: "Review Answers", caption: "Make sure everything is correct" },
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const NATIONALITIES = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Brazilian",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comorian",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dutch",
  "Ecuadorian",
  "Egyptian",
  "Emirati",
  "English",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Eswatini",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakh",
  "Kenyan",
  "Kittitian",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepalese",
  "New Zealander",
  "Nicaraguan",
  "Nigerien",
  "Nigerian",
  "North Korean",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Palestinian",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "San Marinese",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "South Sudanese",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Timorese",
  "Togolese",
  "Tongan",
  "Trinidadian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbek",
  "Vanuatuan",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
];

export function readDraft(): Partial<FormState> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const stored = parsed as Record<string, unknown>;
    const draft: Partial<FormState> = {};

    for (const key of Object.keys(EMPTY_FORM) as (keyof FormState)[]) {
      const value = stored[key];
      if (Array.isArray(EMPTY_FORM[key])) {
        if (Array.isArray(value)) {
          (draft as Record<string, unknown>)[key] = value.filter(
            (entry): entry is string => typeof entry === "string"
          );
        }
      } else if (typeof EMPTY_FORM[key] === "boolean") {
        (draft as Record<string, unknown>)[key] = value === true;
      } else if (typeof value === "string") {
        (draft as Record<string, unknown>)[key] = value;
      }
    }

    return Object.keys(draft).length > 0 ? draft : null;
  } catch (error) {
    console.error("[pre-registration] failed to read saved draft", error);
    return null;
  }
}

export function isDraftEmpty(form: FormState): boolean {
  const { nationality, acknowledgement, consent, ...rest } = form;
  return (
    !acknowledgement &&
    !consent &&
    Object.values(rest).every((value) =>
      Array.isArray(value) ? value.length === 0 : value === ""
    )
  );
}
