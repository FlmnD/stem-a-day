export default function CallToAction() {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 pb-24">
                <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-600 to-emerald-600 p-8 text-white shadow-lg sm:p-12">
                    <h2 className="text-balance text-3xl font-extrabold sm:text-4xl leading-tight">
                        Turn 5 minutes a day into mastery.
                    </h2>

                    <p className="mt-3 max-w-2xl text-white/85 text-lg">
                        STEM a Day transforms complex topics into quick, interactive lessons that actually stick.
                        Build intuition step by step with smart daily learning.
                    </p>

                    <ul className="mt-4 text-sm text-white/80 list-disc list-inside space-y-1">
                        <li>🎯 Lessons to deepend your understanding</li>
                        <li>🧠 Mini-games for real understanding, not memorization</li>
                        <li>🚀 Designed by students, for students</li>
                    </ul>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-sky-700 hover:bg-sky-50 transition"
                        >
                            Get Started
                        </a>
                        <a
                            href="/games"
                            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/5 transition"
                        >
                            Watch a Demo
                        </a>
                    </div>

                    <p className="mt-6 text-sm text-white/70">
                        Free to play. Free to use.
                    </p>
                </div>
            </div>
        </section>
    );
}
