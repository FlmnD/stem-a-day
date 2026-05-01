export const PLANT_GROWTH_STAGES = [0, 5, 10, 15] as const;

export type PlantGrowthStage = (typeof PLANT_GROWTH_STAGES)[number];

export function getPlantGrowthStage(level: number): PlantGrowthStage {
    if (level >= 15) return 15;
    if (level >= 10) return 10;
    if (level >= 5) return 5;
    return 0;
}

export function getNextPlantGrowthStage(level: number): PlantGrowthStage | null {
    for (const stage of PLANT_GROWTH_STAGES) {
        if (stage > level) {
            return stage;
        }
    }
    return null;
}
