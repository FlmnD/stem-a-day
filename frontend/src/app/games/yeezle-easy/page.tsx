"use client";

import React, { useState, useEffect } from "react";

interface ElementType {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number | string;
  groupBlock: string;
  standardState: string;
  bondingType: string;
  yearDiscovered: string;
}

export default function YeezleEasy() {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ElementType[]>([]);
  const [guesses, setGuesses] = useState<ElementType[]>([]);
  const [target, setTarget] = useState<ElementType | null>(null);
  const [message, setMessage] = useState("");

  // Fetch elements from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://neelpatel05.pythonanywhere.com/periodictablejson");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setElements(data);
        setTarget(data[Math.floor(Math.random() * data.length)]);
      } catch (err) {
        console.error("Failed to fetch element data:", err);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;
    const results = elements.filter(
      (el) =>
        el.name.toLowerCase().startsWith(query) ||
        el.symbol.toLowerCase().startsWith(query)
    );
    setSearchResults(results);
  };

  const addGuess = (element: ElementType) => {
    if (target && element.name === target.name) {
      setGuesses([...guesses, element]);
      setMessage("🎉 You Win! You found the element!");
    } else {
      setGuesses([...guesses, element]);
      if (guesses.length >= 5) {
        setMessage(`❌ You Lose! The element was ${target?.name}`);
      }
    }
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Yeezle Easy Mode</h1>

      <form onSubmit={handleSearch} className="mb-4 w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search element or symbol (press Enter)"
          className="w-full border p-2 rounded italic text-gray-500"
        />
      </form>

      {searchResults.length > 0 && (
        <div className="bg-white shadow rounded p-2 mb-4 max-h-48 overflow-y-auto w-full max-w-md">
          {searchResults.map((el) => (
            <div
              key={el.name}
              onClick={() => addGuess(el)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              {el.name} ({el.symbol})
            </div>
          ))}
        </div>
      )}

      <table className="border-collapse border border-gray-400 w-full max-w-2xl text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-400 p-2">Element</th>
            <th className="border border-gray-400 p-2">Symbol</th>
            <th className="border border-gray-400 p-2">Atomic #</th>
            <th className="border border-gray-400 p-2">Atomic Mass</th>
            <th className="border border-gray-400 p-2">Group Block</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((el, idx) => (
            <tr key={idx}>
              <td className="border p-2">{el.name}</td>
              <td className="border p-2">{el.symbol}</td>
              <td className="border p-2">{el.atomicNumber}</td>
              <td className="border p-2">{el.atomicMass}</td>
              <td className="border p-2">{el.groupBlock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-xl font-semibold">
          {message}
        </div>
      )}
    </div>
  );
}
