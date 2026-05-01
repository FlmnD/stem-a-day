"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";

type ResetPasswordCardProps = {
    token: string | null;
};

export default function ResetPasswordCard({ token }: ResetPasswordCardProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">(
        token ? "idle" : "error"
    );
    const [message, setMessage] = useState(
        token
            ? "Choose a new password for your account."
            : "This password reset link is missing its token."
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!token) {
            setStatus("error");
            setMessage("This password reset link is missing its token.");
            return;
        }

        if (password.length < 8) {
            setStatus("error");
            setMessage("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setStatus("idle");
        setMessage("Resetting your password...");

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatus("error");
                setMessage(data?.message ?? "Password reset failed.");
                return;
            }

            setStatus("success");
            setMessage(data?.message ?? "Password reset complete. You are now signed in.");
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 1500);
        } catch {
            setStatus("error");
            setMessage("Network error. Please try the reset link again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            variant="login"
            title={
                status === "success"
                    ? "Password updated"
                    : status === "error"
                      ? "Reset problem"
                      : "Reset your password"
            }
            subtitle={
                status === "success"
                    ? "Your password has been updated and your session is ready."
                    : status === "error"
                      ? "This link may be invalid or expired, but you can request a fresh one."
                      : "Set a new password to finish verifying your email ownership and sign back in."
            }
            footerText="Need a new link?"
            footerLinkText="Forgot password"
            footerHref="/forgot-password"
            onSubmit={status === "success" ? undefined : handleSubmit}
            submitLabel={loading ? "Updating password..." : "Reset password"}
            showSocialButtons={false}
        >
            <div
                className={
                    status === "success"
                        ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                        : status === "error"
                          ? "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                          : "rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
                }
            >
                {message}
            </div>

            {status !== "success" && token && (
                <>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            New password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                            disabled={loading || !token}
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
                            placeholder="Repeat your new password"
                            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-700/40 dark:focus:ring-offset-[#0b0b0b]"
                            disabled={loading || !token}
                            required
                        />
                    </div>
                </>
            )}

            {status === "success" && (
                <button
                    type="button"
                    onClick={() => {
                        router.push("/");
                        router.refresh();
                    }}
                    className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                >
                    Continue to STEM a Day
                </button>
            )}

            {status === "error" && (
                <div className="flex gap-3">
                    <Link
                        href="/forgot-password"
                        className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Request new link
                    </Link>
                    <Link
                        href="/login"
                        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60"
                    >
                        Back to login
                    </Link>
                </div>
            )}
        </AuthCard>
    );
}
