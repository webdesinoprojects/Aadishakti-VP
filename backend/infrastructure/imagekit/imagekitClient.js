import ImageKit from "@imagekit/nodejs";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";

let client;

export const getImageKitClient = () => {
  if (!env.imagekit.enabled) {
    throw new AppError(
      503,
      "IMAGEKIT_NOT_CONFIGURED",
      "ImageKit media storage is not configured yet.",
    );
  }

  if (!client) {
    client = new ImageKit({
      privateKey: env.imagekit.privateKey,
      timeout: 20_000,
      maxRetries: 2,
    });
  }

  return client;
};

