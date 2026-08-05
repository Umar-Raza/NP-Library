"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { signUp } from "@/lib/api/auth";
import FormInput from "@/components/ui/FormInput";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!fullName.trim()) e.fullName = "Name is required.";
    else if (fullName.trim().length < 2) e.fullName = "Minimum 2 characters.";

    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email.";

    if (!whatsapp.trim()) e.whatsapp = "WhatsApp is required.";
    else if (!/^\+?\d{10,15}$/.test(whatsapp.replace(/[\-\s]/g, "")))
      e.whatsapp = "Enter a valid number (e.g., +923xxxxxxxxx).";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Minimum 6 characters.";

    if (!confirmPassword) e.confirmPassword = "Password is required.";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp({ fullName, email, whatsapp, password });
      setSuccess(true);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to create account.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <BookOpen className="text-primary" size={32} />
          <h1 className="font-display text-2xl font-semibold mt-2">
            Account created successfully!
          </h1>
          <p className="text-base-content/60 text-sm mt-2">
            Your account has been created successfully. The librarian will
            approve it, and then you can access the books.
          </p>
          <Link href="/login" className="btn btn-primary mt-4 w-full">
            Login
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
          <h1 className="font-display text-2xl font-semibold">NP Library</h1>
          <p className="text-base-content/60 text-sm">
            Create a new reader account
          </p>
        </div>

        {apiError && (
          <div className="alert alert-error text-sm py-2 mb-2">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <FormInput
            label="Name"
            required
            placeholder="Your name"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
          />
          <FormInput
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />
          <FormInput
            label="WhatsApp"
            type="tel"
            required
            placeholder="+923123456789"
            value={whatsapp}
            onChange={setWhatsapp}
            error={errors.whatsapp}
          />
          <FormInput
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Signup"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
