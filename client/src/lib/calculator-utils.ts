import { addMonths, differenceInMonths, format } from "date-fns";

export type IndexType = "ICL" | "IPC" | "CasaPropia" | "CAC" | "CER" | "IS" | "IPIM" | "UVA";

export const INDICES: IndexType[] = ["ICL", "IPC", "CasaPropia", "CAC", "CER", "IS", "IPIM", "UVA"];

export interface CalculationResult {
    oldAmount: number;
    newAmount: number;
    percentage: number;
    details: string;
}

// Mock data for indices (annual inflation rates for demonstration)
const MOCK_INDICES_RATES: Record<IndexType, number> = {
    ICL: 1.5, // ~150% annual
    IPC: 1.8, // ~180% annual
    CasaPropia: 1.0, // ~100% annual
    CAC: 1.4,
    CER: 1.6,
    IS: 1.2,
    IPIM: 1.7,
    UVA: 1.8
};

export function calculateRentAdjustment(
    initialRent: number,
    startDate: Date,
    frequencyMonths: number,
    indexType: IndexType
): CalculationResult {
    // Simple mock calculation logic
    // In a real app, this would fetch historical index values from an API

    const today = new Date();
    const monthsPassed = differenceInMonths(today, startDate);

    // Calculate how many adjustments would have happened
    const adjustmentsCount = Math.floor(monthsPassed / frequencyMonths);

    if (adjustmentsCount <= 0) {
        return {
            oldAmount: initialRent,
            newAmount: initialRent,
            percentage: 0,
            details: "No han pasado suficientes meses para la primera actualización."
        };
    }

    // Mock compound interest calculation based on the index rate
    // We assume the rate is annual, so we convert to the period rate
    const annualRate = MOCK_INDICES_RATES[indexType];
    const periodRate = (annualRate / 12) * frequencyMonths;

    let currentRent = initialRent;

    for (let i = 0; i < adjustmentsCount; i++) {
        currentRent = currentRent * (1 + periodRate);
    }

    const percentageIncrease = ((currentRent - initialRent) / initialRent) * 100;

    return {
        oldAmount: initialRent,
        newAmount: Math.round(currentRent),
        percentage: parseFloat(percentageIncrease.toFixed(2)),
        details: `Actualizado ${adjustmentsCount} veces según índice ${indexType}.`
    };
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(amount);
}
