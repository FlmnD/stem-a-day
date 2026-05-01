'use client'
import React, { useEffect, useState, useRef } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type StoichUnit =
  | 'mol_A'        // moles of reactant A
  | 'mol_B'        // moles of reactant B
  | 'mol_P'        // moles of product
  | 'g_A'          // grams of reactant A
  | 'g_B'          // grams of reactant B
  | 'g_P'          // grams of product
  | 'g_excess'     // grams of excess reactant
  | 'mol_excess'   // moles of excess reactant
  | 'mol_needed'   // moles of limiting reagent needed
  | 'theoretical'; // theoretical yield in grams

interface TrackCard {
  id: number;
  numerator: string;
  denominator: string;
  inUnit: StoichUnit;
  outUnit: StoichUnit;
  isDecoy: boolean;
  slotIndex: number | null;
}

interface Station {
  id: string;
  unit: StoichUnit;
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
  fromUnit: StoichUnit;
  toUnit: StoichUnit;
  px: number;
  py: number;
  dir: 'h' | 'v';
}

interface TrackSegment { x1: number; y1: number; x2: number; y2: number; }

interface Scenario {
  id: number;
  title: string;
  problemText: string;
  hint: string;
  reactionLabel: string;
  stations: Station[];
  slots: Slot[];
  segments: TrackSegment[];
  correctCards: TrackCard[];
  decoyCards: TrackCard[];
  stationValues: number[];
  tier: 1 | 2 | 3;
  subProblem?: string; // for tier 2: which sub-problem this is
}

// ─── RAW REACTION DATA ────────────────────────────────────────────────────────

interface Reactant { symbol: string; coeff: number; mm: number; name: string; }
interface Product  { symbol: string; coeff: number; mm: number; name: string; }

interface RawReaction {
  label: string;          // e.g. "2H₂ + O₂ → 2H₂O"
  reactantA: Reactant;
  reactantB: Reactant;
  product: Product;
}

const REACTIONS: RawReaction[] = [
  {
    label: "2H₂ + O₂ → 2H₂O",
    reactantA: { symbol: "H₂",   coeff: 2, mm: 2.016,  name: "hydrogen" },
    reactantB: { symbol: "O₂",   coeff: 1, mm: 32.00,  name: "oxygen" },
    product:   { symbol: "H₂O",  coeff: 2, mm: 18.02,  name: "water" },
  },
  {
    label: "N₂ + 3H₂ → 2NH₃",
    reactantA: { symbol: "N₂",   coeff: 1, mm: 28.02,  name: "nitrogen" },
    reactantB: { symbol: "H₂",   coeff: 3, mm: 2.016,  name: "hydrogen" },
    product:   { symbol: "NH₃",  coeff: 2, mm: 17.03,  name: "ammonia" },
  },
  {
    label: "2CO + O₂ → 2CO₂",
    reactantA: { symbol: "CO",   coeff: 2, mm: 28.01,  name: "carbon monoxide" },
    reactantB: { symbol: "O₂",   coeff: 1, mm: 32.00,  name: "oxygen" },
    product:   { symbol: "CO₂",  coeff: 2, mm: 44.01,  name: "carbon dioxide" },
  },
  {
    label: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    reactantA: { symbol: "CH₄",  coeff: 1, mm: 16.04,  name: "methane" },
    reactantB: { symbol: "O₂",   coeff: 2, mm: 32.00,  name: "oxygen" },
    product:   { symbol: "CO₂",  coeff: 1, mm: 44.01,  name: "carbon dioxide" },
  },
  {
    label: "2Fe + 3Cl₂ → 2FeCl₃",
    reactantA: { symbol: "Fe",    coeff: 2, mm: 55.85,  name: "iron" },
    reactantB: { symbol: "Cl₂",  coeff: 3, mm: 70.90,  name: "chlorine" },
    product:   { symbol: "FeCl₃",coeff: 2, mm: 162.20, name: "iron(III) chloride" },
  },
  {
    label: "CaO + CO₂ → CaCO₃",
    reactantA: { symbol: "CaO",  coeff: 1, mm: 56.08,  name: "calcium oxide" },
    reactantB: { symbol: "CO₂",  coeff: 1, mm: 44.01,  name: "carbon dioxide" },
    product:   { symbol: "CaCO₃",coeff: 1, mm: 100.09, name: "calcium carbonate" },
  },
  {
    label: "2Na + Cl₂ → 2NaCl",
    reactantA: { symbol: "Na",   coeff: 2, mm: 22.99,  name: "sodium" },
    reactantB: { symbol: "Cl₂",  coeff: 1, mm: 70.90,  name: "chlorine" },
    product:   { symbol: "NaCl", coeff: 2, mm: 58.44,  name: "sodium chloride" },
  },
  {
    label: "2HCl + Mg → MgCl₂ + H₂",
    reactantA: { symbol: "HCl",  coeff: 2, mm: 36.46,  name: "hydrochloric acid" },
    reactantB: { symbol: "Mg",   coeff: 1, mm: 24.31,  name: "magnesium" },
    product:   { symbol: "MgCl₂",coeff: 1, mm: 95.21,  name: "magnesium chloride" },
  },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const GLUCOSE_REWARD = 20;
const MAP_W = 1100;
const MAP_H = 520;
const ST_W = 138;
const ST_H = 106;
const SL_W = 215;
const SL_H = 134;

// ─── BLUEPRINTS ───────────────────────────────────────────────────────────────

const BLUEPRINTS: Record<number, { stations: { fx: number; fy: number }[]; dirs: ('h'|'v')[] }[]> = {
  2: [
    { stations: [{ fx: 0.10, fy: 0.50 }, { fx: 0.90, fy: 0.50 }], dirs: ['h'] },
    { stations: [{ fx: 0.50, fy: 0.15 }, { fx: 0.50, fy: 0.85 }], dirs: ['v'] },
  ],
  3: [
    { stations: [{ fx: 0.10, fy: 0.50 }, { fx: 0.50, fy: 0.50 }, { fx: 0.90, fy: 0.50 }], dirs: ['h', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.25 }, { fx: 0.55, fy: 0.25 }, { fx: 0.55, fy: 0.78 }], dirs: ['h', 'v'] },
    { stations: [{ fx: 0.15, fy: 0.20 }, { fx: 0.15, fy: 0.80 }, { fx: 0.85, fy: 0.80 }], dirs: ['v', 'h'] },
  ],
  4: [
    { stations: [{ fx: 0.08, fy: 0.50 }, { fx: 0.36, fy: 0.50 }, { fx: 0.64, fy: 0.50 }, { fx: 0.92, fy: 0.50 }], dirs: ['h', 'h', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.20 }, { fx: 0.45, fy: 0.20 }, { fx: 0.45, fy: 0.80 }, { fx: 0.88, fy: 0.80 }], dirs: ['h', 'v', 'h'] },
    { stations: [{ fx: 0.10, fy: 0.20 }, { fx: 0.10, fy: 0.80 }, { fx: 0.60, fy: 0.80 }, { fx: 0.88, fy: 0.20 }], dirs: ['v', 'h', 'v'] },
  ],
  5: [
    { stations: [{ fx: 0.07, fy: 0.50 }, { fx: 0.28, fy: 0.50 }, { fx: 0.50, fy: 0.50 }, { fx: 0.72, fy: 0.50 }, { fx: 0.93, fy: 0.50 }], dirs: ['h','h','h','h'] },
    { stations: [{ fx: 0.10, fy: 0.20 }, { fx: 0.35, fy: 0.20 }, { fx: 0.35, fy: 0.80 }, { fx: 0.65, fy: 0.80 }, { fx: 0.90, fy: 0.20 }], dirs: ['h','v','h','v'] },
  ],
};

