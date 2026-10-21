// src/views/DataSourcesView.jsx
import React from 'react';
import { DATA_SOURCES_INFO } from '../data/buildingPresets';
import {
  Database,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Layers,
  Cpu,
  BarChart3,
  Flame,
  Info,
  GitBranch,
} from 'lucide-react';

export function DataSourcesView() {
  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Project Technical Data Sources & Simulation Architecture
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Foundational research datasets, benchmarks, and thermal simulators identified in the project reference architecture.
        </p>
      </div>

      {/* Prominent Mandatory Notice */}
      <div
        className="notice-banner"
        style={{
          borderLeft: '4px solid var(--orange-600)',
          backgroundColor: 'var(--orange-50)',
          padding: '18px 20px',
        }}
      >
        <AlertCircle size={22} style={{ color: 'var(--orange-600)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#431407', marginBottom: '4px' }}>
            Prototype Architecture & Integration Notice
          </h2>
          <p style={{ fontSize: '13.5px', color: '#7c2d12', lineHeight: 1.55 }}>
            "Forecasting and optimization currently use the prototype's available data and simplified calculations. Integration with external datasets and building simulators is a future enhancement."
          </p>
          <p style={{ fontSize: '12px', color: '#9a3412', marginTop: '6px' }}>
            Real-world dataset-based forecasting (ASHRAE / BDG2) is architecturally segregated from dynamic HVAC closed-loop control simulation (EnergyPlus / BOPTEST / CityLearn).
          </p>
        </div>
      </div>

      {/* 4 Data Sources Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
        {DATA_SOURCES_INFO.map((source) => (
          <div key={source.id} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'var(--orange-100)',
                      color: 'var(--orange-700)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {source.code}
                  </span>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {source.name}
                  </h2>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {source.subtitle} • Category: <strong>{source.category}</strong>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: source.isConnected ? 'var(--green-100)' : 'var(--bg-subtle)',
                    color: source.isConnected ? 'var(--green-700)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-main)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: source.isConnected ? 'var(--green-600)' : '#94a3b8',
                    }}
                  />
                  {source.status}
                </span>

                <a
                  href={source.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '5px 10px', textDecoration: 'none' }}
                >
                  <span>Official Docs</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '13px', lineHeight: 1.55 }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  What data or functionality it provides:
                </strong>
                <p style={{ color: 'var(--text-secondary)' }}>{source.purpose}</p>
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>Native Data Format:</strong> {source.dataFormat}
                </div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  How it can be used in this project:
                </strong>
                <p style={{ color: 'var(--text-secondary)' }}>{source.useInProject}</p>
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>Target Parameters:</strong> {source.sampleMetrics.join(', ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Roadmap for Student Demo */}
      <div className="card">
        <h2 style={{ fontSize: '16.5px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch size={17} color="var(--orange-600)" />
          Future Integration Architecture Roadmap
        </h2>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '10px' }}>
            In a subsequent production phase, this frontend dashboard is designed to connect to a Python microservice via REST API:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
              <strong>Phase 1: Ingestion</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Automated ETL pipeline loading ASHRAE GEPIII Parquet files into a time-series database.
              </p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
              <strong>Phase 2: Model Training</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Scikit-Learn / LightGBM gradient-boosted trees trained on 2 years of weather and meter readings.
              </p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
              <strong>Phase 3: Co-Simulation</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                EnergyPlus / BOPTEST co-simulation over Functional Mock-up Units (FMU) for active chiller staging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
