"use client";

import React, { useState } from "react";

import AuthCard from "@/components/auth/AuthCard";

type ForgotPasswordSuccess = {
    email: string;
    message: string;
    dev_reset_url?: string | null;
};

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<ForgotPasswordSuccess | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const trimmedEmail = email.trim();

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(data?.message ?? "Could not start password reset.");
                return;
            }

            setSuccess({
                email: trimmedEmail,
                message:
                    data?.message ??
                    "If that account exists, a password reset email has been sent.",
                dev_reset_url: data?.dev_reset_url ?? null,
            });
        } catch {
            setError("Network error. Is your backend running?");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <AuthCard
                variant="login"
                title="Check your email"
                subtitle="We sent a secure password-reset link that also verifies email ownership before the reset finishes."
                footerText="Ready to try again?"
                footerLinkText="Back to login"
                footerHref="/login"
                showSocialButtons={false}
            >
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {success.message}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Reset email target
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-900 dark:text-slate-100">
                        {success.email}
                    </p>
                </div>

                {success.dev_reset_url && (
                    <a
                        href={success.dev_reset_url}
                        className="block rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Open local reset link
                    </a>
                )}

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
            variant="login"
            title="Forgot password"
            subtitle="Enter your email and we will send a secure link to verify ownership and let you choose a new password."
            footerText="Remembered it?"
            footerLinkText="Log in"
            footerHref="/login"
            onSubmit={handleSubmit}
            submitLabel={loading ? "Sending reset link..." : "Send reset link"}
            showSocialButtons={false}
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
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                    disabled={loading}
                    required
                />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
                {loading
                    ? "Creating your reset email..."
                    : "For security, the response looks the same whether the account exists or not."}
            </p>
        </AuthCard>
    );
}
