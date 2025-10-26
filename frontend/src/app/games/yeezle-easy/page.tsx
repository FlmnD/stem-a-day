'use client';
import { useState, useMemo } from "react";
import elementsJSON from "../../../../elements.json";

interface ElementData {
  name: string;
  symbol: string;
  number: number;
  atomic_mass: number;
  group?: number;
}

interface Guess {
  element: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  ionCharge: number;
}

const yellowRange = {
  atomicNumber: 5,
  atomicMass: 15,
  ionCharge: 2,
};

const elementsData: ElementData[] = elementsJSON.elements;

export default function EasyYeezle() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const safeIonCharge = (e: ElementData) =>
    e.group !== undefined ? (e.group <= 2 ? e.group : e.group - 10) : 0;

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
      symbol: element.symbol,
      atomicNumber: element.number,
      atomicMass: element.atomic_mass,
      ionCharge: safeIonCharge(element),
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
      <h1 className="text-3xl font-bold mb-6">Easy Yeezle</h1>

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
                key={e.number}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => addGuess(e)}
              >
                {e.name} ({e.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border">Element</th>
              <th className="px-4 py-2 border">Symbol</th>
              <th className="px-4 py-2 border">Atomic Number</th>
              <th className="px-4 py-2 border">Atomic Mass</th>
              <th className="px-4 py-2 border">Ion Charge</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((g, i) => {
              const actual = elementsData.find((e) => e.name === g.element)!;
              return (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{g.element}</td>
                  <td className="border px-4 py-2">{g.symbol}</td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.atomicNumber,
                      actual.number,
                      yellowRange.atomicNumber
                    )}`}
                  >
                    {g.atomicNumber}
                  </td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.atomicMass,
                      actual.atomic_mass,
                      yellowRange.atomicMass
                    )}`}
                  >
                    {g.atomicMass}
                  </td>
                  <td
                    className={`border px-4 py-2 ${getColor(
                      g.ionCharge,
                      safeIonCharge(actual),
                      yellowRange.ionCharge
                    )}`}
                  >
                    {g.ionCharge}
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
