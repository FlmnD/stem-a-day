'use client'
import React, { useState, useEffect, useRef, useCallback } from "react";

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

const GRID_SIZE = 26;
const CELL_SIZE = 28;
const INITIAL_LENGTH = 5;
const WIN_LENGTH = 15;
const MIN_LENGTH = 3;
const MIN_APPLES = 5;
const MAX_APPLES = 7;
const GLUCOSE_REWARD = 35;

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

const IMF_COLORS: Record<IMFKey, string> = {
  londonDispersion: "#7c3aed",
  dipoleDipole: "#2563eb",
  hydrogenBonding: "#dc2626",
};

const INTRO_STEPS = [
  {
    image: "/hardsnake1.png",
    title: "Welcome to Snake IMF!",
    body: "Use arrow keys or WASD to guide your snake. Eat compounds that have the intermolecular force shown in the prompt.",
    sub: "Click through to learn how to play.",
  },
  {
    image: "/hardsnake2.png",
    title: "Read the Prompt",
    body: "The prompt names an IMF type. Find an apple whose compound has that force and eat it.",
    sub: "The prompt changes every time you eat an apple.",
  },
  {
    image: "/hardsnake3.png",
    title: "Eat the Right Apple",
    body: "Correct apple → +1 length. Wrong apple → −2 length.",
    sub: "Be careful because many compounds share IMF types!",
  },
  {
    image: "/hardsnake4.png",
    title: "Formula / Name Mode",
    body: "Toggle the mode button to switch between seeing names or formulas on the apples.",
    sub: "Both modes test the same IMF knowledge.",
  },
  {
    image: "/hardsnake5.png",
    title: "How to Win and Lose",
    body: "Reach a snake length of 15 to win. You lose if length drops below 3, you hit a wall, or run into yourself.",
    sub: "Start length is 5. Win length is 15. Press Space anytime to restart.",
  },
];

function ProgressBar({ value, max, min }: { value: number; max: number; min: number }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const color = pct < 30 ? "#ef4444" : pct < 60 ? "#f59e0b" : "#2563eb";
  return (
    <div className="dark:border-slate-600" style={{ width: "100%", background: "#e2e8f0", borderRadius: 8, height: 12, overflow: "hidden", border: "1px solid #cbd5e1" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 8, transition: "width 0.3s ease, background 0.3s ease" }} />
    </div>
  );
}

