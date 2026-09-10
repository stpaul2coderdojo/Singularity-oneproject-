import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  GraduationCap, 
  Scale, 
  Sigma, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  FileText,
  HelpCircle,
  Award
} from 'lucide-react';
import { ArXivPublication, HumanReviewRubric } from '../types';
import { MathRenderer } from './MathRenderer';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  persona?: 'co-author' | 'reviewer' | 'mathematician';
}

interface ResearchCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication: ArXivPublication | null;
  rubricReview?: HumanReviewRubric | null;
}

export const ResearchCopilotModal: React.FC<ResearchCopilotModalProps> = ({
  isOpen,
  onClose,
  publication,
  rubricReview
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Greetings! I am the **Singularity-1 AI Research Copilot**, powered by Google DeepMind's **Gemini 3.8 Flash**.

I am synchronized with the active preprint by Principal Investigator **Bheemaiah** (IIT Madras Alumni, \`bheemaiah@alumni.iitm.ac.in\`) and the Google Antigravity Agent Collective.

How would you like to explore this research? You can ask me to:
- 📐 **Deconstruct the mathematical formulation** and convergence bounds
- 🧐 **Conduct a simulated peer-review critique** (NeurIPS/ICML standards)
- ⚖️ **Analyze human rubric scores** and formulate version revision directives
- 📝 **Draft an author rebuttal** for reviewer questions`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: 'co-author'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<'co-author' | 'reviewer' | 'mathematician'>('co-author');
  const [showContextDetails, setShowContextDetails] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyForApi = messages
        .filter(m => m.id !== 'welcome-1')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
          publication,
          rubricReview,
          persona
        })
      });

      const data = await res.json();
      const reply = data.reply || 'Analysis completed with no response payload.';

      const modelMsg: ChatMessage = {
        id: 'model-' + Date.now(),
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'model-err-' + Date.now(),
        role: 'model',
        content: `### ⚠️ Copilot Note\nEncountered an issue communicating with the backend proxy. However, the system is grounded in the preprint **"${publication?.title || 'Singularity-1'}"**. Please try again or inspect your connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: `Dialogue reset. Ready to analyze preprint **"${publication?.title || 'Singularity-1'}"** under **${persona.toUpperCase()}** persona.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona
      }
    ]);
  };

  // Helper to render markdown and math cleanly
  const renderMessageContent = (content: string) => {
    // Check for LaTeX block patterns ($$...$$)
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = blockMathRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'math', value: match[1].trim() });
      lastIndex = blockMathRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.slice(lastIndex) });
    }

    return (
      <div className="space-y-2 text-sm leading-relaxed text-neutral-200">
        {parts.map((part, idx) => {
          if (part.type === 'math') {
            return (
              <div key={idx} className="my-2 p-2.5 bg-black/60 rounded-lg border border-neutral-800 overflow-x-auto">
                <MathRenderer math={part.value} block={true} showRawToggle={false} />
              </div>
            );
          }
          // Simple formatting for lines, bolding, and bullet points
          const paragraphs = part.value.split('\n\n');
          return (
            <div key={idx} className="space-y-2">
              {paragraphs.map((para, pIdx) => {
                if (para.startsWith('### ')) {
                  return <h4 key={pIdx} className="text-amber-400 font-semibold text-base mt-2 mb-1">{para.replace('### ', '')}</h4>;
                }
                if (para.startsWith('#### ')) {
                  return <h5 key={pIdx} className="text-amber-300/90 font-medium text-sm mt-1.5 mb-0.5">{para.replace('#### ', '')}</h5>;
                }
                if (para.startsWith('- ') || para.startsWith('• ') || para.startsWith('1. ')) {
                  const lines = para.split('\n');
                  return (
                    <ul key={pIdx} className="list-disc list-inside space-y-1 pl-1 text-neutral-300">
                      {lines.map((l, lIdx) => (
                        <li key={lIdx} dangerouslySetInnerHTML={{ __html: formatInline(l.replace(/^[-•*]|\d+\.\s*/, '')) }} />
                      ))}
                    </ul>
                  );
                }
                return <p key={pIdx} dangerouslySetInnerHTML={{ __html: formatInline(para) }} />;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-black/50 text-amber-300 font-mono px-1 py-0.5 rounded text-xs">$1</code>')
      .replace(/\$([^\$]+)\$/g, '<span class="font-serif italic text-amber-200">$1</span>');
    return formatted;
  };

  const quickPrompts = [
    { label: '📐 Explain Objective Eq.', prompt: 'Explain the primary mathematical objective and decomposition of terms in this paper.' },
    { label: '🧐 Strict Reviewer Critique', prompt: 'Critique this preprint from the perspective of an ICML/NeurIPS Area Chair and identify 3 potential rejection reasons.' },
    { label: '⚖️ Boost Rigor to 9.5+', prompt: 'What concrete mathematical lemmas or ablations are required to elevate the Technical Rigor score?' },
    { label: '📝 Draft Rebuttal', prompt: 'Draft a formal author rebuttal addressing reviewer questions about empirical baselines and computational overhead.' },
    { label: '📚 Suggest Citations', prompt: 'What related works and foundational arXiv papers should be added to Section 2?' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Top Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white tracking-wide flex items-center space-x-1.5">
                  <span>Singularity Research Copilot</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center space-x-2 mt-0.5">
                <span className="truncate max-w-[280px] sm:max-w-md text-neutral-300">
                  {publication ? `arXiv:${publication.arxivId} • "${publication.title}"` : 'Preprint Context Loaded'}
                </span>
                {rubricReview && (
                  <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    ★ {rubricReview.recommendation.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetChat}
              title="Reset Conversation"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Persona Switcher & Context Bar */}
        <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Persona selector */}
          <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 px-2 font-mono text-[11px]">Mode:</span>
            <button
              onClick={() => setPersona('co-author')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors ${
                persona === 'co-author' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Co-Author</span>
            </button>
            <button
              onClick={() => setPersona('reviewer')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors ${
                persona === 'reviewer' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Meta-Reviewer</span>
            </button>
            <button
              onClick={() => setPersona('mathematician')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors ${
                persona === 'mathematician' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-medium' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sigma className="w-3.5 h-3.5" />
              <span>Mathematician</span>
            </button>
          </div>

          {/* Context toggle */}
          <button
            onClick={() => setShowContextDetails(!showContextDetails)}
            className="flex items-center space-x-1 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Active Preprint Context</span>
            {showContextDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Context Inspection Tray */}
        {showContextDetails && (
          <div className="px-4 py-3 bg-black/40 border-b border-neutral-800 text-xs text-neutral-300 max-h-36 overflow-y-auto space-y-1.5 font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>PI: Bheemaiah (IIT Madras Alumni)</span>
              <span>arXiv ID: {publication?.arxivId || '2603.04891'} v{publication?.version || 1}</span>
            </div>
            <div className="text-amber-400/90 truncate">
              Theorem: {publication?.solution?.theoreticalGuarantees?.[0] || 'Asymptotic bound O(1/√T)'}
            </div>
            <div className="text-neutral-400 truncate">
              Objective: {publication?.problemStatement?.mathematicalFormulation || 'min L(θ)'}
            </div>
            {rubricReview && rubricReview.dimensions && (
              <div className="flex flex-wrap gap-2 text-[10px] text-emerald-400 pt-1">
                <span>Nov: {rubricReview.dimensions.novelty?.score}/5</span>
                <span>Rig: {rubricReview.dimensions.technicalRigor?.score}/5</span>
                <span>Meth: {rubricReview.dimensions.methodologicalSoundness?.score}/5</span>
                <span>Sig: {rubricReview.dimensions.empiricalSignificance?.score}/5</span>
                <span>Cla: {rubricReview.dimensions.expositionClarity?.score}/5</span>
              </div>
            )}
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    {msg.persona === 'reviewer' ? (
                      <Scale className="w-4 h-4 text-purple-400" />
                    ) : msg.persona === 'mathematician' ? (
                      <Sigma className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 border relative group transition-all ${
                    isModel
                      ? 'bg-neutral-950/70 border-neutral-800 text-neutral-100 shadow-md'
                      : 'bg-amber-600/15 border-amber-500/30 text-amber-50'
                  }`}
                >
                  {/* Meta bar */}
                  <div className="flex items-center justify-between mb-2 text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300 flex items-center space-x-1.5">
                      {isModel ? (
                        <>
                          <span className="text-amber-400">Copilot</span>
                          {msg.persona && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 uppercase">
                              {msg.persona}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-neutral-300">You (Author)</span>
                      )}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity p-0.5"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-neutral-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  {renderMessageContent(msg.content)}
                </div>

                {!isModel && (
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-400 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-mono text-neutral-300 ml-2">
                  Gemini analyzing preprint formulation under {persona} lens...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="px-4 py-2 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-neutral-500 shrink-0">Quick Prompts:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              disabled={isLoading}
              className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 hover:text-white border border-neutral-700 transition-all disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950">
          <div className="relative flex items-center">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={2}
              placeholder={`Ask Gemini about equations, lemmas, proofs, or reviewer rebuttals... (Shift+Enter for newline)`}
              className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl px-4 py-2.5 pr-24 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 resize-none"
            />
            <div className="absolute right-2.5 bottom-2.5 flex items-center space-x-2">
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 px-1">
            <span>Powered by Gemini 3.8 Flash • Context-grounded in preprint state</span>
            <span>PI: Bheemaiah (IIT Madras Alumni)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
