
import { dailyLessons } from "@/components/lib/data/home";

export default function DailyPreview() {
    return (
        <section className="bg-gradient-to-b from-white to-sky-50/70">
            <div className="mx-auto max-w-6xl px-4 pb-10 pt-8">
                <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-sky-900">Today’s lineup</h2>
                        <a href="/lessons" className="text-sm font-medium text-sky-700 hover:underline">
                            View all lessons →
                        </a>
                    </div>
                    <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        {dailyLessons.map((l) => (
                            <li
                                key={l.title}
                                className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 transition hover:bg-sky-100"
                            >
                                <span className="text-xs font-medium text-sky-700">{l.tag}</span>
                                <p className="mt-1 font-medium text-gray-900">{l.title}</p>
                                <p className="mt-1 text-sm text-gray-600">{l.time}</p>
                                <a href="/lesson/demo" className="mt-3 inline-flex text-sm font-medium text-sky-700 hover:underline">
                                    Start lesson
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}