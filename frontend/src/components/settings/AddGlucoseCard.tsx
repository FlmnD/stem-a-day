"use client";

import { useState } from "react";

export default function AddGlucoseCard() {
    const [amount, setAmount] = useState<number>(50);
    const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [message, setMessage] = useState<string>("");

    async function addGlucose() {
        setStatus("loading");
        setMessage("");

        try {
            const r = await fetch("/api/glucose/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await r.json().catch(() => ({}));

            if (!r.ok) {
                setStatus("error");
                setMessage(data?.message ?? data?.detail ?? "Failed to add glucose.");
                return;
            }

            setStatus("ok");
            setMessage(`Added ${amount} glucose successfully.`);
        } catch {
            setStatus("error");
            setMessage("Network error. Could not reach server.");
        }
    }

    return (
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Debug: Add Glucose
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Temporary tool for testing.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                    type="number"
                    min={1}
                    step={1}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))}
                    className="w-full sm:w-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none
                     focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                />

                <button
                    onClick={addGlucose}
                    disabled={status === "loading" || !Number.isFinite(amount) || amount <= 0}
                    className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50
                     dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                >
                    {status === "loading" ? "Adding..." : "Add glucose"}
                </button>

                {status !== "idle" && (
                    <div
                        className={`text-sm ${status === "ok"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : status === "error"
                                    ? "text-red-700 dark:text-red-300"
                                    : "text-slate-600 dark:text-slate-300"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}