// AquaGuard AI - Type Definitions

export interface SensorReading {
  id: string;
  timestamp: Date;
  pH: number;
  turbidity: number;
  temperature: number;
  conductivity: number;
  eColi: number;
  dissolvedOxygen: number;
  totalDissolvedSolids: number;
}

export interface WaterQualityScore {
  overall: number; // 0-100
  pH: number;
  turbidity: number;
  temperature: number;
  conductivity: number;
  biological: number;
  chemical: number;
  grade: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  riskLevel: 'Safe' | 'Caution' | 'Warning' | 'Critical';
}

export interface DiseaseRisk {
  disease: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: number; // 0-100
  symptoms: string[];
  prevention: string[];
}

export interface Village {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  status: 'Safe' | 'Caution' | 'Warning' | 'Critical';
  lastUpdate: Date;
  sensorData: SensorReading;
  waterQuality: WaterQualityScore;
  diseaseRisks: DiseaseRisk[];
  loraWanConnected: boolean;
  batteryLevel: number;
}

export interface Alert {
  id: string;
  type: 'contamination' | 'emergency' | 'maintenance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  villageId: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface VoiceSettings {
  enabled: boolean;
  language: Language;
  rate: number; // 0.1 - 10
  pitch: number; // 0 - 2
  volume: number; // 0 - 1
  useElevenLabs: boolean;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
}

export interface MonitoringSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  dataInterval: number; // milliseconds
  alertsCount: number;
  samplesCollected: number;
}

export interface SystemHealth {
  overallStatus: 'Online' | 'Degraded' | 'Offline';
  connectedVillages: number;
  totalVillages: number;
  lastDataUpdate: Date;
  systemUptime: number; // milliseconds
  networkLatency: number; // ms
  dataLossPercentage: number;
}

export interface TrendData {
  parameter: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage
  isPositive: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  pH: number;
  turbidity: number;
  temperature: number;
  conductivity: number;
  eColi: number;
  overallScore: number;
}

export interface ScenarioData {
  name: string;
  description: string;
  duration: number; // seconds
  sensorModifications: Partial<SensorReading>;
  alertsTriggered: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type Language = 'en' | 'hi' | 'bn' | 'as' | 'mni' | 'grt' | 'lus' | 'kha' | 'nag' | 'kok' | 'sat' | 'bod';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
  voice?: string;
  elevenLabsVoiceId?: string;
}