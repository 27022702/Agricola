import { SoilParameters, SoilAnalysisResult, CropRecommendation, FertilizerCalculation } from './utils/agronomyEngine';
import { DiseaseDiagnosis, SampleLeaf } from './utils/leafDiseases';

export type ActiveTab = 
  | 'landing'
  | 'dashboard'
  | 'leaf_disease'
  | 'soil_analysis'
  | 'crop_recommend'
  | 'fertilizer_planner'
  | 'history'
  | 'analytics'
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmSizeAcres: number;
  soilType: string;
  primaryCrops: string[];
  role: 'farmer' | 'admin';
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  type: 'leaf_disease' | 'soil_analysis';
  timestamp: string;
  title: string;
  cropOrSoil: string;
  status: 'Healthy' | 'Diseased' | 'Optimal' | 'Attention Required';
  details: DiseaseDiagnosis | {
    params: SoilParameters;
    result: SoilAnalysisResult;
    recommendedCrops?: CropRecommendation[];
    recommendedCrop?: string;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  sprayAdvisory: {
    condition: 'Ideal' | 'Caution' | 'Unfavorable';
    reason: string;
  };
}
