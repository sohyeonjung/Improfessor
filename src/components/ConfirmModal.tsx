import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, description, onConfirm, onCancel }: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all">
        <div className="text-center">
          <div className="mb-2 text-xl font-bold text-gray-900">{title}</div>
          {description && (
            <div className="mb-6 text-gray-700 whitespace-pre-line text-base">{description}</div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-400 transition"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
} 