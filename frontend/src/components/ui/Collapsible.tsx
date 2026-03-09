
"use client";

import React, { useState } from "react";
import cn from "@/components/lib/cn";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export default function Collapsible({
    title,
    children,
    defaultOpen = false,
    className = "",
}: CollapsibleProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div
            className={cn(
                "w-full rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm",
                "dark:border-slate-800 dark:bg-slate-950/60",
                className
            )}
        >
            <button
                type="button"
                className={cn(
                    "flex w-full items-center justify-between gap-2 text-left",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
                    "dark:focus-visible:ring-teal-400/40"
                )}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span className={cn("font-medium text-slate-900", "dark:text-slate-100")}>
                    {!open ? title : ""}
                </span>

                <ChevronDown
                    className={cn(
                        "h-5 w-5 transition-transform",
                        "text-slate-700 dark:text-teal-300",
                        open ? "rotate-180" : "rotate-0"
                    )}
                />
            </button>

            <div
                className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className={cn("min-h-0 overflow-hidden pt-2", "text-slate-800 dark:text-slate-200")}>
                    {children}
                </div>
            </div>
        </div>
    );
}