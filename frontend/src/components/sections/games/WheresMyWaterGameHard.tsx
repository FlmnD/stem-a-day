// SolubilityPrecipitationHard.tsx
'use client'
import React, { useEffect, useState } from "react";

interface Ion {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  color: string;
  spectator: boolean;
}

interface Level {
  title: string;
  reactants: string;
  products: string;
  netIonic: string;
  precipitate: string | null;
  spectators: string[];
  noReaction?: boolean;
}

const LEVELS: Level[] = [
  {
    title: 'Level 1 — Silver Chloride',
    reactants: 'AgNO₃(aq) + NaCl(aq)',
    products: 'AgCl(s) + NaNO₃(aq)',
    netIonic: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
    precipitate: 'AgCl',
    spectators: ['Na⁺', 'NO₃⁻'],
  },
  {
    title: 'Level 2 — Lead Iodide',
    reactants: 'Pb(NO₃)₂(aq) + KI(aq)',
    products: 'PbI₂(s) + KNO₃(aq)',
    netIonic: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)',
    precipitate: 'PbI₂',
    spectators: ['K⁺', 'NO₃⁻'],
  },
  {
    title: 'Level 3 — No Reaction',
    reactants: 'KNO₃(aq) + NaCl(aq)',
    products: 'NR',
    netIonic: 'No Reaction',
    precipitate: null,
    spectators: ['K⁺', 'NO₃⁻', 'Na⁺', 'Cl⁻'],
    noReaction: true,
  },
];

