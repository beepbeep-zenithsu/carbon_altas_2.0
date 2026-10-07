import type { ActivityGroup, CalculationResult } from './types';

export interface ComparisonResult {
  text: string;
}

// Human-friendly labels used only for comparison sentences. UI copy for
// navigation/cards lives in features/assessment/categoryConfig.ts — this
// is kept local and minimal so the domain layer stays UI-agnostic.
const GROUP_LABELS: Record<ActivityGroup, string> = {
  stationary_combustion: 'stationary combustion',
  biomass_waste_fuels: 'biomass and waste fuel',
  mobile_combustion: 'mobile combustion',
  fugitive_emissions: 'fugitive (refrigerant) emissions',
  purchased_electricity: 'purchased electricity',
  purchased_energy: 'purchased steam, heat and cooling',
};

export function generateComparison(result: CalculationResult): ComparisonResult {
  if (result.totalEmissionsKg === 0) {
    return { text: 'No emissions recorded for this period.' };
  }

  const entries = Object.entries(result.totalsByGroup) as [ActivityGroup, number][];
  const nonZero = entries.filter(([, value]) => value > 0).sort(([, a], [, b]) => b - a);

  if (nonZero.length === 0) {
    return { text: 'Emissions are balanced or no comparison is available.' };
  }

  if (nonZero.length === 1) {
    const [group] = nonZero[0];
    return { text: `${GROUP_LABELS[group]} is your sole source of recorded emissions.` };
  }

  const [[topGroup, topValue], [secondGroup, secondValue]] = nonZero;
  const ratio = topValue / secondValue;

  if (ratio === 1) {
    return { text: `Your ${GROUP_LABELS[topGroup]} and ${GROUP_LABELS[secondGroup]} emissions are exactly equal.` };
  }

  return {
    text: `Your ${GROUP_LABELS[topGroup]} emissions are ${ratio.toFixed(1)}x greater than your next largest source, ${GROUP_LABELS[secondGroup]}.`,
  };
}
