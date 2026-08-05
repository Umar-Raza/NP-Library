"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Check, X, Mail, Phone, Calendar, Ban } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import {
  getPendingReaders,
  getApprovedReaderProfiles,
  approveReader,
  rejectReader,
  revokeReader,
  ReaderProfile,
} from "@/lib/api/readers";

type Tab = "requests" | "readers";

export default function RequestsPage() {
  const [tab, setTab] = useState<Tab>("requests");

  const [pending, setPending] = useState<ReaderProfile[]>([]);
  const [approved, setApproved] = useState<ReaderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getPendingReaders(), getApprovedReaderProfiles()])
      .then(([p, a]) => {
        setPending(p);
        setApproved(a);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      await approveReader(id);
      const reader = pending.find((r) => r.id === id);
      setPending((prev) => prev.filter((r) => r.id !== id));
      if (reader)
        setApproved((prev) => [{ ...reader, status: "approved" }, ...prev]);
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
    if (!confirm("Kya aap ye request reject karna chahte hain?")) return;
    setActionId(id);
    try {
      await rejectReader(id);
      setPending((prev) => prev.filter((r) => r.id !== id));
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

  // revoke access
  const handleRevoke = async (id: string) => {
    if (
      !confirm(
        "Is reader ka access revoke karna chahte hain? Wo dobara pending ho jayega.",
      )
    )
      return;
    setActionId(id);
    try {
      await revokeReader(id);
      const reader = approved.find((r) => r.id === id);
      setApproved((prev) => prev.filter((r) => r.id !== id));
      if (reader)
        setPending((prev) => [{ ...reader, status: "pending" }, ...prev]);
      toast("Reader revoked successfully.", "success");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Failed to revoke reader.",
        "error",
      );
    } finally {
      setActionId(null);
    }
  };

  const filteredApproved = approved.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Requests</h1>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-base-100 rounded-xl w-full max-w-xs mb-6 ">
        <button
          className={`py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            tab === "requests"
              ? "bg-primary text-primary-content shadow-sm"
              : "text-base-content/60"
          }`}
          onClick={() => setTab("requests")}
        >
          Requests
          {pending.length > 0 && (
            <span className="badge badge-neutral px-2 py-1 rounded">
              {pending.length}
            </span>
          )}
        </button>
        <button
          className={`py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "readers"
              ? "bg-primary text-primary-content shadow-sm"
              : "text-base-content/60"
          }`}
          onClick={() => setTab("readers")}
        >
          Readers
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-box"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-error py-20">{error}</p>
      ) : tab === "requests" ? (
        // ===== Requests tab =====
        pending.length === 0 ? (
          <p className="text-center text-base-content/50 py-10">
            No pending requests.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-base-100 border border-base-300 rounded-box px-4 py-3.5"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate">{r.fullName}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-base-content/50">
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      <a
                        href={`mailto:${r.email}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {r.email}
                      </a>
                    </span>
                    {r.whatsapp && (
                      <a
                        href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Phone size={12} /> {r.whatsapp}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {fmtDate(r.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="btn btn-primary btn-sm gap-1"
                    onClick={() => handleApprove(r.id)}
                    disabled={actionId === r.id}
                  >
                    {actionId === r.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <Check size={14} /> Approve
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm gap-1 border border-base-300 text-error hover:bg-error/10"
                    onClick={() => handleReject(r.id)}
                    disabled={actionId === r.id}
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // ===== Readers tab =====
        <div>
          <div className="flex items-center gap-2 mb-6 max-w-md border-2 border-base-300 rounded-lg px-3.5 py-2.5 bg-base-100 focus-within:border-primary transition-colors">
            <Search size={18} className="text-base-content/40 shrink-0" />
            <input
              type="text"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm"
              placeholder="Search reader's name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredApproved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 opacity-50"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-sm font-medium">
                {search
                  ? "No readers match your search"
                  : "No approved readers yet"}
              </p>
              {search && (
                <p className="text-xs mt-1">Try a different name or email</p>
              )}
            </div>
          ) : (
            filteredApproved.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 bg-base-100 border border-base-300 rounded-box px-4 py-3.5"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate">{r.fullName}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-base-content/50">
                    <a
                      href={`mailto:${r.email}`}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Mail size={12} /> {r.email}
                    </a>
                    {r.whatsapp && (
                      <a
                        href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Phone size={12} /> {r.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="badge badge-success badge-outline badge-sm">
                      Approved
                    </span>
                    <p className="text-xs text-base-content/40 mt-1">
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm gap-1 border border-error/30 text-error hover:bg-error/10"
                    onClick={() => handleRevoke(r.id)}
                    disabled={actionId === r.id}
                  >
                    {actionId === r.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <Ban size={14} />{" "}
                        <span className="hidden sm:inline">Revoke</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