export default function WheresMyWaterGameHard() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [ions, setIons] = useState<Ion[]>([]);
  const [spectatorsFound, setSpectatorsFound] = useState<string[]>([]);
  const [precipitateAmount, setPrecipitateAmount] = useState(0);
  const [reactionTriggered, setReactionTriggered] = useState(false);
  const [message, setMessage] = useState('');

  const level = LEVELS[levelIndex];

  useEffect(() => {
    const baseIons: Ion[] = level.noReaction
      ? [
          {
            id: 'k',
            label: 'K⁺',
            x: 100,
            y: 40,
            vx: 2,
            color: '#facc15',
            spectator: true,
          },
          {
            id: 'no3',
            label: 'NO₃⁻',
            x: 140,
            y: 60,
            vx: 1.6,
            color: '#86efac',
            spectator: true,
          },
          {
            id: 'na',
            label: 'Na⁺',
            x: 700,
            y: 40,
            vx: -2,
            color: '#fde047',
            spectator: true,
          },
          {
            id: 'cl',
            label: 'Cl⁻',
            x: 760,
            y: 60,
            vx: -1.5,
            color: '#5eead4',
            spectator: true,
          },
        ]
      : [
          {
            id: 'cation',
            label: levelIndex === 0 ? 'Ag⁺' : 'Pb²⁺',
            x: 100,
            y: 60,
            vx: 2,
            color: '#f8fafc',
            spectator: false,
          },
          {
            id: 'anion',
            label: levelIndex === 0 ? 'Cl⁻' : 'I⁻',
            x: 700,
            y: 60,
            vx: -2,
            color: '#5eead4',
            spectator: false,
          },
          {
            id: 'spec1',
            label: levelIndex === 0 ? 'Na⁺' : 'K⁺',
            x: 730,
            y: 120,
            vx: -1.2,
            color: '#fde047',
            spectator: true,
          },
          {
            id: 'spec2',
            label: 'NO₃⁻',
            x: 160,
            y: 120,
            vx: 1.3,
            color: '#86efac',
            spectator: true,
          },
        ];

    setIons(baseIons);
    setReactionTriggered(false);
    setSpectatorsFound([]);
    setPrecipitateAmount(0);
    setMessage('');
  }, [levelIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIons(prev =>
        prev.map(i => ({
          ...i,
          x: i.x + i.vx,
        }))
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reactionTriggered || level.noReaction) return;

    const cation = ions.find(i =>
      i.label.includes('Ag') || i.label.includes('Pb')
    );

    const anion = ions.find(i =>
      i.label === 'Cl⁻' || i.label === 'I⁻'
    );

    if (!cation || !anion) return;

    if (Math.abs(cation.x - anion.x) < 40) {
      setReactionTriggered(true);
      setPrecipitateAmount(1);
      setMessage(`⚡ ${level.precipitate} precipitate formed!`);
    }
  }, [ions]);

  function collectSpectator(label: string) {
    if (spectatorsFound.includes(label)) return;

    setSpectatorsFound(prev => [...prev, label]);
  }

  useEffect(() => {
    if (
      spectatorsFound.length === level.spectators.length
    ) {
      setMessage('✅ Spectator ions identified!');
    }
  }, [spectatorsFound]);

  return (
    <div className="min-h-screen bg-sky-100 p-5">
      <h1 className="text-4xl font-black text-sky-900 mb-3">
        Solubility & Precipitation
      </h1>

      <div className="flex gap-6 flex-wrap">
        <div>
          <div className="mb-3 text-xl font-bold text-slate-700">
            {level.title}
          </div>

          <div
            className="relative border-4 border-slate-700 overflow-hidden rounded-2xl"
            style={{
              width: 900,
              height: 540,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(120,200,255,0.65))',
            }}
          >
            <div
              className="absolute left-20 top-0 w-20 h-24 bg-slate-600"
            />

            <div
              className="absolute right-20 top-0 w-20 h-24 bg-slate-600"
            />

            {ions.map(ion => (
              <div
                key={ion.id}
                onClick={() => {
                  if (ion.spectator) {
                    collectSpectator(ion.label);
                  }
                }}
                className="absolute flex items-center justify-center rounded-full font-black cursor-pointer"
                style={{
                  left: ion.x,
                  top: ion.y,
                  width: 52,
                  height: 52,
                  background: ion.color,
                  color: '#000',
                  transition: 'all 0.03s linear',
                  boxShadow: `0 0 18px ${ion.color}`,
                }}
              >
                {ion.label}
              </div>
            ))}

            {reactionTriggered && (
              <>
                {Array.from({
                  length: precipitateAmount * 40,
                }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                      left: 380 + (i % 10) * 10,
                      top: 450 + Math.floor(i / 10) * 8,
                      width: 8,
                      height: 8,
                    }}
                  />
                ))}
              </>
            )}

            <div
              className="absolute bottom-0 left-0 right-0 h-12 bg-green-700 flex items-center justify-center text-white text-2xl font-black"
            >
              ALLIGATOR — NET IONIC ACCEPTOR
            </div>
          </div>
        </div>

        <div className="w-96 bg-white rounded-2xl shadow-xl border border-slate-300 p-5">
          <div className="text-2xl font-black text-sky-900 mb-3">
            Molecular Equation
          </div>

          <div className="text-lg font-mono bg-slate-100 p-3 rounded mb-4">
            {level.reactants}
            <br />
            ↓
            <br />
            {reactionTriggered || level.noReaction
              ? level.products
              : '...'}
          </div>

          <div className="text-2xl font-black text-sky-900 mb-3">
            Spectator Ions
          </div>

          <div className="space-y-2 mb-5">
            {level.spectators.map(sp => (
              <div
                key={sp}
                className={`p-2 rounded font-bold ${
                  spectatorsFound.includes(sp)
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200'
                }`}
              >
                {sp}
              </div>
            ))}
          </div>

          <div className="text-2xl font-black text-sky-900 mb-3">
            Net Ionic Equation
          </div>

          <div className="bg-yellow-100 rounded p-4 text-lg font-mono min-h-22.5">
            {spectatorsFound.length ===
            level.spectators.length
              ? level.netIonic
              : 'Collect spectator ions first...'}
          </div>

          <div className="mt-5 text-xl font-black text-slate-700">
            {message}
          </div>

          <button
            className="mt-6 w-full bg-sky-600 hover:bg-sky-500 text-white py-3 rounded-xl font-black"
            onClick={() =>
              setLevelIndex(
                (prev) => (prev + 1) % LEVELS.length
              )
            }
          >
            Next Level
          </button>
        </div>
      </div>
    </div>
  );
}