export default function SnakeIMF() {
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
  const [gameReady, setGameReady] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const [rewardPopupOpen, setRewardPopupOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [rewardMessage, setRewardMessage] = useState("");
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const dirRef       = useRef({ x: 1, y: 0 });
  const runningRef   = useRef(false);
  const gameReadyRef = useRef(false);
  const showIntroRef = useRef(true);

  const setRunningSync   = (val: boolean)                    => { runningRef.current = val;   setRunning(val); };
  const setDirSync       = (val: { x: number; y: number })   => { dirRef.current = val;       setDir(val); };
  const setGameReadySync = (val: boolean)                    => { gameReadyRef.current = val; setGameReady(val); };
  const setShowIntroSync = (val: boolean)                    => { showIntroRef.current = val; setShowIntro(val); };

  const openIntro = () => { setRunningSync(false); setIntroStep(0); setShowIntroSync(true); };

  const closeIntro = () => {
    setShowIntroSync(false);
    setIntroStep(0);
    if (!hasSeenIntro) { setHasSeenIntro(true); startGameFresh(); }
    else { setGameReadySync(true); }
  };

  const step = INTRO_STEPS[introStep];

  const randPos = (size = 2) => ({
    x: Math.floor(Math.random() * (GRID_SIZE - size)),
    y: Math.floor(Math.random() * (GRID_SIZE - size)),
  });

  const overlapsApple = (pos: { x: number; y: number }, apples: Apple[], size = 2) =>
    apples.some((a) =>
      pos.x < a.x + a.size && pos.x + size > a.x &&
      pos.y < a.y + a.size && pos.y + size > a.y
    );

  const unusedCompound = () => {
    const left = COMPOUNDS.filter((c) => !used.has(c.formula));
    return left.length ? left[Math.floor(Math.random() * left.length)] : null;
  };

  const pickNewPrompt = () => {
    const next = IMF_PROMPTS[Math.floor(Math.random() * IMF_PROMPTS.length)];
    setPrompt(next);
  };

  const spawnApples = () => {
    setApples((prev) => {
      const next = [...prev];
      const existing = new Set(next.map((a) => a.compound.formula));
      while (next.length < MIN_APPLES) {
        const c = unusedCompound();
        if (!c || existing.has(c.formula)) break;
        let pos = randPos();
        while (snake.some((s) => s.x === pos.x && s.y === pos.y) || overlapsApple(pos, next)) { pos = randPos(); }
        existing.add(c.formula);
        next.push({ ...pos, size: 2, compound: c });
      }
      return next;
    });
  };

  const awardGlucose = useCallback(async (amount: number) => {
    setRewardAmount(amount); setRewardPopupOpen(true); setRewardStatus("loading"); setRewardMessage("");
    try {
      const r = await fetch("/api/glucose/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { setRewardStatus("error"); setRewardMessage(data?.message ?? data?.detail ?? "Failed to add glucose."); return; }
      setRewardStatus("ok"); setRewardMessage(`You earned ${amount} glucose!`);
    } catch { setRewardStatus("error"); setRewardMessage("Network error. Could not update glucose."); }
  }, []);

  const startGameFresh = () => {
    setSnake(Array.from({ length: INITIAL_LENGTH }, (_, i) => ({ x: 5 - i, y: 5 })));
    setDirSync({ x: 1, y: 0 });
    setApples([]); setUsed(new Set());
    setSnakeLength(INITIAL_LENGTH); setMsg(null); setRunningSync(false); setFeedback(null);
    setRewardPopupOpen(false); setRewardAmount(0); setRewardStatus("idle"); setRewardMessage(""); setRewardClaimed(false);
    setTimeout(() => { spawnApples(); pickNewPrompt(); setGameReadySync(true); }, 0);
  };

  const handleKey = (e: KeyboardEvent) => {
    const isGameKey = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code);
    if (!isGameKey) return;
    e.preventDefault();

    if (showIntroRef.current) return;

    if (e.code === "Space") { startGameFresh(); return; }

    if (gameReadyRef.current && !runningRef.current) {
      const d = dirRef.current;
      let newDir: { x: number; y: number } | null = null;

      if ((e.code === "ArrowUp"    || e.code === "KeyW") && d.y !== 1)  newDir = { x: 0,  y: -1 };
      if ((e.code === "ArrowDown"  || e.code === "KeyS") && d.y !== -1) newDir = { x: 0,  y:  1 };
      if ((e.code === "ArrowLeft"  || e.code === "KeyA") && d.x !== 1)  newDir = { x: -1, y:  0 };
      if ((e.code === "ArrowRight" || e.code === "KeyD") && d.x !== -1) newDir = { x:  1, y:  0 };

      if (newDir) {
        dirRef.current = newDir;
        setGameReadySync(false);
        setRunningSync(true);
      }
      return;
    }

    if (!runningRef.current) return;

    const d = dirRef.current;
    if ((e.code === "ArrowUp"    || e.code === "KeyW") && d.y === 0)  dirRef.current = { x: 0,  y: -1 };
    if ((e.code === "ArrowDown"  || e.code === "KeyS") && d.y === 0)  dirRef.current = { x: 0,  y:  1 };
    if ((e.code === "ArrowLeft"  || e.code === "KeyA") && d.x === 0)  dirRef.current = { x: -1, y:  0 };
    if ((e.code === "ArrowRight" || e.code === "KeyD") && d.x === 0)  dirRef.current = { x:  1, y:  0 };
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { showIntroRef.current = showIntro; }, [showIntro]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        if (dirRef.current.x === 0 && dirRef.current.y === 0) return prev;
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE || prev.some((s) => s.x === head.x && s.y === head.y)) {
          setRunningSync(false); setMsg("You Lost!"); setPrompt(null); return prev;
        }
        setApples((a) => a.filter((ap) => {
          const hit = head.x >= ap.x && head.x < ap.x + ap.size && head.y >= ap.y && head.y < ap.y + ap.size;
          if (hit) {
            setUsed((prevUsed) => { const next = new Set(prevUsed); next.add(ap.compound.formula); return next; });
            if (prompt && ap.compound.imf[prompt.key]) { setSnakeLength((l) => l + 0.5); setFeedback("✓ Correct!"); }
            else { setSnakeLength((l) => l - 1); setFeedback("✗ Wrong!"); }
            if (runningRef.current) pickNewPrompt();
          }
          return !hit;
        }));
        return [head, ...prev].slice(0, Math.floor(snakeLength));
      });
    }, 200);
    return () => clearInterval(interval);
  }, [running, snakeLength, prompt]);

  useEffect(() => {
    if (snakeLength >= WIN_LENGTH) {
      setRunningSync(false); setMsg("You Won!"); setPrompt(null);
      if (!rewardClaimed) { setRewardClaimed(true); void awardGlucose(GLUCOSE_REWARD); }
    }
    if (snakeLength < MIN_LENGTH) { setRunningSync(false); setMsg("You Lost!"); setPrompt(null); }
  }, [snakeLength, rewardClaimed, awardGlucose]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    for (let gx = 0; gx < GRID_SIZE; gx++) {
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        ctx.fillStyle = (gx + gy) % 2 === 0 ? "#d0f0f0" : "#c4eaea";
        ctx.fillRect(gx * CELL_SIZE, gy * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#0a8" : "#0c6";
      ctx.beginPath();
      ctx.roundRect(s.x * CELL_SIZE + 1, s.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
      ctx.fill();
    });

    apples.forEach((a) => {
      const centerX = (a.x + a.size / 2) * CELL_SIZE;
      const centerY = (a.y + a.size / 2) * CELL_SIZE;
      const radius = (a.size / 2) * CELL_SIZE - 3;

      ctx.fillStyle = "#ff4c4c";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.ellipse(centerX - radius * 0.25, centerY - radius * 0.3, radius * 0.35, radius * 0.22, -0.5, 0, Math.PI * 2);
      ctx.fill();

      const text = reverseMode ? a.compound.formula : a.compound.name;
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 10px Arial";
      const maxWidth = radius * 1.7;
      const words = text.split(" ");
      const lines: string[] = [];
      let cur = words[0] || "";
      for (let i = 1; i < words.length; i++) {
        const test = cur + " " + words[i];
        if (ctx.measureText(test).width < maxWidth) cur = test;
        else { lines.push(cur); cur = words[i]; }
      }
      lines.push(cur);
      const lh = 11;
      const startY = centerY - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, idx) => ctx.fillText(line, centerX, startY + idx * lh));
    });
  }, [snake, apples, snakeLength, reverseMode]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setApples((prev) => {
        let next = [...prev];
        const existing = new Set(next.map((a) => a.compound.formula));
        if (next.length > MIN_APPLES && Math.random() < 0.35 && prompt) {
          const removable = next.filter((a) => !a.compound.imf[prompt.key]);
          if (removable.length) { const rm = removable[Math.floor(Math.random() * removable.length)]; next = next.filter((a) => a !== rm); existing.delete(rm.compound.formula); }
        }
        if (next.length < MAX_APPLES && Math.random() < 0.45) {
          const c = unusedCompound();
          if (c && !existing.has(c.formula)) {
            let pos = randPos();
            while (snake.some((s) => s.x === pos.x && s.y === pos.y) || overlapsApple(pos, next)) { pos = randPos(); }
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
      setApples((prev) => {
        if (prev.length <= MIN_APPLES) return prev;
        const removable = prev.filter((a) => !(prompt && a.compound.imf[prompt.key]));
        if (removable.length === 0) return prev;
        if (Math.random() < 0.3) { const rm = removable[Math.floor(Math.random() * removable.length)]; return prev.filter((a) => a !== rm); }
        return prev;
      });
    }, 1000 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [running, prompt]);

  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;
  const promptColor = prompt ? (IMF_COLORS[prompt.key] ?? "#2563eb") : "#2563eb";

  return (
    <div className="dark:bg-slate-950 dark:text-slate-100" style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px", fontFamily: "inherit" }}>

      <div style={{ width: "100%", maxWidth: canvasW + 240, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#1d4ed8", letterSpacing: "-0.5px" }}>⚗️ Snake</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>IMF</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setReverseMode((p) => !p)}
            className="dark:bg-indigo-500 dark:border-indigo-400 dark:text-white dark:hover:bg-indigo-400"
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#1d4ed8", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
          >
            {reverseMode ? "📝 Name Mode" : "⚗️ Formula Mode"}
          </button>
          {hasSeenIntro && (
            <button
              onClick={openIntro}
              className="dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >
              ? How to Play
            </button>
          )}
        </div>
      </div>

      <div
        className="dark:bg-slate-900 dark:border-slate-700"
        style={{
          width: "100%", maxWidth: canvasW + 240, marginBottom: 14,
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
          padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
          minHeight: 62, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
        {prompt ? (
          <>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
              Find a substance with →
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: promptColor, background: `${promptColor}18`, border: `1px solid ${promptColor}44`, borderRadius: 6, padding: "4px 14px", whiteSpace: "nowrap" }}>
              {prompt.label}
            </span>
            {!running && !msg && gameReady && (
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto", whiteSpace: "nowrap", animation: "pulse 1.5s infinite" }}>
                ▶ Press any arrow key
              </span>
            )}
          </>
        ) : (
          <span style={{ fontSize: 15, color: "#94a3b8", margin: "0 auto" }}>
            {showIntro ? "Learn how to play →" : msg ? `${msg} — Press Space to restart` : "Press Space to Start"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", width: "100%", maxWidth: canvasW + 240 }}>

        <div style={{ position: "relative", flexShrink: 0 }}>

          {showIntro && (
            <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.97)", borderRadius: 8 }}>
              <div style={{ width: 300, padding: 24, textAlign: "center", fontFamily: "inherit" }}>
                <img src={step.image} alt={step.title} style={{ width: "100%", borderRadius: 8, marginBottom: 14, border: "1px solid #e2e8f0" }} />
                <h2 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{step.title}</h2>
                <p style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>{step.body}</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>{step.sub}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "14px 0" }}>
                  {INTRO_STEPS.map((_, i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === introStep ? "#2563eb" : "#e2e8f0", border: i === introStep ? "none" : "1px solid #cbd5e1" }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {introStep > 0
                    ? <button onClick={() => setIntroStep(s => s - 1)} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Back</button>
                    : <div />}
                  {introStep < INTRO_STEPS.length - 1
                    ? <button onClick={() => setIntroStep(s => s + 1)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Next</button>
                    : <button onClick={closeIntro} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {hasSeenIntro ? "Resume" : "Start Game"}
                      </button>
                  }
                </div>
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={canvasW}
            height={canvasH}
            style={{
              display: "block", borderRadius: 8,
              border: "2px solid #cbd5e1",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              opacity: (!running && msg && !showIntro) ? 0.35 : 1,
              transition: "opacity 0.3s",
            }}
          />

          {!running && msg && !showIntro && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.95)", padding: "28px 44px", borderRadius: 16, textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: msg.includes("Won") ? "#16a34a" : "#dc2626", marginBottom: 8 }}>{msg}</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>Press Space to Restart</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>

          <div className="dark:bg-slate-900 dark:border-slate-700" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Snake Length</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#2563eb", lineHeight: 1, marginBottom: 10 }}>
              {Math.floor(snakeLength)}
              <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>/ {WIN_LENGTH}</span>
            </div>
            <ProgressBar value={snakeLength} max={WIN_LENGTH} min={MIN_LENGTH} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "#ef4444" }}>☠ {MIN_LENGTH}</span>
              <span style={{ fontSize: 10, color: "#16a34a" }}>🏆 {WIN_LENGTH}</span>
            </div>
          </div>

          <div
            className="dark:bg-slate-900 dark:border-slate-700"
            style={{
              background: "#fff",
              border: `1px solid ${feedback?.includes("✓") ? "#bbf7d0" : feedback?.includes("✗") ? "#fecaca" : "#e2e8f0"}`,
              borderRadius: 12, padding: "16px 18px", minHeight: 72,
              display: "flex", flexDirection: "column", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Last Answer</div>
            {feedback
              ? <div style={{ fontSize: 15, fontWeight: 700, color: feedback.includes("✓") ? "#16a34a" : "#dc2626" }}>{feedback}</div>
              : <div style={{ fontSize: 13, color: "#cbd5e1" }}>—</div>
            }
          </div>

          <div className="dark:bg-slate-900 dark:border-slate-700" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>IMF Types</div>
            {IMF_PROMPTS.map(({ key, label }) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: IMF_COLORS[key], flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: prompt?.key === key ? IMF_COLORS[key] : "#64748b", fontWeight: prompt?.key === key ? 700 : 400 }}>
                  {label}
                </span>
                {prompt?.key === key && (
                  <span style={{ fontSize: 10, color: IMF_COLORS[key], marginLeft: "auto", fontWeight: 700 }}>← find this</span>
                )}
              </div>
            ))}
          </div>

          <div className="dark:bg-slate-900 dark:border-slate-700" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Progress</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>
              <span style={{ color: "#0f172a", fontWeight: 700 }}>{used.size}</span> compounds eaten
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              <span style={{ color: "#0f172a", fontWeight: 700 }}>{COMPOUNDS.length - used.size}</span> remaining
            </div>
          </div>

          <div className="dark:bg-slate-900 dark:border-slate-700" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Controls</div>
            {[["↑ ↓ ← → / WASD", "Move"], ["Space", "Restart"]].map(([key, action]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#1d4ed8", background: "#eff6ff", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", border: "1px solid #bfdbfe" }}>{key}</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{action}</span>
              </div>
            ))}
          </div>

          <div className="dark:bg-slate-900 dark:border-slate-700" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Current Mode</div>
            <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 700 }}>
              {reverseMode ? "📝 Apples show formulas" : "⚗️ Apples show names"}
            </div>
          </div>
        </div>
      </div>

      {rewardPopupOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", padding: "0 16px" }}>
          <div style={{ width: "100%", maxWidth: 420, borderRadius: 20, border: "1px solid #e2e8f0", background: "#fff", padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800, color: "#16a34a" }}>🏆 Reward Earned!</h2>
            <p style={{ fontSize: 16, color: "#475569", marginBottom: 16 }}>You earned <strong style={{ color: "#0f172a" }}>{rewardAmount}</strong> glucose.</p>
            {rewardStatus === "loading" && <p style={{ fontSize: 13, color: "#94a3b8" }}>Updating glucose...</p>}
            {rewardStatus === "ok" && <p style={{ fontSize: 13, color: "#16a34a" }}>{rewardMessage}</p>}
            {rewardStatus === "error" && <p style={{ fontSize: 13, color: "#dc2626" }}>{rewardMessage}</p>}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setRewardPopupOpen(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}