import React from 'react';
import { RLHFIterationRecord } from '../types';
import { History, X, ArrowRight, CheckCircle, Scale, Sparkles, UserCheck, GitCommit } from 'lucide-react';

interface RLHFHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: RLHFIterationRecord[];
  currentVersion: number;
}

export const RLHFHistoryDrawer: React.FC<RLHFHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  currentVersion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-neutral-900 border-l border-neutral-800 h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-100 font-cinzel">
                RLHF Rubric Evolution History
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Current State: Version {currentVersion} ({history.length} Human Review Cycles)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {history.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 space-y-2">
              <Scale className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-sm font-medium text-neutral-400">
                No RLHF Iterations Yet
              </p>
              <p className="text-xs">
                This is the initial publication synthesis (Version 1). Submit a rubric review to trigger the first RLHF alignment loop.
              </p>
            </div>
          ) : (
            history.map((record, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Iteration #{record.iteration}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center space-x-1">
                      <span>v{record.reviewedVersion}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                      <span className="text-emerald-400 font-bold">v{record.resultingVersion}</span>
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                    Score: {record.weightedScore.toFixed(2)}/5.00
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-neutral-400">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Reviewer: {record.reviewerAlias}</span>
                  <span>•</span>
                  <span className="uppercase text-[10px] font-mono text-amber-300">
                    {record.recommendation.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Human Rubric Directives:
                  </span>
                  <p className="text-xs text-neutral-300 font-mono bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850">
                    &ldquo;{record.humanDirectives}&rdquo;
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Agentic Alignment Delta:</span>
                  </span>
                  <p className="text-xs text-emerald-300/90 leading-relaxed font-serif-academic bg-emerald-950/10 p-2.5 rounded-lg border border-emerald-900/30">
                    {record.agenticRefinementsSummary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-900">
                  <div className="flex items-center space-x-1 text-neutral-400">
                    <GitCommit className="w-3 h-3 text-amber-400" />
                    <span>Logged to GitHub</span>
                  </div>
                  <div>
                    {new Date(record.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
