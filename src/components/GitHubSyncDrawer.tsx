import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  X, 
  RefreshCw, 
  Settings, 
  UploadCloud, 
  LogOut,
  FolderGit2,
  Check,
  ShieldCheck,
  Sparkles,
  Download,
  ArrowRight,
  Lock
} from 'lucide-react';
import { GitHubConfig, GitHubLogEntry, ArXivPublication } from '../types';

interface GitHubSyncDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPublication: ArXivPublication;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const GitHubSyncDrawer: React.FC<GitHubSyncDrawerProps> = ({
  isOpen,
  onClose,
  currentPublication,
  onShowToast
}) => {
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [logs, setLogs] = useState<GitHubLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingPaper, setIsLoggingPaper] = useState(false);

  // Form states for repo configuration
  const [ownerInput, setOwnerInput] = useState('');
  const [repoInput, setRepoInput] = useState('');
  const [branchInput, setBranchInput] = useState('main');
  const [autoLogPapers, setAutoLogPapers] = useState(true);
  const [autoLogReviews, setAutoLogReviews] = useState(true);

  // Full Codebase Push States
  const [codebaseToken, setCodebaseToken] = useState('');
  const [codebaseOwner, setCodebaseOwner] = useState('');
  const [codebaseRepo, setCodebaseRepo] = useState('singularity-oneproject');
  const [codebaseBranch, setCodebaseBranch] = useState('main');
  const [codebaseCommitMsg, setCodebaseCommitMsg] = useState('feat: Singularity-1 production release by Dr. Bheemaiah Anil K., Synergy Robotics');
  const [isPushingCodebase, setIsPushingCodebase] = useState(false);
  const [codebasePushResult, setCodebasePushResult] = useState<{ repoUrl: string; branch: string; message: string } | null>(null);
  const [codebasePushError, setCodebasePushError] = useState<string | null>(null);

  const fetchStatusAndLogs = async () => {
    try {
      setIsLoading(true);
      const [statusRes, logsRes] = await Promise.all([
        fetch('/api/github/status'),
        fetch('/api/github/logs')
      ]);

      if (statusRes.ok) {
        const statusData: GitHubConfig = await statusRes.json();
        setConfig(statusData);
        setOwnerInput(statusData.owner || (statusData.user?.login || ''));
        setRepoInput(statusData.repo || 'singularity-preprints');
        setBranchInput(statusData.branch || 'main');
        setAutoLogPapers(statusData.autoLogPapers);
        setAutoLogReviews(statusData.autoLogReviews);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Failed to load GitHub status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatusAndLogs();
    }
  }, [isOpen]);

  // Listen for popup OAuth messages according to oauth-integration guidelines
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onShowToast('GitHub account successfully connected via OAuth!', 'success');
        fetchStatusAndLogs();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectOAuth = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/github/url');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate GitHub authorization URL');
      }
      const { url } = await res.json();

      const authWindow = window.open(url, 'github_oauth_popup', 'width=640,height=750');
      if (!authWindow) {
        onShowToast('Popup was blocked by your browser. Please allow popups for this site.', 'error');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Could not initiate OAuth', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/github/disconnect', { method: 'POST' });
      onShowToast('GitHub session disconnected', 'info');
      fetchStatusAndLogs();
    } catch (err: any) {
      onShowToast('Failed to disconnect', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/github/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: ownerInput.trim(),
          repo: repoInput.trim(),
          branch: branchInput.trim(),
          autoLogPapers,
          autoLogReviews
        })
      });

      if (!res.ok) throw new Error('Failed to save config');
      const data = await res.json();
      setConfig(data.config);
      onShowToast('GitHub repository settings saved successfully!', 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualLogPaper = async () => {
    try {
      setIsLoggingPaper(true);
      const res = await fetch('/api/github/log-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publication: currentPublication,
          repoOverride: {
            owner: ownerInput,
            repo: repoInput
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to log paper to GitHub');
      }

      const data = await res.json();
      onShowToast(`Paper successfully logged to GitHub (${data.entry?.commitSha?.substring(0, 7)})!`, 'success');
      fetchStatusAndLogs();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to log paper', 'error');
    } finally {
      setIsLoggingPaper(false);
    }
  };

  const handlePushFullCodebase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushingCodebase(true);
    setCodebasePushResult(null);
    setCodebasePushError(null);

    const targetOwner = (codebaseOwner || ownerInput || config?.owner || config?.user?.login || '').trim();
    const targetRepo = (codebaseRepo || repoInput || 'singularity-oneproject').trim();

    if (!targetOwner || !targetRepo) {
      setCodebasePushError('Please specify both repository owner and repository name.');
      setIsPushingCodebase(false);
      return;
    }

    try {
      const res = await fetch('/api/github/push-full-codebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: codebaseToken.trim() || undefined,
          owner: targetOwner,
          repo: targetRepo,
          branch: codebaseBranch.trim() || 'main',
          commitMessage: codebaseCommitMsg.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to push codebase to GitHub');
      }

      setCodebasePushResult(data);
      onShowToast(`Successfully pushed codebase to ${data.repoUrl}!`, 'success');
      fetchStatusAndLogs();
    } catch (err: any) {
      setCodebasePushError(err.message || 'Push failed');
      onShowToast(err.message || 'Failed to push codebase', 'error');
    } finally {
      setIsPushingCodebase(false);
    }
  };

  if (!isOpen) return null;

  const repoPath = config?.owner && config?.repo ? `${config.owner}/${config.repo}` : `${ownerInput || 'owner'}/${repoInput || 'singularity-preprints'}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100 flex items-center space-x-2">
                <span>GitHub Provenance & Audit Log</span>
                {config?.connected && (
                  <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    <span>Connected</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-400">
                Log generated arXiv preprints, LaTeX source, BibTeX, and human RLHF reviews
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchStatusAndLogs}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 space-y-6 flex-1">
          {/* Connection Status Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">Connection State</div>
                {config?.connected ? (
                  <div className="flex items-center space-x-3 pt-1">
                    {config.user?.avatar_url ? (
                      <img 
                        src={config.user.avatar_url} 
                        alt={config.user.login} 
                        className="w-10 h-10 rounded-full border border-neutral-700" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-amber-400">
                        GH
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
                        <span>{config.user?.name || config.user?.login || 'Authenticated GitHub User'}</span>
                        <span className="text-xs text-neutral-500 font-mono">@{config.user?.login}</span>
                      </div>
                      <div className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorized via {config.authMethod === 'oauth' ? 'GitHub OAuth' : 'Environment Token'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Staging Mode (Local Git provenance active, ready to commit to GitHub)</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Connect your GitHub account or configure <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded">GITHUB_TOKEN</code> in AI Studio settings to publish live commits to your repositories.
                    </p>
                  </div>
                )}
              </div>

              {/* Connect / Disconnect Buttons */}
              <div>
                {config?.connected ? (
                  <button
                    onClick={handleDisconnect}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConnectOAuth}
                    disabled={isLoading}
                    className="text-xs font-medium px-4 py-2 rounded-lg bg-neutral-100 hover:bg-white text-neutral-950 shadow-sm transition-all flex items-center space-x-2"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Connect GitHub</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action: Log Current Paper */}
            <div className="pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-neutral-400">
                <span className="text-neutral-300 font-medium">Active Preprint: </span>
                <span className="font-mono text-amber-400">{currentPublication.arxivId}</span>
                <span className="text-neutral-500"> (v{currentPublication.version})</span>
              </div>

              <button
                onClick={handleManualLogPaper}
                disabled={isLoggingPaper}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center justify-center space-x-2"
              >
                {isLoggingPaper ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>Log Active Preprint to GitHub</span>
              </button>
            </div>
          </div>

          {/* Repository & Automation Configuration Form */}
          <form onSubmit={handleSaveConfig} className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-medium text-neutral-200">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Target Repository Configuration</span>
              </div>
              <a
                href={`https://github.com/${repoPath}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral-400 hover:text-amber-400 flex items-center space-x-1"
              >
                <span>github.com/{repoPath}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">GitHub Owner / Org</label>
                <input
                  type="text"
                  value={ownerInput}
                  onChange={e => setOwnerInput(e.target.value)}
                  placeholder={config?.user?.login || 'octocat'}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Repository Name</label>
                <input
                  type="text"
                  value={repoInput}
                  onChange={e => setRepoInput(e.target.value)}
                  placeholder="singularity-preprints"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Target Branch</label>
                <input
                  type="text"
                  value={branchInput}
                  onChange={e => setBranchInput(e.target.value)}
                  placeholder="main"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Automation Toggles */}
            <div className="pt-2 space-y-2.5">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={autoLogPapers}
                  onChange={e => setAutoLogPapers(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Automatically commit newly synthesized papers to GitHub</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={autoLogReviews}
                  onChange={e => setAutoLogReviews(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Automatically commit human rubric review evaluations (RLHF iterations) to GitHub</span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Full Codebase Export & Direct GitHub Push Card */}
          <div className="rounded-xl border border-amber-500/30 bg-neutral-950/70 p-5 space-y-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                  <span>Full Project Export & GitHub Push</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Directly push all 48 codebase files (Docker, Singularity, scripts, UI) to GitHub, or download an instant offline ZIP bundle.
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Direct Sync
              </span>
            </div>

            {/* Quick 1-Click ZIP Download */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-neutral-200 flex items-center space-x-1.5">
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Complete Codebase (.zip)</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Instant offline backup including Dockerfile, Singularity.def, server.ts, start.cjs, and documentation.
                </p>
              </div>
              <a
                href="/api/export/zip"
                download="singularity-oneproject.zip"
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold shrink-0 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP</span>
              </a>
            </div>

            {/* Direct Push Codebase to GitHub Form */}
            <form onSubmit={handlePushFullCodebase} className="space-y-3 pt-1">
              <div className="text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                <span>Push Full Repository to GitHub (1-Click)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Target Repository (owner/repo)</label>
                  <input
                    type="text"
                    value={codebaseRepo.includes('/') ? codebaseRepo : `${codebaseOwner || ownerInput || config?.owner || config?.user?.login || 'username'}/${codebaseRepo}`}
                    onChange={e => {
                      const val = e.target.value;
                      if (val.includes('/')) {
                        const [o, r] = val.split('/');
                        setCodebaseOwner(o.trim());
                        setCodebaseRepo(r.trim());
                      } else {
                        setCodebaseRepo(val);
                      }
                    }}
                    placeholder="bheemaiah/singularity-oneproject"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">Target Branch</label>
                  <input
                    type="text"
                    value={codebaseBranch}
                    onChange={e => setCodebaseBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-neutral-500" />
                    <span>GitHub Personal Access Token (PAT)</span>
                  </span>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Singularity-1-Direct-Push"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-amber-400 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Generate PAT (repo scope)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={codebaseToken}
                  onChange={e => setCodebaseToken(e.target.value)}
                  placeholder={config?.connected ? 'Using connected GitHub OAuth token (or paste PAT here)' : 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Commit Message</label>
                <input
                  type="text"
                  value={codebaseCommitMsg}
                  onChange={e => setCodebaseCommitMsg(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {codebasePushResult && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                  <div className="font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Codebase successfully pushed!</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Your entire repository has been deployed to GitHub branch <code className="text-emerald-400 font-mono">{codebasePushResult.branch}</code>.
                  </p>
                  <a
                    href={codebasePushResult.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-400 underline hover:text-emerald-300 font-mono text-[11px] pt-1"
                  >
                    <span>View Repository on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {codebasePushError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-medium">Push Failed</div>
                    <p className="text-[11px] text-red-300/90 leading-relaxed font-mono">{codebasePushError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPushingCodebase}
                className="w-full text-xs font-semibold py-2.5 px-4 rounded-lg bg-neutral-100 hover:bg-white text-neutral-950 transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                {isPushingCodebase ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Committing & Pushing All Files to GitHub...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Push Entire Repository to GitHub</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* GitHub Commit Audit Log Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center space-x-2">
                <GitCommit className="w-4 h-4 text-amber-400" />
                <span>Logged Artifacts & Commit History ({logs.length})</span>
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">
                {logs.filter(l => l.status === 'success').length} verified commits
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-8 text-center space-y-3">
                <FolderGit2 className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">No papers or reviews have been logged yet.</p>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  Click "Log Active Preprint to GitHub" above or enable auto-logging to record papers and reviews.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2.5 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                            log.type === 'paper' 
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {log.type === 'paper' ? 'Preprint' : 'Human Review'}
                          </span>
                          <span className="text-xs font-mono text-neutral-300 font-medium">
                            {log.arxivId}
                          </span>
                          {log.version && (
                            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
                              v{log.version}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-200 font-medium line-clamp-1">
                          {log.title}
                        </p>
                      </div>

                      {/* Commit SHA link */}
                      <a
                        href={log.commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1 text-[11px] font-mono text-amber-400 hover:underline bg-neutral-900 px-2 py-1 rounded border border-neutral-800 shrink-0"
                      >
                        <GitCommit className="w-3 h-3" />
                        <span>{log.commitSha?.substring(0, 7) || 'committed'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    {/* Files list */}
                    <div className="pt-2 border-t border-neutral-900 flex flex-wrap gap-1.5">
                      {log.files?.map((file, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 text-[10px] font-mono text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800/80"
                        >
                          <FileText className="w-2.5 h-2.5 text-neutral-500" />
                          <span>{file.split('/').pop()}</span>
                        </span>
                      ))}
                    </div>

                    {/* Footer metadata */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <span>Repo: {log.repo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuration Guide for GitHub OAuth App */}
          <div className="rounded-xl border border-neutral-800/70 bg-neutral-950/30 p-4 space-y-2 text-xs text-neutral-400">
            <div className="flex items-center space-x-2 text-neutral-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>OAuth & Environment Configuration Guide</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              To enable 1-click GitHub authentication, configure these environment variables in your AI Studio settings:
            </p>
            <div className="bg-neutral-900/90 rounded-lg p-3 font-mono text-[11px] space-y-1 text-neutral-300 border border-neutral-800">
              <div><span className="text-amber-400">GITHUB_CLIENT_ID</span>=&quot;your_github_oauth_client_id&quot;</div>
              <div><span className="text-amber-400">GITHUB_CLIENT_SECRET</span>=&quot;your_github_oauth_client_secret&quot;</div>
              <div><span className="text-amber-400">GITHUB_TOKEN</span>=&quot;ghp_...&quot; (optional alternative to OAuth)</div>
            </div>
            <div className="text-[11px] space-y-1 pt-1">
              <div>OAuth Authorization Callback URL:</div>
              <code className="text-sky-300 bg-neutral-900 px-2 py-0.5 rounded block truncate select-all">
                {config?.authCallbackUrl || 'https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app/auth/callback'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
