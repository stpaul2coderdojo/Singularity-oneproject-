import React, { useState } from 'react';
import { ProblemStatement, ProposedSolution } from '../types';
import { MathRenderer, FormattedAcademicText } from './MathRenderer';
import { 
  FileQuestion, 
  Lightbulb, 
  Sigma, 
  Cpu, 
  GitCommit, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface ProblemAndSolutionViewProps {
  problem: ProblemStatement;
  solution: ProposedSolution;
  onAdvanceToPublication: () => void;
  onOpenRubric: () => void;
}

export const ProblemAndSolutionView: React.FC<ProblemAndSolutionViewProps> = ({
  problem,
  solution,
  onAdvanceToPublication,
  onOpenRubric
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'both'>('both');
  const [copiedMath, setCopiedMath] = useState(false);

  const handleCopyMath = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMath(true);
    setTimeout(() => setCopiedMath(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Agentic Synthesis Stage 2 of 3
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              arXiv [{problem.arxivCategory}]
            </span>
          </div>
          <h2 className="text-lg font-bold text-neutral-100 font-cinzel mt-1">
            Agentic Formulation: Problem Statement & Solution Architecture
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-neutral-950 p-1 rounded-lg border border-neutral-800 flex text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'both'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'problem'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'solution'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Solution
            </button>
          </div>

          <button
            onClick={onAdvanceToPublication}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Full arXiv Preprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Problem Statement Card */}
        {(activeTab === 'both' || activeTab === 'problem') && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-medium">
                      Formulated Problem Statement
                    </span>
                    <h3 className="text-base font-bold text-neutral-100">
                      {problem.title}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                  {problem.domainName}
                </span>
              </div>

              {/* Executive Summary */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Executive Synopsis
                </span>
                <p className="text-sm text-neutral-200 leading-relaxed font-serif-academic text-justify">
                  {problem.executiveSummary}
                </p>
              </div>

              {/* Background & Literature Gap */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Background & Context
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-serif-academic">
                    {problem.backgroundAndMotivation}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-1">
                    Literature Gap & Theoretical Bottleneck
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-serif-academic p-3 rounded-lg bg-amber-950/10 border border-amber-900/30">
                    {problem.literatureGap}
                  </p>
                </div>
              </div>

              {/* Formal & Mathematical Definition */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Formal Mathematical Specification
                </h4>
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300">
                  <FormattedAcademicText text={problem.formalDefinition} />
                </div>

                {problem.mathematicalFormulation && (
                  <div className="my-2">
                    <MathRenderer
                      math={problem.mathematicalFormulation}
                      equationNumber="Objective"
                    />
                  </div>
                )}
              </div>

              {/* Impact Potential */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Frontier Impact Potential
                </span>
                <p className="text-xs text-emerald-400/90 bg-emerald-950/10 p-2.5 rounded-lg border border-emerald-900/30">
                  {problem.impactPotential}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Agent: Problem Formulation Agent</span>
              <span>Validated against arXiv Criteria</span>
            </div>
          </div>
        )}

        {/* Proposed Solution Card */}
        {(activeTab === 'both' || activeTab === 'solution') && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
                      Synthesized Solution Architecture
                    </span>
                    <h3 className="text-base font-bold text-neutral-100">
                      {solution.title}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {solution.paradigmName}
                </span>
              </div>

              {/* Core Hypothesis */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Core Scientific Hypothesis
                </span>
                <p className="text-sm text-neutral-200 leading-relaxed font-serif-academic text-justify">
                  {solution.coreHypothesis}
                </p>
              </div>

              {/* Architectural Overview */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Architectural Overview</span>
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-serif-academic">
                  {solution.architecturalOverview}
                </p>
              </div>

              {/* Algorithmic Pipeline */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center space-x-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Algorithmic Execution Pipeline</span>
                </h4>
                <div className="space-y-1.5">
                  {solution.algorithmicPipeline.map((step, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-neutral-300 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-start space-x-2"
                    >
                      <span className="text-[10px] font-mono text-amber-400 font-bold mt-0.5 px-1 rounded bg-amber-500/10">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theoretical Guarantees */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1 flex items-center space-x-1.5">
                  <Sigma className="w-3.5 h-3.5" />
                  <span>Theoretical Guarantees & Complexity</span>
                </h4>
                <p className="text-xs text-neutral-300 font-serif-academic leading-relaxed">
                  <FormattedAcademicText text={solution.theoreticalGuarantees} />
                </p>
                <div className="mt-2 text-[11px] font-mono text-neutral-400 flex items-center justify-between border-t border-neutral-900 pt-2">
                  <span>Asymptotic Complexity:</span>
                  <span className="text-amber-300 font-bold">{solution.computationalComplexity}</span>
                </div>
              </div>

              {/* Expected Benchmarks */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-sky-400" />
                  <span>Target Empirical Benchmarks</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {solution.expectedBenchmarks.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 font-mono text-center"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Agent: Solution Architect Agent</span>
              <button
                onClick={onOpenRubric}
                className="text-amber-400 hover:text-amber-300 font-medium underline"
              >
                Audit with Rubric
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation */}
      <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-200">
              Problem and Solution Derived by Antigravity Agents
            </p>
            <p className="text-[11px] text-neutral-400">
              Proceed to review the fully typeset arXiv preprint paper and execute Human RLHF Rubric scoring.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={onOpenRubric}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
          >
            Open Rubric Audit
          </button>
          <button
            onClick={onAdvanceToPublication}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <span>Proceed to arXiv Preprint</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
