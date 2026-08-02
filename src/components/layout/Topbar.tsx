"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, ChevronDown, Menu } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { signOut } from "@/lib/api/auth";

export default function Topbar({
  role,
  onMenuClick,
}: {
  role: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const user = useCurrentUser();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const initial = user?.fullName?.[0]?.toUpperCase() || "U";
  const profileHref =
    role === "librarian" ? "/librarian/profile" : "/reader/profile";

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
            {user ? (
              <>
                <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-medium overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {user.fullName}
                </span>
                <ChevronDown
                  size={16}
                  className="text-base-content/40 hidden sm:inline"
                />
              </>
            ) : (
              <>
                <div className="skeleton w-9 h-9 rounded-full shrink-0"></div>
                <div className="skeleton h-4 w-20 hidden sm:block"></div>
              </>
            )}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 w-48 mt-2 p-2 z-20 "
          >
            <li>
              <Link href={profileHref} className="flex items-center gap-2">
                <User size={16} /> Profile
              </Link>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center gap-2 text-error"
              >
                <LogOut size={16} /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
