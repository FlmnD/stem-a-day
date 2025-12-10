"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        setIsDark(root.classList.contains("dark"));
        setMounted(true);
    }, []);

    const toggle = () => {
        const root = document.documentElement;
        const next = !root.classList.contains("dark");
        root.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
        setIsDark(next);
    };

    if (!mounted) {
        return (
            <button
                aria-label="Toggle theme"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                disabled
            >
                …
            </button>
        );
    }

    return (
        <button
            onClick={toggle}
            aria-pressed={isDark}
            aria-label="Toggle theme"
            className="rounded-lg px-3 py-2 text-sm font-medium transition
                 text-gray-700 hover:bg-gray-100
                 dark:text-gray-200 dark:hover:bg-gray-800"
        >
            {isDark ? "Light" : "Dark"}
        </button>
    );
}
