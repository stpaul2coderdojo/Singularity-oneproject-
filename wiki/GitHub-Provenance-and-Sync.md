# 🔄 GitHub Provenance Engine & Automated Sync Protocol

[← Back to Wiki Home](./Home.md) • [System Architecture](./System-Architecture.md) • [Live App](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app)

---

## 📦 Provenance Storage Architecture

Every synthesized arXiv preprint and human peer review is committed directly to the target GitHub repository (`stpaul2coderdojo/Singularity-1` or user-configured repository) to ensure open, immutable scientific provenance.

```
repository-root/
├── papers/
│   └── [arxivId]/
│       ├── README.md        # Media-rich markdown with badges & live links
│       ├── paper.tex        # LaTeX source with KaTeX equations
│       ├── paper.bib        # BibTeX academic citations
│       └── metadata.json    # Complete agent telemetry & generation state
├── reviews/
│   └── [arxivId]_review.md  # 6-D rubric scores & RLHF directives
├── wiki/
│   ├── Home.md              # Wiki homepage with deployment table
│   ├── System-Architecture.md
│   ├── RLHF-Rubric-v2.4.md
│   ├── Gemini-Research-Copilot.md
│   ├── Authorship-and-Affiliations.md
│   └── assets/              # Architecture flowchart & rubric radar SVGs
├── README.md                # Primary repository landing page
└── AUTHORS.md               # Bheemaiah (IIT Madras Alumni) credentials
```

---

## 🔐 OAuth 2.0 & Token Authentication

Singularity-1 supports dual authentication mechanisms:
1. **GitHub Personal Access Token (PAT)**: Direct fine-grained or classic token with `repo` scope.
2. **Interactive OAuth 2.0 Flow**:
   - Client initiates flow: `/api/github/oauth/start`
   - Secure centered popup opens `https://github.com/login/oauth/authorize`
   - Callback handled by `/auth/callback`
   - Transmits token to parent window via `postMessage` protocol adhering to AI Studio sandboxing guidelines.

---

## 🚀 Wiki Synchronization Endpoint

The server provides dedicated endpoints to synchronize the media-rich wiki and diagrams:
- `POST /api/github/sync-wiki`: Commits all `wiki/*.md` and `wiki/assets/*.svg` files into the GitHub repository with a single call.
- `POST /api/github/log-paper`: Automatically updates papers, reviews, root `README.md`, `AUTHORS.md`, and wiki files.
