"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";
import {
  ageFromBirthDate,
  buildTesdaFormData,
  isCurrentlyEnrolledFromAttainment,
  tesdaPdfPath,
} from "@/lib/tesda-form";
import { cn } from "@/lib/utils";
import {
  CIVIL_STATUS_OPTIONS,
  CLASSIFICATION_OPTIONS,
  EDUCATIONAL_ATTAINMENT_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SCHOLARSHIP_OPTIONS,
  SEX_OPTIONS,
  type PreRegistrationInput,
} from "@/lib/validation";

type PsgcItem = {
  code: string;
  name: string;
  district?: string;
  [key: string]: any;
};

const inputClass =
  "mt-1 w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange focus:ring-1 focus:ring-km-orange";

const selectClass =
  "mt-1 w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange focus:ring-1 focus:ring-km-orange disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-km-charcoal/40";

const DRAFT_STORAGE_KEY = "km100:pre-registration-draft:v2";

type FormState = {
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

const EMPTY_FORM: FormState = {
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

const STEPS = [
  { title: "Name & Address", caption: "MIS 03-01 §1 – §2" },
  { title: "Personal Information", caption: "§3.1 – §3.5" },
  { title: "Education & Guardian", caption: "§3.6 – §3.7" },
  { title: "Classification", caption: "§4" },
  { title: "Course & Privacy", caption: "§7 – §9" },
  { title: "Review & Preview", caption: "Check before submitting" },
] as const;

const MONTHS = [
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

const NATIONALITIES = [
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

function readDraft(): Partial<FormState> | null {
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

function isDraftEmpty(form: FormState): boolean {
  const { nationality, acknowledgement, consent, ...rest } = form;
  return (
    !acknowledgement &&
    !consent &&
    Object.values(rest).every((value) =>
      Array.isArray(value) ? value.length === 0 : value === ""
    )
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-[1.05rem] w-[1.05rem] animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function PreRegistrationPage() {
  // The first render must match the server HTML, which cannot see the saved
  // draft, so start from EMPTY_FORM and restore the draft after mount.
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  // null = unknown (submission in flight), true = confirmation mail accepted.
  const [confirmationEmailSent, setConfirmationEmailSent] = useState<
    boolean | null
  >(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // PSGC lists
  const [regions, setRegions] = useState<PsgcItem[]>([]);
  const [provinces, setProvinces] = useState<PsgcItem[]>([]);
  const [cities, setCities] = useState<PsgcItem[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<PsgcItem[]>([]);
  const [allBarangays, setAllBarangays] = useState<PsgcItem[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Birthplace cascade lists (kept separate from the permanent address).
  const [birthProvinces, setBirthProvinces] = useState<PsgcItem[]>([]);
  const [birthCities, setBirthCities] = useState<PsgcItem[]>([]);
  const [loadingBirthProvinces, setLoadingBirthProvinces] = useState(false);
  const [loadingBirthCities, setLoadingBirthCities] = useState(false);

  const previewUrlRef = useRef<string | null>(null);

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const age = ageFromBirthDate(form.birthMonth, form.birthDay, form.birthYear);

  // Restore the draft kept on this device, after hydration.
  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    setForm((current) => ({ ...current, ...draft }));
  }, []);

  // ---------- PSGC cascade ----------
  useEffect(() => {
    let alive = true;
    setLoadingRegions(true);
    fetch("https://psgc.cloud/api/v2/regions")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("regions"))))
      .then((data) => {
        if (!alive) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setRegions(list);
      })
      .catch((error) => console.error("[pre-registration] regions", error))
      .finally(() => {
        if (alive) setLoadingRegions(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const regionCode = form.regionCode;
    if (!regionCode) return;

    let alive = true;
    setLoadingProvinces(true);

    fetch(`https://psgc.cloud/api/v2/regions/${regionCode}/provinces`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("provinces"))))
      .then((data) => {
        if (!alive) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];

        if (list.length > 0) {
          list.sort((a, b) => a.name.localeCompare(b.name));
          setProvinces(list);
          return;
        }

        // NCR has no provinces: select Metro Manila and load its cities.
        const ncr: PsgcItem = { code: regionCode, name: "Metro Manila" };
        setProvinces([ncr]);
        setForm((current) =>
          current.provinceCode
            ? current
            : { ...current, provinceCode: ncr.code, province: ncr.name }
        );

        setLoadingCities(true);
        fetch(
          `https://psgc.cloud/api/v2/regions/${regionCode}/cities-municipalities`
        )
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error("cities"))))
          .then((cityData) => {
            if (!alive) return;
            const cityList: PsgcItem[] = Array.isArray(cityData)
              ? cityData
              : cityData.data || [];
            cityList.sort((a, b) => a.name.localeCompare(b.name));
            setCities(cityList);
          })
          .catch((error) => console.error("[pre-registration] NCR cities", error))
          .finally(() => {
            if (alive) setLoadingCities(false);
          });
      })
      .catch((error) => console.error("[pre-registration] provinces", error))
      .finally(() => {
        if (alive) setLoadingProvinces(false);
      });

    return () => {
      alive = false;
    };
  }, [form.regionCode]);

  useEffect(() => {
    const provinceCode = form.provinceCode;
    if (!provinceCode || provinceCode === form.regionCode) return;

    let alive = true;
    setLoadingCities(true);

    fetch(
      `https://psgc.cloud/api/v2/provinces/${provinceCode}/cities-municipalities`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("cities"))))
      .then((data) => {
        if (!alive) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setCities(list);
      })
      .catch((error) => console.error("[pre-registration] cities", error))
      .finally(() => {
        if (alive) setLoadingCities(false);
      });

    return () => {
      alive = false;
    };
  }, [form.provinceCode, form.regionCode]);

  useEffect(() => {
    const cityCode = form.cityCode;
    if (!cityCode) return;

    let alive = true;
    setLoadingBarangays(true);

    fetch(
      `https://psgc.cloud/api/v2/cities-municipalities/${cityCode}/barangays`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("barangays"))))
      .then((data) => {
        if (!alive) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setAllBarangays(list);
        setBarangays(list);

        const uniqueDistricts = Array.from(
          new Set(
            list
              .map((item) => item.district)
              .filter(
                (district): district is string =>
                  typeof district === "string" && district.trim() !== ""
              )
          )
        ).sort();

        const selectedCity = cities.find((item) => item.code === cityCode);
        if (
          selectedCity?.district &&
          !uniqueDistricts.includes(selectedCity.district)
        ) {
          uniqueDistricts.unshift(selectedCity.district);
        }

        setDistricts(uniqueDistricts.length > 0 ? uniqueDistricts : ["Lone District"]);
      })
      .catch((error) => console.error("[pre-registration] barangays", error))
      .finally(() => {
        if (alive) setLoadingBarangays(false);
      });

    return () => {
      alive = false;
    };
  }, [form.cityCode, cities]);

  useEffect(() => {
    if (!form.district || form.district === "Lone District") {
      setBarangays(allBarangays);
      return;
    }
    const filtered = allBarangays.filter(
      (item) =>
        !item.district ||
        item.district.toLowerCase() === form.district.toLowerCase()
    );
    setBarangays(filtered.length > 0 ? filtered : allBarangays);
  }, [form.district, allBarangays]);

  // ---------- PSGC cascade: birthplace (same pattern as the address) ----------
  useEffect(() => {
    const regionCode = form.birthRegionCode;
    if (!regionCode) {
      setBirthProvinces([]);
      setBirthCities([]);
      return;
    }

    let alive = true;
    setLoadingBirthProvinces(true);

    fetch(`https://psgc.cloud/api/v2/regions/${regionCode}/provinces`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("birth provinces"))
      )
      .then((data) => {
        if (!alive) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];

        if (list.length > 0) {
          list.sort((a, b) => a.name.localeCompare(b.name));
          setBirthProvinces(list);
          return;
        }

        // NCR has no provinces: select Metro Manila and load its cities.
        const ncr: PsgcItem = { code: regionCode, name: "Metro Manila" };
        setBirthProvinces([ncr]);
        setForm((current) =>
          current.birthProvinceCode
            ? current
            : {
                ...current,
                birthProvinceCode: ncr.code,
                birthProvince: ncr.name,
              }
        );

        setLoadingBirthCities(true);
        fetch(
          `https://psgc.cloud/api/v2/regions/${regionCode}/cities-municipalities`
        )
          .then((res) =>
            res.ok ? res.json() : Promise.reject(new Error("birth cities"))
          )
          .then((cityData) => {
            if (!alive) return;
            const cityList: PsgcItem[] = Array.isArray(cityData)
              ? cityData
              : cityData.data || [];
            cityList.sort((a, b) => a.name.localeCompare(b.name));
            setBirthCities(cityList);
          })
          .catch((error) =>
            console.error("[pre-registration] birth NCR cities", error)
          )
          .finally(() => {
            if (alive) setLoadingBirthCities(false);
          });
      })
      .catch((error) =>
        console.error("[pre-registration] birth provinces", error)
      )
      .finally(() => {
        if (alive) setLoadingBirthProvinces(false);
      });

    return () => {
      alive = false;
    };
  }, [form.birthRegionCode]);

  useEffect(() => {
    const provinceCode = form.birthProvinceCode;
    if (!provinceCode || provinceCode === form.birthRegionCode) return;

    let alive = true;
    setLoadingBirthCities(true);

    fetch(
      `https://psgc.cloud/api/v2/provinces/${provinceCode}/cities-municipalities`
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("birth cities"))
      )
      .then((data) => {
        if (!alive) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setBirthCities(list);
      })
      .catch((error) => console.error("[pre-registration] birth cities", error))
      .finally(() => {
        if (alive) setLoadingBirthCities(false);
      });

    return () => {
      alive = false;
    };
  }, [form.birthProvinceCode, form.birthRegionCode]);

  // Keep the draft on this device while the applicant types.
  useEffect(() => {
    if (referenceNumber) return;
    if (isDraftEmpty(form)) return;

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
      } catch (error) {
        console.error("[pre-registration] failed to save draft", error);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [form, referenceNumber]);

  // ---------- A4 preview payload ----------
  const tesdaData = useMemo(
    () =>
      buildTesdaFormData(
        {
          ...form,
          address: form.streetAddress,
          municipality: form.city,
          mobile: form.mobile,
          email: form.email,
          suffix: form.suffix,
          age,
          consent: form.consent,
        },
        { referenceNumber: "PREVIEW", entryDate: undefined }
      ),
    [form, age]
  );

  /** Renders the review draft into the real TESDA PDF (nothing is saved). */
  const buildPreview = useCallback(async () => {
    setPreviewError(null);
    try {
      const res = await fetch("/api/pre-registration/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tesdaData),
      });
      if (!res.ok) throw new Error(`preview failed: ${res.status}`);

      const blob = await res.blob();
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(blob);
      previewUrlRef.current = url;
      setPreviewPdfUrl(url);
    } catch (error) {
      console.error("[pre-registration] form preview failed", error);
      setPreviewError(
        "Could not build the form preview. Change a detail to retry."
      );
    }
  }, [tesdaData]);

  useEffect(() => {
    if (step !== STEPS.length - 1) return;
    const timer = window.setTimeout(() => {
      void buildPreview();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [step, buildPreview]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // ---------- validation ----------
  function validateStep(index: number): Record<string, string> {
    const next: Record<string, string> = {};

    if (index === 0) {
      if (!form.lastName.trim()) next.lastName = "Last name is required.";
      if (!form.firstName.trim()) next.firstName = "First name is required.";
      if (!form.regionCode) next.regionCode = "Select your region.";
      if (!form.provinceCode) next.provinceCode = "Select your province.";
      if (!form.cityCode) next.cityCode = "Select your city / municipality.";
      if (!form.district) next.district = "Select your district.";
      if (!form.barangayCode) next.barangayCode = "Select your barangay.";
      if (!form.streetAddress.trim())
        next.streetAddress = "House number / street is required.";
      if (!form.email.trim() || !form.email.includes("@"))
        next.email = "Enter a valid email address.";
      if (form.mobile.trim().length < 7)
        next.mobile = "Enter a valid contact number.";
      if (!form.nationality.trim())
        next.nationality = "Nationality is required.";
    }

    if (index === 1) {
      if (!form.sex) next.sex = "Select your sex.";
      if (!form.civilStatus) next.civilStatus = "Select your civil status.";
      if (!form.employmentStatus)
        next.employmentStatus = "Select your employment status.";
      if (
        (form.employmentStatus === "Wage-Employed" ||
          form.employmentStatus === "Underemployed") &&
        !form.employmentType
      ) {
        next.employmentType = "Select your employment type.";
      }
      if (!form.birthMonth || !form.birthDay || !form.birthYear)
        next.birthMonth = "Enter your complete birthdate.";
      else if (!age) next.birthMonth = "Enter a valid birthdate.";
      if (!form.birthRegionCode)
        next.birthRegionCode = "Select your birth region.";
      if (!form.birthProvinceCode)
        next.birthProvinceCode = "Select your birth province.";
      if (!form.birthCityCode)
        next.birthCityCode = "Select your birth city / municipality.";
    }

    if (index === 2) {
      if (!form.educationalAttainment)
        next.educationalAttainment = "Select your educational attainment.";
      if (!form.parentName.trim())
        next.parentName = "Parent / guardian name is required.";
      if (!form.parentAddress.trim())
        next.parentAddress = "Parent / guardian address is required.";
    }

    if (index === 3) {
      if (
        form.classification.includes("Others") &&
        !form.classificationOthers.trim()
      ) {
        next.classificationOthers = "Please specify the other classification.";
      }
    }

    if (index === 4) {
      if (!form.program) next.program = "Select the program you are enrolling in.";
      if (!form.acknowledgement)
        next.acknowledgement = "You must acknowledge this notice.";
      if (!form.consent)
        next.consent = "You must agree to the data privacy disclaimer.";
    }

    return next;
  }

  function focusFirstError(nextErrors: Record<string, string>) {
    const firstKey = Object.keys(nextErrors)[0];
    if (!firstKey) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function goNext() {
    const nextErrors = validateStep(step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }
    const target = Math.min(step + 1, STEPS.length - 1);
    setStep(target);
    setMaxStep((current) => Math.max(current, target));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(index: number) {
    if (index > maxStep) return;

    // Moving forward is only allowed while every earlier step is still valid,
    // so clearing an answer can't be used to skip past it.
    if (index > step) {
      for (let cursor = 0; cursor < index; cursor += 1) {
        const stepErrors = validateStep(cursor);
        if (Object.keys(stepErrors).length > 0) {
          setErrors(stepErrors);
          setStep(cursor);
          focusFirstError(stepErrors);
          return;
        }
      }
    }

    setErrors({});
    setStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copyAddressToGuardian() {
    const parts = [
      form.streetAddress,
      form.barangay,
      form.district,
      form.city,
      form.province,
      form.region,
    ]
      .map((part) => part.trim())
      .filter(Boolean);
    set("parentAddress", parts.join(", "));
  }

  function toggleClassification(value: string) {
    setForm((current) => {
      const selected = current.classification.includes(value)
        ? current.classification.filter((entry) => entry !== value)
        : [...current.classification, value];
      return {
        ...current,
        classification: selected,
        classificationOthers: selected.includes("Others")
          ? current.classificationOthers
          : "",
      };
    });
  }

  async function handleSubmit() {
    setSubmitError(null);

    const allErrors: Record<string, string> = {};
    for (let index = 0; index < STEPS.length - 1; index += 1) {
      Object.assign(allErrors, validateStep(index));
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstStep = [0, 1, 2, 3, 4].find(
        (index) => Object.keys(validateStep(index)).length > 0
      );
      if (firstStep !== undefined) setStep(firstStep);
      focusFirstError(allErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload: PreRegistrationInput = {
      lastName: form.lastName.trim(),
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || undefined,
      suffix: form.suffix.trim() || undefined,
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      nationality: form.nationality.trim(),
      address: form.streetAddress.trim(),
      sitio: form.streetAddress.trim() || undefined,
      barangay: form.barangay,
      barangayCode: form.barangayCode || undefined,
      district: form.district,
      municipality: form.city,
      cityCode: form.cityCode || undefined,
      province: form.province,
      provinceCode: form.provinceCode || undefined,
      region: form.region,
      regionCode: form.regionCode || undefined,
      sex: form.sex as PreRegistrationInput["sex"],
      civilStatus: form.civilStatus as PreRegistrationInput["civilStatus"],
      employmentStatus:
        form.employmentStatus as PreRegistrationInput["employmentStatus"],
      employmentType:
        (form.employmentType as PreRegistrationInput["employmentType"]) ||
        undefined,
      birthMonth: Number(form.birthMonth),
      birthDay: Number(form.birthDay),
      birthYear: Number(form.birthYear),
      age: age ? Number(age) : undefined,
      birthCity: form.birthCity.trim(),
      birthProvince: form.birthProvince.trim(),
      birthRegion: form.birthRegion.trim(),
      educationalAttainment:
        form.educationalAttainment as PreRegistrationInput["educationalAttainment"],
      parentName: form.parentName.trim(),
      parentAddress: form.parentAddress.trim(),
      classification:
        form.classification as PreRegistrationInput["classification"],
      classificationOthers:
        form.classificationOthers.trim() || undefined,
      program: form.program as PreRegistrationInput["program"],
      scholarshipPackage: form.scholarshipPackage || undefined,
      isCurrentlyEnrolled: isCurrentlyEnrolledFromAttainment(
        form.educationalAttainment
      ),
      highestAttainment: form.educationalAttainment,
      acknowledgement: form.acknowledgement,
      consent: form.consent,
    };

    try {
      const res = await fetch("/api/pre-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(
          data.error ?? "Something went wrong. Please try again."
        );
        return;
      }

      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (error) {
        console.error("[pre-registration] failed to clear draft", error);
      }

      setConfirmationEmailSent(
        typeof data.confirmationEmailSent === "boolean"
          ? data.confirmationEmailSent
          : null
      );
      setReferenceNumber(data.referenceNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("[pre-registration] submit failed", error);
      setSubmitError("Failed to submit pre-registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ---------- success screen ----------
  if (referenceNumber) {
    const submittedProgram =
      programs.find((program) => program.slug === form.program)?.name ?? null;
    const emailFailed = confirmationEmailSent === false;

    const nextSteps = [
      {
        title: "Print your Pre-Registration Form",
        body: "Download it below and print it on A4 paper, back to back — both pages on one sheet.",
      },
      {
        title: "Attach a 1×1 ID picture",
        body: "Paste it on the picture box at the top of the printed form.",
      },
      {
        title: "Sign it and visit admissions",
        body: "Bring the signed form to the KM100 admissions office.",
      },
    ];

    return (
      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-km-charcoal/12 bg-white shadow-sm">
            {/* Header band */}
            <div className="border-b border-km-charcoal/10 bg-km-warm-white px-6 py-8 sm:px-10 sm:py-9">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-km-orange">
                    Pre-registration complete
                  </p>
                  <h2 className="mt-1 font-brand text-2xl font-bold tracking-tight text-km-charcoal sm:text-3xl">
                    Pre-Registration Received
                  </h2>
                  <p className="mt-1.5 text-sm text-km-charcoal/70">
                    {form.firstName
                      ? `Thank you, ${form.firstName}.`
                      : "Thank you."}{" "}
                    {submittedProgram
                      ? `You are pre-registered for ${submittedProgram}.`
                      : "Your details are now on file."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-7 sm:px-10 sm:py-9 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
              {/* Left: email notice + next steps */}
              <div className="space-y-7">
                <div
                  className={cn(
                    "flex gap-3.5 rounded-xl border p-4",
                    emailFailed
                      ? "border-amber-200 bg-amber-50/60"
                      : "border-km-charcoal/12 bg-km-warm-white/60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 shrink-0",
                      emailFailed ? "text-amber-600" : "text-km-orange"
                    )}
                  >
                    <MailIcon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-km-charcoal">
                      {emailFailed
                        ? "Your pre-registration is saved"
                        : "Check your email"}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-km-charcoal/70">
                      {emailFailed ? (
                        <>
                          We couldn&rsquo;t send the confirmation email to{" "}
                          <strong className="break-all font-semibold text-km-charcoal">
                            {form.email}
                          </strong>{" "}
                          just now, but your details are on file. Our admissions
                          team will still review your submission and contact you
                          with the next steps.
                        </>
                      ) : (
                        <>
                          We sent a confirmation to{" "}
                          <strong className="break-all font-semibold text-km-charcoal">
                            {form.email}
                          </strong>
                          . It holds your reference number, a copy of the details
                          you entered, and your Pre-Registration Form attached as
                          a PDF. If it hasn&rsquo;t arrived in a few minutes, check
                          your spam folder.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-km-charcoal">
                    What to do next
                  </h3>
                  <ol className="mt-3 space-y-3.5">
                    {nextSteps.map((item, index) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-km-orange/10 text-[11px] font-bold text-km-orange">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-km-charcoal">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-km-charcoal/65">
                            {item.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Right: actions, a compact panel on phones */}
              <aside className="space-y-4">
                <div className="rounded-xl border border-km-charcoal/12 bg-km-warm-white/50 p-5">
                  <p className="text-sm font-semibold text-km-charcoal">
                    Your form is ready
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-km-charcoal/60">
                    Download the PDF, then print it on A4 back to back, attach
                    your 1×1 picture and sign it.
                  </p>
                  <a
                    href={tesdaPdfPath(referenceNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-km-orange px-4 py-3 text-center text-[13px] font-semibold leading-snug text-white shadow-sm transition-colors hover:bg-km-orange/90 sm:text-sm"
                  >
                    <DownloadIcon />
                    {"Download Pre\u2011Registration Form"}
                  </a>
                </div>

                <div className="space-y-2 border-t border-km-charcoal/10 pt-4">
                  <ButtonLink
                    href="/programs"
                    variant="outline"
                    className="w-full px-4 py-2.5 text-xs"
                  >
                    Explore our programs
                  </ButtonLink>
                  <ButtonLink
                    href="/"
                    variant="outline"
                    className="w-full px-4 py-2.5 text-xs"
                  >
                    Return to Home
                  </ButtonLink>
                </div>
              </aside>
            </div>

            <div className="border-t border-km-charcoal/10 bg-km-warm-white px-6 py-4 sm:px-10">
              <p className="text-[11px] leading-relaxed text-km-charcoal/60">
                This form serves as pre-registration only, not official
                enrollment. Our admissions team reviews every submission and
                will contact you with the next steps.
              </p>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  const isReview = step === STEPS.length - 1;

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mt-2 font-brand text-2xl font-bold tracking-tight text-km-charcoal sm:text-3xl">
            Pre-Registration
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-km-charcoal/70">
            Answer honestly, based on your own details. What you enter fills your
            Learners Profile Form, and our admissions team will review it.
          </p>
        </div>

        {/* Step rail */}
        <ol className="mb-6 grid auto-rows-fr grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((item, index) => {
            const isCurrent = index === step;
            const isDone = index < step;
            const isLocked = index > maxStep;
            return (
              <li key={item.title} className="h-full">
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  disabled={isLocked}
                  aria-current={isCurrent ? "step" : undefined}
                  title={isLocked ? "Fill the earlier steps first" : item.title}
                  className={cn(
                    "flex h-full w-full flex-col justify-between gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-colors",
                    isCurrent
                      ? "border-km-orange bg-km-orange/10"
                      : isDone
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-km-charcoal/12 bg-white",
                    isLocked
                      ? "cursor-not-allowed opacity-50"
                      : isCurrent
                        ? "cursor-default"
                        : "cursor-pointer hover:border-km-orange/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      isCurrent
                        ? "bg-km-orange text-white"
                        : isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-km-charcoal/10 text-km-charcoal/60"
                    )}
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-km-charcoal">
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (isReview) void handleSubmit();
            else goNext();
          }}
          noValidate
          className="space-y-6"
        >
          <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-km-charcoal/10 pb-4">
              <span className="rounded-full bg-km-orange/10 px-3 py-1 text-[11px] font-semibold text-km-orange">
                Step {step + 1} of {STEPS.length}
              </span>
              <h2 className="font-brand text-lg font-bold tracking-tight text-km-charcoal sm:text-xl">
                {STEPS[step].title}
              </h2>
            </div>

            <div className="mt-6">
              {/* ---------------- STEP 1 ---------------- */}
              {step === 0 ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-km-charcoal">
                      Full Name{" "}
                      <span className="font-normal text-km-charcoal/60">
                        (Last Name, Extension Name, First Name, Middle Name)
                      </span>
                    </label>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="field-lastName"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="field-lastName"
                          value={form.lastName}
                          onChange={(event) => set("lastName", event.target.value)}
                          placeholder="e.g. Dela Cruz"
                          className={inputClass}
                        />
                        {errors.lastName ? (
                          <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="field-suffix"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Extension Name{" "}
                          <span className="text-km-charcoal/50">(Jr., Sr., III)</span>
                        </label>
                        <input
                          id="field-suffix"
                          value={form.suffix}
                          onChange={(event) => set("suffix", event.target.value)}
                          placeholder="e.g. Jr."
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="field-firstName"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="field-firstName"
                          value={form.firstName}
                          onChange={(event) => set("firstName", event.target.value)}
                          placeholder="e.g. Juan"
                          className={inputClass}
                        />
                        {errors.firstName ? (
                          <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="field-middleName"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Middle Name{" "}
                          <span className="text-km-charcoal/50">(Optional)</span>
                        </label>
                        <input
                          id="field-middleName"
                          value={form.middleName}
                          onChange={(event) => set("middleName", event.target.value)}
                          placeholder="e.g. Santos"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-km-charcoal">
                      Complete Permanent Mailing Address
                    </label>
                    <p className="mt-1 text-xs text-km-charcoal/60">
                      The region → province → city → district → barangay lists come
                      from the Philippine Standard Geographic Code.
                    </p>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label
                          htmlFor="field-regionCode"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="field-regionCode"
                          value={form.regionCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = regions.find((entry) => entry.code === code);
                            setForm((current) => ({
                              ...current,
                              regionCode: code,
                              region: item?.name ?? "",
                              provinceCode: "",
                              province: "",
                              cityCode: "",
                              city: "",
                              district: "",
                              barangayCode: "",
                              barangay: "",
                            }));
                            setProvinces([]);
                            setCities([]);
                            setDistricts([]);
                            setBarangays([]);
                            setAllBarangays([]);
                          }}
                          disabled={loadingRegions}
                          className={selectClass}
                        >
                          <option value="">
                            {loadingRegions ? "Loading regions…" : "Select Region"}
                          </option>
                          {regions.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.regionCode ? (
                          <p className="mt-1 text-xs text-red-600">{errors.regionCode}</p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor="field-provinceCode"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Province <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="field-provinceCode"
                          value={form.provinceCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = provinces.find((entry) => entry.code === code);
                            setForm((current) => ({
                              ...current,
                              provinceCode: code,
                              province: item?.name ?? "",
                              cityCode: "",
                              city: "",
                              district: "",
                              barangayCode: "",
                              barangay: "",
                            }));
                            setCities([]);
                            setDistricts([]);
                            setBarangays([]);
                            setAllBarangays([]);
                          }}
                          disabled={!form.regionCode || loadingProvinces}
                          className={selectClass}
                        >
                          <option value="">
                            {!form.regionCode
                              ? "Select Region first"
                              : loadingProvinces
                                ? "Loading provinces…"
                                : "Select Province"}
                          </option>
                          {provinces.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.provinceCode ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.provinceCode}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor="field-cityCode"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          City / Municipality <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="field-cityCode"
                          value={form.cityCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = cities.find((entry) => entry.code === code);
                            setForm((current) => ({
                              ...current,
                              cityCode: code,
                              city: item?.name ?? "",
                              district: "",
                              barangayCode: "",
                              barangay: "",
                            }));
                            setDistricts([]);
                            setBarangays([]);
                            setAllBarangays([]);
                          }}
                          disabled={!form.provinceCode || loadingCities}
                          className={selectClass}
                        >
                          <option value="">
                            {!form.provinceCode
                              ? "Select Province first"
                              : loadingCities
                                ? "Loading cities…"
                                : "Select City / Municipality"}
                          </option>
                          {cities.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.cityCode ? (
                          <p className="mt-1 text-xs text-red-600">{errors.cityCode}</p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor="field-district"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="field-district"
                          value={form.district}
                          onChange={(event) => {
                            setForm((current) => ({
                              ...current,
                              district: event.target.value,
                              barangayCode: "",
                              barangay: "",
                            }));
                          }}
                          disabled={!form.cityCode || districts.length === 0}
                          className={selectClass}
                        >
                          <option value="">
                            {!form.cityCode
                              ? "Select City first"
                              : districts.length === 0
                                ? "No district required"
                                : "Select District"}
                          </option>
                          {districts.map((district) => (
                            <option key={district} value={district}>
                              {district.toLowerCase().includes("district")
                                ? district
                                : `${district} District`}
                            </option>
                          ))}
                        </select>
                        {errors.district ? (
                          <p className="mt-1 text-xs text-red-600">{errors.district}</p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor="field-barangayCode"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Barangay <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="field-barangayCode"
                          value={form.barangayCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = barangays.find((entry) => entry.code === code);
                            setForm((current) => ({
                              ...current,
                              barangayCode: code,
                              barangay: item?.name ?? "",
                            }));
                          }}
                          disabled={!form.cityCode || loadingBarangays}
                          className={selectClass}
                        >
                          <option value="">
                            {!form.cityCode
                              ? "Select City first"
                              : loadingBarangays
                                ? "Loading barangays…"
                                : "Select Barangay"}
                          </option>
                          {barangays.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.barangayCode ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.barangayCode}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor="field-streetAddress"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Number, Street / Sitio <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="field-streetAddress"
                          value={form.streetAddress}
                          onChange={(event) =>
                            set("streetAddress", event.target.value)
                          }
                          placeholder="e.g. House #12, Purok 3"
                          className={inputClass}
                        />
                        {errors.streetAddress ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.streetAddress}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="field-email"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        Email Address / Facebook Account{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        value={form.email}
                        onChange={(event) => set("email", event.target.value)}
                        placeholder="name@example.com"
                        className={inputClass}
                      />
                      {errors.email ? (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="field-mobile"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        Contact No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="field-mobile"
                        type="tel"
                        value={form.mobile}
                        onChange={(event) => set("mobile", event.target.value)}
                        placeholder="09XX XXX XXXX"
                        className={inputClass}
                      />
                      {errors.mobile ? (
                        <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="field-nationality"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="field-nationality"
                        value={form.nationality}
                        onChange={(event) =>
                          set("nationality", event.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="">Select nationality</option>
                        {NATIONALITIES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.nationality ? (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.nationality}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ---------------- STEP 2 ---------------- */}
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-km-charcoal/80">
                        3.1 Sex <span className="text-red-500">*</span>
                      </p>
                      <div className="mt-2 flex gap-4">
                        {SEX_OPTIONS.map((option) => (
                          <label
                            key={option}
                            className="inline-flex cursor-pointer items-center gap-2 text-sm text-km-charcoal"
                          >
                            <input
                              type="radio"
                              name="sex"
                              value={option}
                              checked={form.sex === option}
                              onChange={() => set("sex", option)}
                              className="h-4 w-4 accent-km-orange"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      {errors.sex ? (
                        <p className="mt-1 text-xs text-red-600">{errors.sex}</p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="field-civilStatus"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        3.2 Civil Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="field-civilStatus"
                        value={form.civilStatus}
                        onChange={(event) => set("civilStatus", event.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select status</option>
                        {CIVIL_STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.civilStatus ? (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.civilStatus}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="field-employmentStatus"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        3.3 Employment Status{" "}
                        <span className="text-km-charcoal/50">
                          (before the training)
                        </span>{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="field-employmentStatus"
                        value={form.employmentStatus}
                        onChange={(event) => {
                          const value = event.target.value;
                          setForm((current) => ({
                            ...current,
                            employmentStatus: value,
                            employmentType:
                              value === "Wage-Employed" ||
                              value === "Underemployed"
                                ? current.employmentType
                                : "",
                          }));
                        }}
                        className={selectClass}
                      >
                        <option value="">Select status</option>
                        {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.employmentStatus ? (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.employmentStatus}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {form.employmentStatus === "Wage-Employed" ||
                  form.employmentStatus === "Underemployed" ? (
                    <div className="max-w-md">
                      <label
                        htmlFor="field-employmentType"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        3.3 Employment Type{" "}
                        <span className="text-km-charcoal/50">
                          (if Wage-employed or Underemployed)
                        </span>{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="field-employmentType"
                        value={form.employmentType}
                        onChange={(event) =>
                          set("employmentType", event.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="">Select employment type</option>
                        {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.employmentType ? (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.employmentType}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <p className="text-sm font-semibold text-km-charcoal">
                      3.4 Birthdate <span className="text-red-500">*</span>
                    </p>
                    <div className="mt-2 grid gap-4 sm:grid-cols-4">
                      <div>
                        <label
                          htmlFor="field-birthMonth"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Month of Birth
                        </label>
                        <select
                          id="field-birthMonth"
                          value={form.birthMonth}
                          onChange={(event) => set("birthMonth", event.target.value)}
                          className={selectClass}
                        >
                          <option value="">Month</option>
                          {MONTHS.map((month, index) => (
                            <option key={month} value={String(index + 1)}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="field-birthDay"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Day of Birth
                        </label>
                        <input
                          id="field-birthDay"
                          type="number"
                          min={1}
                          max={31}
                          value={form.birthDay}
                          onChange={(event) => set("birthDay", event.target.value)}
                          placeholder="DD"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="field-birthYear"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Year of Birth
                        </label>
                        <input
                          id="field-birthYear"
                          type="number"
                          min={1900}
                          max={new Date().getFullYear()}
                          value={form.birthYear}
                          onChange={(event) => set("birthYear", event.target.value)}
                          placeholder="YYYY"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-km-charcoal/80">
                          Age{" "}
                          <span className="text-km-charcoal/50">
                            (autofilled)
                          </span>
                        </label>
                        <input
                          value={age}
                          readOnly
                          placeholder="—"
                          className={cn(inputClass, "bg-km-warm-white/70")}
                        />
                      </div>
                    </div>
                    {errors.birthMonth ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.birthMonth}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-km-charcoal">
                      3.5 Birthplace <span className="text-red-500">*</span>
                    </p>
                    <div className="mt-2 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="field-birthRegion"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Region
                        </label>
                        <select
                          id="field-birthRegionCode"
                          value={form.birthRegionCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = regions.find(
                              (entry) => entry.code === code
                            );
                            setForm((current) => ({
                              ...current,
                              birthRegionCode: code,
                              birthRegion: item?.name ?? "",
                              birthProvinceCode: "",
                              birthProvince: "",
                              birthCityCode: "",
                              birthCity: "",
                            }));
                            setBirthProvinces([]);
                            setBirthCities([]);
                          }}
                          disabled={loadingRegions}
                          className={selectClass}
                        >
                          <option value="">
                            {loadingRegions
                              ? "Loading regions…"
                              : "Select Region"}
                          </option>
                          {regions.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.birthRegionCode ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.birthRegionCode}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="field-birthProvince"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Province
                        </label>
                        <select
                          id="field-birthProvinceCode"
                          value={form.birthProvinceCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = birthProvinces.find(
                              (entry) => entry.code === code
                            );
                            setForm((current) => ({
                              ...current,
                              birthProvinceCode: code,
                              birthProvince: item?.name ?? "",
                              birthCityCode: "",
                              birthCity: "",
                            }));
                            setBirthCities([]);
                          }}
                          disabled={
                            !form.birthRegionCode || loadingBirthProvinces
                          }
                          className={selectClass}
                        >
                          <option value="">
                            {!form.birthRegionCode
                              ? "Select Region first"
                              : loadingBirthProvinces
                                ? "Loading provinces…"
                                : "Select Province"}
                          </option>
                          {birthProvinces.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.birthProvinceCode ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.birthProvinceCode}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="field-birthCity"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          City / Municipality
                        </label>
                        <select
                          id="field-birthCityCode"
                          value={form.birthCityCode}
                          onChange={(event) => {
                            const code = event.target.value;
                            const item = birthCities.find(
                              (entry) => entry.code === code
                            );
                            setForm((current) => ({
                              ...current,
                              birthCityCode: code,
                              birthCity: item?.name ?? "",
                            }));
                          }}
                          disabled={
                            !form.birthProvinceCode || loadingBirthCities
                          }
                          className={selectClass}
                        >
                          <option value="">
                            {!form.birthProvinceCode
                              ? "Select Province first"
                              : loadingBirthCities
                                ? "Loading cities…"
                                : "Select City / Municipality"}
                          </option>
                          {birthCities.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.birthCityCode ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.birthCityCode}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ---------------- STEP 3 ---------------- */}
              {step === 2 ? (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="field-educationalAttainment"
                      className="block text-sm font-semibold text-km-charcoal"
                    >
                      3.6 Educational Attainment Before the Training (Trainee){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="field-educationalAttainment"
                      value={form.educationalAttainment}
                      onChange={(event) =>
                        set("educationalAttainment", event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="">Select educational attainment</option>
                      {EDUCATIONAL_ATTAINMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.educationalAttainment ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.educationalAttainment}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-lg border border-km-orange/20 bg-km-warm-white/60 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-km-charcoal">
                        3.7 Parent / Guardian
                      </h3>
                      <button
                        type="button"
                        onClick={copyAddressToGuardian}
                        className="text-xs font-semibold text-km-orange underline underline-offset-2 hover:text-km-orange/80"
                      >
                        Same as my permanent address
                      </button>
                    </div>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="field-parentName"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="field-parentName"
                          value={form.parentName}
                          onChange={(event) => set("parentName", event.target.value)}
                          placeholder="Parent / guardian full name"
                          className={inputClass}
                        />
                        {errors.parentName ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.parentName}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="field-parentAddress"
                          className="text-xs font-medium text-km-charcoal/80"
                        >
                          Complete Permanent Mailing Address{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="field-parentAddress"
                          value={form.parentAddress}
                          onChange={(event) =>
                            set("parentAddress", event.target.value)
                          }
                          placeholder="House / street, barangay, city, province, region"
                          className={inputClass}
                        />
                        {errors.parentAddress ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.parentAddress}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ---------------- STEP 4 ---------------- */}
              {step === 3 ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-km-charcoal">
                      4. Learner/Trainee/Student (Clients) Classification
                    </p>
                    <p className="mt-1 text-xs text-km-charcoal/60">
                      Optional. Tick every item that applies — they print as X on
                      the form. If none apply (an ordinary applicant with no job
                      or beneficiary program), leave these blank.
                    </p>
                  </div>
                  <div
                    id="field-classification"
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {CLASSIFICATION_OPTIONS.map((option) => {
                      const checked = form.classification.includes(option);
                      return (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-xs leading-snug transition-colors",
                            checked
                              ? "border-km-orange bg-km-orange/5 text-km-charcoal"
                              : "border-km-charcoal/15 bg-white text-km-charcoal/80 hover:border-km-orange/50"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleClassification(option)}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-km-orange"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.classification ? (
                    <p className="text-xs text-red-600">{errors.classification}</p>
                  ) : null}

                  {form.classification.includes("Others") ? (
                    <div className="max-w-md">
                      <label
                        htmlFor="field-classificationOthers"
                        className="text-xs font-medium text-km-charcoal/80"
                      >
                        Please specify <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="field-classificationOthers"
                        value={form.classificationOthers}
                        onChange={(event) =>
                          set("classificationOthers", event.target.value)
                        }
                        placeholder="Other classification"
                        className={inputClass}
                      />
                      {errors.classificationOthers ? (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.classificationOthers}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* ---------------- STEP 5 ---------------- */}
              {step === 4 ? (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="field-program"
                      className="block text-xs font-medium text-km-charcoal/80"
                    >
                      7. Name of Course/Qualification{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="field-program"
                      value={form.program}
                      onChange={(event) => set("program", event.target.value)}
                      className={cn(selectClass, "text-base sm:text-sm")}
                    >
                      <option value="">Choose a diploma program</option>
                      {programs.map((program) => (
                        <option key={program.slug} value={program.slug}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                    {errors.program ? (
                      <p className="mt-1 text-xs text-red-600">{errors.program}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="field-scholarshipPackage"
                      className="block text-xs font-medium text-km-charcoal/80"
                    >
                      8. If Scholar, What Type of Scholarship Package (TWSP, PESFA,
                      STEP, others)?
                    </label>
                    <select
                      id="field-scholarshipPackage"
                      value={form.scholarshipPackage}
                      onChange={(event) =>
                        set("scholarshipPackage", event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="">Not a scholar</option>
                      {SCHOLARSHIP_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-lg bg-km-warm-white p-4 text-xs leading-relaxed text-km-charcoal/85 sm:text-sm">
                    <p className="font-semibold text-km-charcoal">
                      9. Privacy Consent and Disclaimer
                    </p>
                    <p className="mt-1 text-xs italic sm:text-sm">
                      I hereby attest that I have read and understood the Privacy
                      Notice of TESDA through its website (https://www.tesda.gov.ph)
                      and thereby giving my consent in the processing of my personal
                      information indicated in this Learners Profile. The processing
                      includes scholarships, employment, survey, and all other related
                      TESDA programs that may be beneficial to my qualifications.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm text-km-charcoal">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(event) => set("consent", event.target.checked)}
                      className="mt-1 h-4 w-4 accent-km-orange"
                    />
                    <span>
                      <strong className="font-semibold">AGREE</strong> to the privacy
                      disclaimer above and to Republic Act No. 10173 (Data Privacy Act
                      of 2012){" "}
                      <span className="font-normal text-km-charcoal/60">
                        — required
                      </span>
                    </span>
                  </label>
                  {errors.consent ? (
                    <p className="-mt-4 text-xs text-red-600">{errors.consent}</p>
                  ) : null}

                  <div className="rounded-lg bg-km-warm-white p-4 text-xs leading-relaxed text-km-charcoal/85 sm:text-sm">
                    I understand that this form serves as a registration/sign-up form
                    only and does not confirm my official enrollment in the KM100 STC
                    3-Year Diploma Program.
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm text-km-charcoal">
                    <input
                      type="checkbox"
                      checked={form.acknowledgement}
                      onChange={(event) =>
                        set("acknowledgement", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-km-orange"
                    />
                    <span>
                      <strong className="font-semibold">I ACKNOWLEDGE</strong> this
                      notice{" "}
                      <span className="font-normal text-km-charcoal/60">
                        — required
                      </span>
                    </span>
                  </label>
                  {errors.acknowledgement ? (
                    <p className="-mt-4 text-xs text-red-600">
                      {errors.acknowledgement}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* ---------------- STEP 6 ---------------- */}
              {isReview ? (
                <div className="space-y-5">
                  {Object.keys(errors).length > 0 ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                      <p className="font-semibold">
                        Some steps still need attention.
                      </p>
                      <ul className="mt-1 list-disc pl-4">
                        {[0, 1, 2, 3, 4].map((index) => {
                          const stepErrors = validateStep(index);
                          if (Object.keys(stepErrors).length === 0) return null;
                          return (
                            <li key={index}>
                              <button
                                type="button"
                                onClick={() => goToStep(index)}
                                className="underline underline-offset-2"
                              >
                                {STEPS[index].title}
                              </button>
                              : {Object.values(stepErrors).join(" ")}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}

                  <dl className="grid gap-3 rounded-lg border border-km-charcoal/10 bg-km-warm-white/50 p-4 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="text-km-charcoal/55">Name</dt>
                      <dd className="font-semibold text-km-charcoal">
                        {[form.firstName, form.middleName, form.lastName, form.suffix]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-km-charcoal/55">Program</dt>
                      <dd className="font-semibold text-km-charcoal">
                        {programs.find((program) => program.slug === form.program)
                          ?.name || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-km-charcoal/55">Address</dt>
                      <dd className="font-semibold text-km-charcoal">
                        {[
                          form.streetAddress,
                          form.barangay,
                          form.city,
                          form.province,
                          form.region,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-km-charcoal/55">
                        Birthdate / Age
                      </dt>
                      <dd className="font-semibold text-km-charcoal">
                        {form.birthMonth && form.birthDay && form.birthYear
                          ? `${MONTHS[Number(form.birthMonth) - 1]} ${form.birthDay}, ${form.birthYear}${age ? ` (${age})` : ""}`
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-km-charcoal/55">
                        Educational attainment
                      </dt>
                      <dd className="font-semibold text-km-charcoal">
                        {form.educationalAttainment || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-km-charcoal/55">Classification</dt>
                      <dd className="font-semibold text-km-charcoal">
                        {form.classification.length > 0
                          ? form.classification
                              .map((entry) =>
                                entry === "Others" && form.classificationOthers
                                  ? `Others: ${form.classificationOthers}`
                                  : entry
                              )
                              .join("; ")
                          : "—"}
                      </dd>
                    </div>
                  </dl>

                  {/*
                    Heading, instructions and the filled form share one card.
                    Phones (Edge/Chrome mobile) have no inline PDF viewer, so a
                    framed PDF is blocked there; small screens get a download
                    action instead, the embedded preview is desktop only.
                  */}
                  <div className="overflow-hidden rounded-lg border border-km-charcoal/20 bg-km-warm-white">
                    <div className="border-b border-km-charcoal/10 p-5 sm:p-6">
                      <h3 className="font-brand text-base font-semibold text-km-charcoal">
                        Review your answers
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-km-charcoal/65 sm:text-sm">
                        Check this PDF. If any detail is wrong, go back to the
                        step that holds it before you submit. The ID picture,
                        1×1 picture, signature and right thumbmark stay blank —
                        you fill those by hand after printing.
                      </p>
                    </div>

                    <div className="hidden bg-stone-200 md:block">
                      {previewPdfUrl ? (
                        <iframe
                          src={previewPdfUrl}
                          title="Learners Profile Form preview (PDF)"
                          className="h-[820px] w-full bg-stone-200"
                        />
                      ) : (
                        <div className="flex h-[820px] flex-col items-center justify-center gap-3 px-6 text-center text-sm text-km-charcoal/60">
                          {previewError ? null : (
                            <Spinner className="h-5 w-5 text-km-orange" />
                          )}
                          <p>{previewError ?? "Filling the form with your details…"}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-5 md:hidden">
                      <p className="text-xs leading-relaxed text-km-charcoal/65">
                        Phone browsers can&rsquo;t display a PDF inside the page,
                        so download the file to review, save or print it.
                      </p>
                      {previewPdfUrl ? (
                        <a
                          href={previewPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          download="km100-learners-profile-form.pdf"
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-km-orange px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-km-orange/90"
                        >
                          <DownloadIcon />
                          Download Form
                        </a>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 rounded-md border border-km-charcoal/10 bg-km-warm-white/60 px-3 py-3 text-xs text-km-charcoal/60">
                          {previewError ? null : (
                            <Spinner className="h-4 w-4 text-km-orange" />
                          )}
                          <span>
                            {previewError ?? "Filling the form with your details…"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {submitError ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || isSubmitting}
              className={cn(
                "rounded-md border border-km-charcoal/20 px-5 py-2.5 text-sm font-semibold text-km-charcoal transition-colors",
                step === 0
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-km-orange hover:text-km-orange"
              )}
            >
              Back
            </button>

            {isReview ? (
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className={cn(
                    "inline-flex min-w-[15rem] items-center justify-center gap-2.5 rounded-md px-8 py-3 text-base font-semibold text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange/40 focus-visible:ring-offset-2",
                    isSubmitting
                      ? "cursor-progress bg-km-orange/80 shadow-none"
                      : "bg-km-orange hover:bg-km-orange/90 active:scale-[0.99]"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      <span>Preparing your form…</span>
                    </>
                  ) : (
                    "Submit Pre-Registration"
                  )}
                </button>
                <p
                  aria-live="polite"
                  className={cn(
                    "text-xs transition-opacity",
                    isSubmitting
                      ? "text-km-charcoal/60"
                      : "pointer-events-none opacity-0"
                  )}
                >
                  Saving your registration and filling the form — a few
                  seconds.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-km-orange px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-km-orange/90"
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}
