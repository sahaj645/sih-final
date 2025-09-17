import { useState, useCallback, useRef, useEffect } from 'react';
import { Village, Alert, MonitoringSession, SystemHealth, ChartDataPoint, ScenarioData } from '@/types';
import { initialVillages, calculateWaterQuality, calculateDiseaseRisks, generateSensorData } from '@/data/villages';
import { demoScenarios } from '@/data/scenarios';

export const useWaterMonitoring = () => {
  const [villages, setVillages] = useState<Village[]>(initialVillages);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overallStatus: 'Online',
    connectedVillages: 4,
    totalVillages: 4,
    lastDataUpdate: new Date(),
    systemUptime: 0,
    networkLatency: 45,
    dataLossPercentage: 0.2,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeScenario, setActiveScenario] = useState<ScenarioData | null>(null);

  const intervalRef = useRef<NodeJS.Timeout>();
  const scenarioTimeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<Date>();

  // Generate realistic sensor variations
  const generateRealisticVariation = (baseValue: number, maxVariation: number = 0.1): number => {
    const variation = (Math.random() - 0.5) * 2 * maxVariation;
    return Math.max(0, baseValue * (1 + variation));
  };

  // Create alert from anomaly
  const createAlert = useCallback((villageId: string, type: Alert['type'], severity: Alert['severity'], title: string, message: string): Alert => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      title,
      message,
      villageId,
      timestamp: new Date(),
      acknowledged: false,
    };
  }, []);

  // Check for anomalies and create alerts
  const checkForAnomalies = useCallback((village: Village): Alert[] => {
    const newAlerts: Alert[] = [];
    const { sensorData, waterQuality } = village;

    // Critical contamination
    if (sensorData.eColi > 20) {
      newAlerts.push(createAlert(
        village.id,
        'contamination',
        'critical',
        'Critical Bacterial Contamination',
        `E.coli levels at ${sensorData.eColi} CFU/100ml in ${village.name}. Immediate action required.`
      ));
    }

    // Chemical contamination
    if (sensorData.pH < 6.0 || sensorData.pH > 9.0) {
      newAlerts.push(createAlert(
        village.id,
        'contamination',
        'high',
        'Chemical Contamination Detected',
        `pH levels abnormal (${sensorData.pH.toFixed(1)}) in ${village.name}.`
      ));
    }

    // High turbidity
    if (sensorData.turbidity > 15) {
      newAlerts.push(createAlert(
        village.id,
        'contamination',
        'medium',
        'High Turbidity Alert',
        `Water turbidity at ${sensorData.turbidity.toFixed(1)} NTU in ${village.name}.`
      ));
    }

    // Overall water quality critical
    if (waterQuality.overall < 40) {
      newAlerts.push(createAlert(
        village.id,
        'emergency',
        'critical',
        'Water Quality Emergency',
        `Water quality score critically low (${waterQuality.overall}%) in ${village.name}.`
      ));
    }

    // System alerts
    if (!village.loraWanConnected) {
      newAlerts.push(createAlert(
        village.id,
        'system',
        'high',
        'Connectivity Lost',
        `LoRaWAN connection lost for ${village.name}.`
      ));
    }

    if (village.batteryLevel < 20) {
      newAlerts.push(createAlert(
        village.id,
        'maintenance',
        'medium',
        'Low Battery Warning',
        `Sensor battery at ${village.batteryLevel}% in ${village.name}.`
      ));
    }

    return newAlerts;
  }, [createAlert]);

  // Update sensor data for all villages
  const updateSensorData = useCallback(() => {
    setVillages(prevVillages => {
      const newVillages = prevVillages.map(village => {
        let newSensorData = { ...village.sensorData };

        // Apply scenario modifications if active
        if (activeScenario) {
          Object.entries(activeScenario.sensorModifications).forEach(([key, value]) => {
            if (value !== undefined) {
              (newSensorData as any)[key] = value;
            }
          });
        } else {
          // Normal variations
          newSensorData = {
            ...newSensorData,
            timestamp: new Date(),
            pH: generateRealisticVariation(newSensorData.pH, 0.02),
            turbidity: generateRealisticVariation(newSensorData.turbidity, 0.05),
            temperature: generateRealisticVariation(newSensorData.temperature, 0.03),
            conductivity: generateRealisticVariation(newSensorData.conductivity, 0.04),
            eColi: Math.max(0, newSensorData.eColi + (Math.random() - 0.5) * 2),
            dissolvedOxygen: generateRealisticVariation(newSensorData.dissolvedOxygen, 0.02),
            totalDissolvedSolids: generateRealisticVariation(newSensorData.totalDissolvedSolids, 0.03),
          };
        }

        const waterQuality = calculateWaterQuality(newSensorData);
        const diseaseRisks = calculateDiseaseRisks(waterQuality, newSensorData);

        // Determine status based on water quality
        let status: Village['status'];
        if (waterQuality.overall >= 80) status = 'Safe';
        else if (waterQuality.overall >= 60) status = 'Caution';
        else if (waterQuality.overall >= 40) status = 'Warning';
        else status = 'Critical';

        const updatedVillage = {
          ...village,
          sensorData: newSensorData,
          waterQuality,
          diseaseRisks,
          status,
          lastUpdate: new Date(),
        };

        // Check for new alerts
        const newAlerts = checkForAnomalies(updatedVillage);
        if (newAlerts.length > 0) {
          setAlerts(prev => [...prev, ...newAlerts]);
        }

        return updatedVillage;
      });

      // Update chart data
      const latestData: ChartDataPoint = {
        timestamp: new Date().toLocaleTimeString(),
        pH: newVillages[0].sensorData.pH,
        turbidity: newVillages[0].sensorData.turbidity,
        temperature: newVillages[0].sensorData.temperature,
        conductivity: newVillages[0].sensorData.conductivity,
        eColi: newVillages[0].sensorData.eColi,
        overallScore: newVillages[0].waterQuality.overall,
      };

      setChartData(prev => {
        const newData = [...prev, latestData];
        return newData.slice(-20); // Keep last 20 data points
      });

      return newVillages;
    });

    // Update system health
    setSystemHealth(prev => ({
      ...prev,
      lastDataUpdate: new Date(),
      systemUptime: startTimeRef.current ? Date.now() - startTimeRef.current.getTime() : 0,
      networkLatency: 40 + Math.random() * 20,
      dataLossPercentage: Math.random() * 0.5,
    }));
  }, [activeScenario, checkForAnomalies]);

  // Start monitoring session
  const startMonitoring = useCallback(() => {
    if (session?.isActive) return;

    const newSession: MonitoringSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      isActive: true,
      dataInterval: 2000, // 2 seconds
      alertsCount: 0,
      samplesCollected: 0,
    };

    setSession(newSession);
    startTimeRef.current = new Date();

    // Start data collection interval
    intervalRef.current = setInterval(updateSensorData, newSession.dataInterval);
  }, [session, updateSensorData]);

  // Stop monitoring session
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    if (scenarioTimeoutRef.current) {
      clearTimeout(scenarioTimeoutRef.current);
      scenarioTimeoutRef.current = undefined;
    }

    setSession(prev => prev ? { ...prev, isActive: false, endTime: new Date() } : null);
    setActiveScenario(null);
  }, []);

  // Run demo scenario
  const runScenario = useCallback((scenarioName: string) => {
    const scenario = demoScenarios.find(s => s.name === scenarioName);
    if (!scenario) return;

    setActiveScenario(scenario);

    // Auto-stop scenario after duration
    if (scenarioTimeoutRef.current) {
      clearTimeout(scenarioTimeoutRef.current);
    }

    scenarioTimeoutRef.current = setTimeout(() => {
      setActiveScenario(null);
    }, scenario.duration * 1000);
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (scenarioTimeoutRef.current) clearTimeout(scenarioTimeoutRef.current);
    };
  }, []);

  return {
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
    isMonitoring: session?.isActive || false,
  };
};