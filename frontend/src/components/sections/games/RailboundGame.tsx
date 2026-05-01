'use client'
import React, { useEffect, useState, useRef } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Unit = 'g' | 'mol' | 'molecules' | 'atoms' | 'L_STP' | 'mL' | 'g_element' | 'mol_element';

interface TrackCard {
  id: number;
  numerator: string;
  denominator: string;
  inUnit: Unit;
  outUnit: Unit;
  isDecoy: boolean;
  slotIndex: number | null;
}

interface Station {
  id: string;
  unit: Unit;
  label: string;
  valueLabel: string;
  compoundLabel: string;
  isStart: boolean;
  isEnd: boolean;
  px: number;
  py: number;
}

interface Slot {
  index: number;
  fromUnit: Unit;
  toUnit: Unit;
  px: number;
  py: number;
  dir: 'h' | 'v';
}

interface TrackSegment {
  x1: number; y1: number;
  x2: number; y2: number;
}

interface Scenario {
  id: number;
  title: string;
  substanceName: string;
  formula: string;
  molarMass: number;
  problemText: string;
  hint: string;
  stations: Station[];
  slots: Slot[];
  segments: TrackSegment[];
  correctCards: TrackCard[];
  decoyCards: TrackCard[];
  stationValues: number[];
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const AVOGADRO = 6.022e23;
const MOLAR_VOL_STP = 22.4;
const GLUCOSE_REWARD = 20;
const MAP_W = 1100;
const MAP_H = 520;
const ST_W = 130;
const ST_H = 100;
const SL_W = 210;
const SL_H = 130;

// ─── LAYOUT BLUEPRINTS ────────────────────────────────────────────────────────

const BLUEPRINTS: Record<number, { stations: { fx: number; fy: number }[]; dirs: ('h'|'v')[] }[]> = {
  2: [
    { stations: [{ fx: 0.10, fy: 0.50 }, { fx: 0.90, fy: 0.50 }], dirs: ['h'] },
    { stations: [{ fx: 0.50, fy: 0.15 }, { fx: 0.50, fy: 0.85 }], dirs: ['v'] },
  ],
  3: [
    { stations: [{ fx: 0.10, fy: 0.50 }, { fx: 0.50, fy: 0.50 }, { fx: 0.90, fy: 0.50 }], dirs: ['h', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.25 }, { fx: 0.50, fy: 0.25 }, { fx: 0.50, fy: 0.80 }], dirs: ['h', 'v'] },
    { stations: [{ fx: 0.15, fy: 0.20 }, { fx: 0.15, fy: 0.80 }, { fx: 0.85, fy: 0.80 }], dirs: ['v', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.25 }, { fx: 0.55, fy: 0.25 }, { fx: 0.55, fy: 0.78 }], dirs: ['h', 'v'] },
  ],
  4: [
    { stations: [{ fx: 0.08, fy: 0.50 }, { fx: 0.36, fy: 0.50 }, { fx: 0.64, fy: 0.50 }, { fx: 0.92, fy: 0.50 }], dirs: ['h', 'h', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.20 }, { fx: 0.45, fy: 0.20 }, { fx: 0.45, fy: 0.80 }, { fx: 0.88, fy: 0.80 }], dirs: ['h', 'v', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.20 }, { fx: 0.10, fy: 0.80 }, { fx: 0.60, fy: 0.80 }, { fx: 0.88, fy: 0.20 }], dirs: ['v', 'h', 'v'] },
    { stations: [{ fx: 0.88, fy: 0.20 }, { fx: 0.45, fy: 0.20 }, { fx: 0.45, fy: 0.80 }, { fx: 0.10, fy: 0.80 }], dirs: ['h', 'v', 'h'] },
  ],
};

// ─── FORMAT ───────────────────────────────────────────────────────────────────

function fmtNum(v: number): string {
  if (!isFinite(v)) return '?';
  const abs = Math.abs(v);
  if (abs >= 1e22) {
    const exp = Math.floor(Math.log10(abs));
    const coeff = (v / Math.pow(10, exp)).toFixed(3);
    return `${coeff}×10²³`;
  }
  if (abs >= 1e6) return v.toExponential(3);
  if (abs < 0.0001 && abs > 0) return v.toExponential(3);
  if (Number.isInteger(v)) return v.toString();
  return parseFloat(v.toFixed(4)).toString();
}

function unitLabel(u: Unit): string {
  const m: Record<Unit, string> = {
    g: 'g', mol: 'mol', molecules: 'molec.', atoms: 'atoms',
    L_STP: 'L (STP)', mL: 'mL', g_element: 'g',
    mol_element: 'mol',
  };
  return m[u] ?? u;
}

// ─── RAW SCENARIO DATA (no empirical formula questions) ───────────────────────

interface RawScenario {
  title: string; substanceName: string; formula: string; molarMass: number;
  givenAmount: number; givenUnit: Unit; targetUnit: Unit;
  problemText: string; hint: string;
  stationCompounds?: string[];
  extra?: { elementSymbol?: string; elementMM?: number; subscript?: number; density?: number; };
}

