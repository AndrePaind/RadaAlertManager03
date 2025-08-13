'use client';
/**
 * @fileoverview This component renders the main map view, displaying country regions.
 * It allows users to select regions by clicking on them, which is essential for creating or editing alerts.
 * The map is an SVG where each region is a `<path>` element.
 */

import type { Country, Region, Severity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayerControls } from './layer-controls';
import { RegionGrid } from './region-grid';

interface MapViewProps {
  country: Country; // The country data, including its regions and their SVG paths.
  selectedRegions: Region[]; // An array of currently selected regions.
  onToggleRegion: (region: Region) => void; // Callback function to handle region selection/deselection.
  canSelectRegions: boolean; // Controls whether regions can be selected.
  regionSeverities: Map<string, Severity>; // Map of region IDs to their current severity level.
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
      <CardContent className="flex-1 flex flex-col gap-4 p-2">
        {/* @backend-note This is a placeholder for the real GIS map component.
            The backend team will need to integrate a mapping library (e.g., Mapbox, Leaflet) here.
            The `LayerControls` component will interact with this map to toggle GIS layers.
        */}
        <div 
          className="relative bg-muted/20 border border-dashed rounded-lg flex items-center justify-center"
          style={{ height: '300px' }}
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
