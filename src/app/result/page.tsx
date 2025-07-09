'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import { Problem } from '@/types/problem';
import useProblem from '@/hooks/useProblem';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { downloadProblemPDF } = useProblem();
  
  const [isLoading, setIsLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    // URL에서 상태 복원
    const state = searchParams.get('state');
    if (state) {
      try {
        const { problems } = JSON.parse(state);
        setProblems(problems);
      } catch (error) {
        console.error('상태 복원 실패:', error);
        router.push('/generate');
      }
    } else {
      router.push('/generate');
    }
  }, [searchParams, router]);

  const handleDownload = async () => {
    if (!problems.length) return;

    setIsLoading(true);
    try {
      await downloadProblemPDF(problems);
    } catch (error) {
      alert(`PDF 다운로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-black">
                생성된 문제
              </h1>
              <button
                onClick={handleDownload}
                disabled={isLoading || !problems.length}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#D9EAFD] hover:bg-[#BCCCDC]'
                } text-black`}
              >
                {isLoading ? '다운로드 중...' : 'PDF 다운로드'}
              </button>
            </div>

            <div className="space-y-6">
              {problems.map((problem) => (
                <div
                  key={problem.number}
                  className="border border-[#BCCCDC] rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-black">
                      문제 {problem.number}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-black mb-2">문제 내용</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {problem.content}
                      </p>
                    </div>

                    {problem.description && (
                      <div>
                        <h4 className="font-medium text-black mb-2">설명</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {problem.description}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-black mb-2">정답</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {problem.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/generate')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                새로운 문제 생성하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 