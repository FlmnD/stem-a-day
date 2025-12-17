"use client";

import { useEffect, useRef, useState } from "react";

/* =======================
   TYPES
======================= */
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Cell = { x: number; y: number };
type Compound = { name: string; formula: string };

/* =======================
   CONSTANTS
======================= */
const GRID_SIZE = 20;
const CELL_SIZE = 30;
const START_LENGTH = 5;
const TICK_RATE = 600;
const APPLE_SIZE = 2;

/* =======================
   CHEMISTRY DATA
======================= */
const COMPOUNDS: Compound[] = [
  { formula: "NaCl", name: "sodium chloride" },
  { formula: "K2O", name: "potassium oxide" },
  { formula: "MgSe", name: "magnesium selenide" },
  { formula: "CaCl2", name: "calcium chloride" },
  { formula: "Al2O3", name: "aluminum oxide" },
  { formula: "FeO", name: "iron(II) oxide" },
  { formula: "Fe2O3", name: "iron(III) oxide" },
  { formula: "CuCl", name: "copper(I) chloride" },
  { formula: "CuCl2", name: "copper(II) chloride" },
  { formula: "Ca(OH)2", name: "calcium hydroxide" },
  { formula: "(NH4)2SO4", name: "ammonium sulfate" },
  { formula: "NaHCO3", name: "sodium hydrogen carbonate" },
  { formula: "K2Cr2O7", name: "potassium dichromate" },
  { formula: "CO", name: "carbon monoxide" },
  { formula: "CO2", name: "carbon dioxide" },
  { formula: "N2O", name: "dinitrogen monoxide" },
  { formula: "N2O3", name: "dinitrogen trioxide" },
  { formula: "PCl5", name: "phosphorus pentachloride" },
  { formula: "SF6", name: "sulfur hexafluoride" },
  { formula: "Cl2O7", name: "dichlorine heptoxide" },
  { formula: "P4O6", name: "tetraphosphorus hexoxide" },
  { formula: "CCl4", name: "carbon tetrachloride" },
  { formula: "HCl", name: "hydrochloric acid" },
  { formula: "HBr", name: "hydrobromic acid" },
  { formula: "HI", name: "hydroiodic acid" },
  { formula: "H2S", name: "hydrosulfuric acid" },
  { formula: "H2SO4", name: "sulfuric acid" },
  { formula: "H2SO3", name: "sulfurous acid" },
  { formula: "HNO3", name: "nitric acid" },
  { formula: "HNO2", name: "nitrous acid" },
  { formula: "H3PO4", name: "phosphoric acid" },
  { formula: "HC2H3O2", name: "acetic acid" },
  { formula: "CH4", name: "methane" },
  { formula: "C2H6", name: "ethane" },
  { formula: "C3H8", name: "propane" },
  { formula: "C4H10", name: "butane" },
  { formula: "C6H12O6", name: "glucose" },
  { formula: "C2H5OH", name: "ethanol" },
];

/* =======================
   HELPERS
======================= */
function randomCell(): Cell {
  return {
    x: Math.floor(Math.random() * (GRID_SIZE - APPLE_SIZE)),
    y: Math.floor(Math.random() * (GRID_SIZE - APPLE_SIZE)),
  };
}

function renderFormula(formula: string) {
  return formula.split("").map((c, i) =>
    /\d/.test(c) ? (
      <sub key={i} style={{ fontSize: "0.6em" }}>
        {c}
      </sub>
    ) : (
      <span key={i}>{c}</span>
    )
  );
}

/* =======================
   PAGE
======================= */
export default function SnakeEasyPage() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [snake, setSnake] = useState<Cell[]>([]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const directionRef = useRef(direction);

  const [choices, setChoices] = useState<Compound[]>([]);
  const [apples, setApples] = useState<Cell[]>([]);
  const [target, setTarget] = useState<Compound | null>(null);

  function resetGame() {
    setSnake(
      Array.from({ length: START_LENGTH }, (_, i) => ({
        x: 10 - i,
        y: 10,
      }))
    );
    setDirection("RIGHT");
    setStarted(true);
    setGameOver(false);
    spawnApples();
  }

  function spawnApples() {
    const picks = [...COMPOUNDS].sort(() => 0.5 - Math.random()).slice(0, 3);
    setChoices(picks);
    setTarget(picks[Math.floor(Math.random() * picks.length)]);
    setApples(picks.map(() => randomCell()));
  }

  /* Keyboard */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " && (!started || gameOver)) {
        resetGame();
        return;
      }
      if (!started || gameOver) return;

      const d = directionRef.current;
      if (e.key === "ArrowUp" && d !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && d !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && d !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && d !== "LEFT") setDirection("RIGHT");
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, gameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  /* Game Loop */
  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const next = { ...head };

        if (directionRef.current === "UP") next.y--;
        if (directionRef.current === "DOWN") next.y++;
        if (directionRef.current === "LEFT") next.x--;
        if (directionRef.current === "RIGHT") next.x++;

        if (
          next.x < 0 ||
          next.y < 0 ||
          next.x >= GRID_SIZE ||
          next.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        let newLength = prev.length;

        apples.forEach((a, i) => {
          if (
            next.x >= a.x &&
            next.x < a.x + APPLE_SIZE &&
            next.y >= a.y &&
            next.y < a.y + APPLE_SIZE
          ) {
            newLength += choices[i].name === target?.name ? 2 : -1;
            spawnApples();
          }
        });

        if (newLength < 3) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [next, ...prev].slice(0, newLength);
        return newSnake;
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [started, gameOver, apples, choices, target]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 12,
      }}
    >
      <h1>Nomenclature Snake</h1>
      <p>
        <b>Snake Length:</b> {snake.length}
      </p>
      <p>Find: {target?.name}</p>
      <p>
        Press <b>SPACE</b> or <b>click the board</b> to{" "}
        {!started ? "start" : "restart"}
      </p>

      <div
        onClick={() => (!started || gameOver) && resetGame()}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          border: "3px solid white",
          cursor: "pointer",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);

          const snakeHere = snake.some((s) => s.x === x && s.y === y);
          const appleIndex = apples.findIndex(
            (a) =>
              x >= a.x &&
              x < a.x + APPLE_SIZE &&
              y >= a.y &&
              y < a.y + APPLE_SIZE
          );

          return (
            <div
              key={i}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: snakeHere
                  ? "#22c55e"
                  : appleIndex !== -1
                  ? "#dc2626"
                  : "#020617",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {appleIndex !== -1 &&
                x === apples[appleIndex].x &&
                y === apples[appleIndex].y &&
                renderFormula(choices[appleIndex].formula)}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <button
          onClick={resetGame}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
