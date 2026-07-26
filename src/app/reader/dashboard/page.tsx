"use client";

import { useState, useMemo } from "react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import { dummyBooks } from "@/lib/dummy-books";
import { ViewMode, SortOption } from "@/lib/types";

export default function ReaderDashboardPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const subjects = useMemo(
    () => [...new Set(dummyBooks.map((b) => b.subject))],
    [],
  );

  const filtered = useMemo(() => {
    let result = dummyBooks.filter((b) => {
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
  }, [search, subject, sort]);

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
          {filtered.map((book, idx) => (
            <BookCard
              key={book.id}
              book={book}
              index={idx + 1}
              actions={
                book.status === "available" ? (
                  <button className="btn btn-primary btn-sm">Borrow</button>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col gap-3 min-w-[600px]">
            {filtered.map((book, idx) => (
              <BookRow
                key={book.id}
                book={book}
                index={idx + 1}
                actions={
                  book.status === "available" ? (
                    <button className="btn btn-primary btn-sm">Borrow</button>
                  ) : null
                }
              />
            ))}
          </div>
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
