"use client";

import AuthCard from "@/components/auth/AuthCard";
import ResendVerificationButton from "@/components/auth/ResendVerificationButton";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requiresEmailVerification, setRequiresEmailVerification] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setRequiresEmailVerification(false);
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(data?.message ?? "Login failed");
                setRequiresEmailVerification(Boolean(data?.requires_email_verification));
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Network error. Is your backend running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            variant="login"
            title="Log in"
            subtitle="Pick up where you left off. Your games, lessons, and progress are waiting."
            footerText="New here?"
            footerLinkText="Create an account"
            footerHref="/signup"
            onSubmit={handleSubmit}
        >
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {requiresEmailVerification && email.trim() && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm text-amber-900">
                        Your account still needs email verification.
                    </p>
                    <ResendVerificationButton className="mt-3" email={email.trim()} />
                </div>
            )}

            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email
                </label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                </label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="********"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />

                <div className="mt-2 text-right">
                    <a
                        href="/forgot-password"
                        className="text-xs font-medium text-sky-700 hover:underline dark:text-teal-300"
                    >
                        Forgot password?
                    </a>
                </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                {loading ? "Logging you in..." : "Use the email and password you signed up with."}
            </p>
        </AuthCard>
    );
}
