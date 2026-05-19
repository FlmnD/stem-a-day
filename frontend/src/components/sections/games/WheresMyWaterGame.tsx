'use client'
import React, { useEffect, useRef, useState, useCallback } from "react";

// ─── GRID CONFIG ──────────────────────────────────────────────────────────────
// The grid is FULLY SOLID DIRT at start. Player drags to carve channels.
// Water flows cell-by-cell each tick through empty cells.

const COLS = 22;
const ROWS = 16;
const CELL = 44;          // px per cell
const W = COLS * CELL;    // 968
const H = ROWS * CELL;    // 704
const TICK_MS = 60;
const GLUCOSE_REWARD = 20;

// ─── CELL TYPES ───────────────────────────────────────────────────────────────
type CellKind = 'dirt' | 'dense' | 'empty' | 'wall' | 'gate' | 'tub' | 'source';

interface Cell {
  kind: CellKind;
  hits: number;      // for dense: needs 2 hits before becoming empty
  fluid: number;     // 0–1 fill level (for rendering water height)
  hasFluid: boolean;
}

// ─── ORBITAL DUCK ─────────────────────────────────────────────────────────────
interface Duck {
  id: string;
  label: string;
  subshell: string;
  order: number;     // Aufbau index — must collect in ascending order
  hund: number;      // 0 = no Hund constraint; 1,2,3,4,5 = must fill each once first
  col: number;
  row: number;
  color: string;
  collected: boolean;
  rejected: boolean;
  decoy: boolean;    // true = cannot collect at all (3d before 4s trap)
}

// ─── LEVEL DEFINITION ────────────────────────────────────────────────────────
// Only define: source, tub cells, special cells (walls, gates), and duck positions.
// Everything else starts as SOLID DIRT that the player digs through freely.

interface LevelDef {
  id: number;
  title: string;
  element: string;
  targetConfig: string;
  hint: string;
  sourceCol: number;
  sourceRow: number;
  tubCols: [number, number];  // [startCol, endCol] at bottom rows
  tubRows: [number, number];  // [startRow, endRow]
  walls: [number, number][];
  gates: [number, number][];
  ducks: Omit<Duck, 'collected' | 'rejected'>[];
}

const DC: Record<string, string> = {
  '1s': '#e2e8f0', '2s': '#fde68a', '2p': '#fb923c',
  '3s': '#6ee7b7', '3p': '#34d399', '4s': '#60a5fa', '3d': '#c084fc',
};

function d(
  id: string, label: string, sub: string, order: number,
  col: number, row: number, hund = 0, decoy = false
): Omit<Duck, 'collected' | 'rejected'> {
  return { id, label, subshell: sub, order, hund, col, row, color: DC[sub] ?? '#fff', decoy };
}

