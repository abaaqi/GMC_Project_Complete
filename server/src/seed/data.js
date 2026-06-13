/* Seed dataset — mirrors the Phase 1 frontend mock data so the app shows
   the same farm whether it is reading from mocks or from this API. */

export const demoUser = {
  name: 'Abdul-Baaqi Jempeji',
  email: 'demo@mahafarm.ng',
  password: 'password123',
}

export const demoFarm = {
  name: 'Shivneri Estate',
  location: 'Junnar, Maharashtra',
  area: 48,
  areaUnit: 'acres',
  established: 2019,
  zones: 6,
  waterSavedWeek: 18400,
}

export const fields = [
  { name: 'North Block', crop: 'Sugarcane', variety: 'Co-86032', stage: 'Grand growth', progress: 64, health: 94, moisture: 66, plantedOn: '2026-01-12', nextAction: 'Fertigation due in 2 days', status: 'healthy' },
  { name: 'River Plot', crop: 'Grapes', variety: 'Thompson Seedless', stage: 'Fruit set', progress: 48, health: 88, moisture: 59, plantedOn: '2025-11-03', nextAction: 'Canopy check recommended', status: 'healthy' },
  { name: 'East Terrace', crop: 'Tomato', variety: 'Abhinav F1', stage: 'Flowering', progress: 52, health: 73, moisture: 47, plantedOn: '2026-03-21', nextAction: 'Low moisture — irrigation queued', status: 'warn' },
  { name: 'Greenhouse 1', crop: 'Capsicum', variety: 'Indra', stage: 'Vegetative', progress: 31, health: 90, moisture: 64, plantedOn: '2026-04-18', nextAction: 'On track', status: 'healthy' },
  { name: 'South Field', crop: 'Onion', variety: 'Bhima Red', stage: 'Bulb development', progress: 70, health: 67, moisture: 44, plantedOn: '2026-02-08', nextAction: 'Possible thrips — scan advised', status: 'alert' },
  { name: 'West Block', crop: 'Wheat', variety: 'Lokwan', stage: 'Maturity', progress: 88, health: 92, moisture: 55, plantedOn: '2025-12-15', nextAction: 'Harvest window in ~9 days', status: 'healthy' },
]

export const sensors = [
  { label: 'Soil moisture', value: 62, unit: '%', status: 'healthy', icon: 'droplets', zone: 'Zone A' },
  { label: 'Air temp', value: 29.4, unit: '°C', status: 'healthy', icon: 'thermometer', zone: 'Field avg' },
  { label: 'Humidity', value: 68, unit: '%', status: 'healthy', icon: 'wind', zone: 'Field avg' },
  { label: 'Soil pH', value: 6.8, unit: 'pH', status: 'healthy', icon: 'flask', zone: 'Zone B' },
  { label: 'Light', value: 842, unit: 'µmol', status: 'warn', icon: 'sun', zone: 'Greenhouse' },
  { label: 'Tank level', value: 41, unit: '%', status: 'warn', icon: 'gauge', zone: 'Reservoir' },
]

// agoMin → how many minutes ago the alert was raised (drives "time" in the UI).
export const alerts = [
  { severity: 'alert', title: 'Possible thrips in South Field', body: 'Vision model flagged leaf stippling on onion rows 4–7. Confidence 86%.', zone: 'South Field', agoMin: 12 },
  { severity: 'warn', title: 'Reservoir below 45%', body: 'Tank level trending down. Refill scheduled, ETA tomorrow 06:00.', zone: 'Reservoir', agoMin: 60 },
  { severity: 'warn', title: 'East Terrace soil moisture low', body: 'Dropped to 47%. Auto-irrigation queued for the next window.', zone: 'East Terrace', agoMin: 120 },
  { severity: 'info', title: 'Fertigation completed', body: 'North Block received scheduled nutrient mix (12 min cycle).', zone: 'North Block', agoMin: 300 },
]

export const tasks = [
  { time: '14:30', label: 'Drip irrigation — East Terrace', kind: 'water', auto: true },
  { time: '16:00', label: 'Fertigation — North Block', kind: 'nutrient', auto: true },
  { time: '18:45', label: 'Vision scan — all greenhouses', kind: 'scan', auto: true },
  { time: '06:00', label: 'Reservoir refill', kind: 'water', auto: false },
]

export const products = [
  { name: 'Alphonso Mangoes', grade: 'A', price: 1200, unit: 'dozen', stock: 60, category: 'Fruit', seller: 'Shivneri Estate', trend: 6 },
  { name: 'Thompson Grapes', grade: 'Export', price: 95, unit: 'kg', stock: 540, category: 'Fruit', seller: 'River Plot', trend: 3 },
  { name: 'Bhima Red Onion', grade: 'B', price: 28, unit: 'kg', stock: 2100, category: 'Vegetable', seller: 'South Field', trend: -2 },
  { name: 'Vine Tomatoes', grade: 'A', price: 34, unit: 'kg', stock: 380, category: 'Vegetable', seller: 'East Terrace', trend: 9 },
  { name: 'Lokwan Wheat', grade: 'A', price: 32, unit: 'kg', stock: 4200, category: 'Grain', seller: 'West Block', trend: 1 },
  { name: 'Green Capsicum', grade: 'A', price: 48, unit: 'kg', stock: 220, category: 'Vegetable', seller: 'Greenhouse 1', trend: 4 },
  { name: 'Organic Jaggery', grade: 'Premium', price: 80, unit: 'kg', stock: 150, category: 'Processed', seller: 'North Block', trend: 7 },
  { name: 'Sweet Corn', grade: 'A', price: 22, unit: 'piece', stock: 900, category: 'Vegetable', seller: 'Greenhouse 2', trend: 2 },
]

export const readings = [
  {
    kind: 'moisture24h',
    series: [
      { t: '00:00', zoneA: 58, zoneB: 64, zoneC: 51 }, { t: '02:00', zoneA: 57, zoneB: 63, zoneC: 50 },
      { t: '04:00', zoneA: 55, zoneB: 62, zoneC: 48 }, { t: '06:00', zoneA: 54, zoneB: 60, zoneC: 47 },
      { t: '08:00', zoneA: 60, zoneB: 66, zoneC: 53 }, { t: '10:00', zoneA: 65, zoneB: 69, zoneC: 58 },
      { t: '12:00', zoneA: 63, zoneB: 67, zoneC: 60 }, { t: '14:00', zoneA: 61, zoneB: 65, zoneC: 57 },
      { t: '16:00', zoneA: 64, zoneB: 68, zoneC: 59 }, { t: '18:00', zoneA: 66, zoneB: 70, zoneC: 62 },
      { t: '20:00', zoneA: 63, zoneB: 67, zoneC: 60 }, { t: '22:00', zoneA: 62, zoneB: 66, zoneC: 58 },
    ],
  },
  {
    kind: 'waterWeek',
    series: [
      { day: 'Mon', automated: 2100, baseline: 3200 }, { day: 'Tue', automated: 1850, baseline: 3000 },
      { day: 'Wed', automated: 2400, baseline: 3300 }, { day: 'Thu', automated: 1600, baseline: 2900 },
      { day: 'Fri', automated: 2000, baseline: 3100 }, { day: 'Sat', automated: 2250, baseline: 3250 },
      { day: 'Sun', automated: 1700, baseline: 3050 },
    ],
  },
]
