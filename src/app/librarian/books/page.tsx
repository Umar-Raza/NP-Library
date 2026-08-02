"use client";

import { useState, useMemo } from "react";
import { Plus, UserPlus, RotateCcw } from "lucide-react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import BookFormModal from "@/components/books/BookFormModal";
import BooksSkeleton from "@/components/books/BooksSkeleton";
import AdminMenu from "@/components/books/AdminMenu";
import { useInfiniteBooks } from "@/hooks/useInfiniteBooks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { deleteBook } from "@/lib/api/books";
import { Book, ViewMode } from "@/lib/types";

export default function LibrarianBooksPage() {
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
    removeLocalBook,
    updateLocalBook,
    prependLocalBook,
  } = useInfiniteBooks();

  const [view, setView] = useState<ViewMode>("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  const subjects = useMemo(
    () => [...new Set(books.map((b) => b.subject))],
    [books],
  );

  const handleAddClick = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Kya aap ye book delete karna chahte hain?")) return;
    try {
      await deleteBook(id);
      removeLocalBook(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete fail ho gaya.");
    }
  };

  const handleSaved = (savedBook: Book, isNew: boolean) => {
    if (isNew) prependLocalBook(savedBook);
    else updateLocalBook(savedBook);
  };

  const renderAdminActions = (book: Book) => (
    <div className="flex items-center gap-1.5">
      {book.status === "available" ? (
        <button className="btn btn-primary btn-sm btn-square" title="Assign">
          <UserPlus size={14} />
        </button>
      ) : (
        <button
          className="btn btn-ghost btn-sm btn-square border border-base-300"
          title="Return"
        >
          <RotateCcw size={14} />
        </button>
      )}
      <AdminMenu
        onEdit={() => handleEditClick(book)}
        onDelete={() => handleDelete(book.id)}
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-display font-semibold">Books</h1>
        <button className="btn btn-primary gap-2" onClick={handleAddClick}>
          <Plus size={18} /> Add Book
        </button>
      </div>

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
                  adminActions={renderAdminActions(book)}
                  showDownload={false}
                  showAvailableStatus={true}
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
                  adminActions={renderAdminActions(book)}
                  showDownload={false}
                  showAvailableStatus={true}
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

      <BookFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        initialData={editingBook}
      />
    </div>
  );
}
