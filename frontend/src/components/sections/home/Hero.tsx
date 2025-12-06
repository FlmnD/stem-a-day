import Button from "@/components/ui/Button";

export default function Hero() {
    return (
        <section
            className="relative overflow-hidden
                 bg-linear-to-b from-sky-50 via-white to-white
                 dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
      
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              
                <div
                    className="absolute left-1/2 top-[-10%] h-[60vh] w-[120vw] -translate-x-1/2 rounded-full
                     bg-sky-200/40 blur-3xl
                     dark:bg-teal-700/25"
                />
            
                <div
                    className="absolute right-[-20%] top-[10%] h-[50vh] w-[60vw] rounded-full blur-2xl
                     bg-linear-to-br from-emerald-300/50 to-sky-300/40
                     dark:from-teal-600/30 dark:to-emerald-700/20"
                />
    
                <svg className="absolute inset-0 h-full w-full opacity-[0.18] dark:opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" className="text-sky-700 dark:text-teal-900" />
                </svg>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
         
                <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur
                     border-sky-200/70 bg-white/70 text-sky-800
                     dark:border-gray-800 dark:bg-black/60 dark:text-teal-200"
                >
                    <SparklesIcon className="h-4 w-4 text-sky-600 dark:text-teal-300" />
                    Learn smarter in 6-7 minutes a day
                </span>

                <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
                    <span
                        className="bg-linear-to-r from-sky-700 via-sky-600 to-emerald-600
                       dark:from-teal-300 dark:via-teal-400 dark:to-emerald-300
                       bg-clip-text text-transparent"
                    >
                        STEM a Day
                    </span>
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-pretty text-gray-700 dark:text-gray-300 sm:text-lg">
                    Daily byte-sized lessons across various chemistry topics. Build real intuition
                    with visuals, mini-games, and lessons.
                </p>

                <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm text-sky-900 dark:text-teal-200">
                    {["No ads", "Spaced review", "Interactive practice"].map((t) => (
                        <li
                            key={t}
                            className="rounded-full border px-3 py-1
                         border-sky-200 bg-sky-50
                         dark:border-gray-800 dark:bg-gray-900/70"
                        >
                            {t}
                        </li>
                    ))}
                </ul>

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button as="a" href="/signup" variant="primary">
                        Start learning free
                    </Button>
                    <Button as="a" href="/games" variant="outline">
                        See how it works
                    </Button>
                </div>

                <div className="mx-auto mt-12 max-w-5xl">
                    <div
                        className="rounded-2xl border p-3 shadow-sm backdrop-blur
                       border-sky-200 bg-white/80
                       dark:border-gray-800 dark:bg-black/60"
                    >
                        <div
                            className="aspect-video w-full rounded-xl border
                         border-sky-200 bg-linear-to-br from-sky-50 to-emerald-50
                         dark:border-gray-800 dark:from-gray-900 dark:to-gray-900"
                        >
                            <div className="grid w-full place-items-center text-sky-500 dark:text-teal-300">
                                <img src="/carble_demo.png" alt="Carble Demo Image"/>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-xs text-sky-900/70 dark:text-gray-400">
                    No ads. Built for students &amp; teachers.
                </p>
            </div>
        </section>
    );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path
                d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Zm6 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM6 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}
