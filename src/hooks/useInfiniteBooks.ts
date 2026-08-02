"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBooks } from "@/lib/api/books";
import { Book, SortOption } from "@/lib/types";

export function useInfiniteBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true); // pehli load (skeleton)
  const [loadingMore, setLoadingMore] = useState(false); // scroll par agli load
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  // Debounced search (400ms baad hi query chalti hai)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const pageRef = useRef(0);

  // Jab bhi filter/search/sort badle → list reset, page 0 se dobara
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    pageRef.current = 0;

    getBooks({ page: 0, search: debouncedSearch, subject, sort })
      .then((res) => {
        if (cancelled) return;
        setBooks(res.books);
        setHasMore(res.hasMore);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, subject, sort]);

  // Scroll par agli 6 load
  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const res = await getBooks({
        page: nextPage,
        search: debouncedSearch,
        subject,
        sort,
      });
      setBooks((prev) => [...prev, ...res.books]);
      setHasMore(res.hasMore);
      pageRef.current = nextPage;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aur books load nahi ho saki.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, hasMore, debouncedSearch, subject, sort]);

  // Local list update helpers (delete/edit/add ke baad refetch se bachne ke liye)
  const updateLocalBook = useCallback((updated: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const removeLocalBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const prependLocalBook = useCallback((book: Book) => {
    setBooks((prev) => [book, ...prev]);
  }, []);

  return {
    books,
    loading,
    loadingMore,
    hasMore,
    error,
    search,
    setSearch,
    subject,
    setSubject,
    sort,
    setSort,
    loadMore,
    updateLocalBook,
    removeLocalBook,
    prependLocalBook,
  };
}
