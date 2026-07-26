"use client";

import { Bell, CheckCircle2, XCircle, BookOpen, Info } from "lucide-react";
import { dummyNotifications, Notification } from "@/lib/dummy-notifications";

const iconMap: Record<Notification["type"], React.ReactNode> = {
  approved: <CheckCircle2 size={16} className="text-success" />,
  rejected: <XCircle size={16} className="text-error" />,
  borrowed: <BookOpen size={16} className="text-primary" />,
  request: <Bell size={16} className="text-warning" />,
  info: <Info size={16} className="text-info" />,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationPanel() {
  const unreadCount = dummyNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle btn-sm relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        )}
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-20 mt-2 w-80 sm:w-96 bg-base-100 rounded-box shadow-lg border border-base-300 max-h-[70vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="badge badge-primary badge-sm w-12">
              {unreadCount} New
            </span>
          )}
        </div>

        {dummyNotifications.length === 0 ? (
          <p className="text-center text-sm text-base-content/50 py-8">
            No notifications.
          </p>
        ) : (
          <ul>
            {dummyNotifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-base-300 last:border-0 ${
                  !n.isRead ? "bg-primary/5" : ""
                }`}
              >
                <span className="mt-0.5 shrink-0">{iconMap[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-base-content/80">{n.message}</p>
                  <p className="text-xs text-base-content/40 mt-0.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
