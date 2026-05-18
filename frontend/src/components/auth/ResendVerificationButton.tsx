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
    const [messageTone, setMessageTone] = useState<"success" | "error">("success");

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
            setMessageTone(response.ok ? "success" : "error");
            setMessage(
                data?.message ??
                    (response.ok
                        ? "Verification email sent."
                        : "Could not resend the verification email.")
            );
        } catch {
            setMessageTone("error");
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
                <div
                    className={
                        messageTone === "success"
                            ? "mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                            : "mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/60 dark:bg-red-950/40 dark:text-red-200"
                    }
                >
                    {message}
                </div>
            )}
        </div>
    );
}
