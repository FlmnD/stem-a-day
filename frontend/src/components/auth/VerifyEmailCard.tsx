"use client";

import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type VerifyEmailCardProps = {
    token: string | null;
};

type VerificationStatus = "verifying" | "success" | "error";

export default function VerifyEmailCard({ token }: VerifyEmailCardProps) {
    const router = useRouter();
    const didStart = useRef(false);
    const [status, setStatus] = useState<VerificationStatus>(
        token ? "verifying" : "error"
    );
    const [message, setMessage] = useState(
        token
            ? "We are verifying your email now."
            : "This verification link is missing its token."
    );

    useEffect(() => {
        if (didStart.current) return;
        didStart.current = true;

        if (!token) return;

        let isMounted = true;
        let redirectTimer: ReturnType<typeof setTimeout> | null = null;

        async function verifyEmail() {
            try {
                const response = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json().catch(() => ({}));

                if (!isMounted) return;

                if (!response.ok) {
                    setStatus("error");
                    setMessage(data?.message ?? "Verification failed.");
                    return;
                }

                setStatus("success");
                setMessage(data?.message ?? "Email verified. You are now signed in.");
                redirectTimer = setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1500);
            } catch {
                if (!isMounted) return;
                setStatus("error");
                setMessage("Network error. Please try the verification link again.");
            }
        }

        verifyEmail();

        return () => {
            isMounted = false;
            if (redirectTimer) clearTimeout(redirectTimer);
        };
    }, [router, token]);

    return (
        <AuthCard
            variant="login"
            title={
                status === "verifying"
                    ? "Verifying your email"
                    : status === "success"
                      ? "Email verified"
                      : "Verification problem"
            }
            subtitle={
                status === "verifying"
                    ? "Hold tight while we finish activating your account."
                    : status === "success"
                      ? "Your account is ready. We will send you to the app in a moment."
                      : "This link is not usable anymore, but you can request a fresh one."
            }
            footerText="Need another link?"
            footerLinkText="Go to login"
            footerHref="/login"
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

            {status === "verifying" && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    This usually only takes a second.
                </p>
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
                        href="/login"
                        className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Back to login
                    </Link>
                    <Link
                        href="/signup"
                        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60"
                    >
                        Create account
                    </Link>
                </div>
            )}
        </AuthCard>
    );
}
