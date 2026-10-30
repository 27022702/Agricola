import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Download, 
  ScanSearch, 
  FlaskConical, 
  Calendar, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { AnalysisRecord } from '../types';
import { useAuth } from '../context/AuthContext';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'leaf_disease' | 'soil_analysis'>('all');
  const [activeModalRecord, setActiveModalRecord] = useState<AnalysisRecord | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analyses?userId=${user?.id || 'farmer-1'}&userRole=${user?.role || 'farmer'}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.analyses);
      }
    } catch (err) {
      console.warn('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDeleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;

    try {
      const res = await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        if (activeModalRecord?.id === id) setActiveModalRecord(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Type', 'Title', 'Crop/Plot', 'Status', 'Date', 'Farmer'];
    const rows = records.map(r => [
      r.id,
      r.type,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.cropOrSoil.replace(/"/g, '""')}"`,
      r.status,
      r.timestamp,
      r.userName
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrismart_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cropOrSoil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Longitudinal Pathology & Soil Testing Archive</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
              Farm Analysis History
            </h1>
            <p className="text-sm text-slate-600">
              Complete persistent database of all leaf diagnostic scans and physicochemical soil tests logged by {user?.name || 'this farm'}.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={records.length === 0}
            className="self-start sm:self-center px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crop, disease, or plot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              typeFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Logs ({records.length})
          </button>
          <button
            onClick={() => setTypeFilter('leaf_disease')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              typeFilter === 'leaf_disease' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Leaf Scans
          </button>
          <button
            onClick={() => setTypeFilter('soil_analysis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              typeFilter === 'soil_analysis' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Soil Tests
          </button>
        </div>
      </div>

      {/* History Records Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Loading farm historical analyses...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
          <p className="text-sm font-bold text-slate-800">No matching analysis records found.</p>
          <p className="text-xs text-slate-500">Try clearing your search query or run a new leaf disease scan.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredRecords.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveModalRecord(item)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    item.type === 'leaf_disease' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.type === 'leaf_disease' ? <ScanSearch className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Healthy' || item.status === 'Optimal'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.cropOrSoil} • Tested by {item.userName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className="text-right text-xs text-slate-400">
                    <p className="font-medium text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</p>
                    <p className="text-[11px]">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalRecord(item);
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="View Full Diagnosis"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteRecord(item.id, e)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Inspection Modal */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  {activeModalRecord.type === 'leaf_disease' ? 'Leaf Pathology Diagnosis Log' : 'Soil Nutrient Test Log'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {activeModalRecord.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Log ID: <span className="font-mono text-slate-700">{activeModalRecord.id}</span> • Recorded: {new Date(activeModalRecord.timestamp).toLocaleString()}
            </div>

            {/* If Leaf Disease Record */}
            {activeModalRecord.type === 'leaf_disease' && activeModalRecord.details && (() => {
              const leafDetails = activeModalRecord.details as any;
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-sm">{leafDetails.diseaseName}</span>
                      <span className="font-black text-emerald-700">{leafDetails.confidenceScore}% Confidence</span>
                    </div>
                    <p className="italic text-slate-500">{leafDetails.scientificName}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800">Observed Symptoms:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {leafDetails.symptoms?.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800">Action Plan & Remedies:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {leafDetails.immediateActions?.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* If Soil Test Record */}
            {activeModalRecord.type === 'soil_analysis' && activeModalRecord.details && (() => {
              const soilDetails = activeModalRecord.details as any;
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-sm">Overall Soil Health Grade</span>
                      <span className="font-black text-emerald-700 text-base">{soilDetails.result?.healthIndex}/100</span>
                    </div>
                    <p className="text-slate-600">{soilDetails.result?.summary}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Nitrogen (N)</span>
                      <strong className="text-slate-900">{soilDetails.params?.nitrogen} kg/ha</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Phosphorus (P)</span>
                      <strong className="text-slate-900">{soilDetails.params?.phosphorus} kg/ha</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Potassium (K)</span>
                      <strong className="text-slate-900">{soilDetails.params?.potassium} kg/ha</strong>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
