"use client";

import AuthCard from "@/components/auth/AuthCard";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const r = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await r.json().catch(() => ({}));

            if (!r.ok) {
                setError(data?.message ?? "Login failed");
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
            subtitle="Pick up where you left off — your games, lessons, and progress are waiting."
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
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
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
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
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
                {loading ? "Logging you in…" : "Use the email + password you signed up with."}
            </p>
        </AuthCard>
    );
}
