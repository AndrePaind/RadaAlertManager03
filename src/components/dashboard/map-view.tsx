
'use client';
/**
 * @fileoverview This component renders the main map view, displaying country regions.
 * It allows users to select regions by clicking on them, which is essential for creating or editing alerts.
 * The map is an SVG where each region is a `<path>` element.
 */

import type { Country, Region } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { CalendarIcon, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface MapViewProps {
  country: Country; // The country data, including its regions and their SVG paths.
  selectedRegions: Region[]; // An array of currently selected regions.
  onToggleRegion: (region: Region) => void; // Callback function to handle region selection/deselection.
  canSelectRegions: boolean; // Controls whether regions can be selected.
}

interface RegionWithCenter extends Region {
    centerX: number;
    centerY: number;
}

export function MapView({ country, selectedRegions, onToggleRegion, canSelectRegions }: MapViewProps) {
    // State for the date picker in the map header.
    const [date, setDate] = useState<Date>(new Date());
    const [regionsWithCenters, setRegionsWithCenters] = useState<RegionWithCenter[]>([]);

    useEffect(() => {
        // This code runs only on the client, after the component has mounted.
        // This avoids the "document is not defined" error during server-side rendering.
        const calculatedRegions = country.regions.map(region => {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathElement.setAttribute("d", region.path);
            const bbox = pathElement.getBBox();
            return {
                ...region,
                centerX: bbox.x + bbox.width / 2,
                centerY: bbox.y + bbox.height / 2,
            };
        });
        setRegionsWithCenters(calculatedRegions);
    }, [country.regions]);


  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Forecast Map: {country.name}</CardTitle>
        <div className="flex items-center gap-2">
            {/* Date Picker */}
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-auto md:w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? <span className="hidden md:inline">{format(date, "PPP")}</span> : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            {/* Animate Button (Placeholder) */}
             {/* @backend-note The "Animate" button is currently a placeholder.
                 It could be used to trigger an animation of forecast data over time,
                 which would require time-series data from the backend. */}
            <Button>
                <Play className="mr-2 h-4 w-4"/>
                Animate
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2">
        {/* The map is an SVG. The region paths are defined in `src/lib/data.ts`. */}
        {/* @backend-note For a dynamic application, the GeoJSON or SVG path data for regions
            should be fetched from a backend service, especially if new countries or regions are added. */}
        <div className="w-full h-full rounded-lg bg-white dark:bg-gray-800 overflow-hidden relative" data-ai-hint="country map">
          <svg viewBox="0 0 420 240" className="w-full h-full">
            <rect width="100%" height="100%" fill="currentColor" className="text-white dark:text-gray-800" />
            {regionsWithCenters.map((region) => {
              const isSelected = selectedRegions.some(sr => sr.id === region.id);
              
              return (
                <g key={region.id} onClick={() => canSelectRegions && onToggleRegion(region)} className={cn("group", canSelectRegions && "cursor-pointer")}>
                  <path
                    d={region.path}
                    className={cn(
                      'stroke-primary/50 stroke-2 transition-all',
                      isSelected ? 'fill-primary/70' : 'fill-primary/20 group-hover:fill-primary/40',
                      !canSelectRegions && 'fill-gray-200'
                    )}
                  />
                  {/* Tooltip-like text on hover */}
                  <text x={region.centerX} y={region.centerY} textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="black" className="pointer-events-none">
                    {region.name}
                  </text>
                </g>
              );
            })}
             <text x={10} y={12} fontSize="8" className="fill-foreground/50 font-semibold">{country.name} Regions</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
