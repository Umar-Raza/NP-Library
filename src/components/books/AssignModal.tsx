"use client";

import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { dummyReaders } from "@/lib/dummy-readers";

export default function AssignModal({
  open,
  bookName,
  onClose,
  onAssign,
}: {
  open: boolean;
  bookName: string;
  onClose: () => void;
  onAssign: (borrowerName: string) => void;
}) {
  const [mode, setMode] = useState<"registered" | "guest">("registered");
  const [selectedReader, setSelectedReader] = useState("");
  const [guestName, setGuestName] = useState("");

  const approvedReaders = dummyReaders.filter((r) => r.status === "approved");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("registered");
      setSelectedReader("");
      setGuestName("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = mode === "registered" ? selectedReader : guestName.trim();
    if (!name) return;
    onAssign(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-base-100 rounded-box shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h2 className="font-display text-lg font-semibold">Assign Book</h2>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-base-content/60">
            <span className="font-medium text-base-content">{bookName}</span>{" "}
            kisko de rahe hain?
          </p>

          {/* Mode toggle */}
          <div role="tablist" className="tabs tabs-boxed bg-base-200">
            <button
              type="button"
              role="tab"
              className={`tab ${mode === "registered" ? "tab-active" : ""}`}
              onClick={() => setMode("registered")}
            >
              Registered Reader
            </button>
            <button
              type="button"
              role="tab"
              className={`tab ${mode === "guest" ? "tab-active" : ""}`}
              onClick={() => setMode("guest")}
            >
              Naya Naam
            </button>
          </div>

          {mode === "registered" ? (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Reader select karein</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedReader}
                onChange={(e) => setSelectedReader(e.target.value)}
                required
              >
                <option value="">— Reader choose karein —</option>
                {approvedReaders.map((r) => (
                  <option key={r.id} value={r.fullName}>
                    {r.fullName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Person ka naam</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Jaise: Abdullah (non-registered)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button type="submit" className="btn btn-primary flex-1 gap-2">
              <UserPlus size={16} /> Assign
            </button>
            <button
              type="button"
              className="btn btn-ghost border border-base-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
