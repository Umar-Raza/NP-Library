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
            Aapki request pending hai
          </h2>
          <p className="text-sm text-base-content/60 mt-2">
            Aapka registration librarian ke paas review ke liye bheja gaya hai.
            Approve hote hi aapko books list tak access mil jayega.
          </p>
          <div className="alert alert-info text-sm mt-6 text-left">
            Ye process aam taur par jaldi ho jata hai. Iske baad aap login kar
            ke seedha books dekh sakenge.
          </div>
        </div>
      </div>
    </div>
  );
}
