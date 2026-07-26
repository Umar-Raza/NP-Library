"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col items-center gap-2 mb-2">
          <BookOpen className="text-primary" size={32} />
          <h1 className="font-display text-2xl font-semibold">NP Library</h1>
          <p className="text-base-content/60 text-sm">
            Login apne account mein
          </p>
        </div>

        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
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
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary border-0 w-full">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-4">
          Don&lsquo;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
