import type { CalculationResult } from './types';

export interface ActionPlanItem {
  title: string;
  description: string;
}

interface ActionCopy {
  title: string;
  /** What to actually do, written for a real garment-factory operations team. */
  action: string;
  /** Typical, realistic impact range for this specific intervention. */
  impact: string;
}

/**
 * Activity-specific guidance — one entry per assessment question (20 total).
 * Every recommendation names the actual fuel or energy source the factory
 * reported, so the Action Plan stays concrete instead of generic.
 */
const ACTION_LIBRARY: Record<string, ActionCopy> = {
  // ---- Stationary Combustion ----
  natural_gas_stationary: {
    title: 'Natural Gas: Boiler & Generator Efficiency',
    action:
      'Insulate steam lines, recover condensate and retune burners on gas-fired boilers, and load-match gas generators to actual demand. Fit a flue-gas oxygen sensor so combustion air is not over-supplied.',
    impact: 'Well-tuned boilers with condensate recovery typically save 12-18% of associated gas use.',
  },
  cng_stationary: {
    title: 'CNG: Generator & Machinery Load Management',
    action:
      'Right-size CNG generators and boilers to real production load, shut down idle machinery between batches, and track CNG per unit of output so drift is caught early.',
    impact: 'Load-matching and scheduling typically cut stationary CNG use by 10-15%.',
  },
  diesel_stationary: {
    title: 'Diesel: Backup Generator Reduction',
    action:
      'Track grid outage hours and evaluate whether battery storage, more grid or on-site solar supply, or a smaller right-sized generator can cover your actual backup load. Service generators on a fixed interval.',
    impact: 'Right-sizing backup diesel capacity and servicing typically cut diesel consumption by 10-20%.',
  },

  // ---- Biomass & Waste Fuels ----
  biomass_certified: {
    title: 'Certified Biomass: Boiler Efficiency',
    action:
      'Keep biomass fuel dry, tune the boiler feed and air supply, and keep certification records current so the sourcing claim can be audited by buyers.',
    impact: 'Dry fuel and tuned combustion typically improve boiler efficiency by 8-12%.',
  },
  biomass_uncertified: {
    title: 'Biomass Fuel: Certification & Efficiency',
    action:
      'Ask your biomass supplier (e.g. rice husk briquette or Jhute) for sustainable-sourcing certification, and improve boiler feed and moisture control so less fuel is burned per tonne of steam.',
    impact: 'Moisture control and burner tuning typically reduce biomass burned by 8-12%; certification improves reporting credibility.',
  },
  fabric_waste: {
    title: 'Fabric Waste: Cutting-Room Reduction',
    action:
      'Improve marker efficiency in the cutting room and sell or recycle off-cuts instead of burning them, so less fabric waste needs to be used as fuel.',
    impact: 'Better marker planning typically reduces fabric waste by 2-5% of fabric used.',
  },

  // ---- Mobile Combustion ----
  cng_vehicles: {
    title: 'CNG Vehicles: Fleet Maintenance & Routing',
    action:
      'Service CNG vehicles on a fixed interval, keep tyres correctly inflated, and consolidate overlapping trips between sites.',
    impact: 'Maintenance and trip consolidation typically cut fleet fuel use by 8-12%.',
  },
  diesel_vehicles: {
    title: 'Diesel Vehicles: Route & Driver Programme',
    action:
      'Consolidate overlapping routes, right-size vehicles to the load, and add basic driver eco-training (smooth acceleration, idle shut-off, correct tyre pressure).',
    impact: 'Route optimization and driver training typically cut diesel fleet fuel use by 8-15%.',
  },
  petrol_octane_vehicles: {
    title: 'Petrol/Octane Vehicles: Trip Policy',
    action:
      'Set a trip-approval policy for petrol and octane vehicles, pool vehicles for overlapping destinations, and plan a gradual switch to CNG or electric where practical.',
    impact: 'Trip consolidation typically reduces fuel use by 10-15%.',
  },

  // ---- Fugitive Emissions (refrigerants) ----
  refrigerant_r22: {
    title: 'R-22: Leak Repair & Phase-Out',
    action:
      'Run a leak detection and repair pass on every R-22 system and plan a retrofit or replacement — R-22 is an ageing HCFC with a GWP of 1,960 and is being phased out.',
    impact: 'A single LDAR pass typically removes 25-40% of refrigerant leakage; replacement removes the R-22 exposure entirely.',
  },
  refrigerant_r32: {
    title: 'R-32: Leak Detection & Repair',
    action:
      'Check service ports, joints and coil seals on R-32 equipment first, and log every top-up so recurring leak points are flagged instead of just refilled.',
    impact: 'Proactive leak repair typically cuts refrigerant losses by 25-35%.',
  },
  refrigerant_r134a: {
    title: 'R-134a: Chiller & Compressor Seal Checks',
    action:
      'Inspect valves, gaskets and compressor seals on R-134a equipment quarterly, and consider lower-GWP alternatives (such as R-1234ze) when units are due for replacement.',
    impact: 'Quarterly seal maintenance typically reduces refrigerant losses by 25-35%.',
  },
  refrigerant_r404a: {
    title: 'R-404A: Replace High-GWP Refrigerant',
    action:
      'R-404A has one of the highest GWPs in common use (4,728). Tighten leak checks on R-404A equipment now and plan retrofits to lower-GWP refrigerants at the next major service.',
    impact: 'Leak repair typically removes 20-35% of losses; a refrigerant switch cuts the per-kg impact by more than half.',
  },
  refrigerant_r407c: {
    title: 'R-407C: Leak Detection & Repair',
    action:
      'Survey R-407C systems for leaks at joints and service valves, and keep a refrigerant log per unit so losses can be tracked over time.',
    impact: 'A survey and repair cycle typically removes 20-30% of refrigerant leakage.',
  },
  refrigerant_r410a: {
    title: 'R-410A: Air Conditioning Leak Control',
    action:
      'Run a leak check on R-410A air conditioning units, repair flare joints and service ports, and prefer lower-GWP refrigerants for new units.',
    impact: 'Leak repair on air conditioning typically reduces refrigerant losses by 25-40%.',
  },

  // ---- Purchased Electricity ----
  grid_electricity: {
    title: 'Grid Electricity: Efficiency & Solar Expansion',
    action:
      'Retrofit to LED lighting, schedule HVAC and compressors to production hours, repair compressed-air leaks, and expand rooftop solar to displace grid purchases.',
    impact: 'Efficiency measures typically save 10-20% of purchased electricity; each added kWh of solar removes 0.62 kgCO₂e of grid emissions.',
  },
  solar_onsite: {
    title: 'On-site Solar: Maximise Generation',
    action:
      'Keep panels clean, monitor inverter performance, and look for more roof or car-park area to expand capacity — every on-site kWh displaces a grid kWh.',
    impact: 'Regular cleaning and monitoring typically recover 5-10% of lost solar output.',
  },

  // ---- Purchased Steam / Heat / Cooling ----
  purchased_steam: {
    title: 'Purchased Steam: Demand & Supplier Review',
    action:
      'Find and fix steam leaks and failed steam traps, insulate distribution lines, and ask the supplier about lower-carbon steam sources.',
    impact: 'Steam-trap and insulation programmes typically save 10-20% of steam demand.',
  },
  district_heating: {
    title: 'District Heating: Controls & Supplier Review',
    action:
      'Add timers and setpoint controls so heating does not run at full output between production batches, and review the supplier\u2019s fuel mix.',
    impact: 'Basic scheduling controls generally reduce purchased heat by 10-15%.',
  },
  chilled_water: {
    title: 'Chilled Water: Load Reduction',
    action:
      'Raise chilled-water setpoints where process allows, fix door and curtain leakage in cooled areas, and stage cooling to occupied hours.',
    impact: 'Setpoint and scheduling changes typically save 10-15% of purchased cooling.',
  },
};

