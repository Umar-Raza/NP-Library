"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
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
];

const readerLinks = [
  { href: "/reader/dashboard", label: "Books", icon: BookOpen },
  { href: "/reader/issued-books", label: "Issued Books", icon: ClipboardList },
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
  const links = role === "librarian" ? librarianLinks : readerLinks;

  const SidebarContent = (
    <>
      <div className="px-4 py-6 flex items-center gap-2 border-b border-white/10">
        <BookOpen className="text-primary shrink-0" size={26} />
        <span className="font-display text-xl font-semibold whitespace-nowrap">
          NP Library
        </span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
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
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-2.5 w-full rounded-field hover:bg-white/10 text-neutral-content/80">
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

      {/* Desktop sidebar — always visible, fixed width, no collapse */}
      <aside className="hidden lg:flex h-screen w-64 bg-neutral text-neutral-content flex-col fixed left-0 top-0">
        {SidebarContent}
      </aside>
    </>
  );
}
