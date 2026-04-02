"use client";

import React from "react";
import Link from "next/link";
import { Star, FlaskConical, Atom } from "lucide-react";

export default function Games() {
    return (
        <section
            className="min-h-[calc(100dvh-3.5rem)] px-6 py-10
      bg-linear-to-b from-sky-50 via-white to-white
      dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <h1 className="text-3xl font-bold text-sky-800 dark:text-slate-100 mb-2">
                Chemistry Games
            </h1>
            <p className="text-gray-600 dark:text-slate-300 mb-10">
                Test your periodic table skills with our Carble and Snake challenges!
            </p>

            <div className="grid md:grid-cols-2 gap-9 mb-16">
                <div
                    className="rounded-2xl p-6 shadow-md border border-sky-100 bg-white hover:shadow-lg transition-all duration-200
          dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="text-sky-500 dark:text-teal-300" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                            Carble: Common Characteristics
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-300 mb-4">
                        Difficulty: <span className="font-medium text-green-600 dark:text-emerald-300">Easy</span>
                    </p>

                    <p className="text-gray-700 dark:text-slate-200 mb-6">
                        Guess the element based on its <strong>basic characteristics</strong> like
                        element name, symbol, atomic number, atomic mass, and ion charge.
                        You get 8 guesses and hints show how close you are!
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                            <Star className="text-yellow-400" size={14} />
                            <span>Yellow = near correct (within range)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="text-green-500" size={14} />
                            <span>Green = exact match</span>
                        </div>
                    </div>

                    <Link
                        href="/games/carble-easy"
                        className="inline-block rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 transition-all
            dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Play Easy Version
                    </Link>
                </div>

                <div
                    className="rounded-2xl p-6 shadow-md border border-red-100 bg-white hover:shadow-lg transition-all duration-200
          dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Atom className="text-red-500 dark:text-rose-300" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                            Carble: Periodic Trends
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-300 mb-4">
                        Difficulty: <span className="font-medium text-red-600 dark:text-rose-300">Hard</span>
                    </p>

                    <p className="text-gray-700 dark:text-slate-200 mb-6">
                        Test your mastery of <strong>periodic trends</strong>: atomic radius,
                        ionization energy, and electronegativity. Use logic to guess the element in 16 tries!
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                            <Star className="text-yellow-400" size={14} />
                            <span>Yellow = near correct (within range)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="text-green-500" size={14} />
                            <span>Green = exact match</span>
                        </div>
                    </div>

                    <Link
                        href="/games/carble-hard"
                        className="inline-block rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 transition-all
            dark:bg-rose-500 dark:hover:bg-rose-400"
                    >
                        Play Hard Version
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-9 mb-16">
                <div
                    className="rounded-2xl p-6 shadow-md border border-sky-100 bg-white hover:shadow-lg transition-all duration-200
          dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="text-sky-500 dark:text-teal-300" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                            Snake: Chemical Nomenclature
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-300 mb-4">
                        Difficulty: <span className="font-medium text-green-600 dark:text-emerald-300">Easy</span>
                    </p>

                    <p className="text-gray-700 dark:text-slate-200 mb-6">
                        Test your chemistry <strong>nomenclature</strong> knowledge in this educational Snake game.
                        Guide the snake to the correct chemical formula while avoiding wrong answers.
                        Grow your snake, think fast, and win by mastering compounds!
                    </p>

                    <Link
                        href="/games/snake-easy"
                        className="inline-block rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 transition-all
            dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Play Easy Version
                    </Link>
                </div>

                <div
                    className="rounded-2xl p-6 shadow-md border border-red-100 bg-white hover:shadow-lg transition-all duration-200
          dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Atom className="text-red-500 dark:text-rose-300" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                            Snake: Intermolecular Forces (IMF)
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-300 mb-4">
                        Difficulty: <span className="font-medium text-red-600 dark:text-rose-300">Hard</span>
                    </p>

                    <p className="text-gray-700 dark:text-slate-200 mb-6">
                        Put your chemistry skills to the test with <strong>intermolecular forces</strong>.
                        Chase the correct interaction, dodge the wrong ones, and survive as the challenge gets harder.
                    </p>

                    <Link
                        href="/games/snake-hard"
                        className="inline-block rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 transition-all
            dark:bg-rose-500 dark:hover:bg-rose-400"
                    >
                        Play Hard Version
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-9 mb-16">
                <div
                    className="rounded-2xl p-6 shadow-md border border-sky-100 bg-white hover:shadow-lg transition-all duration-200
          dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="text-sky-500 dark:text-teal-300" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                            Pips: Molarity
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-300 mb-4">
                        Difficulty: <span className="font-medium text-green-600 dark:text-emerald-300">Easy</span>
                    </p>

                    <p className="text-gray-700 dark:text-slate-200 mb-6">
                        Put your chemistry skills to the test with <strong>molarity</strong>.
                        Match each domino to its correct relationship on the concept map.
                    </p>

                    <Link
                        href="/games/pips-easy"
                        className="inline-block rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 transition-all
            dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                    >
                        Play Easy Version
                    </Link>
                </div>

                <div
                    className="rounded-2xl p-6 shadow-md border border-red-100 bg-white hover:shadow-lg transition-all duration-200
          dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Atom className="text-red-500 dark:text-rose-300" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                            Pips: Gas Laws
                        </h2>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-300 mb-4">
                        Difficulty: <span className="font-medium text-red-600 dark:text-rose-300">Hard</span>
                    </p>

                    <p className="text-gray-700 dark:text-slate-200 mb-6">
                        Put your chemistry skills to the test with <strong>gas laws</strong>.
                        Match each domino to its correct law and state on the concept map.
                    </p>

                    <Link
                        href="/games/pips-hard"
                        className="inline-block rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 transition-all
            dark:bg-rose-500 dark:hover:bg-rose-400"
                    >
                        Play Hard Version
                    </Link>
                </div>
            </div>
        </section>
    );
}