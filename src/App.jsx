// src/App.jsx
import React from 'react';
import { BuildingProvider, useBuilding } from './context/BuildingContext';
import { Header } from './components/Header';
import { BuildingStrip } from './components/BuildingStrip';
import { BuildingConfigModal } from './components/BuildingConfigModal';
import { Toast } from './components/Toast';

import { DashboardView } from './views/DashboardView';
import { ForecastView } from './views/ForecastView';
import { OptimizationView } from './views/OptimizationView';
import { ReportsView } from './views/ReportsView';
import { DataSourcesView } from './views/DataSourcesView';

function MainAppContent() {
  const { activeTab } = useBuilding();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'forecast':
        return <ForecastView />;
      case 'optimization':
        return <OptimizationView />;
      case 'reports':
        return <ReportsView />;
      case 'datasources':
        return <DataSourcesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-layout">
      {/* Top sticky navigation header */}
      <Header />

      {/* Main page container */}
      <main className="main-content">
        {/* Active building summary strip */}
        <BuildingStrip />

        {/* View component */}
        {renderActiveView()}
      </main>

      {/* Modal Dialogs and Overlays */}
      <BuildingConfigModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BuildingProvider>
      <MainAppContent />
    </BuildingProvider>
  );
}
