import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <BookOpen size={40} className="text-primary" />
          </div>
        </div>

        <h1 className="font-display text-7xl font-bold text-primary mb-2">
          404
        </h1>
        <h2 className="font-display text-2xl font-semibold mb-3">
          Page Not Found
        </h2>
        <p className="text-base-content/60 text-sm mb-8">
          The page you are looking for does not exist or has been removed.
        </p>

        <Link href="/" className="btn btn-primary gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
