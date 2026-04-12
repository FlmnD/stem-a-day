import cn from "@/components/lib/cn"; 

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "" }: Props) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/20 dark:hover:shadow-black/30",
                className
            )}
        >
            {children}
        </div>
    );
}
