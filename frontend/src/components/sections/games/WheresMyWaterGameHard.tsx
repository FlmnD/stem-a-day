'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const COLS = 22;
const ROWS = 16;
const CELL = 44;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK_MS = 55;
const GLUCOSE_REWARD = 35;
const DROPLET_RADIUS = 7;
const MAX_VISIBLE_DROPLETS = 11;
const SPAWN_EVERY_TICKS = 4;
const STUCK_TICKS_BEFORE_FADE = 9;
const DIG_BRUSH_RADIUS = CELL * 0.72;

type CellKind = "dirt" | "empty" | "source" | "tub";
type IonRole = "reactive" | "spectator";

interface Cell {
  kind: CellKind;
}

interface BoardPoint {
  x: number;
  y: number;
}

interface TunnelMaskShape {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
}

interface IonSeed {
  id: string;
  label: string;
  displayLabel: string;
  role: IonRole;
  color: string;
}

interface IonNode extends IonSeed {
  col: number;
  row: number;
  collected: boolean;
}

interface Droplet {
  id: number;
  x: number;
  y: number;
  drift: number;
  settledTicks: number;
}

interface LevelDef {
  id: number;
  title: string;
  reactionName: string;
  reactants: string;
  netIonic: string;
  productFormula: string;
  productName: string;
  reactive: string[];
  spectators: string[];
  tubGoal: number;
  hint: string;
}

interface LevelLayout {
  sourceCol: number;
  sourceRow: number;
  tubCols: [number, number];
  tubRows: [number, number];
  gatorFacing: -1 | 1;
  ions: IonNode[];
}

interface ResultModalState {
  type: "next" | "final" | "lose";
  title: string;
  body: string;
  actionLabel: string;
}

const REACTIVE_SLOTS = [
  { col: 5, row: 3 },
  { col: 9, row: 5 },
  { col: 14, row: 7 },
  { col: 10, row: 9 },
  { col: 15, row: 11 },
];

const SPECTATOR_SLOTS = [
  { col: 15, row: 3 },
  { col: 4, row: 6 },
  { col: 17, row: 6 },
  { col: 6, row: 8 },
  { col: 13, row: 10 },
  { col: 4, row: 11 },
];

const LEVELS: LevelDef[] = [
  {
    id: 1,
    title: "Net Ionic 1 - Silver Chloride",
    reactionName: "Silver chloride precipitation",
    reactants: "AgNO3(aq) + NaCl(aq)",
    netIonic: "Ag+ + Cl- -> AgCl(s)",
    productFormula: "AgCl(s)",
    productName: "Silver chloride",
    reactive: ["Ag+", "Cl-"],
    spectators: ["Na+", "NO3-"],
    tubGoal: 6,
    hint: "Collect only the ions that belong in the net ionic equation and avoid spectators.",
  },
  {
    id: 2,
    title: "Net Ionic 2 - Lead Iodide",
    reactionName: "Lead(II) iodide precipitation",
    reactants: "Pb(NO3)2(aq) + KI(aq)",
    netIonic: "Pb2+ + 2I- -> PbI2(s)",
    productFormula: "PbI2(s)",
    productName: "Lead(II) iodide",
    reactive: ["Pb2+", "I-", "I-"],
    spectators: ["K+", "NO3-"],
    tubGoal: 7,
    hint: "This one needs two iodide ions, so the order matters all the way through the second I-.",
  },
  {
    id: 3,
    title: "Net Ionic 3 - Calcium Carbonate",
    reactionName: "Calcium carbonate precipitation",
    reactants: "CaCl2(aq) + Na2CO3(aq)",
    netIonic: "Ca2+ + CO3^2- -> CaCO3(s)",
    productFormula: "CaCO3(s)",
    productName: "Calcium carbonate",
    reactive: ["Ca2+", "CO3^2-"],
    spectators: ["Na+", "Cl-"],
    tubGoal: 8,
    hint: "Remember that sodium and chloride stay dissolved here. They should cancel out.",
  },
  {
    id: 4,
    title: "Net Ionic 4 - Barium Sulfate",
    reactionName: "Barium sulfate precipitation",
    reactants: "BaCl2(aq) + Na2SO4(aq)",
    netIonic: "Ba2+ + SO4^2- -> BaSO4(s)",
    productFormula: "BaSO4(s)",
    productName: "Barium sulfate",
    reactive: ["Ba2+", "SO4^2-"],
    spectators: ["Na+", "Cl-"],
    tubGoal: 9,
    hint: "Guide the stream through the precipitate-forming ions, then finish by filling the product tub.",
  },
  {
    id: 5,
    title: "Net Ionic 5 - Iron(III) Hydroxide",
    reactionName: "Iron(III) hydroxide precipitation",
    reactants: "Fe(NO3)3(aq) + KOH(aq)",
    netIonic: "Fe3+ + 3OH- -> Fe(OH)3(s)",
    productFormula: "Fe(OH)3(s)",
    productName: "Iron(III) hydroxide",
    reactive: ["Fe3+", "OH-", "OH-", "OH-"],
    spectators: ["K+", "NO3-"],
    tubGoal: 10,
    hint: "This final level uses repeated hydroxide ions. Collect all three before the water budget runs out.",
  },
];

