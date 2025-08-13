'use client';
/**
 * @fileoverview This component renders the main map view, displaying country regions.
 * It allows users to select regions by clicking on them, which is essential for creating or editing alerts.
 * The map is an SVG where each region is a `<path>` element.
 */

import type { Country, Region, Severity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface MapViewProps {
  country: Country; // The country data, including its regions and their SVG paths.
  selectedRegions: Region[]; // An array of currently selected regions.
  onToggleRegion: (region: Region) => void; // Callback function to handle region selection/deselection.
  canSelectRegions: boolean; // Controls whether regions can be selected.
  regionSeverities: Map<string, Severity>; // Map of region IDs to their current severity level.
}

interface RegionWithCenter extends Region {
  centerX: number;
  centerY: number;
}

export function MapView({
  country,
  selectedRegions,
  onToggleRegion,
  canSelectRegions,
  regionSeverities,
}: MapViewProps) {
  const [regionsWithCenters, setRegionsWithCenters] = useState<
    RegionWithCenter[]
  >([]);

  useEffect(() => {
    // This effect calculates the center of each region's SVG path.
    // It runs on the client-side to avoid SSR errors, as it needs access to the DOM.
    const calculatedRegions = country.regions.map(region => {
      // A temporary SVG is created in memory to measure the path's bounding box
      // without actually rendering it to the screen.
      const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tempSvg.style.visibility = 'hidden';
      tempSvg.style.position = 'absolute';

      const pathElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      pathElement.setAttribute('d', region.path);

      tempSvg.appendChild(pathElement);
      document.body.appendChild(tempSvg);

      const bbox = pathElement.getBBox();

      document.body.removeChild(tempSvg);

      return {
        ...region,
        centerX: bbox.x + bbox.width / 2,
        centerY: bbox.y + bbox.height / 2,
      };
    });
    setRegionsWithCenters(calculatedRegions);
  }, [country.regions]);

  const severityColorMap: Record<Severity, string> = {
    yellow: 'fill-yellow-400/70',
    orange: 'fill-orange-500/70',
    red: 'fill-red-600/70',
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2">
        {/* The map is an SVG. The region paths are defined in `src/lib/data.ts`. */}
        {/* @backend-note For a dynamic application, the GeoJSON or SVG path data for regions
            should be fetched from a backend service, especially if new countries or regions are added. */}
        <div
          className="w-full h-full rounded-lg bg-white dark:bg-gray-800 overflow-hidden relative"
          data-ai-hint="country map"
        >
          <svg viewBox="0 0 400 255" className="w-full h-full">
            <rect
              width="100%"
              height="100%"
              fill="currentColor"
              className="text-white dark:text-gray-800"
            />
            {regionsWithCenters.map(region => {
              const isSelected = selectedRegions.some(sr => sr.id === region.id);
              const severity = regionSeverities.get(region.id);

              let fillColor = 'fill-gray-200 dark:fill-gray-600'; // Default color for no severity
              if (severity) {
                fillColor = severityColorMap[severity];
              }
              if (isSelected) {
                fillColor = 'fill-primary/70';
              }

              return (
                <g
                  key={region.id}
                  onClick={() => canSelectRegions && onToggleRegion(region)}
                  className={cn('group', canSelectRegions && 'cursor-pointer')}
                >
                  <path
                    d={region.path}
                    className={cn(
                      'stroke-primary/50 stroke-2 transition-all',
                      fillColor,
                      canSelectRegions && 'group-hover:fill-primary/40'
                    )}
                  />
                  {/* Tooltip-like text on hover */}
                  <text
                    x={region.centerX}
                    y={region.centerY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6"
                    fill="black"
                    className="pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
