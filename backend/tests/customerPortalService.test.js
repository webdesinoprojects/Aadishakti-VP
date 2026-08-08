import test from "node:test";
import assert from "node:assert/strict";
import {
  CustomerPortalRecordNotFoundError,
  createCustomerPortalService,
} from "../services/customerPortalService.js";
import { SapIntegrationError } from "../integrations/sap/sapErrors.js";

const customer = { role: "customer", cardCode: "CUSTOMER-A" };

const transaction = (overrides = {}) => ({
  DocEntry: 1,
  DocNum: 1001,
  DocDate: "2026-08-08",
  DocTotal: 100,
  DocumentStatus: "bost_Open",
  CardCode: "CUSTOMER-A",
  ...overrides,
});

const invoice = (overrides = {}) => transaction({
  DocDueDate: "2026-08-10",
  PaidToDate: 25,
  ...overrides,
});

const payment = (overrides = {}) => ({
  DocEntry: 20,
  DocNum: 2001,
  DocDate: "2026-08-08",
  CardCode: "CUSTOMER-A",
  CashSum: 20,
  TransferSum: 80,
  ...overrides,
});

test("customer convenience lists use the authorized CardCode and portal-side pagination", async () => {
  const requests = [];
  const service = createCustomerPortalService({
    sapClient: {
      get: async (request) => {
        requests.push(request);
        return [
          transaction({ DocEntry: 1, DocNum: 1001 }),
          transaction({ DocEntry: 2, DocNum: 1002, DocumentStatus: "bost_Close" }),
          transaction({ DocEntry: 3, DocNum: 1003, CardCode: "CUSTOMER-B" }),
        ];
      },
    },
  });

  const response = await service.getOrders(customer, { page: 1, pageSize: 1, q: "closed" });
  assert.deepEqual(requests[0].pathSegments, ["api", "orders", "by-customer", "CUSTOMER-A"]);
  assert.equal(response.pagination.total, 1);
  assert.equal(response.items[0].id, 2);
  assert.equal(response.items[0].number, 1002);
  assert.equal(response.items[0].dueDate, undefined);
  assert.equal(response.items[0].currency, undefined);
  assert.equal(response.items[0].partyCode, undefined);
});

test("customer generic lists delegate exact account filtering to the SAP scanner", async () => {
  const calls = [];
  const service = createCustomerPortalService({
    sapClient: {
      listAllExactDocumentRecords: async (request) => {
        calls.push(request);
        return request.type === "incoming-payment"
          ? { items: [payment()] }
          : { items: [transaction({ DocEntry: 8, DocNum: 800 })] };
      },
    },
  });

  const deliveries = await service.getDeliveries(customer);
  const payments = await service.getPayments(customer);
  assert.deepEqual(calls, [
    { type: "delivery", authorizedCardCode: "CUSTOMER-A" },
    { type: "incoming-payment", authorizedCardCode: "CUSTOMER-A" },
  ]);
  assert.equal(deliveries.items[0].id, 8);
  assert.equal(payments.items[0].id, 20);
});

test("full invoices omit unpaidOnly while dashboard invoices request unpaidOnly=true", async () => {
  const requests = [];
  const service = createCustomerPortalService({
    sapClient: {
      get: async (request) => {
        requests.push(request);
        if (request.endpointLabel === "customer-orders") return [];
        return [];
      },
      listAllExactDocumentRecords: async () => ({ items: [] }),
    },
  });

  await service.getInvoices(customer);
  await service.getDashboard(customer);

  const invoiceRequests = requests.filter((request) => request.endpointLabel === "customer-invoices");
  assert.equal(invoiceRequests.length, 2);
  assert.equal(invoiceRequests[0].query, undefined);
  assert.deepEqual(invoiceRequests[1].query, { unpaidOnly: true });
});

