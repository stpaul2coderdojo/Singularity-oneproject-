import React, { useState, useMemo } from 'react';
import { ResearchDomain } from '../types';
import { RESEARCH_DOMAINS } from '../data/domains';
import { 
  Scale, 
  Sparkles, 
  Binary, 
  Atom, 
  Dna, 
  Bot, 
  Zap,
  Infinity as InfinityIcon,
  Moon,
  Hexagon,
  Crown,
  ArrowRight, 
  Check, 
  PlusCircle, 
  Sliders, 
  Layers,
  Wand2,
  FileText,
  Search
} from 'lucide-react';

interface DomainSelectorProps {
  onSelectAndSynthesize: (params: {
    domainName: string;
    arxivCategory: string;
    focusTopic: string;
    customPrompt: string;
    mode: 'end-to-end' | 'step-by-step';
  }) => void;
  isGenerating: boolean;
  onClose?: () => void;
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  onSelectAndSynthesize,
  isGenerating,
  onClose
}) => {
  const [selectedDomain, setSelectedDomain] = useState<ResearchDomain>(RESEARCH_DOMAINS[0]);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomainName, setCustomDomainName] = useState('');
  const [customArxivCategory, setCustomArxivCategory] = useState('cs.AI');
  const [selectedTopic, setSelectedTopic] = useState(RESEARCH_DOMAINS[0].suggestedFocusTopics[0]);
  const [customDirectives, setCustomDirectives] = useState('');
  const [synthesisMode, setSynthesisMode] = useState<'end-to-end' | 'step-by-step'>('end-to-end');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'physics' | 'ai' | 'interdisciplinary'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Binary':
        return <Binary className="w-5 h-5" />;
      case 'Atom':
        return <Atom className="w-5 h-5" />;
      case 'Dna':
        return <Dna className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Infinity':
        return <InfinityIcon className="w-5 h-5 text-sky-400" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Hexagon':
        return <Hexagon className="w-5 h-5 text-emerald-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'Layers':
      default:
        return <Layers className="w-5 h-5 text-purple-400" />;
    }
  };

  const filteredDomains = useMemo(() => {
    return RESEARCH_DOMAINS.filter((domain) => {
      const matchesSearch =
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.arxivCode.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter === 'physics') {
        return (
          domain.arxivCode.startsWith('hep-th') ||
          domain.arxivCode.startsWith('quant-ph') ||
          domain.arxivCode.startsWith('astro-ph') ||
          domain.id.includes('tachyon') ||
          domain.id.includes('dark-matter') ||
          domain.id.includes('e8') ||
          domain.id.includes('m-theory')
        );
      }
      if (categoryFilter === 'ai') {
        return (
          domain.arxivCode.startsWith('cs.') &&
          domain.id !== 'transhumanist-theology'
        );
      }
      if (categoryFilter === 'interdisciplinary') {
        return (
          domain.id === 'transhumanist-theology' ||
          domain.id === 'comp-bio' ||
          domain.category.toLowerCase().includes('interdisciplinary') ||
          domain.category.toLowerCase().includes('biology')
        );
      }

      return true;
    });
  }, [categoryFilter, searchQuery]);

  const handleDomainCardClick = (domain: ResearchDomain) => {
    setSelectedDomain(domain);
    setIsCustomDomain(false);
    setSelectedTopic(domain.suggestedFocusTopics[0] || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domainName = isCustomDomain ? (customDomainName.trim() || 'Custom Multi-Disciplinary Domain') : selectedDomain.name;
    const arxivCategory = isCustomDomain ? (customArxivCategory.trim() || 'cs.AI') : selectedDomain.arxivCode;

    onSelectAndSynthesize({
      domainName,
      arxivCategory,
      focusTopic: selectedTopic,
      customPrompt: customDirectives,
      mode: synthesisMode
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-neutral-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Singularity-1 Agentic Workspace
            </span>
            <span className="text-xs text-neutral-400 font-mono">Stage 1 of 3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1 font-cinzel">
            Select Research Domain & Frontier Directives
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Choose a scientific frontier for autonomous Antigravity agent formulation of problem statement, solution derivation, and arXiv preprint composition.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="self-start md:self-auto text-xs px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          >
            Close
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Domain Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Frontier Research Domains</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCustomDomain(!isCustomDomain)}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors flex items-center space-x-1 ${
                isCustomDomain
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isCustomDomain ? 'Custom Domain Active' : 'Specify Custom Domain'}</span>
            </button>
          </div>

          {!isCustomDomain ? (
            <div className="space-y-3">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                      categoryFilter === 'all'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    All Domains ({RESEARCH_DOMAINS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('physics')}
                    className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                      categoryFilter === 'physics'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Physics & Cosmology
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('ai')}
                    className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                      categoryFilter === 'ai'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    AI & Alignment
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('interdisciplinary')}
                    className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                      categoryFilter === 'interdisciplinary'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Interdisciplinary
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search domains or arXiv..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Grid of Domain Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDomains.map((domain) => {
                  const isSelected = selectedDomain.id === domain.id;
                  return (
                    <div
                      key={domain.id}
                      onClick={() => handleDomainCardClick(domain)}
                      className={`relative cursor-pointer rounded-xl p-4 transition-all border text-left flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/20'
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`p-2 rounded-lg border ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                            }`}
                          >
                            {getDomainIcon(domain.iconName)}
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                              {domain.arxivCode}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-neutral-100 leading-tight">
                          {domain.name}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {domain.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80">
                          {domain.badge}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {domain.frontierThemes.length} Open Conjectures
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredDomains.length === 0 && (
                <div className="p-8 text-center text-neutral-500 font-mono text-xs border border-neutral-800 rounded-xl bg-neutral-950">
                  No research domains match &ldquo;{searchQuery}&rdquo;. Try another term or specify a Custom Domain above.
                </div>
              )}
            </div>
          ) : (
            /* Custom Domain Input */
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-amber-500/30 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Custom Domain Title
                  </label>
                  <input
                    type="text"
                    value={customDomainName}
                    onChange={(e) => setCustomDomainName(e.target.value)}
                    placeholder="e.g. Non-Equilibrium Statistical Mechanics & Active Matter"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Target arXiv Category
                  </label>
                  <input
                    type="text"
                    value={customArxivCategory}
                    onChange={(e) => setCustomArxivCategory(e.target.value)}
                    placeholder="e.g. cond-mat.stat-mech or math.PR"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Focus Topic Selection */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Frontier Focus Topics</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {(!isCustomDomain ? selectedDomain.suggestedFocusTopics : [
              'Pareto-Optimal Multi-Objective Synthesis',
              'Provable Non-Divergence Under Distribution Shift',
              'Self-Correcting Verification Loops via Formal Methods',
              'Scalable Oversight for Autonomous Sub-Agents'
            ]).map((topic, idx) => {
              const isTopicSelected = selectedTopic === topic;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedTopic(topic)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left ${
                    isTopicSelected
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-medium'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Directives / Constraints */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between mb-1.5">
            <span>Custom Problem Formulation Directives (Optional)</span>
            <span className="text-[11px] text-neutral-500 lowercase font-normal">
              e.g. emphasize mathematical proof, empirical ablation, or RLHF alignment
            </span>
          </label>
          <textarea
            rows={2}
            value={customDirectives}
            onChange={(e) => setCustomDirectives(e.target.value)}
            placeholder="e.g. Focus on eliminating Goodhart's Law reward hacking when rubrics are used as rewards, with explicit asymptotic convergence theorems and strict Pareto safety bounds."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
          />
        </div>

        {/* Synthesis Mode Selection & Launch */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSynthesisMode('end-to-end')}
              className={`flex-1 sm:flex-initial text-xs px-3 py-2 rounded-lg border flex items-center space-x-2 transition-all ${
                synthesisMode === 'end-to-end'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-medium'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-300'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Full End-to-End Pipeline</span>
            </button>
            <button
              type="button"
              onClick={() => setSynthesisMode('step-by-step')}
              className={`flex-1 sm:flex-initial text-xs px-3 py-2 rounded-lg border flex items-center space-x-2 transition-all ${
                synthesisMode === 'step-by-step'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-medium'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Step-by-Step Staged</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg ${
              isGenerating
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-neutral-950 shadow-amber-950/40 hover:shadow-amber-500/20 cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Google Antigravity Agents Synthesizing...</span>
              </>
            ) : (
              <>
                <span>Launch Agentic Synthesis</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
