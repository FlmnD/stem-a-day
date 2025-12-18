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
const INITIAL_SNAKE_LENGTH = 5;
const WIN_LENGTH = 15;
const MIN_APPLES = 5;

interface Apple {
  x: number;
  y: number;
  compound: typeof COMPOUNDS[0];
  size: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([]);
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [apples, setApples] = useState<Apple[]>([]);
  const [usedCompounds, setUsedCompounds] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState<typeof COMPOUNDS[0] | null>(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [snakeLength, setSnakeLength] = useState(INITIAL_SNAKE_LENGTH);
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startGame = () => {
    const initialSnake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({ x: 5 - i, y: 5 }));
    setSnake(initialSnake);
    setDir({ x: 1, y: 0 });
    setSpeed(300);
    setSnakeLength(INITIAL_SNAKE_LENGTH);
    setUsedCompounds(new Set());
    setGameOver(false);
    setMsg(null);
    setRunning(true);
    setApples([]);
    spawnApples(MIN_APPLES);
  };

  const getRandomPosition = (size: number) => ({
    x: Math.floor(Math.random() * (GRID_SIZE - size)),
    y: Math.floor(Math.random() * (GRID_SIZE - size)),
  });

  const spawnApples = (count: number) => {
    let newApples: Apple[] = [...apples];
    const available = COMPOUNDS.filter(c => !usedCompounds.has(c.formula));

    while (newApples.length < MIN_APPLES && available.length > 0) {
      const compound = available[Math.floor(Math.random() * available.length)];
      const pos = getRandomPosition(2);
      newApples.push({ x: pos.x, y: pos.y, compound, size: 2 });
      setUsedCompounds(prev => new Set(prev).add(compound.formula));
    }

    setApples(newApples);

    // Ensure prompt apple exists on screen
    if (!prompt && newApples.length > 0) {
      setPrompt(newApples[0].compound);
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    e.preventDefault(); // prevent scrolling
    if (!running && e.code === "Space") startGame();

    if (!running) return;

    switch (e.code) {
      case "ArrowUp": if (dir.y === 0) setDir({ x: 0, y: -1 }); break;
      case "ArrowDown": if (dir.y === 0) setDir({ x: 0, y: 1 }); break;
      case "ArrowLeft": if (dir.x === 0) setDir({ x: -1, y: 0 }); break;
      case "ArrowRight": if (dir.x === 0) setDir({ x: 1, y: 0 }); break;
      case "Space": startGame(); break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [dir, running, prompt]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
          setRunning(false); setGameOver(true); setMsg({ text: "You hit the wall!", color: "red" }); return prev;
        }
        if (prev.some(seg => seg.x === head.x && seg.y === head.y)) {
          setRunning(false); setGameOver(true); setMsg({ text: "You ran into yourself!", color: "red" }); return prev;
        }

        let ateApple = false;
        let newMsg: typeof msg | null = null;

        setApples(prevApples => {
          let updated = [...prevApples];
          updated.forEach((apple, idx) => {
            if (head.x >= apple.x && head.x < apple.x + apple.size &&
                head.y >= apple.y && head.y < apple.y + apple.size) {
              ateApple = true;
              if (apple.compound.formula === prompt?.formula) {
                setSnakeLength(len => len + 2);
                newMsg = { text: "Correct!", color: "green" };
              } else {
                setSnakeLength(len => Math.max(1, len - 1));
                newMsg = { text: `Wrong! It was ${prompt?.formula}`, color: "red" };
              }
              updated.splice(idx, 1);
            }
          });
          return updated;
        });

        if (ateApple) {
          // Select new prompt from current apples
          const availableApples = apples.filter(a => a.compound.formula !== prompt?.formula);
          if (availableApples.length > 0) {
            const nextApple = availableApples[Math.floor(Math.random() * availableApples.length)];
            setPrompt(nextApple.compound);
          } else {
            setPrompt(null); // next spawn will create prompt apple
          }

          // Ensure MIN_APPLES after eating
          spawnApples(MIN_APPLES);
        }

        setMsg(newMsg);

        let newSnake = [head, ...prev];
        if (!ateApple) newSnake = newSnake.slice(0, snakeLength);

        if (snakeLength >= WIN_LENGTH) {
          setRunning(false); setGameOver(true); setMsg({ text: "You Win!", color: "green" });
        }

        return newSnake;
      });

      setSpeed(prev => Math.max(50, prev - 1));
    }, speed);

    return () => clearInterval(interval);
  }, [running, dir, snakeLength, apples, prompt]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    ctx.fillStyle = "#d0f0f0";
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#0a8" : "#0c6";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    apples.forEach(apple => {
      ctx.fillStyle = "#ff4c4c";
      ctx.beginPath();
      ctx.arc(
        (apple.x + apple.size / 2) * CELL_SIZE,
        (apple.y + apple.size / 2) * CELL_SIZE,
        (apple.size / 2) * CELL_SIZE,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        apple.compound.formula,
        (apple.x + apple.size / 2) * CELL_SIZE,
        (apple.y + apple.size / 2) * CELL_SIZE
      );
    });
  }, [snake, apples]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {msg && (
        <div style={{ backgroundColor: msg.color }} className="w-full max-w-xl text-center text-white font-bold p-2 rounded mb-2">
          {msg.text}
        </div>
      )}
      <div className="relative">
        <div className="absolute top-2 left-2 text-xl font-bold">Snake Length: {snakeLength}</div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold">
          Find: {prompt?.name || ""}
        </div>
        <canvas ref={canvasRef} width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} className="border-4 border-gray-600" onClick={startGame}/>
        {gameOver && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center text-4xl font-bold text-red-600">
            {msg?.text || "Game Over"}
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded" onClick={startGame}>Try Again</button>
          </div>
        )}
      </div>
      {!running && !gameOver && <p className="mt-4 text-lg text-gray-700">Click the game box or press Space to start!</p>}
    </div>
  );
}
