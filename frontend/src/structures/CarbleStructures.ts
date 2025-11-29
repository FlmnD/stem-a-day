import elementsJSON from "@/components/lib/data/elements.json";

export interface ElementData {
    element_name: string;
    symbol: string;
    atomic_number: number;
    atomic_mass: number;
    ion_charge: number;
    group: number;
    period: number;
    block: string;
    electronegativity: number;
    electron_affinity: number;
    first_ionization_energy: number;
    atomic_radius: number;
};

export interface EasyGuess {
    element_name: string;
    symbol: string;
    atomicNumber: number;
    atomicMass: number;
    ionCharge: number;
};

export interface HardGuess {
    element_name: string;
    symbol: string;
    electronegativity: number;
    electronAffinity: number;
    ionizationEnergy: number;
    atomicRadius: number;
};

export const elementsData: ElementData[] = (elementsJSON as any[]).map((e) => ({
    element_name: e.element_name,
    symbol: e.symbol,
    atomic_number: e.atomic_number,
    atomic_mass: e.atomic_mass,
    ion_charge: e.ion_charge,
    group: e.group,
    period: e.period,
    block: e.block,
    electronegativity: e.electronegativity,
    electron_affinity: e.electron_affinity,
    first_ionization_energy: e.first_ionization_energy,
    atomic_radius: e.atomic_radius,
}));

export enum Guess {
    HardGuess,
    EasyGuess,
};

export type ElementRange = Record<string, number>;
export type AnyGuess = EasyGuess | HardGuess;
