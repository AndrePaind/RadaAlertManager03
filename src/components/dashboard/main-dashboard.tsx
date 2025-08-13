'use client';

import { useState, useMemo } from 'react';
import type { Alert, Country, Region, Stats } from '@/lib/types';
import { alerts as initialAlerts, countries, statsByRegion, nationalStats } from '@/lib/data';
import { AlertsList } from './alerts-list';
import { LayerControls } from './layer-controls';
import { MapView } from './map-view';
import { StatsPanel } from './stats-panel';
import { AlertForm } from './alert-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function MainDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleSelectCountry = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      setSelectedRegions([]);
      setSelectedAlert(null);
      setIsCreatingNew(false);
    }
  };

  const handleSelectAlert = (alert: Alert | null) => {
    setSelectedAlert(alert);
    if (alert) {
      const country = countries.find(c => c.id === alert.countryId);
      if(country) setSelectedCountry(country);
      setSelectedRegions(country?.regions.filter(r => alert.regionIds.includes(r.id)) || []);
      setIsCreatingNew(false);
    } else {
      setSelectedRegions([]);
    }
  };

  const handleNewAlert = () => {
    setIsCreatingNew(true);
    setSelectedAlert(null);
    setSelectedRegions([]);
  };

  const handleToggleRegion = (region: Region) => {
    if (isCreatingNew || selectedAlert) {
        setSelectedRegions(prev =>
          prev.find(r => r.id === region.id)
            ? prev.filter(r => r.id !== region.id)
            : [...prev, region]
        );
    }
  };
  
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

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
    setSelectedAlert(null);
    setIsCreatingNew(false);
  };

  const countryAlerts = useMemo(() => {
    return alerts.filter(alert => alert.countryId === selectedCountry.id);
  }, [alerts, selectedCountry]);

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
  
  const showForm = isCreatingNew || selectedAlert;
  const canSelectRegions = isCreatingNew || selectedAlert;


  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:px-6 border-b">
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
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
          <AlertsList
            alerts={countryAlerts}
            selectedAlert={selectedAlert}
            onSelectAlert={handleSelectAlert}
            onNewAlert={handleNewAlert}
          />
        </div>

        <div className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-hidden">
          <div className="xl:col-span-2 flex flex-col gap-6 overflow-y-auto">
            <StatsPanel stats={currentStats} />
            <MapView 
              country={selectedCountry}
              selectedRegions={selectedRegions}
              onToggleRegion={handleToggleRegion}
              canSelectRegions={canSelectRegions}
            />
            <LayerControls />
          </div>
          <div className="xl:col-span-1 overflow-y-auto">
            {showForm ? (
              <AlertForm
                key={selectedAlert?.id || 'new'}
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
            ) : (
                <div className="flex items-center justify-center h-full bg-card rounded-lg border border-dashed">
                    <div className="text-center text-muted-foreground">
                        <p>Select an alert to view details</p>
                        <p className="text-sm">or create a new one.</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
