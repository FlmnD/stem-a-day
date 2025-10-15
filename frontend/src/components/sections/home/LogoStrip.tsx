export default function LogoStrip() {
    return (
        <section className="bg-sky-50/60">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <p className="text-center text-xs font-medium uppercase tracking-wider text-sky-800">
                    Trusted by learners from
                </p>
                <div className="mt-4 grid grid-cols-2 place-items-center gap-6 opacity-90 sm:grid-cols-4">
                    <Logo text="AP Physics" />
                    <Logo text="AP Calc" />
                    <Logo text="UIL CS" />
                    <Logo text="Robotics" />
                </div>
            </div>
        </section>
    );
}

function Logo({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-800">
            <div className="h-6 w-6 rounded-md bg-emerald-200" />
            <span>{text}</span>
        </div>
    );
}
