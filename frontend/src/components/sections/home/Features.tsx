
import Card from "@/components/ui/Card";
import { featureItems } from "@/components/lib/data/home";

export default function Features() {
    const iconMap = { book: BookIcon, bolt: BoltIcon, repeat: RepeatIcon } as const;

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {featureItems.map(({ title, desc, icon }) => {
                        const Icon = iconMap[icon as keyof typeof iconMap];
                        return (
                            <Card key={title} className="p-6">
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                                    <Icon className="h-5 w-5 text-sky-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                <p className="mt-1 text-sm text-gray-700">{desc}</p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 3v15.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}
function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}
function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path d="M17 2v4H7a5 5 0 0 0-5 5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 22v-4h10a5 5 0 0 0 5-5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 2l3 3-3 3M7 22l-3-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
