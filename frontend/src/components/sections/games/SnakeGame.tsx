'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSnakeTheme, type SnakeTheme } from "@/components/sections/games/snakeTheme";

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

const GRID_SIZE = 26;
const CELL_SIZE = 28;
const INITIAL_LENGTH = 5;
const WIN_LENGTH = 15;
const MIN_LENGTH = 3;
const MIN_APPLES = 5;
const MAX_APPLES = 7;
const GLUCOSE_REWARD = 15;

interface Apple {
  x: number;
  y: number;
  size: number;
  compound: typeof COMPOUNDS[0];
}

const INTRO_STEPS = [
  {
    image: "/easysnake1.png",
    title: "Welcome to Snake Nomenclature!",
    body: "Use arrow keys or WASD to guide your snake around the board. Eat the correct chemical formula to grow. Eat the wrong one and shrink!",
    sub: "Click through to learn how to play.",
  },
  {
    image: "/easysnake2.png",
    title: "Read the Prompt",
    body: "A chemical name appears at the top. Find the apple labeled with its correct formula and eat it.",
    sub: "The prompt changes every time you eat an apple.",
  },
  {
    image: "/easysnake3.png",
    title: "Eat the Right Apple",
    body: "Eating the correct formula apple adds 2 to your snake length. Eating the wrong one subtracts 1.",
    sub: "Correct apple → +2 length. Wrong apple → −1 length.",
  },
  {
    image: "/easysnake4.png",
    title: "Formula Mode vs Name Mode",
    body: "Toggle between modes with the button at the top. Formula Mode shows names on apples. Name Mode shows formulas on apples.",
    sub: "Both modes test the same knowledge, just from different directions.",
  },
  {
    image: "/easysnake5.png",
    title: "How to Win and Lose",
    body: "Reach a snake length of 15 to win. You lose if your length drops below 3, you hit a wall, or you run into yourself.",
    sub: "Start length is 5. Win length is 15. Press Space anytime to restart.",
  },
];

function ProgressBar({
  value,
  max,
  min,
  theme,
}: {
  value: number;
  max: number;
  min: number;
  theme: SnakeTheme;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const color = pct < 30 ? "#ef4444" : pct < 60 ? "#f59e0b" : "#2563eb";
  return (
    <div style={{ width: "100%", background: theme.progressTrack, borderRadius: 8, height: 12, overflow: "hidden", border: `1px solid ${theme.progressTrackBorder}` }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 8,
          transition: "width 0.3s ease, background 0.3s ease",
        }}
      />
    </div>
  );
}

