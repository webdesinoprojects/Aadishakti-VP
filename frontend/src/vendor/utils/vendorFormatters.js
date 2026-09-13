export const UNAVAILABLE_VALUE = 'Unavailable';
export const UNKNOWN_CURRENCY_NOTE = 'Currency is not supplied by this CIS transaction endpoint.';

const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const formatVendorAmount = (value, currency) => {
  if (!finite(value)) return UNAVAILABLE_VALUE;
  const code = typeof currency === 'string' && /^[A-Z]{3}$/.test(currency.trim().toUpperCase())
    ? currency.trim().toUpperCase()
    : null;
  if (code) {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(value);
    } catch {
      // Fall through to a currency-neutral number.
    }
  }
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

export const formatVendorDate = (value) => {
  if (typeof value !== 'string') return UNAVAILABLE_VALUE;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return UNAVAILABLE_VALUE;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (
    date.getUTCFullYear() !== Number(match[1])
    || date.getUTCMonth() + 1 !== Number(match[2])
    || date.getUTCDate() !== Number(match[3])
  ) return UNAVAILABLE_VALUE;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
};

export const formatVendorValue = (value) => value === null || value === undefined || value === ''
  ? UNAVAILABLE_VALUE
  : value;
