"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { signIn, getMyProfile } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Login
      await signIn(email, password);

      // 2) Profile fetch — role aur status pata karein
      const profile = await getMyProfile();

      if (!profile) {
        setError("Profile load nahi ho saka. Dobara koshish karein.");
        setLoading(false);
        return;
      }

      // 3) Role + status ke hisaab se navigate
      if (profile.role === "librarian") {
        router.push("/librarian/dashboard");
      } else {
        // reader
        if (profile.status === "approved") {
          router.push("/reader/dashboard");
        } else {
          router.push("/reader/pending");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fail ho gaya.");
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col items-center gap-2 mb-4">
          <BookOpen className="text-primary" size={32} />
          <h1 className="font-display text-2xl font-semibold">NP Library</h1>
          <p className="text-base-content/60 text-sm">
            Login apne account mein
          </p>
        </div>

        {error && (
          <div className="alert alert-error text-sm py-2 mb-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-right mt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-4">
          Account nahi hai?{" "}
          <Link href="/signup" className="text-primary font-medium">
            Signup karein
          </Link>
        </p>
      </div>
    </div>
  );
}
