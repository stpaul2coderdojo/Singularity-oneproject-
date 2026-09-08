# 💬 Singularity-1 Context-Aware Gemini Research Copilot

[← Back to Wiki Home](./Home.md) • [System Architecture](./System-Architecture.md) • [Live App](https://ais-pre-67bjrhkutnv3a34zametcr-219346993343.asia-southeast1.run.app)

---

## 🧠 Overview

The **Singularity-1 AI Research Copilot** is a real-time, context-aware interactive agent powered by Google DeepMind's **Gemini 3.8 Flash** (`gemini-3.8-flash`). Unlike generic LLM chat interfaces, the Copilot dynamically binds to:

1. **Active Preprint State**: Title, abstract, full IMRaD sections, mathematical equations (KaTeX), theorems, proofs, and BibTeX citations.
2. **Human Rubric Evaluations**: Real-time scores across the 6 peer-review dimensions (Novelty, Rigor, Empirical Significance, Clarity, Reproducibility, Ethics).
3. **Academic Pedigree**: Principal Investigator **Bheemaiah** (IIT Madras Alumni, `bheemaiah@alumni.iitm.ac.in`) and the Google Antigravity Agent Collective.
4. **Historical RLHF Iterations**: Track record of version changes ($v_1 \to v_2$) and reviewer directives.

---

## 🎭 Operating Personas & Modes

Users can seamlessly switch between three specialized academic personas:

### 1. 🎓 Research Co-Author (Default)
- **Objective**: Constructive technical advice, formulation improvements, identifying missed citations, and polishing academic arguments.
- **Sample Query**: *"How can we strengthen the intuition behind our Theorem 1 convergence proof?"*

### 2. 🧐 Hostile Conference Reviewer
- **Objective**: Simulates a skeptical, rigorous NeurIPS/ICML reviewer. Points out hidden assumptions, baseline deficiencies, and potential counter-examples.
- **Sample Query**: *"Critique our empirical methodology and identify three reasons to reject this paper."*

### 3. 📐 Formal Mathematician
- **Objective**: Step-by-step KaTeX derivation breakdown, checking dimensional consistency, and verifying asymptotic Big-O bounds.
- **Sample Query**: *"Walk me through the proof of the sub-quadratic bound in Equation (4)."*

---

## ⚡ Quick-Action Prompt Chips

The copilot provides one-tap prompt chips for rapid paper exploration:
- 📐 **"Explain Equation (1)"**: Generates an intuitive breakdown of the primary objective function.
- 🔬 **"Critique Methodology"**: Surfaces vulnerabilities in experimental design.
- ⚖️ **"Boost Rigor Score"**: Outlines exact proofs or lemmas needed to raise Technical Rigor.
- 📝 **"Draft Author Rebuttal"**: Generates a respectful, point-by-point rebuttal to reviewer critiques.
- 📚 **"Suggest Literature"**: Recommends seminal and recent papers to cite.

---

## 🔒 Security & Server-Side Execution

In accordance with enterprise AI security standards:
- The Gemini API is called **strictly server-side** via `@google/genai` in `server.ts`.
- The `GEMINI_API_KEY` is never transmitted to the browser.
- Full context injection happens on the backend proxy with structured system prompts.
