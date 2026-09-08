import fs from 'fs';
import path from 'path';
import { ArXivPublication, HumanReviewRubric, GitHubLogEntry, GitHubConfig, GitHubUser } from '../src/types';

// In-memory state for GitHub configuration and log history
let activeOAuthToken: string | null = null;
let targetOwner: string = process.env.GITHUB_OWNER || '';
let targetRepo: string = process.env.GITHUB_REPO || 'singularity-preprints';
let targetBranch: string = 'main';
let autoLogPapers: boolean = true;
let autoLogReviews: boolean = true;

const gitHubLogHistory: GitHubLogEntry[] = [];

/**
 * Returns the effective GitHub token (from OAuth session or GITHUB_TOKEN environment variable)
 */
export function getEffectiveToken(): string | null {
  return activeOAuthToken || process.env.GITHUB_TOKEN || null;
}

export function setActiveOAuthToken(token: string | null) {
  activeOAuthToken = token;
}

export function getGitHubConfig(): GitHubConfig {
  const token = getEffectiveToken();
  const authMethod: 'oauth' | 'token' | 'env' | undefined = activeOAuthToken
    ? 'oauth'
    : process.env.GITHUB_TOKEN
    ? 'env'
    : undefined;

  const appUrl = process.env.APP_URL || 'https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app';
  const callbackUrl = `${appUrl.replace(/\/$/, '')}/auth/callback`;

  return {
    connected: !!token,
    authMethod,
    owner: targetOwner,
    repo: targetRepo,
    branch: targetBranch,
    user: null, // Populated asynchronously when requested
    autoLogPapers,
    autoLogReviews,
    isConfiguredInEnv: !!process.env.GITHUB_TOKEN,
    hasOAuthApp: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    authCallbackUrl: callbackUrl
  };
}

export function updateGitHubConfig(params: {
  owner?: string;
  repo?: string;
  branch?: string;
  autoLogPapers?: boolean;
  autoLogReviews?: boolean;
}) {
  if (params.owner !== undefined) targetOwner = params.owner.trim();
  if (params.repo !== undefined) targetRepo = params.repo.trim();
  if (params.branch !== undefined) targetBranch = params.branch.trim() || 'main';
  if (params.autoLogPapers !== undefined) autoLogPapers = params.autoLogPapers;
  if (params.autoLogReviews !== undefined) autoLogReviews = params.autoLogReviews;
}

export function getLogHistory(): GitHubLogEntry[] {
  return [...gitHubLogHistory];
}

/**
 * Fetches authenticated user info from GitHub
 */
export async function fetchGitHubUser(token: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Singularity-1-Agent'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      login: data.login,
      avatar_url: data.avatar_url,
      name: data.name || data.login,
      html_url: data.html_url
    };
  } catch (err) {
    console.error('Failed to fetch GitHub user:', err);
    return null;
  }
}

/**
 * Exchange OAuth temporary code for Access Token
 */