// ─── FORMAT ───────────────────────────────────────────────────────────────────

function fmtNum(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '?';
  const abs = Math.abs(v);
  if (abs >= 1e6) return v.toExponential(3);
  if (abs < 0.001 && abs > 0) return v.toExponential(3);
  if (Number.isInteger(v)) return v.toString();
  return parseFloat(v.toFixed(4)).toString();
}

function r(v: number, d = 4) { return parseFloat(v.toFixed(d)); }

function unitDisplayLabel(u: StoichUnit, rxn?: RawReaction): string {
  if (!rxn) return u;
  const m: Partial<Record<StoichUnit, string>> = {
    mol_A: `mol ${rxn.reactantA.symbol}`,
    mol_B: `mol ${rxn.reactantB.symbol}`,
    mol_P: `mol ${rxn.product.symbol}`,
    g_A:   `g ${rxn.reactantA.symbol}`,
    g_B:   `g ${rxn.reactantB.symbol}`,
    g_P:   `g ${rxn.product.symbol}`,
    g_excess:  `g excess`,
    mol_excess:`mol excess`,
    mol_needed:`mol needed`,
    theoretical:`g product`,
  };
  return m[u] ?? u;
}

function unitShort(u: StoichUnit, rxn?: RawReaction): string {
  if (!rxn) return u;
  const m: Partial<Record<StoichUnit, string>> = {
    mol_A: 'mol', mol_B: 'mol', mol_P: 'mol',
    g_A: 'g', g_B: 'g', g_P: 'g',
    g_excess: 'g', mol_excess: 'mol', mol_needed: 'mol',
    theoretical: 'g',
  };
  return m[u] ?? u;
}

function compoundForUnit(u: StoichUnit, rxn: RawReaction): string {
  const m: Partial<Record<StoichUnit, string>> = {
    mol_A: rxn.reactantA.symbol, mol_B: rxn.reactantB.symbol,
    mol_P: rxn.product.symbol,   g_A: rxn.reactantA.symbol,
    g_B: rxn.reactantB.symbol,   g_P: rxn.product.symbol,
    g_excess: 'excess', mol_excess: 'excess',
    mol_needed: 'needed', theoretical: 'yield',
  };
  return m[u] ?? '?';
}

// ─── CARD ID ─────────────────────────────────────────────────────────────────
let _cid = 1;
const nid = () => _cid++;

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }
function pickBP(n: number) {
  const opts = BLUEPRINTS[n] ?? BLUEPRINTS[3];
  return opts[Math.floor(Math.random() * opts.length)];
}

