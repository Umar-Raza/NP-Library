import { Book } from "@/lib/types";

export default function BookLogGroup({ book }: { book: Book }) {
  const chain = book.borrowChain || [];
  if (chain.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-base-content/70 mb-2 px-1">
        {book.bookName}
      </h3>

      <div className="relative border-l-2 border-base-300 ml-3">
        {chain.map((entry, i) => (
          <div key={i} className="relative pl-6 pb-4 last:pb-0">
            <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-neutral text-neutral-content text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>

            <div className="bg-base-100 border border-base-300 rounded-field px-4 py-2.5">
              <p className="font-medium text-sm">{entry.readerName}</p>
              <p className="text-xs text-base-content/50">
                {new Date(entry.timestamp).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
