"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RotateCcw } from "lucide-react";
import IssuedBookRow from "@/components/books/IssuedBookRow";
import { getIssuedBooks, returnBook } from "@/lib/api/books";
import { Book } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";
export default function LibrarianIssuedBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [returningId, setReturningId] = useState<string | null>(null);
  const toast = useToast();
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setLoading(true);
    getIssuedBooks(debounced)
      .then(setBooks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReturn = async (book: Book) => {
    setReturningId(book.id);
    try {
      await returnBook(book.id);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      toast("Book returned successfully.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to return book.", "error");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Issued Books</h1>

      <div className="flex items-center gap-2 mb-6 max-w-md border-2 border-base-300 rounded-lg px-3.5 py-2.5 bg-base-100 focus-within:border-primary transition-colors">
        <Search size={18} className="text-base-content/40 shrink-0" />
        <input
          type="text"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          placeholder="Book ya borrower ka naam search karein..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-box"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-error py-20">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          Filhal koi book issue nahi hai.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {books.map((book, i) => (
            <IssuedBookRow
              key={book.id}
              book={book}
              index={i + 1}
              actions={
                <button
                  className="btn btn-ghost text-error btn-sm border border-base-300 gap-1 hover:bg-error/10"
                  onClick={() => handleReturn(book)}
                  disabled={returningId === book.id}
                >
                  {returningId === book.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <RotateCcw size={14} />
                      <span className="hidden sm:inline">Return</span>
                    </>
                  )}
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
