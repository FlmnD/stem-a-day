'use client';
import { useEffect, useState } from "react";

type TileKind =
  | "P" | "V"
  | "n" | "T" | "R"
  | "PV"
  | "nR" | "nT" | "RT"
  | "nRT"
  | "EQUAL";

interface Tile {
  id: number;
  kind: TileKind;
  value: number;
  left?: number;
  right?: number;
}

const SIZE = 4;
let idCounter = 0;

const COLORS: Record<TileKind, string> = {
  P: "bg-blue-500",
  V: "bg-blue-500",
  n: "bg-green-500",
  T: "bg-green-500",
  R: "bg-green-500",
  PV: "bg-orange-500",
  nR: "bg-orange-500",
  nT: "bg-orange-500",
  RT: "bg-orange-500",
  nRT: "bg-orange-500",
  EQUAL: "bg-red-500",
};

const SPAWNABLE: TileKind[] = ["P", "V", "n", "T", "R"];

const VALUES: Record<TileKind, number[]> = {
  P: [1, 2, 5],
  V: [2, 5, 10],
  n: [1, 2, 5],
  T: [100, 200, 500],
  R: [0.1],
  PV: [],
  nR: [],
  nT: [],
  RT: [],
  nRT: [],
  EQUAL: [],
};

const emptyGrid = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

const round6 = (n: number) => Number(n.toPrecision(6));

