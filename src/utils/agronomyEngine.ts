export interface SoilParameters {
  moisture: number; // percentage 0 - 100
  temperature: number; // Celsius
  humidity: number; // percentage 0 - 100
  ph: number; // 0 - 14
  nitrogen: number; // kg/ha (typical 50 - 500)
  phosphorus: number; // kg/ha (typical 5 - 80)
  potassium: number; // kg/ha (typical 50 - 450)
  soilType?: string; // Loamy, Clay, Sandy, Alluvial, Black, Red
}

export interface NutrientStatus {
  status: 'Deficient' | 'Low' | 'Optimal' | 'High' | 'Excessive';
  score: number; // 0-100
  recommendation: string;
}

export interface SoilAnalysisResult {
  healthIndex: number; // 0 - 100
  healthGrade: 'Poor' | 'Moderate' | 'Good' | 'Optimal';
  phStatus: 'Strongly Acidic' | 'Moderately Acidic' | 'Slightly Acidic' | 'Optimal' | 'Moderately Alkaline' | 'Strongly Alkaline';
  phRecommendation: string;
  nitrogen: NutrientStatus;
  phosphorus: NutrientStatus;
  potassium: NutrientStatus;
  moistureStatus: 'Low (Dry)' | 'Adequate' | 'High (Saturated)';
  summary: string;
  amendments: string[];
}

export interface CropProfile {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Vegetable' | 'Fruit' | 'Oilseed';
  season: 'Kharif (Monsoon)' | 'Rabi (Winter)' | 'Zaid (Summer)' | 'Year-round';
  idealPh: [number, number]; // [min, max]
  idealN: [number, number];
  idealP: [number, number];
  idealK: [number, number];
  idealMoisture: [number, number];
  idealTemp: [number, number];
  waterRequirement: 'Low' | 'Medium' | 'High' | 'Very High';
  growthDurationDays: number;
  expectedYield: string;
  description: string;
}

export interface CropRecommendation {
  crop: CropProfile;
  matchScore: number; // 0 - 100%
  suitability: 'Highly Recommended' | 'Recommended' | 'Moderate' | 'Not Advised';
  reasons: string[];
  limitations: string[];
}

export interface FertilizerCalculation {
  targetCropName: string;
  areaAcres: number;
  ureaKg: number;
  dapKg: number;
  mopKg: number;
  organicCompostKg: number;
  applicationSchedule: {
    stage: string;
    timing: string;
    nutrients: string;
    tips: string;
  }[];
}

