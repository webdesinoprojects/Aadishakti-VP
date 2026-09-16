import { AppError } from "../shared/errors.js";

export const errorHandler = (error, req, res, _next) => {
  const isUploadError = error?.name === "MulterError";
  const statusCode = error instanceof AppError ? error.statusCode : isUploadError ? 400 : 500;
  const code = error instanceof AppError ? error.code : isUploadError ? "UPLOAD_REJECTED" : "INTERNAL_SERVER_ERROR";
  const message =
    error instanceof AppError || isUploadError ? error.message : "An unexpected server error occurred.";

  if (statusCode >= 500) {
    console.error(`[${req.requestId || "no-request-id"}]`, error);
  }

  res.status(statusCode).json({
    error: message,
    code,
    requestId: req.requestId,
    ...(error instanceof AppError && error.details ? { details: error.details } : {}),
  });
};
