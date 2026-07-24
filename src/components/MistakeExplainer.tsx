import React, { useState } from 'react';
import { Lightbulb, HelpCircle, Send, Sparkles, BookOpen, Check, ArrowRight, MessageSquare } from 'lucide-react';
import { ProgrammingLanguage } from '../types';

interface MistakeExplainerProps {
  code: string;
  diagnosis: string;
  language: ProgrammingLanguage;
}

export function MistakeExplainer({ code, diagnosis, language }: MistakeExplainerProps) {
  const [eli5Text, setEli5Text] = useState<string | null>(null);
  const [isGeneratingEli5, setIsGeneratingEli5] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'normal' | 'eli5' | 'qa'>('normal');

  const [question, setQuestion] = useState<string>('');
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Quick prompt presets for common mistake questions
  const quickQuestions = [
    'Why did my code break on this line?',
    'How can I prevent this bug in the future?',
    'Is there a simpler way to write this fix?',
  ];

  const handleFetchEli5 = async () => {
    setActiveTab('eli5');
    if (eli5Text) return; // already loaded

    setIsGeneratingEli5(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          diagnosis,
          language,
          mode: 'eli5',
        }),
      });
      const data = await res.json();
      if (res.ok && data.explanation) {
        setEli5Text(data.explanation);
      } else {
        setEli5Text('Imagine your code is like a recipe. One of the ingredients was missing, so the stove shut down safely before cooking!');
      }
    } catch (err) {
      console.error(err);
      setEli5Text('Imagine your code is like a recipe. One of the ingredients was missing, so the stove shut down safely before cooking!');
    } finally {
      setIsGeneratingEli5(false);
    }
  };

  const handleAskQuestion = async (promptToAsk?: string) => {
    const query = promptToAsk || question;
    if (!query.trim() || isAsking) return;

    setIsAsking(true);
    setActiveTab('qa');

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          diagnosis,
          language,
          userQuestion: query,
        }),
      });
      const data = await res.json();
      if (res.ok && data.explanation) {
        setQaHistory((prev) => [...prev, { q: query, a: data.explanation }]);
        setQuestion('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="antigravity-card rounded-2xl p-5 border border-amber-500/20 bg-[#0E121B]/90 space-y-4">
      {/* Header with Explanation Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Mistake Explanation & Learning Center
            </h3>
            <p className="text-[11px] text-slate-400">
              Understand why your code failed and how to prevent it
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[#07090E] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('normal')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'normal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Cause
          </button>
          <button
            onClick={handleFetchEli5}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'eli5'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Simple Analogy (ELI5)</span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Ask Follow-up</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'normal' && (
        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-slate-200 font-sans">
            <span className="font-semibold text-amber-300 block mb-1">Key Takeaway:</span>
            Always guard against unexpected <code className="bg-[#07090E] text-amber-300 px-1 py-0.5 rounded font-mono">null</code> or <code className="bg-[#07090E] text-amber-300 px-1 py-0.5 rounded font-mono">undefined</code> return values before invoking object properties or methods.
          </div>
        </div>
      )}

      {activeTab === 'eli5' && (
        <div className="space-y-3">
          {isGeneratingEli5 ? (
            <div className="p-4 rounded-xl bg-[#07090E] border border-slate-800 flex items-center gap-3 text-amber-300 text-xs">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>Translating mistake into a simple analogy...</span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#07090E] border border-amber-500/20 text-slate-200 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Simple Analogy Explanation</span>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {eli5Text}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'qa' && (
        <div className="space-y-3">
          {/* Quick Questions Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-400 font-mono">Quick questions:</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                className="px-2.5 py-1 rounded-lg bg-[#07090E] hover:bg-slate-800 text-sky-300 border border-slate-800 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Q&A Thread History */}
          {qaHistory.map((item, idx) => (
            <div key={idx} className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 font-medium flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{item.q}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07090E] border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                {item.a}
              </div>
            </div>
          ))}

          {/* Ask Input Box */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ask RX7 AI anything about your mistake or code..."
              className="flex-1 bg-[#07090E] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400 placeholder-slate-500"
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={isAsking || !question.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-[#07090E] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {isAsking ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Ask</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
