"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Pencil,
  Save,
  X,
  CheckCircle2,
  BookOpen,
  Users,
} from "lucide-react";
import { dummyLibrarian } from "@/lib/dummy-user";
import { dummyBooks } from "@/lib/dummy-books";
import { dummyReaders } from "@/lib/dummy-readers";

export default function LibrarianProfilePage() {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(dummyLibrarian.fullName);
  const [savedName, setSavedName] = useState(dummyLibrarian.fullName);

  const handleSave = () => {
    setSavedName(fullName);
    setEditing(false);
  };

  const handleCancel = () => {
    setFullName(savedName);
    setEditing(false);
  };

  const totalBooksManaged = dummyBooks.length;
  const totalReadersApproved = dummyReaders.filter(
    (r) => r.status === "approved",
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-base-content tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Manage your personal details and account status
        </p>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-secondary via-secondary/90 to-primary/60 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        </div>

        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-base-100 p-1.5 shadow-md">
                  <div className="w-full h-full rounded-xl bg-secondary text-secondary-content font-bold text-3xl sm:text-4xl flex items-center justify-center shadow-inner uppercase">
                    {savedName?.[0] || "L"}
                  </div>
                </div>
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 bg-success border-2 border-base-100 rounded-full"
                  title="Active Account"
                ></span>
              </div>

              <div className="mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-base-content flex items-center justify-center sm:justify-start gap-2">
                  {savedName}
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="badge badge-secondary badge-soft text-xs font-semibold gap-1 py-2 px-2.5">
                    <ShieldCheck size={12} /> Librarian
                  </span>
                  <span className="text-xs text-base-content/50 font-medium">
                    {dummyLibrarian.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm rounded-xl gap-1.5 text-base-content/70"
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5 shadow-sm"
                  >
                    <Save size={15} /> Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-outline btn-sm rounded-xl gap-1.5 border-base-300 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Pencil size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <div className="md:col-span-2 bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-base-200 pb-4">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Information
            </h3>
            {editing && (
              <span className="text-xs text-primary font-semibold animate-pulse">
                Editing Mode Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <User size={13} /> Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  className="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content">
                  {savedName}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <Mail size={13} /> Email Address
              </label>
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80 flex items-center justify-between">
                <span className="truncate">{dummyLibrarian.email}</span>
                <span className="text-[10px] font-bold uppercase bg-base-300 px-2 py-0.5 rounded-md text-base-content/60">
                  Verified
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <ShieldCheck size={13} /> Account Role
              </label>
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80 capitalize">
                {dummyLibrarian.role}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <Calendar size={13} /> Managing Since
              </label>
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80">
                {new Date(dummyLibrarian.joinedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Management Summary */}
        <div className="space-y-6">
          <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2 border-b border-base-200 pb-3">
              <ShieldCheck className="w-4 h-4 text-primary" /> Librarian Access
            </h3>

            <div className="p-4 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-success">
                  Full Admin Access
                </h4>
                <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
                  Books add/edit/delete, requests approve, aur issued books
                  manage karne ki full permission.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/60 border border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-base-content/60" />
                <span className="text-xs font-medium text-base-content/80">
                  Books Managed
                </span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {totalBooksManaged}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/60 border border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-base-content/60" />
                <span className="text-xs font-medium text-base-content/80">
                  Readers Approved
                </span>
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                {totalReadersApproved}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
