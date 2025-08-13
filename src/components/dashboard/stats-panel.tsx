'use client';

import type { Stats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { forecastProviders } from '@/lib/data';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  stats: Stats | null;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const severityMap: { [key in 'yellow' | 'orange' | 'red' ]: string } = {
    yellow: 'bg-yellow-400',
    orange: 'bg-orange-500',
    red: 'bg-red-600',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Summary</CardTitle>
        <CardDescription>User counts per alert level for each forecast provider.</CardDescription>
      </CardHeader>
      <CardContent>
        {!stats ? (
           <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">No statistical data available for this selection.</p>
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right text-green-600">Green</TableHead>
              <TableHead className="text-right text-yellow-500">Yellow</TableHead>
              <TableHead className="text-right text-orange-500">Orange</TableHead>
              <TableHead className="text-right text-red-600">Red</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forecastProviders.map((provider) => {
              const providerStats = stats[provider.id];
              if (!providerStats) return null;
              return (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell className="text-right">{providerStats.green.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{providerStats.yellow.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{providerStats.orange.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{providerStats.red.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">{providerStats.total.toLocaleString()}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
