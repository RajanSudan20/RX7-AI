import React from 'react';
import { 
  FileCode, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  BookOpen, 
  Code, 
  Bug,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { CodeSession, PresetSample, ProgrammingLanguage } from '../types';

interface SidebarProps {
  sessions: CodeSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onSelectPreset: (preset: PresetSample) => void;
  onDeleteSession: (id: string) => void;
  presets: PresetSample[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onSelectPreset,
  onDeleteSession,
  presets,
}) => {
  const [filterLang, setFilterLang] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const filteredPresets = presets.filter((p) => {
    const matchesLang = filterLang === 'all' || p.language === filterLang;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.errorCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <aside className="sidebar">
      {/* Active Session Header Section */}
      <div className="p-4 border-b border-[#1E293B] bg-[#0B0E14]/40">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          Active Session
        </div>
        <div className="mt-1 font-semibold text-slate-100 font-mono truncate text-xs flex items-center justify-between">
          <span className="truncate">{activeSession?.filename || 'auth_service/login.py'}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40 uppercase font-sans">
            {activeSession?.language || 'python'}
          </span>
        </div>
      </div>

      {/* Preset Bug Catalog & User History Tabs/List */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Preset Bug Samples Header */}
        <div className="px-3 pt-3 pb-2 border-b border-[#1E293B] bg-[#11151C]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Bug className="w-3 h-3 text-sky-400" />
              Sample Bug Presets
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              {filteredPresets.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search bugs or languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0E14] border border-slate-800 rounded pl-7 pr-2 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Language Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-none">
            {['all', 'python', 'typescript', 'javascript', 'go', 'cpp'].map((lang) => (
              <button
                key={lang}
                onClick={() => setFilterLang(lang)}
                className={`px-2 py-0.5 rounded text-[10px] capitalize whitespace-nowrap transition-colors ${
                  filterLang === lang
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Items List */}
        <div className="divide-y divide-[#1E293B]/60">
          {filteredPresets.map((preset) => {
            const isSelected = activeSession?.filename === preset.filename;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-3 cursor-pointer transition-all hover:bg-[#1E293B]/40 group border-l-2 ${
                  isSelected
                    ? 'bg-sky-500/10 border-l-[#38BDF8] text-slate-100'
                    : 'border-l-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                    {preset.filename}
                  </span>
                  <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400">
                    {preset.language}
                  </span>
                </div>
                <div className="text-[11px] text-red-400/90 font-mono truncate flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="truncate">{preset.errorCategory} at L{preset.errorLine}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Saved Session Traces */}
        {sessions.length > 0 && (
          <div className="mt-auto border-t border-[#1E293B] bg-[#11151C]/80 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center justify-between">
              <span>Session History ({sessions.length})</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer text-[11px] transition-colors ${
                      isActive
                        ? 'bg-sky-950/60 text-sky-300 border border-sky-800/60'
                        : 'bg-[#0B0E14] text-slate-400 hover:bg-slate-800/80 border border-slate-800'
                    }`}
                  >
                    <div className="truncate font-mono pr-2">
                      <div className="font-medium text-slate-200 truncate">{s.filename}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {s.status === 'fixed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(s.id);
                        }}
                        className="p-1 hover:text-red-400 text-slate-600 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
