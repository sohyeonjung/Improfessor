'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { getUserIdFromToken } from '@/lib/utils';
import { UserInfo, ApiResponse } from '@/types/auth';

interface UserContextType {
  user: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 토큰에서 사용자 ID 추출
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const extractedUserId = getUserIdFromToken();
        // 토큰이 있으면 userId를 설정 (디코딩 실패해도 null로 설정)
        setUserId(extractedUserId);
      } else {
        // 토큰이 없는 경우 userId를 null로 설정하고 사용자 정보 캐시 제거
        setUserId(null);
        queryClient.removeQueries({ queryKey: ['userInfo'] });
        queryClient.removeQueries({ queryKey: ['userInfo', null] });
      }
    };

    checkToken();

    // storage 이벤트 리스너
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkToken();
      }
    };

    // 커스텀 이벤트 리스너
    const handleTokenChange = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenChange', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChange', handleTokenChange);
    };
  }, [queryClient]);

  // 사용자 정보 조회
  const {
    data: userInfoResponse,
    isLoading,
    error,
    refetch
  } = useQuery<ApiResponse<UserInfo>>({
    queryKey: ['userInfo', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('사용자 ID가 없습니다.');
      }
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });

  // isAuthenticated: 토큰이 있으면 인증된 것으로 간주
  const isAuthenticated = !!userId;

  const value: UserContextType = {
    user: userInfoResponse?.data || null,
    isLoading,
    error: error as Error | null,
    refetch,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 