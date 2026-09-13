import { CisIntegrationError } from "../integrations/cis/cisErrors.js";

export const requireCommercialAccount = (account, role) => {
  if (
    account?.role !== role
    || typeof account.cardCode !== "string"
    || !account.cardCode.trim()
    || typeof account.companyCode !== "string"
    || !account.companyCode.trim()
  ) {
    throw new CisIntegrationError("CIS_CONFIGURATION_INVALID", `${role} account mapping is unavailable.`);
  }
  return { cardCode: account.cardCode.trim(), companyCode: account.companyCode.trim() };
};

export const exactAccountRecords = (records, cardCode) => {
  if (!Array.isArray(records)) {
    throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned an invalid list response.");
  }
  return records.filter((record) => record?.cardCode === cardCode);
};

const parsePositiveInteger = (value, fallback, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};

export const normalizePortalListOptions = ({ page, pageSize, q } = {}) => ({
  page: parsePositiveInteger(page, 1, Number.MAX_SAFE_INTEGER),
  pageSize: parsePositiveInteger(pageSize, 10, 50),
  q: typeof q === "string" ? q.trim().slice(0, 100).toLowerCase() : "",
});

const matchesSearch = (item, q) => !q || [item.number, item.status, item.date, item.dueDate]
  .some((value) => value !== null && value !== undefined && String(value).toLowerCase().includes(q));

export const paginatePortalRecords = (items, options, extras = {}) => {
  const normalized = normalizePortalListOptions(options);
  const filtered = items.filter((item) => matchesSearch(item, normalized.q));
  const total = filtered.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / normalized.pageSize);
  const offset = (normalized.page - 1) * normalized.pageSize;
  return {
    ...extras,
    items: filtered.slice(offset, offset + normalized.pageSize),
    pagination: {
      page: normalized.page,
      pageSize: normalized.pageSize,
      total,
      totalPages,
    },
  };
};

export const findPortalRecord = (items, docEntry, NotFoundError) => {
  const id = Number(docEntry);
  const record = Number.isSafeInteger(id) && id > 0
    ? items.find((item) => item.id === id)
    : null;
  if (!record) throw new NotFoundError();
  return record;
};
