import { Book } from "@/lib/types";
import { BookOpen, User } from "lucide-react";

export default function IssuedBookRow({
  book,
  index,
  actions,
}: {
  book: Book;
  index: number;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 bg-base-100 border border-base-300 rounded-box px-4 py-3.5 hover:shadow-sm transition-shadow flex-wrap sm:flex-nowrap">
      <span className="w-6 text-center text-sm font-mono font-medium text-base-content/40 shrink-0">
        {index}
      </span>

      <div className="w-11 h-11 shrink-0 bg-base-300 rounded-field flex items-center justify-center overflow-hidden">
        {book.titlePage ? (
          <img
            src={book.titlePage}
            alt={book.bookName}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen size={16} className="text-base-content/30" />
        )}
      </div>

      {/* Book Name — left */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{book.bookName}</h3>
        <p className="text-xs text-base-content/50 truncate">
          {book.authorName}
        </p>
      </div>

      {/* Borrower Name — right */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="avatar placeholder">
          <div className="bg-secondary text-secondary-content rounded-full w-8">
            <span className="text-xs font-medium">
              {book.borrowedBy?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{book.borrowedBy}</p>
          <p className="text-xs text-base-content/40 flex items-center gap-1 justify-end">
            <User size={10} /> Borrower
          </p>
        </div>
      </div>

      {/* Return action (librarian only) */}
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