const RAW_SCENARIOS: RawScenario[] = [
  // ── g ↔ mol (1-step) ─────────────────────────────────────────────────────
  { title: "Grams → Moles", substanceName: "water", formula: "H₂O", molarMass: 18.02, givenAmount: 36.04, givenUnit: 'g', targetUnit: 'mol', problemText: "Convert 36.04 g of H₂O (MM = 18.02 g/mol) to moles.", hint: "Divide grams by molar mass (18.02 g/mol).", stationCompounds: ['H₂O', 'H₂O'] },
  { title: "Moles → Grams", substanceName: "sodium chloride", formula: "NaCl", molarMass: 58.44, givenAmount: 0.500, givenUnit: 'mol', targetUnit: 'g', problemText: "Convert 0.500 mol of NaCl (MM = 58.44 g/mol) to grams.", hint: "Multiply moles by molar mass (58.44 g/mol).", stationCompounds: ['NaCl', 'NaCl'] },
  { title: "Grams → Moles", substanceName: "glucose", formula: "C₆H₁₂O₆", molarMass: 180.16, givenAmount: 360.32, givenUnit: 'g', targetUnit: 'mol', problemText: "Convert 360.32 g of C₆H₁₂O₆ (MM = 180.16 g/mol) to moles.", hint: "MM of glucose = 180.16 g/mol.", stationCompounds: ['C₆H₁₂O₆', 'C₆H₁₂O₆'] },
  { title: "Moles → Grams", substanceName: "ammonia", formula: "NH₃", molarMass: 17.03, givenAmount: 1.50, givenUnit: 'mol', targetUnit: 'g', problemText: "Convert 1.50 mol of NH₃ (MM = 17.03 g/mol) to grams.", hint: "Multiply moles × 17.03 g/mol.", stationCompounds: ['NH₃', 'NH₃'] },
  { title: "Grams → Moles", substanceName: "hydrochloric acid", formula: "HCl", molarMass: 36.46, givenAmount: 72.92, givenUnit: 'g', targetUnit: 'mol', problemText: "Convert 72.92 g of HCl (MM = 36.46 g/mol) to moles.", hint: "MM of HCl = 36.46 g/mol.", stationCompounds: ['HCl', 'HCl'] },
  { title: "Moles → Molecules", substanceName: "oxygen gas", formula: "O₂", molarMass: 32.00, givenAmount: 2.00, givenUnit: 'mol', targetUnit: 'molecules', problemText: "Convert 2.00 mol of O₂ to molecules.", hint: "Multiply by 6.022×10²³.", stationCompounds: ['O₂', 'O₂'] },
  { title: "Moles → Liters (STP)", substanceName: "hydrogen gas", formula: "H₂", molarMass: 2.016, givenAmount: 3.00, givenUnit: 'mol', targetUnit: 'L_STP', problemText: "Convert 3.00 mol of H₂ to liters at STP.", hint: "Multiply moles × 22.4 L/mol.", stationCompounds: ['H₂', 'H₂'] },
  { title: "Grams → Moles", substanceName: "carbon dioxide", formula: "CO₂", molarMass: 44.01, givenAmount: 44.01, givenUnit: 'g', targetUnit: 'mol', problemText: "Convert 44.01 g of CO₂ (MM = 44.01 g/mol) to moles.", hint: "Divide by 44.01 g/mol.", stationCompounds: ['CO₂', 'CO₂'] },
  { title: "Moles → Grams", substanceName: "iron", formula: "Fe", molarMass: 55.85, givenAmount: 2.00, givenUnit: 'mol', targetUnit: 'g', problemText: "Convert 2.00 mol of Fe (MM = 55.85 g/mol) to grams.", hint: "Multiply moles × 55.85 g/mol.", stationCompounds: ['Fe', 'Fe'] },
  // ── 2-step ────────────────────────────────────────────────────────────────
  { title: "Grams → Molecules", substanceName: "carbon dioxide", formula: "CO₂", molarMass: 44.01, givenAmount: 88.02, givenUnit: 'g', targetUnit: 'molecules', problemText: "Convert 88.02 g of CO₂ (MM = 44.01 g/mol) to molecules.", hint: "g → mol (÷ 44.01), then mol → molecules (× 6.022×10²³).", stationCompounds: ['CO₂', 'CO₂', 'CO₂'] },
  { title: "Grams → Molecules", substanceName: "sulfuric acid", formula: "H₂SO₄", molarMass: 98.08, givenAmount: 196.16, givenUnit: 'g', targetUnit: 'molecules', problemText: "Convert 196.16 g of H₂SO₄ (MM = 98.08 g/mol) to molecules.", hint: "Two steps: g → mol → molecules.", stationCompounds: ['H₂SO₄', 'H₂SO₄', 'H₂SO₄'] },
  { title: "Grams → Molecules", substanceName: "methane", formula: "CH₄", molarMass: 16.04, givenAmount: 32.08, givenUnit: 'g', targetUnit: 'molecules', problemText: "Convert 32.08 g of CH₄ (MM = 16.04 g/mol) to molecules.", hint: "g → mol (÷ 16.04), then × Avogadro.", stationCompounds: ['CH₄', 'CH₄', 'CH₄'] },
  { title: "Molecules → Grams", substanceName: "oxygen gas", formula: "O₂", molarMass: 32.00, givenAmount: 1.204e24, givenUnit: 'molecules', targetUnit: 'g', problemText: "Convert 1.204×10²⁴ molecules of O₂ (MM = 32.00 g/mol) to grams.", hint: "molecules → mol (÷ 6.022×10²³), then mol → g.", stationCompounds: ['O₂', 'O₂', 'O₂'] },
  { title: "Grams → Liters (STP)", substanceName: "nitrogen gas", formula: "N₂", molarMass: 28.02, givenAmount: 56.04, givenUnit: 'g', targetUnit: 'L_STP', problemText: "Convert 56.04 g of N₂ (MM = 28.02 g/mol) to liters at STP.", hint: "g → mol (÷ 28.02), then mol → L (× 22.4).", stationCompounds: ['N₂', 'N₂', 'N₂'] },
  { title: "Liters (STP) → Grams", substanceName: "carbon dioxide", formula: "CO₂", molarMass: 44.01, givenAmount: 44.8, givenUnit: 'L_STP', targetUnit: 'g', problemText: "A gas occupies 44.8 L at STP. It is CO₂ (MM = 44.01 g/mol). What is its mass?", hint: "L → mol (÷ 22.4), then mol → g (× 44.01).", stationCompounds: ['CO₂', 'CO₂', 'CO₂'] },
  { title: "Volume → Moles (density)", substanceName: "ethanol", formula: "C₂H₅OH", molarMass: 46.07, givenAmount: 50.0, givenUnit: 'mL', targetUnit: 'mol', problemText: "Convert 50.0 mL of ethanol (d = 0.789 g/mL, MM = 46.07 g/mol) to moles.", hint: "mL → g (× density), then g → mol.", stationCompounds: ['C₂H₅OH', 'C₂H₅OH', 'C₂H₅OH'], extra: { density: 0.789 } },
  { title: "Volume → Moles (density)", substanceName: "water", formula: "H₂O", molarMass: 18.02, givenAmount: 36.0, givenUnit: 'mL', targetUnit: 'mol', problemText: "Convert 36.0 mL of water (d = 1.00 g/mL, MM = 18.02 g/mol) to moles.", hint: "mL × 1.00 g/mL = g, then g ÷ MM.", stationCompounds: ['H₂O', 'H₂O', 'H₂O'], extra: { density: 1.00 } },
  { title: "Grams → Molecules", substanceName: "water", formula: "H₂O", molarMass: 18.02, givenAmount: 36.04, givenUnit: 'g', targetUnit: 'molecules', problemText: "Convert 36.04 g of H₂O (MM = 18.02 g/mol) to molecules.", hint: "g → mol (÷18.02), then mol → molecules (×6.022×10²³).", stationCompounds: ['H₂O', 'H₂O', 'H₂O'] },
  // ── 3-step ────────────────────────────────────────────────────────────────
  { title: "Grams → Atoms of Element", substanceName: "water", formula: "H₂O", molarMass: 18.02, givenAmount: 18.02, givenUnit: 'g', targetUnit: 'atoms', problemText: "How many H atoms are in 18.02 g of H₂O (MM = 18.02 g/mol)?", hint: "g H₂O → mol H₂O → mol H (×2) → atoms H.", stationCompounds: ['H₂O', 'H₂O', 'H', 'H'], extra: { elementSymbol: 'H', elementMM: 1.008, subscript: 2 } },
  { title: "Grams → Atoms of Element", substanceName: "carbon dioxide", formula: "CO₂", molarMass: 44.01, givenAmount: 44.01, givenUnit: 'g', targetUnit: 'atoms', problemText: "How many O atoms are in 44.01 g of CO₂ (MM = 44.01 g/mol)?", hint: "g CO₂ → mol CO₂ → mol O (×2) → atoms O.", stationCompounds: ['CO₂', 'CO₂', 'O', 'O'], extra: { elementSymbol: 'O', elementMM: 16.00, subscript: 2 } },
  { title: "Grams → Atoms of Element", substanceName: "methane", formula: "CH₄", molarMass: 16.04, givenAmount: 16.04, givenUnit: 'g', targetUnit: 'atoms', problemText: "How many H atoms are in 16.04 g of CH₄ (MM = 16.04 g/mol)?", hint: "g → mol CH₄ → mol H (×4) → atoms H.", stationCompounds: ['CH₄', 'CH₄', 'H', 'H'], extra: { elementSymbol: 'H', elementMM: 1.008, subscript: 4 } },
  { title: "Grams of Element", substanceName: "iron(III) oxide", formula: "Fe₂O₃", molarMass: 159.69, givenAmount: 50.0, givenUnit: 'g', targetUnit: 'g_element', problemText: "How many grams of Fe are in 50.0 g of Fe₂O₃ (MM = 159.69 g/mol)?", hint: "g → mol Fe₂O₃ → mol Fe (×2) → g Fe (× 55.85).", stationCompounds: ['Fe₂O₃', 'Fe₂O₃', 'Fe', 'Fe'], extra: { elementSymbol: 'Fe', elementMM: 55.85, subscript: 2 } },
  { title: "Grams of Element", substanceName: "glucose", formula: "C₆H₁₂O₆", molarMass: 180.16, givenAmount: 90.0, givenUnit: 'g', targetUnit: 'g_element', problemText: "How many grams of C are in 90.0 g of C₆H₁₂O₆ (MM = 180.16 g/mol)?", hint: "g → mol glucose → mol C (×6) → g C (× 12.01).", stationCompounds: ['C₆H₁₂O₆', 'C₆H₁₂O₆', 'C', 'C'], extra: { elementSymbol: 'C', elementMM: 12.01, subscript: 6 } },
];

