//carble easy page
'use client';
import { useState, useMemo, useEffect } from "react";
import elementsJSON from "../../../../elements.json";

interface ElementData {
  element_name: string;
  symbol: string;
  atomic_number: number;
  atomic_mass: number;
  ion_charge: number;
  group: number;
  period: number;
  block: string;
}

interface Guess {
  element_name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  ionCharge: number;
}

const yellowRange = { atomicNumber: 5, atomicMass: 15, ionCharge: 2 };

const elementsData: ElementData[] = (elementsJSON as any[]).map((e) => ({
  element_name: e.element_name,
  symbol: e.symbol,
  atomic_number: e.atomic_number,
  atomic_mass: e.atomic_mass,
  ion_charge: e.ion_charge,
  group: e.group ?? 1,
  period: e.period ?? 1,
  block: e.block ?? "s",
}));

export default function EasyCarble() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [targetElement, setTargetElement] = useState<ElementData | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [pinkElements, setPinkElements] = useState<string[]>([]);

  const safeIonCharge = (e: ElementData) => (e.group !== undefined ? (e.group <= 2 ? e.group : e.group - 10) : 0);

  const startNewGame = () => {
    const sAndPElements = elementsData.filter((e) => e.block !== "d" && e.block !== "f");
    const randomIndex = Math.floor(Math.random() * sAndPElements.length);
    setTargetElement(sAndPElements[randomIndex]);
    setGuesses([]);
    setInput("");
    setShowDropdown(false);
    setGameOver(false);
    setWon(false);
    setPinkElements(elementsData.filter(e => e.block === "s" || e.block === "p").map(e => e.symbol));
  };

  useEffect(() => { startNewGame(); }, []);

  const filteredOptions = useMemo(() => {
    if (!input) return elementsData.sort((a, b) => a.atomic_number - b.atomic_number);
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

  const addGuess = (element: ElementData) => {
    if (!targetElement || gameOver) return;
    if (guesses.some(g => g.symbol === element.symbol)) {
      alert("Already guessed!");
      return;
    }
    const newGuess: Guess = {
      element_name: element.element_name,
      symbol: element.symbol,
      atomicNumber: element.atomic_number,
      atomicMass: element.atomic_mass,
      ionCharge: safeIonCharge(element),
    };
    setGuesses([...guesses, newGuess]);
    setInput("");
    setShowDropdown(false);
    if (element.symbol === targetElement.symbol) {
      setWon(true);
      setGameOver(true);
    } else if (guesses.length + 1 >= 8) setGameOver(true);
  };

  const getColorNumeric = (guessValue: number, actualValue: number, range: number) => {
    if (guessValue === actualValue) return "bg-green-300";
    if (Math.abs(guessValue - actualValue) <= range) return "bg-yellow-300";
    return "";
  };
  const getColorString = (guessValue: string, actualValue: string) => guessValue === actualValue ? "bg-green-300" : "";

  const displayRows = gameOver && targetElement ? [...guesses, {
    element_name: targetElement.element_name,
    symbol: targetElement.symbol,
    atomicNumber: targetElement.atomic_number,
    atomicMass: targetElement.atomic_mass,
    ionCharge: safeIonCharge(targetElement),
  }] : guesses;

  const guessedSymbols = guesses.map(g => g.symbol);
  const periods = Array.from({ length: 7 }, (_, i) => i + 1);
  const groups = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Carble: Common Characteristics</h1>

      <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
  <h2 className="text-xl font-bold mb-3">Learn About the Essentials!</h2>

  <p className="mb-4">
    Learn about elements, atoms, atomic number, atomic mass, and ionic charge here!
    These hints will help you play the game successfully, so don’t skip them.
    You should spend at least <strong>6–7 minutes</strong> learning before starting the game.  
    If you need more help, feel free to explore the external links.  
    <strong>Enjoy learning and playing!</strong>
  </p>

  <h3 className="font-semibold">Element</h3>
  <p className="mb-3">
    An <strong>element</strong> is a pure substance that cannot be broken down or transformed
    into another substance.
  </p>

  <h3 className="font-semibold">Atom</h3>
  <p className="mb-1">
    An <strong>atom</strong> is the smallest chemical particle of an element. It includes:
  </p>
  <ul className="list-disc ml-6 mb-3">
    <li>Positive <strong>protons</strong></li>
    <li>Negative <strong>electrons</strong></li>
    <li>Neutral <strong>neutrons</strong></li>
  </ul>
  <p className="italic text-gray-600 mb-4">
<img src="/atomic and mass number.jpg" alt="atomic and mass number example" height="300" width="200" />
  </p>

  <h3 className="font-semibold">Atomic Number</h3>
  <p className="mb-2">
    The <strong>atomic number</strong> is the number of protons in an atom.  
    On the periodic table, assume protons ≈ electrons ≈ neutrons (simplified model).
  </p>
  <p className="mb-2">Examples:</p>
  <ul className="list-disc ml-6 mb-3">
    <li>Hydrogen → 1</li>
    <li>Helium → 2</li>
    <li>Carbon → 6</li>
  </ul>
  <p className="mb-4">
    It increases by one as you move <strong>left → right</strong> across a period  
    and increases dramatically as you move <strong>top → bottom</strong>.
  </p>
  <p className="italic text-gray-600 mb-4">
<img src="/4 protons diagram.png" alt="atom diagram example" height="300" width="200" />
  </p>

  <h3 className="font-semibold">Atomic Mass</h3>
  <p className="mb-2">
    Atomic mass (or mass number) is the mass of an atom.
    Approximate values:
  </p>
  <ul className="list-disc ml-6 mb-3">
    <li>1 proton (p⁺) ≈ 1 amu</li>
    <li>1 neutron ≈ 1 amu</li>
    <li>1 electron (e⁻) ≈ 0 amu (so electrons barely affect mass)</li>
  </ul>

  <p className="mb-2">Examples:</p>
  <ul className="list-disc ml-6 mb-3">
    <li>Hydrogen: 1 p + 1 e⁻ → ~1 amu</li>
    <li>Helium: 2 p + 2 n + 2 e⁻ → ~4 amu</li>
    <li>Carbon: 6 p + 6 n + 6 e⁻ → ~12 amu</li>
  </ul>

  <p className="mb-4">
    Mass increases across each row (<strong>left → right</strong>)  
    and increases significantly down a group (<strong>top → bottom</strong>).
  </p>
  <p className="italic text-gray-600 mb-4">
<img src="/the structure of atom.jpg" alt="the structure of atom diagram" height="300" width="200" />
  </p>

  <h3 className="font-semibold">Ionic Charge</h3>
  <p className="mb-2">
    The <strong>ionic charge</strong> is the charge an atom gets when it loses or gains electrons.
  </p>
  <p className="mb-3 italic text-gray-700">Reminder: electrons have a negative charge!</p>

  <p className="mb-2">Examples:</p>
  <ul className="list-disc ml-6 mb-3">
    <li>Hydrogen → +</li>
    <li>Carbon → 0</li>
    <li>Fluorine → –</li>
    <li>Neon → 0</li>
  </ul>

  <p className="font-semibold mb-2">General Patterns:</p>
  <ul className="list-disc ml-6 mb-4">
    <li>Metals → positive charge</li>
    <li>Nonmetals → negative charge</li>
    <li>Transition metals → variable charges</li>
    <li>Noble gases → 0 charge</li>
  </ul>

  <p className="font-semibold mb-2">Charge by Group:</p>
  <ul className="list-disc ml-6 mb-3">
    <li>Group 1 → +</li>
    <li>Group 2 → 2+</li>
    <li>Groups 3–12 → varies</li>
    <li>Group 13 → 3+</li>
    <li>Group 14 → 4+ or 0</li>
    <li>Group 15 → 3–</li>
    <li>Group 16 → 2–</li>
    <li>Group 17 → –</li>
    <li>Group 18 → 0</li>
  </ul>

  <p className="italic text-gray-600">
<img src="/4 diagrams ionic charge.gif" alt="4 atom diagrams" height="400" width="300" />
  </p>
</div>

      {/* Instructions */}
      <div className="w-full max-w-4xl mt-6 mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-3">Play our original game!</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Goal</strong> — Find the correct element which is randomly picked as
            one of the pink elements in the periodic table.
          </li>
          <li>
            <strong>Guess an element</strong>
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
              <li>8 guesses maximum</li>
              <li>Click on an element box in the periodic table</li>
              <li>Use the search bar by selecting an element from the dropdown or by typing an element name or symbol and clicking it</li>
            </ul>
          </li>
          <li>
            <strong>Access element properties</strong>
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
              <li>Hover your mouse over any element to view its name, atomic number, atomic mass, and ionic charge</li>
              <li>After you guess an element, its properties will appear in the game table with color hints that help you win</li>
            </ul>
          </li>
          <li>
            <strong>Reading the game table</strong>
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
              <li><span className="text-yellow-600 font-semibold">Yellow cell</span> = the value is close to the correct element’s value</li>
              <li><span className="text-green-600 font-semibold">Green cell</span> = the value matches the correct element exactly</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Periodic Table */}
      <div className="mb-6">
        {periods.map(period => (
          <div key={period} className="flex gap-1">
            {groups.map(group => {
              const element = elementsData.find(e => e.period === period && e.group === group);
              if (!element) return <div key={group} className="w-8 h-8"></div>;
              const guessed = guessedSymbols.includes(element.symbol);
              const isAnswer = element.symbol === targetElement?.symbol && gameOver;
              const isPink = pinkElements.includes(element.symbol);
              return (
                <div
                  key={element.symbol}
                  className={`w-8 h-8 flex items-center justify-center text-xs border rounded cursor-pointer
                    ${guessed ? "bg-gray-300" : ""}
                    ${isAnswer ? "bg-green-500 font-bold text-white" : ""}
                    ${isPink && !guessed && !isAnswer ? "bg-pink-300" : ""}`}
                  onClick={() => addGuess(element)}
                  title={
                    `Element: ${element.element_name}\n` +
                    `Symbol: ${element.symbol}\n` +
                    `Atomic Number: ${element.atomic_number}\n` +
                    `Atomic Mass: ${element.atomic_mass}\n` +
                    `Ionic Charge: ${element.ion_charge}\n`
                  }
                >
                  {element.symbol}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Lanthanides */}
      <div className="flex gap-1 mt-2">
        {elementsData
        .filter(e => e.period === 6 && e.block === 'f')
        .map(element => {
          const guessed = guessedSymbols.includes(element.symbol);
          const isAnswer = element.symbol === targetElement?.symbol && gameOver;
          const isPink = pinkElements.includes(element.symbol);
          return (
            <div
              key={element.symbol}
              className={`w-8 h-8 flex items-center justify-center text-xs border rounded cursor-pointer
                ${guessed ? "bg-gray-300" : ""}
                ${isAnswer ? "bg-green-500 font-bold text-white" : ""}
                ${isPink && !guessed && !isAnswer ? "bg-pink-300" : ""}`}
              onClick={() => addGuess(element)}
              title={
                `Element: ${element.element_name}\n` +
                `Symbol: ${element.symbol}\n` +
                `Atomic Number: ${element.atomic_number}\n` +
                `Atomic Mass: ${element.atomic_mass}\n` +
                `Ionic Charge: ${element.ion_charge}\n`
              }
            >
              {element.symbol}
            </div>
          );
        })}
      </div>

      {/* Actinides */}
      <div className="flex gap-1 mt-2">
        {elementsData
        .filter(e => e.period === 7 && e.block === 'f')
        .map(element => {
          const guessed = guessedSymbols.includes(element.symbol);
          const isAnswer = element.symbol === targetElement?.symbol && gameOver;
          const isPink = pinkElements.includes(element.symbol);
          return (
            <div
              key={element.symbol}
              className={`w-8 h-8 flex items-center justify-center text-xs border rounded cursor-pointer
                ${guessed ? "bg-gray-300" : ""}
                ${isAnswer ? "bg-green-500 font-bold text-white" : ""}
                ${isPink && !guessed && !isAnswer ? "bg-pink-300" : ""}`}
              onClick={() => addGuess(element)}
              title={
                `Element: ${element.element_name}\n` +
                `Symbol: ${element.symbol}\n` +
                `Atomic Number: ${element.atomic_number}\n` +
                `Atomic Mass: ${element.atomic_mass}\n` +
                `Ionic Charge: ${element.ion_charge}\n`
              }
            >
              {element.symbol}
            </div>
          );
        })}
      </div>

      {/* Input & Dropdown */}
      <div className="relative w-96 mt-6 mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded shadow focus:outline-none"
          placeholder="Type element name or symbol"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
          disabled={gameOver}
        />
        {showDropdown && (
          <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border rounded mt-1 shadow">
            {filteredOptions.map((e) => (
              <div
                key={e.symbol}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => addGuess(e)}
              >
                {e.element_name} ({e.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hint note */}
      <div className="mb-4 text-sm text-gray-700 italic">
        When in doubt, choose Carbon, the center of life!
      </div>

      {gameOver && (
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className={`p-2 rounded ${won ? "bg-green-200" : "bg-red-200"}`}>
            {won ? "Congratulations! You guessed the element!" : `Game Over! You Lost! The element was ${targetElement?.element_name} (${targetElement?.symbol})!`}
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600" onClick={startNewGame}>
            Play Again
          </button>
        </div>
      )}

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="px-4 py-2 border">Element</th>
              <th className="px-4 py-2 border">Symbol</th>
              <th className="px-4 py-2 border">Atomic Number (+/-5)</th>
              <th className="px-4 py-2 border">Atomic Mass (+/-15)</th>
              <th className="px-4 py-2 border">Ionic Charge (+/-2)</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((g, i) => {
              const actual = targetElement!;
              return (
                <tr key={i} className="text-center">
                  <td className={`border px-4 py-2 ${getColorString(g.element_name, actual.element_name)}`}>{g.element_name}</td>
                  <td className={`border px-4 py-2 ${getColorString(g.symbol, actual.symbol)}`}>{g.symbol}</td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.atomicNumber, actual.atomic_number, yellowRange.atomicNumber)}`}>{g.atomicNumber}</td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.atomicMass, actual.atomic_mass, yellowRange.atomicMass)}`}>{g.atomicMass}</td>
                  <td className={`border px-4 py-2 ${getColorNumeric(g.ionCharge, safeIonCharge(actual), yellowRange.ionCharge)}`}>{g.ionCharge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
