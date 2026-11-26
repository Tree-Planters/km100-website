"use client";

import { programs } from "@/lib/programs";
import {
  CIVIL_STATUS_OPTIONS,
  CLASSIFICATION_OPTIONS,
  EDUCATIONAL_ATTAINMENT_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SCHOLARSHIP_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

import { MONTHS, NATIONALITIES, STEPS, inputClass, selectClass } from "./form-types";
import { MailIcon, Spinner, SummaryGroup, SummaryRow } from "./ui";
import { useRegistration } from "./use-registration";

export function StepNameAndAddress() {
  const { barangays, checkEmailAvailability, cities, districts,
      emailCheck, emailCheckSeq, errors, form, loadingBarangays,
      loadingCities, loadingProvinces, loadingRegions, provinces,
      regions, set, setAllBarangays, setBarangays, setCities,
      setDistricts, setEmailCheck, setForm, setProvinces } = useRegistration();

  return (
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
            Email Address{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="field-email"
            type="email"
            value={form.email}
            onChange={(event) => {
              set("email", event.target.value);
              emailCheckSeq.current += 1;
              setEmailCheck({ state: "idle", message: "" });
            }}
            onBlur={() => void checkEmailAvailability()}
            placeholder="name@example.com"
            className={inputClass}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          ) : emailCheck.state === "checking" ? (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-km-charcoal/55">
              <Spinner className="h-3 w-3" />
              Checking this email address…
            </p>
          ) : emailCheck.state === "available" ? (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <svg
                className="h-3 w-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              This email is not yet pre-registered.
            </p>
          ) : emailCheck.state === "error" ? (
            <p className="mt-1 text-[11px] font-medium text-amber-600">
              {emailCheck.message}
            </p>
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
  );
}

export function StepPersonal() {
  const { age, birthCities, birthProvinces, cities, errors, form,
      loadingBirthCities, loadingBirthProvinces, loadingRegions,
      provinces, regions, set, setBirthCities, setBirthProvinces,
      setForm } = useRegistration();

  return (
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
  );
}

export function StepEducation() {
  const { copyAddressToGuardian, errors, form, set } = useRegistration();

  return (
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
  );
}

export function StepClassification() {
  const { errors, form, set, toggleClassification } = useRegistration();

  return (
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
  );
}

export function StepCourse() {
  const { errors, form, set } = useRegistration();

  return (
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
  );
}

export function StepReview() {
  const { age, errors, form, goToStep, step, validateStep } = useRegistration();

  return (
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

      <div className="space-y-3">
        <SummaryGroup
          title="Name & Address"
          stepIndex={0}
          onEdit={goToStep}
        >
          <SummaryRow
            label="Full name"
            className="sm:col-span-2"
            value={[
              form.firstName,
              form.middleName,
              form.lastName,
              form.suffix,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <SummaryRow label="Email address" value={form.email} />
          <SummaryRow
            label="Mobile number"
            value={form.mobile}
          />
          <SummaryRow
            label="Nationality"
            value={form.nationality}
          />
          <SummaryRow
            label="Permanent address"
            className="sm:col-span-2"
            value={[
              form.streetAddress,
              form.barangay,
              form.city,
              form.province,
              form.region,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </SummaryGroup>

        <SummaryGroup
          title="Personal Information"
          stepIndex={1}
          onEdit={goToStep}
        >
          <SummaryRow label="Sex" value={form.sex} />
          <SummaryRow
            label="Civil status"
            value={form.civilStatus}
          />
          <SummaryRow
            label="Date of birth"
            value={
              form.birthMonth && form.birthDay && form.birthYear
                ? `${MONTHS[Number(form.birthMonth) - 1]} ${form.birthDay}, ${form.birthYear}`
                : ""
            }
          />
          <SummaryRow label="Age" value={age} />
          <SummaryRow
            label="Place of birth"
            value={[
              form.birthCity,
              form.birthProvince,
              form.birthRegion,
            ]
              .filter(Boolean)
              .join(", ")}
          />
          <SummaryRow
            label="Employment status"
            value={form.employmentStatus}
          />
          {form.employmentType ? (
            <SummaryRow
              label="Employment type"
              value={form.employmentType}
            />
          ) : null}
        </SummaryGroup>

        <SummaryGroup
          title="Education & Guardian"
          stepIndex={2}
          onEdit={goToStep}
        >
          <SummaryRow
            label="Educational attainment"
            value={form.educationalAttainment}
          />
          <SummaryRow
            label="Parent / Guardian name"
            value={form.parentName}
          />
          <SummaryRow
            label="Parent / Guardian address"
            className="sm:col-span-2"
            value={form.parentAddress}
          />
        </SummaryGroup>

        <SummaryGroup
          title="Classification"
          stepIndex={3}
          onEdit={goToStep}
        >
          <SummaryRow
            label="Classification"
            className="sm:col-span-2"
            value={form.classification
              .map((entry) =>
                entry === "Others" && form.classificationOthers
                  ? `Others: ${form.classificationOthers}`
                  : entry
              )
              .join("; ")}
          />
        </SummaryGroup>

        <SummaryGroup
          title="Course & Privacy"
          stepIndex={4}
          onEdit={goToStep}
        >
          <SummaryRow
            label="Program"
            value={
              programs.find(
                (program) => program.slug === form.program
              )?.name || form.program
            }
          />
          <SummaryRow
            label="Scholarship package"
            value={form.scholarshipPackage}
          />
          <SummaryRow
            label="Privacy consent"
            value={form.consent ? "Agreed" : ""}
          />
          <SummaryRow
            label="Acknowledgement"
            value={form.acknowledgement ? "Acknowledged" : ""}
          />
        </SummaryGroup>
      </div>

      {/* The email is where the reference number and form are sent. */}
      <div className="rounded-lg border border-km-orange/30 bg-km-orange/[0.06] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-km-orange/10 text-km-orange">
            <MailIcon className="h-[1.15rem] w-[1.15rem]" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-km-charcoal">
              Make sure this email address is correct
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-km-orange">
              {form.email || "\u2014"}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/65">
              Your reference number and a copy of your
              pre-registration form are sent to this address. If it
              has a typo, go back to the first step and fix it
              before submitting.
            </p>
            <button
              type="button"
              onClick={() => goToStep(0)}
              className="mt-2 text-xs font-semibold text-km-orange underline underline-offset-2 hover:text-km-orange/80"
            >
              Change email address
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
