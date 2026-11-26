"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ageFromBirthDate,
  isCurrentlyEnrolledFromAttainment,
} from "@/lib/tesda-form";
import type { PreRegistrationInput } from "@/lib/validation";

import {
  DRAFT_STORAGE_KEY,
  EMPTY_FORM,
  STEPS,
  isDraftEmpty,
  readDraft,
  type FormState,
  type PsgcItem,
} from "./form-types";

/** All form state, PSGC cascades, validation and submission for pre-registration. */
function useRegistrationState() {
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

  // Duplicate-email cross-check for step 1.
  const [emailCheck, setEmailCheck] = useState<{
    state: "idle" | "checking" | "available" | "taken" | "error";
    message: string;
  }>({ state: "idle", message: "" });
  const emailCheckSeq = useRef(0);
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

  // ---------- validation ----------
  /**
   * Cross-checks the typed email against saved pre-registrations so a
   * duplicate is caught on step 1 rather than only when submitting.
   */
  async function checkEmailAvailability(value?: string) {
    const email = (value ?? form.email).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailCheck({ state: "idle", message: "" });
      return "idle" as const;
    }

    const seq = emailCheckSeq.current + 1;
    emailCheckSeq.current = seq;
    setEmailCheck({ state: "checking", message: "Checking this email address…" });

    try {
      const res = await fetch(
        `/api/pre-registration/check-email?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`email check failed: ${res.status}`);

      const data = (await res.json()) as {
        exists?: boolean;
        referenceNumber?: string | null;
      };
      if (seq !== emailCheckSeq.current) return "stale" as const;

      if (data.exists) {
        const message = data.referenceNumber
          ? `This email is already pre-registered (${data.referenceNumber}). Use a different email address.`
          : "This email is already pre-registered. Use a different email address.";
        setEmailCheck({ state: "taken", message });
        setErrors((current) => ({ ...current, email: message }));
        return "taken" as const;
      }

      setEmailCheck({
        state: "available",
        message: "This email is not yet pre-registered.",
      });
      setErrors((current) => {
        if (!current.email) return current;
        const next = { ...current };
        delete next.email;
        return next;
      });
      return "available" as const;
    } catch (error) {
      console.error("[pre-registration] email check failed", error);
      setEmailCheck({
        state: "error",
        message:
          "We couldn't verify this email right now. You can still continue.",
      });
      return "error" as const;
    }
  }

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
      else if (emailCheck.state === "taken")
        next.email =
          emailCheck.message || "This email is already pre-registered.";
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

  async function goNext() {
    const nextErrors = validateStep(step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    if (step === 0) {
      const result = await checkEmailAvailability();
      if (result === "taken") {
        focusFirstError({ email: "" });
        return;
      }
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

  /** Wipes every answer, the saved draft and any email check result. */
  function clearForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
    setEmailCheck({ state: "idle", message: "" });
    emailCheckSeq.current += 1;
    setStep(0);
    setMaxStep(0);

    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error("[pre-registration] failed to clear draft", error);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function goToStep(index: number) {
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

      // The same duplicate-email guard applies when jumping ahead.
      const result = await checkEmailAvailability();
      if (result === "taken") {
        setStep(0);
        focusFirstError({ email: "" });
        return;
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

    // Always cross-check the email before a record is created.
    const emailResult = await checkEmailAvailability();
    if (emailResult === "taken") {
      setStep(0);
      focusFirstError({ email: "" });
      return;
    }

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

  return {
    age,
    allBarangays,
    barangays,
    birthCities,
    birthProvinces,
    checkEmailAvailability,
    cities,
    clearForm,
    confirmationEmailSent,
    copyAddressToGuardian,
    districts,
    emailCheck,
    emailCheckSeq,
    errors,
    focusFirstError,
    form,
    goBack,
    goNext,
    goToStep,
    handleSubmit,
    isSubmitting,
    loadingBarangays,
    loadingBirthCities,
    loadingBirthProvinces,
    loadingCities,
    loadingProvinces,
    loadingRegions,
    maxStep,
    provinces,
    referenceNumber,
    regions,
    set,
    setAllBarangays,
    setBarangays,
    setBirthCities,
    setBirthProvinces,
    setCities,
    setConfirmationEmailSent,
    setDistricts,
    setEmailCheck,
    setErrors,
    setForm,
    setIsSubmitting,
    setLoadingBarangays,
    setLoadingBirthCities,
    setLoadingBirthProvinces,
    setLoadingCities,
    setLoadingProvinces,
    setLoadingRegions,
    setMaxStep,
    setProvinces,
    setReferenceNumber,
    setRegions,
    setStep,
    setSubmitError,
    step,
    submitError,
    toggleClassification,
    validateStep,
  };
}

export type RegistrationController = ReturnType<typeof useRegistrationState>;

const RegistrationContext = createContext<RegistrationController | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const value = useRegistrationState();
  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used inside <RegistrationProvider>");
  }
  return context;
}
