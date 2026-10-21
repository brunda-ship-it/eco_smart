// src/views/OptimizationView.jsx
import React, { useState } from 'react';
import { useBuilding } from '../context/BuildingContext';
import { generateOptimizationRationale } from '../utils/energyCalculations';
import {
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Thermometer,
  ShieldCheck,
  TrendingDown,
  IndianRupee,
  Clock,
  ArrowRight,
  Sun,
  Users,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function OptimizationView() {
  const {
    config,
    updateConfig,
    baselineResult,
    optimizedResult,
    runOptimization,
    isOptimizing,
    lastOptimizedAt,
  } = useBuilding();

  // Local state for interactive tweak sliders before committing
  const [localSetpoint, setLocalSetpoint] = useState(config.preferredIndoorTemp);
  const [localOutdoor, setLocalOutdoor] = useState(config.outdoorTemp);
  const [localComfortMin, setLocalComfortMin] = useState(config.comfortMinTemp);
  const [localComfortMax, setLocalComfortMax] = useState(config.comfortMaxTemp);

  const handleApplyAndOptimize = () => {
    updateConfig({
      preferredIndoorTemp: Number(localSetpoint),
      outdoorTemp: Number(localOutdoor),
      comfortMinTemp: Number(localComfortMin),
      comfortMaxTemp: Number(localComfortMax),
    });
    runOptimization();
  };

  const rationaleItems = generateOptimizationRationale(config, baselineResult, optimizedResult);
  const isSavingPositive = optimizedResult.energySavingsKwh >= 0;

  // Custom Chart Tooltip for Setpoints
  const CustomTempTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-main)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            fontSize: '12.5px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Hour: {label}
          </div>
          {payload.map((entry, idx) => (
            <div
              key={`item-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: entry.color,
                marginBottom: '3px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  display: 'inline-block',
                }}
              />
              <span>
                {entry.name}: <strong>{entry.value !== null ? `${entry.value}°C` : 'OFF'}</strong>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
          HVAC Recommendation & Optimization Engine
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Adjust dynamic thermostat parameters, evaluate ASHRAE comfort boundaries, and calculate real-time thermodynamic energy savings.
        </p>
      </div>

      {/* Interactive Controls Card */}
      <div className="card" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--orange-600)" />
              Interactive Control Panel & What-If Simulator
            </h2>
            <p>
              Tweak setpoint and ambient conditions to test how the optimization algorithm responds.
            </p>
          </div>
          <button
            id="btn-run-optimization-page"
            className="btn-primary"
            onClick={handleApplyAndOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <RotateCcw size={15} className="spin-animation" />
                <span>Running Optimizer...</span>
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                <span>Run Optimization</span>
              </>
            )}
          </button>
        </div>

        <div className="form-grid">
          {/* Target Comfort Setpoint */}
          <div className="form-group">
            <label className="form-label">
              <span>Target Comfort Setpoint: <strong>{localSetpoint}°C</strong></span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Baseline: {config.currentIndoorTemp}°C</span>
            </label>
            <input
              type="range"
              min="19"
              max="27"
              step="0.5"
              value={localSetpoint}
              onChange={(e) => setLocalSetpoint(Number(e.target.value))}
            />
            <span className="form-hint">
              Each +1°C setpoint increase yields approx 6% – 8% reduction in chiller electrical load.
            </span>
          </div>

          {/* Outdoor Ambient Temperature */}
          <div className="form-group">
            <label className="form-label">
              <span>Ambient Peak Temperature: <strong>{localOutdoor}°C</strong></span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Diurnal peak at 14:00</span>
            </label>
            <input
              type="range"
              min="24"
              max="46"
              step="0.5"
              value={localOutdoor}
              onChange={(e) => setLocalOutdoor(Number(e.target.value))}
            />
            <span className="form-hint">Simulates seasonal heatwave or mild transition climate.</span>
          </div>

          {/* Comfort Min Boundary */}
          <div className="form-group">
            <label className="form-label">
              <span>Comfort Min Limit: <strong>{localComfortMin}°C</strong></span>
            </label>
            <input
              type="range"
              min="18"
              max="23"
              step="0.5"
              value={localComfortMin}
              onChange={(e) => setLocalComfortMin(Number(e.target.value))}
            />
            <span className="form-hint">Lower permissible comfort threshold.</span>
          </div>

          {/* Comfort Max Boundary */}
          <div className="form-group">
            <label className="form-label">
              <span>Comfort Max Limit: <strong>{localComfortMax}°C</strong></span>
            </label>
            <input
              type="range"
              min="24"
              max="28"
              step="0.5"
              value={localComfortMax}
              onChange={(e) => setLocalComfortMax(Number(e.target.value))}
            />
            <span className="form-hint">Upper permissible comfort threshold.</span>
          </div>
        </div>
      </div>

      {/* 9-Step Optimization Execution Pipeline Results */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
        Optimization Execution Pipeline (Transparent Results)
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Step 1 & 2: Baseline Snapshot */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
              1
            </span>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Baseline Schedule & Consumption</h3>
          </div>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fixed Setpoint:</span>
              <strong>{config.currentIndoorTemp}°C</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Operating Window:</span>
              <span>{String(config.hvacStartHour).padStart(2, '0')}:00 – {String(config.hvacEndHour).padStart(2, '0')}:00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Baseline 24h Energy:</span>
              <strong>{baselineResult.totalEnergyKwh} kWh</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Baseline Peak Demand:</span>
              <span>{baselineResult.peakDemandKw} kW</span>
            </div>
          </div>
        </div>

        {/* Step 3 & 4: Recommended Schedule */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--orange-100)', color: 'var(--orange-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
              2
            </span>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Recommended Dynamic Schedule</h3>
          </div>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Occupied Setpoint:</span>
              <strong style={{ color: 'var(--orange-600)' }}>{config.preferredIndoorTemp}°C</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Unoccupied Setback:</span>
              <span>27.5°C (Eco-Float)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Optimized 24h Energy:</span>
              <strong style={{ color: 'var(--orange-600)' }}>{optimizedResult.totalEnergyKwh} kWh</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Optimized Peak Demand:</span>
              <span>{optimizedResult.peakDemandKw} kW</span>
            </div>
          </div>
        </div>

        {/* Step 5, 6, 7: Energy, Cost & Carbon Savings */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--green-100)', color: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
              3
            </span>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Calculated Savings & Reductions</h3>
          </div>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Energy Conserved:</span>
              <strong style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626' }}>
                {optimizedResult.energySavingsKwh} kWh ({optimizedResult.energySavingsPercent}%)
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Electricity Cost Saved:</span>
              <strong style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626' }}>
                ₹{optimizedResult.costSavings.toLocaleString()} / day
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Peak Load Shaved:</span>
              <span>-{optimizedResult.peakReductionKw} kW ({optimizedResult.peakReductionPercent}%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CO₂ Avoided:</span>
              <span style={{ color: 'var(--eco-green)', fontWeight: 600 }}>
                {optimizedResult.co2SavingsKg} kg CO₂ / day
              </span>
            </div>
          </div>
        </div>

        {/* Step 8 & 9: Comfort Check & Rationale */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--blue-100)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
              4
            </span>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Comfort Boundary Verification</h3>
          </div>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Configured Comfort Band:</span>
              <span>[{config.comfortMinTemp}°C – {config.comfortMaxTemp}°C]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Comfort Violation Hours:</span>
              <strong>{optimizedResult.comfortViolationHours} hours</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Comfort Compliance:</span>
              <strong style={{ color: 'var(--eco-green)' }}>{optimizedResult.comfortCompliancePercent}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ fontWeight: 600, color: optimizedResult.comfortViolationHours === 0 ? 'var(--eco-green)' : 'var(--orange-600)' }}>
                {optimizedResult.comfortStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Trajectory Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Indoor Temperature Trajectory & Outdoor Ambient Curve</h2>
            <p>
              Tracks indoor simulated temperature against outdoor conditions and the allowable ASHRAE comfort envelope.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#dc2626', borderRadius: '50%' }} />
              Outdoor Ambient (°C)
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#94a3b8',
                backgroundColor: 'var(--bg-subtle)',
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#94a3b8', borderRadius: '50%' }} />
              Baseline Temp (°C)
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--orange-700)',
                backgroundColor: 'var(--orange-100)',
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#ea580c', borderRadius: '50%' }} />
              Optimized Indoor Temp (°C)
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart
              data={optimizedResult.hourlyData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" vertical={false} />
              <XAxis dataKey="hourLabel" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                unit="°C"
                domain={[16, 'dataMax + 2']}
                width={50}
              />
              <Tooltip content={<CustomTempTooltip />} />
              <Line
                type="monotone"
                dataKey="outdoorTemp"
                name="Outdoor Ambient"
                stroke="#dc2626"
                strokeWidth={1.8}
                dot={false}
              />
              <Line
                type="stepAfter"
                dataKey="targetSetpoint"
                name="Optimized Setpoint"
                stroke="#ea580c"
                strokeWidth={2.2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="indoorTemp"
                name="Indoor Temp"
                stroke="#0284c7"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plain-Language Rationale for Student Demonstration */}
      <div className="card">
        <h2 style={{ fontSize: '16.5px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={17} color="var(--orange-600)" />
          How to Explain This Recommendation in Your Demo (Student Guide)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {rationaleItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: item.type === 'savings' ? 'var(--green-50)' : item.type === 'warning' ? '#fef2f2' : 'var(--bg-subtle)',
                border: `1px solid ${item.type === 'savings' ? 'var(--green-100)' : item.type === 'warning' ? '#fee2e2' : 'var(--border-light)'}`,
              }}
            >
              <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitation Notice */}
      <div className="notice-banner">
        <AlertTriangle size={18} style={{ color: 'var(--orange-600)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>Important Engineering Disclaimer:</strong>
          <p style={{ marginTop: '3px' }}>
            This optimization algorithm generates theoretical thermodynamic setpoint schedules. It does not directly actuate building management hardware (BMS / BACnet / Modbus). Real-world implementations require calibrated thermal sensor networks, variable speed drive (VFD) compatibility, and indoor air quality (CO₂ ventilation) monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
