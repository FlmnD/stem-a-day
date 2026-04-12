"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { requestSessionUserRefresh } from "@/lib/session-events";

type DailyQuestion = {
    question_number: number;
    total_questions: number;
    effective_date: string;
    reward_glucose: number;
    prompt: string;
    options: string[];
    can_answer_today: boolean;
    answered_today: boolean;
    glucose_balance: number;
    debug_offset_days: number;
};

type DailyAnswerResult = {
    question_number: number;
    effective_date: string;
    correct: boolean;
    selected_option_index: number;
    correct_option_index: number;
    explanation: string;
    reward_glucose: number;
    glucose_earned: number;
    glucose_balance: number;
    can_answer_today: boolean;
    answered_today: boolean;
};

type ApiError = {
    message?: string;
    detail?: string;
};

function readErrorMessage(data: ApiError, fallback: string) {
    return data.message ?? data.detail ?? fallback;
}

export default function DailyPage() {
    const [daily, setDaily] = useState<DailyQuestion | null>(null);
    const [result, setResult] = useState<DailyAnswerResult | null>(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [advancing, setAdvancing] = useState(false);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    async function loadDailyQuestion() {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/daily/question", {
                cache: "no-store",
                credentials: "include",
            });
            const data = (await response.json().catch(() => ({}))) as DailyQuestion & ApiError;

            if (!response.ok) {
                setDaily(null);
                setResult(null);
                setSelectedOptionIndex(null);
                setStatusCode(response.status);
                setMessage(readErrorMessage(data, "Could not load the daily question."));
                return;
            }

            setDaily(data);
            setResult(null);
            setSelectedOptionIndex(null);
            setStatusCode(response.status);
        } catch {
            setDaily(null);
            setResult(null);
            setSelectedOptionIndex(null);
            setStatusCode(500);
            setMessage("Network error. Please make sure the app is running.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadDailyQuestion();
    }, []);

    async function submitAnswer() {
        if (!daily || !daily.can_answer_today || selectedOptionIndex === null || submitting) {
            return;
        }

        setSubmitting(true);
        setMessage("");

        try {
            const response = await fetch("/api/daily/answer", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selected_option_index: selectedOptionIndex }),
            });
            const data = (await response.json().catch(() => ({}))) as DailyAnswerResult & ApiError;

            if (!response.ok) {
                setMessage(readErrorMessage(data, "Could not submit your answer."));
                if (response.status === 409) {
                    await loadDailyQuestion();
                }
                return;
            }

            setResult(data);
            setDaily({
                ...daily,
                can_answer_today: data.can_answer_today,
                answered_today: data.answered_today,
                glucose_balance: data.glucose_balance,
            });
            requestSessionUserRefresh();
            setMessage(
                data.correct
                    ? `Correct! You earned ${data.glucose_earned} glucose.`
                    : "Not quite. Your one daily attempt has been used."
            );
        } catch {
            setMessage("Network error while submitting your answer.");
        } finally {
            setSubmitting(false);
        }
    }

    async function advanceDebugDay() {
        if (advancing) return;

        setAdvancing(true);
        setMessage("");

        try {
            const response = await fetch("/api/daily/debug/advance", {
                method: "POST",
                credentials: "include",
            });
            const data = (await response.json().catch(() => ({}))) as DailyQuestion & ApiError;

            if (!response.ok) {
                setMessage(readErrorMessage(data, "Could not advance the debug day."));
                return;
            }

            setDaily(data);
            setResult(null);
            setSelectedOptionIndex(null);
            setStatusCode(response.status);
            setMessage("Debug day advanced. You now have the next daily question.");
        } catch {
            setMessage("Network error while advancing the debug day.");
        } finally {
            setAdvancing(false);
        }
    }

    return (
        <section
            className="min-h-[calc(100dvh-3.5rem)] px-6 py-10
        bg-linear-to-b from-sky-50 via-white to-white
        dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div className="mx-auto max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold text-sky-800 dark:text-slate-100">
                        Daily
                    </h1>
                    <p className="mt-2 max-w-2xl text-gray-600 dark:text-slate-300">
                        Answer one global chemistry question each day. A correct answer earns
                        25 glucose, and the selector skips the 10 most recently used questions.
                    </p>
                </div>

                {message && (
                    <div
                        className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800
                        dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                    >
                        {message}
                    </div>
                )}

                {loading ? (
                    <div
                        className="mt-8 rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-md
                        dark:border-slate-700 dark:bg-slate-950/60"
                    >
                        Loading your daily question...
                    </div>
                ) : !daily ? (
                    <div
                        className="mt-8 rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-md
                        dark:border-slate-700 dark:bg-slate-950/60"
                    >
                        <h2 className="text-xl font-semibold text-sky-800 dark:text-slate-100">
                            Daily question unavailable
                        </h2>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">
                            {message || "Could not load the daily question."}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {statusCode === 401 ? (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => void loadDailyQuestion()}
                                    className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className="mt-8 rounded-3xl border border-sky-100 bg-white/85 p-8 shadow-md
                        dark:border-slate-700 dark:bg-slate-950/60"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-sky-700 dark:text-teal-300">
                                    Daily chemistry challenge
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                    {daily.prompt}
                                </h2>
                            </div>

                            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100">
                                Reward: {daily.reward_glucose} glucose
                            </div>
                        </div>

                        <div className="mt-8 grid gap-3">
                            {daily.options.map((option, index) => {
                                const isSelected = selectedOptionIndex === index;
                                const isCorrectChoice = result?.correct_option_index === index;
                                const isWrongSelected =
                                    result?.selected_option_index === index && !result.correct;

                                const resultClass = result
                                    ? isCorrectChoice
                                        ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-100"
                                        : isWrongSelected
                                          ? "border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/30 dark:text-red-100"
                                          : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
                                    : isSelected
                                      ? "border-sky-400 bg-sky-50 text-sky-900 dark:border-teal-400 dark:bg-slate-900/80 dark:text-slate-100"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:bg-slate-900/80";

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        disabled={Boolean(result) || !daily.can_answer_today}
                                        onClick={() => setSelectedOptionIndex(index)}
                                        className={`w-full rounded-2xl border px-4 py-4 text-left text-sm transition ${resultClass}`}
                                    >
                                        <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-current/20 text-xs font-semibold">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                disabled={
                                    !daily.can_answer_today ||
                                    selectedOptionIndex === null ||
                                    submitting
                                }
                                onClick={() => void submitAnswer()}
                                className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                            >
                                {submitting ? "Checking answer..." : "Submit answer"}
                            </button>

                            <button
                                type="button"
                                disabled={advancing}
                                onClick={() => void advanceDebugDay()}
                                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/60"
                            >
                                {advancing ? "Advancing..." : "Advance day (debug)"}
                            </button>
                        </div>

                        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            {daily.answered_today
                                ? "You have already used today's attempt."
                                : "You get one attempt per effective day. A wrong answer still uses the attempt."}
                        </div>

                        {result && (
                            <div
                                className={`mt-8 rounded-2xl border px-5 py-4 ${result.correct
                                        ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-100"
                                        : "border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/30 dark:text-red-100"
                                    }`}
                            >
                                <div className="text-base font-semibold">
                                    {result.correct
                                        ? `Correct! +${result.glucose_earned} glucose`
                                        : "Not quite this time"}
                                </div>
                                <p className="mt-2 text-sm">{result.explanation}</p>
                            </div>
                        )}

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                            Global debug offset: {daily.debug_offset_days} day
                            {daily.debug_offset_days === 1 ? "" : "s"}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
