import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface FooterProps {
  status: 'ONLINE' | 'ANALYZING' | 'ERROR';
  modelUsed?: string;
  sessionId?: string;
}

export const Footer: React.FC<FooterProps> = ({
  status = 'ONLINE',
  modelUsed = 'GEMINI 2.5 FLASH',
  sessionId = 'XF-9902-88'
}) => {
  return (
    <footer className="footer">
      <div className="flex items-center gap-2">
        <span>SYSTEM:</span>
        <span className={`font-bold font-mono ${
          status === 'ONLINE' ? 'text-emerald-400' :
          status === 'ANALYZING' ? 'text-sky-400 animate-pulse' :
          'text-red-400'
        }`}>
          {status}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 ml-6 text-slate-500 font-mono text-[10px]">
        <Cpu className="w-3 h-3 text-sky-400" />
        <span>MODEL:</span>
        <span className="text-slate-300 font-semibold">{modelUsed}</span>
      </div>

      <div className="ml-auto flex items-center gap-6 font-mono text-[10px]">
        <div className="hidden md:block text-slate-500">
          ENVIRONMENT: <span className="text-slate-300 font-semibold">PRODUCTION_DEBUG</span>
        </div>
        <div className="text-slate-500">
          SESSION_ID: <span className="text-sky-400 font-semibold">{sessionId}</span>
        </div>
      </div>
    </footer>
  );
};
