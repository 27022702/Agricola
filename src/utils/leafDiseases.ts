export interface DiseaseDiagnosis {
  id: string;
  cropName: string;
  condition: 'Healthy' | 'Diseased';
  diseaseName: string;
  scientificName: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Physiological / None';
  confidenceScore: number; // e.g. 94%
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  modelSource: string; // e.g. "Gemini 2.5 Flash Multimodal Vision" or "AgriSmart Offline Agronomic Engine"
  isAiEstimate: boolean;
  disclaimer: string;
  symptoms: string[];
  immediateActions: string[];
  organicTreatment: string[];
  chemicalControl: {
    chemical: string;
    dosage: string;
    timing: string;
    safetyPrecautions: string;
  }[];
  preventionMethods: string[];
  favorableConditions: string;
  economicThreshold: string;
}

export interface SampleLeaf {
  id: string;
  crop: string;
  label: string;
  expectedDisease: string;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  thumbnailUrl: string; // SVG or inline image data
  description: string;
}

// Preset realistic leaf image templates for instant demo testing
export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-tomato-late-blight',
    crop: 'Tomato',
    label: 'Tomato Leaf with Water-Soaked Dark Lesions',
    expectedDisease: 'Tomato Late Blight (Phytophthora infestans)',
    severity: 'Severe',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%232e5630"/><path d="M80,10 C120,40 140,80 80,110 C20,80 40,40 80,10" fill="%234d8349"/><circle cx="70" cy="50" r="14" fill="%233b2a22"/><circle cx="95" cy="70" r="18" fill="%232b1d16"/><circle cx="60" cy="80" r="10" fill="%233b2a22"/><path d="M80,10 Q80,60 80,110" stroke="%2385b07e" stroke-width="2"/><text x="10" y="112" fill="%23ffffff" font-size="10" font-family="sans-serif">Late Blight (Severe)</text></svg>',
    description: 'Irregular dark necrotic lesions with pale green halos, typical of cool damp fungal spread.'
  },
  {
    id: 'sample-potato-early-blight',
    crop: 'Potato',
    label: 'Potato Leaf with Target-Spot Concentric Rings',
    expectedDisease: 'Potato Early Blight (Alternaria solani)',
    severity: 'Moderate',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%232a472c"/><path d="M80,12 C130,45 130,85 80,108 C30,85 30,45 80,12" fill="%23568c48"/><circle cx="65" cy="45" r="12" fill="%2352341b" stroke="%238c6439" stroke-width="2"/><circle cx="95" cy="65" r="15" fill="%2352341b" stroke="%238c6439" stroke-width="2"/><path d="M80,12 L80,108" stroke="%239ed68e" stroke-width="1.5"/><text x="10" y="112" fill="%23ffffff" font-size="10" font-family="sans-serif">Early Blight (Target)</text></svg>',
    description: 'Distinctive concentric ring lesions resembling a bullseye on older foliage.'
  },
  {
    id: 'sample-rice-blast',
    crop: 'Rice',
    label: 'Rice Blade with Spindle-Shaped Gray Lesions',
    expectedDisease: 'Rice Leaf Blast (Magnaporthe oryzae)',
    severity: 'Moderate',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%231e3d23"/><polygon points="80,5 110,60 90,115 70,115 50,60" fill="%236da456"/><ellipse cx="80" cy="50" rx="6" ry="16" fill="%237e8c7c" stroke="%23613017" stroke-width="2"/><ellipse cx="75" cy="80" rx="5" ry="12" fill="%237e8c7c" stroke="%23613017" stroke-width="2"/><text x="10" y="112" fill="%23ffffff" font-size="10" font-family="sans-serif">Rice Blast</text></svg>',
    description: 'Diamond or eye-shaped lesions with grayish-white centers and brownish-red borders.'
  },
  {
    id: 'sample-corn-blight',
    crop: 'Corn (Maize)',
    label: 'Corn Leaf with Elongated Cigar Lesions',
    expectedDisease: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    severity: 'Moderate',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%23254021"/><rect x="65" y="10" width="30" height="100" rx="10" fill="%2372ab54"/><rect x="70" y="35" width="20" height="35" rx="5" fill="%238a6a42"/><rect x="72" y="80" width="16" height="20" rx="4" fill="%238a6a42"/><text x="10" y="112" fill="%23ffffff" font-size="10" font-family="sans-serif">Corn Leaf Blight</text></svg>',
    description: 'Long elliptical grayish-green or tan lesions spreading along foliage veins.'
  },
  {
    id: 'sample-bell-pepper-healthy',
    crop: 'Bell Pepper',
    label: 'Vibrant Green Healthy Leaf (Disease Free)',
    expectedDisease: 'Healthy Foliage (No Pathogen Detected)',
    severity: 'None',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%23193e22"/><path d="M80,10 C125,40 125,85 80,110 C35,85 35,40 80,10" fill="%2344b549"/><path d="M80,10 L80,110" stroke="%238cf28e" stroke-width="2"/><path d="M80,45 L105,35 M80,65 L110,55 M80,85 L102,80 M80,45 L55,35 M80,65 L50,55 M80,85 L58,80" stroke="%238cf28e" stroke-width="1.2"/><text x="10" y="112" fill="%23ffffff" font-size="10" font-family="sans-serif">100% Healthy Foliage</text></svg>',
    description: 'Uniform rich chlorophyll pigmentation, smooth margins, zero discoloration.'
  },
  {
    id: 'sample-apple-scab',
    crop: 'Apple',
    label: 'Apple Foliage with Olive-Velvety Scab',
    expectedDisease: 'Apple Scab (Venturia inaequalis)',
    severity: 'Mild',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%232c3f2d"/><path d="M80,15 C120,40 120,80 80,105 C40,80 40,40 80,15" fill="%23589b4f"/><circle cx="70" cy="45" r="8" fill="%233a3521"/><circle cx="90" cy="65" r="9" fill="%233a3521"/><circle cx="65" cy="78" r="6" fill="%233a3521"/><text x="10" y="112" fill="%23ffffff" font-size="10" font-family="sans-serif">Apple Scab</text></svg>',
    description: 'Dull olive-green to black velvety spots causing leaf curling and defoliation.'
  }
];

