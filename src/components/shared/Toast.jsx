import { useState, useEffect, useCallback } from "react";

/**
 * Lightweight toast notification.
 * Usage:
 *   const { toast, ToastContainer } = useToast();
 *   toast("Staff member added!", "success");
 *   // render <ToastContainer /> somewhere in your JSX
 */

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, variant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function ToastContainer() {
    return (
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    );
  }

  return { toast, ToastContainer };
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const baseStyles =
    "pointer-events-auto px-4 py-3 rounded-lg border shadow-lg text-sm font-semibold flex items-center gap-2.5 transition-all duration-300";

  const variantStyles =
    toast.variant === "error"
      ? "bg-status-overdue-bg border-status-overdue-border text-status-overdue-text"
      : "bg-status-paid-bg border-status-paid-border text-status-paid-text";

  const icon =
    toast.variant === "error" ? (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );

  return (
    <div
      className={`${baseStyles} ${variantStyles}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {icon}
      {toast.message}
    </div>
  );
}
