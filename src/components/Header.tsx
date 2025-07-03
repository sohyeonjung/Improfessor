'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white shadow relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/generate" className="text-2xl font-bold text-black">
              내가교수다
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

            {/* 프로필 드롭다운 */}
            <div className="relative">
              <button
                className="flex items-center text-black hover:text-[#BCCCDC] transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-[#BCCCDC]">
                  <Link
                    href="/mypage"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#D9EAFD]"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-[#D9EAFD]"
                    onClick={() => {
                      // TODO: 로그아웃 로직
                      console.log('로그아웃');
                      setIsProfileOpen(false);
                      router.push('/login');
                    }}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 