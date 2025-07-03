'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import useNotice from "@/hooks/useNotice";
import { useRouter } from "next/navigation";

export default function NoticePage() {
  const router = useRouter();
  const { useNoticeList } = useNotice();
  const { data: noticeResponse, isLoading } = useNoticeList();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const notices = noticeResponse?.data || [];
  const totalPages = Math.ceil(notices.length / itemsPerPage);

  // 현재 페이지에 해당하는 공지사항만 필터링
  const currentNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-black mb-8">
              공지사항
            </h1>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#BCCCDC]">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-20">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      제목
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-32">
                      작성일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#BCCCDC]">
                  {currentNotices.map((notice) => (
                    <tr 
                      key={notice.noticeId}
                      className="hover:bg-[#D9EAFD] cursor-pointer transition-colors"
                      onClick={() => {
                        router.push(`/notice/${notice.noticeId}`);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {notice.noticeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        <div className="flex items-center gap-2">
                          {notice.title}
                          {/* 최근 3일 이내의 공지사항에 NEW 표시 */}
                          {new Date().getTime() - new Date(notice.createdAt).getTime() < 3 * 24 * 60 * 60 * 1000 && (
                            <span className="bg-[#D9EAFD] text-black text-xs px-2 py-0.5 rounded">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 