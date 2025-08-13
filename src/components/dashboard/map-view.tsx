'use client';
/**
 * @fileoverview This component renders the main map view, displaying country regions.
 * It allows users to select regions by clicking on them, which is essential for creating or editing alerts.
 * The map is an SVG where each region is a `<path>` element.
 */

import type { Country, Region, Severity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CloudRain, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const severityColorMap: Record<Severity, string> = {
    yellow: 'border-yellow-400',
    orange: 'border-orange-500',
    red: 'border-red-600',
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
          {country.regions.map(region => {
            const isSelected = selectedRegions.some(sr => sr.id === region.id);
            const severity = regionSeverities.get(region.id);

            let borderClass = 'border-border';
            if (isSelected) {
              borderClass = 'border-primary ring-2 ring-primary';
            } else if (severity) {
              borderClass = severityColorMap[severity];
            }

            return (
              <Card
                key={region.id}
                onClick={() => canSelectRegions && onToggleRegion(region)}
                className={cn(
                  'transition-all',
                  canSelectRegions && 'cursor-pointer hover:shadow-lg',
                  'border-2',
                  borderClass
                )}
              >
                <CardHeader className="p-2">
                  <CardTitle className="text-sm text-center">
                    {region.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Google</span>
                    <div className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-400" />
                      <span>{region.forecast?.google || 'N/A'}mm</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">OpenWeather</span>
                     <div className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-400" />
                      <span>{region.forecast?.openweather || 'N/A'}mm</span>
                    </div>
                  </div>
                  <Separator />
                   <div className="space-y-1 text-center">
                      <p className="font-medium">Thresholds (mm)</p>
                      <div className="flex justify-around">
                        <p><span className="text-yellow-500">Y:</span> {region.thresholds?.yellow}</p>
                        <p><span className="text-orange-500">O:</span> {region.thresholds?.orange}</p>
                        <p><span className="text-red-600">R:</span> {region.thresholds?.red}</p>
                      </div>
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
