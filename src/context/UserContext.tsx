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

  // 토큰에서 사용자 ID 추출 및 변경 감지
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const extractedUserId = getUserIdFromToken();
        if (extractedUserId !== userId) {
          setUserId(extractedUserId);
        }
      } else {
        if (userId !== null) {
          setUserId(null);
          // 토큰이 없어지면 사용자 정보 캐시 제거
          queryClient.removeQueries({ queryKey: ['userInfo'] });
        }
      }
    };

    // 초기 체크
    checkToken();

    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId, queryClient]);

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

  // isAuthenticated: 사용자 정보가 성공적으로 로드되었는지 확인
  const isAuthenticated = !isLoading && !error && !!userInfoResponse?.data;

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