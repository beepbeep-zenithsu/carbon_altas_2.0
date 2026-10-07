# Data sources and method

## Calculation

For fuels and purchased energy, following `Emission-Calculator.xlsx`:

    emissions (kg) = quantity × MJ per unit × kgCO₂e per MJ

Electricity follows the calculator's own formula, `kWh × 0.62`. Refrigerants are `kg leaked × GWP` (kgCO₂e per kg) from the FEM 2024 file. Each factor in `src/data/factors.json` is stored already multiplied out, per reported unit, with the source text next to it.

## Factors applied

| Activity id | Factor | Derived from | Status |
| --- | --- | --- | --- |
| `natural_gas_stationary` | 2.15066 kgCO₂e per m³ | 0.0563 kgCO₂e/MJ × 38.2 MJ/m3 | verified |
| `cng_stationary` | 2.15066 kgCO₂e per m³ | 0.0563 kgCO₂e/MJ × 38.2 MJ/m3 | assumed |
| `diesel_stationary` | 2.87177 kgCO₂e per litres | 0.075 kgCO₂e/MJ × 38.2903 MJ/litres | verified |
| `biomass_certified` | 1.65 kgCO₂e per kg | 0.11 kgCO₂e/MJ × 15 MJ/kg | verified |
| `biomass_uncertified` | 1.65 kgCO₂e per kg | 0.11 kgCO₂e/MJ × 15 MJ/kg | verified |
| `fabric_waste` | 2.39325 kgCO₂e per kg | 0.11 kgCO₂e/MJ × 21.7568 MJ/kg | verified |
| `cng_vehicles` | 2.15066 kgCO₂e per m³ | 0.0563 kgCO₂e/MJ × 38.2 MJ/m3 | assumed |
| `diesel_vehicles` | 2.87177 kgCO₂e per litres | 0.075 kgCO₂e/MJ × 38.2903 MJ/litres | verified |
| `petrol_octane_vehicles` | 2.52625 kgCO₂e per litres | 0.0729 kgCO₂e/MJ × 34.6537 MJ/litres | verified |
| `refrigerant_r22` | 1960 kgCO₂e per kg | GWP 1,960 | verified |
| `refrigerant_r32` | 771 kgCO₂e per kg | GWP 771 | verified |
| `refrigerant_r134a` | 1530 kgCO₂e per kg | GWP 1,530 | verified |
| `refrigerant_r404a` | 4728 kgCO₂e per kg | GWP 4,728 | verified |
| `refrigerant_r407c` | 1908 kgCO₂e per kg | GWP 1,908 | verified |
| `refrigerant_r410a` | 2256 kgCO₂e per kg | GWP 2,256 | verified |
| `grid_electricity` | 0.62 kgCO₂e per kWh | — | verified |
| `solar_onsite` | 0 kgCO₂e per kWh | — | verified |
| `purchased_steam` | 77.8 kgCO₂e per GJ | 0.0778 kgCO₂e/MJ × 1000 MJ/GJ | verified |
| `district_heating` | 77.8 kgCO₂e per GJ | 0.0778 kgCO₂e/MJ × 1000 MJ/GJ | verified |
| `chilled_water` | 77.8 kgCO₂e per GJ | 0.0778 kgCO₂e/MJ × 1000 MJ/GJ | verified |

`assumed` means a value was not in the files and an assumption was made.

## Assumptions and limits

1. **CNG energy content.** The files give MJ per m³ for natural gas (38.2) but not for CNG. CNG is compressed natural gas and has the same FEM factor (0.0563 kgCO₂e/MJ), so 38.2 MJ/m³ is used. Replace it in `factors.json` if you have a measured value.
2. **Generator electricity.** Tarasima reports "Electricity from Generators (kWh)". That electricity is made from the Natural Gas, CNG and Diesel already counted under Stationary Combustion, so it is not entered again.
3. **Biomass certification.** Tarasima 2025 lists "Rice Husk Briquette" without saying whether it is certified. It is loaded as *not certified*. FEM gives the same 0.11 kgCO₂e/MJ for both, so the result is identical either way. 2023 and 2024 report no biomass figures.
4. **Grid electricity.** FEM states that country grid factors come from licensed IEA data and cannot be shared, so the calculator's 0.62 kgCO₂e/kWh is used.
5. **Solar.** On-site solar is a zero-emission source (0 in FEM).
6. **Refrigerants.** Tarasima has no refrigerant data, so the example data leaves them blank. Six common refrigerants with FEM GWPs are offered (R-22, R-32, R-134a, R-404A, R-407C, R-410A). The FEM file lists 344 refrigerants and can be extended.
7. **Purchased steam / heating / chilled water.** FEM factors apply, but Tarasima reports none, so the example leaves them blank.
8. **Not calculated.** Scope 3, and process water / wastewater emissions (Tarasima records water, but the reference data has no emission factors for it).
9. **Tarasima 2023 petrol/octane.** The sheet's Total row shows 11,756 L, but February (865) and March (993) are stored as text and were skipped by the sheet's SUM. The correct month-by-month sum, 13,614 L, is used.

## Example totals (annual, tCO₂e)

Calculated with the factors above (scope 1 + scope 2, excluding zero-emission solar):

| Year | Total tCO₂e |
| --- | --- |
| 2025 | 17,091.1 |
| 2024 | 12,881.5 |
| 2023 | 12,476.6 |
