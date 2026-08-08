export class SapIntegrationError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = "SapIntegrationError";
    this.code = code;
    this.status = options.status;
    this.retryable = Boolean(options.retryable);
    this.cause = options.cause;
  }
}

export const isSapIntegrationError = (error) => error instanceof SapIntegrationError;

export const getSafeSapDiagnostic = (error, context = {}) => ({
  code: error?.code || "SAP_UNEXPECTED_ERROR",
  endpoint: context.endpoint || "sap-get",
  status: error?.status || null,
  attempt: context.attempt || null,
});

export const toSafeSapClientError = (error) => {
  if (!isSapIntegrationError(error)) {
    return { status: 503, code: "SAP_UNAVAILABLE", message: "The SAP service is temporarily unavailable." };
  }

  if (error.code === "SAP_CONFIGURATION_MISSING" || error.code === "SAP_CONFIGURATION_INVALID") {
    return { status: 503, code: "SAP_UNAVAILABLE", message: "The SAP service is not configured." };
  }

  if (error.code === "SAP_DOCUMENT_RESULT_LIMIT" || error.code === "SAP_PAGINATION_CHANGED") {
    return { status: 503, code: "SAP_RESULT_UNAVAILABLE", message: "The requested SAP records cannot be loaded safely right now." };
  }

  if (error.status === 404) {
    return { status: 404, code: "SAP_RECORD_NOT_FOUND", message: "The requested record was not found." };
  }

  return { status: 503, code: "SAP_UNAVAILABLE", message: "The SAP service is temporarily unavailable." };
};
