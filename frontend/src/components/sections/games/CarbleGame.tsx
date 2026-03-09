
"use client";
import "@/components/sections/games/PeriodicTable";
import {
    ElementRange,
    ElementData,
    Guess,
    HardGuess,
    EasyGuess,
    elementsData,
    AnyGuess,
} from "@/structures/CarbleStructures";
import { Lesson, Article } from "@/structures/GameStructures";
import { useState, useMemo, useEffect } from "react";
import { Info } from "lucide-react";
import PeriodicTable from "@/components/sections/games/PeriodicTable";
import React from "react";
import StemLink from "@/components/ui/StemLink";
import Collapsible from "@/components/ui/Collapsible";

interface Props {
    yellowRange: ElementRange;
    guessFormat: Guess;
    CarbleLesson: Lesson;
    CarbleArticle: Article;
}

function isEasyGuess(g: AnyGuess): g is EasyGuess {
    return "atomicNumber" in g;
}

function isHardGuess(g: AnyGuess): g is HardGuess {
    return "atomicRadius" in g;
}

export default function CarbleGame({
    yellowRange,
    guessFormat,
    CarbleLesson,
    CarbleArticle,
}: Props): React.JSX.Element {
    const [guesses, setGuesses] = useState<AnyGuess[]>([]);
    const [input, setInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [targetElement, setTargetElement] = useState<ElementData | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [alert, setAlert] = useState(false);
    const [won, setWon] = useState(false);
    const [pinkElements, setPinkElements] = useState<string[]>([]);

    const [rewardPopupOpen, setRewardPopupOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [rewardStatus, setRewardStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [rewardMessage, setRewardMessage] = useState("");

    const startNewGame = () => {
        const sAndPElements = elementsData.filter((e) => e.block !== "d" && e.block !== "f");
        const randomIndex = Math.floor(Math.random() * sAndPElements.length);
        setTargetElement(sAndPElements[randomIndex]);
        setGuesses([]);
        setInput("");
        setShowDropdown(false);
        setGameOver(false);
        setAlert(false);
        setWon(false);
        setPinkElements(
            elementsData.filter((e) => e.block === "s" || e.block === "p").map((e) => e.symbol)
        );

        setRewardPopupOpen(false);
        setRewardAmount(0);
        setRewardStatus("idle");
        setRewardMessage("");
    };

    useEffect(() => {
        startNewGame();
    }, []);

    const filteredOptions = useMemo(() => {
        if (!input) return [...elementsData].sort((a, b) => a.atomic_number - b.atomic_number);
        const lowerInput = input.toLowerCase();
        const matches = elementsData.filter(
            (e) =>
                e.symbol.toLowerCase().includes(lowerInput) ||
                e.element_name.toLowerCase().includes(lowerInput)
        );
        matches.sort((a, b) => {
            const aSymbolMatch = a.symbol.toLowerCase() === lowerInput ? 0 : 1;
            const bSymbolMatch = b.symbol.toLowerCase() === lowerInput ? 0 : 1;
            if (aSymbolMatch !== bSymbolMatch) return aSymbolMatch - bSymbolMatch;
            return a.atomic_number - b.atomic_number;
        });
        return matches;
    }, [input]);

    async function awardGlucose(amount: number) {
        setRewardAmount(amount);
        setRewardPopupOpen(true);
        setRewardStatus("loading");
        setRewardMessage("");

        try {
            const r = await fetch("/api/glucose/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await r.json().catch(() => ({}));

            if (!r.ok) {
                setRewardStatus("error");
                setRewardMessage(data?.message ?? data?.detail ?? "Failed to add glucose.");
                return;
            }

            setRewardStatus("ok");
            setRewardMessage(`You earned ${amount} glucose!`);
        } catch {
            setRewardStatus("error");
            setRewardMessage("Network error. Could not update glucose.");
        }
    }

    const guessLength = guessFormat == Guess.EasyGuess ? 8 : 16;

    const addGuess = (element: ElementData) => {
        if (!targetElement || gameOver) return;

        if (guesses.some((g) => g.symbol === element.symbol)) {
            setAlert(true);
            return;
        }

        let newGuess: AnyGuess;

        if (guessFormat == Guess.HardGuess) {
            newGuess = {
                element_name: element.element_name,
                symbol: element.symbol,
                atomicRadius: element.atomic_radius,
                ionizationEnergy: element.first_ionization_energy,
                electronegativity: element.electronegativity,
            } satisfies HardGuess;
        } else {
            newGuess = {
                element_name: element.element_name,
                symbol: element.symbol,
                atomicNumber: element.atomic_number,
                atomicMass: element.atomic_mass,
                ionCharge: element.ion_charge,
            } satisfies EasyGuess;
        }

        setGuesses([...guesses, newGuess]);
        setInput("");
        setShowDropdown(false);
        setAlert(false);

        if (element.symbol === targetElement.symbol) {
            setWon(true);
            setGameOver(true);

            const glucoseEarned = guessFormat === Guess.EasyGuess ? 15 : 35;
            void awardGlucose(glucoseEarned);
        } else if (guesses.length + 1 >= guessLength) {
            setGameOver(true);
        }
    };

    const getColorNumeric = (guessValue: number, actualValue: number, range: number) => {
        if (guessValue === actualValue) return "bg-green-300 dark:bg-emerald-500/40";
        if (Math.abs(guessValue - actualValue) <= range) return "bg-yellow-300 dark:bg-yellow-400/30";
        return "";
    };

    const getColorString = (guessValue: string, actualValue: string) =>
        guessValue === actualValue ? "bg-green-300 dark:bg-emerald-500/40" : "";

    const displayRows =
        gameOver && targetElement && !won
            ? [
                ...guesses,
                guessFormat === Guess.EasyGuess
                    ? {
                        element_name: targetElement.element_name,
                        symbol: targetElement.symbol,
                        atomicNumber: targetElement.atomic_number,
                        atomicMass: targetElement.atomic_mass,
                        ionCharge: targetElement.ion_charge,
                    }
                    : {
                        element_name: targetElement.element_name,
                        symbol: targetElement.symbol,
                        atomicRadius: targetElement.atomic_radius,
                        ionizationEnergy: targetElement.first_ionization_energy,
                        electronegativity: targetElement.electronegativity,
                    },
            ]
            : guesses;

    const guessedSymbols = guesses.map((g) => g.symbol);

    const getTableArgs = (element: ElementData) => {
        const guessed = guessedSymbols.includes(element.symbol);
        const isAnswer = element.symbol === targetElement?.symbol && gameOver;
        const isPink = pinkElements.includes(element.symbol);

        return ` ${guessed ? "bg-gray-300 dark:bg-slate-700" : ""}
                    ${isAnswer ? "bg-green-500 font-bold text-white dark:bg-emerald-500/70" : ""}
                    ${isPink && !guessed && !isAnswer ? "bg-pink-300 dark:bg-pink-500/25" : ""}`;
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100 dark:bg-black dark:text-slate-100">
                {guessFormat == Guess.EasyGuess && (
                    <h1 className="text-3xl font-bold mb-6">Carble: Common Characteristics</h1>
                )}
                {guessFormat == Guess.HardGuess && (
                    <h1 className="text-3xl font-bold mb-6">Carble: Periodic Trends</h1>
                )}

                <Collapsible title="Learn More!" className="max-w-7xl" defaultOpen={true}>
                    <CarbleArticle />
                </Collapsible>

                <CarbleLesson />

                <PeriodicTable
                    onElementClick={addGuess}
                    guessFormat={guessFormat}
                    classNameArgs={getTableArgs}
                />

                <div className="relative w-96 mt-6 mb-4">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded shadow focus:outline-none
                                   dark:bg-slate-950/60 dark:border-slate-700 dark:text-slate-100"
                        placeholder="Type element name or symbol"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
                        disabled={gameOver}
                    />

                    {showDropdown && (
                        <div
                            className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border rounded mt-1 shadow
                                        dark:bg-slate-950 dark:border-slate-700"
                        >
                            {filteredOptions.map((e) => (
                                <div
                                    key={e.symbol}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-slate-800"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        addGuess(e);
                                    }}
                                >
                                    {e.element_name} ({e.symbol})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-4 text-gray-700 dark:text-slate-300">
                    <p className="m-auto text-lg inline mr-10">
                        <strong>
                            Guesses: {guesses.length}/{guessLength}
                        </strong>
                    </p>
                    <p className="italic text-sm inline">
                        When in doubt, choose Carbon, the center of life!
                    </p>
                </div>

                {alert && (
                    <div className="mb-4 rounded px-3 py-2 bg-yellow-200 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200">
                        Already guessed that element.
                    </div>
                )}

                {gameOver && (
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <div
                            className={`p-2 rounded ${won
                                    ? "bg-green-200 dark:bg-emerald-500/20"
                                    : "bg-red-200 dark:bg-red-500/15"
                                }`}
                        >
                            {won
                                ? "Congratulations! You guessed the element!"
                                : `Game Over! You Lost! The element was ${targetElement?.element_name} (${targetElement?.symbol})!`}
                        </div>

                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600
                                       dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                            onClick={startNewGame}
                        >
                            Play Again
                        </button>
                    </div>
                )}

                <div className="overflow-x-auto w-full max-w-4xl">
                    <table className="min-w-full bg-white rounded shadow dark:bg-slate-950/60 dark:border dark:border-slate-700">
                        <thead>
                            {guessFormat == Guess.EasyGuess && (
                                <tr className="bg-gray-200 text-center dark:bg-slate-900">
                                    <th className="px-4 py-2 border dark:border-slate-700">Element</th>
                                    <th className="px-4 py-2 border dark:border-slate-700">Symbol</th>
                                    <th className="px-4 py-2 border dark:border-slate-700">
                                        Atomic Number (+/-5)
                                    </th>
                                    <th className="px-4 py-2 border dark:border-slate-700">
                                        Atomic Mass (+/-15)
                                    </th>
                                    <th className="px-4 py-2 border dark:border-slate-700">
                                        Ionic Charge (+/-2)
                                    </th>
                                    <th className="px-4 py-2 border dark:border-slate-700">Info</th>
                                </tr>
                            )}

                            {guessFormat == Guess.HardGuess && (
                                <tr className="bg-gray-200 text-center dark:bg-slate-900">
                                    <th className="px-4 py-2 border dark:border-slate-700">Element</th>
                                    <th className="px-4 py-2 border dark:border-slate-700">Symbol</th>
                                    <th className="px-4 py-2 border dark:border-slate-700">
                                        Atomic Radius (+/-25)
                                    </th>
                                    <th className="px-4 py-2 border dark:border-slate-700">
                                        Ionization Energy (+/-50)
                                    </th>
                                    <th className="px-4 py-2 border dark:border-slate-700">
                                        Electronegativity (+/-2)
                                    </th>
                                    <th className="px-4 py-2 border dark:border-slate-700">Info</th>
                                </tr>
                            )}
                        </thead>

                        <tbody>
                            {displayRows.map((g, i) => {
                                const actual = targetElement!;

                                if (guessFormat === Guess.EasyGuess && isEasyGuess(g)) {
                                    return (
                                        <tr key={i} className="text-center">
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorString(
                                                    g.element_name,
                                                    actual.element_name
                                                )}`}
                                            >
                                                {g.element_name}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorString(
                                                    g.symbol,
                                                    actual.symbol
                                                )}`}
                                            >
                                                {g.symbol}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorNumeric(
                                                    g.atomicNumber,
                                                    actual.atomic_number,
                                                    yellowRange.atomicNumber
                                                )}`}
                                            >
                                                {g.atomicNumber}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorNumeric(
                                                    g.atomicMass,
                                                    actual.atomic_mass,
                                                    yellowRange.atomicMass
                                                )}`}
                                            >
                                                {g.atomicMass}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorNumeric(
                                                    g.ionCharge,
                                                    actual.ion_charge,
                                                    yellowRange.ionCharge
                                                )}`}
                                            >
                                                {g.ionCharge}
                                            </td>
                                            <td className="border px-4 py-2 dark:border-slate-700">
                                                <strong>
                                                    <a
                                                        href={
                                                            "https://www.webelements.com/" +
                                                            g.element_name.toLowerCase()
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-500 dark:text-teal-300"
                                                    >
                                                        <center>
                                                            <Info />
                                                        </center>
                                                    </a>
                                                </strong>
                                            </td>
                                        </tr>
                                    );
                                }

                                if (guessFormat === Guess.HardGuess && isHardGuess(g)) {
                                    return (
                                        <tr key={i} className="text-center">
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorString(
                                                    g.element_name,
                                                    actual.element_name
                                                )}`}
                                            >
                                                {g.element_name}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorString(
                                                    g.symbol,
                                                    actual.symbol
                                                )}`}
                                            >
                                                {g.symbol}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorNumeric(
                                                    g.atomicRadius,
                                                    actual.atomic_radius,
                                                    yellowRange.atomicRadius
                                                )}`}
                                            >
                                                {g.atomicRadius}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorNumeric(
                                                    g.ionizationEnergy,
                                                    actual.first_ionization_energy,
                                                    yellowRange.ionizationEnergy
                                                )}`}
                                            >
                                                {g.ionizationEnergy}
                                            </td>
                                            <td
                                                className={`border px-4 py-2 dark:border-slate-700 ${getColorNumeric(
                                                    g.electronegativity,
                                                    actual.electronegativity,
                                                    yellowRange.electronegativity
                                                )}`}
                                            >
                                                {g.electronegativity}
                                            </td>
                                            <td className="border px-4 py-2 dark:border-slate-700">
                                                <StemLink
                                                    url={
                                                        "https://www.webelements.com/" +
                                                        g.element_name.toLowerCase()
                                                    }
                                                >
                                                    <center>
                                                        <Info />
                                                    </center>
                                                </StemLink>
                                            </td>
                                        </tr>
                                    );
                                }

                                return null;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {rewardPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Reward Earned!
                        </h2>

                        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
                            You earned <span className="font-bold">{rewardAmount}</span> glucose.
                        </p>

                        <div className="mt-4 text-sm">
                            {rewardStatus === "loading" && (
                                <p className="text-slate-600 dark:text-slate-300">
                                    Updating glucose...
                                </p>
                            )}
                            {rewardStatus === "ok" && (
                                <p className="text-emerald-700 dark:text-emerald-300">
                                    {rewardMessage}
                                </p>
                            )}
                            {rewardStatus === "error" && (
                                <p className="text-red-700 dark:text-red-300">{rewardMessage}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setRewardPopupOpen(false)}
                                className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700
                                           dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}