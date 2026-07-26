"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import IssuedBookRow from "@/components/books/IssuedBookRow";
import { dummyBooks } from "@/lib/dummy-books";
import { Book } from "@/lib/types";

export default function LibrarianIssuedBooksPage() {
  const [books, setBooks] = useState<Book[]>(dummyBooks);
  const [search, setSearch] = useState("");

  const issued = useMemo(
    () => books.filter((b) => b.status === "borrowed"),
    [books],
  );

  const filtered = useMemo(() => {
    return issued.filter(
      (b) =>
        b.bookName.toLowerCase().includes(search.toLowerCase()) ||
        (b.borrowedBy?.toLowerCase().includes(search.toLowerCase()) ?? false),
    );
  }, [issued, search]);

  const handleReturn = (id: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "available",
              borrowedBy: undefined,
              borrowChain: [],
            }
          : b,
      ),
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Issued Books</h1>

      <label className="input input-bordered flex items-center gap-2 mb-6 max-w-md">
        <Search size={18} className="text-base-content/40" />
        <input
          type="text"
          className="grow"
          placeholder="Book ya borrower ka naam search karein..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      <div className="flex flex-col gap-3">
        {filtered.map((book, i) => (
          <IssuedBookRow
            key={book.id}
            book={book}
            index={i + 1}
            actions={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleReturn(book.id)}
              >
                Return
              </button>
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-base-content/50 py-10">
          Filhal koi book issue nahi hai.
        </p>
      )}
    </div>
  );
}
