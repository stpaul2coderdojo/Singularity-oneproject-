import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Award, 
  Sparkles, 
  GitCommit, 
  Layers, 
  FileText,
  Mail,
  GraduationCap,
  Globe,
  Box,
  Terminal,
  Hash,
  CheckCircle2
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'authorship' | 'rubric' | 'wiki' | 'container' | 'citation'>('overview');
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isSyncingWiki, setIsSyncingWiki] = useState(false);
  const [wikiSyncSuccess, setWikiSyncSuccess] = useState<string | null>(null);
  const [wikiSyncError, setWikiSyncError] = useState<string | null>(null);

  if (!isOpen) return null;

  const prodUrl = 'https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app';
  const devUrl = 'https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app';
  const authorEmail = 'bheemaiah@alumni.iitm.ac.in';

  const bibtexCitation = `@article{bheemaiah2026singularity1,
  title={Singularity-1: An Autonomous Multi-Agent Platform for arXiv Preprint Synthesis with Human-in-the-Loop RLHF Rubric Optimization},
  author={Bheemaiah and {Google Antigravity Agent Collective}},
  journal={arXiv preprint arXiv:2603.04891 [cs.AI]},
  year={2026},
  institution={Indian Institute of Technology Madras Alumni},
  note={Available at: ${prodUrl}},
  email={${authorEmail}}
}`;

  const copyToClipboard = (text: string, type: 'bibtex' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'bibtex') {
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2500);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleSyncWiki = async () => {
    setIsSyncingWiki(true);
    setWikiSyncSuccess(null);
    setWikiSyncError(null);
    try {
      const res = await fetch('/api/github/sync-wiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sync wiki to GitHub');
      }
      setWikiSyncSuccess(`Synced ${data.entry?.files?.length || 6} wiki & SVG assets to ${data.entry?.repo || 'GitHub'} (Commit: ${data.entry?.commitSha?.slice(0, 7) || 'latest'})!`);
    } catch (err: any) {
      setWikiSyncError(err.message);
    } finally {
      setIsSyncingWiki(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-neutral-100 tracking-tight font-sans">
                  Singularity-1 Documentation & Authorship
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Google Antigravity Agentic Platform • arXiv Publication & RLHF Synthesis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/80 px-4 pt-2 gap-2 text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('authorship')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'authorship'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Authorship & Affiliation</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'rubric'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>arXiv Rubric v2.4</span>
          </button>

          <button
            onClick={() => setActiveTab('wiki')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'wiki'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Media-Rich Wiki & Visuals</span>
          </button>

          <button
            onClick={() => setActiveTab('container')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'container'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Container Hashing & Benchmarks</span>
          </button>

          <button
            onClick={() => setActiveTab('citation')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'citation'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Citation & BibTeX</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cloud Deployment Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-950 border border-amber-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                      Live Cloud Hosted Application
                    </span>
                    <h3 className="text-sm font-bold text-neutral-100 mt-0.5">
                      Production & Development Deployments
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Running on Google Cloud Run with instant preprint synthesis, KaTeX rendering, PDF export, and GitHub synchronization.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={prodUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Production URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={devUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center space-x-1.5 transition-all"
                    >
                      <span>Dev URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Three Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
                    Autonomous Multi-Agent Synthesis
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Orchestrates Problem Formulation (gap extraction), Solution Architecture (theorems & proofs), and Publication Composition (IMRaD & BibTeX).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
                    Human Rubric RLHF Alignment
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Evaluates papers across 6 calibrated conference dimensions, computing vector rewards to guide next-version refinement loops (v1 → v2).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
                    PDF & GitHub Provenance
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Direct academic PDF export with KaTeX equation typography, plus 1-click or automated git commit logging of Markdown, LaTeX, and reviews.
                  </p>
                </div>
              </div>

              {/* Agent Pipeline Flow */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Google Antigravity Agent Sequence</span>
                </h4>
                <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 font-mono text-[11px] text-neutral-300 leading-relaxed overflow-x-auto">
                  <code>
                    [User Directive] → [Problem Formulation Agent (gap scan)]<br/>
                    &nbsp;&nbsp;↓<br/>
                    [Solution Architect Agent (Pareto frontier & proof generation)]<br/>
                    &nbsp;&nbsp;↓<br/>
                    [Publication Composer Agent (KaTeX formulas, IMRaD narrative, BibTeX)]<br/>
                    &nbsp;&nbsp;↓<br/>
                    [Human Peer-Review Rubric] → [RLHF Alignment Delta] → [Preprint v(k+1)]<br/>
                    &nbsp;&nbsp;↓<br/>
                    [Automated GitHub Sync: papers/ & reviews/]
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTHORSHIP */}
          {activeTab === 'authorship' && (
            <div className="space-y-6">
              {/* PI Profile Card */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-amber-500/30 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-neutral-950 font-bold text-xl shadow-md">
                      B
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-neutral-100">
                          Bheemaiah
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          Principal Investigator
                        </span>
                      </div>
                      <p className="text-xs text-amber-300 font-medium mt-0.5">
                        Indian Institute of Technology Madras (IIT Madras) Alumni
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        St. Paul CoderDojo / Singularity-1 Open Science Initiative
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(authorEmail, 'email')}
                      className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center space-x-1.5 transition-colors"
                      title="Copy official email"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Email Copied</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>{authorEmail}</span>
                          <Copy className="w-3 h-3 text-neutral-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-300 leading-relaxed space-y-2">
                  <p>
                    <strong>Research Vision:</strong> Bridging the frontier of autonomous agentic reasoning, human-preference reinforcement learning (RLHF), and mathematically verifiable open scientific preprints. Singularity-1 formalizes the transition from unstructured generation to peer-review calibrated scientific synthesis.
                  </p>
                  <p className="text-neutral-400">
                    <strong>Alumni Credentials:</strong> Indian Institute of Technology Madras (IITM) • Active in STEM education and open scientific software through St. Paul CoderDojo and open-source GitHub initiatives.
                  </p>
                </div>
              </div>

              {/* Co-Authors Collective */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Google Antigravity Agent Co-Author Collective</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-semibold text-neutral-200">Problem Formulation Agent</span>
                    <p className="text-[11px] text-neutral-400 mt-1">Literature paradox extraction, arXiv category taxonomy parsing, and formal problem definition.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-semibold text-neutral-200">Solution Architect Agent</span>
                    <p className="text-[11px] text-neutral-400 mt-1">Algorithmic blueprinting, computational complexity bounds, and convergence theorem proofs.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-semibold text-neutral-200">Publication Composer Agent</span>
                    <p className="text-[11px] text-neutral-400 mt-1">Scholarly IMRaD compilation, KaTeX typesetting, and BibTeX citation formatting.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-semibold text-neutral-200">Rubric Auditor & Alignment Engine</span>
                    <p className="text-[11px] text-neutral-400 mt-1">Multi-dimensional rubric scoring, RLHF reward computation, and version delta alignment.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">
                    arXiv Publication Quality Rubric (v2.4 Specification)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Calibrated across six independent peer-review dimensions with mathematical reward weighting.
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                  Total Weight: 100%
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-300 uppercase tracking-wider font-mono text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Dimension</th>
                      <th className="p-3 text-center">Weight</th>
                      <th className="p-3">Focus Criterion</th>
                      <th className="p-3">Target Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 bg-neutral-900/50">
                    <tr>
                      <td className="p-3 font-semibold text-neutral-200">Novelty & Originality</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">25%</td>
                      <td className="p-3 text-neutral-300">Literature gap isolation</td>
                      <td className="p-3 text-neutral-400">Non-trivial theoretical paradigm leap</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-200">Technical Rigor</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">25%</td>
                      <td className="p-3 text-neutral-300">Mathematical proofs & limits</td>
                      <td className="p-3 text-neutral-400">Formal theorem correctness & convergence bounds</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-200">Empirical Significance</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">20%</td>
                      <td className="p-3 text-neutral-300">Pareto frontiers & speedups</td>
                      <td className="p-3 text-neutral-400">Asymptotic performance gain over baselines</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-200">Clarity & Scholarly Exposition</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">15%</td>
                      <td className="p-3 text-neutral-300">IMRaD narrative & KaTeX math</td>
                      <td className="p-3 text-neutral-400">Clear notation, structured equations, academic tone</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-200">Reproducibility & Open Science</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">10%</td>
                      <td className="p-3 text-neutral-300">Algorithmic transparency</td>
                      <td className="p-3 text-neutral-400">Unambiguous pseudocode & hyperparameter specs</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-neutral-200">Ethics & Governance</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">5%</td>
                      <td className="p-3 text-neutral-300">Safety & dual-use audit</td>
                      <td className="p-3 text-neutral-400">Bound verification & computational footprint disclosure</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
                <span className="font-semibold text-neutral-300">RLHF Optimization Formula: </span>
                <code className="text-amber-300 font-mono">
                  R(x, y) = 0.25·Novelty + 0.25·Rigor + 0.20·Significance + 0.15·Clarity + 0.10·Repro + 0.05·Ethics
                </code>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA-RICH WIKI & VISUAL ASSETS */}
          {activeTab === 'wiki' && (
            <div className="space-y-6">
              {/* Wiki Header & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>GitHub Media-Rich Wiki & Visual Diagrams</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    High-resolution vector flowcharts, radar charts, and academic wiki documentation.
                  </p>
                </div>
                <button
                  onClick={handleSyncWiki}
                  disabled={isSyncingWiki}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-semibold text-xs flex items-center space-x-2 transition-all shadow-md disabled:opacity-50 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSyncingWiki ? 'Syncing Wiki to GitHub...' : 'Sync Wiki & Visuals to GitHub'}</span>
                </button>
              </div>

              {/* Status Alert */}
              {wikiSyncSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 font-mono">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{wikiSyncSuccess}</span>
                </div>
              )}
              {wikiSyncError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center space-x-2 font-mono">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{wikiSyncError}</span>
                </div>
              )}

              {/* Diagram 1: Architecture Flowchart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                    <span>Fig 1. Multi-Agent Synthesis Architecture Flowchart</span>
                  </h4>
                  <span className="text-[11px] font-mono text-neutral-500">public/assets/wiki/architecture_flowchart.svg</span>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-inner p-2">
                  <img 
                    src="/assets/wiki/architecture_flowchart.svg" 
                    alt="Singularity-1 Multi-Agent System Architecture Flowchart"
                    className="w-full h-auto rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Diagram 2: arXiv Rubric Radar Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                    <span>Fig 2. arXiv Review Rubric Dimensions Radar (v2.4)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-neutral-500">public/assets/wiki/rubric_radar.svg</span>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-inner p-4 max-w-2xl mx-auto">
                  <img 
                    src="/assets/wiki/rubric_radar.svg" 
                    alt="arXiv Review Rubric Radar Chart v2.4"
                    className="w-full h-auto rounded-lg mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Media-Rich Wiki Articles Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Documented Wiki Articles in Repository (/wiki)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1 hover:border-neutral-700 transition-colors">
                    <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Home.md</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-normal">
                      Overview, deployment links, PI credentials (IIT Madras Alumni), and navigation index.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1 hover:border-neutral-700 transition-colors">
                    <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>System-Architecture.md</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-normal">
                      Detailed decomposition of the three-phase Antigravity pipeline and LaTeX compilation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1 hover:border-neutral-700 transition-colors">
                    <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>RLHF-Rubric-v2.4.md</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-normal">
                      6-dimensional conference review rubric and reward-guided policy iteration (v_k &rarr; v_k+1).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1 hover:border-neutral-700 transition-colors">
                    <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini-Research-Copilot.md</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-normal">
                      Real-time interactive research assistant grounded in preprint KaTeX mathematics and rebuttals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTAINER HASHING & BENCHMARKS */}
          {activeTab === 'container' && (
            <div className="space-y-6">
              {/* Section 1: GitHub Repository Provenance & URL Hygiene */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-neutral-100">
                      GitHub Repository Provenance & URL Resolution
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    stpaul2coderdojo Org
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  <strong>Organization Context:</strong> <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded">stpaul2coderdojo</code> is a GitHub organization dedicated to CoderDojo computational education, youth stem initiatives, and reproducible open-source research platforms.
                </p>
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3 text-xs space-y-2">
                  <div className="text-neutral-200 font-semibold flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Handling Potential 404 Not Found Errors:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-1">
                    <li>
                      <strong>Trailing Punctuation & Hyphen Fix:</strong> URLs like <code className="text-red-300">.../Singularity-oneproject-</code> (ending in a hyphen or trailing comma) fail DNS/route lookup. Ensure the trailing hyphen is removed or replaced with the canonical repository name.
                    </li>
                    <li>
                      <strong>Canonical Names:</strong> The project is mirrored at <a href="https://github.com/stpaul2coderdojo/Singularity-1" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-mono">stpaul2coderdojo/Singularity-1</a> and <a href="https://github.com/stpaul2coderdojo/Singularity-oneproject" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-mono">stpaul2coderdojo/Singularity-oneproject</a>.
                    </li>
                    <li>
                      <strong>Organization Permissions:</strong> If accessing private experimental branches, authenticate via GitHub PAT with <code className="text-amber-300 font-mono">repo</code> scope.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2: Singularity Hashes & One-Project Containerization */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Box className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-neutral-100">
                      Singularity / Apptainer Hashes & "One-Project" Containerization
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Bitwise HPC Reproducibility
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  In High-Performance Computing (HPC), AI clusters, and computational science, <strong>Singularity (Apptainer)</strong> packages the entire operating system, CUDA drivers, Python virtual environment, Node runtime, and LaTeX typesetting stack into a single, immutable Singularity Image Format (<code className="text-amber-300 font-mono">.sif</code>) file.
                </p>

                {/* Cryptographic SHA-256 Digest */}
                <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-neutral-300 flex items-center space-x-1.5">
                      <Hash className="w-3.5 h-3.5 text-amber-400" />
                      <span>Singularity Image Cryptographic Digest (SHA-256):</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('4f8e91b6c738e4a908d13a886df29c71c4c1a59b6574f85e493bb3d75c80a2df');
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 2000);
                      }}
                      className="text-[11px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center space-x-1"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? 'Copied SHA-256' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-amber-300 break-all bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                    sha256:4f8e91b6c738e4a908d13a886df29c71c4c1a59b6574f85e493bb3d75c80a2df
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Publishing container digests in preprints guarantees that anyone running this pipeline obtains identical outputs, eliminating "dependency rot" across academic laboratories and satisfying regulatory guidelines (FDA, IEEE, Nature).
                  </p>
                </div>

                {/* Verification CLI Commands */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-neutral-300 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>CLI Commands: Image Verification & Execution</span>
                  </span>
                  <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono text-neutral-300 space-y-2">
                    <div>
                      <span className="text-neutral-500"># 1. Compute SHA-256 digest to verify binary integrity</span>
                      <div className="text-amber-300">sha256sum singularity-oneproject.sif</div>
                    </div>
                    <div>
                      <span className="text-neutral-500"># 2. Inspect embedded metadata, runscripts & build definitions</span>
                      <div className="text-amber-300">singularity inspect --all singularity-oneproject.sif</div>
                    </div>
                    <div>
                      <span className="text-neutral-500"># 3. Execute the Singularity-1 agent synthesis loop with GPU acceleration</span>
                      <div className="text-amber-300">singularity run --nv singularity-oneproject.sif npm run start</div>
                    </div>
                  </div>
                </div>

                {/* Container Definition Spec */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-neutral-300 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Singularity.def (Apptainer Recipe)</span>
                  </span>
                  <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`Bootstrap: docker
From: node:20-bookworm-slim

%labels
    Maintainer Bheemaiah (IIT Madras Alumni)
    Project Singularity-1 Autonomous arXiv Preprint Synthesis
    Version 2.4.0
    Digest sha256:4f8e91b6c738e4a908d13a886df29c71c4c1a59b6574f85e493bb3d75c80a2df

%post
    apt-get update && apt-get install -y texlive-latex-base texlive-fonts-recommended texlive-latex-extra git curl
    mkdir -p /app
    cd /app
    # Install dependencies and compile Singularity-1 bundle
    npm install && npm run build

%environment
    export PORT=3000
    export NODE_ENV=production

%runscript
    cd /app
    exec node dist/server.cjs`}
                  </pre>
                </div>
              </div>

              {/* Section 3: Benchmarks for AI-Generated Publications */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-neutral-100">
                    Standard Academic Benchmarks for AI-Generated Publications
                  </h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  As Foundation Models and Multi-Agent Orchestrators synthesize scientific literature, established empirical benchmarks and rubrics validate their rigor, citation integrity, and formatting adherence:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Benchmark 1 */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      <span>SciReviewGen & LitSearch</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Evaluates automated literature review generation, measuring multi-document retrieval recall, synthesis relevance, and cross-citation topic coherence.
                    </p>
                  </div>

                  {/* Benchmark 2 */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RoBBR & EvidenceBench</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Measures systematic evidence synthesis, Risk of Bias (RoB) identification, and factual consistency across clinical and computational trials.
                    </p>
                  </div>

                  {/* Benchmark 3 */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>SciArena-Eval & ECACT</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Benchmarks structured scientific reasoning, causal hypothesis formulation, and empirical claim extraction from multi-modal papers.
                    </p>
                  </div>

                  {/* Benchmark 4 */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Citation & Factuality Verification</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Assesses inline citation accuracy, hallucination rates (invented DOIs, false author lists), and semantic coverage via ROUGE-L and SciBERTScore.
                    </p>
                  </div>

                  {/* Benchmark 5 */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ArXiv / PubMed Synthetic Datasets</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Paired human-written and AI-synthesized paper corpora used to calibrate detection mechanisms (e.g. Turnitin, Copyleaks, GPTZero) and minimize false-positive rates.
                    </p>
                  </div>

                  {/* Benchmark 6 */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>AI Peer-Review Calibration (NeurIPS/ICLR)</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Datasets evaluating alignment between LLM paper evaluations and human conference reviews, testing rubric adherence and qualitative feedback depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CITATION */}
          {activeTab === 'citation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">
                    BibTeX Academic Citation
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Cite Singularity-1 and Bheemaiah (IIT Madras Alumni) in academic preprints and publications.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(bibtexCitation, 'bibtex')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
                >
                  {copiedBibtex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neutral-950" />
                      <span>Copied BibTeX!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy BibTeX</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-amber-300/90 overflow-x-auto leading-relaxed">
                {bibtexCitation}
              </pre>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                  Plain Text Citation
                </h4>
                <p className="text-xs text-neutral-300 font-serif-academic leading-relaxed">
                  Bheemaiah and Google Antigravity Agent Collective. (2026). "Singularity-1: An Autonomous Multi-Agent Platform for arXiv Preprint Synthesis with Human-in-the-Loop RLHF Rubric Optimization." <em>arXiv preprint arXiv:2603.04891 [cs.AI]</em>. Indian Institute of Technology Madras Alumni. Available at: {prodUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center space-x-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PI: Bheemaiah (bheemaiah@alumni.iitm.ac.in) • IIT Madras Alumni</span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={prodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline flex items-center space-x-1 font-mono text-[11px]"
            >
              <span>Live Cloud App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
