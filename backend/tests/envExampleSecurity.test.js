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

test("portal and SAP secrets are blank in .env.example", async () => {
  const source = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  const example = parseEnvironmentExample(source);
  const valuesThatMustBeBlank = [
    "SAP_API_BASE_URL",
    "SAP_API_KEY",
    "PORTAL_SESSION_SECRET",
    "PORTAL_CUSTOMER_LOGIN_ID",
    "PORTAL_CUSTOMER_LOGIN_PASSWORD",
    "PORTAL_CUSTOMER_SAP_CARD_CODE",
    "PORTAL_CUSTOMER_DISPLAY_NAME",
    "PORTAL_VENDOR_LOGIN_ID",
    "PORTAL_VENDOR_LOGIN_PASSWORD",
    "PORTAL_VENDOR_SAP_CARD_CODE",
    "PORTAL_VENDOR_DISPLAY_NAME",
  ];

  valuesThatMustBeBlank.forEach((name) => assert.equal(example[name], "", `${name} must remain blank`));
});
