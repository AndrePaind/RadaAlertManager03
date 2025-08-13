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
export const countries: Country[] = [
  {
    id: 'colombia',
    name: 'Colombia',
    regions: [
      { id: 'bogota', name: 'Bogotá D.C.', path: 'M180 150 L195 145 L200 160 L185 165 Z' },
      { id: 'antioquia', name: 'Antioquia', path: 'M130 80 L170 70 L180 120 L120 130 Z' },
      { id: 'valle-del-cauca', name: 'Valle del Cauca', path: 'M110 180 L140 170 L150 210 L120 220 Z' },
      { id: 'santander', name: 'Santander', path: 'M200 100 L240 90 L250 140 L210 150 Z' },
      { id: 'bolivar', name: 'Bolívar', path: 'M180 40 L230 30 L240 80 L190 90 Z' },
      { id: 'amazonas', name: 'Amazonas', path: 'M250 250 L350 240 L360 290 L260 295 Z' },
      { id: 'cundinamarca', name: 'Cundinamarca', path: 'M175 125 L215 120 L220 165 L180 170 Z' },
      { id: 'boyaca', name: 'Boyacá', path: 'M210 80 L250 75 L255 125 L215 130 Z' },
      { id: 'narino', name: 'Nariño', path: 'M90 230 L120 220 L130 260 L100 270 Z' },
      { id: 'magdalena', name: 'Magdalena', path: 'M190 20 L240 15 L245 65 L195 70 Z' },
    ]
  },
  {
    id: 'kenya',
    name: 'Kenya',
    regions: [
      { id: 'nairobi', name: 'Nairobi', path: 'M100 100 L120 110 L110 130 L90 120 Z' },
      { id: 'mombasa', name: 'Mombasa', path: 'M150 150 L170 160 L160 180 L140 170 Z' },
      { id: 'kisumu', name: 'Kisumu', path: 'M50 80 L70 90 L60 110 L40 100 Z' },
      { id: 'nakuru', name: 'Nakuru', path: 'M80 50 L100 60 L90 80 L70 70 Z' },
      { id: 'rift-valley', name: 'Rift Valley', path: 'M30 20 L130 25 L125 90 L25 85 Z' }
    ],
  },
];

// FAKE DATA: Initial list of alerts.
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    countryId: 'colombia',
    regionIds: ['bogota', 'santander'],
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
    regionIds: ['bolivar', 'antioquia'],
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
    regionIds: ['amazonas'],
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
    { id: 'reality', name: 'Reality' },
    { id: 'google', name: 'Google Weather' },
    { id: 'openweather', name: 'OpenWeather' },
    { id: 'other', name: 'Other Provider' },
];