const INTRO_STEPS = [
  {
    title: "Dig the reaction path",
    body:
      "Carve your own tunnel through the dirt. The droplets only follow the spaces you open, and the water budget is limited.",
    sub: "No prebuilt channels and no infinite source.",
  },
  {
    title: "Collect only the net ionic species",
    body:
      "Each ion marker shows either a reactive ion or a spectator ion. Touch only the ions that belong in the net ionic equation.",
    sub: "Spectator ions should cancel out, so they waste water if you hit them.",
  },
  {
    title: "Respect the stoichiometric order",
    body:
      "Repeated ions like I- or OH- appear as separate steps. You still have to collect them in sequence to build the correct precipitate path.",
    sub: "Think in terms of the reaction coefficients.",
  },
  {
    title: "Fill the precipitate tub",
    body:
      "After collecting the full net ionic set, enough droplets still need to reach the alligator bathtub to clear the level.",
    sub: "Winning means correct ions plus enough product flow.",
  },
];

const ck = (c: number, r: number) => r * COLS + c;

function cloneGrid(grid: Cell[]) {
  return grid.map((cell) => ({ kind: cell.kind }));
}

function getIonColor(label: string, role: IonRole) {
  if (role === "spectator") {
    if (label.includes("NO3")) return "#fda4af";
    if (label.includes("Na") || label.includes("K")) return "#fdba74";
    return "#f9a8d4";
  }

  if (label.includes("Cl") || label.includes("I") || label.includes("OH") || label.includes("SO4") || label.includes("CO3")) {
    return "#67e8f9";
  }

  if (label.includes("Ag")) return "#f8fafc";
  if (label.includes("Pb")) return "#cbd5e1";
  if (label.includes("Fe")) return "#fca5a5";
  if (label.includes("Ba")) return "#fde68a";
  if (label.includes("Ca")) return "#d8b4fe";
  return "#bfdbfe";
}

