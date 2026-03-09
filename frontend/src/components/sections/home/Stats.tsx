
import { statsData } from "@/components/lib/data/home";

export default function Stats() {
    return (
        <section
            className="bg-linear-to-r from-sky-600 to-emerald-600
            dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div
                    className="grid grid-cols-2 gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-sm backdrop-blur sm:grid-cols-4
                    dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    {statsData.map((d) => (
                        <div key={d.k} className="text-white dark:text-slate-100">
                            <div className="text-2xl font-bold">{d.v}</div>
                            <div className="text-xs text-white/80 dark:text-slate-300">{d.k}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}