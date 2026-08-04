"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SortOption } from "@/lib/types";

const options: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-az", label: "Title A-Z" },
  { value: "title-za", label: "Title Z-A" },
];

export default function SortFilter({
  sort,
  onSortChange,
}: {
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current =
    options.find((o) => o.value === sort)?.label ?? "Newest First";

  const select = (val: SortOption) => {
    onSortChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full lg:w-44" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 border-2 border-base-300 rounded-lg px-3.5 py-2.5 bg-base-100 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
      >
        <span>{current}</span>
        <ChevronDown
          size={16}
          className={`text-base-content/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg overflow-hidden">
          <ul className="py-1">
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => select(o.value)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-base-200 text-left cursor-pointer"
                >
                  <span>{o.label}</span>
                  {sort === o.value && (
                    <Check size={14} className="text-primary shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