test("customer profile and detail methods use the documented SAP routes", async () => {
  const paths = [];
  const service = createCustomerPortalService({
    sapClient: {
      get: async ({ pathSegments }) => {
        paths.push(pathSegments);
        if (pathSegments[1] === "customers") return { CardCode: "CUSTOMER-A", CardName: "Customer A" };
        if (pathSegments[1] === "documents" && pathSegments[2] === "incoming-payment") return payment();
        return transaction({ DocumentLines: [] });
      },
    },
  });

  await service.getProfile(customer);
  await service.getOrder(customer, 7);
  await service.getInvoice(customer, 7);
  await service.getDelivery(customer, 7);
  await service.getPayment(customer, 7);

  assert.deepEqual(paths, [
    ["api", "customers", "CUSTOMER-A"],
    ["api", "orders", 7],
    ["api", "invoices", 7],
    ["api", "documents", "delivery", 7],
    ["api", "documents", "incoming-payment", 7],
  ]);
});

test("all customer detail operations hide cross-account records as 404 candidates", async () => {
  const service = createCustomerPortalService({
    sapClient: { get: async () => ({ CardCode: "CUSTOMER-B", DocEntry: 99 }) },
  });

  for (const method of ["getOrder", "getInvoice", "getDelivery", "getPayment"]) {
    await assert.rejects(
      () => service[method](customer, 99),
      (error) => error instanceof CustomerPortalRecordNotFoundError,
    );
  }
});

test("customer detail DTOs expose only intentionally normalized fields", async () => {
  const service = createCustomerPortalService({
    sapClient: {
      get: async () => transaction({
        CardName: "Private party name",
        InternalSecret: "must-not-leak",
        PaymentInvoices: [{ InternalId: "must-not-leak" }],
        DocumentLines: [{
          LineNum: 0,
          ItemCode: "PB",
          ItemDescription: "Pure Lead",
          Quantity: 2,
          Price: 50,
          LineTotal: 100,
          WarehouseCode: "must-not-leak",
        }],
      }),
    },
  });

  const order = await service.getOrder(customer, 1);
  assert.deepEqual(order.lines[0], {
    lineNumber: 0,
    itemCode: "PB",
    description: "Pure Lead",
    quantity: 2,
    unitPrice: 50,
    lineTotal: 100,
  });
  assert.doesNotMatch(JSON.stringify(order), /InternalSecret|WarehouseCode|PaymentInvoices|CUSTOMER-A|Private party/);
});

test("empty customer arrays are successful and malformed rows fail safely", async () => {
  const emptyService = createCustomerPortalService({ sapClient: { get: async () => [] } });
  assert.deepEqual(await emptyService.getOrders(customer), {
    items: [],
    pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
  });

  const malformedPayload = createCustomerPortalService({ sapClient: { get: async () => ({ items: [] }) } });
  await assert.rejects(
    () => malformedPayload.getOrders(customer),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_MALFORMED_RESPONSE",
  );

  const malformedRow = createCustomerPortalService({
    sapClient: { get: async () => [transaction({ DocEntry: null })] },
  });
  await assert.rejects(
    () => malformedRow.getOrders(customer),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_MALFORMED_RESPONSE",
  );
});

test("invoice aggregates fail closed when any required outstanding value is unknown", async () => {
  const service = createCustomerPortalService({
    now: () => new Date(2026, 7, 8, 12),
    sapClient: {
      get: async () => [
        invoice({ DocEntry: 1, PaidToDate: 25, DocTotal: 100, DocDueDate: "2026-08-07" }),
        invoice({ DocEntry: 2, PaidToDate: undefined, DocTotal: 200, DocDueDate: "2026-08-07" }),
      ],
    },
  });

  const response = await service.getInvoices(customer);
  assert.equal(response.summary.outstandingAmount, null);
  assert.equal(response.summary.outstandingAmountComplete, false);
  assert.equal(response.summary.overdueAmount, null);
  assert.equal(response.summary.overdueAmountComplete, false);
});

