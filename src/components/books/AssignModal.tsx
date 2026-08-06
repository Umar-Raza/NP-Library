"use client";

import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { getApprovedReaders, ReaderOption } from "@/lib/api/readers";

export default function AssignModal({
  open,
  bookName,
  onClose,
  onAssign,
}: {
  open: boolean;
  bookName: string;
  onClose: () => void;
  onAssign: (borrowerName: string, borrowerId?: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<"registered" | "guest">("registered");
  const [readers, setReaders] = useState<ReaderOption[]>([]);
  const [selectedReaderId, setSelectedReaderId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setMode("registered");
      setSelectedReaderId("");
      setGuestName("");
      setError("");
      getApprovedReaders().then(setReaders);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let name = "";
    let id: string | undefined;

    if (mode === "registered") {
      const reader = readers.find((r) => r.id === selectedReaderId);
      if (!reader) {
        setError("Please select a valid reader.");
        return;
      }
      name = reader.fullName;
      id = reader.id;
    } else {
      if (!guestName.trim()) {
        setError("Please enter a name.");
        return;
      }
      name = guestName.trim();
      id = undefined;
    }

    setSaving(true);
    try {
      await onAssign(name, id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to assign the book.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={saving ? undefined : onClose}
      />

      <div className="relative bg-base-100 rounded-box shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h2 className="font-display text-lg font-semibold">Assign Book</h2>
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={onClose}
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-base-content/60">
            <span className="font-medium text-base-content">{bookName}</span>{" "}
            Who are you assigning this book to?
          </p>

          {error && (
            <div className="alert alert-error text-sm py-2">{error}</div>
          )}

          {/* Mode toggle — segmented */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-base-200 rounded-xl">
            <button
              type="button"
              className={`py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                mode === "registered"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
              onClick={() => setMode("registered")}
            >
              Registered Reader
            </button>
            <button
              type="button"
              className={`py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                mode === "guest"
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
              onClick={() => setMode("guest")}
            >
              New Name
            </button>
          </div>

          {mode === "registered" ? (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Please select a reader.</span>
              </label>
              <select
                className="select w-full cursor-pointer border-2 border-base-300 rounded-lg focus:border-primary outline-none"
                value={selectedReaderId}
                onChange={(e) => setSelectedReaderId(e.target.value)}
              >
                <option value="">— Please select a reader —</option>
                {readers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Reader name</span>
              </label>
              <input
                type="text"
                className="input w-full border-2 border-base-300 rounded-lg focus:border-primary outline-none"
                placeholder="Jaise: Abdullah (non-registered)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <UserPlus size={16} /> Assign
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost border border-base-300"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
