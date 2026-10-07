import type { ActivityGroup, CalculationResult, EmissionFactor } from './types';
import { calculateEmissions } from './calculate';

export interface Recommendation {
  title: string;
  description: string;
  estimatedSavingKg?: number;
}

interface RecommendationCopy {
  title: string;
  description: string;
}

// Static guidance per module — this is the copy the user sees on the Carbon Report page.
const GROUP_RECOMMENDATIONS: Record<ActivityGroup, RecommendationCopy> = {
  stationary_combustion: {
    title: 'Reduce Stationary Fuel Use',
    description: 'Natural gas, CNG and diesel burned in generators, boilers and production machinery are your direct fuel emissions. Boiler tuning, steam-line insulation and load-matching generators to demand are the quickest ways to cut them.',
  },
  biomass_waste_fuels: {
    title: 'Review Biomass & Waste Fuel Sourcing',
    description: 'Biomass and fabric waste are modelled with a combustion factor even when sustainably sourced. Moving to certified biomass, improving boiler efficiency and reducing the waste that needs burning all lower this share.',
  },
  mobile_combustion: {
    title: 'Optimize Factory-Owned Vehicles',
    description: 'Route planning, scheduled maintenance, driver training and shifting petrol or diesel vehicles toward CNG or electric options can meaningfully cut fuel use across the factory-owned fleet.',
  },
  fugitive_emissions: {
    title: 'Tighten Refrigerant Leakage',
    description: 'Routine leak detection and repair on cooling equipment is the fastest way to cut refrigerant losses. Because most refrigerants carry a GWP in the thousands, even small leaks matter — and low-GWP replacements help further.',
  },
  purchased_electricity: {
    title: 'Improve Electricity Efficiency',
    description: 'Improving electricity efficiency can reduce operational emissions. LED retrofits, HVAC scheduling, load management and expanding on-site solar are practical first steps.',
  },
  purchased_energy: {
    title: 'Review Purchased Energy Contracts',
    description: 'Where possible, switch purchased steam, district heating or chilled water to lower-carbon suppliers, or explore on-site recovery to cut reliance on external supply.',
  },
};

export function generateRecommendations(
  result: CalculationResult,
  allFactors: EmissionFactor[]
): Recommendation[] {
  if (result.totalEmissionsKg === 0) {
    return [
      {
        title: 'Check for omitted activity',
        description: 'Your calculated footprint is zero. Please review your answers to ensure no activities were missed.',
      },
    ];
  }

  const [maxGroup] = (Object.entries(result.totalsByGroup) as [ActivityGroup, number][]).sort(
    ([, a], [, b]) => b - a
  )[0];

  const copy = GROUP_RECOMMENDATIONS[maxGroup];
  const recommendations: Recommendation[] = [];

  // For the leading category, model a 10% reduction scenario on just that
  // category's inputs to give a concrete estimated saving.
  const scenarioInputs = result.items.map(item => ({
    id: item.activityId,
    group: item.group,
    value: item.group === maxGroup ? item.inputQuantity * 0.9 : item.inputQuantity,
    unit: item.inputUnit,
  }));

  try {
    const scenarioResult = calculateEmissions(
      scenarioInputs,
      allFactors,
      result.period,
      result.datasetVersion,
      result.isDemo
    );
    const saving = result.totalEmissionsKg - scenarioResult.totalEmissionsKg;

    recommendations.push({
      title: copy.title,
      description: `${copy.description} A 10% reduction in this area is a realistic starting target.`,
      estimatedSavingKg: saving,
    });
  } catch {
    recommendations.push({ title: copy.title, description: copy.description });
  }

  // Add a secondary, lighter-touch recommendation for the runner-up
  // category so the report never reads as single-issue.
  const sorted = (Object.entries(result.totalsByGroup) as [ActivityGroup, number][])
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a);

  if (sorted.length > 1) {
    const [secondGroup] = sorted[1];
    const secondCopy = GROUP_RECOMMENDATIONS[secondGroup];
    recommendations.push({ title: secondCopy.title, description: secondCopy.description });
  }

  return recommendations;
}
