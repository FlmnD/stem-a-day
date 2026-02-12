"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import cn from "@/components/lib/cn";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Settings } from "lucide-react";

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/plants", label: "Plants" },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const linkBase =
        "block px-3 py-2 rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0";
    const linkInactive =
        "text-gray-600 hover:text-sky-900 hover:bg-sky-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/70";
    const linkActive =
        "text-sky-800 bg-sky-100 ring-1 ring-inset ring-sky-200 dark:text-teal-200 dark:bg-teal-900/30 dark:ring-teal-800/50";

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
                    <Link
                        href="/login"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-sky-800 hover:text-sky-900 hover:bg-sky-50 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800/70"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/signup"
                        className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400 dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0"
                    >
                        Sign up
                    </Link>

                    <ThemeToggle />

                    {/* Settings button on far right */}
                    <Link
                        href="/settings"
                        className="inline-flex items-center justify-center rounded-lg p-2
              text-sky-800 hover:text-sky-900 hover:bg-sky-50
              dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800/70
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300
              dark:focus-visible:ring-teal-500 dark:focus-visible:ring-offset-0"
                        aria-label="Settings"
                        title="Settings"
                    >
                        <Settings className="h-5 w-5" />
                    </Link>
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
                                                ? "text-sky-800 bg-sky-100 ring-1 ring-inset ring-sky-200 dark:text-teal-200 dark:bg-teal-900/30 dark:ring-teal-800/50"
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

                        <li className="mt-2 px-2">
                            <Link
                                href="/settings"
                                className="block rounded-lg px-3 py-2 text-base transition
                  text-sky-900 hover:bg-sky-50
                  dark:text-gray-200 dark:hover:bg-gray-800/70"
                                onClick={() => setOpen(false)}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Settings
                                </span>
                            </Link>
                        </li>

                        <li className="mt-2 px-2">
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
