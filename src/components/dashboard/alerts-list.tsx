'use client';
/**
 * @fileoverview This component displays a list of alerts, categorized by status (Draft, Active, Expired).
 * It allows users to select an alert to view its details or to create a new alert.
 */

import type { Alert } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

interface AlertsListProps {
  alerts: Alert[]; // The list of all alerts for the selected country.
  selectedAlert: Alert | null; // The currently selected alert.
  onSelectAlert: (alert: Alert) => void; // Callback function when an alert is selected.
  onNewAlert: () => void; // Callback function to initiate creating a new alert.
}

export function AlertsList({
  alerts,
  selectedAlert,
  onSelectAlert,
  onNewAlert,
}: AlertsListProps) {
  /**
   * Renders a single alert card.
   * @param alert The alert object to render.
   */
  const renderAlert = (alert: Alert) => {
    // Map severity levels to specific CSS classes for color-coding.
    const severityMap: { [key in Alert['severity']]: string } = {
      yellow: 'bg-yellow-400 hover:bg-yellow-400/90',
      orange: 'bg-orange-500 hover:bg-orange-500/90',
      red: 'bg-red-600 hover:bg-red-600/90',
    };

    return (
      <Card
        key={alert.id}
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          selectedAlert?.id === alert.id && 'ring-2 ring-primary' // Highlight the selected alert.
        )}
        onClick={() => onSelectAlert(alert)}
      >
        <CardHeader className="p-4 flex-row items-start justify-between">
          <CardTitle className="text-base font-semibold">
            {alert.eventType}
          </CardTitle>
          <Badge className={cn('text-white', severityMap[alert.severity])}>
            {alert.severity}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
          <p>Regions: {alert.regionIds.length}</p>
          <p>Updated: {alert.lastUpdated.toLocaleDateString()}</p>
        </CardContent>
      </Card>
    );
  };

  // Filter alerts into different status categories.
  // @backend-note The filtering is done on the client side. For performance with large datasets,
  // this should be handled by the backend through API query parameters (e.g., /api/alerts?status=draft).
  const drafts = alerts.filter(a => a.status === 'draft');
  const active = alerts.filter(a => a.status === 'active');
  const expired = alerts.filter(a => a.status === 'expired');

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Alerts</CardTitle>
        <Button size="sm" onClick={onNewAlert}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Alert
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-0">
        <Tabs defaultValue="drafts" className="flex flex-col flex-grow">
          <div className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-3">
              <TabsContent value="drafts" className="mt-0">
                <div className="space-y-3">
                  {drafts.length > 0 ? (
                    drafts.map(renderAlert)
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No draft alerts.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="active" className="mt-0">
                <div className="space-y-3">
                {active.length > 0 ? (
                  active.map(renderAlert)
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No active alerts.
                  </p>
                )}
                </div>
              </TabsContent>
              <TabsContent value="expired" className="mt-0">
                <div className="space-y-3">
                {expired.length > 0 ? (
                  expired.map(renderAlert)
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No expired alerts.
                  </p>
                )}
                </div>
              </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
