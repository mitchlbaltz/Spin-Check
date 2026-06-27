import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface PhotoPreviewProps {
  imageSrc: string;
  onAnalyze: () => void;
  onRetake: () => void;
}

export default function PhotoPreview({ imageSrc, onAnalyze, onRetake }: PhotoPreviewProps) {
  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto px-4 pb-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight font-display">
          Review Captured Image
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Ensure any text or main claims are clearly readable for the best analysis.
        </p>
      </div>

      {/* Image Preview Container */}
      <div className="relative flex-1 w-full min-h-[300px] bg-slate-100 rounded-3xl overflow-hidden shadow-inner border border-slate-200/50 flex items-center justify-center">
        <img
          id="captured-image-preview"
          src={imageSrc}
          alt="Political Communication Capture"
          className="w-full h-full object-contain max-h-[50vh]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Action Tray */}
      <div className="mt-5 space-y-3">
        <motion.button
          id="analyze-image-btn"
          whileTap={{ scale: 0.95 }}
          onClick={onAnalyze}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-2xl shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 text-base transition-colors"
        >
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <span>Analyze Spin & Claims</span>
        </motion.button>

        <button
          id="retake-photo-btn"
          onClick={onRetake}
          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium rounded-xl flex items-center justify-center space-x-2 text-sm border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retake or Choose Another</span>
        </button>
      </div>
    </div>
  );
}
