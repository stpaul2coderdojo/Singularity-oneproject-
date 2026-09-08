import React, { useState } from 'react';
import { 
  HumanReviewRubric, 
  ReviewDecision, 
  ArXivPublication, 
  RubricDimension 
} from '../types';
import { DEFAULT_RUBRIC_DIMENSIONS } from '../data/domains';
import confetti from 'canvas-confetti';
import { 
  Scale, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  Sparkles, 
  Send,
  MessageSquare,
  ShieldCheck,
  Zap,
  Info,
  GitCommit
} from 'lucide-react';

interface RubricReviewModalProps {
  publication: ArXivPublication;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRLHFReview: (rubric: HumanReviewRubric) => Promise<void>;
  isRefining: boolean;
}

export const RubricReviewModal: React.FC<RubricReviewModalProps> = ({
  publication,
  isOpen,
  onClose,
  onSubmitRLHFReview,
  isRefining
}) => {
  const [reviewerAlias, setReviewerAlias] = useState('Dr. Human Reviewer (Area Chair)');
  const [reviewerExpertise, setReviewerExpertise] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [dimensions, setDimensions] = useState<HumanReviewRubric['dimensions']>({
    ...DEFAULT_RUBRIC_DIMENSIONS
  });
  const [recommendation, setRecommendation] = useState<ReviewDecision>('accept');
  const [strengths, setStrengths] = useState(
    'Strong mathematical motivation for the Rubrics-as-Rewards vector decomposition. Sound theoretical guarantees on Pareto-optimal policy convergence.'
  );
  const [weaknesses, setWeaknesses] = useState(
    'Could provide more empirical ablation on how individual rubric dimension weights (w_k) impact optimization stability under extreme preference noise.'
  );
  const [actionableDirectives, setActionableDirectives] = useState(
    'Strengthen Section 3 mathematical notation clarity and add a dedicated ablation paragraph in Section 5 analyzing rubric weight sensitivity.'
  );
  const [activeDimensionKey, setActiveDimensionKey] = useState<keyof HumanReviewRubric['dimensions']>('novelty');

  if (!isOpen) return null;

  // Calculate composite weighted score
  const calculateWeightedScore = () => {
    let total = 0;
    Object.values(dimensions).forEach((dim) => {
      total += dim.score * dim.weight;
    });
    return Math.round(total * 100) / 100;
  };

  const weightedScore = calculateWeightedScore();

  const handleScoreChange = (dimKey: keyof HumanReviewRubric['dimensions'], newScore: number) => {
    setDimensions((prev) => ({
      ...prev,
      [dimKey]: {
        ...prev[dimKey],
        score: newScore
      }
    }));
  };

  const handleCritiqueChange = (dimKey: keyof HumanReviewRubric['dimensions'], text: string) => {
    setDimensions((prev) => ({
      ...prev,
      [dimKey]: {
        ...prev[dimKey],
        critique: text
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rubric: HumanReviewRubric = {
      id: 'rubric-' + Date.now(),
      publicationId: publication.id,
      reviewerAlias,
      reviewerExpertise,
      dimensions,
      qualitativeCritique: {
        strengthsSummary: strengths,
        weaknessesSummary: weaknesses,
        questionsForAuthors: '',
        actionableDirectivesForRLHF: actionableDirectives
      },
      recommendation,
      weightedScore,
      submittedAt: new Date().toISOString()
    };

    await onSubmitRLHFReview(rubric);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }
  };

  const getDecisionBadge = (dec: ReviewDecision) => {
    switch (dec) {
      case 'strong_accept':
        return { label: 'Strong Accept (Oral)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'accept':
        return { label: 'Accept (Spotlight)', color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' };
      case 'weak_accept':
        return { label: 'Weak Accept (Poster)', color: 'text-teal-300 bg-teal-500/10 border-teal-500/30' };
      case 'borderline':
        return { label: 'Borderline', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'weak_reject':
        return { label: 'Weak Reject', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
      case 'reject':
        return { label: 'Reject', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    }
  };

  const activeDim = dimensions[activeDimensionKey];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  Singularity-1 RLHF Evaluation Engine
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Reviewing {publication.arxivId} (v{publication.version})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 font-cinzel mt-0.5 truncate max-w-2xl">
                Open Review Rubric: {publication.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Two Columns */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Reviewer Meta Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Human Reviewer Name / Institutional Alias
              </label>
              <input
                type="text"
                value={reviewerAlias}
                onChange={(e) => setReviewerAlias(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Domain Expertise Level
              </label>
              <select
                value={reviewerExpertise}
                onChange={(e) => setReviewerExpertise(Number(e.target.value) as any)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
              >
                <option value={1}>1 - Informed Outsider</option>
                <option value={2}>2 - Graduate Researcher</option>
                <option value={3}>3 - Domain Practitioner</option>
                <option value={4}>4 - Senior Peer Reviewer</option>
                <option value={5}>5 - Area Chair / Benchmark Authority</option>
              </select>
            </div>
          </div>

          {/* Rubric Dimensions Grid & Tabbed Inspector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>The 6 arXiv Quality Rubric Dimensions</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Select each dimension to inspect criteria standards (1-5) and provide targeted qualitative feedback.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Composite Weighted Rubric Score</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {weightedScore.toFixed(2)}{' '}
                  <span className="text-xs text-neutral-500 font-normal">/ 5.00</span>
                </span>
              </div>
            </div>

            {/* Dimension Selection Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
              {Object.entries(dimensions).map(([key, dim]) => {
                const isActive = activeDimensionKey === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setActiveDimensionKey(key as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/40 text-neutral-100'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                        w: {(dim.weight * 100).toFixed(0)}%
                      </span>
                      <span className="text-xs font-bold font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        {dim.score}/5
                      </span>
                    </div>
                    <div className="text-xs font-semibold truncate leading-snug">
                      {dim.name.split('&')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Dimension Deep Inspector */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">
                      {activeDim.name}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      (Contribution to Reward: {(activeDim.weight * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {activeDim.description}
                  </p>
                </div>

                {/* Score Selector (1-5) */}
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((scoreVal) => (
                    <button
                      type="button"
                      key={scoreVal}
                      onClick={() => handleScoreChange(activeDimensionKey, scoreVal)}
                      className={`w-9 h-9 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center ${
                        activeDim.score === scoreVal
                          ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400 shadow-md'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      {scoreVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rubric Criteria Standard for Selected Score */}
              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-amber-300 font-bold mr-1">
                    Level {activeDim.score} Standard:
                  </span>
                  <span className="text-neutral-300">
                    {activeDim.standardsDescription[activeDim.score as 1 | 2 | 3 | 4 | 5]}
                  </span>
                </div>
              </div>

              {/* Qualitative Critique for this Dimension */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Specific Critique & Direction for {activeDim.name}
                </label>
                <textarea
                  rows={2}
                  value={activeDim.critique}
                  onChange={(e) => handleCritiqueChange(activeDimensionKey, e.target.value)}
                  placeholder={`Optional specific feedback to guide the Antigravity agent on improving ${activeDim.name}...`}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Overall Recommendation & Actionable Directives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Decision Selector */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-mono uppercase text-neutral-400">
                Official Peer Review Recommendation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'strong_accept',
                  'accept',
                  'weak_accept',
                  'borderline',
                  'weak_reject',
                  'reject'
                ].map((decKey) => {
                  const badge = getDecisionBadge(decKey as ReviewDecision);
                  const isSelected = recommendation === decKey;
                  return (
                    <button
                      type="button"
                      key={decKey}
                      onClick={() => setRecommendation(decKey as ReviewDecision)}
                      className={`text-xs px-2.5 py-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-300'
                      }`}
                    >
                      {badge.label}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Primary Strengths
                </label>
                <textarea
                  rows={2}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Right: Actionable Directives for RLHF */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-amber-400 font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Actionable Directives for Agentic RLHF Loop</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                These explicit directives will be ingested by the Rubric Alignment Agent to synthesize the next revision (v{publication.version + 1}).
              </p>

              <div>
                <textarea
                  rows={4}
                  value={actionableDirectives}
                  onChange={(e) => setActionableDirectives(e.target.value)}
                  placeholder="e.g. Tighten Theorem 1 proof boundary conditions, clarify notation in Equation 3, and add baseline comparison against DPO..."
                  className="w-full bg-neutral-900 border border-amber-500/40 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Primary Weaknesses to Overcome
                </label>
                <textarea
                  rows={2}
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-neutral-400 font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Next Iteration Target: Version {publication.version + 1}</span>
              </div>
              <div className="flex items-center space-x-1 text-neutral-500">
                <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-logs review to GitHub</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRefining}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
                  isRefining
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-neutral-950 shadow-amber-950/40 cursor-pointer'
                }`}
              >
                {isRefining ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Agentic Alignment in Progress...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Rubric & Trigger RLHF Iteration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
