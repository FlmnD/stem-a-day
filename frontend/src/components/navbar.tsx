"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";

import cn from "@/components/lib/cn";
import { SESSION_USER_REFRESH_EVENT } from "@/lib/session-events";
import { asSessionUser, type SessionUser } from "@/lib/session-user";
import ThemeToggle from "@/components/ui/ThemeToggle";

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/daily", label: "Daily" },
    { href: "/games", label: "Games" },
    { href: "/plants", label: "Plants" },
    { href: "/about", label: "About" },
];

type NavbarProps = {
    initialUser: SessionUser | null;
};

export default function Navbar({ initialUser }: NavbarProps) {
    const [open, setOpen] = useState(false);
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(initialUser);
    const [signingOut, setSigningOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const linkBase =
        "block rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0";
    const linkInactive =
        "text-gray-600 hover:bg-sky-50 hover:text-sky-900 dark:text-gray-300 dark:hover:bg-gray-800/70 dark:hover:text-white";
    const linkActive =
        "bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200 dark:bg-teal-900/30 dark:text-teal-200 dark:ring-teal-800/50";

    useEffect(() => {
        setSessionUser(initialUser);
    }, [initialUser]);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        let ignore = false;

        async function loadSessionUser() {
            try {
                const response = await fetch("/api/me", {
                    cache: "no-store",
                    credentials: "include",
                });
                const data = await response.json().catch(() => null);

                if (ignore) return;

                if (response.status === 401) {
                    setSessionUser(null);
                    return;
                }

                if (!response.ok) {
                    return;
                }

                setSessionUser(asSessionUser(data));
            } catch {
                if (ignore) return;
            }
        }

        function handleSessionRefresh() {
            void loadSessionUser();
        }

        void loadSessionUser();
        window.addEventListener(SESSION_USER_REFRESH_EVENT, handleSessionRefresh);
        window.addEventListener("focus", handleSessionRefresh);

        return () => {
            ignore = true;
            window.removeEventListener(SESSION_USER_REFRESH_EVENT, handleSessionRefresh);
            window.removeEventListener("focus", handleSessionRefresh);
        };
    }, [pathname]);

    async function handleSignOut() {
        if (signingOut) return;

        setSigningOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            setSessionUser(null);
            setOpen(false);
            setSigningOut(false);
            router.push("/login");
            router.refresh();
        }
    }

    function renderSignedInControls(isMobile = false) {
        if (!sessionUser) return null;

        return (
            <>
                <Link
                    href="/daily"
                    className={cn(
                        "inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 transition hover:bg-sky-100",
                        "dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900",
                        isMobile && "w-full justify-between rounded-2xl"
                    )}
                >
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        🧪
                    </span>
                    <span className="font-semibold">{sessionUser.glucose}</span>
                </Link>

                <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
                        "dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60",
                        isMobile && "w-full"
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    {signingOut ? "Signing out..." : "Sign out"}
                </button>

                <Link
                    href="/settings"
                    className={cn(
                        "inline-flex items-center justify-center rounded-lg p-2 text-sky-800 transition hover:bg-sky-50 hover:text-sky-900",
                        "dark:text-gray-200 dark:hover:bg-gray-800/70 dark:hover:text-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300",
                        "dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0",
                        isMobile && "w-full justify-start gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                    )}
                    aria-label="Account"
                    title="Account"
                >
                    <User className="h-5 w-5" />
                    {isMobile && <span>Settings</span>}
                </Link>
            </>
        );
    }

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur",
                "border-sky-100 bg-white/85",
                "dark:border-gray-800! dark:bg-black!"
            )}
        >
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link
                    href="/"
                    className="font-semibold tracking-tight text-sky-900 dark:text-white"
                >
                    <span className="bg-linear-to-r from-sky-700 via-sky-600 to-emerald-600 dark:from-teal-300 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                        STEM a Day
                    </span>
                </Link>

                <ul className="hidden items-center gap-1 md:flex">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(linkBase, active ? linkActive : linkInactive)}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="hidden items-center gap-2 md:flex">
                    {sessionUser ? (
                        renderSignedInControls()
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50 hover:text-sky-900 dark:text-gray-200 dark:hover:bg-gray-800/70 dark:hover:text-white"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/signup"
                                className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400 dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0"
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    <ThemeToggle />
                </div>

                <button
                    className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-sky-50 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 dark:hover:bg-gray-800/70 dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <svg
                        className={cn("h-5 w-5", open && "hidden")}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            d="M4 7h16M4 12h16M4 17h16"
                        />
                    </svg>
                    <svg
                        className={cn("h-5 w-5", !open && "hidden")}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
                    </svg>
                </button>
            </nav>

            {open && (
                <div className="border-t border-sky-100 bg-white/90 backdrop-blur md:hidden dark:border-gray-800 dark:bg-black/80">
                    <ul className="mx-auto max-w-6xl p-2">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "block rounded-lg px-3 py-2 text-base transition",
                                            active
                                                ? "bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200 dark:bg-teal-900/30 dark:text-teal-200 dark:ring-teal-800/50"
                                                : "text-sky-900 hover:bg-sky-50 dark:text-gray-200 dark:hover:bg-gray-800/70"
                                        )}
                                        aria-current={active ? "page" : undefined}
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}

                        {sessionUser ? (
                            <li className="mt-2 flex flex-col gap-2 px-2">
                                {renderSignedInControls(true)}
                            </li>
                        ) : (
                            <li className="mt-2 flex gap-2 px-2">
                                <Link
                                    href="/login"
                                    className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-sky-900 hover:bg-sky-50 dark:text-gray-200 dark:hover:bg-gray-800/70"
                                    onClick={() => setOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </li>
                        )}

                        <li className="mt-2 px-2">
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
