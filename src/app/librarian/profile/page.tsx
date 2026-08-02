"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Pencil,
  Save,
  X,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { getMyProfile, updateMyProfile } from "@/lib/api/auth";
import { uploadTitlePage } from "@/lib/cloudinary";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";

export default function LibrarianProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p) {
        setProfile(p);
        setFullName(p.full_name);
        setSavedName(p.full_name);
        setAvatarUrl((p as any).avatar_url || "");
      }
      setLoading(false);
    });
  }, []);

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Naam khali nahi ho sakta.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        newAvatarUrl = await uploadTitlePage(avatarFile);
      }
      await updateMyProfile(fullName.trim(), newAvatarUrl);
      setSavedName(fullName.trim());
      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      setAvatarPreview("");
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save fail.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(savedName);
    setAvatarFile(null);
    setAvatarPreview("");
    setEditing(false);
    setError("");
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile)
    return (
      <p className="text-center text-error py-20">Profile load nahi ho saka.</p>
    );

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Manage your personal details and account status
        </p>
      </div>

      <div className="bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-secondary via-secondary/90 to-primary/60 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        </div>

        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-base-100 p-1.5 shadow-md">
                  <div className="w-full h-full rounded-xl bg-secondary text-secondary-content font-bold text-3xl sm:text-4xl flex items-center justify-center uppercase overflow-hidden">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      savedName?.[0] || "L"
                    )}
                  </div>
                </div>

                {editing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      className="hidden"
                      onChange={handleAvatarPick}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 btn btn-primary btn-circle btn-sm shadow-md"
                      title="Change photo"
                    >
                      <Camera size={14} />
                    </button>
                  </>
                )}

                {!editing && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-success border-2 border-base-100 rounded-full"></span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
                  {savedName}
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="badge badge-secondary badge-soft text-xs font-semibold  gap-1 py-2 px-2.5">
                    <ShieldCheck size={12} /> Librarian
                  </span>
                  <span className="text-xs text-base-content/50 font-medium">
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm rounded-xl gap-1.5"
                    disabled={saving}
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <Save size={15} /> Save
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-outline btn-sm rounded-xl gap-1.5 border-base-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Personal Information
          </h3>
          {editing && (
            <span className="text-xs text-primary font-semibold animate-pulse">
              Editing Mode Active
            </span>
          )}
        </div>

        {error && <div className="alert alert-error text-sm py-2">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
              <User size={13} /> Full Name
            </label>
            {editing ? (
              <input
                type="text"
                className="input w-full border-2 border-base-300 rounded-xl focus:border-primary outline-none text-sm font-medium"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium">
                {savedName}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
              <Mail size={13} /> Email Address
            </label>
            <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80 truncate">
              {profile.email}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
              <ShieldCheck size={13} /> WhatsApp
            </label>
            <div className="p-3.5 bg-base-200/50 rounded-2xl border border-base-200/80 text-sm font-medium text-base-content/80">
              {profile.whatsapp || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Librarian Access card */}
      <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold flex items-center gap-2 border-b border-base-200 pb-3 mb-4">
          <ShieldCheck className="w-4 h-4 text-primary" /> Librarian Access
        </h3>
        <div className="p-4 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-success">
              Full Admin Access
            </h4>
            <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
              Books add/edit/delete, requests approve, aur issued books manage
              karne ki full permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
