import test from "node:test";
import assert from "node:assert/strict";
import { PortalAccountConfigurationError, createPortalAccountService } from "../services/portalAccountService.js";

const environment = {
  PORTAL_CUSTOMER_LOGIN_ID: "customer-login",
  PORTAL_CUSTOMER_LOGIN_PASSWORD: "customer-password",
  PORTAL_CUSTOMER_SAP_CARD_CODE: "CUSTOMER-CARD",
  PORTAL_CUSTOMER_DISPLAY_NAME: "Customer Test",
  PORTAL_VENDOR_LOGIN_ID: "vendor-login",
  PORTAL_VENDOR_LOGIN_PASSWORD: "vendor-password",
  PORTAL_VENDOR_SAP_CARD_CODE: "VENDOR-CARD",
  PORTAL_VENDOR_DISPLAY_NAME: "Vendor Test",
};

test("temporary portal accounts authenticate only against backend configuration", () => {
  const service = createPortalAccountService({ environment });
  const account = service.authenticate({
    identifier: "customer-login",
    password: "customer-password",
    role: "customer",
  });

  assert.equal(account.role, "customer");
  assert.equal(account.cardCode, "CUSTOMER-CARD");
  assert.equal(account.password, undefined);
  assert.equal(service.authenticate({ identifier: "customer-login", password: "wrong", role: "customer" }), null);
  assert.equal(service.authenticate({ identifier: "customer-login", password: "customer-password", role: "vendor" }), null);
});

test("session identity can be resolved back to its server-owned CardCode", () => {
  const service = createPortalAccountService({ environment });
  const account = service.getAccountById("vendor-demo");
  assert.equal(account.role, "vendor");
  assert.equal(account.cardCode, "VENDOR-CARD");
});

test("partial temporary account configuration fails closed", () => {
  const service = createPortalAccountService({
    environment: { PORTAL_CUSTOMER_LOGIN_ID: "configured-without-password-or-card-code" },
  });
  assert.throws(() => service.getAccounts(), PortalAccountConfigurationError);
});

test("blank temporary account configuration cannot create or authenticate an account", () => {
  const service = createPortalAccountService({
    environment: {
      PORTAL_CUSTOMER_LOGIN_ID: "",
      PORTAL_CUSTOMER_LOGIN_PASSWORD: "",
      PORTAL_CUSTOMER_SAP_CARD_CODE: "",
      PORTAL_VENDOR_LOGIN_ID: "",
      PORTAL_VENDOR_LOGIN_PASSWORD: "",
      PORTAL_VENDOR_SAP_CARD_CODE: "",
    },
  });

  assert.deepEqual(service.getAccounts(), []);
  assert.equal(service.authenticate({ identifier: "", password: "", role: "customer" }), null);
  assert.equal(service.authenticate({ identifier: "", password: "", role: "vendor" }), null);
});
