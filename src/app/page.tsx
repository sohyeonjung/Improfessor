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
            내가 교수님
          </h1>
          <p className="text-xl text-black mb-12">
            PDF 파일을 업로드하면 AI가 자동으로 학습문제를 생성해주는 스마트한 교육 플랫폼
          </p>
          
          {isAuthenticated ? (
            <div className="flex gap-6">
              <Link 
                href="/generate"
                className="px-10 py-3 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition"
              >
                문제 생성하기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/login"
                className="px-10 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition"
              >
                로그인
              </Link>
              <p className="text-black/70">
                비회원이라면?{' '}
                <Link href="/signup" className="underline hover:text-black transition">
                  회원가입
                </Link>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
