import { testimonialItems } from "@/components/lib/data/home";

export default function Testimonials() {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="text-center text-xl font-semibold text-sky-900">What learners say</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {testimonialItems.map((t) => (
                        <figure
                            key={t.name}
                            className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-sm transition hover:border-sky-300"
                        >
                            <blockquote className="text-sm text-sky-900/90">&ldquo;{t.quote}&rdquo;</blockquote>
                            <figcaption className="mt-3 text-sm font-medium text-sky-700">{t.name}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
