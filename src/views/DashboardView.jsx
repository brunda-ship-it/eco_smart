// src/views/DashboardView.jsx
import React from 'react';
import { useBuilding } from '../context/BuildingContext';
import {
  Zap,
  TrendingDown,
  Thermometer,
  ShieldCheck,
  Activity,
  Flame,
  Leaf,
  IndianRupee,
  RotateCcw,
  Play,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export function DashboardView() {
  const {
    config,
    baselineResult,
    optimizedResult,
    forecastResult,
    runOptimization,
    resetToDemoValues,
    isOptimizing,
    setActiveTab,
  } = useBuilding();

  const isSavingPositive = optimizedResult.energySavingsKwh >= 0;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
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
                {entry.name}: <strong>{entry.value} {entry.unit || 'kWh'}</strong>
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
      {/* Action Strip with visible buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Real-Time Building Energy Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Comparing unmanaged baseline HVAC schedule with EcoSmart dynamic AI recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            id="btn-dashboard-load-demo"
            className="btn-secondary"
            onClick={resetToDemoValues}
            title="Load consistent sample building parameters"
          >
            <RotateCcw size={15} />
            <span>Load Demo Data</span>
          </button>

          <button
            id="btn-dashboard-run-opt"
            className="btn-primary"
            onClick={runOptimization}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <RotateCcw size={15} className="spin-animation" />
                <span>Recalculating...</span>
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                <span>Run Optimization</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Required KPI Cards */}
      <div className="kpi-grid">
        {/* KPI 1: Current Energy Consumption (kWh) */}
        <div className="kpi-card" id="kpi-current-energy">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Current Hourly Usage</span>
              <div className="kpi-icon-wrapper kpi-icon-orange">
                <Zap size={18} />
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{config.currentHourlyEnergy}</span>
              <span className="kpi-unit">kWh/h</span>
            </div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-secondary)' }}>
              Active load • Peak 24h: {baselineResult.peakDemandKw} kW
            </span>
          </div>
        </div>

        {/* KPI 2: Predicted Energy Consumption (kWh) */}
        <div className="kpi-card" id="kpi-predicted-energy">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Forecasted 24h Total</span>
              <div className="kpi-icon-wrapper kpi-icon-blue">
                <Activity size={18} />
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{forecastResult.totalForecastKwh}</span>
              <span className="kpi-unit">kWh</span>
            </div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-secondary)' }}>
              Next 24 hours demand projection
            </span>
          </div>
        </div>

        {/* KPI 3: Estimated Energy Savings (%) */}
        <div className="kpi-card" id="kpi-energy-savings">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Estimated Energy Savings</span>
              <div className="kpi-icon-wrapper kpi-icon-green">
                <TrendingDown size={18} />
              </div>
            </div>
            <div className="kpi-value-row">
              <span
                className="kpi-value"
                style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626' }}
              >
                {optimizedResult.energySavingsPercent}%
              </span>
              <span className="kpi-unit">({optimizedResult.energySavingsKwh} kWh)</span>
            </div>
          </div>
          <div className="kpi-footer">
            {isSavingPositive ? (
              <span className="kpi-badge-positive">
                <TrendingDown size={12} /> ₹{optimizedResult.costSavings} saved / day
              </span>
            ) : (
              <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: 600 }}>
                Extra energy used for cooler comfort
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: Peak Demand (kW) */}
        <div className="kpi-card" id="kpi-peak-demand">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Optimized Peak Demand</span>
              <div className="kpi-icon-wrapper kpi-icon-orange">
                <Flame size={18} />
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{optimizedResult.peakDemandKw}</span>
              <span className="kpi-unit">kW</span>
            </div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-secondary)' }}>
              Baseline peak: {optimizedResult.baselinePeakKw} kW (-{optimizedResult.peakReductionKw} kW)
            </span>
          </div>
        </div>

        {/* KPI 5: Indoor Temperature (°C) */}
        <div className="kpi-card" id="kpi-indoor-temp">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Indoor Setpoint / Temp</span>
              <div className="kpi-icon-wrapper kpi-icon-blue">
                <Thermometer size={18} />
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{config.preferredIndoorTemp}°C</span>
              <span className="kpi-unit">opt. setpoint</span>
            </div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-secondary)' }}>
              Baseline was: {config.currentIndoorTemp}°C (Outdoor: {config.outdoorTemp}°C)
            </span>
          </div>
        </div>

        {/* KPI 6: Comfort Status */}
        <div className="kpi-card" id="kpi-comfort-status">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Occupant Comfort</span>
              <div className="kpi-icon-wrapper kpi-icon-green">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="kpi-value-row">
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: optimizedResult.comfortViolationHours === 0 ? 'var(--eco-green)' : 'var(--orange-600)',
                }}
              >
                {optimizedResult.comfortViolationHours === 0 ? 'Optimal (100%)' : `${optimizedResult.comfortCompliancePercent}% Compliant`}
              </span>
            </div>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-secondary)' }}>
              Band: [{config.comfortMinTemp}°C – {config.comfortMaxTemp}°C] • {optimizedResult.comfortViolationHours}h drift
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Chart 1: Hourly Energy Consumption Profile */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h2>24-Hour Hourly Energy Consumption: Baseline vs. Optimized</h2>
              <p>
                Visual comparison of hourly electrical load (kWh) across the full daily cycle. Shaded area indicates energy conserved through smart setpoint optimization.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                }}
              >
                <span style={{ width: '8px', height: '8px', backgroundColor: '#94a3b8', borderRadius: '50%' }} />
                Baseline Schedule
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
                EcoSmart Optimized
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart
                data={optimizedResult.hourlyData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="optGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" vertical={false} />
                <XAxis dataKey="hourLabel" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  unit=" kWh"
                  width={65}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="baselineEnergyKwh"
                  name="Baseline Energy"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#baseGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="energyKwh"
                  name="Optimized Energy"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#optGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
            }}
          >
            <div>
              <strong>Key Observation:</strong> Peak shaving occurs between 13:00 - 16:00 when baseline demand spikes under maximum outdoor temperatures ({config.outdoorTemp}°C).
            </div>
            <button
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '4px 10px' }}
              onClick={() => setActiveTab('optimization')}
            >
              <span>Explore HVAC Strategy</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Daily Energy Summary Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Card: Energy Totals */}
          <div className="card" style={{ marginBottom: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--orange-600)" />
              Daily Energy Totals
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Baseline 24h Consumption:</span>
                <strong>{baselineResult.totalEnergyKwh} kWh</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Optimized 24h Consumption:</span>
                <strong style={{ color: 'var(--orange-600)' }}>{optimizedResult.totalEnergyKwh} kWh</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Net Energy Saved:</span>
                <strong style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626' }}>
                  {optimizedResult.energySavingsKwh} kWh ({optimizedResult.energySavingsPercent}%)
                </strong>
              </div>
            </div>
          </div>

          {/* Card: Cost & Environmental Impact */}
          <div className="card" style={{ marginBottom: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IndianRupee size={16} color="var(--eco-green)" />
              Financial & Carbon Impact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Baseline Daily Cost:</span>
                <span>₹{baselineResult.electricityCost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Optimized Daily Cost:</span>
                <span>₹{optimizedResult.electricityCost.toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Estimated Daily Savings:</span>
                <strong style={{ color: isSavingPositive ? 'var(--eco-green)' : '#dc2626' }}>
                  ₹{optimizedResult.costSavings.toLocaleString()} / day
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <span>CO₂ Emissions Prevented:</span>
                <span style={{ color: 'var(--eco-green)', fontWeight: 600 }}>
                  🍃 {optimizedResult.co2SavingsKg} kg CO₂ / day
                </span>
              </div>
            </div>
          </div>

          {/* Card: Peak Demand & Comfort */}
          <div className="card" style={{ marginBottom: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--blue-600)" />
              Grid & Comfort Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Peak Grid Demand (Baseline):</span>
                <span>{optimizedResult.baselinePeakKw} kW</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Peak Grid Demand (Optimized):</span>
                <strong style={{ color: 'var(--orange-600)' }}>{optimizedResult.peakDemandKw} kW</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Peak Load Reduction:</span>
                <strong style={{ color: 'var(--eco-green)' }}>
                  -{optimizedResult.peakReductionKw} kW ({optimizedResult.peakReductionPercent}%)
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <span>Comfort Bounds [{config.comfortMinTemp}°C - {config.comfortMaxTemp}°C]:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {optimizedResult.comfortViolationHours} violation hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Transparency Disclaimer */}
      <div className="notice-banner">
        <Info size={18} style={{ color: 'var(--orange-600)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p>
            <strong>Transparent Calculation Notice:</strong> All metrics shown are simulated based on calibrated thermodynamic heat transfer models, ambient temperature diurnal cycles, and building occupancy schedules. Performance will vary with real-world building envelope insulation, weather variability, and HVAC equipment age.
          </p>
        </div>
      </div>
    </div>
  );
}
