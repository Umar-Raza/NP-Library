"use client";

import { useState } from "react";
import { Search, Check, X } from "lucide-react";
import { dummyReaders, Reader } from "@/lib/dummy-readers";

type Tab = "requests" | "readers";

export default function RequestsPage() {
  const [readers, setReaders] = useState<Reader[]>(dummyReaders);
  const [tab, setTab] = useState<Tab>("requests");
  const [search, setSearch] = useState("");

  const pending = readers.filter((r) => r.status === "pending");
  const approved = readers.filter((r) => r.status === "approved");

  const handleApprove = (id: string) => {
    setReaders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
  };

  const handleReject = (id: string) => {
    if (confirm("Kya aap ye request reject karna chahte hain?")) {
      setReaders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filteredApproved = approved.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Requests</h1>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed w-fit mb-6 bg-base-200">
        <button
          role="tab"
          className={`tab ${tab === "requests" ? "tab-active font-semibold" : ""}`}
          onClick={() => setTab("requests")}
        >
          Requests{" "}
          {pending.length > 0 && (
            <span className="badge badge-primary px-1.5 py-1 badge-sm ml-2">
              {pending.length}
            </span>
          )}
        </button>
        <button
          role="tab"
          className={`tab ${tab === "readers" ? "tab-active font-semibold" : ""}`}
          onClick={() => setTab("readers")}
        >
          Readers
        </button>
      </div>

      {/* Requests Tab */}
      {tab === "requests" && (
        <div className="flex flex-col gap-3">
          {pending.length === 0 ? (
            <p className="text-center text-base-content/50 py-10">
              Koi pending request nahi hai.
            </p>
          ) : (
            pending.map((reader) => (
              <div
                key={reader.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-base-100 border border-base-300 rounded-box px-4 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content rounded-full w-10">
                      <span className="text-sm font-medium">
                        {reader.fullName[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{reader.fullName}</p>
                    <p className="text-sm text-base-content/50 truncate">
                      {reader.email}
                    </p>
                    <p className="text-xs text-base-content/40">
                      {new Date(reader.registeredAt).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}{" "}
                      ko request ki
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="btn btn-primary btn-sm gap-1"
                    onClick={() => handleApprove(reader.id)}
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    className="btn btn-ghost btn-sm gap-1 border border-base-300 text-error"
                    onClick={() => handleReject(reader.id)}
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Readers Tab */}
      {tab === "readers" && (
        <div>
          <label className="input input-bordered flex items-center gap-2 mb-6 max-w-md">
            <Search size={18} className="text-base-content/40" />
            <input
              type="text"
              className="grow"
              placeholder="Reader ka naam ya email search karein..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="flex flex-col gap-3">
            {filteredApproved.map((reader) => (
              <div
                key={reader.id}
                className="flex items-center justify-between gap-3 bg-base-100 border border-base-300 rounded-box px-4 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content rounded-full w-10">
                      <span className="text-sm font-medium">
                        {reader.fullName[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{reader.fullName}</p>
                    <p className="text-sm text-base-content/50 truncate">
                      {reader.email}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="badge badge-success badge-outline badge-sm">
                    Approved
                  </span>
                  <p className="text-xs text-base-content/40 mt-1">
                    Member since{" "}
                    {new Date(reader.registeredAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {filteredApproved.length === 0 && (
              <p className="text-center text-base-content/50 py-10">
                Koi reader nahi mila.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
