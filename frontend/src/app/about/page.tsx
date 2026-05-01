import { asSessionUser, type SessionUser } from "@/lib/session-user";
import { fetchBackendWithSession } from "@/lib/server-session";

export default async function About() {
    let sessionUser: SessionUser | null = null;

    try {
        const result = await fetchBackendWithSession("/users/me");
        if (result.response?.ok) {
            sessionUser = asSessionUser(result.data);
        }
    } catch {}

    return (
        <section
            className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden
      bg-linear-to-b from-sky-50 via-white to-white
      dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="flex flex-col gap-3">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs font-semibold text-sky-800 shadow-sm backdrop-blur
                          dark:border-slate-700 dark:bg-slate-950/60 dark:text-teal-200">
                        <span aria-hidden></span>
                        STEM a Day
                    </div>

                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        About STEM a Day
                    </h1>

                    <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                        STEM a Day is built to make learning STEM fun, fast, and consistent with one small win at a time.
                        Practice daily with mini-games, track your progress, and level up your streak.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <Card
                        icon="🎮"
                        title="Daily mini-games"
                        desc="Short challenges that feel like games which are designed to teach real concepts without the grind."
                    />
                    <Card
                        icon="🔥"
                        title="Streaks + progress"
                        desc="Build momentum. Earn rewards, maintain streaks, and watch your skills compound."
                    />
                    <Card
                        icon="🌱"
                        title="Grow your garden"
                        desc="Use your learning rewards to collect plants and upgrade them over time."
                    />
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    <Panel title="Our mission" badge="Why">
                        We want STEM practice to be something you actually look forward to.
                        Instead of long sessions, we focus on consistency.
                    </Panel>

                    <Panel title="How it works" badge="How">
                        Each day you play, you earn progress and rewards.
                        Those rewards feed into your profile (like your plant inventory), so learning feels tangible.
                    </Panel>
                </div>

                <div className="mt-10 rounded-3xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur
                        dark:border-slate-700 dark:bg-slate-950/60">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Ready to start your streak?
                            </h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                A little practice every day beats cramming every time.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            {!sessionUser && (
                                <a
                                    href="/signup"
                                    className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700
                           dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                                >
                                    Create account
                                </a>
                            )}
                            <a
                                href="/games"
                                className="inline-flex items-center justify-center rounded-2xl border border-sky-200 px-5 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50
                           dark:border-slate-700 dark:text-teal-300 dark:hover:bg-slate-900/60"
                            >
                                Browse games
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    );
}

function Card({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div
            className="rounded-3xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur
                 dark:border-slate-700 dark:bg-slate-950/60"
        >
            <div className="text-2xl" aria-hidden>
                {icon}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
    );
}

function Panel({
    title,
    badge,
    children,
}: {
    title: string;
    badge: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur
                 dark:border-slate-700 dark:bg-slate-950/60"
        >
            <div className="flex items-center gap-2">
                <span
                    className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700
                     dark:border-slate-700 dark:bg-slate-900/60 dark:text-teal-300"
                >
                    {badge}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</p>
        </div>
    );
}
