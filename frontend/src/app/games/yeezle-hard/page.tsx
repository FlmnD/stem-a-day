'use client';
import { useState, useMemo } from "react";
import elementsJSON from "../../../../elements.json";

interface ElementData {
  name: string;
  symbol: string;
  electronegativity?: number | null;
  electron_affinity?: number | null;
  ionization_energies?: number[];
  atomic_radius?: number | null;
}

interface Guess {
  element: string;
  electronegativity: number;
  electronAffinity: number;
  ionizationEnergy: number;
  atomicRadius: number;
}

const yellowRange = {
  electronegativity: 1,
  electronAffinity: 10,
  ionizationEnergy: 100,
  atomicRadius: 7,
};

const safeValue = (value: number | null | undefined, defaultValue = 0) => value ?? defaultValue;

const elementsData: ElementData[] = elementsJSON.elements;

export default function HardYeezle() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!input) return [];
    return elementsData.filter(
      (e) =>
        e.name.toLowerCase().includes(input.toLowerCase()) ||
        e.symbol.toLowerCase().includes(input.toLowerCase())
    );
  }, [input]);

  const addGuess = (element: ElementData) => {
    const newGuess: Guess = {
      element: element.name,
      electronegativity: safeValue(element.electronegativity),
      electronAffinity: safeValue(element.electron_affinity),
      ionizationEnergy: safeValue(element.ionization_energies ? element.ionization_energies[0] : null),
      atomicRadius: safeValue(element.atomic_radius),
    };
    setGuesses([...guesses, newGuess]);
    setInput("");
    setShowDropdown(false);
  };

  const getColor = (guessValue: number, actualValue: number, range: number) => {
    if (guessValue === actualValue) return "bg-green-300";
    if (Math.abs(guessValue - actualValue) <= range) return "bg-yellow-300";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Hard Yeezle</h1>

      <div className="relative w-96 mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded shadow focus:outline-none"
          placeholder="Type element name or symbol"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border rounded mt-1 shadow">
            {filteredOptions.map((e) => (
              <div
                key={e.name}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => addGuess(e)}
              >
                {e.name} ({e.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="px-4 py-2 border">Element</th>
              <th className="px-4 py-2 border">Electronegativity</th>
              <th className="px-4 py-2 border">Electron Affinity</th>
              <th className="px-4 py-2 border">1st Ionization Energy</th>
              <th className="px-4 py-2 border">Atomic Radius</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((g, i) => {
              const actual = elementsData.find((e) => e.name === g.element)!;
              return (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{g.element}</td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.electronegativity,
                      safeValue(actual.electronegativity),
                      yellowRange.electronegativity
                    )}`}
                  >
                    {g.electronegativity}
                  </td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.electronAffinity,
                      safeValue(actual.electron_affinity),
                      yellowRange.electronAffinity
                    )}`}
                  >
                    {g.electronAffinity}
                  </td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.ionizationEnergy,
                      safeValue(actual.ionization_energies ? actual.ionization_energies[0] : null),
                      yellowRange.ionizationEnergy
                    )}`}
                  >
                    {g.ionizationEnergy}
                  </td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.atomicRadius,
                      safeValue(actual.atomic_radius),
                      yellowRange.atomicRadius
                    )}`}
                  >
                    {g.atomicRadius}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
