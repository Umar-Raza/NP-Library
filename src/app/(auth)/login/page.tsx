"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { signIn, getMyProfile } from "@/lib/api/auth";
import FormInput from "@/components/ui/FormInput";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email zaroori hai.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Sahi email daalein.";
    if (!password) e.password = "Password zaroori hai.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      const profile = await getMyProfile();

      if (!profile) {
        setApiError("Profile load nahi ho saka. Dobara koshish karein.");
        setLoading(false);
        return;
      }

      if (profile.role === "librarian") {
        router.push("/librarian/dashboard");
      } else {
        router.push(
          profile.status === "approved"
            ? "/reader/dashboard"
            : "/reader/pending",
        );
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login fail ho gaya.");
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

        {apiError && (
          <div className="alert alert-error text-sm py-2 mb-2">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <FormInput
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          <div>
            <FormInput
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              error={errors.password}
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
            className="btn btn-primary w-full mt-2"
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
