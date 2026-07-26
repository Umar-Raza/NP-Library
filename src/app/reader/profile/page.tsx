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
  Award,
} from "lucide-react";
import { dummyUser } from "@/lib/dummy-user";

export default function ReaderProfilePage() {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(dummyUser.fullName);
  const [savedName, setSavedName] = useState(dummyUser.fullName);

  const handleSave = () => {
    setSavedName(fullName);
    setEditing(false);
  };

  const handleCancel = () => {
    setFullName(savedName);
    setEditing(false);
  };

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
      <div className="bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
        {/* Cover Banner Gradient */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-primary/80 via-primary to-secondary/80 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        </div>

        {/* User Info Header */}
        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-base-100 p-1.5 shadow-md">
                  <div className="w-full h-full rounded-xl bg-primary text-primary-content font-bold text-3xl sm:text-4xl flex items-center justify-center shadow-inner uppercase">
                    {savedName?.[0] || "U"}
                  </div>
                </div>
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 bg-success border-2 border-base-100 rounded-full"
                  title="Active Account"
                ></span>
              </div>

              {/* Title & Badges */}
              <div className="mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-base-content flex items-center justify-center sm:justify-start gap-2">
                  {savedName}
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="badge badge-success badge-soft text-xs font-semibold gap-1 py-2 px-2.5">
                    <ShieldCheck size={12} /> Approved Reader
                  </span>
                  <span className="text-xs text-base-content/50 font-medium">
                    {dummyUser.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit / Action Buttons */}
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

      {/* Grid Section: Personal Information & Membership Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details (Spans 2 cols on md+) */}
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
            {/* Full Name */}
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

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <Mail size={13} /> Email Address
              </label>
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80 flex items-center justify-between">
                <span className="truncate">{dummyUser.email}</span>
                <span className="text-[10px] font-bold uppercase bg-base-300 px-2 py-0.5 rounded-md text-base-content/60">
                  Verified
                </span>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <ShieldCheck size={13} /> Account Role
              </label>
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80 capitalize flex items-center gap-2">
                <span>{dummyUser.role}</span>
              </div>
            </div>

            {/* Member Since */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                <Calendar size={13} /> Member Since
              </label>
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80">
                {new Date(dummyUser.joinedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary / Membership Status Sidebar Card */}
        <div className="space-y-6">
          <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2 border-b border-base-200 pb-3">
              <Award className="w-4 h-4 text-primary" /> Membership Status
            </h3>

            <div className="p-4 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-success">
                  Approved Account
                </h4>
                <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
                  You have full access to browse and borrow books from NP
                  Library.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/60 border border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-base-content/60" />
                <span className="text-xs font-medium text-base-content/80">
                  Access Level
                </span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Reader
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
