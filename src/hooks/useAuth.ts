import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { getUserIdFromToken, decodeToken } from '@/lib/utils';
import {
  SendVerificationEmailRequest,
  VerifyEmailRequest,
  RegisterRequest,
  LoginRequest,
  ApiResponse,
  TokenData,
  UserInfo
} from '@/types/auth';

const useAuth = () => {
  const queryClient = useQueryClient();

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
      onSuccess: async (response) => {
        // 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Authorization 헤더 설정
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        // 토큰 변경 이벤트 발생
        window.dispatchEvent(new Event('tokenChange'));
        
        // 사용자 ID 추출 후 바로 사용자 정보 가져오기
        const userId = getUserIdFromToken();
        if (userId) {
          try {
            const userResponse = await axiosInstance.get(`/api/users/${userId}`);
            // 사용자 정보를 캐시에 저장
            queryClient.setQueryData(['userInfo', userId], userResponse.data);
          } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error);
          }
        }
      },
    });
  };

  // 로그아웃
  const useLogout = () => {
    return useMutation<ApiResponse<null>, Error, void>({
      mutationFn: async () => {
        const response = await axiosInstance.post('/api/users/logout');
        return response.data;
      },
      onSuccess: () => {
        // 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Authorization 헤더 제거
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // 토큰 변경 이벤트 발생
        window.dispatchEvent(new Event('tokenChange'));
        
        // 사용자 정보 캐시 제거
        queryClient.removeQueries({ queryKey: ['userInfo'] });
      },
    });
  };

  // 인증 상태 확인 (토큰 존재 여부 + 만료 시간 확인)
  const useAuthStatus = () => {
    return useQuery({
      queryKey: ['authStatus'],
      queryFn: () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          return false;
        }
        
        // 토큰 디코딩해서 만료 시간 확인
        const decoded = decodeToken(accessToken);
        if (!decoded || !decoded.exp) {
          return false;
        }
        
        // 현재 시간과 만료 시간 비교
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp < currentTime;
        
        if (isExpired) {
          // 만료된 토큰 제거
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete axiosInstance.defaults.headers.common['Authorization'];
          return false;
        }
        
        return true;
      },
      staleTime: 60 * 1000, // 1분마다 체크
      gcTime: Infinity,
    });
  };

  // 사용자 정보 가져오기 (기존 훅 유지 - 하위 호환성)
  const useUserInfo = () => {
    return useQuery<ApiResponse<UserInfo>>({
      queryKey: ['userInfo'],
      queryFn: async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error('사용자 ID를 찾을 수 없습니다.');
        }
        const response = await axiosInstance.get(`/api/users/${userId}`);
        return response.data;
      },
      enabled: !!getUserIdFromToken(),
      staleTime: 5 * 60 * 1000, // 5분
    });
  };

  return {
    useSendVerificationEmail,
    useVerifyEmail,
    useRegister,
    useLogin,
    useLogout,
    useAuthStatus,
    useUserInfo,
  };
};

export default useAuth; 