/** Fallback, group-level actions used only to fill out 5 items when a
 *  factory has fewer than 5 non-zero activities reported. */
const GROUP_FALLBACKS: ActionCopy[] = [
  {
    title: 'Baseline Energy Audit',
    action:
      'Commission a walk-through energy audit covering combustion equipment, electrical distribution, and compressed air/steam networks to catch sources not yet captured in this assessment.',
    impact: 'Independent audits typically surface 10-20% in additional, previously unquantified savings.',
  },
  {
    title: 'Rooftop Solar Feasibility',
    action:
      'Get a rooftop solar feasibility study done against your factory\u2019s roof area and daytime load profile to offset purchased grid electricity.',
    impact: 'A right-sized rooftop array can typically offset 15-30% of daytime grid electricity demand.',
  },
  {
    title: 'Facility-Wide Leak Detection Program',
    action:
      'Run a combined compressed-air and refrigerant leak survey across the whole site — these are consistently the fastest payback interventions in garment factories.',
    impact: 'Combined leak-detection programs typically deliver 15-30% savings in the systems surveyed.',
  },
  {
    title: 'Preventive Maintenance Calendar',
    action:
      'Move all major fuel and electricity-consuming equipment onto a fixed preventive maintenance calendar rather than run-to-failure servicing.',
    impact: 'Preventive maintenance programs typically sustain 8-15% efficiency gains over reactive servicing.',
  },
  {
    title: 'Internal Emissions Reduction Target',
    action:
      'Set a year-on-year internal reduction target against this baseline and re-run this assessment each reporting period to track progress.',
    impact: 'Factories that track a formal target typically achieve 2-3x the savings of those without one.',
  },
];

