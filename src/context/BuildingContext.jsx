// src/context/BuildingContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { BUILDING_PRESETS } from '../data/buildingPresets';
import {
  simulateBaselineDay,
  simulateOptimizedDay,
  generateEnergyForecast,
} from '../utils/energyCalculations';

const BuildingContext = createContext(null);

const STORAGE_KEY = 'ecosmart_building_config_v1';
const PRESET_KEY = 'ecosmart_selected_preset_v1';

export function BuildingProvider({ children }) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal open states
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Selected preset identifier
  const [selectedPresetId, setSelectedPresetId] = useState(() => {
    try {
      const savedPreset = localStorage.getItem(PRESET_KEY);
      if (savedPreset && BUILDING_PRESETS[savedPreset]) {
        return savedPreset;
      }
    } catch (e) {
      console.warn('LocalStorage access error:', e);
    }
    return 'Office';
  });

  // Building configuration
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.buildingType) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved config:', e);
    }
    return { ...BUILDING_PRESETS.Office };
  });

  // Optimization calculation in progress state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimizedAt, setLastOptimizedAt] = useState(() => new Date().toLocaleTimeString());
  const [toastMessage, setToastMessage] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      localStorage.setItem(PRESET_KEY, selectedPresetId);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [config, selectedPresetId]);

  // Derived baseline simulation calculation
  const baselineResult = useMemo(() => {
    return simulateBaselineDay(config);
  }, [config]);

  // Derived optimized simulation calculation
  const optimizedResult = useMemo(() => {
    return simulateOptimizedDay(config, baselineResult);
  }, [config, baselineResult]);

  // Derived 24h forecast calculation
  const forecastResult = useMemo(() => {
    return generateEnergyForecast(config, baselineResult);
  }, [config, baselineResult]);

  // Action: Load a preset building profile
  const loadPreset = (presetKey) => {
    if (BUILDING_PRESETS[presetKey]) {
      const newConfig = { ...BUILDING_PRESETS[presetKey] };
      setSelectedPresetId(presetKey);
      setConfig(newConfig);
      setLastOptimizedAt(new Date().toLocaleTimeString());
      setToastMessage({
        title: `Loaded ${presetKey} Demo Data`,
        text: `Switched configuration to ${newConfig.name} (${newConfig.floorArea} m²).`,
        type: 'info',
      });
    }
  };

  // Action: Reset current building config to preset defaults
  const resetToDemoValues = () => {
    const basePreset = BUILDING_PRESETS[selectedPresetId] || BUILDING_PRESETS.Office;
    setConfig({ ...basePreset });
    setLastOptimizedAt(new Date().toLocaleTimeString());
    setToastMessage({
      title: 'Restored Demo Defaults',
      text: `Building parameters reset to baseline demo profile for ${basePreset.buildingType}.`,
      type: 'success',
    });
  };

  // Action: Update building config partially
  const updateConfig = (updates) => {
    setConfig((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  // Action: Explicit "Run Optimization" action with micro-feedback
  const runOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setLastOptimizedAt(new Date().toLocaleTimeString());
      setToastMessage({
        title: 'HVAC Optimization Completed',
        text: `Recommended setpoint: ${config.preferredIndoorTemp}°C. Estimated savings: ${optimizedResult.energySavingsKwh} kWh (${optimizedResult.energySavingsPercent}%).`,
        type: 'success',
      });
    }, 450);
  };

  const value = {
    activeTab,
    setActiveTab,
    config,
    updateConfig,
    selectedPresetId,
    loadPreset,
    resetToDemoValues,
    baselineResult,
    optimizedResult,
    forecastResult,
    isOptimizing,
    runOptimization,
    lastOptimizedAt,
    isConfigModalOpen,
    setIsConfigModalOpen,
    toastMessage,
    setToastMessage,
  };

  return <BuildingContext.Provider value={value}>{children}</BuildingContext.Provider>;
}

export function useBuilding() {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error('useBuilding must be used within a BuildingProvider');
  }
  return context;
}
