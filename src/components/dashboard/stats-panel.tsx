'use client';
/**
 * @fileoverview This component displays a statistical summary of "Actual"
 * (actual user status).
 */

import type { Stats } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface StatsPanelProps {
  stats: Stats | null; // The statistical data to display. Can be national or aggregated for selected regions.
}

/**
 * A small card component to display a single statistic (e.g., number of users in 'Green').
 */
const StatCard = ({
  title,
  value,
  colorClass,
}: {
  title: string;
  value: number;
  colorClass: string;
}) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-card flex-1">
    <p className={`text-sm font-medium ${colorClass}`}>{title}</p>
    <p className="text-xl font-bold">{value.toLocaleString()}</p>
  </div>
);

export function StatsPanel({ stats }: StatsPanelProps) {
  // @backend-note The stats data is passed as a prop from MainDashboard.
  // This data is derived from the mock data in `src/lib/data.ts`.
  // In a real application, this data would be fetched from a backend API.
  // The 'actual' stats would likely come from a separate source (e.g., user reports)
  // compared to forecast providers.

  const actualStats = stats?.['actual'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Summary</CardTitle>
        <CardDescription>
          Overview of real-time user status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!stats || !actualStats ? (
          // Display a message if no stats are available for the current selection.
          <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">
              No statistical data available for this selection.
            </p>
          </div>
        ) : (
          <div>
            <h4 className="text-sm font-semibold mb-2">Actual</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <StatCard
                title="Green"
                value={actualStats.green}
                colorClass="text-green-600"
              />
              <StatCard
                title="Yellow"
                value={actualStats.yellow}
                colorClass="text-yellow-500"
              />
              <StatCard
                title="Orange"
                value={actualStats.orange}
                colorClass="text-orange-500"
              />
              <StatCard
                title="Red"
                value={actualStats.red}
                colorClass="text-red-600"
              />
              <div className="flex flex-col items-center p-2 rounded-lg bg-card flex-1 col-span-2 md:col-span-1">
                <p className="text-sm font-medium">Total</p>
                <p className="text-xl font-bold">
                  {actualStats.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
