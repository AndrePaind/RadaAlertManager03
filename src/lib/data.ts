import type { Alert, Country, ForecastProvider, Stats } from './types';

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
    regionIds: ['bolivar'],
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

export const forecastProviders: ForecastProvider[] = [
    { id: 'google', name: 'Google Weather' },
    { id: 'openweather', name: 'OpenWeather' },
    { id: 'other', name: 'Other Provider' },
];

export const statsByRegion: { [regionId: string]: Stats } = {
  // Colombia
  'bogota': {
    'google': { green: 250000, yellow: 80000, orange: 20000, red: 1500, total: 351500 },
    'openweather': { green: 280000, yellow: 70000, orange: 15000, red: 1000, total: 366000 },
  },
  'antioquia': {
    'google': { green: 180000, yellow: 60000, orange: 15000, red: 1000, total: 256000 },
    'openweather': { green: 200000, yellow: 50000, orange: 12000, red: 800, total: 262800 },
  },
  'valle-del-cauca': {
    'google': { green: 160000, yellow: 50000, orange: 10000, red: 500, total: 220500 },
    'openweather': { green: 170000, yellow: 45000, orange: 8000, red: 400, total: 223400 },
  },
  'santander': {
    'google': { green: 120000, yellow: 40000, orange: 8000, red: 400, total: 168400 },
    'openweather': { green: 130000, yellow: 35000, orange: 7000, red: 300, total: 172300 },
  },
  'bolivar': {
    'google': { green: 100000, yellow: 30000, orange: 5000, red: 200, total: 135200 },
    'openweather': { green: 110000, yellow: 25000, orange: 4000, red: 150, total: 139150 },
  },
  'amazonas': {
    'google': { green: 5000, yellow: 2000, orange: 1000, red: 500, total: 8500 },
    'openweather': { green: 6000, yellow: 2500, orange: 1200, red: 600, total: 10300 },
  },
  // Kenya
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
    'colombia': {
      'google': { green: 2500000, yellow: 800000, orange: 150000, red: 10000, total: 3460000 },
      'openweather': { green: 2700000, yellow: 700000, orange: 120000, red: 8000, total: 3528000 },
    },
    'kenya': {
        'google': { green: 150000, yellow: 50000, orange: 12000, red: 1000, total: 213000 },
        'openweather': { green: 180000, yellow: 25000, orange: 8000, red: 500, total: 213500 },
    }
}
