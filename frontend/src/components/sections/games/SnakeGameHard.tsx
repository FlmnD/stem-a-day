'use client'
import React, { useState, useEffect, useRef } from "react";

const COMPOUNDS = [
  { formula: "NaCl", name: "sodium chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "K₂O", name: "potassium oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "MgSe", name: "magnesium selenide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "CaCl₂", name: "calcium chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "Al₂O₃", name: "aluminum oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "FeO", name: "iron (II) oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "Fe₂O₃", name: "iron (III) oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "CuCl", name: "copper (I) chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "CuCl₂", name: "copper (II) chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },

  { formula: "Ca(OH)₂", name: "calcium hydroxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "(NH₄)₂SO₄", name: "ammonium sulfate", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "NaHCO₃", name: "sodium hydrogen carbonate", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "K₂Cr₂O₇", name: "potassium dichromate", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },

  { formula: "CO", name: "carbon monoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "CO₂", name: "carbon dioxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "N₂O", name: "dinitrogen monoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "N₂O₃", name: "dinitrogen trioxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },

  { formula: "PCl₅", name: "phosphorus pentachloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "SF₆", name: "sulfur hexafluoride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "Cl₂O₇", name: "dichlorine heptoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "P₄O₆", name: "tetraphosphorus hexoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "CCl₄", name: "carbon tetrachloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "HCl", name: "hydrochloric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "HBr", name: "hydrobromic acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "HI", name: "hydroiodic acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },
  { formula: "H₂S", name: "hydrosulfuric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false } },

  { formula: "H₂SO₄", name: "sulfuric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
  { formula: "H₂SO₃", name: "sulfurous acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
  { formula: "HNO₃", name: "nitric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
  { formula: "HNO₂", name: "nitrous acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
  { formula: "H₃PO₄", name: "phosphoric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
  { formula: "HC₂H₃O₂", name: "acetic acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },

  { formula: "CH₄", name: "methane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "C₂H₆", name: "ethane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "C₃H₈", name: "propane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },
  { formula: "C₄H₁₀", name: "butane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false } },

  { formula: "C₆H₁₂O₆", name: "glucose", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
  { formula: "C₂H₅OH", name: "ethanol", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true } },
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

const IMF_PROMPTS = [
  { key: "londonDispersion", label: "London Dispersion Forces (LDF)" },
  { key: "dipoleDipole", label: "Dipole-Dipole Interactions" },
  { key: "hydrogenBonding", label: "Hydrogen Bonding" },
] as const;

type IMFKey = typeof IMF_PROMPTS[number]["key"];


export default function SnakeGame() {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([]);
  const [dir, setDir] = useState({ x: 0, y: 0 });
  const [apples, setApples] = useState<Apple[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState<{ key: IMFKey; label: string } | null>(null);
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

  const pickNewPrompt = () => {
    const next = IMF_PROMPTS[Math.floor(Math.random() * IMF_PROMPTS.length)];
    setPrompt(next);
  };

  const spawnApples = () => {
    setApples(prev => {
        let next = [...prev];
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

                if (prompt && ap.compound.imf[prompt.key]) {
                  setSnakeLength(l => l + 0.5);
                  setFeedback("Correct!");
                } else {
                  setSnakeLength(l => l - 1);
                  setFeedback("Wrong!");
                }
                if (running) pickNewPrompt();
            }

            return !hit;
          })
        );

        return [head, ...prev].slice(0, Math.floor(snakeLength));
      });
    }, 200);

    return () => clearInterval(interval);
  }, [running, dir, snakeLength, prompt]);

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

      ctx.beginPath();
      ctx.fillStyle = "#ff4c4c";
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "13px Arial";

      const text = reverseMode
        ? a.compound.name   // <-- name in reverse mode
        : a.compound.formula; // <-- formula in normal mode

      const maxWidth = radius * 1.6;
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0] || "";

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i];
        if (ctx.measureText(testLine).width < maxWidth) {
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
  }, [snake, apples, snakeLength]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
        setApples(prev => {
        let next = [...prev];

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

              next.push({ ...pos, size: 2, compound: c });
            }
        }

        return next;
        });
    }, 1200 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
  if (!running) return;

  const interval = setInterval(() => {
    setApples(prev => {
      let next = [...prev];
      const existing = new Set(next.map(a => a.compound.formula));

      if (next.length > MIN_APPLES && Math.random() < 0.35 && prompt) {
        const removable = next.filter(
          a => !a.compound.imf[prompt.key]
        );

        if (removable.length) {
          const remove = removable[Math.floor(Math.random() * removable.length)];
          next = next.filter(a => a !== remove);
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

          next.push({ ...pos, size: 2, compound: c });
        }
      }

      return next;
    });
  }, 900 + Math.random() * 1400);

  return () => clearInterval(interval);
}, [running, prompt]);


  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
        setApples(prev => {
        if (prev.length <= MIN_APPLES) return prev;

        const removable = prev.filter(
          a => !(prompt && a.compound.imf[prompt.key])
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
              <>
                Find the substance with the IMF:{" "}
                <span className="text-blue-600">
                  {prompt.label}
                </span>
              </>
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