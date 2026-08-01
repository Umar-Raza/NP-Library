"use client";

import { useState, useMemo } from "react";
import { Star } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import { dummyBooks } from "@/lib/dummy-books";
import { Book, ViewMode } from "@/lib/types";

export default function StarredPage() {
  const [books, setBooks] = useState<Book[]>(dummyBooks);
  const [view] = useState<ViewMode>("grid");

  const toggleFavorite = (id: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)),
    );
  };

  const favorites = useMemo(() => books.filter((b) => b.isFavorite), [books]);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
        <Star className="text-warning" size={22} fill="currentColor" /> Starred
        Books
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          Abhi tak koi book star nahi ki. Books page se star icon dabayen.
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((book, i) => (
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
          {favorites.map((book, i) => (
            <BookRow
              key={book.id}
              book={book}
              index={i + 1}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
