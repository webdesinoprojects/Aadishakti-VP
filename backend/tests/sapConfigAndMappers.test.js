import test from "node:test";
import assert from "node:assert/strict";
import { getSapConfig } from "../integrations/sap/sapConfig.js";
import { SapIntegrationError, toSafeSapClientError } from "../integrations/sap/sapErrors.js";
import {
  normalizeDocumentStatus,
  toBusinessPartnerProfile,
  toInvoiceSummary,
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
    DocumentStatus: "bost_Open",
    DocTotal: 1250,
    PaidToDate: 250,
    CardCode: "C-1",
  });
  assert.equal(invoice.id, 10);
  assert.equal(invoice.number, 9001);
  assert.equal(invoice.status, "Open");
  assert.equal(invoice.outstandingAmount, 1000);

  const payment = toPaymentSummary({ CashSum: 20, TransferSum: 80 });
  assert.equal(payment.totalPaymentAmount, 100);

  const detail = toTransactionDetail({ DocumentLines: [{ ItemCode: "PB" }] });
  assert.equal(detail.lines.length, 1);
  assert.equal(normalizeDocumentStatus("provider-specific"), "provider-specific");

  const profile = toBusinessPartnerProfile({ CardCode: "C-1", CurrentAccountBalance: 42 });
  assert.equal(profile.cardCode, "C-1");
  assert.equal(profile.currentAccountBalance, 42);
});
