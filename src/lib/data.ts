/**
 * @file This file contains all the FAKE/MOCK data for the application.
 *
 * @backend-note
 * In a real-world application, this data should not exist. Instead, you would fetch
 * this information from your backend services via API calls. Each of these exports
 * represents a potential API endpoint. For example:
 *
 * - `countries`: Could be fetched from a `GET /api/countries` endpoint. This might
 *   also include the region data with their SVG paths (or ideally GeoJSON data).
 * - `alerts`: Could be fetched from a `GET /api/alerts?countryId=...` endpoint.
 * - `statsByRegion`, `nationalStats`: Could be fetched from a `GET /api/stats?...`
 *   endpoint with parameters for country and regions.
 *
 * The backend developer's task is to create these endpoints and replace the usage
 * of this mock data in the components (primarily in `src/components/dashboard/main-dashboard.tsx`)
 * with `fetch` calls to the new APIs.
 */

import type { Alert, Country, ForecastProvider, Stats } from './types';

// FAKE DATA: List of countries and their regions.
// The `path` property contains SVG path data for rendering the map.
// The regions are laid out in a dense grid.
export const countries: Country[] = [
  {
    id: 'colombia',
    name: 'Colombia',
    regions: ((regions) => {
        const gridCols = 3;
        const cellWidth = 120;
        const cellHeight = 25;
        const padding = 5;
        return regions.map((region, index) => {
            const col = index % gridCols;
            const row = Math.floor(index / gridCols);
            const x = col * (cellWidth + padding) + padding;
            const y = row * (cellHeight + padding) + padding + 20; // +20 for title
            const path = `M${x},${y} h${cellWidth} v${cellHeight} h-${cellWidth} Z`;
            return { ...region, path };
        });
    })([
      { id: 'macro-1', name: 'Caribe', path: '' },
      { id: 'macro-2', name: 'Eje Cafetero', path: '' },
      { id: 'macro-3', name: 'Pacífico', path: '' },
      { id: 'macro-4', name: 'Andina Norte', path: '' },
      { id: 'macro-5', name: 'Andina Centro', path: '' },
      { id: 'macro-6', name: 'Andina Sur', path: '' },
      { id: 'macro-7', name: 'Orinoquía', path: '' },
      { id: 'macro-8', name: 'Amazonía', path: '' },
      { id: 'macro-9', name: 'Insular', path: '' },
      { id: 'macro-10', name: 'Noroccidente', path: '' },
      { id: 'macro-11', name: 'Suroccidente', path: '' },
      { id: 'macro-12', name: 'Centro Oriente', path: '' },
      { id: 'macro-13', name: 'Centro Sur', path: '' },
      { id: 'macro-14', name: 'Nororiente', path: '' },
      { id: 'macro-15', name: 'Suroeste', path: '' },
      { id: 'macro-16', name: 'Magdalena Medio', path: '' },
      { id: 'macro-17', name: 'Alto Magdalena', path: '' },
      { id: 'macro-18', name: 'Catatumbo', path: '' },
      { id: 'macro-19', name: 'Bajo Cauca', path: '' },
      { id: 'macro-20', name: 'Urabá', path: '' },
      { id: 'macro-21', name: 'Piedemonte', path: '' },
    ])
  },
  {
    id: 'kenya',
    name: 'Kenya',
    regions: [
      { id: 'nairobi', name: 'Nairobi', path: 'M10 10 L82 10 L82 140 L10 140 Z' },
      { id: 'mombasa', name: 'Mombasa', path: 'M92 10 L164 10 L164 140 L92 140 Z' },
      { id: 'kisumu', name: 'Kisumu', path: 'M174 10 L246 10 L246 140 L174 140 Z' },
      { id: 'nakuru', name: 'Nakuru', path: 'M256 10 L328 10 L328 140 L256 140 Z' },
      { id: 'rift-valley', name: 'Rift Valley', path: 'M338 10 L410 10 L410 140 L338 140 Z' }
    ],
  },
];

// FAKE DATA: Initial list of alerts.
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    countryId: 'colombia',
    regionIds: ['macro-1', 'macro-4'],
    severity: 'orange',
    eventType: 'Heavy Rainfall',
    pushDateTime: new Date('2024-08-15T10:00:00Z'),
    eventDates: { from: new Date('2024-08-16'), to: new Date('2024-08-17') },
    justification: 'An incoming weather system is expected to bring heavy rainfall, potentially causing localized flooding in urban and low-lying areas. Models predict 50-75mm of rain over a 24-hour period.',
    status: 'active',
    author: 'Juan Valdez',
    lastUpdated: new Date('2024-08-14T09:30:00Z'),
    version: 2,
  },
  {
    id: 'alert-2',
    countryId: 'colombia',
    regionIds: ['macro-2', 'macro-10'],
    severity: 'yellow',
    eventType: 'Heatwave',
    pushDateTime: new Date('2024-08-18T12:00:00Z'),
    eventDates: { from: new Date('2024-08-19') },
    justification: 'Temperatures are expected to rise above average, reaching 35°C. Residents should take precautions against heat-related illness.',
    status: 'draft',
    author: 'Sofia Vergara',
    lastUpdated: new Date('2024-08-17T15:00:00Z'),
    version: 1,
  },
    {
    id: 'alert-3',
    countryId: 'colombia',
    regionIds: ['macro-8'],
    severity: 'red',
    eventType: 'Severe Flooding',
    pushDateTime: new Date('2024-08-10T08:00:00Z'),
    eventDates: { from: new Date('2024-08-10'), to: new Date('2024-08-12') },
    justification: 'Major river overflow expected due to extreme upstream rainfall. Significant risk to life and property. Evacuation orders may be necessary.',
    status: 'expired',
    author: 'Juan Valdez',
    lastUpdated: new Date('2024-08-09T18:00:00Z'),
    version: 1,
  },
];

