export type Severity = "yellow" | "orange" | "red";
export type AlertStatus = "draft" | "active" | "expired";

export type Alert = {
  id: string;
  countryId: string;
  regionIds: string[];
  severity: Severity;
  eventType: string;
  pushDateTime: Date;
  eventDates: { from: Date; to?: Date };
  justification: string;
  imageUrl?: string;
  status: AlertStatus;
  author: string;
  lastUpdated: Date;
  version: number;
};

export type Region = {
  id: string;
  name: string;
  path: string; 
};

export type Country = {
  id: string;
  name: string;
  regions: Region[];
};

export type ForecastProvider = {
  id: string;
  name: string;
};

export type UserStats = {
  green: number;
  yellow: number;
  orange: number;
  red: number;
  total: number;
};

export type Stats = {
  [providerId: string]: UserStats;
};
