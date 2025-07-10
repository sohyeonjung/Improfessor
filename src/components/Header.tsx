'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { useLogout } = useAuth();
  const logoutMutation = useLogout();
  const { user, isLoading: userLoading, isAuthenticated } = useUser();

  // 초기 토큰 설정
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // axiosInstance의 Authorization 헤더 설정은 lib/axios.ts에서 처리
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 토큰은 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsProfileOpen(false);
      router.push('/');
    }
  };

  return (
    <header className="bg-white shadow relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/generate" className="text-2xl font-bold text-black">
            나는 교수다
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* 공지사항 버튼 */}
            <Link
              href="/notice"
              className="text-black hover:text-[#BCCCDC] transition-colors"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </Link>

            {/* 로그인 상태에 따른 UI */}
            {isAuthenticated ? (
              /* 프로필 드롭다운 */
              <div className="relative">
                <button
                  className="flex items-center text-black hover:text-[#BCCCDC] transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="flex items-center space-x-2">
                    {user ? (
                      <span className="text-sm font-medium">{user.nickname}</span>
                    ) : userLoading ? (
                      <span className="text-sm text-gray-500">로딩 중...</span>
                    ) : (
                      <span className="text-sm font-medium">사용자</span>
                    )}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </button>

                {/* 드롭다운 메뉴 */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-[#BCCCDC]">
                    {user && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-[#BCCCDC]">
                        <div className="font-medium">{user.email}</div>
                        <div>무료 생성: {user.freeCount}회</div>
                      </div>
                    )}
                    <Link
                      href="/mypage"
                      className="block px-4 py-2 text-sm text-black hover:bg-[#D9EAFD]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-[#D9EAFD] disabled:opacity-50"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 로그인/회원가입 버튼 */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-black hover:text-[#BCCCDC] transition-colors"
                >
                  로그인
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  href="/signup"
                  className="text-black hover:text-[#BCCCDC] transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 