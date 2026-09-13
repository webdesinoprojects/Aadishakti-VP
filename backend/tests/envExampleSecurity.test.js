import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const parseEnvironmentExample = (source) => Object.fromEntries(
  source
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

test("portal, legacy SAP, and current CIS secrets are blank in .env.example", async () => {
  const source = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  const example = parseEnvironmentExample(source);
  const valuesThatMustBeBlank = [
    "SAP_API_BASE_URL",
    "SAP_API_KEY",
    "CIS_API_BASE_URL",
    "CIS_AGRPL_USERNAME",
    "CIS_AGRPL_PASSWORD",
    "CIS_AM_USERNAME",
    "CIS_AM_PASSWORD",
    "CIS_AMRPL_USERNAME",
    "CIS_AMRPL_PASSWORD",
    "PORTAL_SESSION_SECRET",
    "PORTAL_CUSTOMER_LOGIN_ID",
    "PORTAL_CUSTOMER_LOGIN_PASSWORD",
    "PORTAL_CUSTOMER_SAP_CARD_CODE",
    "PORTAL_CUSTOMER_CIS_COMPANY_CODE",
    "PORTAL_CUSTOMER_DISPLAY_NAME",
    "PORTAL_VENDOR_LOGIN_ID",
    "PORTAL_VENDOR_LOGIN_PASSWORD",
    "PORTAL_VENDOR_SAP_CARD_CODE",
    "PORTAL_VENDOR_CIS_COMPANY_CODE",
    "PORTAL_VENDOR_DISPLAY_NAME",
  ];

  valuesThatMustBeBlank.forEach((name) => assert.equal(example[name], "", `${name} must remain blank`));
});
