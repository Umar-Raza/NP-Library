"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

export default function SubjectFilter({
  subject,
  onSubjectChange,
  subjects,
}: {
  subject: string;
  onSubjectChange: (v: string) => void;
  subjects: string[];
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = subjects.filter((s) =>
    s.toLowerCase().includes(q.toLowerCase()),
  );

  const select = (val: string) => {
    onSubjectChange(val);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="relative w-full lg:w-72" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 border-2 border-base-300 rounded-lg px-3.5 py-2.5 bg-base-100 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
      >
        <span className={subject ? "" : "text-base-content"}>
          {subject || "All Subjects"}
        </span>
        <ChevronDown
          size={16}
          className={`text-base-content/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-base-300">
            <Search size={14} className="text-base-content/40 shrink-0" />
            <input
              autoFocus
              type="text"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm"
              placeholder="Search Subjects..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <ul className="max-h-56 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                onClick={() => select("")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-base-200 text-left"
              >
                All Subjects
                {!subject && <Check size={14} className="text-primary" />}
              </button>
            </li>
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => select(s)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-base-200 text-left cursor-pointer"
                >
                  <span className="truncate">{s}</span>
                  {subject === s && (
                    <Check size={14} className="text-primary shrink-0" />
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-base-content/40 text-center">
                No Subject Found!
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