export async function exchangeOAuthCode(code: string, redirectUri: string): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing from environment.');
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub OAuth token exchange failed: ${text}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`OAuth error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

/**
 * Helper to upload or update a file in a GitHub repository
 */
async function putFileToGitHub(
  owner: string,
  repo: string,
  filePath: string,
  contentStr: string,
  commitMessage: string,
  branch: string,
  token: string
): Promise<{ sha: string; html_url: string }> {
  // Check for existing file SHA to allow updates
  let existingSha: string | undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Singularity-1-Agent'
        }
      }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      existingSha = data.sha;
    }
  } catch (e) {
    // file doesn't exist yet
  }

  const base64Content = Buffer.from(contentStr, 'utf-8').toString('base64');
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Singularity-1-Agent'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch,
        ...(existingSha ? { sha: existingSha } : {})
      })
    }
  );

  if (!putRes.ok) {
    const errorText = await putRes.text();
    throw new Error(`GitHub API Error (${putRes.status}): ${errorText}`);
  }

  const result = await putRes.json();
  return {
    sha: result.commit?.sha || result.content?.sha || 'committed',
    html_url: result.commit?.html_url || `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`
  };
}

/**
 * Format publication into academic Markdown document
 */
export function formatPublicationMarkdown(publication: ArXivPublication): string {
  const authorNames = publication.authors.map(a => `${a.name} (${a.affiliation})`).join('  \n');
  const categories = [publication.primaryCategory, ...(publication.secondaryCategories || [])].join(', ');
  const demoUrl = 'https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app';

  let md = `<div align="center">\n\n`;
  md += `# ${publication.title}\n\n`;
  md += `[![Live Cloud Demo](https://img.shields.io/badge/⚡_Live_Cloud_Demo-Google_Cloud_Run-amber?style=for-the-badge&logo=googlecloud&logoColor=white)](${demoUrl})\n`;
  md += `[![arXiv](https://img.shields.io/badge/arXiv-${publication.arxivId.replace(/ /g, '_')}-b31b1b?style=for-the-badge&logo=arxiv&logoColor=white)](https://arxiv.org)\n`;
  md += `[![Agentic Engine](https://img.shields.io/badge/Google_Antigravity-RLHF_v2.4-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)\n`;
  md += `[![License](https://img.shields.io/badge/License-CC_BY_4.0-emerald?style=for-the-badge)](https://creativecommons.org/licenses/by/4.0/)\n\n`;
  md += `**[👉 Explore Live Interactive App & PDF Generator](${demoUrl})**\n\n`;
  md += `</div>\n\n---\n\n`;

  md += `### 🏛️ Authorship & Research Group\n\n`;
  md += `- **Principal Investigator & Architect:** **Bheemaiah** ([bheemaiah@alumni.iitm.ac.in](mailto:bheemaiah@alumni.iitm.ac.in))\n`;
  md += `- **Academic Affiliation:** **Indian Institute of Technology Madras (IIT Madras) Alumni**\n`;
  md += `- **Open Science Initiative:** **St. Paul CoderDojo / Singularity-1**\n`;
  md += `- **Co-Authors (Antigravity Multi-Agent Collective):**\n${publication.authors.map(a => `  - ${a.name} *(${a.affiliation})*`).join('\n')}\n\n`;

  md += `---\n\n`;
  md += `### 📋 Metadata & Provenance\n\n`;
  md += `| Field | Value |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **arXiv Identifier** | \`${publication.arxivId}\` |\n`;
  md += `| **Primary Category** | \`${publication.primaryCategory}\` |\n`;
  md += `| **All Categories** | ${categories} |\n`;
  md += `| **Preprint Version** | \`v${publication.version}\` |\n`;
  md += `| **Submission Date** | ${publication.submittedDate} |\n`;
  md += `| **License** | ${publication.license || 'CC BY 4.0'} |\n`;
  md += `| **Live Cloud Demo** | [${demoUrl}](${demoUrl}) |\n\n`;

  md += `---\n\n`;
  md += `## Abstract\n\n${publication.abstract}\n\n`;
  md += `---\n\n`;

  for (const section of publication.sections) {
    md += `## ${section.number}. ${section.title}\n\n`;
    md += `${section.content}\n\n`;

    if (section.equations && section.equations.length > 0) {
      md += `### Formulated Equations\n\n`;
      section.equations.forEach((eq, idx) => {
        md += `$$\n${eq}\n$$  \n*Equation (${section.number}.${idx + 1})*\n\n`;
      });
    }
  }

  if (publication.references && publication.references.length > 0) {
    md += `## References\n\n`;
    publication.references.forEach((ref, idx) => {
      md += `[${idx + 1}] ${ref.authors}. *${ref.title}*. **${ref.venue}** (${ref.year})${ref.arxivId ? ` [${ref.arxivId}]` : ''}.\n\n`;
    });
  }

  if (publication.telemetry) {
    md += `---\n\n`;
    md += `## 🤖 Agentic Provenance Telemetry\n\n`;
    md += `- **Synthesis Model:** \`${publication.telemetry.model}\`\n`;
    md += `- **Execution Time:** ${publication.telemetry.totalExecutionTimeMs} ms\n`;
    md += `- **Pipeline Agents:** ${publication.telemetry.antigravityAgentPipeline.join(' → ')}\n`;
    md += `- **Lead Investigator:** Bheemaiah (\`bheemaiah@alumni.iitm.ac.in\`, IIT Madras Alumni)\n`;
  }

  return md;
}