// FAKE DATA: Statistical data per region.
// This represents the number of users in each alert level (green, yellow, etc.)
// for different forecast providers and for "reality" (actual reported status).
export const statsByRegion: { [regionId: string]: Stats } = {
  // Colombia
  'bogota': {
    'reality': { green: 260000, yellow: 75000, orange: 15000, red: 1000, total: 351000 },
    'google': { green: 250000, yellow: 80000, orange: 20000, red: 1500, total: 351500 },
    'openweather': { green: 280000, yellow: 70000, orange: 15000, red: 1000, total: 366000 },
  },
  'antioquia': {
    'reality': { green: 190000, yellow: 55000, orange: 12000, red: 800, total: 257800 },
    'google': { green: 180000, yellow: 60000, orange: 15000, red: 1000, total: 256000 },
    'openweather': { green: 200000, yellow: 50000, orange: 12000, red: 800, total: 262800 },
  },
  'valle-del-cauca': {
    'reality': { green: 165000, yellow: 48000, orange: 9000, red: 450, total: 222450 },
    'google': { green: 160000, yellow: 50000, orange: 10000, red: 500, total: 220500 },
    'openweather': { green: 170000, yellow: 45000, orange: 8000, red: 400, total: 223400 },
  },
  'santander': {
    'reality': { green: 125000, yellow: 38000, orange: 7500, red: 350, total: 170850 },
    'google': { green: 120000, yellow: 40000, orange: 8000, red: 400, total: 168400 },
    'openweather': { green: 130000, yellow: 35000, orange: 7000, red: 300, total: 172300 },
  },
  'bolivar': {
    'reality': { green: 105000, yellow: 28000, orange: 4500, red: 180, total: 137680 },
    'google': { green: 100000, yellow: 30000, orange: 5000, red: 200, total: 135200 },
    'openweather': { green: 110000, yellow: 25000, orange: 4000, red: 150, total: 139150 },
  },
  'amazonas': {
    'reality': { green: 5500, yellow: 2200, orange: 1100, red: 550, total: 9350 },
    'google': { green: 5000, yellow: 2000, orange: 1000, red: 500, total: 8500 },
    'openweather': { green: 6000, yellow: 2500, orange: 1200, red: 600, total: 10300 },
  },
  'cundinamarca': {
    'reality': { green: 95000, yellow: 32000, orange: 6000, red: 250, total: 133250 },
    'google': { green: 90000, yellow: 35000, orange: 7000, red: 300, total: 132300 },
    'openweather': { green: 100000, yellow: 30000, orange: 6500, red: 200, total: 136700 },
  },
  'boyaca': {
    'reality': { green: 85000, yellow: 28000, orange: 5000, red: 200, total: 118200 },
    'google': { green: 80000, yellow: 30000, orange: 5500, red: 250, total: 115750 },
    'openweather': { green: 90000, yellow: 25000, orange: 5000, red: 150, total: 120150 },
  },
  'narino': {
    'reality': { green: 75000, yellow: 25000, orange: 4000, red: 150, total: 104150 },
    'google': { green: 70000, yellow: 28000, orange: 4500, red: 200, total: 102700 },
    'openweather': { green: 80000, yellow: 22000, orange: 3500, red: 100, total: 105600 },
  },
  'magdalena': {
    'reality': { green: 65000, yellow: 22000, orange: 3500, red: 100, total: 90600 },
    'google': { green: 60000, yellow: 25000, orange: 4000, red: 150, total: 89150 },
    'openweather': { green: 70000, yellow: 20000, orange: 3000, red: 100, total: 93100 },
  },
  // Kenya
  'nairobi': {
    'reality': { green: 16000, yellow: 4500, orange: 1000, red: 80, total: 21580 },
    'google': { green: 15000, yellow: 5000, orange: 1200, red: 100, total: 21300 },
    'openweather': { green: 18000, yellow: 2500, orange: 800, red: 50, total: 21350 },
  },
  'mombasa': {
    'reality': { green: 8500, yellow: 2800, orange: 480, red: 18, total: 11798 },
    'google': { green: 8000, yellow: 3000, orange: 500, red: 20, total: 11520 },
    'openweather': { green: 9000, yellow: 2000, orange: 450, red: 15, total: 11465 },
  },
  'rift-valley': {
    'reality': { green: 26000, yellow: 9000, orange: 2800, red: 450, total: 38250 },
    'google': { green: 25000, yellow: 10000, orange: 3000, red: 500, total: 38500 },
    'openweather': { green: 28000, yellow: 8000, orange: 2500, red: 400, total: 38900 },
  }
};

// FAKE DATA: National-level statistics.
// This is used as the default view when no specific regions are selected.
export const nationalStats: { [countryId: string]: Stats } = {
    'colombia': {
      'reality': { green: 295000, yellow: 83000, orange: 16500, red: 980, total: 395480 },
      'google': { green: 280000, yellow: 90000, orange: 20000, red: 1200, total: 391200 },
      'openweather': { green: 310000, yellow: 75000, orange: 16000, red: 950, total: 401950 },
    },
    'kenya': {
        'reality': { green: 160000, yellow: 45000, orange: 10000, red: 800, total: 215800 },
        'google': { green: 150000, yellow: 50000, orange: 12000, red: 1000, total: 213000 },
        'openweather': { green: 180000, yellow: 25000, orange: 8000, red: 500, total: 213500 },
    }
}
