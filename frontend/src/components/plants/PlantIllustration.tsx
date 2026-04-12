"use client";

import { getPlantGrowthStage, type PlantGrowthStage } from "@/lib/plant-growth";

type PlantIllustrationProps = {
    plantId: string;
    level: number;
    name: string;
    className?: string;
};

const PALETTE = {
    sky: "#e0f2fe",
    skyDark: "#082f49",
    pot: "#c2410c",
    potShade: "#9a3412",
    soil: "#5b3716",
    soilSpeck: "#8b5e34",
    seed: "#8b5a2b",
    seedHighlight: "#b6854d",
    stem: "#2f855a",
    fernLeaf: "#16a34a",
    fernLeafDark: "#15803d",
    cactus: "#2f9e44",
    cactusShade: "#237537",
    cactusBloom: "#f472b6",
    bonsaiLeaf: "#65a30d",
    bonsaiLeafDark: "#3f6212",
    bonsaiTrunk: "#7c4a2d",
};

export default function PlantIllustration({
    plantId,
    level,
    name,
    className = "",
}: PlantIllustrationProps) {
    const stage = getPlantGrowthStage(level);

    return (
        <div
            className={`relative h-full w-full overflow-hidden rounded-[1.25rem] bg-linear-to-b from-sky-100 via-sky-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 ${className}`.trim()}
            aria-label={`${name} growth stage ${stage}`}
        >
            <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-hidden="true">
                <rect x="0" y="0" width="200" height="200" fill="transparent" />
                <ellipse cx="100" cy="178" rx="56" ry="12" fill="rgba(15, 23, 42, 0.14)" />
                <g>
                    <path d="M58 108h84l-10 58H68z" fill={PALETTE.pot} />
                    <path d="M58 108h84l-4 12H62z" fill={PALETTE.potShade} opacity="0.42" />
                    <ellipse cx="100" cy="108" rx="42" ry="10" fill={PALETTE.soil} />
                    <ellipse cx="100" cy="108" rx="34" ry="7" fill={PALETTE.soilSpeck} opacity="0.35" />
                </g>
                {stage === 0 ? <SeedStage /> : renderPlantStage(plantId, stage)}
            </svg>
        </div>
    );
}

function renderPlantStage(plantId: string, stage: PlantGrowthStage) {
    switch (plantId) {
        case "fern":
            return <FernStage stage={stage} />;
        case "cactus":
            return <CactusStage stage={stage} />;
        case "bonsai":
            return <BonsaiStage stage={stage} />;
        default:
            return <GenericSproutStage stage={stage} />;
    }
}

function SeedStage() {
    return (
        <g>
            <ellipse cx="98" cy="101" rx="9" ry="13" fill={PALETTE.seed} transform="rotate(-18 98 101)" />
            <ellipse cx="100" cy="97" rx="3" ry="5" fill={PALETTE.seedHighlight} opacity="0.75" transform="rotate(-18 100 97)" />
            <path d="M89 109c4 2 12 2 18 0" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
    );
}

function GenericSproutStage({ stage }: { stage: PlantGrowthStage }) {
    const height = stage === 5 ? 24 : stage === 10 ? 42 : 58;
    return (
        <g>
            <path d={`M100 110v-${height}`} fill="none" stroke={PALETTE.stem} strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="86" cy={108 - height + 16} rx="12" ry="7" fill={PALETTE.fernLeaf} transform={`rotate(${-30} 86 ${108 - height + 16})`} />
            <ellipse cx="114" cy={108 - height + 6} rx="12" ry="7" fill={PALETTE.fernLeafDark} transform={`rotate(${28} 114 ${108 - height + 6})`} />
            {stage >= 10 && (
                <ellipse cx="100" cy={108 - height - 4} rx="10" ry="6" fill={PALETTE.fernLeaf} />
            )}
        </g>
    );
}

function FernStage({ stage }: { stage: PlantGrowthStage }) {
    if (stage === 5) {
        return (
            <g>
                <path d="M100 110V86" fill="none" stroke={PALETTE.stem} strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="89" cy="90" rx="11" ry="6" fill={PALETTE.fernLeaf} transform="rotate(-32 89 90)" />
                <ellipse cx="111" cy="83" rx="11" ry="6" fill={PALETTE.fernLeafDark} transform="rotate(28 111 83)" />
            </g>
        );
    }

    if (stage === 10) {
        return (
            <g>
                <path d="M100 110V66" fill="none" stroke={PALETTE.stem} strokeWidth="5" strokeLinecap="round" />
                <FernFrond x={100} y={74} scale={0.95} side="left" />
                <FernFrond x={104} y={64} scale={1.02} side="right" />
                <FernFrond x={96} y={84} scale={0.82} side="left" />
            </g>
        );
    }

    return (
        <g>
            <path d="M100 110V54" fill="none" stroke={PALETTE.stem} strokeWidth="5" strokeLinecap="round" />
            <FernFrond x={94} y={72} scale={1.12} side="left" />
            <FernFrond x={108} y={60} scale={1.18} side="right" />
            <FernFrond x={100} y={52} scale={0.96} side="left" />
            <FernFrond x={100} y={88} scale={0.88} side="right" />
        </g>
    );
}

