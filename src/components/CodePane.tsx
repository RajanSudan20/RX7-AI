import React from 'react';
import { 
  Code2, 
  Terminal, 
  AlertTriangle, 
  FileCode, 
  Upload, 
  Clipboard, 
  Layers,
  Sparkles
} from 'lucide-react';
import { ProgrammingLanguage } from '../types';

interface CodePaneProps {
  filename: string;
  onFilenameChange: (name: string) => void;
  language: ProgrammingLanguage;
  onLanguageChange: (lang: ProgrammingLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
  errorLog: string;
  onErrorLogChange: (log: string) => void;
  errorLine?: number;
  onErrorLineChange: (line: number | undefined) => void;
}

export const CodePane: React.FC<CodePaneProps> = ({
  filename,
  onFilenameChange,
  language,
  onLanguageChange,
  code,
  onCodeChange,
  errorLog,
  onErrorLogChange,
  errorLine = 42,
  onErrorLineChange
}) => {
  const [activeTab, setActiveTab] = React.useState<'code' | 'log' | 'both'>('both');

  const lines = code.split('\n');

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onCodeChange(text);
    } catch (e) {
      console.error('Failed to read clipboard', e);
    }
  };

  const handlePasteLog = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onErrorLogChange(text);
    } catch (e) {
      console.error('Failed to read clipboard', e);
    }
  };

  return (
    <section className="pane border-b border-[#1E293B]">
      {/* Pane Header */}
      <div className="pane-header">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Input Trace & Logic</span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'code'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'log'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terminal Log
          </button>
          <button
            onClick={() => setActiveTab('both')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'both'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split View
          </button>
        </div>
      </div>

      {/* Control Bar: Filename & Language */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E293B] bg-[#11151C]/60 text-xs gap-3">
        <div className="flex items-center gap-2 flex-1">
          <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            placeholder="Filename (e.g. auth_service/login.py)"
            className="bg-[#0B0E14] border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs w-full max-w-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span>Target Error Line:</span>
            <input
              type="number"
              value={errorLine || ''}
              onChange={(e) => onErrorLineChange(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 42"
              className="w-16 bg-[#0B0E14] border border-slate-800 rounded px-1.5 py-0.5 text-red-400 font-mono text-xs text-center focus:outline-none focus:border-red-500"
            />
          </div>

          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as ProgrammingLanguage)}
            className="bg-[#0B0E14] text-sky-400 font-mono border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0B0E14]">
        {/* Source Code View */}
        {(activeTab === 'code' || activeTab === 'both') && (
          <div className={`flex-1 flex flex-col relative overflow-hidden ${activeTab === 'both' ? 'h-1/2 border-b border-[#1E293B]' : 'h-full'}`}>
            <div className="flex items-center justify-between px-3 py-1 bg-[#11151C] border-b border-[#1E293B] text-[10px] text-slate-400 font-mono">
              <span className="uppercase font-bold text-slate-300">SOURCE CODE</span>
              <button
                onClick={handlePasteCode}
                className="hover:text-sky-300 flex items-center gap-1 transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3 h-3" />
                <span>Paste Code</span>
              </button>
            </div>

            <div className="flex-1 relative font-mono text-xs overflow-auto flex">
              {/* Line Numbers Gutter */}
              <div className="select-none py-3 px-2 bg-[#0B0E14] border-r border-[#1E293B] text-slate-600 text-right min-w-[40px]">
                {lines.map((_, idx) => {
                  const lineNum = idx + 1;
                  const isErrorLine = lineNum === errorLine;
                  return (
                    <div
                      key={idx}
                      className={`h-5 leading-5 text-[11px] font-mono ${
                        isErrorLine ? 'text-red-400 font-bold bg-red-950/40 -mx-2 px-2 border-r-2 border-red-500' : ''
                      }`}
                    >
                      {lineNum}
                    </div>
                  );
                })}
              </div>

              {/* Code Textarea Editor */}
              <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="Paste or write your source code here..."
                spellCheck={false}
                className="w-full h-full bg-transparent p-3 text-slate-200 font-mono text-xs leading-5 resize-none focus:outline-none selection:bg-sky-900/50"
              />
            </div>
          </div>
        )}

        {/* Terminal Trace View */}
        {(activeTab === 'log' || activeTab === 'both') && (
          <div className={`flex flex-col relative overflow-hidden ${activeTab === 'both' ? 'h-1/2' : 'h-full'}`}>
            <div className="flex items-center justify-between px-3 py-1 bg-[#11151C] border-b border-[#1E293B] text-[10px] text-slate-400 font-mono">
              <span className="uppercase font-bold text-red-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-red-400" />
                Terminal Log / Stack Trace
              </span>
              <button
                onClick={handlePasteLog}
                className="hover:text-sky-300 flex items-center gap-1 transition-colors"
                title="Paste log from clipboard"
              >
                <Clipboard className="w-3 h-3" />
                <span>Paste Log</span>
              </button>
            </div>

            <textarea
              value={errorLog}
              onChange={(e) => onErrorLogChange(e.target.value)}
              placeholder="Paste stack trace or error log output here..."
              spellCheck={false}
              className="w-full h-full bg-[#05070a] p-3 text-red-400/90 font-mono text-xs leading-5 resize-none focus:outline-none selection:bg-red-900/40 placeholder-slate-700"
            />
          </div>
        )}
      </div>
    </section>
  );
};
