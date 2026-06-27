import { 
  Scan, 
  HelpCircle, 
  CheckSquare, 
  AlertTriangle, 
  Quote, 
  Scale, 
  ChevronRight, 
  Layers,
  FileCheck
} from "lucide-react";
import { motion } from "motion/react";
import { AnalysisResponse } from "../types";

interface AnalysisResultProps {
  analysis: AnalysisResponse;
  onReset: () => void;
}

export default function AnalysisResult({ analysis, onReset }: AnalysisResultProps) {
  const presentTechniques = analysis.persuasionTechniques.filter(t => t.present);
  const absentTechniques = analysis.persuasionTechniques.filter(t => !t.present);

  return (
    <div className="flex flex-col flex-1 w-full max-w-lg mx-auto px-4 pb-12">
      {/* Nonpartisan Trust Banner */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 mb-6 flex items-start space-x-3 text-slate-600">
        <Scale className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div className="text-xs">
          <span className="font-semibold text-slate-800">Strictly Nonpartisan Rhetorical Analysis</span>
          <p className="mt-0.5 text-slate-500 leading-relaxed">
            This report evaluates structural communication patterns, persuasion techniques, and logic. It does not verify political truth or express voting recommendations.
          </p>
        </div>
      </div>

      {/* 1. What This Is */}
      <section className="mb-6" id="section-what-is-this">
        <div className="flex items-center space-x-2 text-slate-800 mb-2">
          <Quote className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-display text-slate-500">
            What this is
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-slate-700 leading-relaxed italic text-sm">
            "{analysis.whatThisIs}"
          </p>
        </div>
      </section>

      {/* 2. Main Claims */}
      <section className="mb-6" id="section-main-claims">
        <div className="flex items-center space-x-2 text-slate-800 mb-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-display text-slate-500">
            Main Claim(s)
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          {analysis.mainClaims.map((claim, index) => (
            <div key={index} className="flex items-start space-x-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{claim}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Persuasion Techniques */}
      <section className="mb-6" id="section-persuasion-techniques">
        <div className="flex items-center space-x-2 text-slate-800 mb-2">
          <AlertTriangle className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-display text-slate-500">
            Persuasion Techniques
          </h3>
        </div>

        <div className="space-y-3">
          {/* Detected Techniques */}
          {presentTechniques.map((tech, index) => (
            <div key={index} className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-800">
                  {tech.techniqueName}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                  Detected
                </span>
              </div>
              <div className="bg-slate-50 border-l-2 border-indigo-500 p-2.5 rounded-r-lg mb-2 text-xs text-slate-600 font-mono italic">
                "{tech.example}"
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tech.explanation}
              </p>
            </div>
          ))}

          {/* Undetected/Absent Techniques */}
          {absentTechniques.length > 0 && (
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-2.5">
                Other techniques evaluated but not prominently present:
              </h4>
              <div className="flex flex-wrap gap-2">
                {absentTechniques.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 rounded-full text-xs bg-white border border-slate-200 text-slate-400"
                  >
                    {tech.techniqueName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Possible Logical Fallacies */}
      <section className="mb-6" id="section-logical-fallacies">
        <div className="flex items-center space-x-2 text-slate-800 mb-2">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-display text-slate-500">
            Logical Fallacies
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          {analysis.logicalFallacies && analysis.logicalFallacies.length > 0 ? (
            analysis.logicalFallacies.map((fallacy, index) => (
              <div key={index} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <h4 className="text-sm font-semibold text-amber-900">{fallacy.name}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-4">
                  {fallacy.explanation}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 font-medium">
                No major logical fallacies explicitly detected in the analyzed messaging.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 5. What to Check */}
      <section className="mb-6" id="section-what-to-check">
        <div className="flex items-center space-x-2 text-slate-800 mb-2">
          <FileCheck className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-display text-slate-500">
            What to Check (Verify)
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          {analysis.whatToCheck.map((claim, index) => (
            <div key={index} className="flex items-start space-x-3 text-xs leading-relaxed">
              <CheckSquare className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-slate-600">{claim}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Missing Context */}
      <section className="mb-8" id="section-missing-context">
        <div className="flex items-center space-x-2 text-slate-800 mb-2">
          <AlertTriangle className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-display text-slate-500">
            Missing Context
          </h3>
        </div>
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-md">
          <ul className="space-y-3">
            {analysis.missingContext.map((context, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs leading-relaxed">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">·</span>
                <p className="text-slate-300">{context}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Primary Sticky Bottom scan Button */}
      <motion.button
        id="scan-another-btn"
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-2xl shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-2 text-base transition-colors"
      >
        <Scan className="w-5 h-5" />
        <span>Scan Another Item</span>
      </motion.button>
    </div>
  );
}
