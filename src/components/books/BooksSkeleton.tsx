import BookCardSkeleton from "./BookCardSkeleton";
import BookRowSkeleton from "./BookRowSkeleton";
import { ViewMode } from "@/lib/types";

export default function BooksSkeleton({
  view,
  count = 6,
}: {
  view: ViewMode;
  count?: number;
}) {
  const items = Array.from({ length: count });

  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((_, i) => (
        <BookRowSkeleton key={i} />
      ))}
    </div>
  );
}
