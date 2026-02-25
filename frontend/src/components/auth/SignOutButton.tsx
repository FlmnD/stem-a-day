"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function signOut() {
        setLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={signOut}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white
        hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-300
        dark:focus-visible:ring-red-500 dark:focus-visible:ring-offset-0"
        >
            {loading ? "Signing out…" : "Sign out"}
        </button>
    );
}
