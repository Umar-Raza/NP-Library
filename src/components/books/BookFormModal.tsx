"use client";

import { useState, useEffect, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import { Book } from "@/lib/types";

export default function BookFormModal({
  open,
  onClose,
  onSave,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (
    book: Omit<Book, "id" | "addedAt" | "status" | "borrowedBy">,
  ) => void;
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
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setForm((prev) => ({ ...prev, titlePage: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-base-100 rounded-box shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 sticky top-0 bg-base-100 z-10">
          <h2 className="font-display text-lg font-semibold">
            {initialData ? "Edit Book" : "Add New Book"}
          </h2>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left: Title Page Upload — full height */}
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
                className="w-full h-40 sm:h-full min-h-[280px] rounded-2xl border-2 border-dashed border-base-300 hover:border-primary hover:bg-base-200/50 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden"
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
                    <span className="text-sm text-base-content/50 text-center px-2">
                      Title page
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right: All fields grouped together */}
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
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Book Link (Download URL)</span>
                </label>
                <input
                  type="text"
                  className="input border-2 border-base-300 rounded-lg focus:border-primary outline-none w-full"
                  value={form.bookLink}
                  onChange={(e) => handleChange("bookLink", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <button type="submit" className="btn btn-primary flex-1">
              {initialData ? "Save Changes" : "Add Book"}
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
