const asNumberOrNull = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);

export const normalizeDocumentStatus = (status) => {
  if (!status) return "Unknown";
  if (status === "bost_Open") return "Open";
  if (status === "bost_Close") return "Closed";
  return String(status);
};

export const toTransactionSummary = (record = {}) => ({
  id: record.DocEntry ?? null,
  number: record.DocNum ?? null,
  status: normalizeDocumentStatus(record.DocumentStatus),
  rawStatus: record.DocumentStatus ?? null,
  date: record.DocDate ?? null,
  dueDate: record.DocDueDate ?? null,
  amount: asNumberOrNull(record.DocTotal),
  partyCode: record.CardCode ?? null,
  partyName: record.CardName ?? null,
  currency: record.Currency ?? null,
});

export const toTransactionDetail = (record = {}) => ({
  ...toTransactionSummary(record),
  lines: Array.isArray(record.DocumentLines) ? record.DocumentLines : [],
  paymentInvoices: Array.isArray(record.PaymentInvoices) ? record.PaymentInvoices : [],
});

export const toInvoiceSummary = (record = {}) => {
  const total = asNumberOrNull(record.DocTotal);
  const paidAmount = asNumberOrNull(record.PaidToDate);

  return {
    ...toTransactionSummary(record),
    paidAmount,
    outstandingAmount: total === null ? null : Math.max(0, total - (paidAmount ?? 0)),
  };
};

export const toPaymentSummary = (record = {}) => {
  const cashAmount = asNumberOrNull(record.CashSum);
  const transferAmount = asNumberOrNull(record.TransferSum);

  return {
    id: record.DocEntry ?? null,
    number: record.DocNum ?? null,
    date: record.DocDate ?? null,
    partyCode: record.CardCode ?? null,
    partyName: record.CardName ?? null,
    cashAmount,
    transferAmount,
    totalPaymentAmount: [cashAmount, transferAmount].reduce((sum, amount) => sum + (amount ?? 0), 0),
  };
};

export const toBusinessPartnerProfile = (record = {}) => ({
  cardCode: record.CardCode ?? null,
  cardName: record.CardName ?? null,
  emailAddress: record.EmailAddress ?? null,
  phone: record.Phone1 ?? null,
  address: record.Address ?? null,
  currency: record.Currency ?? null,
  currentAccountBalance: asNumberOrNull(record.CurrentAccountBalance),
  contacts: Array.isArray(record.ContactEmployees) ? record.ContactEmployees : [],
  addresses: Array.isArray(record.BPAddresses) ? record.BPAddresses : [],
});
