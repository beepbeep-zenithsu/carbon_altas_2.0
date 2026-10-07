import { describe, it, expect } from 'vitest';
import { calculateEmissions } from '../../src/domain/calculate';
import { generateRecommendations } from '../../src/domain/recommend';
import type { ActivityInput, ActivityGroup, EmissionFactor } from '../../src/domain/types';
import emissionFactors from '../../src/data/factors.json';
import activities from '../../src/data/activities.json';
import tarasimaExamples from '../../src/data/examples/tarasima.json';

describe('Calculation Engine', () => {
  const mockFactors: EmissionFactor[] = [
    {
      id: 'f_grid_electricity',
      applicableActivity: 'grid_electricity',
      numericValue: 0.5,
      unit: 'kWh',
      outputBasis: 'kgCO2e',
      sourceReference: 'test',
      verificationStatus: 'verified'
    },
    {
      id: 'f_boiler_fuel',
      applicableActivity: 'boiler_fuel',
      numericValue: 2,
      unit: 'litres',
      outputBasis: 'kgCO2e',
      sourceReference: 'test',
      verificationStatus: 'verified'
    },
    {
      id: 'f_company_vehicles_fuel',
      applicableActivity: 'company_vehicles_fuel',
      numericValue: 3,
      unit: 'litres',
      outputBasis: 'kgCO2e',
      sourceReference: 'test',
      verificationStatus: 'verified'
    }
  ];

  it('runs the independent synthetic arithmetic test correctly', () => {
    const inputs: ActivityInput[] = [
      { id: 'grid_electricity', group: 'purchased_electricity', value: 100, unit: 'kWh' },
      { id: 'boiler_fuel', group: 'stationary_combustion', value: 10, unit: 'litres' },
      { id: 'company_vehicles_fuel', group: 'mobile_combustion', value: 5, unit: 'litres' },
    ];

    const result = calculateEmissions(inputs, mockFactors, 'monthly', 'v1', true);

    expect(result.totalsByGroup.purchased_electricity).toBe(50);
    expect(result.totalsByGroup.stationary_combustion).toBe(20);
    expect(result.totalsByGroup.mobile_combustion).toBe(15);
    expect(result.totalEmissionsKg).toBe(85);

    const recs = generateRecommendations(result, mockFactors);
    const elecRec = recs.find(r => r.title === 'Improve Electricity Efficiency');
    expect(elecRec).toBeDefined();
    expect(elecRec?.estimatedSavingKg).toBe(5); // 85 - 80 = 5kg
  });

  it('rejects negative inputs', () => {
    const inputs: ActivityInput[] = [
      { id: 'grid_electricity', group: 'purchased_electricity', value: -10, unit: 'kWh' }
    ];
    expect(() => calculateEmissions(inputs, mockFactors, 'monthly', 'v1', true)).toThrow('Negative quantity');
  });

  it('handles zero inputs gracefully by excluding them', () => {
    const inputs: ActivityInput[] = [
      { id: 'grid_electricity', group: 'purchased_electricity', value: 0, unit: 'kWh' }
    ];
    const result = calculateEmissions(inputs, mockFactors, 'monthly', 'v1', true);
    expect(result.totalEmissionsKg).toBe(0);
    expect(result.items.length).toBe(0);
  });

  it('throws on missing factors', () => {
    const inputs: ActivityInput[] = [
      { id: 'missing_activity', group: 'purchased_electricity', value: 10, unit: 'kWh' }
    ];
    expect(() => calculateEmissions(inputs, mockFactors, 'monthly', 'v1', true)).toThrow('Missing or ambiguous factor');
  });
});


describe('Authentic emission factors (FEM 2024 + Emission Calculator)', () => {
  const factors = emissionFactors as EmissionFactor[];
  const byActivity = (id: string) => factors.find(f => f.applicableActivity === id)!;

  it('has exactly one factor for every activity, in the activity\'s own unit', () => {
    for (const activity of activities) {
      const matches = factors.filter(f => f.applicableActivity === activity.id);
      expect(matches.length, activity.id).toBe(1);
      expect(matches[0].unit, activity.id).toBe(activity.defaultUnit);
    }
  });

  it('derives per-unit fuel factors as MJ per unit × kgCO2e per MJ', () => {
    for (const f of factors) {
      if (f.kgCO2ePerMJ !== undefined && f.energyContentMJPerUnit !== undefined) {
        expect(f.numericValue).toBeCloseTo(f.kgCO2ePerMJ * f.energyContentMJPerUnit, 5);
      }
    }
  });

  it('matches the Emission Calculator values', () => {
    expect(byActivity('natural_gas_stationary').numericValue).toBeCloseTo(38.2 * 0.0563, 5);
    expect(byActivity('diesel_stationary').numericValue).toBeCloseTo(38.2903 * 0.075, 5);
    expect(byActivity('petrol_octane_vehicles').numericValue).toBeCloseTo(34.6537 * 0.0729, 5);
    expect(byActivity('biomass_uncertified').numericValue).toBeCloseTo(15 * 0.11, 5);
    expect(byActivity('fabric_waste').numericValue).toBeCloseTo(21.7568 * 0.11, 5);
    expect(byActivity('grid_electricity').numericValue).toBe(0.62);
  });

  it('matches FEM 2024 refrigerant GWPs and zero-emission solar', () => {
    expect(byActivity('refrigerant_r22').numericValue).toBe(1960);
    expect(byActivity('refrigerant_r32').numericValue).toBe(771);
    expect(byActivity('refrigerant_r134a').numericValue).toBe(1530);
    expect(byActivity('refrigerant_r404a').numericValue).toBe(4728);
    expect(byActivity('refrigerant_r407c').numericValue).toBe(1908);
    expect(byActivity('refrigerant_r410a').numericValue).toBe(2256);
    expect(byActivity('solar_onsite').numericValue).toBe(0);
  });

  it('flags the CNG energy content as an assumption', () => {
    expect(byActivity('cng_stationary').verificationStatus).toBe('assumed');
    expect(byActivity('cng_vehicles').verificationStatus).toBe('assumed');
  });
});

describe('Tarasima Apparels Ltd. example datasets', () => {
  // Expected totals computed independently (Python) from the Emission Calculator formulas.
  const expectedKg: Record<string, number> = {"2023": 12476552.1, "2024": 12881489.05, "2025": 17091129.86};

  for (const year of Object.keys(expectedKg) as (keyof typeof tarasimaExamples)[]) {
    it(`reproduces the independently calculated ${year} total`, () => {
      const example = tarasimaExamples[year];
      const inputs: ActivityInput[] = activities
        .filter(a => (example.values as Record<string, number>)[a.id] !== undefined)
        .map(a => ({
          id: a.id,
          group: a.group as ActivityGroup,
          value: (example.values as Record<string, number>)[a.id],
          unit: a.defaultUnit,
        }));
      const result = calculateEmissions(inputs, emissionFactors as EmissionFactor[], 'annual', 'FEM-2024', false);
      expect(result.totalEmissionsKg).toBeCloseTo(expectedKg[year], 0);
    });
  }
});
