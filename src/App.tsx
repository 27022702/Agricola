import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { LeafDiseaseDetector } from './components/LeafDiseaseDetector';
import { SoilAnalyzer } from './components/SoilAnalyzer';
import { CropRecommender } from './components/CropRecommender';
import { FarmManagement } from './components/FarmManagement';
import { HistoryPage } from './components/HistoryPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { AuthModal } from './components/AuthModal';
import { ActiveTab } from './types';
import { SoilParameters } from './utils/agronomyEngine';
import { Sprout, BookOpen, ShieldCheck, Heart } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Shared state connecting soil analysis to crop recommendation and fertilizer planner
  const [currentSoil, setCurrentSoil] = useState<SoilParameters>({
    moisture: 58,
    temperature: 26,
    humidity: 62,
    ph: 6.8,
    nitrogen: 280,
    phosphorus: 32,
    potassium: 220,
    soilType: 'Alluvial Loam'
  });

  const [fertilizerTargetCrop, setFertilizerTargetCrop] = useState<string>('Tomato');

  const handleSelectCropForFertilizer = (cropName: string) => {
    setFertilizerTargetCrop(cropName);
    setActiveTab('fertilizer_planner');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDocs={() => setDocsModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage 
            onNavigate={setActiveTab} 
            onOpenDocs={() => setDocsModalOpen(true)} 
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'leaf_disease' && (
          <LeafDiseaseDetector />
        )}

        {activeTab === 'soil_analysis' && (
          <SoilAnalyzer 
            onNavigate={setActiveTab} 
            onSetSoilState={setCurrentSoil} 
          />
        )}

        {activeTab === 'crop_recommend' && (
          <CropRecommender 
            currentSoil={currentSoil}
            onNavigate={setActiveTab}
            onSelectCropForFertilizer={handleSelectCropForFertilizer}
          />
        )}

        {activeTab === 'fertilizer_planner' && (
          <FarmManagement 
            currentSoil={currentSoil}
            initialCropName={fertilizerTargetCrop}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* College Project Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 font-heading">AgriSmart AI</span>
            <span>• B.Tech Final Year Academic Project</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setDocsModalOpen(true)}
              className="text-emerald-700 hover:underline font-semibold flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Architecture & Documentation</span>
            </button>
            <span>•</span>
            <span>Powered by Gemini 3.8 Flash & ICAR Agronomy Guidelines</span>
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
            <span>Built for sustainable agriculture and farm yields</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ProjectDocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
