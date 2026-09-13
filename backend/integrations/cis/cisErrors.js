export class CisIntegrationError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = "CisIntegrationError";
    this.code = code;
    this.status = options.status;
    this.retryable = Boolean(options.retryable);
    this.cause = options.cause;
  }
}

export const getSafeCisDiagnostic = (error, context = {}) => ({
  code: error?.code || "CIS_UNEXPECTED_ERROR",
  endpoint: context.endpoint || "cis-request",
  status: error?.status || null,
  attempt: context.attempt || null,
});

export const toSafeCisClientError = (error) => {
  if (!(error instanceof CisIntegrationError)) {
    return { status: 503, code: "CIS_UNAVAILABLE", message: "The CIS service is temporarily unavailable." };
  }

  if (["CIS_CONFIGURATION_MISSING", "CIS_CONFIGURATION_INVALID"].includes(error.code)) {
    return { status: 503, code: "CIS_UNAVAILABLE", message: "The CIS service is not configured." };
  }

  if (error.code === "CIS_PERMISSION_DENIED") {
    return { status: 503, code: "CIS_UNAVAILABLE", message: "The requested CIS data is unavailable." };
  }

  return { status: 503, code: "CIS_UNAVAILABLE", message: "The CIS service is temporarily unavailable." };
};
