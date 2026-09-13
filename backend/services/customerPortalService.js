import { createCisClient } from "../integrations/cis/cisClient.js";
import { CisIntegrationError } from "../integrations/cis/cisErrors.js";
import {
  toCisBusinessPartnerProfile,
  toCisDocumentSummary,
  toCisPaymentSummary,
} from "../integrations/cis/cisMappers.js";
import {
  exactAccountRecords,
  findPortalRecord,
  paginatePortalRecords,
  requireCommercialAccount,
} from "./portalCommercialUtils.js";

export class CustomerPortalRecordNotFoundError extends Error {
  constructor() {
    super("Customer portal record was not found.");
    this.name = "CustomerPortalRecordNotFoundError";
  }
}

export class CustomerPortalFeatureUnavailableError extends Error {
  constructor() {
    super("Customer portal feature is not available from CIS.");
    this.name = "CustomerPortalFeatureUnavailableError";
  }
}

const unavailableOrders = (options) => paginatePortalRecords([], options, {
  supported: false,
  reason: "The current CIS API does not expose Customer Sales Orders.",
});

const toInvoice = (record) => ({
  ...toCisDocumentSummary(record),
  paidAmount: null,
  outstandingAmount: null,
});

export const createCustomerPortalService = ({ cisClient = createCisClient() } = {}) => {
  const loadExact = async (account, resource, mapper) => {
    const { cardCode, companyCode } = requireCommercialAccount(account, "customer");
    const records = await cisClient.getResource({ companyCode, resource });
    return exactAccountRecords(records, cardCode).map(mapper);
  };

  const getProfile = async (account) => {
    const { cardCode, companyCode } = requireCommercialAccount(account, "customer");
    const records = exactAccountRecords(
      await cisClient.getResource({ companyCode, resource: "customer" }),
      cardCode,
    );
    if (records.length === 0) throw new CustomerPortalRecordNotFoundError();
    if (records.length > 1) {
      throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned duplicate Customer master records.");
    }
    return toCisBusinessPartnerProfile(records[0]);
  };

  const loadInvoices = (account) => loadExact(account, "arinvoice", toInvoice);
  const loadCreditNotes = (account) => loadExact(account, "arcreditnote", toCisDocumentSummary);
  const loadDeliveries = (account) => loadExact(account, "delivery", toCisDocumentSummary);
  const loadPayments = (account) => loadExact(account, "incomingpayment", toCisPaymentSummary);

  const getOrders = async (_account, options) => unavailableOrders(options);
  const getOrder = async () => { throw new CustomerPortalFeatureUnavailableError(); };

  const getInvoices = async (account, options) => {
    const invoices = await loadInvoices(account);
    return paginatePortalRecords(invoices, options, {
      supported: true,
      scope: "current-open",
      summary: {
        openCount: invoices.length,
        outstandingAmount: null,
        outstandingAmountComplete: false,
        overdueAmount: null,
        overdueAmountComplete: false,
      },
    });
  };

  const getInvoice = async (account, docEntry) => ({
    ...findPortalRecord(await loadInvoices(account), docEntry, CustomerPortalRecordNotFoundError),
    lines: [],
    detailAvailable: false,
  });

  const getCreditNotes = async (account, options) => paginatePortalRecords(
    await loadCreditNotes(account),
    options,
    { supported: true, scope: "current-open" },
  );

  const getCreditNote = async (account, docEntry) => ({
    ...findPortalRecord(await loadCreditNotes(account), docEntry, CustomerPortalRecordNotFoundError),
    lines: [],
    detailAvailable: false,
  });

  const getDeliveries = async (account, options) => paginatePortalRecords(
    await loadDeliveries(account),
    options,
    { supported: true, scope: "current-open" },
  );

  const getDelivery = async (account, docEntry) => ({
    ...findPortalRecord(await loadDeliveries(account), docEntry, CustomerPortalRecordNotFoundError),
    lines: [],
    detailAvailable: false,
  });

  const getPayments = async (account, options) => paginatePortalRecords(
    await loadPayments(account),
    options,
    { supported: true, scope: "not-cancelled" },
  );

  const getPayment = async (account, docEntry) => findPortalRecord(
    await loadPayments(account),
    docEntry,
    CustomerPortalRecordNotFoundError,
  );

  const getDashboard = async (account) => {
    const [invoiceResult, deliveryResult, paymentResult] = await Promise.allSettled([
      loadInvoices(account),
      loadDeliveries(account),
      loadPayments(account),
    ]);
    const results = [invoiceResult, deliveryResult, paymentResult];
    if (results.every((result) => result.status === "rejected")) throw invoiceResult.reason;

    const invoices = invoiceResult.status === "fulfilled" ? invoiceResult.value : null;
    const deliveries = deliveryResult.status === "fulfilled" ? deliveryResult.value : null;
    const payments = paymentResult.status === "fulfilled" ? paymentResult.value : null;

    return {
      capabilities: { orders: false, transactionDetails: false, lineItems: false },
      availability: {
        orders: false,
        invoices: invoices !== null,
        deliveries: deliveries !== null,
        payments: payments !== null,
      },
      kpis: {
        totalOrders: null,
        openOrders: null,
        openInvoices: invoices?.length ?? null,
        outstandingInvoiceAmount: null,
        overdueInvoiceAmount: null,
        currentDeliveryDocuments: deliveries?.length ?? null,
        incomingPayments: payments?.length ?? null,
      },
      completeness: { outstandingInvoiceAmount: false, overdueInvoiceAmount: false },
      recentOrders: [],
      recentInvoices: invoices ? [...invoices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5) : [],
      charts: { monthlyOrderValue: [], orderStatus: [] },
    };
  };

  return {
    getProfile,
    getDashboard,
    getOrders,
    getOrder,
    getInvoices,
    getInvoice,
    getCreditNotes,
    getCreditNote,
    getDeliveries,
    getDelivery,
    getPayments,
    getPayment,
  };
};
