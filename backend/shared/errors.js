export class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message, details) =>
  new AppError(400, "BAD_REQUEST", message, details);

export const unauthorized = (message = "Authentication is required.") =>
  new AppError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "You do not have permission to perform this action.") =>
  new AppError(403, "FORBIDDEN", message);

export const notFound = (resource = "Resource") =>
  new AppError(404, "NOT_FOUND", `${resource} was not found.`);

