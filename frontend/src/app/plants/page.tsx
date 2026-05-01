"use client";

import { useEffect, useMemo, useState } from "react";
import PlantIllustration from "@/components/plants/PlantIllustration";
import { requestSessionUserRefresh } from "@/lib/session-events";
import {
    getNextPlantGrowthStage,
    getPlantGrowthStage,
} from "@/lib/plant-growth";

type Me = { glucose: number };

type CatalogPlant = {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
};

type OwnedPlant = {
    plant_id: string;
    name: string;
    price: number;
    image_url: string | null;
    level: number;
    level_xp: number;
    xp_needed: number;
    accessories: string[];
    acquired_at: string;
};

type NonJsonPayload = {
    __nonJson: true;
    text: string;
};

function asRecord(data: unknown): Record<string, unknown> | null {
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
}

function isNonJsonPayload(data: unknown): data is NonJsonPayload {
    const record = asRecord(data);
    return Boolean(record?.__nonJson) && typeof record?.text === "string";
}

function readMessage(data: unknown, fallback: string) {
    const record = asRecord(data);
    if (typeof record?.detail === "string") return record.detail;
    if (typeof record?.message === "string") return record.message;
    return fallback;
}

function readNumber(data: unknown, key: string): number | null {
    const record = asRecord(data);
    const value = record?.[key];
    return typeof value === "number" ? value : null;
}

async function readJsonOrText(r: Response) {
    const ct = r.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await r.json().catch(() => ({}));
    const text = await r.text().catch(() => "");
    return { __nonJson: true, text };
}

