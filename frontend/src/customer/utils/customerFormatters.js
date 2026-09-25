export const UNAVAILABLE_VALUE = 'Unavailable';
export const UNKNOWN_TRANSACTION_CURRENCY_NOTE = 'Currency is not supplied by this CIS transaction endpoint.';

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

export const formatNumber = (value, options = {}) => {
  if (!isFiniteNumber(value)) return UNAVAILABLE_VALUE;
  return new Intl.NumberFormat('en-IN', options).format(value);
};

export const formatAmount = (value, currency) => {
  if (!isFiniteNumber(value)) return UNAVAILABLE_VALUE;
  const normalizedCurrency = typeof currency === 'string' && /^[A-Z]{3}$/.test(currency.trim().toUpperCase())
    ? currency.trim().toUpperCase()
    : null;

  if (normalizedCurrency) {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: normalizedCurrency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      // Fall through to a currency-neutral amount for invalid/unsupported codes.
    }
  }

  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatCompactAmount = (value) => formatNumber(value, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatCompactCurrency = (value, currency) => {
  if (!isFiniteNumber(value)) return UNAVAILABLE_VALUE;
  const normalizedCurrency = typeof currency === 'string' && /^[A-Z]{3}$/.test(currency.trim().toUpperCase())
    ? currency.trim().toUpperCase()
    : null;

  if (!normalizedCurrency) return formatCompactAmount(value);
  if (normalizedCurrency === 'INR') {
    const absoluteValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absoluteValue >= 10_000_000) {
      return `${sign}₹${formatNumber(absoluteValue / 10_000_000, { maximumFractionDigits: 2 })} Cr`;
    }
    if (absoluteValue >= 100_000) {
      return `${sign}₹${formatNumber(absoluteValue / 100_000, { maximumFractionDigits: 2 })} L`;
    }
  }
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: normalizedCurrency,
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return formatCompactAmount(value);
  }
};

export const formatSapDate = (value) => {
  if (typeof value !== 'string') return UNAVAILABLE_VALUE;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return UNAVAILABLE_VALUE;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() + 1 !== month
    || date.getUTCDate() !== day
  ) return UNAVAILABLE_VALUE;

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const formatValue = (value) => value === null || value === undefined || value === ''
  ? UNAVAILABLE_VALUE
  : value;