test("invoice overdue calculations use date-only semantics and report completeness", async () => {
  const service = createCustomerPortalService({
    now: () => new Date(2026, 7, 8, 12),
    sapClient: {
      get: async () => [
        invoice({ DocEntry: 1, DocTotal: 100, PaidToDate: 0, DocDueDate: "2026-08-07" }),
        invoice({ DocEntry: 2, DocTotal: 200, PaidToDate: 0, DocDueDate: "2026-08-08T00:00:00Z" }),
        invoice({ DocEntry: 3, DocTotal: 300, PaidToDate: 0, DocDueDate: "2026-08-09" }),
      ],
    },
  });

  const response = await service.getInvoices(customer);
  assert.equal(response.summary.outstandingAmount, 600);
  assert.equal(response.summary.outstandingAmountComplete, true);
  assert.equal(response.summary.overdueAmount, 100);
  assert.equal(response.summary.overdueAmountComplete, true);

  const incompleteService = createCustomerPortalService({
    now: () => new Date(2026, 7, 8, 12),
    sapClient: { get: async () => [invoice({ DocDueDate: "not-a-date", PaidToDate: 0 })] },
  });
  const incomplete = await incompleteService.getInvoices(customer);
  assert.equal(incomplete.summary.overdueAmount, null);
  assert.equal(incomplete.summary.overdueAmountComplete, false);
});

test("zero invoices produce complete zero financial aggregates", async () => {
  const service = createCustomerPortalService({
    now: () => new Date(2026, 7, 8, 12),
    sapClient: { get: async () => [] },
  });
  const response = await service.getInvoices(customer);
  assert.deepEqual(response.summary, {
    openCount: 0,
    outstandingAmount: 0,
    outstandingAmountComplete: true,
    overdueAmount: 0,
    overdueAmountComplete: true,
  });
});

test("dashboard financial KPIs do not under-report incomplete unpaid invoices", async () => {
  const service = createCustomerPortalService({
    now: () => new Date(2026, 7, 8, 12),
    sapClient: {
      get: async ({ endpointLabel }) => endpointLabel === "customer-invoices"
        ? [
          invoice({ DocEntry: 1, DocTotal: 100, PaidToDate: 25, DocDueDate: "2026-08-07" }),
          invoice({ DocEntry: 2, DocTotal: 200, PaidToDate: undefined, DocDueDate: "2026-08-07" }),
        ]
        : [],
      listAllExactDocumentRecords: async () => ({ items: [] }),
    },
  });

  const dashboard = await service.getDashboard(customer);
  assert.equal(dashboard.kpis.outstandingInvoiceAmount, null);
  assert.equal(dashboard.kpis.overdueInvoiceAmount, null);
  assert.equal(dashboard.completeness.outstandingInvoiceAmount, false);
  assert.equal(dashboard.completeness.overdueInvoiceAmount, false);
});

test("customer dashboard preserves available SAP sections when one upstream call fails", async () => {
  const service = createCustomerPortalService({
    now: () => new Date(2026, 7, 8, 12),
    sapClient: {
      get: async ({ endpointLabel }) => {
        if (endpointLabel === "customer-orders") return [
          transaction({ DocEntry: 1, DocNum: 10, DocDate: "2026-07-01", DocTotal: 100 }),
          transaction({ DocEntry: 2, DocNum: 11, DocDate: "2026-07-02", DocTotal: 50, DocumentStatus: "bost_Close" }),
        ];
        throw new SapIntegrationError("SAP_UPSTREAM_ERROR", "provider detail", { status: 500 });
      },
      listAllExactDocumentRecords: async () => ({ items: [transaction({ DocEntry: 3 })] }),
    },
  });

  const dashboard = await service.getDashboard(customer);
  assert.deepEqual(dashboard.availability, { orders: true, invoices: false, deliveries: true });
  assert.equal(dashboard.kpis.totalOrders, 2);
  assert.equal(dashboard.kpis.openOrders, 1);
  assert.equal(dashboard.kpis.openInvoices, null);
  assert.equal(dashboard.completeness.outstandingInvoiceAmount, false);
  assert.deepEqual(dashboard.charts.monthlyOrderValue, [{ period: "2026-07", amount: 150 }]);
});
