import React from 'react';
import { Wifi, WifiOff, Battery, MapPin, Users, Droplets } from 'lucide-react';
import { Village } from '@/types';
import { StatusBadge } from '@/components/dashboard/ui/status-badge';
import { cn } from '@/lib/utils';

interface VillageNetworkProps {
  villages: Village[];
}

const VillageNetwork: React.FC<VillageNetworkProps> = ({ villages }) => {
  const getStatusColor = (status: Village['status']) => {
    switch (status) {
      case 'Safe':
        return 'text-success';
      case 'Caution':
        return 'text-warning';
      case 'Warning':
        return 'text-warning';
      case 'Critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusVariant = (status: Village['status']) => {
    switch (status) {
      case 'Safe':
        return 'safe';
      case 'Caution':
        return 'caution';
      case 'Warning':
        return 'warning';
      case 'Critical':
        return 'critical';
      default:
        return 'safe';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-success';
    if (level > 30) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Village Network
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring status across all villages
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {villages.map((village, index) => (
          <div
            key={village.id}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg village-card-fade",
              village.status === 'Safe' ? "border-success/30 bg-success/5 hover:border-success/50" :
              village.status === 'Caution' ? "border-warning/30 bg-warning/5 hover:border-warning/50" :
              village.status === 'Warning' ? "border-warning/30 bg-warning/5 hover:border-warning/50" :
              "border-destructive/30 bg-destructive/5 hover:border-destructive/50"
            )}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Village Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className={cn("h-5 w-5", getStatusColor(village.status))} />
                <h3 className="font-semibold text-foreground text-base">{village.name}</h3>
              </div>
              <StatusBadge 
                variant={getStatusVariant(village.status)}
                pulse={village.status === 'Critical'}
              >
                {village.status}
              </StatusBadge>
            </div>

            {/* Key Metrics - Simplified */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Water Quality</span>
                <span className={cn("font-medium text-base", getStatusColor(village.status))}>
                  {village.waterQuality.overall}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">pH Level</span>
                    <span className="font-medium text-foreground">
                      {village.sensorData.pH.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Turbidity</span>
                    <span className="font-medium text-foreground">
                      {village.sensorData.turbidity.toFixed(1)} NTU
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium text-foreground">
                      {village.sensorData.temperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Population</span>
                    <span className="font-medium text-foreground">
                      {village.population.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-muted-foreground">E.coli Count</span>
                <span className={cn(
                  "font-medium",
                  village.sensorData.eColi > 5 ? "text-destructive" : "text-success"
                )}>
                  {village.sensorData.eColi.toFixed(0)} CFU
                </span>
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-4">
                {/* Connectivity */}
                <div className="flex items-center gap-1">
                  {village.loraWanConnected ? (
                    <Wifi className="h-4 w-4 text-success" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {village.loraWanConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>

                {/* Battery */}
                <div className="flex items-center gap-1">
                  <Battery className={cn("h-4 w-4", getBatteryColor(village.batteryLevel))} />
                  <span className="text-xs text-muted-foreground">
                    {village.batteryLevel}%
                  </span>
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-muted-foreground">
                {village.lastUpdate.toLocaleTimeString()}
              </div>
            </div>

            {/* High Risk Indicator */}
            {village.diseaseRisks.some(risk => risk.riskLevel === 'High' || risk.riskLevel === 'Critical') && (
              <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-medium text-destructive">
                    High Disease Risk Detected
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Network Summary */}
      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-success">
              {villages.filter(v => v.status === 'Safe').length}
            </div>
            <div className="text-xs text-muted-foreground">Safe</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {villages.filter(v => v.status === 'Caution' || v.status === 'Warning').length}
            </div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-destructive">
              {villages.filter(v => v.status === 'Critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {villages.filter(v => v.loraWanConnected).length}/{villages.length}
            </div>
            <div className="text-xs text-muted-foreground">Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageNetwork;