"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Users,
  ClipboardList,
  Bell,
  LogOut,
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
  { href: "/reader/issued-books", label: "My Books", icon: ClipboardList },
];

export default function Sidebar({ role }: { role: "librarian" | "reader" }) {
  const pathname = usePathname();
  const links = role === "librarian" ? librarianLinks : readerLinks;

  return (
    <aside className="h-screen w-64 bg-neutral text-neutral-content flex flex-col fixed left-0 top-0">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-white/10">
        <BookOpen className="text-primary" size={26} />
        <span className="font-display text-xl font-semibold">NP Library</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-field transition-colors ${
                active
                  ? "bg-primary text-primary-content font-medium"
                  : "hover:bg-white/10 text-neutral-content/80"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-2.5 w-full rounded-field hover:bg-white/10 text-neutral-content/80">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
