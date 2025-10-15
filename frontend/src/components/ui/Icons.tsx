import React from "react";

export function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path
                d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Zm6 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM6 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path
                d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path d="M7 3v15.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path
                d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path
                d="M17 2v4H7a5 5 0 0 0-5 5v1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M7 22v-4h10a5 5 0 0 0 5-5v-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M17 2l3 3-3 3M7 22l-3-3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
