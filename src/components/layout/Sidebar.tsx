"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/api/auth";
import { getReaderCounts, ReaderCounts } from "@/lib/api/dashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Star,
  X,
} from "lucide-react";

const librarianLinks = [
  { href: "/librarian/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/librarian/books", label: "Books", icon: BookOpen },
  {
    href: "/librarian/issued-books",
    label: "Issued Books",
    icon: ClipboardList,
  },
  { href: "/librarian/requests", label: "Requests", icon: Users },
  { href: "/librarian/books-logs", label: "Books Logs", icon: ClipboardList },
];

const readerLinks = [
  {
    href: "/reader/dashboard",
    label: "Books",
    icon: BookOpen,
    showCount: true,
  },
  {
    href: "/reader/issued-books",
    label: "Issued Books",
    icon: ClipboardList,
    showCount: false,
  },
  { href: "/reader/starred", label: "Starred", icon: Star, showCount: false },
];

export default function Sidebar({
  role,
  mobileOpen,
  onMobileClose,
}: {
  role: "librarian" | "reader";
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [counts, setCounts] = useState<ReaderCounts>({ totalBooks: 0 });

  useEffect(() => {
    if (role === "reader") {
      getReaderCounts().then(setCounts);
    }
  }, [role]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const SidebarContent = (
    <>
      <div className="px-4 py-6 flex items-center gap-2 border-b border-white/10">
        <BookOpen className="text-primary shrink-0" size={26} />
        <span className="font-display text-xl font-semibold whitespace-nowrap">
          NP Library
        </span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {role === "librarian"
          ? librarianLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-field transition-colors ${
                    active
                      ? "bg-primary text-primary-content font-medium"
                      : "hover:bg-white/10 text-neutral-content/80"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })
          : readerLinks.map(({ href, label, icon: Icon, showCount }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-field transition-colors ${
                    active
                      ? "bg-primary text-primary-content font-medium"
                      : "hover:bg-white/10 text-neutral-content/80"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="flex-1 whitespace-nowrap">{label}</span>
                  {showCount && counts.totalBooks > 0 && (
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                        active
                          ? "bg-primary-content/20 text-primary-content"
                          : "bg-white/15 text-neutral-content"
                      }`}
                    >
                      {counts.totalBooks > 99 ? "99+" : counts.totalBooks}
                    </span>
                  )}
                </Link>
              );
            })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-field hover:bg-white/10 text-neutral-content/80"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-neutral text-neutral-content flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 btn btn-ghost btn-circle btn-sm text-neutral-content"
          onClick={onMobileClose}
        >
          <X size={18} />
        </button>
        {SidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-64 bg-neutral text-neutral-content flex-col fixed left-0 top-0">
        {SidebarContent}
      </aside>
    </>
  );
}