/**
 * Format Human Rubric Review into Markdown document
 */
export function formatReviewMarkdown(publication: ArXivPublication, review: HumanReviewRubric): string {
  const demoUrl = 'https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app';
  let md = `<div align="center">\n\n`;
  md += `# ⚖️ Peer Review & RLHF Rubric: ${publication.arxivId}\n\n`;
  md += `[![Live Cloud Demo](https://img.shields.io/badge/⚡_Live_Cloud_Demo-Google_Cloud_Run-amber?style=for-the-badge&logo=googlecloud&logoColor=white)](${demoUrl})\n`;
  md += `[![Rubric Score](https://img.shields.io/badge/Composite_Score-${review.weightedScore.toFixed(2)}_/_5.00-emerald?style=for-the-badge)](https://arxiv.org)\n`;
  md += `[![Decision](https://img.shields.io/badge/Decision-${review.recommendation.toUpperCase().replace(/_/g, '_')}-purple?style=for-the-badge)](https://arxiv.org)\n\n`;
  md += `</div>\n\n---\n\n`;

  md += `### 🏛️ Evaluation Authorship & Context\n\n`;
  md += `- **Lead Researcher / PI:** **Bheemaiah** ([bheemaiah@alumni.iitm.ac.in](mailto:bheemaiah@alumni.iitm.ac.in)), IIT Madras Alumni\n`;
  md += `- **Reviewer Alias:** \`${review.reviewerAlias}\` (Field Expertise: ${review.reviewerExpertise}/5)\n`;
  md += `- **Paper Title:** *${publication.title}*\n`;
  md += `- **Evaluated Version:** \`v${publication.version}\`\n`;
  md += `- **Evaluation Date:** ${review.submittedAt}\n`;
  md += `- **Live Applet:** [${demoUrl}](${demoUrl})\n\n`;

  md += `---\n\n`;
  md += `## Dimensional Rubric Evaluations\n\n`;
  md += `| Evaluation Dimension | Weight | Score | Reviewer Critique |\n`;
  md += `| :--- | :---: | :---: | :--- |\n`;

  Object.values(review.dimensions).forEach(dim => {
    md += `| **${dim.name}** | ${(dim.weight * 100).toFixed(0)}% | **${dim.score} / 5** | ${dim.critique || 'Meets standard'} |\n`;
  });

  md += `\n---\n\n`;
  md += `## Qualitative Feedback\n\n`;
  md += `### Strengths\n${review.qualitativeCritique.strengthsSummary || 'None noted.'}\n\n`;
  md += `### Weaknesses\n${review.qualitativeCritique.weaknessesSummary || 'None noted.'}\n\n`;
  md += `### Inquiries for Authors\n${review.qualitativeCritique.questionsForAuthors || 'None.'}\n\n`;
  md += `### Actionable Directives for RLHF Alignment\n${review.qualitativeCritique.actionableDirectivesForRLHF || 'None.'}\n\n`;

  return md;
}

/**
 * Log publication preprint to GitHub repository
 */
