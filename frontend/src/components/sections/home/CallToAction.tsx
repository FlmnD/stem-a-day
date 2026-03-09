
export default function CallToAction() {
    return (
        <section className="bg-white dark:bg-black">
            <div className="mx-auto max-w-6xl px-4 pb-24">
                <div
                    className="rounded-2xl border border-sky-200 p-8 text-white shadow-lg sm:p-12
                    bg-linear-to-r from-sky-600 to-emerald-600
                    dark:border-slate-700 dark:bg-linear-to-r dark:from-slate-950/80 dark:to-slate-900/70 dark:text-slate-100"
                >
                    <h2 className="text-balance text-3xl font-extrabold sm:text-4xl leading-tight">
                        Turn 6-7 minutes a day into mastery.
                    </h2>

                    <p className="mt-3 max-w-2xl text-lg text-white/85 dark:text-slate-300">
                        STEM a Day transforms complex topics into quick, interactive lessons that actually stick.
                        Build intuition step by step with smart daily learning.
                    </p>

                    <ul className="mt-4 text-sm list-disc list-inside space-y-1 text-white/80 dark:text-slate-300">
                        <li>🎯 Lessons to deepen your understanding</li>
                        <li>🧠 Mini-games for real understanding, not memorization</li>
                        <li>🚀 Designed by students, for students</li>
                    </ul>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-sky-700 hover:bg-sky-50 transition
                            dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                        >
                            Get Started
                        </a>
                        <a
                            href="/games"
                            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/5 transition
                            dark:bg-slate-900/40 dark:text-teal-200 dark:ring-slate-700 dark:hover:bg-slate-900/60"
                        >
                            Watch a Demo
                        </a>
                    </div>

                    <p className="mt-6 text-sm text-white/70 dark:text-slate-400">
                        Free to play. Free to use.
                    </p>
                </div>
            </div>
        </section>
    );
}