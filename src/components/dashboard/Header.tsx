import React from 'react';
import { Droplets, Wifi, Battery, Globe } from 'lucide-react';
import { SystemHealth } from '@/types';
import { StatusBadge } from '@/components/dashboard/ui/status-badge';

interface HeaderProps {
  systemHealth: SystemHealth;
}

const Header: React.FC<HeaderProps> = ({ systemHealth }) => {
  const formatUptime = (uptime: number): string => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <header className="glass-card border-b border-white/20 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Droplets className="h-8 w-8 text-primary animate-bounce-gentle" />
            <div className="absolute inset-0 animate-pulse-glow">
              <Droplets className="h-8 w-8 text-primary-glow opacity-50" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
              AquaGuard AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Smart Water Quality Monitoring Dashboard
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Overall Status */}
          <div className="flex items-center gap-2">
            <StatusBadge 
              variant={systemHealth.overallStatus === 'Online' ? 'safe' : 'critical'}
              pulse={systemHealth.overallStatus !== 'Online'}
            >
              <Globe className="h-3 w-3 mr-1" />
              {systemHealth.overallStatus}
            </StatusBadge>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {systemHealth.networkLatency}ms
            </span>
          </div>

          {/* Connected Villages */}
          <div className="flex items-center gap-2 text-sm">
            <Battery className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {systemHealth.connectedVillages}/{systemHealth.totalVillages} Villages
            </span>
          </div>

          {/* Uptime */}
          <div className="text-sm text-muted-foreground">
            Uptime: {formatUptime(systemHealth.systemUptime)}
          </div>

          {/* Last Update */}
          <div className="text-sm text-muted-foreground">
            Updated: {systemHealth.lastDataUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;