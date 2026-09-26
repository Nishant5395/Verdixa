import { useMemo, useState } from "react";
import { Loader2Icon, MapPinCheckIcon } from "lucide-react";
import { Country, State } from "country-state-city";

export interface LocationValue {
  country: string; // display name, e.g. "India"
  state: string; // display name, e.g. "Uttar Pradesh"
  city: string;
  zip: string;
}

interface LocationFieldsProps {
  value: LocationValue;
  onChange: (patch: Partial<LocationValue>) => void;
}

const inputCls =
  "w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-app-green outline-none transition-all";

const ALL_COUNTRIES = Country.getAllCountries();
// India first, since that's who this store mostly serves - the rest stay alphabetical after it.
const COUNTRY_OPTIONS = [
  ...ALL_COUNTRIES.filter((c) => c.isoCode === "IN"),
  ...ALL_COUNTRIES.filter((c) => c.isoCode !== "IN").sort((a, b) => a.name.localeCompare(b.name)),
];

type PincodeStatus = "idle" | "looking-up" | "found" | "not-found" | "error";

/**
 * Country -> State -> City/PIN fields, shared by every "add/edit address" form.
 *
 * For India, entering a 6-digit PIN code looks up the district and state automatically
 * (India Post's public directory, no key needed) - same as most Indian shopping apps.
 * The user can still edit city/state by hand afterwards, and nothing here blocks typing
 * if the lookup fails or the network is unavailable.
 */
export default function LocationFields({ value, onChange }: LocationFieldsProps) {
  const [pincodeStatus, setPincodeStatus] = useState<PincodeStatus>("idle");

  const selectedCountry = useMemo(
    () => ALL_COUNTRIES.find((c) => c.name === value.country) || COUNTRY_OPTIONS[0],
    [value.country]
  );
  const isIndia = selectedCountry?.isoCode === "IN";

  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []),
    [selectedCountry]
  );

  const lookupPincode = async () => {
    const pin = value.zip.trim();
    if (!isIndia || !/^\d{6}$/.test(pin)) return;

    setPincodeStatus("looking-up");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const office = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status !== "Success" || !office) {
        setPincodeStatus("not-found");
        return;
      }
      onChange({
        city: office.District || value.city,
        state: office.State || value.state,
      });
      setPincodeStatus("found");
    } catch {
      // Offline, or the lookup service is down - not fatal, the user can fill it in by hand.
      setPincodeStatus("error");
    }
  };

  return (
    <div className="space-y-5">
      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Country</label>
        <select
          value={selectedCountry?.name || ""}
          onChange={(e) => {
            const next = ALL_COUNTRIES.find((c) => c.name === e.target.value);
            // Changing country invalidates the old state/city - start those fresh
            onChange({ country: next?.name || e.target.value, state: "", city: "" });
          }}
          className={inputCls}
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.isoCode} value={c.name}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* PIN / ZIP */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          {isIndia ? "PIN Code" : "ZIP / Postal Code"}
        </label>
        <div className="relative">
          <input
            type="text"
            required
            inputMode="numeric"
            value={value.zip}
            onChange={(e) => {
              onChange({ zip: e.target.value.replace(/\s/g, "") });
              setPincodeStatus("idle"); // the previous lookup no longer matches what's typed
            }}
            onBlur={lookupPincode}
            placeholder={isIndia ? "e.g. 221001" : "Postal code"}
            className={`${inputCls} pr-10`}
          />
          {pincodeStatus === "looking-up" && (
            <Loader2Icon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 animate-spin" />
          )}
          {pincodeStatus === "found" && (
            <MapPinCheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-600" />
          )}
        </div>
        {isIndia && pincodeStatus === "found" && (
          <p className="text-xs text-green-600 mt-1.5">City and state filled in from the PIN code.</p>
        )}
        {isIndia && pincodeStatus === "not-found" && (
          <p className="text-xs text-amber-600 mt-1.5">Couldn't find that PIN code - please fill in city and state below.</p>
        )}
      </div>

      {/* State + City */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">State</label>
          {states.length > 0 ? (
            <select
              required
              value={value.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className={inputCls}
            >
              <option value="" disabled>
                Select state
              </option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            // Some countries have no state list in the data set - fall back to free text
            <input
              type="text"
              required
              value={value.state}
              onChange={(e) => onChange({ state: e.target.value })}
              placeholder="State / Province"
              className={inputCls}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">City / District</label>
          <input
            type="text"
            required
            value={value.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="City or district"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
