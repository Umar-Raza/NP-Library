"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBooks } from "@/lib/api/books";
import { getMyProfile } from "@/lib/api/auth";
import { Book, SortOption } from "@/lib/types";

export function useInfiniteBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullName: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const pageRef = useRef(0);

  // Current user fetch
  useEffect(() => {
    getMyProfile().then((p) => {
      if (p) setCurrentUser({ id: p.id, fullName: p.full_name });
      setUserReady(true);
    });
  }, []);

  // Books fetch
  useEffect(() => {
    let cancelled = false;
    setBooksLoading(true);
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
        if (!cancelled) setBooksLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, subject, sort]);

  // Scroll par agli 6
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
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
      setError(e instanceof Error ? e.message : "Could not load more books.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, debouncedSearch, subject, sort]);

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
    // Dono ready hone tak loading true — ek hi skeleton, koi flash nahi
    loading: booksLoading || !userReady,
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
    currentUser,
  };
}