export async function logPaperToGitHub(
  publication: ArXivPublication,
  repoOverride?: { owner?: string; repo?: string }
): Promise<GitHubLogEntry> {
  const token = getEffectiveToken();
  let owner = (repoOverride?.owner || targetOwner).trim();
  let repo = (repoOverride?.repo || targetRepo).trim();

  // If owner is not provided, try to resolve from user info if token exists
  if (!owner && token) {
    const user = await fetchGitHubUser(token);
    if (user?.login) {
      owner = user.login;
      targetOwner = user.login;
    }
  }

  const arxivSlug = publication.arxivId.replace(/[^a-zA-Z0-9.-]/g, '_');
  const paperDir = `papers/${arxivSlug}`;
  const files = [
    `${paperDir}/README.md`,
    `${paperDir}/paper.tex`,
    `${paperDir}/paper.bib`,
    `${paperDir}/metadata.json`
  ];

  const now = new Date().toISOString();
  const title = publication.title;

  if (!token || !owner || !repo) {
    // Staged / Simulated commit log entry when unconfigured
    const simulatedSha = 'staged-' + Math.random().toString(16).substring(2, 10);
    const entry: GitHubLogEntry = {
      id: 'log-' + Date.now(),
      type: 'paper',
      title,
      arxivId: publication.arxivId,
      version: publication.version,
      timestamp: now,
      commitSha: simulatedSha,
      commitUrl: `https://github.com/${owner || 'octocat'}/${repo || 'singularity-preprints'}/commit/${simulatedSha}`,
      files,
      status: 'pending',
      repo: `${owner || 'octocat'}/${repo || 'singularity-preprints'}`
    };
    gitHubLogHistory.unshift(entry);
    return entry;
  }

  try {
    const markdownContent = formatPublicationMarkdown(publication);
    const commitMsg = `[Preprint] Publish ${publication.arxivId}: ${publication.title.substring(0, 60)}...`;

    // 1. Commit README.md (Academic Markdown)
    const resReadme = await putFileToGitHub(
      owner,
      repo,
      `${paperDir}/README.md`,
      markdownContent,
      `${commitMsg} (Markdown)`,
      targetBranch,
      token
    );

    // 2. Commit paper.tex (LaTeX)
    if (publication.latexSource) {
      await putFileToGitHub(
        owner,
        repo,
        `${paperDir}/paper.tex`,
        publication.latexSource,
        `${commitMsg} (LaTeX Source)`,
        targetBranch,
        token
      );
    }

    // 3. Commit paper.bib (BibTeX)
    if (publication.bibtex) {
      await putFileToGitHub(
        owner,
        repo,
        `${paperDir}/paper.bib`,
        publication.bibtex,
        `${commitMsg} (BibTeX)`,
        targetBranch,
        token
      );
    }

    // 4. Commit metadata.json (Full JSON Schema)
    await putFileToGitHub(
      owner,
      repo,
      `${paperDir}/metadata.json`,
      JSON.stringify(publication, null, 2),
      `${commitMsg} (Metadata JSON)`,
      targetBranch,
      token
    );

    // 5. Commit repository root README.md & AUTHORS.md if available
    try {
      const rootReadmePath = path.join(process.cwd(), 'README.md');
      if (fs.existsSync(rootReadmePath)) {
        const rootReadmeContent = fs.readFileSync(rootReadmePath, 'utf-8');
        await putFileToGitHub(
          owner,
          repo,
          'README.md',
          rootReadmeContent,
          `[Docs] Update Singularity-1 documentation & visual website README`,
          targetBranch,
          token
        );
        files.push('README.md');
      }

      const authorsPath = path.join(process.cwd(), 'AUTHORS.md');
      if (fs.existsSync(authorsPath)) {
        const authorsContent = fs.readFileSync(authorsPath, 'utf-8');
        await putFileToGitHub(
          owner,
          repo,
          'AUTHORS.md',
          authorsContent,
          `[Authorship] Update Bheemaiah (IIT Madras Alumni) & Antigravity collective`,
          targetBranch,
          token
        );
        files.push('AUTHORS.md');
      }

      // Sync Wiki files & SVG visual diagrams
      const wikiDir = path.join(process.cwd(), 'wiki');
      if (fs.existsSync(wikiDir)) {
        const wikiHome = path.join(wikiDir, 'Home.md');
        if (fs.existsSync(wikiHome)) {
          await putFileToGitHub(
            owner,
            repo,
            'wiki/Home.md',
            fs.readFileSync(wikiHome, 'utf-8'),
            `[Wiki] Update Singularity-1 Wiki Home`,
            targetBranch,
            token
          );
          files.push('wiki/Home.md');
        }
      }
    } catch (docErr: any) {
      console.warn('Could not sync root documentation to GitHub:', docErr.message);
    }

    const entry: GitHubLogEntry = {
      id: 'log-' + Date.now(),
      type: 'paper',
      title,
      arxivId: publication.arxivId,
      version: publication.version,
      timestamp: now,
      commitSha: resReadme.sha,
      commitUrl: resReadme.html_url,
      files,
      status: 'success',
      repo: `${owner}/${repo}`
    };
    gitHubLogHistory.unshift(entry);
    return entry;
  } catch (err: any) {
    console.error('Error committing paper to GitHub:', err);
    const entry: GitHubLogEntry = {
      id: 'log-' + Date.now(),
      type: 'paper',
      title,
      arxivId: publication.arxivId,
      version: publication.version,
      timestamp: now,
      commitSha: 'failed',
      commitUrl: `https://github.com/${owner}/${repo}`,
      files,
      status: 'error',
      error: err.message,
      repo: `${owner}/${repo}`
    };
    gitHubLogHistory.unshift(entry);
    throw err;
  }
}

