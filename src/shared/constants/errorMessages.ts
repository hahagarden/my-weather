/**
 * 애플리케이션 전역에서 사용되는 에러 메시지 상수
 */

// SUPABASE 에러 메시지
export const SUPABASE_ERRORS = {
  INVALID_CREDENTIALS: "invalid login credentials",
  WEAK_PASSWORD: "password should be at least 6 characters",
  EMAIL_NOT_CONFIRMED: "email not confirmed",
} as const;

// 인증 관련 에러 메시지
export const AUTH_ERRORS = {
  LOGIN_REQUIRED: "로그인이 필요합니다.",
  EMAIL_PASSWORD_REQUIRED: "이메일과 비밀번호를 입력해주세요.",
  AUTH_FAILED: "오류가 발생했습니다. 다시 시도해주세요.",
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 일치하지 않습니다.",
  WEAK_PASSWORD: "비밀번호는 6자 이상이어야 합니다.",
  EMAIL_NOT_CONFIRMED: "이메일이 인증되지 않았습니다.",
  LOGOUT_FAILED: "로그아웃 중 오류가 발생했습니다.",
} as const;

// 즐겨찾기 관련 에러 메시지
export const FAVORITE_ERRORS = {
  ADD_FAILED: "즐겨찾기 추가에 실패했습니다.",
  DELETE_FAILED: "즐겨찾기 삭제에 실패했습니다.",
  UPDATE_DISPLAY_NAME_FAILED: "이름 변경에 실패했습니다.",
  DISPLAY_NAME_REQUIRED: "이름을 입력해주세요.",
  LOAD_PARTIAL_FAILED: "일부 정보를 불러오는데 실패했습니다.",
  MAX_LIMIT_REACHED: "즐겨찾기는 최대 6개까지 추가할 수 있습니다.",
} as const;

// 일반 에러 메시지
export const GENERAL_ERRORS = {
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다",
  RETRY: "다시 시도해주세요",
  MISSING_COORDINATES: "위치 정보를 찾을 수 없습니다",
  MISSING_PARAMETERS: "필수 파라미터가 없습니다",
  GEOLOCATION_NOT_SUPPORTED: "브라우저가 위치 정보를 지원하지 않습니다",
} as const;

// 날씨 관련 에러 메시지
export const WEATHER_ERRORS = {
  INVALID_COORDINATES: "유효하지 않은 좌표입니다.",
  INVALID_COORDINATE_RANGE: "좌표 범위가 유효하지 않습니다.",
  API_CALL_FAILED: (status: number) => `날씨 API 호출 실패: ${status}`,
} as const;

// 지역 관련 에러 메시지
export const REGION_ERRORS = {
  NOT_FOUND: (id: number) => `지역 정보를 찾을 수 없습니다: ${id}`,
  INVALID_ID: "유효하지 않은 지역 ID입니다.",
  INVALID_LIMIT: "limit 파라미터는 1 이상 1000 이하의 숫자여야 합니다.",
} as const;

// 에러 메시지 포맷 함수
export const formatError = (
  message: string,
  error?: Error | string,
): string => {
  const errorMessage =
    error instanceof Error ? error.message : error || message;
  return errorMessage || message;
};

// 에러 메시지 헬퍼 함수
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return GENERAL_ERRORS.UNKNOWN_ERROR;
};
