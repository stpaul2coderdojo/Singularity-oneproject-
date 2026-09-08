import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check, Code, Eye } from 'lucide-react';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
  equationNumber?: number | string;
  showRawToggle?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  block = true,
  className = '',
  equationNumber,
  showRawToggle = true
}) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  // Clean raw LaTeX delimiters if user passed $$ or \[ \]
  const cleanedMath = useMemo(() => {
    let clean = math.trim();
    if (clean.startsWith('$$') && clean.endsWith('$$')) {
      clean = clean.slice(2, -2).trim();
    } else if (clean.startsWith('\\[') && clean.endsWith('\\]')) {
      clean = clean.slice(2, -2).trim();
    } else if (clean.startsWith('$') && clean.endsWith('$')) {
      clean = clean.slice(1, -1).trim();
    }
    return clean;
  }, [math]);

  const html = useMemo(() => {
    try {
      return katex.renderToString(cleanedMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml'
      });
    } catch (e) {
      console.warn('KaTeX rendering warning:', e);
      return null;
    }
  }, [cleanedMath, block]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanedMath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!block) {
    if (html) {
      return (
        <span
          className={`inline-math font-mono text-amber-200/90 ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return <code className="font-mono text-xs text-amber-300">{cleanedMath}</code>;
  }

  return (
    <div className={`relative group my-4 rounded-xl bg-neutral-950 border border-neutral-800/90 p-4 sm:p-5 shadow-inner transition-all hover:border-neutral-700/80 ${className}`}>
      {/* Top action pill toolbar */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2 border-b border-neutral-900 pb-2">
        <span className="flex items-center space-x-1.5 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Typeset Equation</span>
          {equationNumber && (
            <span className="text-amber-400 font-bold">({equationNumber})</span>
          )}
        </span>

        <div className="flex items-center space-x-2">
          {showRawToggle && (
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {showRaw ? (
                <>
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>View Rendered</span>
                </>
              ) : (
                <>
                  <Code className="w-3 h-3" />
                  <span>LaTeX Source</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy LaTeX</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rendered Math display */}
      {!showRaw && html ? (
        <div
          className="overflow-x-auto py-2 text-center text-neutral-100 font-serif-academic text-base sm:text-lg leading-relaxed select-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto py-2 font-mono text-xs text-amber-300/90 whitespace-pre-wrap select-all">
          {cleanedMath}
        </pre>
      )}
    </div>
  );
};

// Helper component that scans text for $...$ and renders inline math
export const FormattedAcademicText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const parts = useMemo(() => {
    // Regex matches $...$ inline math
    const regex = /(\$[^$]+\$)/g;
    return text.split(regex);
  }, [text]);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const rawFormula = part.slice(1, -1);
          return <MathRenderer key={index} math={rawFormula} block={false} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
