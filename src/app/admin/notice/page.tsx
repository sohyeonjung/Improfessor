'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import useNotice from "@/hooks/useNotice";
import { Notice } from "@/types/notice";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminNoticePage() {
  const queryClient = useQueryClient();
  const { useNoticeList, useCreateNotice, useUpdateNotice, useDeleteNotice } = useNotice();
  const { data: noticeResponse, isLoading } = useNoticeList();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const createNoticeMutation = useCreateNotice();
  const updateNoticeMutation = useUpdateNotice();
  const deleteNoticeMutation = useDeleteNotice();

  const itemsPerPage = 10;
  const notices = noticeResponse?.data || [];
  const totalPages = Math.ceil(notices.length / itemsPerPage);

  // 현재 페이지에 해당하는 공지사항만 필터링
  const currentNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateClick = () => {
    setSelectedNotice(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (noticeId: number) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deleteNoticeMutation.mutateAsync(noticeId);
        queryClient.invalidateQueries({ queryKey: ['notices'] });
        alert('공지사항이 삭제되었습니다.');
      } catch (error) {
        alert('공지사항 삭제에 실패했습니다.');
        console.error('공지사항 삭제 실패:', error);
      }
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-black">
                공지사항 관리
              </h1>
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-[#D9EAFD] text-black rounded-md hover:bg-[#B8D4F0] transition-colors"
              >
                공지사항 작성
              </button>
            </div>

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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-32">
                      수정일
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-32">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#BCCCDC]">
                  {currentNotices.map((notice) => (
                    <tr key={notice.noticeId} className="hover:bg-[#D9EAFD] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {notice.noticeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {notice.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(notice.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(notice)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteClick(notice.noticeId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </div>
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

      {isModalOpen && (
        <NoticeModal
          mode={modalMode}
          notice={selectedNotice}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            try {
              if (modalMode === 'create') {
                await createNoticeMutation.mutateAsync(data);
                alert('공지사항이 생성되었습니다.');
              } else if (modalMode === 'edit' && selectedNotice) {
                await updateNoticeMutation.mutateAsync({
                  noticeId: selectedNotice.noticeId,
                  data,
                });
                alert('공지사항이 수정되었습니다.');
              }
              queryClient.invalidateQueries({ queryKey: ['notices'] });
              setIsModalOpen(false);
            } catch (error) {
              alert('공지사항 저장에 실패했습니다.');
              console.error('공지사항 저장 실패:', error);
            }
          }}
        />
      )}
    </div>
  );
}

interface NoticeFormData {
  title: string;
  content: string;
}

interface NoticeModalProps {
  mode: 'create' | 'edit';
  notice: Notice | null;
  onClose: () => void;
  onSubmit: (data: NoticeFormData) => void;
}

function NoticeModal({ mode, notice, onClose, onSubmit }: NoticeModalProps) {
  const [title, setTitle] = useState(notice?.title || '');
  const [content, setContent] = useState(notice?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-[#BCCCDC]">
          <h2 className="text-xl font-semibold text-black">
            {mode === 'create' ? '공지사항 작성' : '공지사항 수정'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#BCCCDC] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D9EAFD]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-[#BCCCDC] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D9EAFD]"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black hover:bg-[#F8FAFC] rounded-md transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#D9EAFD] text-black rounded-md hover:bg-[#B8D4F0] transition-colors"
            >
              {mode === 'create' ? '작성' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 