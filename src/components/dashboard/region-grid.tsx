'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Country, Region, Severity } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CloudRain } from 'lucide-react';

interface RegionGridProps {
  country: Country;
  selectedRegions: Region[];
  onToggleRegion: (region: Region) => void;
  canSelectRegions: boolean;
  regionSeverities: Map<string, Severity>;
}

export function RegionGrid({
  country,
  selectedRegions,
  onToggleRegion,
  canSelectRegions,
  regionSeverities,
}: RegionGridProps) {
  const severityColorMap: Record<Severity, string> = {
    yellow: 'border-yellow-400',
    orange: 'border-orange-500',
    red: 'border-red-600',
  };

  return (
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
                  <p>
                    <span className="text-yellow-500">Y:</span>{' '}
                    {region.thresholds?.yellow}
                  </p>
                  <p>
                    <span className="text-orange-500">O:</span>{' '}
                    {region.thresholds?.orange}
                  </p>
                  <p>
                    <span className="text-red-600">R:</span>{' '}
                    {region.thresholds?.red}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