function buildTier1(rxn: RawReaction, givenMolA: number): Scenario {
  const { reactantA: A, product: P, label } = rxn;
  // Given: grams of A → mol A → mol P → grams P
  const gA = r(givenMolA * A.mm);
  const molA = givenMolA;
  const molP = r(molA * P.coeff / A.coeff);
  const gP = r(molP * P.mm);

  const units: StoichUnit[] = ['g_A', 'mol_A', 'mol_P', 'g_P'];
  const values = [gA, molA, molP, gP];

  const bp = pickBP(4);
  const stations: Station[] = units.map((u, i) => {
    const pos = bp.stations[i];
    const isEnd = i === units.length - 1;
    const valLabel = isEnd ? `? g ${P.symbol}` : `${fmtNum(values[i])} ${unitShort(u, rxn)}`;
    return {
      id: `s${i}`, unit: u, label: unitShort(u, rxn),
      valueLabel: valLabel,
      compoundLabel: compoundForUnit(u, rxn),
      isStart: i === 0, isEnd,
      px: Math.round(pos.fx * MAP_W), py: Math.round(pos.fy * MAP_H),
    };
  });

  const slots: Slot[] = [];
  const segments: TrackSegment[] = [];
  for (let i = 0; i < units.length - 1; i++) {
    const s1 = stations[i], s2 = stations[i + 1];
    const dir = bp.dirs[i] ?? 'h';
    slots.push({ index: i, fromUnit: units[i], toUnit: units[i + 1], px: Math.round((s1.px + s2.px) / 2), py: Math.round((s1.py + s2.py) / 2), dir });
    segments.push({ x1: s1.px, y1: s1.py, x2: s2.px, y2: s2.py });
  }

  // Correct cards
  const correct: TrackCard[] = [
    { id: nid(), numerator: `1 mol ${A.symbol}`, denominator: `${A.mm} g`, inUnit: 'g_A', outUnit: 'mol_A', isDecoy: false, slotIndex: null },
    { id: nid(), numerator: `${P.coeff} mol ${P.symbol}`, denominator: `${A.coeff} mol ${A.symbol}`, inUnit: 'mol_A', outUnit: 'mol_P', isDecoy: false, slotIndex: null },
    { id: nid(), numerator: `${P.mm} g`, denominator: `1 mol ${P.symbol}`, inUnit: 'mol_P', outUnit: 'g_P', isDecoy: false, slotIndex: null },
  ];

  // Decoys: flipped mole ratio, wrong MM, inverted g→mol
  const wrongMolRatio = `${A.coeff} mol ${P.symbol}`;
  const decoys: TrackCard[] = [
    { id: nid(), numerator: `${A.coeff} mol ${A.symbol}`, denominator: `${P.coeff} mol ${P.symbol}`, inUnit: 'mol_P', outUnit: 'mol_A', isDecoy: true, slotIndex: null },
    { id: nid(), numerator: `${A.mm} g`, denominator: `1 mol ${A.symbol}`, inUnit: 'mol_A', outUnit: 'g_A', isDecoy: true, slotIndex: null },
    { id: nid(), numerator: `1 mol ${P.symbol}`, denominator: `${P.mm} g`, inUnit: 'g_P', outUnit: 'mol_P', isDecoy: true, slotIndex: null },
    { id: nid(), numerator: wrongMolRatio, denominator: `${P.coeff} mol ${A.symbol}`, inUnit: 'mol_A', outUnit: 'mol_P', isDecoy: true, slotIndex: null },
  ];

  const problemText = `${fmtNum(gA)} g of ${A.name} (${A.symbol}) reacts per the equation below. How many grams of ${P.name} (${P.symbol}) are produced?`;
  const hint = `g ${A.symbol} ÷ ${A.mm} = mol ${A.symbol} → × (${P.coeff}/${A.coeff}) = mol ${P.symbol} → × ${P.mm} = g ${P.symbol}`;

  return {
    id: Math.random(), title: `${A.symbol} → ${P.symbol}`, tier: 1,
    problemText, hint, reactionLabel: label,
    stations, slots, segments,
    correctCards: correct, decoyCards: decoys.slice(0, 4),
    stationValues: values,
  };
}

// ─── TIER 2a: g_A → mol_A → mol_P (reactant A stoich, 3-station) ─────────────
// ─── TIER 2b: g_B → mol_B → mol_P (reactant B stoich, 3-station) ─────────────

function buildTier2(rxn: RawReaction, givenMolA: number, subProblem: 'A' | 'B'): Scenario {
  const { reactantA: A, reactantB: B, product: P, label } = rxn;
  const isB = subProblem === 'B';
  const R = isB ? B : A;

  const molR = givenMolA;
  const gR = r(molR * R.mm);
  const molP = r(molR * P.coeff / R.coeff);

  const startUnit: StoichUnit = isB ? 'g_B' : 'g_A';
  const midUnit: StoichUnit   = isB ? 'mol_B' : 'mol_A';
  const units: StoichUnit[] = [startUnit, midUnit, 'mol_P'];
  const values = [gR, molR, molP];

  const bp = pickBP(3);
  const stations: Station[] = units.map((u, i) => {
    const pos = bp.stations[i];
    const isEnd = i === 2;
    const valLabel = isEnd ? `? mol ${P.symbol}` : `${fmtNum(values[i])} ${unitShort(u, rxn)}`;
    return {
      id: `s${i}`, unit: u, label: unitShort(u, rxn),
      valueLabel: valLabel,
      compoundLabel: compoundForUnit(u, rxn),
      isStart: i === 0, isEnd,
      px: Math.round(pos.fx * MAP_W), py: Math.round(pos.fy * MAP_H),
    };
  });

  const slots: Slot[] = [];
  const segments: TrackSegment[] = [];
  for (let i = 0; i < 2; i++) {
    const s1 = stations[i], s2 = stations[i + 1];
    const dir = bp.dirs[i] ?? 'h';
    slots.push({ index: i, fromUnit: units[i], toUnit: units[i + 1], px: Math.round((s1.px + s2.px) / 2), py: Math.round((s1.py + s2.py) / 2), dir });
    segments.push({ x1: s1.px, y1: s1.py, x2: s2.px, y2: s2.py });
  }

  const correct: TrackCard[] = [
    { id: nid(), numerator: `1 mol ${R.symbol}`, denominator: `${R.mm} g`, inUnit: startUnit, outUnit: midUnit, isDecoy: false, slotIndex: null },
    { id: nid(), numerator: `${P.coeff} mol ${P.symbol}`, denominator: `${R.coeff} mol ${R.symbol}`, inUnit: midUnit, outUnit: 'mol_P', isDecoy: false, slotIndex: null },
  ];

  const other = isB ? A : B;
  const decoys: TrackCard[] = [
    { id: nid(), numerator: `${R.coeff} mol ${R.symbol}`, denominator: `${P.coeff} mol ${P.symbol}`, inUnit: 'mol_P', outUnit: midUnit, isDecoy: true, slotIndex: null },
    { id: nid(), numerator: `${R.mm} g`, denominator: `1 mol ${R.symbol}`, inUnit: midUnit, outUnit: startUnit, isDecoy: true, slotIndex: null },
    { id: nid(), numerator: `${P.coeff} mol ${P.symbol}`, denominator: `${other.coeff} mol ${other.symbol}`, inUnit: midUnit, outUnit: 'mol_P', isDecoy: true, slotIndex: null },
  ];

  const problemText = isB
    ? `Using the reaction below: ${fmtNum(gR)} g of ${B.name} (${B.symbol}, MM = ${B.mm} g/mol) is available. How many moles of ${P.name} (${P.symbol}) could it produce?`
    : `Using the reaction below: ${fmtNum(gR)} g of ${A.name} (${A.symbol}, MM = ${A.mm} g/mol) is available. How many moles of ${P.name} (${P.symbol}) could it produce?`;
  const hint = `g ${R.symbol} ÷ ${R.mm} = mol ${R.symbol}, then × (${P.coeff}/${R.coeff}) = mol ${P.symbol}`;

  return {
    id: Math.random(), title: `${R.symbol} → mol ${P.symbol}`, tier: 2,
    problemText, hint, reactionLabel: label,
    subProblem: isB ? 'reactant B → mol product' : 'reactant A → mol product',
    stations, slots, segments,
    correctCards: correct, decoyCards: decoys,
    stationValues: values,
  };
}

