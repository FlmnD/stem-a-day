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
                className
            )}
        >
            <button
                type="button"
                className="flex w-full items-center justify-between gap-2 text-left"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span className="font-medium text-slate-900">
                    {(!open)? title : ""}
                </span>

                <ChevronDown
                    className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="min-h-0 overflow-hidden pt-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
