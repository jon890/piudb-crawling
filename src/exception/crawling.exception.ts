import { ErrorCodeKey } from "./error-code";

export class CrawlingException {
  constructor(
    readonly errorCode: ErrorCodeKey,
    readonly message?: string,
    readonly httpStatus: number = 400
  ) {}
}
