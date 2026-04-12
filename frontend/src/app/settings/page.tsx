import Link from "next/link";

import SignOutButton from "@/components/auth/SignOutButton";
import AddGlucoseCard from "@/components/settings/AddGlucoseCard";
import { fetchBackendWithSession } from "@/lib/server-session";

type UserRead = {
    id: number;
    email: string;
    username?: string | null;
    streak: number;
    glucose: number;
    is_email_verified: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
    plants: string[];
};

function readErrorMessage(data: unknown, fallback: string): string {
    if (typeof data !== "object" || data === null) {
        return fallback;
    }

    const record = data as Record<string, unknown>;
    return typeof record.detail === "string" ? record.detail : fallback;
}

export default async function SettingsPage() {
    let me: UserRead | null = null;
    let fetchError: string | null = null;

    try {
        const result = await fetchBackendWithSession("/users/me");

        if (!result.response) {
            fetchError = "Sign in to access settings.";
        } else if (!result.response.ok) {
            fetchError = readErrorMessage(
                result.data,
                "Session expired. Please log in again."
            );
        } else {
            me = result.data as UserRead;
        }
    } catch {
        fetchError = "Could not reach the server. Is the API running?";
    }

    if (!me) {
        const needsLogin = fetchError === "Sign in to access settings.";
        return (
            <section
                className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden
          bg-linear-to-b from-sky-50 via-white to-white
          dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
            >
                <div className="mx-auto max-w-4xl px-6 py-10">
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        {needsLogin ? "Account" : "Settings"}
                    </h1>

                    <div
                        className={`mt-6 rounded-3xl p-6 shadow ${
                            needsLogin
                                ? "border border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60"
                                : "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                        }`}
                    >
                        <p
                            className={
                                needsLogin
                                    ? "text-slate-700 dark:text-slate-300"
                                    : undefined
                            }
                        >
                            {fetchError ?? "Failed to load account."}
                        </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Link
                            href="/login"
                            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700
                dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                        >
                            Log in
                        </Link>
                        {needsLogin && (
                            <Link
                                href="/signup"
                                className="rounded-2xl border border-sky-200 px-5 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50
                dark:border-slate-700 dark:text-teal-300 dark:hover:bg-slate-900/60"
                            >
                                Sign up
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden
        bg-linear-to-b from-sky-50 via-white to-white
        dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    Settings
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                    Account and progress overview.
                </p>

                <div
                    className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur
            dark:border-slate-700 dark:bg-slate-950/60"
                >
                    <Row label="Username" value={me.username ?? "-"} />
                    <Row label="Email" value={me.email} />
                    <Row
                        label="Email verification"
                        value={me.is_email_verified ? "Verified" : "Pending"}
                    />
                    <Row label="Streak" value={`${me.streak}`} />
                    <Row label="Glucose" value={`${me.glucose}`} />

                    <SignOutButton />
                    <AddGlucoseCard />
                </div>
            </div>
        </section>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div
            className="flex items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-white/70 px-4 py-3
        dark:border-slate-700 dark:bg-slate-900/60"
        >
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {label}
            </div>
            <div className="text-sm text-slate-900 dark:text-slate-100">{value}</div>
        </div>
    );
}
