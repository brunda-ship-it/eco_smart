# EcoSmart AI — Building Energy Optimizer

> **AI Energy Optimization for Buildings — Working Prototype**  
> An educational, functional, and visually clean web prototype demonstrating AI-assisted building energy forecasting, dynamic HVAC setpoint optimization, peak demand shaving, and occupant thermal comfort tracking.

---

## 1. Project Overview & Objective

Traditional heating, ventilation, and air-conditioning (HVAC) systems in commercial and institutional facilities typically run on rigid timers and fixed thermostat settings (e.g., constant 21°C). They fail to dynamically respond to shifting occupant density, ambient diurnal temperatures, or peak electrical grid tariffs, leading to excessive power consumption, high demand charges, and unnecessary carbon emissions.

**EcoSmart AI** demonstrates a working prototype that:
- **Visualizes** 24-hour building energy consumption and historical baseline patterns.
- **Forecasts** upcoming 24-hour electrical demand decomposed into physical drivers (ambient weather, occupancy body heat, solar radiation, and base loads).
- **Optimizes HVAC Setpoints** dynamically using adaptive deadbands, low-occupancy eco-drifts, and morning thermal mass pre-cooling.
- **Estimates Savings** honestly in kWh, percentage (%), and Indian Rupees (₹) alongside grid CO₂ abatement.
- **Enforces Occupant Comfort** strictly against configurable ASHRAE 55 thermal comfort boundaries, tracking any violation hours.
- **Exports Scenario Audits** as formatted CSV data files or print-ready PDF audit documents.

---

## 2. Technology Stack

- **Frontend Framework**: React 19 + Vite 8
- **Data Visualization**: Recharts (Interactive Area, Line, and Bar Charts with custom tooltips)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with light cream palette (`#fcfbf7`), dark charcoal text (`#191f24`), subtle warm orange energy accents (`#ea580c`), and eco-efficiency green badges.
- **State & Storage**: React Context API with automatic `localStorage` persistence and instant scenario synchronization.
- **Simulation Engine**: Physics-calibrated degree-hour thermodynamic heat transfer and diurnal sinusoidal ambient temperature equations.

---

## 3. Implemented Features

### A. Real-Time Dashboard
- **6 Key Performance Indicator (KPI) Cards**:
  1. *Current Hourly Usage (kWh/h)*
  2. *Forecasted 24h Total (kWh)*
  3. *Estimated Energy Savings (%)*
  4. *Peak Grid Demand (kW)*
  5. *Indoor Setpoint (°C)*
  6. *Occupant Comfort Compliance (%)*
- **Interactive 24-Hour Comparison Chart**: Baseline schedule vs. EcoSmart optimized schedule.
- **Daily Energy Summary Cards**: Net energy saved, daily financial cost reduction in ₹, and carbon avoided (kg CO₂).
- **Quick Action Triggers**: "Run Optimization" and "Load Demo Data" buttons.

### B. Building Configuration & Preset Profiles
- Instant preset switching across 4 realistic facility profiles:
  - **Commercial Office** (2,500 m², 120 occupants, 08:00–18:00 schedule)
  - **Business Hotel** (4,200 m², 220 occupants, 24/7 continuous schedule)
  - **College Campus** (5,800 m², 450 occupants, 08:00–17:00 lecture schedule)
  - **Residential Apartments** (1,400 m², 60 occupants, evening/morning schedule)
- Full configuration modal with strict validation (positive areas, non-negative occupants, physical temperature ranges).

### C. 24-Hour Energy Forecasting
- Hourly projection separating recorded historical smart meter intervals from future 24-hour demand.
- **Driver Breakdown**:
  - Outdoor ambient temperature & diurnal thermal lift (+42%)
  - Occupancy metabolic heat gains (~110W per person) (+28%)
  - Solar insolation through building fenestration (+18%)
  - Base plug, lighting, and server electrical loads (~12%)
- Transparent methodology statement preventing false machine-learning claims.

### D. HVAC Recommendation Engine
- Interactive what-if control sliders for target comfort setpoint, outdoor peak temperature, and comfort boundaries.
- **9-Step Optimization Pipeline**:
  1. Building baseline profile snapshot
  2. Baseline energy estimation
  3. Recommended adaptive setpoint & schedule
  4. Optimized energy estimation
  5. Energy conserved (kWh)
  6. Savings percentage (%)
  7. Electricity cost saved (₹)
  8. Comfort boundary compliance verification
  9. Plain-language explanation for student project presentation
- Indoor temperature trajectory chart mapping indoor air against outdoor heat waves and thermostat setpoints.

### E. Formal Audit Reports
- Executive KPI comparison table (Baseline vs. Optimized vs. Delta).
- Annualized projected financial savings (based on 300 operating days).
- Transparent documentation of engineering formulas and carbon factors.
- **Export CSV**: One-click download of full 24-hour tabular scenario data.
- **Print / Save PDF**: Dedicated `@media print` stylesheet for formatted paper or PDF submissions.

### F. Technical Data Sources Architecture
- Formal presentation of the 4 benchmark datasets and simulation frameworks from project reference slides:
  - **Source A**: *ASHRAE Great Energy Predictor III*
  - **Source B**: *Building Data Genome Project 2*
  - **Source C**: *CityLearn*
  - **Source D**: *EnergyPlus / BOPTEST*
- Prominent mandatory architectural disclaimer clearly designating them as *“Proposed for Integration / Not Connected”*.

---

## 4. Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation & Startup Commands

1. **Clone or navigate to the project directory**:
   ```bash
   cd c:\Users\brund\OneDrive\Desktop\energy_conservation
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

4. **Run Unit / Calculation Tests**:
   ```bash
   node test_calculations.js
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 5. Transparent Calculation Rules

- **Energy Savings (kWh)**:  
  $$\text{Savings (kWh)} = \text{Baseline Energy} - \text{Optimized Energy}$$
- **Energy Savings Percentage (%)**:  
  $$\text{Savings (\%)} = \left(\frac{\text{Savings (kWh)}}{\text{Baseline Energy (kWh)}}\right) \times 100$$
- **Estimated Electricity Cost Savings (₹)**:  
  $$\text{Cost Savings (₹)} = \text{Savings (kWh)} \times \text{Electricity Tariff (₹/kWh)}$$
- **Avoided Carbon Emissions (kg CO₂)**:  
  $$\text{CO}_2 \text{ Avoided (kg)} = \text{Savings (kWh)} \times 0.82 \text{ kg CO}_2\text{/kWh}$$  
  *(Based on Indian Central Electricity Authority national grid average).*
- **Comfort Violation Hours**:  
  $$\text{Count of occupied hours where } T_{\text{indoor}} < T_{\text{comfort, min}} \text{ or } T_{\text{indoor}} > T_{\text{comfort, max}}$$

> **Honest Negative Savings Handling**: If a user targets an indoor temperature lower than the baseline setpoint (e.g. setting 19°C when baseline was 22°C), the model honestly reports higher energy consumption and negative savings without artificially fudging results.

---

## 6. Known Limitations & Roadmap

1. **Simulated vs. Physical Actuation**: This prototype simulates thermodynamic behavior using heat-balance and empirical COP formulas. It does not directly interface with physical BMS protocols (such as BACnet MS/TP or Modbus TCP).
2. **Offline Data Sources**: The ASHRAE GEPIII and Building Data Genome 2 datasets are cataloged with integration schemas, but are currently not loaded via live database connections.
3. **Humidity & IAQ**: Latent cooling and indoor relative humidity are simplified; future iterations will integrate Fanger PMV/PPD moisture balances and CO₂ demand-controlled ventilation (DCV).
