'use client'
import React, { useState, useEffect, useRef } from "react";

const COMPOUNDS = [ 
    { formula: "NaCl", name: "sodium chloride" }, 
    { formula: "K₂O", name: "potassium oxide" }, 
    { formula: "MgSe", name: "magnesium selenide" }, 
    { formula: "CaCl₂", name: "calcium chloride" }, 
    { formula: "Al₂O₃", name: "aluminum oxide" }, 
    { formula: "FeO", name: "iron(II) oxide" }, 
    { formula: "Fe₂O₃", name: "iron(III) oxide (also ferric oxide)" }, 
    { formula: "CuCl", name: "copper(I) chloride" }, 
    { formula: "CuCl₂", name: "copper(II) chloride" }, 
    { formula: "Ca(OH)₂", name: "calcium hydroxide" }, 
    { formula: "(NH₄)₂SO₄", name: "ammonium sulfate" }, 
    { formula: "NaHCO₃", name: "sodium hydrogen carbonate (or sodium bicarbonate)" }, 
    { formula: "K₂Cr₂O₇", name: "potassium dichromate" }, 
    { formula: "CO", name: "carbon monoxide" }, 
    { formula: "CO₂", name: "carbon dioxide" }, 
    { formula: "N₂O", name: "dinitrogen monoxide" }, 
    { formula: "N₂O₃", name: "dinitrogen trioxide" }, 
    { formula: "PCl₅", name: "phosphorus pentachloride" }, 
    { formula: "SF₆", name: "sulfur hexafluoride" }, 
    { formula: "Cl₂O₇", name: "dichlorine heptoxide" }, 
    { formula: "P₄O₆", name: "tetraphosphorus hexoxide" }, 
    { formula: "CCl₄", name: "carbon tetrachloride" },
    { formula: "HCl(aq)", name: "hydrochloric acid" }, 
    { formula: "HBr(aq)", name: "hydrobromic acid" }, 
    { formula: "HI(aq)", name: "hydroiodic acid" }, 
    { formula: "H₂S(aq)", name: "hydrosulfuric acid" }, 
    { formula: "H₂SO₄", name: "sulfuric acid" }, 
    { formula: "H₂SO₃", name: "sulfurous acid" }, 
    { formula: "HNO₃", name: "nitric acid" }, 
    { formula: "HNO₂", name: "nitrous acid" }, 
    { formula: "H₃PO₄", name: "phosphoric acid" }, 
    { formula: "HC₂H₃O₂", name: "acetic acid" }, 
    { formula: "CH₄", name: "methane" }, 
    { formula: "C₂H₆", name: "ethane" }, 
    { formula: "C₃H₈", name: "propane" }, 
    { formula: "C₄H₁₀", name: "butane" }, 
    { formula: "C₆H₁₂O₆", name: "glucose" }, 
    { formula: "C₂H₅OH", name: "ethanol (ethyl alcohol)" }, 
];

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_LENGTH = 5;
const WIN_LENGTH = 15;
const MIN_LENGTH = 3;
const MIN_APPLES = 5;

