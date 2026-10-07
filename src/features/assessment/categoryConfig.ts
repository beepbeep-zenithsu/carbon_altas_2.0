import {
  Flame,
  Leaf,
  Truck,
  Wind,
  Zap,
  PlugZap,
  type LucideIcon
} from 'lucide-react';

import type { ActivityGroup } from '../../domain/types';

export type FieldKind = 'number' | 'yesno-number';

export interface SubsectionConfig {
  id: string;
  label: string;
  question: string;
  /** Optional helper bullets shown under the question (what counts, examples). */
  details?: string[];
  unit: string;
  /** Unit text shown next to the input. The reporting period ("/ month" or
   *  "/ year") is appended automatically from the Monthly/Annual toggle. */
  unitLabel: string;
  kind: FieldKind;
  placeholder?: string;
}

/** A "supersubheading" — an optional mid-level grouping of subsections
 *  inside a category (e.g. "Natural Gas" vs "Diesel" inside Stationary
 *  Combustion). Only used where the category actually needs a third tier;
 *  everything else stays a flat subsections[] list. */
export interface SubGroupConfig {
  label: string;
  description?: string;
  subsections: SubsectionConfig[];
}

export interface CategoryConfig {
  id: ActivityGroup;
  navLabel: string;
  /** GHG Protocol scope, taken from the Emission Calculator's section headings. */
  scope: 'Scope 1' | 'Scope 2';
  title: string;
  description: string;
  icon: LucideIcon;
  /** Flat subsections. Mutually exclusive with subGroups — a category uses one or the other. */
  subsections?: SubsectionConfig[];
  /** Grouped subsections, for categories that need a heading between the category and its questions. */
  subGroups?: SubGroupConfig[];
}

/*
 * Headings and subheadings in this file come from the three reference files:
 *  - Tarasima-Resources-Consumption.xlsx  → energy/fuel column headers
 *  - Emission-Calculator.xlsx             → "Scope 1 / Scope 2 Emission" sections and fuel names
 *  - FEM-2024-Emission-Factor-Reference   → refrigerants, purchased steam / heating / chilled water
 */
