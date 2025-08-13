'use client';

import type { Stats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { forecastProviders } from '@/lib/data';
import { Separator } from '../ui/separator';

interface StatsPanelProps {
  stats: Stats | null;
}

const StatCard = ({ title, value, colorClass }: { title: string, value: number, colorClass: string }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-card flex-1">
        <p className={`text-sm font-medium ${colorClass}`}>{title}</p>
        <p className="text-xl font-bold">{value.toLocaleString()}</p>
    </div>
)

export function StatsPanel({ stats }: StatsPanelProps) {

  const realityStats = stats?.['reality'];
  const otherProviders = forecastProviders.filter(p => p.id !== 'reality');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Summary</CardTitle>
        <CardDescription>Comparison of real-time user status against forecast provider predictions.</CardDescription>
      </CardHeader>
      <CardContent>
        {!stats ? (
           <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">No statistical data available for this selection.</p>
          </div>
        ) : (
        <div className="space-y-4">
            {realityStats && (
                 <div>
                    <h4 className="text-sm font-semibold mb-2">Reality</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <StatCard title="Green" value={realityStats.green} colorClass="text-green-600" />
                        <StatCard title="Yellow" value={realityStats.yellow} colorClass="text-yellow-500" />
                        <StatCard title="Orange" value={realityStats.orange} colorClass="text-orange-500" />
                        <StatCard title="Red" value={realityStats.red} colorClass="text-red-600" />
                        <div className="flex flex-col items-center p-2 rounded-lg bg-card flex-1 col-span-2 md:col-span-1">
                            <p className="text-sm font-medium">Total</p>
                            <p className="text-xl font-bold">{realityStats.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <Separator />
            
            <div className='space-y-4'>
                <h4 className="text-sm font-semibold">Forecasts</h4>
                {otherProviders.map((provider) => {
                const providerStats = stats[provider.id];
                if (!providerStats) return null;
                return (
                    <div key={provider.id}>
                        <h5 className="text-xs font-medium text-muted-foreground mb-2">{provider.name}</h5>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            <StatCard title="Green" value={providerStats.green} colorClass="text-green-600" />
                            <StatCard title="Yellow" value={providerStats.yellow} colorClass="text-yellow-500" />
                            <StatCard title="Orange" value={providerStats.orange} colorClass="text-orange-500" />
                            <StatCard title="Red" value={providerStats.red} colorClass="text-red-600" />
                            <div className="flex flex-col items-center p-2 rounded-lg bg-card flex-1 col-span-2 md:col-span-1">
                                <p className="text-sm font-medium">Total</p>
                                <p className="text-xl font-bold">{providerStats.total.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )
                })}
            </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
