import React, { useEffect, useRef } from "react";
import { LogOut, X } from "lucide-react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible, onClose]);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/50 p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="relative p-4 w-full max-w-md bg-white rounded-2xl shadow-xl"
      >
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-3 right-3 text-stone-400 hover:bg-stone-100 hover:text-stone-900 rounded-lg w-8 h-8 inline-flex justify-center items-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          onClick={onClose}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
        <div className="p-4 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-stone-500" aria-hidden="true" />
          </div>
          <h3 id="logout-modal-title" className="mb-6 text-lg font-bold text-stone-900">
            Are you sure you want to log out?
          </h3>
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              type="button"
              autoFocus
              className="py-2.5 px-5 text-sm font-bold text-stone-700 bg-white rounded-full border border-stone-200 hover:bg-stone-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="py-2.5 px-5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
