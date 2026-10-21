// src/components/BuildingStrip.jsx
import React from 'react';
import { useBuilding } from '../context/BuildingContext';
import {
  Building2,
  Users,
  Maximize2,
  Sun,
  IndianRupee,
  Clock,
  Edit3,
  Calendar,
} from 'lucide-react';

export function BuildingStrip() {
  const { config, setIsConfigModalOpen, lastOptimizedAt } = useBuilding();

  return (
    <div className="building-strip">
      <div className="building-strip-info">
        <div className="building-type-badge">
          <Building2 size={15} />
          <span>{config.buildingType}</span>
        </div>
        <div>
          <h2 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {config.name || `${config.buildingType} Facility`}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {config.description || 'Configured facility profile'}
          </p>
        </div>
      </div>

      <div className="building-strip-meta">
        <div className="building-strip-meta-item" title="Gross Floor Area">
          <Maximize2 size={14} color="var(--text-muted)" />
          <span>Area: <strong>{Number(config.floorArea).toLocaleString()} m²</strong></span>
        </div>

        <div className="building-strip-meta-item" title="Peak Occupancy">
          <Users size={14} color="var(--text-muted)" />
          <span>Occupancy: <strong>{config.occupants} persons</strong></span>
        </div>

        <div className="building-strip-meta-item" title="Ambient Outdoor Temperature">
          <Sun size={14} color="var(--orange-500)" />
          <span>Ambient: <strong>{config.outdoorTemp}°C</strong></span>
        </div>

        <div className="building-strip-meta-item" title="Commercial Electricity Tariff">
          <IndianRupee size={14} color="var(--text-muted)" />
          <span>Tariff: <strong>₹{config.electricityPrice}/kWh</strong></span>
        </div>

        <div className="building-strip-meta-item" title="HVAC Scheduled Hours">
          <Clock size={14} color="var(--text-muted)" />
          <span>HVAC Hours: <strong>{String(config.hvacStartHour).padStart(2, '0')}:00 – {String(config.hvacEndHour).padStart(2, '0')}:00</strong></span>
        </div>

        <button
          id="btn-edit-building-strip"
          className="btn-secondary"
          onClick={() => setIsConfigModalOpen(true)}
          style={{ padding: '6px 12px', fontSize: '12.5px' }}
        >
          <Edit3 size={13} />
          <span>Edit Parameters</span>
        </button>
      </div>
    </div>
  );
}
