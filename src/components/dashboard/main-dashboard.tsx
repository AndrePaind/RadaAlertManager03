'use client';
/**
 * @file This is the main component for the dashboard. It acts as the central hub,
 * managing the application's state and orchestrating interactions between its child components:
 * - AlertsList: Displays and manages alerts.
 * - AlertForm: For creating and editing alerts.
 * - StatsPanel: Shows statistical data.
 * - MapView: Displays the geographical map and regions.
 */

import { useState, useMemo, useEffect } from 'react';
import type { Alert, Country, Region, Severity, Stats } from '@/lib/types';
// FAKE DATA: Importing mock data. In a real application, this would be fetched from a backend API.
import {
  alerts as initialAlerts,
  getCountries,
  statsByRegionForDate,
  nationalStatsForDate,
} from '@/lib/data';
import { AlertsList } from './alerts-list';
import { MapView } from './map-view';
import { StatsPanel } from './stats-panel';
import { AlertForm } from './alert-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '../ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format, isToday, startOfDay } from 'date-fns';

export function MainDashboard() {
  // STATE MANAGEMENT
  // @backend-note All state is managed locally using `useState`. In a production environment,
  // this state should be fetched from and persisted to a backend. For more complex scenarios,
  // a state management library like Redux or Zustand might be considered. The API calls to
  // fetch data should be triggered in `useEffect` hooks or within the event handlers below.

  // The list of all alerts. Initialized with mock data.
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  // The list of all available countries.
  const [countries, setCountries] = useState<Country[]>([]);

  // The currently selected country. Defaults to the first country in the mock data.
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // The list of regions selected on the map.
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);

  // The alert currently selected from the AlertsList, or null if none is selected.
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // A flag to indicate if the user is in the process of creating a new alert.
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // The currently selected date for viewing forecasts and alerts.
  const [currentDate, setCurrentDate] = useState(new Date());

  // Effect to fetch and set country data when the component mounts or the date changes.
  useEffect(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    // @backend-note This should be an API call, e.g., `fetch('/api/countries?date=${dateKey}')`.
    const newCountries = getCountries(dateKey);
    setCountries(newCountries);

    if (!selectedCountry) {
      setSelectedCountry(newCountries[0]);
    } else {
      // If a country was already selected, find its updated version (with new date-based data).
      const updatedCountry = newCountries.find(c => c.id === selectedCountry.id);
      setSelectedCountry(updatedCountry || newCountries[0]);
    }
  }, [currentDate, selectedCountry?.id]); // Note: dependency on selectedCountry.id to avoid re-running on object reference change.

  // HANDLERS

  const handleDateChange = (days: number) => {
    setCurrentDate(prevDate => addDays(prevDate, days));
  };

  /**
   * Handles changing the selected country.
   * @backend-note When a country changes, data for alerts, stats, and regions
   * for the new country should be fetched from the backend. The current implementation
   * filters local data, but this should be replaced with API calls like:
   * `fetch(`/api/alerts?countryId=${countryId}`)`
   * `fetch(`/api/stats?countryId=${countryId}&date=${currentDate}`)`
   */
  const handleSelectCountry = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      // Reset selections when country changes.
      setSelectedRegions([]);
      setSelectedAlert(null);
      setIsCreatingNew(false);
    }
  };

  /**
   * Handles selecting an alert from the list.
   * This populates the form with the alert's data and highlights the relevant regions.
   */
  const handleSelectAlert = (alert: Alert | null) => {
    setSelectedAlert(alert);
    setIsCreatingNew(false);
    if (alert && selectedCountry) {
      // Populate selected regions based on the alert's data.
      setSelectedRegions(
        selectedCountry.regions.filter(r => alert.regionIds.includes(r.id)) || []
      );
    } else {
      setSelectedRegions([]);
    }
  };

  /**
   * Handles initiating the creation of a new alert.
   */
  const handleNewAlert = () => {
    setIsCreatingNew(true);
    setSelectedAlert(null);
    setSelectedRegions([]);
  };

  /**
   * Handles toggling a region's selection on the map.
   * A region can only be selected if an alert is being created or edited.
   */
  const handleToggleRegion = (region: Region) => {
    if (isCreatingNew || selectedAlert) {
      setSelectedRegions(prev =>
        prev.find(r => r.id === region.id)
          ? prev.filter(r => r.id !== region.id)
          : [...prev, region]
      );
    }
  };

  /**
   * Handles saving a new or updated alert.
   * @backend-note This function currently updates the local `alerts` state.
   * This should be replaced with an API call to a backend endpoint.
   * - For a new alert: `POST /api/alerts` with the alert data.
   * - For an existing alert: `PUT /api/alerts/${alertToSave.id}` with the updated data.
   * The backend should return the saved alert object, which can then be used to update the local state.
   */
  const handleSaveAlert = (alertToSave: Alert) => {
    setAlerts(prevAlerts => {
      const existing = prevAlerts.find(a => a.id === alertToSave.id);
      if (existing) {
        return prevAlerts.map(a => (a.id === alertToSave.id ? alertToSave : a));
      } else {
        return [...prevAlerts, alertToSave];
      }
    });
    setSelectedAlert(alertToSave);
    setIsCreatingNew(false);
  };

  /**
   * Handles deleting an alert.
   * @backend-note This function currently filters the local `alerts` state.
   * It should be replaced with an API call to a backend endpoint:
   * `DELETE /api/alerts/${alertId}`
   * Upon successful deletion, the local state should be updated.
   */
  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
    setSelectedAlert(null);
    setIsCreatingNew(false);
    setSelectedRegions([]);
  };

  // MEMOIZED DERIVED STATE

  /**
   * Filters alerts to show only those for the currently selected country.
   * @backend-note This client-side filtering should be replaced by a backend query,
   * e.g., fetching `/api/alerts?countryId=${selectedCountry.id}` when the country changes.
   */
  const countryAlerts = useMemo(() => {
    if (!selectedCountry) return [];
    return alerts.filter(alert => alert.countryId === selectedCountry.id);
  }, [alerts, selectedCountry]);

  /**
   * Gets the active alerts for the selected date to display on the map.
   * An alert is considered active on a date if its event date range includes that date.
   */
  const activeAlertsOnDate = useMemo(() => {
    return countryAlerts.filter(alert => {
      if (alert.status === 'draft') return false;
      const from = startOfDay(new Date(alert.eventDates.from));
      const to = alert.eventDates.to
        ? startOfDay(new Date(alert.eventDates.to))
        : from;
      const checkDate = startOfDay(currentDate);
      return checkDate >= from && checkDate <= to;
    });
  }, [countryAlerts, currentDate]);

  /**
   * Computes the highest severity for each region based on all active alerts for the selected date.
   * This is used to color the regions on the map.
   */
  const regionSeverities = useMemo(() => {
    const severities = new Map<string, Severity>();
    const severityOrder: Severity[] = ['yellow', 'orange', 'red'];

    for (const alert of activeAlertsOnDate) {
      for (const regionId of alert.regionIds) {
        const currentSeverity = severities.get(regionId);
        if (
          !currentSeverity ||
          severityOrder.indexOf(alert.severity) >
            severityOrder.indexOf(currentSeverity)
        ) {
          severities.set(regionId, alert.severity);
        }
      }
    }
    return severities;
  }, [activeAlertsOnDate]);

  /**
   * Computes the statistics to display in the StatsPanel.
   * It shows national stats if no regions are selected, or aggregates stats for the selected regions.
   * @backend-note This logic for fetching and aggregating stats is performed on the client.
   * For a real application, the backend should provide an endpoint that can return
   * stats for a given country, date, and optionally a list of regions.
   * Example: `/api/stats?countryId=...&date=...&regionIds=...`
   */
  const currentStats = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    if (!selectedCountry) return null;

    // @backend-note These should be API calls.
    const countryNationalStats = nationalStatsForDate(dateKey)[
      selectedCountry.id
    ];
    const statsByRegion = statsByRegionForDate(dateKey);

    if (!countryNationalStats) {
      return null;
    }

    if (selectedRegions.length === 0) {
      return countryNationalStats;
    }

    // Aggregate stats for selected regions
    const aggregated: Stats = {};
    const providers = Object.keys(countryNationalStats);
    for (const provider of providers) {
      aggregated[provider] = { green: 0, yellow: 0, orange: 0, red: 0, total: 0 };
    }

    for (const region of selectedRegions) {
      const regionStats = statsByRegion[region.id];
      if (regionStats) {
        for (const provider of providers) {
          if (aggregated[provider] && regionStats[provider]) {
            for (const level of Object.keys(regionStats[provider])) {
              (aggregated[provider] as any)[level] += (regionStats[provider] as any)[
                level
              ];
            }
          }
        }
      }
    }
    return aggregated;
  }, [selectedRegions, selectedCountry, currentDate]);

  // Conditional rendering flags
  const showForm = isCreatingNew || selectedAlert;
  const canSelectRegions = isCreatingNew || selectedAlert;

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 md:px-6 border-b flex justify-between items-center flex-wrap gap-4">
        <Select value={selectedCountry.id} onValueChange={handleSelectCountry}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center font-medium min-w-[140px]">
            <p>{format(currentDate, 'PPP')}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            disabled={isToday(currentDate)}
          >
            Today
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 flex-1 overflow-y-auto">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-3 h-full">
          <AlertsList
            alerts={countryAlerts}
            selectedAlert={selectedAlert}
            onSelectAlert={handleSelectAlert}
            onNewAlert={handleNewAlert}
          />
        </div>

        {/* Center & Right Column combined */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <StatsPanel stats={currentStats} />
          <MapView
            country={selectedCountry}
            selectedRegions={selectedRegions}
            onToggleRegion={handleToggleRegion}
            canSelectRegions={canSelectRegions}
            regionSeverities={regionSeverities}
          />
          {showForm ? (
              <AlertForm
                key={selectedAlert?.id || 'new'} // Use key to force re-render on new alert
                alert={selectedAlert}
                country={selectedCountry}
                selectedRegions={selectedRegions}
                onSave={handleSaveAlert}
                onDelete={handleDeleteAlert}
                onCancel={() => {
                  handleSelectAlert(null);
                }}
              />
          ) : (
            <Card className="flex items-center justify-center h-full bg-card rounded-lg border border-dashed min-h-[200px]">
              <div className="text-center text-muted-foreground">
                <p>Select an alert to view details</p>
                <p className="text-sm">or create a new one.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
