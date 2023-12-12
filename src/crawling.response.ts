import { ErrorCodeKey } from "./exception/error-code";

export class CrawlingResponse<T> {
  constructor(
    readonly error?: ErrorCodeKey,
    readonly message?: string,
    readonly data?: T
  ) {}

  static error(error: ErrorCodeKey, message?: string) {
    return new CrawlingResponse(error, message);
  }

  static ok<T>(data?: T, message?: "ok") {
    return new CrawlingResponse(undefined, message, data);
  }
}
