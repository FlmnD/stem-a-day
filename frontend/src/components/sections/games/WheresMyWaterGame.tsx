'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const COLS = 22;
const ROWS = 16;
const CELL = 44;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK_MS = 55;
const GLUCOSE_REWARD = 20;
const DROPLET_RADIUS = 7;
const MAX_VISIBLE_DROPLETS = 26;
const SPAWN_EVERY_TICKS = 3;
const STUCK_TICKS_BEFORE_FADE = 18;
const DIG_BRUSH_RADIUS = CELL * 0.72;

type CellKind = "dirt" | "empty" | "source" | "tub";
type Subshell = "1s" | "2s" | "2p" | "3s" | "3p" | "4s" | "3d";

interface Cell {
  kind: CellKind;
}

interface OrbitalSpec {
  subshell: Subshell;
  count: number;
}

interface DuckSeed {
  id: string;
  label: string;
  subshell: Subshell;
  sequence: number;
}

interface Duck extends DuckSeed {
  col: number;
  row: number;
  color: string;
  collected: boolean;
}

interface Droplet {
  id: number;
  x: number;
  y: number;
  drift: number;
  settledTicks: number;
}

interface BoardPoint {
  x: number;
  y: number;
}

interface LevelDef {
  id: number;
  title: string;
  elementName: string;
  symbol: string;
  targetConfig: string;
  hint: string;
  orbitals: OrbitalSpec[];
  tubGoal: number;
}

interface LevelLayout {
  sourceCol: number;
  sourceRow: number;
  tubCols: [number, number];
  tubRows: [number, number];
  gatorFacing: -1 | 1;
  ducks: Duck[];
}

const SUBSHELL_COLORS: Record<Subshell, string> = {
  "1s": "#e2e8f0",
  "2s": "#fde68a",
  "2p": "#fb923c",
  "3s": "#6ee7b7",
  "3p": "#34d399",
  "4s": "#60a5fa",
  "3d": "#c084fc",
};

const LEVELS: LevelDef[] = [
  {
    id: 1,
    title: "Shell 1 - Helium",
    elementName: "Helium",
    symbol: "He",
    targetConfig: "1s2",
    hint: "Collect 1s1, then 1s2, then send enough electron water into the tub.",
    orbitals: [{ subshell: "1s", count: 2 }],
    tubGoal: 6,
  },
  {
    id: 2,
    title: "Shell 2 - Neon",
    elementName: "Neon",
    symbol: "Ne",
    targetConfig: "1s2 2s2 2p6",
    hint: "Follow Aufbau order all the way through 2p6. The ducks are randomized each reset.",
    orbitals: [
      { subshell: "1s", count: 2 },
      { subshell: "2s", count: 2 },
      { subshell: "2p", count: 6 },
    ],
    tubGoal: 8,
  },
  {
    id: 3,
    title: "Shell 3 - Argon",
    elementName: "Argon",
    symbol: "Ar",
    targetConfig: "1s2 2s2 2p6 3s2 3p6",
    hint: "Keep the stream moving through every duck in order. Do not skip ahead to 3p before 3s is done.",
    orbitals: [
      { subshell: "1s", count: 2 },
      { subshell: "2s", count: 2 },
      { subshell: "2p", count: 6 },
      { subshell: "3s", count: 2 },
      { subshell: "3p", count: 6 },
    ],
    tubGoal: 10,
  },
  {
    id: 4,
    title: "Shell 4 - Calcium",
    elementName: "Calcium",
    symbol: "Ca",
    targetConfig: "1s2 2s2 2p6 3s2 3p6 4s2",
    hint: "Calcium still stops at 4s2. Stay in order and do not overshoot the final shell.",
    orbitals: [
      { subshell: "1s", count: 2 },
      { subshell: "2s", count: 2 },
      { subshell: "2p", count: 6 },
      { subshell: "3s", count: 2 },
      { subshell: "3p", count: 6 },
      { subshell: "4s", count: 2 },
    ],
    tubGoal: 11,
  },
  {
    id: 5,
    title: "Shell 5 - Iron",
    elementName: "Iron",
    symbol: "Fe",
    targetConfig: "1s2 2s2 2p6 3s2 3p6 4s2 3d6",
    hint: "Iron ends at 3d6. After 4s2, keep going in order through 3d1 to 3d6.",
    orbitals: [
      { subshell: "1s", count: 2 },
      { subshell: "2s", count: 2 },
      { subshell: "2p", count: 6 },
      { subshell: "3s", count: 2 },
      { subshell: "3p", count: 6 },
      { subshell: "4s", count: 2 },
      { subshell: "3d", count: 6 },
    ],
    tubGoal: 12,
  },
];

