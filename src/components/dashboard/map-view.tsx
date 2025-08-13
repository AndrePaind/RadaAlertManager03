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

export function MapView({ country, selectedRegions, onToggleRegion }: MapViewProps) {
    const [date, setDate] = useState<Date>(new Date());

    const countryRegions = country.regions;

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
            <Button>
                <Play className="mr-2 h-4 w-4"/>
                Animate
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2">
        <div className="w-full h-full rounded-lg bg-white dark:bg-gray-800 overflow-hidden relative" data-ai-hint="country map">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <rect width="100%" height="100%" fill="currentColor" className="text-white dark:text-gray-800" />
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
                  <text x={10} y={280} fontSize="10" fill="black" className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
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
