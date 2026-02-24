"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Variant = "login" | "signup";

interface AuthCardProps {
    variant: Variant;
    title: string;
    subtitle: string;
    footerText: string;
    footerLinkText: string;
    footerHref: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
}

export default function AuthCard({
    variant,
    title,
    subtitle,
    footerText,
    footerLinkText,
    footerHref,
    onSubmit,
    children,
}: AuthCardProps) {
    const isLogin = variant === "login";

    return (
        <section
            className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden
        bg-linear-to-b from-sky-50 via-white to-white
        dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute left-1/2 top-[-12%] h-[55vh] w-[120vw] -translate-x-1/2 rounded-full
            bg-sky-200/40 blur-3xl
            dark:bg-teal-700/25"
                />
                <div
                    className="absolute right-[-15%] top-[35%] h-[45vh] w-[60vw] rounded-full
            bg-sky-100/60 blur-3xl
            dark:bg-slate-800/60"
                />
            </div>

            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2">
                {/* Left */}
                <div className="space-y-4">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm
              dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                    >
                        <span className="h-2 w-2 rounded-full bg-sky-500" />
                        STEM-a-Day
                    </div>

                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        {title}
                    </h1>

                    <p className="max-w-prose text-slate-600 dark:text-slate-300">
                        {subtitle}
                    </p>

                    <div className="grid max-w-md grid-cols-2 gap-3 pt-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                                Daily games
                            </div>
                            <div className="mt-1">Quick wins that stick.</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                                Lessons
                            </div>
                            <div className="mt-1">Learn → play → retain.</div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <div
                        className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur
              dark:border-slate-700 dark:bg-slate-950/60"
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                {isLogin ? "Welcome back" : "Create your account"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                {isLogin
                                    ? "Log in to continue your streak."
                                    : "Start your streak in under a minute."}
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            {children}

                            <Button as="button" variant="primary" className="w-full">
                                {isLogin ? "Log in" : "Sign up"}
                            </Button>

                            <div className="flex items-center gap-3 py-2">
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                                <span className="text-xs text-slate-500">or</span>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            </div>

                            {/* Social buttons (placeholders) */}
                            <Button as="button" variant="outline" className="w-full">
                                Continue with Google
                            </Button>

                            <Button as="button" variant="outline" className="w-full">
                                Continue with Apple
                            </Button>

                            <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                                {footerText}{" "}
                                <Link
                                    href={footerHref}
                                    className="font-semibold text-sky-700 hover:underline dark:text-teal-300"
                                >
                                    {footerLinkText}
                                </Link>
                            </p>
                        </form>

                        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                            By continuing, you agree to our Terms & Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
