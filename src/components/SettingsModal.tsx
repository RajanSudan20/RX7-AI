import React from 'react';
import { X, Sliders, Check, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { EngineSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EngineSettings;
  onUpdateSettings: (s: Partial<EngineSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#11151C] border border-[#1E293B] rounded-lg w-full max-w-md overflow-hidden shadow-2xl font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B] bg-[#0B0E14]">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase">
            <Sliders className="w-4 h-4" />
            <span>CodeFix Engine Configuration</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          {/* AI Model Selection */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1.5 uppercase font-semibold">
              AI Analysis Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => onUpdateSettings({ model: e.target.value as any })}
              className="w-full bg-[#0B0E14] border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Ultra Low Latency)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning & Complex Architecture)</option>
            </select>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-800/40">
              <div>
                <div className="font-semibold text-slate-200">Include Inline Safety Comments</div>
                <div className="text-[11px] text-slate-500">
                  Add concise comments in fixed code explaining critical guard clauses or resource handles.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.inlineComments}
                onChange={(e) => onUpdateSettings({ inlineComments: e.target.checked })}
                className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-800/40">
              <div>
                <div className="font-semibold text-slate-200">Senior Staff Engineer Review Tone</div>
                <div className="text-[11px] text-slate-500">
                  Strictly objective, concise, zero conversational fluff, direct root cause analysis.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.strictEngineerMode}
                onChange={(e) => onUpdateSettings({ strictEngineerMode: e.target.checked })}
                className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-slate-800/40">
              <div>
                <div className="font-semibold text-slate-200">Default to Side-by-Side Diff View</div>
                <div className="text-[11px] text-slate-500">
                  Automatically show diff comparison when analysis completes.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showDiffByDefault}
                onChange={(e) => onUpdateSettings({ showDiffByDefault: e.target.checked })}
                className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-[#0B0E14] border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-500 text-[#0B0E14] font-bold text-xs hover:bg-sky-400 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