function buildIonSeeds(level: LevelDef) {
  const reactiveTotals = new Map<string, number>();
  const spectatorTotals = new Map<string, number>();
  const reactiveSeen = new Map<string, number>();
  const spectatorSeen = new Map<string, number>();

  for (const ion of level.reactive) {
    reactiveTotals.set(ion, (reactiveTotals.get(ion) ?? 0) + 1);
  }

  for (const ion of level.spectators) {
    spectatorTotals.set(ion, (spectatorTotals.get(ion) ?? 0) + 1);
  }

  const reactiveSeeds: IonSeed[] = level.reactive.map((label, index) => {
    const seen = (reactiveSeen.get(label) ?? 0) + 1;
    reactiveSeen.set(label, seen);
    const total = reactiveTotals.get(label) ?? 1;

    return {
      id: `reactive_${label}_${index + 1}`,
      label,
      displayLabel: total > 1 ? `${label} ${seen}` : label,
      role: "reactive",
      color: getIonColor(label, "reactive"),
    };
  });

  const spectatorSeeds: IonSeed[] = level.spectators.map((label, index) => {
    const seen = (spectatorSeen.get(label) ?? 0) + 1;
    spectatorSeen.set(label, seen);
    const total = spectatorTotals.get(label) ?? 1;

    return {
      id: `spectator_${label}_${index + 1}`,
      label,
      displayLabel: total > 1 ? `${label} ${seen}` : label,
      role: "spectator",
      color: getIonColor(label, "spectator"),
    };
  });

  return { reactiveSeeds, spectatorSeeds };
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

function getWaterBudget(level: LevelDef) {
  return level.tubGoal + level.reactive.length * 2 + 4;
}

function buildLevelLayout(level: LevelDef): LevelLayout {
  const mirror = level.id % 2 === 0;
  const mapCol = (col: number) => (mirror ? COLS - 1 - col : col);
  const { reactiveSeeds, spectatorSeeds } = buildIonSeeds(level);

  const reactiveNodes: IonNode[] = reactiveSeeds.map((seed, index) => {
    const slot = REACTIVE_SLOTS[index] ?? REACTIVE_SLOTS[REACTIVE_SLOTS.length - 1];
    return {
      ...seed,
      col: mapCol(slot.col),
      row: slot.row,
      collected: false,
    };
  });

  const spectatorNodes: IonNode[] = spectatorSeeds.map((seed, index) => {
    const slot = SPECTATOR_SLOTS[index] ?? SPECTATOR_SLOTS[SPECTATOR_SLOTS.length - 1];
    return {
      ...seed,
      col: mapCol(slot.col),
      row: slot.row,
      collected: false,
    };
  });

  const sourceCol = reactiveNodes[0]?.col ?? 5;
  const sourceRow = 0;
  const tubWidth = 6;
  const tubRows: [number, number] = [12, 15];
  const lastReactiveCol = reactiveNodes[reactiveNodes.length - 1]?.col ?? 14;
  const tubStart = Math.max(1, Math.min(COLS - tubWidth - 1, lastReactiveCol - 2));
  const tubCols: [number, number] = [tubStart, tubStart + tubWidth - 1];
  const gatorFacing: -1 | 1 = tubStart + tubWidth / 2 > COLS / 2 ? -1 : 1;

  return {
    sourceCol,
    sourceRow,
    tubCols,
    tubRows,
    gatorFacing,
    ions: [...reactiveNodes, ...spectatorNodes],
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
  return col >= layout.tubCols[0] && col <= layout.tubCols[1] && row >= layout.tubRows[0] && row <= layout.tubRows[1];
}

function createDroplet(layout: LevelLayout, id: number): Droplet {
  return {
    id,
    x: (layout.sourceCol + 0.5) * CELL + (id % 2 === 0 ? -3 : 3),
    y: (layout.sourceRow + 0.72) * CELL,
    drift: id % 2 === 0 ? -1 : 1,
    settledTicks: 0,
  };
}

function getMoveOptions(drift: number) {
  const sign = drift === 0 ? 1 : Math.sign(drift);
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

export default function WheresMyWaterGameHard() {
  const [lvIdx, setLvIdx] = useState(0);
  const [layout, setLayout] = useState<LevelLayout | null>(null);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [ions, setIons] = useState<IonNode[]>([]);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [flowing, setFlowing] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [msg, setMsg] = useState("");
  const [rejId, setRejId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<Cell[][]>([]);
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [seenIntro, setSeenIntro] = useState(false);
  const [tubFill, setTubFill] = useState(0);
  const [waterLeft, setWaterLeft] = useState(0);
  const [rewardAmt, setRewardAmt] = useState(0);
  const [rewardStatus, setRewardStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [rewardMsg, setRewardMsg] = useState("");
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [pendingResult, setPendingResult] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const rejectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<Cell[]>([]);
  const ionsRef = useRef<IonNode[]>([]);
  const dropletsRef = useRef<Droplet[]>([]);
  const tubFillRef = useRef(0);
  const waterLeftRef = useRef(0);
  const spawnCounterRef = useRef(0);
  const dropletIdRef = useRef(1);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef<BoardPoint | null>(null);
  const strokeSnapshotRef = useRef<Cell[] | null>(null);
  const strokeChangedRef = useRef(false);

  const level = LEVELS[lvIdx];

  gridRef.current = grid;
  ionsRef.current = ions;
  dropletsRef.current = droplets;
  tubFillRef.current = tubFill;
  waterLeftRef.current = waterLeft;

  const initLevel = useCallback(
    (nextLevel: LevelDef) => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);

      const nextLayout = buildLevelLayout(nextLevel);
      const nextWaterBudget = getWaterBudget(nextLevel);

      setLayout(nextLayout);
      setGrid(initGrid(nextLayout));
      setIons(nextLayout.ions.map((ion) => ({ ...ion, collected: false })));
      setDroplets([]);
      setFlowing(false);
      setWon(false);
      setLost(false);
      setTubFill(0);
      setWaterLeft(nextWaterBudget);
      setUndoStack([]);
      setPendingResult(false);
      setResultModal(null);
      setMsg("");
      setRejId(null);
      setRewardStatus("idle");
      setRewardMsg("");
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
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, []);

  const nextRequiredIon = useMemo(
    () => ions.find((ion) => ion.role === "reactive" && !ion.collected) ?? null,
    [ions]
  );

  const dugCellCount = useMemo(
    () => grid.reduce((count, cell) => count + (cell.kind === "empty" ? 1 : 0), 0),
    [grid]
  );

  const hasStartedDigging = dugCellCount > 0;
  const tubRatio = Math.min(1, tubFill / level.tubGoal);
  const canUndo = undoStack.length > 0 && !flowing && !won && !lost;
  const buttonsLocked = showIntro || pendingResult || !!resultModal;
  const startDisabled = buttonsLocked || !hasStartedDigging || flowing || won || lost;
  const resetDisabled = buttonsLocked || !hasStartedDigging || won;
  const undoDisabled = buttonsLocked || !canUndo;
  const howToDisabled = showIntro || pendingResult || !!resultModal;

  const scheduleResultModal = useCallback((modal: ResultModalState) => {
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    setPendingResult(true);
    resultTimeoutRef.current = setTimeout(() => {
      setPendingResult(false);
      setResultModal(modal);
    }, 2000);
  }, []);

  const resetAttempt = useCallback(() => {
    if (!layout) return;
    if (tickRef.current) clearInterval(tickRef.current);
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);

    setGrid(initGrid(layout));
    setIons(layout.ions.map((ion) => ({ ...ion, collected: false })));
    setDroplets([]);
    setFlowing(false);
    setWon(false);
    setLost(false);
    setTubFill(0);
    setWaterLeft(getWaterBudget(level));
    setUndoStack([]);
    setPendingResult(false);
    setResultModal(null);
    setMsg("");
    setRejId(null);
    setRewardStatus("idle");
    setRewardMsg("");
    spawnCounterRef.current = 0;
    dropletIdRef.current = 1;
    draggingRef.current = false;
    lastPointerRef.current = null;
    strokeSnapshotRef.current = null;
    strokeChangedRef.current = false;
  }, [layout, level]);

  const awardGlucose = useCallback(async (amount: number) => {
    setRewardAmt(amount);
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

  const concludeRound = useCallback(
    (result: "win" | "lose", reason: string, nextIons: IonNode[], nextTubFill: number) => {
      if (tickRef.current) clearInterval(tickRef.current);

      setFlowing(false);
      setIons(nextIons);
      setDroplets([]);
      setTubFill(nextTubFill);
      setMsg(reason);

      if (result === "win") {
        setWon(true);
        setLost(false);

        if (lvIdx === LEVELS.length - 1) {
          scheduleResultModal({
            type: "final",
            title: "You win!",
            body: `You cleared every hard level and built each precipitate's net ionic equation.`,
            actionLabel: "Play again",
          });

          if (!rewardClaimed) {
            setRewardClaimed(true);
            void awardGlucose(GLUCOSE_REWARD);
          }
        } else {
          scheduleResultModal({
            type: "next",
            title: `${level.productName} cleared`,
            body: `You collected the correct reactive ions and filled the product tub.`,
            actionLabel: "Next level",
          });
        }
        return;
      }

      setWon(false);
      setLost(true);
      scheduleResultModal({
        type: "lose",
        title: "Try again",
        body: reason,
        actionLabel: "Reset level",
      });
    },
    [awardGlucose, level.productName, lvIdx, rewardClaimed, scheduleResultModal]
  );

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
      setUndoStack((prev) => [...prev, strokeSnapshotRef.current as Cell[]]);
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

  useEffect(() => {
    if (!flowing || won || lost || !layout) return;

    tickRef.current = setInterval(() => {
      const currentGrid = gridRef.current;
      const currentIons = ionsRef.current;
      const currentDroplets = dropletsRef.current;

      let ionsChanged = false;
      const nextIons = currentIons.map((ion) => ({ ...ion }));
      const nextDroplets: Droplet[] = [];
      let nextTubFill = tubFillRef.current;
      let nextWaterLeft = waterLeftRef.current;
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

          if (isInsideTub(x, y, layout)) {
            nextTubFill = Math.min(level.tubGoal, nextTubFill + 1);
            removed = true;
            break;
          }

          const col = Math.floor(x / CELL);
          const row = Math.floor(y / CELL);
          const ionHere = nextIons.find((ion) => !ion.collected && ion.col === col && ion.row === row);

          if (ionHere) {
            if (ionHere.role === "spectator") {
              nextRejectedId = ionHere.id;
              nextMessage = `${ionHere.label} is a spectator ion. It should cancel out.`;
              removed = true;
              break;
            }

            const nextReactiveIon = nextIons.find((ion) => ion.role === "reactive" && !ion.collected);
            if (!nextReactiveIon || ionHere.id !== nextReactiveIon.id) {
              nextRejectedId = ionHere.id;
              nextMessage = `Wrong order. Collect ${nextReactiveIon?.displayLabel ?? "the next ion"} first.`;
              removed = true;
              break;
            }

            ionHere.collected = true;
            ionsChanged = true;
            nextMessage = `Collected ${ionHere.displayLabel}.`;
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
      if (
        nextWaterLeft > 0 &&
        spawnCounterRef.current >= SPAWN_EVERY_TICKS &&
        nextDroplets.length < MAX_VISIBLE_DROPLETS
      ) {
        nextDroplets.push(createDroplet(layout, dropletIdRef.current++));
        nextWaterLeft -= 1;
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

      if (ionsChanged) {
        setIons(nextIons);
      }

      const allReactiveCollected = nextIons
        .filter((ion) => ion.role === "reactive")
        .every((ion) => ion.collected);

      if (ionsChanged && allReactiveCollected && nextTubFill < level.tubGoal) {
        setMsg("Net ionic path complete. Keep feeding the product tub.");
      }

      if (nextTubFill !== tubFillRef.current) {
        setTubFill(nextTubFill);
      }
      if (nextWaterLeft !== waterLeftRef.current) {
        setWaterLeft(nextWaterLeft);
      }

      setDroplets(nextDroplets);

      if (allReactiveCollected && nextTubFill >= level.tubGoal) {
        concludeRound(
          "win",
          `${level.productName} formed. Net ionic equation complete.`,
          nextIons,
          nextTubFill
        );
        return;
      }

      if (nextWaterLeft <= 0 && nextDroplets.length === 0) {
        const remainingReactive = nextIons.find((ion) => ion.role === "reactive" && !ion.collected);
        const reason = !allReactiveCollected && nextTubFill < level.tubGoal
          ? `You ran out of water before finishing the net ionic path and filling the tub. Next ion: ${remainingReactive?.displayLabel ?? "none"}.`
          : !allReactiveCollected
            ? `You ran out of water before collecting every reactive ion. Next ion: ${remainingReactive?.displayLabel ?? "none"}.`
            : `You built the net ionic path, but only ${nextTubFill}/${level.tubGoal} water reached the product tub.`;

        concludeRound("lose", reason, nextIons, nextTubFill);
      }
    }, TICK_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [concludeRound, flowing, layout, lost, won, level]);

  const tunnelMaskShapes = useMemo(() => {
    const isOpenCell = (col: number, row: number) => {
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
      return grid[ck(col, row)].kind !== "dirt";
    };

    return grid.flatMap((cell, index) => {
      if (cell.kind === "dirt") return [];

      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = col * CELL;
      const y = row * CELL;
      const seed = (col * 13 + row * 17) % 5;
      const padX = CELL * (0.16 + seed * 0.012);
      const padY = CELL * (0.16 + ((seed + 2) % 3) * 0.018);
      const shapes: TunnelMaskShape[] = [
        {
          key: `${index}-base`,
          x: x - padX,
          y: y - padY,
          width: CELL + padX * 2,
          height: CELL + padY * 2,
          rx: CELL * 0.34,
          ry: CELL * 0.34,
        },
      ];

      if (isOpenCell(col + 1, row)) {
        shapes.push({
          key: `${index}-right`,
          x: x + CELL * 0.34,
          y: y - CELL * 0.08,
          width: CELL * 0.52,
          height: CELL * 1.16,
          rx: CELL * 0.2,
          ry: CELL * 0.2,
        });
      }

      if (isOpenCell(col, row + 1)) {
        shapes.push({
          key: `${index}-down`,
          x: x - CELL * 0.08,
          y: y + CELL * 0.34,
          width: CELL * 1.16,
          height: CELL * 0.52,
          rx: CELL * 0.2,
          ry: CELL * 0.2,
        });
      }

      if (isOpenCell(col + 1, row + 1) && (isOpenCell(col + 1, row) || isOpenCell(col, row + 1))) {
        shapes.push({
          key: `${index}-corner`,
          x: x + CELL * 0.28,
          y: y + CELL * 0.28,
          width: CELL * 0.72,
          height: CELL * 0.72,
          rx: CELL * 0.26,
          ry: CELL * 0.26,
        });
      }

      return shapes;
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
  const boardAspectRatio = W / H;
  const boardWidth = `min(100%, 1080px, calc((100dvh - 240px) * ${boardAspectRatio}))`;
  const reactiveLabels = ions.filter((ion) => ion.role === "reactive").map((ion) => ion.displayLabel).join(" -> ");

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center bg-white px-3 py-4 text-slate-900 dark:bg-black dark:text-slate-100 sm:px-5">
        <div className="mb-2 text-center">
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">
            Where&apos;s My Water?: Net Ionic Equations
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Level {level.id}/5 - {level.productName}
          </p>
        </div>

        <div className="mb-1 max-w-5xl text-center text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xs">
          <div>{level.reactants}</div>
          <div>Net ionic target: {level.netIonic}</div>
        </div>

        <div className="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">
          <span>Collect {reactiveLabels}</span>
          <span>Avoid {level.spectators.join(", ")}</span>
          <span>Next {nextRequiredIon ? nextRequiredIon.displayLabel : won ? "Level clear" : "Fill tub"}</span>
          <span>Tub {Math.min(tubFill, level.tubGoal)}/{level.tubGoal}</span>
          <span>Water {waterLeft}</span>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {!flowing && !won && !lost && (
            <button
              onClick={() => {
                setFlowing(true);
                setMsg("Water released.");
              }}
              disabled={startDisabled}
              className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-rose-500 dark:hover:bg-rose-400"
            >
              Start Flow
            </button>
          )}
          <button
            onClick={resetAttempt}
            disabled={resetDisabled}
            className="rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-300"
          >
            Reset Level
          </button>
          <button
            onClick={undoLastDig}
            disabled={undoDisabled}
            className="rounded-2xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Undo Dig
          </button>
          {seenIntro && (
            <button
              onClick={() => {
                setIntroStep(0);
                setShowIntro(true);
              }}
              disabled={howToDisabled}
              className="rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              How to Play
            </button>
          )}
          {msg && (
            <span className={`max-w-md text-sm font-semibold ${msg.startsWith("Wrong") || msg.includes("spectator") ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
              {msg}
            </span>
          )}
        </div>

        <div className="mx-auto flex w-full justify-center">
          <div
            className="relative overflow-hidden rounded-2xl border-4 border-[#3f2e1a]"
            style={{
              width: boardWidth,
              maxWidth: "100%",
              maxHeight: "calc(100dvh - 240px)",
              aspectRatio: `${W} / ${H}`,
            }}
          >
            {showIntro && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-950/95 p-6 text-center text-white shadow-2xl">
                  <h3 className="text-2xl font-black">{INTRO_STEPS[introStep].title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{INTRO_STEPS[introStep].body}</p>
                  <p className="mt-2 text-xs italic text-slate-500">{INTRO_STEPS[introStep].sub}</p>

                  <div className="mt-5 flex justify-center gap-2">
                    {INTRO_STEPS.map((_, index) => (
                      <div key={index} className={`h-2 w-2 rounded-full ${index === introStep ? "bg-red-400" : "bg-slate-700"}`} />
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
                        className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-bold hover:bg-red-400"
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
                <linearGradient id="hardCaveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a0f13" />
                  <stop offset="100%" stopColor="#0d0608" />
                </linearGradient>
                <linearGradient id="hardDirtFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7b4336" />
                  <stop offset="100%" stopColor="#4c211c" />
                </linearGradient>
                <linearGradient id="hardTubWaterFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="hardGatorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>
                <linearGradient id="hardGatorBellyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bbf7d0" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <linearGradient id="hardGatorJawFill" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14532d" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="hardSoftShadow">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.35" />
                </filter>
                <pattern id="hardDirtTexture" width="88" height="88" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="14" r="4.4" fill="#5b241c" opacity="0.35" />
                  <circle cx="30" cy="28" r="3" fill="#a05a49" opacity="0.28" />
                  <circle cx="55" cy="18" r="2.6" fill="#3b1511" opacity="0.32" />
                  <circle cx="71" cy="35" r="4.8" fill="#7b3f35" opacity="0.22" />
                  <circle cx="16" cy="58" r="3.4" fill="#a56758" opacity="0.2" />
                  <circle cx="45" cy="63" r="4.1" fill="#3b1511" opacity="0.25" />
                  <circle cx="74" cy="69" r="2.8" fill="#b67867" opacity="0.24" />
                </pattern>
                <mask id="hardDirtMask">
                  <rect width={W} height={H} fill="white" />
                  {tunnelMaskShapes.map((shape) => (
                    <rect
                      key={shape.key}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      rx={shape.rx}
                      ry={shape.ry}
                      fill="black"
                    />
                  ))}
                </mask>
              </defs>

              <rect width={W} height={H} fill="url(#hardCaveFill)" />
              {Array.from({ length: 90 }, (_, index) => {
                const px = ((index * 137) % W) + 6;
                const py = ((index * 89) % H) + 8;
                const radius = 1.5 + ((index * 3) % 5);
                const opacity = 0.08 + ((index % 4) * 0.03);
                return <circle key={`cave-speck-${index}`} cx={px} cy={py} r={radius} fill="#e87979" opacity={opacity} />;
              })}

              <g mask="url(#hardDirtMask)">
                <rect width={W} height={H} fill="url(#hardDirtFill)" />
                <rect width={W} height={H} fill="url(#hardDirtTexture)" opacity={0.95} />
              </g>

              <rect
                x={tubX - 8}
                y={tubY - 10}
                width={tubW + 16}
                height={tubH + 18}
                rx={18}
                fill="#f8fafc"
                stroke="#94a3b8"
                strokeWidth={4}
              />
              <rect
                x={tubX + 2}
                y={tubY + 2}
                width={tubW - 4}
                height={tubH - 4}
                rx={12}
                fill="#fff7ed"
                stroke="#fed7aa"
                strokeWidth={1.5}
              />
              {tubRatio > 0 && (
                <rect
                  x={tubX + 2}
                  y={tubY + tubH - tubWaterHeight - 2}
                  width={tubW - 4}
                  height={tubWaterHeight}
                  rx={12}
                  fill="url(#hardTubWaterFill)"
                  opacity={0.92}
                />
              )}

              <g filter="url(#hardSoftShadow)">
                <g transform={`translate(${layout.gatorFacing === -1 ? tubX + tubW : tubX}, 0) scale(${layout.gatorFacing}, 1)`}>
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0; 0 -3; 0 0"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                    <path
                      d={`
                        M ${tubW * 0.18} ${tubY + tubH * 0.63}
                        C ${tubW * 0.1} ${tubY + tubH * 0.58}, ${tubW * 0.12} ${tubY + tubH * 0.42}, ${tubW * 0.24} ${tubY + tubH * 0.38}
                        C ${tubW * 0.36} ${tubY + tubH * 0.31}, ${tubW * 0.52} ${tubY + tubH * 0.28}, ${tubW * 0.68} ${tubY + tubH * 0.34}
                        C ${tubW * 0.8} ${tubY + tubH * 0.39}, ${tubW * 0.92} ${tubY + tubH * 0.48}, ${tubW * 0.9} ${tubY + tubH * 0.58}
                        C ${tubW * 0.88} ${tubY + tubH * 0.7}, ${tubW * 0.68} ${tubY + tubH * 0.77}, ${tubW * 0.45} ${tubY + tubH * 0.76}
                        C ${tubW * 0.29} ${tubY + tubH * 0.75}, ${tubW * 0.18} ${tubY + tubH * 0.71}, ${tubW * 0.18} ${tubY + tubH * 0.63}
                      `}
                      fill="url(#hardGatorFill)"
                    />
                    <path
                      d={`
                        M ${tubW * 0.26} ${tubY + tubH * 0.67}
                        C ${tubW * 0.36} ${tubY + tubH * 0.58}, ${tubW * 0.53} ${tubY + tubH * 0.56}, ${tubW * 0.71} ${tubY + tubH * 0.62}
                        C ${tubW * 0.6} ${tubY + tubH * 0.73}, ${tubW * 0.42} ${tubY + tubH * 0.76}, ${tubW * 0.26} ${tubY + tubH * 0.67}
                      `}
                      fill="url(#hardGatorBellyFill)"
                      opacity={0.95}
                    />
                    <path
                      d={`
                        M ${tubW * 0.58} ${tubY + tubH * 0.42}
                        C ${tubW * 0.73} ${tubY + tubH * 0.34}, ${tubW * 0.89} ${tubY + tubH * 0.36}, ${tubW * 0.98} ${tubY + tubH * 0.49}
                        C ${tubW * 0.93} ${tubY + tubH * 0.55}, ${tubW * 0.82} ${tubY + tubH * 0.56}, ${tubW * 0.69} ${tubY + tubH * 0.53}
                        C ${tubW * 0.63} ${tubY + tubH * 0.51}, ${tubW * 0.58} ${tubY + tubH * 0.48}, ${tubW * 0.58} ${tubY + tubH * 0.42}
                      `}
                      fill="url(#hardGatorJawFill)"
                    />
                    <path
                      d={`
                        M ${tubW * 0.59} ${tubY + tubH * 0.54}
                        C ${tubW * 0.73} ${tubY + tubH * 0.58}, ${tubW * 0.89} ${tubY + tubH * 0.6}, ${tubW * 0.97} ${tubY + tubH * 0.69}
                        C ${tubW * 0.86} ${tubY + tubH * 0.76}, ${tubW * 0.7} ${tubY + tubH * 0.73}, ${tubW * 0.61} ${tubY + tubH * 0.65}
                        C ${tubW * 0.58} ${tubY + tubH * 0.61}, ${tubW * 0.57} ${tubY + tubH * 0.58}, ${tubW * 0.59} ${tubY + tubH * 0.54}
                      `}
                      fill="#22c55e"
                    />
                    <path
                      d={`M ${tubW * 0.62} ${tubY + tubH * 0.56} C ${tubW * 0.77} ${tubY + tubH * 0.55}, ${tubW * 0.88} ${tubY + tubH * 0.58}, ${tubW * 0.96} ${tubY + tubH * 0.62}`}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${tubW * 0.54} ${tubY + tubH * 0.39} C ${tubW * 0.61} ${tubY + tubH * 0.3}, ${tubW * 0.7} ${tubY + tubH * 0.29}, ${tubW * 0.78} ${tubY + tubH * 0.34}`}
                      fill="none"
                      stroke="#14532d"
                      strokeWidth={7}
                      strokeLinecap="round"
                    />
                    <ellipse cx={tubW * 0.67} cy={tubY + tubH * 0.39} rx={8.5} ry={6.5} fill="#ecfccb">
                      <animate attributeName="ry" values="6.5;6.5;6.5;1.1;6.5;6.5" dur="4s" repeatCount="indefinite" />
                    </ellipse>
                    <circle cx={tubW * 0.675} cy={tubY + tubH * 0.392} r={3.1} fill="#14532d" />
                    <circle cx={tubW * 0.679} cy={tubY + tubH * 0.388} r={1.1} fill="white" opacity={0.9} />
                    {[0, 1, 2, 3].map((tooth) => (
                      <polygon
                        key={`hard-top-tooth-${tooth}`}
                        points={`${tubW * (0.71 + tooth * 0.055)},${tubY + tubH * 0.57} ${tubW * (0.725 + tooth * 0.055)},${tubY + tubH * 0.65} ${tubW * (0.74 + tooth * 0.055)},${tubY + tubH * 0.57}`}
                        fill="white"
                      />
                    ))}
                    {[0, 1, 2].map((tooth) => (
                      <polygon
                        key={`hard-bottom-tooth-${tooth}`}
                        points={`${tubW * (0.74 + tooth * 0.06)},${tubY + tubH * 0.61} ${tubW * (0.755 + tooth * 0.06)},${tubY + tubH * 0.53} ${tubW * (0.77 + tooth * 0.06)},${tubY + tubH * 0.61}`}
                        fill="#f8fafc"
                      />
                    ))}
                  </g>
                  {Array.from({ length: 3 }, (_, bubble) => (
                    <circle
                      key={`hard-bubble-${bubble}`}
                      cx={tubW * (0.28 + bubble * 0.12)}
                      cy={tubY + tubH * 0.8}
                      r={4 - bubble * 0.6}
                      fill="#fef3c7"
                      opacity={0.75}
                    >
                      <animate attributeName="cy" values={`${tubY + tubH * 0.82};${tubY + tubH * (0.56 - bubble * 0.04)};${tubY + tubH * 0.82}`} dur={`${2 + bubble * 0.4}s`} begin={`${bubble * 0.35}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + bubble * 0.4}s`} begin={`${bubble * 0.35}s`} repeatCount="indefinite" />
                    </circle>
                  ))}
                </g>
                <text x={tubX + tubW / 2} y={tubY + tubH - 20} textAnchor="middle" fontSize={18} fontWeight={900} fill="#0f172a">
                  {level.productFormula}
                </text>
                <text x={tubX + tubW / 2} y={tubY + tubH - 2} textAnchor="middle" fontSize={12} fontWeight={800} fill="#334155">
                  {level.productName}
                </text>
              </g>

              <g filter="url(#hardSoftShadow)">
                <rect
                  x={layout.sourceCol * CELL + 8}
                  y={layout.sourceRow * CELL}
                  width={CELL - 16}
                  height={CELL + 8}
                  rx={10}
                  fill="#7f1d1d"
                />
                <rect
                  x={layout.sourceCol * CELL + 13}
                  y={layout.sourceRow * CELL + 4}
                  width={CELL - 26}
                  height={CELL + 2}
                  rx={8}
                  fill="#450a0a"
                />
                <circle
                  cx={(layout.sourceCol + 0.5) * CELL}
                  cy={(layout.sourceRow + 0.56) * CELL}
                  r={13}
                  fill="#fb7185"
                >
                  {flowing && waterLeft > 0 && (
                    <animate attributeName="r" values="11;14;11" dur="1.6s" repeatCount="indefinite" />
                  )}
                </circle>
                <text
                  x={(layout.sourceCol + 0.5) * CELL}
                  y={(layout.sourceRow + 0.72) * CELL}
                  textAnchor="middle"
                  fontSize={7}
                  fontWeight={900}
                  fill="#fff1f2"
                >
                  MIX
                </text>
              </g>

              {droplets.map((droplet) => (
                <g key={droplet.id}>
                  <ellipse
                    cx={droplet.x}
                    cy={droplet.y}
                    rx={DROPLET_RADIUS}
                    ry={DROPLET_RADIUS + 1.8}
                    fill="#fbbf24"
                    opacity={0.95}
                  />
                  <circle cx={droplet.x - 2} cy={droplet.y - 3} r={2.2} fill="white" opacity={0.4} />
                </g>
              ))}

              {ions.map((ion) => {
                const x = ion.col * CELL;
                const y = ion.row * CELL;
                const centerX = x + CELL / 2;
                const centerY = y + CELL / 2;
                const activeFill = ion.collected ? "#6ee7b7" : rejId === ion.id ? "#ef4444" : ion.color;
                const stroke = ion.role === "reactive" ? "#7c2d12" : "#4c1d95";
                const opacity = ion.collected ? 0.38 : 1;

                return (
                  <g key={ion.id} opacity={opacity} filter="url(#hardSoftShadow)">
                    {!ion.collected && (
                      <circle cx={centerX} cy={centerY + 6} r={22} fill={ion.color} opacity={0.14} />
                    )}
                    <circle cx={centerX} cy={centerY} r={18} fill={activeFill} stroke={stroke} strokeWidth={2} />
                    <circle cx={centerX - 6} cy={centerY - 6} r={5.2} fill="white" opacity={0.28} />
                    <rect
                      x={centerX - 24}
                      y={centerY + 18}
                      width={48}
                      height={14}
                      rx={5}
                      fill={ion.role === "reactive" ? "#7c2d12" : "#4c1d95"}
                      opacity={0.96}
                    />
                    <text
                      x={centerX}
                      y={centerY + 28}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight={900}
                      fill="white"
                      fontFamily="'Courier New', monospace"
                    >
                      {ion.displayLabel}
                    </text>
                    <text
                      x={centerX}
                      y={centerY + 4}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight={900}
                      fill="#0f172a"
                      fontFamily="'Courier New', monospace"
                    >
                      {ion.label}
                    </text>
                    {!ion.collected && (
                      <text
                        x={centerX}
                        y={centerY - 21}
                        textAnchor="middle"
                        fontSize={8}
                        fontWeight={900}
                        fill={ion.role === "reactive" ? "#f97316" : "#a855f7"}
                      >
                        {ion.role === "reactive" ? "react" : "spectator"}
                      </text>
                    )}
                    {ion.collected && (
                      <text x={centerX + 1} y={centerY + 5} textAnchor="middle" fontSize={18} fill="#16a34a" fontWeight={900}>
                        OK
                      </text>
                    )}
                    {rejId === ion.id && (
                      <text x={centerX + 1} y={centerY + 5} textAnchor="middle" fontSize={18} fill="#ef4444" fontWeight={900}>
                        X
                      </text>
                    )}
                  </g>
                );
              })}

              {won &&
                Array.from({ length: 14 }, (_, index) => (
                  <circle
                    key={`hard-celebrate-${index}`}
                    cx={tubX + 22 + (index % 7) * (tubW / 7)}
                    cy={tubY - 8}
                    r={5}
                    fill={["#fbbf24", "#fb7185", "#60a5fa", "#34d399", "#c084fc"][index % 5]}
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
      </div>

      {resultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {resultModal.title}
            </h2>
            <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">{resultModal.body}</p>
            {resultModal.type === "final" && (
              <p className="mt-3 text-base text-slate-700 dark:text-slate-300">
                Final reward: <span className="font-bold">{rewardAmt}</span> glucose.
              </p>
            )}
            <div className="mt-4 text-sm">
              {resultModal.type === "final" && rewardStatus === "loading" && (
                <p className="text-slate-600 dark:text-slate-300">Updating glucose...</p>
              )}
              {resultModal.type === "final" && rewardStatus === "ok" && (
                <p className="text-emerald-700 dark:text-emerald-300">{rewardMsg}</p>
              )}
              {resultModal.type === "final" && rewardStatus === "error" && (
                <p className="text-red-700 dark:text-red-300">{rewardMsg}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  const modalType = resultModal.type;
                  setResultModal(null);
                  if (modalType === "next") {
                    setLvIdx((current) => current + 1);
                  } else if (modalType === "lose") {
                    resetAttempt();
                  } else {
                    setLvIdx(0);
                  }
                }}
                className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 dark:bg-rose-500 dark:hover:bg-rose-400"
              >
                {resultModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
