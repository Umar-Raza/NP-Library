import { BookLog } from "@/lib/types";
import { BookMarked, Undo2 } from "lucide-react";

export default function LogRow({
  log,
  index,
}: {
  log: BookLog;
  index: number;
}) {
  const isBorrow = log.action === "borrowed";

  return (
    <div className="flex items-center gap-4 bg-base-100 border border-base-300 rounded-box px-4 py-3.5 flex-wrap sm:flex-nowrap">
      <span className="w-6 text-center text-sm font-mono font-medium text-base-content/40 shrink-0">
        {index}
      </span>

      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isBorrow ? "bg-primary/15" : "bg-info/15"}`}
      >
        {isBorrow ? (
          <BookMarked size={16} className="text-primary" />
        ) : (
          <Undo2 size={16} className="text-info" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{log.readerName}</span>{" "}
          <span className="text-base-content/60">
            {isBorrow ? "ne borrow ki" : "ne wapis ki"}
          </span>{" "}
          <span className="font-medium">{log.bookName}</span>
        </p>
        <p className="text-xs text-base-content/40 mt-0.5">
          {new Date(log.timestamp).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <span
        className={`badge badge-sm shrink-0 ${isBorrow ? "badge-primary badge-outline" : "badge-info badge-outline"}`}
      >
        {isBorrow ? "Borrowed" : "Returned"}
      </span>
    </div>
  );
}
