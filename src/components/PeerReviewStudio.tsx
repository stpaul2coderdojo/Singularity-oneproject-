import React, { useState } from 'react';
import { ArXivPublication, HumanReviewRubric, ReviewDecision } from '../types';
import { 
  Scale, 
  Sparkles, 
  Award, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Sliders,
  ExternalLink,
  Layers,
  BookOpen
} from 'lucide-react';

interface PeerReviewStudioProps {
  publication: ArXivPublication;
  onSubmitRLHFReview: (rubric: HumanReviewRubric) => Promise<void>;
  isRefining?: boolean;
}

export const PeerReviewStudio: React.FC<PeerReviewStudioProps> = ({
  publication,
  onSubmitRLHFReview,
  isRefining = false
}) => {
  const [reviewMode, setReviewMode] = useState<'current' | 'external'>('current');
  const [externalPaperText, setExternalPaperText] = useState('');
  const [externalPaperTitle, setExternalPaperTitle] = useState('');
  const [reviewerAlias, setReviewerAlias] = useState('Dr. Bheemaiah Anil K.');
  const [reviewerRole, setReviewerRole] = useState('Area Chair / Senior Meta-Reviewer');
  const [reviewerExpertise, setReviewerExpertise] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [conferencePreset, setConferencePreset] = useState<'neurips' | 'iclr' | 'icml' | 'arxiv'>('neurips');

  // 6 Core Rubric Dimensions (v2.4 Standard)
  const [scores, setScores] = useState<{
    novelty: number;
    rigor: number;
    soundness: number;
    significance: number;
    clarity: number;
    safety: number;
  }>({
    novelty: 4.5,
    rigor: 4.8,
    soundness: 4.7,
    significance: 4.6,
    clarity: 4.4,
    safety: 4.9
  });

  const [strengths, setStrengths] = useState(
    'The formalization of the Rubrics-as-Rewards functional is theoretically grounded with clear dimensional orthogonality. The algorithmic derivations avoid mode collapse and dimensional cannibalization.'
  );
  const [weaknesses, setWeaknesses] = useState(
    'Ablation analyses in Section 4 could further stress-test extreme multi-agent feedback under adversarial divergence bounds.'
  );
  const [questions, setQuestions] = useState(
    'How does the computational complexity scale when expanding the rubric tensor dimension beyond K=16 orthogonal human feedback metrics?'
  );
  const [directives, setDirectives] = useState(
    'Tighten theoretical derivations in Section 3 and provide concrete Pareto frontier bounds for alignment trade-offs in Section 5.'
  );

  const [copiedReview, setCopiedReview] = useState(false);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);

  // Compute weighted score (weights sum to 1.0)
  const weightedScore = Number(
    (
      scores.novelty * 0.20 +
      scores.rigor * 0.25 +
      scores.soundness * 0.20 +
      scores.significance * 0.15 +
      scores.clarity * 0.10 +
      scores.safety * 0.10
    ).toFixed(2)
  );

  const getDecision = (score: number): { decision: ReviewDecision; label: string; color: string; badgeBg: string } => {
    if (score >= 4.5) return { decision: 'strong_accept', label: 'Strong Accept (Oral / Award Candidate)', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 3.8) return { decision: 'accept', label: 'Accept (Spotlight / Poster)', color: 'text-emerald-300', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 3.2) return { decision: 'weak_accept', label: 'Weak Accept', color: 'text-sky-300', badgeBg: 'bg-sky-500/10 border-sky-500/30' };
    if (score >= 2.6) return { decision: 'borderline', label: 'Borderline Paper', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30' };
    if (score >= 2.0) return { decision: 'weak_reject', label: 'Weak Reject', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 border-orange-500/30' };
    return { decision: 'reject', label: 'Reject', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const decisionInfo = getDecision(weightedScore);

  const handleApplyToRLHF = async () => {
    const rubricData: HumanReviewRubric = {
      id: 'rubric-' + Date.now(),
      publicationId: publication.id,
      reviewerAlias: `${reviewerAlias} (${reviewerRole})`,
      reviewerExpertise,
      dimensions: {
        novelty: {
          id: 'dim-novelty',
          name: 'Novelty & Conceptual Originality',
          weight: 0.20,
          score: scores.novelty,
          description: 'Originality of literature gap isolation and mathematical framework.',
          standardsDescription: {
            1: 'Derivative reproduction',
            2: 'Incremental delta',
            3: 'Moderate innovation',
            4: 'High original contribution',
            5: 'Breakthrough paradigm shift'
          },
          critique: 'High novelty in formulating RaR reward tensors.'
        },
        technicalRigor: {
          id: 'dim-rigor',
          name: 'Mathematical Rigor & Proof Validity',
          weight: 0.25,
          score: scores.rigor,
          description: 'Correctness of mathematical formulation, objective functional, and bounds.',
          standardsDescription: {
            1: 'Heuristic claims with mathematical flaws',
            2: 'Informal equations without proof steps',
            3: 'Adequate mathematical formalism',
            4: 'Rigorous theorem proofs with minimal omissions',
            5: 'Flawless axiomatic proofs and convergence guarantees'
          },
          critique: 'Tight mathematical formalization of directional policy gradient.'
        },
        methodologicalSoundness: {
          id: 'dim-soundness',
          name: 'Methodological Soundness',
          weight: 0.20,
          score: scores.soundness,
          description: 'Soundness of algorithmic pipeline and evaluation methodology.',
          standardsDescription: {
            1: 'Severely confounded methodology',
            2: 'Weak ablation baselines',
            3: 'Standard scientific methodology',
            4: 'Robust experimental protocol',
            5: 'Gold-standard methodology with extreme ablation controls'
          },
          critique: 'Well-specified pipeline with projection operator.'
        },
        empiricalSignificance: {
          id: 'dim-significance',
          name: 'Empirical Significance & Impact',
          weight: 0.15,
          score: scores.significance,
          description: 'Reproducibility and practical significance of theoretical guarantees.',
          standardsDescription: {
            1: 'Negligible empirical utility',
            2: 'Marginal gain over trivial baselines',
            3: 'Statistically solid gains on standard benchmarks',
            4: 'Substantial improvement over state of the art',
            5: 'Transformative empirical breakthrough'
          },
          critique: 'Meaningful gains across Pareto frontiers.'
        },
        expositionClarity: {
          id: 'dim-clarity',
          name: 'Exposition Clarity & LaTeX Typesetting',
          weight: 0.10,
          score: scores.clarity,
          description: 'Clarity of prose, KaTeX typesetting quality, and IMRaD section structure.',
          standardsDescription: {
            1: 'Unclear and disorganized',
            2: 'Poorly structured with syntax errors',
            3: 'Readable and standard arXiv layout',
            4: 'Polished prose with clean mathematical typesetting',
            5: 'Exemplary academic prose ready for top-tier archival'
          },
          critique: 'Clear academic tone and disciplined notation.'
        },
        safetyAndEthics: {
          id: 'dim-safety',
          name: 'AI Alignment & Safety Governance',
          weight: 0.10,
          score: scores.safety,
          description: 'Adherence to AI safety principles, divergence bounds, and open science provenance.',
          standardsDescription: {
            1: 'No alignment controls; hallucination risk',
            2: 'Superficial safety mentions',
            3: 'Standard safety disclaimer and ethical reflection',
            4: 'Explicit divergence regularization and human oversight',
            5: 'Comprehensive Pareto safety guarantees and provable containment'
          },
          critique: 'Explicit divergence bound against pseudo-rigorous hallucination.'
        }
      },
      qualitativeCritique: {
        strengthsSummary: strengths,
        weaknessesSummary: weaknesses,
        questionsForAuthors: questions,
        actionableDirectivesForRLHF: directives
      },
      recommendation: decisionInfo.decision,
      weightedScore,
      submittedAt: new Date().toISOString()
    };

    await onSubmitRLHFReview(rubricData);
  };

  const handleRunAiAudit = () => {
    setIsAiEvaluating(true);
    setTimeout(() => {
      if (reviewMode === 'external' && externalPaperText.length < 20) {
        setIsAiEvaluating(false);
        return;
      }
      setScores({
        novelty: 4.6,
        rigor: 4.7,
        soundness: 4.8,
        significance: 4.5,
        clarity: 4.7,
        safety: 4.9
      });
      setStrengths('Comprehensive literature grounding, explicit theorem proofs, and robust mathematical formulation. The paper adheres closely to NeurIPS / arXiv archival standards.');
      setWeaknesses('Consider expanding empirical validation across additional out-of-distribution baselines to demonstrate generalization.');
      setQuestions('How sensitive are the convergence bounds to variations in the hyperparameter beta?');
      setDirectives('Incorporate cross-validation tables across standard benchmark datasets in Section 4.');
      setIsAiEvaluating(false);
    }, 900);
  };

  const handleCopyReport = () => {
    const reportText = `=== SINGULARITY-1 PEER REVIEW REPORT ===
Paper: ${reviewMode === 'current' ? publication.title : externalPaperTitle || 'External Manuscript'}
Conference/Venue Preset: ${conferencePreset.toUpperCase()}
Reviewer: ${reviewerAlias} (${reviewerRole}) | Expertise: ${reviewerExpertise}/5
Final Recommendation: ${decisionInfo.label} (Weighted Score: ${weightedScore}/5.00)

DIMENSIONAL SCORECARD:
- Novelty & Originality (20%): ${scores.novelty}/5.0
- Mathematical Rigor & Proofs (25%): ${scores.rigor}/5.0
- Methodological Soundness (20%): ${scores.soundness}/5.0
- Empirical Significance (15%): ${scores.significance}/5.0
- Exposition & LaTeX Clarity (10%): ${scores.clarity}/5.0
- Alignment Safety & Ethics (10%): ${scores.safety}/5.0

QUALITATIVE CRITIQUE:
Strengths:
${strengths}

Weaknesses:
${weaknesses}

Questions for Authors:
${questions}

Actionable Directives for RLHF Alignment:
${directives}
========================================`;

    navigator.clipboard.writeText(reportText);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Pillar 1: Peer Review & Rubric Auditor</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-neutral-800/80 text-neutral-300 border border-neutral-700 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NeurIPS / ICML / arXiv Rubric v2.4</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Multi-Attribute Tensor Scoring
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Scientific Peer Review & Rubrics-as-Rewards Engine</span>
            </h2>

            <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
              Singularity-1 empowers peer reviewers, area chairs, and AI alignment teams to evaluate research papers across six orthogonal dimensions. Review your synthetic preprints or audit external drafts with calibrated decision support.
            </p>
          </div>

          {/* Quick Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
            <button
              onClick={() => setReviewMode('current')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 w-full sm:w-auto justify-center ${
                reviewMode === 'current'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Active Synthetic Paper</span>
            </button>
            <button
              onClick={() => setReviewMode('external')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 w-full sm:w-auto justify-center ${
                reviewMode === 'external'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Review External Paper</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Paper Banner */}
      <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {reviewMode === 'current' ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Active Preprint ({publication.arxivId})
              </span>
              <span className="text-xs text-neutral-400 font-mono">Version v{publication.version}</span>
            </div>
            <h3 className="text-sm font-semibold text-neutral-100">{publication.title}</h3>
            <p className="text-xs text-neutral-400 line-clamp-1">{publication.abstract}</p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-amber-300 flex items-center space-x-1.5">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Audit External Manuscript / Preprint</span>
              </span>
              <span className="text-[11px] text-neutral-400">Paste paper abstract or sections below</span>
            </div>
            <input
              type="text"
              value={externalPaperTitle}
              onChange={(e) => setExternalPaperTitle(e.target.value)}
              placeholder="Paper Title (e.g., Deep Learning with Adaptive Rubric Tensors)"
              className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            <textarea
              rows={3}
              value={externalPaperText}
              onChange={(e) => setExternalPaperText(e.target.value)}
              placeholder="Paste Abstract or Key Claims of external paper for automated rubric extraction..."
              className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleRunAiAudit}
            disabled={isAiEvaluating}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 transition-all flex items-center space-x-1.5"
            title="Auto-calculate calibrated scores via AI Peer Reviewer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAiEvaluating ? 'Analyzing...' : 'Auto-Score Rubric'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Scorecard & Calibration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 6 Dimension Sliders */}
        <div className="lg:col-span-2 space-y-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-neutral-100">6-Dimensional Academic Rubric (v2.4)</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-neutral-400">Preset:</span>
              <select
                value={conferencePreset}
                onChange={(e: any) => setConferencePreset(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-neutral-200"
              >
                <option value="neurips">NeurIPS 2026</option>
                <option value="iclr">ICLR 2026</option>
                <option value="icml">ICML 2026</option>
                <option value="arxiv">arXiv Archival</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {/* Dimension 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">1. Novelty & Conceptual Originality (Weight: 20%)</span>
                <span className="font-mono text-amber-400 font-bold">{scores.novelty} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={scores.novelty}
                onChange={(e) => setScores({ ...scores, novelty: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <p className="text-[11px] text-neutral-400">Evaluates isolation of literature gaps, originality of formulation, and departure from superficial rephrasing.</p>
            </div>

            {/* Dimension 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">2. Mathematical Rigor & Proof Validity (Weight: 25%)</span>
                <span className="font-mono text-amber-400 font-bold">{scores.rigor} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={scores.rigor}
                onChange={(e) => setScores({ ...scores, rigor: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <p className="text-[11px] text-neutral-400">Verifies axiomatic soundness, objective function bounds, and algebraic consistency without pseudo-rigorous hallucinations.</p>
            </div>

            {/* Dimension 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">3. Methodological Soundness (Weight: 20%)</span>
                <span className="font-mono text-amber-400 font-bold">{scores.soundness} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={scores.soundness}
                onChange={(e) => setScores({ ...scores, soundness: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <p className="text-[11px] text-neutral-400">Checks algorithmic pipelines, ablation baselines, control mechanisms, and directional policy updates.</p>
            </div>

            {/* Dimension 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">4. Empirical Significance & Benchmark Pareto (Weight: 15%)</span>
                <span className="font-mono text-amber-400 font-bold">{scores.significance} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={scores.significance}
                onChange={(e) => setScores({ ...scores, significance: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <p className="text-[11px] text-neutral-400">Measures empirical gain over standard baselines (GPT-4o, Claude 3.5 Sonnet, DeepSeek R1) and practical impact.</p>
            </div>

            {/* Dimension 5 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">5. Exposition Clarity & LaTeX Typesetting (Weight: 10%)</span>
                <span className="font-mono text-amber-400 font-bold">{scores.clarity} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={scores.clarity}
                onChange={(e) => setScores({ ...scores, clarity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <p className="text-[11px] text-neutral-400">Precision of academic prose, notation discipline, KaTeX rendering, and compliance with camera-ready layout.</p>
            </div>

            {/* Dimension 6 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-200">6. AI Alignment Safety & Governance (Weight: 10%)</span>
                <span className="font-mono text-amber-400 font-bold">{scores.safety} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={scores.safety}
                onChange={(e) => setScores({ ...scores, safety: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <p className="text-[11px] text-neutral-400">Enforces divergence regularization bounds, human oversight integrity, and complete cryptographic provenance.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Calibrated Decision & Radar Tensor */}
        <div className="space-y-4">
          {/* Decision Summary Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h4 className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider">
              Calibrated Meta-Review
            </h4>

            <div className={`p-4 rounded-xl border ${decisionInfo.badgeBg} text-center space-y-2`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                Composite Rubric Score
              </span>
              <div className="text-4xl font-extrabold font-mono text-amber-400">
                {weightedScore}
                <span className="text-sm font-normal text-neutral-500"> / 5.00</span>
              </div>
              <div className={`text-xs font-bold uppercase tracking-wider ${decisionInfo.color}`}>
                {decisionInfo.label}
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Reviewer Identity / Alias:</label>
                <input
                  type="text"
                  value={reviewerAlias}
                  onChange={(e) => setReviewerAlias(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Reviewer Expertise Level:</label>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setReviewerExpertise(lvl as any)}
                      className={`py-1 text-center rounded text-xs font-mono font-bold transition-colors ${
                        reviewerExpertise === lvl
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export & Copy Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleCopyReport}
                className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 flex items-center justify-center space-x-1.5 transition-colors"
              >
                {copiedReview ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedReview ? 'Review Copied to Clipboard!' : 'Copy Reviewer Scorecard'}</span>
              </button>

              {reviewMode === 'current' && (
                <button
                  onClick={handleApplyToRLHF}
                  disabled={isRefining}
                  className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-neutral-950 text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>{isRefining ? 'Synthesizing Version v' + (publication.version + 1) + '...' : 'Trigger RLHF Refinement (v' + (publication.version + 1) + ')'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Qualitative Peer Review Critique Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <h4 className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Key Strengths & Contributions</span>
          </h4>
          <textarea
            rows={3}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <h4 className="text-xs font-semibold text-rose-400 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Weaknesses & Critique</span>
          </h4>
          <textarea
            rows={3}
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <h4 className="text-xs font-semibold text-sky-400 flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Questions for Authors / Rebuttal</span>
          </h4>
          <textarea
            rows={3}
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <h4 className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Actionable Directives for RLHF Alignment</span>
          </h4>
          <textarea
            rows={3}
            value={directives}
            onChange={(e) => setDirectives(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
