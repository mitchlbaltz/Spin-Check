import { Scale, Info } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 px-4 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-50 p-1.5 rounded-xl border border-indigo-100">
          <Scale className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight font-display leading-none">
            Spin Check
          </h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Rhetorical analysis
          </span>
        </div>
      </div>

      <button
        id="info-toggle-btn"
        onClick={() => setShowInfo(!showInfo)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        aria-label="Information"
      >
        <Info className="w-5 h-5" />
      </button>

      {/* Dynamic Slide-Down Modal Overlay for App Information */}
      <AnimatePresence>
        {showInfo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-16 left-4 right-4 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 z-50 max-w-md mx-auto"
            >
              <h3 className="font-bold text-slate-900 text-lg font-display mb-2">About Spin Check</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Spin Check is a nonpartisan educational tool designed to foster media literacy. It helps citizens identify persuasion techniques, rhetorical framing, and logical gaps in campaign literature, flyers, and yard signs.
              </p>
              
              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <p className="text-slate-600 leading-normal">
                    <strong>Analyzes structure, not bias:</strong> We break down rhetoric neutrally and apply the same intense scrutiny to both sides of the spectrum.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <p className="text-slate-600 leading-normal">
                    <strong>Fact-check prompts:</strong> Instead of certifying true or false, we supply exact verification items to check yourself.
                  </p>
                </div>
              </div>

              <button
                id="close-info-btn"
                onClick={() => setShowInfo(false)}
                className="w-full mt-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
