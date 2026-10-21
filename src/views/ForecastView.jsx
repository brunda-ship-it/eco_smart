// src/views/ForecastView.jsx
import React from 'react';
import { useBuilding } from '../context/BuildingContext';
import {
  TrendingUp,
  Clock,
  Sun,
  Users,
  Building2,
  Info,
  Calendar,
  Zap,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export function ForecastView() {
  const { config, forecastResult, baselineResult } = useBuilding();

  const CustomForecastTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-main)',
            borderRadius: '8px',
            padding: '12px 16px',
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
                {entry.name}: <strong>{entry.value !== null ? `${entry.value} kWh` : 'N/A'}</strong>
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
          24-Hour Energy Demand Forecasting
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Estimates upcoming hourly electrical load profile using ambient meteorological cycles, building thermal mass, and occupancy patterns.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Forecasted 24h Total</span>
            <div className="kpi-icon-wrapper kpi-icon-orange">
              <Zap size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{forecastResult.totalForecastKwh}</span>
            <span className="kpi-unit">kWh</span>
          </div>
          <div className="kpi-footer">
            <span>Projected whole-building consumption</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Estimated Peak Demand</span>
            <div className="kpi-icon-wrapper kpi-icon-orange">
              <Activity size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{forecastResult.peakForecastDemandKw}</span>
            <span className="kpi-unit">kW</span>
          </div>
          <div className="kpi-footer">
            <span>Expected peak spike at <strong>{forecastResult.peakHourLabel}</strong></span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Average Outdoor Temp</span>
            <div className="kpi-icon-wrapper kpi-icon-blue">
              <Sun size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{forecastResult.avgOutdoorTemp}°C</span>
            <span className="kpi-unit">diurnal mean</span>
          </div>
          <div className="kpi-footer">
            <span>Max ambient: {config.outdoorTemp}°C at 14:00</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Building Profile</span>
            <div className="kpi-icon-wrapper kpi-icon-green">
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ fontSize: '20px' }}>{config.buildingType}</span>
          </div>
          <div className="kpi-footer">
            <span>{config.floorArea} m² • {config.occupants} occupants</span>
          </div>
        </div>
      </div>

      {/* Main Forecasting Chart: Historical Actual vs Forecasted */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Actual Historical Meter Readings vs. 24-Hour Forecast</h2>
            <p>
              Solid blue line reflects recorded smart meter intervals; dashed orange curve depicts the forward-looking demand forecast.
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
                color: '#0284c7',
                backgroundColor: 'var(--blue-50)',
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#0284c7', borderRadius: '50%' }} />
              Actual Historical (00:00 - 13:00)
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
              Demand Forecast (Next 24h)
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 340 }}>
          <ResponsiveContainer>
            <LineChart
              data={forecastResult.forecastHourly}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" vertical={false} />
              <XAxis dataKey="hourLabel" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                unit=" kWh"
                width={65}
              />
              <Tooltip content={<CustomForecastTooltip />} />
              <Line
                type="monotone"
                dataKey="historicalKwh"
                name="Actual Historical"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0284c7' }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecastKwh"
                name="Forecast Demand"
                stroke="#ea580c"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#ea580c' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Explanation of Energy Rises and Falls */}
        <div
          style={{
            marginTop: '18px',
            padding: '14px 18px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
            Why does energy demand fluctuate throughout the 24 hours?
          </strong>
          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>
              <strong>00:00 – 06:00 (Night Valley):</strong> Demand remains flat around base electrical load ({config.baseLoadKw || 15} kW) because building occupants are absent and ambient outdoor temperatures are at their diurnal low (~24°C).
            </li>
            <li>
              <strong>08:00 – 12:00 (Morning Ramp):</strong> As occupants arrive and operate equipment, internal heat gain increases while solar radiation begins warming the envelope, prompting HVAC chillers to ramp up.
            </li>
            <li>
              <strong>13:00 – 16:00 (Peak Thermal Lift):</strong> Outdoor temperatures reach {config.outdoorTemp}°C while solar fenestration is intense. Chiller efficiency (COP) degrades, producing the day's maximum electrical demand spike ({forecastResult.peakForecastDemandKw} kW).
            </li>
            <li>
              <strong>18:00 – 23:00 (Evening Decline):</strong> Post-operating hours, occupants leave, solar gains cease, and ambient cooling allows building thermal load to decay back toward standby levels.
            </li>
          </ul>
        </div>
      </div>

      {/* Influencing Factors Cards */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px' }}>
        Key Forecasting Drivers & Physics Influences
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {forecastResult.influencingFactors.map((item, index) => (
          <div key={index} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.factor}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: 'var(--orange-100)',
                  color: 'var(--orange-700)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {item.impact}
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {item.direction}
            </p>
          </div>
        ))}
      </div>

      {/* Model Transparency Note */}
      <div className="notice-banner">
        <Info size={18} style={{ color: 'var(--orange-600)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>
            Transparent Methodology Statement (No False ML Claims):
          </strong>
          <p style={{ marginTop: '3px' }}>
            This prototype calculates forecasts using an engineering degree-hour thermal transfer model combined with calibrated empirical occupancy profiles. External machine-learning models (such as LightGBM or LSTM neural networks trained on ASHRAE Great Energy Predictor III) are not currently trained or connected.
          </p>
        </div>
      </div>
    </div>
  );
}
