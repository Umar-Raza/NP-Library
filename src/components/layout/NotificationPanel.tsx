"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  BookOpen,
  UserPlus,
  Info,
} from "lucide-react";
import {
  getNotifications,
  markAllRead,
  Notification,
} from "@/lib/api/notifications";

const iconMap: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 size={16} className="text-success" />,
  rejected: <XCircle size={16} className="text-error" />,
  borrowed: <BookOpen size={16} className="text-primary" />,
  new_request: <UserPlus size={16} className="text-warning" />,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just Now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationPanel() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const load = (initial = false) => {
    if (initial) setLoading(true);
    getNotifications()
      .then(setItems)
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load(true); // pehli baar skeleton
    const interval = setInterval(() => load(false), 60000); // polling — bina skeleton
    return () => clearInterval(interval);
  }, []);

  // Panel khulne par sab read mark
  const handleOpen = async () => {
    if (unreadCount > 0) {
      await markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle btn-sm relative"
        onClick={handleOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-error text-error-content text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-20 mt-2 w-80 sm:w-96 bg-base-100 rounded-box shadow-lg border border-base-300 max-h-[70vh] overflow-y-auto"
      >
        <div className="px-4 py-3 border-b border-base-300">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-base-content/50 py-8">
            No notifications available.
          </p>
        ) : (
          <ul>
            {items.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-base-300 last:border-0 ${
                  !n.isRead ? "bg-primary/5" : ""
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {iconMap[n.type] ?? <Info size={16} className="text-info" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-base-content/80">{n.message}</p>
                  <p className="text-xs text-base-content/40 mt-0.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
