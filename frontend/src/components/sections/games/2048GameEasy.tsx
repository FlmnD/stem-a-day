'use client';
import { useEffect, useState } from "react";

type TileKind =
  | "M1"
  | "V1"
  | "M1V1"
  | "M2"
  | "V2"
  | "M2V2"
  | "EQUAL";

interface Tile {
  id: number;
  kind: TileKind;
  value: number;
  leftValue?: number;
  rightValue?: number;
}

type Direction = "left" | "right" | "up" | "down";

const SIZE = 4;
let idCounter = 0;

const COLORS: Record<TileKind, string> = {
  M1: "bg-blue-500",
  V1: "bg-blue-500",
  M1V1: "bg-orange-500",
  M2: "bg-green-500",
  V2: "bg-green-500",
  M2V2: "bg-orange-500",
  EQUAL: "bg-red-500",
};

const SPAWNABLE: TileKind[] = ["M1", "V1", "M2", "V2"];
const VALUES = [1, 2, 3, 4];

const emptyGrid = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

export default function Game2048Easy() {
  const [grid, setGrid] = useState<(Tile | null)[][]>(emptyGrid);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [inputLocked, setInputLocked] = useState(false);

  function resetGame() {
    let g = emptyGrid();
    g = spawnTile(g, "right");
    g = spawnTile(g, "right");
    setGrid(g);
    setStarted(true);
    setGameOver(false);
    setWin(false);
    setInputLocked(false);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === "Space") {
        resetGame();
        return;
      }

      if (!started || gameOver || win || inputLocked) return;

      let dir: Direction | null = null;
      if (e.code === "ArrowLeft") dir = "left";
      if (e.code === "ArrowRight") dir = "right";
      if (e.code === "ArrowUp") dir = "up";
      if (e.code === "ArrowDown") dir = "down";
      if (!dir) return;

      const moved = moveGrid(grid, dir);
      if (moved.changed) {
        const next = spawnTile(moved.grid, dir);
        setGrid(next);
        setInputLocked(true);
      }
    }

    function handleKeyUp() {
      setInputLocked(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [grid, started, gameOver, win, inputLocked]);

  function moveGrid(g: (Tile | null)[][], dir: Direction) {
    let changed = false;
    let newGrid = emptyGrid();

    const traverse = (i: number, j: number): [number, number] => {
      if (dir === "left") return [i, j];
      if (dir === "right") return [i, SIZE - 1 - j];
      if (dir === "up") return [j, i];
      return [SIZE - 1 - j, i];
    };

    for (let i = 0; i < SIZE; i++) {
      let buffer: Tile[] = [];

      for (let j = 0; j < SIZE; j++) {
        const [r, c] = traverse(i, j);
        const tile = g[r][c];
        if (tile) buffer.push(tile);
      }

      let merged: Tile[] = [];
      for (let k = 0; k < buffer.length; k++) {
        const a = buffer[k];
        const b = buffer[k + 1];

        if (b && canMerge(a, b)) {
          const result = mergeTiles(a, b);
          if (result) {
            merged.push(result);
            k++;
            changed = true;
            continue;
          }
        }
        merged.push(a);
      }

      for (let j = 0; j < SIZE; j++) {
        const [r, c] = traverse(i, j);
        newGrid[r][c] = merged[j] || null;
        if (newGrid[r][c] !== g[r][c]) changed = true;
      }
    }

    return { grid: newGrid, changed };
  }

  function canMerge(a: Tile, b: Tile) {
    if (a.kind === b.kind) return true;
    if (a.kind === "M1" && b.kind === "V1") return true;
    if (a.kind === "V1" && b.kind === "M1") return true;
    if (a.kind === "M2" && b.kind === "V2") return true;
    if (a.kind === "V2" && b.kind === "M2") return true;
    if (a.kind === "M1V1" && (b.kind === "M1" || b.kind === "V1")) return true;
    if (b.kind === "M1V1" && (a.kind === "M1" || a.kind === "V1")) return true;
    if (a.kind === "M2V2" && (b.kind === "M2" || b.kind === "V2")) return true;
    if (b.kind === "M2V2" && (a.kind === "M2" || a.kind === "V2")) return true;
    if ((a.kind === "M1V1" && b.kind === "M2V2") || (a.kind === "M2V2" && b.kind === "M1V1")) return true;
    return false;
  }

  function mergeTiles(a: Tile, b: Tile): Tile | null {
    if (a.kind === b.kind) {
      return { id: idCounter++, kind: a.kind, value: a.value * b.value };
    }

    if ((a.kind === "M1" && b.kind === "V1") || (a.kind === "V1" && b.kind === "M1")) {
      return { id: idCounter++, kind: "M1V1", value: a.value * b.value };
    }

    if ((a.kind === "M2" && b.kind === "V2") || (a.kind === "V2" && b.kind === "M2")) {
      return { id: idCounter++, kind: "M2V2", value: a.value * b.value };
    }

    if (a.kind === "M1V1" && (b.kind === "M1" || b.kind === "V1")) {
      return { id: idCounter++, kind: "M1V1", value: a.value * b.value };
    }

    if (b.kind === "M1V1" && (a.kind === "M1" || a.kind === "V1")) {
      return { id: idCounter++, kind: "M1V1", value: a.value * b.value };
    }

    if (a.kind === "M2V2" && (b.kind === "M2" || b.kind === "V2")) {
      return { id: idCounter++, kind: "M2V2", value: a.value * b.value };
    }

    if (b.kind === "M2V2" && (a.kind === "M2" || a.kind === "V2")) {
      return { id: idCounter++, kind: "M2V2", value: a.value * b.value };
    }

    if ((a.kind === "M1V1" && b.kind === "M2V2") || (a.kind === "M2V2" && b.kind === "M1V1")) {
      const left = a.kind === "M1V1" ? a.value : b.value;
      const right = a.kind === "M2V2" ? a.value : b.value;

      if (left === right) setWin(true);
      else setGameOver(true);

      return {
        id: idCounter++,
        kind: "EQUAL",
        value: left,
        leftValue: left,
        rightValue: right,
      };
    }

    return null;
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

    copy[r][c] = {
      id: idCounter++,
      kind: SPAWNABLE[Math.floor(Math.random() * SPAWNABLE.length)],
      value: VALUES[Math.floor(Math.random() * VALUES.length)],
    };

    return copy;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">2048 Molarity</h1>

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
                    {cell.leftValue} M1V1 {cell.leftValue === cell.rightValue ? "=" : "!="} {cell.rightValue} M2V2
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
