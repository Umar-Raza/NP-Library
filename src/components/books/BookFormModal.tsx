"use client";

import { useState, useEffect, useRef } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { Book } from "@/lib/types";
import { uploadTitlePage } from "@/lib/cloudinary";
import { addBook, updateBook, BookInput } from "@/lib/api/books";

export default function BookFormModal({
  open,
  onClose,
  onSaved,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (book: Book, isNew: boolean) => void;
  initialData?: Book | null;
}) {
  const [form, setForm] = useState({
    titlePage: "",
    bookName: "",
    authorName: "",
    subject: "",
    maktaba: "",
    libraryCode: "",
    bookLink: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        titlePage: initialData.titlePage,
        bookName: initialData.bookName,
        authorName: initialData.authorName,
        subject: initialData.subject,
        maktaba: initialData.maktaba,
        libraryCode: initialData.libraryCode,
        bookLink: initialData.bookLink,
      });
      setImagePreview(initialData.titlePage);
    } else {
      setForm({
        titlePage: "",
        bookName: "",
        authorName: "",
        subject: "",
        maktaba: "",
        libraryCode: "",
        bookLink: "",
      });
      setImagePreview("");
    }
    setImageFile(null);
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // local preview turant
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let titlePageUrl = form.titlePage;

      // Agar nayi image select hui hai → Cloudinary par upload
      if (imageFile) {
        setUploading(true);
        titlePageUrl = await uploadTitlePage(imageFile);
        setUploading(false);
      }

      const input: BookInput = {
        titlePage: titlePageUrl,
        bookName: form.bookName,
        authorName: form.authorName,
        subject: form.subject,
        maktaba: form.maktaba,
        libraryCode: form.libraryCode,
        bookLink: form.bookLink,
      };

      if (initialData) {
        const updated = await updateBook(initialData.id, input);
        onSaved(updated, false);
      } else {
        const created = await addBook(input);
        onSaved(created, true);
      }

      onClose();
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const busy = saving || uploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={busy ? undefined : onClose}
      />

      <div className="relative bg-base-100 rounded-box shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 sticky top-0 bg-base-100 z-10">
          <h2 className="font-display text-lg font-semibold">
            {initialData ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={onClose}
            disabled={busy}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="alert alert-error text-sm py-2 mb-4">{error}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left: Title Page Upload */}
            <div className="sm:w-40 shrink-0">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="w-full sm:w-40 h-40 sm:h-full min-h-[280px] rounded-2xl border-2 border-dashed border-base-300 hover:border-primary hover:bg-base-200/50 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden relative"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus size={26} className="text-base-content/40" />
                    <span className="text-xs text-base-content/50 text-center px-2">
                      Title page
                    </span>
                  </>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={28} />
                  </div>
                )}
              </button>
            </div>

            {/* Right: Fields */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Book Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Book name"
                  className="input w-full border-2 border-base-300 rounded-lg focus:border-primary outline-none"
                  value={form.bookName}
                  onChange={(e) => handleChange("bookName", e.target.value)}
                  disabled={busy}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Author Name <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Author name"
                    className="input border-2 border-base-300 rounded-lg focus:border-primary outline-none w-full"
                    value={form.authorName}
                    onChange={(e) => handleChange("authorName", e.target.value)}
                    disabled={busy}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Subject <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Subject"
                    className="input border-2 border-base-300 rounded-lg focus:border-primary outline-none w-full"
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Maktaba <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Maktaba"
                    className="input border-2 border-base-300 rounded-lg focus:border-primary outline-none w-full"
                    value={form.maktaba}
                    onChange={(e) => handleChange("maktaba", e.target.value)}
                    disabled={busy}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Library Code <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Library code"
                    className="input border-2 border-base-300 rounded-lg focus:border-primary outline-none w-full"
                    value={form.libraryCode}
                    onChange={(e) =>
                      handleChange("libraryCode", e.target.value)
                    }
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Book Link (Download URL)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="input border-2 border-base-300 rounded-lg focus:border-primary outline-none w-full"
                  value={form.bookLink}
                  onChange={(e) => handleChange("bookLink", e.target.value)}
                  disabled={busy}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={busy}
            >
              {busy ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {uploading ? "Uploading image..." : "Saving..."}
                </>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Add Book"
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost border border-base-300"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