// ─── SCENARIO BUILDER ─────────────────────────────────────────────────────────

let _cardId = 1;
const nextId = () => _cardId++;

function buildChain(raw: RawScenario): { units: Unit[]; values: number[] } {
  const { givenUnit: g, targetUnit: t, molarMass: mm, givenAmount: amt, extra: ex } = raw;
  const units: Unit[] = [g];
  const values: number[] = [amt];
  const push = (u: Unit, v: number) => { units.push(u); values.push(v); };

  if (g === 'g' && t === 'mol')            { push('mol', amt / mm); }
  else if (g === 'mol' && t === 'g')       { push('g', amt * mm); }
  else if (g === 'g' && t === 'molecules') { const m = amt / mm; push('mol', m); push('molecules', m * AVOGADRO); }
  else if (g === 'mol' && t === 'molecules'){ push('molecules', amt * AVOGADRO); }
  else if (g === 'molecules' && t === 'mol'){ push('mol', amt / AVOGADRO); }
  else if (g === 'molecules' && t === 'g') { const m = amt / AVOGADRO; push('mol', m); push('g', m * mm); }
  else if (g === 'g' && t === 'L_STP')    { const m = amt / mm; push('mol', m); push('L_STP', m * MOLAR_VOL_STP); }
  else if (g === 'L_STP' && t === 'g')    { const m = amt / MOLAR_VOL_STP; push('mol', m); push('g', m * mm); }
  else if (g === 'mol' && t === 'L_STP')  { push('L_STP', amt * MOLAR_VOL_STP); }
  else if (g === 'mL' && t === 'mol')     { const grams = amt * (ex?.density ?? 1); push('g', grams); push('mol', grams / mm); }
  else if (g === 'g' && t === 'atoms')    { const mc = amt / mm; push('mol', mc); const me = mc * (ex?.subscript ?? 1); push('mol_element', me); push('atoms', me * AVOGADRO); }
  else if (g === 'g' && t === 'g_element'){ const mc = amt / mm; push('mol', mc); const me = mc * (ex?.subscript ?? 1); push('mol_element', me); push('g_element', me * (ex?.elementMM ?? 1)); }

  return { units, values };
}

