"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import BooksSkeleton from "@/components/books/BooksSkeleton";
import { getMyFavoriteBooks, toggleFavorite } from "@/lib/api/favorites";
import { borrowBook } from "@/lib/api/books";
import { getMyProfile } from "@/lib/api/auth";
import { Book } from "@/lib/types";

export default function StarredPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullName: string;
  } | null>(null);

  useEffect(() => {
    getMyFavoriteBooks()
      .then(setBooks)
      .finally(() => setLoading(false));
    getMyProfile().then((p) => {
      if (p) setCurrentUser({ id: p.id, fullName: p.full_name });
    });
  }, []);

  const handleToggleFavorite = async (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    try {
      await toggleFavorite(id, true);
    } catch {
      getMyFavoriteBooks().then(setBooks);
    }
  };

  const handleBorrow = async (book: Book) => {
    if (!currentUser) return;
    setBorrowingId(book.id);
    try {
      await borrowBook(book.id, currentUser.fullName, currentUser.id);
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id
            ? {
                ...b,
                status: "borrowed",
                borrowedBy: currentUser.fullName,
                borrowedById: currentUser.id,
              }
            : b,
        ),
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Borrow fail ho gaya.");
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
          Aap ke paas
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
      <h1 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
        <Star className="text-warning" size={22} fill="currentColor" /> Starred
        Books
      </h1>

      {loading ? (
        <BooksSkeleton view="grid" count={6} />
      ) : books.length === 0 ? (
        <p className="text-center text-base-content/50 py-10">
          Abhi tak koi book star nahi ki. Books page se star icon dabayen.
        </p>
      ) : (
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
      )}
    </div>
  );
}
