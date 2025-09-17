import { Village, SensorReading, WaterQualityScore, DiseaseRisk } from '@/types';

// Generate realistic sensor data for villages
const generateSensorData = (baseValues: Partial<SensorReading>): SensorReading => ({
  id: Math.random().toString(36).substr(2, 9),
  timestamp: new Date(),
  pH: 7.2,
  turbidity: 5.0,
  temperature: 25.0,
  conductivity: 250,
  eColi: 0,
  dissolvedOxygen: 8.5,
  totalDissolvedSolids: 150,
  ...baseValues,
});

// Calculate water quality score based on sensor readings
const calculateWaterQuality = (sensor: SensorReading): WaterQualityScore => {
  const pHScore = sensor.pH >= 6.5 && sensor.pH <= 8.5 ? 100 : Math.max(0, 100 - Math.abs(sensor.pH - 7) * 20);
  const turbidityScore = Math.max(0, 100 - sensor.turbidity * 10);
  const tempScore = sensor.temperature >= 20 && sensor.temperature <= 30 ? 100 : Math.max(0, 100 - Math.abs(sensor.temperature - 25) * 5);
  const conductivityScore = sensor.conductivity <= 500 ? 100 : Math.max(0, 100 - (sensor.conductivity - 500) / 10);
  const biologicalScore = sensor.eColi === 0 ? 100 : Math.max(0, 100 - sensor.eColi * 5);
  const chemicalScore = (pHScore + conductivityScore) / 2;

  const overall = Math.round((pHScore + turbidityScore + tempScore + conductivityScore + biologicalScore) / 5);

  let grade: WaterQualityScore['grade'];
  let riskLevel: WaterQualityScore['riskLevel'];

  if (overall >= 90) {
    grade = 'Excellent';
    riskLevel = 'Safe';
  } else if (overall >= 75) {
    grade = 'Good';
    riskLevel = 'Safe';
  } else if (overall >= 60) {
    grade = 'Fair';
    riskLevel = 'Caution';
  } else if (overall >= 40) {
    grade = 'Poor';
    riskLevel = 'Warning';
  } else {
    grade = 'Critical';
    riskLevel = 'Critical';
  }

  return {
    overall,
    pH: Math.round(pHScore),
    turbidity: Math.round(turbidityScore),
    temperature: Math.round(tempScore),
    conductivity: Math.round(conductivityScore),
    biological: Math.round(biologicalScore),
    chemical: Math.round(chemicalScore),
    grade,
    riskLevel,
  };
};

// Calculate disease risks based on water quality
const calculateDiseaseRisks = (waterQuality: WaterQualityScore, sensor: SensorReading): DiseaseRisk[] => {
  const risks: DiseaseRisk[] = [];

  // Cholera risk based on E.coli and overall quality
  const choleraRisk = sensor.eColi > 10 || waterQuality.overall < 60 ? 'High' : 
                     sensor.eColi > 5 || waterQuality.overall < 75 ? 'Medium' : 'Low';
  risks.push({
    disease: 'Cholera',
    riskLevel: choleraRisk,
    probability: choleraRisk === 'High' ? 75 : choleraRisk === 'Medium' ? 35 : 10,
    symptoms: ['Severe diarrhea', 'Vomiting', 'Dehydration', 'Muscle cramps'],
    prevention: ['Boil water before drinking', 'Use water purification tablets', 'Maintain hygiene'],
  });

  // Typhoid risk
  const typhoidRisk = sensor.eColi > 15 || waterQuality.biological < 50 ? 'High' :
                     sensor.eColi > 8 || waterQuality.biological < 70 ? 'Medium' : 'Low';
  risks.push({
    disease: 'Typhoid',
    riskLevel: typhoidRisk,
    probability: typhoidRisk === 'High' ? 65 : typhoidRisk === 'Medium' ? 25 : 5,
    symptoms: ['High fever', 'Headache', 'Stomach pain', 'Weakness'],
    prevention: ['Drink safe water', 'Wash hands frequently', 'Avoid raw vegetables'],
  });

  // Diarrheal diseases
  const diarrheaRisk = waterQuality.overall < 70 ? 'Medium' : 'Low';
  risks.push({
    disease: 'Diarrheal Diseases',
    riskLevel: diarrheaRisk,
    probability: diarrheaRisk === 'Medium' ? 40 : 15,
    symptoms: ['Loose stools', 'Stomach cramps', 'Nausea', 'Dehydration'],
    prevention: ['Use clean water', 'Practice good sanitation', 'Cook food thoroughly'],
  });

  return risks;
};

// Initial village data
export const initialVillages: Village[] = [
  {
    id: 'majuli',
    name: 'Majuli',
    coordinates: { lat: 26.9504, lng: 94.2152 },
    population: 15000,
    status: 'Safe',
    lastUpdate: new Date(),
    sensorData: generateSensorData({ pH: 7.4, turbidity: 3.2, temperature: 24.5, conductivity: 180, eColi: 0 }),
    waterQuality: {} as WaterQualityScore,
    diseaseRisks: [],
    loraWanConnected: true,
    batteryLevel: 95,
  },
  {
    id: 'dhemaji',
    name: 'Dhemaji',
    coordinates: { lat: 27.4728, lng: 94.5526 },
    population: 12000,
    status: 'Caution',
    lastUpdate: new Date(),
    sensorData: generateSensorData({ pH: 6.8, turbidity: 8.5, temperature: 26.2, conductivity: 320, eColi: 3 }),
    waterQuality: {} as WaterQualityScore,
    diseaseRisks: [],
    loraWanConnected: true,
    batteryLevel: 78,
  },
  {
    id: 'lakhimpur',
    name: 'Lakhimpur',
    coordinates: { lat: 27.2309, lng: 94.1009 },
    population: 18000,
    status: 'Safe',
    lastUpdate: new Date(),
    sensorData: generateSensorData({ pH: 7.6, turbidity: 4.1, temperature: 23.8, conductivity: 165, eColi: 1 }),
    waterQuality: {} as WaterQualityScore,
    diseaseRisks: [],
    loraWanConnected: true,
    batteryLevel: 89,
  },
  {
    id: 'tezpur',
    name: 'Tezpur',
    coordinates: { lat: 26.6335, lng: 92.7985 },
    population: 22000,
    status: 'Warning',
    lastUpdate: new Date(),
    sensorData: generateSensorData({ pH: 6.3, turbidity: 12.8, temperature: 28.1, conductivity: 450, eColi: 8 }),
    waterQuality: {} as WaterQualityScore,
    diseaseRisks: [],
    loraWanConnected: false,
    batteryLevel: 45,
  },
];

// Calculate water quality and disease risks for each village
initialVillages.forEach(village => {
  village.waterQuality = calculateWaterQuality(village.sensorData);
  village.diseaseRisks = calculateDiseaseRisks(village.waterQuality, village.sensorData);
});

export { calculateWaterQuality, calculateDiseaseRisks, generateSensorData };