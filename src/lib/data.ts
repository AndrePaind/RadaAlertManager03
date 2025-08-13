/**
 * @file This file contains all the FAKE/MOCK data for the application.
 *
 * @backend-note
 * In a real-world application, this file should be deleted. All the data exported
 * from here should be fetched from backend services via API calls. Each function
 * or constant in this file represents a potential API endpoint. The purpose of this
 * file is to allow for frontend development and prototyping without a live backend.
 *
 * The backend developer's primary task is to create the APIs described below and then
 * replace the usage of this mock data in the components (primarily in `src/components/dashboard/main-dashboard.tsx`)
 * with `fetch` calls to the new endpoints. The data structures for these endpoints
 * should conform to the types defined in `src/lib/types.ts`.
 */

import type { Alert, Country, Region, Stats, Severity } from './types';
import { format, subDays, addDays } from 'date-fns';

/**
 * @backend-note
 * This function simulates fetching forecast data for a specific region and date.
 * A real API might look like: `GET /api/forecasts?regionId=...&date=...`
 * It should return forecast data from various providers.
 */
const generateForecastValue = (base: number, date: Date, regionName: string) => {
    const daySeed = date.getDate() + regionName.charCodeAt(0);
    // Simple pseudo-random fluctuation based on the day and region name
    const randomFactor = ((daySeed % 15) - 7) / 10; // Fluctuation between -0.7 and +0.7
    return Math.max(0, Math.round(base * (1 + randomFactor)));
}

/**
 * @backend-note
 * This function simulates adding dynamic, date-specific data to a list of regions.
 * In a real backend, this data would likely be joined with the base region data
 * in a single API call, e.g., `GET /api/countries/{countryId}?date=...`.
 */
const addFakeDataToRegions = (regions: Omit<Region, 'path' | 'forecast' | 'thresholds'>[], date: Date): Region[] => {
  return regions.map(region => ({
    ...region,
    path: '', // The SVG path is no longer used; a real map would use GeoJSON.
    forecast: {
      google: generateForecastValue(50, date, region.name + 'g'),
      openweather: generateForecastValue(55, date, region.name + 'o'),
    },
    // Thresholds could be part of the region data or configured elsewhere.
    thresholds: {
      yellow: 40,
      orange: 60,
      red: 80,
    }
  }));
}


/**
 * @backend-note
 * This data represents static country and region information. This could be fetched
 * from an endpoint like `GET /api/countries`. This list is then hydrated with
 * dynamic data by `getCountries`.
 */
const getBaseCountries = (): Omit<Country, 'regions'> & { regions: Omit<Region, 'path' | 'forecast' | 'thresholds'>[] }[] => [
  {
    id: 'colombia',
    name: 'Colombia',
    regions: [
      { id: 'macro-1', name: 'Caribe' },
      { id: 'macro-2', name: 'Eje Cafetero' },
      { id: 'macro-3', name: 'Pacífico' },
      { id: 'macro-4', name: 'Andina Norte' },
      { id: 'macro-5', name: 'Andina Centro' },
      { id: 'macro-6', name: 'Andina Sur' },
      { id: 'macro-7', name: 'Orinoquía' },
      { id: 'macro-8', name: 'Amazonía' },
      { id: 'macro-9', name: 'Insular' },
      { id: 'macro-10', name: 'Noroccidente' },
      { id: 'macro-11', 'name': 'Suroccidente' },
      { id: 'macro-12', 'name': 'Centro Oriente' },
      { id: 'macro-13', 'name': 'Centro Sur' },
      { id: 'macro-14', 'name': 'Nororiente' },
      { id: 'macro-15', 'name': 'Suroeste' },
      { id: 'macro-16', 'name': 'Magdalena Medio' },
    ],
  },
  {
    id: 'kenya',
    name: 'Kenya',
    regions: [
      { id: 'nairobi', name: 'Nairobi' },
      { id: 'mombasa', name: 'Mombasa' },
      { id: 'kisumu', name: 'Kisumu' },
      { id: 'nakuru', name: 'Nakuru' },
      { id: 'rift-valley', name: 'Rift Valley' },
    ],
  },
];

