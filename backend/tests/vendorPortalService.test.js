import test from "node:test";
import assert from "node:assert/strict";
import { createVendorPortalService, VendorPortalRecordNotFoundError } from "../services/vendorPortalService.js";
import { CisIntegrationError } from "../integrations/cis/cisErrors.js";

const vendor = { role: "vendor", cardCode: "VENDOR-A", companyCode: "AMRPL" };
const document = (overrides = {}) => ({
  docEntry: "10",
  docNum: "5001",
  cardCode: "VENDOR-A",
  cardName: "Vendor A",
  docDate: "2026-08-01T00:00:00.0000000",
  docDueDate: "2026-08-15T00:00:00.0000000",
  docTotal: "2500",
  ...overrides,
});
const payment = (overrides = {}) => ({
  docEntry: "20",
  docNum: "6001",
  cardCode: "VENDOR-A",
  cardName: "Vendor A",
  docDate: "2026-08-20T00:00:00.0000000",
  cashSum: "0",
  trsfrSum: "2500",
  ...overrides,
});
const client = (responses, requests = []) => ({
  getResource: async (request) => {
    requests.push(request);
    return responses[request.resource] ?? [];
  },
});

test("Vendor routes map to the documented company-scoped CIS resources", async () => {
  const requests = [];
  const service = createVendorPortalService({
    cisClient: client({
      purchaseorder: [document()],
      apinvoice: [document()],
      apcreditnote: [document()],
      apdebitnote: [document()],
      grpo: [document()],
      outgoingpayment: [payment()],
    }, requests),
  });
  await service.getPurchaseOrders(vendor);
  await service.getInvoices(vendor);
  await service.getCreditNotes(vendor);
  await service.getDebitNotes(vendor);
  await service.getGrpos(vendor);
  await service.getPayments(vendor);
  assert.deepEqual(requests.map(({ companyCode, resource }) => [companyCode, resource]), [
    ["AMRPL", "purchaseorder"],
    ["AMRPL", "apinvoice"],
    ["AMRPL", "apcreditnote"],
    ["AMRPL", "apdebitnote"],
    ["AMRPL", "grpo"],
    ["AMRPL", "outgoingpayment"],
  ]);
});

test("Vendor data is exact-filtered before mapping and detail lookup", async () => {
  const service = createVendorPortalService({
    cisClient: client({
      purchaseorder: [document(), document({ cardCode: "VENDOR-B", docEntry: "99" })],
    }),
  });
  const list = await service.getPurchaseOrders(vendor);
  assert.equal(list.pagination.total, 1);
  assert.equal(list.items[0].id, 10);
  await assert.rejects(() => service.getPurchaseOrder(vendor, 99), VendorPortalRecordNotFoundError);
});

test("Vendor profile is read-only, normalized, and does not leak raw fields", async () => {
  const service = createVendorPortalService({
    cisClient: client({
      vendor: [{
        cardCode: "VENDOR-A",
        cardName: "Vendor A",
        phone1: null,
        cellular: null,
        e_Mail: null,
        licTradNum: null,
        currency: "INR",
        balance: "0",
        totalDue: "214815365.49",
        overDueAmount: "214815365.49",
        groupName: "Supplier",
        slpName: null,
        bankAccount: "must-not-leak",
      }],
    }),
  });
  const profile = await service.getProfile(vendor);
  assert.equal(profile.accountReference, "VENDOR-A");
  assert.equal(profile.accountBalance, 0);
  assert.equal(profile.totalDue, 214815365.49);
  assert.equal(profile.overdueAmount, 214815365.49);
  assert.doesNotMatch(JSON.stringify(profile), /bankAccount/);
});

test("Vendor dashboard supports partial CIS failures without fabricated financial KPIs", async () => {
  const service = createVendorPortalService({
    cisClient: {
      getResource: async ({ resource }) => {
        if (resource === "apinvoice") throw new CisIntegrationError("CIS_UPSTREAM_ERROR", "failed");
        if (resource === "purchaseorder") return [document()];
        if (resource === "grpo") return [];
        if (resource === "outgoingpayment") return [payment()];
        return [];
      },
    },
  });
  const dashboard = await service.getDashboard(vendor);
  assert.equal(dashboard.availability.purchaseOrders, true);
  assert.equal(dashboard.availability.invoices, false);
  assert.equal(dashboard.kpis.openPurchaseOrders, 1);
  assert.equal(dashboard.kpis.openApInvoices, null);
  assert.equal(dashboard.kpis.overdueOpenApInvoices, null);
  assert.equal(dashboard.kpis.outgoingPayments, 1);
  assert.equal("totalReceivables" in dashboard.kpis, false);
});

test("Vendor dashboard counts overdue open invoices from documented CIS due dates", async () => {
  const service = createVendorPortalService({
    cisClient: client({
      purchaseorder: [],
      apinvoice: [
        document({ docEntry: "11", docDueDate: "2026-08-31T00:00:00.0000000" }),
        document({ docEntry: "12", docDueDate: "2026-09-15T00:00:00.0000000" }),
        document({ docEntry: "13", docDueDate: "2026-09-16T00:00:00.0000000" }),
      ],
      grpo: [],
      outgoingpayment: [],
    }),
    today: () => "2026-09-15",
  });

  const dashboard = await service.getDashboard(vendor);
  assert.equal(dashboard.kpis.openApInvoices, 3);
  assert.equal(dashboard.kpis.overdueOpenApInvoices, 1);
});
