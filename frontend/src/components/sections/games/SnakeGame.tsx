'use client'
import React, { useState, useEffect, useRef } from "react";

const COMPOUNDS = [ 
    { formula: "NaCl", name: "sodium chloride", type: "ionic compound" }, 
    { formula: "K₂O", name: "potassium oxide", type: "ionic compound" }, 
    { formula: "MgSe", name: "magnesium selenide", type: "ionic compound" }, 
    { formula: "CaCl₂", name: "calcium chloride", type: "ionic compound" }, 
    { formula: "Al₂O₃", name: "aluminum oxide", type: "ionic compound" }, 
    { formula: "FeO", name: "iron (II) oxide", type: "ionic compound" }, 
    { formula: "Fe₂O₃", name: "iron (III) oxide", type: "ionic compound" }, 
    { formula: "CuCl", name: "copper (I) chloride", type: "ionic compound" }, 
    { formula: "CuCl₂", name: "copper (II) chloride", type: "ionic compound" }, 
    { formula: "Ca(OH)₂", name: "calcium hydroxide", type: "ionic compound" }, 
    { formula: "(NH₄)₂SO₄", name: "ammonium sulfate", type: "ionic compound" }, 
    { formula: "NaHCO₃", name: "sodium hydrogen carbonate", type: "ionic compound" }, 
    { formula: "K₂Cr₂O₇", name: "potassium dichromate", type: "ionic compound" }, 
    { formula: "CO", name: "carbon monoxide", type: "molecular compound" }, 
    { formula: "CO₂", name: "carbon dioxide", type: "molecular compound" }, 
    { formula: "N₂O", name: "dinitrogen monoxide", type: "molecular compound" }, 
    { formula: "N₂O₃", name: "dinitrogen trioxide", type: "molecular compound" }, 
    { formula: "PCl₅", name: "phosphorus pentachloride", type: "molecular compound" }, 
    { formula: "SF₆", name: "sulfur hexafluoride", type: "molecular compound" }, 
    { formula: "Cl₂O₇", name: "dichlorine heptoxide", type: "molecular compound" }, 
    { formula: "P₄O₆", name: "tetraphosphorus hexoxide", type: "molecular compound" }, 
    { formula: "CCl₄", name: "carbon tetrachloride", type: "molecular compound" },
    { formula: "HCl", name: "hydrochloric acid", type: "acid" }, 
    { formula: "HBr", name: "hydrobromic acid", type: "acid" }, 
    { formula: "HI", name: "hydroiodic acid", type: "acid" }, 
    { formula: "H₂S", name: "hydrosulfuric acid", type: "acid" }, 
    { formula: "H₂SO₄", name: "sulfuric acid", type: "acid" }, 
    { formula: "H₂SO₃", name: "sulfurous acid", type: "acid" }, 
    { formula: "HNO₃", name: "nitric acid", type: "acid" }, 
    { formula: "HNO₂", name: "nitrous acid", type: "acid" }, 
    { formula: "H₃PO₄", name: "phosphoric acid", type: "acid" }, 
    { formula: "HC₂H₃O₂", name: "acetic acid", type: "acid" }, 
    { formula: "CH₄", name: "methane", type: "organic molecule" }, 
    { formula: "C₂H₆", name: "ethane", type: "organic molecule" }, 
    { formula: "C₃H₈", name: "propane", type: "organic molecule" }, 
    { formula: "C₄H₁₀", name: "butane", type: "organic molecule" }, 
    { formula: "C₆H₁₂O₆", name: "glucose", type: "organic molecule" }, 
    { formula: "C₂H₅OH", name: "ethanol", type: "organic molecule" }, 
];

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_LENGTH = 5;
const WIN_LENGTH = 15;
const MIN_LENGTH = 3;
const MIN_APPLES = 5;
const MAX_APPLES = 7;

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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reverseMode, setReverseMode] = useState(false);

  const randPos = (size = 2) => ({
    x: Math.floor(Math.random() * (GRID_SIZE - size)),
    y: Math.floor(Math.random() * (GRID_SIZE - size)),
  });

  const overlapsApple = (pos: { x: number; y: number }, apples: Apple[], size = 2) =>
  apples.some(a =>
    pos.x < a.x + a.size &&
    pos.x + size > a.x &&
    pos.y < a.y + a.size &&
    pos.y + size > a.y
  );

  const unusedCompound = () => {
    const left = COMPOUNDS.filter(c => !used.has(c.formula));
    return left.length ? left[Math.floor(Math.random() * left.length)] : null;
  };

  const ensurePromptApple = (compound: typeof COMPOUNDS[0]) => {
    setApples(prev => {
      if (prev.some(a => a.compound.formula === compound.formula)) return prev;
      let pos = randPos();
      while (
        snake.some(s => s.x === pos.x && s.y === pos.y) ||
        overlapsApple(pos, prev)
      ) {
        pos = randPos();
      }

      return [...prev, { ...pos, size: 2, compound }];
    });
  };

  /*const pickNewPrompt = () => {
    setApples(prev => {
        if (prev.length === 0) return prev;

        const choices = prev
        .map(a => a.compound)
        .filter(c => !used.has(c.formula));

        if (choices.length === 0) {
        setRunning(false);
        setMsg("You Lost!");
        setPrompt(null);
        return prev;
        }

        const chosen = choices[Math.floor(Math.random() * choices.length)];
        setPrompt(chosen);
        return prev;
    });
  };*/

  const pickNewPrompt = () => {
    setApples(prev => {
        const candidates = prev
        .map(a => a.compound)
        .filter(c => !used.has(c.formula));

        if (candidates.length === 0) {
        setRunning(false);
        setMsg("You Win!");
        setPrompt(null);
        return prev;
        }

        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        setPrompt(chosen);
        return prev;
    });
  };


  const spawnApples = () => {
    setApples(prev => {
        const next = [...prev];
        const existing = new Set(next.map(a => a.compound.formula));

        while (next.length < MIN_APPLES) {
        const c = unusedCompound();
        if (!c || existing.has(c.formula)) break;

        let pos = randPos();
        while (
          snake.some(s => s.x === pos.x && s.y === pos.y) ||
          overlapsApple(pos, next)
        ) {
          pos = randPos();
        }

        existing.add(c.formula);
        next.push({
          ...pos,
          size: 2,
          compound: c
        });
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
    setFeedback(null);

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
          setMsg("You Lost!");
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

                setUsed(prev => {
                    const next = new Set(prev);
                    next.add(ap.compound.formula);
                    return next;
                });

                if (ap.compound.formula === prompt?.formula) {
                    setSnakeLength(l => l + 1);
                    setFeedback("Correct!");
                } else {
                    setSnakeLength(l => l - 0.5);
                    if(reverseMode){
                      setFeedback(`Wrong! It was ${prompt?.name}`);
                    } else {
                      setFeedback(`Wrong! It was ${prompt?.formula}`);
                    }
                }

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
  }, [running, dir, snakeLength, prompt, reverseMode]);

  useEffect(() => {
    if (snakeLength >= WIN_LENGTH) {
      setRunning(false);
      setMsg("You Won!");
      setPrompt(null);
    }
    if (snakeLength < MIN_LENGTH) {
      setRunning(false);
      setMsg("You Lost!");
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
      const centerX = (a.x + a.size / 2) * CELL_SIZE;
      const centerY = (a.y + a.size / 2) * CELL_SIZE;
      const radius = (a.size / 2) * CELL_SIZE;

      ctx.fillStyle = "#ff4c4c";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = reverseMode ? a.compound.name : a.compound.formula;
      ctx.font = "13px Arial";
      const maxWidth = radius * 1.6;
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i];
        const metrics = ctx.measureText(testLine);

        if (metrics.width < maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      const lineHeight = 13;
      const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, centerX, startY + index * lineHeight);
      });
    });

  }, [snake, apples, snakeLength, reverseMode]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
        setApples(prev => {
        const next = [...prev];

        if (next.length > MIN_APPLES && Math.random() < 0.3) {
            next.splice(Math.floor(Math.random() * next.length), 1);
        }

        if (Math.random() < 0.5) {
            const c = unusedCompound();
            if (c) {
              let pos = randPos();
              while (
                snake.some(s => s.x === pos.x && s.y === pos.y) ||
                overlapsApple(pos, next)
              ) {
                pos = randPos();
              }
              next.push({
                ...pos,
                size: 2,
                compound: c
              });
            }
        }

        return next;
        });
    }, 1200 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, [running, reverseMode]);

  useEffect(() => {
  if (!running) return;

  const interval = setInterval(() => {
    setApples(prev => {
      let next = [...prev];
      const existing = new Set(next.map(a => a.compound.formula));

      if (
        next.length > MIN_APPLES &&
        Math.random() < 0.35
      ) {
        const removable = next.filter(
          a => a.compound.formula !== prompt?.formula
        );
        if (removable.length) {
          const remove =
            removable[Math.floor(Math.random() * removable.length)];
          next = next.filter(a => a !== remove);
          existing.delete(remove.compound.formula);
        }
      }

      if (
        next.length < MAX_APPLES &&
        Math.random() < 0.45
      ) {
        const c = unusedCompound();
        if (c && !existing.has(c.formula)) {
          let pos = randPos();
          while (
            snake.some(s => s.x === pos.x && s.y === pos.y) ||
            overlapsApple(pos, next)
          ) {
            pos = randPos();
          }

          next.push({
            ...pos,
            size: 2,
            compound: c
          });
        }
      }

      return next;
    });
  }, 900 + Math.random() * 1400);

  return () => clearInterval(interval);
}, [running, prompt, reverseMode]);


  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
        setApples(prev => {
        if (prev.length <= MIN_APPLES) return prev;

        const removable = prev.filter(
            a => a.compound.formula !== prompt?.formula
        );

        if (removable.length === 0) return prev;

        if (Math.random() < 0.3) {
            const remove = removable[Math.floor(Math.random() * removable.length)];
            return prev.filter(a => a !== remove);
        }

        return prev;
        });
    }, 1000 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, [running, prompt]);

  return (
    <div className="flex flex-col items-center p-6">
      <div className="text-2xl font-extrabold mb-3 text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            onClick={() => setReverseMode(prev => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            {reverseMode ? "Name Mode" : "Formula Mode"}
          </button>

          <div className="text-2xl font-extrabold text-center">
            {prompt ? (
              reverseMode ? (
                <>
                  Find the{" "}
                  <span className="text-purple-600">
                    chemical formula
                  </span>{" "}
                  for the{" "}
                  <span className="text-blue-600">
                    {prompt.type}
                  </span>
                  :{" "}
                  <span className="text-emerald-600 underline">
                    {prompt.formula}
                  </span>
                </>
              ) : (
                <>
                  Find the{" "}
                  <span className="text-purple-600">
                    name
                  </span>{" "}
                  for the{" "}
                  <span className="text-blue-600">
                    {prompt.type}
                  </span>
                  :{" "}
                  <span className="text-emerald-600 underline">
                    {prompt.formula}
                  </span>
                </>
              )
            ) : (
              "Press Space"
            )}
          </div>
        </div>
      </div>
      
      <div
        className="relative"
        style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
        }}
        >
        <div className="flex items-start gap-6">
          <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className={`border-4 border-gray-600 ${
              !running && msg ? "opacity-40" : ""
              }`}
          />

          <div className="text-2xl font-extrabold text-emerald-700">
            Snake Length: {snakeLength}

            <div
              className={`text-2xl font-bold ${
                feedback?.includes("Correct")
                  ? "text-green-600"
                  : feedback?.includes("Wrong")
                  ? "text-red-600"
                  : ""
              }`}
            >
              {feedback}
            </div>
          </div>
        </div>

        <div
          className="flex justify-between items-center mt-3 w-full"
          style={{ width: GRID_SIZE * CELL_SIZE }}
        >
        </div>

        {!running && msg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-black/70 text-white px-8 py-6 rounded-xl text-center">
                <div className="text-4xl font-extrabold mb-2">{msg}</div>
                <div className="text-lg opacity-80">
                Press Space to Restart
                </div>
            </div>
            </div>
        )}
        </div>
    </div>
  );
}
