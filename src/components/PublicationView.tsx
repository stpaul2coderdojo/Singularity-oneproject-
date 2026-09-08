import React, { useState } from 'react';
import { ArXivPublication } from '../types';
import { MathRenderer, FormattedAcademicText } from './MathRenderer';
import { generateAcademicPdf } from '../utils/pdfGenerator';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Scale, 
  ExternalLink, 
  Share2, 
  History, 
  Bot, 
  UserCheck, 
  Code, 
  Bookmark,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  Printer,
  Loader2
} from 'lucide-react';

interface PublicationViewProps {
  publication: ArXivPublication;
  onOpenRubric: () => void;
  onOpenRLHFHistory: () => void;
  onOpenProblemAndSolution: () => void;
}

export const PublicationView: React.FC<PublicationViewProps> = ({
  publication,
  onOpenRubric,
  onOpenRLHFHistory,
  onOpenProblemAndSolution
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'bibtex' | 'latex'>('paper');
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateAcademicPdf(publication);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(publication.bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(publication.latexSource);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Preprint Meta Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-4 gap-3 no-print">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                {publication.arxivId}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Version {publication.version}
              </span>
              {publication.rlhfHistory && publication.rlhfHistory.length > 0 && (
                <button
                  onClick={onOpenRLHFHistory}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors flex items-center space-x-1"
                >
                  <History className="w-3 h-3" />
                  <span>{publication.rlhfHistory.length} RLHF Cycles</span>
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Subject Class: {publication.primaryCategory} (
              {publication.secondaryCategories.join(', ')})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Format view toggles */}
          <div className="bg-neutral-950 p-1 rounded-lg border border-neutral-800 flex text-xs">
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'paper'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Preprint
            </button>
            <button
              onClick={() => setActiveTab('bibtex')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'bibtex'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              BibTeX
            </button>
            <button
              onClick={() => setActiveTab('latex')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'latex'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              LaTeX
            </button>
          </div>

          <button
            onClick={onOpenProblemAndSolution}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 transition-colors hidden md:block"
          >
            Problem & Solution
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-sm"
            title="Generate and download high-quality academic PDF"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Generating PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors hidden lg:flex items-center space-x-1"
            title="Direct print preview"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Primary Action: Launch Rubric Review */}
          <button
            onClick={onOpenRubric}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Open Review Rubric</span>
          </button>
        </div>
      </div>

      {/* Main Preprint Body */}
      {activeTab === 'paper' && (
        <article className="bg-neutral-900/95 border border-neutral-800/90 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8 max-w-5xl mx-auto">
          {/* Header Metadata Block (arXiv Style) */}
          <div className="border-b border-neutral-800 pb-8 text-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-800">
              <span>{publication.arxivId}</span>
              <span>•</span>
              <span>Submitted on {publication.submittedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-100 font-serif-academic tracking-tight leading-tight max-w-4xl mx-auto">
              {publication.title}
            </h1>

            {/* Author Listing */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {publication.authors.map((author, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-1.5 bg-neutral-950/80 px-3 py-1 rounded-lg border border-neutral-800/90 text-xs"
                >
                  {author.isAgent ? (
                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span className="font-medium text-neutral-200">{author.name}</span>
                  <span className="text-neutral-500 text-[10px]">
                    ({author.affiliation})
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-neutral-500 max-w-2xl mx-auto pt-1">
              Comments: {publication.comments} | License: {publication.license}
            </div>
          </div>

          {/* Abstract Block */}
          <div className="max-w-3xl mx-auto bg-neutral-950/70 p-6 sm:p-7 rounded-2xl border border-neutral-800 shadow-inner">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Preprint Abstract</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                arXiv Standards Synthesis
              </span>
            </div>
            <p className="font-serif-academic text-sm sm:text-base text-neutral-200 leading-relaxed text-justify indent-4">
              <FormattedAcademicText text={publication.abstract} />
            </p>
          </div>

          {/* Template Sequence Breadcrumb */}
          <div className="max-w-3xl mx-auto no-print">
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-between overflow-x-auto text-[11px] font-mono">
              <div className="flex items-center space-x-2 text-neutral-400 whitespace-nowrap">
                <span className="text-neutral-500">Template:</span>
                <span className="text-amber-400/90 font-medium">Title</span>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <span className="text-amber-400/90 font-medium">Abstract</span>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <a href="#sec-1" className="hover:text-amber-300 transition-colors">§1 Introduction</a>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <a href="#sec-2" className="hover:text-amber-300 transition-colors">§2 Problem Statement</a>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <a href="#sec-3" className="hover:text-amber-300 transition-colors">§3 Methods</a>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <a href="#sec-4" className="hover:text-amber-300 transition-colors">§4 Discussion</a>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
                <a href="#references" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Citations</a>
              </div>
            </div>
          </div>

          {/* Table of Contents Pill Bar */}
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 pt-1 pb-3 border-b border-neutral-800/60 no-print">
            {publication.sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors flex items-center space-x-1.5"
              >
                <span className="text-amber-500/90 font-bold">§{sec.number}</span>
                <span>{sec.title}</span>
              </a>
            ))}
            <a
              href="#references"
              className="text-[11px] font-mono px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors flex items-center space-x-1.5"
            >
              <Bookmark className="w-3 h-3 text-amber-500/90" />
              <span>Citations ({publication.references.length})</span>
            </a>
          </div>

          {/* Sectional Articles */}
          <div className="max-w-3xl mx-auto space-y-10">
            {publication.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20 space-y-4">
                <div className="flex items-baseline space-x-2 border-b border-neutral-800/70 pb-2.5">
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {section.number}.
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-academic text-neutral-100">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content formatted for academic readability with inline LaTeX math */}
                <div className="font-serif-academic text-sm sm:text-base text-neutral-300 leading-relaxed space-y-4">
                  {section.content.split('\n\n').map((para, pIdx) => {
                    // Check if bullet point or numbered list
                    if (para.startsWith('- ') || para.startsWith('1.') || para.startsWith('2.')) {
                      return (
                        <div key={pIdx} className="space-y-1.5 pl-2">
                          {para.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className="flex items-start space-x-2 text-neutral-200">
                              <span className="text-amber-400 font-mono text-xs mt-1">•</span>
                              <p className="flex-1">
                                <FormattedAcademicText text={line.replace(/^[-0-9.]+\s*/, '')} />
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p key={pIdx} className="text-justify indent-4 leading-relaxed">
                        <FormattedAcademicText text={para} />
                      </p>
                    );
                  })}
                </div>

                {/* Render All Equations with KaTeX and Copy capability */}
                {section.equations && section.equations.length > 0 && (
                  <div className="my-6 space-y-3">
                    {section.equations.map((eq, eIdx) => (
                      <MathRenderer
                        key={eIdx}
                        math={eq}
                        equationNumber={`${section.number}.${eIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Citations & References Section */}
            <section id="references" className="scroll-mt-20 pt-8 border-t border-neutral-800 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xl font-bold font-serif-academic text-neutral-100">
                    Citations & References
                  </h2>
                </div>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
                  {publication.references.length} Peer-Reviewed Works
                </span>
              </div>

              <div className="space-y-3.5 font-serif-academic text-xs sm:text-sm text-neutral-300">
                {publication.references.map((ref, idx) => (
                  <div
                    key={ref.key || idx}
                    className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-850 hover:border-neutral-700/80 transition-all group"
                  >
                    <span className="font-mono text-xs text-amber-400 font-bold min-w-[32px] pt-0.5">
                      [{idx + 1}]
                    </span>
                    <div className="flex-1 space-y-1">
                      <div>
                        <span className="text-neutral-100 font-medium">{ref.authors}</span>.{' '}
                        <span className="text-neutral-200">&ldquo;{ref.title}&rdquo;</span>.{' '}
                        <span className="italic text-neutral-400">{ref.venue}</span>{' '}
                        <span className="text-neutral-500 font-mono">({ref.year})</span>.
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-400 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                          {ref.key}
                        </span>
                        {ref.arxivId && (
                          <span className="text-amber-400/90 hover:text-amber-300 flex items-center space-x-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>{ref.arxivId}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Review Trigger Banner */}
          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between bg-neutral-950 p-6 rounded-2xl gap-4 no-print">
            <div>
              <h3 className="text-sm font-bold text-neutral-100">
                Open Review Ready for Human Peer Evaluator
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Evaluate this preprint using the 6-dimension arXiv standards rubric to guide the next RLHF policy optimization.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                title="Download print-ready PDF"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Generating PDF...</span>
                  </>
                ) : pdfSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">PDF Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download PDF Preprint</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenRubric}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Submit Rubric Review & Guide RLHF</span>
              </button>
            </div>
          </div>
        </article>
      )}

      {/* BibTeX Tab */}
      {activeTab === 'bibtex' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-200">
              BibTeX Scholarly Citation
            </h3>
            <button
              onClick={handleCopyBibtex}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center space-x-1.5 transition-colors"
            >
              {copiedBibtex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 font-mono text-xs text-amber-200/90 overflow-x-auto select-all leading-relaxed">
            {publication.bibtex}
          </pre>
        </div>
      )}

      {/* LaTeX Tab */}
      {activeTab === 'latex' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-200">
              LaTeX Preprint Source (arXiv standard template)
            </h3>
            <button
              onClick={handleCopyLatex}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center space-x-1.5 transition-colors"
            >
              {copiedLatex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy LaTeX</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 font-mono text-xs text-neutral-300 overflow-x-auto select-all leading-relaxed max-h-96">
            {publication.latexSource}
          </pre>
        </div>
      )}
    </div>
  );
};
