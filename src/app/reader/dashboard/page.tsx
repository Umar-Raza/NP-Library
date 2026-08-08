"use client";

import { useState, useMemo, useEffect } from "react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import BooksSkeleton from "@/components/books/BooksSkeleton";
import { useInfiniteBooks } from "@/hooks/useInfiniteBooks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { borrowBook } from "@/lib/api/books";
import { getMyFavoriteIds, toggleFavorite } from "@/lib/api/favorites";
import { useToast } from "@/components/ui/ToastProvider";
import { Book, ViewMode } from "@/lib/types";

export default function ReaderDashboardPage() {
  const {
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
    currentUser,
  } = useInfiniteBooks();

  const toast = useToast();
  const [view, setView] = useState<ViewMode>("grid");
  const [borrowingId, setBorrowingId] = useState<string | null>(null);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [favLoading, setFavLoading] = useState(true);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  const subjects = useMemo(
    () => [...new Set(books.map((b) => b.subject))],
    [books],
  );

  useEffect(() => {
    getMyFavoriteIds()
      .then(setFavIds)
      .finally(() => setFavLoading(false));
  }, []);

  // Sirf books loading ka wait — ek hi skeleton
  const allReady = !loading && !favLoading;
  // Actions alag track — button/star skeleton ke liye
  const actionsLoading = false;

  const handleToggleFavorite = async (id: string) => {
    const isFav = favIds.has(id);
    if (!isFav && favIds.size >= 25) {
      toast("You can favorite a maximum of 25 books.", "warning");
      return;
    }
    setFavIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      await toggleFavorite(id, isFav);
    } catch (e) {
      setFavIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(id) : next.delete(id);
        return next;
      });
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  const handleBorrow = async (book: Book) => {
    if (!currentUser) return;
    setBorrowingId(book.id);
    try {
      await borrowBook(book.id, currentUser.fullName, currentUser.id);
      updateLocalBook({
        ...book,
        status: "borrowed",
        borrowedBy: currentUser.fullName,
        borrowedById: currentUser.id,
      });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Borrow failed.", "error");
    } finally {
      setBorrowingId(null);
    }
  };

  const renderBorrowAction = (book: Book) => {
    const isCurrentHolder =
      book.borrowedById && currentUser && book.borrowedById === currentUser.id;

    if (isCurrentHolder) {
      return (
        <button className="btn btn-sm btn-disabled" disabled>
          You Have It
        </button>
      );
    }

    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => handleBorrow(book)}
        disabled={borrowingId === book.id}
      >
        {borrowingId === book.id ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : book.status === "borrowed" ? (
          `Borrow (${book.borrowedBy})`
        ) : (
          "Borrow"
        )}
      </button>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Books</h1>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        subject={subject}
        onSubjectChange={setSubject}
        subjects={subjects}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />

      {!allReady ? (
        <BooksSkeleton view={view} count={6} />
      ) : error ? (
        <p className="text-center text-error py-20">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          No books found.
        </p>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={{
                    ...book,
                    isFavorite: favLoading ? undefined : favIds.has(book.id),
                  }}
                  index={i + 1}
                  showDownload={true}
                  onToggleFavorite={handleToggleFavorite}
                  actionsLoading={actionsLoading}
                  actions={renderBorrowAction(book)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {books.map((book, i) => (
                <BookRow
                  key={book.id}
                  book={{
                    ...book,
                    isFavorite: favLoading ? undefined : favIds.has(book.id),
                  }}
                  index={i + 1}
                  showDownload={true}
                  onToggleFavorite={handleToggleFavorite}
                  actionsLoading={actionsLoading}
                  actions={renderBorrowAction(book)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Sentinel — hamesha DOM mein */}
      <div ref={sentinelRef} className="pt-4">
        {loadingMore && <BooksSkeleton view={view} count={3} />}
      </div>
    </div>
  );
}
