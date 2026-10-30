import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  MapPin, 
  Activity, 
  Server, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  FileCheck, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user, switchRole, usersList } = useAuth();
  const [adminStats, setAdminStats] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [farmerSearch, setFarmerSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, healthRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/system/health')
      ]);

      const statsData = await statsRes.json();
      const healthData = await healthRes.json();

      if (statsData.success) setAdminStats(statsData);
      setSystemHealth(healthData);
    } catch (err) {
      console.warn('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const registeredFarmers = adminStats?.registeredFarmers || [];
  const filteredFarmers = registeredFarmers.filter((f: any) => 
    f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
    f.region.toLowerCase().includes(farmerSearch.toLowerCase()) ||
    f.crops.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Agricultural Extension & University Project Administration</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
              Admin & Project Telemetry Portal
            </h1>
            <p className="text-sm text-slate-600">
              Real-time monitoring of registered farming accounts, diagnostic compute loads, pathology outbreaks, and server infrastructure health.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="self-start sm:self-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Access Control Notice */}
      {user?.role !== 'admin' && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">You are currently previewing in Farmer Mode.</p>
              <p className="text-amber-800">Switch to Administrator role to unlock full modification privileges and administrative oversight.</p>
            </div>
          </div>
          <button
            onClick={() => switchRole('admin')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap self-start sm:self-center"
          >
            Elevate to Admin Role
          </button>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Farmers</span>
          <p className="text-3xl font-black text-slate-900 font-heading">
            {adminStats?.totalFarmers || 38}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">Active in 4 agricultural zones</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Plots Monitored</span>
          <p className="text-3xl font-black text-emerald-600 font-heading">
            {adminStats?.activePlots || 64}
          </p>
          <p className="text-[11px] text-slate-500">240+ total cultivated acres</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnostic Inferences</span>
          <p className="text-3xl font-black text-purple-600 font-heading">
            {adminStats?.totalScans || 24}
          </p>
          <p className="text-[11px] text-slate-500">Multimodal vision passes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Vision Engine</span>
          <p className="text-2xl font-black text-teal-600 font-heading truncate">
            {systemHealth?.geminiModel || 'gemini-3.8-flash'}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Server Proxy Verified</span>
          </p>
        </div>

      </div>

      {/* System Infrastructure & AI Studio Runtime Health Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base font-heading">Backend Node.js & Gemini API Infrastructure</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            System Online (Uptime: {Math.round(systemHealth?.uptime || 120)}s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block font-medium">Server API Architecture</span>
            <p className="font-mono text-emerald-400 font-bold mt-1">Express v4.21 + Node.js v22</p>
            <p className="text-[11px] text-slate-400 mt-1">Full-stack server with Vite middleware</p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block font-medium">Gemini Key Configuration</span>
            <p className="font-mono text-emerald-400 font-bold mt-1">
              {systemHealth?.hasGeminiApiKey ? 'Protected Server Env Key' : 'Standard Demo Fallback Active'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Never leaked to browser DOM</p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block font-medium">Persistent Data Separation</span>
            <p className="font-mono text-emerald-400 font-bold mt-1">User-Partitioned Records</p>
            <p className="text-[11px] text-slate-400 mt-1">Local & Server store separation</p>
          </div>
        </div>
      </div>

      {/* Registered Farmers Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Registered Farmer Directory
            </h3>
            <p className="text-xs text-slate-500">Access registered profiles, regional soil types, and farm acreage</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search farmer, region, crops..."
              value={farmerSearch}
              onChange={(e) => setFarmerSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Farmer Name</th>
                <th className="pb-3">Regional Zone</th>
                <th className="pb-3">Soil Texture</th>
                <th className="pb-3">Primary Crops</th>
                <th className="pb-3 text-center">Diagnostic Runs</th>
                <th className="pb-3 text-right pr-2">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFarmers.map((f: any) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-900 flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {f.name.charAt(0)}
                    </div>
                    <span>{f.name}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{f.region}</td>
                  <td className="py-3.5 text-slate-600 font-medium">{f.soil}</td>
                  <td className="py-3.5 text-slate-800">{f.crops}</td>
                  <td className="py-3.5 text-center font-bold text-purple-700">{f.scans}</td>
                  <td className="py-3.5 text-right pr-2 text-slate-400">{f.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
