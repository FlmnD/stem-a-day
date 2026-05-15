"use client";

import React, { useState } from "react";

import cn from "@/components/lib/cn";

type PasswordFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordField({
    className,
    disabled,
    ...props
}: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                disabled={disabled}
                type={isVisible ? "text" : "password"}
                className={cn(className, "pr-16")}
            />

            <button
                type="button"
                onClick={() => setIsVisible((current) => !current)}
                disabled={disabled}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                className="absolute inset-y-0 right-3 my-auto h-fit rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-teal-300 dark:hover:bg-slate-800/80"
            >
                {isVisible ? "Hide" : "Show"}
            </button>
        </div>
    );
}
