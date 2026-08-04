import { Book } from "@/lib/types";
import { Download, BookOpen, Star } from "lucide-react";

export default function BookRow({
  book,
  index,
  actions,
  adminActions,
  showDownload = true,
  showAvailableStatus = false,
  onToggleFavorite,
}: {
  book: Book;
  index: number;
  actions?: React.ReactNode;
  adminActions?: React.ReactNode;
  showDownload?: boolean;
  showAvailableStatus?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  // Left slot: reader → button (actions); librarian → status badge
  const leftStatus = showAvailableStatus ? (
    book.status === "borrowed" ? (
      <span className="badge badge-warning font-medium truncate max-w-full py-1 px-2">
        {book.borrowedBy}
      </span>
    ) : (
      <span className="btn btn-outline btn-success btn-sm pointer-events-none">
        Available
      </span>
    )
  ) : (
    actions
  );

  const rightActions = (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(book.id)}
          className={`btn btn-ghost btn-xs sm:btn-sm border border-base-300 ${book.isFavorite ? "text-warning" : "text-base-content/40"}`}
          title={book.isFavorite ? "Remove from Starred" : "Add to Starred"}
        >
          <Star size={14} fill={book.isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      {book.bookLink && showDownload && (
        <a
          href={book.bookLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-xs sm:btn-sm border border-base-300 hover:border-primary transition-colors"
          title="Download Book"
        >
          <Download size={14} />
        </a>
      )}

      {adminActions}
    </div>
  );

  return (
    <div className="group bg-base-100 border border-base-200 rounded-2xl hover:shadow-md transition-all duration-300 w-full max-w-full flex flex-row lg:items-center p-0 lg:p-4 lg:gap-6">
      {/* Cover Image */}
      <div className="relative shrink-0 bg-base-200 flex items-center justify-center w-28 sm:w-36 md:w-44 h-auto lg:w-12 lg:h-16 lg:rounded-lg lg:border lg:border-base-300 lg:shadow-sm border-r lg:border-r-0 border-base-200 overflow-hidden rounded-l-2xl lg:rounded-l-lg">
        {book.titlePage ? (
          <img
            src={book.titlePage}
            alt={book.bookName}
            className="w-full h-full object-cover absolute lg:static inset-0"
          />
        ) : (
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-6 lg:h-6 text-base-content/30 relative z-10" />
        )}

        <span className="lg:hidden absolute top-2 left-2 z-10 bg-base-100/90 backdrop-blur-md text-base-content px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold shadow-sm border border-base-200">
          #{String(index).padStart(2, "0")}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 max-w-full p-3 sm:p-4 md:p-5 lg:p-0 flex flex-col lg:flex-row lg:items-center gap-2.5 sm:gap-4 lg:gap-6 justify-center">
        {/* Title & Author */}
        <div className="flex items-center gap-3 lg:w-[240px] xl:w-[280px] shrink-0 min-w-0 max-w-full">
          <span className="hidden lg:block w-6 text-center text-sm font-semibold text-base-content/40 shrink-0 font-mono">
            {String(index).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0 text-left overflow-hidden">
            <h3 className="font-bold text-base-content text-sm sm:text-base md:text-lg lg:text-base truncate group-hover:text-primary transition-colors block max-w-full">
              {book.bookName}
            </h3>
            <p className="text-xs sm:text-sm text-base-content/60 truncate mt-0.5 block max-w-full">
              {book.authorName}
            </p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 lg:flex-1 lg:gap-6 text-left py-0.5 md:py-0 w-full max-w-full min-w-0">
          <div className="min-w-0 overflow-hidden">
            <span className="text-base-content/40 text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider block truncate">
              Subject
            </span>
            <p className="text-xs sm:text-sm font-medium text-base-content/80 truncate mt-0.5">
              {book.subject || "-"}
            </p>
          </div>
          <div className="min-w-0 overflow-hidden">
            <span className="text-base-content/40 text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider block truncate">
              Maktaba
            </span>
            <p className="text-xs sm:text-sm font-medium text-base-content/80 truncate mt-0.5">
              {book.maktaba || "-"}
            </p>
          </div>
          <div className="min-w-0 overflow-hidden">
            <span className="text-base-content/40 text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider block truncate">
              Library Code
            </span>
            <p className="text-xs sm:text-sm font-medium text-base-content/80 truncate mt-0.5">
              {book.libraryCode || "-"}
            </p>
          </div>
        </div>

        {/* Status (left) + Actions (right) */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-3 sm:gap-4 lg:w-auto lg:min-w-[240px] shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-base-200 w-full max-w-full">
          <div className="min-w-0">{leftStatus}</div>
          {rightActions}
        </div>
      </div>
    </div>
  );
}
