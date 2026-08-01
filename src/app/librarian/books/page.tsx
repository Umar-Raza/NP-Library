"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import SearchFilterBar from "@/components/books/SearchFilterBar";
import BookCard from "@/components/books/BookCard";
import BookRow from "@/components/books/BookRow";
import BookFormModal from "@/components/books/BookFormModal";
import { dummyBooks } from "@/lib/dummy-books";
import { Book, ViewMode, SortOption } from "@/lib/types";

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState<Book[]>(dummyBooks);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const subjects = useMemo(
    () => [...new Set(books.map((b) => b.subject))],
    [books],
  );

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

  const handleAddClick = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Kya aap ye book delete karna chahte hain?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleSave = (
    formData: Omit<Book, "id" | "addedAt" | "status" | "borrowedBy">,
  ) => {
    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) => (b.id === editingBook.id ? { ...b, ...formData } : b)),
      );
    } else {
      const newBook: Book = {
        ...formData,
        id: crypto.randomUUID(),
        status: "available",
        addedAt: new Date().toISOString(),
      };
      setBooks((prev) => [newBook, ...prev]);
    }
  };

  const renderAdminActions = (book: Book) => (
    <div className="flex items-center gap-1.5">
      <button
        className="btn btn-ghost btn-sm btn-square border border-base-300"
        onClick={() => handleEditClick(book)}
      >
        <Pencil size={14} />
      </button>
      <button
        className="btn btn-ghost btn-sm btn-square border border-base-300 text-error"
        onClick={() => handleDelete(book.id)}
      >
        <Trash2 size={14} />
      </button>
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

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book, i) => (
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
          {filtered.map((book, i) => (
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

      {filtered.length === 0 && (
        <p className="text-center text-base-content/50 py-10">
          Koi book nahi mili.
        </p>
      )}

      <BookFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingBook}
      />
    </div>
  );
}
