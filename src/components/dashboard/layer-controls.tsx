'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function LayerControls() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Map Layers</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="user-locations" />
          <Label htmlFor="user-locations">User Locations</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="infrastructure" />
          <Label htmlFor="infrastructure">Infrastructure</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="vulnerability" defaultChecked />
          <Label htmlFor="vulnerability">Vulnerability Map</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="active-alerts" defaultChecked />
          <Label htmlFor="active-alerts">Active Alerts</Label>
        </div>
      </div>
    </div>
  );
}
