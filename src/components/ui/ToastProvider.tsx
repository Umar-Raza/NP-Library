"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}

const config: Record<ToastType, { icon: ReactNode; classes: string }> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    classes: "border-success/30 bg-success/10 text-success",
  },
  error: {
    icon: <XCircle size={18} />,
    classes: "border-error/30 bg-error/10 text-error",
  },
  info: {
    icon: <Info size={18} />,
    classes: "border-info/30 bg-info/10 text-info",
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    classes: "border-warning/30 bg-warning/10 text-warning",
  },
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 3500); // 3.5s baad khud gayab
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container — top-right */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg bg-base-100 backdrop-blur pointer-events-auto ${config[t.type].classes}`}
          >
            <span className="shrink-0">{config[t.type].icon}</span>
            <p className="flex-1 text-sm font-medium text-base-content/80">
              {t.message}
            </p>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 text-base-content/40 hover:text-base-content transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
