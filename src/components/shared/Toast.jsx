import { useState, useEffect, useCallback } from "react";

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
    toast.variant === "success"
      ? "bg-status-paid-bg border-status-paid-border text-status-paid-text"
      : "bg-surface text-ink border-border";

  return (
    <div
      className={`${baseStyles} ${variantStyles}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {toast.message}
    </div>
  );
}
