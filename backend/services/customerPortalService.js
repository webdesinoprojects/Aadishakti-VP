import { createSapClient } from "../integrations/sap/sapClient.js";
import { SapIntegrationError } from "../integrations/sap/sapErrors.js";
import {
  toBusinessPartnerProfile,
  toInvoiceDetail,
  toInvoiceSummary,
  toOrderSummary,
  toPaymentSummary,
  toTransactionDetail,
  toTransactionSummary,
} from "../integrations/sap/sapMappers.js";

export class CustomerPortalRecordNotFoundError extends Error {
  constructor() {
    super("Customer portal record was not found.");
    this.name = "CustomerPortalRecordNotFoundError";
  }
}

const requireAuthorizedAccount = (account) => {
  if (account?.role !== "customer" || typeof account.cardCode !== "string" || !account.cardCode.trim()) {
    throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "Customer account mapping is unavailable.");
  }
  return account.cardCode;
};

const assertArray = (payload) => {
  if (!Array.isArray(payload)) {
    throw new SapIntegrationError("SAP_MALFORMED_RESPONSE", "SAP returned an invalid list response.");
  }
  return payload;
};

const assertOwnedRecord = (record, authorizedCardCode) => {
  if (!record || record.CardCode !== authorizedCardCode) {
    throw new CustomerPortalRecordNotFoundError();
  }
  return record;
};

const filterDedicatedCustomerList = (records, authorizedCardCode) => records.filter(
  (record) => record?.CardCode === undefined || record.CardCode === authorizedCardCode,
);

const parsePositiveInteger = (value, fallback, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};

const normalizeListOptions = ({ page, pageSize, q } = {}) => ({
  page: parsePositiveInteger(page, 1, Number.MAX_SAFE_INTEGER),
  pageSize: parsePositiveInteger(pageSize, 10, 50),
  q: typeof q === "string" ? q.trim().slice(0, 100).toLowerCase() : "",
});

const matchesSearch = (item, q) => !q || [item.number, item.status, item.date, item.dueDate]
  .some((value) => value !== null && value !== undefined && String(value).toLowerCase().includes(q));

const paginate = (items, options) => {
  const normalized = normalizeListOptions(options);
  const filtered = items.filter((item) => matchesSearch(item, normalized.q));
  const total = filtered.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / normalized.pageSize);
  const offset = (normalized.page - 1) * normalized.pageSize;

  return {
    items: filtered.slice(offset, offset + normalized.pageSize),
    pagination: {
      page: normalized.page,
      pageSize: normalized.pageSize,
      total,
      totalPages,
    },
  };
};

const isOpen = (item) => item.status === "Open";

const currentCalendarDate = (value) => {
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "A valid current date is required.");
  }
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const completeSum = (items, field) => {
  if (items.some((item) => typeof item[field] !== "number" || !Number.isFinite(item[field]))) {
    return { value: null, complete: false };
  }
  return { value: items.reduce((total, item) => total + item[field], 0), complete: true };
};

const overdueBalance = (invoices, today) => {
  let total = 0;
  for (const invoice of invoices) {
    if (typeof invoice.outstandingAmount !== "number" || !Number.isFinite(invoice.outstandingAmount)) {
      return { value: null, complete: false };
    }
    if (invoice.outstandingAmount <= 0) continue;
    if (!invoice.dueDate) return { value: null, complete: false };
    if (invoice.dueDate < today) total += invoice.outstandingAmount;
  }
  return { value: total, complete: true };
};

const buildMonthlyOrderValue = (orders) => {
  const totals = new Map();
  orders.forEach((order) => {
    if (typeof order.amount !== "number" || !order.date) return;
    const period = order.date.slice(0, 7);
    totals.set(period, (totals.get(period) || 0) + order.amount);
  });
  return [...totals.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([period, amount]) => ({ period, amount }));
};

const buildOrderStatus = (orders) => {
  const counts = new Map();
  orders.forEach((order) => counts.set(order.status, (counts.get(order.status) || 0) + 1));
  return [...counts.entries()].map(([status, count]) => ({ status, count }));
};

const newestOrders = (orders, limit) => [...orders]
  .sort((left, right) => {
    return (right.date || "").localeCompare(left.date || "");
  })
  .slice(0, limit);