/**
 * Log human peer-review rubric to GitHub repository
 */
export async function logReviewToGitHub(
  publication: ArXivPublication,
  review: HumanReviewRubric,
  repoOverride?: { owner?: string; repo?: string }
): Promise<GitHubLogEntry> {
  const token = getEffectiveToken();
  let owner = (repoOverride?.owner || targetOwner).trim();
  let repo = (repoOverride?.repo || targetRepo).trim();

  if (!owner && token) {
    const user = await fetchGitHubUser(token);
    if (user?.login) {
      owner = user.login;
      targetOwner = user.login;
    }
  }

  const arxivSlug = publication.arxivId.replace(/[^a-zA-Z0-9.-]/g, '_');
  const reviewFileMd = `reviews/${arxivSlug}_v${publication.version}_review.md`;
  const reviewFileJson = `reviews/${arxivSlug}_v${publication.version}_review.json`;
  const files = [reviewFileMd, reviewFileJson];

  const now = new Date().toISOString();
  const title = `Human Rubric Evaluation for ${publication.arxivId} (Score: ${review.weightedScore.toFixed(2)}/5.00)`;

  if (!token || !owner || !repo) {
    const simulatedSha = 'staged-' + Math.random().toString(16).substring(2, 10);
    const entry: GitHubLogEntry = {
      id: 'log-' + Date.now(),
      type: 'review',
      title,
      arxivId: publication.arxivId,
      version: publication.version,
      timestamp: now,
      commitSha: simulatedSha,
      commitUrl: `https://github.com/${owner || 'octocat'}/${repo || 'singularity-preprints'}/commit/${simulatedSha}`,
      files,
      status: 'pending',
      repo: `${owner || 'octocat'}/${repo || 'singularity-preprints'}`
    };
    gitHubLogHistory.unshift(entry);
    return entry;
  }

  try {
    const markdownContent = formatReviewMarkdown(publication, review);
    const commitMsg = `[Review] ${review.recommendation.toUpperCase()} for ${publication.arxivId} v${publication.version} (Score: ${review.weightedScore.toFixed(2)}/5.00)`;

    // 1. Commit review markdown
    const resMd = await putFileToGitHub(
      owner,
      repo,
      reviewFileMd,
      markdownContent,
      commitMsg,
      targetBranch,
      token
    );

    // 2. Commit review json
    await putFileToGitHub(
      owner,
      repo,
      reviewFileJson,
      JSON.stringify(review, null, 2),
      `${commitMsg} (JSON Schema)`,
      targetBranch,
      token
    );

    const entry: GitHubLogEntry = {
      id: 'log-' + Date.now(),
      type: 'review',
      title,
      arxivId: publication.arxivId,
      version: publication.version,
      timestamp: now,
      commitSha: resMd.sha,
      commitUrl: resMd.html_url,
      files,
      status: 'success',
      repo: `${owner}/${repo}`
    };
    gitHubLogHistory.unshift(entry);
    return entry;
  } catch (err: any) {
    console.error('Error committing review to GitHub:', err);
    const entry: GitHubLogEntry = {
      id: 'log-' + Date.now(),
      type: 'review',
      title,
      arxivId: publication.arxivId,
      version: publication.version,
      timestamp: now,
      commitSha: 'failed',
      commitUrl: `https://github.com/${owner}/${repo}`,
      files,
      status: 'error',
      error: err.message,
      repo: `${owner}/${repo}`
    };
    gitHubLogHistory.unshift(entry);
    throw err;
  }
}

