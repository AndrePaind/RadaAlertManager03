
'use client';
/**
 * @file This is the main component for the dashboard. It acts as the central hub,
 * managing the application's state and orchestrating interactions between its child components:
 * - AlertsList: Displays and manages alerts.
 * - AlertForm: For creating and editing alerts.
 * - StatsPanel: Shows statistical data.
 * - MapView: Displays the geographical map and regions.
 * - LayerControls: Provides options to toggle map layers.
 */

import { useState, useMemo } from 'react';
import type { Alert, Country, Region, Severity, Stats } from '@/lib/types';
// FAKE DATA: Importing mock data. In a real application, this would be fetched from a backend API.
import { alerts as initialAlerts, countries, statsByRegion, nationalStats } from '@/lib/data';
import { AlertsList } from './alerts-list';
import { LayerControls } from './layer-controls';
import { MapView } from './map-view';
import { StatsPanel } from './stats-panel';
import { AlertForm } from './alert-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '../ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format } from 'date-fns';

export function MainDashboard() {
  // STATE MANAGEMENT
  // @backend-note All state is managed locally using `useState`. In a production environment,
  // this state should be fetched from and persisted to a backend. For more complex scenarios,
  // a state management library like Redux or Zustand might be considered.

  // The list of all alerts. Initialized with mock data.
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  
  // The currently selected country. Defaults to the first country in the mock data.
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  
  // The list of regions selected on the map.
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  
  // The alert currently selected from the AlertsList, or null if none is selected.
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // A flag to indicate if the user is in the process of creating a new alert.
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // The currently selected date for viewing forecasts and alerts.
  const [currentDate, setCurrentDate] = useState(new Date());


  // HANDLERS

  const handleDateChange = (days: number) => {
    setCurrentDate(prevDate => addDays(prevDate, days));
  };
  
  /**
   * Handles changing the selected country.
   * @backend-note When a country changes, data for alerts, stats, and regions
   * for the new country should be fetched from the backend.
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
   * This populates the form with the alert's data.
   */
  const handleSelectAlert = (alert: Alert | null) => {
    setSelectedAlert(alert);
    if (alert) {
      const country = countries.find(c => c.id === alert.countryId);
      if(country) setSelectedCountry(country);
      // Populate selected regions based on the alert's data.
      setSelectedRegions(country?.regions.filter(r => alert.regionIds.includes(r.id)) || []);
      setIsCreatingNew(false);
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
   * This should be replaced with an API call to a backend endpoint (e.g., POST /api/alerts or PUT /api/alerts/:id)
   * to persist the changes to the database.
   */
  const handleSaveAlert = (alertToSave: Alert) => {
    const existing = alerts.find(a => a.id === alertToSave.id);
    if (existing) {
      setAlerts(alerts.map(a => a.id === alertToSave.id ? alertToSave : a));
    } else {
      setAlerts([...alerts, alertToSave]);
    }
    setSelectedAlert(alertToSave);
    setIsCreatingNew(false);
  };

  /**
   * Handles deleting an alert.
   * @backend-note This function currently filters the local `alerts` state.
   * It should be replaced with an API call to a backend endpoint (e.g., DELETE /api/alerts/:id).
   */
  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
    setSelectedAlert(null);
    setIsCreatingNew(false);
  };

  // MEMOIZED DERIVED STATE

  /**
   * Filters alerts to show only those for the currently selected country.
   * @backend-note This client-side filtering should be replaced by a backend query,
   * e.g., fetching `/api/alerts?countryId=${selectedCountry.id}`.
   */
  const countryAlerts = useMemo(() => {
    return alerts.filter(alert => alert.countryId === selectedCountry.id);
  }, [alerts, selectedCountry]);

  /**
   * Gets the active alerts for the selected date.
   */
  const activeAlertsOnDate = useMemo(() => {
    return countryAlerts.filter(alert => {
      const from = new Date(alert.eventDates.from);
      from.setHours(0,0,0,0);
      const to = alert.eventDates.to ? new Date(alert.eventDates.to) : from;
      to.setHours(23,59,59,999);
      const checkDate = new Date(currentDate);
      checkDate.setHours(0,0,0,0);
      return checkDate >= from && checkDate <= to;
    })
  }, [countryAlerts, currentDate]);

  /**
   * Computes the severity for each region based on active alerts for the selected date.
   */
  const regionSeverities = useMemo(() => {
    const severities = new Map<string, Severity>();
    const severityOrder: Severity[] = ['yellow', 'orange', 'red'];
    
    for (const alert of activeAlertsOnDate) {
      for (const regionId of alert.regionIds) {
        const currentSeverity = severities.get(regionId);
        if (!currentSeverity || severityOrder.indexOf(alert.severity) > severityOrder.indexOf(currentSeverity)) {
          severities.set(regionId, alert.severity);
        }
      }
    }
    return severities;
  }, [activeAlertsOnDate]);

  /**
   * Computes the statistics to display in the StatsPanel.
   * It shows national stats if no regions are selected, or aggregates stats for the selected regions.
   * @backend-note This logic for aggregating stats is performed on the client.
   * For a real application, the backend should provide an endpoint that can return
   * aggregated stats for a given set of regions (e.g., /api/stats?regionIds=...&countryId=...).
   */
  const currentStats = useMemo(() => {
    if (!nationalStats[selectedCountry.id]) {
      return null;
    }
    const countryNationalStats = nationalStats[selectedCountry.id];
    
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
        if(regionStats) {
            for (const provider of providers) {
                if (aggregated[provider] && regionStats[provider]) {
                    for (const level of Object.keys(regionStats[provider])) {
                        (aggregated[provider] as any)[level] += (regionStats[provider] as any)[level];
                    }
                }
            }
        }
    }
    return aggregated;
  }, [selectedRegions, selectedCountry.id]);
  
  // Conditional rendering flags
  const showForm = isCreatingNew || selectedAlert;
  const canSelectRegions = isCreatingNew || selectedAlert;


  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 md:px-6 border-b flex justify-between items-center">
        <Select value={selectedCountry.id} onValueChange={handleSelectCountry}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center font-medium">
                <p>{format(currentDate, 'PPP')}</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => handleDateChange(1)}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-3">
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-3 flex flex-col gap-6">
               <div className="flex-grow flex flex-col">
                <MapView 
                  country={selectedCountry}
                  selectedRegions={selectedRegions}
                  onToggleRegion={handleToggleRegion}
                  canSelectRegions={canSelectRegions}
                  regionSeverities={regionSeverities}
                />
              </div>
              <LayerControls />
            </div>
            
          </div>
           {showForm ? (
              <div className="xl:col-span-3">
                <AlertForm
                  key={selectedAlert?.id || 'new'} // Use key to force re-render on new alert
                  alert={selectedAlert}
                  country={selectedCountry}
                  selectedRegions={selectedRegions}
                  onSave={handleSaveAlert}
                  onDelete={handleDeleteAlert}
                  onCancel={() => {
                    setSelectedAlert(null);
                    setIsCreatingNew(false);
                    setSelectedRegions([]);
                  }}
                />
              </div>
            ) : (
                <Card className="xl:col-span-3 flex items-center justify-center h-full bg-card rounded-lg border border-dashed min-h-[200px]">
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