export default function PlantsPage() {
    const [me, setMe] = useState<Me | null>(null);
    const [catalog, setCatalog] = useState<CatalogPlant[]>([]);
    const [inv, setInv] = useState<OwnedPlant[]>([]);

    const [upgradeSpend, setUpgradeSpend] = useState<Record<string, string>>({});
    const [msg, setMsg] = useState<string>("");

    const [isAuthed, setIsAuthed] = useState<boolean>(false);
    const [authResolved, setAuthResolved] = useState<boolean>(false);

    const [buyingId, setBuyingId] = useState<string | null>(null);
    const [sellingId, setSellingId] = useState<string | null>(null);
    const [upgradingId, setUpgradingId] = useState<string | null>(null);
    async function refreshAll() {
        try {
            const catP = fetch("/api/plants/catalog", { cache: "no-store", credentials: "include" });

            const meR = await fetch("/api/me", { cache: "no-store", credentials: "include" });

            const catR = await catP;

            if (catR.ok) setCatalog(await catR.json().catch(() => []));
            else console.error("GET /api/plants/catalog failed", catR.status);

            if (meR.status === 401) {
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                setAuthResolved(true);
                return;
            }

            if (!meR.ok) {
                console.error("GET /api/me failed", meR.status);
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                setAuthResolved(true);
                return;
            }

            setIsAuthed(true);
            setMe(await meR.json().catch(() => null));

            const invR = await fetch("/api/plants/inventory", { cache: "no-store", credentials: "include" });
            if (invR.ok) setInv(await invR.json().catch(() => []));
            else console.error("GET /api/plants/inventory failed", invR.status);
            setAuthResolved(true);
        } catch (e) {
            setAuthResolved(true);
            console.error("refreshAll failed:", e);
        }
    }

    useEffect(() => {
        refreshAll();
    }, []);

    const ownedSet = useMemo(() => new Set(inv.map((p) => p.plant_id)), [inv]);

    async function buy(plantId: string) {
        if (!isAuthed) {
            setMsg("Please log in to buy plants.");
            return;
        }
        if (buyingId) return;

        setMsg("");
        setBuyingId(plantId);

        try {
            setMsg("Buying...");
            const r = await fetch(`/api/plants/buy/${encodeURIComponent(plantId)}`, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (r.status === 401) {
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                setMsg("Session expired — please log in again.");
                return;
            }

            const data = await readJsonOrText(r);
            const record = asRecord(data);

            if (isNonJsonPayload(data)) {
                setMsg(`Buy failed (non-JSON response). First chars: ${String(data.text).slice(0, 120)}`);
                return;
            }

            if (!r.ok || record?.success === false || record?.ok === false) {
                setMsg(readMessage(data, "Buy failed"));
                return;
            }

            setMsg(readMessage(data, "Bought!"));
            await refreshAll();
            requestSessionUserRefresh();
        } catch (e: unknown) {
            setMsg(`Buy failed: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setBuyingId(null);
        }
    }

    async function sell(plantId: string, basePrice: number) {
        if (!isAuthed) {
            setMsg("Please log in to sell plants.");
            return;
        }
        if (sellingId) return;

        const ok = confirm(
            `Sell this plant for ${basePrice} glucose?\n\nWarning: You will NOT get back glucose you spent leveling it up.`
        );
        if (!ok) return;

        setMsg("");
        setSellingId(plantId);

        try {
            setMsg("Selling...");
            const r = await fetch(`/api/plants/sell/${encodeURIComponent(plantId)}`, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (r.status === 401) {
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                setMsg("Session expired — please log in again.");
                return;
            }

            const data = await readJsonOrText(r);
            const record = asRecord(data);

            if (isNonJsonPayload(data)) {
                setMsg(`Sell failed (non-JSON response). First chars: ${String(data.text).slice(0, 120)}`);
                return;
            }

            if (!r.ok || record?.success === false || record?.ok === false) {
                setMsg(readMessage(data, "Sell failed"));
                return;
            }

            setMsg(`${readMessage(data, "Sold!")} ${readNumber(data, "refund") ?? basePrice} glucose refunded.`.trim());
            await refreshAll();
            requestSessionUserRefresh();
        } catch (e: unknown) {
            setMsg(`Sell failed: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setSellingId(null);
        }
    }

    async function upgrade(plantId: string) {
        if (!isAuthed) {
            setMsg("Please log in to upgrade plants.");
            return;
        }
        if (upgradingId) return;

        const raw = upgradeSpend[plantId];
        const spend = raw == null ? 25 : Math.trunc(Number(raw));

        if (!Number.isFinite(spend) || spend <= 0) {
            setMsg("Enter a spend amount > 0.");
            return;
        }

        setMsg("");
        setUpgradingId(plantId);

        try {
            setMsg("Upgrading...");
            const r = await fetch(`/api/plants/upgrade/${encodeURIComponent(plantId)}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ spend }),
            });

            if (r.status === 401) {
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                setMsg("Session expired — please log in again.");
                return;
            }

            const data = await readJsonOrText(r);
            const record = asRecord(data);

            if (isNonJsonPayload(data)) {
                setMsg(`Upgrade failed (non-JSON response). First chars: ${String(data.text).slice(0, 120)}`);
                return;
            }

            if (!r.ok || record?.success === false || record?.ok === false) {
                setMsg(readMessage(data, "Upgrade failed"));
                return;
            }

            if (typeof data?.used === "number" && typeof data?.gained_xp === "number") {
                setMsg(`Upgraded! Used ${data.used} glucose → +${data.gained_xp} XP`);
            } else {
                setMsg(data?.message ?? "Upgraded!");
            }

            await refreshAll();
            requestSessionUserRefresh();
        } catch (e: unknown) {
            setMsg(`Upgrade failed: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setUpgradingId(null);
        }
    }

    return (
        <section
            className="min-h-[calc(100dvh-3.5rem)] px-6 py-10
        bg-linear-to-b from-sky-50 via-white to-white
        dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-sky-800 dark:text-slate-100 mb-2">Plants</h1>
                    <p className="mt-2 text-gray-600 dark:text-slate-300">Buy, upgrade, and manage your plants.</p>
                </div>

                <div className="flex items-center gap-2 bg-white/80 shadow-sm px-4 py-2 rounded-xl border border-sky-100 backdrop-blur
                        dark:bg-slate-950/60 dark:border-slate-700">
                    <span className="text-2xl">🧪</span>
                    <span className="text-lg font-semibold text-sky-700 dark:text-slate-100">
                        {!authResolved ? "..." : isAuthed && me ? me.glucose : "—"}
                    </span>
                </div>
            </div>

            {!isAuthed && authResolved && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900
                        dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                    You’re not logged in. You can browse the shop, but you must log in to buy, sell, or upgrade.
                </div>
            )}

            {msg && (
                <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800
                        dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100">
                    {msg}
                </div>
            )}

            {/* SHOP */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-sky-700 dark:text-slate-100 mb-6">Shop</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {catalog.map((p) => {
                        const owned = ownedSet.has(p.id);
                        const isBuyingThis = buyingId === p.id;

                        return (
                            <div
                                key={p.id}
                                className="rounded-2xl p-6 border border-sky-100 bg-white shadow-md
                           dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                            >
                                <div className="hidden h-32 rounded-lg flex items-center justify-center mb-4 text-4xl
                                bg-sky-50 text-sky-300
                                dark:bg-slate-900/60 dark:text-teal-200/80">
                                    🌱
                                </div>

                                <div className="mb-4 h-32 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/80
                                dark:border-slate-700 dark:bg-slate-900/60">
                                    <PlantIllustration
                                        plantId={p.id}
                                        level={15}
                                        name={p.name}
                                        className="h-full w-full"
                                    />
                                </div>

                                <h3 className="text-lg font-semibold text-sky-800 dark:text-slate-100">{p.name}</h3>

                                <div className="mt-4 flex justify-between items-center">
                                    <span className="font-semibold text-sky-700 dark:text-slate-200">{p.price} 🧪</span>

                                    <button
                                        type="button"
                                        disabled={!isAuthed || owned || !!buyingId}
                                        onClick={() => buy(p.id)}
                                        className="rounded-2xl px-4 py-2 text-sm font-semibold
                               bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50
                               dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                                        title={!authResolved || isAuthed ? owned ? "Already owned" : "" : "Log in to buy"}
                                    >
                                        {!authResolved
                                            ? "Checking..."
                                            : !isAuthed
                                                ? "Log in"
                                                : owned
                                                    ? "Owned"
                                                    : isBuyingThis
                                                        ? "Buying..."
                                                        : "Buy"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-sky-700 dark:text-slate-100 mb-6">Your Inventory</h2>

                {!authResolved ? (
                    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm text-gray-500
                          dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                        Loading your garden...
                    </div>
                ) : !isAuthed ? (
                    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm text-gray-500
                          dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                        Log in to view your inventory.
                    </div>
                ) : inv.length === 0 ? (
                    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm text-gray-500
                          dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                        You haven’t purchased any plants yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {inv.map((p) => {
                            const percent =
                                p.xp_needed > 0 ? Math.min(100, Math.round((p.level_xp / p.xp_needed) * 100)) : 0;

                            const isSellingThis = sellingId === p.plant_id;
                            const isUpgradingThis = upgradingId === p.plant_id;
                            const currentGrowthStage = getPlantGrowthStage(p.level);
                            const nextGrowthStage = getNextPlantGrowthStage(p.level);
                            const currentImageStage = currentGrowthStage;
                            const inventoryImageSrc: string | null = null;
                            const inventoryImageStateKey = "";
                            const inventoryImageIndex = 0;
                            const setInventoryImageIndexes = (
                                updater: (prev: Record<string, number>) => Record<string, number>
                            ) => {
                                updater({});
                            };

                            return (
                                <div
                                    key={p.plant_id}
                                    className="rounded-2xl p-6 border border-sky-100 bg-white shadow-md
                             dark:border-slate-700 dark:bg-slate-950/60 dark:shadow-black/30"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-sky-800 dark:text-slate-100">{p.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                                                Level {p.level} • {percent}%
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={!!sellingId || !!upgradingId}
                                            onClick={() => sell(p.plant_id, p.price)}
                                            className="rounded-2xl border px-4 py-2 text-sm font-semibold disabled:opacity-50
                                 border-red-200 text-red-700 hover:bg-red-50
                                 dark:border-red-900/40 dark:text-red-200 dark:hover:bg-red-950/30"
                                        >
                                            {isSellingThis ? "Selling..." : "Sell"}
                                        </button>
                                    </div>

                                    <div className="mt-4 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/80
                                        dark:border-slate-700 dark:bg-slate-900/60">
                                        <PlantIllustration
                                            plantId={p.plant_id}
                                            level={p.level}
                                            name={p.name}
                                            className="h-36 w-full px-3 py-2"
                                        />
                                    </div>

                                    <div className="hidden mt-4 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/80
                                        dark:border-slate-700 dark:bg-slate-900/60">
                                        {inventoryImageSrc ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={inventoryImageSrc}
                                                alt={`${p.name} stage ${currentImageStage}`}
                                                className="h-36 w-36 object-contain p-5"
                                                onError={() => {
                                                    setInventoryImageIndexes((prev) => ({
                                                        ...prev,
                                                        [inventoryImageStateKey]: inventoryImageIndex + 1,
                                                    }));
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-36 items-center justify-center text-6xl text-sky-300 dark:text-teal-200/80">
                                                ðŸŒ±
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                        <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 font-semibold text-sky-700
                                            dark:border-slate-700 dark:bg-slate-900/60 dark:text-teal-200">
                                            Growth stage {currentGrowthStage}
                                        </span>
                                        <span className="text-gray-500 dark:text-slate-400">
                                            {nextGrowthStage === null
                                                ? "Final appearance unlocked."
                                                : `Next growth stage unlocks at level ${nextGrowthStage}.`}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900/60">
                                            <div
                                                className="h-2 bg-sky-500 dark:bg-teal-400"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                                            XP: {p.level_xp} / {p.xp_needed}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                                        <input
                                            type="number"
                                            min={1}
                                            step={1}
                                            value={upgradeSpend[p.plant_id] ?? "25"}
                                            onChange={(e) => {
                                                const v = e.target.value; // "" or numeric string
                                                if (v === "" || /^\d+$/.test(v)) {
                                                    setUpgradeSpend((prev) => ({ ...prev, [p.plant_id]: v }));
                                                }
                                            }}
                                            className="w-full sm:w-40 rounded-2xl border bg-white px-4 py-3 text-sm outline-none
                                 border-slate-200 text-slate-900 focus:border-sky-400
                                 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-teal-400"
                                        />

                                        <button
                                            type="button"
                                            disabled={!!sellingId || !!upgradingId}
                                            onClick={() => upgrade(p.plant_id)}
                                            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50
                                 bg-sky-600 hover:bg-sky-700
                                 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
                                        >
                                            {isUpgradingThis ? "Upgrading..." : "Spend glucose → XP"}
                                        </button>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
                                        Upgrades spend glucose permanently. Selling refunds only the base price.
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