const countryCache = new Map<string, Country[]>();
/**
 * @backend-note
 * This function simulates fetching the list of countries along with their regions,
 * with data that is specific to a given date (like forecasts). A real API endpoint
 * might be `GET /api/countries?date={dateKey}`.
 */
export const getCountries = (dateKey: string): Country[] => {
  if (countryCache.has(dateKey)) {
    return countryCache.get(dateKey)!;
  }
  const date = new Date(dateKey);
  const countries = getBaseCountries().map(country => ({
    ...country,
    regions: addFakeDataToRegions(country.regions, date),
  }));
  countryCache.set(dateKey, countries);
  return countries;
}


const today = new Date();
/**
 * @backend-note
 * This is a mock database of alerts. In a real application, this would be a database table.
 * The data would be fetched from an endpoint like `GET /api/alerts?countryId=...`.
 * The frontend would not have access to all alerts at once.
 */
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    countryId: 'colombia',
    regionIds: ['macro-1', 'macro-4'],
    severity: 'orange',
    eventType: 'Heavy Rainfall',
    pushDateTime: subDays(today, 1),
    eventDates: { from: today, to: addDays(today, 1) },
    justification:
      'An incoming weather system is expected to bring heavy rainfall, potentially causing localized flooding in urban and low-lying areas. Models predict 50-75mm of rain over a 24-hour period.',
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
    justification:
      'Temperatures are expected to rise above average, reaching 35°C. Residents should take precautions against heat-related illness.',
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
    justification:
      'Major river overflow expected due to extreme upstream rainfall. Significant risk to life and property. Evacuation orders may be necessary.',
    status: 'expired',
    author: 'Juan Valdez',
    lastUpdated: subDays(today, 6),
    version: 1,
  },
  {
    id: 'alert-4',
    countryId: 'colombia',
    regionIds: ['macro-15', 'macro-11'],
    severity: 'red',
    eventType: 'High Winds',
    pushDateTime: subDays(today, 2),
    eventDates: { from: subDays(today, 1), to: subDays(today, 1) },
    justification:
      'A strong front will bring damaging winds up to 90 km/h. Secure loose objects and anticipate power outages.',
    status: 'active',
    author: 'MeteOps Lead',
    lastUpdated: subDays(today, 2),
    version: 1,
  },
  {
    id: 'alert-5',
    countryId: 'colombia',
    regionIds: ['macro-7', 'macro-12', 'macro-13'],
    severity: 'yellow',
    eventType: 'Thunderstorms',
    pushDateTime: today,
    eventDates: { from: addDays(today, 2), to: addDays(today, 2) },
    justification:
      'Scattered thunderstorms are forecast for the afternoon, with a potential for small hail and gusty winds.',
    status: 'active',
    author: 'MeteOps Lead',
    lastUpdated: today,
    version: 1,
  },
  {
    id: 'alert-6',
    countryId: 'kenya',
    regionIds: ['nairobi', 'rift-valley'],
    severity: 'orange',
    eventType: 'Flooding',
    pushDateTime: subDays(today, 1),
    eventDates: { from: today, to: today },
    justification:
      'Heavy long rains are expected to cause flooding in low-lying areas of Nairobi and the Rift Valley.',
    status: 'active',
    author: 'MeteOps Lead',
    lastUpdated: subDays(today, 1),
    version: 1,
  },
  {
    id: 'alert-7',
    countryId: 'kenya',
    regionIds: ['mombasa'],
    severity: 'yellow',
    eventType: 'High Tides',
    pushDateTime: subDays(today, 10),
    eventDates: { from: subDays(today, 9), to: subDays(today, 8) },
    justification: 'Coastal areas may experience minor flooding during high tides.',
    status: 'expired',
    author: 'MeteOps Lead',
    lastUpdated: subDays(today, 10),
    version: 1,
  },
  {
    id: 'alert-8',
    countryId: 'colombia',
    regionIds: ['macro-5', 'macro-6'],
    severity: 'yellow',
    eventType: 'Air Quality',
    pushDateTime: addDays(today, 3),
    eventDates: { from: addDays(today, 4) },
    justification:
      'Smoke from agricultural burning may reduce air quality to unhealthy levels for sensitive groups.',
    status: 'draft',
    author: 'MeteOps Lead',
    lastUpdated: today,
    version: 1,
  },
];