// ─── TIER 3: Limiting Reagent + Theoretical Yield + Excess ───────────────────
// Chain: mol_A → mol_P (theoretical) → g_P, then excess calc
// Full chain: g_A → mol_A → mol_P → g_P  (then separately excess)
// We encode as 5-station chain:
// g_A → mol_A → mol_P(from A) [limiting path] → g_P → g_excess
// Slots:
//   0: g_A → mol_A  (÷ MM_A)
//   1: mol_A → mol_P  (mole ratio A→P)
//   2: mol_P → g_P  (× MM_P = theoretical yield)
//   3: g_P → g_excess  (uses mol_B needed = mol_A × B.coeff/A.coeff, then excess = given_B - mol_needed × MM_B)
// But excess is a bit special — let's encode it as:
//   Station 4 = "g_excess" with label of the excess reactant

function buildTier3(rxn: RawReaction, givenMolA: number, givenMolB: number): Scenario {
  const { reactantA: A, reactantB: B, product: P, label } = rxn;

  // Determine limiting reagent
  const molPfromA = r(givenMolA * P.coeff / A.coeff);
  const molPfromB = r(givenMolB * P.coeff / B.coeff);

  const limitingIsA = molPfromA <= molPfromB;
  const limitingR = limitingIsA ? A : B;
  const excessR   = limitingIsA ? B : A;

  const limitingMol = limitingIsA ? givenMolA : givenMolB;
  const excessMol   = limitingIsA ? givenMolB : givenMolA;

  const molP_theoretical = r(Math.min(molPfromA, molPfromB));
  const gP_theoretical   = r(molP_theoretical * P.mm);

  const molExcessUsed = r(limitingMol * excessR.coeff / limitingR.coeff);
  const gExcessRemaining = r((excessMol - molExcessUsed) * excessR.mm);

  const limStartUnit: StoichUnit = limitingIsA ? 'g_A' : 'g_B';
  const limMidUnit: StoichUnit   = limitingIsA ? 'mol_A' : 'mol_B';

  // ✅ Correct chain
  const units: StoichUnit[] = [
    'g_P',
    'mol_P',
    limMidUnit,   // mol_A or mol_B
    limStartUnit  // g_A or g_B
  ];

  const values = [
    gP_theoretical,
    molP_theoretical,
    limitingMol,
    r(limitingMol * limitingR.mm)
  ];

  const bp = pickBP(5);

  const stations: Station[] = units.map((u, i) => {
    const pos = bp.stations[i];
    const isEnd = i === units.length - 1;

    const valLabel = isEnd
      ? `? g ${excessR.symbol}`
      : `${fmtNum(values[i])} ${unitShort(u, rxn)}`;

    return {
      id: `s${i}`,
      unit: u,
      label: unitShort(u, rxn),
      valueLabel: valLabel,
      compoundLabel: compoundForUnit(u, rxn),
      isStart: i === 0,
      isEnd,
      px: Math.round(pos.fx * MAP_W),
      py: Math.round(pos.fy * MAP_H),
    };
  });

  const slots: Slot[] = [];
  const segments: TrackSegment[] = [];

  for (let i = 0; i < units.length - 1; i++) {
    const s1 = stations[i], s2 = stations[i + 1];
    const dir = bp.dirs[i] ?? 'h';

    slots.push({
      index: i,
      fromUnit: units[i],
      toUnit: units[i + 1],
      px: Math.round((s1.px + s2.px) / 2),
      py: Math.round((s1.py + s2.py) / 2),
      dir
    });

    segments.push({ x1: s1.px, y1: s1.py, x2: s2.px, y2: s2.py });
  }

  // ✅ Correct cards
  const correct: TrackCard[] = [
    {
      id: nid(),
      numerator: `1 mol ${P.symbol}`,
      denominator: `${P.mm} g`,
      inUnit: 'g_P',
      outUnit: 'mol_P',
      isDecoy: false,
      slotIndex: null,
    },
    {
      id: nid(),
      numerator: `${limitingR.coeff} mol ${limitingR.symbol}`,
      denominator: `${P.coeff} mol ${P.symbol}`,
      inUnit: 'mol_P',
      outUnit: limMidUnit,
      isDecoy: false,
      slotIndex: null,
    },
    {
      id: nid(),
      numerator: `${limitingR.mm} g`,
      denominator: `1 mol ${limitingR.symbol}`,
      inUnit: limMidUnit,
      outUnit: limStartUnit,
      isDecoy: false,
      slotIndex: null,
    },
  ];

  const decoys: TrackCard[] = [
    {
      id: nid(),
      numerator: `1 mol ${limitingR.symbol}`,
      denominator: `${limitingR.mm} g`,
      inUnit: limStartUnit,
      outUnit: limMidUnit,
      isDecoy: true,
      slotIndex: null,
    },
    {
      id: nid(),
      numerator: `${P.coeff} mol ${P.symbol}`,
      denominator: `${limitingR.coeff} mol ${limitingR.symbol}`,
      inUnit: limMidUnit,
      outUnit: 'mol_P',
      isDecoy: true,
      slotIndex: null,
    },
  ];

  const problemText = `${fmtNum(gP_theoretical)} g of ${P.symbol} is produced. How many grams of reactant were used in the reaction?`;
  const hint = `Use limiting reagent → mol → mol product → grams product → excess remaining.`;

  return {
    id: Math.random(),
    title: `Limiting Reagent: ${label}`,
    tier: 3,
    problemText,
    hint,
    reactionLabel: label,
    stations,
    slots,
    segments,
    correctCards: correct,
    decoyCards: decoys,
    stationValues: values,
  };
}

function gExcessUsed(limitingMol: number, excessR: Reactant, limitingR: Reactant) {
  return r(limitingMol * excessR.coeff / limitingR.coeff * excessR.mm);
}

