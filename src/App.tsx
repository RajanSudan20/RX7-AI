import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  Code2, 
  Terminal, 
  Wrench, 
  Search, 
  Bug, 
  CheckCircle2, 
  Plus, 
  ArrowUp,
  ChevronDown,
  Cpu,
  Layers,
  FileCode
} from 'lucide-react';
import { PRESET_SAMPLES } from './data/presets';
import { ProgrammingLanguage } from './types';
import { Rx7Logo } from './components/Rx7Logo';
import { MistakeExplainer } from './components/MistakeExplainer';

export default function App() {
  const [code, setCode] = useState<string>('');
  const [errorLog, setErrorLog] = useState<string>('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [showLogInput, setShowLogInput] = useState<boolean>(false);
  
  // Active analysis results
  const [hasAnalysed, setHasAnalysed] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [fixedCode, setFixedCode] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeSampleId, setActiveSampleId] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load default sample on initial view
  const handleSelectSample = (preset: typeof PRESET_SAMPLES[0]) => {
    setActiveSampleId(preset.id);
    setCode(preset.code);
    setErrorLog(preset.errorLog);
    setLanguage(preset.language);
    setDiagnosis(preset.precomputedDiagnosis || '');
    setFixedCode(preset.precomputedFix || '');
    setHasAnalysed(true);
  };

  const handleRunAnalysis = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setHasAnalysed(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          errorLog,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        const raw = data.result;
        setDiagnosis(raw);

        // Extract code block
        const match = raw.match(/```(?:\w+)?\n([\s\S]*?)```/);
        if (match && match[1]) {
          setFixedCode(match[1].trim());
        } else {
          setFixedCode(code);
        }
      } else {
        // Fallback matching
        const matchingPreset = PRESET_SAMPLES.find((p) => p.code.trim() === code.trim());
        if (matchingPreset) {
          setDiagnosis(matchingPreset.precomputedDiagnosis || '');
          setFixedCode(matchingPreset.precomputedFix || '');
        } else {
          setDiagnosis(`### 🔍 Error Diagnosis\nIdentified potential runtime error or edge-case failure in ${language} source logic.`);
          setFixedCode(code);
        }
      }
    } catch (err) {
      const matchingPreset = PRESET_SAMPLES.find((p) => p.code.trim() === code.trim());
      if (matchingPreset) {
        setDiagnosis(matchingPreset.precomputedDiagnosis || '');
        setFixedCode(matchingPreset.precomputedFix || '');
      }
    } finally {
      setIsAnalyzing(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setCode('');
    setErrorLog('');
    setDiagnosis('');
    setFixedCode('');
    setHasAnalysed(false);
    setActiveSampleId('');
    setShowLogInput(false);
  };

  const handleCopyFix = () => {
    if (!fixedCode) return;
    navigator.clipboard.writeText(fixedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper to extract diagnosis markdown without fix header
  const getDiagnosisText = (raw: string) => {
    if (!raw) return '';
    if (raw.includes('### 🔍 Error Diagnosis')) {
      const parts = raw.split('### 🛠️ The Fix');
      return parts[0].replace('### 🔍 Error Diagnosis', '').trim();
    }
    return raw;
  };

  return (
    <div className="h-screen w-screen flex flex-col antigravity-bg text-slate-100 font-sans overflow-hidden">
      {/* RX7 AI Header */}
      <header className="h-14 px-6 border-b border-slate-800/60 bg-[#07090E]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Rx7Logo size="sm" />
          <div>
            <span className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-2">
              RX7 AI
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                PRO
              </span>
            </span>
            <span className="text-[11px] text-slate-400 block font-sans">Rewrite The World</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          {hasAnalysed && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>New Debug Session</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl w-full mx-auto flex flex-col">
        {!hasAnalysed ? (
          /* Empty RX7 AI Welcome View */
          <div className="flex-1 flex flex-col items-center justify-center my-auto text-center space-y-6 max-w-2xl mx-auto py-8">
            <Rx7Logo size="lg" className="mb-2" />

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mb-2">
                What code can <span className="bg-gradient-to-r from-rose-300 via-amber-200 to-rose-400 bg-clip-text text-transparent">RX7 AI</span> help debug today?
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                Paste any broken code snippet or terminal error trace below. RX7 AI will instantly analyze the bug and generate a clean fix.
              </p>
            </div>

            {/* Quick Sample Bug Cards */}
            <div className="w-full pt-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-left flex items-center justify-between">
                <span>Try a sample bug:</span>
                <span className="text-[11px] text-sky-400/80 font-mono font-normal">Instant precomputed demo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_SAMPLES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectSample(preset)}
                    className="p-3.5 rounded-xl antigravity-card hover:border-sky-500/50 hover:bg-[#131926] transition-all text-left group shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 text-slate-300">
                        {preset.language}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {preset.errorCategory}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation & Diagnosis View */
          <div className="space-y-6 pb-20">
            {/* User Message Block */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300 shrink-0">
                You
              </div>
              <div className="flex-1 bg-[#161B22] border border-slate-800/80 rounded-2xl p-4 font-mono text-xs space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
                    <span>Source Code ({language})</span>
                  </div>
                  <pre className="bg-[#0D1117] p-3 rounded-lg text-slate-200 overflow-x-auto whitespace-pre border border-slate-800">
                    {code}
                  </pre>
                </div>

                {errorLog && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-red-400 mb-1">
                      Terminal Log / Trace
                    </div>
                    <pre className="bg-[#0D1117] p-3 rounded-lg text-red-400/90 overflow-x-auto whitespace-pre border border-red-950/50">
                      {errorLog}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant Output Block */}
            <div className="flex gap-4 items-start">
              <Rx7Logo size="sm" className="mt-1" />

              <div className="flex-1 space-y-4">
                {isAnalyzing ? (
                  <div className="p-6 antigravity-card rounded-2xl flex items-center gap-3 text-slate-300 text-sm">
                    <Sparkles className="w-5 h-5 text-sky-400 animate-spin" />
                    <span>RX7 AI is analyzing source logic and constructing optimal fix...</span>
                  </div>
                ) : (
                  <>
                    {/* Diagnosis Explanation Card */}
                    {diagnosis && (
                      <>
                        <div className="antigravity-card rounded-2xl p-5 text-slate-200 text-sm space-y-3">
                          <div className="flex items-center gap-2 font-semibold text-sky-400 text-xs uppercase tracking-wider">
                            <Search className="w-4 h-4" />
                            <span>Error Diagnosis</span>
                          </div>
                          <div
                            className="text-slate-300 text-xs leading-relaxed space-y-2 font-sans"
                            dangerouslySetInnerHTML={{
                              __html: getDiagnosisText(diagnosis)
                                .replace(/`([^`]+)`/g, '<code class="bg-[#07090E] text-sky-300 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-800">$1</code>')
                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-sky-400 font-semibold">$1</strong>')
                            }}
                          />
                        </div>

                        {/* Interactive Mistake Explanation & Learning Center */}
                        <MistakeExplainer
                          code={code}
                          diagnosis={diagnosis}
                          language={language}
                        />
                      </>
                    )}

                    {/* Fixed Production Code Card */}
                    {fixedCode && (
                      <div className="bg-[#07090E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-4 py-2.5 bg-[#0E121B] border-b border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Corrected Code
                          </span>
                          <button
                            onClick={handleCopyFix}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#07090E] font-bold text-xs transition-colors shadow-sm"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
                          {fixedCode}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      {/* Gemini Bottom Bar */}
      <footer className="p-4 bg-[#07090E]/90 backdrop-blur-md border-t border-slate-800/60 shrink-0 z-20">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="antigravity-input-card focus-within:border-sky-400 rounded-2xl p-3 transition-all">
            {/* Main Code Input Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste broken code snippet here..."
              rows={hasAnalysed ? 3 : 5}
              className="w-full bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none placeholder-slate-500 leading-relaxed"
            />

            {/* Optional Stack Trace Box */}
            {showLogInput && (
              <div className="pt-2 border-t border-slate-800">
                <textarea
                  value={errorLog}
                  onChange={(e) => setErrorLog(e.target.value)}
                  placeholder="Paste optional error output or stack trace..."
                  rows={2}
                  className="w-full bg-[#0D1117] p-2 rounded-lg text-red-400 font-mono text-xs focus:outline-none resize-none placeholder-slate-600"
                />
              </div>
            )}

            {/* Control Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-3">
                {/* Language Select */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                  className="bg-[#0D1117] text-sky-400 font-mono border border-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="cpp">C++</option>
                  <option value="sql">SQL</option>
                </select>

                {/* Toggle Error Log Button */}
                <button
                  onClick={() => setShowLogInput(!showLogInput)}
                  className={`text-xs font-mono px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    showLogInput
                      ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showLogInput ? 'Remove Trace' : '+ Add Stack Trace'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !code.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isAnalyzing || !code.trim()
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-sky-400 text-[#0E1117] hover:bg-sky-300 shadow-md shadow-sky-950/50 active:scale-95'
                }`}
                title="Diagnose & Fix"
              >
                {isAnalyzing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 font-mono tracking-wide">
            RX7 AI — REWRITE THE WORLD — Instant Code Diagnosis & Refactor Engine.
          </div>
        </div>
      </footer>
    </div>
  );
}
