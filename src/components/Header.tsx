import React from 'react';
import { 
  Play, 
  Copy, 
  RotateCcw, 
  Sliders, 
  Zap, 
  Layers, 
  Check, 
  Plus, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { EngineSettings } from '../types';

interface HeaderProps {
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  onNewSession: () => void;
  onClear: () => void;
  onCopyFix: () => void;
  isCopied: boolean;
  latencyMs?: number;
  tokensUsed?: number;
  settings: EngineSettings;
  onUpdateSettings: (s: Partial<EngineSettings>) => void;
  onOpenSettings: () => void;
  hasFix: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isAnalyzing,
  onRunAnalysis,
  onNewSession,
  onClear,
  onCopyFix,
  isCopied,
  latencyMs = 142,
  tokensUsed = 4200,
  settings,
  onUpdateSettings,
  onOpenSettings,
  hasFix
}) => {
  return (
    <header className="header">
      {/* Brand & Version */}
      <div className="flex items-center gap-3">
        <span className="logo">CODEFIX_ENGINE</span>
        <span className="badge text-slate-400 border border-slate-800 text-[10px]">
          v2.4.1-stable
        </span>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/40 text-sky-400 border border-sky-800/40 text-[10px] font-mono">
          <ShieldCheck className="w-3 h-3 text-sky-400" />
          SENIOR ENGINE REVIEW
        </span>
      </div>

      {/* Center/Right Info Metrics & Actions */}
      <div className="flex items-center gap-2 sm:gap-4 font-mono text-[11px]">
        {/* Latency & Token Metrics */}
        <div className="hidden lg:flex items-center gap-4 text-slate-400 border-r border-slate-800 pr-4">
          <span className="flex items-center gap-1 text-slate-400" title="Model Latency">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-slate-500">LATENCY:</span>
            <span className="text-slate-200 font-semibold">{latencyMs}ms</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400" title="Estimated Tokens">
            <Layers className="w-3 h-3 text-sky-400" />
            <span className="text-slate-500">TOKENS:</span>
            <span className="text-slate-200 font-semibold">{(tokensUsed / 1000).toFixed(1)}k</span>
          </span>
          <select
            value={settings.model}
            onChange={(e) => onUpdateSettings({ model: e.target.value as any })}
            className="bg-[#11151C] text-sky-400 border border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="gemini-2.5-flash">GEMINI 2.5 FLASH</option>
            <option value="gemini-2.5-pro">GEMINI 2.5 PRO</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewSession}
            title="Create New Blank Session"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60 font-sans text-[11px]"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">New</span>
          </button>

          <button
            onClick={onClear}
            title="Clear Inputs"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800 font-sans text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {hasFix && (
            <button
              onClick={onCopyFix}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-800/60 transition-colors font-sans text-[11px]"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-medium">Copy Fix</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onOpenSettings}
            title="Engine Settings"
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/50"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider transition-all ${
              isAnalyzing
                ? 'bg-sky-900/60 text-sky-300 cursor-not-allowed border border-sky-700/50'
                : 'bg-[#38BDF8] text-[#0B0E14] hover:bg-sky-300 shadow-md shadow-sky-950/50 active:scale-[0.98]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-300" />
                <span>ANALYZING...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN ANALYSIS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