export const CATEGORIES: CategoryConfig[] = [

  /* =========================
     SCOPE 1
     STATIONARY COMBUSTION
  ========================= */

  {
    id: 'stationary_combustion',
    navLabel: 'Stationary Combustion',
    scope: 'Scope 1',
    title: 'Stationary Combustion',
    description:
      'Natural Gas, CNG and Diesel used in generators, boilers, production machinery and cooking. Electricity produced by on-site generators is not entered separately — its fuel is already counted here.',
    icon: Flame,

    subGroups: [
      {
        label: 'Natural Gas',
        description: 'Natural Gas (m³) used in generators, boilers, production machinery and cooking.',
        subsections: [
          {
            id: 'natural_gas_stationary',
            label: 'Natural Gas',
            question: 'How much natural gas is used in generators, boilers, production machinery and cooking?',
            details: ['Generators', 'Boilers', 'Production machinery', 'Cooking'],
            unit: 'm3',
            unitLabel: 'm³',
            kind: 'number',
            placeholder: 'e.g. 131738'
          }
        ]
      },
      {
        label: 'CNG — Compressed Natural Gas',
        description: 'CNG (m³) used in generators, boilers and production machinery.',
        subsections: [
          {
            id: 'cng_stationary',
            label: 'CNG — Compressed Natural Gas',
            question: 'How much CNG is used in generators, boilers and production machinery?',
            details: ['Generators', 'Boilers', 'Production machinery'],
            unit: 'm3',
            unitLabel: 'm³',
            kind: 'number',
            placeholder: 'e.g. 64248'
          }
        ]
      },
      {
        label: 'Diesel',
        description: 'Diesel (litres) used in generators, boilers and production machinery.',
        subsections: [
          {
            id: 'diesel_stationary',
            label: 'Diesel',
            question: 'How much diesel is used in generators, boilers and production machinery?',
            details: ['Generators', 'Boilers', 'Production machinery'],
            unit: 'litres',
            unitLabel: 'litres',
            kind: 'number',
            placeholder: 'e.g. 127672'
          }
        ]
      }
    ]
  },

  /* =========================
     SCOPE 1
     BIOMASS & WASTE FUELS
  ========================= */

  {
    id: 'biomass_waste_fuels',
    navLabel: 'Biomass & Waste Fuels',
    scope: 'Scope 1',
    title: 'Biomass & Waste Fuels',
    description: 'Biomass fuel (kg) and fabric waste burned on site.',
    icon: Leaf,

    subsections: [
      {
        id: 'biomass_certified',
        label: 'Biomass — Sustainably Sourced with Certification',
        question: 'How much biomass fuel with a sustainable-sourcing certification is burned?',
        details: ['Biomass fuel with sustainably sourced certification'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 18700'
      },
      {
        id: 'biomass_uncertified',
        label: 'Biomass — Without Sustainably Sourced Biomass Certification',
        question: 'How much biomass fuel without a sustainable-sourcing certification is burned?',
        details: ['Rice Husk Briquette', 'Biomass of unknown specific type (e.g. Jhute used in a Jhute boiler)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 158560'
      },
      {
        id: 'fabric_waste',
        label: 'Fabric Waste',
        question: 'How much fabric waste is burned as fuel?',
        details: ['Fabric waste is modelled as biomass'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 5000'
      }
    ]
  },

  /* =========================
     SCOPE 1
     MOBILE COMBUSTION
  ========================= */

  {
    id: 'mobile_combustion',
    navLabel: 'Mobile Combustion',
    scope: 'Scope 1',
    title: 'Mobile Combustion',
    description: 'CNG, Diesel and Petrol/Octane used in factory-owned vehicles.',
    icon: Truck,

    subsections: [
      {
        id: 'cng_vehicles',
        label: 'CNG (Factory-Owned Vehicles)',
        question: 'How much CNG is used in factory-owned vehicles?',
        details: ['CNG (m³) used in factory-owned vehicles'],
        unit: 'm3',
        unitLabel: 'm³',
        kind: 'number',
        placeholder: 'e.g. 9470'
      },
      {
        id: 'diesel_vehicles',
        label: 'Diesel (Factory-Owned Vehicles)',
        question: 'How much diesel is used in factory-owned vehicles?',
        details: ['Diesel (litres) used in factory-owned vehicles'],
        unit: 'litres',
        unitLabel: 'litres',
        kind: 'number',
        placeholder: 'e.g. 20383'
      },
      {
        id: 'petrol_octane_vehicles',
        label: 'Petrol / Octane (Factory-Owned Vehicles)',
        question: 'How much petrol or octane is used in factory-owned vehicles?',
        details: ['Petrol/Octane (litres) used in factory-owned vehicles'],
        unit: 'litres',
        unitLabel: 'litres',
        kind: 'number',
        placeholder: 'e.g. 2267'
      }
    ]
  },

  /* =========================
     SCOPE 1
     FUGITIVE EMISSIONS
  ========================= */

  {
    id: 'fugitive_emissions',
    navLabel: 'Fugitive Emissions',
    scope: 'Scope 1',
    title: 'Fugitive Emissions',
    description:
      'Refrigerant leakage from cooling equipment. Each refrigerant is converted with its Global Warming Potential (kgCO₂e per kg) from the FEM 2024 reference.',
    icon: Wind,

    subsections: [
      {
        id: 'refrigerant_r22',
        label: 'R-22 (HCFC)',
        question: 'How much R-22 refrigerant was leaked (or topped up to replace losses)?',
        details: ['GWP 1,960 kgCO₂e per kg (IPCC AR6)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 10'
      },
      {
        id: 'refrigerant_r32',
        label: 'R-32 (HFC)',
        question: 'How much R-32 refrigerant was leaked (or topped up to replace losses)?',
        details: ['GWP 771 kgCO₂e per kg (IPCC AR6)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 10'
      },
      {
        id: 'refrigerant_r134a',
        label: 'R-134a (HFC)',
        question: 'How much R-134a refrigerant was leaked (or topped up to replace losses)?',
        details: ['GWP 1,530 kgCO₂e per kg (IPCC AR6)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 10'
      },
      {
        id: 'refrigerant_r404a',
        label: 'R-404A (HFC)',
        question: 'How much R-404A refrigerant was leaked (or topped up to replace losses)?',
        details: ['GWP 4,728 kgCO₂e per kg (EFCTC F-gas list, via FEM 2024)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 5'
      },
      {
        id: 'refrigerant_r407c',
        label: 'R-407C (HFC)',
        question: 'How much R-407C refrigerant was leaked (or topped up to replace losses)?',
        details: ['GWP 1,908 kgCO₂e per kg (EFCTC F-gas list, via FEM 2024)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 5'
      },
      {
        id: 'refrigerant_r410a',
        label: 'R-410A (HFC)',
        question: 'How much R-410A refrigerant was leaked (or topped up to replace losses)?',
        details: ['GWP 2,256 kgCO₂e per kg (EFCTC F-gas list, via FEM 2024)'],
        unit: 'kg',
        unitLabel: 'kg',
        kind: 'number',
        placeholder: 'e.g. 10'
      }
    ]
  },

  /* =========================
     SCOPE 2
     PURCHASED ELECTRICITY
  ========================= */

  {
    id: 'purchased_electricity',
    navLabel: 'Purchased Electricity',
    scope: 'Scope 2',
    title: 'Purchased Electricity',
    description: 'Electricity purchased from the grid, plus on-site solar generation.',
    icon: Zap,

    subsections: [
      {
        id: 'grid_electricity',
        label: 'Purchased Electricity (Grid)',
        question: 'How much electricity is purchased from the grid?',
        details: ['Purchased electricity (kWh)'],
        unit: 'kWh',
        unitLabel: 'kWh',
        kind: 'number',
        placeholder: 'e.g. 753117'
      },
      {
        id: 'solar_onsite',
        label: 'Solar Photovoltaic (On-site)',
        question: 'How much electricity is generated by your on-site solar panels?',
        details: ['Solar (kWh)', 'Zero-emission source — recorded for completeness (0 kgCO₂e)'],
        unit: 'kWh',
        unitLabel: 'kWh',
        kind: 'number',
        placeholder: 'e.g. 240732'
      }
    ]
  },

  /* =========================
     SCOPE 2
     PURCHASED STEAM / HEAT / COOLING
  ========================= */

  {
    id: 'purchased_energy',
    navLabel: 'Purchased Steam / Heat / Cooling',
    scope: 'Scope 2',
    title: 'Purchased Steam / Heat / Cooling',
    description: 'Steam, district heating and chilled water purchased from external suppliers.',
    icon: PlugZap,

    subsections: [
      {
        id: 'purchased_steam',
        label: 'Purchased Steam',
        question: 'Do you purchase steam from an external supplier?',
        details: ['Modelled as fuel oil (0.0778 kgCO₂e per MJ)'],
        unit: 'GJ',
        unitLabel: 'GJ',
        kind: 'yesno-number',
        placeholder: 'e.g. 15'
      },
      {
        id: 'district_heating',
        label: 'Purchased Heating (District Heating)',
        question: 'Do you purchase heating (district heating) from an external supplier?',
        details: ['Modelled as fuel oil (0.0778 kgCO₂e per MJ)'],
        unit: 'GJ',
        unitLabel: 'GJ',
        kind: 'yesno-number',
        placeholder: 'e.g. 10'
      },
      {
        id: 'chilled_water',
        label: 'Purchased Chilled Water',
        question: 'Do you purchase chilled water from an external supplier?',
        details: ['Modelled as fuel oil (0.0778 kgCO₂e per MJ)'],
        unit: 'GJ',
        unitLabel: 'GJ',
        kind: 'yesno-number',
        placeholder: 'e.g. 8'
      }
    ]
  }

];

/* =========================
   HELPERS
========================= */

/** Every subsection in a category, whether it's declared flat or under subGroups. */
export function getSubsections(category: CategoryConfig): SubsectionConfig[] {
  if (category.subsections) return category.subsections;
  if (category.subGroups) return category.subGroups.flatMap(g => g.subsections);
  return [];
}

export const ALL_SUBSECTIONS: SubsectionConfig[] = CATEGORIES.flatMap(getSubsections);

/* =========================
   CATEGORY NAVIGATION
========================= */

export const CATEGORY_ORDER = CATEGORIES.map(category => category.id);

export function getCategoryIndex(id: string | undefined): number {
  const index = CATEGORY_ORDER.findIndex(category => category === id);
  return index === -1 ? 0 : index;
}

export function getCategoryByIndex(index: number): CategoryConfig {
  const safeIndex = Math.min(Math.max(index, 0), CATEGORIES.length - 1);
  return CATEGORIES[safeIndex];
}
