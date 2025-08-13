import type { Alert, Country, ForecastProvider, Stats } from './types';

export const countries: Country[] = [
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
  {
    id: 'colombia',
    name: 'Colombia',
    regions: [
        { id: 'bogota', name: 'Bogotá', path: 'M100 100 L120 110 L110 130 L90 120 Z' },
        { id: 'medellin', name: 'Medellín', path: 'M50 80 L70 90 L60 110 L40 100 Z' },
        { id: 'cali', name: 'Cali', path: 'M80 50 L100 60 L90 80 L70 70 Z' },
    ]
  },
];

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    countryId: 'kenya',
    regionIds: ['nairobi', 'rift-valley'],
    severity: 'orange',
    eventType: 'Heavy Rainfall',
    pushDateTime: new Date('2024-08-15T10:00:00Z'),
    eventDates: { from: new Date('2024-08-16'), to: new Date('2024-08-17') },
    justification: 'An incoming weather system is expected to bring heavy rainfall, potentially causing localized flooding in urban and low-lying areas. Models predict 50-75mm of rain over a 24-hour period.',
    status: 'active',
    author: 'Jane Doe',
    lastUpdated: new Date('2024-08-14T09:30:00Z'),
    version: 2,
  },
  {
    id: 'alert-2',
    countryId: 'kenya',
    regionIds: ['mombasa'],
    severity: 'yellow',
    eventType: 'Heatwave',
    pushDateTime: new Date('2024-08-18T12:00:00Z'),
    eventDates: { from: new Date('2024-08-19') },
    justification: 'Temperatures are expected to rise above average, reaching 35°C. Residents should take precautions against heat-related illness.',
    status: 'draft',
    author: 'John Smith',
    lastUpdated: new Date('2024-08-17T15:00:00Z'),
    version: 1,
  },
    {
    id: 'alert-3',
    countryId: 'kenya',
    regionIds: ['kisumu'],
    severity: 'red',
    eventType: 'Severe Flooding',
    pushDateTime: new Date('2024-08-10T08:00:00Z'),
    eventDates: { from: new Date('2024-08-10'), to: new Date('2024-08-12') },
    justification: 'Major river overflow expected due to extreme upstream rainfall. Significant risk to life and property. Evacuation orders may be necessary.',
    status: 'expired',
    author: 'Jane Doe',
    lastUpdated: new Date('2024-08-09T18:00:00Z'),
    version: 1,
  },
];

export const forecastProviders: ForecastProvider[] = [
    { id: 'google', name: 'Google Weather' },
    { id: 'openweather', name: 'OpenWeather' },
    { id: 'other', name: 'Other Provider' },
];

export const statsByRegion: { [regionId: string]: Stats } = {
  'nairobi': {
    'google': { green: 15000, yellow: 5000, orange: 1200, red: 100, total: 21300 },
    'openweather': { green: 18000, yellow: 2500, orange: 800, red: 50, total: 21350 },
  },
  'mombasa': {
    'google': { green: 8000, yellow: 3000, orange: 500, red: 20, total: 11520 },
    'openweather': { green: 9000, yellow: 2000, orange: 450, red: 15, total: 11465 },
  },
  'rift-valley': {
    'google': { green: 25000, yellow: 10000, orange: 3000, red: 500, total: 38500 },
    'openweather': { green: 28000, yellow: 8000, orange: 2500, red: 400, total: 38900 },
  }
};

export const nationalStats: { [countryId: string]: Stats } = {
    'kenya': {
        'google': { green: 150000, yellow: 50000, orange: 12000, red: 1000, total: 213000 },
        'openweather': { green: 180000, yellow: 25000, orange: 8000, red: 500, total: 213500 },
    }
}
