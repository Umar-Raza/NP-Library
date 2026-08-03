"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Users,
  UserCheck,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentlyBorrowed,
  DashboardStats,
} from "@/lib/api/dashboard";
import {
  getPendingReaders,
  approveReader,
  rejectReader,
  ReaderProfile,
} from "@/lib/api/readers";
import { Book } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";
export default function LibrarianDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Book[]>([]);
  const [pending, setPending] = useState<ReaderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const toast = useToast();
  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRecentlyBorrowed(5),
      getPendingReaders(),
    ])
      .then(([s, r, p]) => {
        setStats(s);
        setRecent(r);
        setPending(p);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      await approveReader(id);
      setPending((prev) => prev.filter((r) => r.id !== id));
      setStats(
        (s) =>
          s && {
            ...s,
            pendingRequests: s.pendingRequests - 1,
            totalReaders: s.totalReaders + 1,
          },
      );
      toast("Reader approved successfully.", "success");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Failed to approve reader.",
        "error",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject karein?")) return;
    setActionId(id);
    try {
      await rejectReader(id);
      setPending((prev) => prev.filter((r) => r.id !== id));
      setStats((s) => s && { ...s, pendingRequests: s.pendingRequests - 1 });
      toast("Reader rejected successfully.", "success");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Failed to reject reader.",
        "error",
      );
    } finally {
      setActionId(null);
    }
  };

  const statCards = [
    {
      label: "Total Books",
      value: stats?.totalBooks,
      icon: BookOpen,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Issued Books",
      value: stats?.issuedBooks,
      icon: ClipboardList,
      color: "text-warning bg-warning/10",
    },
    {
      label: "Available Books",
      value: stats?.availableBooks,
      icon: CheckCircle2,
      color: "text-success bg-success/10",
    },
    {
      label: "Pending Requests",
      value: stats?.pendingRequests,
      icon: Users,
      color: "text-info bg-info/10",
    },
    {
      label: "Total Readers",
      value: stats?.totalReaders,
      icon: UserCheck,
      color: "text-secondary bg-secondary/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-1">
        Librarian Dashboard
      </h1>
      <p className="text-base-content/60 mb-6">NP Library ka overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
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
              {loading ? (
                <div className="skeleton h-8 w-12 mt-3"></div>
              ) : (
                <p className="text-2xl font-semibold mt-3">{value}</p>
              )}
              <p className="text-sm text-base-content/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Borrowed */}
        <div className="lg:col-span-2">
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

              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-14 w-full"></div>
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <p className="text-sm text-base-content/50 py-4 text-center">
                  Filhal koi book borrowed nahi hai.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recent.map((book) => (
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
        </div>

        {/* Pending Requests preview */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 border border-base-300 shadow-sm lg:sticky lg:top-20">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">
                  Pending Requests
                </h2>
                <Link
                  href="/librarian/requests"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton h-20 w-full"></div>
                  ))}
                </div>
              ) : pending.length === 0 ? (
                <p className="text-sm text-base-content/50 py-4 text-center">
                  Koi pending request nahi hai.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pending.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="border border-base-300 rounded-field p-3"
                    >
                      <p className="font-medium text-sm truncate">
                        {r.fullName}
                      </p>
                      <p className="text-xs text-base-content/50 truncate mb-2">
                        {r.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-primary btn-xs flex-1 gap-1"
                          onClick={() => handleApprove(r.id)}
                          disabled={actionId === r.id}
                        >
                          {actionId === r.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <Check size={12} /> Approve
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-ghost btn-xs flex-1 border border-base-300"
                          onClick={() => handleReject(r.id)}
                          disabled={actionId === r.id}
                        >
                          <X size={12} /> Reject
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
