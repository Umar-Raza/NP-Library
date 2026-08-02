export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-4 w-64 mt-2"></div>
      </div>

      {/* Header card skeleton */}
      <div className="bg-base-100 border border-base-200 rounded-3xl overflow-hidden">
        <div className="skeleton h-28 sm:h-36 rounded-none"></div>
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex items-end gap-4 -mt-14">
            <div className="skeleton w-28 h-28 rounded-2xl shrink-0"></div>
            <div className="space-y-2 mb-2">
              <div className="skeleton h-6 w-40"></div>
              <div className="skeleton h-4 w-56"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Info card skeleton */}
      <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="skeleton h-5 w-48"></div>
        <div className="space-y-4">
          <div className="skeleton h-12 w-full"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
