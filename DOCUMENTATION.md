# 📖 Singularity-1 Technical Documentation

Welcome to the comprehensive technical documentation for **Singularity-1**, an autonomous multi-agent platform for arXiv preprint synthesis, LaTeX/KaTeX equation typesetting, human-in-the-loop RLHF rubric optimization, and automated GitHub provenance tracking.

---

## ⚡ Quick Navigation

1. [Live Cloud Demo & Hosted Endpoints](#1-live-cloud-demo--hosted-endpoints)
2. [Authorship & Academic Pedigree](#2-authorship--academic-pedigree)
3. [Agentic Synthesis Workflow](#3-agentic-synthesis-workflow)
4. [Human Review Rubric & RLHF Cycle](#4-human-review-rubric--rlhf-cycle)
5. [Mathematical & KaTeX Typesetting](#5-mathematical--katex-typesetting)
6. [Academic PDF Generator Engine](#6-academic-pdf-generator-engine)
7. [GitHub Synchronization & Audit Log](#7-github-synchronization--audit-log)
8. [Backend API Reference](#8-backend-api-reference)

---

## 1. Live Cloud Demo & Hosted Endpoints

The application is deployed on Google Cloud Run containers:

* **Production / Shared Web Application:**  
  👉 [`https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app`](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app)
* **Development & Staging Sandbox:**  
  👉 [`https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app`](https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app)

---

## 2. Authorship & Academic Pedigree

* **Principal Investigator:** **Bheemaiah**
* **Contact Email:** [`bheemaiah@alumni.iitm.ac.in`](mailto:bheemaiah@alumni.iitm.ac.in)
* **Affiliation:** **Indian Institute of Technology Madras (IIT Madras) Alumni**
* **Project Organization:** [St. Paul CoderDojo / Singularity-1](https://github.com/stpaul2coderdojo/Singularity-1)

---

## 3. Agentic Synthesis Workflow

The generation pipeline orchestrates three autonomous agents in sequence:

```
[User Input]
     │ (Domain, Category, Focus Topic, Custom Directives)
     ▼
┌──────────────────────────────────────┐
│  Problem Formulation Agent (PFA)     │
│  • Literature Taxonomy Scan          │
│  • Literature Gap Extraction         │
│  • Formal Math Formulation           │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│  Solution Architect Agent (SAA)      │
│  • Algorithmic Architecture Pipeline │
│  • Theoretical Bounds & Proofs       │
│  • Empirical Methodology & Baselines │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│  Publication Composer Agent (PCA)    │
│  • Sectional IMRaD Composition       │
│  • KaTeX Equation Typesetting        │
│  • BibTeX Citation Graph Matching    │
│  • Full LaTeX (.tex) Pre-compilation │
└──────────────────┬───────────────────┘
                   ▼
       [ArXiv Preprint Output (v1)]
```

---

## 4. Human Review Rubric & RLHF Cycle

Singularity-1 provides a human-in-the-loop Reinforcement Learning from Human Feedback (RLHF) loop adhering to arXiv conference standards:

### Evaluation Dimensions:
1. **Novelty & Originality** ($w_1 = 0.25$): Evaluates conceptual distance from established literature.
2. **Technical Rigor & Soundness** ($w_2 = 0.25$): Validates theorem proofs, mathematical consistency, and boundary constraints.
3. **Empirical Significance** ($w_3 = 0.20$): Evaluates theoretical benchmarks, Pareto efficiency, and ablation controls.
4. **Clarity & Scholarly Exposition** ($w_4 = 0.15$): Ensures formal academic prose, clear mathematical notation, and IMRaD coherence.
5. **Reproducibility & Open Science** ($w_5 = 0.10$): Evaluates pseudocode clarity, algorithmic complexity, and open access artifact availability.
6. **Ethics, Governance & Alignment** ($w_6 = 0.05$): Evaluates safety bounds, dual-use implications, and computational footprint.

### Reward Calculation:
$$R_{\text{composite}} = \sum_{k=1}^6 w_k \cdot \text{Score}_k$$

Upon submission, the platform:
1. Records the critique into the publication's `rlhfHistory` timeline.
2. Prompts the agent alignment model to resolve targeted reviewer critiques.
3. Automatically increments the preprint version ($v_1 \to v_2$).
4. Automatically commits the revised paper and the rubric review to GitHub.

---

## 5. Mathematical & KaTeX Typesetting

Equations in Singularity-1 are rendered client-side using KaTeX with academic typographic rules:

* **Inline Math:** Set inside `$ ... $` (e.g. `$O(d \cdot \log K)$`, `$\mathcal{L}_{\text{RLHF}}$`).
* **Display Formulas:** Set inside `$$ ... $$` with equation labels and formal LaTeX syntax:
  ```latex
  \min_{\theta} \; \mathbb{E}_{(\mathbf{x}, \mathbf{y}) \sim \mathcal{D}} \left[ -\sum_{k=1}^K w_k \log \sigma \left( S_k(\mathbf{x}, \mathbf{y}_w) - S_k(\mathbf{x}, \mathbf{y}_l) \right) \right]
  ```

---

## 6. Academic PDF Generator Engine

The built-in PDF generator (`src/utils/pdfGenerator.ts`) constructs publication-grade documents client-side using `jspdf` and `jspdf-autotable`:

* **Geometry & Margins:** Strict 18mm left/right margins, 20mm top/bottom.
* **Running Headers:** Left-aligned arXiv identifier (`arXiv:2603.04891v1 [cs.AI]`), right-aligned running title, and centered footer page numbering (`Page X of Y`).
* **Typography:** Academic serif display font hierarchy (`Times-Roman`), bold lead paragraphs, and formatted mathematical symbols.
* **Abstract Callout:** Centered, indented block with top and bottom bounding rules and bold abstract label.
* **Bibliography:** Formatted numbered citation list corresponding directly to in-text numerical citations (`[1]`, `[2]`).

---

## 7. GitHub Synchronization & Audit Log

The platform supports both 1-click OAuth authentication and Personal Access Tokens:

* **OAuth Endpoint:** `/api/auth/github/url` generates a secure authorization redirect URL.
* **Popup Flow:** Authentication executes in an isolated popup window, communicating completion back via `window.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, origin)` in accordance with platform security standards.
* **Committed File Structure:**
  ```
  repository-root/
  ├── papers/
  │   └── arXiv_2603_04891v1/
  │       ├── README.md       # Visual Markdown presentation
  │       ├── paper.tex       # Complete LaTeX document
  │       ├── paper.bib       # BibTeX bibliography
  │       └── metadata.json   # Telemetry & execution timings
  └── reviews/
      └── arXiv_2603_04891v1/
          ├── review.md       # Human rubric report
          └── review.json     # Machine-readable evaluation scores
  ```

---

## 8. Backend API Reference

| Route | Method | Payload / Parameters | Description |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | None | Service heartbeat, Gemini API status, and environment confirmation. |
| `/api/generate/end-to-end` | `POST` | `{ domainName, arxivCategory, focusTopic, customPrompt }` | Executes complete multi-agent pipeline and returns synthesized `ArXivPublication`. |
| `/api/rlhf/refine` | `POST` | `{ publication, reviewRubric }` | Executes human-directed RLHF refinement and yields next version ($v_{k+1}$). |
| `/api/github/status` | `GET` | None | Returns GitHub connection state, user info, target repository, and callback URLs. |
| `/api/github/config` | `POST` | `{ owner, repo, branch, autoLogPapers, autoLogReviews }` | Updates target repository configuration and automation toggles. |
| `/api/github/log-paper` | `POST` | `{ publication, repoOverride }` | Commits active publication files to the target repository. |
| `/api/github/logs` | `GET` | None | Returns history of committed artifacts and commit SHAs. |
| `/api/auth/github/url` | `GET` | None | Returns GitHub OAuth authorization URL. |
| `/auth/callback` | `GET` | `?code=...` | Handles OAuth token exchange and signals opener window. |

---

*Singularity-1 Documentation • Principal Investigator: Bheemaiah (IIT Madras Alumni) • St. Paul CoderDojo*
