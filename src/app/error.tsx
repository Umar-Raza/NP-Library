"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-error/10 flex items-center justify-center">
            <AlertTriangle size={40} className="text-error" />
          </div>
        </div>

        <h1 className="font-display text-2xl font-semibold mb-3">
          Something went wrong
        </h1>
        <p className="text-base-content/60 text-sm mb-8">
          An unexpected error occurred. Please try again or refresh the page.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn btn-primary gap-2">
            <RefreshCw size={16} /> Try Again
          </button>
          <Link href="/" className="btn btn-ghost border border-base-300 gap-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
