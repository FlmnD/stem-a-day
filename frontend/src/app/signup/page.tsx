"use client";

import AuthCard from "@/components/auth/AuthCard";
import ResendVerificationButton from "@/components/auth/ResendVerificationButton";
import React, { useState } from "react";

const USERNAME_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9_-]{3,18})[A-Za-z0-9]$/;

type SignupSuccess = {
    email: string;
    message: string;
    verification_email_sent: boolean;
    dev_verification_url?: string | null;
};

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<SignupSuccess | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (!USERNAME_REGEX.test(trimmedUsername)) {
            setError(
                "Username must be 5-20 characters, use letters/numbers/_/-, and cannot start or end with _ or -."
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
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: trimmedUsername,
                    email: trimmedEmail,
                    password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(data?.message ?? "Signup failed");
                return;
            }

            setSuccess({
                email: data?.email ?? trimmedEmail,
                message:
                    data?.message ??
                    "Account created. Check your email for the verification link.",
                verification_email_sent: Boolean(data?.verification_email_sent),
                dev_verification_url: data?.dev_verification_url ?? null,
            });
            setPassword("");
            setConfirmPassword("");
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <AuthCard
                variant="signup"
                title="Check your email"
                subtitle="Your account is almost ready. Verify your email to unlock login and start your streak."
                footerText="Already verified?"
                footerLinkText="Log in"
                footerHref="/login"
                showSocialButtons={false}
            >
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {success.message}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Verification email target
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-900 dark:text-slate-100">
                        {success.email}
                    </p>
                </div>

                {success.dev_verification_url && (
                    <a
                        href={success.dev_verification_url}
                        className="block rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Open local verification link
                    </a>
                )}

                {!success.verification_email_sent && !success.dev_verification_url && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        If email delivery is not configured yet, you can resend the link below
                        after setup.
                    </p>
                )}

                <ResendVerificationButton email={success.email} />

                <button
                    type="button"
                    onClick={() => {
                        setSuccess(null);
                        setError(null);
                    }}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60"
                >
                    Use a different email
                </button>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            variant="signup"
            title="Sign up"
            subtitle="Start your daily STEM streak with games, lessons, and progress tracking in one place."
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
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    5-20 chars. Letters/numbers/_/-. Cannot start or end with _ or -.
                </p>
            </div>

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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
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
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                {loading
                    ? "Creating your account..."
                    : "We will ask you to verify your email before you can log in."}
            </p>
        </AuthCard>
    );
}