const LEVELS: LevelDef[] = [
  // ── L1: Helium — dig straight down then across ────────────────────────────
  {
    id: 1, title: "Shell 1 — Helium", element: "He", targetConfig: "1s²",
    hint: "Dig freely from the nucleus pipe down and across. Collect both 1s ducks, then fill the alligator's tub!",
    sourceCol: 3, sourceRow: 0,
    tubCols: [16, 21], tubRows: [13, 15],
    walls: [], gates: [],
    ducks: [
      d('1s_a', '1s', '1s', 1, 7, 6),
      d('1s_b', '1s', '1s', 1, 14, 10),
    ],
  },
  // ── L2: Neon — introduce Pauli wall + spin gate ───────────────────────────
  {
    id: 2, title: "Shell 2 — Neon", element: "Ne", targetConfig: "1s²2s²2p⁶",
    hint: "Fill 1s first, then 2s, then 2p. Hund's Rule: hit each 2p duck once before any a second time. Find the spin gate to pass the Pauli wall!",
    sourceCol: 2, sourceRow: 0,
    tubCols: [17, 21], tubRows: [13, 15],
    walls: [[10, 7], [10, 8], [10, 9]],
    gates: [[8, 7]],
    ducks: [
      d('1s_a', '1s', '1s', 1, 5, 3),
      d('1s_b', '1s', '1s', 1, 4, 7),
      d('2s_a', '2s', '2s', 2, 12, 4),
      d('2s_b', '2s', '2s', 2, 15, 7),
      d('2p_1a', '2p', '2p', 3, 13, 10, 1),
      d('2p_2a', '2p', '2p', 3, 16, 11, 2),
      d('2p_3a', '2p', '2p', 3, 19, 10, 3),
      d('2p_1b', '2p', '2p', 3, 13, 12, 1),
      d('2p_2b', '2p', '2p', 3, 16, 13, 2),
      d('2p_3b', '2p', '2p', 3, 19, 12, 3),
    ],
  },
  // ── L3: Argon — adds 3s and 3p ────────────────────────────────────────────
  {
    id: 3, title: "Shell 3 — Argon", element: "Ar", targetConfig: "1s²2s²2p⁶3s²3p⁶",
    hint: "After neon's config, continue with 3s then 3p. Same Hund's rule for all three 3p ducks. Route carefully — the Pauli wall needs its gate!",
    sourceCol: 1, sourceRow: 0,
    tubCols: [17, 21], tubRows: [13, 15],
    walls: [[9, 8], [9, 9]],
    gates: [[7, 8]],
    ducks: [
      d('1s_a', '1s', '1s', 1, 4, 2),
      d('1s_b', '1s', '1s', 1, 3, 6),
      d('2s_a', '2s', '2s', 2, 6, 4),
      d('2s_b', '2s', '2s', 2, 5, 8),
      d('2p_1a', '2p', '2p', 3, 11, 3, 1),
      d('2p_2a', '2p', '2p', 3, 14, 4, 2),
      d('2p_3a', '2p', '2p', 3, 17, 3, 3),
      d('2p_1b', '2p', '2p', 3, 11, 6, 1),
      d('2p_2b', '2p', '2p', 3, 14, 7, 2),
      d('2p_3b', '2p', '2p', 3, 17, 6, 3),
      d('3s_a', '3s', '3s', 4, 7, 11),
      d('3s_b', '3s', '3s', 4, 10, 12),
      d('3p_1a', '3p', '3p', 5, 13, 11, 1),
      d('3p_2a', '3p', '3p', 5, 16, 10, 2),
      d('3p_3a', '3p', '3p', 5, 19, 11, 3),
      d('3p_1b', '3p', '3p', 5, 13, 13, 1),
      d('3p_2b', '3p', '3p', 5, 16, 12, 2),
      d('3p_3b', '3p', '3p', 5, 19, 13, 3),
    ],
  },
  // ── L4: Calcium — 4s fills before 3d (Aufbau exception!) ─────────────────
  {
    id: 4, title: "Shell 4 — Calcium (Aufbau!)", element: "Ca", targetConfig: "[Ar] 4s²",
    hint: "CRITICAL: 4s fills BEFORE 3d! The purple 3d duck is a TRAP — flowing through it first bounces the electron. Dig around it. Always 4s first!",
    sourceCol: 2, sourceRow: 0,
    tubCols: [17, 21], tubRows: [13, 15],
    walls: [], gates: [],
    ducks: [
      d('4s_a', '4s', '4s', 1, 8,  5),
      d('4s_b', '4s', '4s', 1, 13, 9),
      d('3d_trap', '3d ⚠', '3d', 99, 5, 11, 0, true),
    ],
  },
  // ── L5: Iron — 4s²3d⁶ full Hund's d-block ────────────────────────────────
  {
    id: 5, title: "Shell 5 — Iron (d-block)", element: "Fe", targetConfig: "[Ar] 4s²3d⁶",
    hint: "4s fills first (2 ducks), then 3d with Hund's rule — fill all five 3d once before pairing any. Iron stops at 3d⁶.",
    sourceCol: 1, sourceRow: 0,
    tubCols: [17, 21], tubRows: [13, 15],
    walls: [[8, 9], [8, 10]],
    gates: [[6, 9]],
    ducks: [
      d('4s_a', '4s', '4s', 1, 4,  4),
      d('4s_b', '4s', '4s', 1, 7,  7),
      d('3d_1a', '3d₁', '3d', 2, 11, 4,  1),
      d('3d_2a', '3d₂', '3d', 2, 14, 5,  2),
      d('3d_3a', '3d₃', '3d', 2, 17, 4,  3),
      d('3d_4a', '3d₄', '3d', 2, 20, 5,  4),
      d('3d_5a', '3d₅', '3d', 2, 18, 8,  5),
      d('3d_1b', '3d₁', '3d', 2, 11, 10, 1),
    ],
  },
];

// ─── INTRO ────────────────────────────────────────────────────────────────────

