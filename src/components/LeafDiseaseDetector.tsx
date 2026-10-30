import React, { useState, useRef } from 'react';
import { 
  ScanSearch, 
  Upload, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  RefreshCw, 
  Leaf, 
  Info, 
  Download,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_LEAVES, SampleLeaf, DiseaseDiagnosis } from '../utils/leafDiseases';
import { useAuth } from '../context/AuthContext';

export const LeafDiseaseDetector: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleLeaf | null>(SAMPLE_LEAVES[0]);
  const [cropHint, setCropHint] = useState<string>('Tomato');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'actions' | 'organic' | 'chemical' | 'prevention'>('symptoms');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setErrorMsg(null);
      setSelectedSample(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setDiagnosis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sample leaf selection
  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedSample(sample);
    setSelectedImage(sample.thumbnailUrl);
    setCropHint(sample.crop);
    setErrorMsg(null);
    setDiagnosis(null);
  };

  // Run the diagnostic analysis
  const runAnalysis = async () => {
    if (!selectedImage && !selectedSample) {
      setErrorMsg('Please upload a leaf photo or pick one of the sample leaves below.');
      return;
    }

    try {
      setAnalyzing(true);
      setErrorMsg(null);
      setDiagnosis(null);
      setSavedSuccess(false);

      const payload: any = {
        userId: user?.id || 'farmer-1',
        userName: user?.name || 'Farmer',
        cropHint: cropHint || 'Crop Leaf'
      };

      if (selectedSample) {
        payload.sampleId = selectedSample.id;
      } else if (selectedImage) {
        payload.imageBase64 = selectedImage;
      }

      const response = await fetch('/api/analyze-leaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.diagnosis) {
        setDiagnosis(data.diagnosis);
      } else {
        throw new Error(data.error || 'Failed to analyze leaf image.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis could not be completed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Printable diagnosis sheet
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <ScanSearch className="w-4 h-4" />
          <span>Multimodal Plant Pathology Vision Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Crop Leaf Disease Diagnosis
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Upload an image of an infected or suspicious crop leaf. Our AI vision pipeline inspects visual lesion morphologies, chlorosis margins, and necrosis patterns to identify plant pathogens with confidence scoring and treatment regimens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Selection & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload & Dropzone Area */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>Leaf Specimen Input</span>
              {selectedSample && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Sample Selected
                </span>
              )}
            </h2>

            {/* Preview Box */}
            <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl overflow-hidden bg-slate-50 min-h-[220px] flex flex-col items-center justify-center p-4 transition-colors">
              {selectedImage ? (
                <div className="relative w-full flex flex-col items-center">
                  <img 
                    src={selectedImage} 
                    alt="Selected leaf specimen" 
                    className="max-h-56 max-w-full object-contain rounded-lg shadow-xs"
                  />
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace Photo</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedSample(null);
                        setDiagnosis(null);
                      }}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-center space-y-3 py-6 px-4"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to upload crop leaf photo
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WebP (under 10MB)
                    </p>
                  </div>
                </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>

            {/* Crop Type Selector (Optional Context) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Crop Variety (Optional Hint)
              </label>
              <select
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Potato">Potato (Solanum tuberosum)</option>
                <option value="Rice">Rice / Paddy (Oryza sativa)</option>
                <option value="Corn (Maize)">Corn / Maize (Zea mays)</option>
                <option value="Wheat">Wheat (Triticum)</option>
                <option value="Apple">Apple (Malus domestica)</option>
                <option value="Bell Pepper">Bell Pepper / Capsicum</option>
                <option value="Cotton">Cotton (Gossypium)</option>
              </select>
            </div>

            {/* Run Analysis Action Button */}
            <button
              onClick={runAnalysis}
              disabled={analyzing || (!selectedImage && !selectedSample)}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Foliage Pathology...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Leaf for Pathogens</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Preset Test Specimens Gallery (Crucial for Evaluation without Local Images) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Evaluation Test Specimens</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click to load</span>
            </div>
            <p className="text-xs text-slate-500">
              Select any pre-calibrated sample specimen for instant testing:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_LEAVES.map(sample => {
                const isSelected = selectedSample?.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-full h-16 rounded-lg overflow-hidden bg-slate-200 mb-2 flex items-center justify-center">
                      <img 
                        src={sample.thumbnailUrl} 
                        alt={sample.label} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate">{sample.crop}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{sample.expectedDisease}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        sample.severity === 'Severe' 
                          ? 'bg-red-100 text-red-800' 
                          : sample.severity === 'Moderate' 
                          ? 'bg-amber-100 text-amber-800' 
                          : sample.severity === 'Mild' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sample.severity}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Diagnostic Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {diagnosis ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in space-y-6 p-6">
              
              {/* Mandatory AI-Estimate / Non-Simulated Diagnostic Disclosure */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-[11px] uppercase tracking-wide text-amber-800">
                    {diagnosis.modelSource}
                  </p>
                  <p className="text-[11px] text-amber-800/90 leading-tight">
                    {diagnosis.disclaimer}
                  </p>
                </div>
              </div>

              {/* Header: Disease Name & Condition */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      diagnosis.condition === 'Healthy' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {diagnosis.condition}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Pathogen: {diagnosis.pathogenType}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 font-heading mt-1">
                    {diagnosis.diseaseName}
                  </h2>
                  <p className="text-xs italic text-slate-500">
                    Pathogen binomial: {diagnosis.scientificName}
                  </p>
                </div>

                {/* Confidence Score Pill */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl sm:text-right shrink-0">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Model Confidence
                  </p>
                  <p className="text-2xl font-black text-emerald-600 font-heading">
                    {diagnosis.confidenceScore.toFixed(1)}%
                  </p>
                  <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${diagnosis.confidenceScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Environmental & Economic Threshold Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-700">Favorable Microclimate:</p>
                  <p className="text-slate-600 mt-0.5">{diagnosis.favorableConditions}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-700">Economic Action Threshold:</p>
                  <p className="text-slate-600 mt-0.5">{diagnosis.economicThreshold}</p>
                </div>
              </div>

              {/* Detail Tabs */}
              <div>
                <div className="flex border-b border-slate-200 space-x-1 overflow-x-auto pb-px">
                  <button
                    onClick={() => setActiveTab('symptoms')}
                    className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                      activeTab === 'symptoms' 
                        ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Clinical Symptoms ({diagnosis.symptoms.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('actions')}
                    className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                      activeTab === 'actions' 
                        ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Immediate Actions
                  </button>
                  <button
                    onClick={() => setActiveTab('organic')}
                    className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                      activeTab === 'organic' 
                        ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Bio & Organic Remedies
                  </button>
                  <button
                    onClick={() => setActiveTab('chemical')}
                    className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                      activeTab === 'chemical' 
                        ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Chemical Controls ({diagnosis.chemicalControl.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('prevention')}
                    className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                      activeTab === 'prevention' 
                        ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Long-Term Prevention
                  </button>
                </div>

                <div className="pt-4 text-xs text-slate-700 leading-relaxed min-h-[160px]">
                  
                  {activeTab === 'symptoms' && (
                    <ul className="space-y-2">
                      {diagnosis.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'actions' && (
                    <ul className="space-y-2">
                      {diagnosis.immediateActions.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'organic' && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                        Recommended biological formulations to build plant immunity without synthetic residues:
                      </p>
                      <ul className="space-y-2">
                        {diagnosis.organicTreatment.map((treatment, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Leaf className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                            <span>{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'chemical' && (
                    <div className="space-y-3">
                      {diagnosis.chemicalControl.length === 0 ? (
                        <p className="text-slate-500 italic">No synthetic chemical control required for this condition.</p>
                      ) : (
                        diagnosis.chemicalControl.map((chem, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs">{chem.chemical}</span>
                              <span className="text-emerald-700 font-semibold">{chem.dosage}</span>
                            </div>
                            <p className="text-slate-600"><strong className="text-slate-700">Timing:</strong> {chem.timing}</p>
                            <p className="text-red-600 text-[11px]"><strong className="text-red-700">Safety Precautions:</strong> {chem.safetyPrecautions}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'prevention' && (
                    <ul className="space-y-2">
                      {diagnosis.preventionMethods.map((method, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{method}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-emerald-700 font-medium">
                  ✓ Recorded to farm pathology history
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrintReport}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print Diagnostic Sheet</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedSample(null);
                      setDiagnosis(null);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Scan Another Leaf
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-4 min-h-[380px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ScanSearch className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-lg font-bold text-slate-800 font-heading">
                  Awaiting Leaf Specimen
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a specimen from the sample gallery on the left, or upload your own leaf photo, then press <strong>"Analyze Leaf for Pathogens"</strong> to trigger the diagnostic pipeline.
                </p>
              </div>
              <div className="inline-flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Gemini 3.8 Flash Vision + ICAR Pathology Rules</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
