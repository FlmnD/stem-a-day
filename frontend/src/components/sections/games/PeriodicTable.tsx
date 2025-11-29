'use client';

import { elementsData, ElementData, Guess } from "@/structures/CarbleStructures";
import React from "react";

type Props = {
    onElementClick?: (element: ElementData) => void;
    classNameArgs?: (element: ElementData) => string;
    guessFormat: Guess;
};

const periods = Array.from({ length: 7 }, (_, i) => i + 1);
const groups = Array.from({ length: 18 }, (_, i) => i + 1);

const getTableTitle = (guessFormat: Guess, element: ElementData) => {
    if (guessFormat == Guess.HardGuess) {
        return `Element: ${element.element_name}\n` +
            `Symbol: ${element.symbol}\n` +
            `Electronegativity: ${element.electronegativity}\n` +
            `Electron Affinity: ${element.electron_affinity}\n` +
            `1st Ionization Energy: ${element.first_ionization_energy}\n`+
            `Atomic Radius: ${element.atomic_radius}`;
    } else {
        return `Element: ${element.element_name}\n` +
            `Symbol: ${element.symbol}\n` +
            `Atomic Number: ${element.atomic_number}\n` +
            `Atomic Mass: ${element.atomic_mass}\n` +
            `Ionic Charge: ${element.ion_charge}\n`;
    }
}


export default function PeriodicTable({ classNameArgs, onElementClick, guessFormat }: Props): React.JSX.Element {

    return (

        <> {periods.map(period => (
            <div key={period} className="flex gap-1">
                {groups.map(group => {
                    const element = elementsData.find(e => e.period === period && e.group === group);
                    if (!element) return <div key={group} className="w-8 h-8"></div>;
                    return (
                        <div
                            key={element.symbol}
                            className={`w-8 h-8 flex items-center justify-center text-xs border rounded cursor-pointer
                   ${classNameArgs?.(element)}`}
                            onClick={() => onElementClick?.(element)}
                            title={
                                getTableTitle(guessFormat, element)
                            }
                        >
                            {element.symbol}
                        </div>
                    );
                })}
            </div>
        ))}
            < div className="flex gap-1 mt-8">
                {elementsData
                    .filter(e => e.period === 6 && e.block === 'f')
                    .map(element => {
                        return (
                            <div
                                key={element.symbol}
                                className={`w-8 h-8 flex items-center justify-center text-xs border rounded cursor-pointer
                   ${classNameArgs?.(element)}`}
                                onClick={() => onElementClick?.(element)}
                                title={
                                    getTableTitle(guessFormat, element)
                                }
                            >
                                {element.symbol}
                            </div>
                        );
                    })}
            </div>


            <div className="flex gap-1 mt-2">
                {elementsData
                    .filter(e => e.period === 7 && e.block === 'f')
                    .map(element => {
                        return (
                            <div
                                key={element.symbol}
                                className={`w-8 h-8 flex items-center justify-center text-xs border rounded cursor-pointer
                   ${classNameArgs?.(element)}`}
                                onClick={() => onElementClick?.(element)}
                                title={
                                    getTableTitle(guessFormat, element)
                                }
                            >
                                {element.symbol}
                            </div>
                        );
                    })}
            </div>
        </>
    );
};