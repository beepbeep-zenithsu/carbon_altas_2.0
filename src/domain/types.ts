export type ReportingPeriod = 'monthly' | 'annual';

/**
 * The six top-level assessment modules shown in the product navigation.
 * Internally each activity is mapped to a hidden accounting category for
 * the calculation engine, but that mapping is never surfaced to the user.
 */
export type ActivityGroup =
  | 'stationary_combustion'
  | 'biomass_waste_fuels'
  | 'mobile_combustion'
  | 'fugitive_emissions'
  | 'purchased_electricity'
  | 'purchased_energy';

export const ACTIVITY_GROUPS: ActivityGroup[] = [
  'stationary_combustion',
  'biomass_waste_fuels',
  'mobile_combustion',
  'fugitive_emissions',
  'purchased_electricity',
  'purchased_energy',
];

export interface ActivityInput {
  id: string;
  group: ActivityGroup;
  value: number;
  unit: string;
}

export interface EmissionFactor {
  id: string;
  numericValue: number;
  unit: string;
  outputBasis: 'kgCO2e';
  applicableActivity: string;
  geography?: string;
  year?: number;
  sourceReference: string;
  /** 'verified' = taken directly from the reference files;
   *  'assumed' = derived with an assumption stated in sourceReference. */
  verificationStatus: 'verified' | 'assumed';
  /** Present when the factor was derived from a per-MJ factor (fuels and purchased energy). */
  kgCO2ePerMJ?: number;
  energyContentMJPerUnit?: number;
  /** Present for refrigerants: Global Warming Potential in kgCO2e per kg. */
  gwp?: number;
}

export interface CalculationResultItem {
  activityId: string;
  group: ActivityGroup;
  inputQuantity: number;
  inputUnit: string;
  appliedFactor: EmissionFactor;
  emissionsKg: number;
}

export interface CalculationResult {
  period: ReportingPeriod;
  items: CalculationResultItem[];
  totalsByGroup: Record<ActivityGroup, number>;
  totalEmissionsKg: number;
  datasetVersion: string;
  isDemo: boolean;
  assumptions: string[];
}

export interface CompanyInfo {
  id: string;
  name: string;
  sector: string;
  description?: string;
}

export interface ProjectConfig {
  activeMode: 'demo' | 'production';
  companyId: string;
  datasetVersion: string;
}

export interface ActivityDefinition {
  id: string;
  group: ActivityGroup;
  name: string;
  defaultUnit: string;
  supportedUnits: string[];
}