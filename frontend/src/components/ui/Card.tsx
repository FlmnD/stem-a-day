import cn from "@/components/lib/cn"; 

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "" }: Props) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:shadow-md",
                className
            )}
        >
            {children}
        </div>
    );
}