function FernFrond({
    x,
    y,
    scale,
    side,
}: {
    x: number;
    y: number;
    scale: number;
    side: "left" | "right";
}) {
    const direction = side === "left" ? -1 : 1;
    const leafColor = side === "left" ? PALETTE.fernLeaf : PALETTE.fernLeafDark;

    return (
        <g transform={`translate(${x} ${y}) scale(${direction * scale} ${scale})`}>
            <path d="M0 36C10 28 18 16 22 0" fill="none" stroke={PALETTE.stem} strokeWidth="3.5" strokeLinecap="round" />
            {[
                { x: 4, y: 29, w: 14, h: 6, r: -26 },
                { x: 9, y: 22, w: 16, h: 7, r: -20 },
                { x: 12, y: 15, w: 15, h: 6, r: -10 },
                { x: 15, y: 9, w: 13, h: 5, r: -2 },
            ].map((leaf, index) => (
                <ellipse
                    key={`${x}-${y}-${index}`}
                    cx={leaf.x}
                    cy={leaf.y}
                    rx={leaf.w}
                    ry={leaf.h}
                    fill={leafColor}
                    transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`}
                />
            ))}
        </g>
    );
}

function CactusStage({ stage }: { stage: PlantGrowthStage }) {
    if (stage === 5) {
        return (
            <g>
                <path d="M100 110v-22" fill="none" stroke={PALETTE.cactus} strokeWidth="16" strokeLinecap="round" />
                <path d="M95 92c2-3 2-8 0-11M105 92c-2-3-2-8 0-11" fill="none" stroke="#d9f99d" strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }

    if (stage === 10) {
        return (
            <g>
                <path d="M100 110V68" fill="none" stroke={PALETTE.cactus} strokeWidth="18" strokeLinecap="round" />
                <path d="M100 86c16 0 17-17 9-22" fill="none" stroke={PALETTE.cactus} strokeWidth="12" strokeLinecap="round" />
                <path d="M94 94c2-5 2-11 0-17M100 96c0-6 0-12 0-18M106 94c-2-5-2-11 0-17" fill="none" stroke="#d9f99d" strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }

    return (
        <g>
            <path d="M100 110V56" fill="none" stroke={PALETTE.cactus} strokeWidth="20" strokeLinecap="round" />
            <path d="M100 84c20 0 22-23 11-30" fill="none" stroke={PALETTE.cactus} strokeWidth="13" strokeLinecap="round" />
            <path d="M100 74c-18 0-20-20-10-27" fill="none" stroke={PALETTE.cactusShade} strokeWidth="13" strokeLinecap="round" />
            <path d="M92 98c2-8 2-20 0-28M100 101c0-11 0-23 0-35M108 98c-2-8-2-20 0-28" fill="none" stroke="#dcfce7" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="100" cy="48" r="7" fill={PALETTE.cactusBloom} />
            <circle cx="95" cy="46" r="4" fill="#f9a8d4" />
            <circle cx="105" cy="46" r="4" fill="#f9a8d4" />
        </g>
    );
}

function BonsaiStage({ stage }: { stage: PlantGrowthStage }) {
    if (stage === 5) {
        return (
            <g>
                <path d="M100 110V86" fill="none" stroke={PALETTE.stem} strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="90" cy="90" rx="11" ry="6" fill={PALETTE.bonsaiLeaf} transform="rotate(-26 90 90)" />
                <ellipse cx="110" cy="83" rx="11" ry="6" fill={PALETTE.bonsaiLeafDark} transform="rotate(24 110 83)" />
            </g>
        );
    }

    if (stage === 10) {
        return (
            <g>
                <path d="M100 110C101 97 98 84 104 70" fill="none" stroke={PALETTE.bonsaiTrunk} strokeWidth="7" strokeLinecap="round" />
                <path d="M101 92c-14-2-18-12-16-19" fill="none" stroke={PALETTE.bonsaiTrunk} strokeWidth="4.5" strokeLinecap="round" />
                <ellipse cx="92" cy="71" rx="16" ry="12" fill={PALETTE.bonsaiLeafDark} />
                <ellipse cx="108" cy="64" rx="20" ry="14" fill={PALETTE.bonsaiLeaf} />
                <ellipse cx="122" cy="73" rx="13" ry="10" fill={PALETTE.bonsaiLeafDark} />
            </g>
        );
    }

    return (
        <g>
            <path d="M100 110C102 100 97 89 105 76C113 63 109 57 102 49" fill="none" stroke={PALETTE.bonsaiTrunk} strokeWidth="8" strokeLinecap="round" />
            <path d="M103 88C91 83 84 72 87 61" fill="none" stroke={PALETTE.bonsaiTrunk} strokeWidth="5" strokeLinecap="round" />
            <path d="M108 76c15-3 24-13 25-24" fill="none" stroke={PALETTE.bonsaiTrunk} strokeWidth="4.5" strokeLinecap="round" />
            <ellipse cx="88" cy="62" rx="17" ry="12" fill={PALETTE.bonsaiLeafDark} />
            <ellipse cx="105" cy="52" rx="23" ry="16" fill={PALETTE.bonsaiLeaf} />
            <ellipse cx="125" cy="63" rx="18" ry="13" fill={PALETTE.bonsaiLeafDark} />
            <ellipse cx="110" cy="70" rx="20" ry="12" fill={PALETTE.bonsaiLeaf} opacity="0.92" />
        </g>
    );
}
