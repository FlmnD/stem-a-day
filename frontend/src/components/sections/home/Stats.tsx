import { statsData } from "@/components/lib/data/home";

export default function Stats() {
    return (
        <section className="bg-gradient-to-r from-sky-600 to-emerald-600">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-sm backdrop-blur sm:grid-cols-4">
                    {statsData.map((d) => (
                        <div key={d.k} className="text-white">
                            <div className="text-2xl font-bold">{d.v}</div>
                            <div className="text-xs text-white/80">{d.k}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
