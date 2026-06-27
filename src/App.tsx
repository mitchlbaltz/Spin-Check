import { useState, useEffect } from "react";
import Header from "./components/Header";
import CameraView from "./components/CameraView";
import PhotoPreview from "./components/PhotoPreview";
import AnalysisResult from "./components/AnalysisResult";
import { AppState, AnalysisResponse } from "./types";
import { RefreshCw, AlertTriangle, Scale, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [appState, setAppState] = useState<AppState>("camera");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzingStep, setAnalyzingStep] = useState<number>(0);

  const steps = [
    "Reading communication materials...",
    "Isolating primary claims...",
    "Parsing persuasion techniques & rhetoric...",
    "Evaluating logical consistency...",
    "Formulating nonpartisan analysis report..."
  ];

  // Rotate analysis steps dynamically to make the loading sequence feel organic and highly detailed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === "analyzing") {
      setAnalyzingStep(0);
      interval = setInterval(() => {
        setAnalyzingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handlePhotoCaptured = (base64Image: string) => {
    setImageSrc(base64Image);
    setAppState("preview");
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;

    setAppState("analyzing");
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
      setAppState("result");
    } catch (err: any) {
      console.error("Analysis request failed:", err);
      setError(err?.message || "We could not process this image. Please ensure it is a clearly lit photo of political communication (mailer, post, or sign) and try again.");
      setAppState("error");
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setAnalysis(null);
    setError(null);
    setAppState("camera");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="flex-1 flex flex-col justify-start py-4">
        {appState === "camera" && (
          <CameraView onPhotoCaptured={handlePhotoCaptured} />
        )}

        {appState === "preview" && imageSrc && (
          <PhotoPreview
            imageSrc={imageSrc}
            onAnalyze={handleAnalyze}
            onRetake={handleReset}
          />
        )}

        {appState === "analyzing" && (
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto px-6 py-12 text-center">
            {/* Spinning Indicator */}
            <div className="relative flex items-center justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
              />
              <Scale className="absolute w-8 h-8 text-indigo-600 animate-pulse" />
            </div>

            {/* Step Content */}
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-display mb-1.5">
              Rhetorical Audit in Progress
            </h3>
            
            <div className="h-6 flex items-center justify-center">
              <motion.p
                key={analyzingStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-slate-500 font-mono"
              >
                {steps[analyzingStep]}
              </motion.p>
            </div>

            {/* Trust Message */}
            <div className="mt-12 bg-white border border-slate-200/60 rounded-2xl p-4 text-left shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-600 mb-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">Strictly Nonpartisan Protocol</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Spin Check applies an identical rhetorical rubric to all scans. We never verify party affiliation, evaluate truth value directly, or issue belief statements.
              </p>
            </div>
          </div>
        )}

        {appState === "result" && analysis && (
          <AnalysisResult analysis={analysis} onReset={handleReset} />
        )}

        {appState === "error" && (
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto px-6 py-10 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4 border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 font-display mb-2">
              Analysis Failed
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
              {error || "An unexpected issue occurred. Please make sure your network is connected and that the image contains readable political rhetoric."}
            </p>

            <div className="w-full space-y-2">
              <button
                id="error-retry-btn"
                onClick={handleAnalyze}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-2xl shadow-md text-sm transition-colors"
              >
                Try Analyzing Again
              </button>

              <button
                id="error-reset-btn"
                onClick={handleReset}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors"
              >
                Capture or Upload a New Photo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-6 text-center border-t border-slate-100 bg-white/50">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          Spin Check · Media Literacy Toolkit
        </p>
      </footer>
    </div>
  );
}
