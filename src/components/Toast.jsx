// src/components/Toast.jsx
import React from 'react';
import { useBuilding } from '../context/BuildingContext';
import { CheckCircle2, Info, X } from 'lucide-react';

export function Toast() {
  const { toastMessage, setToastMessage } = useBuilding();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'toast-success' : 'toast-info'}`}>
        <div style={{ color: isSuccess ? '#4ade80' : '#fb923c' }}>
          {isSuccess ? <CheckCircle2 size={18} /> : <Info size={18} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>
            {toastMessage.title}
          </div>
          <div style={{ fontSize: '12px', color: '#d1d5db', lineHeight: 1.4 }}>
            {toastMessage.text}
          </div>
        </div>
        <button
          onClick={() => setToastMessage(null)}
          style={{ color: '#9ca3af', padding: '2px' }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
