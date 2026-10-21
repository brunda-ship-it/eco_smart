// src/components/Header.jsx
import React from 'react';
import { useBuilding } from '../context/BuildingContext';
import { BUILDING_TYPES } from '../data/buildingPresets';
import {
  Zap,
  Sliders,
  Play,
  RotateCcw,
  LayoutDashboard,
  TrendingUp,
  Cpu,
  FileSpreadsheet,
  Database,
  Building,
} from 'lucide-react';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    selectedPresetId,
    loadPreset,
    resetToDemoValues,
    runOptimization,
    isOptimizing,
    setIsConfigModalOpen,
    config,
  } = useBuilding();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Energy Forecast', icon: TrendingUp },
    { id: 'optimization', label: 'HVAC Optimization', icon: Cpu },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'datasources', label: 'Data Sources', icon: Database },
  ];

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        {/* Brand identity */}
        <div className="brand-section" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-logo-icon">
            <Zap size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-titles">
            <div className="brand-name">
              EcoSmart <span className="ai-badge">AI</span>
            </div>
            <span className="brand-subtitle">Building Energy Optimizer</span>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="nav-tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Preset Selector & Quick Action Buttons */}
        <div className="top-actions">
          {/* Quick preset selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={16} color="var(--text-muted)" />
            <select
              id="building-preset-select"
              aria-label="Select Building Preset"
              value={selectedPresetId}
              onChange={(e) => loadPreset(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '13px', fontWeight: 500 }}
            >
              {BUILDING_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  Preset: {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Load Demo Data Button */}
          <button
            id="btn-load-demo-data"
            className="btn-secondary"
            onClick={resetToDemoValues}
            title="Reload baseline demo figures"
          >
            <RotateCcw size={14} />
            <span className="hide-sm">Load Demo</span>
          </button>

          {/* Building Settings Modal trigger */}
          <button
            id="btn-open-config"
            className="btn-secondary"
            onClick={() => setIsConfigModalOpen(true)}
            title="Configure building parameters"
          >
            <Sliders size={14} />
            <span className="hide-sm">Configure</span>
          </button>

          {/* Run Optimization Button */}
          <button
            id="btn-run-optimization-top"
            className="btn-primary"
            onClick={runOptimization}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <RotateCcw size={15} className="spin-animation" />
                <span>Optimizing...</span>
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
    </header>
  );
}
