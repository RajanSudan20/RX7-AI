import React from 'react';
import { 
  Search, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface DiagnosisPaneProps {
  diagnosis?: string;
  isAnalyzing: boolean;
  errorLine?: number;
  filename: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING';
}

export const DiagnosisPane: React.FC<DiagnosisPaneProps> = ({
  diagnosis,
  isAnalyzing,
  errorLine = 42,
  filename,
  severity = 'CRITICAL'
}) => {
  // Parse diagnosis section from raw markdown if present
  const getDiagnosisText = (raw?: string) => {
    if (!raw) return '';
    if (raw.includes('### 🔍 Error Diagnosis')) {
      const parts = raw.split('### 🛠️ The Fix');
      const diagPart = parts[0].replace('### 🔍 Error Diagnosis', '').trim();
      return diagPart;
    }
    return raw;
  };

  const formattedDiagnosis = getDiagnosisText(diagnosis);

  return (
    <section className="pane">
      {/* Pane Header */}
      <div className="pane-header">
        <div className="flex items-center gap-2 text-sky-400">
          <Search className="w-3.5 h-3.5" />
          <span>🔍 Error Diagnosis</span>
        </div>

        {/* Severity Badge */}
        <div className="flex items-center gap-2">
          {errorLine && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/60">
              LINE {errorLine}
            </span>
          )}
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${
            severity === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border-red-800' :
            severity === 'HIGH' ? 'bg-amber-950/80 text-amber-400 border-amber-800' :
            'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            {severity}
          </span>
        </div>
      </div>

      {/* Main Diagnosis Content */}
      <div className="flex-1 overflow-y-auto p-5 leading-relaxed font-sans text-xs text-slate-200">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Sparkles className="w-8 h-8 text-sky-400 animate-spin" />
            <div className="font-mono text-xs uppercase tracking-wider text-sky-300">
              Analyzing Runtime Execution & Stack Trace...
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs text-center">
              CodeFix Engine is identifying root causes, memory boundaries, and logical failure paths.
            </p>
          </div>
        ) : formattedDiagnosis ? (
          <div className="space-y-4">
            {/* Formatted Markdown Content */}
            <div className="diagnosis-content bg-[#11151C] border border-[#1E293B] rounded p-4 text-slate-200 leading-relaxed font-sans">
              <div 
                className="space-y-3 prose prose-invert prose-sm max-w-none text-xs"
                dangerouslySetInnerHTML={{
                  __html: formattedDiagnosis
                    .replace(/\n\n/g, '</p><p class="mt-2">')
                    .replace(/`([^`]+)`/g, '<code class="bg-[#0B0E14] text-sky-300 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-800">$1</code>')
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-sky-400 font-semibold">$1</strong>')
                }}
              />
            </div>

            {/* Senior Engineering Review Callout Box */}
            <div className="p-3 rounded bg-sky-950/20 border border-sky-800/40 text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-normal font-sans">
                <span className="font-semibold text-sky-400 block mb-0.5">Code Review Assessment</span>
                <span>
                  The diagnosis addresses the immediate failure on <strong>Line {errorLine || 'N/A'}</strong> in <code>{filename}</code>. Verify input validation or guard clauses prior to accessing object properties or methods.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <Search className="w-8 h-8 text-slate-700" />
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              No Analysis Generated Yet
            </span>
            <span className="text-[11px] text-slate-600 max-w-xs text-center">
              Click "RUN ANALYSIS" above or select a bug preset from the sidebar to generate a diagnostic trace.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