/**
 * @backend-note
 * This is a mock database of statistical data per region. In a real application,
 * this would be stored in a data warehouse or time-series database.
 * The data would be fetched from an endpoint like `GET /api/stats/regions?date=...&regionIds=...`.
 * The "actual" stats would come from a system that aggregates user reports.
 */
const baseStatsByRegion: { [regionId: string]: Stats } = {
  // Colombia
  'macro-1': {
    actual: { green: 260000, yellow: 75000, orange: 15000, red: 1000, total: 351000 },
  },
  'macro-2': {
    actual: { green: 190000, yellow: 55000, orange: 12000, red: 800, total: 257800 },
  },
  'macro-4': {
    actual: { green: 125000, yellow: 38000, orange: 7500, red: 350, total: 170850 },
  },
  'macro-10': {
    actual: { green: 65000, yellow: 22000, orange: 3500, red: 100, total: 90600 },
  },
  // Kenya
  nairobi: {
    actual: { green: 16000, yellow: 4500, orange: 1000, red: 80, total: 21580 },
  },
};

/**
 * @backend-note
 * This function simulates how data might change day-to-day. A real backend would simply
 * query its database for the requested date. This function exists purely for frontend
 * prototyping to make the date navigator feel interactive.
 */
const generateDateVariantStats = (
  base: { [key: string]: Stats },
  date: Date
) => {
  const newStats: { [key: string]: Stats } = {};
  const dayOfMonth = date.getDate();

  for (const id in base) {
    newStats[id] = {};
    for (const providerId in base[id]) {
      // Fluctuate stats pseudo-randomly based on the day of the month
      const multiplier = 1 + ((dayOfMonth % 10) - 5) * 0.05 * ((id.length % 5) / 2);
      const providerStats = base[id][providerId];
      const newProviderStats = {
        green: Math.round(providerStats.green * multiplier),
        yellow: Math.round(providerStats.yellow * (2 - multiplier)),
        orange: Math.round(providerStats.orange * multiplier),
        red: Math.round(providerStats.red * (1.5 - multiplier)),
        total: 0,
      };
      newProviderStats.total =
        newProviderStats.green +
        newProviderStats.yellow +
        newProviderStats.orange +
        newProviderStats.red;
      newStats[id][providerId] = newProviderStats;
    }
  }
  return newStats;
};

const statsCache = new Map<string, { [regionId: string]: Stats }>();
/**
 * @backend-note
 * This function simulates fetching regional stats for a specific date. A real API
 * would be something like `GET /api/stats/regions?date={dateKey}&countryId={countryId}`.
 */
export const statsByRegionForDate = (
  dateKey: string
): { [regionId: string]: Stats } => {
  if (!statsCache.has(dateKey)) {
    statsCache.set(
      dateKey,
      generateDateVariantStats(baseStatsByRegion, new Date(dateKey))
    );
  }
  return statsCache.get(dateKey)!;
};

/**
 * @backend-note
 * This is a mock database of national-level stats. This would be aggregated data
 * stored in a data warehouse and fetched from an endpoint like `GET /api/stats/national?date=...&countryId=...`.
 */
const baseNationalStats: { [countryId: string]: Stats } = {
  colombia: {
    actual: { green: 2950000, yellow: 830000, orange: 165000, red: 9800, total: 3954800 },
  },
  kenya: {
    actual: { green: 1600000, yellow: 450000, orange: 100000, red: 8000, total: 2158000 },
  },
};

const nationalStatsCache = new Map<string, { [countryId: string]: Stats }>();
/**
 * @backend-note
 * This function simulates fetching national stats for a specific date. A real API
 * would be `GET /api/stats/national?date={dateKey}&countryId={countryId}`.
 */
export const nationalStatsForDate = (
  dateKey: string
): { [countryId: string]: Stats } => {
  if (!nationalStatsCache.has(dateKey)) {
    nationalStatsCache.set(
      dateKey,
      generateDateVariantStats(baseNationalStats, new Date(dateKey))
    );
  }
  return nationalStatsCache.get(dateKey)!;
};
