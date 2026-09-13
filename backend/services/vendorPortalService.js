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

export class VendorPortalRecordNotFoundError extends Error {
  constructor() {
    super("Vendor portal record was not found.");
    this.name = "VendorPortalRecordNotFoundError";
  }
}

export const createVendorPortalService = ({ cisClient = createCisClient() } = {}) => {
  const loadExact = async (account, resource, mapper) => {
    const { cardCode, companyCode } = requireCommercialAccount(account, "vendor");
    const records = await cisClient.getResource({ companyCode, resource });
    return exactAccountRecords(records, cardCode).map(mapper);
  };

  const getProfile = async (account) => {
    const { cardCode, companyCode } = requireCommercialAccount(account, "vendor");
    const records = exactAccountRecords(
      await cisClient.getResource({ companyCode, resource: "vendor" }),
      cardCode,
    );
    if (records.length === 0) throw new VendorPortalRecordNotFoundError();
    if (records.length > 1) {
      throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned duplicate Vendor master records.");
    }
    return toCisBusinessPartnerProfile(records[0]);
  };

  const loadPurchaseOrders = (account) => loadExact(account, "purchaseorder", toCisDocumentSummary);
  const loadInvoices = (account) => loadExact(account, "apinvoice", toCisDocumentSummary);
  const loadCreditNotes = (account) => loadExact(account, "apcreditnote", toCisDocumentSummary);
  const loadDebitNotes = (account) => loadExact(account, "apdebitnote", toCisDocumentSummary);
  const loadGrpos = (account) => loadExact(account, "grpo", toCisDocumentSummary);
  const loadPayments = (account) => loadExact(account, "outgoingpayment", toCisPaymentSummary);

  const list = (loader, scope = "current-open") => async (account, options) => paginatePortalRecords(
    await loader(account),
    options,
    { supported: true, scope },
  );

  const detail = (loader) => async (account, docEntry) => ({
    ...findPortalRecord(await loader(account), docEntry, VendorPortalRecordNotFoundError),
    lines: [],
    detailAvailable: false,
  });

  const getDashboard = async (account) => {
    const [purchaseOrderResult, invoiceResult, grpoResult, paymentResult] = await Promise.allSettled([
      loadPurchaseOrders(account),
      loadInvoices(account),
      loadGrpos(account),
      loadPayments(account),
    ]);
    const results = [purchaseOrderResult, invoiceResult, grpoResult, paymentResult];
    if (results.every((result) => result.status === "rejected")) throw purchaseOrderResult.reason;

    const purchaseOrders = purchaseOrderResult.status === "fulfilled" ? purchaseOrderResult.value : null;
    const invoices = invoiceResult.status === "fulfilled" ? invoiceResult.value : null;
    const grpos = grpoResult.status === "fulfilled" ? grpoResult.value : null;
    const payments = paymentResult.status === "fulfilled" ? paymentResult.value : null;

    return {
      capabilities: { transactionDetails: false, lineItems: false },
      availability: {
        purchaseOrders: purchaseOrders !== null,
        invoices: invoices !== null,
        grpos: grpos !== null,
        payments: payments !== null,
      },
      kpis: {
        openPurchaseOrders: purchaseOrders?.length ?? null,
        openApInvoices: invoices?.length ?? null,
        openGrpos: grpos?.length ?? null,
        outgoingPayments: payments?.length ?? null,
      },
      recentPurchaseOrders: purchaseOrders
        ? [...purchaseOrders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
        : [],
    };
  };

  return {
    getProfile,
    getDashboard,
    getPurchaseOrders: list(loadPurchaseOrders),
    getPurchaseOrder: detail(loadPurchaseOrders),
    getInvoices: list(loadInvoices),
    getInvoice: detail(loadInvoices),
    getCreditNotes: list(loadCreditNotes),
    getCreditNote: detail(loadCreditNotes),
    getDebitNotes: list(loadDebitNotes),
    getDebitNote: detail(loadDebitNotes),
    getGrpos: list(loadGrpos),
    getGrpo: detail(loadGrpos),
    getPayments: list(loadPayments, "not-cancelled"),
    getPayment: detail(loadPayments),
  };
};
