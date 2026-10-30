import React, { useState } from 'react';
import { 
  CalendarClock, 
  Droplets, 
  Bug, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Info,
  ChevronDown,
  Download
} from 'lucide-react';
import { SoilParameters, calculateFertilizerDosage, CROP_DATABASE } from '../utils/agronomyEngine';
import { useAuth } from '../context/AuthContext';

interface FarmManagementProps {
  currentSoil: SoilParameters;
  initialCropName?: string;
}

export const FarmManagement: React.FC<FarmManagementProps> = ({
  currentSoil,
  initialCropName = 'Tomato'
}) => {
  const { user } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'fertilizer' | 'irrigation' | 'ipm'>('fertilizer');
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCropName);
  const [farmAcres, setFarmAcres] = useState<number>(user?.farmSizeAcres || 3.0);

  const fertilizerPlan = calculateFertilizerDosage(selectedCrop, farmAcres, currentSoil);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <CalendarClock className="w-4 h-4" />
          <span>Precision Input Optimization & Sustainable Farm Stewardship</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Fertilizer, Irrigation & Pest Management
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Scientific nutrient dosing, climate-adaptive irrigation scheduling, and ecological Integrated Pest Management (IPM) designed to prevent over-fertilization, conserve groundwater, and protect harvest margins.
        </p>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          onClick={() => setActiveSubTab('fertilizer')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center space-x-2 ${
            activeSubTab === 'fertilizer'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Fertilizer Dosage & Schedule</span>
        </button>

        <button
          onClick={() => setActiveSubTab('irrigation')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center space-x-2 ${
            activeSubTab === 'irrigation'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Irrigation Timing & Moisture</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ipm')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center space-x-2 ${
            activeSubTab === 'ipm'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Integrated Pest Management (IPM)</span>
        </button>
      </div>

      {/* SUBTAB 1: FERTILIZER DOSAGE CALCULATOR */}
      {activeSubTab === 'fertilizer' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Crop Selection & Area */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Crop Variety
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {CROP_DATABASE.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Farm Cultivation Area (Acres)
              </label>
              <input
                type="number"
                min="0.5"
                max="500"
                step="0.5"
                value={farmAcres}
                onChange={(e) => setFarmAcres(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-0.5">
              <span className="font-bold text-slate-800">Grounding Nutrients:</span>
              <p>Soil N: {currentSoil.nitrogen} • P: {currentSoil.phosphorus} • K: {currentSoil.potassium} kg/ha</p>
            </div>
          </div>

          {/* Fertilizer Quantities Output Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Urea (46% N)
              </span>
              <p className="text-3xl font-black text-slate-900 font-heading">
                {fertilizerPlan.ureaKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </p>
              <p className="text-[11px] text-slate-500">
                ~{(fertilizerPlan.ureaKg / 45).toFixed(1)} standard 45kg bags
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                DAP (18% N, 46% P)
              </span>
              <p className="text-3xl font-black text-blue-700 font-heading">
                {fertilizerPlan.dapKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </p>
              <p className="text-[11px] text-slate-500">
                ~{(fertilizerPlan.dapKg / 50).toFixed(1)} standard 50kg bags
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                MOP (60% K2O Potash)
              </span>
              <p className="text-3xl font-black text-amber-700 font-heading">
                {fertilizerPlan.mopKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </p>
              <p className="text-[11px] text-slate-500">
                ~{(fertilizerPlan.mopKg / 50).toFixed(1)} standard 50kg bags
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Enriched Compost
              </span>
              <p className="text-3xl font-black text-emerald-700 font-heading">
                {fertilizerPlan.organicCompostKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Vermicompost / Farmyard Manure
              </p>
            </div>

          </div>

          {/* 3-Stage Application Calendar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Growth-Stage Split Application Schedule
                </h3>
                <p className="text-xs text-slate-500">Prevents nutrient runoff leaching and matches plant uptake curve</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>
            </div>

            <div className="space-y-4">
              {fertilizerPlan.applicationSchedule.map((stage, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full self-start">
                      {stage.timing}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{stage.stage}</h4>
                  </div>
                  <div className="text-xs text-slate-700 pt-1">
                    <p className="font-semibold text-slate-900">Formulation Dosing:</p>
                    <p className="text-emerald-900 font-mono bg-white p-2 rounded-lg border border-slate-200 mt-0.5">
                      {stage.nutrients}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    <strong>Agronomic Tip:</strong> {stage.tips}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: IRRIGATION TIMING & MOISTURE */}
      {activeSubTab === 'irrigation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              Crop Water Budget & Evapotranspiration Guide
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl border border-slate-200 bg-blue-50/40 space-y-2">
                <span className="text-xs font-bold text-blue-900 flex items-center space-x-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>Drip Fertigation (Recommended)</span>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Delivers water directly to the rhizosphere at 2-4 L/hr emitters. Reduces water evaporation by 45-60% and maintains consistent root zone moisture.
                </p>
                <div className="text-[11px] font-bold text-blue-800">
                  Target: 45 - 60 minutes alternate days
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                  <Droplets className="w-4 h-4 text-slate-500" />
                  <span>Sprinkler Irrigation</span>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Suitable for wheat, mustard, and pulses on undulating topography. Run during early dawn hours to minimize wind drift and fungal leaf wetness.
                </p>
                <div className="text-[11px] font-bold text-slate-700">
                  Target: 2 hours every 7-9 days
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                  <Droplets className="w-4 h-4 text-slate-500" />
                  <span>Furrow / Basin Flood</span>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional method for paddy rice or sugarcane. Requires field leveling and laser grading to avoid deep percolation water waste.
                </p>
                <div className="text-[11px] font-bold text-slate-700">
                  Maintain 3-5 cm standing water (Rice)
                </div>
              </div>

            </div>

            {/* Critical Growth Stages Water Sensitivity */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Critical Moisture Stress Windows (Never Allow Drought)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900">Crown Root Initiation & Tillering:</strong> Moisture stress here permanently caps panicle count and root penetration depth.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900">Flowering & Anthesis Stage:</strong> Pollen sterility spikes if temperature exceeds 35°C without adequate transpirational cooling water.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900">Grain Filling & Fruit Sizing:</strong> Water deficit leads to shriveled grains or blossom-end rot in solanaceous vegetables.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: INTEGRATED PEST MANAGEMENT (IPM) */}
      {activeSubTab === 'ipm' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              Ecological Integrated Pest Management (IPM) Protocols
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tier 1: Cultural & Mechanical</span>
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                  <li>• Install yellow sticky traps (15/acre) for whiteflies & aphids.</li>
                  <li>• Install blue sticky traps for thrips.</li>
                  <li>• Install pheromone traps (5/acre) to monitor bollworm & stem borer.</li>
                  <li>• Plant African marigold border rows as trap crop.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-green-200 bg-green-50/50 space-y-2">
                <span className="text-xs font-bold text-green-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Tier 2: Biological Control</span>
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                  <li>• Spray Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Azadirachtin.</li>
                  <li>• Release Trichogramma egg parasitoids (50,000/ha) at 10-day intervals.</li>
                  <li>• Foliar spray of Beauveria bassiana (5g/L) for caterpillars.</li>
                  <li>• Conserve predatory spiders, ladybird beetles, and lacewings.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Tier 3: Targeted Chemical</span>
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                  <li>• Use ONLY when pest exceeds Economic Injury Level (EIL).</li>
                  <li>• Rotate insecticide classes (MOA) to avoid pest resistance.</li>
                  <li>• Never spray during pollinator peak foraging (10am - 3pm).</li>
                  <li>• Strictly enforce Pre-Harvest Intervals (PHI) before picking.</li>
                </ul>
              </div>

            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
              <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p>
                <strong>IPM Golden Rule:</strong> Chemical pesticides are a last-resort intervention. Maintaining natural biocontrol agents and healthy soil microbiome prevents 80% of endemic pest resurgence.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
