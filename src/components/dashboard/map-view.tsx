'use client';

import type { Country, Region } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { CalendarIcon, Play } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface MapViewProps {
  country: Country;
  selectedRegions: Region[];
  onToggleRegion: (region: Region) => void;
}

const mapDimensions = {
  width: 500,
  height: 400
}

const FAKE_KENYA_SVG_PATHS = {
    'nairobi': "M248,187 L260,182 L265,195 L250,200 Z",
    'mombasa': "M340,240 L355,235 L360,250 L345,255 Z",
    'kisumu': "M160,150 L175,145 L180,160 L165,165 Z",
    'nakuru': "M220,140 L235,135 L240,150 L225,155 Z",
    'rift-valley': "M150,50 L300,60 L290,180 L140,170 Z"
};

export function MapView({ country, selectedRegions, onToggleRegion }: MapViewProps) {
    const [date, setDate] = useState<Date>(new Date());

    const countryRegions = country.regions.map(r => ({
        ...r,
        path: FAKE_KENYA_SVG_PATHS[r.id] || r.path,
    }));

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Forecast Map: {country.name}</CardTitle>
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            <Button>
                <Play className="mr-2 h-4 w-4"/>
                Animate
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2">
        <div className="w-full h-full rounded-lg bg-blue-100 dark:bg-blue-900/20 overflow-hidden relative" data-ai-hint="country map">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <rect width="100%" height="100%" fill="currentColor" />
            {countryRegions.map((region) => {
              const isSelected = selectedRegions.some(sr => sr.id === region.id);
              return (
                <g key={region.id} onClick={() => onToggleRegion(region)} className="cursor-pointer group">
                  <path
                    d={region.path}
                    className={cn(
                      'stroke-primary/50 stroke-2 transition-all',
                      isSelected ? 'fill-primary/70' : 'fill-primary/20 group-hover:fill-primary/40'
                    )}
                  />
                  <text x={10} y={280} fontSize="10" fill="white" className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    {region.name}
                  </text>
                </g>
              );
            })}
             <text x={10} y={20} fontSize="12" className="fill-foreground/50 font-semibold">{country.name} Regions</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
