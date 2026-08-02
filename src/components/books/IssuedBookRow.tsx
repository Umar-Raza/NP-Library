import { Book } from "@/lib/types";
import { Calendar } from "lucide-react";

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
    <div className="flex items-center gap-3 sm:gap-4 bg-base-100 border border-base-300 rounded-box px-4 py-3.5 hover:shadow-sm transition-shadow">
      <span className="w-6 text-center text-sm font-mono font-medium text-base-content/40 shrink-0">
        {index}
      </span>

      {/* Book Name — left */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{book.bookName}</h3>
        <p className="text-xs text-base-content/50 truncate">
          {book.authorName}
        </p>
      </div>

      {/* Borrower name + date — right */}
      <div className="text-right shrink-0">
        <p className="text-sm font-medium truncate">{book.borrowedBy}</p>
        {book.borrowedAt && (
          <p className="text-xs text-base-content/40 flex items-center gap-1 justify-end mt-0.5">
            <Calendar size={11} />
            {new Date(book.borrowedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
