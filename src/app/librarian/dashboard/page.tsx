"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Users,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { dummyBooks } from "@/lib/dummy-books";
import { dummyReaders } from "@/lib/dummy-readers";

export default function LibrarianDashboardPage() {
  const totalBooks = dummyBooks.length;
  const issuedBooks = dummyBooks.filter((b) => b.status === "borrowed");
  const availableBooks = totalBooks - issuedBooks.length;
  const totalReaders = dummyReaders.filter(
    (r) => r.status === "approved",
  ).length;
  const pendingRequests = dummyReaders.filter((r) => r.status === "pending");

  const stats = [
    {
      label: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Issued Books",
      value: issuedBooks.length,
      icon: ClipboardList,
      color: "text-warning bg-warning/10",
    },
    {
      label: "Available Books",
      value: availableBooks,
      icon: CheckCircle2,
      color: "text-success bg-success/10",
    },
    {
      label: "Pending Requests",
      value: pendingRequests.length,
      icon: Users,
      color: "text-info bg-info/10",
    },
    {
      label: "Total Readers",
      value: totalReaders,
      icon: UserCheck,
      color: "text-secondary bg-secondary/10",
    },
  ];

  const recentlyBorrowed = [...issuedBooks].slice(0, 5);
  const recentReaders = [...dummyReaders]
    .sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-1">
        Librarian Dashboard
      </h1>
      <p className="text-base-content/60 mb-6">NP Library ka overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="card bg-base-100 border border-base-300 shadow-sm"
          >
            <div className="card-body p-5">
              <div
                className={`w-11 h-11 rounded-field flex items-center justify-center ${color}`}
              >
                <Icon size={20} />
              </div>
              <p className="text-2xl font-semibold mt-3">{value}</p>
              <p className="text-sm text-base-content/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recently Borrowed Books */}
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">
                  Recently Borrowed Books
                </h2>
                <Link
                  href="/librarian/issued-books"
                  className="text-sm text-primary flex items-center gap-1 hover:underline"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {recentlyBorrowed.length === 0 ? (
                <p className="text-sm text-base-content/50 py-4 text-center">
                  Filhal koi book borrowed nahi hai.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentlyBorrowed.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between border-b border-base-300 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 bg-base-300 rounded-field flex items-center justify-center overflow-hidden">
                          {book.titlePage ? (
                            <img
                              src={book.titlePage}
                              alt={book.bookName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen
                              size={16}
                              className="text-base-content/30"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {book.bookName}
                          </p>
                          <p className="text-xs text-base-content/50">
                            {book.authorName} · {book.subject}
                          </p>
                        </div>
                      </div>
                      <span className="badge badge-warning badge-sm shrink-0">
                        {book.borrowedBy}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Readers List */}
          {/* <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body">
              <h2 className="font-display text-lg font-semibold mb-4">
                Readers
              </h2>

              <div className="flex flex-col gap-3">
                {recentReaders.map((reader) => (
                  <div
                    key={reader.id}
                    className="flex items-center justify-between border-b border-base-300 last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-full w-9">
                          <span className="text-xs font-medium">
                            {reader.fullName[0]?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {reader.fullName}
                        </p>
                        <p className="text-xs text-base-content/50 truncate">
                          {reader.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`badge badge-sm ${reader.status === "approved" ? "badge-success badge-outline" : "badge-warning"}`}
                      >
                        {reader.status === "approved" ? "Approved" : "Pending"}
                      </span>
                      <p className="text-xs text-base-content/40 mt-1">
                        {new Date(reader.registeredAt).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>

        {/* Right: side panel (1/3) — Pending Requests preview */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 border border-base-300 shadow-sm sticky top-20">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">
                  Pending Requests
                </h2>
                <Link
                  href="/librarian/requests"
                  className="text-sm text-primary flex items-center gap-1 hover:underline"
                >
                  View All
                </Link>
              </div>

              {pendingRequests.length === 0 ? (
                <p className="text-sm text-base-content/50 py-4 text-center">
                  Koi pending request nahi hai.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingRequests.slice(0, 4).map((reader) => (
                    <div
                      key={reader.id}
                      className="border border-base-300 rounded-field p-3"
                    >
                      <p className="font-medium text-sm truncate">
                        {reader.fullName}
                      </p>
                      <p className="text-xs text-base-content/50 truncate mb-2">
                        {reader.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-primary btn-xs flex-1">
                          Approve
                        </button>
                        <button className="btn btn-ghost btn-xs flex-1 border border-base-300">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
