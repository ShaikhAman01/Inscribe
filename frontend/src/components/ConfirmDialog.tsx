import React, { useEffect, useId, useRef } from "react";
import { Loader2, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  isVisible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy?: boolean;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isVisible,
  title,
  description,
  confirmLabel,
  busy = false,
  confirmDisabled = false,
  onConfirm,
  onClose,
  children,
}) => {
  const panelRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible, busy, onClose]);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/50 p-4"
      onClick={(e) => {
        if (!busy && panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
      }}
    >
      <form
        ref={panelRef}
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy && !confirmDisabled) onConfirm();
        }}
        className="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-xl"
      >
        <button
          type="button"
          aria-label="Close dialog"
          disabled={busy}
          className="absolute top-3 right-3 text-stone-400 hover:bg-stone-100 hover:text-stone-900 rounded-lg w-8 h-8 inline-flex justify-center items-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          onClick={onClose}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-red-600" aria-hidden="true" />
        </div>
        <h3 id={titleId} className="text-lg font-bold text-stone-900 text-center">
          {title}
        </h3>
        <p id={descriptionId} className="mt-2 text-sm text-stone-600 text-center leading-relaxed">
          {description}
        </p>
        {children && <div className="mt-5">{children}</div>}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            autoFocus={!children}
            className="py-2.5 px-5 text-sm font-bold text-stone-700 bg-white rounded-full border border-stone-200 hover:bg-stone-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || confirmDisabled}
            className="flex items-center gap-2 py-2.5 px-5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmDialog;
