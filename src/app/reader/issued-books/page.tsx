"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import IssuedBookRow from "@/components/books/IssuedBookRow";
import { getIssuedBooks } from "@/lib/api/books";
import { Book } from "@/lib/types";

export default function ReaderIssuedBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError("");
    setPage(0);
    getIssuedBooks({ page: 0, pageSize: 10, search: debounced })
      .then((res) => {
        setBooks(res.books);
        setHasMore(res.hasMore);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await getIssuedBooks({
        page: nextPage,
        pageSize: 10,
        search: debounced,
      });
      setBooks((prev) => [...prev, ...res.books]);
      setPage(nextPage);
      setHasMore(res.hasMore);
    } catch (e) {
      // Keep existing books
    } finally {
      setLoadingMore(false);
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
        <>
          <div className="flex flex-col gap-3">
            {books.map((book, i) => (
              <IssuedBookRow key={book.id} book={book} index={i + 1} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                className="btn btn-sm btn-primary gap-2"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
