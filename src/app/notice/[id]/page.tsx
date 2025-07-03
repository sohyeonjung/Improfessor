'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import useNotice from "@/hooks/useNotice";

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noticeId = Number(params.id);

  const { useNoticeDetail } = useNotice();
  const { data: noticeResponse, isLoading, error } = useNoticeDetail(noticeId);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error || !noticeResponse) {
    return <div>공지사항을 불러오는데 실패했습니다.</div>;
  }

  const notice = noticeResponse.data;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 목록으로
              </button>
            </div>

            <div className="border-b border-[#BCCCDC] pb-6 mb-6">
              <h1 className="text-2xl font-bold text-black mb-4">
                {notice.title}
              </h1>
              <div className="flex gap-4 text-sm text-gray-600">
                <div>
                  작성일: {new Date(notice.createdAt).toLocaleDateString()}
                </div>
                <div>
                  수정일: {new Date(notice.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              {/* 줄바꿈을 위해 white-space: pre-wrap 적용 */}
              <div className="whitespace-pre-wrap">
                {notice.content}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 