const INTRO = [
  { icon: '🖐️', title: "Dig Freely — Like Where's My Water",
    body: "The whole screen is packed solid dirt. Click and drag anywhere to carve channels. The electron (blue water) flows through whatever path you dig — downward with gravity, then sideways.",
    sub: "No pre-built paths. Dig any route you want!" },
  { icon: '🦆', title: "Orbital Rubber Ducks",
    body: "Rubber ducks labeled with orbitals (1s, 2s, 2p…) are buried in the dirt. Dig so the electron flows through them. Collect them in Aufbau order — wrong order glows red and bounces the electron back.",
    sub: "Aufbau: 1s → 2s → 2p → 3s → 3p → 4s → 3d" },
  { icon: '⚖️', title: "Hund's Rule",
    body: "When multiple ducks share the same subshell (e.g., three 2p ducks), you must collect each ONE BEFORE going back for a second. Route the electron to each 2p duck once first.",
    sub: "Trying to double-fill before all are singly filled bounces the electron." },
  { icon: '🚧', title: "Pauli Walls & Spin Gates",
    body: "Red cells are Pauli Exclusion walls — impenetrable unless the electron first flows through a blue Spin Gate (↑↓). Dig through the gate first, then the wall unlocks.",
    sub: "Two electrons per orbital, opposite spins — represented by the gate." },
  { icon: '⚠️', title: "4s Before 3d!",
    body: "In level 4 the purple 3d duck is a TRAP. If the electron touches it before collecting 4s, it gets bounced back hard. Always route to 4s first — this is the famous Aufbau exception.",
    sub: "Ca: [Ar] 4s² — NOT [Ar] 3d²" },
  { icon: '🐊', title: "Fill the Alligator's Tub!",
    body: "The alligator waits in its bathtub at the bottom-right. Once all required ducks are collected, fill the tub with electron fluid to complete the level.",
    sub: "5 levels: He → Ne → Ar → Ca → Fe. Win all 5 to earn glucose!" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const ck = (c: number, r: number) => r * COLS + c;

function initGrid(lv: LevelDef): Cell[] {
  // Start: everything is dirt
  const g: Cell[] = Array.from({ length: COLS * ROWS }, () => ({
    kind: 'dirt', hits: 0, fluid: 0, hasFluid: false,
  }));

  // Source cell
  g[ck(lv.sourceCol, lv.sourceRow)] = { kind: 'source', hits: 0, fluid: 1, hasFluid: true };

  // Tub cells
  for (let c = lv.tubCols[0]; c <= lv.tubCols[1]; c++)
    for (let r = lv.tubRows[0]; r <= lv.tubRows[1]; r++)
      g[ck(c, r)] = { kind: 'tub', hits: 0, fluid: 0, hasFluid: false };

  // Walls
  for (const [c, r] of lv.walls)
    g[ck(c, r)] = { kind: 'wall', hits: 0, fluid: 0, hasFluid: false };

  // Gates
  for (const [c, r] of lv.gates)
    g[ck(c, r)] = { kind: 'gate', hits: 0, fluid: 0, hasFluid: false };

  return g;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function ElectronDig() {
  const [lvIdx, setLvIdx] = useState(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [passedGate, setPassedGate] = useState(false);
  const [flowing, setFlowing] = useState(false);
  const [won, setWon] = useState(false);
  const [msg, setMsg] = useState('');
  const [rejId, setRejId] = useState<string | null>(null);
  const [collectedLabels, setCollectedLabels] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [seenIntro, setSeenIntro] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardAmt, setRewardAmt] = useState(0);
  const [rewardStatus, setRewardStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [rewardMsg, setRewardMsg] = useState('');
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<Cell[]>([]);
  const ducksRef = useRef<Duck[]>([]);
  const pgRef = useRef(false);
  const wonRef = useRef(false);

  gridRef.current = grid;
  ducksRef.current = ducks;
  pgRef.current = passedGate;
  wonRef.current = won;

  const lv = LEVELS[lvIdx];

  // ── Init level ──────────────────────────────────────────────────────────────
  const initLevel = useCallback((def: LevelDef) => {
    if (tickRef.current) clearInterval(tickRef.current);
    setGrid(initGrid(def));
    setDucks(def.ducks.map(dk => ({ ...dk, collected: false, rejected: false })));
    setPassedGate(false);
    setFlowing(false);
    setWon(false);
    wonRef.current = false;
    setMsg('');
    setRejId(null);
    setCollectedLabels([]);
  }, []);

  useEffect(() => { initLevel(lv); }, [lvIdx]);

  // ── Fluid tick ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!flowing || won) return;

    tickRef.current = setInterval(() => {
      setGrid(prevGrid => {
        if (wonRef.current) return prevGrid;

        const g = prevGrid.map(c => ({ ...c }));
        const currentDucks = ducksRef.current;
        const pg = pgRef.current;

        // Collect gate-passing state
        let newPg = pg;
        for (let i = 0; i < g.length; i++) {
          if (g[i].hasFluid && g[i].kind === 'gate') newPg = true;
        }
        if (newPg && !pg) {
          setPassedGate(true);
          pgRef.current = true;
        }

        // Spread fluid
        const toFill: number[] = [];
        for (let i = 0; i < g.length; i++) {
          if (!g[i].hasFluid) continue;
          const c = i % COLS, r = Math.floor(i / COLS);

          // Priority: down, then left, then right
          const neighbors: [number, number][] = [
            [c, r + 1],   // down (gravity)
            [c - 1, r],   // left
            [c + 1, r],   // right
          ];

          for (const [nc, nr] of neighbors) {
            if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
            const ni = ck(nc, nr);
            const ncell = g[ni];
            if (ncell.hasFluid) continue;
            if (ncell.kind === 'dirt' || ncell.kind === 'dense') continue;
            if (ncell.kind === 'wall' && !newPg) continue;
            if (ncell.kind === 'wall' && newPg) { toFill.push(ni); continue; }
            toFill.push(ni);
          }
        }

        // Check duck collisions in new fluid cells
        let blocked: number | null = null;
        let newDucks = [...currentDucks];
        let newLabels: string[] = [];
        let newMsg = '';
        let newRejId: string | null = null;

        for (const ni of toFill) {
          const nc = ni % COLS, nr = Math.floor(ni / COLS);
          const duckHere = currentDucks.find(
            dk => !dk.collected && !dk.rejected && dk.col === nc && dk.row === nr
          );

          if (duckHere) {
            if (duckHere.decoy) {
              // Decoy always bounces
              newRejId = duckHere.id;
              newMsg = `⚠️ ${duckHere.label} is a TRAP! Fill 4s first.`;
              blocked = ni;
              break;
            }

            // Aufbau order check
            const minOrder = Math.min(...newDucks.filter(dk => !dk.collected && !dk.decoy).map(dk => dk.order));
            if (duckHere.order > minOrder) {
              newRejId = duckHere.id;
              newMsg = `❌ Aufbau! Fill ${subLabel(minOrder)} before ${duckHere.label}.`;
              blocked = ni;
              break;
            }

            // Hund's rule check
            if (duckHere.hund > 0) {
              const sameGroup = newDucks.filter(dk => dk.subshell === duckHere.subshell && dk.hund > 0 && !dk.decoy);
              const lowerUncollected = sameGroup.filter(dk => dk.hund < duckHere.hund && !dk.collected);
              if (lowerUncollected.length > 0) {
                newRejId = duckHere.id;
                newMsg = `⚖️ Hund's Rule! Fill each ${duckHere.subshell} once before pairing.`;
                blocked = ni;
                break;
              }
            }

            // Collect!
            newDucks = newDucks.map(dk => dk.id === duckHere.id ? { ...dk, collected: true } : dk);
            newLabels = [...newLabels, duckHere.label];
            newMsg = `✅ Collected ${duckHere.label}!`;
          }
        }

        if (newRejId) {
          setRejId(newRejId);
          setMsg(newMsg);
          setTimeout(() => setRejId(null), 1000);
          // Don't fill the blocked cell — bounce
          const fillable = blocked !== null ? toFill.filter(i => i !== blocked) : toFill;
          for (const ni of fillable) g[ni].hasFluid = true;
          setDucks(newDucks);
          if (newLabels.length > 0) setCollectedLabels(prev => [...prev, ...newLabels]);
          return g;
        }

        if (newMsg) {
          setMsg(newMsg);
          setDucks(newDucks);
          if (newLabels.length > 0) setCollectedLabels(prev => [...prev, ...newLabels]);
        }

        for (const ni of toFill) g[ni].hasFluid = true;

        // Win check: tub filled + all non-decoy ducks collected
        const tubFilled = lv.tubCols[0] <= lv.tubCols[1] &&
          lv.tubRows[0] <= lv.tubRows[1] &&
          g[ck(lv.tubCols[0], lv.tubRows[0])].hasFluid;

        if (tubFilled) {
          const allDone = newDucks.filter(dk => !dk.decoy).every(dk => dk.collected);
          if (allDone) {
            clearInterval(tickRef.current!);
            setWon(true);
            wonRef.current = true;
            setSolvedCount(n => n + 1);
            setMsg(`🎉 ${lv.element} complete! ${lv.targetConfig}`);
            setDucks(newDucks);
            if (!rewardClaimed && lvIdx === LEVELS.length - 1) {
              setRewardClaimed(true);
              void awardGlucose(GLUCOSE_REWARD);
            }
          }
        }

        return g;
      });
    }, TICK_MS);

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [flowing, won, lv, rewardClaimed, lvIdx]);

  function subLabel(order: number) {
    const m: Record<number, string> = { 1: '1s', 2: '2s', 3: '2p', 4: '3s', 5: '3p', 6: '4s', 7: '3d' };
    return m[order] ?? `#${order}`;
  }

  // ── Dig ─────────────────────────────────────────────────────────────────────
  const dig = useCallback((c: number, r: number) => {
    if (won) return;
    setGrid(prev => {
      const g = [...prev];
      const cell = g[ck(c, r)];
      if (!cell) return prev;
      if (['wall', 'gate', 'tub', 'source', 'empty'].includes(cell.kind)) return prev;
      if (cell.kind === 'dense') {
        const hits = cell.hits + 1;
        if (hits >= 2) g[ck(c, r)] = { ...cell, kind: 'empty', hits: 2 };
        else g[ck(c, r)] = { ...cell, hits };
        return g;
      }
      if (cell.kind === 'dirt') {
        g[ck(c, r)] = { ...cell, kind: 'empty', hits: 1 };
        return g;
      }
      return prev;
    });
  }, [won]);

  const getCell = (e: React.MouseEvent | React.TouchEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    const c = Math.floor(((clientX - rect.left) / rect.width) * COLS);
    const r = Math.floor(((clientY - rect.top) / rect.height) * ROWS);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return null;
    return { c, r };
  };

  // ── Reward ──────────────────────────────────────────────────────────────────
  async function awardGlucose(amount: number) {
    setRewardAmt(amount); setRewardOpen(true); setRewardStatus('loading'); setRewardMsg('');
    try {
      const res = await fetch('/api/glucose/add', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setRewardStatus('error'); setRewardMsg(data?.message ?? 'Failed.'); return; }
      setRewardStatus('ok'); setRewardMsg(`You earned ${amount} glucose!`);
    } catch { setRewardStatus('error'); setRewardMsg('Network error.'); }
  }

  const iData = INTRO[introStep];

  // ── Render ──────────────────────────────────────────────────────────────────

  // Pre-compute dirt cells to batch-render (avoid per-cell SVG overhead)
  const dirtRects: { x: number; y: number; kind: CellKind; hits: number }[] = [];
  const fluidCells: { x: number; y: number }[] = [];
  const tubFluidCells: { x: number; y: number }[] = [];

  grid.forEach((cell, idx) => {
    const c = idx % COLS, r = Math.floor(idx / COLS);
    const x = c * CELL, y = r * CELL;
    if (cell.kind === 'dirt' || cell.kind === 'dense') dirtRects.push({ x, y, kind: cell.kind, hits: cell.hits });
    if (cell.hasFluid && cell.kind !== 'tub') fluidCells.push({ x, y });
    if (cell.hasFluid && cell.kind === 'tub') tubFluidCells.push({ x, y });
  });

  const tubMinC = lv.tubCols[0], tubMaxC = lv.tubCols[1];
  const tubMinR = lv.tubRows[0], tubMaxR = lv.tubRows[1];
  const tubX = tubMinC * CELL, tubY = tubMinR * CELL;
  const tubW = (tubMaxC - tubMinC + 1) * CELL, tubH = (tubMaxR - tubMinR + 1) * CELL;

  return (
    <>
      <div className="flex flex-col items-center p-5 bg-white text-slate-900 min-h-screen dark:bg-black dark:text-slate-100">
        <h1 className="text-2xl font-black mb-1 tracking-tight">Electron Configuration Dig</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Level <span className="font-bold text-blue-600 dark:text-sky-400">{lv.id}/5 — {lv.title}</span>
          {solvedCount > 0 && <span className="ml-4 text-green-600 dark:text-emerald-400">✅ {solvedCount} complete</span>}
        </p>

        {/* Controls */}
        <div className="flex gap-3 mb-4 flex-wrap items-center">
          {!flowing && !won && (
            <button
              onClick={() => { setFlowing(true); setMsg(''); }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 dark:bg-sky-500 dark:text-black"
            >
              ▶ Start Flow
            </button>
          )}
          <button
            onClick={() => initLevel(lv)}
            className="px-5 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 dark:bg-amber-400 dark:text-black"
          >
            ↺ Reset Level
          </button>
          {won && lvIdx < LEVELS.length - 1 && (
            <button
              onClick={() => setLvIdx(i => i + 1)}
              className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 dark:bg-emerald-500 dark:text-black"
            >
              Next Level →
            </button>
          )}
          {seenIntro && (
            <button
              onClick={() => { setIntroStep(0); setShowIntro(true); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100"
            >
              ? How to Play
            </button>
          )}
          {msg && (
            <span className={`font-bold text-sm max-w-xs ${msg.startsWith('❌') || msg.startsWith('⚠️') || msg.startsWith('⚖️') ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-emerald-400'}`}>
              {msg}
            </span>
          )}
        </div>

        <div className="flex gap-5 items-start flex-wrap">
          {/* SVG canvas */}
          <div className="relative shrink-0" style={{ width: W, height: H }}>

            {/* Intro overlay */}
            {showIntro && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl" style={{ background: 'rgba(10,10,10,0.93)', width: W, height: H }}>
                <div className="w-96 p-8 text-center text-white">
                  <div className="text-5xl mb-3">{iData.icon}</div>
                  <h2 className="text-xl font-black mb-3">{iData.title}</h2>
                  <p className="text-slate-300 mb-2 text-sm leading-relaxed">{iData.body}</p>
                  <p className="text-xs text-slate-500 italic">{iData.sub}</p>
                  <div className="flex justify-center gap-2 mt-5 mb-5">
                    {INTRO.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i === introStep ? 'bg-blue-400' : 'bg-slate-600'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    {introStep > 0
                      ? <button onClick={() => setIntroStep(s => s - 1)} className="px-4 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600">Back</button>
                      : <div />}
                    {introStep < INTRO.length - 1
                      ? <button onClick={() => setIntroStep(s => s + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500">Next</button>
                      : <button onClick={() => { setShowIntro(false); setSeenIntro(true); setIntroStep(0); }} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500">Start Digging!</button>}
                  </div>
                </div>
              </div>
            )}

            <svg
              ref={svgRef}
              width={W} height={H}
              viewBox={`0 0 ${W} ${H}`}
              style={{ display: 'block', borderRadius: 12, border: '4px solid #3f2e1a', cursor: 'crosshair', userSelect: 'none', touchAction: 'none' }}
              onMouseDown={e => { setDragging(true); const p = getCell(e); if (p) dig(p.c, p.r); }}
              onMouseMove={e => { if (!dragging) return; const p = getCell(e); if (p) dig(p.c, p.r); }}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              onTouchStart={e => { e.preventDefault(); const p = getCell(e); if (p) dig(p.c, p.r); }}
              onTouchMove={e => { e.preventDefault(); const p = getCell(e); if (p) dig(p.c, p.r); }}
            >
              <defs>
                {/* Dirt */}
                <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c5c38" />
                  <stop offset="100%" stopColor="#4e3419" />
                </linearGradient>
                {/* Dense dirt */}
                <linearGradient id="ddg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3a2510" />
                  <stop offset="100%" stopColor="#1e1208" />
                </linearGradient>
                {/* Fluid */}
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
                </linearGradient>
                {/* Tub water */}
                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                {/* Gator green */}
                <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* ── BACKGROUND (empty space looks like deep earth) ── */}
              <rect width={W} height={H} fill="#1a0e05" />

              {/* ── DIRT CELLS ── */}
              {dirtRects.map(({ x, y, kind, hits }) => (
                <g key={`${x}-${y}`}>
                  <rect x={x} y={y} width={CELL} height={CELL}
                    fill={kind === 'dense' ? 'url(#ddg)' : 'url(#dg)'}
                  />
                  {/* Pebble texture */}
                  <circle cx={x + 9} cy={y + 11} r={3.5} fill={kind === 'dense' ? '#2a1808' : '#5c3d1e'} opacity={0.55} />
                  <circle cx={x + 32} cy={y + 28} r={2.5} fill={kind === 'dense' ? '#1e0f04' : '#7a5535'} opacity={0.45} />
                  <circle cx={x + 18} cy={y + 38} r={3} fill={kind === 'dense' ? '#2a1808' : '#5c3d1e'} opacity={0.4} />
                  <circle cx={x + 38} cy={y + 10} r={2} fill={kind === 'dense' ? '#1e0f04' : '#7a5535'} opacity={0.35} />
                  {/* Dense indicator */}
                  {kind === 'dense' && hits === 1 && (
                    <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fill="#d97706" fontWeight={900}>✕1</text>
                  )}
                  {/* Cell border */}
                  <rect x={x} y={y} width={CELL} height={CELL} fill="none" stroke="#3f2e1a" strokeWidth={0.4} />
                </g>
              ))}

              {/* ── SPECIAL CELLS (walls, gates) ── */}
              {grid.map((cell, idx) => {
                if (cell.kind !== 'wall' && cell.kind !== 'gate') return null;
                const c = idx % COLS, r = Math.floor(idx / COLS);
                const x = c * CELL, y = r * CELL;
                const cx2 = x + CELL / 2, cy2 = y + CELL / 2;
                if (cell.kind === 'wall') return (
                  <g key={idx} filter="url(#glow)">
                    <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={4} fill="#7f1d1d" />
                    <rect x={x + 5} y={y + 5} width={CELL - 10} height={CELL - 10} rx={2} fill="#991b1b" opacity={0.5} />
                    <text x={cx2} y={cy2 - 5} textAnchor="middle" fontSize={7} fontWeight={900} fill="#fca5a5">PAULI</text>
                    <text x={cx2} y={cy2 + 7} textAnchor="middle" fontSize={7} fontWeight={900} fill="#fca5a5">WALL</text>
                  </g>
                );
                return (
                  <g key={idx}>
                    <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={4} fill="#0c2a4a" stroke="#3b82f6" strokeWidth={2} />
                    <text x={cx2} y={cy2 - 6} textAnchor="middle" fontSize={13} fill="#93c5fd">↑</text>
                    <text x={cx2} y={cy2 + 9} textAnchor="middle" fontSize={13} fill="#f87171">↓</text>
                    <text x={cx2} y={cy2 + 20} textAnchor="middle" fontSize={6} fill="#60a5fa" fontWeight={700}>SPIN GATE</text>
                  </g>
                );
              })}

              {/* ── ALLIGATOR TUB ── */}
              {/* Tub base (porcelain) */}
              <rect x={tubX - 8} y={tubY - 8} width={tubW + 16} height={tubH + 16} rx={18}
                fill="#e2e8f0" stroke="#94a3b8" strokeWidth={4} />
              {/* Tub inner */}
              <rect x={tubX + 2} y={tubY + 2} width={tubW - 4} height={tubH - 4} rx={12}
                fill={tubFluidCells.length > 0 ? 'url(#tg)' : '#f0f9ff'}
                stroke="#bae6fd" strokeWidth={1} />
              {/* Water ripple when filled */}
              {won && (
                <>
                  <ellipse cx={tubX + tubW / 2} cy={tubY + tubH / 2} rx={tubW / 3} ry={10}
                    fill="none" stroke="white" strokeWidth={2} opacity={0.4}>
                    <animate attributeName="rx" values={`${tubW / 3};${tubW / 2.5};${tubW / 3}`} dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.8s" repeatCount="indefinite" />
                  </ellipse>
                </>
              )}
              {/* Alligator drawn in tub */}
              {(() => {
                const ax = tubX + 8, ay = tubY + 8;
                const aw = tubW - 16, ah = tubH - 16;
                const midY = ay + ah / 2;
                return (
                  <g filter="url(#shadow)">
                    {/* Body */}
                    <ellipse cx={ax + aw * 0.45} cy={midY + 6} rx={aw * 0.38} ry={ah * 0.32} fill="url(#gg)" />
                    {/* Tail */}
                    <path d={`M ${ax + 14} ${midY + 4} Q ${ax + 4} ${midY - 8} ${ax + 10} ${midY - 18}`}
                      stroke="#15803d" strokeWidth={12} fill="none" strokeLinecap="round" />
                    {/* Head */}
                    <ellipse cx={ax + aw * 0.82} cy={midY} rx={aw * 0.16} ry={ah * 0.3} fill="#16a34a" />
                    {/* Snout */}
                    <ellipse cx={ax + aw * 0.9} cy={midY + ah * 0.15} rx={aw * 0.12} ry={ah * 0.12} fill="#15803d" />
                    {/* Eye */}
                    <circle cx={ax + aw * 0.78} cy={midY - ah * 0.18} r={5} fill="#bbf7d0" />
                    <circle cx={ax + aw * 0.78} cy={midY - ah * 0.18} r={2.5} fill="#166534" />
                    {/* Teeth */}
                    {[0, 1, 2].map(i => (
                      <polygon key={i}
                        points={`${ax + aw * 0.84 + i * 7},${midY + ah * 0.08} ${ax + aw * 0.86 + i * 7},${midY + ah * 0.22} ${ax + aw * 0.88 + i * 7},${midY + ah * 0.08}`}
                        fill="white" />
                    ))}
                    {/* Back spikes */}
                    {[0, 1, 2, 3].map(i => (
                      <polygon key={i}
                        points={`${ax + aw * 0.2 + i * aw * 0.12},${midY - ah * 0.25}
                                 ${ax + aw * 0.23 + i * aw * 0.12},${midY - ah * 0.46}
                                 ${ax + aw * 0.26 + i * aw * 0.12},${midY - ah * 0.25}`}
                        fill="#14532d" />
                    ))}
                    {/* Label */}
                    <text x={tubX + tubW / 2} y={tubY - 14} textAnchor="middle" fontSize={11} fontWeight={900} fill="#15803d">
                      {lv.element} — {lv.targetConfig}
                    </text>
                  </g>
                );
              })()}

              {/* ── FLUID ── */}
              {fluidCells.map(({ x, y }) => (
                <rect key={`f${x}-${y}`} x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2}
                  fill="url(#fg)" rx={2} opacity={0.9} />
              ))}
              {/* Fluid surface shimmer */}
              {fluidCells.map(({ x, y }) => (
                <line key={`s${x}-${y}`} x1={x + 4} y1={y + 4} x2={x + CELL - 4} y2={y + 4}
                  stroke="white" strokeWidth={1.5} opacity={0.25} />
              ))}

              {/* ── SOURCE (nucleus pipe) ── */}
              {(() => {
                const sx = lv.sourceCol * CELL, sy = lv.sourceRow * CELL;
                const scx = sx + CELL / 2, scy = sy + CELL / 2;
                return (
                  <g filter="url(#glow)">
                    <rect x={sx + 6} y={sy} width={CELL - 12} height={CELL + 4} rx={8} fill="#374151" />
                    <rect x={sx + 10} y={sy + 2} width={CELL - 20} height={CELL} rx={6} fill="#1e293b" />
                    <circle cx={scx} cy={scy} r={13} fill="#f59e0b">
                      <animate attributeName="r" values="11;15;11" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                    <text x={scx} y={scy - 2} textAnchor="middle" fontSize={6} fontWeight={900} fill="#1e1e1e">NUCLEUS</text>
                    <text x={scx} y={scy + 7} textAnchor="middle" fontSize={6} fontWeight={900} fill="#1e1e1e">PIPE</text>
                  </g>
                );
              })()}

              {/* ── ORBITAL DUCKS ── */}
              {ducks.map(dk => {
                const x = dk.col * CELL, y = dk.row * CELL;
                const cx2 = x + CELL / 2, cy2 = y + CELL / 2;
                const isRej = rejId === dk.id;
                const bodyColor = dk.collected ? '#6ee7b7' : isRej ? '#ef4444' : dk.decoy ? '#7c3aed' : dk.color;
                const op = dk.collected ? 0.3 : 1;

                return (
                  <g key={dk.id} opacity={op} filter="url(#shadow)">
                    {/* Subtle glow ring */}
                    {!dk.collected && !dk.decoy && (
                      <circle cx={cx2 + 4} cy={cy2 + 6} r={20} fill={dk.color} opacity={0.15}>
                        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Duck body */}
                    <ellipse cx={cx2 - 2} cy={cy2 + 7} rx={15} ry={10} fill={bodyColor} stroke="#1e293b" strokeWidth={1.5} />
                    {/* Duck head */}
                    <circle cx={cx2 + 12} cy={cy2 - 1} r={9} fill={bodyColor} stroke="#1e293b" strokeWidth={1.5} />
                    {/* Beak */}
                    <ellipse cx={cx2 + 22} cy={cy2 - 1} rx={6} ry={3.5} fill="#f97316" stroke="#ea580c" strokeWidth={1} />
                    {/* Nostril */}
                    <circle cx={cx2 + 21} cy={cy2 - 2} r={1} fill="#ea580c" />
                    {/* Eye */}
                    <circle cx={cx2 + 13} cy={cy2 - 6} r={2.5} fill="#0f172a" />
                    <circle cx={cx2 + 14} cy={cy2 - 7} r={1} fill="white" />
                    {/* Wing */}
                    <ellipse cx={cx2 - 4} cy={cy2 + 4} rx={7} ry={4} fill={bodyColor} stroke="#1e293b" strokeWidth={1} opacity={0.65} />
                    {/* Tail */}
                    <ellipse cx={cx2 - 16} cy={cy2 + 5} rx={5} ry={6} fill={bodyColor} stroke="#1e293b" strokeWidth={1} />
                    {/* Decoy warning */}
                    {dk.decoy && (
                      <text x={cx2 + 2} y={cy2 + 5} textAnchor="middle" fontSize={14} fill="white" fontWeight={900}>⚠</text>
                    )}
                    {/* Label badge */}
                    <rect x={cx2 - 15} y={cy2 + 16} width={30} height={14} rx={4} fill="#0f172a" opacity={0.92} />
                    <text x={cx2} y={cy2 + 26} textAnchor="middle" fontSize={9} fontWeight={900} fill="white" fontFamily="'Courier New',monospace">
                      {dk.label}
                    </text>
                    {/* Collected tick */}
                    {dk.collected && (
                      <text x={cx2 + 2} y={cy2 + 6} textAnchor="middle" fontSize={20} fill="#4ade80" fontWeight={900}>✓</text>
                    )}
                    {/* Rejected X */}
                    {isRej && (
                      <text x={cx2 + 2} y={cy2 + 6} textAnchor="middle" fontSize={20} fill="#ef4444" fontWeight={900}>✗</text>
                    )}
                  </g>
                );
              })}

              {/* ── WIN CELEBRATION ── */}
              {won && Array.from({ length: 16 }, (_, i) => (
                <circle key={i}
                  cx={tubX + 20 + (i % 8) * (tubW / 8)}
                  cy={tubY - 10}
                  r={5}
                  fill={['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#c084fc'][i % 5]}
                  opacity={0.9}
                >
                  <animate attributeName="cy"
                    values={`${tubY - 10};${tubY - 55};${tubY - 10}`}
                    dur={`${0.5 + (i % 4) * 0.15}s`}
                    begin={`${(i % 3) * 0.1}s`}
                    repeatCount="4" />
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur={`${0.5 + (i % 4) * 0.15}s`} repeatCount="4" />
                </circle>
              ))}
            </svg>
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-4 shrink-0" style={{ width: 220 }}>
            {/* Config display */}
            <div className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Electron Config</div>
              <div className="font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-h-10">
                {collectedLabels.length === 0
                  ? <span className="text-slate-400 italic text-xs">Start flowing…</span>
                  : collectedLabels.join(' ')}
              </div>
              <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">Target: {lv.targetConfig}</div>
            </div>

            {/* Duck checklist */}
            <div className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Orbital Ducks</div>
              <div className="flex flex-col gap-2">
                {ducks.map(dk => (
                  <div key={dk.id} className="flex items-center gap-2">
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: dk.collected ? '#4ade80' : dk.decoy ? '#7c3aed' : dk.color, border: '1.5px solid #334155', flexShrink: 0 }} />
                    <span className={`font-mono text-xs font-bold ${dk.decoy ? 'text-purple-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{dk.label}</span>
                    {dk.hund > 0 && !dk.decoy && <span className="text-xs text-amber-500 ml-auto">H{dk.hund}</span>}
                    {dk.collected && <span className="text-green-500 text-xs ml-auto">✓</span>}
                    {dk.decoy && <span className="text-purple-400 text-xs ml-auto">trap</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 rounded-xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">💡 Hint</div>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{lv.hint}</p>
            </div>

            {/* Aufbau reference */}
            <div className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Aufbau Order</div>
              <div className="flex flex-wrap gap-1">
                {(['1s', '2s', '2p', '3s', '3p', '4s', '3d'] as const).map(sub => {
                  const done = ducks.filter(dk => dk.subshell === sub && !dk.decoy).every(dk => dk.collected);
                  return (
                    <span key={sub} style={{ color: DC[sub], fontFamily: "'Courier New',monospace", fontSize: 12, fontWeight: 900, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.4 : 1 }}>
                      {sub}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-amber-500 font-bold mt-1">⚠ 4s before 3d!</div>
            </div>

            {/* Legend */}
            <div className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Legend</div>
              <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
                {[
                  { color: '#7c5c38', label: 'Dirt — click/drag to dig' },
                  { color: '#3a2510', label: 'Dense — needs 2 digs' },
                  { color: '#7f1d1d', label: 'Pauli Wall — find gate first' },
                  { color: '#0c2a4a', label: 'Spin Gate ↑↓ — unlocks wall' },
                  { color: '#38bdf8', label: 'Electron fluid' },
                  { color: '#e2e8f0', label: "Alligator's tub (goal)" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: color, flexShrink: 0, border: '1px solid #475569' }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward popup */}
      {rewardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🏆 All 5 Levels Complete!</h2>
            <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">You filled every orbital from He to Fe! You earned <span className="font-bold">{rewardAmt}</span> glucose.</p>
            <div className="mt-4 text-sm">
              {rewardStatus === 'loading' && <p className="text-slate-600 dark:text-slate-300">Updating glucose...</p>}
              {rewardStatus === 'ok' && <p className="text-emerald-700 dark:text-emerald-300">{rewardMsg}</p>}
              {rewardStatus === 'error' && <p className="text-red-700 dark:text-red-300">{rewardMsg}</p>}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setRewardOpen(false)} className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}