export const createCustomerPortalService = ({ sapClient = createSapClient(), now = () => new Date() } = {}) => {
  const loadOrders = async (account) => {
    const cardCode = requireAuthorizedAccount(account);
    const records = assertArray(await sapClient.get({
      pathSegments: ["api", "orders", "by-customer", cardCode],
      endpointLabel: "customer-orders",
    }));
    return filterDedicatedCustomerList(records, cardCode).map(toOrderSummary);
  };

  const loadInvoices = async (account, { unpaidOnly = false } = {}) => {
    const cardCode = requireAuthorizedAccount(account);
    const records = assertArray(await sapClient.get({
      pathSegments: ["api", "invoices", "by-customer", cardCode],
      query: unpaidOnly ? { unpaidOnly: true } : undefined,
      endpointLabel: "customer-invoices",
    }));
    return filterDedicatedCustomerList(records, cardCode).map(toInvoiceSummary);
  };

  const loadGenericDocuments = async (account, type, mapper) => {
    const cardCode = requireAuthorizedAccount(account);
    const result = await sapClient.listAllExactDocumentRecords({ type, authorizedCardCode: cardCode });
    if (!result || !Array.isArray(result.items)) {
      throw new SapIntegrationError("SAP_MALFORMED_RESPONSE", "SAP returned an invalid document response.");
    }
    return result.items.map(mapper);
  };

  const getProfile = async (account) => {
    const cardCode = requireAuthorizedAccount(account);
    const record = await sapClient.get({
      pathSegments: ["api", "customers", cardCode],
      endpointLabel: "customer-profile",
    });
    return toBusinessPartnerProfile(assertOwnedRecord(record, cardCode));
  };

  const getOrders = async (account, options) => paginate(await loadOrders(account), options);

  const getOrder = async (account, docEntry) => {
    const cardCode = requireAuthorizedAccount(account);
    const record = await sapClient.get({
      pathSegments: ["api", "orders", docEntry],
      endpointLabel: "customer-order-detail",
    });
    return toTransactionDetail(assertOwnedRecord(record, cardCode));
  };

  const getInvoices = async (account, options) => {
    const invoices = await loadInvoices(account);
    const response = paginate(invoices, options);
    const outstanding = completeSum(invoices, "outstandingAmount");
    const overdue = overdueBalance(invoices, currentCalendarDate(now()));
    return {
      ...response,
      summary: {
        openCount: invoices.filter(isOpen).length,
        outstandingAmount: outstanding.value,
        outstandingAmountComplete: outstanding.complete,
        overdueAmount: overdue.value,
        overdueAmountComplete: overdue.complete,
      },
    };
  };

  const getInvoice = async (account, docEntry) => {
    const cardCode = requireAuthorizedAccount(account);
    const record = await sapClient.get({
      pathSegments: ["api", "invoices", docEntry],
      endpointLabel: "customer-invoice-detail",
    });
    return toInvoiceDetail(assertOwnedRecord(record, cardCode));
  };

  const getDeliveries = async (account, options) => paginate(
    await loadGenericDocuments(account, "delivery", toTransactionSummary),
    options,
  );

  const getDelivery = async (account, docEntry) => {
    const cardCode = requireAuthorizedAccount(account);
    const record = await sapClient.get({
      pathSegments: ["api", "documents", "delivery", docEntry],
      endpointLabel: "customer-delivery-detail",
    });
    return toTransactionDetail(assertOwnedRecord(record, cardCode));
  };

  const getPayments = async (account, options) => paginate(
    await loadGenericDocuments(account, "incoming-payment", toPaymentSummary),
    options,
  );

  const getPayment = async (account, docEntry) => {
    const cardCode = requireAuthorizedAccount(account);
    const record = await sapClient.get({
      pathSegments: ["api", "documents", "incoming-payment", docEntry],
      endpointLabel: "customer-payment-detail",
    });
    return toPaymentSummary(assertOwnedRecord(record, cardCode));
  };

  const getDashboard = async (account) => {
    const [ordersResult, invoicesResult, deliveriesResult] = await Promise.allSettled([
      loadOrders(account),
      loadInvoices(account, { unpaidOnly: true }),
      loadGenericDocuments(account, "delivery", toTransactionSummary),
    ]);
    const results = [ordersResult, invoicesResult, deliveriesResult];
    if (results.every((result) => result.status === "rejected")) throw ordersResult.reason;

    const orders = ordersResult.status === "fulfilled" ? ordersResult.value : null;
    const invoices = invoicesResult.status === "fulfilled" ? invoicesResult.value : null;
    const deliveries = deliveriesResult.status === "fulfilled" ? deliveriesResult.value : null;
    const outstanding = invoices ? completeSum(invoices, "outstandingAmount") : { value: null, complete: false };
    const overdue = invoices
      ? overdueBalance(invoices, currentCalendarDate(now()))
      : { value: null, complete: false };

    return {
      availability: {
        orders: orders !== null,
        invoices: invoices !== null,
        deliveries: deliveries !== null,
      },
      kpis: {
        totalOrders: orders?.length ?? null,
        openOrders: orders?.filter(isOpen).length ?? null,
        openInvoices: invoices?.filter(isOpen).length ?? null,
        outstandingInvoiceAmount: outstanding.value,
        overdueInvoiceAmount: overdue.value,
        currentDeliveryDocuments: deliveries?.length ?? null,
      },
      completeness: {
        outstandingInvoiceAmount: outstanding.complete,
        overdueInvoiceAmount: overdue.complete,
      },
      recentOrders: orders ? newestOrders(orders, 5) : [],
      charts: {
        monthlyOrderValue: orders ? buildMonthlyOrderValue(orders) : [],
        orderStatus: orders ? buildOrderStatus(orders) : [],
      },
    };
  };

  return {
    getProfile,
    getDashboard,
    getOrders,
    getOrder,
    getInvoices,
    getInvoice,
    getDeliveries,
    getDelivery,
    getPayments,
    getPayment,
  };
};