// ─── SCENARIO FACTORY ─────────────────────────────────────────────────────────

function pickReaction(): RawReaction {
  return REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
}

function normalize(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}

function dedupeCards(cards: TrackCard[]): TrackCard[] {
  const seen = new Set<string>();

  return cards.filter(card => {
    const key = [
      normalize(card.numerator),
      normalize(card.denominator),
      card.inUnit,
      card.outUnit
    ].join('|');

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildScenarioForTier(tier: 1 | 2 | 3, subStep?: number): Scenario {
  const rxn = pickReaction();

  // Pick nice round-ish mol amounts
  const niceAmounts = [1, 1.5, 2, 2.5, 3, 0.5, 4, 0.75];
  const molA = niceAmounts[Math.floor(Math.random() * niceAmounts.length)];
  const molB = niceAmounts[Math.floor(Math.random() * niceAmounts.length)];

  if (tier === 1) return buildTier1(rxn, molA);
  if (tier === 2) return buildTier2(rxn, molA, subStep === 1 ? 'B' : 'A');
  return buildTier3(rxn, molA, molB);
}

// ─── SVG COMPONENTS ───────────────────────────────────────────────────────────

function SvgTrack({ x1, y1, x2, y2 }: TrackSegment) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const uy = dx / len, ux = dy / len;
  const numTies = Math.max(2, Math.round(len / 22));
  return (
    <g>
      {Array.from({ length: numTies }, (_, i) => {
        const t = (i + 0.5) / numTies;
        const cx = x1 + (x2-x1)*t, cy = y1 + (y2-y1)*t;
        return <line key={i} x1={cx - ux*10} y1={cy + uy*10} x2={cx + ux*10} y2={cy - uy*10} stroke="#92816e" strokeWidth={5} strokeLinecap="round" />;
      })}
      <line x1={x1 - ux*5} y1={y1 + uy*5} x2={x2 - ux*5} y2={y2 + uy*5} stroke="#6b7280" strokeWidth={3} strokeLinecap="round" />
      <line x1={x1 + ux*5} y1={y1 - uy*5} x2={x2 + ux*5} y2={y2 - uy*5} stroke="#6b7280" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

function SvgStation({ station, dynamicLabel, rxn }: { station: Station; dynamicLabel?: string; rxn?: RawReaction }) {
  const { px, py, isStart, isEnd, compoundLabel } = station;
  const val = dynamicLabel ?? station.valueLabel;
  const unit = station.label;
  const valNum = val.split(" ")[0];

  return (
    <g>
      <rect x={px - ST_W/2} y={py - ST_H/2} width={ST_W} height={ST_H} rx={10}
        fill={isStart ? '#dbeafe' : isEnd ? '#fce7f3' : '#fef9c3'} stroke="#333" strokeWidth={3} />
      <text x={px} y={py - 28} textAnchor="middle" fontSize={16} fontWeight={700} fontFamily="'Courier New', monospace" fill="#1e293b">
        {valNum}
      </text>
      <text x={px} y={py - 6} textAnchor="middle" fontSize={24} fontWeight={900} fill="#1e293b">
        {unit}
      </text>
      <text x={px} y={py + 16} textAnchor="middle" fontSize={13} fontWeight={600} fill="#374151">
        {compoundLabel}
      </text>
      <text x={px} y={py + 36} textAnchor="middle" fontSize={11} fontWeight={800} fill={isStart ? '#1d4ed8' : isEnd ? '#be185d' : '#92400e'}>
        {isStart ? "START" : isEnd ? "DEST" : ""}
      </text>
    </g>
  );
}

function SvgTrain({ x, y, dir, color = '#dc2626' }: { x: number; y: number; dir: 'h'|'v'; color?: string }) {
  const w = 48, h = 24;
  const transform = dir === 'v'
    ? `translate(${x - h/2},${y - w/2}) rotate(90,${h/2},${w/2})`
    : `translate(${x - w/2},${y - h/2})`;
  return (
    <g transform={transform}>
      <rect x={0} y={3} width={w} height={h-4} rx={5} fill={color} />
      <rect x={w-14} y={1} width={14} height={h} rx={3} fill={color} opacity={0.85} />
      <rect x={w-12} y={4} width={9} height={8} rx={1.5} fill="#fecaca" />
      <rect x={5} y={-4} width={5} height={7} rx={2} fill={color} opacity={0.75} />
      {[9, 22, 36].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={h+1} r={5} fill="#374151" />
          <circle cx={cx} cy={h+1} r={2.2} fill="#9ca3af" />
        </g>
      ))}
      <line x1={9} y1={h+1} x2={36} y2={h+1} stroke="#6b7280" strokeWidth={1.5} />
      <circle cx={w-2} cy={h/2} r={3.5} fill="#fef08a" opacity={0.9} />
    </g>
  );
}

function SvgSlot({ slot, card, anySelected, isWrong, isCorrectRevealed, onClick }: {
  slot: Slot; card?: TrackCard; anySelected: boolean; isWrong: boolean; isCorrectRevealed: boolean; onClick: () => void;
}) {
  const { px, py } = slot;
  const x = px - SL_W/2, y = py - SL_H/2;
  const bg = isWrong ? '#fef2f2' : isCorrectRevealed && card ? '#f0fdf4' : card ? '#fffbeb' : anySelected ? '#eff6ff' : '#f8fafc';
  const stroke = isWrong ? '#f87171' : isCorrectRevealed && card ? '#16a34a' : card ? '#78716c' : anySelected ? '#93c5fd' : '#d1d5db';
  const tc = isWrong ? '#dc2626' : isCorrectRevealed && card ? '#15803d' : '#1d4ed8';

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect x={x+2} y={y+2} width={SL_W} height={SL_H} rx={7} fill="rgba(0,0,0,0.08)" />
      <rect x={x} y={y} width={SL_W} height={SL_H} rx={7} fill={bg} stroke={stroke} strokeWidth={card ? 2 : 1.5} strokeDasharray={card ? undefined : '5,4'} />
      {card ? (
        <>
          <text x={px} y={y+28} textAnchor="middle" fontSize={14} fontWeight={700} fill={tc} fontFamily="'Courier New', monospace">
            {card.numerator.length > 26 ? card.numerator.slice(0,25)+'…' : card.numerator}
          </text>
          <line x1={x+10} y1={py} x2={x+SL_W-10} y2={py} stroke={tc} strokeWidth={2} />
          <text x={px} y={y+SL_H-16} textAnchor="middle" fontSize={14} fontWeight={700} fill={tc} fontFamily="'Courier New', monospace">
            {card.denominator.length > 26 ? card.denominator.slice(0,25)+'…' : card.denominator}
          </text>
          {isWrong && <text x={px} y={y+SL_H+16} textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={800}>✗ wrong</text>}
          {isCorrectRevealed && !isWrong && <text x={px} y={y+SL_H+16} textAnchor="middle" fontSize={11} fill="#16a34a" fontWeight={800}>✓</text>}
        </>
      ) : (
        <text x={px} y={py+5} textAnchor="middle" fontSize={11} fill={anySelected ? '#3b82f6' : '#94a3b8'} fontWeight={600}>
          {anySelected ? 'tap to place' : '— empty —'}
        </text>
      )}
    </g>
  );
}

// ─── INTRO ────────────────────────────────────────────────────────────────────

const INTRO_STEPS = [
  { title: "Welcome to Railbound: Hard!", body: "You are a stoichiometry engineer. Chemical reactions need to travel from reactant stations to product stations — but the mole ratio cards are missing!", sub: "Click through to learn the rules." },
  { title: "Stoichiometry Tiers", body: "Tier 1: Convert grams of one reactant to grams of product (3 conversion steps). Tier 2: Convert grams of each reactant to moles of product separately. Tier 3: Full limiting reagent — find theoretical yield AND grams of excess reactant.", sub: "Master each tier to unlock the next." },
  { title: "The Mole Ratio Card", body: "The key new card is the mole ratio: it converts moles of one substance to moles of another using the balanced equation coefficients. Example: for 2H₂ + O₂ → 2H₂O, the card for H₂ → H₂O is (2 mol H₂O / 2 mol H₂).", sub: "Always use the balanced equation shown above the map." },
  { title: "Limiting Reagent (Tier 3)", body: "The limiting reagent runs out first. You'll be told which reactant is limiting. Use its moles to find theoretical yield. Then calculate how many grams of the excess reactant remain.", sub: "The last slot card shows grams of excess remaining per grams of product." },
  { title: "Place & Check", body: "Select a card from the tray, then click a slot on the map to place it. When all slots are filled, press Check Solution. The train animates from START to DEST — stopping at the first wrong card.", sub: "Hints cost you your streak!" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RailboundHard() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [cards, setCards] = useState<TrackCard[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  const [correctRevealedSlots, setCorrectRevealedSlots] = useState<Set<number>>(new Set());
  const [trainPx, setTrainPx] = useState<{ x: number; y: number; dir: 'h'|'v' } | null>(null);
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
  const [tier, setTier] = useState<1|2|3>(1);
  const [streak, setStreak] = useState(0);
  const [demoted, setDemoted] = useState(false);
  // Tier 2 alternates between sub-problems A and B
  const [tier2Sub, setTier2Sub] = useState(0); // 0=A, 1=B
  const [scenarioKey, setScenarioKey] = useState(0);

  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNew = (t: 1|2|3, sub = 0) => {
    const sc = buildScenarioForTier(t, sub);
    setScenario(sc);
    const allCards = dedupeCards([
      ...sc.correctCards,
      ...sc.decoyCards
    ]);
    setCards(shuffle(allCards));
    setSelectedId(null); setResult(null); setWrongSlots(new Set());
    setCorrectRevealedSlots(new Set());
    setTrainPx(null); setTrainStationIdx(-1); setDynLabels([]);
    setAnimating(false); setShowHint(false);
    if (animRef.current) clearInterval(animRef.current);
    if (autoAdvRef.current) clearTimeout(autoAdvRef.current);
  };

  useEffect(() => { loadNew(tier, tier2Sub); }, [scenarioKey]);

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
    let firstWrong = -1;
    const wrong = new Set<number>();
    for (const slot of scenario.slots) {
      const placed = cards.find(c => c.slotIndex === slot.index);
      if (!placed || placed.isDecoy || placed.inUnit !== slot.fromUnit || placed.outUnit !== slot.toUnit) {
        wrong.add(slot.index);
        if (firstWrong === -1) firstWrong = slot.index;
      }
    }

    if (wrong.size > 0) {
      setResult('wrong');
      runAnimation(firstWrong, wrong, false);
      setTier(prev => (prev > 1 ? (prev - 1) as 1|2|3 : 1));
      setDemoted(true);
      setStreak(0);
    } else {
      setResult('correct');
      setWrongSlots(new Set());
      setSolvedCount(s => s + 1);
      const newStreak = streak + 1;

      let nextTier = tier;
      let nextStreak = newStreak;
      let nextDemoted = demoted;
      let nextSub = tier2Sub;

      if (demoted) {
        nextTier = Math.min(tier + 1, 3) as 1|2|3;
        nextDemoted = false;
        nextStreak = 0;
        nextSub = 0;
      } else if (tier === 1 && newStreak >= 3) {
        nextTier = 2; nextStreak = 0; nextSub = 0;
      } else if (tier === 2) {
        // Must do both sub A and sub B correctly
        if (tier2Sub === 0) {
          // Completed A, now do B
          nextSub = 1;
          nextStreak = 1; // halfway
        } else if (tier2Sub === 1 && newStreak >= 2) {
          // Completed both A and B
          nextTier = 3; nextStreak = 0; nextSub = 0;
        }
      }

      setTier(nextTier);
      setStreak(nextStreak);
      setDemoted(nextDemoted);
      setTier2Sub(nextSub);

      if (tier === 3 && !rewardClaimed) {
        setRewardClaimed(true);
        void awardGlucose(GLUCOSE_REWARD);
      }

      runAnimation(-1, new Set(), true, nextTier, nextSub, nextDemoted);
    }
  };

  const runAnimation = (
    stopAtSlot: number,
    wrongSet: Set<number>,
    isCorrect: boolean,
    nextTier?: 1|2|3,
    nextSub?: number,
    nextDemoted?: boolean,
  ) => {
    if (!scenario) return;
    setAnimating(true);

    const steps: { x: number; y: number; dir: 'h'|'v'; type: 'station'|'slot'; index: number }[] = [];
    for (let i = 0; i < scenario.stations.length; i++) {
      const st = scenario.stations[i];
      const dir = scenario.slots[i]?.dir ?? scenario.slots[i-1]?.dir ?? 'h';
      steps.push({ x: st.px, y: st.py, dir, type: 'station', index: i });
      if (i < scenario.slots.length) {
        const sl = scenario.slots[i];
        steps.push({ x: sl.px, y: sl.py, dir: sl.dir, type: 'slot', index: i });
      }
    }

    const labels = scenario.stationValues.map((v, i) =>
      `${fmtNum(v)} ${scenario.stations[i].label}`
    );
    setDynLabels(labels);

    let stepIdx = 0;
    setTrainStationIdx(0);
    setTrainPx({ x: steps[0].x, y: steps[0].y, dir: steps[0].dir });

    animRef.current = setInterval(() => {
      stepIdx++;
      if (stepIdx >= steps.length) {
        clearInterval(animRef.current!);
        setAnimating(false);
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
      if (step.type === 'station') setTrainStationIdx(step.index);
      if (step.type === 'slot') {
        if (isCorrect) setCorrectRevealedSlots(prev => new Set([...prev, step.index]));
        if (!isCorrect && step.index === stopAtSlot) {
          clearInterval(animRef.current!);
          setAnimating(false);
          setWrongSlots(wrongSet);
          autoAdvRef.current = setTimeout(() => setScenarioKey(k => k + 1), 2000);
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
    setStreak(0); setDemoted(true); setShowHint(h => !h);
  };

  const closeIntro = () => { setShowIntro(false); setHasSeenIntro(true); setIntroStep(0); };
  const openIntro  = () => { setIntroStep(0); setShowIntro(true); };

  const trayCards   = cards.filter(c => c.slotIndex === null);
  const placedCards = cards.filter(c => c.slotIndex !== null);
  const allFilled   = scenario ? scenario.slots.every(sl => cards.some(c => c.slotIndex === sl.index)) : false;
  const filledCount = scenario ? scenario.slots.filter(sl => cards.some(c => c.slotIndex === sl.index)).length : 0;

  const tierLabel = ['', 'Single Reactant', 'Two Reactants', 'Limiting Reagent'][tier] ?? '';
  const tierColor = tier === 1 ? '#2563eb' : tier === 2 ? '#d97706' : '#dc2626';

  const streakDisplay = demoted
    ? '1 correct needed to return'
    : tier === 1 ? `Streak: ${streak}/3`
    : tier === 2 ? `Sub-problem: ${tier2Sub === 0 ? 'Reactant A' : 'Reactant B'} (${streak}/2)`
    : `🏆 Triple Tier`;

  return (
    <>
      <div className="flex flex-col items-center p-6 bg-white text-slate-900 min-h-screen dark:bg-black dark:text-slate-100">
        <h1 className="text-xl font-bold mb-1">Railbound: Stoichiometry</h1>
        <div className="mb-3 text-sm flex gap-4 flex-wrap items-center justify-center text-slate-500 dark:text-slate-400">
          <span>Tier: <span className="font-bold" style={{ color: tierColor }}>{tierLabel}</span></span>
          <span>{streakDisplay}</span>
          {solvedCount > 0 && <span>✅ {solvedCount} solved</span>}
        </div>

        <div className="mb-5 flex gap-3 items-center flex-wrap">
          <button onClick={newProblem} disabled={showIntro}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-sky-500 dark:text-black">
            New Problem
          </button>
          <button onClick={checkSolution} disabled={!scenario || !allFilled || animating || result === 'correct' || showIntro}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-emerald-500 dark:text-black">
            Check Solution
          </button>
          <button onClick={handleHint} disabled={showIntro}
            className="px-4 py-2 bg-amber-400 text-amber-900 rounded hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed">
            {showHint ? 'Hide Hint' : '💡 Hint'}
          </button>
          {hasSeenIntro && (
            <button onClick={openIntro} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100">
              How to Play
            </button>
          )}
          {result === 'correct' && !animating && <span className="font-bold text-green-600 dark:text-emerald-300">🎉 Moving to next…</span>}
          {result === 'wrong' && !animating && <span className="font-bold text-red-500 dark:text-red-300">❌ Wrong card — check highlighted slot!</span>}
        </div>

        {scenario && (
          <div className="flex gap-6 items-start flex-wrap">
            <div className="flex flex-col gap-3">

              {/* Problem text — hidden during intro */}
              {!showIntro && (
                <div className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-6 py-4 text-center" style={{ width: MAP_W }}>
                  {/* Reaction equation */}
                  <div className="text-base font-mono font-bold text-slate-500 dark:text-slate-400 mb-2 tracking-wide">
                    {scenario.reactionLabel}
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {scenario.problemText}
                  </div>
                  {scenario.subProblem && (
                    <div className="mt-1 text-sm text-amber-600 font-semibold">{scenario.subProblem}</div>
                  )}
                  {showHint && (
                    <div className="mt-2 text-base text-amber-600 font-semibold">💡 {scenario.hint}</div>
                  )}
                </div>
              )}

              {/* SVG Map */}
              <div className="relative" style={{ width: MAP_W, height: MAP_H }}>
                {showIntro && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center rounded bg-white/95 dark:bg-slate-950/95" style={{ width: MAP_W, height: MAP_H }}>
                    <div className="w-105 p-8 text-center">
                      <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">{INTRO_STEPS[introStep].title}</h2>
                      <p className="text-gray-700 dark:text-slate-300 mb-3 text-base leading-relaxed">{INTRO_STEPS[introStep].body}</p>
                      <p className="text-sm text-gray-400 dark:text-slate-500 italic">{INTRO_STEPS[introStep].sub}</p>
                      <div className="flex justify-center gap-2 mt-5 mb-5">
                        {INTRO_STEPS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === introStep ? 'bg-red-600' : 'bg-gray-300 dark:bg-slate-700'}`} />)}
                      </div>
                      <div className="flex justify-between">
                        {introStep > 0
                          ? <button onClick={() => setIntroStep(s => s-1)} className="px-5 py-2 bg-gray-200 text-slate-900 rounded hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100">Back</button>
                          : <div />}
                        {introStep < INTRO_STEPS.length - 1
                          ? <button onClick={() => setIntroStep(s => s+1)} className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700">Next</button>
                          : <button onClick={closeIntro} className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700">Start!</button>}
                      </div>
                    </div>
                  </div>
                )}

                <svg width={MAP_W} height={MAP_H} style={{ display: 'block', borderRadius: 10, border: '3px solid #78716c' }}>
                  <defs>
                    <pattern id="steel" patternUnits="userSpaceOnUse" width={30} height={30}>
                      <rect width={30} height={30} fill="#94a3b8" />
                      <rect x={0} y={0} width={15} height={15} fill="#9dafc0" opacity={0.4} />
                      <rect x={15} y={15} width={15} height={15} fill="#8a9fb0" opacity={0.3} />
                    </pattern>
                  </defs>
                  <rect width={MAP_W} height={MAP_H} fill="url(#steel)" />
                  {/* Subtle industrial glow lines */}
                  <line x1={0} y1={MAP_H/2} x2={MAP_W} y2={MAP_H/2} stroke="#cbd5e1" strokeWidth={1} opacity={0.2} />

                  {scenario.segments.map((seg, i) => <SvgTrack key={i} {...seg} />)}

                  {scenario.slots.map(slot => {
                    const placed = cards.find(c => c.slotIndex === slot.index);
                    return (
                      <SvgSlot key={slot.index} slot={slot} card={placed}
                        anySelected={selectedId !== null}
                        isWrong={wrongSlots.has(slot.index)}
                        isCorrectRevealed={correctRevealedSlots.has(slot.index)}
                        onClick={() => handleSlotClick(slot.index)} />
                    );
                  })}

                  {scenario.stations.map((station, i) => (
                    <SvgStation key={station.id} station={station}
                      dynamicLabel={trainStationIdx === i && dynLabels[i] ? dynLabels[i] : undefined} />
                  ))}

                  {trainPx && animating && (
                    <g>
                      <SvgTrain x={trainPx.x} y={trainPx.y} dir={trainPx.dir} color="#dc2626" />
                      <circle cx={trainPx.x - 14} cy={trainPx.y - 24} r={5} fill="white" opacity={0.55}>
                        <animate attributeName="r" values="3;7;3" dur="0.9s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.55;0.1;0.55" dur="0.9s" repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${trainPx.y-24};${trainPx.y-34};${trainPx.y-24}`} dur="0.9s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><span style={{ display:'inline-block', width:12, height:12, borderRadius:2, background:'#dbeafe', border:'2px solid #2563eb' }} />Start</span>
                <span className="flex items-center gap-1"><span style={{ display:'inline-block', width:12, height:12, borderRadius:2, background:'#fce7f3', border:'2px solid #be185d' }} />Destination</span>
                <span className="flex items-center gap-1"><span style={{ display:'inline-block', width:12, height:12, borderRadius:2, background:'#fef9c3', border:'2px solid #d97706' }} />Intermediate</span>
              </div>
            </div>

            {/* Card Tray */}
            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col gap-3 rounded-lg"
                style={{ width: 230, minHeight: 120 }}
                onClick={() => {
                  if (selectedId !== null) {
                    setCards(p => p.map(c => c.id === selectedId ? { ...c, slotIndex: null } : c));
                    setSelectedId(null); setResult(null); setWrongSlots(new Set()); setCorrectRevealedSlots(new Set());
                  }
                }}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Conversion Cards</div>
                <div className="text-xs text-slate-400">{filledCount}/{scenario.slots.length} slots filled</div>

                {trayCards.map(card => (
                  <div key={card.id}
                    onClick={e => { e.stopPropagation(); setSelectedId(p => p === card.id ? null : card.id); }}
                    className="bg-white dark:bg-slate-100 cursor-pointer flex flex-col items-center py-3 px-3 rounded-lg"
                    style={{
                      border: selectedId === card.id ? '3px solid #dc2626' : '2px solid #555',
                      boxShadow: selectedId === card.id ? '0 0 0 4px #fecaca' : '0 1px 3px rgba(0,0,0,0.12)',
                      transition: 'all 0.12s', userSelect: 'none', minHeight: 84,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                      {card.numerator}
                    </span>
                    <div style={{ width: '90%', height: 2, background: '#dc2626', margin: '5px 0' }} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                      {card.denominator}
                    </span>
                  </div>
                ))}

                {placedCards.length > 0 && (
                  <>
                    <div className="text-xs text-slate-400 mt-1 font-semibold">Placed:</div>
                    {placedCards.map(card => (
                      <div key={card.id} className="bg-white dark:bg-slate-100 flex flex-col items-center py-3 px-3 rounded-lg opacity-30 cursor-not-allowed"
                        style={{ border: '2px solid #aaa', userSelect: 'none', minHeight: 84 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
                          {card.numerator}
                        </span>
                        <div style={{ width: '90%', height: 2, background: '#dc2626', margin: '5px 0' }} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', textAlign: 'center', lineHeight: 1.5, fontFamily: "'Courier New', monospace", wordBreak: 'break-word' }}>
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
            <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">You solved a limiting reagent problem and earned <span className="font-bold">{rewardAmount}</span> glucose!</p>
            <div className="mt-4 text-sm">
              {rewardStatus === "loading" && <p className="text-slate-600 dark:text-slate-300">Updating glucose...</p>}
              {rewardStatus === "ok" && <p className="text-emerald-700 dark:text-emerald-300">{rewardMessage}</p>}
              {rewardStatus === "error" && <p className="text-red-700 dark:text-red-300">{rewardMessage}</p>}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setRewardPopupOpen(false)} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}