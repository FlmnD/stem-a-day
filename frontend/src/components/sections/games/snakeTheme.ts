"use client";

import { useEffect, useMemo, useState } from "react";

const lightTheme = {
  pageBg: "#f8fafc",
  pageText: "#0f172a",
  surface: "#ffffff",
  surfaceBorder: "#e2e8f0",
  surfaceShadow: "0 1px 4px rgba(0,0,0,0.05)",
  surfaceShadowStrong: "0 4px 24px rgba(0,0,0,0.12)",
  introOverlay: "rgba(255,255,255,0.97)",
  modalBackdrop: "rgba(0,0,0,0.4)",
  titleAccent: "#1d4ed8",
  titleText: "#0f172a",
  textStrong: "#0f172a",
  text: "#475569",
  textMuted: "#64748b",
  textSoft: "#94a3b8",
  emptyText: "#cbd5e1",
  keycapBg: "#eff6ff",
  keycapBorder: "#bfdbfe",
  keycapText: "#1d4ed8",
  primaryButtonBg: "#eff6ff",
  primaryButtonBorder: "#2563eb",
  primaryButtonText: "#1d4ed8",
  secondaryButtonBg: "#ffffff",
  secondaryButtonBorder: "#cbd5e1",
  secondaryButtonText: "#475569",
  canvasBorder: "#cbd5e1",
  overlayCard: "rgba(255,255,255,0.95)",
  boardEven: "#d0f0f0",
  boardOdd: "#c4eaea",
  snakeHead: "#0a8",
  snakeBody: "#0c6",
  apple: "#dc2626",
  appleGlow: "#f97316",
  appleText: "#ffffff",
  promptIdle: "#94a3b8",
  progressTrack: "#e2e8f0",
  progressTrackBorder: "#cbd5e1",
};

const darkTheme = {
  pageBg: "#020617",
  pageText: "#e2e8f0",
  surface: "#0f172a",
  surfaceBorder: "#334155",
  surfaceShadow: "0 1px 4px rgba(0,0,0,0.35)",
  surfaceShadowStrong: "0 8px 40px rgba(0,0,0,0.45)",
  introOverlay: "rgba(2,6,23,0.94)",
  modalBackdrop: "rgba(2,6,23,0.72)",
  titleAccent: "#5eead4",
  titleText: "#f8fafc",
  textStrong: "#f8fafc",
  text: "#cbd5e1",
  textMuted: "#94a3b8",
  textSoft: "#64748b",
  emptyText: "#475569",
  keycapBg: "#0b1220",
  keycapBorder: "#334155",
  keycapText: "#5eead4",
  primaryButtonBg: "#312e81",
  primaryButtonBorder: "#818cf8",
  primaryButtonText: "#eef2ff",
  secondaryButtonBg: "#111827",
  secondaryButtonBorder: "#475569",
  secondaryButtonText: "#cbd5e1",
  canvasBorder: "#475569",
  overlayCard: "rgba(15,23,42,0.94)",
  boardEven: "#10263d",
  boardOdd: "#0d2034",
  snakeHead: "#14b8a6",
  snakeBody: "#22c55e",
  apple: "#fb7185",
  appleGlow: "#f43f5e",
  appleText: "#f8fafc",
  promptIdle: "#94a3b8",
  progressTrack: "#1e293b",
  progressTrackBorder: "#475569",
};

export type SnakeTheme = typeof lightTheme;

export function useSnakeTheme(): SnakeTheme {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));

    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);
}
