// src/views/ReportsView.jsx
import React from 'react';
import { useBuilding } from '../context/BuildingContext';
import { generateScenarioCsv } from '../utils/energyCalculations';
import {
  Download,
  Printer,
  FileSpreadsheet,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Zap,
  TrendingDown,
  ShieldCheck,
  Info,
} from 'lucide-react';

export function ReportsView() {
  const { config, baselineResult, optimizedResult, lastOptimizedAt, setToastMessage } = useBuilding();

  const handleDownloadCsv = () => {
    try {
      const csvContent = generateScenarioCsv(config, baselineResult, optimizedResult);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `EcoSmart_Report_${config.buildingType}_${timestamp}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToastMessage({
        title: 'Report Exported Successfully',
        text: `Downloaded ${filename} with complete 24-hour baseline vs optimized scenario data.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Could not generate CSV export. Please check browser permissions.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isSavingPositive = optimizedResult.energySavingsKwh >= 0;

  return (
    <div>
      {/* Header with Export Action Buttons */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '22px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Building Energy Optimization Audit Report
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Formal audit report comparing rule-based baseline and AI-assisted dynamic HVAC control.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button id="btn-print-report" className="btn-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>

          <button id="btn-download-csv" className="btn-primary" onClick={handleDownloadCsv}>
            <Download size={15} />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="card" style={{ borderLeft: '4px solid var(--orange-600)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--orange-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Project Demonstration Audit Document
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>
              EcoSmart AI — Energy & HVAC Optimization Assessment
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Evaluated for: <strong>{config.name || `${config.buildingType} Facility`}</strong> • Typology: {config.buildingType}
            </p>
          </div>

          <div style={{ textAlign: 'right', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <div>Generated: <strong>{new Date().toLocaleDateString()}</strong></div>
            <div>Optimization Run: <strong>{lastOptimizedAt}</strong></div>
            <div style={{ color: 'var(--eco-green)', fontWeight: 600, marginTop: '2px' }}>Status: Verified Simulated Scenario</div>
          </div>
        </div>
      </div>

      {/* Section 1: Executive KPI Comparison Table */}
      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
          1. Key Performance Indicators (KPI) Summary
        </h2>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Performance Metric</th>
                <th>Baseline (Fixed Schedule)</th>
                <th>EcoSmart Optimized</th>
                <th>Estimated Delta / Savings</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Total 24h Energy Consumption</strong></td>
                <td>{baselineResult.totalEnergyKwh} kWh</td>
                <td>{optimizedResult.totalEnergyKwh} kWh</td>
                <td style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626', fontWeight: 600 }}>
                  -{optimizedResult.energySavingsKwh} kWh ({optimizedResult.energySavingsPercent}%)
                </td>
                <td>Energy Conservation</td>
              </tr>
              <tr>
                <td><strong>Peak Grid Electrical Demand</strong></td>
                <td>{optimizedResult.baselinePeakKw} kW</td>
                <td>{optimizedResult.peakDemandKw} kW</td>
                <td style={{ color: 'var(--eco-green)', fontWeight: 600 }}>
                  -{optimizedResult.peakReductionKw} kW ({optimizedResult.peakReductionPercent}%)
                </td>
                <td>Demand Charge Reduction</td>
              </tr>
              <tr>
                <td><strong>Daily Electricity Cost (₹{config.electricityPrice}/kWh)</strong></td>
                <td>₹{baselineResult.electricityCost.toLocaleString()}</td>
                <td>₹{optimizedResult.electricityCost.toLocaleString()}</td>
                <td style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626', fontWeight: 600 }}>
                  ₹{optimizedResult.costSavings.toLocaleString()} / day
                </td>
                <td>Operational Expense (OpEx)</td>
              </tr>
              <tr>
                <td><strong>Annualized Projected Savings (300 operating days)</strong></td>
                <td>₹{(baselineResult.electricityCost * 300).toLocaleString()}</td>
                <td>₹{(optimizedResult.electricityCost * 300).toLocaleString()}</td>
                <td style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626', fontWeight: 600 }}>
                  ₹{(optimizedResult.costSavings * 300).toLocaleString()} / year
                </td>
                <td>Long-Term Feasibility</td>
              </tr>
              <tr>
                <td><strong>Carbon Emissions (Factor: {config.co2EmissionFactor} kg CO₂/kWh)</strong></td>
                <td>{baselineResult.co2EmissionsKg} kg CO₂</td>
                <td>{optimizedResult.co2EmissionsKg} kg CO₂</td>
                <td style={{ color: 'var(--eco-green)', fontWeight: 600 }}>
                  -{optimizedResult.co2SavingsKg} kg CO₂ / day
                </td>
                <td>Decarbonization / ESG</td>
              </tr>
              <tr>
                <td><strong>Comfort Compliance & Violation Hours</strong></td>
                <td>{baselineResult.comfortViolationHours} violation hrs</td>
                <td>{optimizedResult.comfortViolationHours} violation hrs</td>
                <td style={{ fontWeight: 600 }}>
                  {optimizedResult.comfortCompliancePercent}% Comfort Index
                </td>
                <td>ASHRAE 55 Standard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Building Parameters Evaluated */}
      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
          2. Building Configuration & Input Parameters
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Gross Floor Area</span>
            <strong style={{ fontSize: '15px' }}>{Number(config.floorArea).toLocaleString()} m²</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Peak Occupancy Capacity</span>
            <strong style={{ fontSize: '15px' }}>{config.occupants} persons</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Baseline Thermostat Setpoint</span>
            <strong style={{ fontSize: '15px' }}>{config.currentIndoorTemp}°C</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Recommended Comfort Setpoint</span>
            <strong style={{ fontSize: '15px', color: 'var(--orange-600)' }}>{config.preferredIndoorTemp}°C</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Peak Ambient Outdoor Temp</span>
            <strong style={{ fontSize: '15px' }}>{config.outdoorTemp}°C</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>HVAC Operating Window</span>
            <strong style={{ fontSize: '15px' }}>{String(config.hvacStartHour).padStart(2, '0')}:00 – {String(config.hvacEndHour).padStart(2, '0')}:00</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Comfort Boundary Range</span>
            <strong style={{ fontSize: '15px' }}>[{config.comfortMinTemp}°C – {config.comfortMaxTemp}°C]</strong>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Commercial Tariff & Grid Carbon</span>
            <strong style={{ fontSize: '15px' }}>₹{config.electricityPrice}/kWh • {config.co2EmissionFactor} kg/kWh</strong>
          </div>
        </div>
      </div>

      {/* Section 3: Data & Calculation Assumptions */}
      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
          3. Modeling Assumptions & Mathematical Formulations
        </h2>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '8px' }}>
            To ensure complete academic transparency for this demonstration prototype, all calculations follow explicit engineering formulas:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <strong>Energy Savings Formula:</strong> <code>Energy Savings (kWh) = Baseline Energy − Optimized Energy</code>.
            </li>
            <li>
              <strong>Savings Percentage:</strong> <code>Savings % = (Energy Savings / Baseline Energy) × 100</code>.
            </li>
            <li>
              <strong>Financial Savings:</strong> <code>Cost Savings (₹) = Energy Savings (kWh) × Electricity Tariff (₹{config.electricityPrice}/kWh)</code>.
            </li>
            <li>
              <strong>Emissions Reduction:</strong> <code>CO₂ Avoided (kg) = Energy Savings (kWh) × 0.82 kg CO₂/kWh</code> (Standard Central Electricity Authority Indian Grid Average emission factor).
            </li>
            <li>
              <strong>Thermodynamic COP Degradation:</strong> Chiller Coefficient of Performance drops linearly at 0.045 per °C as ambient condenser temperature exceeds 28°C, reflecting real thermodynamic Carnot cycle penalties.
            </li>
            <li>
              <strong>Comfort Violations:</strong> Calculated strictly as the count of occupied hours where simulated indoor air temperature falls outside the user-configured boundary <code>[{config.comfortMinTemp}°C, {config.comfortMaxTemp}°C]</code>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
