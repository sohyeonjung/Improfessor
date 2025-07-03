// 이메일 인증 요청 타입
export interface SendVerificationEmailRequest {
  email: string;
}

// 이메일 인증 확인 요청 타입
export interface VerifyEmailRequest {
  email: string;
  code: string;
}

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
  university?: string;
  major?: string;
  freeCount: number;
  recommendCount: number;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenData {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}

// 사용자 정보 타입
export interface UserInfo {
  userId: string;
  email: string;
  nickname: string;
  university?: string;
  major?: string;
  freeCount: number;
  recommendCount: number;
  referralCode: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  status: string;
  code: string;
  message: string;
  data: T;
} 