import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
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
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all">
        <div className="text-center">
          <p className="text-lg text-gray-800 font-medium mb-6">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#D9EAFD] text-black py-2.5 rounded-lg hover:bg-[#BCCCDC] transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 