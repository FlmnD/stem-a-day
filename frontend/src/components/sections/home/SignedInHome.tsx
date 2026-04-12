import Link from "next/link";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/session-user";

type SignedInHomeProps = {
    user: SessionUser;
};

const quickLinks = [
    {
        href: "/daily",
        title: "Daily challenge",
        description: "Answer today's shared chemistry question and earn 25 glucose.",
    },
    {
        href: "/plants",
        title: "Plant garden",
        description: "Spend your glucose on plants, upgrades, and inventory progress.",
    },
    {
        href: "/settings",
        title: "Account",
        description: "Check your streak, verification status, and account details.",
    },
];

export default function SignedInHome({ user }: SignedInHomeProps) {
    const displayName = user.username?.trim() || "Scientist";
    const plantCount = user.plants.length;

    return (
        <section
            className="relative overflow-hidden bg-linear-to-b from-sky-50 via-white to-white
            dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute left-1/2 top-[-12%] h-[55vh] w-[120vw] -translate-x-1/2 rounded-full
                    bg-sky-200/40 blur-3xl dark:bg-teal-700/25"
                />
                <div
                    className="absolute right-[-18%] top-[10%] h-[45vh] w-[60vw] rounded-full
                    bg-linear-to-br from-emerald-300/50 to-sky-300/35 blur-3xl
                    dark:from-teal-600/25 dark:to-emerald-700/20"
                />
            </div>

            <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
                <div
                    className="rounded-[2rem] border border-sky-200/70 bg-white/80 p-8 shadow-xl backdrop-blur
                    dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
                        <div>
                            <span
                                className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1
                                text-xs font-semibold uppercase tracking-[0.18em] text-sky-700
                                dark:border-slate-700 dark:bg-slate-900/60 dark:text-teal-300"
                            >
                                Signed in
                            </span>

                            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                                Ready for today&apos;s streak, {displayName}?
                            </h1>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                                Jump back into your daily chemistry practice, keep your momentum
                                going, and turn your glucose into garden progress.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button as="link" href="/daily" variant="primary">
                                    Go to Daily
                                </Button>
                                <Button as="link" href="/games" variant="outline">
                                    Browse games
                                </Button>
                                <Button as="link" href="/plants" variant="ghost">
                                    Open garden
                                </Button>
                            </div>

                            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                                {user.is_email_verified
                                    ? "Your account is verified and ready for uninterrupted progress."
                                    : "Your account still needs email verification to keep everything unlocked."}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                            <Card className="border-sky-100 bg-white/85 p-5 dark:border-slate-700 dark:bg-slate-950/70">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Streak
                                </div>
                                <div className="mt-3 text-3xl font-bold text-sky-800 dark:text-slate-100">
                                    {user.streak}
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Keep the chain alive with today&apos;s question or a quick game.
                                </p>
                            </Card>

                            <Card className="border-sky-100 bg-white/85 p-5 dark:border-slate-700 dark:bg-slate-950/70">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Glucose
                                </div>
                                <div className="mt-3 text-3xl font-bold text-sky-800 dark:text-slate-100">
                                    {user.glucose}
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Spend it on plants and upgrades as you learn.
                                </p>
                            </Card>

                            <Card className="border-sky-100 bg-white/85 p-5 dark:border-slate-700 dark:bg-slate-950/70">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Garden
                                </div>
                                <div className="mt-3 text-3xl font-bold text-sky-800 dark:text-slate-100">
                                    {plantCount}
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    {plantCount === 1
                                        ? "You already have 1 plant growing."
                                        : `You already have ${plantCount} plants growing.`}
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    {quickLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-3xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur transition
                            hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                        >
                            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {item.title}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {item.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
