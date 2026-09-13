import test from "node:test";
import assert from "node:assert/strict";
import { getCisCompanyCredential, getCisConfig } from "../integrations/cis/cisConfig.js";
import { CisIntegrationError } from "../integrations/cis/cisErrors.js";
import {
  toCisBusinessPartnerProfile,
  toCisDocumentSummary,
  toCisPaymentSummary,
} from "../integrations/cis/cisMappers.js";

const environment = {
  CIS_API_BASE_URL: "http://cis.test:81",
  CIS_AGRPL_USERNAME: "company-user",
  CIS_AGRPL_PASSWORD: "company-password",
};

test("CIS configuration fails closed and keeps company credentials server-side", () => {
  assert.throws(() => getCisConfig({}), (error) => error.code === "CIS_CONFIGURATION_MISSING");
  assert.throws(
    () => getCisConfig({ CIS_API_BASE_URL: "http://cis.test", CIS_AGRPL_USERNAME: "partial" }),
    (error) => error.code === "CIS_CONFIGURATION_INVALID",
  );
  assert.throws(
    () => getCisConfig({ ...environment, NODE_ENV: "production" }),
    (error) => error.code === "CIS_CONFIGURATION_INVALID",
  );
  const config = getCisConfig(environment);
  assert.deepEqual(getCisCompanyCredential(config, "AGRPL"), {
    username: "company-user",
    password: "company-password",
  });
  assert.throws(() => getCisCompanyCredential(config, "AM"), (error) => error.code === "CIS_CONFIGURATION_MISSING");
});

test("CIS mappers parse documented string fields and minimize output", () => {
  const profile = toCisBusinessPartnerProfile({
    cardCode: " C-1 ",
    cardName: " Customer One ",
    phone1: null,
    cellular: "9999999999",
    e_Mail: null,
    licTradNum: null,
    currency: "INR",
    balance: "125.50",
    groupName: "Domestic",
    slpName: "Owner",
    privateField: "must-not-leak",
  });
  assert.deepEqual(profile, {
    accountReference: "C-1",
    name: "Customer One",
    phone: null,
    mobile: "9999999999",
    email: null,
    taxReference: null,
    currency: "INR",
    accountBalance: 125.5,
    groupName: "Domestic",
    relationshipManager: "Owner",
  });

  const document = toCisDocumentSummary({
    docEntry: "21",
    docNum: "240050",
    cardCode: "must-not-leak",
    cardName: "must-not-leak",
    docDate: "2026-04-03T00:00:00.0000000",
    docDueDate: "2026-04-17T00:00:00.0000000",
    docTotal: "75000.25",
    undocumented: { secret: true },
  });
  assert.deepEqual(document, {
    id: 21,
    number: 240050,
    date: "2026-04-03",
    dueDate: "2026-04-17",
    amount: 75000.25,
    status: "Open",
    detailAvailable: false,
  });
  assert.doesNotMatch(JSON.stringify(document), /cardCode|cardName|undocumented/);
});

test("CIS payment totals remain unavailable when both documented amounts are absent", () => {
  const unavailable = toCisPaymentSummary({
    docEntry: "1",
    docNum: "2",
    docDate: "2026-04-10T00:00:00",
    cashSum: null,
    trsfrSum: null,
  });
  assert.equal(unavailable.totalPaymentAmount, null);

  const available = toCisPaymentSummary({
    docEntry: "1",
    docNum: "2",
    docDate: "2026-04-10T00:00:00",
    cashSum: "0",
    trsfrSum: "20000",
  });
  assert.equal(available.totalPaymentAmount, 20000);
});

test("malformed required CIS document fields fail safely", () => {
  const valid = {
    docEntry: "1",
    docNum: "2",
    docDate: "2026-04-10T00:00:00",
    docDueDate: "2026-04-12T00:00:00",
    docTotal: "10",
  };
  for (const invalid of [
    { ...valid, docEntry: "not-an-id" },
    { ...valid, docNum: "2.5" },
    { ...valid, docDate: "10/04/2026" },
    { ...valid, docDueDate: "2026-02-30" },
    { ...valid, docTotal: "Infinity" },
  ]) {
    assert.throws(() => toCisDocumentSummary(invalid), CisIntegrationError);
  }
});
