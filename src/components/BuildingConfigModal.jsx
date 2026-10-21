// src/components/BuildingConfigModal.jsx
import React, { useState, useEffect } from 'react';
import { useBuilding } from '../context/BuildingContext';
import { BUILDING_TYPES } from '../data/buildingPresets';
import { X, Check, RotateCcw, AlertCircle, Info, Sliders } from 'lucide-react';

export function BuildingConfigModal() {
  const {
    isConfigModalOpen,
    setIsConfigModalOpen,
    config,
    updateConfig,
    resetToDemoValues,
    setToastMessage,
  } = useBuilding();

  const [formData, setFormData] = useState({ ...config });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isConfigModalOpen) {
      setFormData({ ...config });
      setErrors({});
    }
  }, [isConfigModalOpen, config]);

  if (!isConfigModalOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = () => {
    const errs = {};
    const area = Number(formData.floorArea);
    const occupants = Number(formData.occupants);
    const indoorTemp = Number(formData.currentIndoorTemp);
    const outdoorTemp = Number(formData.outdoorTemp);
    const hourlyEnergy = Number(formData.currentHourlyEnergy);
    const price = Number(formData.electricityPrice);
    const preferredTemp = Number(formData.preferredIndoorTemp);
    const comfortMin = Number(formData.comfortMinTemp);
    const comfortMax = Number(formData.comfortMaxTemp);
    const startHour = Number(formData.hvacStartHour);
    const endHour = Number(formData.hvacEndHour);

    if (isNaN(area) || area <= 0) {
      errs.floorArea = 'Building floor area must be greater than 0 m².';
    }
    if (isNaN(occupants) || occupants < 0) {
      errs.occupants = 'Occupancy cannot be negative.';
    }
    if (isNaN(indoorTemp) || indoorTemp < 15 || indoorTemp > 35) {
      errs.currentIndoorTemp = 'Indoor temperature must be between 15°C and 35°C.';
    }
    if (isNaN(outdoorTemp) || outdoorTemp < 5 || outdoorTemp > 52) {
      errs.outdoorTemp = 'Outdoor temperature must be between 5°C and 52°C.';
    }
    if (isNaN(hourlyEnergy) || hourlyEnergy <= 0) {
      errs.currentHourlyEnergy = 'Hourly energy consumption must be a positive number.';
    }
    if (isNaN(price) || price <= 0) {
      errs.electricityPrice = 'Electricity tariff must be greater than ₹0.';
    }
    if (isNaN(preferredTemp) || preferredTemp < 18 || preferredTemp > 30) {
      errs.preferredIndoorTemp = 'Preferred temperature must be between 18°C and 30°C.';
    }
    if (comfortMin >= comfortMax) {
      errs.comfortMaxTemp = 'Comfort Max must be higher than Comfort Min.';
    }
    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 24) {
      errs.hvacOperatingHours = 'Operating hours must be between 0:00 and 24:00.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validate()) {
      updateConfig({
        ...formData,
        floorArea: Number(formData.floorArea),
        occupants: Number(formData.occupants),
        currentIndoorTemp: Number(formData.currentIndoorTemp),
        outdoorTemp: Number(formData.outdoorTemp),
        currentHourlyEnergy: Number(formData.currentHourlyEnergy),
        electricityPrice: Number(formData.electricityPrice),
        preferredIndoorTemp: Number(formData.preferredIndoorTemp),
        comfortMinTemp: Number(formData.comfortMinTemp),
        comfortMaxTemp: Number(formData.comfortMaxTemp),
        hvacStartHour: Number(formData.hvacStartHour),
        hvacEndHour: Number(formData.hvacEndHour),
      });
      setIsConfigModalOpen(false);
      setToastMessage({
        title: 'Settings Saved',
        text: 'Building configuration updated. Dashboard and forecast recalculated.',
        type: 'success',
      });
    }
  };

  const handleReset = () => {
    resetToDemoValues();
    setIsConfigModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsConfigModalOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '32px', height: '32px' }}>
              <Sliders size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Building Configuration</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Customize architectural parameters, operating schedule, and comfort targets.
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsConfigModalOpen(false)}
            aria-label="Close configuration modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-grid">
            {/* Building Type */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-building-type">
                Building Type
              </label>
              <select
                id="cfg-building-type"
                value={formData.buildingType}
                onChange={(e) => handleChange('buildingType', e.target.value)}
              >
                {BUILDING_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <span className="form-hint">Determines typical occupancy diurnal profile</span>
            </div>

            {/* Building Floor Area */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-floor-area">
                Gross Floor Area (m²)
              </label>
              <input
                id="cfg-floor-area"
                type="number"
                step="50"
                min="50"
                value={formData.floorArea}
                onChange={(e) => handleChange('floorArea', e.target.value)}
              />
              {errors.floorArea && <span className="form-error">{errors.floorArea}</span>}
              <span className="form-hint">Conditioned floor surface area</span>
            </div>

            {/* Number of Occupants */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-occupants">
                Peak Occupants (people)
              </label>
              <input
                id="cfg-occupants"
                type="number"
                min="1"
                value={formData.occupants}
                onChange={(e) => handleChange('occupants', e.target.value)}
              />
              {errors.occupants && <span className="form-error">{errors.occupants}</span>}
              <span className="form-hint">Peak occupants (~110W thermal heat per person)</span>
            </div>

            {/* Electricity Tariff */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-electricity-price">
                Electricity Price (₹ / kWh)
              </label>
              <input
                id="cfg-electricity-price"
                type="number"
                step="0.1"
                min="0.5"
                value={formData.electricityPrice}
                onChange={(e) => handleChange('electricityPrice', e.target.value)}
              />
              {errors.electricityPrice && <span className="form-error">{errors.electricityPrice}</span>}
              <span className="form-hint">Used for rupee cost savings estimation</span>
            </div>

            {/* Current Indoor Temperature */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-indoor-temp">
                Current Indoor Setpoint (°C)
              </label>
              <input
                id="cfg-indoor-temp"
                type="number"
                step="0.5"
                min="16"
                max="32"
                value={formData.currentIndoorTemp}
                onChange={(e) => handleChange('currentIndoorTemp', e.target.value)}
              />
              {errors.currentIndoorTemp && (
                <span className="form-error">{errors.currentIndoorTemp}</span>
              )}
              <span className="form-hint">Current baseline thermostat setting</span>
            </div>

            {/* Preferred Indoor Temperature */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-preferred-temp">
                Preferred Comfort Temp (°C)
              </label>
              <input
                id="cfg-preferred-temp"
                type="number"
                step="0.5"
                min="18"
                max="30"
                value={formData.preferredIndoorTemp}
                onChange={(e) => handleChange('preferredIndoorTemp', e.target.value)}
              />
              {errors.preferredIndoorTemp && (
                <span className="form-error">{errors.preferredIndoorTemp}</span>
              )}
              <span className="form-hint">Target setpoint (ASHRAE recommends 23.5°C - 24.5°C)</span>
            </div>

            {/* Outdoor Ambient Temperature */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-outdoor-temp">
                Current Outdoor Temp (°C)
              </label>
              <input
                id="cfg-outdoor-temp"
                type="number"
                step="0.5"
                min="10"
                max="50"
                value={formData.outdoorTemp}
                onChange={(e) => handleChange('outdoorTemp', e.target.value)}
              />
              {errors.outdoorTemp && <span className="form-error">{errors.outdoorTemp}</span>}
              <span className="form-hint">Peak afternoon ambient dry-bulb temperature</span>
            </div>

            {/* Current Hourly Energy Usage */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-hourly-energy">
                Current Energy Usage (kWh/h)
              </label>
              <input
                id="cfg-hourly-energy"
                type="number"
                step="1"
                min="1"
                value={formData.currentHourlyEnergy}
                onChange={(e) => handleChange('currentHourlyEnergy', e.target.value)}
              />
              {errors.currentHourlyEnergy && (
                <span className="form-error">{errors.currentHourlyEnergy}</span>
              )}
              <span className="form-hint">Observed active electrical draw</span>
            </div>

            {/* HVAC Operating Hours */}
            <div className="form-group full-width">
              <label className="form-label">
                <span>HVAC Daily Operating Hours (24h format)</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Active from {String(formData.hvacStartHour).padStart(2, '0')}:00 to{' '}
                  {String(formData.hvacEndHour).padStart(2, '0')}:00
                </span>
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Start Hour (0-23):</span>
                  <input
                    id="cfg-hvac-start-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.hvacStartHour}
                    onChange={(e) => handleChange('hvacStartHour', e.target.value)}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>End Hour (1-24):</span>
                  <input
                    id="cfg-hvac-end-hour"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.hvacEndHour}
                    onChange={(e) => handleChange('hvacEndHour', e.target.value)}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>
              {errors.hvacOperatingHours && (
                <span className="form-error">{errors.hvacOperatingHours}</span>
              )}
              <span className="form-hint">
                Outside these hours, the optimizer initiates unoccupied setback floating temperature.
              </span>
            </div>

            {/* Comfort Boundaries */}
            <div className="form-group">
              <label className="form-label" htmlFor="cfg-comfort-min">
                Comfort Min Boundary (°C)
              </label>
              <input
                id="cfg-comfort-min"
                type="number"
                step="0.5"
                min="18"
                max="24"
                value={formData.comfortMinTemp}
                onChange={(e) => handleChange('comfortMinTemp', e.target.value)}
              />
              <span className="form-hint">Lower limit before space feels too chilly</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cfg-comfort-max">
                Comfort Max Boundary (°C)
              </label>
              <input
                id="cfg-comfort-max"
                type="number"
                step="0.5"
                min="23"
                max="28"
                value={formData.comfortMaxTemp}
                onChange={(e) => handleChange('comfortMaxTemp', e.target.value)}
              />
              {errors.comfortMaxTemp && <span className="form-error">{errors.comfortMaxTemp}</span>}
              <span className="form-hint">Upper limit before space feels too warm</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <button
              type="button"
              id="btn-reset-demo-modal"
              className="btn-secondary"
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              <span>Reset to Demo Values</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsConfigModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" id="btn-save-settings" className="btn-primary">
                <Check size={15} />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
