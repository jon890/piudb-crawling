export const ErrorCode = {
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  NOT_LOADED_PAGE: "NOT_LOADED_PAGE",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorCodeKey = keyof typeof ErrorCode;
