'use client';
/**
 * @fileoverview This component renders the main map view area, including the GIS map placeholder
 * and the grid of region-specific data cards. It's responsible for displaying geographic
 * information and allowing for region selection.
 */

import type { Country, Region, Severity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayerControls } from './layer-controls';
import { RegionGrid } from './region-grid';

interface MapViewProps {
  country: Country; // The country data, including its regions.
  selectedRegions: Region[]; // An array of currently selected regions.
  onToggleRegion: (region: Region) => void; // Callback function to handle region selection/deselection.
  canSelectRegions: boolean; // Controls whether regions can be selected.
  regionSeverities: Map<string, Severity>; // Map of region IDs to their current active alert severity.
}

export function MapView({
  country,
  selectedRegions,
  onToggleRegion,
  canSelectRegions,
  regionSeverities,
}: MapViewProps) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        {/*
          @backend-note This is a placeholder for the real GIS map component.
          The backend team will need to integrate a mapping library (e.g., Mapbox, Leaflet, Google Maps) here.
          This map should be able to:
          1. Display geographic boundaries (polygons) for each region, ideally loaded from a GeoJSON source.
          2. Color the regions based on the `regionSeverities` prop, which indicates the active alert level.
          3. Handle click events on regions to call the `onToggleRegion` function.
          4. The `LayerControls` component below will provide a UI to toggle various GIS data layers (like user locations,
             infrastructure, etc.) on this map. The data for these layers will need to be fetched from the backend.
        */}
        <div
          className="relative bg-muted/20 border border-dashed rounded-lg flex items-center justify-center min-h-[250px]"
          data-ai-hint="country map"
        >
          <p className="text-muted-foreground">GIS Map View Placeholder</p>
        </div>
        <LayerControls />
        <RegionGrid
          country={country}
          selectedRegions={selectedRegions}
          onToggleRegion={onToggleRegion}
          canSelectRegions={canSelectRegions}
          regionSeverities={regionSeverities}
        />
      </CardContent>
    </Card>
  );
}