// Reference crop profiles grounded in agronomy literature (ICAR, FAO)
export const CROP_DATABASE: CropProfile[] = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    season: 'Kharif (Monsoon)',
    idealPh: [5.5, 7.0],
    idealN: [100, 250],
    idealP: [20, 50],
    idealK: [40, 100],
    idealMoisture: [60, 95],
    idealTemp: [22, 34],
    waterRequirement: 'Very High',
    growthDurationDays: 125,
    expectedYield: '4.0 - 6.5 tonnes/ha',
    description: 'Requires ample water and clayey/loamy soil capable of holding moisture.'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    season: 'Rabi (Winter)',
    idealPh: [6.0, 7.5],
    idealN: [100, 200],
    idealP: [25, 60],
    idealK: [40, 90],
    idealMoisture: [40, 70],
    idealTemp: [12, 25],
    waterRequirement: 'Medium',
    growthDurationDays: 130,
    expectedYield: '3.5 - 5.5 tonnes/ha',
    description: 'Thrives in well-drained loamy soils during cool temperate winter seasons.'
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    category: 'Cereal',
    season: 'Kharif (Monsoon)',
    idealPh: [5.8, 7.5],
    idealN: [120, 220],
    idealP: [30, 70],
    idealK: [50, 120],
    idealMoisture: [45, 75],
    idealTemp: [18, 32],
    waterRequirement: 'Medium',
    growthDurationDays: 100,
    expectedYield: '5.0 - 8.0 tonnes/ha',
    description: 'Highly adaptable crop with high nutrient conversion efficiency.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    season: 'Kharif (Monsoon)',
    idealPh: [6.0, 8.2],
    idealN: [80, 180],
    idealP: [20, 50],
    idealK: [60, 150],
    idealMoisture: [40, 65],
    idealTemp: [22, 36],
    waterRequirement: 'Medium',
    growthDurationDays: 160,
    expectedYield: '2.0 - 3.2 tonnes/ha',
    description: 'Ideal in deep black cotton soils (Vertisols) with good moisture retention.'
  },
  {
    id: 'chickpea',
    name: 'Chickpea (Gram)',
    scientificName: 'Cicer arietinum',
    category: 'Pulse',
    season: 'Rabi (Winter)',
    idealPh: [6.0, 7.8],
    idealN: [20, 80], // fixes nitrogen
    idealP: [25, 60],
    idealK: [30, 80],
    idealMoisture: [30, 60],
    idealTemp: [15, 26],
    waterRequirement: 'Low',
    growthDurationDays: 110,
    expectedYield: '1.5 - 2.8 tonnes/ha',
    description: 'Leguminous nitrogen-fixing pulse crop, highly drought-tolerant.'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    season: 'Year-round',
    idealPh: [6.0, 6.8],
    idealN: [100, 200],
    idealP: [40, 90],
    idealK: [80, 200],
    idealMoisture: [50, 75],
    idealTemp: [18, 30],
    waterRequirement: 'Medium',
    growthDurationDays: 95,
    expectedYield: '25 - 45 tonnes/ha',
    description: 'Requires fertile, well-draining soil with balanced potassium for fruit firmness.'
  },
  {
    id: 'potato',
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Vegetable',
    season: 'Rabi (Winter)',
    idealPh: [5.2, 6.5],
    idealN: [120, 220],
    idealP: [40, 90],
    idealK: [100, 250],
    idealMoisture: [60, 80],
    idealTemp: [15, 22],
    waterRequirement: 'Medium',
    growthDurationDays: 90,
    expectedYield: '20 - 35 tonnes/ha',
    description: 'Demands loose, slightly acidic sandy-loam soils and high potassium.'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    scientificName: 'Brassica juncea',
    category: 'Oilseed',
    season: 'Rabi (Winter)',
    idealPh: [6.0, 7.5],
    idealN: [60, 120],
    idealP: [20, 45],
    idealK: [25, 60],
    idealMoisture: [35, 60],
    idealTemp: [12, 25],
    waterRequirement: 'Low',
    growthDurationDays: 115,
    expectedYield: '1.4 - 2.2 tonnes/ha',
    description: 'Thrives in cool climates, low water requirement, excellent winter rotation.'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crop',
    season: 'Year-round',
    idealPh: [6.5, 7.8],
    idealN: [150, 300],
    idealP: [40, 90],
    idealK: [80, 200],
    idealMoisture: [65, 85],
    idealTemp: [24, 38],
    waterRequirement: 'Very High',
    growthDurationDays: 330,
    expectedYield: '75 - 110 tonnes/ha',
    description: 'Heavy feeder demanding fertile deep loams, warm weather, and intensive irrigation.'
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseed',
    season: 'Kharif (Monsoon)',
    idealPh: [5.8, 7.0],
    idealN: [30, 80],
    idealP: [30, 70],
    idealK: [40, 90],
    idealMoisture: [40, 65],
    idealTemp: [22, 32],
    waterRequirement: 'Low',
    growthDurationDays: 120,
    expectedYield: '2.0 - 3.5 tonnes/ha',
    description: 'Prefers light friable sandy loam to allow gynophore (peg) penetration.'
  }
];

