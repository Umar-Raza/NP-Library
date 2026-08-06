import { Clock, BookOpen } from "lucide-react";
export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center mb-2">
            <Clock size={28} className="text-warning" />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <BookOpen className="text-primary" size={22} />
            <h1 className="font-display text-xl font-semibold">NP Library</h1>
          </div>

          <h2 className="text-lg font-semibold mt-4">
            Your request is pending
          </h2>
          <p className="text-sm text-base-content/60 mt-2">
            Your registration has been sent to the librarian for review. Once
            approved, you will get access to the books list.
          </p>
          <div className="alert alert-info text-sm mt-6 text-left">
            This process is usually quick. After approval, you will be able to
            login and view the books list.
          </div>
        </div>
      </div>
    </div>
  );
}
