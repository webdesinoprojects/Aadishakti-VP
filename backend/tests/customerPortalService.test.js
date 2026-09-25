import test from "node:test";
import assert from "node:assert/strict";
import {
  CustomerPortalFeatureUnavailableError,
  CustomerPortalRecordNotFoundError,
  createCustomerPortalService,
} from "../services/customerPortalService.js";
import { CisIntegrationError } from "../integrations/cis/cisErrors.js";

const customer = { role: "customer", cardCode: "CUSTOMER-A", companyCode: "AGRPL" };

const document = (overrides = {}) => ({
  docEntry: "1",
  docNum: "1001",
  cardCode: "CUSTOMER-A",
  cardName: "Customer A",
  docDate: "2026-08-08T00:00:00.0000000",
  docDueDate: "2026-08-10T00:00:00.0000000",
  docTotal: "100",
  ...overrides,
});

const payment = (overrides = {}) => ({
  docEntry: "20",
  docNum: "2001",
  cardCode: "CUSTOMER-A",
  cardName: "Customer A",
  docDate: "2026-08-08T00:00:00.0000000",
  cashSum: "20",
  trsfrSum: "80",
  ...overrides,
});

const createClient = (responses, requests = []) => ({
  getResource: async (request) => {
    requests.push(request);
    return responses[request.resource] ?? [];
  },
});

test("Customer profile is exact-filtered by server account and normalized", async () => {
  const requests = [];
  const service = createCustomerPortalService({
    cisClient: createClient({
      customer: [
        { cardCode: "CUSTOMER-B", cardName: "Other Customer", balance: "900" },
        {
          cardCode: "CUSTOMER-A",
          cardName: "Customer A",
          phone1: null,
          cellular: "9999",
          e_Mail: null,
          licTradNum: null,
          currency: "INR",
          balance: "125.5",
          totalDue: "975.25",
          overDueAmount: "225.75",
          groupName: "Domestic",
          slpName: "Manager",
          secret: "do-not-leak",
        },
      ],
    }, requests),
  });
  const profile = await service.getProfile(customer);
  assert.deepEqual(requests, [{ companyCode: "AGRPL", resource: "customer" }]);
  assert.equal(profile.accountReference, "CUSTOMER-A");
  assert.equal(profile.accountBalance, 125.5);
  assert.equal(profile.totalDue, 975.25);
  assert.equal(profile.overdueAmount, 225.75);
  assert.equal(profile.phone, null);
  assert.doesNotMatch(JSON.stringify(profile), /secret|Other Customer/);
});

test("Customer commercial lists exact-filter before mapping and paginate locally", async () => {
  const service = createCustomerPortalService({
    cisClient: createClient({
      arinvoice: [
        document({ docEntry: "1", docNum: "1001" }),
        document({ docEntry: "2", docNum: "1002" }),
        document({ docEntry: "3", docNum: "1003", cardCode: "CUSTOMER-B" }),
      ],
      arcreditnote: [document({ docEntry: "4", docNum: "4001" })],
      delivery: [document({ docEntry: "8", docNum: "800" })],
      incomingpayment: [payment()],
    }),
  });

  const invoices = await service.getInvoices(customer, { page: 1, pageSize: 1, q: "1002" });
  assert.equal(invoices.pagination.total, 1);
  assert.equal(invoices.items[0].id, 2);
  assert.equal(invoices.items[0].paidAmount, null);
  assert.equal(invoices.items[0].outstandingAmount, null);
  assert.equal(invoices.scope, "current-open");

  const deliveries = await service.getDeliveries(customer);
  const creditNotes = await service.getCreditNotes(customer);
  const payments = await service.getPayments(customer);
  assert.equal(deliveries.items[0].id, 8);
  assert.equal(creditNotes.items[0].id, 4);
  assert.equal(payments.items[0].totalPaymentAmount, 100);
});

test("Customer list-resolved details cannot expose another CardCode", async () => {
  const service = createCustomerPortalService({
    cisClient: createClient({
      arinvoice: [document({ cardCode: "CUSTOMER-B", docEntry: "99" })],
      arcreditnote: [document({ cardCode: "CUSTOMER-B", docEntry: "99" })],
      delivery: [document({ cardCode: "CUSTOMER-B", docEntry: "99" })],
      incomingpayment: [payment({ cardCode: "CUSTOMER-B", docEntry: "99" })],
    }),
  });
  for (const method of ["getInvoice", "getCreditNote", "getDelivery", "getPayment"]) {
    await assert.rejects(
      () => service[method](customer, 99),
      (error) => error instanceof CustomerPortalRecordNotFoundError,
    );
  }
});

test("Customer details expose summaries only because CIS has no detail or line APIs", async () => {
  const service = createCustomerPortalService({
    cisClient: createClient({
      arinvoice: [document({ privateField: "must-not-leak", DocumentLines: [{ secret: true }] })],
    }),
  });
  const invoice = await service.getInvoice(customer, 1);
  assert.equal(invoice.detailAvailable, false);
  assert.deepEqual(invoice.lines, []);
  assert.doesNotMatch(JSON.stringify(invoice), /privateField|DocumentLines|CUSTOMER-A|Customer A/);
});

test("Sales Orders are explicitly unsupported by the new CIS contract", async () => {
  const service = createCustomerPortalService({ cisClient: createClient({}) });
  const orders = await service.getOrders(customer);
  assert.equal(orders.supported, false);
  assert.deepEqual(orders.items, []);
  await assert.rejects(() => service.getOrder(customer, 1), CustomerPortalFeatureUnavailableError);
});

test("Customer dashboard keeps successful sections when one CIS resource fails", async () => {
  const service = createCustomerPortalService({
    cisClient: {
      getResource: async ({ resource }) => {
        if (resource === "delivery") throw new CisIntegrationError("CIS_UPSTREAM_ERROR", "failed");
        if (resource === "arinvoice") return [document(), document({ docEntry: "2", docNum: "1002" })];
        if (resource === "incomingpayment") return [payment()];
        if (resource === "customer") return [{
          cardCode: "CUSTOMER-A",
          cardName: "Customer A",
          currency: "INR",
          totalDue: "875.50",
          overDueAmount: "125.25",
        }];
        return [];
      },
    },
  });
  const dashboard = await service.getDashboard(customer);
  assert.equal(dashboard.availability.orders, false);
  assert.equal(dashboard.availability.invoices, true);
  assert.equal(dashboard.availability.deliveries, false);
  assert.equal(dashboard.availability.payments, true);
  assert.equal(dashboard.kpis.openInvoices, 2);
  assert.equal(dashboard.kpis.outstandingInvoiceAmount, 875.5);
  assert.equal(dashboard.kpis.overdueInvoiceAmount, 125.25);
  assert.equal(dashboard.completeness.outstandingInvoiceAmount, true);
  assert.equal(dashboard.completeness.overdueInvoiceAmount, true);
  assert.equal(dashboard.currency, "INR");
  assert.equal(dashboard.recentInvoices.length, 2);
});

test("Malformed Customer records fail safely and empty lists remain successful", async () => {
  const empty = createCustomerPortalService({ cisClient: createClient({ arinvoice: [] }) });
  assert.equal((await empty.getInvoices(customer)).pagination.total, 0);

  const malformed = createCustomerPortalService({
    cisClient: createClient({ arinvoice: [document({ docEntry: "invalid" })] }),
  });
  await assert.rejects(
    () => malformed.getInvoices(customer),
    (error) => error instanceof CisIntegrationError && error.code === "CIS_MALFORMED_RESPONSE",
  );
});
