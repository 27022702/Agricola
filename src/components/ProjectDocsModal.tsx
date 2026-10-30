import React from 'react';
import { 
  X, 
  BookOpen, 
  Cpu, 
  Code2, 
  CheckCircle2, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ProjectDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                College Final-Year Project Presentation & Thesis
              </h2>
              <p className="text-xs text-slate-500">AgriSmart AI: Precision Agronomy Decision Support Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 text-xs text-slate-700 leading-relaxed">
          
          {/* Abstract */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-700 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Project Abstract</span>
            </h3>
            <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
              <strong>AgriSmart AI</strong> is an end-to-end intelligent agricultural decision-support web application designed to empower smallholder and commercial farmers with data-driven agronomic insights. The platform addresses critical challenges in modern agriculture: diagnostic latency in foliar crop diseases, unscientific over-fertilization, groundwater depletion, and climate vulnerability. By integrating multimodal deep vision (Gemini 3.8 Flash Vision) with mathematical agronomic rule engines (grounded in ICAR and FAO protocols) and real-time micrometeorology, AgriSmart AI bridges the gap between agricultural research laboratories and grassroots farming operations.
            </p>
          </section>

          {/* System Architecture */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-700 flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>System Architecture & Technologies</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block text-xs">Frontend Client Layer:</strong>
                <p className="text-slate-600">
                  Developed in React 19 and TypeScript, styled with Tailwind CSS. Incorporates responsive viewport reflow, mobile camera capture, SVG diagnostic gauges, and interactive forms with client-side input validation.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block text-xs">Backend Application Layer:</strong>
                <p className="text-slate-600">
                  Node.js with Express v4.21. Implements strict proxy routing to guard the Gemini API key, processes base64 payload streaming up to 25MB, and validates agronomic telemetry before evaluation.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block text-xs">AI Multimodal Vision Engine:</strong>
                <p className="text-slate-600">
                  Utilizes Google Gen AI TypeScript SDK (<code className="font-mono text-emerald-700">@google/genai</code>) with <code className="font-mono text-emerald-700">gemini-3.8-flash</code>. Extracts pathological features (chlorosis halos, concentric necrotic rings, fungal sporulation) into validated JSON schemas.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block text-xs">Agronomy Calculation Engine:</strong>
                <p className="text-slate-600">
                  Pure mathematical TypeScript modules (<code className="font-mono text-emerald-700">agronomyEngine.ts</code>) computing Soil Health Indices (0-100), crop suitability vectors, and stoichiometric Urea/DAP/MOP fertilizer split dosages.
                </p>
              </div>
            </div>
          </section>

          {/* Scientific Methodology & Standards Grounding */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-700 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Scientific Grounding & Agronomic Rubrics</span>
            </h3>
            
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Plant Pathology Grounding:</strong> Diagnoses and chemical dosages (Mancozeb 75% WP, Ridomil MZ, Tricyclazole) adhere strictly to Central Insecticides Board & Registration Committee (CIB&RC) and PlantVillage reference datasets.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Soil Health Index:</strong> N-P-K threshold ranges (<code className="font-mono">N &lt; 240 Low, 280-400 Optimal</code>; <code className="font-mono">P &lt; 15 Low, 22-55 Optimal</code>; <code className="font-mono">K &lt; 140 Low, 150-300 Optimal</code>) follow Indian Council of Agricultural Research (ICAR) soil test guidelines.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Crop Water Requirements:</strong> Evapotranspiration coefficients (Kc) and growth stage scheduling are calibrated according to FAO Irrigation and Drainage Paper No. 56.
                </span>
              </li>
            </ul>
          </section>

          {/* Setup, Local Testing & Deployment Instructions */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-700 flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>Installation & Deployment Guide</span>
            </h3>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
              <p className="text-emerald-400"># 1. Clone or export project directory</p>
              <p>git clone &lt;repo_url&gt; &amp;&amp; cd agrismart-ai</p>
              <p className="text-emerald-400"># 2. Install dependencies</p>
              <p>npm install</p>
              <p className="text-emerald-400"># 3. Configure environment variables in .env</p>
              <p>GEMINI_API_KEY="your-gemini-api-key"</p>
              <p>PORT=3000</p>
              <p className="text-emerald-400"># 4. Run pure agronomy logic unit tests</p>
              <p>npx tsx --test src/utils/agronomyEngine.test.ts</p>
              <p className="text-emerald-400"># 5. Launch Full-Stack Server in Development</p>
              <p>npm run dev</p>
              <p className="text-emerald-400"># 6. Build and Deploy Production Bundle</p>
              <p>npm run build</p>
              <p>npm run start</p>
            </div>
          </section>

          {/* Academic Ethical Disclaimer */}
          <section className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <h4 className="font-bold text-emerald-900">Academic & Diagnostic Disclaimer</h4>
            <p className="text-[11px] text-emerald-800">
              This application was engineered by undergraduate engineering students as a demonstration of AI applied to sustainable agricultural decision-making. Results from the AI vision model are advisory estimates intended to assist farmers with preliminary triage and should be corroborated with local extension officers or certified agronomists for high-value quarantine conditions.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">AgriSmart AI • Academic Final Year Project 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
