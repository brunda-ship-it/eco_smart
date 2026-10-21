// src/data/buildingPresets.js
// Pre-configured realistic building profiles for demonstration

export const BUILDING_TYPES = [
  { id: 'Office', name: 'Commercial Office', icon: 'Building2' },
  { id: 'Hotel', name: 'Business Hotel', icon: 'Hotel' },
  { id: 'College Campus', name: 'College Academic Block', icon: 'GraduationCap' },
  { id: 'Residential', name: 'Residential Apartments', icon: 'Home' },
];

export const BUILDING_PRESETS = {
  Office: {
    buildingType: 'Office',
    name: 'Metropolis Tech Park - Tower B',
    floorArea: 2500, // sq meters
    occupants: 120,
    currentIndoorTemp: 21.0, // °C (often overcooled in traditional HVAC)
    outdoorTemp: 34.5, // °C (typical warm afternoon)
    currentHourlyEnergy: 64.0, // kWh
    electricityPrice: 8.5, // ₹ / kWh (commercial tariff)
    preferredIndoorTemp: 23.5, // °C (ASHRAE comfortable & energy-efficient)
    hvacStartHour: 8, // 08:00
    hvacEndHour: 18, // 18:00
    comfortMinTemp: 22.0,
    comfortMaxTemp: 25.0,
    baseLoadKw: 15.0, // base non-HVAC electrical load (servers, lighting, plug loads)
    co2EmissionFactor: 0.82, // kg CO2 per kWh (standard Indian electricity grid average)
    description: 'Medium commercial office building with high occupancy between 09:00 - 18:00 and high afternoon solar heat gain.',
  },
  Hotel: {
    buildingType: 'Hotel',
    name: 'Grand Horizon Business Hotel',
    floorArea: 4200,
    occupants: 220,
    currentIndoorTemp: 20.8,
    outdoorTemp: 33.0,
    currentHourlyEnergy: 98.0,
    electricityPrice: 9.2,
    preferredIndoorTemp: 23.0,
    hvacStartHour: 0,
    hvacEndHour: 24, // 24/7 continuous operation
    comfortMinTemp: 21.5,
    comfortMaxTemp: 24.5,
    baseLoadKw: 32.0,
    co2EmissionFactor: 0.82,
    description: 'Full-service hospitality property with 24/7 HVAC requirement, heavy evening lighting, and variable room occupancy.',
  },
  'College Campus': {
    buildingType: 'College Campus',
    name: 'Vidyapeeth Engineering Block 4',
    floorArea: 5800,
    occupants: 450,
    currentIndoorTemp: 22.0,
    outdoorTemp: 35.0,
    currentHourlyEnergy: 112.0,
    electricityPrice: 7.8,
    preferredIndoorTemp: 24.0,
    hvacStartHour: 8,
    hvacEndHour: 17,
    comfortMinTemp: 22.5,
    comfortMaxTemp: 25.5,
    baseLoadKw: 26.0,
    co2EmissionFactor: 0.82,
    description: 'Higher education institutional building with lecture auditoriums, computer labs, and dense daytime student occupancy.',
  },
  Residential: {
    buildingType: 'Residential',
    name: 'Greenwoods Resident Towers',
    floorArea: 1400,
    occupants: 60,
    currentIndoorTemp: 21.5,
    outdoorTemp: 32.5,
    currentHourlyEnergy: 36.0,
    electricityPrice: 6.8,
    preferredIndoorTemp: 24.0,
    hvacStartHour: 17,
    hvacEndHour: 8, // Evening to morning cycle
    comfortMinTemp: 22.0,
    comfortMaxTemp: 25.5,
    baseLoadKw: 9.0,
    co2EmissionFactor: 0.82,
    description: 'Multi-family residential complex where peak cooling and appliance demand occurs in early morning and late evening.',
  },
};

