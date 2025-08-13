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
 * - `statsByRegionForDate`, `nationalStatsForDate`: Could be fetched from a `GET /api/stats?...`
 *   endpoint with parameters for country, regions, and date.
 *
 * The backend developer's task is to create these endpoints and replace the usage
 * of this mock data in the components (primarily in `src/components/dashboard/main-dashboard.tsx`)
 * with `fetch` calls to the new APIs.
 */

import type { Alert, Country, ForecastProvider, Stats } from './types';
import { format, subDays, addDays } from 'date-fns';

const createGridRegions = (regions: {id: string, name: string, path: string}[], gridCols: number) => {
    const cellWidth = 120;
    const cellHeight = 25;
    const padding = 10;
    const startY = 10;
    return regions.map((region, index) => {
        const col = index % gridCols;
        const row = Math.floor(index / gridCols);
        const x = col * (cellWidth + padding) + padding;
        const y = row * (cellHeight + padding) + startY;
        const path = `M${x},${y} h${cellWidth} v${cellHeight} h-${cellWidth} Z`;
        return { ...region, path };
    });
};

// FAKE DATA: List of countries and their regions.
// The `path` property contains SVG path data for rendering the map.
// The regions are laid out in a dense grid.
export const countries: Country[] = [
  {
    id: 'colombia',
    name: 'Colombia',
    regions: createGridRegions([
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
    ], 3)
  },
  {
    id: 'kenya',
    name: 'Kenya',
    regions: createGridRegions([
      { id: 'nairobi', name: 'Nairobi', path: '' },
      { id: 'mombasa', name: 'Mombasa', path: '' },
      { id: 'kisumu', name: 'Kisumu', path: '' },
      { id: 'nakuru', name: 'Nakuru', path: '' },
      { id: 'rift-valley', name: 'Rift Valley', path: '' }
    ], 3),
  },
];

const today = new Date();
// FAKE DATA: Initial list of alerts.
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    countryId: 'colombia',
    regionIds: ['macro-1', 'macro-4'],
    severity: 'orange',
    eventType: 'Heavy Rainfall',
    pushDateTime: subDays(today, 1),
    eventDates: { from: today, to: addDays(today, 1) },
    justification: 'An incoming weather system is expected to bring heavy rainfall, potentially causing localized flooding in urban and low-lying areas. Models predict 50-75mm of rain over a 24-hour period.',
    status: 'active',
    author: 'Juan Valdez',
    lastUpdated: subDays(today, 2),
    version: 2,
  },
  {
    id: 'alert-2',
    countryId: 'colombia',
    regionIds: ['macro-2', 'macro-10'],
    severity: 'yellow',
    eventType: 'Heatwave',
    pushDateTime: today,
    eventDates: { from: addDays(today, 1) },
    justification: 'Temperatures are expected to rise above average, reaching 35°C. Residents should take precautions against heat-related illness.',
    status: 'draft',
    author: 'Sofia Vergara',
    lastUpdated: subDays(today, 1),
    version: 1,
  },
    {
    id: 'alert-3',
    countryId: 'colombia',
    regionIds: ['macro-8'],
    severity: 'red',
    eventType: 'Severe Flooding',
    pushDateTime: subDays(today, 5),
    eventDates: { from: subDays(today, 5), to: subDays(today, 3) },
    justification: 'Major river overflow expected due to extreme upstream rainfall. Significant risk to life and property. Evacuation orders may be necessary.',
    status: 'expired',
    author: 'Juan Valdez',
    lastUpdated: subDays(today, 6),
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
const baseStatsByRegion: { [regionId: string]: Stats } = {
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
  'macro-4': {
    'actual': { green: 125000, yellow: 38000, orange: 7500, red: 350, total: 170850 },
    'google': { green: 120000, yellow: 40000, orange: 8000, red: 400, total: 168400 },
    'openweather': { green: 130000, yellow: 35000, orange: 7000, red: 300, total: 172300 },
  },
  'macro-10': {
    'actual': { green: 65000, yellow: 22000, orange: 3500, red: 100, total: 90600 },
    'google': { green: 60000, yellow: 25000, orange: 4000, red: 150, total: 89150 },
    'openweather': { green: 70000, yellow: 20000, orange: 3000, red: 100, total: 93100 },
  },
  // Kenya
  'nairobi': {
    'actual': { green: 16000, yellow: 4500, orange: 1000, red: 80, total: 21580 },
    'google': { green: 15000, yellow: 5000, orange: 1200, red: 100, total: 21300 },
    'openweather': { green: 18000, yellow: 2500, orange: 800, red: 50, total: 21350 },
  },
};

// Function to generate different stats for different days by applying a random multiplier
const generateDateVariantStats = (base: { [regionId: string]: Stats }, date: Date) => {
  const newStats: { [regionId: string]: Stats } = {};
  const dayOfMonth = date.getDate();
  
  for (const regionId in base) {
    newStats[regionId] = {};
    for (const providerId in base[regionId]) {
      const multiplier = 1 + ((dayOfMonth % 10) - 5) * 0.05; // Vary by up to 25%
      const providerStats = base[regionId][providerId];
      const newProviderStats = {
        green: Math.round(providerStats.green * multiplier),
        yellow: Math.round(providerStats.yellow * (2 - multiplier)),
        orange: Math.round(providerStats.orange * multiplier),
        red: Math.round(providerStats.red * (2 - multiplier)),
        total: 0
      };
      newProviderStats.total = newProviderStats.green + newProviderStats.yellow + newProviderStats.orange + newProviderStats.red;
      newStats[regionId][providerId] = newProviderStats;
    }
  }
  return newStats;
}

const statsCache = new Map<string, { [regionId: string]: Stats }>();
export const statsByRegionForDate = (dateKey: string): { [regionId: string]: Stats } => {
    if (!statsCache.has(dateKey)) {
        statsCache.set(dateKey, generateDateVariantStats(baseStatsByRegion, new Date(dateKey)));
    }
    return statsCache.get(dateKey)!;
}

// FAKE DATA: National-level statistics.
const baseNationalStats: { [countryId: string]: Stats } = {
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

const nationalStatsCache = new Map<string, { [countryId: string]: Stats }>();
export const nationalStatsForDate = (dateKey: string): { [countryId: string]: Stats } => {
    if (!nationalStatsCache.has(dateKey)) {
        nationalStatsCache.set(dateKey, generateDateVariantStats(baseNationalStats, new Date(dateKey)));
    }
    return nationalStatsCache.get(dateKey)!;
}
