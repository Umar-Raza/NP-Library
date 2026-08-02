export default function BookCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="flex gap-3 p-4">
        {/* Left: text lines */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="skeleton h-4 w-12 rounded-md"></div>
          <div className="skeleton h-5 w-3/4"></div>

          <div className="space-y-2 mt-2">
            <div className="skeleton h-3 w-1/3"></div>
            <div className="skeleton h-3 w-1/2"></div>
            <div className="skeleton h-3 w-2/5"></div>
            <div className="skeleton h-3 w-1/3"></div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="skeleton h-8 w-20 rounded-lg"></div>
            <div className="flex gap-2">
              <div className="skeleton h-8 w-8 rounded-lg"></div>
              <div className="skeleton h-8 w-8 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Right: thumbnail */}
        <div className="skeleton w-32 sm:w-34 shrink-0 self-stretch rounded-lg"></div>
      </div>
    </div>
  );
}