export const DATA_SOURCES_INFO = [
  {
    id: 'ashrae',
    code: 'Source A',
    name: 'ASHRAE Great Energy Predictor III',
    subtitle: 'Machine Learning Competition Dataset',
    category: 'Historical Meter Data & Weather',
    status: 'Proposed for Integration',
    isConnected: false,
    badgeColor: 'amber',
    purpose: 'Provides historical multi-meter building readings (electricity, chilled water, steam, hot water) along with historical meteorological records (ambient dry-bulb temperature, dew point, cloud cover, wind speed) from over 1,000 buildings worldwide.',
    useInProject: 'Serves as the benchmark data source for training supervised regression algorithms (LightGBM / Random Forest / Neural Networks) to accurately forecast building electrical demand up to 24-48 hours ahead based on weather forecasts.',
    officialLink: 'https://www.kaggle.com/c/ashrae-energy-prediction',
    dataFormat: 'CSV (Hourly time series, site weather, building metadata)',
    sampleMetrics: ['Chilled Water Flow', 'Meter Readings (kWh)', 'Outdoor Temperature', 'Wind Speed', 'Relative Humidity']
  },
  {
    id: 'bdg2',
    code: 'Source B',
    name: 'Building Data Genome Project 2',
    subtitle: 'Open Data Repository of 1,636 Buildings',
    category: 'Commercial & Academic Metering Time Series',
    status: 'Proposed for Integration',
    isConnected: false,
    badgeColor: 'amber',
    purpose: 'A comprehensive open-access dataset containing two full consecutive years of hourly electrical meter readings and extensive spatial metadata for 1,636 non-residential buildings across 19 global climate sites.',
    useInProject: 'Enables transfer learning and validation of typical occupancy profiles across diverse building typologies (education, office, healthcare, lodging) to calibrate baseline consumption schedules.',
    officialLink: 'https://github.com/buds-lab/building-data-genome-project-2',
    dataFormat: 'Parquet / CSV (15-min & 60-min interval readings)',
    sampleMetrics: ['Primary Use Type', 'Year Built', 'Gross Floor Area', 'Hourly kW Demand', 'Solar Radiation']
  },
  {
    id: 'citylearn',
    code: 'Source C',
    name: 'CityLearn (OpenAI Gym Environment)',
    subtitle: 'Multi-Agent Demand Response & Energy Management',
    category: 'Reinforcement Learning Simulator',
    status: 'Proposed for Integration',
    isConnected: false,
    badgeColor: 'amber',
    purpose: 'An open-source benchmark simulation environment developed by the University of Texas at Austin for testing advanced control and reinforcement learning (RL) algorithms in multi-building urban districts and microgrids.',
    useInProject: 'Will allow testing co-optimization of thermal energy storage, rooftop solar PV integration, heat pumps, and peak-shaving demand response policies without risking physical equipment.',
    officialLink: 'https://www.citylearn.net/',
    dataFormat: 'Python Gym/Gymnasium API + EnergyPlus models',
    sampleMetrics: ['District Peak Shaving', 'Ramping Rate', 'Grid Carbon Emissions', 'Storage State of Charge']
  },
  {
    id: 'energyplus_boptest',
    code: 'Source D',
    name: 'EnergyPlus / BOPTEST',
    subtitle: 'Physics-Based Thermal Simulator & Benchmark Framework',
    category: 'High-Fidelity Building Energy Simulation',
    status: 'Proposed for Integration',
    isConnected: false,
    badgeColor: 'amber',
    purpose: 'EnergyPlus is the U.S. Department of Energy flagship whole-building energy simulation engine. BOPTEST (Building Optimization Performance Test) provides standard test cases for validating advanced HVAC controllers against calibrated physical models.',
    useInProject: 'Provides ground-truth thermodynamic validation for indoor temperature response, operative comfort (Fanger PMV/PPD), and HVAC variable refrigerant flow (VRF) or chiller staging under varying setpoints.',
    officialLink: 'https://energyplus.net/ / https://ibpsa.github.io/project1-boptest/',
    dataFormat: 'IDF (Input Data File), FMU (Functional Mock-up Unit)',
    sampleMetrics: ['Operative Temperature', 'Zone Mean Air Temp', 'Chiller Power (kW)', 'PMV Comfort Score', 'Fan Power']
  }
];
