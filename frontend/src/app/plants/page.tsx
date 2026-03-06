"use client";

import { useEffect, useMemo, useState } from "react";

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
    const [upgradeSpend, setUpgradeSpend] = useState<Record<string, number>>({});
    const [msg, setMsg] = useState<string>("");

    const [isAuthed, setIsAuthed] = useState<boolean>(false);

    const [buyingId, setBuyingId] = useState<string | null>(null);
    const [sellingId, setSellingId] = useState<string | null>(null);
    const [upgradingId, setUpgradingId] = useState<string | null>(null);

    async function refreshAll() {
        try {
            // Always load catalog (public shop preview)
            const catP = fetch("/api/plants/catalog", { cache: "no-store", credentials: "include" });

            // Check auth first
            const meR = await fetch("/api/me", { cache: "no-store", credentials: "include" });

            // Wait for catalog either way
            const catR = await catP;

            if (catR.ok) setCatalog(await catR.json().catch(() => []));
            else console.error("GET /api/plants/catalog failed", catR.status);

            if (meR.status === 401) {
                // Logged out: don't treat as an error
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                return;
            }

            if (!meR.ok) {
                console.error("GET /api/me failed", meR.status);
                setIsAuthed(false);
                setMe(null);
                setInv([]);
                return;
            }

            // Logged in
            setIsAuthed(true);
            setMe(await meR.json().catch(() => null));

            // Only fetch inventory if authenticated
            const invR = await fetch("/api/plants/inventory", { cache: "no-store", credentials: "include" });
            if (invR.ok) setInv(await invR.json().catch(() => []));
            else console.error("GET /api/plants/inventory failed", invR.status);
        } catch (e) {
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

            const data: any = await readJsonOrText(r);

            if (data?.__nonJson) {
                setMsg(`Buy failed (non-JSON response). First chars: ${String(data.text).slice(0, 120)}`);
                return;
            }

            if (!r.ok || data?.success === false || data?.ok === false) {
                setMsg(data?.detail ?? data?.message ?? "Buy failed");
                return;
            }

            setMsg(data?.message ?? "Bought!");
            await refreshAll();
        } catch (e: any) {
            setMsg(`Buy failed: ${e?.message ?? String(e)}`);
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

            const data: any = await readJsonOrText(r);

            if (data?.__nonJson) {
                setMsg(`Sell failed (non-JSON response). First chars: ${String(data.text).slice(0, 120)}`);
                return;
            }

            if (!r.ok || data?.success === false || data?.ok === false) {
                setMsg(data?.detail ?? data?.message ?? "Sell failed");
                return;
            }

            setMsg(data?.message ?? `Sold! Refunded ${data?.refund ?? basePrice} glucose.`);
            await refreshAll();
        } catch (e: any) {
            setMsg(`Sell failed: ${e?.message ?? String(e)}`);
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

        const spend = upgradeSpend[plantId] ?? 0;
        if (spend <= 0) {
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

            const data: any = await readJsonOrText(r);

            if (data?.__nonJson) {
                setMsg(`Upgrade failed (non-JSON response). First chars: ${String(data.text).slice(0, 120)}`);
                return;
            }

            if (!r.ok || data?.success === false || data?.ok === false) {
                setMsg(data?.detail ?? data?.message ?? "Upgrade failed");
                return;
            }

            if (typeof data?.used === "number" && typeof data?.gained_xp === "number") {
                setMsg(`Upgraded! Used ${data.used} glucose → +${data.gained_xp} XP`);
            } else {
                setMsg(data?.message ?? "Upgraded!");
            }

            await refreshAll();
        } catch (e: any) {
            setMsg(`Upgrade failed: ${e?.message ?? String(e)}`);
        } finally {
            setUpgradingId(null);
        }
    }

    return (
        <section className="min-h-[calc(100dvh-3.5rem)] bg-linear-to-b from-sky-50 via-white to-white px-6 py-10">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-sky-800 mb-2">Plants</h1>
                    <p className="mt-2 text-gray-600">Buy, upgrade, and manage your plants.</p>
                </div>

                <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-xl border border-sky-100">
                    <span className="text-2xl">🧪</span>
                    <span className="text-lg font-semibold text-sky-700">{isAuthed && me ? me.glucose : "—"}</span>
                </div>
            </div>

            {!isAuthed && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                    You’re not logged in. You can browse the shop, but you must log in to buy, sell, or upgrade.
                </div>
            )}

            {msg && (
                <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800">
                    {msg}
                </div>
            )}

            {/* SHOP */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-sky-700 mb-6">Shop</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {catalog.map((p) => {
                        const owned = ownedSet.has(p.id);
                        const isBuyingThis = buyingId === p.id;

                        return (
                            <div key={p.id} className="bg-white rounded-2xl shadow-md p-6 border border-sky-100">
                                <div className="h-32 bg-sky-50 rounded-lg flex items-center justify-center mb-4 text-sky-300 text-4xl">
                                    🌱
                                </div>

                                <h3 className="text-lg font-semibold text-sky-800">{p.name}</h3>

                                <div className="mt-4 flex justify-between items-center">
                                    <span className="font-semibold text-sky-700">{p.price} 🧪</span>

                                    <button
                                        type="button"
                                        disabled={!isAuthed || owned || !!buyingId}
                                        onClick={() => buy(p.id)}
                                        className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                                        title={!isAuthed ? "Log in to buy" : owned ? "Already owned" : ""}
                                    >
                                        {!isAuthed ? "Log in" : owned ? "Owned" : isBuyingThis ? "Buying..." : "Buy"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* INVENTORY */}
            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-sky-700 mb-6">Your Inventory</h2>

                {!isAuthed ? (
                    <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm text-gray-500">
                        Log in to view your inventory.
                    </div>
                ) : inv.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm text-gray-500">
                        You haven’t purchased any plants yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {inv.map((p) => {
                            const percent = p.xp_needed > 0 ? Math.min(100, Math.round((p.level_xp / p.xp_needed) * 100)) : 0;

                            const isSellingThis = sellingId === p.plant_id;
                            const isUpgradingThis = upgradingId === p.plant_id;

                            return (
                                <div key={p.plant_id} className="bg-white rounded-2xl shadow-md p-6 border border-sky-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-sky-800">{p.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Level {p.level} • {percent}%
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={!!sellingId || !!upgradingId}
                                            onClick={() => sell(p.plant_id, p.price)}
                                            className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            {isSellingThis ? "Selling..." : "Sell"}
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-2 bg-sky-500" style={{ width: `${percent}%` }} />
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            XP: {p.level_xp} / {p.xp_needed}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                                        <input
                                            type="number"
                                            min={1}
                                            step={1}
                                            value={upgradeSpend[p.plant_id] ?? 50}
                                            onChange={(e) =>
                                                setUpgradeSpend((prev) => ({
                                                    ...prev,
                                                    [p.plant_id]: parseInt(e.target.value || "0", 10),
                                                }))
                                            }
                                            className="w-full sm:w-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-400"
                                        />

                                        <button
                                            type="button"
                                            disabled={!!sellingId || !!upgradingId}
                                            onClick={() => upgrade(p.plant_id)}
                                            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                                        >
                                            {isUpgradingThis ? "Upgrading..." : "Spend glucose → XP"}
                                        </button>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-500">
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