export default function Game2048GasLaws() {
  const [grid, setGrid] = useState<(Tile | null)[][]>(emptyGrid);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [pending, setPending] = useState<{ left: number; right: number } | null>(null);
  const [keyLocked, setKeyLocked] = useState(false);

  function startGame() {
    let g = emptyGrid();
    g = spawnTile(g, "right");
    g = spawnTile(g, "right");
    setGrid(g);
    setStarted(true);
    setGameOver(false);
    setWin(false);
    setPending(null);
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (pending) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (keyLocked || !started || gameOver || win) return;
        setKeyLocked(true);
        const dir = e.key.replace("Arrow", "").toLowerCase() as Direction;
        const moved = moveGrid(grid, dir);
        if (moved.changed) setGrid(spawnTile(moved.grid, dir));
      }

      if (e.code === "Space") startGame();
    };

    const up = () => setKeyLocked(false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [grid, keyLocked, started, gameOver, win]);

  type Direction = "left" | "right" | "up" | "down";

  function moveGrid(g: (Tile | null)[][], dir: Direction) {
    let changed = false;
    let newGrid = emptyGrid();

    const map = (i: number, j: number): [number, number] => {
      if (dir === "left") return [i, j];
      if (dir === "right") return [i, SIZE - 1 - j];
      if (dir === "up") return [j, i];
      return [SIZE - 1 - j, i];
    };

    for (let i = 0; i < SIZE; i++) {
      let buffer: Tile[] = [];

      for (let j = 0; j < SIZE; j++) {
        const [r, c] = map(i, j);
        const t = g[r][c];
        if (t) buffer.push({ ...t });
      }

      let merged: Tile[] = [];
      for (let k = 0; k < buffer.length; k++) {
        const a = buffer[k];
        const b = buffer[k + 1];

        if (b && canMerge(a, b)) {
          merged.push(merge(a, b));
          k++;
          changed = true;
        } else {
          merged.push(a);
        }
      }

      for (let j = 0; j < SIZE; j++) {
        const [r, c] = map(i, j);
        newGrid[r][c] = merged[j] || null;
        if (g[r][c] !== newGrid[r][c]) changed = true;
      }
    }

    return { grid: newGrid, changed };
  }
  const hasP = (k: TileKind) => k === "P" || k === "PV";
  const hasV = (k: TileKind) => k === "V" || k === "PV";

  const hasN = (k: TileKind) => ["n", "nR", "nT", "nRT"].includes(k);
  const hasR = (k: TileKind) => ["R", "nR", "RT", "nRT"].includes(k);
  const hasT = (k: TileKind) => ["T", "nT", "RT", "nRT"].includes(k);

  const countVars = (k: TileKind) =>
    (hasN(k) ? 1 : 0) + (hasR(k) ? 1 : 0) + (hasT(k) ? 1 : 0);

  function canMerge(a: Tile, b: Tile) {
    if (a.kind === b.kind) return true;
    if (
      (a.kind === "P" || a.kind === "V" || a.kind === "PV") &&
      (b.kind === "P" || b.kind === "V" || b.kind === "PV")
    ) return true;
    if (["n", "R", "T", "nR", "nT", "RT", "nRT"].includes(a.kind) &&
        ["n", "R", "T", "nR", "nT", "RT", "nRT"].includes(b.kind))
      return true;
    if (
      (a.kind === "PV" && b.kind === "nRT") ||
      (a.kind === "nRT" && b.kind === "PV")
    ) return true;
    return false;
  }

  function merge(a: Tile, b: Tile): Tile {
    //if (a.kind === "R" && b.kind === "R") {
    //  return { id: idCounter++, kind: "R", value: 0.1 };
    //}

    // SAME VARIABLE MERGES (n+n, T+T, R+R, etc.)
    if (a.kind === b.kind && a.kind !== "PV" && a.kind !== "nRT") {
      return {
        id: idCounter++,
        kind: a.kind,
        value:
          round6(a.value * b.value),
      };
    }

    if (
      ["n", "R", "T", "nR", "nT", "RT", "nRT"].includes(a.kind) &&
      ["n", "R", "T", "nR", "nT", "RT", "nRT"].includes(b.kind)
    ) {
      const vars = {
        n: hasN(a.kind) || hasN(b.kind),
        R: hasR(a.kind) || hasR(b.kind),
        T: hasT(a.kind) || hasT(b.kind),
      };

      let value = a.value;

      //if (a.kind !== "R" && b.kind !== "R") {
      value = round6(a.value * b.value);
      //}

      if (vars.n && vars.R && vars.T)
        return { id: idCounter++, kind: "nRT", value };

      if (vars.n && vars.R)
        return { id: idCounter++, kind: "nR", value };

      if (vars.n && vars.T)
        return { id: idCounter++, kind: "nT", value };

      if (vars.R && vars.T)
        return { id: idCounter++, kind: "RT", value };
    }

    if (
      (hasP(a.kind) && hasV(b.kind)) ||
      (hasV(a.kind) && hasP(b.kind))
    ) {
      return {
        id: idCounter++,
        kind: "PV",
        value: round6(a.value * b.value),
      };
    }

    //ERROR: T + T --> nRT, n + n --> nRT, R + R --> nRT
    /*if (
      (hasN(a.kind) || hasR(a.kind) || hasT(a.kind)) &&
      (hasN(b.kind) || hasR(b.kind) || hasT(b.kind))
    ) {
      let value = a.value;

      //if (a.kind !== "R" && b.kind !== "R") {
      value = round6(a.value * b.value);
      //}

      return {
        id: idCounter++,
        kind: "nRT",
        value,
      };
    }*/

    const val = round6(a.value * b.value);

    if (a.kind === b.kind) return { id: idCounter++, kind: a.kind, value: val };

    if ((a.kind === "P" && b.kind === "V") || (a.kind === "V" && b.kind === "P"))
      return { id: idCounter++, kind: "PV", value: val };

    const pair = new Set([a.kind, b.kind]);

    if (pair.has("n") && pair.has("R")) return { id: idCounter++, kind: "nR", value: val };
    if (pair.has("n") && pair.has("T")) return { id: idCounter++, kind: "nT", value: val };
    if (pair.has("R") && pair.has("T")) return { id: idCounter++, kind: "RT", value: val };

    if (["nR", "nT", "RT"].includes(a.kind) || ["nR", "nT", "RT"].includes(b.kind))
      return { id: idCounter++, kind: "nRT", value: val };

    if ((a.kind === "PV" && b.kind === "nRT") || (a.kind === "nRT" && b.kind === "PV")) {
      setPending({ left: a.value, right: b.value });
      return {
        id: idCounter++,
        kind: "EQUAL",
        value: a.value,
        left: a.value,
        right: b.value,
      };
    }

    return a;
  }

  function spawnTile(g: (Tile | null)[][], dir: Direction) {
    const copy = g.map(r => r.slice());
    const spots: { r: number; c: number }[] = [];

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const edge =
          (dir === "left" && j === SIZE - 1) ||
          (dir === "right" && j === 0) ||
          (dir === "up" && i === SIZE - 1) ||
          (dir === "down" && i === 0);
        if (edge && !copy[i][j]) spots.push({ r: i, c: j });
      }
    }

    if (!spots.length) return copy;
    const { r, c } = spots[Math.floor(Math.random() * spots.length)];
    const kind = SPAWNABLE[Math.floor(Math.random() * SPAWNABLE.length)];
    const value = VALUES[kind][Math.floor(Math.random() * VALUES[kind].length)];
    copy[r][c] = { id: idCounter++, kind, value };
    return copy;
  }

  useEffect(() => {
    if (!pending) return;
    
    const timeout = setTimeout(() => {
      const left = Math.round(pending.left);
      const right = Math.round(pending.right);
      setKeyLocked(true);
      if (left === right) {
        setWin(true);
      } else {
        setGameOver(true);
      }

      setPending(null);
    }, 700);

    return () => clearTimeout(timeout);
  }, [pending]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">2048 Gas Laws</h1>

      <p className="text-gray-600 font-semibold">
        Press <span className="font-bold">SPACE</span> to restart
      </p>

      {gameOver && <p className="text-red-600 font-bold">Game Over</p>}
      {win && <p className="text-green-600 font-bold">You Win</p>}

      <div className="grid grid-cols-4 gap-2 bg-gray-300 p-2 rounded">
        {grid.flat().map((cell, i) => (
          <div
            key={i}
            className={`w-20 h-20 flex items-center justify-center rounded text-white font-bold ${
              cell ? COLORS[cell.kind] : "bg-gray-100"
            }`}
          >
            {cell && (
              <div className="text-center text-sm">
                {cell.kind === "EQUAL" ? (
                  <div className="text-xs leading-tight">
                    {Math.round(cell.left!)} PV{" "}
                    {Math.round(cell.left!) === Math.round(cell.right!) ? "=" : "!="}{" "}
                    {Math.round(cell.right!)} nRT
                  </div>
                ) : (
                  <>
                    <div>{cell.kind}</div>
                    <div>{cell.value}</div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
