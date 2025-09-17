import React from 'react';
import { AlertTriangle, X, Bell, AlertCircle, Zap } from 'lucide-react';
import { Alert } from '@/types';
import { Button } from '@/components/dashboard/ui/button';
import { StatusBadge } from '@/components/dashboard/ui/status-badge';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onClearAll: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ 
  alerts, 
  onAcknowledge, 
  onClearAll 
}) => {
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = unacknowledgedAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = unacknowledgedAlerts.filter(alert => alert.severity === 'high');

  if (unacknowledgedAlerts.length === 0) return null;

  const getAlertIcon = (type: Alert['type'], severity: Alert['severity']) => {
    const iconClass = cn(
      "h-5 w-5",
      severity === 'critical' ? "text-destructive animate-pulse" :
      severity === 'high' ? "text-warning" :
      "text-primary"
    );

    switch (type) {
      case 'emergency':
        return <Zap className={iconClass} />;
      case 'contamination':
        return <AlertTriangle className={iconClass} />;
      case 'system':
        return <Bell className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  const getSeverityVariant = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'warning';
      case 'medium':
        return 'caution';
      default:
        return 'safe';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Summary Banner */}
      {(criticalAlerts.length > 0 || highAlerts.length > 0) && (
        <div className={cn(
          "glass-card p-4 border-l-4 animate-slide-down",
          criticalAlerts.length > 0 ? "border-l-destructive bg-destructive/5" : "border-l-warning bg-warning/5"
        )}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {criticalAlerts.length > 0 ? (
                  <Zap className="h-6 w-6 text-destructive animate-pulse" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-warning" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {criticalAlerts.length > 0 ? 'Critical Alerts' : 'Active Warnings'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {criticalAlerts.length > 0 && `${criticalAlerts.length} critical, `}
                    {highAlerts.length > 0 && `${highAlerts.length} high priority`}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearAll}
              className="self-start sm:self-center"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Individual Alerts */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {unacknowledgedAlerts.slice(0, 5).map((alert, index) => (
          <div
            key={alert.id}
            className={cn(
              "glass-card p-3 border-l-4 animate-slide-up",
              alert.severity === 'critical' ? "border-l-destructive" :
              alert.severity === 'high' ? "border-l-warning" :
              alert.severity === 'medium' ? "border-l-warning" :
              "border-l-primary"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getAlertIcon(alert.type, alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground text-sm">
                      {alert.title}
                    </h4>
                    <StatusBadge 
                      variant={getSeverityVariant(alert.severity)}
                      size="sm"
                      pulse={alert.severity === 'critical'}
                    >
                      {alert.severity.toUpperCase()}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                    <span className="capitalize">Village: {alert.villageId}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAcknowledge(alert.id)}
                className="flex-shrink-0 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {unacknowledgedAlerts.length > 5 && (
          <div className="text-center p-2">
            <p className="text-sm text-muted-foreground">
              + {unacknowledgedAlerts.length - 5} more alerts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;