function makeCorrectCards(units: Unit[], raw: RawScenario): TrackCard[] {
  const cards: TrackCard[] = [];
  const { molarMass: mm, formula, extra: ex } = raw;
  for (let i = 0; i < units.length - 1; i++) {
    const from = units[i], to = units[i + 1];
    let num = '?', den = '?';
    if (from === 'g' && to === 'mol')            { num = `1 mol ${formula}`; den = `${mm} g`; }
    else if (from === 'mol' && to === 'g')       { num = `${mm} g`; den = `1 mol ${formula}`; }
    else if (from === 'mol' && to === 'molecules'){ num = `6.022×10²³ molec.`; den = `1 mol`; }
    else if (from === 'molecules' && to === 'mol'){ num = `1 mol`; den = `6.022×10²³ molec.`; }
    else if (from === 'mol' && to === 'L_STP')   { num = `22.4 L`; den = `1 mol`; }
    else if (from === 'L_STP' && to === 'mol')   { num = `1 mol`; den = `22.4 L`; }
    else if (from === 'mL' && to === 'g')        { num = `${ex?.density ?? 1} g`; den = `1 mL`; }
    else if (from === 'mol' && to === 'mol_element'){ num = `${ex?.subscript ?? 1} mol ${ex?.elementSymbol ?? 'X'}`; den = `1 mol ${formula}`; }
    else if (from === 'mol_element' && to === 'atoms'){ num = `6.022×10²³ atoms`; den = `1 mol`; }
    else if (from === 'mol_element' && to === 'g_element'){ num = `${ex?.elementMM ?? 1} g ${ex?.elementSymbol ?? 'X'}`; den = `1 mol ${ex?.elementSymbol ?? 'X'}`; }
    cards.push({ id: nextId(), numerator: num, denominator: den, inUnit: from, outUnit: to, isDecoy: false, slotIndex: null });
  }
  return cards;
}

function makeDecoyCards(correct: TrackCard[], raw: RawScenario): TrackCard[] {
  const { molarMass: mm, formula, extra: ex } = raw;
  const wrongMM = mm === 18.02 ? 28.02 : mm === 58.44 ? 36.46 : mm === 44.01 ? 32.00 : 18.02;
  const used = new Set(correct.map(c => `${c.numerator}|${c.denominator}`));
  const decoys: TrackCard[] = [];

  const add = (num: string, den: string, inU: Unit, outU: Unit) => {
    if (!used.has(`${num}|${den}`)) {
      used.add(`${num}|${den}`);
      decoys.push({ id: nextId(), numerator: num, denominator: den, inUnit: inU, outUnit: outU, isDecoy: true, slotIndex: null });
    }
  };

  add(`1 mol`, `${wrongMM} g`, 'g', 'mol');
  add(`${wrongMM} g`, `1 mol`, 'mol', 'g');
  correct.slice(0, 2).forEach(c => add(c.denominator, c.numerator, c.outUnit, c.inUnit));
  add(`1 mol`, `6.022×10²³ molec.`, 'molecules', 'mol');
  add(`6.022×10²³ molec.`, `1 mol`, 'mol', 'molecules');
  add(`1 mol`, `22.4 L`, 'L_STP', 'mol');
  if (ex?.subscript) {
    const ws = ex.subscript === 2 ? 3 : 2;
    add(`${ws} mol ${ex.elementSymbol ?? 'X'}`, `1 mol ${formula}`, 'mol', 'mol_element');
  }

  return decoys.slice(0, correct.length + 3);
}

function pickBlueprint(n: number) {
  const opts = BLUEPRINTS[n] ?? BLUEPRINTS[3];
  return opts[Math.floor(Math.random() * opts.length)];
}

function buildScenario(raw: RawScenario, idx: number): Scenario {
  const { units, values } = buildChain(raw);
  const n = units.length;
  const bp = pickBlueprint(n);

  const stations: Station[] = units.map((unit, i) => {
    const pos = bp.stations[i] ?? bp.stations[bp.stations.length - 1];
    const valLabel = i === n - 1 ? `? ${unitLabel(unit)}` : `${fmtNum(values[i])} ${unitLabel(unit)}`;
    const compoundLabel = raw.stationCompounds?.[i] ?? raw.formula;
    return {
      id: `s${i}`, unit, label: unitLabel(unit), valueLabel: valLabel,
      compoundLabel, isStart: i === 0, isEnd: i === n - 1,
      px: Math.round(pos.fx * MAP_W), py: Math.round(pos.fy * MAP_H),
    };
  });

  const slots: Slot[] = [];
  const segments: TrackSegment[] = [];

  for (let i = 0; i < n - 1; i++) {
    const s1 = stations[i], s2 = stations[i + 1];
    const dir = bp.dirs[i] ?? 'h';
    slots.push({ index: i, fromUnit: s1.unit, toUnit: s2.unit, px: Math.round((s1.px + s2.px) / 2), py: Math.round((s1.py + s2.py) / 2), dir });
    segments.push({ x1: s1.px, y1: s1.py, x2: s2.px, y2: s2.py });
  }

  const correct = makeCorrectCards(units, raw);
  const decoys = makeDecoyCards(correct, raw);

  return { id: idx, title: raw.title, substanceName: raw.substanceName, formula: raw.formula, molarMass: raw.molarMass, problemText: raw.problemText, hint: raw.hint, stations, slots, segments, correctCards: correct, decoyCards: decoys, stationValues: values };
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

// ─── SVG COMPONENTS ───────────────────────────────────────────────────────────

function SvgTrack({ x1, y1, x2, y2 }: TrackSegment) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const ux = dx / len, uy = dy / len;
  const px = -uy * 5, py = ux * 5;
  const numTies = Math.max(2, Math.round(len / 22));
  return (
    <g>
      {Array.from({ length: numTies }, (_, i) => {
        const t = (i + 0.5) / numTies;
        const cx = x1 + dx * t, cy = y1 + dy * t;
        return <line key={i} x1={cx - uy * 10} y1={cy + ux * 10} x2={cx + uy * 10} y2={cy - ux * 10} stroke="#92816e" strokeWidth={5} strokeLinecap="round" />;
      })}
      <line x1={x1 + px} y1={y1 + py} x2={x2 + px} y2={y2 + py} stroke="#6b7280" strokeWidth={3} strokeLinecap="round" />
      <line x1={x1 - px} y1={y1 - py} x2={x2 - px} y2={y2 - py} stroke="#6b7280" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

function SvgStation({ station, dynamicLabel }: { station: Station; dynamicLabel?: string }) {
  const { px, py, isStart, isEnd, compoundLabel } = station;
  const val = dynamicLabel ?? station.valueLabel;
  const unit = station.unit === 'mol_element' ? 'mol' : unitLabel(station.unit);

  return (
    <g>
      <rect
        x={px - ST_W / 2} y={py - ST_H / 2} width={ST_W} height={ST_H} rx={10}
        fill={isStart ? '#dbeafe' : isEnd ? '#dcfce7' : '#fef9c3'} stroke="#333" strokeWidth={3}
      />
      <text x={px} y={py - 25} textAnchor="middle" fontSize={18} fontWeight={700} fontFamily="'Courier New', monospace">
        {val.split(" ")[0]}
      </text>
      <text x={px} y={py} textAnchor="middle" fontSize={28} fontWeight={900}>
        {unit}
      </text>
      <text x={px} y={py + 22} textAnchor="middle" fontSize={14} fontWeight={600} fill="#374151">
        {compoundLabel}
      </text>
      <text x={px} y={py + 40} textAnchor="middle" fontSize={12} fontWeight={800}>
        {isStart ? "START" : isEnd ? "DEST" : ""}
      </text>
    </g>
  );
}

function SvgTrain({ x, y, dir, color = '#1d4ed8' }: { x: number; y: number; dir: 'h' | 'v'; color?: string }) {
  const w = 44, h = 22;
  const transform = dir === 'v'
    ? `translate(${x - h / 2},${y - w / 2}) rotate(90,${h / 2},${w / 2})`
    : `translate(${x - w / 2},${y - h / 2})`;
  return (
    <g transform={transform}>
      <rect x={0} y={3} width={w} height={h - 4} rx={5} fill={color} />
      <rect x={w - 13} y={1} width={13} height={h} rx={3} fill={color} opacity={0.85} />
      <rect x={w - 11} y={4} width={8} height={7} rx={1.5} fill="#bfdbfe" />
      <rect x={5} y={-4} width={5} height={7} rx={2} fill={color} opacity={0.75} />
      <rect x={3} y={-2} width={9} height={3} rx={1} fill={color} opacity={0.6} />
      {[8, 20, 32].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={h + 1} r={4.5} fill="#374151" />
          <circle cx={cx} cy={h + 1} r={2} fill="#9ca3af" />
          <circle cx={cx} cy={h + 1} r={0.7} fill="#374151" />
        </g>
      ))}
      <line x1={8} y1={h + 1} x2={32} y2={h + 1} stroke="#6b7280" strokeWidth={1.5} />
      <circle cx={w - 2} cy={h / 2} r={3} fill="#fef08a" opacity={0.9} />
    </g>
  );
}

function SvgSlot({ slot, card, anySelected, isWrong, isCorrectRevealed, onClick }: {
  slot: Slot; card?: TrackCard; anySelected: boolean; isWrong: boolean; isCorrectRevealed: boolean; onClick: () => void;
}) {
  const { px, py } = slot;
  const x = px - SL_W / 2, y = py - SL_H / 2;
  const bg = isWrong ? '#fef2f2' : card ? '#fffbeb' : anySelected ? '#eff6ff' : '#f8fafc';
  const stroke = isWrong ? '#f87171' : isCorrectRevealed && card ? '#16a34a' : card ? '#78716c' : anySelected ? '#93c5fd' : '#d1d5db';
  const dash = card ? undefined : '5,4';
  const tc = isWrong ? '#dc2626' : isCorrectRevealed && card ? '#15803d' : '#1d4ed8';

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect x={x + 2} y={y + 2} width={SL_W} height={SL_H} rx={7} fill="rgba(0,0,0,0.08)" />
      <rect x={x} y={y} width={SL_W} height={SL_H} rx={7} fill={bg} stroke={stroke} strokeWidth={card ? 2 : 1.5} strokeDasharray={dash} />
      {card ? (
        <>
          <text x={px} y={y + 26} textAnchor="middle" fontSize={15} fontWeight={700} fill={tc} fontFamily="'Courier New', monospace">
            {card.numerator.length > 24 ? card.numerator.slice(0, 23) + '…' : card.numerator}
          </text>
          <line x1={x + 10} y1={py} x2={x + SL_W - 10} y2={py} stroke={tc} strokeWidth={2} />
          <text x={px} y={y + SL_H - 16} textAnchor="middle" fontSize={15} fontWeight={700} fill={tc} fontFamily="'Courier New', monospace">
            {card.denominator.length > 24 ? card.denominator.slice(0, 23) + '…' : card.denominator}
          </text>
          {isWrong && (
            <text x={px} y={y + SL_H + 16} textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={800}>✗ wrong</text>
          )}
          {isCorrectRevealed && !isWrong && (
            <text x={px} y={y + SL_H + 16} textAnchor="middle" fontSize={11} fill="#16a34a" fontWeight={800}>✓</text>
          )}
        </>
      ) : (
        <text x={px} y={py + 5} textAnchor="middle" fontSize={11} fill={anySelected ? '#3b82f6' : '#94a3b8'} fontWeight={600} fontFamily="sans-serif">
          {anySelected ? 'tap to place' : '— empty —'}
        </text>
      )}
    </g>
  );
}

// ─── INTRO STEPS ─────────────────────────────────────────────────────────────

const INTRO_STEPS = [
  { title: "Welcome to Railbound!", body: "You are a train dispatcher. A substance needs to travel from its starting station to the destination — but the conversion track cards are missing!", sub: "Click through to learn how to play." },
  { title: "Read the Problem", body: "A chemistry problem appears above the map. The blue START station shows what you have. The green DEST station shows the target unit. Yellow stations are intermediate steps.", sub: "Molar mass is always shown in the problem text." },
  { title: "Select a Track Card", body: "Click a card in the tray on the right to select it. Each card shows a conversion factor — numerator on top, denominator on bottom. The denominator unit must cancel the incoming unit.", sub: "Decoy cards with wrong values are mixed in the tray." },
  { title: "Place it on a Slot", body: "Click an empty slot on the map to place your selected card. Click an occupied slot with no card selected to return it to the tray.", sub: "Wrong cards glow red when you check your solution." },
  { title: "Watch for Decoys!", body: "Your tray contains cards with wrong molar masses, flipped fractions, or wrong Avogadro directions. Read the numbers carefully.", sub: "The substance's molar mass is always shown in the problem." },
  { title: "Depart the Train!", body: "Once all slots are filled, press Check Solution. If correct, the train animates through all stops. If wrong, it stops at the first wrong conversion factor.", sub: "3 consecutive single-step → unlock double-step → then triple-step!" },
];

function getStepsForTier(t: number) {
  if (t === 1) return 1;
  if (t === 2) return 2;
  return 3;
}

function getScenarioForTier(tier: number): RawScenario {
  const steps = getStepsForTier(tier);
  const eligible = RAW_SCENARIOS.filter(r => buildChain(r).units.length - 1 === steps);
  const pool = eligible.length > 0 ? eligible : RAW_SCENARIOS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RailboundEasy() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [cards, setCards] = useState<TrackCard[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  // wrongSlots: set of slot indices that are wrong
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  // correctRevealedSlots: set of slot indices whose ✓ has been revealed (train passed them)
  const [correctRevealedSlots, setCorrectRevealedSlots] = useState<Set<number>>(new Set());
  const [trainPx, setTrainPx] = useState<{ x: number; y: number; dir: 'h' | 'v' } | null>(null);
  const [trainStationIdx, setTrainStationIdx] = useState(-1);
  const [dynLabels, setDynLabels] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [rewardPopupOpen, setRewardPopupOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState<"idle"|"loading"|"ok"|"error">("idle");
  const [rewardMessage, setRewardMessage] = useState("");
  const [rewardClaimed, setRewardClaimed] = useState(false);
  // tier: 1=single, 2=double, 3=triple
  const [tier, setTier] = useState(1);
  // streak: consecutive correct within current tier
  const [streak, setStreak] = useState(0);
  // demoted: after a wrong answer, must get 1 correct at lower tier before returning
  const [demoted, setDemoted] = useState(false);
  const [scenarioKey, setScenarioKey] = useState(0);

  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNewScenario = (t: number) => {
    const raw = getScenarioForTier(t);
    const sc = buildScenario(raw, scenarioKey);
    setScenario(sc);
    setCards(shuffle([...sc.correctCards, ...sc.decoyCards]));
    setSelectedId(null); setResult(null); setWrongSlots(new Set());
    setCorrectRevealedSlots(new Set());
    setTrainPx(null); setTrainStationIdx(-1); setDynLabels([]); setAnimating(false); setShowHint(false);
    if (animRef.current) clearInterval(animRef.current);
    if (autoAdvRef.current) clearTimeout(autoAdvRef.current);
  };

  useEffect(() => {
    loadNewScenario(tier);
  }, [scenarioKey]);

  const handleSlotClick = (slotIndex: number) => {
    if (animating || !scenario || result === 'correct') return;
    if (selectedId === null) {
      const occ = cards.find(c => c.slotIndex === slotIndex);
      if (occ) {
        setCards(p => p.map(c => c.id === occ.id ? { ...c, slotIndex: null } : c));
        setResult(null); setWrongSlots(new Set()); setCorrectRevealedSlots(new Set());
      }
      return;
    }
    setCards(p => p.map(c => {
      if (c.id === selectedId) return { ...c, slotIndex };
      if (c.slotIndex === slotIndex) return { ...c, slotIndex: null };
      return c;
    }));
    setSelectedId(null); setResult(null); setWrongSlots(new Set()); setCorrectRevealedSlots(new Set());
  };

  async function awardGlucose(amount: number) {
    setRewardAmount(amount); setRewardPopupOpen(true); setRewardStatus("loading"); setRewardMessage("");
    try {
      const r = await fetch("/api/glucose/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { setRewardStatus("error"); setRewardMessage(data?.message ?? "Failed."); return; }
      setRewardStatus("ok"); setRewardMessage(`You earned ${amount} glucose!`);
    } catch { setRewardStatus("error"); setRewardMessage("Network error."); }
  }

  const checkSolution = () => {
    if (!scenario || animating) return;

    // Find first wrong slot
    let firstWrongSlotIndex = -1;
    const wrong = new Set<number>();
    for (const slot of scenario.slots) {
      const placed = cards.find(c => c.slotIndex === slot.index);
      if (!placed || placed.isDecoy || placed.inUnit !== slot.fromUnit || placed.outUnit !== slot.toUnit) {
        wrong.add(slot.index);
        if (firstWrongSlotIndex === -1) firstWrongSlotIndex = slot.index;
      }
    }

    if (wrong.size > 0) {
      // Wrong: animate train to first wrong slot, then stop and show ✗
      setResult('wrong');
      // Don't show wrong slots yet — reveal after animation
      runAnimation(firstWrongSlotIndex, wrong, false);
      // Tier demotion
      setTier(prev => {
        const next = prev > 1 ? prev - 1 : 1;
        return next;
      });
      setDemoted(true);
      setStreak(0);
    } else {
      // Correct: animate train all the way through
      setResult('correct');
      setWrongSlots(new Set());
      setSolvedCount(s => s + 1);
      const newStreak = streak + 1;

      let nextTier = tier;
      let nextStreak = newStreak;
      let nextDemoted = demoted;

      if (demoted) {
        // After demotion, 1 correct returns to the tier above
        nextTier = Math.min(tier + 1, 3);
        nextDemoted = false;
        nextStreak = 0;
      } else {
        // Normal progression
        if (tier === 1 && newStreak >= 3) { nextTier = 2; nextStreak = 0; }
        else if (tier === 2 && newStreak >= 2) { nextTier = 3; nextStreak = 0; }
      }

      setTier(nextTier);
      setStreak(nextStreak);
      setDemoted(nextDemoted);

      // Award after first correct triple-step
      if ((nextTier === 3 || tier === 3) && !rewardClaimed) {
        const wasTriple = getStepsForTier(tier) === 3;
        if (wasTriple) {
          setRewardClaimed(true);
          void awardGlucose(GLUCOSE_REWARD);
        }
      }

      runAnimation(-1, new Set(), true);
    }
  };

  // runAnimation: animate train through all steps
  // stopAtSlot: if >= 0, stop at that slot index and show wrong highlight
  // isCorrect: if true, reveal ✓ as train passes each slot; auto-advance at end
  const runAnimation = (stopAtSlot: number, wrongSet: Set<number>, isCorrect: boolean) => {
    if (!scenario) return;
    setAnimating(true);

    // Build ordered steps: [station0, slot0, station1, slot1, ..., stationN]
    // If stopAtSlot >= 0, we stop at that slot
    const steps: { x: number; y: number; dir: 'h' | 'v'; type: 'station' | 'slot'; index: number }[] = [];
    for (let i = 0; i < scenario.stations.length; i++) {
      const st = scenario.stations[i];
      const dir = scenario.slots[i]?.dir ?? scenario.slots[i - 1]?.dir ?? 'h';
      steps.push({ x: st.px, y: st.py, dir, type: 'station', index: i });
      if (i < scenario.slots.length) {
        const sl = scenario.slots[i];
        steps.push({ x: sl.px, y: sl.py, dir: sl.dir, type: 'slot', index: i });
      }
    }

    // Labels for stations
    const labels = scenario.stationValues.map((v, i) => `${fmtNum(v)} ${unitLabel(scenario.stations[i].unit)}`);
    setDynLabels(labels);

    let stepIdx = 0;
    let stoppedAt = -1;
    setTrainStationIdx(0);
    setTrainPx({ x: steps[0].x, y: steps[0].y, dir: steps[0].dir });

    animRef.current = setInterval(() => {
      stepIdx++;
      if (stepIdx >= steps.length) {
        clearInterval(animRef.current!);
        setAnimating(false);
        // Auto-advance after 2s if correct
        if (isCorrect) {
          autoAdvRef.current = setTimeout(() => {
            setScenarioKey(k => k + 1);
            setRewardClaimed(false);
          }, 2000);
        }
        return;
      }

      const step = steps[stepIdx];
      setTrainPx({ x: step.x, y: step.y, dir: step.dir });

      if (step.type === 'station') {
        setTrainStationIdx(step.index);
      }

      if (step.type === 'slot') {
        if (isCorrect) {
          // Reveal ✓ as train reaches the slot
          setCorrectRevealedSlots(prev => new Set([...prev, step.index]));
        }
        // If this is the wrong slot, stop here
        if (!isCorrect && step.index === stopAtSlot) {
          stoppedAt = step.index;
          clearInterval(animRef.current!);
          setAnimating(false);
          // Show wrong highlight now
          setWrongSlots(wrongSet);
          // Auto-advance after 2s
          autoAdvRef.current = setTimeout(() => {
            setScenarioKey(k => k + 1);
          }, 2000);
          return;
        }
      }
    }, 700);
  };

  const newProblem = () => {
    if (showIntro) return;
    if (animRef.current) clearInterval(animRef.current);
    if (autoAdvRef.current) clearTimeout(autoAdvRef.current);
    setScenarioKey(k => k + 1);
    setRewardClaimed(false);
  };

  const handleHint = () => {
    if (showIntro) return;
    // Penalty: lose streak (counts as wrong)
    setStreak(0);
    setDemoted(true);
    setShowHint(h => !h);
  };

  const closeIntro = () => { setShowIntro(false); setHasSeenIntro(true); setIntroStep(0); };
  const openIntro = () => { setIntroStep(0); setShowIntro(true); };
  const introData = INTRO_STEPS[introStep];

  const trayCards = cards.filter(c => c.slotIndex === null);
  const placedCards = cards.filter(c => c.slotIndex !== null);
  const allFilled = scenario ? scenario.slots.every(sl => cards.some(c => c.slotIndex === sl.index)) : false;
  const filledCount = scenario ? scenario.slots.filter(sl => cards.some(c => c.slotIndex === sl.index)).length : 0;

  const tierLabel = ['', 'Single-Step', 'Double-Step', 'Triple-Step'][tier] ?? '';

  return (
    <>
      <div className="flex flex-col items-center p-6 bg-white text-slate-900 min-h-screen dark:bg-black dark:text-slate-100">
        <h1 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100">Railbound: Dimensional Analysis</h1>
        <div className="mb-3 text-sm text-slate-500 dark:text-slate-400 flex gap-4 flex-wrap items-center justify-center">
          <span>Tier: <span className="font-bold text-blue-600 dark:text-sky-400">{tierLabel}</span></span>
          {solvedCount > 0 && <span>{solvedCount} solved</span>}
        </div>

        <div className="mb-5 flex gap-3 items-center flex-wrap">
          <button
            onClick={newProblem}
            disabled={showIntro}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-sky-500 dark:text-black dark:hover:bg-sky-400"
          >
            New Problem
          </button>
          <button
            onClick={checkSolution}
            disabled={!scenario || !allFilled || animating || result === 'correct' || showIntro}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
          >
            Check Solution
          </button>
          <button
            onClick={handleHint}
            disabled={showIntro}
            className="px-4 py-2 bg-amber-400 text-amber-900 rounded hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-amber-500 dark:text-black"
          >
            {showHint ? 'Hide Hint' : '💡 Hint'}
          </button>
          {hasSeenIntro && (
            <button onClick={openIntro} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
              How to Play
            </button>
          )}
          {result === 'correct' && !animating && <span className="text-green-600 dark:text-emerald-300 font-bold">🎉 Moving to next problem…</span>}
          {result === 'wrong' && !animating && <span className="text-red-500 dark:text-red-300 font-bold">❌ Wrong conversion — try again!</span>}
        </div>

        {scenario && (
          <div className="flex gap-6 items-start flex-wrap">
            {/* Map column */}
            <div className="flex flex-col gap-3">

              {/* Problem text — hidden during intro */}
              {!showIntro && (
                <div className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-6 py-4 text-center" style={{ width: MAP_W }}>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {scenario.problemText}
                  </div>
                  {showHint && (
                    <div className="mt-2 text-lg text-amber-600 font-semibold">
                      💡 {scenario.hint}
                    </div>
                  )}
                </div>
              )}

              {/* SVG map */}
              <div className="relative" style={{ width: MAP_W, height: MAP_H }}>
                {/* Intro overlay */}
                {showIntro && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center rounded bg-white/95 dark:bg-slate-950/95" style={{ width: MAP_W, height: MAP_H }}>
                    <div className="w-96 p-8 text-center">
                      <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">{introData.title}</h2>
                      <p className="text-gray-700 dark:text-slate-300 mb-3 text-base leading-relaxed">{introData.body}</p>
                      <p className="text-sm text-gray-400 dark:text-slate-500 italic">{introData.sub}</p>
                      <div className="flex justify-center gap-2 mt-5 mb-5">
                        {INTRO_STEPS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === introStep ? 'bg-blue-600 dark:bg-sky-400' : 'bg-gray-300 dark:bg-slate-700'}`} />)}
                      </div>
                      <div className="flex justify-between">
                        {introStep > 0
                          ? <button onClick={() => setIntroStep(s => s - 1)} className="px-5 py-2 bg-gray-200 text-slate-900 rounded hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100">Back</button>
                          : <div />}
                        {introStep < INTRO_STEPS.length - 1
                          ? <button onClick={() => setIntroStep(s => s + 1)} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-sky-500 dark:text-black">Next</button>
                          : <button onClick={closeIntro} className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-emerald-500 dark:text-black">Start Game!</button>}
                      </div>
                    </div>
                  </div>
                )}

                <svg width={MAP_W} height={MAP_H} style={{ display: 'block', borderRadius: 10, border: '3px solid #78716c' }}>
                  <defs>
                    <pattern id="dirt" patternUnits="userSpaceOnUse" width={24} height={24}>
                      <rect width={24} height={24} fill="#c8bfae" />
                      <circle cx={6} cy={6} r={1.5} fill="#b8ae9e" opacity={0.5} />
                      <circle cx={18} cy={14} r={1} fill="#d4cabb" opacity={0.4} />
                      <circle cx={10} cy={20} r={1.2} fill="#b0a898" opacity={0.35} />
                    </pattern>
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <rect width={MAP_W} height={MAP_H} fill="url(#dirt)" />
                  <ellipse cx={100} cy={MAP_H} rx={140} ry={70} fill="#a8b890" opacity={0.25} />
                  <ellipse cx={560} cy={MAP_H} rx={160} ry={60} fill="#a8b890" opacity={0.2} />
                  <ellipse cx={320} cy={MAP_H} rx={200} ry={50} fill="#c0cc9a" opacity={0.18} />

                  {scenario.segments.map((seg, i) => <SvgTrack key={i} {...seg} />)}

                  {scenario.slots.map(slot => {
                    const placed = cards.find(c => c.slotIndex === slot.index);
                    return (
                      <SvgSlot
                        key={slot.index}
                        slot={slot}
                        card={placed}
                        anySelected={selectedId !== null}
                        isWrong={wrongSlots.has(slot.index)}
                        isCorrectRevealed={correctRevealedSlots.has(slot.index)}
                        onClick={() => handleSlotClick(slot.index)}
                      />
                    );
                  })}

                  {scenario.stations.map((station, i) => (
                    <SvgStation
                      key={station.id}
                      station={station}
                      dynamicLabel={trainStationIdx === i && dynLabels[i] ? dynLabels[i] : undefined}
                    />
                  ))}

                  {trainPx && animating && (
                    <g>
                      <SvgTrain x={trainPx.x} y={trainPx.y} dir={trainPx.dir} color="#1d4ed8" />
                      <circle cx={trainPx.x - 14} cy={trainPx.y - 22} r={5} fill="white" opacity={0.55}>
                        <animate attributeName="r" values="3;7;3" dur="0.9s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.55;0.1;0.55" dur="0.9s" repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${trainPx.y - 22};${trainPx.y - 32};${trainPx.y - 22}`} dur="0.9s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={trainPx.x - 20} cy={trainPx.y - 30} r={3.5} fill="white" opacity={0.35}>
                        <animate attributeName="r" values="2;5;2" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.35;0.05;0.35" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#dbeafe', border: '2px solid #2563eb' }} />Start</span>
                <span className="flex items-center gap-1"><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#dcfce7', border: '2px solid #16a34a' }} />Destination</span>
                <span className="flex items-center gap-1"><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#fef9c3', border: '2px solid #d97706' }} />Intermediate</span>
                <span className="flex items-center gap-1"><span style={{ display: 'inline-block', width: 20, height: 3, background: '#6b7280', borderRadius: 2 }} />Rail</span>
                <span className="flex items-center gap-1"><span style={{ display: 'inline-block', width: 6, height: 10, background: '#92816e', borderRadius: 1 }} />Tie</span>
              </div>
            </div>

            {/* Right column — card tray */}
            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col gap-3 rounded-lg"
                style={{ width: 220, minHeight: 120 }}
                onClick={() => {
                  if (selectedId !== null) {
                    setCards(p => p.map(c => c.id === selectedId ? { ...c, slotIndex: null } : c));
                    setSelectedId(null); setResult(null); setWrongSlots(new Set()); setCorrectRevealedSlots(new Set());
                  }
                }}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Track Cards</div>
                <div className="text-xs text-slate-400 dark:text-slate-600">{filledCount}/{scenario.slots.length} slots filled</div>

                {trayCards.map(card => (
                  <div
                    key={card.id}
                    onClick={e => { e.stopPropagation(); setSelectedId(p => p === card.id ? null : card.id); }}
                    className="bg-white dark:bg-slate-100 text-slate-900 cursor-pointer flex flex-col items-center py-3 px-3 rounded-lg"
                    style={{
                      border: selectedId === card.id ? '3px solid #2563eb' : '2px solid #555',
                      boxShadow: selectedId === card.id ? '0 0 0 4px #bfdbfe' : '0 1px 3px rgba(0,0,0,0.12)',
                      transition: 'all 0.12s',
                      userSelect: 'none',
                      minHeight: 80,
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1d4ed8', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                      {card.numerator}
                    </span>
                    <div style={{ width: '90%', height: 2, background: '#1d4ed8', margin: '5px 0' }} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1d4ed8', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                      {card.denominator}
                    </span>
                  </div>
                ))}

                {placedCards.length > 0 && (
                  <>
                    <div className="text-xs text-slate-400 dark:text-slate-600 mt-1 font-semibold">Placed:</div>
                    {placedCards.map(card => (
                      <div key={card.id} className="bg-white dark:bg-slate-100 flex flex-col items-center py-3 px-3 rounded-lg opacity-30 cursor-not-allowed" style={{ border: '2px solid #aaa', userSelect: 'none', minHeight: 80 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#1d4ed8', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                          {card.numerator}
                        </span>
                        <div style={{ width: '90%', height: 2, background: '#1d4ed8', margin: '5px 0' }} />
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#1d4ed8', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                          {card.denominator}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reward popup */}
      {rewardPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🏆 Reward Earned!</h2>
            <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">You earned <span className="font-bold">{rewardAmount}</span> glucose by completing a triple-step problem!</p>
            <div className="mt-4 text-sm">
              {rewardStatus === "loading" && <p className="text-slate-600 dark:text-slate-300">Updating glucose...</p>}
              {rewardStatus === "ok" && <p className="text-emerald-700 dark:text-emerald-300">{rewardMessage}</p>}
              {rewardStatus === "error" && <p className="text-red-700 dark:text-red-300">{rewardMessage}</p>}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setRewardPopupOpen(false)} className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}