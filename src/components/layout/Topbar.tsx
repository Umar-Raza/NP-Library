"use client";

import { Bell, User, LogOut, ChevronDown, Menu } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import Link from "next/link";

export default function Topbar({
  userName,
  role,
  onMenuClick,
}: {
  userName: string;
  role: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-base-100 border-b border-base-300 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden btn btn-ghost btn-circle btn-sm"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <p className="text-sm text-base-content/60 capitalize">
          {role} Dashboard
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationPanel />

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-field hover:bg-base-200"
          >
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-9">
                <span className="text-sm font-medium">
                  {userName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              {userName}
            </span>
            <ChevronDown
              size={16}
              className="text-base-content/40 hidden sm:inline"
            />
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 w-48 mt-2 p-2 z-20"
          >
            <li>
              <Link
                href={
                  role === "librarian"
                    ? "/librarian/profile"
                    : "/reader/profile"
                }
                className="flex items-center gap-2"
              >
                <User size={16} /> Profile
              </Link>
            </li>
            <li>
              <a className="flex items-center gap-2 text-error">
                <LogOut size={16} /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
