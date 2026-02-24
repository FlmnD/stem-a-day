"use client";

import AuthCard from "@/components/auth/AuthCard";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

export default function Signup() {
    const router = useRouter();

    const [username, setUsername] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const usernameRegex = useMemo(
        () => /^[A-Za-z0-9](?:[A-Za-z0-9_-]{3,18})[A-Za-z0-9]$/,
        []
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const u = username.trim();

        if (!usernameRegex.test(u)) {
            setError(
                "Username must be 5–20 characters, use letters/numbers/_/-, and cannot start or end with _ or -."
            );
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const r = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: u,
                    email,
                    password,
                }),
            });

            const data = await r.json().catch(() => ({}));

            if (!r.ok) {
                setError(data?.message ?? "Signup failed");
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            variant="signup"
            title="Sign up"
            subtitle="Start your daily STEM streak — games, lessons, and progress tracking in one place."
            footerText="Already have an account?"
            footerLinkText="Log in"
            footerHref="/login"
            onSubmit={handleSubmit}
        >
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Username
                </label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    autoComplete="username"
                    placeholder="user_name"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    5–20 chars. Letters/numbers/_/-. Cannot start or end with _ or -.
                </p>
            </div>
{/* 
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        First name (optional)
                    </label>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        autoComplete="given-name"
                        placeholder="Dhyan"
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Last name (optional)
                    </label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        autoComplete="family-name"
                        placeholder="Vyas"
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                        disabled={loading}
                    />
                </div>
            </div> */}

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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Confirm password
                </label>
                <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                {loading ? "Creating your account…" : "You’ll be logged in automatically after signup."}
            </p>
        </AuthCard>
    );
}
