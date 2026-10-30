import React, { useState, useEffect } from 'react';
import { 
  Wheat, 
  Sparkles, 
  Droplets, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Filter, 
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SoilParameters, CropRecommendation, recommendCrops } from '../utils/agronomyEngine';
import { ActiveTab } from '../types';

interface CropRecommenderProps {
  currentSoil: SoilParameters;
  onNavigate: (tab: ActiveTab) => void;
  onSelectCropForFertilizer?: (cropName: string) => void;
}

export const CropRecommender: React.FC<CropRecommenderProps> = ({
  currentSoil,
  onNavigate,
  onSelectCropForFertilizer
}) => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedCropRec, setSelectedCropRec] = useState<CropRecommendation | null>(null);

  useEffect(() => {
    const list = recommendCrops(currentSoil);
    setRecommendations(list);
    if (list.length > 0 && !selectedCropRec) {
      setSelectedCropRec(list[0]);
    }
  }, [currentSoil]);

  const categories = ['All', 'Cereal', 'Pulse', 'Cash Crop', 'Vegetable', 'Oilseed'];

  const filteredList = filterCategory === 'All'
    ? recommendations
    : recommendations.filter(r => r.crop.category === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <Wheat className="w-4 h-4" />
          <span>Agricultural Suitability & Ecological Matching</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Precision Crop Suitability Matcher
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Based on your current soil profile (pH {currentSoil.ph}, N: {currentSoil.nitrogen}, P: {currentSoil.phosphorus}, K: {currentSoil.potassium} kg/ha, Moisture {currentSoil.moisture}%), our agronomic algorithm evaluates and ranks compatible crops to optimize yield potential and minimize input costs.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigate('soil_analysis')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
        >
          <span>Adjust Soil Nutrients</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Ranked Crop Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3">
            {filteredList.map((rec, index) => {
              const isSelected = selectedCropRec?.crop.id === rec.crop.id;
              return (
                <div
                  key={rec.crop.id}
                  onClick={() => setSelectedCropRec(rec)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        index === 0
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : index === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900">{rec.crop.name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {rec.crop.category}
                          </span>
                        </div>
                        <p className="text-xs italic text-slate-500">{rec.crop.scientificName}</p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center space-x-2 sm:text-right shrink-0">
                      <div>
                        <p className="text-lg font-black text-emerald-600 font-heading">
                          {rec.matchScore}%
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.suitability === 'Highly Recommended'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.suitability === 'Recommended'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.suitability}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                    {rec.crop.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{rec.crop.season}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.crop.growthDurationDays} days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{rec.crop.expectedYield}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Agronomic Details for Selected Crop (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          
          {selectedCropRec ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    Cultivation Blueprint
                  </span>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {selectedCropRec.matchScore}% Compatibility
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-heading mt-1">
                  {selectedCropRec.crop.name}
                </h3>
                <p className="text-xs italic text-slate-500">
                  {selectedCropRec.crop.scientificName} • {selectedCropRec.crop.season}
                </p>
              </div>

              {/* Agronomic Parameter Match Matrix */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Target pH Range:</span>
                  <strong className="text-slate-800">{selectedCropRec.crop.idealPh[0]} - {selectedCropRec.crop.idealPh[1]} (Current: {currentSoil.ph})</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Water Requirement:</span>
                  <strong className="text-blue-700">{selectedCropRec.crop.waterRequirement}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Harvest Cycle:</span>
                  <strong className="text-slate-800">{selectedCropRec.crop.growthDurationDays} Days</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Yield Potential:</span>
                  <strong className="text-emerald-700">{selectedCropRec.crop.expectedYield}</strong>
                </div>
              </div>

              {/* Compatibility Strengths */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Agronomic Advantages</span>
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {selectedCropRec.reasons.map((r, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations / Soil Corrections Needed */}
              {selectedCropRec.limitations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Agronomic Considerations</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    {selectedCropRec.limitations.map((l, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Step Action: Fertilizer Schedule for this crop */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (onSelectCropForFertilizer) {
                      onSelectCropForFertilizer(selectedCropRec.crop.name);
                    }
                    onNavigate('fertilizer_planner');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Generate Fertilizer & IPM Plan for {selectedCropRec.crop.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              Select a crop from the list to view its agronomic profile.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
