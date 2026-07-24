import React from 'react';
import { 
  Wrench, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  Download, 
  FileCode, 
  Sparkles,
  Zap,
  Code2
} from 'lucide-react';
import { ProgrammingLanguage } from '../types';

interface FixPaneProps {
  rawResult?: string;
  originalCode: string;
  language: ProgrammingLanguage;
  isAnalyzing: boolean;
  onApplyFixToEditor: (fixedCode: string) => void;
  onCopyFix: () => void;
  isCopied: boolean;
}

export const FixPane: React.FC<FixPaneProps> = ({
  rawResult,
  originalCode,
  language,
  isAnalyzing,
  onApplyFixToEditor,
  onCopyFix,
  isCopied
}) => {
  const [viewMode, setViewMode] = React.useState<'code' | 'diff'>('code');

  // Extract code block from raw markdown result
  const getFixedCode = (raw?: string): string => {
    if (!raw) return '';
    const codeBlockMatch = raw.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1].trim();
    }
    // Fallback if fix section exists without backticks
    if (raw.includes('### 🛠️ The Fix')) {
      const parts = raw.split('### 🛠️ The Fix');
      return parts[1].trim();
    }
    return '';
  };

  const fixedCode = getFixedCode(rawResult);
  const fixedLines = fixedCode.split('\n');
  const originalLines = originalCode.split('\n');

  const handleDownloadPatch = () => {
    if (!fixedCode) return;
    const blob = new Blob([fixedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixed_code.${language === 'python' ? 'py' : language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : language === 'go' ? 'go' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="pane col-span-1 lg:col-span-2">
      {/* Pane Header */}
      <div className="pane-header">
        <div className="flex items-center gap-2 text-sky-400">
          <Wrench className="w-3.5 h-3.5" />
          <span>🛠️ The Fix</span>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2">
          {fixedCode && (
            <>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    viewMode === 'code'
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Code View
                </button>
                <button
                  onClick={() => setViewMode('diff')}
                  className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                    viewMode === 'diff'
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Diff View</span>
                </button>
              </div>

              <button
                onClick={() => onApplyFixToEditor(fixedCode)}
                className="px-2.5 py-0.5 rounded bg-sky-950 text-sky-300 hover:bg-sky-900 border border-sky-800 text-[11px] font-sans font-medium transition-colors"
                title="Replace editor content with this fixed code"
              >
                Apply to Editor
              </button>

              <button
                onClick={handleDownloadPatch}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title="Download Fixed Code File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onCopyFix}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500 text-[#0B0E14] font-bold text-[10px] uppercase hover:bg-sky-400 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#05070a] overflow-auto relative">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Sparkles className="w-8 h-8 text-sky-400 animate-spin" />
            <span className="font-mono text-xs text-sky-300 uppercase tracking-wider">
              Generating Optimal Production Fix...
            </span>
          </div>
        ) : fixedCode ? (
          viewMode === 'code' ? (
            /* Standard Code Block View */
            <div className="code-container bg-[#05070a] p-4 font-mono text-xs leading-relaxed text-slate-200">
              {fixedLines.map((line, idx) => {
                const isFixLine = 
                  line.includes('if user is None:') || 
                  line.includes('raise ValueError') ||
                  line.includes('guard clause') ||
                  line.includes('try {') ||
                  line.includes('finally {') ||
                  line.includes('isMounted');

                return (
                  <div
                    key={idx}
                    className={`flex items-start hover:bg-slate-900/50 ${
                      isFixLine ? 'fix-hl' : ''
                    }`}
                  >
                    <span className="line-num shrink-0">{idx + 1}</span>
                    <span className="whitespace-pre flex-1 text-slate-200">
                      {line}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Side by Side / Unified Diff View */
            <div className="grid grid-cols-1 md:grid-cols-2 h-full font-mono text-xs divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Original Broken Code */}
              <div className="flex flex-col overflow-hidden">
                <div className="px-3 py-1 bg-red-950/40 text-red-400 text-[10px] font-bold uppercase border-b border-red-900/40">
                  Original (Broken Code)
                </div>
                <div className="flex-1 p-3 overflow-auto bg-[#0B0E14]/80 text-slate-400 leading-relaxed">
                  {originalLines.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-slate-600 text-right pr-2 select-none">{idx + 1}</span>
                      <span className="whitespace-pre text-red-300/80">{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corrected Fixed Code */}
              <div className="flex flex-col overflow-hidden">
                <div className="px-3 py-1 bg-emerald-950/40 text-emerald-400 text-[10px] font-bold uppercase border-b border-emerald-900/40">
                  Corrected (Production Ready)
                </div>
                <div className="flex-1 p-3 overflow-auto bg-[#05070a] text-slate-200 leading-relaxed">
                  {fixedLines.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-slate-600 text-right pr-2 select-none">{idx + 1}</span>
                      <span className="whitespace-pre text-emerald-300 font-medium">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 p-6">
            <Wrench className="w-8 h-8 text-slate-700" />
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Awaiting Solution Generation
            </span>
            <span className="text-[11px] text-slate-600 max-w-xs text-center">
              CodeFix Engine will generate complete, copy-pasteable production-ready code blocks without placeholder comments.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
