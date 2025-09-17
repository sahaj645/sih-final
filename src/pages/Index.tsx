import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import AlertBanner from '@/components/dashboard/AlertBanner';
import VillageNetwork from '@/components/dashboard/VillageNetwork';
import SensorPanel from '@/components/dashboard/SensorPanel';
import ChartSection from '@/components/dashboard/ChartSection';
import ControlPanel from '@/components/dashboard/ControlPanel';
import DiseaseRiskPanel from '@/components/dashboard/DiseaseRiskPanel';
import { useWaterMonitoring } from '@/hooks/useWaterMonitoring';
import { useVoiceAlerts } from '@/hooks/useVoiceAlerts';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    villages,
    alerts,
    session,
    systemHealth,
    chartData,
    activeScenario,
    startMonitoring,
    stopMonitoring,
    runScenario,
    acknowledgeAlert,
    clearAlerts,
    isMonitoring,
  } = useWaterMonitoring();

  const {
    settings: voiceSettings,
    updateSettings: updateVoiceSettings,
    speakAlert,
    testVoice,
  } = useVoiceAlerts();

  const { toast } = useToast();
  
  const [selectedVillageId, setSelectedVillageId] = useState<string>(villages[0]?.id || '');

  const selectedVillage = villages.find(v => v.id === selectedVillageId) || villages[0];

  useEffect(() => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
    if (unacknowledgedAlerts.length > 0 && voiceSettings.enabled) {
      const latestAlert = unacknowledgedAlerts[unacknowledgedAlerts.length - 1];
      speakAlert(latestAlert);
    }
  }, [alerts, voiceSettings.enabled, speakAlert]);

  useEffect(() => {
    if (activeScenario) {
      toast({
        title: "Demo Scenario Active",
        description: `Running "${activeScenario.name}" scenario`,
        duration: 3000,
      });
    }
  }, [activeScenario, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6">
          <Header systemHealth={systemHealth} />
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {alerts.length > 0 && (
          <div className="mb-6">
            <AlertBanner 
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
              onClearAll={clearAlerts}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6 h-fit">
              <VillageNetwork villages={villages} />
            </div>

            <div className="glass-card p-6 h-fit">
              <ControlPanel
                isMonitoring={isMonitoring}
                onStartMonitoring={startMonitoring}
                onStopMonitoring={stopMonitoring}
                onRunScenario={runScenario}
                voiceSettings={voiceSettings}
                onVoiceSettingsChange={updateVoiceSettings}
                onTestVoice={testVoice}
                activeScenario={activeScenario?.name}
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Selected Village for Detailed Analysis:
                </h3>
                <select
                  value={selectedVillageId}
                  onChange={(e) => setSelectedVillageId(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background/50 
                           text-foreground backdrop-blur-sm min-w-[200px] focus:ring-2 
                           focus:ring-primary focus:border-transparent transition-all"
                >
                  {villages.map(village => (
                    <option key={village.id} value={village.id}>
                      {village.name} - {village.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold gradient-text">Live Sensor Data</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Live</span>
                </div>
              </div>
              
              <SensorPanel village={selectedVillage} />
            </div>

            <div className="glass-card p-6">
              <ChartSection 
                chartData={chartData}
                isLive={isMonitoring}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6 h-fit">
              <DiseaseRiskPanel 
                diseaseRisks={selectedVillage.diseaseRisks}
                villageName={selectedVillage.name}
              />
            </div>

            <div className="glass-card p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Villages</span>
                  <span className="font-semibold text-green-600">
                    {villages.filter(v => v.status === 'Safe').length}/{villages.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Alerts</span>
                  <span className={`font-semibold ${alerts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {alerts.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">System Status</span>
                  <span className="font-semibold text-green-600">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-border/50 text-center">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              AquaGuard AI - Smart Water Quality Monitoring Dashboard
            </p>
            <p>
              Built for Smart India Hackathon 2024 • Real-time monitoring for healthier communities
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;