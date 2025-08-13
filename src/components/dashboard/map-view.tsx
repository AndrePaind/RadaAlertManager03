
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

export function MapView({ country, selectedRegions, onToggleRegion, canSelectRegions, regionSeverities }: MapViewProps) {
    const [regionsWithCenters, setRegionsWithCenters] = useState<RegionWithCenter[]>([]);

    useEffect(() => {
        // This code runs only on the client, after the component has mounted.
        // This avoids the "document is not defined" error during server-side rendering.
        const calculatedRegions = country.regions.map(region => {
            const tempDiv = document.createElement('div');
            // Create a temporary SVG to accurately measure the bounding box of the path
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.visibility = 'hidden';
            svg.style.position = 'absolute';

            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathElement.setAttribute("d", region.path);

            svg.appendChild(pathElement);
            tempDiv.appendChild(svg);
            document.body.appendChild(tempDiv);
            
            const bbox = pathElement.getBBox();
            
            document.body.removeChild(tempDiv);
            
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
        <div className="w-full h-full rounded-lg bg-white dark:bg-gray-800 overflow-hidden relative" data-ai-hint="country map">
          <svg viewBox="0 0 400 255" className="w-full h-full">
            <rect width="100%" height="100%" fill="currentColor" className="text-white dark:text-gray-800" />
            {regionsWithCenters.map((region) => {
              const isSelected = selectedRegions.some(sr => sr.id === region.id);
              const severity = regionSeverities.get(region.id);
              const severityColor = severity ? severityColorMap[severity] : 'fill-primary/20';
              
              return (
                <g key={region.id} onClick={() => canSelectRegions && onToggleRegion(region)} className={cn("group", canSelectRegions && "cursor-pointer")}>
                  <path
                    d={region.path}
                    className={cn(
                      'stroke-primary/50 stroke-2 transition-all',
                      isSelected ? 'fill-primary/70' : severityColor,
                      !canSelectRegions && severity ? severityColor : '',
                      !canSelectRegions && !severity ? 'fill-gray-200' : '',
                      canSelectRegions && 'group-hover:fill-primary/40'
                    )}
                  />
                  {/* Tooltip-like text on hover */}
                  <text x={region.centerX} y={region.centerY} textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="black" className="pointer-events-none">
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
