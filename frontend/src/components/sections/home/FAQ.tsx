import { faqItems } from "@/components/lib/data/home";
import { ChevronIcon } from "@/components/ui/Icons";

export default function FAQ() {
    return (
        <section className="bg-sky-50/70">
            <div className="mx-auto max-w-4xl px-4 py-16">
                <h2 className="text-center text-xl font-semibold text-sky-900">FAQs</h2>
                <div className="mt-6 divide-y rounded-2xl border border-sky-200 bg-white">
                    {faqItems.map((f) => (
                        <details key={f.q} className="group p-5 open:bg-sky-50">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-sky-900">
                                <span className="inline-flex items-center gap-2">
                                    <ChevronIcon className="h-4 w-4 text-sky-600 transition group-open:rotate-90" />
                                    {f.q}
                                </span>
                            </summary>
                            <p className="mt-3 text-sm text-gray-700">{f.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