export function evaluateSoil(params: SoilParameters): SoilAnalysisResult {
  const { ph, nitrogen, phosphorus, potassium, moisture } = params;

  // Evaluate pH
  let phStatus: SoilAnalysisResult['phStatus'] = 'Optimal';
  let phRecommendation = 'Soil pH is well-balanced for broad-spectrum crop availability.';
  let phScore = 100;

  if (ph < 5.0) {
    phStatus = 'Strongly Acidic';
    phRecommendation = 'Apply agricultural limestone (CaCO3) or dolomite at 2.5 tonnes/ha to neutralize severe acidity.';
    phScore = 40;
  } else if (ph < 6.0) {
    phStatus = 'Slightly Acidic';
    phRecommendation = 'Add hydrated lime or wood ash in moderate doses (1 tonne/ha) and incorporate organic manure.';
    phScore = 75;
  } else if (ph <= 7.5) {
    phStatus = 'Optimal';
    phRecommendation = 'Optimal pH (6.0 - 7.5) ensures high macro- and micronutrient bioavailability.';
    phScore = 100;
  } else if (ph <= 8.5) {
    phStatus = 'Moderately Alkaline';
    phRecommendation = 'Apply agricultural gypsum (CaSO4) at 1.5 tonnes/ha and sulfur powder to lower pH and reclaim sodicity.';
    phScore = 70;
  } else {
    phStatus = 'Strongly Alkaline';
    phRecommendation = 'Urgent reclamation required: heavy gypsum application (3-4 tonnes/ha) with green manuring (Dhaincha).';
    phScore = 35;
  }

  // Evaluate Nitrogen (kg/ha)
  let nStatus: NutrientStatus['status'] = 'Optimal';
  let nScore = 85;
  let nRec = 'Nitrogen levels are healthy. Maintain via balanced organic replenishment.';
  if (nitrogen < 140) {
    nStatus = 'Deficient';
    nScore = 35;
    nRec = 'Critical nitrogen shortage causing chlorosis. Apply Urea (46% N) or Ammonium Sulfate split into basal and top dressings.';
  } else if (nitrogen < 240) {
    nStatus = 'Low';
    nScore = 65;
    nRec = 'Sub-optimal nitrogen. Top-dress with 50 kg Urea/ha or apply fermented cow dung slurry / vermicompost.';
  } else if (nitrogen <= 400) {
    nStatus = 'Optimal';
    nScore = 95;
    nRec = 'Optimal nitrogen level supporting robust vegetative foliage and photosynthesis.';
  } else if (nitrogen <= 520) {
    nStatus = 'High';
    nScore = 75;
    nRec = 'High nitrogen: hold back top-dressing to prevent lodging and fungal vulnerability.';
  } else {
    nStatus = 'Excessive';
    nScore = 40;
    nRec = 'Excessive nitrogen toxicity risk. Flush with irrigation and increase potash to balance foliage-fruit ratio.';
  }

  // Evaluate Phosphorus (kg/ha)
  let pStatus: NutrientStatus['status'] = 'Optimal';
  let pScore = 85;
  let pRec = 'Phosphorus is sufficient for root development and ATP cellular energy transfer.';
  if (phosphorus < 12) {
    pStatus = 'Deficient';
    pScore = 35;
    pRec = 'Severely deficient P. Apply Single Super Phosphate (SSP) or DAP directly into the root zone.';
  } else if (phosphorus < 22) {
    pStatus = 'Low';
    pScore = 65;
    pRec = 'Low phosphorus. Boost using bone meal, rock phosphate, or mycorrhizal biofertilizers.';
  } else if (phosphorus <= 55) {
    pStatus = 'Optimal';
    pScore = 95;
    pRec = 'Optimal phosphorus supporting vigorous root anchorage and early seedling establishment.';
  } else if (phosphorus <= 80) {
    pStatus = 'High';
    pScore = 75;
    pRec = 'High phosphorus. Refrain from phosphate fertilizers to prevent zinc and iron micronutrient lockout.';
  } else {
    pStatus = 'Excessive';
    pScore = 45;
    pRec = 'Excessive phosphorus. Cease all P applications; monitor for zinc and iron deficiencies.';
  }

  // Evaluate Potassium (kg/ha)
  let kStatus: NutrientStatus['status'] = 'Optimal';
  let kScore = 85;
  let kRec = 'Potassium is optimal for stomatal regulation and pathogen resistance.';
  if (potassium < 80) {
    kStatus = 'Deficient';
    kScore = 35;
    kRec = 'Critical potassium deficiency. Apply Muriate of Potash (MOP, 60% K2O) or Potassium Sulfate.';
  } else if (potassium < 140) {
    kStatus = 'Low';
    kScore = 65;
    kRec = 'Low potassium: weak stems and reduced drought resistance. Apply 40 kg MOP/ha or wood ash.';
  } else if (potassium <= 300) {
    kStatus = 'Optimal';
    nScore = 95;
    kRec = 'Optimal potassium promoting disease resistance, stalk vigor, and high grain/fruit quality.';
  } else if (potassium <= 420) {
    kStatus = 'High';
    kScore = 75;
    kRec = 'High potassium: adequate for heavy potassium feeders like potatoes and bananas.';
  } else {
    kStatus = 'Excessive';
    kScore = 50;
    kRec = 'Excessive potassium may suppress magnesium and calcium uptake in plants.';
  }

  // Moisture evaluation
  let moistureStatus: SoilAnalysisResult['moistureStatus'] = 'Adequate';
  if (moisture < 35) {
    moistureStatus = 'Low (Dry)';
  } else if (moisture > 75) {
    moistureStatus = 'High (Saturated)';
  }

  // Composite Health Index
  const healthIndex = Math.round((phScore * 0.3) + (nScore * 0.25) + (pScore * 0.2) + (kScore * 0.25));

  let healthGrade: SoilAnalysisResult['healthGrade'] = 'Poor';
  if (healthIndex >= 85) healthGrade = 'Optimal';
  else if (healthIndex >= 70) healthGrade = 'Good';
  else if (healthIndex >= 50) healthGrade = 'Moderate';

  // Specific amendments list
  const amendments: string[] = [];
  if (ph < 6.0) amendments.push('Agricultural Lime (CaCO3) @ 1.5 - 2.5 T/ha to elevate acidic soil pH');
  if (ph > 7.8) amendments.push('Gypsum (CaSO4·2H2O) @ 2.0 T/ha to remediate alkaline salts');
  if (nitrogen < 240) amendments.push('Enriched Vermicompost (2 T/ha) or Neem-coated Urea split-dose application');
  if (phosphorus < 22) amendments.push('Single Super Phosphate (SSP) @ 150 kg/ha or Rock Phosphate with PSB bacteria');
  if (potassium < 140) amendments.push('Muriate of Potash (MOP) @ 60 kg/ha or certified organic wood ash');
  if (moisture < 35) amendments.push('Organic straw/paddy mulch (5-8 cm) to conserve soil moisture and suppress evaporation');
  if (amendments.length === 0) {
    amendments.push('Soil condition is well-balanced! Maintain with annual compost addition of 1 T/ha and routine crop rotation.');
  }

  const summary = `Overall Soil Health is rated ${healthGrade} (${healthIndex}/100). The soil exhibits ${phStatus} pH (${ph}), ${nStatus.toLowerCase()} nitrogen, ${pStatus.toLowerCase()} phosphorus, and ${kStatus.toLowerCase()} potassium levels.`;

  return {
    healthIndex,
    healthGrade,
    phStatus,
    phRecommendation,
    nitrogen: { status: nStatus, score: nScore, recommendation: nRec },
    phosphorus: { status: pStatus, score: pScore, recommendation: pRec },
    potassium: { status: kStatus, score: kScore, recommendation: kRec },
    moistureStatus,
    summary,
    amendments
  };
}

