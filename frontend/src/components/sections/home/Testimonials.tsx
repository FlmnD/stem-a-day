
import { testimonialItems } from "@/components/lib/data/home";

export default function Testimonials() {
    return (
        <section
            className="bg-white
            dark:bg-black"
        >
            <div className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="text-center text-xl font-semibold text-sky-900 dark:text-slate-100">
                    What learners say
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {testimonialItems.map((t) => (
                        <figure
                            key={t.name}
                            className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-sm transition
                            hover:border-sky-300
                            dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30 dark:hover:border-slate-600"
                        >
                            <blockquote className="text-sm text-sky-900/90 dark:text-slate-200">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <figcaption className="mt-3 text-sm font-medium text-sky-700 dark:text-teal-300">
                                {t.name}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}