'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { forecastProviders } from '@/lib/data';

export function LayerControls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layer Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <h4 className="font-medium text-sm mb-2">User Data</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox id="user-locations" defaultChecked />
                    <Label htmlFor="user-locations">Show User Locations</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="user-thresholds" defaultChecked />
                    <Label htmlFor="user-thresholds">Show User Thresholds</Label>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-sm mb-2">Forecast Providers</h4>
                {forecastProviders.map(provider => (
                    <div key={provider.id} className="flex items-center space-x-2">
                        <Checkbox id={`provider-${provider.id}`} defaultChecked />
                        <Label htmlFor={`provider-${provider.id}`}>{provider.name}</Label>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <h4 className="font-medium text-sm mb-2">Infrastructure</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox id="fsp-branches" />
                    <Label htmlFor="fsp-branches">FSP Branches</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="fsp-agents" />
                    <Label htmlFor="fsp-agents">FSP Agents</Label>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
