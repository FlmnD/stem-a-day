"use client";

import React, { useState } from "react";

type ResendVerificationButtonProps = {
    email: string;
    className?: string;
};

export default function ResendVerificationButton({
    email,
    className = "",
}: ResendVerificationButtonProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleResend() {
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => ({}));
            setMessage(
                data?.message ??
                    (response.ok
                        ? "Verification email sent."
                        : "Could not resend the verification email.")
            );
        } catch {
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={className}>
            <button
                type="button"
                onClick={handleResend}
                disabled={loading || !email.trim()}
                className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-teal-300 dark:hover:bg-slate-900/60"
            >
                {loading ? "Sending verification email..." : "Resend verification email"}
            </button>

            {message && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</p>
            )}
        </div>
    );
}
