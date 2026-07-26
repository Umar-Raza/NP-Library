import { Book } from "@/lib/types";
import { Download, BookOpen } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function BookCard({
  book,
  index,
  actions,
}: {
  book: Book;
  index: number;
  actions?: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
      <div className="flex gap-3 p-4">
        {/* Left: content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Index Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-primary/10 text-neutral border border-primary/20 shadow-2xs">
              #{String(index).padStart(2, "0")}
            </span>
          </div>

          <h2 className="font-display text-sm sm:text-base font-semibold leading-snug mb-3 line-clamp-2 text-base-content">
            {book.bookName}
          </h2>

          {/* Metadata Stack - All aligned on the left side */}
          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-base-content/40 text-[11px] font-semibold uppercase tracking-wider block">
                Author
              </span>
              <span className="text-base-content/80 font-medium truncate block mt-0.5">
                {book.authorName || "-"}
              </span>
            </div>
            <div>
              <span className="text-base-content/40 text-[11px] font-semibold uppercase tracking-wider block">
                Subject
              </span>
              <span className="text-base-content/80 font-medium truncate block mt-0.5">
                {book.subject || "-"}
              </span>
            </div>
            <div>
              <span className="text-base-content/40 text-[11px] font-semibold uppercase tracking-wider block">
                Maktaba
              </span>
              <span className="text-base-content/80 font-medium truncate block mt-0.5">
                {book.maktaba || "-"}
              </span>
            </div>
            <div>
              <span className="text-base-content/40 text-[11px] font-semibold uppercase tracking-wider block">
                Library Code
              </span>
              <span className="text-base-content/80 font-medium truncate block mt-0.5">
                {book.libraryCode || "-"}
              </span>
            </div>
          </div>

          {/* Download & Custom Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-auto pt-4">
            {book.bookLink && (
              <a
                href={book.bookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm border border-base-300 hover:border-primary hover:text-primary transition-colors"
                title="Download Book"
              >
                <Download size={14} />
              </a>
            )}
            {actions}
          </div>
        </div>

        {/* Right: full-height thumbnail */}
        <div className="w-32 sm:w-34 shrink-0 bg-base-200 border border-base-300 rounded-lg flex items-center justify-center overflow-hidden self-stretch relative shadow-sm">
          {book.titlePage ? (
            <img
              src={book.titlePage}
              alt={book.bookName}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen size={22} className="text-base-content/30" />
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 border-t border-base-200/60">
        <StatusBadge status={book.status} borrowedBy={book.borrowedBy} />
      </div>
    </div>
  );
}
