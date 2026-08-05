"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import BookLogGroup from "@/components/librarian/BookLogGroup";
import { getBooksLog, BookChain } from "@/lib/api/books";

export default function BooksLogsPage() {
  const [groups, setGroups] = useState<BookChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setLoading(true);
    getBooksLog(debounced)
      .then(setGroups)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Books Log</h1>

      <div className="flex items-center gap-2 mb-6 max-w-md border-2 border-base-300 rounded-lg px-3.5 py-2.5 bg-base-100 focus-within:border-primary transition-colors">
        <Search size={18} className="text-base-content/40 shrink-0" />
        <input
          type="text"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          placeholder="Search book name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-box"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-error py-20">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          {debounced
            ? "Ye book ka log nahi mila."
            : "Filhal koi book issue nahi hai."}
        </p>
      ) : (
        groups.map((group) => <BookLogGroup key={group.bookId} group={group} />)
      )}
    </div>
  );
}