// FAKE DATA: List of forecast providers. This could be static or come from a config API.
export const forecastProviders: ForecastProvider[] = [
    { id: 'actual', name: 'Actual' },
    { id: 'google', name: 'Google Weather' },
    { id: 'openweather', name: 'OpenWeather' },
    { id: 'other', name: 'Other Provider' },
];

// FAKE DATA: Statistical data per region.
// This represents the number of users in each alert level (green, yellow, etc.)
// for different forecast providers and for "actual" (actual reported status).
export const statsByRegion: { [regionId: string]: Stats } = {
  // Colombia
  'macro-1': {
    'actual': { green: 260000, yellow: 75000, orange: 15000, red: 1000, total: 351000 },
    'google': { green: 250000, yellow: 80000, orange: 20000, red: 1500, total: 351500 },
    'openweather': { green: 280000, yellow: 70000, orange: 15000, red: 1000, total: 366000 },
  },
  'macro-2': {
    'actual': { green: 190000, yellow: 55000, orange: 12000, red: 800, total: 257800 },
    'google': { green: 180000, yellow: 60000, orange: 15000, red: 1000, total: 256000 },
    'openweather': { green: 200000, yellow: 50000, orange: 12000, red: 800, total: 262800 },
  },
  'macro-3': {
    'actual': { green: 165000, yellow: 48000, orange: 9000, red: 450, total: 222450 },
    'google': { green: 160000, yellow: 50000, orange: 10000, red: 500, total: 220500 },
    'openweather': { green: 170000, yellow: 45000, orange: 8000, red: 400, total: 223400 },
  },
  'macro-4': {
    'actual': { green: 125000, yellow: 38000, orange: 7500, red: 350, total: 170850 },
    'google': { green: 120000, yellow: 40000, orange: 8000, red: 400, total: 168400 },
    'openweather': { green: 130000, yellow: 35000, orange: 7000, red: 300, total: 172300 },
  },
  'macro-5': {
    'actual': { green: 105000, yellow: 28000, orange: 4500, red: 180, total: 137680 },
    'google': { green: 100000, yellow: 30000, orange: 5000, red: 200, total: 135200 },
    'openweather': { green: 110000, yellow: 25000, orange: 4000, red: 150, total: 139150 },
  },
  'macro-6': {
    'actual': { green: 5500, yellow: 2200, orange: 1100, red: 550, total: 9350 },
    'google': { green: 5000, yellow: 2000, orange: 1000, red: 500, total: 8500 },
    'openweather': { green: 6000, yellow: 2500, orange: 1200, red: 600, total: 10300 },
  },
  'macro-7': {
    'actual': { green: 95000, yellow: 32000, orange: 6000, red: 250, total: 133250 },
    'google': { green: 90000, yellow: 35000, orange: 7000, red: 300, total: 132300 },
    'openweather': { green: 100000, yellow: 30000, orange: 6500, red: 200, total: 136700 },
  },
  'macro-8': {
    'actual': { green: 85000, yellow: 28000, orange: 5000, red: 200, total: 118200 },
    'google': { green: 80000, yellow: 30000, orange: 5500, red: 250, total: 115750 },
    'openweather': { green: 90000, yellow: 25000, orange: 5000, red: 150, total: 120150 },
  },
  'macro-9': {
    'actual': { green: 75000, yellow: 25000, orange: 4000, red: 150, total: 104150 },
    'google': { green: 70000, yellow: 28000, orange: 4500, red: 200, total: 102700 },
    'openweather': { green: 80000, yellow: 22000, orange: 3500, red: 100, total: 105600 },
  },
  'macro-10': {
    'actual': { green: 65000, yellow: 22000, orange: 3500, red: 100, total: 90600 },
    'google': { green: 60000, yellow: 25000, orange: 4000, red: 150, total: 89150 },
    'openweather': { green: 70000, yellow: 20000, orange: 3000, red: 100, total: 93100 },
  },
  'macro-11': {
    'actual': { green: 60000, yellow: 20000, orange: 3000, red: 90, total: 83090 },
    'google': { green: 55000, yellow: 22000, orange: 3500, red: 120, total: 80620 },
    'openweather': { green: 65000, yellow: 18000, orange: 2800, red: 80, total: 85880 },
  },
  'macro-12': {
    'actual': { green: 50000, yellow: 15000, orange: 2500, red: 70, total: 67570 },
    'google': { green: 48000, yellow: 17000, orange: 2800, red: 90, total: 67890 },
    'openweather': { green: 52000, yellow: 14000, orange: 2300, red: 60, total: 68360 },
  },
  'macro-13': {
    'actual': { green: 45000, yellow: 12000, orange: 2000, red: 50, total: 59050 },
    'google': { green: 42000, yellow: 14000, orange: 2200, red: 70, total: 58270 },
    'openweather': { green: 48000, yellow: 10000, orange: 1800, red: 40, total: 59840 },
  },
  'macro-14': {
    'actual': { green: 40000, yellow: 10000, orange: 1500, red: 40, total: 51540 },
    'google': { green: 38000, yellow: 12000, orange: 1800, red: 60, total: 51860 },
    'openweather': { green: 42000, yellow: 9000, orange: 1400, red: 30, total: 52430 },
  },
  'macro-15': {
    'actual': { green: 35000, yellow: 8000, orange: 1200, red: 30, total: 44230 },
    'google': { green: 32000, yellow: 10000, orange: 1500, red: 50, total: 43550 },
    'openweather': { green: 38000, yellow: 7000, orange: 1000, red: 20, total: 46020 },
  },
  'macro-16': {
    'actual': { green: 30000, yellow: 7000, orange: 1000, red: 20, total: 38020 },
    'google': { green: 28000, yellow: 8000, orange: 1200, red: 40, total: 37240 },
    'openweather': { green: 32000, yellow: 6000, orange: 900, red: 10, total: 38910 },
  },
  'macro-17': {
    'actual': { green: 25000, yellow: 6000, orange: 800, red: 10, total: 31810 },
    'google': { green: 24000, yellow: 7000, orange: 1000, red: 30, total: 32030 },
    'openweather': { green: 26000, yellow: 5000, orange: 700, red: 5, total: 31705 },
  },
  'macro-18': {
    'actual': { green: 20000, yellow: 5000, orange: 600, red: 5, total: 25605 },
    'google': { green: 18000, yellow: 6000, orange: 800, red: 20, total: 24820 },
    'openweather': { green: 22000, yellow: 4000, orange: 500, red: 2, total: 26502 },
  },
  'macro-19': {
    'actual': { green: 15000, yellow: 4000, orange: 400, red: 2, total: 19402 },
    'google': { green: 14000, yellow: 5000, orange: 600, red: 10, total: 19610 },
    'openweather': { green: 16000, yellow: 3000, orange: 300, red: 1, total: 19301 },
  },
  'macro-20': {
    'actual': { green: 10000, yellow: 3000, orange: 200, red: 1, total: 13201 },
    'google': { green: 9000, yellow: 4000, orange: 400, red: 5, total: 13405 },
    'openweather': { green: 11000, yellow: 2000, orange: 150, red: 0, total: 13150 },
  },
  'macro-21': {
    'actual': { green: 5000, yellow: 1500, orange: 100, red: 0, total: 6600 },
    'google': { green: 4500, yellow: 2000, orange: 200, red: 2, total: 6702 },
    'openweather': { green: 5500, yellow: 1000, orange: 50, red: 0, total: 6550 },
  },
  // Kenya
  'nairobi': {
    'actual': { green: 16000, yellow: 4500, orange: 1000, red: 80, total: 21580 },
    'google': { green: 15000, yellow: 5000, orange: 1200, red: 100, total: 21300 },
    'openweather': { green: 18000, yellow: 2500, orange: 800, red: 50, total: 21350 },
  },
  'mombasa': {
    'actual': { green: 8500, yellow: 2800, orange: 480, red: 18, total: 11798 },
    'google': { green: 8000, yellow: 3000, orange: 500, red: 20, total: 11520 },
    'openweather': { green: 9000, yellow: 2000, orange: 450, red: 15, total: 11465 },
  },
  'rift-valley': {
    'actual': { green: 26000, yellow: 9000, orange: 2800, red: 450, total: 38250 },
    'google': { green: 25000, yellow: 10000, orange: 3000, red: 500, total: 38500 },
    'openweather': { green: 28000, yellow: 8000, orange: 2500, red: 400, total: 38900 },
  }
};

// FAKE DATA: National-level statistics.
// This is used as the default view when no specific regions are selected.
export const nationalStats: { [countryId: string]: Stats } = {
    'colombia': {
      'actual': { green: 295000, yellow: 83000, orange: 16500, red: 980, total: 395480 },
      'google': { green: 280000, yellow: 90000, orange: 20000, red: 1200, total: 391200 },
      'openweather': { green: 310000, yellow: 75000, orange: 16000, red: 950, total: 401950 },
    },
    'kenya': {
        'actual': { green: 160000, yellow: 45000, orange: 10000, red: 800, total: 215800 },
        'google': { green: 150000, yellow: 50000, orange: 12000, red: 1000, total: 213000 },
        'openweather': { green: 180000, yellow: 25000, orange: 8000, red: 500, total: 213500 },
    }
}
