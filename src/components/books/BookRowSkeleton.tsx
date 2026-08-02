export default function BookRowSkeleton() {
  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl w-full flex flex-row lg:items-center p-0 lg:p-4 lg:gap-6 overflow-hidden">
      {/* Thumbnail */}
      <div className="skeleton shrink-0 w-28 sm:w-36 md:w-44 h-28 lg:w-12 lg:h-16 rounded-none lg:rounded-lg"></div>

      <div className="flex-1 min-w-0 p-3 sm:p-4 lg:p-0 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
        {/* Title + author */}
        <div className="lg:w-[240px] shrink-0 space-y-2">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-4 lg:flex-1">
          <div className="skeleton h-3 w-full"></div>
          <div className="skeleton h-3 w-full"></div>
          <div className="skeleton h-3 w-full"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:w-[200px] shrink-0 justify-between">
          <div className="skeleton h-8 w-20 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="skeleton h-8 w-8 rounded-lg"></div>
            <div className="skeleton h-8 w-8 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
