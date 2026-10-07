import { z } from 'zod';

export const reportingPeriodSchema = z.enum(['monthly', 'annual']);

export const activityGroupSchema = z.enum([
  'stationary_combustion',
  'biomass_waste_fuels',
  'mobile_combustion',
  'fugitive_emissions',
  'purchased_electricity',
  'purchased_energy',
]);

export const activityInputSchema = z.object({
  id: z.string(),
  group: activityGroupSchema,
  value: z.number().nonnegative('Value cannot be negative').finite('Value must be finite'),
  unit: z.string(),
});

export const emissionFactorSchema = z.object({
  id: z.string(),
  numericValue: z.number().nonnegative(),
  unit: z.string(),
  outputBasis: z.literal('kgCO2e'),
  applicableActivity: z.string(),
  geography: z.string().optional(),
  year: z.number().optional(),
  sourceReference: z.string(),
  verificationStatus: z.enum(['verified', 'assumed']),
  kgCO2ePerMJ: z.number().optional(),
  energyContentMJPerUnit: z.number().optional(),
  gwp: z.number().optional(),
});

export const companyInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  sector: z.string(),
  description: z.string().optional(),
});

export const projectConfigSchema = z.object({
  activeMode: z.enum(['demo', 'production']),
  companyId: z.string(),
  datasetVersion: z.string(),
});
