import { SapIntegrationError } from "./sapErrors.js";

const malformed = (field) => {
  throw new SapIntegrationError("SAP_MALFORMED_RESPONSE", `SAP returned an invalid ${field}.`);
};

const asNumberOrNull = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const asIntegerOrNull = (value) => (Number.isInteger(value) ? value : null);
const asStringOrNull = (value) => (typeof value === "string" && value.trim() ? value.trim() : null);

const requiredPositiveInteger = (value, field) => {
  const normalized = asIntegerOrNull(value);
  return normalized !== null && normalized > 0 ? normalized : malformed(field);
};

const requiredNumber = (value, field) => {
  const normalized = asNumberOrNull(value);
  return normalized !== null ? normalized : malformed(field);
};

const requiredString = (value, field) => asStringOrNull(value) ?? malformed(field);

const normalizeDateParts = (value) => {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value.trim());
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year
    || candidate.getUTCMonth() + 1 !== month
    || candidate.getUTCDate() !== day
  ) return null;
  return `${yearText}-${monthText}-${dayText}`;
};

export const normalizeSapDate = (value, { required = false, field = "date" } = {}) => {
  const normalized = normalizeDateParts(value);
  if (normalized || !required) return normalized;
  return malformed(field);
};

export const normalizeDocumentStatus = (status) => {
  const normalized = requiredString(status, "DocumentStatus");
  if (normalized === "bost_Open") return "Open";
  if (normalized === "bost_Close") return "Closed";
  return normalized;
};

const toRequiredTransactionHeader = (record = {}, { includeDueDate = true } = {}) => ({
  id: requiredPositiveInteger(record.DocEntry, "DocEntry"),
  number: requiredPositiveInteger(record.DocNum, "DocNum"),
  status: normalizeDocumentStatus(record.DocumentStatus),
  rawStatus: requiredString(record.DocumentStatus, "DocumentStatus"),
  date: normalizeSapDate(record.DocDate, { required: true, field: "DocDate" }),
  ...(includeDueDate ? { dueDate: normalizeSapDate(record.DocDueDate) } : {}),
  amount: requiredNumber(record.DocTotal, "DocTotal"),
});

export const toOrderSummary = (record = {}) => toRequiredTransactionHeader(record, { includeDueDate: false });

export const toTransactionSummary = (record = {}) => toRequiredTransactionHeader(record);

export const toDocumentLine = (line = {}) => ({
  lineNumber: asIntegerOrNull(line.LineNum),
  itemCode: asStringOrNull(line.ItemCode),
  description: asStringOrNull(line.ItemDescription),
  quantity: asNumberOrNull(line.Quantity),
  unitPrice: asNumberOrNull(line.Price),
  lineTotal: asNumberOrNull(line.LineTotal),
});

export const toTransactionDetail = (record = {}) => ({
  ...toTransactionSummary(record),
  lines: Array.isArray(record.DocumentLines) ? record.DocumentLines.map(toDocumentLine) : [],
});

export const toInvoiceSummary = (record = {}) => {
  const summary = toTransactionSummary(record);
  const paidAmount = asNumberOrNull(record.PaidToDate);

  return {
    ...summary,
    paidAmount,
    outstandingAmount: paidAmount === null ? null : Math.max(0, summary.amount - paidAmount),
  };
};

export const toInvoiceDetail = (record = {}) => ({
  ...toInvoiceSummary(record),
  lines: Array.isArray(record.DocumentLines) ? record.DocumentLines.map(toDocumentLine) : [],
});

export const toPaymentSummary = (record = {}) => {
  const cashAmount = asNumberOrNull(record.CashSum);
  const transferAmount = asNumberOrNull(record.TransferSum);

  return {
    id: requiredPositiveInteger(record.DocEntry, "DocEntry"),
    number: requiredPositiveInteger(record.DocNum, "DocNum"),
    date: normalizeSapDate(record.DocDate, { required: true, field: "DocDate" }),
    cashAmount,
    transferAmount,
    totalPaymentAmount: cashAmount === null && transferAmount === null
      ? null
      : (cashAmount ?? 0) + (transferAmount ?? 0),
  };
};

export const toBusinessPartnerProfile = (record = {}) => ({
  accountReference: asStringOrNull(record.CardCode),
  name: asStringOrNull(record.CardName),
  email: asStringOrNull(record.EmailAddress),
  phone: asStringOrNull(record.Phone1),
  address: asStringOrNull(record.Address),
  currency: asStringOrNull(record.Currency),
  accountBalance: asNumberOrNull(record.CurrentAccountBalance),
});
