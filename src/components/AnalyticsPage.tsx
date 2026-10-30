import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Leaf,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();

  // Disease frequency distribution data
  const diseaseBreakdown = [
    { label: 'Healthy Canopies', count: 18, percentage: 38, color: '#10b981' },
    { label: 'Tomato Late Blight', count: 11, percentage: 23, color: '#ef4444' },
    { label: 'Rice Leaf Blast', count: 8, percentage: 17, color: '#f59e0b' },
    { label: 'Potato Early Blight', count: 6, percentage: 13, color: '#6366f1' },
    { label: 'Corn Leaf Blight', count: 4, percentage: 9, color: '#8b5cf6' }
  ];

  // Soil nutrient quality breakdown across plots
  const soilQualityDistribution = [
    { metric: 'Balanced Soil pH (6.0 - 7.5)', compliantPlots: 74, status: 'Optimal' },
    { metric: 'Sufficient Available Nitrogen (>240 kg/ha)', compliantPlots: 58, status: 'Moderate' },
    { metric: 'Adequate Phosphorus (>22 kg/ha)', compliantPlots: 62, status: 'Good' },
    { metric: 'Optimal Potassium Reservoir (>150 kg/ha)', compliantPlots: 81, status: 'Optimal' }
  ];

  // Monthly farm scan trend
  const monthlyTrends = [
    { month: 'May', scans: 12, diseaseRate: '25%' },
    { month: 'Jun', scans: 19, diseaseRate: '31%' },
    { month: 'Jul', scans: 34, diseaseRate: '41%' }, // monsoon peak
    { month: 'Aug', scans: 28, diseaseRate: '29%' },
    { month: 'Sep', scans: 22, diseaseRate: '18%' },
    { month: 'Oct', scans: 16, diseaseRate: '12%' }
  ];

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Farm Telemetry & Longitudinal Agronomic Intelligence</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
              Farm Health Analytics & Reporting
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Aggregated insights across leaf disease outbreaks, soil fertility balances, and seasonal risk exposure for data-driven precision farming.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={handlePrintSummary}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Executive Farm Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Cumulative Farm Scans</span>
          <p className="text-3xl font-black text-slate-900 font-heading">131</p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1 pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% from last month</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Mean Diagnostic Accuracy</span>
          <p className="text-3xl font-black text-emerald-600 font-heading">94.8%</p>
          <p className="text-xs text-slate-500 pt-1">Multimodal vision confidence</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Overall Soil Quality Index</span>
          <p className="text-3xl font-black text-teal-600 font-heading">82/100</p>
          <p className="text-xs text-slate-500 pt-1">Grade: Optimal Health</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Nutrient Cost Savings</span>
          <p className="text-3xl font-black text-blue-600 font-heading">26.5%</p>
          <p className="text-xs text-slate-500 pt-1">Via split-dose NPK calibration</p>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Disease Distribution Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Pathogen & Disease Incidence Share
              </h3>
              <p className="text-xs text-slate-500">Classification across all processed foliar scans</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {diseaseBreakdown.map(item => (
              <div key={item.label} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span>{item.label}</span>
                  </span>
                  <span className="font-semibold text-slate-600">
                    {item.count} scans ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Epidemiology Note:</strong> 38% of submitted specimens are verified disease-free healthy canopies, demonstrating effective preventive hygiene.
            </p>
          </div>
        </div>

        {/* Right: Soil Nutrient Compliance (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Soil Fertility Compliance Rates
              </h3>
              <p className="text-xs text-slate-500">Percentage of tested farm plots meeting agronomic standards</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {soilQualityDistribution.map(item => (
              <div key={item.metric} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{item.metric}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.compliantPlots}% Plots
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                    style={{ width: `${item.compliantPlots}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Agronomist Notice:</strong> 42% of plots exhibit sub-optimal Nitrogen levels. Recommended corrective action: Incorporate green manuring (Sesbania) prior to Kharif sowing.
            </p>
          </div>
        </div>

      </div>

      {/* Monthly Seasonal Scan Volume Trend */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Seasonal Scan Volume & Infection Rate
            </h3>
            <p className="text-xs text-slate-500">Correlated with monsoon rains and relative humidity surges</p>
          </div>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {monthlyTrends.map(item => (
            <div key={item.month} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-xs font-bold text-slate-500">{item.month}</span>
              <p className="text-xl font-black text-slate-900">{item.scans}</p>
              <span className="text-[10px] font-bold text-amber-700 block bg-amber-50 rounded-md py-0.5">
                {item.diseaseRate} Infection
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
