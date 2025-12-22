"use client";

import React from "react";
import Link from "next/link";
import { Star, FlaskConical, Atom } from "lucide-react";

export default function Games() {
    return (
        <section className="min-h-[calc(100dvh-3.5rem)] bg-linear-to-b from-sky-50 via-white to-white px-6 py-10">
            <h1 className="text-3xl font-bold text-sky-800 mb-2">Chemistry Games</h1>
            <p className="text-gray-600 mb-10">
                Test your periodic table skills with our Carble and Snake challenges!
            </p>

            <div className="grid md:grid-cols-2 gap-9 mb-16">
                <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="text-sky-500" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Carble: Common Characteristics
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Difficulty: <span className="font-medium text-green-600">Easy</span></p>
                    <p className="text-gray-700 mb-6">
                        Guess the element based on its <strong>basic characteristics</strong> like
                        element name, symbol, atomic number, atomic mass, and ion charge.
                        You get 8 guesses and hints show how close you are!
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Star className="text-yellow-400" size={14} />
                        <span>Yellow = near correct (within range)</span>
                        <Star className="text-green-500" size={14} />
                        <span>Green = exact match</span>
                    </div>
                    <Link
                        href="/games/carble-easy"
                        className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        Play Easy Version
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-red-100 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Atom className="text-red-500" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Carble: Periodic Trends
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Difficulty: <span className="font-medium text-red-600">Hard</span></p>
                    <p className="text-gray-700 mb-6">
                        Test your mastery of <strong>periodic trends</strong>: atomic radius,
                         ionization energy, and electronegativity.  
                        Use logic to guess the element in 16 tries!
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Star className="text-yellow-400" size={14} />
                        <span>Yellow = near correct (within range)</span>
                        <Star className="text-green-500" size={14} />
                        <span>Green = exact match</span>
                    </div>
                    <Link
                        href="/games/carble-hard"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        Play Hard Version
                    </Link>
                </div>
            </div>


            <div className="grid md:grid-cols-2 gap-9 mb-16">
                <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="text-sky-500" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Snake: Nomenclature
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Difficulty: <span className="font-medium text-green-600">Easy</span></p>
                    <p className="text-gray-700 mb-6">
                        Test your chemistry <strong>nomenclature</strong> knowledge in this educational Snake game.
                         Guide the snake to the correct chemical formula while avoiding wrong answers.
                         Grow your snake, think fast, and win by mastering compounds!
                    </p>
                    {/*<div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Star className="text-yellow-400" size={14} />
                        <span>Yellow = near correct (within range)</span>
                        <Star className="text-green-500" size={14} />
                        <span>Green = exact match</span>
                    </div>*/}
                    <Link
                        href="/games/snake-easy"
                        className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        Play Easy Version
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-red-100 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Atom className="text-red-500" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Snake: Intermolecular Forces (IMF)
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Difficulty: <span className="font-medium text-red-600">Hard</span></p>
                    <p className="text-gray-700 mb-6">
                        little preview text about the hard version of snake game
                    </p>
                    {/*<div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Star className="text-yellow-400" size={14} />
                        <span>Yellow = near correct (within range)</span>
                        <Star className="text-green-500" size={14} />
                        <span>Green = exact match</span>
                    </div>*/}
                    <Link
                        href="/games/snake-hard"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        Play Hard Version
                    </Link>
                </div>
            </div>
        </section>

        
    );
}
