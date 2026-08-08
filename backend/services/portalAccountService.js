import crypto from "crypto";

export class PortalAccountConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "PortalAccountConfigurationError";
  }
}

const secureEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const readAccount = (environment, role, prefix) => {
  const identifier = environment[`PORTAL_${prefix}_LOGIN_ID`]?.trim();
  const password = environment[`PORTAL_${prefix}_LOGIN_PASSWORD`];
  const cardCode = environment[`PORTAL_${prefix}_SAP_CARD_CODE`]?.trim();
  const displayName = environment[`PORTAL_${prefix}_DISPLAY_NAME`]?.trim() || role;
  const values = [identifier, password, cardCode];
  const populated = values.filter(Boolean).length;

  if (populated === 0) return null;
  if (populated !== values.length) {
    throw new PortalAccountConfigurationError(`Temporary ${role} portal account configuration is incomplete.`);
  }

  return { id: `${role}-demo`, role, identifier, password, cardCode, displayName };
};

const toResolvedAccount = ({ password: _password, ...account }) => account;

export const createPortalAccountService = ({ environment = process.env } = {}) => {
  const getConfiguredAccounts = () => [
    readAccount(environment, "customer", "CUSTOMER"),
    readAccount(environment, "vendor", "VENDOR"),
  ].filter(Boolean);

  const getAccounts = () => getConfiguredAccounts().map(toResolvedAccount);

  const getAccountById = (accountId) => {
    const account = getConfiguredAccounts().find((candidate) => candidate.id === accountId);
    return account ? toResolvedAccount(account) : null;
  };

  const authenticate = ({ identifier, password, role }) => {
    if (!["customer", "vendor"].includes(role) || !identifier || !password) return null;
    const account = getConfiguredAccounts().find((candidate) => candidate.role === role && secureEqual(candidate.identifier, identifier));
    if (!account || !secureEqual(account.password, password)) return null;
    return toResolvedAccount(account);
  };

  return { getAccounts, getAccountById, authenticate };
};
