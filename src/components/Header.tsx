import React from 'react';
import { Sparkles, Scale, BookOpen, GitFork, Cpu, ShieldCheck, Download, Loader2, ExternalLink, Bot } from 'lucide-react';

interface HeaderProps {
  onOpenRubric: () => void;
  onOpenDomains: () => void;
  onLoadExemplar: () => void;
  onDownloadPdf?: () => void;
  isDownloadingPdf?: boolean;
  onOpenGitHubSync?: () => void;
  onOpenDocs?: () => void;
  onOpenCopilot?: () => void;
  gitHubConnected?: boolean;
  gitHubRepo?: string;
  activeVersion?: number;
  totalRLHFIterations?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRubric,
  onOpenDomains,
  onLoadExemplar,
  onDownloadPdf,
  isDownloadingPdf = false,
  onOpenGitHubSync,
  onOpenDocs,
  onOpenCopilot,
  gitHubConnected = false,
  gitHubRepo = '',
  activeVersion = 1,
  totalRLHFIterations = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Platform identity */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 text-amber-400 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-neutral-100">
                Singularity-1
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-300 bg-amber-500/10">
                Google Antigravity
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono hidden sm:block">
              RLHF arXiv Standards Publication & Review Rubric Platform
            </p>
          </div>
        </div>

        {/* Action and status controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Status Badges */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-neutral-400 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Agentic Engine:</span>
            <span className="text-emerald-400 font-medium">Ready</span>
            <span className="text-neutral-600">|</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>arXiv Rubric v2.4</span>
          </div>

          {/* Exemplar Load Button */}
          <button
            onClick={onLoadExemplar}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center space-x-1.5"
            title="Load foundational benchmark paper"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Exemplar</span>
          </button>

          {/* Quick PDF Export */}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 transition-colors flex items-center space-x-1.5"
              title="Download arXiv-grade PDF preprint"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Download className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="hidden md:inline">PDF</span>
            </button>
          )}

          {/* Domain Selector Trigger */}
          <button
            onClick={onOpenDomains}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Synthesize New</span>
          </button>

          {/* Open Human Rubric Button */}
          <button
            onClick={onOpenRubric}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-neutral-950 shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-neutral-950" />
            <span>Human Rubric (RLHF)</span>
            {totalRLHFIterations > 0 && (
              <span className="bg-neutral-950 text-amber-400 text-[10px] font-mono px-1 rounded">
                v{activeVersion}
              </span>
            )}
          </button>

          {/* GitHub Provenance & Audit Sync */}
          {onOpenGitHubSync && (
            <button
              onClick={onOpenGitHubSync}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 transition-colors flex items-center space-x-1.5"
              title="GitHub Provenance & Audit Log"
            >
              <div className="relative">
                <GitFork className="w-3.5 h-3.5 text-amber-400" />
                <div
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    gitHubConnected ? 'bg-emerald-400' : 'bg-amber-500'
                  }`}
                />
              </div>
              <span className="hidden sm:inline">GitHub</span>
              {gitHubRepo && (
                <span className="hidden xl:inline text-[10px] font-mono text-neutral-500">
                  ({gitHubRepo.split('/').pop()})
                </span>
              )}
            </button>
          )}

          {/* Context-Aware Gemini Copilot Trigger */}
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Open Context-Aware Gemini Research Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden xs:inline sm:inline">AI Copilot</span>
            </button>
          )}

          {/* Documentation & Authorship Portal Trigger */}
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 transition-colors flex items-center space-x-1.5"
              title="Documentation, Architecture & Authorship (Bheemaiah, IIT Madras Alumni)"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Docs & Authors</span>
            </button>
          )}

          {/* GitHub Source link */}
          <a
            href="https://github.com/stpaul2coderdojo/Singularity-1"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 hover:text-neutral-200 p-2 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            title="View stpaul2coderdojo/Singularity-1 repository"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