interface Apple {
  x: number;
  y: number;
  size: number;
  compound: typeof COMPOUNDS[0];
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([]);
  const [dir, setDir] = useState({ x: 0, y: 0 });
  const [apples, setApples] = useState<Apple[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState<typeof COMPOUNDS[0] | null>(null);
  const [running, setRunning] = useState(false);
  const [snakeLength, setSnakeLength] = useState(INITIAL_LENGTH);
  const [msg, setMsg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const randPos = (size = 2) => ({
    x: Math.floor(Math.random() * (GRID_SIZE - size)),
    y: Math.floor(Math.random() * (GRID_SIZE - size)),
  });

  const unusedCompound = () => {
    const left = COMPOUNDS.filter(c => !used.has(c.formula));
    return left.length ? left[Math.floor(Math.random() * left.length)] : null;
  };

  const ensurePromptApple = (compound: typeof COMPOUNDS[0]) => {
    setApples(prev => {
      if (prev.some(a => a.compound.formula === compound.formula)) return prev;
      return [...prev, { ...randPos(), size: 2, compound }];
    });
  };

  const pickNewPrompt = () => {
    const compound = unusedCompound();
    if (!compound){
        setRunning(false);
        setMsg("You Lost! You took too many attempts!");
        setPrompt(null);
        return;
    }
    setPrompt(compound);
    ensurePromptApple(compound);
  };


  const spawnApples = () => {
    setApples(prev => {
        let next = [...prev];
        while (next.length < MIN_APPLES) {
            const c = unusedCompound();
            if (!c) break;
            let pos = randPos();
            while (snake.some(s => s.x === pos.x && s.y === pos.y)){
                pos = randPos();
            }
            next.push({ ...pos, size: 2, compound: c });
        }
        return next;
    });
  };


  const startGame = () => {
    const freshUsed = new Set<string>();

    setSnake(Array.from({ length: INITIAL_LENGTH }, (_, i) => ({ x: 5 - i, y: 5 })));
    setDir({ x: 1, y: 0 });
    setApples([]);
    setUsed(freshUsed);
    setSnakeLength(INITIAL_LENGTH);
    setMsg(null);
    setRunning(true);

    // 🔑 Immediately initialize game state
    setTimeout(() => {
        spawnApples();
        pickNewPrompt();
    }, 0);
  };


  const handleKey = (e: KeyboardEvent) => {
    e.preventDefault();

    if (e.code === "Space") {
      startGame();
      return;
    }

    if (!running) return;

    if (e.code === "ArrowUp" && dir.y === 0) setDir({ x: 0, y: -1 });
    if (e.code === "ArrowDown" && dir.y === 0) setDir({ x: 0, y: 1 });
    if (e.code === "ArrowLeft" && dir.x === 0) setDir({ x: -1, y: 0 });
    if (e.code === "ArrowRight" && dir.x === 0) setDir({ x: 1, y: 0 });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [dir, running]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        if (
          head.x < 0 || head.y < 0 ||
          head.x >= GRID_SIZE || head.y >= GRID_SIZE ||
          prev.some(s => s.x === head.x && s.y === head.y)
        ) {
          setRunning(false);
          setMsg("You Lost! You hit yourself!");
          setPrompt(null);
          return prev;
        }

        let ate = false;

        setApples(a =>
          a.filter(ap => {
            const hit =
              head.x >= ap.x && head.x < ap.x + ap.size &&
              head.y >= ap.y && head.y < ap.y + ap.size;

            if (hit) {
              ate = true;
              setUsed(u => new Set(u).add(ap.compound.formula));
              //spawnApples();
              //pickNewPrompt();
              if (ap.compound.formula === prompt?.formula) {
                setSnakeLength(l => l + 1);
                setMsg("Correct!");
              } else {
                setSnakeLength(l => l - 0.5);
                setMsg(`Wrong! It was ${prompt?.formula}!`);
              }
              spawnApples();
              pickNewPrompt();
            }
            return !hit;
          })
        );

        //if (ate) {
        //  spawnApples();
        //  pickNewPrompt();
        //}

        return [head, ...prev].slice(0, Math.floor(snakeLength));
      });
    }, 200);

    return () => clearInterval(interval);
  }, [running, dir, snakeLength, prompt]);

  useEffect(() => {
    if (snakeLength >= WIN_LENGTH) {
      setRunning(false);
      setMsg("You Won! You reached the maximum snake length!");
      setPrompt(null);
    }
    if (snakeLength < MIN_LENGTH) {
      setRunning(false);
      setMsg("You Lost! Your snake is too short!");
      setPrompt(null);
    }
  }, [snakeLength]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    ctx.fillStyle = "#d0f0f0";
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#0a8" : "#0c6";
      ctx.fillRect(s.x * CELL_SIZE, s.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    apples.forEach(a => {
      ctx.fillStyle = "#ff4c4c";
      ctx.beginPath();
      ctx.arc(
        (a.x + a.size / 2) * CELL_SIZE,
        (a.y + a.size / 2) * CELL_SIZE,
        (a.size / 2) * CELL_SIZE,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        a.compound.formula,
        (a.x + a.size / 2) * CELL_SIZE,
        (a.y + a.size / 2) * CELL_SIZE
      );
    });

    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(
      `Snake Length: ${snakeLength}`,
      GRID_SIZE * CELL_SIZE - 10,
      GRID_SIZE * CELL_SIZE - 10
    );
  }, [snake, apples, snakeLength]);

  return (
    <div className="flex flex-col items-center p-6">
      <div className="text-2xl font-bold mb-2">
        Find: {prompt?.name ?? "Press Space"}
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border-4 border-gray-600"
        onClick={startGame}
      />
      {msg && <div className="mt-4 text-xl font-bold">{msg}</div>}
    </div>
  );
}