const ORDINAL_LABEL = ['largest', 'second-largest', 'third-largest', 'fourth-largest', 'fifth-largest'];

function formatTonnes(kg: number): string {
  return (kg / 1000).toFixed(3);
}

/**
 * Builds a Recommended Action Plan of exactly 5 items, driven entirely by
 * this specific Carbon Report's results: which activities were reported,
 * how large each one is relative to the total, and what a realistic,
 * named intervention for that exact activity looks like.
 */
export function generateActionPlan(result: CalculationResult): ActionPlanItem[] {
  const { items, totalEmissionsKg, period } = result;

  if (totalEmissionsKg <= 0 || items.length === 0) {
    return GROUP_FALLBACKS.slice(0, 5).map(copy => ({
      title: copy.title,
      description: `${copy.action} ${copy.impact}`,
    }));
  }

  const ranked = [...items]
    .filter(item => item.emissionsKg > 0)
    .sort((a, b) => b.emissionsKg - a.emissionsKg);

  const plan: ActionPlanItem[] = [];
  const usedFallbacks = new Set<number>();

  for (let i = 0; i < ranked.length && plan.length < 5; i++) {
    const item = ranked[i];
    const copy = ACTION_LIBRARY[item.activityId];
    if (!copy) continue;

    const percentOfTotal = (item.emissionsKg / totalEmissionsKg) * 100;
    const ordinal = ORDINAL_LABEL[plan.length] ?? `#${plan.length + 1}`;

    plan.push({
      title: copy.title,
      description: `${copy.action} This is currently your ${ordinal} reported emission source, responsible for ${percentOfTotal.toFixed(1)}% of your total footprint (${formatTonnes(item.emissionsKg)} tCO\u2082e for the ${period} period). ${copy.impact}`,
    });
  }

  // If the factory only reported a handful of activities, fill the
  // remaining slots with general, still-genuine next steps rather than
  // repeating or padding with unrelated categories.
  let fallbackIndex = 0;
  while (plan.length < 5 && fallbackIndex < GROUP_FALLBACKS.length) {
    if (!usedFallbacks.has(fallbackIndex)) {
      const copy = GROUP_FALLBACKS[fallbackIndex];
      plan.push({ title: copy.title, description: `${copy.action} ${copy.impact}` });
      usedFallbacks.add(fallbackIndex);
    }
    fallbackIndex++;
  }

  return plan;
}