// 9. Sync Media-Rich Wiki & Visual SVG Assets to GitHub
export async function syncWikiToGitHub(repoOverride?: string): Promise<GitHubLogEntry> {
  const token = getEffectiveToken();
  if (!token) {
    throw new Error('No GitHub token configured. Authenticate with OAuth or add a Personal Access Token.');
  }

  const { owner, repo } = parseRepo(repoOverride || currentConfig.repo);
  const targetBranch = currentConfig.branch || 'main';
  const now = new Date().toISOString();
  const files: string[] = [];

  try {
    const wikiDir = path.join(process.cwd(), 'wiki');
    if (!fs.existsSync(wikiDir)) {
      throw new Error('Wiki directory does not exist on disk.');
    }

    function getFilesRecursively(dir: string, baseDir: string = ''): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const relPath = baseDir ? `${baseDir}/${file}` : file;
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(getFilesRecursively(fullPath, relPath));
        } else {
          results.push(relPath);
        }
      }
      return results;
    }

    const wikiFiles = getFilesRecursively(wikiDir);
    let lastSha = '';
    let lastUrl = `https://github.com/${owner}/${repo}/tree/${targetBranch}/wiki`;

    for (const relPath of wikiFiles) {
      const fullPath = path.join(wikiDir, relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const targetRepoPath = `wiki/${relPath}`;
      const res = await putFileToGitHub(
        owner,
        repo,
        targetRepoPath,
        content,
        `[Wiki & Media] Sync ${relPath} - Singularity-1 by Bheemaiah (IIT Madras Alumni)`,
        targetBranch,
        token
      );
      files.push(targetRepoPath);
      lastSha = res.sha;
      lastUrl = res.html_url;
    }

    const entry: GitHubLogEntry = {
      id: 'log-wiki-' + Date.now(),
      type: 'paper',
      title: 'Media-Rich Wiki & Visual Diagrams Synchronization',
      arxivId: 'WIKI-DOCS',
      version: 1,
      timestamp: now,
      commitSha: lastSha || 'synced',
      commitUrl: lastUrl,
      files,
      status: 'success',
      repo: `${owner}/${repo}`
    };
    gitHubLogHistory.unshift(entry);
    return entry;
  } catch (err: any) {
    console.error('Error syncing wiki to GitHub:', err);
    const entry: GitHubLogEntry = {
      id: 'log-wiki-' + Date.now(),
      type: 'paper',
      title: 'Media-Rich Wiki Synchronization',
      arxivId: 'WIKI-DOCS',
      version: 1,
      timestamp: now,
      commitSha: 'failed',
      commitUrl: `https://github.com/${owner}/${repo}`,
      files,
      status: 'error',
      error: err.message,
      repo: `${owner}/${repo}`
    };
    gitHubLogHistory.unshift(entry);
    throw err;
  }
}
