'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";
import UniversitySearchModal from "@/components/UniversitySearchModal";
import MajorSearchModal from "@/components/MajorSearchModal";

export default function SignupPage() {
  const router = useRouter();
  const { useSendVerificationEmail, useVerifyEmail, useRegister } = useAuth();
  const sendVerification = useSendVerificationEmail();
  const verifyEmail = useVerifyEmail();
  const register = useRegister();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    university: "",
    universityId: "",
    major: "",
    referralCode: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);

  // 비밀번호 정규식 검증 함수
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasLetter && hasNumber && hasSpecialChar,
      hasMinLength: minLength,
      hasLetter,
      hasNumber,
      hasSpecialChar,
    };
  };

  useEffect(() => {
    if (timer === null) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 0) {
          setCanResend(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // 비밀번호 입력 시 실시간 검증
    if (id === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleUniversitySelect = (university: string, universityId: string) => {
    setFormData(prev => ({
      ...prev,
      university,
      universityId
    }));
  };

  const handleMajorSelect = (major: string) => {
    setFormData(prev => ({
      ...prev,
      major
    }));
  };

  const handleSendVerification = async () => {
    if (!formData.email) {
      showAlert("이메일을 입력해주세요.");
      return;
    }

    if (!canResend) {
      showAlert(`${Math.ceil(timer! / 60)}분 ${timer! % 60}초 후에 다시 시도해주세요.`);
      return;
    }

    try {
      await sendVerification.mutateAsync({ email: formData.email });
      setTimer(180);
      setCanResend(false);
      showAlert("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      console.error('인증 코드 전송 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.verificationCode) {
      showAlert("인증 코드를 입력해주세요.");
      return;
    }

    try {
      await verifyEmail.mutateAsync({
        email: formData.email,
        code: formData.verificationCode
      });
      setIsEmailVerified(true);
      showAlert("이메일이 인증되었습니다.");
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("이메일 인증에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      showAlert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!passwordValidation.isValid) {
      showAlert("비밀번호 조건을 만족하지 않습니다.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await register.mutateAsync({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        university: formData.university,
        major: formData.major,
        recommendNickname: formData.referralCode,
        freeCount: 5,
        recommendCount: formData.referralCode ? 1 : 0
      });
      showAlert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D9EAFD] to-[#F8FAFC] relative">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.3',
        }}
      />
      <Link 
        href="/"
        className="absolute top-6 left-6 text-black hover:text-[#BCCCDC] transition-colors z-50"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      <div className="flex items-center justify-center min-h-screen py-12 relative z-10">
        <div className="bg-white p-8 shadow-lg w-full max-w-md rounded-lg">
          <h1 className="text-4xl font-bold text-center text-black mb-8">회원가입</h1>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                이메일 <span className="text-black/50">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                  placeholder="your@email.com"
                  required
                  disabled={isEmailVerified}
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={isEmailVerified || sendVerification.isPending}
                  className="px-4 py-2 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendVerification.isPending ? "전송 중..." : "인증번호 전송"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-black mb-2">
                인증번호 <span className="text-black/50">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                  placeholder="인증번호"
                  required
                  disabled={isEmailVerified}
                  maxLength={36}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={isEmailVerified || verifyEmail.isPending}
                  className="px-4 py-2 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyEmail.isPending ? "확인 중..." : "확인"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-black mb-2">
                닉네임 <span className="text-black/50">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="닉네임을 입력해주세요"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                비밀번호 <span className="text-black/50">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50 ${
                  formData.password ? (passwordValidation.isValid ? 'border-green-500' : 'border-red-500') : 'border-[#BCCCDC]'
                }`}
                placeholder="비밀번호를 입력해주세요"
                required
              />
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasMinLength ? '✓' : '✗'}</span>
                    최소 8자 이상
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasLetter ? '✓' : '✗'}</span>
                    영문 포함
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                    숫자 포함
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                    특수문자 포함 (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                비밀번호 확인 <span className="text-black/50">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />
            </div>

            <div>
              <label
                htmlFor="university"
                className="block text-sm font-medium text-black mb-2"
              >
                대학교 <span className="text-black/50">(선택)</span>
              </label>
              <input
                type="text"
                id="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="대학교를 입력해주세요"
              />
            </div>

            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-black mb-2"
              >
                학과 <span className="text-black/50">(선택)</span>
              </label>
              <input
                type="text"
                id="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="학과를 입력해주세요"
              />
            </div>

            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-black mb-2">
                추천인 코드 <span className="text-black/50">(선택)</span>
              </label>
              <input
                type="text"
                id="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
                placeholder="추천인 코드를 입력해주세요"
              />
            </div>

            <button
              type="submit"
              disabled={!isEmailVerified || register.isPending}
              className="w-full bg-[#D9EAFD] text-black py-3 rounded-lg hover:bg-[#BCCCDC] transition mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {register.isPending ? "처리 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-black">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-black hover:text-[#BCCCDC] transition">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>

      <UniversitySearchModal
        isOpen={isUniversityModalOpen}
        onClose={() => setIsUniversityModalOpen(false)}
        onSelect={handleUniversitySelect}
      />
      
      <MajorSearchModal
        isOpen={isMajorModalOpen}
        onClose={() => setIsMajorModalOpen(false)}
        onSelect={handleMajorSelect}
        selectedUniversity={formData.university}
        selectedUniversityId={formData.universityId}
      />
    </div>
  );
} 