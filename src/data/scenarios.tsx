import { ScenarioData } from '@/types';

export const demoScenarios: ScenarioData[] = [
  {
    name: 'Contamination Alert',
    description: 'Simulates bacterial contamination with high E.coli levels',
    duration: 30,
    sensorModifications: {
      eColi: 25,
      turbidity: 15.2,
      pH: 6.1,
      conductivity: 600,
    },
    alertsTriggered: [
      'High bacterial contamination detected',
      'E.coli levels exceed safe limits',
      'Immediate water treatment required',
    ],
    severity: 'critical',
  },
  {
    name: 'Chemical Pollution',
    description: 'Simulates industrial chemical contamination',
    duration: 25,
    sensorModifications: {
      pH: 4.8,
      conductivity: 850,
      totalDissolvedSolids: 450,
      turbidity: 8.5,
    },
    alertsTriggered: [
      'Chemical contamination detected',
      'pH levels critically low',
      'High conductivity indicates pollution',
    ],
    severity: 'high',
  },
  {
    name: 'Emergency Outbreak',
    description: 'Simulates severe waterborne disease outbreak conditions',
    duration: 45,
    sensorModifications: {
      eColi: 50,
      pH: 5.9,
      turbidity: 25.0,
      temperature: 32.0,
      conductivity: 750,
    },
    alertsTriggered: [
      'EMERGENCY: Severe contamination detected',
      'Immediate evacuation recommended',
      'Multiple contamination parameters exceeded',
      'Health authorities notified',
    ],
    severity: 'critical',
  },
  {
    name: 'Temperature Anomaly',
    description: 'Simulates unusual temperature variations',
    duration: 20,
    sensorModifications: {
      temperature: 35.5,
      dissolvedOxygen: 4.2,
      pH: 8.9,
    },
    alertsTriggered: [
      'Temperature anomaly detected',
      'Low dissolved oxygen levels',
      'Potential thermal pollution',
    ],
    severity: 'medium',
  },
  {
    name: 'Normal Operations',
    description: 'Returns all parameters to normal, safe levels',
    duration: 15,
    sensorModifications: {
      pH: 7.2,
      turbidity: 3.5,
      temperature: 24.5,
      conductivity: 200,
      eColi: 0,
      dissolvedOxygen: 8.5,
      totalDissolvedSolids: 150,
    },
    alertsTriggered: [
      'System parameters normalized',
      'Water quality restored to safe levels',
    ],
    severity: 'low',
  },
];

export const getRandomScenario = (): ScenarioData => {
  return demoScenarios[Math.floor(Math.random() * demoScenarios.length)];
};

export const getScenarioByName = (name: string): ScenarioData | undefined => {
  return demoScenarios.find(scenario => scenario.name === name);
};