const INTRO_STEPS = [
  {
    title: "Dig through natural dirt",
    body:
      "The board starts packed with dirt. Click or drag to carve your own tunnels. There are no pre-built grid paths anymore.",
    sub: "You are shaping the route yourself.",
  },
  {
    title: "Collect exact orbital ducks",
    body:
      "Each duck is a specific electron slot like 1s1, 1s2, 2p4, or 3d6. Touch them in the correct order only.",
    sub: "Wrong order rejects the droplet.",
  },
  {
    title: "Water moves as droplets",
    body:
      "Only a small amount of electron water is active at once. It drips, pools in grooves, slips through tunnels, and can fall out of the screen.",
    sub: "The stream no longer floods every carved cell.",
  },
  {
    title: "Fill the alligator tub",
    body:
      "Collect every required duck for the element and send enough droplets into the alligator's bathtub to clear the level.",
    sub: "Duck positions and the alligator tub re-roll each reset.",
  },
];

const ck = (c: number, r: number) => r * COLS + c;

function cloneGrid(grid: Cell[]) {
  return grid.map((cell) => ({ kind: cell.kind }));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildDuckSeeds(orbitals: OrbitalSpec[]): DuckSeed[] {
  let sequence = 1;
  return orbitals.flatMap(({ subshell, count }) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${subshell}_${index + 1}`,
      label: `${subshell}${index + 1}`,
      subshell,
      sequence: sequence++,
    }))
  );
}

function initGrid(layout: LevelLayout): Cell[] {
  const grid: Cell[] = Array.from({ length: COLS * ROWS }, () => ({ kind: "dirt" }));

  grid[ck(layout.sourceCol, layout.sourceRow)] = { kind: "source" };

  for (let c = layout.tubCols[0]; c <= layout.tubCols[1]; c++) {
    for (let r = layout.tubRows[0]; r <= layout.tubRows[1]; r++) {
      grid[ck(c, r)] = { kind: "tub" };
    }
  }

  return grid;
}

function buildRandomLayout(level: LevelDef): LevelLayout {
  const sourceCol = randomInt(2, COLS - 3);
  const sourceRow = 0;
  const tubWidth = 5;
  const tubStart = randomInt(1, COLS - tubWidth - 1);
  const tubCols: [number, number] = [tubStart, tubStart + tubWidth - 1];
  const tubRows: [number, number] = [12, 15];
  const gatorFacing: -1 | 1 = Math.random() < 0.5 ? -1 : 1;

  const seeds = buildDuckSeeds(level.orbitals);
  const placed: Duck[] = [];
  const allCells: Array<{ col: number; row: number }> = [];

  for (let row = 2; row <= 11; row++) {
    for (let col = 1; col <= COLS - 2; col++) {
      const inTubLane =
        row >= tubRows[0] - 1 &&
        col >= tubCols[0] - 1 &&
        col <= tubCols[1] + 1;
      const tooCloseToSource = row <= 2 && Math.abs(col - sourceCol) <= 1;
      if (!inTubLane && !tooCloseToSource) {
        allCells.push({ col, row });
      }
    }
  }

  const shuffledCells = shuffle(allCells);

  for (let index = 0; index < seeds.length; index++) {
    const seed = seeds[index];
    const progress = seeds.length === 1 ? 0.5 : index / (seeds.length - 1);
    const preferredRow = 2 + Math.floor(progress * 9);

    const strictCandidate = shuffledCells.find(({ col, row }) => {
      return (
        Math.abs(row - preferredRow) <= 2 &&
        placed.every((duck) => Math.max(Math.abs(duck.col - col), Math.abs(duck.row - row)) > 1)
      );
    });

    const looseCandidate =
      strictCandidate ??
      shuffledCells.find(({ col, row }) => {
        return placed.every((duck) => duck.col !== col || duck.row !== row);
      });

    const fallback = looseCandidate ?? { col: 2 + (index % (COLS - 4)), row: 2 + Math.floor(index / (COLS - 4)) };

    placed.push({
      ...seed,
      col: fallback.col,
      row: fallback.row,
      color: SUBSHELL_COLORS[seed.subshell],
      collected: false,
    });
  }

  return {
    sourceCol,
    sourceRow,
    tubCols,
    tubRows,
    gatorFacing,
    ducks: placed,
  };
}

function isOpenKind(kind: CellKind) {
  return kind === "empty" || kind === "source" || kind === "tub";
}

function isOpenAt(x: number, y: number, grid: Cell[]) {
  const col = Math.floor(x / CELL);
  const row = Math.floor(y / CELL);

  if (y < 0) return false;
  if (col < 0 || col >= COLS || row >= ROWS) return true;

  return isOpenKind(grid[ck(col, row)].kind);
}

function isDropletPositionOpen(x: number, y: number, grid: Cell[]) {
  const samples: Array<[number, number]> = [
    [0, 0],
    [0, DROPLET_RADIUS * 0.75],
    [DROPLET_RADIUS * 0.7, 0],
    [-DROPLET_RADIUS * 0.7, 0],
  ];

  return samples.every(([dx, dy]) => isOpenAt(x + dx, y + dy, grid));
}

function isInsideTub(x: number, y: number, layout: LevelLayout) {
  const col = Math.floor(x / CELL);
  const row = Math.floor(y / CELL);
  return (
    col >= layout.tubCols[0] &&
    col <= layout.tubCols[1] &&
    row >= layout.tubRows[0] &&
    row <= layout.tubRows[1]
  );
}

function createDroplet(layout: LevelLayout, id: number): Droplet {
  return {
    id,
    x: (layout.sourceCol + 0.5) * CELL + randomInt(-4, 4),
    y: (layout.sourceRow + 0.72) * CELL,
    drift: Math.random() < 0.5 ? -1 : 1,
    settledTicks: 0,
  };
}

function getMoveOptions(drift: number) {
  const sign = drift === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(drift);
  const down = CELL * 0.22;
  const side = CELL * 0.18;

  return [
    { dx: 0, dy: down, nextDrift: sign },
    { dx: sign * side, dy: down * 0.9, nextDrift: sign },
    { dx: -sign * side, dy: down * 0.9, nextDrift: -sign },
    { dx: sign * side, dy: 0, nextDrift: sign },
    { dx: -sign * side, dy: 0, nextDrift: -sign },
  ];
}

export default function WheresMyWaterGame() {
  const [lvIdx, setLvIdx] = useState(0);
  const [layout, setLayout] = useState<LevelLayout | null>(null);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [flowing, setFlowing] = useState(false);
  const [won, setWon] = useState(false);
  const [msg, setMsg] = useState("");
  const [rejId, setRejId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<Cell[][]>([]);
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [seenIntro, setSeenIntro] = useState(false);
  const [tubFill, setTubFill] = useState(0);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardAmt, setRewardAmt] = useState(0);
  const [rewardStatus, setRewardStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [rewardMsg, setRewardMsg] = useState("");
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const rejectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<Cell[]>([]);
  const ducksRef = useRef<Duck[]>([]);
  const dropletsRef = useRef<Droplet[]>([]);
  const tubFillRef = useRef(0);
  const spawnCounterRef = useRef(0);
  const dropletIdRef = useRef(1);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef<BoardPoint | null>(null);
  const strokeSnapshotRef = useRef<Cell[] | null>(null);
  const strokeChangedRef = useRef(false);

  const level = LEVELS[lvIdx];

  gridRef.current = grid;
  ducksRef.current = ducks;
  dropletsRef.current = droplets;
  tubFillRef.current = tubFill;

  const initLevel = useCallback(
    (nextLevel: LevelDef) => {
      if (tickRef.current) clearInterval(tickRef.current);
      const nextLayout = buildRandomLayout(nextLevel);

      setLayout(nextLayout);
      setGrid(initGrid(nextLayout));
      setDucks(nextLayout.ducks);
      setDroplets([]);
      setFlowing(false);
      setWon(false);
      setTubFill(0);
      setUndoStack([]);
      setMsg("");
      setRejId(null);
      spawnCounterRef.current = 0;
      dropletIdRef.current = 1;
      draggingRef.current = false;
      lastPointerRef.current = null;
      strokeSnapshotRef.current = null;
      strokeChangedRef.current = false;
    },
    []
  );

  useEffect(() => {
    initLevel(LEVELS[lvIdx]);
  }, [initLevel, lvIdx]);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
    };
  }, []);

  const nextRequiredDuck = useMemo(
    () => ducks.find((duck) => !duck.collected) ?? null,
    [ducks]
  );

  const tubRatio = Math.min(1, tubFill / level.tubGoal);
  const collectedLabels = ducks.filter((duck) => duck.collected).map((duck) => duck.label);
  const canUndo = undoStack.length > 0 && !flowing && !won;

  const carveStrokeSegment = useCallback((from: BoardPoint, to: BoardPoint) => {
    let changed = false;

    setGrid((prevGrid) => {
      let nextGrid = prevGrid;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const sampleCount = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (CELL * 0.2)));

      for (let step = 0; step <= sampleCount; step++) {
        const t = step / sampleCount;
        const sampleX = from.x + dx * t;
        const sampleY = from.y + dy * t;

        const colStart = Math.max(0, Math.floor((sampleX - DIG_BRUSH_RADIUS) / CELL));
        const colEnd = Math.min(COLS - 1, Math.floor((sampleX + DIG_BRUSH_RADIUS) / CELL));
        const rowStart = Math.max(0, Math.floor((sampleY - DIG_BRUSH_RADIUS) / CELL));
        const rowEnd = Math.min(ROWS - 1, Math.floor((sampleY + DIG_BRUSH_RADIUS) / CELL));

        for (let row = rowStart; row <= rowEnd; row++) {
          for (let col = colStart; col <= colEnd; col++) {
            const index = ck(col, row);
            const cell = nextGrid[index];
            if (!cell || cell.kind !== "dirt") continue;

            const centerX = (col + 0.5) * CELL;
            const centerY = (row + 0.5) * CELL;
            const textureBias = ((col * 17 + row * 31) % 7) * 0.05;
            const threshold = DIG_BRUSH_RADIUS * (0.78 + textureBias);
            const distanceSq = (sampleX - centerX) ** 2 + (sampleY - centerY) ** 2;

            if (distanceSq > threshold ** 2) continue;

            if (nextGrid === prevGrid) {
              nextGrid = [...prevGrid];
            }

            nextGrid[index] = { kind: "empty" };
            changed = true;
          }
        }
      }

      return changed ? nextGrid : prevGrid;
    });

    if (changed) {
      strokeChangedRef.current = true;
    }
  }, []);

  const getBoardPointFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * W;
    const y = ((event.clientY - rect.top) / rect.height) * H;

    if (x < 0 || x > W || y < 0 || y > H) return null;

    return { x, y };
  };

  const finishStroke = useCallback(() => {
    draggingRef.current = false;
    lastPointerRef.current = null;

    if (strokeChangedRef.current && strokeSnapshotRef.current) {
      const snapshot = strokeSnapshotRef.current;
      setUndoStack((prev) => [...prev, snapshot]);
    }

    strokeSnapshotRef.current = null;
    strokeChangedRef.current = false;
  }, []);

  const undoLastDig = useCallback(() => {
    if (!canUndo) return;

    setUndoStack((prev) => {
      const snapshot = prev[prev.length - 1];
      if (!snapshot) return prev;

      setGrid(cloneGrid(snapshot));
      setMsg("Undid the last tunnel cut.");
      return prev.slice(0, -1);
    });
  }, [canUndo]);

  const awardGlucose = useCallback(async (amount: number) => {
    setRewardAmt(amount);
    setRewardOpen(true);
    setRewardStatus("loading");
    setRewardMsg("");

    try {
      const response = await fetch("/api/glucose/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setRewardStatus("error");
        setRewardMsg(data?.message ?? "Failed to update glucose.");
        return;
      }

      setRewardStatus("ok");
      setRewardMsg(`You earned ${amount} glucose.`);
    } catch {
      setRewardStatus("error");
      setRewardMsg("Network error while updating glucose.");
    }
  }, []);

  useEffect(() => {
    if (!flowing || won || !layout) return;

    tickRef.current = setInterval(() => {
      const currentGrid = gridRef.current;
      const currentDucks = ducksRef.current;
      const currentDroplets = dropletsRef.current;

      let ducksChanged = false;
      const nextDucks = currentDucks.map((duck) => ({ ...duck }));
      const nextDroplets: Droplet[] = [];
      let nextTubFill = tubFillRef.current;
      let nextMessage = "";
      let nextRejectedId: string | null = null;
      const occupancy = new Map<string, number>();

      for (const droplet of currentDroplets) {
        let x = droplet.x;
        let y = droplet.y;
        let drift = droplet.drift;
        let settledTicks = droplet.settledTicks;
        let removed = false;

        for (let step = 0; step < 2; step++) {
          if (x < -DROPLET_RADIUS || x > W + DROPLET_RADIUS || y > H + DROPLET_RADIUS) {
            removed = true;
            break;
          }

          if (layout && isInsideTub(x, y, layout)) {
            nextTubFill = Math.min(level.tubGoal, nextTubFill + 1);
            removed = true;
            break;
          }

          const col = Math.floor(x / CELL);
          const row = Math.floor(y / CELL);
          const duckHere = nextDucks.find(
            (duck) => !duck.collected && duck.col === col && duck.row === row
          );

          if (duckHere) {
            const nextDuck = nextDucks.find((duck) => !duck.collected);

            if (!nextDuck || duckHere.id !== nextDuck.id) {
              nextRejectedId = duckHere.id;
              nextMessage = `Wrong order. Collect ${nextDuck?.label ?? "the next duck"} first.`;
              removed = true;
              break;
            }

            duckHere.collected = true;
            ducksChanged = true;
            nextMessage = `Collected ${duckHere.label}.`;
          }

          let moved = false;
          for (const option of getMoveOptions(drift)) {
            const nextX = x + option.dx;
            const nextY = y + option.dy;
            if (!isDropletPositionOpen(nextX, nextY, currentGrid)) continue;

            const occCol = Math.floor(Math.max(0, Math.min(W - 1, nextX)) / CELL);
            const occRow = Math.floor(Math.max(0, Math.min(H - 1, nextY)) / CELL);
            const occKey = `${occCol},${occRow}`;
            const occCount = occupancy.get(occKey) ?? 0;

            if (occCount >= 2 && option.dy <= 0) continue;

            x = nextX;
            y = nextY;
            drift = option.nextDrift;
            settledTicks = 0;
            moved = true;
            break;
          }

          if (!moved) {
            settledTicks += 1;
            if (isDropletPositionOpen(x + drift * 2, y, currentGrid)) {
              x += drift * 2;
            }
            break;
          }
        }

        if (removed || settledTicks > STUCK_TICKS_BEFORE_FADE) continue;

        const occCol = Math.floor(Math.max(0, Math.min(W - 1, x)) / CELL);
        const occRow = Math.floor(Math.max(0, Math.min(H - 1, y)) / CELL);
        const occKey = `${occCol},${occRow}`;
        occupancy.set(occKey, (occupancy.get(occKey) ?? 0) + 1);

        nextDroplets.push({
          id: droplet.id,
          x,
          y,
          drift,
          settledTicks,
        });
      }

      spawnCounterRef.current += 1;
      if (spawnCounterRef.current >= SPAWN_EVERY_TICKS && nextDroplets.length < MAX_VISIBLE_DROPLETS) {
        nextDroplets.push(createDroplet(layout, dropletIdRef.current++));
        spawnCounterRef.current = 0;
      }

      if (nextRejectedId) {
        if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
        setRejId(nextRejectedId);
        rejectTimeoutRef.current = setTimeout(() => setRejId(null), 700);
      }

      if (nextMessage) {
        setMsg(nextMessage);
      }

      if (ducksChanged) {
        setDucks(nextDucks);
      }

      if (ducksChanged && nextDucks.every((duck) => duck.collected) && nextTubFill < level.tubGoal) {
        setMsg("All ducks collected. Keep feeding the tub.");
      }

      if (nextTubFill !== tubFillRef.current) {
        setTubFill(nextTubFill);
      }

      setDroplets(nextDroplets);

      const allCollected = nextDucks.every((duck) => duck.collected);
      if (allCollected && nextTubFill >= level.tubGoal) {
        if (tickRef.current) clearInterval(tickRef.current);
        setWon(true);
        setFlowing(false);
        setDucks(nextDucks);
        setDroplets(nextDroplets);
        setMsg(`${level.elementName} (${level.symbol}) complete.`);

        if (!rewardClaimed && lvIdx === LEVELS.length - 1) {
          setRewardClaimed(true);
          void awardGlucose(GLUCOSE_REWARD);
        }
      }
    }, TICK_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [awardGlucose, flowing, layout, lvIdx, rewardClaimed, won, level]);

  const dirtCutouts = useMemo(() => {
    return grid.flatMap((cell, index) => {
      if (cell.kind === "dirt") return [];

      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = col * CELL;
      const y = row * CELL;
      const seed = (col * 19 + row * 23) % 9;

      return [
        {
          key: `${index}-core`,
          cx: x + CELL * 0.5,
          cy: y + CELL * 0.52,
          rx: CELL * (0.46 + (seed % 3) * 0.03),
          ry: CELL * (0.47 + ((seed + 1) % 3) * 0.025),
          rotate: seed * 7 - 18,
        },
        {
          key: `${index}-left`,
          cx: x + CELL * (0.26 + (seed % 4) * 0.03),
          cy: y + CELL * (0.36 + ((seed + 2) % 3) * 0.07),
          rx: CELL * 0.24,
          ry: CELL * 0.2,
          rotate: seed * 11,
        },
        {
          key: `${index}-right`,
          cx: x + CELL * (0.72 - (seed % 4) * 0.025),
          cy: y + CELL * (0.68 - ((seed + 1) % 3) * 0.06),
          rx: CELL * 0.26,
          ry: CELL * 0.21,
          rotate: 20 - seed * 9,
        },
      ];
    });
  }, [grid]);

  if (!layout || grid.length === 0) {
    return null;
  }

  const tubX = layout.tubCols[0] * CELL;
  const tubY = layout.tubRows[0] * CELL;
  const tubW = (layout.tubCols[1] - layout.tubCols[0] + 1) * CELL;
  const tubH = (layout.tubRows[1] - layout.tubRows[0] + 1) * CELL;
  const tubWaterHeight = tubH * tubRatio;

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center bg-white px-4 py-6 text-slate-900 dark:bg-black dark:text-slate-100 sm:px-6">
        <div className="mb-3 text-center">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Where&apos;s My Water?: Electron Configuration
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Level {level.id}/5 - {level.elementName} ({level.symbol})
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          {!flowing && !won && (
            <button
              onClick={() => {
                setFlowing(true);
                setMsg("Flow started.");
              }}
              className="rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
            >
              Start Flow
            </button>
          )}
          <button
            onClick={() => initLevel(level)}
            className="rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300"
          >
            Reset Level
          </button>
          <button
            onClick={undoLastDig}
            disabled={!canUndo}
            className="rounded-2xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Undo Dig
          </button>
          {won && lvIdx < LEVELS.length - 1 && (
            <button
              onClick={() => setLvIdx((current) => current + 1)}
              className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
            >
              Next Level
            </button>
          )}
          {seenIntro && (
            <button
              onClick={() => {
                setIntroStep(0);
                setShowIntro(true);
              }}
              className="rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              How to Play
            </button>
          )}
          {msg && (
            <span
              className={`max-w-md text-sm font-semibold ${
                msg.startsWith("Wrong") ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {msg}
            </span>
          )}
        </div>

        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/70">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {level.title}
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{level.hint}</p>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl border-4 border-[#3f2e1a]" style={{ aspectRatio: `${W} / ${H}` }}>
              {showIntro && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                  <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-950/95 p-6 text-center text-white shadow-2xl">
                    <h3 className="text-2xl font-black">{INTRO_STEPS[introStep].title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {INTRO_STEPS[introStep].body}
                    </p>
                    <p className="mt-2 text-xs italic text-slate-500">{INTRO_STEPS[introStep].sub}</p>

                    <div className="mt-5 flex justify-center gap-2">
                      {INTRO_STEPS.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full ${index === introStep ? "bg-sky-400" : "bg-slate-700"}`}
                        />
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between">
                      {introStep > 0 ? (
                        <button
                          onClick={() => setIntroStep((current) => current - 1)}
                          className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-bold hover:bg-slate-700"
                        >
                          Back
                        </button>
                      ) : (
                        <div />
                      )}
                      {introStep < INTRO_STEPS.length - 1 ? (
                        <button
                          onClick={() => setIntroStep((current) => current + 1)}
                          className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-bold hover:bg-sky-500"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIntroStep(0);
                            setShowIntro(false);
                            setSeenIntro(true);
                          }}
                          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold hover:bg-emerald-500"
                        >
                          Start Digging
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="block h-full w-full touch-none select-none"
                style={{ touchAction: "none", cursor: flowing ? "default" : "crosshair" }}
                onPointerDown={(event) => {
                  if (flowing || showIntro) return;
                  if (event.pointerType === "mouse" && event.button !== 0) return;

                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);

                  const point = getBoardPointFromPointer(event);
                  if (!point) return;

                  draggingRef.current = true;
                  strokeSnapshotRef.current = cloneGrid(gridRef.current);
                  strokeChangedRef.current = false;
                  lastPointerRef.current = point;
                  carveStrokeSegment(point, point);
                }}
                onPointerMove={(event) => {
                  if (!draggingRef.current || flowing) return;

                  event.preventDefault();
                  const point = getBoardPointFromPointer(event);
                  const lastPoint = lastPointerRef.current;
                  if (!point || !lastPoint) return;

                  carveStrokeSegment(lastPoint, point);
                  lastPointerRef.current = point;
                }}
                onPointerUp={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  finishStroke();
                }}
                onPointerCancel={finishStroke}
                onLostPointerCapture={finishStroke}
              >
                <defs>
                  <linearGradient id="caveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#221106" />
                    <stop offset="100%" stopColor="#120803" />
                  </linearGradient>
                  <linearGradient id="dirtFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c5c38" />
                    <stop offset="100%" stopColor="#4a2d15" />
                  </linearGradient>
                  <linearGradient id="tubWaterFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="gatorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#166534" />
                  </linearGradient>
                  <filter id="softShadow">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.35" />
                  </filter>
                  <pattern id="dirtTexture" width="88" height="88" patternUnits="userSpaceOnUse">
                    <circle cx="12" cy="14" r="4.4" fill="#5b391d" opacity="0.35" />
                    <circle cx="30" cy="28" r="3" fill="#9c7750" opacity="0.28" />
                    <circle cx="55" cy="18" r="2.6" fill="#4b2d16" opacity="0.32" />
                    <circle cx="71" cy="35" r="4.8" fill="#7f5b36" opacity="0.22" />
                    <circle cx="16" cy="58" r="3.4" fill="#9a7349" opacity="0.2" />
                    <circle cx="45" cy="63" r="4.1" fill="#4b2d16" opacity="0.25" />
                    <circle cx="74" cy="69" r="2.8" fill="#a47b51" opacity="0.24" />
                  </pattern>
                  <mask id="dirtMask">
                    <rect width={W} height={H} fill="white" />
                    {dirtCutouts.map((cutout) => (
                      <ellipse
                        key={cutout.key}
                        cx={cutout.cx}
                        cy={cutout.cy}
                        rx={cutout.rx}
                        ry={cutout.ry}
                        fill="black"
                        transform={`rotate(${cutout.rotate} ${cutout.cx} ${cutout.cy})`}
                      />
                    ))}
                  </mask>
                </defs>

                <rect width={W} height={H} fill="url(#caveFill)" />
                {Array.from({ length: 90 }, (_, index) => {
                  const px = ((index * 137) % W) + 6;
                  const py = ((index * 89) % H) + 8;
                  const radius = 1.5 + ((index * 3) % 5);
                  const opacity = 0.08 + ((index % 4) * 0.03);
                  return (
                    <circle
                      key={`cave-speck-${index}`}
                      cx={px}
                      cy={py}
                      r={radius}
                      fill="#c08457"
                      opacity={opacity}
                    />
                  );
                })}

                <g mask="url(#dirtMask)">
                  <rect width={W} height={H} fill="url(#dirtFill)" />
                  <rect width={W} height={H} fill="url(#dirtTexture)" opacity={0.95} />
                </g>

                <rect
                  x={tubX - 8}
                  y={tubY - 10}
                  width={tubW + 16}
                  height={tubH + 18}
                  rx={18}
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth={4}
                />
                <rect
                  x={tubX + 2}
                  y={tubY + 2}
                  width={tubW - 4}
                  height={tubH - 4}
                  rx={12}
                  fill="#f0f9ff"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
                {tubRatio > 0 && (
                  <rect
                    x={tubX + 2}
                    y={tubY + tubH - tubWaterHeight - 2}
                    width={tubW - 4}
                    height={tubWaterHeight}
                    rx={12}
                    fill="url(#tubWaterFill)"
                    opacity={0.92}
                  />
                )}
                <g filter="url(#softShadow)">
                  <g transform={`translate(${layout.gatorFacing === -1 ? tubX + tubW : tubX}, 0) scale(${layout.gatorFacing}, 1)`}>
                    <ellipse cx={tubW * 0.42} cy={tubY + tubH * 0.55} rx={tubW * 0.28} ry={tubH * 0.18} fill="url(#gatorFill)" />
                    <ellipse cx={tubW * 0.72} cy={tubY + tubH * 0.48} rx={tubW * 0.13} ry={tubH * 0.16} fill="#16a34a" />
                    <ellipse cx={tubW * 0.84} cy={tubY + tubH * 0.56} rx={tubW * 0.1} ry={tubH * 0.08} fill="#15803d" />
                    <circle cx={tubW * 0.67} cy={tubY + tubH * 0.42} r={5} fill="#dcfce7" />
                    <circle cx={tubW * 0.67} cy={tubY + tubH * 0.42} r={2.3} fill="#166534" />
                    {[0, 1, 2].map((tooth) => (
                      <polygon
                        key={`tooth-${tooth}`}
                        points={`${tubW * 0.76 + tooth * 8},${tubY + tubH * 0.58} ${tubW * 0.79 + tooth * 8},${tubY + tubH * 0.68} ${tubW * 0.82 + tooth * 8},${tubY + tubH * 0.58}`}
                        fill="white"
                      />
                    ))}
                  </g>
                  <text
                    x={tubX + tubW / 2}
                    y={tubY - 16}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={900}
                    fill="#15803d"
                  >
                    {level.elementName} ({level.symbol})
                  </text>
                </g>

                <g filter="url(#softShadow)">
                  <rect
                    x={layout.sourceCol * CELL + 8}
                    y={layout.sourceRow * CELL}
                    width={CELL - 16}
                    height={CELL + 8}
                    rx={10}
                    fill="#334155"
                  />
                  <rect
                    x={layout.sourceCol * CELL + 13}
                    y={layout.sourceRow * CELL + 4}
                    width={CELL - 26}
                    height={CELL + 2}
                    rx={8}
                    fill="#1e293b"
                  />
                  <circle
                    cx={(layout.sourceCol + 0.5) * CELL}
                    cy={(layout.sourceRow + 0.56) * CELL}
                    r={13}
                    fill="#38bdf8"
                  >
                    <animate attributeName="r" values="11;14;11" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                  <text
                    x={(layout.sourceCol + 0.5) * CELL}
                    y={(layout.sourceRow + 0.72) * CELL}
                    textAnchor="middle"
                    fontSize={7}
                    fontWeight={900}
                    fill="#082f49"
                  >
                    SOURCE
                  </text>
                </g>

                {droplets.map((droplet) => (
                  <g key={droplet.id}>
                    <ellipse
                      cx={droplet.x}
                      cy={droplet.y}
                      rx={DROPLET_RADIUS}
                      ry={DROPLET_RADIUS + 1.8}
                      fill="#38bdf8"
                      opacity={0.95}
                    />
                    <circle cx={droplet.x - 2} cy={droplet.y - 3} r={2.2} fill="white" opacity={0.4} />
                  </g>
                ))}

                {ducks.map((duck) => {
                  const x = duck.col * CELL;
                  const y = duck.row * CELL;
                  const centerX = x + CELL / 2;
                  const centerY = y + CELL / 2;
                  const activeFill = duck.collected ? "#6ee7b7" : rejId === duck.id ? "#ef4444" : duck.color;
                  const opacity = duck.collected ? 0.4 : 1;

                  return (
                    <g key={duck.id} opacity={opacity} filter="url(#softShadow)">
                      {!duck.collected && (
                        <circle cx={centerX + 3} cy={centerY + 7} r={19} fill={duck.color} opacity={0.12} />
                      )}
                      <ellipse cx={centerX - 2} cy={centerY + 7} rx={15} ry={10} fill={activeFill} stroke="#1e293b" strokeWidth={1.5} />
                      <circle cx={centerX + 12} cy={centerY - 1} r={9} fill={activeFill} stroke="#1e293b" strokeWidth={1.5} />
                      <ellipse cx={centerX + 22} cy={centerY - 1} rx={6} ry={3.5} fill="#f97316" stroke="#ea580c" strokeWidth={1} />
                      <circle cx={centerX + 13} cy={centerY - 6} r={2.5} fill="#0f172a" />
                      <circle cx={centerX + 14} cy={centerY - 7} r={1} fill="white" />
                      <ellipse cx={centerX - 4} cy={centerY + 4} rx={7} ry={4} fill={activeFill} stroke="#1e293b" strokeWidth={1} opacity={0.65} />
                      <ellipse cx={centerX - 16} cy={centerY + 5} rx={5} ry={6} fill={activeFill} stroke="#1e293b" strokeWidth={1} />
                      <rect x={centerX - 18} y={centerY + 16} width={36} height={14} rx={4} fill="#0f172a" opacity={0.94} />
                      <text x={centerX} y={centerY + 26} textAnchor="middle" fontSize={9} fontWeight={900} fill="white" fontFamily="'Courier New', monospace">
                        {duck.label}
                      </text>
                      {duck.collected && (
                        <text x={centerX + 2} y={centerY + 6} textAnchor="middle" fontSize={18} fill="#16a34a" fontWeight={900}>
                          OK
                        </text>
                      )}
                      {rejId === duck.id && (
                        <text x={centerX + 2} y={centerY + 6} textAnchor="middle" fontSize={18} fill="#ef4444" fontWeight={900}>
                          X
                        </text>
                      )}
                    </g>
                  );
                })}

                {won &&
                  Array.from({ length: 14 }, (_, index) => (
                    <circle
                      key={`celebrate-${index}`}
                      cx={tubX + 22 + (index % 7) * (tubW / 7)}
                      cy={tubY - 8}
                      r={5}
                      fill={["#fbbf24", "#34d399", "#60a5fa", "#f87171", "#c084fc"][index % 5]}
                    >
                      <animate
                        attributeName="cy"
                        values={`${tubY - 8};${tubY - 50};${tubY - 8}`}
                        dur={`${0.5 + (index % 4) * 0.12}s`}
                        begin={`${(index % 3) * 0.08}s`}
                        repeatCount="4"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9;0.3;0.9"
                        dur={`${0.5 + (index % 4) * 0.12}s`}
                        repeatCount="4"
                      />
                    </circle>
                  ))}
              </svg>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[270px]">
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">Element</div>
              <div className="mt-2 text-lg font-black text-slate-900 dark:text-slate-100">
                {level.elementName} ({level.symbol})
              </div>
              <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                Target: {level.targetConfig}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">Collected</div>
              <div className="mt-2 min-h-10 font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {collectedLabels.length === 0 ? (
                  <span className="italic text-slate-400">No orbitals collected yet.</span>
                ) : (
                  collectedLabels.join(" ")
                )}
              </div>
              <div className="mt-3 text-xs font-semibold text-sky-700 dark:text-sky-300">
                Next: {nextRequiredDuck ? nextRequiredDuck.label : "Tub fill"}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Tub progress</div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {Math.min(tubFill, level.tubGoal)}/{level.tubGoal}
                </span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${tubRatio * 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Enough droplets must reach the bathtub after the ducks are collected.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">Orbital ducks</div>
              <div className="mt-3 flex flex-col gap-2">
                {ducks.map((duck) => (
                  <div key={duck.id} className="flex items-center gap-2">
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: duck.collected ? "#22c55e" : duck.color,
                        border: "1px solid #334155",
                        flexShrink: 0,
                      }}
                    />
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {duck.label}
                    </span>
                    {duck.collected && <span className="ml-auto text-xs font-bold text-emerald-500">done</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
              <div className="text-xs font-black uppercase tracking-widest text-amber-500">Hint</div>
              <p className="mt-2 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                {level.hint}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">Order reference</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {ducks.map((duck) => (
                  <span
                    key={`order-${duck.id}`}
                    className="rounded-full px-2 py-1 font-mono text-[11px] font-black"
                    style={{
                      background: duck.collected ? "rgba(34,197,94,0.14)" : "rgba(15,23,42,0.08)",
                      color: duck.collected ? "#16a34a" : SUBSHELL_COLORS[duck.subshell],
                    }}
                  >
                    {duck.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">Legend</div>
              <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
                {[
                  { color: "#7c5c38", label: "Natural dirt - drag to carve tunnels" },
                  { color: "#38bdf8", label: "Electron droplets" },
                  { color: "#e2e8f0", label: "Alligator tub goal" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        background: color,
                        border: "1px solid #475569",
                        flexShrink: 0,
                      }}
                    />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {rewardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              All 5 levels complete
            </h2>
            <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
              You cleared every electron configuration level and earned{" "}
              <span className="font-bold">{rewardAmt}</span> glucose.
            </p>
            <div className="mt-4 text-sm">
              {rewardStatus === "loading" && (
                <p className="text-slate-600 dark:text-slate-300">Updating glucose...</p>
              )}
              {rewardStatus === "ok" && (
                <p className="text-emerald-700 dark:text-emerald-300">{rewardMsg}</p>
              )}
              {rewardStatus === "error" && (
                <p className="text-red-700 dark:text-red-300">{rewardMsg}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setRewardOpen(false)}
                className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
