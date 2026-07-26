"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import BookLogGroup from "@/components/librarian/BookLogGroup";
import { dummyBooks } from "@/lib/dummy-books";

export default function BooksLogsPage() {
  const [search, setSearch] = useState("");

  const booksWithChain = useMemo(() => {
    return dummyBooks
      .filter((b) => (b.borrowChain?.length ?? 0) > 0)
      .filter((b) => b.bookName.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Books Log</h1>

      <label className="input input-bordered flex items-center gap-2 mb-6 max-w-md">
        <Search size={18} className="text-base-content/40" />
        <input
          type="text"
          className="grow"
          placeholder="Book ka naam search karein..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {booksWithChain.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          {search
            ? "Ye book ka log nahi mila."
            : "Filhal koi book chain mein nahi hai."}
        </p>
      ) : (
        booksWithChain.map((book) => <BookLogGroup key={book.id} book={book} />)
      )}
    </div>
  );
}
