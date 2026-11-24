"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";
import { cn } from "@/lib/utils";
import {
  CIVIL_STATUS_OPTIONS,
  HIGHEST_ATTAINMENT_OPTIONS,
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

export default function PreRegistrationPage() {
  // Submission & Result States
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form Fields - Personal Info
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [civilStatus, setCivilStatus] = useState("");

  // PSGC Geographic Cascading States
  // Order: Region -> Province -> City/Municipality -> District -> Barangay -> Number/ Street
  const [regions, setRegions] = useState<PsgcItem[]>([]);
  const [provinces, setProvinces] = useState<PsgcItem[]>([]);
  const [cities, setCities] = useState<PsgcItem[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<PsgcItem[]>([]);
  const [allBarangays, setAllBarangays] = useState<PsgcItem[]>([]);

  // Selected PSGC Codes & Names (saving both code and name)
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [selectedRegionName, setSelectedRegionName] = useState("");

  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [selectedBarangayCode, setSelectedBarangayCode] = useState("");
  const [selectedBarangayName, setSelectedBarangayName] = useState("");

  const [streetAddress, setStreetAddress] = useState("");

  // Loading States for PSGC
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Form Fields - Educational Information
  const [isCurrentlyEnrolled, setIsCurrentlyEnrolled] = useState<"YES" | "NO" | "">("");
  const [currentSchool, setCurrentSchool] = useState("");
  const [currentGradeLevel, setCurrentGradeLevel] = useState("");
  const [currentProgram, setCurrentProgram] = useState("");
  const [highestAttainment, setHighestAttainment] = useState("");

  // Form Fields - Program Interest & Agreements
  const [selectedProgram, setSelectedProgram] = useState("");
  const [acknowledgement, setAcknowledgement] = useState(false);
  const [consent, setConsent] = useState(false);

  // 1. Fetch Regions on Mount
  useEffect(() => {
    let isMounted = true;
    setLoadingRegions(true);
    fetch("https://psgc.cloud/api/v2/regions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch regions");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setRegions(list);
      })
      .catch((err) => {
        console.error("Error fetching regions:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingRegions(false);
      });
      
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cascading: When Region changes -> Reset children & Fetch Provinces
  useEffect(() => {
    // Reset all child levels
    setSelectedProvinceCode("");
    setSelectedProvinceName("");
    setProvinces([]);

    setSelectedCityCode("");
    setSelectedCityName("");
    setCities([]);

    setSelectedDistrict("");
    setDistricts([]);

    setSelectedBarangayCode("");
    setSelectedBarangayName("");
    setBarangays([]);
    setAllBarangays([]);

    if (!selectedRegionCode) return;

    let isMounted = true;
    setLoadingProvinces(true);

    fetch(`https://psgc.cloud/api/v2/regions/${selectedRegionCode}/provinces`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch provinces");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];

        if (list.length > 0) {
          list.sort((a, b) => a.name.localeCompare(b.name));
          setProvinces(list);
        } else {
          // Special case: NCR has no provinces
          const ncrProvince: PsgcItem = {
            code: selectedRegionCode,
            name: "Metro Manila",
          };
          setProvinces([ncrProvince]);
          setSelectedProvinceCode(ncrProvince.code);
          setSelectedProvinceName(ncrProvince.name);

          // Fetch cities directly for NCR
          setLoadingCities(true);
          fetch(`https://psgc.cloud/api/v2/regions/${selectedRegionCode}/cities-municipalities`)
            .then((cRes) => cRes.json())
            .then((cData) => {
              if (!isMounted) return;
              const cList: PsgcItem[] = Array.isArray(cData) ? cData : cData.data || [];
              cList.sort((a, b) => a.name.localeCompare(b.name));
              setCities(cList);
            })
            .catch((err) => console.error("Error fetching NCR cities:", err))
            .finally(() => {
              if (isMounted) setLoadingCities(false);
            });
        }
      })
      .catch((err) => console.error("Error fetching provinces:", err))
      .finally(() => {
        if (isMounted) setLoadingProvinces(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedRegionCode]);

  // 3. Cascading: When Province changes -> Reset children & Fetch Cities/Municipalities
  useEffect(() => {
    // If province is empty or was already handled by NCR special case, skip
    if (!selectedProvinceCode) {
      setSelectedCityCode("");
      setSelectedCityName("");
      setCities([]);
      setSelectedDistrict("");
      setDistricts([]);
      setSelectedBarangayCode("");
      setSelectedBarangayName("");
      setBarangays([]);
      setAllBarangays([]);
      return;
    }

    // Skip re-fetching if NCR was already populated
    if (selectedProvinceCode === selectedRegionCode) return;

    // Reset children
    setSelectedCityCode("");
    setSelectedCityName("");
    setCities([]);

    setSelectedDistrict("");
    setDistricts([]);

    setSelectedBarangayCode("");
    setSelectedBarangayName("");
    setBarangays([]);
    setAllBarangays([]);

    let isMounted = true;
    setLoadingCities(true);

    fetch(`https://psgc.cloud/api/v2/provinces/${selectedProvinceCode}/cities-municipalities`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cities");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setCities(list);
      })
      .catch((err) => console.error("Error fetching cities:", err))
      .finally(() => {
        if (isMounted) setLoadingCities(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProvinceCode, selectedRegionCode]);

  // 4. Cascading: When City changes -> Reset children & Fetch Barangays & Districts
  useEffect(() => {
    setSelectedDistrict("");
    setDistricts([]);

    setSelectedBarangayCode("");
    setSelectedBarangayName("");
    setBarangays([]);
    setAllBarangays([]);

    if (!selectedCityCode) return;

    let isMounted = true;
    setLoadingBarangays(true);

    fetch(`https://psgc.cloud/api/v2/cities-municipalities/${selectedCityCode}/barangays`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch barangays");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const list: PsgcItem[] = Array.isArray(data) ? data : data.data || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        setAllBarangays(list);
        setBarangays(list);

        // Extract unique districts from barangays or city object
        const uniqueDistricts = Array.from(
          new Set(
            list
              .map((b) => b.district)
              .filter((d): d is string => typeof d === "string" && d.trim() !== "")
          )
        ).sort();

        const selectedCityObj = cities.find((c) => c.code === selectedCityCode);
        if (selectedCityObj && selectedCityObj.district && !uniqueDistricts.includes(selectedCityObj.district)) {
          uniqueDistricts.unshift(selectedCityObj.district);
        }

        setDistricts(uniqueDistricts.length > 0 ? uniqueDistricts : ["Lone District"]);
      })
      .catch((err) => console.error("Error fetching barangays:", err))
      .finally(() => {
        if (isMounted) setLoadingBarangays(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCityCode, cities]);

  // 5. Cascading: When District changes -> Filter Barangays
  useEffect(() => {
    setSelectedBarangayCode("");
    setSelectedBarangayName("");

    if (!selectedDistrict || selectedDistrict === "Lone District") {
      setBarangays(allBarangays);
      return;
    }

    const filtered = allBarangays.filter(
      (b) => !b.district || b.district.toLowerCase() === selectedDistrict.toLowerCase()
    );
    setBarangays(filtered.length > 0 ? filtered : allBarangays);
  }, [selectedDistrict, allBarangays]);

  // Validate and submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const errors: Record<string, string> = {};

    // Basic Validation
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!mobile.trim() || mobile.trim().length < 7) errors.mobile = "Valid contact number is required";
    if (!email.trim() || !email.includes("@")) errors.email = "Valid email address is required";
    if (!civilStatus) errors.civilStatus = "Civil status is required";

    // PSGC Geographic Address Validation
    if (!selectedRegionCode) errors.region = "Region is required";
    if (!selectedProvinceCode) errors.province = "Province is required";
    if (!selectedCityCode) errors.municipality = "City/Municipality is required";
    if (!selectedDistrict) errors.district = "District is required";
    if (!selectedBarangayCode) errors.barangay = "Barangay is required";
    if (!streetAddress.trim()) errors.street = "Number / Street or Sitio is required";

    // Education Validation
    if (!isCurrentlyEnrolled) errors.isCurrentlyEnrolled = "Please indicate if currently enrolled";
    if (isCurrentlyEnrolled === "YES" && !currentSchool.trim()) {
      errors.currentSchool = "Name of school is required";
    }
    if (isCurrentlyEnrolled === "NO" && !highestAttainment) {
      errors.highestAttainment = "Highest educational attainment is required";
    }

    // Program & Agreements
    if (!selectedProgram) errors.program = "Please select a diploma program";
    if (!acknowledgement) errors.acknowledgement = "You must acknowledge this notice";
    if (!consent) errors.consent = "You must agree to the data privacy agreement";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        suffix: suffix.trim() || undefined,
        mobile: mobile.trim(),
        email: email.trim(),
        civilStatus,
        region: selectedRegionName,
        regionCode: selectedRegionCode,
        province: selectedProvinceName,
        provinceCode: selectedProvinceCode,
        municipality: selectedCityName,
        cityCode: selectedCityCode,
        district: selectedDistrict,
        barangay: selectedBarangayName,
        barangayCode: selectedBarangayCode,
        address: streetAddress.trim(),
        sitio: streetAddress.trim(),
        isCurrentlyEnrolled,
        currentSchool: currentSchool.trim() || undefined,
        currentGradeLevel: currentGradeLevel.trim() || undefined,
        currentProgram: currentProgram.trim() || undefined,
        highestAttainment: highestAttainment || undefined,
        program: selectedProgram,
        acknowledgement,
        consent,
      };

      const res = await fetch("/api/pre-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setReferenceNumber(data.referenceNumber);
    } catch (err) {
      setSubmitError("Failed to submit pre-registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
 
      <Section>
        <div className="mx-auto max-w-3xl">
          {referenceNumber ? (
            <div className="rounded-xl border border-km-orange/40 bg-km-warm-white p-8 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-km-orange/10 text-km-orange">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-km-charcoal">
                Pre-Registration Received
              </h2>
              <p className="mt-3 text-sm text-km-charcoal/80">
                Keep your reference number for verification:
              </p>
              <div className="mt-4 inline-block rounded-lg border border-km-orange/30 bg-white px-6 py-3 font-mono text-xl font-bold tracking-wider text-km-orange shadow-xs">
                {referenceNumber}
              </div>
              <p className="mx-auto mt-4 max-w-md text-xs text-km-charcoal/70">
                This form serves as pre-registration only, not official enrollment. Our
                admissions team will contact you regarding required documents and schedules.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/programs" variant="outline">
                  Explore our programs
                </ButtonLink>
                <ButtonLink href="/">Return to Home</ButtonLink>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* SECTION I: PERSONAL INFORMATION */}
              <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
                <div className="border-b border-km-charcoal/10 pb-4">
                  <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
                    I. Personal Information
                  </h3>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    Please provide your legal name, contact details, and Philippine Standard Geographic Address.
                  </p>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-km-charcoal">
                      Full Name: <span className="font-normal text-km-charcoal/70">(Last Name, First Name, Middle Name)</span>
                    </label>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="text-xs font-medium text-km-charcoal/80">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="e.g. Dela Cruz"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClass}
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-km-charcoal/80">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="e.g. Juan"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClass}
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-km-charcoal/80">
                          Middle Name <span className="text-km-charcoal/50">(Optional)</span>
                        </label>
                        <input
                          placeholder="e.g. Santos"
                          value={middleName}
                          onChange={(e) => setMiddleName(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-km-charcoal/80">
                          Suffix <span className="text-km-charcoal/50">(e.g. Jr., III)</span>
                        </label>
                        <input
                          placeholder="e.g. Jr."
                          value={suffix}
                          onChange={(e) => setSuffix(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Number, Email, Civil Status */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-km-charcoal/80">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="09XX XXX XXXX"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className={inputClass}
                      />
                      {formErrors.mobile && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.mobile}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-km-charcoal/80">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-km-charcoal/80">
                        Civil Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={civilStatus}
                        onChange={(e) => setCivilStatus(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select status</option>
                        {CIVIL_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {formErrors.civilStatus && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.civilStatus}</p>
                      )}
                    </div>
                  </div>

                  {/* Complete Address */}
                  <div>
                    <label className="block text-sm font-semibold text-km-charcoal">
                      Complete Address
                    </label>

                    <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* 1. Region */}
                      <div>
                        <label className="block text-xs font-medium text-km-charcoal/80">
                          Region <span className="text-red-500">*</span>
                       
                        </label>
                        <select
                          value={selectedRegionCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setSelectedRegionCode(code);
                            const item = regions.find((r) => r.code === code);
                            setSelectedRegionName(item ? item.name : "");
                          }}
                          disabled={loadingRegions}
                          className={selectClass}
                        >
                          <option value="">
                            {loadingRegions ? "Loading regions..." : "Select Region"}
                          </option>
                          {regions.map((reg) => (
                            <option key={reg.code} value={reg.code}>
                              {reg.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.region && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.region}</p>
                        )}
                      </div>

                      {/* 2. Province */}
                      <div>
                        <label className="block text-xs font-medium text-km-charcoal/80">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedProvinceCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setSelectedProvinceCode(code);
                            const item = provinces.find((p) => p.code === code);
                            setSelectedProvinceName(item ? item.name : "");
                          }}
                          disabled={!selectedRegionCode || loadingProvinces}
                          className={selectClass}
                        >
                          <option value="">
                            {!selectedRegionCode
                              ? "Select Region first"
                              : loadingProvinces
                              ? "Loading provinces..."
                              : "Select Province"}
                          </option>
                          {provinces.map((prov) => (
                            <option key={prov.code} value={prov.code}>
                              {prov.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.province && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.province}</p>
                        )}
                      </div>

                      {/* 3. City / Municipality */}
                      <div>
                        <label className="block text-xs font-medium text-km-charcoal/80">
                          City / Municipality <span className="text-red-500">*</span>
                        
                        </label>
                        <select
                          value={selectedCityCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setSelectedCityCode(code);
                            const item = cities.find((c) => c.code === code);
                            setSelectedCityName(item ? item.name : "");
                          }}
                          disabled={!selectedProvinceCode || loadingCities}
                          className={selectClass}
                        >
                          <option value="">
                            {!selectedProvinceCode
                              ? "Select Province first"
                              : loadingCities
                              ? "Loading cities/municipalities..."
                              : "Select City / Municipality"}
                          </option>
                          {cities.map((city) => (
                            <option key={city.code} value={city.code}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.municipality && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.municipality}</p>
                        )}
                      </div>

                      {/* 4. District */}
                      <div>
                        <label className="block text-xs font-medium text-km-charcoal/80">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          disabled={!selectedCityCode || districts.length === 0}
                          className={selectClass}
                        >
                          <option value="">
                            {!selectedCityCode
                              ? "Select City first"
                              : districts.length === 0
                              ? "No district required"
                              : "Select District"}
                          </option>
                          {districts.map((d) => (
                            <option key={d} value={d}>
                              {d.toLowerCase().includes("district") ? d : `${d} District`}
                            </option>
                          ))}
                        </select>
                        {formErrors.district && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.district}</p>
                        )}
                      </div>

                      {/* 5. Barangay */}
                      <div>
                        <label className="block text-xs font-medium text-km-charcoal/80">
                          Barangay <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedBarangayCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setSelectedBarangayCode(code);
                            const item = barangays.find((b) => b.code === code);
                            setSelectedBarangayName(item ? item.name : "");
                          }}
                          disabled={!selectedCityCode || loadingBarangays}
                          className={selectClass}
                        >
                          <option value="">
                            {!selectedCityCode
                              ? "Select City first"
                              : loadingBarangays
                              ? "Loading barangays..."
                              : "Select Barangay"}
                          </option>
                          {barangays.map((brgy) => (
                            <option key={brgy.code} value={brgy.code}>
                              {brgy.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.barangay && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.barangay}</p>
                        )}
                      </div>

                      {/* 6. Number / Street or Sitio (Text input only) */}
                      <div>
                        <label className="block text-xs font-medium text-km-charcoal/80">
                          Number / Street or Sitio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sitio Mahayahay, House #12, Purok 3"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className={inputClass}
                        />
                        {formErrors.street && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.street}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION II: EDUCATIONAL INFORMATION */}
              <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
                <div className="border-b border-km-charcoal/10 pb-4">
                  <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
                    II. Educational Information
                  </h3>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    Tell us about your current educational status and previous school background.
                  </p>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-km-charcoal">
                      Are you currently enrolled in a school or educational Institution?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-3 flex gap-6">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-km-charcoal">
                        <input
                          type="radio"
                          name="isCurrentlyEnrolled"
                          value="YES"
                          checked={isCurrentlyEnrolled === "YES"}
                          onChange={() => setIsCurrentlyEnrolled("YES")}
                          className="h-4 w-4 accent-km-orange"
                        />
                        <span className="font-medium">YES</span>
                      </label>

                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-km-charcoal">
                        <input
                          type="radio"
                          name="isCurrentlyEnrolled"
                          value="NO"
                          checked={isCurrentlyEnrolled === "NO"}
                          onChange={() => setIsCurrentlyEnrolled("NO")}
                          className="h-4 w-4 accent-km-orange"
                        />
                        <span className="font-medium">NO</span>
                      </label>
                    </div>
                    {formErrors.isCurrentlyEnrolled && (
                      <p className="mt-2 text-xs text-red-600">{formErrors.isCurrentlyEnrolled}</p>
                    )}
                  </div>

                  {isCurrentlyEnrolled === "YES" && (
                    <div className="rounded-lg border border-km-orange/20 bg-km-warm-white/60 p-4 sm:p-6">
                      <h4 className="text-sm font-semibold text-km-charcoal">
                        If YES, please indicate:
                      </h4>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-xs font-medium text-km-charcoal/80">
                            Name of School <span className="text-red-500">*</span>
                          </label>
                          <input
                            placeholder="School name"
                            value={currentSchool}
                            onChange={(e) => setCurrentSchool(e.target.value)}
                            className={inputClass}
                          />
                          {formErrors.currentSchool && (
                            <p className="mt-1 text-xs text-red-600">{formErrors.currentSchool}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-medium text-km-charcoal/80">
                            Current Grade/Year Level
                          </label>
                          <input
                            placeholder="e.g. Grade 12 / 1st Year"
                            value={currentGradeLevel}
                            onChange={(e) => setCurrentGradeLevel(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-km-charcoal/80">
                            Program / Course
                          </label>
                          <input
                            placeholder="e.g. STEM / TVL / General"
                            value={currentProgram}
                            onChange={(e) => setCurrentProgram(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isCurrentlyEnrolled === "NO" && (
                    <div className="rounded-lg border border-km-orange/20 bg-km-warm-white/60 p-4 sm:p-6">
                      <label className="block text-sm font-semibold text-km-charcoal">
                        If NO, please indicate your highest educational attainment:{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 max-w-md">
                        <select
                          value={highestAttainment}
                          onChange={(e) => setHighestAttainment(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select highest attainment</option>
                          {HIGHEST_ATTAINMENT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {formErrors.highestAttainment && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.highestAttainment}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION III: PROGRAM INTEREST */}
              <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
                <div className="border-b border-km-charcoal/10 pb-4">
                  <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
                    III. Program Interest
                  </h3>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    Select the 3-Year Diploma program (PQF Level 5) you wish to register for.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-medium text-km-charcoal/80">
                    Select Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className={cn(selectClass, "text-base sm:text-sm")}
                  >
                    <option value="">Choose a diploma program</option>
                    {programs.map((prog) => (
                      <option key={prog.slug} value={prog.slug}>
                        {prog.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.program && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.program}</p>
                  )}
                </div>
              </section>

              {/* SECTION IV: ACKNOWLEDGEMENT */}
              <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
                <div className="border-b border-km-charcoal/10 pb-4">
                  <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
                    IV. Acknowledgement
                  </h3>
                </div>

                <div className="mt-4 rounded-lg bg-km-warm-white p-4 text-xs leading-relaxed text-km-charcoal/85 sm:text-sm">
                  I understand that this form serves as a registration/sign-up form only and does not
                  confirm my official enrollment in the KM100 STC 3-Year Diploma Program. I understand
                  that I will be contacted by KM100 Skills and Training Center, Inc. regarding the
                  official enrollment process, requirements, schedule, and other necessary information.
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-km-charcoal">
                  <input
                    type="checkbox"
                    checked={acknowledgement}
                    onChange={(e) => setAcknowledgement(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-km-orange"
                  />
                  <span className="font-semibold text-km-charcoal">
                    I ACKNOWLEDGE <span className="text-red-500">*</span>
                  </span>
                </label>
                {formErrors.acknowledgement && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.acknowledgement}</p>
                )}
              </section>

              {/* SECTION V: DATA PRIVACY AGREEMENT */}
              <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
                <div className="border-b border-km-charcoal/10 pb-4">
                  <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
                    V. Data Privacy Agreement
                  </h3>
                </div>

                <div className="mt-4 space-y-2 rounded-lg bg-km-warm-white p-4 text-xs leading-relaxed text-km-charcoal/85 sm:text-sm">
                  <p>
                    I understand that KM100 Skills and Training Center, Inc. respects my privacy and
                    complies with Republic Act No. 10173 (Data Privacy Act of 2012). By signing this
                    form, I consent to the collection and processing of my personal information for
                    registration, enrollment, communication, and other legitimate purposes related to the
                    3-Year Diploma Program.
                  </p>
                  <p>
                    I understand that my information will be kept confidential and protected from
                    unauthorized access or disclosure, except when required or permitted by law. I also
                    understand that I have the right to access and request correction of my personal
                    information, subject to applicable laws.
                  </p>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-km-charcoal">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-km-orange"
                  />
                  <span className="font-semibold text-km-charcoal">
                    I AGREE AND CONSENT <span className="text-red-500">*</span>
                  </span>
                </label>
                {formErrors.consent && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.consent}</p>
                )}
              </section>

              {submitError && (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md bg-km-orange px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-km-orange/90 active:scale-98",
                    isSubmitting && "cursor-not-allowed opacity-60"
                  )}
                >
                  {isSubmitting ? "Submitting Registration…" : "Submit Pre-Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