export default function SnakeGame() {
  const theme = useSnakeTheme();
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([]);
  const [, setDir] = useState({ x: 0, y: 0 });
  const [apples, setApples] = useState<Apple[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState<typeof COMPOUNDS[0] | null>(null);
  const [running, setRunning] = useState(false);
  const [snakeLength, setSnakeLength] = useState(INITIAL_LENGTH);
  const [msg, setMsg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reverseMode, setReverseMode] = useState(false);

  const [rewardPopupOpen, setRewardPopupOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardStatus, setRewardStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [rewardMessage, setRewardMessage] = useState("");
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const [gameReady, setGameReady] = useState(false);
  const gameReadyRef = useRef(false);
  const dirRef = useRef({ x: 0, y: 0 });
  const runningRef = useRef(false);
  const showIntroRef = useRef(showIntro);

  const setGameReadySync = (val: boolean) => { gameReadyRef.current = val; setGameReady(val); };
  const setRunningSync = (val: boolean) => { runningRef.current = val; setRunning(val); };
  const setDirSync = (val: { x: number; y: number }) => { dirRef.current = val; setDir(val); };

  const openIntro = () => { setRunningSync(false); setIntroStep(0); setShowIntro(true); };

  const closeIntro = () => {
    setShowIntro(false);
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
    setApples((prev) => {
      const candidates = prev.map((a) => a.compound).filter((c) => !used.has(c.formula));
      if (candidates.length === 0) { setRunningSync(false); setMsg("You Win!"); setPrompt(null); return prev; }
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      setPrompt(chosen);
      return prev;
    });
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
    setDirSync({ x: 0, y: 0 }); setApples([]); setUsed(new Set());
    setSnakeLength(INITIAL_LENGTH); setMsg(null); setRunningSync(false); setFeedback(null);
    setRewardPopupOpen(false); setRewardAmount(0); setRewardStatus("idle"); setRewardMessage(""); setRewardClaimed(false);
    setTimeout(() => { spawnApples(); pickNewPrompt(); setGameReadySync(true); }, 0);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (showIntroRef.current) return;
    e.preventDefault();
    if (e.code === "Space") { startGameFresh(); return; }
    if (gameReadyRef.current && !runningRef.current) {
      const d = dirRef.current;
      if (d.x === 0 && d.y === 0 && (e.code === "ArrowLeft" || e.code === "KeyA")) return;
      if (e.code === "ArrowUp" || e.code === "KeyW") { setDirSync({ x: 0, y: -1 }); setRunningSync(true); setGameReadySync(false); return; }
      if (e.code === "ArrowDown" || e.code === "KeyS") { setDirSync({ x: 0, y: 1 }); setRunningSync(true); setGameReadySync(false); return; }
      if (e.code === "ArrowRight" || e.code === "KeyD") { setDirSync({ x: 1, y: 0 }); setRunningSync(true); setGameReadySync(false); return; }
      if ((e.code === "ArrowLeft" || e.code === "KeyA") && d.x !== 1) { setDirSync({ x: -1, y: 0 }); setRunningSync(true); setGameReadySync(false); return; }
      return;
    }
    if (!runningRef.current) return;
    const d = dirRef.current;
    if ((e.code === "ArrowUp" || e.code === "KeyW") && d.y === 0) setDirSync({ x: 0, y: -1 });
    if ((e.code === "ArrowDown" || e.code === "KeyS") && d.y === 0) setDirSync({ x: 0, y: 1 });
    if ((e.code === "ArrowLeft" || e.code === "KeyA") && d.x === 0) setDirSync({ x: -1, y: 0 });
    if ((e.code === "ArrowRight" || e.code === "KeyD") && d.x === 0) setDirSync({ x: 1, y: 0 });
  };

  useEffect(() => { document.addEventListener("keydown", handleKey); return () => document.removeEventListener("keydown", handleKey); }, [handleKey]);
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
            setUsed((prev) => { const next = new Set(prev); next.add(ap.compound.formula); return next; });
            if (ap.compound.formula === prompt?.formula) { setSnakeLength((l) => l + 1); setFeedback("✓ Correct!"); }
            else { setSnakeLength((l) => l - 0.5); setFeedback(reverseMode ? `✗ Was: ${prompt?.name}` : `✗ Was: ${prompt?.formula}`); }
            pickNewPrompt();
          }
          return !hit;
        }));
        return [head, ...prev].slice(0, Math.floor(snakeLength));
      });
    }, 200);
    return () => clearInterval(interval);
  }, [running, snakeLength, prompt, reverseMode]);

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

    ctx.fillStyle = theme.boardEven;
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        ctx.fillStyle = (gx + gy) % 2 === 0 ? theme.boardEven : theme.boardOdd;
        ctx.fillRect(gx * CELL_SIZE, gy * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    snake.forEach((s, i) => {
      if (i === 0) {
        ctx.fillStyle = theme.snakeHead;
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = theme.snakeBody;
      }
      ctx.beginPath();
      ctx.roundRect(s.x * CELL_SIZE + 1, s.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
      ctx.fill();
    });

    apples.forEach((a) => {
      const cx = (a.x + a.size / 2) * CELL_SIZE;
      const cy = (a.y + a.size / 2) * CELL_SIZE;
      const r = (a.size / 2) * CELL_SIZE - 3;

      ctx.shadowBlur = 18;
      ctx.shadowColor = theme.appleGlow;
      ctx.fillStyle = theme.apple;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.25, cy - r * 0.3, r * 0.35, r * 0.22, -0.5, 0, Math.PI * 2);
      ctx.fill();

      const text = reverseMode ? a.compound.name : a.compound.formula;
      ctx.fillStyle = theme.appleText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 11px monospace";
      const maxWidth = r * 1.7;
      const words = text.split(" ");
      const lines: string[] = [];
      let cur = words[0];
      for (let i = 1; i < words.length; i++) {
        const test = cur + " " + words[i];
        if (ctx.measureText(test).width < maxWidth) cur = test;
        else { lines.push(cur); cur = words[i]; }
      }
      lines.push(cur);
      const lh = 12;
      const startY = cy - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, idx) => ctx.fillText(line, cx, startY + idx * lh));
    });
  }, [snake, apples, snakeLength, reverseMode, theme]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setApples((prev) => {
        let next = [...prev];
        const existing = new Set(next.map((a) => a.compound.formula));
        if (next.length > MIN_APPLES && Math.random() < 0.35) {
          const removable = next.filter((a) => a.compound.formula !== prompt?.formula);
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
  }, [running, prompt, reverseMode]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setApples((prev) => {
        if (prev.length <= MIN_APPLES) return prev;
        const removable = prev.filter((a) => a.compound.formula !== prompt?.formula);
        if (removable.length === 0) return prev;
        if (Math.random() < 0.3) { const rm = removable[Math.floor(Math.random() * removable.length)]; return prev.filter((a) => a !== rm); }
        return prev;
      });
    }, 1000 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [running, prompt]);

  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  const typeColor: Record<string, string> = {
    "ionic compound": "#2563eb",
    "molecular compound": "#7c3aed",
    "acid": "#dc2626",
    "organic molecule": "#16a34a",
  };
  const promptTypeColor = prompt ? (typeColor[prompt.type] ?? theme.promptIdle) : theme.promptIdle;
  const panelStyle: React.CSSProperties = {
    background: theme.surface,
    border: `1px solid ${theme.surfaceBorder}`,
    borderRadius: 12,
    boxShadow: theme.surfaceShadow,
  };
  const primaryButtonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${theme.primaryButtonBorder}`,
    background: theme.primaryButtonBg,
    color: theme.primaryButtonText,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  };
  const secondaryButtonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${theme.secondaryButtonBorder}`,
    background: theme.secondaryButtonBg,
    color: theme.secondaryButtonText,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, color: theme.pageText, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px", fontFamily: "inherit" }}>

      <div className="snake-game-header" style={{ width: "100%", maxWidth: canvasW + 240, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#1d4ed8", letterSpacing: "-0.5px" }}>🧪 Snake</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>Nomenclature</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setReverseMode((p) => !p)}
            className="snake-action-button snake-action-button-primary"
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#1d4ed8", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
          >
            {reverseMode ? "📝 Name Mode" : "⚗️ Formula Mode"}
          </button>
          {hasSeenIntro && (
            <button
              onClick={openIntro}
              className="snake-action-button snake-action-button-secondary"
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >
              ? How to Play
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          ...panelStyle,
          width: "100%",
          maxWidth: canvasW + 240,
          marginBottom: 14,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 62,
        }}
      >
        {prompt ? (
          <>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
              Find the {reverseMode ? "name" : "formula"} →
            </span>
            <span style={{
              fontSize: 13, fontWeight: 700, color: promptTypeColor,
              background: `${promptTypeColor}18`, border: `1px solid ${promptTypeColor}44`,
              borderRadius: 6, padding: "2px 10px", whiteSpace: "nowrap"
            }}>
              {prompt.type}
            </span>
            <span className="dark:text-slate-100" style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", flex: 1, textAlign: "center" }}>
              {reverseMode ? prompt.formula : prompt.name}
            </span>
            {!running && !msg && gameReady && (
              <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", animation: "pulse 1.5s infinite" }}>
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
            <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: theme.introOverlay, borderRadius: 8 }}>
              <div style={{ width: 300, padding: 24, textAlign: "center", fontFamily: "inherit" }}>
                <img src={step.image} alt={step.title} style={{ width: "100%", borderRadius: 8, marginBottom: 14, border: `1px solid ${theme.surfaceBorder}` }} />
                <h2 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 800, color: theme.textStrong }}>{step.title}</h2>
                <p style={{ fontSize: 13, color: theme.text, marginBottom: 6 }}>{step.body}</p>
                <p style={{ fontSize: 11, color: theme.textMuted }}>{step.sub}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "14px 0" }}>
                  {INTRO_STEPS.map((_, i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === introStep ? theme.titleAccent : theme.progressTrack, border: i === introStep ? "none" : `1px solid ${theme.progressTrackBorder}` }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {introStep > 0
                    ? <button onClick={() => setIntroStep(s => s - 1)} style={secondaryButtonStyle}>Back</button>
                    : <div />}
                  {introStep < INTRO_STEPS.length - 1
                    ? <button onClick={() => setIntroStep(s => s + 1)} style={primaryButtonStyle}>Next</button>
                    : <button onClick={closeIntro} style={{ ...primaryButtonStyle, background: "#166534", border: "1px solid #22c55e", color: "#f0fdf4" }}>{hasSeenIntro ? "Resume" : "Start Game"}</button>}
                </div>
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={canvasW}
            height={canvasH}
            style={{
              display: "block",
              borderRadius: 8,
              border: `2px solid ${theme.canvasBorder}`,
              boxShadow: theme.surfaceShadowStrong,
              opacity: (!running && msg && !showIntro) ? 0.35 : 1,
              transition: "opacity 0.3s",
            }}
          />

          {!running && msg && !showIntro && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: theme.overlayCard, padding: "28px 44px", borderRadius: 16, textAlign: "center", border: `1px solid ${theme.surfaceBorder}`, boxShadow: theme.surfaceShadowStrong }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: msg.includes("Won") ? "#16a34a" : "#dc2626", marginBottom: 8 }}>{msg}</div>
                <div style={{ fontSize: 14, color: theme.textMuted }}>Press Space to Restart</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>

          <div style={{ ...panelStyle, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSoft, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Snake Length
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: theme.titleAccent, lineHeight: 1, marginBottom: 10 }}>
              {Math.floor(snakeLength)}
              <span style={{ fontSize: 16, color: theme.textSoft, fontWeight: 400, marginLeft: 6 }}>/ {WIN_LENGTH}</span>
            </div>
            <ProgressBar value={snakeLength} max={WIN_LENGTH} min={MIN_LENGTH} theme={theme} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "#ef4444" }}>☠ {MIN_LENGTH}</span>
              <span style={{ fontSize: 10, color: "#16a34a" }}>🏆 {WIN_LENGTH}</span>
            </div>
          </div>

          <div
            className="dark:bg-slate-900 dark:border-slate-700"
            style={{
              background: "#fff", border: `1px solid ${feedback?.includes("✓") ? "#bbf7d0" : feedback?.includes("✗") ? "#fecaca" : "#e2e8f0"}`,
              borderRadius: 12, padding: "16px 18px", minHeight: 72,
              display: "flex", flexDirection: "column", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Last Answer</div>
            {feedback ? (
              <div style={{ fontSize: 15, fontWeight: 700, color: feedback.includes("✓") ? "#16a34a" : "#dc2626" }}>
                {feedback}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#cbd5e1" }}>—</div>
            )}
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
            {[["↑ ↓ ← →", "Move"], ["Space", "Restart"]].map(([key, action]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#1d4ed8", background: "#eff6ff", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", border: "1px solid #bfdbfe" }}>{key}</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{action}</span>
              </div>
            ))}
          </div>

          <div className="dark:bg-slate-900 dark:border-slate-700" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Current Mode</div>
            <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 700 }}>
              {reverseMode ? "📝 Given formula → find name" : "⚗️ Given name → find formula"}
            </div>
          </div>
        </div>
      </div>

      {rewardPopupOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: theme.modalBackdrop, padding: "0 16px" }}>
          <div style={{ width: "100%", maxWidth: 420, borderRadius: 20, border: `1px solid ${theme.surfaceBorder}`, background: theme.surface, padding: 28, boxShadow: theme.surfaceShadowStrong }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800, color: "#16a34a" }}>🏆 Reward Earned!</h2>
            <p style={{ fontSize: 16, color: theme.text, marginBottom: 16 }}>You earned <strong style={{ color: theme.textStrong }}>{rewardAmount}</strong> glucose.</p>
            {rewardStatus === "loading" && <p style={{ fontSize: 13, color: theme.textSoft }}>Updating glucose...</p>}
            {rewardStatus === "ok" && <p style={{ fontSize: 13, color: "#16a34a" }}>{rewardMessage}</p>}
            {rewardStatus === "error" && <p style={{ fontSize: 13, color: "#dc2626" }}>{rewardMessage}</p>}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setRewardPopupOpen(false)} style={primaryButtonStyle}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .snake-game-header span:first-child {
          color: ${theme.titleAccent} !important;
        }

        .snake-game-header span:last-child {
          color: ${theme.titleText} !important;
        }

        .snake-action-button {
          transition: all 0.15s ease;
        }

        .snake-action-button-primary {
          background: ${theme.primaryButtonBg} !important;
          border-color: ${theme.primaryButtonBorder} !important;
          color: ${theme.primaryButtonText} !important;
        }

        .snake-action-button-secondary {
          background: ${theme.secondaryButtonBg} !important;
          border-color: ${theme.secondaryButtonBorder} !important;
          color: ${theme.secondaryButtonText} !important;
        }
      `}</style>
    </div>
  );
}
