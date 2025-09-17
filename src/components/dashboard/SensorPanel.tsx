import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap, 
  TestTube, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye
} from 'lucide-react';
import { Village, TrendData } from '@/types';
import { StatusBadge } from '@/components/dashboard/ui/status-badge';
import { cn } from '@/lib/utils';

interface SensorPanelProps {
  village: Village;
}

const SensorPanel: React.FC<SensorPanelProps> = ({ village }) => {
  const { sensorData, waterQuality } = village;

  // Calculate trends (mock data for demo)
  const trends: TrendData[] = [
    {
      parameter: 'pH',
      current: sensorData.pH,
      previous: 7.0,
      trend: sensorData.pH > 7.0 ? 'up' : sensorData.pH < 7.0 ? 'down' : 'stable',
      change: Math.abs(((sensorData.pH - 7.0) / 7.0) * 100),
      isPositive: sensorData.pH >= 6.5 && sensorData.pH <= 8.5,
    },
    {
      parameter: 'Turbidity',
      current: sensorData.turbidity,
      previous: 4.0,
      trend: sensorData.turbidity > 4.0 ? 'up' : sensorData.turbidity < 4.0 ? 'down' : 'stable',
      change: Math.abs(((sensorData.turbidity - 4.0) / 4.0) * 100),
      isPositive: sensorData.turbidity < 5.0,
    },
    {
      parameter: 'Temperature',
      current: sensorData.temperature,
      previous: 25.0,
      trend: sensorData.temperature > 25.0 ? 'up' : sensorData.temperature < 25.0 ? 'down' : 'stable',
      change: Math.abs(((sensorData.temperature - 25.0) / 25.0) * 100),
      isPositive: sensorData.temperature >= 20 && sensorData.temperature <= 30,
    },
  ];

  const sensorItems = [
    {
      label: 'pH Level',
      value: sensorData.pH.toFixed(1),
      unit: '',
      icon: TestTube,
      status: sensorData.pH >= 6.5 && sensorData.pH <= 8.5 ? 'safe' : 'warning',
      description: 'Acidity/Alkalinity',
      range: '6.5 - 8.5',
      trend: trends.find(t => t.parameter === 'pH'),
    },
    {
      label: 'Turbidity',
      value: sensorData.turbidity.toFixed(1),
      unit: 'NTU',
      icon: Eye,
      status: sensorData.turbidity < 5 ? 'safe' : sensorData.turbidity < 10 ? 'caution' : 'warning',
      description: 'Water Clarity',
      range: '< 5.0 NTU',
      trend: trends.find(t => t.parameter === 'Turbidity'),
    },
    {
      label: 'Temperature',
      value: sensorData.temperature.toFixed(1),
      unit: '°C',
      icon: Thermometer,
      status: sensorData.temperature >= 20 && sensorData.temperature <= 30 ? 'safe' : 'caution',
      description: 'Water Temperature',
      range: '20 - 30°C',
      trend: trends.find(t => t.parameter === 'Temperature'),
    },
    {
      label: 'Conductivity',
      value: sensorData.conductivity.toFixed(0),
      unit: 'μS/cm',
      icon: Zap,
      status: sensorData.conductivity < 500 ? 'safe' : sensorData.conductivity < 800 ? 'caution' : 'warning',
      description: 'Electrical Conductivity',
      range: '< 500 μS/cm',
    },
    {
      label: 'E.coli Count',
      value: sensorData.eColi.toFixed(0),
      unit: 'CFU/100ml',
      icon: Activity,
      status: sensorData.eColi === 0 ? 'safe' : sensorData.eColi < 5 ? 'caution' : 'critical',
      description: 'Bacterial Contamination',
      range: '0 CFU/100ml',
    },
    {
      label: 'Dissolved Oxygen',
      value: sensorData.dissolvedOxygen.toFixed(1),
      unit: 'mg/L',
      icon: Droplets,
      status: sensorData.dissolvedOxygen > 6 ? 'safe' : sensorData.dissolvedOxygen > 4 ? 'caution' : 'warning',
      description: 'Oxygen Content',
      range: '> 6.0 mg/L',
    },
  ];

  const getTrendIcon = (trend?: TrendData) => {
    if (!trend) return <Minus className="h-3 w-3 text-muted-foreground" />;
    
    const iconClass = cn(
      "h-3 w-3",
      trend.isPositive ? "text-success" : "text-destructive"
    );

    switch (trend.trend) {
      case 'up':
        return <TrendingUp className={iconClass} />;
      case 'down':
        return <TrendingDown className={iconClass} />;
      default:
        return <Minus className={iconClass} />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'safe':
        return 'safe';
      case 'caution':
        return 'caution';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'critical';
      default:
        return 'safe';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Live Sensor Data
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time water quality measurements from {village.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="pulse-live w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {sensorItems.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300 hover:shadow-md animate-slide-up",
              item.status === 'safe' ? "border-success/30 bg-success/5" :
              item.status === 'caution' ? "border-warning/30 bg-warning/5" :
              item.status === 'warning' ? "border-warning/30 bg-warning/5" :
              "border-destructive/30 bg-destructive/5"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <item.icon className={cn(
                  "h-5 w-5",
                  item.status === 'safe' ? "text-success" :
                  item.status === 'caution' ? "text-warning" :
                  item.status === 'warning' ? "text-warning" :
                  "text-destructive"
                )} />
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <StatusBadge 
                variant={getStatusVariant(item.status)}
                size="sm"
                pulse={item.status === 'critical'}
              >
                {item.status.toUpperCase()}
              </StatusBadge>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {item.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.unit}
                </span>
              </div>

              {item.trend && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span className={cn(
                      "text-xs font-medium",
                      item.trend.isPositive ? "text-success" : "text-destructive"
                    )}>
                      {item.trend.change.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    vs prev
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Target: {item.range}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Water Quality Score */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Overall Water Quality Score
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-calculated composite quality rating
            </p>
          </div>
          <StatusBadge 
            variant={getStatusVariant(waterQuality.riskLevel.toLowerCase())}
            size="lg"
            pulse={waterQuality.riskLevel === 'Critical'}
          >
            {waterQuality.grade}
          </StatusBadge>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold gradient-text">
            {waterQuality.overall}%
          </div>
          <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all duration-500",
                  waterQuality.overall >= 80 ? "bg-gradient-to-r from-success to-success-glow" :
                  waterQuality.overall >= 60 ? "bg-gradient-to-r from-warning to-warning-glow" :
                  "bg-gradient-to-r from-destructive to-destructive-glow"
                )}
                style={{ width: `${waterQuality.overall}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorPanel;