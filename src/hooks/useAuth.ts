import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import {
  SendVerificationEmailRequest,
  VerifyEmailRequest,
  RegisterRequest,
  LoginRequest,
  ApiResponse,
  TokenData
} from '@/types/auth';

const useAuth = () => {
  // 이메일 인증코드 전송
  const useSendVerificationEmail = () => {
    return useMutation<ApiResponse<null>, Error, SendVerificationEmailRequest>({
      mutationFn: async (data) => {
        const response = await axiosInstance.post('/api/users/email/send-verification', null, {
          params: { email: data.email }
        });
        return response.data;
      },
    });
  };

  // 이메일 인증코드 확인
  const useVerifyEmail = () => {
    return useMutation<ApiResponse<null>, Error, VerifyEmailRequest>({
      mutationFn: async (data) => {
        const response = await axiosInstance.post('/api/users/email/verify', data);
        return response.data;
      },
    });
  };

  // 회원가입
  const useRegister = () => {
    return useMutation<ApiResponse<null>, Error, RegisterRequest>({
      mutationFn: async (data) => {
        const response = await axiosInstance.post('/api/users/register', data);
        return response.data;
      },
    });
  };

  const useLogin = () => {
    return useMutation<ApiResponse<TokenData>, Error, LoginRequest>({
      mutationFn: async (data) => {
        const response = await axiosInstance.post('/api/users/login', data);
        return response.data;
      },
      onSuccess: (response) => {
        // 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Authorization 헤더 설정
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      },
    });
  };

  return {
    useSendVerificationEmail,
    useVerifyEmail,
    useRegister,
    useLogin,
  };
};

export default useAuth; 