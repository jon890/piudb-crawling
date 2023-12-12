export const ErrorCode = {
  // 파라미터 검증 오류
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",

  // 로그인 오류
  NOT_REGISTER_USER: "NOT_REGISTER_USER",
  NOT_MATCH_PASSWORD: "NOT_MATCH_PASSWORD",
  LOGIN_FAILED: "LOGIN_FAILED",

  // 알 수 없는 오류
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorCodeKey = keyof typeof ErrorCode;
