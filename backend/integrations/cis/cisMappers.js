import { CisIntegrationError } from "./cisErrors.js";

const malformed = (field) => {
  throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", `CIS returned an invalid ${field}.`);
};

const optionalString = (value) => typeof value === "string" && value.trim() ? value.trim() : null;
const requiredString = (value, field) => optionalString(value) ?? malformed(field);

const requiredPositiveInteger = (value, field) => {
  const text = typeof value === "number" ? String(value) : value;
  if (typeof text !== "string" || !/^\d+$/.test(text.trim())) return malformed(field);
  const parsed = Number(text);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : malformed(field);
};

const optionalNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const requiredNumber = (value, field) => optionalNumber(value) ?? malformed(field);

const dateOnly = (value, field) => {
  const text = requiredString(value, field);
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(text);
  if (!match) return malformed(field);
  const [, yearText, monthText, dayText] = match;
  const date = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
  if (
    date.getUTCFullYear() !== Number(yearText)
    || date.getUTCMonth() + 1 !== Number(monthText)
    || date.getUTCDate() !== Number(dayText)
  ) return malformed(field);
  return `${yearText}-${monthText}-${dayText}`;
};

export const toCisBusinessPartnerProfile = (record = {}) => ({
  accountReference: requiredString(record.cardCode, "cardCode"),
  name: requiredString(record.cardName, "cardName"),
  phone: optionalString(record.phone1),
  mobile: optionalString(record.cellular),
  email: optionalString(record.e_Mail),
  taxReference: optionalString(record.licTradNum),
  currency: optionalString(record.currency),
  accountBalance: optionalNumber(record.balance),
  groupName: optionalString(record.groupName),
  relationshipManager: optionalString(record.slpName),
});

export const toCisDocumentSummary = (record = {}) => ({
  id: requiredPositiveInteger(record.docEntry, "docEntry"),
  number: requiredPositiveInteger(record.docNum, "docNum"),
  date: dateOnly(record.docDate, "docDate"),
  dueDate: dateOnly(record.docDueDate, "docDueDate"),
  amount: requiredNumber(record.docTotal, "docTotal"),
  status: "Open",
  detailAvailable: false,
});

export const toCisPaymentSummary = (record = {}) => {
  const cashAmount = optionalNumber(record.cashSum);
  const transferAmount = optionalNumber(record.trsfrSum);
  return {
    id: requiredPositiveInteger(record.docEntry, "docEntry"),
    number: requiredPositiveInteger(record.docNum, "docNum"),
    date: dateOnly(record.docDate, "docDate"),
    cashAmount,
    transferAmount,
    totalPaymentAmount: cashAmount === null && transferAmount === null
      ? null
      : (cashAmount ?? 0) + (transferAmount ?? 0),
    detailAvailable: false,
  };
};
