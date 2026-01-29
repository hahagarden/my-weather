/**
 * 애플리케이션 전역에서 사용되는 성공 메시지 상수
 */

// 인증 관련 성공 메시지
export const AUTH_SUCCESSES = {
  LOGIN_SUCCESS: "로그인되었습니다!",
  SIGNUP_EMAIL_SENT:
    "이메일이 전송되었습니다. \n링크로 접속하여 인증을 완료해주세요!",
  LOGOUT_SUCCESS: "로그아웃되었습니다.",
} as const;

// 즐겨찾기 관련 성공 메시지
export const FAVORITE_SUCCESSES = {
  ADD_SUCCESS: "즐겨찾기가 추가되었습니다!",
  DELETE_SUCCESS: "즐겨찾기가 삭제되었습니다.",
  UPDATE_DISPLAY_NAME_SUCCESS: "즐겨찾기 이름이 변경되었습니다.",
} as const;
