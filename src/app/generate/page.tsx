'use client';

import Header from "@/components/Header";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useProblem from "@/hooks/useProblem";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";

export default function GeneratePage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const conceptFileRef = useRef<HTMLInputElement>(null);
  const formatFileRef = useRef<HTMLInputElement>(null);
  const [conceptFileName, setConceptFileName] = useState<string>('');
  const [formatFileName, setFormatFileName] = useState<string>('');

  const { useGenerateProblem } = useProblem();
  const generateProblemMutation = useGenerateProblem();

  const handleConceptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConceptFileName(file.name);
    }
  };

  const handleFormatFileClick = (e: React.MouseEvent) => {
    if (!conceptFileRef.current?.files?.length) {
      e.preventDefault();
      showAlert('수업 자료를 먼저 업로드해 주세요.');
      return;
    }
  };

  const handleFormatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormatFileName(file.name);
    }
  };

  const handleGenerate = async () => {
    // 로그인 체크
    if (!isAuthenticated) {
      showAlert('로그인이 필요합니다.');
      return;
    }

    // freeCount 체크
    if (!user || user.freeCount <= 0) {
      showAlert('무료 생성 횟수가 부족합니다. 마이페이지에서 확인해주세요.');
      return;
    }

    const conceptFiles = conceptFileRef.current?.files;
    if (!conceptFiles || conceptFiles.length === 0) {
      showAlert('수업 자료를 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const formatFiles = formatFileRef.current?.files;
      const response = await generateProblemMutation.mutateAsync({
        conceptFiles: Array.from(conceptFiles),
        formatFiles: formatFiles ? Array.from(formatFiles) : undefined,
      });

      const state = {
        problems: response.data.problems,
        downloadKey: response.data.downloadKey,
      };
      router.push(`/result?state=${encodeURIComponent(JSON.stringify(state))}`);
    } catch (error) {
      console.error('문제 생성 실패:', error);
      showAlert('문제 생성에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 제목과 설명 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            나는 교수다
          </h1>
          <p className="text-lg text-black">
            자료 업로드 후 문제 생성하기 버튼을 눌러주세요
          </p>
        </div>

        <div className="space-y-8">
          {/* 수업 자료 업로드 섹션 */}
          <div className="bg-white shadow">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-black mb-4">
                수업 자료 업로드
              </h2>

              <p className="text-black mb-8">
                문제를 만들어 드릴까요? 개념 학습 자료를 업로드 해주세요
              </p>

              <div className="bg-[#F8FAFC] p-6 text-center border border-[#BCCCDC] rounded-lg">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  className="hidden"
                  id="concept-upload"
                  ref={conceptFileRef}
                  onChange={handleConceptFileChange}
                />
                <label
                  htmlFor="concept-upload"
                  className="inline-flex flex-col items-center cursor-pointer"
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-4"
                  >
                    <path
                      d="M24 32V16M16 24L24 16L32 24"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 32H40"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="32"
                      height="32"
                      rx="4"
                      stroke="#666"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  <span className="text-sm text-black mb-2">
                    {conceptFileName || '파일 선택하기'}
                  </span>
                  <span className="text-xs text-black">
                    (pdf, ppt 파일만 가능, 각 15MB 이하)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 족보 올리기 섹션 */}
          <div className="bg-white shadow">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-black mb-4">
                족보 올리기
              </h2>

              <p className="text-black mb-8">
                유사한 스타일로 만들어 드릴까요? 원하는 문제 유형 자료를 업로드 해주세요
              </p>

              <div className="bg-[#F8FAFC] p-6 text-center border border-[#BCCCDC] rounded-lg">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  className="hidden"
                  id="reference-upload"
                  ref={formatFileRef}
                  onChange={handleFormatFileChange}
                />
                <label
                  htmlFor="reference-upload"
                  className="inline-flex flex-col items-center cursor-pointer"
                  onClick={handleFormatFileClick}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-4"
                  >
                    <path
                      d="M24 32V16M16 24L24 16L32 24"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 32H40"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="32"
                      height="32"
                      rx="4"
                      stroke="#666"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  <span className="text-sm text-black mb-2">
                    {formatFileName || '파일 선택하기'}
                  </span>
                  <span className="text-xs text-black">
                    (pdf, ppt 파일만 가능, 각 15MB 이하)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 문제 생성하기 버튼 */}
          <button
            type="button"
            className={`w-full py-4 text-lg font-medium transition relative ${
              isLoading 
                ? 'bg-[#BCCCDC] cursor-not-allowed'
                : 'bg-[#D9EAFD] hover:bg-[#BCCCDC]'
            } text-black`}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                문제 생성 중...
              </div>
            ) : (
              '문제 생성하기'
            )}
          </button>
        </div>
      </main>
    </div>
  );
} 