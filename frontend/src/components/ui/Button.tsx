
import Link from "next/link";

type Props = {
    as?: "button" | "a" | "link";
    href?: string;
    children: React.ReactNode;
    variant?: "primary" | "outline" | "ghost";
    className?: string;
};

export default function Button({
    as = "button",
    href,
    children,
    variant = "primary",
    className = "",
}: Props) {
    const base =
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition will-change-transform hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300";
    const variants = {
        primary: "bg-sky-600 text-white hover:brightness-95",
        outline: "border border-sky-200 text-sky-700 hover:bg-sky-50",
        ghost: "text-sky-700 hover:bg-sky-50",
    } as const;

    const cls = `${base} ${variants[variant]} ${className}`;

    if (as === "link") return <Link href={href ?? "#"} className={cls}>{children}</Link>;
    if (as === "a") return <a href={href} className={cls}>{children}</a>;
    return <button className={cls}>{children}</button>;
}
