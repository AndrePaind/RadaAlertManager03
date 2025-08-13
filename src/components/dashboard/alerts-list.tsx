'use client';

import type { Alert } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

interface AlertsListProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  onNewAlert: () => void;
}

export function AlertsList({ alerts, selectedAlert, onSelectAlert, onNewAlert }: AlertsListProps) {
  const renderAlert = (alert: Alert) => {
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
          selectedAlert?.id === alert.id && 'ring-2 ring-primary'
        )}
        onClick={() => onSelectAlert(alert)}
      >
        <CardHeader className="p-4 flex-row items-start justify-between">
          <CardTitle className="text-base font-semibold">{alert.eventType}</CardTitle>
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

  const drafts = alerts.filter(a => a.status === 'draft');
  const active = alerts.filter(a => a.status === 'active');
  const expired = alerts.filter(a => a.status === 'expired');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Alerts</CardTitle>
        <Button size="sm" onClick={onNewAlert}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Alert
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="drafts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto p-1">
             <TabsContent value="drafts">
              {drafts.length > 0 ? drafts.map(renderAlert) : <p className="text-center text-sm text-muted-foreground py-4">No draft alerts.</p>}
            </TabsContent>
            <TabsContent value="active">
              {active.length > 0 ? active.map(renderAlert) : <p className="text-center text-sm text-muted-foreground py-4">No active alerts.</p>}
            </TabsContent>
            <TabsContent value="expired">
              {expired.length > 0 ? expired.map(renderAlert) : <p className="text-center text-sm text-muted-foreground py-4">No expired alerts.</p>}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
