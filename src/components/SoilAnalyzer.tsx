import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle, 
  Layers, 
  Thermometer, 
  Droplets,
  Wheat,
  Calculator
} from 'lucide-react';
import { SoilParameters, SoilAnalysisResult, evaluateSoil } from '../utils/agronomyEngine';
import { ActiveTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface SoilAnalyzerProps {
  onNavigate: (tab: ActiveTab) => void;
  onSetSoilState?: (soil: SoilParameters) => void;
}

export const SoilAnalyzer: React.FC<SoilAnalyzerProps> = ({ onNavigate, onSetSoilState }) => {
  const { user } = useAuth();

  // Soil parameters state with balanced defaults
  const [params, setParams] = useState<SoilParameters>({
    moisture: 58,
    temperature: 26,
    humidity: 62,
    ph: 6.8,
    nitrogen: 280,
    phosphorus: 32,
    potassium: 220,
    soilType: 'Loamy Soil'
  });

  const [farmLabel, setFarmLabel] = useState<string>('Plot North-1');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>(() => evaluateSoil(params));
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Preset soil profiles for instant demonstration
  const handlePreset = (preset: {
    label: string;
    type: string;
    ph: number;
    n: number;
    p: number;
    k: number;
    moisture: number;
    temp: number;
  }) => {
    const updated: SoilParameters = {
      ...params,
      soilType: preset.type,
      ph: preset.ph,
      nitrogen: preset.n,
      phosphorus: preset.p,
      potassium: preset.k,
      moisture: preset.moisture,
      temperature: preset.temp
    };
    setParams(updated);
    setFarmLabel(preset.label);
    const evaluated = evaluateSoil(updated);
    setResult(evaluated);
    if (onSetSoilState) onSetSoilState(updated);
  };

  const handleInputChange = (key: keyof SoilParameters, value: number | string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const runSoilEvaluation = async () => {
    try {
      setAnalyzing(true);
      setSavedSuccess(false);

      const evaluated = evaluateSoil(params);
      setResult(evaluated);
      if (onSetSoilState) onSetSoilState(params);

      // Save to database
      await fetch('/api/analyze-soil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          userId: user?.id || 'farmer-1',
          userName: user?.name || 'Farmer',
          farmLabel
        })
      });

      setSavedSuccess(true);
    } catch (err) {
      console.warn('Failed to save soil test to server:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <FlaskConical className="w-4 h-4" />
          <span>Physicochemical Soil Testing & Nutrient Health Card</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Soil NPK & Health Card Analysis
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Enter laboratory or field sensor soil readings. Our agronomic engine computes the composite Soil Health Index (0-100), detects macro-nutrient imbalances, prescribes precise pH buffering amendments, and unlocks tailored crop suitability matching.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Buttons for Instant Evaluation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Demonstration Profiles
              </span>
              <span className="text-[11px] text-slate-400">Click to apply</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handlePreset({
                  label: 'Fertile Alluvial Plot',
                  type: 'Alluvial Loam',
                  ph: 6.8,
                  n: 310,
                  p: 35,
                  k: 230,
                  moisture: 60,
                  temp: 25
                })}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-colors"
              >
                <p className="font-bold text-emerald-950">Fertile Loam</p>
                <p className="text-[10px] text-emerald-700">Balanced NPK & 6.8 pH</p>
              </button>

              <button
                onClick={() => handlePreset({
                  label: 'Sandy Drought Zone',
                  type: 'Sandy Soil',
                  ph: 7.2,
                  n: 110,
                  p: 14,
                  k: 75,
                  moisture: 25,
                  temp: 32
                })}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-left transition-colors"
              >
                <p className="font-bold text-amber-950">Nutrient Deficient</p>
                <p className="text-[10px] text-amber-700">Low N, P, K & 25% Moisture</p>
              </button>

              <button
                onClick={() => handlePreset({
                  label: 'Acidic Highland Clay',
                  type: 'Clay Loam',
                  ph: 5.1,
                  n: 240,
                  p: 18,
                  k: 160,
                  moisture: 72,
                  temp: 20
                })}
                className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-left transition-colors"
              >
                <p className="font-bold text-rose-950">Acidic Soil</p>
                <p className="text-[10px] text-rose-700">pH 5.1 (Needs Lime)</p>
              </button>

              <button
                onClick={() => handlePreset({
                  label: 'Arid Sodic Plot',
                  type: 'Black Cotton',
                  ph: 8.4,
                  n: 360,
                  p: 40,
                  k: 320,
                  moisture: 42,
                  temp: 30
                })}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-left transition-colors"
              >
                <p className="font-bold text-purple-950">Alkaline Sodic</p>
                <p className="text-[10px] text-purple-700">pH 8.4 (Needs Gypsum)</p>
              </button>
            </div>
          </div>

          {/* Manual Input Parameters Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Soil & Nutrient Parameters</span>
              <span className="text-xs text-slate-500 font-normal">Plot: {farmLabel}</span>
            </h2>

            {/* Farm Plot Name & Soil Texture */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plot / Field Label
                </label>
                <input
                  type="text"
                  value={farmLabel}
                  onChange={(e) => setFarmLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Soil Texture Type
                </label>
                <select
                  value={params.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Loamy Soil">Loamy Soil</option>
                  <option value="Alluvial Loam">Alluvial Loam</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Black Cotton (Vertisol)">Black Cotton (Vertisol)</option>
                  <option value="Red Laterite">Red Laterite</option>
                </select>
              </div>
            </div>

            {/* pH Slider & Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <span>Soil pH Level</span>
                  <span className="text-slate-400 font-normal">(0 - 14 scale)</span>
                </label>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {params.ph.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                value={params.ph}
                onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Strongly Acidic (4.0)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (9.5)</span>
              </div>
            </div>

            {/* Nitrogen (N) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">
                  Nitrogen (N) <span className="text-slate-400 font-normal">kg/ha</span>
                </label>
                <input
                  type="number"
                  min="30"
                  max="600"
                  value={params.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs text-right font-bold rounded-lg border border-slate-200"
                />
              </div>
              <input
                type="range"
                min="50"
                max="550"
                step="5"
                value={params.nitrogen}
                onChange={(e) => handleInputChange('nitrogen', parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Low (&lt;240)</span>
                <span>Optimal (280-400)</span>
                <span>High (&gt;450)</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">
                  Phosphorus (P) <span className="text-slate-400 font-normal">kg/ha</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={params.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs text-right font-bold rounded-lg border border-slate-200"
                />
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="1"
                value={params.phosphorus}
                onChange={(e) => handleInputChange('phosphorus', parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Low (&lt;15)</span>
                <span>Optimal (22-55)</span>
                <span>High (&gt;70)</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">
                  Potassium (K) <span className="text-slate-400 font-normal">kg/ha</span>
                </label>
                <input
                  type="number"
                  min="40"
                  max="500"
                  value={params.potassium}
                  onChange={(e) => handleInputChange('potassium', Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs text-right font-bold rounded-lg border border-slate-200"
                />
              </div>
              <input
                type="range"
                min="50"
                max="450"
                step="5"
                value={params.potassium}
                onChange={(e) => handleInputChange('potassium', parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Low (&lt;140)</span>
                <span>Optimal (150-300)</span>
                <span>High (&gt;350)</span>
              </div>
            </div>

            {/* Environmental readings (Moisture & Temperature) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Soil Moisture (%)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={params.moisture}
                  onChange={(e) => handleInputChange('moisture', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={params.temperature}
                  onChange={(e) => handleInputChange('temperature', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={runSoilEvaluation}
              disabled={analyzing}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Soil Health Index...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Soil Health Card</span>
                </>
              )}
            </button>

            {savedSuccess && (
              <p className="text-xs text-emerald-700 font-medium text-center">
                ✓ Soil health profile computed and saved to history!
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Soil Health Card & Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Health Score Gauge Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Official Soil Health Index
                  </span>
                  <h3 className="text-2xl font-black font-heading mt-0.5">
                    Grade: {result.healthGrade} Health
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mt-1 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {/* Circular Score Indicator */}
                <div className="self-start sm:self-center flex flex-col items-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-700"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={result.healthIndex >= 75 ? 'text-emerald-400' : result.healthIndex >= 50 ? 'text-amber-400' : 'text-rose-400'}
                        strokeDasharray={`${result.healthIndex}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black font-heading text-white">{result.healthIndex}</span>
                      <span className="text-[10px] text-slate-400 block -mt-1">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Macro Nutrients (N - P - K) Scoreboard */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Macronutrient Breakdown (NPK)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Nitrogen */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Nitrogen (N)</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        result.nitrogen.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {result.nitrogen.status}
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{params.nitrogen} <span className="text-xs font-normal text-slate-500">kg/ha</span></p>
                    <p className="text-[11px] text-slate-600 leading-tight">{result.nitrogen.recommendation}</p>
                  </div>

                  {/* Phosphorus */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Phosphorus (P)</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        result.phosphorus.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {result.phosphorus.status}
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{params.phosphorus} <span className="text-xs font-normal text-slate-500">kg/ha</span></p>
                    <p className="text-[11px] text-slate-600 leading-tight">{result.phosphorus.recommendation}</p>
                  </div>

                  {/* Potassium */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Potassium (K)</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        result.potassium.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {result.potassium.status}
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{params.potassium} <span className="text-xs font-normal text-slate-500">kg/ha</span></p>
                    <p className="text-[11px] text-slate-600 leading-tight">{result.potassium.recommendation}</p>
                  </div>

                </div>
              </div>

              {/* pH & Moisture Evaluation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Soil Reaction (pH):</span>
                    <span className="text-xs font-bold text-slate-900">{params.ph.toFixed(1)}</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700">{result.phStatus}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{result.phRecommendation}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Moisture Profile:</span>
                    <span className="text-xs font-bold text-slate-900">{params.moisture}%</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-700">{result.moistureStatus}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {params.moisture < 35 
                      ? 'Critically dry: Mulching and immediate drip irrigation advised.' 
                      : params.moisture > 75 
                      ? 'Waterlogged: Ensure drainage channels are unblocked to prevent root asphyxiation.' 
                      : 'Optimal soil moisture holding capacity for active nutrient uptake.'}
                  </p>
                </div>

              </div>

              {/* Soil Amendments Prescription */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Prescribed Soil Amendments & Reclamation Actions</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {result.amendments.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="font-bold text-emerald-700">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps: Direct Links to Crop Matcher & Fertilizer Planner */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Next Step in Farm Workflow:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('crop_recommend')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Wheat className="w-3.5 h-3.5" />
                    <span>View Matching Crops</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('fertilizer_planner')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Calculate Fertilizer</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-3 min-h-[360px] flex flex-col items-center justify-center">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Enter parameters and calculate</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