export function recommendCrops(soil: SoilParameters): CropRecommendation[] {
  const recommendations: CropRecommendation[] = [];

  for (const crop of CROP_DATABASE) {
    const reasons: string[] = [];
    const limitations: string[] = [];

    // pH match calculation
    let phScore = 0;
    const [minPh, maxPh] = crop.idealPh;
    if (soil.ph >= minPh && soil.ph <= maxPh) {
      phScore = 100;
      reasons.push(`Soil pH ${soil.ph} is optimal for ${crop.name} (${minPh}-${maxPh}).`);
    } else {
      const phDiff = soil.ph < minPh ? minPh - soil.ph : soil.ph - maxPh;
      phScore = Math.max(0, 100 - (phDiff * 45));
      if (soil.ph < minPh) limitations.push(`Soil is more acidic than preferred (${minPh}-${maxPh}).`);
      else limitations.push(`Soil is more alkaline than preferred (${minPh}-${maxPh}).`);
    }

    // Nitrogen match
    let nScore = 0;
    const [minN, maxN] = crop.idealN;
    if (soil.nitrogen >= minN && soil.nitrogen <= maxN) {
      nScore = 100;
      reasons.push(`Nitrogen availability matches ${crop.name}'s vegetative requirements.`);
    } else if (soil.nitrogen < minN) {
      const diff = (minN - soil.nitrogen) / minN;
      nScore = Math.max(20, 100 - (diff * 70));
      limitations.push(`Nitrogen is lower than ideal (${minN}-${maxN} kg/ha). Needs supplementary fertilization.`);
    } else {
      nScore = 80; // slightly high is usually manageable
    }

    // Phosphorus match
    let pScore = 0;
    const [minP, maxP] = crop.idealP;
    if (soil.phosphorus >= minP && soil.phosphorus <= maxP) {
      pScore = 100;
      reasons.push(`Phosphorus level supports robust root architecture.`);
    } else {
      const diff = Math.abs(soil.phosphorus - ((minP + maxP) / 2));
      pScore = Math.max(30, 100 - diff * 2);
      if (soil.phosphorus < minP) limitations.push(`Phosphorus is below the target ${minP} kg/ha.`);
    }

    // Potassium match
    let kScore = 0;
    const [minK, maxK] = crop.idealK;
    if (soil.potassium >= minK && soil.potassium <= maxK) {
      kScore = 100;
      reasons.push(`Potassium levels ensure disease resistance and yield quality.`);
    } else {
      const diff = Math.abs(soil.potassium - ((minK + maxK) / 2));
      kScore = Math.max(30, 100 - diff * 0.8);
      if (soil.potassium < minK) limitations.push(`Potassium is lower than optimum (${minK} kg/ha).`);
    }

    // Moisture & Temp
    let envScore = 80;
    const [minM, maxM] = crop.idealMoisture;
    if (soil.moisture >= minM && soil.moisture <= maxM) {
      envScore = 100;
      reasons.push(`Moisture level (${soil.moisture}%) matches water requirements.`);
    } else {
      envScore = Math.max(40, 100 - Math.abs(soil.moisture - ((minM + maxM) / 2)) * 1.5);
    }

    // Weighted composite match score
    const totalScore = Math.round(
      (phScore * 0.3) +
      (nScore * 0.25) +
      (pScore * 0.15) +
      (kScore * 0.15) +
      (envScore * 0.15)
    );

    let suitability: CropRecommendation['suitability'] = 'Not Advised';
    if (totalScore >= 82) suitability = 'Highly Recommended';
    else if (totalScore >= 70) suitability = 'Recommended';
    else if (totalScore >= 55) suitability = 'Moderate';

    recommendations.push({
      crop,
      matchScore: totalScore,
      suitability,
      reasons,
      limitations
    });
  }

  // Sort descending by match score
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

export function calculateFertilizerDosage(cropName: string, areaAcres: number, soil: SoilParameters): FertilizerCalculation {
  const crop = CROP_DATABASE.find(c => c.name.toLowerCase().includes(cropName.toLowerCase())) || CROP_DATABASE[0];
  const areaHa = areaAcres * 0.404686; // 1 acre ~ 0.4047 ha

  const targetN = crop.idealN[0];
  const targetP = crop.idealP[0];
  const targetK = crop.idealK[0];

  const deficitN = Math.max(0, targetN - soil.nitrogen);
  const deficitP = Math.max(0, targetP - soil.phosphorus);
  const deficitK = Math.max(0, targetK - soil.potassium);

  // DAP provides 18% N and 46% P2O5
  const dapNeededKgPerHa = (deficitP / 0.46);
  const nProvidedByDap = dapNeededKgPerHa * 0.18;

  // Remaining N provided by Urea (46% N)
  const remainingN = Math.max(0, deficitN - nProvidedByDap);
  const ureaNeededKgPerHa = (remainingN / 0.46);

  // MOP provides 60% K2O
  const mopNeededKgPerHa = (deficitK / 0.60);

  const totalDap = Math.round(Math.max(25 * areaAcres, dapNeededKgPerHa * areaHa));
  const totalUrea = Math.round(Math.max(35 * areaAcres, ureaNeededKgPerHa * areaHa));
  const totalMop = Math.round(Math.max(15 * areaAcres, mopNeededKgPerHa * areaHa));
  const compostKg = Math.round(areaAcres * 500); // 500kg organic compost per acre baseline

  return {
    targetCropName: crop.name,
    areaAcres,
    ureaKg: totalUrea,
    dapKg: totalDap,
    mopKg: totalMop,
    organicCompostKg: compostKg,
    applicationSchedule: [
      {
        stage: 'Basal Dressing (At Sowing/Planting)',
        timing: 'Day 0',
        nutrients: `100% of DAP (${totalDap} kg) + 50% of MOP (${Math.round(totalMop * 0.5)} kg) + 25% of Urea (${Math.round(totalUrea * 0.25)} kg) + all Organic Compost (${compostKg} kg)`,
        tips: 'Place 4-5 cm below seed level to promote early root development without seed burning.'
      },
      {
        stage: 'First Top Dressing (Vegetative / Tillering Stage)',
        timing: 'Day 25 - 35 after sowing',
        nutrients: `50% of Urea (${Math.round(totalUrea * 0.5)} kg)`,
        tips: 'Apply after first weeding when soil has moderate moisture. Avoid waterlogged conditions.'
      },
      {
        stage: 'Second Top Dressing (Panicle / Flowering / Tuber Bulking)',
        timing: 'Day 55 - 65 after sowing',
        nutrients: `Remaining 25% of Urea (${Math.round(totalUrea * 0.25)} kg) + Remaining 50% of MOP (${Math.round(totalMop * 0.5)} kg)`,
        tips: 'Potassium at this stage strengthens stems, improves grain weight, and increases disease immunity.'
      }
    ]
  };
}
