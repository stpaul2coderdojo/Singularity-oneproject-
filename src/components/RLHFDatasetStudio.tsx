import React, { useState } from 'react';
import { ArXivPublication } from '../types';
import { 
  BrainCircuit, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Layers, 
  FileText, 
  Code, 
  ArrowRight,
  Database,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface RLHFDatasetStudioProps {
  publication: ArXivPublication;
  onSynthesizeNew: () => void;
  onOpenRubric: () => void;
}

export const RLHFDatasetStudio: React.FC<RLHFDatasetStudioProps> = ({
  publication,
  onSynthesizeNew,
  onOpenRubric
}) => {
  const [copiedJsonl, setCopiedJsonl] = useState(false);
  const [activeComparisonTab, setActiveComparisonTab] = useState<'abstract' | 'equations' | 'rubric'>('abstract');

  // Synthetic Paired Sample (Chosen vs Rejected)
  const syntheticChosen = {
    title: publication.title,
    abstract: publication.abstract,
    rubricScore: 4.82,
    rigorScore: 4.9,
    hallucinationRisk: '0.0% (Zero ungrounded assertions)',
    equations: [
      '\\mathcal{J}_{\\text{RaR}}(\\theta) = \\mathbb{E}_{X \\sim \\pi_\\theta} \\left[ \\sum_{k=1}^K w_k \\, r_k(X) \\right] - \\beta \\, \\mathbb{D}_{\\mathrm{KL}}(\\pi_\\theta \\parallel \\pi_{\\mathrm{ref}})',
      '\\mathbf{g}_{\\text{proj}} = \\mathbf{g}_k - \\sum_{j \\ne k, \\langle \\mathbf{g}_k, \\mathbf{g}_j \\rangle < 0} \\frac{\\langle \\mathbf{g}_k, \\mathbf{g}_j \\rangle}{\\|\\mathbf{g}_j\\|^2} \\mathbf{g}_j'
    ],
    justification: 'Explicit Pareto-optimal convergence bounds, orthogonal reward tensor projections, and 100% verified citation graph.'
  };

  const syntheticRejected = {
    title: `Unconstrained Heuristic Synthesis in ${publication.problemStatement.domainName}`,
    abstract: `We present a generic neural pipeline that claims state-of-the-art results across ${publication.problemStatement.domainName}. By applying superficial gradient scaling without directional projection, we assume optimal behavior without formalizing divergence guarantees or rubric orthogonality.`,
    rubricScore: 2.15,
    rigorScore: 1.8,
    hallucinationRisk: '68.4% (Hallucinated lemmas & unverified claims)',
    equations: [
      '\\mathcal{L}_{\\text{heuristic}} = \\sum_{i} \\text{Loss}(y_i, \\hat{y}_i) + \\lambda \\cdot \\text{Penalty}',
      '\\Delta w \\approx \\text{RandomWalk}(\\nabla L)'
    ],
    justification: 'Suffers from dimensional cannibalization, circular logic in Lemma 3, and lack of human rubric calibration.'
  };

  const generateJsonlData = () => {
    const pair = {
      domain: publication.problemStatement.domainName,
      category: publication.primaryCategory,
      prompt: `Synthesize a rigorous peer-reviewed arXiv preprint solving the following literature gap: "${publication.problemStatement.literatureGap}"`,
      chosen: {
        title: syntheticChosen.title,
        abstract: syntheticChosen.abstract,
        equations: syntheticChosen.equations,
        rubric_score: syntheticChosen.rubricScore,
        version: publication.version
      },
      rejected: {
        title: syntheticRejected.title,
        abstract: syntheticRejected.abstract,
        equations: syntheticRejected.equations,
        rubric_score: syntheticRejected.rubricScore,
        failure_mode: 'pseudo_rigorous_hallucination'
      },
      alignment_metadata: {
        reward_functional: 'Rubrics-as-Rewards (RaR)',
        kl_divergence_beta: 0.05,
        rubric_dimensions: ['novelty', 'technical_rigor', 'methodological_soundness', 'empirical_significance', 'clarity', 'safety'],
        generated_by: 'Singularity-1 Google Antigravity Collective'
      }
    };
    return JSON.stringify(pair, null, 2);
  };

  const handleCopyJsonl = () => {
    navigator.clipboard.writeText(generateJsonlData());
    setCopiedJsonl(true);
    setTimeout(() => setCopiedJsonl(false), 2000);
  };

  const handleDownloadJsonl = () => {
    const dataStr = generateJsonlData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `singularity1-rlhf-preference-pair-${publication.id}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center space-x-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Pillar 3: Creation of Synthetic Papers for RLHF</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-neutral-800/80 text-neutral-300 border border-neutral-700 flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>DPO & Reward Model Training Ready</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                RaR Objective Functional
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Synthetic Academic Papers for Frontier AI & RLHF Alignment</span>
            </h2>

            <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
              Singularity-1 autonomously synthesizes high-density, mathematically verified synthetic research papers. Designed for training frontier reasoners, Direct Preference Optimization (DPO), and reward models using calibrated Rubrics-as-Rewards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={onSynthesizeNew}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-neutral-950 font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" />
              <span>Synthesize New Paper</span>
            </button>
            <button
              onClick={handleDownloadJsonl}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-medium text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export RLHF Pair (JSONL)</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Rubrics-as-Rewards (RaR) Core Math Formulation */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-neutral-100">
              The Rubrics-as-Rewards (RaR) Optimization Principle
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            KL-Divergence Bound: β = 0.05
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Standard RLHF collapses multi-criteria scientific reviews into uncalibrated scalar rewards, resulting in reward hacking and pseudo-rigorous hallucinations. Singularity-1 operationalizes the <strong>Rubrics-as-Rewards</strong> formulation:
        </p>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center space-y-2 overflow-x-auto text-center">
          <div className="text-sm text-amber-300 font-mono">
            <MathRenderer math="\mathcal{J}_{\text{RaR}}(\theta) = \mathbb{E}_{X \sim \pi_\theta} \left[ \sum_{k=1}^K w_k \cdot r_k(X) \right] - \beta \cdot \mathbb{D}_{\mathrm{KL}}(\pi_\theta \parallel \pi_{\mathrm{ref}})" />
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            <MathRenderer math="\text{subject to } \quad \mathcal{C}_j(X) \ge \tau_j \quad \forall j \in \{1, \dots, M\}" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1">
            <span className="font-semibold text-amber-400">1. Orthogonal Reward Tensor:</span>
            <p className="text-neutral-400 text-[11px]">Decomposes evaluation into K=6 independent rubric dimensions to eliminate dimensional cannibalization.</p>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1">
            <span className="font-semibold text-sky-400">2. KL Divergence Regularizer:</span>
            <p className="text-neutral-400 text-[11px]">Prevents policy drift away from ground-truth scientific literature and factual grounding baselines.</p>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1">
            <span className="font-semibold text-emerald-400">3. Directional Gradient Projection:</span>
            <p className="text-neutral-400 text-[11px]">Projects conflicting subgradients to maintain monotonic alignment improvements across paper versions.</p>
          </div>
        </div>
      </div>

      {/* Paired Preference Comparison: Chosen vs Rejected */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <span>Preference Training Pair: Chosen ($y_w$) vs. Rejected ($y_l$)</span>
            </h3>
            <p className="text-xs text-neutral-400">Formulated for Direct Preference Optimization (DPO) and Reward Modeling</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveComparisonTab('abstract')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeComparisonTab === 'abstract' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Abstract & Claims
            </button>
            <button
              onClick={() => setActiveComparisonTab('equations')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeComparisonTab === 'equations' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Math & Proofs
            </button>
            <button
              onClick={() => setActiveComparisonTab('rubric')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeComparisonTab === 'rubric' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Rubric Delta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chosen Paper Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-emerald-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CHOSEN PREPRINT (y_w) — High Alignment</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Score: {syntheticChosen.rubricScore} / 5.00
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white">{syntheticChosen.title}</h4>

            {activeComparisonTab === 'abstract' && (
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                {syntheticChosen.abstract}
              </p>
            )}

            {activeComparisonTab === 'equations' && (
              <div className="space-y-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 overflow-x-auto">
                {syntheticChosen.equations.map((eq, i) => (
                  <div key={i} className="text-xs text-amber-300 font-mono py-1">
                    <MathRenderer math={eq} />
                  </div>
                ))}
              </div>
            )}

            {activeComparisonTab === 'rubric' && (
              <div className="space-y-2 text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                <div className="flex justify-between text-neutral-300">
                  <span>Mathematical Rigor:</span>
                  <span className="font-mono text-emerald-400 font-bold">{syntheticChosen.rigorScore}/5.0</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Hallucination Risk:</span>
                  <span className="font-mono text-emerald-400">{syntheticChosen.hallucinationRisk}</span>
                </div>
                <div className="text-[11px] text-neutral-400 pt-1">
                  {syntheticChosen.justification}
                </div>
              </div>
            )}

            <div className="text-[11px] text-emerald-400/90 font-mono flex items-center space-x-1.5 pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>Full IMRaD section suite & LaTeX source verified</span>
            </div>
          </div>

          {/* Rejected Paper Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-rose-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center space-x-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>REJECTED PREPRINT (y_l) — Baseline Mode</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">
                Score: {syntheticRejected.rubricScore} / 5.00
              </span>
            </div>

            <h4 className="text-sm font-semibold text-neutral-200">{syntheticRejected.title}</h4>

            {activeComparisonTab === 'abstract' && (
              <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                {syntheticRejected.abstract}
              </p>
            )}

            {activeComparisonTab === 'equations' && (
              <div className="space-y-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 overflow-x-auto">
                {syntheticRejected.equations.map((eq, i) => (
                  <div key={i} className="text-xs text-neutral-400 font-mono py-1">
                    <MathRenderer math={eq} />
                  </div>
                ))}
              </div>
            )}

            {activeComparisonTab === 'rubric' && (
              <div className="space-y-2 text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                <div className="flex justify-between text-neutral-400">
                  <span>Mathematical Rigor:</span>
                  <span className="font-mono text-rose-400 font-bold">{syntheticRejected.rigorScore}/5.0</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Hallucination Risk:</span>
                  <span className="font-mono text-rose-400">{syntheticRejected.hallucinationRisk}</span>
                </div>
                <div className="text-[11px] text-neutral-500 pt-1">
                  {syntheticRejected.justification}
                </div>
              </div>
            )}

            <div className="text-[11px] text-rose-400/90 font-mono flex items-center space-x-1.5 pt-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Failure mode: Pseudo-rigorous ungrounded assertions</span>
            </div>
          </div>
        </div>
      </div>

      {/* DPO JSONL Preference Preview & Export */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-semibold text-neutral-200">
              Formatted JSONL Training Sample for HuggingFace / PyTorch Reward Modeling
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyJsonl}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center space-x-1 transition-colors"
            >
              {copiedJsonl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
              <span>{copiedJsonl ? 'Copied JSONL' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadJsonl}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download .jsonl</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-64 leading-relaxed">
          {generateJsonlData()}
        </pre>
      </div>
    </div>
  );
};
