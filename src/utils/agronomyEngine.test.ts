import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSoil, recommendCrops, calculateFertilizerDosage, CROP_DATABASE } from './agronomyEngine';

test('Soil evaluation calculates accurate index for balanced fertile soil', () => {
  const result = evaluateSoil({
    ph: 6.5,
    nitrogen: 320,
    phosphorus: 35,
    potassium: 220,
    moisture: 55,
    temperature: 25,
    humidity: 60
  });

  assert.equal(result.phStatus, 'Optimal');
  assert.equal(result.healthGrade, 'Optimal');
  assert.ok(result.healthIndex >= 85, 'Health index should be >= 85 for balanced nutrients');
  assert.equal(result.nitrogen.status, 'Optimal');
  assert.equal(result.phosphorus.status, 'Optimal');
  assert.equal(result.potassium.status, 'Optimal');
});

test('Soil evaluation identifies acidic pH and deficient nutrients', () => {
  const result = evaluateSoil({
    ph: 4.8,
    nitrogen: 90,
    phosphorus: 8,
    potassium: 60,
    moisture: 30,
    temperature: 28,
    humidity: 45
  });

  assert.equal(result.phStatus, 'Strongly Acidic');
  assert.equal(result.nitrogen.status, 'Deficient');
  assert.equal(result.phosphorus.status, 'Deficient');
  assert.equal(result.potassium.status, 'Deficient');
  assert.equal(result.healthGrade, 'Poor');
  assert.ok(result.amendments.some(a => a.includes('Lime')), 'Should recommend Lime for acidic soil');
});

test('Crop recommendation ranks suitable crops for paddy/rice conditions', () => {
  const recommendations = recommendCrops({
    ph: 6.2,
    nitrogen: 180,
    phosphorus: 30,
    potassium: 70,
    moisture: 80,
    temperature: 28,
    humidity: 85
  });

  assert.ok(recommendations.length >= 5, 'Should return full database of recommendations');
  assert.ok(recommendations[0].matchScore >= recommendations[1].matchScore, 'Should be sorted descending');
  
  const riceRec = recommendations.find(r => r.crop.id === 'rice');
  assert.ok(riceRec, 'Rice should be recommended');
  assert.ok(riceRec.matchScore >= 75, 'Rice should score highly under high moisture conditions');
});

test('Fertilizer dosage calculates positive amounts for given farm size', () => {
  const fert = calculateFertilizerDosage('Wheat', 2.5, {
    ph: 6.8,
    nitrogen: 100,
    phosphorus: 15,
    potassium: 50,
    moisture: 50,
    temperature: 20,
    humidity: 50
  });

  assert.equal(fert.targetCropName, 'Wheat');
  assert.equal(fert.areaAcres, 2.5);
  assert.ok(fert.ureaKg > 0, 'Urea amount must be positive');
  assert.ok(fert.dapKg > 0, 'DAP amount must be positive');
  assert.ok(fert.mopKg > 0, 'MOP amount must be positive');
  assert.ok(fert.organicCompostKg > 0, 'Compost must be calculated');
  assert.equal(fert.applicationSchedule.length, 3, 'Must provide 3-stage application schedule');
});
