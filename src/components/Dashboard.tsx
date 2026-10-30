import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  ScanSearch, 
  FlaskConical, 
  Wheat, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  Info
} from 'lucide-react';
import { ActiveTab, AnalysisRecord, WeatherData } from '../types';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectRecord?: (record: AnalysisRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectRecord }) => {
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisRecord[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  useEffect(() => {
    // Fetch live weather data
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (data.success) {
          setWeather({
            temperature: data.current.temperature,
            humidity: data.current.humidity,
            windSpeed: data.current.windSpeed,
            precipitation: data.current.precipitation,
            weatherCode: data.current.weatherCode,
            sprayAdvisory: data.sprayAdvisory
          });
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      } finally {
        setWeatherLoading(false);
      }
    };

    // Fetch user recent analyses
    const fetchAnalyses = async () => {
      try {
        setLoadingAnalyses(true);
        const res = await fetch(`/api/analyses?userId=${user?.id || 'farmer-1'}&userRole=${user?.role || 'farmer'}`);
        const data = await res.json();
        if (data.success) {
          setRecentAnalyses(data.analyses);
        }
      } catch (err) {
        console.warn('Analyses fetch error:', err);
      } finally {
        setLoadingAnalyses(false);
      }
    };

    fetchWeather();
    fetchAnalyses();
  }, [user]);

  const totalScans = recentAnalyses.length;
  const diseasedScans = recentAnalyses.filter(a => a.status === 'Diseased').length;
  const healthyScans = recentAnalyses.filter(a => a.status === 'Healthy').length;
  const soilScans = recentAnalyses.filter(a => a.type === 'soil_analysis').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Farmer Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Farm Operations Active • {user?.location || 'Central Farm Belt'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Welcome back, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Farm size: <strong className="text-white">{user?.farmSizeAcres || 5.5} Acres</strong> • Soil: <strong className="text-white">{user?.soilType || 'Alluvial Loam'}</strong> • Crops: <strong className="text-white">{user?.primaryCrops?.join(', ') || 'Tomato, Wheat'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('leaf_disease')}
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <ScanSearch className="w-4 h-4" />
            <span>New Leaf Scan</span>
          </button>
          <button
            onClick={() => onNavigate('soil_analysis')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Test Soil</span>
          </button>
        </div>
      </div>

      {/* Weather & Spray Advisory Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Microclimate & Agrochemical Spray Window
              </h2>
              <p className="text-xs text-slate-500">Live meteorological observations from Open-Meteo station</p>
            </div>
          </div>

          {weather?.sprayAdvisory && (
            <div className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
              weather.sprayAdvisory.condition === 'Ideal'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : weather.sprayAdvisory.condition === 'Caution'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                weather.sprayAdvisory.condition === 'Ideal' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              <span>Spray Window: {weather.sprayAdvisory.condition}</span>
            </div>
          )}
        </div>

        {weatherLoading ? (
          <div className="py-6 text-center text-xs text-slate-400">Loading live weather telemetries...</div>
        ) : weather ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center space-x-3">
              <Thermometer className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Temperature</p>
                <p className="text-lg font-bold text-slate-900">{weather.temperature}°C</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center space-x-3">
              <Droplets className="w-6 h-6 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Humidity</p>
                <p className="text-lg font-bold text-slate-900">{weather.humidity}%</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center space-x-3">
              <Wind className="w-6 h-6 text-teal-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Wind Velocity</p>
                <p className="text-lg font-bold text-slate-900">{weather.windSpeed} km/h</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center space-x-3">
              <CloudSun className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Precipitation</p>
                <p className="text-lg font-bold text-slate-900">{weather.precipitation} mm</p>
              </div>
            </div>

          </div>
        ) : null}

        {weather?.sprayAdvisory && (
          <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p><strong>Agronomist Spray Advisory:</strong> {weather.sprayAdvisory.reason}</p>
          </div>
        )}
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigate('leaf_disease')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ScanSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Diagnose Leaf
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload crop photo for instant Gemini vision diagnosis & treatment.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1 pt-1">
            <span>Run Scanner</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('soil_analysis')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Soil Health Card
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Input NPK, pH & moisture for 0-100 index and lime/gypsum doses.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1 pt-1">
            <span>Evaluate Soil</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('crop_recommend')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Crop Matcher
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ranked crop suitability matching your soil nutrients & climate.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1 pt-1">
            <span>Find Best Crops</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('fertilizer_planner')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Fertilizer & IPM
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Exact Urea, DAP & MOP dosages per acre + 3-stage application schedule.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1 pt-1">
            <span>Generate Schedule</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Total Farm Scans</p>
          <p className="text-2xl font-extrabold text-slate-900 font-heading mt-1">{totalScans}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Saved to persistent storage</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Diseased Folia Detected</p>
          <p className="text-2xl font-extrabold text-amber-600 font-heading mt-1">{diseasedScans}</p>
          <p className="text-[11px] text-slate-500 mt-1">{Math.round((diseasedScans / (totalScans || 1)) * 100)}% of leaf scans</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Healthy Canopies</p>
          <p className="text-2xl font-extrabold text-emerald-600 font-heading mt-1">{healthyScans}</p>
          <p className="text-[11px] text-slate-500 mt-1">Pathogen-free plots</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Soil Health Profiles</p>
          <p className="text-2xl font-extrabold text-teal-600 font-heading mt-1">{soilScans}</p>
          <p className="text-[11px] text-slate-500 mt-1">NPK profiles mapped</p>
        </div>

      </div>

      {/* Recent Farm Analyses & Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Recent Farm Records & Analyses
            </h2>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingAnalyses ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading history records...</div>
        ) : recentAnalyses.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm text-slate-600">No analyses logged yet.</p>
            <button
              onClick={() => onNavigate('leaf_disease')}
              className="text-xs text-emerald-600 font-bold underline"
            >
              Scan your first crop leaf now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentAnalyses.slice(0, 4).map(item => (
              <div 
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => {
                  if (item.type === 'leaf_disease') onNavigate('leaf_disease');
                  else onNavigate('soil_analysis');
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${
                    item.type === 'leaf_disease' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.type === 'leaf_disease' ? <ScanSearch className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500">
                      {item.cropOrSoil} • {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.status === 'Healthy' || item.status === 'Optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
