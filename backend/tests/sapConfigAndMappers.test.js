import test from "node:test";
import assert from "node:assert/strict";
import { getSapConfig } from "../integrations/sap/sapConfig.js";
import { SapIntegrationError, toSafeSapClientError } from "../integrations/sap/sapErrors.js";
import {
  normalizeDocumentStatus,
  toBusinessPartnerProfile,
  toDocumentLine,
  toInvoiceDetail,
  toInvoiceSummary,
  toOrderSummary,
  toPaymentSummary,
  toTransactionDetail,
} from "../integrations/sap/sapMappers.js";

test("SAP configuration is backend-only, bounded, and requires HTTPS in production", () => {
  const config = getSapConfig({
    SAP_API_BASE_URL: "https://sap.example.test/",
    SAP_API_KEY: "test-key",
    SAP_REQUEST_TIMEOUT_MS: "999999",
    SAP_RETRY_ATTEMPTS: "99",
    SAP_DOCUMENT_PAGE_SIZE: "999",
  });

  assert.equal(config.baseUrl, "https://sap.example.test");
  assert.equal(config.timeoutMs, 60000);
  assert.equal(config.retryAttempts, 2);
  assert.equal(config.documentPageSize, 500);

  assert.throws(
    () => getSapConfig({ NODE_ENV: "production", SAP_API_BASE_URL: "http://sap.example.test", SAP_API_KEY: "test-key" }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_CONFIGURATION_INVALID",
  );
  assert.throws(
    () => getSapConfig({ SAP_API_BASE_URL: "ftp://sap.example.test", SAP_API_KEY: "test-key" }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_CONFIGURATION_INVALID",
  );
});

test("SAP errors expose only safe browser messages", () => {
  const safe = toSafeSapClientError(new SapIntegrationError("SAP_UPSTREAM_ERROR", "private provider detail", { status: 500 }));
  assert.deepEqual(safe, {
    status: 503,
    code: "SAP_UNAVAILABLE",
    message: "The SAP service is temporarily unavailable.",
  });
  assert.doesNotMatch(JSON.stringify(safe), /private provider detail/);
});

test("SAP DTO mappers preserve identifier semantics and specialized amounts", () => {
  const invoice = toInvoiceSummary({
    DocEntry: 10,
    DocNum: 9001,
    DocDate: "2026-08-08",
    DocTotal: 1250,
    DocumentStatus: "bost_Open",
    PaidToDate: 250,
    CardCode: "C-1",
  });
  assert.equal(invoice.id, 10);
  assert.equal(invoice.number, 9001);
  assert.equal(invoice.status, "Open");
  assert.equal(invoice.outstandingAmount, 1000);
  const invoiceWithoutPaidAmount = toInvoiceSummary({
    DocEntry: 11,
    DocNum: 9002,
    DocDate: "2026-08-08",
    DocTotal: 1250,
    DocumentStatus: "bost_Open",
  });
  assert.equal(invoiceWithoutPaidAmount.outstandingAmount, null);

  const paymentHeader = { DocEntry: 20, DocNum: 8001, DocDate: "2026-08-08" };
  const payment = toPaymentSummary({ ...paymentHeader, CashSum: 20, TransferSum: 80 });
  assert.equal(payment.totalPaymentAmount, 100);
  assert.equal(toPaymentSummary(paymentHeader).totalPaymentAmount, null);
  assert.equal(toPaymentSummary({ ...paymentHeader, TransferSum: 80 }).totalPaymentAmount, 80);

  const detail = toTransactionDetail({
    SecretHeader: "must-not-leak",
    DocEntry: 30,
    DocNum: 7001,
    DocDate: "2026-08-08T00:00:00Z",
    DocTotal: 1000,
    DocumentStatus: "bost_Open",
    PaymentInvoices: [{ DocEntry: 500, InternalField: "must-not-leak" }],
    DocumentLines: [{
      LineNum: 0,
      ItemCode: "PB",
      ItemDescription: "Pure Lead",
      Quantity: 4,
      Price: 250,
      LineTotal: 1000,
      WarehouseCode: "must-not-leak",
    }],
  });
  assert.equal(detail.lines.length, 1);
  assert.deepEqual(detail.lines[0], {
    lineNumber: 0,
    itemCode: "PB",
    description: "Pure Lead",
    quantity: 4,
    unitPrice: 250,
    lineTotal: 1000,
  });
  assert.equal(detail.paymentInvoices, undefined);
  assert.doesNotMatch(JSON.stringify(detail), /must-not-leak/);
  assert.equal(toDocumentLine({ WarehouseCode: "private" }).WarehouseCode, undefined);

  const invoiceDetail = toInvoiceDetail({
    DocEntry: 40,
    DocNum: 6001,
    DocDate: "2026-08-08",
    DocTotal: 100,
    DocumentStatus: "bost_Close",
    PaidToDate: 25,
    DocumentLines: [{ ItemCode: "PB", InternalSerial: "private" }],
  });
  assert.equal(invoiceDetail.outstandingAmount, 75);
  assert.doesNotMatch(JSON.stringify(invoiceDetail), /InternalSerial|private/);
  assert.equal(normalizeDocumentStatus("provider-specific"), "provider-specific");

  const orderSummary = toOrderSummary({
    DocEntry: 50,
    DocNum: 5001,
    DocDate: "2026-08-08",
    DocDueDate: "2026-08-20",
    DocTotal: 200,
    DocumentStatus: "bost_Open",
  });
  assert.equal(orderSummary.dueDate, undefined);

  const profile = toBusinessPartnerProfile({
    CardCode: "C-1",
    CardName: "Customer",
    CurrentAccountBalance: 42,
    ContactEmployees: [{ Name: "private" }],
    BPAddresses: [{ AddressName: "private" }],
    InternalField: "private",
  });
  assert.equal(profile.accountReference, "C-1");
  assert.equal(profile.accountBalance, 42);
  assert.equal(profile.contacts, undefined);
  assert.equal(profile.addresses, undefined);
  assert.doesNotMatch(JSON.stringify(profile), /private/);
});

test("required SAP document fields fail safely when malformed", () => {
  const valid = {
    DocEntry: 1,
    DocNum: 100,
    DocDate: "2026-08-08",
    DocTotal: 50,
    DocumentStatus: "bost_Open",
  };

  for (const malformedRecord of [
    { ...valid, DocEntry: "1" },
    { ...valid, DocNum: null },
    { ...valid, DocDate: "2026-02-31" },
    { ...valid, DocTotal: Number.POSITIVE_INFINITY },
    { ...valid, DocumentStatus: "" },
  ]) {
    assert.throws(
      () => toOrderSummary(malformedRecord),
      (error) => error instanceof SapIntegrationError && error.code === "SAP_MALFORMED_RESPONSE",
    );
  }

  assert.throws(
    () => toPaymentSummary({ DocEntry: null, DocNum: 1, DocDate: "2026-08-08" }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_MALFORMED_RESPONSE",
  );
});
