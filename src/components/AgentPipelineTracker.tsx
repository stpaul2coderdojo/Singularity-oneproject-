import React from 'react';
import { AgentStepTelemetry } from '../types';
import { Brain, Cpu, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AgentPipelineTrackerProps {
  steps: AgentStepTelemetry[];
  isGenerating: boolean;
  totalTimeMs?: number;
  modelName?: string;
  activeStageIndex?: number;
}

export const AgentPipelineTracker: React.FC<AgentPipelineTrackerProps> = ({
  steps,
  isGenerating,
  totalTimeMs,
  modelName = 'gemini-3.8-flash',
  activeStageIndex = 0
}) => {
  const getAgentIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Brain className="w-4 h-4" />;
      case 1:
        return <Cpu className="w-4 h-4" />;
      case 2:
        return <FileText className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800/90 rounded-xl p-4 my-4 shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
            Google Antigravity Agentic Telemetry
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-400">
            Model: {modelName}
          </span>
        </div>
        {totalTimeMs && (
          <div className="flex items-center space-x-1 text-xs font-mono text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>Pipeline Execution: {(totalTimeMs / 1000).toFixed(2)}s</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
        {steps.map((step, idx) => {
          const isCurrent = isGenerating && idx === activeStageIndex;
          const isDone = step.status === 'completed';

          return (
            <div
              key={step.id || idx}
              className={`p-3 rounded-lg border text-left transition-all ${
                isCurrent
                  ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40 shadow-sm'
                  : isDone
                  ? 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
                  : 'bg-neutral-900/20 border-neutral-900 text-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`p-1.5 rounded-md border ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600'
                  }`}
                >
                  {getAgentIcon(idx)}
                </div>
                {isCurrent && (
                  <div className="flex items-center space-x-1 text-[10px] font-mono text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Synthesizing</span>
                  </div>
                )}
                {isDone && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {!isCurrent && !isDone && (
                  <span className="text-[10px] font-mono text-neutral-600">Pending</span>
                )}
              </div>

              <div className="text-xs font-semibold text-neutral-200 truncate">
                {step.agentName}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono truncate">
                {step.agentRole}
              </div>
              {step.summary && (
                <div className="text-[11px] text-neutral-400 mt-2 line-clamp-2 leading-tight">
                  {step.summary}
                </div>
              )}
              {step.durationMs && (
                <div className="text-[10px] text-neutral-500 font-mono mt-1.5">
                  {(step.durationMs / 1000).toFixed(2)}s
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
