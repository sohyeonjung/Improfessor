'use client';

import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { isAuthenticated } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D9EAFD] to-[#F8FAFC] relative">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center relative z-10">
        <main className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-8">
            나는 교수다
          </h1>
          <p className="text-xl text-black mb-12 max-w-2xl">
            PDF 파일을 업로드하면 AI가 자동으로 학습문제를 생성해주는 스마트한 교육 플랫폼
          </p>
          
          <div className="flex gap-6">
            {isAuthenticated ? (
              <Link 
                href="/generate"
                className="px-8 py-3 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition"
              >
                문제 생성하기
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-8 py-3 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-white text-black border border-[#BCCCDC] rounded-lg hover:bg-[#F8FAFC] transition"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
