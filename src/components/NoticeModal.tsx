import { useState } from "react";
import { Notice } from "@/types/notice";

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

export default function NoticeModal({ mode, notice, onClose, onSubmit }: NoticeModalProps) {
  const [title, setTitle] = useState(notice?.title || '');
  const [content, setContent] = useState(notice?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
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
              className="w-full px-3 py-2 border border-[#BCCCDC] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
              placeholder="제목을 입력하세요"
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
              className="w-full px-3 py-2 border border-[#BCCCDC] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-black/50"
              placeholder="내용을 입력하세요"
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