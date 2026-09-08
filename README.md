<div align="center">

# 🌌 SINGULARITY-1
### Google Antigravity Multi-Agentic arXiv Publication & RLHF Rubric Synthesis Platform

[![Live Cloud Demo](https://img.shields.io/badge/⚡_Live_Cloud_Demo-Google_Cloud_Run-amber?style=for-the-badge&logo=googlecloud&logoColor=white)](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app)
[![arXiv Standards](https://img.shields.io/badge/arXiv_Rubric-v2.4_Certified-b31b1b?style=for-the-badge&logo=arxiv&logoColor=white)](https://arxiv.org)
[![Google DeepMind](https://img.shields.io/badge/Agent_Engine-Google_Antigravity_Gemini_3.8_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![GitHub License](https://img.shields.io/badge/License-Apache_2.0-emerald?style=for-the-badge)](LICENSE)

<br />

```
========================================================================================
  [Problem Formulation]  -->  [Solution Architect]  -->  [Publication Composer]
         |                           |                           |
         v                           v                           v
  Literature Gap Iso          Pareto Optimization         KaTeX & LaTeX Typesetting
                                                                 |
   +-------------------------------------------------------------+
   |
   v
[Human Review Rubric (RLHF)]  ===>  [Agentic Alignment Delta]  ===>  [Version Increment (v2...vn)]
   |                                                                          |
   +------------------> [GitHub Immutable Audit Sync] <-----------------------+
```

<p align="center">
  <b>An autonomous research copilot synthesizing verified, mathematically rigorous arXiv preprints with human-in-the-loop Reinforcement Learning from Human Feedback (RLHF), complete equation rendering, PDF generation, and automated GitHub provenance tracking.</b>
</p>

[🚀 Launch Cloud Application](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app) • [📖 System Architecture](#-system-architecture) • [🏛️ Authorship](#%EF%B8%8F-authorship--affiliation) • [📑 arXiv Rubric](#-human-rubric-rlhf-engine) • [💻 Local Setup](#-quickstart--installation)

---

</div>

## 🌐 Live Cloud Deployments

| Environment | Status | Endpoint URL | Description |
| :--- | :---: | :--- | :--- |
| **Production / Shared** | [![Online](https://img.shields.io/badge/status-active-emerald)](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app) | [`https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app`](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app) | High-availability Google Cloud Run production build with full KaTeX math typesetting, PDF export, and GitHub synchronization. |
| **Development Instance** | [![Online](https://img.shields.io/badge/status-active-sky)](https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app) | [`https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app`](https://ais-dev-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app) | Live interactive preview and testing server with instant synthesis and GitHub OAuth callback routes. |

> 💡 **One-Click Experience**: Click either link above to open the application directly in your browser. No local installation or manual API key configuration is required to read preprints, review rubrics, download academic PDFs, or explore agentic reasoning traces.

---

## 🏛️ Authorship & Academic Affiliation

### Principal Investigator & System Architect
* **Lead Researcher:** **Bheemaiah**
* **Primary Contact:** [`bheemaiah@alumni.iitm.ac.in`](mailto:bheemaiah@alumni.iitm.ac.in)
* **Academic Affiliation:** **Indian Institute of Technology Madras (IIT Madras) Alumni**
* **Research Initiative:** **St. Paul CoderDojo / Singularity-1 Open Science Collective**
* **Repository:** [`stpaul2coderdojo/Singularity-1`](https://github.com/stpaul2coderdojo/Singularity-1)

### Autonomous Agentic Co-Authors (Google Antigravity Collective)
* **Problem Formulation Agent (PFA):** Specializes in taxonomy scanning, citation graph isolation, and identifying mathematical inconsistencies in prior literature.
* **Solution Architect Agent (SAA):** Synthesizes algorithmic blueprints, theorem proofs, Pareto frontiers, and asymptotic computational bounds.
* **Publication Composer Agent (PCA):** Compiles IMRaD preprints, typesets KaTeX formulas, formats BibTeX citations, and structures raw LaTeX source.
* **Rubric Auditor & RLHF Alignment Engine:** Decomposes human peer-review evaluations into scalar rewards and parametric prompt modifiers for iterative preprint revisions ($v_1 \to v_2 \to \dots \to v_n$).

---

## ⚡ System Architecture

Singularity-1 translates exploratory scientific concepts into publication-grade preprints following the rigorous editorial norms of leading computer science conferences (NeurIPS, ICML, ICLR) and the arXiv repository (`cs.AI`, `cs.LG`, `quant-ph`, `stat.ML`).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SINGULARITY-1 ENGINE                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
         ┌────────────────────────────┴───────────────────────────┐
         ▼                                                        ▼
┌───────────────────────────────┐        ┌────────────────────────────────────┐
│   Agentic Synthesis Pipeline  │        │   Human Review & RLHF Refinement   │
├───────────────────────────────┤        ├────────────────────────────────────┤
│ 1. Problem Formulation Agent  │        │ 1. 6-Dimension Rubric Scoring      │
│    - Taxonomy Scan            │        │    (Novelty, Rigor, Significance,  │
│    - Paradox Isolation        │        │     Clarity, Reproducibility,      │
│ 2. Solution Architect Agent   │        │     Ethics & Governance)           │
│    - Algorithmic Pipeline     │        │ 2. Composite Weighted Reward ($R$) │
│    - Theorem Proving          │        │ 3. Actionable Directives Extraction│
│ 3. Publication Composer Agent │        │ 4. Next-Version Alignment Delta    │
│    - Sectional Composition    │        │    ($v_k \longrightarrow v_{k+1}$)│
│    - KaTeX / BibTeX Assembly  │        │                                    │
└───────────────┬───────────────┘        └─────────────────┬──────────────────┘
                │                                          │
                └─────────────────────┬────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXPORT & PROVENANCE LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Academic PDF Generator (jsPDF AutoTable, running headers, equations)     │
│  • KaTeX Interactive Formula Renderer (display and inline math)             │
│  • Compilable LaTeX (.tex) and BibTeX (.bib) source trees                   │
│  • GitHub Automated Provenance Logger (OAuth 2.0 / Token API commits)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Core Capabilities & Innovations

### 1. Vectorized Reinforcement Learning from Human Feedback (RLHF)
Standard LLM evaluation relies on uncalibrated conversational chat. Singularity-1 implements a formal **Rubrics-as-Rewards** decomposition:
$$R(\mathbf{x}, \mathbf{y}) = \sum_{k=1}^K w_k \cdot S_k(\mathbf{x}, \mathbf{y}) + \lambda \cdot \Psi_{\text{critique}}(\mathbf{y})$$
where $w_k$ denotes normalized dimensional importance weights, $S_k \in [1, 5]$ denotes scalar rubric scores, and $\Psi_{\text{critique}}$ encapsulates targeted qualitative revision directives.

### 2. Multi-Disciplinary Frontier Paradox Discovery
The platform includes built-in domain knowledge engines across premier scientific disciplines:
- **Artificial Intelligence & Alignment (`cs.AI`, `cs.LG`):** Multi-Agent Reward Hacking, Out-of-Distribution Robustness, Latent Representation Drift.
- **Quantum Machine Learning (`quant-ph`):** Barren Plateaus, Quantum Natural Gradients, Entanglement Entropy Bounds.
- **Federated Learning & Cryptography (`cs.CR`):** Byzantine Fault Tolerance, Differential Privacy in Asynchronous Topologies.
- **Autonomous Systems & Robotics (`cs.RO`):** Sim-to-Real Domain Adaptation, Stochastic Control Verification.

### 3. LaTeX, KaTeX & Academic PDF Generation
- **Mathematical Rendering:** Complete client-side KaTeX rendering of complex multi-line derivations, matrix equations, set notations, and integral bounds.
- **Native PDF Typesetter:** Custom academic layout generator utilizing `jspdf` and `jspdf-autotable` adhering to standard arXiv dual/single-column typography, title block, running headers, author superscripts, abstract callout box, section numeration, equation indexing, and formal bibliography.

### 4. GitHub Immutable Audit & Provenance Logging
Every synthesized paper and human rubric cycle can be synced to GitHub with a single click or through autonomous background webhooks:
- **`papers/arXiv-.../README.md`**: Web-ready Markdown presentation of the paper.
- **`papers/arXiv-.../paper.tex`**: Production-ready LaTeX document with math environments.
- **`papers/arXiv-.../paper.bib`**: BibTeX references with verified author and venue metadata.
- **`papers/arXiv-.../metadata.json`**: Telemetry metadata with agent timings, models, and timestamps.
- **`reviews/arXiv-.../review.md`**: Complete peer review report with score breakdown and critique.

---

## 📊 Human Review Rubric (v2.4 Specification)

The Singularity-1 platform evaluates all research under a calibrated 6-dimensional rubric:

| Dimension | Weight ($w_k$) | Description | Focus Criterion |
| :--- | :---: | :--- | :--- |
| **Novelty & Originality** | **25%** | Conceptual leap over prior art | Literature gap isolation, non-triviality of paradigm |
| **Technical Rigor & Soundness** | **25%** | Mathematical accuracy & proofs | Formal theorem proofs, convergence guarantees, boundary checks |
| **Empirical Significance** | **20%** | Practical benchmark impact | Asymptotic speedup, Pareto dominance, ablation clarity |
| **Clarity & Scholarly Exposition** | **15%** | IMRaD narrative structure | KaTeX equation formatting, clear notation tables, readability |
| **Reproducibility & Open Science** | **10%** | Algorithmic transparency | Pseudocode completeness, hyperparameter disclosures |
| **Ethics, Governance & Alignment** | **5%** | Societal impact & safety | Dual-use assessment, safe reward bounds, compute efficiency |

---

## 💻 Quickstart & Local Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Package Manager**: `npm`, `yarn`, or `bun`
* **Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone Repository
```bash
git clone https://github.com/stpaul2coderdojo/Singularity-1.git
cd Singularity-1
```

### 2. Configure Environment Variables
Copy `.env.example` and set your credentials:
```bash
cp .env.example .env
```

```env
# Google Gemini API Key (Server-side only)
GEMINI_API_KEY="your_gemini_api_key_here"

# GitHub OAuth Integration (Optional, for 1-click GitHub sync)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# GitHub Personal Access Token (Alternative to OAuth)
GITHUB_TOKEN="ghp_your_token_here"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Launch Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📑 Exemplar Benchmark Preprint

Singularity-1 includes a foundational exemplar paper pre-loaded in the platform:

```bibtex
@article{bheemaiah2026rubrics,
  title={Rubrics-as-Rewards: Closed-Loop Multi-Agent Synthesis of arXiv Publications via Vectorized Human Preference Alignment},
  author={Bheemaiah and {Singularity-1 Agent Collective}},
  journal={arXiv preprint arXiv:2603.04891v1 [cs.AI]},
  year={2026},
  url={https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app},
  institution={Indian Institute of Technology Madras Alumni, St. Paul CoderDojo}
}
```

---

## 🛡️ License & Acknowledgements

- **Source Code License:** [Apache License 2.0](LICENSE)
- **Preprint Distribution License:** Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/))
- **Core Technology:** Built on Google Antigravity Agentic Framework, Google DeepMind Gemini models, Vite, Tailwind CSS, KaTeX, and jsPDF.
- **Inquiries & Collaborations:** Contact **Bheemaiah** at `bheemaiah@alumni.iitm.ac.in`.

<div align="center">
  <sub>Engineered by Bheemaiah (IIT Madras Alumni) & the Singularity-1 Collective • St. Paul CoderDojo</sub>
</div>
