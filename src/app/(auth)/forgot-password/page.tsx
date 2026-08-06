"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { sendPasswordReset } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Problem Sending Reset Email!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <BookOpen className="text-primary" size={32} />
          <h1 className="font-display text-2xl font-semibold mt-2">
            Password Reset Link Sent!
          </h1>
          <p className="text-base-content/60 text-sm mt-2">
            If this email is registered, you will receive a password reset link.
            Check your inbox (and spam folder).
          </p>
          <Link href="/login" className="btn btn-primary mt-4 w-full">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col items-center gap-2 mb-4">
          <BookOpen className="text-primary" size={32} />
          <h1 className="font-display text-2xl font-semibold">
            Reset your password
          </h1>
          <p className="text-base-content/60 text-sm text-center">
            Enter your email, we&apos;ll send a reset link.
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

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1 text-sm text-base-content/60 mt-4 hover:text-primary"
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
}
