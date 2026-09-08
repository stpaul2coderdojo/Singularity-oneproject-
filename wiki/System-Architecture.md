# 🏛️ System Architecture & Google Antigravity Agentic Framework

[← Back to Wiki Home](./Home.md) • [Live Production App](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app)

---

## 🔬 Architectural Overview

**Singularity-1** implements a three-tier agentic architecture designed specifically for rigorous, mathematically sound arXiv preprint generation and human-guided reinforcement learning.

```
       ┌─────────────────────────────────────────────────────────┐
       │                 USER DIRECTIVE & DOMAIN                 │
       └───────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
       ┌─────────────────────────────────────────────────────────┐
       │          STAGE 1: PROBLEM FORMULATION AGENT             │
       │   • Literature Paradox Scan & Taxonomy Extraction       │
       │   • Formal Objective: min L(θ) s.t. Constraints         │
       └───────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
       ┌─────────────────────────────────────────────────────────┐
       │          STAGE 2: SOLUTION ARCHITECT AGENT              │
       │   • Algorithmic Paradigm & Complexity Bounds            │
       │   • Pareto Frontier Mapping & Theorem 1 Proof           │
       └───────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
       ┌─────────────────────────────────────────────────────────┐
       │         STAGE 3: PUBLICATION COMPOSER AGENT             │
       │   • Scholarly IMRaD Sections & KaTeX Formulas           │
       │   • BibTeX Generation & Dual-Column PDF Engine          │
       └───────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
    ┌───────────────────────────────────────────────────────────────┐
    │          HUMAN-IN-THE-LOOP RLHF RUBRIC ENGINE (v2.4)          │
    │   • 6 Calibrated Dimensions: Novelty, Rigor, Sig, Clarity...  │
    │   • Vector Reward R(x, y) ───► Triggers Revision v(k+1)       │
    └──────────────────────────────┬────────────────────────────────┘
                                   │
                                   ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                GITHUB PROVENANCE & WIKI SYNC                  │
    │   • papers/[arxivId]/README.md, paper.tex, paper.bib          │
    │   • reviews/[arxivId]_review.md                               │
    │   • wiki/ + visual SVG diagrams                               │
    └───────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent Roles & Capabilities

### 1. Problem Formulation Agent
- **Target arXiv Categories**: `cs.AI`, `cs.LG`, `quant-ph`, `stat.ML`, `cs.CR`
- **Primary Task**: Formulates non-trivial research bottlenecks. It queries deep literature assumptions and synthesizes an objective function:
$$\min_{\theta \in \Theta} \mathbb{E}_{x \sim \mathcal{D}} \left[ \mathcal{L}_{\text{task}}(f_\theta(x), y) + \lambda \Omega(\theta) \right]$$

### 2. Solution Architect Agent
- **Primary Task**: Constructs computational architectures, proves asymptotic bounds, and generates the theoretical guarantees for conference acceptance.
- **Key Artifacts**:
  - Algorithmic Pseudocode (LaTeX formatted)
  - Theorem 1 (Convergence Bounds: $\mathcal{O}(1/\sqrt{T})$)
  - Pareto Frontier Trade-offs (Accuracy vs. FLOPs / Inference Latency)

### 3. Publication Composer Agent
- **Primary Task**: Compiles the complete preprint into publication-grade IMRaD format (Introduction, Related Work, Problem Formulation, Methodological Framework, Theoretical Analysis, Empirical Verification, Discussion & Limitations, References).
- **Typesetting**: Native KaTeX equations with BibTeX citations.

---

## 🔄 Closed-Loop RLHF Feedback Protocol

When human reviewers grade a preprint using the in-app Rubric Modal, the feedback vector is mathematically converted into alignment directives:

$$\Delta \theta = \eta \nabla_\theta \left( \sum_{i=1}^6 w_i \cdot s_i(\text{preprint}) + \beta D_{\text{KL}}(\pi_{\theta} \,||\, \pi_{\text{base}}) \right)$$

The pipeline triggers a surgical refinement cycle:
1. Identifies underperforming dimensions (e.g. Rigor < 8.0/10).
2. Tightens mathematical proofs, adds ablations, and addresses reviewer critiques.
3. Increments version ($v_1 \to v_2$) and preserves evolutionary history.

---

> [!NOTE]
> All agent workflows are coordinated by Principal Investigator **Bheemaiah** (IIT Madras Alumni, `bheemaiah@alumni.iitm.ac.in`) under the **St. Paul CoderDojo / Singularity-1** project.
