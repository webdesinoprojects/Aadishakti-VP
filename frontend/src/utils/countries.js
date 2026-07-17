import { getCountries, getCountryCallingCode } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

export const allCountryOptions = getCountries()
  .map((country) => ({
    value: `+${getCountryCallingCode(country)}`,
    label: `${en[country]} (+${getCountryCallingCode(country)})`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
