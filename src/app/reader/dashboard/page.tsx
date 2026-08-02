"use client";

import { useState, useMemo } from "react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import BooksSkeleton from "@/components/books/BooksSkeleton";
import { useInfiniteBooks } from "@/hooks/useInfiniteBooks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { borrowBook } from "@/lib/api/books";
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

  const [view, setView] = useState<ViewMode>("grid");
  const [borrowingId, setBorrowingId] = useState<string | null>(null);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  const subjects = useMemo(
    () => [...new Set(books.map((b) => b.subject))],
    [books],
  );

  const handleToggleFavorite = (id: string) => {
    console.log("toggle favorite:", id); // Supabase favorites baad mein
  };

  const handleBorrow = async (book: Book) => {
    console.log("BORROW CLICKED:", book.bookName, "user:", currentUser); // ← ye add karein

    if (!currentUser) return;
    setBorrowingId(book.id);
    try {
      await borrowBook(book.id, currentUser.fullName, currentUser.id);
      // Local update — book ab mere naam par
      updateLocalBook({
        ...book,
        status: "borrowed",
        borrowedBy: currentUser.fullName,
        borrowedById: currentUser.id,
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Borrow fail ho gaya.");
    } finally {
      setBorrowingId(null);
    }
  };

  // Borrow button banane wali logic (disable rules)
  const renderBorrowAction = (book: Book) => {
    const isCurrentHolder =
      book.borrowedById && currentUser && book.borrowedById === currentUser.id;
    if (isCurrentHolder) {
      // Main current holder hoon → disabled, mera naam
      return (
        <button className="btn btn-sm btn-disabled" disabled>
          Aap ke paas
        </button>
      );
    }

    // Available ya kisi aur ke paas → borrow kar sakta hoon
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

      {loading ? (
        <BooksSkeleton view={view} count={6} />
      ) : error ? (
        <p className="text-center text-error py-20">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          Koi book nahi mili.
        </p>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={i + 1}
                  showDownload={true}
                  onToggleFavorite={handleToggleFavorite}
                  actions={renderBorrowAction(book)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {books.map((book, i) => (
                <BookRow
                  key={book.id}
                  book={book}
                  index={i + 1}
                  showDownload={true}
                  onToggleFavorite={handleToggleFavorite}
                  actions={renderBorrowAction(book)}
                />
              ))}
            </div>
          )}

          {hasMore && (
            <div ref={sentinelRef} className="pt-4">
              {loadingMore && <BooksSkeleton view={view} count={3} />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
