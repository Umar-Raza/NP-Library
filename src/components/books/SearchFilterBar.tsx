"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { ViewMode, SortOption } from "@/lib/types";

export default function SearchFilterBar({
  search,
  onSearchChange,
  subject,
  onSubjectChange,
  subjects,
  sort,
  onSortChange,
  view,
  onViewChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  subject: string;
  onSubjectChange: (v: string) => void;
  subjects: string[];
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-6 items-stretch lg:items-center">
      <label className="input input-bordered flex items-center gap-2 flex-1">
        <Search size={18} className="text-base-content/40" />
        <input
          type="text"
          className="grow"
          placeholder="Book, author, ya library code se search karein..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <select
        className="select select-bordered w-full lg:w-48"
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
      >
        <option value="">Sab Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full lg:w-44"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title-az">Title A-Z</option>
        <option value="title-za">Title Z-A</option>
      </select>

      <div className="join">
        <button
          className={`btn join-item btn-sm ${view === "grid" ? "btn-primary" : "btn-ghost border border-base-300"}`}
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid size={16} /> Grid
        </button>
        <button
          className={`btn join-item btn-sm ${view === "list" ? "btn-primary" : "btn-ghost border border-base-300"}`}
          onClick={() => onViewChange("list")}
        >
          <List size={16} /> List
        </button>
      </div>
    </div>
  );
}
