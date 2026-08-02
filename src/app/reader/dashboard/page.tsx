"use client";

import { useState, useMemo } from "react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import BooksSkeleton from "@/components/books/BooksSkeleton";
import { useInfiniteBooks } from "@/hooks/useInfiniteBooks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ViewMode } from "@/lib/types";

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
  } = useInfiniteBooks();

  const [view, setView] = useState<ViewMode>("grid");
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  const subjects = useMemo(
    () => [...new Set(books.map((b) => b.subject))],
    [books],
  );

  // Favorites — filhal local (Supabase favorites baad mein connect honge)
  const handleToggleFavorite = (id: string) => {
    // TODO: Supabase favorites connect hone par yahan real call
    console.log("toggle favorite:", id);
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
                  actions={
                    book.status === "available" ? (
                      <button className="btn btn-primary btn-sm">Borrow</button>
                    ) : null
                  }
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
                  actions={
                    book.status === "available" ? (
                      <button className="btn btn-primary btn-sm">Borrow</button>
                    ) : null
                  }
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
