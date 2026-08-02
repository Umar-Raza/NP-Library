"use client";

import { useState, useMemo, useEffect } from "react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import { getBooks } from "@/lib/api/books";
import { Book, ViewMode, SortOption } from "@/lib/types";

export default function ReaderDashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const subjects = useMemo(
    () => [...new Set(books.map((b) => b.subject))],
    [books],
  );

  const toggleFavorite = (id: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)),
    );
  };

  const filtered = useMemo(() => {
    let result = books.filter((b) => {
      const matchesSearch =
        b.bookName.toLowerCase().includes(search.toLowerCase()) ||
        b.authorName.toLowerCase().includes(search.toLowerCase()) ||
        b.libraryCode.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subject ? b.subject === subject : true;
      return matchesSearch && matchesSubject;
    });

    result = [...result].sort((a, b) => {
      if (sort === "newest")
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      if (sort === "oldest")
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      if (sort === "title-az") return a.bookName.localeCompare(b.bookName);
      if (sort === "title-za") return b.bookName.localeCompare(a.bookName);
      return 0;
    });

    return result;
  }, [books, search, subject, sort]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-error py-20">{error}</p>;
  }

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

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book, i) => (
            <BookCard
              key={book.id}
              book={book}
              index={i + 1}
              onToggleFavorite={toggleFavorite}
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
          {filtered.map((book, i) => (
            <BookRow
              key={book.id}
              book={book}
              index={i + 1}
              onToggleFavorite={toggleFavorite}
              actions={
                book.status === "available" ? (
                  <button className="btn btn-primary btn-sm">Borrow</button>
                ) : null
              }
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-base-content/50 py-10">
          Koi book nahi mili.
        </p>
      )}
    </div>
  );
}
