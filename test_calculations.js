// test_calculations.js
import { BUILDING_PRESETS } from './src/data/buildingPresets.js';
import {
  simulateBaselineDay,
  simulateOptimizedDay,
  generateEnergyForecast,
  generateOptimizationRationale,
  generateScenarioCsv,
} from './src/utils/energyCalculations.js';

console.log('--- Testing EcoSmart AI Calculations & Scenarios ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`✗ FAIL: ${message}`);
  }
}

// 1. Test all presets
for (const [presetKey, preset] of Object.entries(BUILDING_PRESETS)) {
  console.log(`\nTesting Preset: ${presetKey}`);
  const baseline = simulateBaselineDay(preset);
  assert(baseline.totalEnergyKwh > 0, `${presetKey}: Baseline energy > 0 (${baseline.totalEnergyKwh} kWh)`);
  assert(baseline.peakDemandKw > 0, `${presetKey}: Baseline peak demand > 0 (${baseline.peakDemandKw} kW)`);
  assert(baseline.hourlyData.length === 24, `${presetKey}: Hourly data has 24 hours`);

  const opt = simulateOptimizedDay(preset, baseline);
  assert(opt.totalEnergyKwh > 0, `${presetKey}: Optimized energy > 0 (${opt.totalEnergyKwh} kWh)`);
  assert(opt.peakDemandKw <= baseline.peakDemandKw, `${presetKey}: Peak demand is reduced or equal (${opt.peakDemandKw} kW vs ${baseline.peakDemandKw} kW)`);
  assert(opt.costSavings >= 0, `${presetKey}: Cost savings calculated (₹${opt.costSavings})`);
  assert(opt.comfortCompliancePercent >= 0 && opt.comfortCompliancePercent <= 100, `${presetKey}: Comfort compliance percentage valid (${opt.comfortCompliancePercent}%)`);

  const forecast = generateEnergyForecast(preset, baseline);
  assert(forecast.forecastHourly.length === 24, `${presetKey}: Forecast hourly count = 24`);
  assert(forecast.totalForecastKwh > 0, `${presetKey}: Total forecast kWh > 0 (${forecast.totalForecastKwh} kWh)`);
  assert(forecast.influencingFactors.length === 4, `${presetKey}: 4 influencing factors returned`);

  const rationale = generateOptimizationRationale(preset, baseline, opt);
  assert(rationale.length >= 3, `${presetKey}: Rationale items generated for demonstration (${rationale.length} items)`);

  const csv = generateScenarioCsv(preset, baseline, opt);
  assert(csv.includes('EcoSmart AI - Building Energy Optimizer Scenario Report'), `${presetKey}: CSV metadata generated`);
  assert(csv.split('\n').length > 25, `${presetKey}: CSV contains all hourly rows`);
}

// 2. Test Edge Case: Overcooling scenario where user sets preferred temp LOWER than current setpoint (negative savings)
console.log('\nTesting Edge Case: Extreme cooling demand (Target 19°C vs Current 23°C)');
const coldConfig = {
  ...BUILDING_PRESETS.Office,
  currentIndoorTemp: 24.0,
  preferredIndoorTemp: 19.0, // target is colder than baseline
};
const coldBaseline = simulateBaselineDay(coldConfig);
const coldOpt = simulateOptimizedDay(coldConfig, coldBaseline);
assert(coldOpt.energySavingsKwh < 0, `Honest negative savings detected when user requests sub-cooling (${coldOpt.energySavingsKwh} kWh)`);

// 3. Test Edge Case: Zero occupants / empty values fallback
console.log('\nTesting Edge Case: Zero occupants & minimal area');
const emptyConfig = {
  ...BUILDING_PRESETS.Office,
  floorArea: 0,
  occupants: 0,
};
const safeBaseline = simulateBaselineDay(emptyConfig);
assert(safeBaseline.totalEnergyKwh > 0, 'Safe fallback prevents division by zero or NaN');

console.log(`\n========================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed.`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
