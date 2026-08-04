"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { ViewMode, SortOption } from "@/lib/types";
import SubjectFilter from "./SubjectFilter";
import SortFilter from "./SortFilter";
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
    <div className="flex flex-col lg:flex-row gap-3 mb-6">
      <div className="flex items-center gap-2 flex-1 min-w-0 w-full border-2 border-base-300 rounded-lg px-3.5 py-2.5 bg-base-100 focus-within:border-primary transition-colors">
        <Search size={18} className="text-base-content/40 shrink-0" />
        <input
          type="text"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          placeholder="Book, author, ya library code se search karein..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <SubjectFilter
        subject={subject}
        onSubjectChange={onSubjectChange}
        subjects={subjects}
      />

      <SortFilter sort={sort} onSortChange={onSortChange} />

      <div className="join">
        <button
          className={`btn join-item ${view === "grid" ? "btn-primary" : "btn-ghost border border-base-300"}`}
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid size={16} /> Grid
        </button>
        <button
          className={`btn join-item ${view === "list" ? "btn-primary" : "btn-ghost border border-base-300"}`}
          onClick={() => onViewChange("list")}
        >
          <List size={16} /> List
        </button>
      </div>
    </div>
  );
}