export const KNOWLEDGE_BASE_DIAGNOSES: Record<string, DiseaseDiagnosis> = {
  'sample-tomato-late-blight': {
    id: 'diag-tomato-late-blight',
    cropName: 'Tomato (Solanum lycopersicum)',
    condition: 'Diseased',
    diseaseName: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans (Oomycete pathogen)',
    pathogenType: 'Fungal',
    confidenceScore: 94.6,
    severity: 'Severe',
    modelSource: 'AI-Assisted Diagnostic Estimate (Gemini Vision / Agronomy Knowledge Engine)',
    isAiEstimate: true,
    disclaimer: 'Notice: This AI diagnostic estimate is an educational advisory tool for decision support. For quarantine or high-value crop losses, verify with your local agricultural extension service.',
    symptoms: [
      'Large, irregular water-soaked dark brownish-purple lesions on foliage',
      'White cottony fungal sporulation visible on the leaf undersides in high humidity',
      'Rapid petiole collapse and dark brown girdling streaks along the main stem',
      'Firm, brown, leathery rot on expanding tomato fruits'
    ],
    immediateActions: [
      'Immediately prune and burn or bag severely infected canopy branches; do NOT compost infected vines.',
      'Cease overhead sprinkler irrigation to keep the foliage strictly dry.',
      'Ensure adequate row ventilation by clearing weeds and suckers.'
    ],
    organicTreatment: [
      'Apply Copper Hydroxide or Bordeaux mixture (1%) preventive spray every 7-10 days.',
      'Trichoderma viride bio-fungicide soil drenching (5g/L) to suppress spore reinoculation.',
      'Neem seed kernel extract (NSKE 5%) as botanical deterrent.'
    ],
    chemicalControl: [
      {
        chemical: 'Mancozeb 75% WP',
        dosage: '2.0 - 2.5 g per litre of water',
        timing: 'Foliar spray at first sign of cloudy damp conditions before spore spread',
        safetyPrecautions: 'Observe 7-day pre-harvest interval (PHI). Wear protective gloves and respirator mask.'
      },
      {
        chemical: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ)',
        dosage: '2.5 g per litre of water',
        timing: 'Systemic curative foliar spray when disease lesions are actively expanding',
        safetyPrecautions: 'Do not spray more than twice consecutively to prevent chemical resistance buildup.'
      }
    ],
    preventionMethods: [
      'Select resistant cultivars (e.g., Mountain Magic, Defiant PHR, Plum Regal).',
      'Maintain 60cm row spacing to maximize airflow and lower canopy humidity.',
      'Rotate crops for at least 3 years away from Solanaceae family (potatoes, peppers, eggplants).',
      'Apply plastic or organic straw mulch to prevent soil splashing onto bottom leaves.'
    ],
    favorableConditions: 'Prolonged leaf wetness (>8 hours), high relative humidity (>90%), and cool temperatures (15°C – 22°C).',
    economicThreshold: 'Zero-tolerance in commercial crops: immediate chemical containment required upon confirmation of 1% canopy lesions.'
  },

  'sample-potato-early-blight': {
    id: 'diag-potato-early-blight',
    cropName: 'Potato (Solanum tuberosum)',
    condition: 'Diseased',
    diseaseName: 'Potato Early Blight',
    scientificName: 'Alternaria solani (Ascomycete fungus)',
    pathogenType: 'Fungal',
    confidenceScore: 91.2,
    severity: 'Moderate',
    modelSource: 'AI-Assisted Diagnostic Estimate (Gemini Vision / Agronomy Knowledge Engine)',
    isAiEstimate: true,
    disclaimer: 'Notice: This AI diagnostic estimate is an educational advisory tool for decision support. For quarantine or high-value crop losses, verify with your local agricultural extension service.',
    symptoms: [
      'Dark brown to black concentric circular ring spots ("target-board" pattern)',
      'Chlorotic yellow halo surrounding mature necrotic lesions',
      'Senescence and premature dropping of lower foliage',
      'Tuber infection shows sunken, dark, leathery dry rot'
    ],
    immediateActions: [
      'Remove lower decaying leaves showing target spots.',
      'Correct plant stress by regulating nitrogen and potassium levels.',
      'Shift irrigation timing to early morning so foliage dries quickly under daylight.'
    ],
    organicTreatment: [
      'Bacillus subtilis bio-fungicide (3-5 ml/L) foliar spray.',
      'Neem oil (3%) emulsified with soft soap at 10-day intervals.',
      'Compost tea foliar drench to build beneficial phyllosphere microbial competition.'
    ],
    chemicalControl: [
      {
        chemical: 'Chlorothalonil 75% WP',
        dosage: '2.0 g per litre of water',
        timing: 'Preventive protective spray every 10 to 14 days',
        safetyPrecautions: 'Avoid spraying during pollinator peak hours. Wash thoroughly.'
      },
      {
        chemical: 'Azoxystrobin 23% SC',
        dosage: '1.0 ml per litre of water',
        timing: 'Apply at early lesion formation to inhibit spore germination and mycelial expansion',
        safetyPrecautions: 'Rotate with non-strobilurin fungicides to prevent fungicide resistance.'
      }
    ],
    preventionMethods: [
      'Use certified disease-free seed tubers.',
      'Provide balanced nitrogen; avoid under-fertilization which triggers early physiological aging.',
      'Hill up potato rows properly to prevent fungal spore washdown onto tubers.',
      'Practice a minimum 2-year crop rotation with non-host crops (corn, wheat, legumes).'
    ],
    favorableConditions: 'Warm temperatures (24°C – 29°C) alternating with wet and dry periods (heavy dew or intermittent rains).',
    economicThreshold: 'Initiate spray programs when 5% of lower leaves display characteristic lesions.'
  },

  'sample-rice-blast': {
    id: 'diag-rice-blast',
    cropName: 'Rice (Oryza sativa)',
    condition: 'Diseased',
    diseaseName: 'Rice Leaf Blast',
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    pathogenType: 'Fungal',
    confidenceScore: 93.8,
    severity: 'Moderate',
    modelSource: 'AI-Assisted Diagnostic Estimate (Gemini Vision / Agronomy Knowledge Engine)',
    isAiEstimate: true,
    disclaimer: 'Notice: This AI diagnostic estimate is an educational advisory tool for decision support. For quarantine or high-value crop losses, verify with your local agricultural extension service.',
    symptoms: [
      'Spindle-shaped or diamond-shaped lesions with grayish-white centers and brownish-red borders',
      'Lesions coalesce causing complete blighting and drying of the leaf blade',
      'Neck rot or node blast causing white, unfilled empty panicles ("whitehead")'
    ],
    immediateActions: [
      'Avoid excessive top-dressing of quick-release nitrogenous fertilizers.',
      'Maintain continuous shallow standing water in the paddy field to reduce plant stress.',
      'Clear grassy weeds on field bunds which host Pyricularia spores.'
    ],
    organicTreatment: [
      'Pseudomonas fluorescens seed treatment (10g/kg) and foliar spray (2.5 kg/ha).',
      'Silica fertilizer supplementation (calcium silicate) to strengthen cell walls against fungal hyphae penetration.',
      'Cow urine distillate (5%) with neem extract.'
    ],
    chemicalControl: [
      {
        chemical: 'Tricyclazole 75% WP',
        dosage: '0.6 g per litre of water',
        timing: 'Apply at early leaf blast detection and once more at panicle emergence (booting stage)',
        safetyPrecautions: 'Wear protective gear. Toxic to aquatic organisms—prevent canal runoff.'
      },
      {
        chemical: 'Isoprothiolane 40% EC',
        dosage: '1.5 ml per litre of water',
        timing: 'Foliar spray at 10-15 day intervals during cloudy high-humidity weather',
        safetyPrecautions: 'Do not mix with alkaline formulations.'
      }
    ],
    preventionMethods: [
      'Cultivate blast-resistant rice cultivars recommended by state agricultural universities.',
      'Split nitrogen application into 3-4 split doses rather than heavy single doses.',
      'Treat paddy seeds with carbendazim or bio-agent prior to nursery sowing.'
    ],
    favorableConditions: 'High relative humidity (>90%), nighttime dew deposition, cool nights (18°C-22°C), and high nitrogen soil content.',
    economicThreshold: 'Treat when 2-5% leaf area is affected during tillering or booting stage.'
  },

  'sample-corn-blight': {
    id: 'diag-corn-blight',
    cropName: 'Corn / Maize (Zea mays)',
    condition: 'Diseased',
    diseaseName: 'Northern Corn Leaf Blight (NCLB)',
    scientificName: 'Exserohilum turcicum (Setosphaeria turcica)',
    pathogenType: 'Fungal',
    confidenceScore: 92.4,
    severity: 'Moderate',
    modelSource: 'AI-Assisted Diagnostic Estimate (Gemini Vision / Agronomy Knowledge Engine)',
    isAiEstimate: true,
    disclaimer: 'Notice: This AI diagnostic estimate is an educational advisory tool for decision support. For quarantine or high-value crop losses, verify with your local agricultural extension service.',
    symptoms: [
      'Long, elliptical, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long)',
      'Dark olive fungal sporulation in concentric rings on lesion surfaces in wet weather',
      'Premature death of leaves, reducing photosynthetic capacity and kernel weight'
    ],
    immediateActions: [
      'Check lower canopy for early spread toward the ear leaf.',
      'Avoid high-density planting to improve sunlight exposure.',
      'Evaluate stage of crop: treatments are most economical between V14 (pre-tassel) and R2 (blister stage).'
    ],
    organicTreatment: [
      'Foliar spray of Trichoderma harzianum bio-agent.',
      'Potassium silicate foliar amendment to induce systemic acquired resistance (SAR).'
    ],
    chemicalControl: [
      {
        chemical: 'Propiconazole 25% EC',
        dosage: '1.0 ml per litre of water',
        timing: 'Spray at silking/tasseling if lesions appear below the ear leaf',
        safetyPrecautions: 'Adhere to recommended spray volume (500 L/ha) for thorough canopy coverage.'
      }
    ],
    preventionMethods: [
      'Plant hybrids with known Ht gene resistance against Exserohilum turcicum.',
      'Deep tillage to bury crop debris where fungus overwinters.',
      'Rotate corn with soybeans, cotton, or sorghum.'
    ],
    favorableConditions: 'Moderate temperatures (18°C – 27°C) accompanied by extended periods of heavy dew and overcast skies.',
    economicThreshold: 'Economic damage occurs if lesions appear on or above the ear leaf before tasseling.'
  },

  'sample-bell-pepper-healthy': {
    id: 'diag-pepper-healthy',
    cropName: 'Bell Pepper (Capsicum annuum)',
    condition: 'Healthy',
    diseaseName: 'Healthy Foliage',
    scientificName: 'Normal Capsicum annuum physiology',
    pathogenType: 'Physiological / None',
    confidenceScore: 98.7,
    severity: 'None',
    modelSource: 'AI-Assisted Diagnostic Estimate (Gemini Vision / Agronomy Knowledge Engine)',
    isAiEstimate: true,
    disclaimer: 'Notice: Healthy foliage detected. Continue regular crop monitoring and optimal nutrient maintenance.',
    symptoms: [
      'Foliage shows vibrant, uniform dark green chlorophyll coloration',
      'Intact leaf margins and healthy venation architecture',
      'No chlorotic spots, powdery mildew, viral mosaic, or necrotic spots'
    ],
    immediateActions: [
      'Maintain standard scheduled drip irrigation and balanced fertigation.',
      'Scout fields twice weekly to detect early aphid or whitefly pest pressure.'
    ],
    organicTreatment: [
      'Preventive weekly spray of diluted Panchagavya or seaweed extract (2 ml/L) for plant vigor.',
      'Apply yellow sticky traps (15-20 per acre) to monitor sucking pests.'
    ],
    chemicalControl: [],
    preventionMethods: [
      'Maintain proper canopy spacing to prevent microclimatic humidity spikes.',
      'Ensure soil drainage to avoid root rot pathogens (Phytophthora capsici).',
      'Maintain balanced calcium levels to prevent blossom end rot in developing fruit.'
    ],
    favorableConditions: 'Warm sunny weather (20°C - 30°C) with balanced soil moisture (55-70%).',
    economicThreshold: 'No action required; crop is healthy.'
  },

  'sample-apple-scab': {
    id: 'diag-apple-scab',
    cropName: 'Apple (Malus domestica)',
    condition: 'Diseased',
    diseaseName: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    pathogenType: 'Fungal',
    confidenceScore: 89.5,
    severity: 'Mild',
    modelSource: 'AI-Assisted Diagnostic Estimate (Gemini Vision / Agronomy Knowledge Engine)',
    isAiEstimate: true,
    disclaimer: 'Notice: This AI diagnostic estimate is an educational advisory tool for decision support. For quarantine or high-value crop losses, verify with your local agricultural extension service.',
    symptoms: [
      'Velvety olive-green to dull dark brown spots on upper and lower leaf surfaces',
      'Distorted, puckered, curled leaves that may drop prematurely in mid-summer',
      'Rough, corky, cracked scabby lesions on developing apple fruit skin'
    ],
    immediateActions: [
      'Rake and shred or compost fallen orchard leaves to eliminate overwintering pseudothecia.',
      'Prune inner orchard branches to open the tree center to sunlight and air circulation.'
    ],
    organicTreatment: [
      'Wettable sulfur (3 g/L) or potassium bicarbonate foliar spray during early spring bud break.',
      'Lime sulfur dormant spray before bud swell.'
    ],
    chemicalControl: [
      {
        chemical: 'Captan 50% WP',
        dosage: '2.5 g per litre of water',
        timing: 'Apply at green tip, pink bud, and petal fall growth stages',
        safetyPrecautions: 'Do not apply within 14 days of oil sprays to prevent leaf burn.'
      },
      {
        chemical: 'Difenoconazole 25% EC',
        dosage: '0.3 ml per litre of water',
        timing: 'Curative spray within 72 hours of primary infection rain event',
        safetyPrecautions: 'Adhere to safe harvest interval.'
      }
    ],
    preventionMethods: [
      'Select scab-resistant cultivars (e.g., Enterprise, Liberty, Prima, GoldRush).',
      'Apply 5% urea spray to orchard floor leaves in autumn to accelerate leaf decomposition.',
      'Monitor Mills scab infection periods based on temperature and continuous leaf wetness hours.'
    ],
    favorableConditions: 'Cool, wet spring weather (10°C – 24°C) with continuous free water on foliage for 6 to 15 hours.',
    economicThreshold: 'Orchards with historical scab risk require protective management beginning at green tip.'
  }
};
