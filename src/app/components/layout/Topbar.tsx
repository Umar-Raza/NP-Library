"use client";

import { Bell } from "lucide-react";

export default function Topbar({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-base-100 border-b border-base-300 sticky top-0 z-10">
      <div>
        <p className="text-sm text-base-content/60 capitalize">
          {role} Dashboard
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost btn-circle btn-sm relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-9">
              <span className="text-sm font-medium">
                {userName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
    </header>
  );
}
