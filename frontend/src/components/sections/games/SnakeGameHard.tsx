'use client'
import React, { useState, useEffect, useRef } from "react";

const COMPOUNDS = [
  { formula: "NaCl", name: "sodium chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "K₂O", name: "potassium oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "MgSe", name: "magnesium selenide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "CaCl₂", name: "calcium chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "Al₂O₃", name: "aluminum oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "FeO", name: "iron(II) oxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "Fe₂O₃", name: "iron(III) oxide (also ferric oxide)", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "CuCl", name: "copper(I) chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "CuCl₂", name: "copper(II) chloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },

  { formula: "Ca(OH)₂", name: "calcium hydroxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "(NH₄)₂SO₄", name: "ammonium sulfate", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "NaHCO₃", name: "sodium hydrogen carbonate (or sodium bicarbonate)", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },
  { formula: "K₂Cr₂O₇", name: "potassium dichromate", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: true } },

  { formula: "CO", name: "carbon monoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "CO₂", name: "carbon dioxide", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },
  { formula: "N₂O", name: "dinitrogen monoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "N₂O₃", name: "dinitrogen trioxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },

  { formula: "PCl₅", name: "phosphorus pentachloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },
  { formula: "SF₆", name: "sulfur hexafluoride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },
  { formula: "Cl₂O₇", name: "dichlorine heptoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "P₄O₆", name: "tetraphosphorus hexoxide", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "CCl₄", name: "carbon tetrachloride", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },

  { formula: "HCl(aq)", name: "hydrochloric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "HBr(aq)", name: "hydrobromic acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "HI(aq)", name: "hydroiodic acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },
  { formula: "H₂S(aq)", name: "hydrosulfuric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: false, ionDipole: false } },

  { formula: "H₂SO₄", name: "sulfuric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
  { formula: "H₂SO₃", name: "sulfurous acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
  { formula: "HNO₃", name: "nitric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
  { formula: "HNO₂", name: "nitrous acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
  { formula: "H₃PO₄", name: "phosphoric acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
  { formula: "HC₂H₃O₂", name: "acetic acid", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },

  { formula: "CH₄", name: "methane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },
  { formula: "C₂H₆", name: "ethane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },
  { formula: "C₃H₈", name: "propane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },
  { formula: "C₄H₁₀", name: "butane", imf: { londonDispersion: true, dipoleDipole: false, hydrogenBonding: false, ionDipole: false } },

  { formula: "C₆H₁₂O₆", name: "glucose", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
  { formula: "C₂H₅OH", name: "ethanol (ethyl alcohol)", imf: { londonDispersion: true, dipoleDipole: true, hydrogenBonding: true, ionDipole: false } },
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
        while (snake.some(s => s.x === pos.x && s.y === pos.y)) {
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
                  setSnakeLength(l => l + 1);
                  setFeedback("Correct!");
                } else {
                  setSnakeLength(l => l - 0.5);
                  setFeedback("Wrong!");
                }
                if (running) pickNewPrompt();
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

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
        setApples(prev => {
        let next = [...prev];

        // 30% chance to remove a random apple (never drop below MIN_APPLES)
        if (next.length > MIN_APPLES && Math.random() < 0.3) {
            next.splice(Math.floor(Math.random() * next.length), 1);
        }

        // 50% chance to add a new apple
        if (Math.random() < 0.5) {
            const c = unusedCompound();
            if (c) {
            next.push({ ...randPos(), size: 2, compound: c });
            }
        }

        return next;
        });
    }, 1200 + Math.random() * 1200); // random timing

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
  if (!running) return;

  const interval = setInterval(() => {
    setApples(prev => {
      let next = [...prev];
      const existing = new Set(next.map(a => a.compound.formula));

      // random removal (never remove prompt apple)
      if (next.length > MIN_APPLES && Math.random() < 0.35 && prompt) {
        const removable = next.filter(
          a => !a.compound.imf[prompt.key] // keep apples that do NOT match the current IMF prompt
        );

        if (removable.length) {
          const remove = removable[Math.floor(Math.random() * removable.length)];
          next = next.filter(a => a !== remove);
        }
      }


      // random addition
      if (
        next.length < MAX_APPLES &&
        Math.random() < 0.45
      ) {
        const c = unusedCompound();
        if (c && !existing.has(c.formula)) {
          next.push({ ...randPos(), size: 2, compound: c });
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

        // candidates that are NOT the prompt
        const removable = prev.filter(
          a => !(prompt && a.compound.imf[prompt.key])
        );


        if (removable.length === 0) return prev;

        // 30% chance to remove one
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
      <div className="text-2xl font-bold mb-2">
        Find: {prompt?.label ?? "Press Space"}
      </div>
      <div
        className="relative"
        style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
        }}
        >
          <div className="mt-4 text-xl font-bold text-center text-black">
            {feedback}
          </div>

        <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className={`border-4 border-gray-600 ${
            !running && msg ? "opacity-40" : ""
            }`}
            onClick={startGame}
        />

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
