'use client';
import { useState, useMemo, useEffect } from "react";
import elementsJSON from "../../../../elements.json";

interface ElementData {
  element_name: string;
  symbol: string;
  group: number; // Column
  period: number; // Row
  electronegativity: number | null;
  electron_affinity: number | null;
  first_ionization_energy: number | null;
  atomic_radius: number | null;
}

interface Guess {
  element_name: string;
  symbol: string;
  electronegativity: number;
  electronAffinity: number;
  ionizationEnergy: number;
  atomicRadius: number;
}

const yellowRange = {
  electronegativity: 2,
  electronAffinity: 25,
  ionizationEnergy: 50,
  atomicRadius: 25,
};

const elementsData: ElementData[] = (elementsJSON as any[]).map((e) => ({
  element_name: e.element_name,
  symbol: e.symbol,
  group: e.group ?? 1,
  period: e.period ?? 1,
  electronegativity: e.electronegativity ?? 0,
  electron_affinity: e.electron_affinity ?? 0,
  first_ionization_energy: e.first_ionization_energy ?? 0,
  atomic_radius: e.atomic_radius ?? 0,
}));

const learnDefinitions = [
  { term: "Electronegativity", definition: "Measure of how strongly an atom attracts electrons in a bond." },
  { term: "Electron Affinity", definition: "Energy released when an atom gains an electron." },
  { term: "1st Ionization Energy", definition: "Energy required to remove the first electron from a neutral atom." },
  { term: "Atomic Radius", definition: "Approximate size of an atom." },
];

export default function HardYeezle() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [targetElement, setTargetElement] = useState<ElementData | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * elementsData.length);
    setTargetElement(elementsData[randomIndex]);
    setGuesses([]);
    setInput("");
    setShowDropdown(false);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const safeValue = (val: number | null) => val ?? 0;

  const filteredOptions = useMemo(() => {
    if (!input) return [];
    return elementsData.filter(
      (e) =>
        e.element_name.toLowerCase().includes(input.toLowerCase()) ||
        e.symbol.toLowerCase().includes(input.toLowerCase())
    );
  }, [input]);

  const addGuess = (element: ElementData) => {
    if (!targetElement || gameOver) return;

    const newGuess: Guess = {
      element_name: element.element_name,
      symbol: element.symbol,
      electronegativity: safeValue(element.electronegativity),
      electronAffinity: safeValue(element.electron_affinity),
      ionizationEnergy: safeValue(element.first_ionization_energy),
      atomicRadius: safeValue(element.atomic_radius),
    };

    setGuesses([...guesses, newGuess]);
    setInput("");
    setShowDropdown(false);

    if (element.element_name === targetElement.element_name) {
      setWon(true);
      setGameOver(true);
    } else if (guesses.length + 1 >= 8) {
      setGameOver(true);
    }
  };

  const getColorNumeric = (guessValue: number, actualValue: number, range: number) => {
    if (guessValue === actualValue) return "bg-green-300";
    if (Math.abs(guessValue - actualValue) <= range) return "bg-yellow-300";
    return "";
  };

  const getColorString = (guessValue: string, actualValue: string) => {
    return guessValue === actualValue ? "bg-green-300" : "";
  };

  const displayRows = gameOver && targetElement ? [...guesses, {
    element_name: targetElement.element_name,
    symbol: targetElement.symbol,
    electronegativity: safeValue(targetElement.electronegativity),
    electronAffinity: safeValue(targetElement.electron_affinity),
    ionizationEnergy: safeValue(targetElement.first_ionization_energy),
    atomicRadius: safeValue(targetElement.atomic_radius)
  }] : guesses;

  const guessedSymbols = guesses.map(g => g.symbol);

  // Create a grid for periodic table (rows: 1-7, columns: 1-18)
  const periods = Array.from({ length: 7 }, (_, i) => i + 1);
  const groups = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Hard Yeezle</h1>

      {/* Learn Section */}
      <div className="w-full max-w-5xl mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Learn:</h2>
        <ul className="list-disc list-inside">
          {learnDefinitions.map(ld => (
            <li key={ld.term}><strong>{ld.term}:</strong> {ld.definition}</li>
          ))}
        </ul>
      </div>

      {/* Periodic Table Grid */}
      <div className="mb-6">
        {periods.map(period => (
          <div key={period} className="flex gap-1">
            {groups.map(group => {
              const element = elementsData.find(e => e.period === period && e.group === group);
              if (!element) return <div key={group} className="w-8 h-8"></div>;
              const guessed = guessedSymbols.includes(element.symbol);
              const isAnswer = gameOver && element.symbol === targetElement?.symbol;
              return (
                <div
                  key={element.symbol}
                  className={`w-8 h-8 flex items-center justify-center text-xs border rounded ${guessed ? "bg-gray-300" : "bg-white"} ${isAnswer ? "bg-green-400 font-bold" : ""}`}
                >
                  {element.symbol}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="relative w-96 mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded shadow focus:outline-none"
          placeholder="Type element name or symbol"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          disabled={gameOver}
        />
        {showDropdown && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border rounded mt-1 shadow">
            {filteredOptions.map((e) => (
              <div
                key={e.element_name}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => addGuess(e)}
              >
                {e.element_name} ({e.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Win/Lose Message + Play Again */}
      {gameOver && (
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className={`p-2 rounded ${won ? "bg-green-200" : "bg-red-200"}`}>
            {won ? "Congratulations! You guessed the element!" : `Game Over! The correct element was ${targetElement?.element_name} (${targetElement?.symbol})`}
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={startNewGame}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Guess Table */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="px-4 py-2 border">Element</th>
              <th className="px-4 py-2 border">Symbol</th>
              <th className="px-4 py-2 border">Electronegativity (+/-2)</th>
              <th className="px-4 py-2 border">Electron Affinity (+/-25)</th>
              <th className="px-4 py-2 border">1st Ionization Energy (+/-50)</th>
              <th className="px-4 py-2 border">Atomic Radius (+/-25)</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((g, i) => {
              const actual = targetElement!;
              return (
                <tr key={i} className="text-center">
                  <td className={`border px-4 py-2 ${getColorString(g.element_name, actual.element_name)}`}>
                    {g.element_name}
                  </td>
                  <td className={`border px-4 py-2 ${getColorString(g.symbol, actual.symbol)}`}>
                    {g.symbol}
                  </td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.electronegativity, safeValue(actual.electronegativity), yellowRange.electronegativity)}`}>
                    {g.electronegativity}
                  </td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.electronAffinity, safeValue(actual.electron_affinity), yellowRange.electronAffinity)}`}>
                    {g.electronAffinity}
                  </td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.ionizationEnergy, safeValue(actual.first_ionization_energy), yellowRange.ionizationEnergy)}`}>
                    {g.ionizationEnergy}
                  </td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.atomicRadius, safeValue(actual.atomic_radius), yellowRange.atomicRadius)}`}>
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
